'use server';

import { requireAuth, requirePermission } from '@/platform/lib/guards';
import { writeAuditEntry } from '@/platform/lib/audit';
import { type Result, Ok, Err } from '@/platform/lib/result';
import { getDb } from '@/platform/db/client';

// ── Types ──────────────────────────────────────────────────────────

export interface WorkspaceQuota {
  userId: string;
  email: string;
  name: string | null;
  quotas: {
    skillLimit: number;
    skillsUsed: number;
    schemaLimit: number;
    schemasUsed: number;
    storageLimitBytes: number;
    storageUsedBytes: number;
  };
}

// ── Fetch own workspace ────────────────────────────────────────────

export async function fetchMyWorkspace(): Promise<Result<WorkspaceQuota, Error>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;

  try {
    return Ok(await getWorkspaceForUser(auth.value.userId));
  } catch (err) {
    console.error('[workspace] fetchMyWorkspace failed:', err);
    return Err(new Error('Failed to load workspace'));
  }
}

// ── Fetch all workspaces (admin) ───────────────────────────────────

export async function fetchAllWorkspaces(): Promise<Result<WorkspaceQuota[], Error>> {
  const auth = await requirePermission('workspace:view');
  if (!auth.ok) return auth;

  try {
    const { users } = await import('@/platform/db/schema');
    const db = getDb();

    const allUsers = await db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users);

    const workspaces = await Promise.all(
      allUsers.map((u) => getWorkspaceForUser(u.id)),
    );

    console.info('[workspace] fetched all workspaces', { count: workspaces.length });
    return Ok(workspaces);
  } catch (err) {
    console.error('[workspace] fetchAllWorkspaces failed:', err);
    return Err(new Error('Failed to load workspaces'));
  }
}

// ── Update quotas (admin) ──────────────────────────────────────────

interface UpdateQuotasInput {
  userId: string;
  skillLimit?: number;
  schemaLimit?: number;
  storageLimitBytes?: number;
}

export async function updateQuotas(input: UpdateQuotasInput): Promise<Result<WorkspaceQuota, Error>> {
  const auth = await requirePermission('workspace:edit-quotas');
  if (!auth.ok) return auth;

  try {
    const { eq } = await import('drizzle-orm');
    const { userQuotas } = await import('@/platform/db/schema');
    const db = getDb();

    // Ensure quota row exists
    await ensureQuotaRow(input.userId);

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (input.skillLimit !== undefined) updates.skillLimit = input.skillLimit;
    if (input.schemaLimit !== undefined) updates.schemaLimit = input.schemaLimit;
    if (input.storageLimitBytes !== undefined) updates.storageLimitBytes = input.storageLimitBytes;

    await db.update(userQuotas).set(updates).where(eq(userQuotas.userId, input.userId));

    await writeAuditEntry({
      entityType: 'user',
      entityId: input.userId,
      action: 'updated',
      userId: auth.value.userId,
      metadata: { field: 'quotas', updates },
    });

    const updated = await getWorkspaceForUser(input.userId);
    console.info('[workspace] quotas updated', { targetUserId: input.userId, updates });
    return Ok(updated);
  } catch (err) {
    console.error('[workspace] updateQuotas failed:', err);
    return Err(new Error('Failed to update quotas'));
  }
}

// ── Helpers ─────────────────────────────────────────────────────────

async function ensureQuotaRow(userId: string): Promise<void> {
  const { eq } = await import('drizzle-orm');
  const { userQuotas } = await import('@/platform/db/schema');
  const db = getDb();

  const existing = await db
    .select({ id: userQuotas.id })
    .from(userQuotas)
    .where(eq(userQuotas.userId, userId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(userQuotas).values({ userId });
  }
}

export async function getWorkspaceForUser(userId: string): Promise<WorkspaceQuota> {
  const { eq, count } = await import('drizzle-orm');
  const { users, userQuotas, skills, userDatabases } = await import('@/platform/db/schema');
  const db = getDb();

  // Get user info
  const [user] = await db
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  // Ensure quota row exists and fetch it
  await ensureQuotaRow(userId);
  const [quota] = await db
    .select()
    .from(userQuotas)
    .where(eq(userQuotas.userId, userId))
    .limit(1);

  // Count skills by user
  const [skillCount] = await db
    .select({ count: count() })
    .from(skills)
    .where(eq(skills.authorId, userId));

  // Count databases by user
  const [dbCount] = await db
    .select({ count: count() })
    .from(userDatabases)
    .where(eq(userDatabases.userId, userId));

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    quotas: {
      skillLimit: quota.skillLimit,
      skillsUsed: skillCount?.count ?? 0,
      schemaLimit: quota.schemaLimit,
      schemasUsed: dbCount?.count ?? 0,
      storageLimitBytes: quota.storageLimitBytes,
      storageUsedBytes: 0, // No per-user storage tracking yet — future chapters
    },
  };
}

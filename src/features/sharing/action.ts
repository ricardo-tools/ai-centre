'use server';

import { type Result, Ok, Err, ValidationError, ForbiddenError, NotFoundError } from '@/platform/lib/result';
import { requireAuth } from '@/platform/lib/guards';
import { getDb, hasDatabase } from '@/platform/db/client';

const hasDb = hasDatabase();

// ── Types ────────────────────────────────────────────────────────────

export type Visibility = 'public' | 'private' | 'link_only';
export type ResourceType = 'showcase' | 'skill';

export interface ShareEntry {
  id: string;
  granteeType: 'user' | 'link';
  granteeId: string;
  canView: boolean;
  canDownload: boolean;
  canShare: boolean;
  expiresAt: string | null;
  createdAt: string;
}

// ── Change Visibility ────────────────────────────────────────────────

export async function changeVisibility(
  resourceType: ResourceType,
  resourceId: string,
  visibility: Visibility,
): Promise<Result<{ visibility: string }, ValidationError | ForbiddenError | NotFoundError>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;
  const { userId } = auth.value;

  if (!hasDb) return Err(new ValidationError('noDb', 'Database not available'));
  if (!['public', 'private', 'link_only'].includes(visibility)) {
    return Err(new ValidationError('invalidVisibility', 'Must be public, private, or link_only'));
  }

  const { eq: eqOp } = await import('drizzle-orm');
  const db = getDb();

  if (resourceType === 'showcase') {
    const { showcaseUploads } = await import('@/platform/db/schema');
    const [row] = await db.select({ userId: showcaseUploads.userId })
      .from(showcaseUploads).where(eqOp(showcaseUploads.id, resourceId)).limit(1);
    if (!row) return Err(new NotFoundError('Showcase', resourceId));
    if (row.userId !== userId) return Err(new ForbiddenError('Only the owner can change visibility'));
    await db.update(showcaseUploads).set({ visibility }).where(eqOp(showcaseUploads.id, resourceId));
  } else {
    const { communitySkills } = await import('@/platform/db/schema');
    const [row] = await db.select({ userId: communitySkills.userId })
      .from(communitySkills).where(eqOp(communitySkills.id, resourceId)).limit(1);
    if (!row) return Err(new NotFoundError('Skill', resourceId));
    if (row.userId !== userId) return Err(new ForbiddenError('Only the owner can change visibility'));
    await db.update(communitySkills).set({ visibility }).where(eqOp(communitySkills.id, resourceId));
  }

  console.info('[sharing] visibility changed', { resourceType, resourceId, visibility, userId });
  return Ok({ visibility });
}

// ── List Shares ──────────────────────────────────────────────────────

export async function listResourceShares(
  resourceType: ResourceType,
  resourceId: string,
): Promise<ShareEntry[]> {
  if (!hasDb) return [];

  const { resourceShares } = await import('@/platform/db/schema');
  const { eq: eqOp, and } = await import('drizzle-orm');
  const db = getDb();

  const rows = await db.select().from(resourceShares)
    .where(and(
      eqOp(resourceShares.resourceType, resourceType),
      eqOp(resourceShares.resourceId, resourceId),
    ));

  return rows.map(r => ({
    id: r.id,
    granteeType: r.granteeType as 'user' | 'link',
    granteeId: r.granteeId,
    canView: r.canView,
    canDownload: r.canDownload,
    canShare: r.canShare,
    expiresAt: r.expiresAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
  }));
}

// ── Grant User Access ────────────────────────────────────────────────

export async function grantAccess(
  resourceType: ResourceType,
  resourceId: string,
  granteeUserId: string,
  canView: boolean,
  canDownload: boolean,
  canShare: boolean,
): Promise<Result<{ shareId: string }, ValidationError | ForbiddenError>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;
  const { userId } = auth.value;

  if (!hasDb) return Err(new ValidationError('noDb', 'Database not available'));
  if (!granteeUserId.trim()) return Err(new ValidationError('missingGrantee', 'User ID or email is required'));

  const { resourceShares } = await import('@/platform/db/schema');
  const db = getDb();

  const [result] = await db.insert(resourceShares).values({
    resourceType,
    resourceId,
    granteeType: 'user',
    granteeId: granteeUserId.trim(),
    canView,
    canDownload,
    canShare,
    createdBy: userId,
  }).onConflictDoUpdate({
    target: [resourceShares.resourceType, resourceShares.resourceId, resourceShares.granteeType, resourceShares.granteeId],
    set: { canView, canDownload, canShare },
  }).returning();

  console.info('[sharing] granted access', { resourceType, resourceId, granteeUserId, by: userId });
  return Ok({ shareId: (result as Record<string, unknown>).id as string });
}

// ── Revoke User Access ───────────────────────────────────────────────

export async function revokeAccess(
  resourceType: ResourceType,
  resourceId: string,
  granteeUserId: string,
): Promise<Result<void, ForbiddenError>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;

  if (!hasDb) return Ok(undefined);

  const { resourceShares } = await import('@/platform/db/schema');
  const { eq: eqOp, and } = await import('drizzle-orm');
  const db = getDb();

  await db.delete(resourceShares).where(and(
    eqOp(resourceShares.resourceType, resourceType),
    eqOp(resourceShares.resourceId, resourceId),
    eqOp(resourceShares.granteeType, 'user'),
    eqOp(resourceShares.granteeId, granteeUserId),
  ));

  console.info('[sharing] revoked access', { resourceType, resourceId, granteeUserId });
  return Ok(undefined);
}

// ── Create Share Link ────────────────────────────────────────────────

export async function createLink(
  resourceType: ResourceType,
  resourceId: string,
  canView: boolean,
  canDownload: boolean,
  canShare: boolean,
  expiresInHours: number,
): Promise<Result<{ token: string; shareId: string }, ForbiddenError>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;

  const { createShareLink } = await import('@/platform/lib/sharing');
  const { token, shareId } = await createShareLink(
    resourceType,
    resourceId,
    { canView, canDownload, canShare },
    auth.value.userId,
    expiresInHours || undefined,
  );

  return Ok({ token, shareId });
}

// ── Revoke Share Link ────────────────────────────────────────────────

export async function revokeLink(shareId: string): Promise<Result<void, ForbiddenError>> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;

  const { revokeShareLink } = await import('@/platform/lib/sharing');
  await revokeShareLink(shareId);

  return Ok(undefined);
}

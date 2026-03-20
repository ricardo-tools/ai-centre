'use server';

import { requirePermission } from '@/platform/lib/guards';
import { writeAuditEntry } from '@/platform/lib/audit';
import { isAllowedDomain } from '@/platform/lib/otp';
import { sendInviteEmail } from '@/platform/lib/email';
import { type Result, Ok, Err, ValidationError } from '@/platform/lib/result';

export interface RawInvitation {
  id: string;
  email: string;
  roleId: string;
  roleName: string;
  inviterName: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

const INVITATION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function inviteUser(
  email: string,
  roleId: string,
): Promise<Result<RawInvitation, Error>> {
  const auth = await requirePermission('user:invite');
  if (!auth.ok) return auth;

  const normalizedEmail = email.trim().toLowerCase();

  // Validate domain
  if (!isAllowedDomain(normalizedEmail)) {
    return Err(new ValidationError('invalidDomain', 'Email domain is not allowed'));
  }

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] inviteUser: ${normalizedEmail} with roleId ${roleId}`);
    const mock: RawInvitation = {
      id: `mock-inv-${Date.now()}`,
      email: normalizedEmail,
      roleId,
      roleName: 'Member',
      inviterName: 'Dev User',
      status: 'pending',
      expiresAt: new Date(Date.now() + INVITATION_EXPIRY_MS).toISOString(),
      createdAt: new Date().toISOString(),
    };
    return Ok(mock);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { users, invitations, roles } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    // Check user doesn't already exist
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);
    if (existingUser) {
      return Err(new ValidationError('userExists', 'A user with this email already exists'));
    }

    // Look up role name for the response
    const [role] = await db.select().from(roles).where(eq(roles.id, roleId)).limit(1);
    if (!role) return Err(new Error('Role not found'));

    // Look up inviter name
    const [inviter] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, auth.value.userId))
      .limit(1);

    const expiresAt = new Date(Date.now() + INVITATION_EXPIRY_MS);

    const [invitation] = await db
      .insert(invitations)
      .values({
        email: normalizedEmail,
        roleId,
        invitedById: auth.value.userId,
        status: 'pending',
        expiresAt,
      })
      .returning();

    // Send invite email
    const inviterName = (inviter?.name as string) ?? 'A team member';
    await sendInviteEmail(normalizedEmail, inviterName);

    await writeAuditEntry({
      entityType: 'invitation',
      entityId: invitation.id as string,
      action: 'created',
      userId: auth.value.userId,
      metadata: { email: normalizedEmail, roleId },
    });

    const result: RawInvitation = {
      id: invitation.id as string,
      email: normalizedEmail,
      roleId,
      roleName: role.name as string,
      inviterName,
      status: 'pending',
      expiresAt: expiresAt.toISOString(),
      createdAt: (invitation.createdAt as Date).toISOString(),
    };

    return Ok(result);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function cancelInvitation(id: string): Promise<Result<void, Error>> {
  const auth = await requirePermission('user:invite');
  if (!auth.ok) return auth;

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] cancelInvitation: ${id}`);
    return Ok(undefined);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { invitations } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    await db.delete(invitations).where(eq(invitations.id, id));

    await writeAuditEntry({
      entityType: 'invitation',
      entityId: id,
      action: 'deleted',
      userId: auth.value.userId,
      metadata: {},
    });

    return Ok(undefined);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function resendInvitation(id: string): Promise<Result<void, Error>> {
  const auth = await requirePermission('user:invite');
  if (!auth.ok) return auth;

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] resendInvitation: ${id}`);
    return Ok(undefined);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { invitations, users } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    const [invitation] = await db.select().from(invitations).where(eq(invitations.id, id)).limit(1);
    if (!invitation) return Err(new Error('Invitation not found'));

    // Reset expiry
    const newExpiry = new Date(Date.now() + INVITATION_EXPIRY_MS);
    await db
      .update(invitations)
      .set({ expiresAt: newExpiry })
      .where(eq(invitations.id, id));

    // Get inviter name
    const [inviter] = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, auth.value.userId))
      .limit(1);

    const inviterName = (inviter?.name as string) ?? 'A team member';
    await sendInviteEmail(invitation.email as string, inviterName);

    return Ok(undefined);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function fetchInvitations(): Promise<Result<RawInvitation[], Error>> {
  const auth = await requirePermission('user:list');
  if (!auth.ok) return auth;

  if (!process.env.DATABASE_URL) {
    return Ok([]);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { invitations, users, roles } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    const rows = await db
      .select({
        id: invitations.id,
        email: invitations.email,
        roleId: invitations.roleId,
        roleName: roles.name,
        inviterName: users.name,
        status: invitations.status,
        expiresAt: invitations.expiresAt,
        createdAt: invitations.createdAt,
      })
      .from(invitations)
      .leftJoin(roles, eq(invitations.roleId, roles.id))
      .leftJoin(users, eq(invitations.invitedById, users.id))
      .where(eq(invitations.status, 'pending'));

    const mapped: RawInvitation[] = rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      email: row.email as string,
      roleId: row.roleId as string,
      roleName: (row.roleName as string) ?? 'Unknown',
      inviterName: (row.inviterName as string) ?? 'Unknown',
      status: row.status as string,
      expiresAt: (row.expiresAt as Date).toISOString(),
      createdAt: (row.createdAt as Date).toISOString(),
    }));

    return Ok(mapped);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

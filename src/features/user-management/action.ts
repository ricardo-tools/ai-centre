'use server';

import { requirePermission, requireNotSelf } from '@/platform/lib/guards';
import { writeAuditEntry } from '@/platform/lib/audit';
import { type Result, Ok, Err } from '@/platform/lib/result';
import type { RawUserProfile } from '@/platform/acl/user-profile.mapper';

const MOCK_USERS: RawUserProfile[] = [
  { id: 'dev-1', email: 'admin@ezycollect.com.au', name: 'Admin User', roleId: 'mock-admin-role', roleName: 'Admin', roleSlug: 'admin', isActive: true, createdAt: '2025-01-01T00:00:00Z' },
  { id: 'dev-2', email: 'member@ezycollect.com.au', name: 'Team Member', roleId: 'mock-member-role', roleName: 'Member', roleSlug: 'member', isActive: true, createdAt: '2025-02-15T00:00:00Z' },
  { id: 'dev-3', email: 'inactive@sidetrade.com', name: 'Inactive User', roleId: 'mock-member-role', roleName: 'Member', roleSlug: 'member', isActive: false, createdAt: '2025-03-01T00:00:00Z' },
];

export async function fetchAllUsers(): Promise<Result<RawUserProfile[], Error>> {
  const auth = await requirePermission('user:list');
  if (!auth.ok) return auth;

  if (!process.env.DATABASE_URL) {
    return Ok(MOCK_USERS);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { users, roles } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    const rows = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        roleId: users.roleId,
        roleName: roles.name,
        roleSlug: roles.slug,
        isActive: users.isActive,
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(roles, eq(users.roleId, roles.id));

    const mapped: RawUserProfile[] = rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      email: row.email as string,
      name: row.name as string,
      roleId: (row.roleId as string) ?? '',
      roleName: (row.roleName as string) ?? 'No Role',
      roleSlug: (row.roleSlug as string) ?? '',
      isActive: row.isActive as boolean,
      createdAt: (row.createdAt as Date).toISOString(),
    }));

    return Ok(mapped);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function updateUserRole(
  userId: string,
  roleId: string,
): Promise<Result<void, Error>> {
  const auth = await requirePermission('user:edit-role');
  if (!auth.ok) return auth;

  const selfCheck = requireNotSelf(auth.value, userId);
  if (!selfCheck.ok) return selfCheck;

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] updateUserRole: ${userId} → roleId ${roleId}`);
    return Ok(undefined);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { users } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    await db.update(users).set({ roleId, updatedAt: new Date() }).where(eq(users.id, userId));

    await writeAuditEntry({
      entityType: 'user',
      entityId: userId,
      action: 'updated',
      userId: auth.value.userId,
      metadata: { field: 'roleId', newValue: roleId },
    });

    return Ok(undefined);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function deactivateUser(userId: string): Promise<Result<void, Error>> {
  const auth = await requirePermission('user:deactivate');
  if (!auth.ok) return auth;

  const selfCheck = requireNotSelf(auth.value, userId);
  if (!selfCheck.ok) return selfCheck;

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] deactivateUser: ${userId}`);
    return Ok(undefined);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { users } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, userId));

    await writeAuditEntry({
      entityType: 'user',
      entityId: userId,
      action: 'updated',
      userId: auth.value.userId,
      metadata: { field: 'isActive', newValue: false },
    });

    return Ok(undefined);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

export async function reactivateUser(userId: string): Promise<Result<void, Error>> {
  const auth = await requirePermission('user:deactivate');
  if (!auth.ok) return auth;

  const selfCheck = requireNotSelf(auth.value, userId);
  if (!selfCheck.ok) return selfCheck;

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] reactivateUser: ${userId}`);
    return Ok(undefined);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { users } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    await db.update(users).set({ isActive: true, updatedAt: new Date() }).where(eq(users.id, userId));

    await writeAuditEntry({
      entityType: 'user',
      entityId: userId,
      action: 'updated',
      userId: auth.value.userId,
      metadata: { field: 'isActive', newValue: true },
    });

    return Ok(undefined);
  } catch (err) {
    return Err(err instanceof Error ? err : new Error(String(err)));
  }
}

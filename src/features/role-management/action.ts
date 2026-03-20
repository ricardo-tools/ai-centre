'use server';

import { requirePermission } from '@/platform/lib/guards';
import { writeAuditEntry } from '@/platform/lib/audit';
import { type Result, Ok, Err } from '@/platform/lib/result';
import { SYSTEM_ROLE_SEEDS, ALL_PERMISSIONS, PERMISSION_REGISTRY } from '@/platform/lib/permissions';

export interface RawRole {
  id: string;
  slug: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: string[];
  userCount: number;
  createdAt: string;
}

const MOCK_ROLES: RawRole[] = [
  {
    id: 'mock-admin-role',
    slug: 'admin',
    name: 'Admin',
    description: 'Full access to all features',
    isSystem: true,
    permissions: [...ALL_PERMISSIONS],
    userCount: 1,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'mock-member-role',
    slug: 'member',
    name: 'Member',
    description: 'Standard team member access',
    isSystem: true,
    permissions: [...SYSTEM_ROLE_SEEDS.member],
    userCount: 2,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

export async function fetchAllRoles(): Promise<Result<RawRole[], Error>> {
  const auth = await requirePermission('user:list');
  if (!auth.ok) return auth;

  if (!process.env.DATABASE_URL) {
    return Ok(MOCK_ROLES);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { sql: sqlFn } = require('drizzle-orm');
    const { roles, rolePermissions, users } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    // Fetch all roles
    const roleRows = await db.select().from(roles);

    // Fetch all permissions grouped by roleId
    const permRows = await db.select().from(rolePermissions);
    const permsByRole = new Map<string, string[]>();
    for (const row of permRows) {
      const existing = permsByRole.get(row.roleId as string) ?? [];
      existing.push(row.permission as string);
      permsByRole.set(row.roleId as string, existing);
    }

    // Count users per role
    const userRows = await db
      .select({ roleId: users.roleId })
      .from(users)
      .where(sqlFn`${users.roleId} IS NOT NULL`);
    const userCountByRole = new Map<string, number>();
    for (const row of userRows) {
      const rid = row.roleId as string;
      userCountByRole.set(rid, (userCountByRole.get(rid) ?? 0) + 1);
    }

    const mapped: RawRole[] = roleRows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      slug: row.slug as string,
      name: row.name as string,
      description: row.description as string,
      isSystem: row.isSystem as boolean,
      permissions: permsByRole.get(row.id as string) ?? [],
      userCount: userCountByRole.get(row.id as string) ?? 0,
      createdAt: (row.createdAt as Date).toISOString(),
    }));

    return Ok(mapped);
  } catch (err) {
    console.error('[role-management] fetchAllRoles failed:', err);
    return Err(new Error('Failed to load roles. Please try again.'));
  }
}

export async function fetchRoleById(id: string): Promise<Result<RawRole, Error>> {
  const auth = await requirePermission('user:list');
  if (!auth.ok) return auth;

  if (!process.env.DATABASE_URL) {
    const mock = MOCK_ROLES.find((r) => r.id === id);
    if (!mock) return Err(new Error('Role not found'));
    return Ok(mock);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq, sql: sqlFn } = require('drizzle-orm');
    const { roles, rolePermissions, users } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    const [role] = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (!role) return Err(new Error('Role not found'));

    const permRows = await db
      .select({ permission: rolePermissions.permission })
      .from(rolePermissions)
      .where(eq(rolePermissions.roleId, id));

    const [countRow] = await db
      .select({ count: sqlFn`count(*)::int` })
      .from(users)
      .where(eq(users.roleId, id));

    const mapped: RawRole = {
      id: role.id as string,
      slug: role.slug as string,
      name: role.name as string,
      description: role.description as string,
      isSystem: role.isSystem as boolean,
      permissions: permRows.map((r: { permission: string }) => r.permission),
      userCount: (countRow?.count as number) ?? 0,
      createdAt: (role.createdAt as Date).toISOString(),
    };

    return Ok(mapped);
  } catch (err) {
    console.error('[role-management] fetchRoleById failed:', err);
    return Err(new Error('Failed to load role. Please try again.'));
  }
}

export async function createRole(
  name: string,
  description: string,
  permissions: string[],
): Promise<Result<RawRole, Error>> {
  const auth = await requirePermission('role:create');
  if (!auth.ok) return auth;

  // Validate permission strings against the registry
  const validKeys = new Set(PERMISSION_REGISTRY.map(p => p.key));
  const validPermissions = permissions.filter(p => validKeys.has(p as typeof PERMISSION_REGISTRY[number]['key']));
  if (validPermissions.length !== permissions.length) {
    console.warn('[role-management] Invalid permissions filtered:', permissions.filter(p => !validKeys.has(p as typeof PERMISSION_REGISTRY[number]['key'])));
  }

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] createRole: ${name}`, validPermissions);
    const mock: RawRole = {
      id: `mock-${Date.now()}`,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      isSystem: false,
      permissions: validPermissions,
      userCount: 0,
      createdAt: new Date().toISOString(),
    };
    return Ok(mock);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { roles, rolePermissions } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    const slug = name.toLowerCase().replace(/\s+/g, '-');

    const [newRole] = await db
      .insert(roles)
      .values({ name, slug, description, isSystem: false })
      .returning();

    if (validPermissions.length > 0) {
      await db.insert(rolePermissions).values(
        validPermissions.map((p) => ({ roleId: newRole.id as string, permission: p })),
      );
    }

    await writeAuditEntry({
      entityType: 'role',
      entityId: newRole.id as string,
      action: 'created',
      userId: auth.value.userId,
      metadata: { name, permissions: validPermissions },
    });

    const result: RawRole = {
      id: newRole.id as string,
      slug: newRole.slug as string,
      name: newRole.name as string,
      description: newRole.description as string,
      isSystem: false,
      permissions: validPermissions,
      userCount: 0,
      createdAt: (newRole.createdAt as Date).toISOString(),
    };

    return Ok(result);
  } catch (err) {
    console.error('[role-management] createRole failed:', err);
    return Err(new Error('Failed to create role. Please try again.'));
  }
}

export async function updateRole(
  id: string,
  name: string,
  description: string,
  permissions: string[],
): Promise<Result<void, Error>> {
  const auth = await requirePermission('role:edit');
  if (!auth.ok) return auth;

  // Validate permission strings against the registry
  const validKeysUpdate = new Set(PERMISSION_REGISTRY.map(p => p.key));
  const validPermsUpdate = permissions.filter(p => validKeysUpdate.has(p as typeof PERMISSION_REGISTRY[number]['key']));
  if (validPermsUpdate.length !== permissions.length) {
    console.warn('[role-management] Invalid permissions filtered:', permissions.filter(p => !validKeysUpdate.has(p as typeof PERMISSION_REGISTRY[number]['key'])));
  }

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] updateRole: ${id}`, { name, description, permissions: validPermsUpdate });
    return Ok(undefined);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq } = require('drizzle-orm');
    const { roles, rolePermissions } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    // Check if system role
    const [role] = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (!role) return Err(new Error('Role not found'));
    if (role.isSystem) return Err(new Error('Cannot edit system roles'));

    // Update role metadata
    await db.update(roles).set({ name, description, updatedAt: new Date() }).where(eq(roles.id, id));

    // Replace permissions: delete old, insert new
    await db.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
    if (validPermsUpdate.length > 0) {
      await db.insert(rolePermissions).values(
        validPermsUpdate.map((p) => ({ roleId: id, permission: p })),
      );
    }

    await writeAuditEntry({
      entityType: 'role',
      entityId: id,
      action: 'updated',
      userId: auth.value.userId,
      metadata: { name, permissions: validPermsUpdate },
    });

    return Ok(undefined);
  } catch (err) {
    console.error('[role-management] updateRole failed:', err);
    return Err(new Error('Failed to update role. Please try again.'));
  }
}

export async function deleteRole(id: string): Promise<Result<void, Error>> {
  const auth = await requirePermission('role:delete');
  if (!auth.ok) return auth;

  if (!process.env.DATABASE_URL) {
    console.log(`[dev] deleteRole: ${id}`);
    return Ok(undefined);
  }

  try {
    const { neon } = require('@neondatabase/serverless');
    const { drizzle } = require('drizzle-orm/neon-http');
    const { eq, sql: sqlFn } = require('drizzle-orm');
    const { roles, users } = await import('@/platform/db/schema');

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    // Check if system role
    const [role] = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
    if (!role) return Err(new Error('Role not found'));
    if (role.isSystem) return Err(new Error('Cannot delete system roles'));

    // Check if any users are assigned this role
    const [countRow] = await db
      .select({ count: sqlFn`count(*)::int` })
      .from(users)
      .where(eq(users.roleId, id));
    if ((countRow?.count as number) > 0) {
      return Err(new Error('Cannot delete role with assigned users'));
    }

    // Delete role (cascade will remove role_permissions)
    await db.delete(roles).where(eq(roles.id, id));

    await writeAuditEntry({
      entityType: 'role',
      entityId: id,
      action: 'deleted',
      userId: auth.value.userId,
      metadata: { roleName: role.name as string },
    });

    return Ok(undefined);
  } catch (err) {
    console.error('[role-management] deleteRole failed:', err);
    return Err(new Error('Failed to delete role. Please try again.'));
  }
}

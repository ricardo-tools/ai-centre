/**
 * Server Action guards — reusable auth/permission checks.
 *
 * Every mutating server action should call one of these at the top.
 * All return Result<T, E> — no throwing, matches the existing action pattern.
 *
 * Usage:
 *   const session = await requireAuth();
 *   if (!session.ok) return session;
 *
 *   const allowed = await requirePermission('skill:publish');
 *   if (!allowed.ok) return allowed;
 */

import { getSession, type Session } from '@/platform/lib/auth';
import { type Result, Ok, Err, AuthError, ForbiddenError } from '@/platform/lib/result';
import { canAccessResource, type Permission } from '@/platform/lib/permissions';

// ── Permission cache ────────────────────────────────────────────────
// Module-level cache: roleId → { permissions Set, timestamp }
const permissionCache = new Map<string, { permissions: Set<string>; ts: number }>();
const CACHE_TTL_MS = 60_000; // 60 seconds

async function getPermissionsForRole(roleId: string): Promise<Set<string>> {
  const cached = permissionCache.get(roleId);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.permissions;
  }

  const { getDb } = await import('@/platform/db/client');
  const { eq } = require('drizzle-orm');
  const { rolePermissions } = await import('@/platform/db/schema');

  const db = getDb();

  const rows = await db
    .select({ permission: rolePermissions.permission })
    .from(rolePermissions)
    .where(eq(rolePermissions.roleId, roleId));

  const perms = new Set<string>(rows.map((r: { permission: string }) => r.permission));
  permissionCache.set(roleId, { permissions: perms, ts: Date.now() });
  return perms;
}

/** Require a valid session. Returns the session or an AuthError. */
export async function requireAuth(): Promise<Result<Session, AuthError>> {
  const session = await getSession();
  if (!session) {
    return Err(new AuthError('unauthenticated', 'You must be logged in'));
  }
  return Ok(session);
}

/** Require a specific permission. Returns the session or a ForbiddenError. */
export async function requirePermission(permission: Permission): Promise<Result<Session, AuthError | ForbiddenError>> {
  const authResult = await requireAuth();
  if (!authResult.ok) return authResult;

  const session = authResult.value;

  // Dev mode (no DATABASE_URL): admin gets all permissions
  if (!process.env.DATABASE_URL) {
    if (session.roleSlug === 'admin') {
      return Ok(session);
    }
    return Err(new ForbiddenError(permission));
  }

  // Production: check role_permissions table (with cache)
  const permissions = await getPermissionsForRole(session.roleId);
  if (permissions.has(permission)) {
    return Ok(session);
  }

  return Err(new ForbiddenError(permission));
}

/** Require that the session user owns the resource, or is an admin. */
export function requireOwnerOrAdmin(
  session: Session,
  resourceAuthorId: string,
): Result<void, ForbiddenError> {
  if (canAccessResource(session, { authorId: resourceAuthorId })) {
    return Ok(undefined);
  }
  return Err(new ForbiddenError('resource:access'));
}

/** Require that the action is not targeting the current user (e.g. can't deactivate yourself). */
export function requireNotSelf(
  session: Session,
  targetUserId: string,
): Result<void, ForbiddenError> {
  if (session.userId === targetUserId) {
    return Err(new ForbiddenError('self-action'));
  }
  return Ok(undefined);
}

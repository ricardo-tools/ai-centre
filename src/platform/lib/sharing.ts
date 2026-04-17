/**
 * Resource sharing — view, download, reshare permissions.
 *
 * Supports two grantee types:
 *   - 'user': named user by userId
 *   - 'link': signed share link with embedded permissions
 *
 * Owner always has full access — no share record needed.
 */

import { randomBytes, createHash } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { getDb } from '@/platform/db/client';
import { resourceShares } from '@/platform/db/schema';
import { eq, and, or, gt } from 'drizzle-orm';

// ── Types ────────────────────────────────────────────────────────────

export type ResourceType = 'showcase' | 'skill';

export interface SharePermissions {
  canView: boolean;
  canDownload: boolean;
  canShare: boolean;
}

export interface ShareGrant extends SharePermissions {
  resourceType: ResourceType;
  resourceId: string;
  granteeType: 'user' | 'link';
  granteeId: string;
  expiresAt?: Date;
  createdBy: string;
}

export interface ShareRecord extends ShareGrant {
  id: string;
  createdAt: Date;
}

// ── Permission checks ────────────────────────────────────────────────

/**
 * Check if a user has specific permission on a resource.
 * Returns the permissions if found, null if no access.
 * Does NOT check ownership — caller must check that separately.
 */
export async function checkPermission(
  resourceType: ResourceType,
  resourceId: string,
  userId: string,
): Promise<SharePermissions | null> {
  const db = getDb();
  const now = new Date();

  const [share] = await db.select({
    canView: resourceShares.canView,
    canDownload: resourceShares.canDownload,
    canShare: resourceShares.canShare,
    expiresAt: resourceShares.expiresAt,
  }).from(resourceShares)
    .where(and(
      eq(resourceShares.resourceType, resourceType),
      eq(resourceShares.resourceId, resourceId),
      eq(resourceShares.granteeType, 'user'),
      eq(resourceShares.granteeId, userId),
    ))
    .limit(1);

  if (!share) return null;
  if (share.expiresAt && share.expiresAt < now) return null;

  return {
    canView: share.canView,
    canDownload: share.canDownload,
    canShare: share.canShare,
  };
}

// ── Grant / Revoke ───────────────────────────────────────────────────

/**
 * Grant permissions to a user on a resource. Upserts — if a share already
 * exists for this user+resource, it updates the permissions.
 */
export async function grantUserAccess(
  resourceType: ResourceType,
  resourceId: string,
  granteeUserId: string,
  permissions: SharePermissions,
  createdBy: string,
  expiresAt?: Date,
): Promise<string> {
  const db = getDb();

  const [result] = await db.insert(resourceShares).values({
    resourceType,
    resourceId,
    granteeType: 'user',
    granteeId: granteeUserId,
    canView: permissions.canView,
    canDownload: permissions.canDownload,
    canShare: permissions.canShare,
    expiresAt: expiresAt ?? null,
    createdBy,
  }).onConflictDoUpdate({
    target: [resourceShares.resourceType, resourceShares.resourceId, resourceShares.granteeType, resourceShares.granteeId],
    set: {
      canView: permissions.canView,
      canDownload: permissions.canDownload,
      canShare: permissions.canShare,
      expiresAt: expiresAt ?? null,
    },
  }).returning();

  console.info('[sharing] granted user access', {
    resourceType, resourceId, granteeUserId,
    permissions, createdBy,
  });

  return (result as Record<string, unknown>).id as string;
}

/**
 * Revoke a user's access to a resource.
 */
export async function revokeUserAccess(
  resourceType: ResourceType,
  resourceId: string,
  granteeUserId: string,
): Promise<boolean> {
  const db = getDb();

  const deleted = await db.delete(resourceShares)
    .where(and(
      eq(resourceShares.resourceType, resourceType),
      eq(resourceShares.resourceId, resourceId),
      eq(resourceShares.granteeType, 'user'),
      eq(resourceShares.granteeId, granteeUserId),
    ))
    .returning();

  console.info('[sharing] revoked user access', {
    resourceType, resourceId, granteeUserId,
    deleted: deleted.length > 0,
  });

  return deleted.length > 0;
}

/**
 * List all shares for a resource.
 */
export async function listShares(
  resourceType: ResourceType,
  resourceId: string,
): Promise<ShareRecord[]> {
  const db = getDb();

  const rows = await db.select().from(resourceShares)
    .where(and(
      eq(resourceShares.resourceType, resourceType),
      eq(resourceShares.resourceId, resourceId),
    ));

  return rows.map(r => ({
    id: r.id,
    resourceType: r.resourceType as ResourceType,
    resourceId: r.resourceId,
    granteeType: r.granteeType as 'user' | 'link',
    granteeId: r.granteeId,
    canView: r.canView,
    canDownload: r.canDownload,
    canShare: r.canShare,
    expiresAt: r.expiresAt ?? undefined,
    createdBy: r.createdBy,
    createdAt: r.createdAt,
  }));
}

// ── Share Links ──────────────────────────────────────────────────────

const SHARE_LINK_SECRET_KEY = 'AUTH_SECRET'; // reuse existing secret

function getShareSecret(): Uint8Array {
  const secret = process.env[SHARE_LINK_SECRET_KEY];
  if (!secret) throw new Error(`${SHARE_LINK_SECRET_KEY} is required for share links`);
  return new TextEncoder().encode(secret);
}

/**
 * Create a share link. Stores a record in the DB and returns a signed JWT token
 * that encodes the permissions. The token can be verified without a DB lookup.
 */
export async function createShareLink(
  resourceType: ResourceType,
  resourceId: string,
  permissions: SharePermissions,
  createdBy: string,
  expiresInHours: number = 168, // 7 days default
): Promise<{ token: string; shareId: string }> {
  const tokenId = randomBytes(16).toString('hex');
  const tokenHash = createHash('sha256').update(tokenId).digest('hex');
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  const db = getDb();
  const [result] = await db.insert(resourceShares).values({
    resourceType,
    resourceId,
    granteeType: 'link',
    granteeId: tokenHash,
    canView: permissions.canView,
    canDownload: permissions.canDownload,
    canShare: permissions.canShare,
    expiresAt,
    createdBy,
  }).returning();

  const shareId = (result as Record<string, unknown>).id as string;

  // Sign a JWT with the permissions embedded — allows stateless verification
  const token = await new SignJWT({
    type: 'share',
    rt: resourceType,
    ri: resourceId,
    v: permissions.canView,
    d: permissions.canDownload,
    s: permissions.canShare,
    tid: tokenHash,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${expiresInHours}h`)
    .setIssuedAt()
    .sign(getShareSecret());

  console.info('[sharing] created share link', {
    resourceType, resourceId, shareId,
    permissions, expiresInHours, createdBy,
  });

  return { token, shareId };
}

/**
 * Verify a share link token. Returns the embedded permissions or null.
 * Checks JWT signature + expiry. Optionally verifies against DB for revocation.
 */
export async function verifyShareLink(
  token: string,
  checkDb: boolean = true,
): Promise<{ resourceType: ResourceType; resourceId: string; permissions: SharePermissions } | null> {
  try {
    const { payload } = await jwtVerify(token, getShareSecret());

    if (payload.type !== 'share') return null;

    const resourceType = payload.rt as ResourceType;
    const resourceId = payload.ri as string;
    const permissions: SharePermissions = {
      canView: payload.v as boolean,
      canDownload: payload.d as boolean,
      canShare: payload.s as boolean,
    };

    if (checkDb) {
      const tokenHash = payload.tid as string;
      const db = getDb();
      const [share] = await db.select({ id: resourceShares.id })
        .from(resourceShares)
        .where(and(
          eq(resourceShares.granteeType, 'link'),
          eq(resourceShares.granteeId, tokenHash),
        ))
        .limit(1);

      if (!share) return null; // Link was revoked
    }

    return { resourceType, resourceId, permissions };
  } catch {
    return null;
  }
}

/**
 * Revoke a share link by its share record ID.
 */
export async function revokeShareLink(shareId: string): Promise<boolean> {
  const db = getDb();
  const deleted = await db.delete(resourceShares)
    .where(eq(resourceShares.id, shareId))
    .returning();

  console.info('[sharing] revoked share link', { shareId, deleted: deleted.length > 0 });
  return deleted.length > 0;
}

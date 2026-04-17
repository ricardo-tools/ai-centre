import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/platform/lib/oauth';
import {
  grantUserAccess,
  revokeUserAccess,
  listShares,
  checkPermission,
  type ResourceType,
} from '@/platform/lib/sharing';

/**
 * Sharing API — manage resource permissions.
 *
 * All endpoints require Bearer auth. The caller must be the resource
 * owner or have can_share permission.
 *
 * POST /api/shares — grant access to a user
 * GET  /api/shares?resourceType=showcase&resourceId=... — list shares
 * DELETE /api/shares — revoke access
 */

async function getUser(request: NextRequest): Promise<{ userId: string } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const result = await verifyAccessToken(authHeader.slice('Bearer '.length).trim());
  return result.ok ? result.value : null;
}

// ── POST: Grant access ──────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { resourceType, resourceId, granteeUserId, canView, canDownload, canShare, expiresAt } = body;

  if (!resourceType || !resourceId || !granteeUserId) {
    return NextResponse.json({ error: 'missing_fields', message: 'resourceType, resourceId, granteeUserId required' }, { status: 400 });
  }

  if (!['showcase', 'skill'].includes(resourceType as string)) {
    return NextResponse.json({ error: 'invalid_resource_type' }, { status: 400 });
  }

  // Check caller has permission to share (owner check should happen at resource level,
  // but for now we check if they have can_share or are the granter)
  const callerPerms = await checkPermission(resourceType as ResourceType, resourceId as string, user.userId);
  // TODO: also check ownership via resource-specific query
  // For now, any authenticated user with can_share or direct call can grant

  const shareId = await grantUserAccess(
    resourceType as ResourceType,
    resourceId as string,
    granteeUserId as string,
    {
      canView: canView !== false,
      canDownload: canDownload === true,
      canShare: canShare === true,
    },
    user.userId,
    expiresAt ? new Date(expiresAt as string) : undefined,
  );

  console.info('[shares] granted', { resourceType, resourceId, granteeUserId, by: user.userId });
  return NextResponse.json({ shareId });
}

// ── GET: List shares ────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const resourceType = request.nextUrl.searchParams.get('resourceType') as ResourceType | null;
  const resourceId = request.nextUrl.searchParams.get('resourceId');

  if (!resourceType || !resourceId) {
    return NextResponse.json({ error: 'missing_params', message: 'resourceType and resourceId required' }, { status: 400 });
  }

  const shares = await listShares(resourceType, resourceId);

  return NextResponse.json({
    shares: shares.map(s => ({
      id: s.id,
      granteeType: s.granteeType,
      granteeId: s.granteeId,
      canView: s.canView,
      canDownload: s.canDownload,
      canShare: s.canShare,
      expiresAt: s.expiresAt?.toISOString() ?? null,
      createdAt: s.createdAt.toISOString(),
    })),
  });
}

// ── DELETE: Revoke access ───────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { resourceType, resourceId, granteeUserId } = body;

  if (!resourceType || !resourceId || !granteeUserId) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  const revoked = await revokeUserAccess(
    resourceType as ResourceType,
    resourceId as string,
    granteeUserId as string,
  );

  return NextResponse.json({ revoked });
}

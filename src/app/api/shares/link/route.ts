import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from '@/platform/lib/oauth';
import {
  createShareLink,
  verifyShareLink,
  revokeShareLink,
  type ResourceType,
} from '@/platform/lib/sharing';

/**
 * Share link API.
 *
 * POST /api/shares/link — create a share link (returns signed JWT token)
 * GET  /api/shares/link?token=... — verify a share link (returns permissions)
 * DELETE /api/shares/link — revoke a share link by ID
 */

async function getUser(request: NextRequest): Promise<{ userId: string } | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const result = await verifyAccessToken(authHeader.slice('Bearer '.length).trim());
  return result.ok ? result.value : null;
}

// ── POST: Create share link ─────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { resourceType, resourceId, canView, canDownload, canShare, expiresInHours } = body;

  if (!resourceType || !resourceId) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  if (!['showcase', 'skill'].includes(resourceType as string)) {
    return NextResponse.json({ error: 'invalid_resource_type' }, { status: 400 });
  }

  const { token, shareId } = await createShareLink(
    resourceType as ResourceType,
    resourceId as string,
    {
      canView: canView !== false,
      canDownload: canDownload === true,
      canShare: canShare === true,
    },
    user.userId,
    typeof expiresInHours === 'number' ? expiresInHours : 168,
  );

  return NextResponse.json({ token, shareId });
}

// ── GET: Verify share link ──────────────────────────────────────────

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'missing_token' }, { status: 400 });
  }

  const result = await verifyShareLink(token);

  if (!result) {
    return NextResponse.json({ error: 'invalid_or_expired', message: 'Share link is invalid, expired, or revoked' }, { status: 403 });
  }

  return NextResponse.json({
    resourceType: result.resourceType,
    resourceId: result.resourceId,
    permissions: result.permissions,
  });
}

// ── DELETE: Revoke share link ───────────────────────────────────────

export async function DELETE(request: NextRequest) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const { shareId } = body;
  if (!shareId) {
    return NextResponse.json({ error: 'missing_share_id' }, { status: 400 });
  }

  const revoked = await revokeShareLink(shareId as string);
  return NextResponse.json({ revoked });
}

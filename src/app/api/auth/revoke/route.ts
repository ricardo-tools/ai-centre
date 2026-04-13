import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { revokeToken } from '@/platform/lib/oauth';

/**
 * POST /api/auth/revoke
 *
 * Revoke a refresh token (logout from CLI).
 * Body: { token: string }
 */
export async function POST(request: NextRequest) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request', message: 'Invalid JSON body' }, { status: 400 });
  }

  const { token } = body;
  if (!token) {
    return NextResponse.json({ error: 'invalid_request', message: 'Missing token' }, { status: 400 });
  }

  const result = await revokeToken(token);
  if (!result.ok) {
    // Per RFC 7009, revocation of unknown tokens should still return 200
    // to prevent token probing. But we log the failure.
    console.warn('[oauth] revoke: token not found or already revoked');
  }

  console.info('[oauth] token revoked successfully');
  return NextResponse.json({ ok: true });
}

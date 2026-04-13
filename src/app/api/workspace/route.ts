import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/platform/lib/oauth';

/**
 * GET /api/workspace
 *
 * Returns the authenticated user's workspace quotas and usage.
 * Authenticated via OAuth bearer token (Flow CLI).
 */
export async function GET(request: Request) {
  let userId = 'dev-user';

  if (process.env.SKIP_AUTH !== 'true') {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'missing_token' }, { status: 401 });
    }

    const tokenResult = await verifyAccessToken(token);
    if (!tokenResult.ok) {
      return NextResponse.json({ error: 'invalid_token', message: tokenResult.error.message }, { status: 401 });
    }
    userId = tokenResult.value.userId;
  }

  try {
    const { getWorkspaceForUser } = await import('@/features/workspace/action');
    const workspace = await getWorkspaceForUser(userId);
    return NextResponse.json(workspace);
  } catch (err) {
    console.error('[workspace-api] GET failed:', err);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

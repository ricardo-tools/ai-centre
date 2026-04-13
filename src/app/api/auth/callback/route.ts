import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAuthorizationCode } from '@/platform/lib/oauth';
import { getSession } from '@/platform/lib/auth';

/**
 * GET /api/auth/callback
 *
 * Called after successful OTP verification during an OAuth flow.
 * Reads the OAuth params from the cookie, creates an authorization code,
 * and redirects the user's browser to the CLI's localhost callback.
 *
 * The login page redirects here after OTP success when oauth=true.
 */
export async function GET(request: NextRequest) {
  // Verify the user is authenticated (OTP just completed)
  const session = await getSession();
  if (!session) {
    console.warn('[oauth] callback: no session found');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Read OAuth params from cookie
  const oauthParamsCookie = request.cookies.get('oauth-params')?.value;
  if (!oauthParamsCookie) {
    console.warn('[oauth] callback: no oauth-params cookie');
    return NextResponse.json({ error: 'missing_oauth_params', message: 'OAuth session expired. Please try flow-login again.' }, { status: 400 });
  }

  let oauthParams: { codeChallenge: string; redirectUri: string; state: string };
  try {
    oauthParams = JSON.parse(oauthParamsCookie);
  } catch {
    console.error('[oauth] callback: invalid oauth-params cookie');
    return NextResponse.json({ error: 'invalid_oauth_params' }, { status: 400 });
  }

  const { codeChallenge, redirectUri, state } = oauthParams;

  // Create authorization code
  const code = await createAuthorizationCode({
    userId: session.userId,
    codeChallenge,
    redirectUri,
  });

  // Build callback URL to the CLI's localhost server
  const callbackUrl = new URL(redirectUri);
  callbackUrl.searchParams.set('code', code);
  callbackUrl.searchParams.set('state', state);

  // Clear the oauth-params cookie
  const response = NextResponse.redirect(callbackUrl);
  response.cookies.delete('oauth-params');

  console.info('[oauth] callback: redirecting to CLI', { userId: session.userId, state });
  return response;
}

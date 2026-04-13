import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@/platform/lib/auth';

/**
 * GET /api/auth/authorize
 *
 * Initiates the OAuth PKCE flow for CLI authentication.
 *
 * If the user is already logged in, redirects to a consent page.
 * If not, redirects to login with oauth=true so that after OTP
 * verification the user is sent to /api/auth/callback.
 *
 * Query params:
 *   response_type=code (required)
 *   code_challenge={S256 hash} (required)
 *   code_challenge_method=S256 (required)
 *   redirect_uri=http://localhost:{port}/callback (required)
 *   state={random} (required)
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const responseType = url.searchParams.get('response_type');
  const codeChallenge = url.searchParams.get('code_challenge');
  const codeChallengeMethod = url.searchParams.get('code_challenge_method');
  const redirectUri = url.searchParams.get('redirect_uri');
  const state = url.searchParams.get('state');

  // Validate required params
  if (responseType !== 'code') {
    return NextResponse.json({ error: 'unsupported_response_type' }, { status: 400 });
  }
  if (!codeChallenge || !codeChallengeMethod) {
    return NextResponse.json({ error: 'missing_code_challenge' }, { status: 400 });
  }
  if (codeChallengeMethod !== 'S256') {
    return NextResponse.json({ error: 'unsupported_challenge_method' }, { status: 400 });
  }
  if (!redirectUri) {
    return NextResponse.json({ error: 'missing_redirect_uri' }, { status: 400 });
  }
  if (!state) {
    return NextResponse.json({ error: 'missing_state' }, { status: 400 });
  }

  // Only allow localhost redirect URIs (CLI callback)
  try {
    const parsedUri = new URL(redirectUri);
    if (parsedUri.hostname !== 'localhost' && parsedUri.hostname !== '127.0.0.1') {
      return NextResponse.json({ error: 'invalid_redirect_uri', message: 'Only localhost redirect URIs are allowed' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'invalid_redirect_uri' }, { status: 400 });
  }

  // Store OAuth params in a secure cookie so the callback can create the auth code
  const oauthParams = JSON.stringify({ codeChallenge, redirectUri, state });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 600, // 10 minutes
    path: '/',
  };

  // Check if user is already logged in
  const session = await getSession();

  if (session) {
    // Already logged in — redirect to consent page
    const consentUrl = new URL('/oauth/consent', request.url);
    consentUrl.searchParams.set('oauth', 'true');

    const response = NextResponse.redirect(consentUrl);
    response.cookies.set('oauth-params', oauthParams, cookieOptions);

    console.info('[oauth] authorize: user already logged in, redirecting to consent', { userId: session.userId, state });
    return response;
  }

  // Not logged in — redirect to login page
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('oauth', 'true');

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set('oauth-params', oauthParams, cookieOptions);

  console.info('[oauth] authorize: redirecting to login', { redirectUri, state });
  return response;
}

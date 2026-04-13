import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * GET /api/auth/authorize
 *
 * Initiates the OAuth PKCE flow for CLI authentication.
 * Redirects to the login page with OAuth params stored in a cookie,
 * so that after OTP verification we can issue an authorization code.
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

  // Store OAuth params in a secure cookie so the login flow can create the code after OTP
  const oauthParams = JSON.stringify({ codeChallenge, redirectUri, state });

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('oauth', 'true');

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set('oauth-params', oauthParams, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/',
  });

  console.info('[oauth] authorize: redirecting to login', { redirectUri, state });
  return response;
}

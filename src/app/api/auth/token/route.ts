import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  consumeAuthorizationCode,
  verifyPkceChallenge,
  issueTokens,
  refreshTokens,
} from '@/platform/lib/oauth';

/**
 * POST /api/auth/token
 *
 * Token exchange endpoint. Supports two grant types:
 *
 * 1. authorization_code: Exchange code + PKCE verifier for tokens
 *    Body: { grant_type, code, code_verifier, redirect_uri }
 *
 * 2. refresh_token: Exchange refresh token for new token pair
 *    Body: { grant_type, refresh_token }
 */
export async function POST(request: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request', message: 'Invalid JSON body' }, { status: 400 });
  }

  const { grant_type } = body;

  if (grant_type === 'authorization_code') {
    return handleAuthorizationCode(body);
  }

  if (grant_type === 'refresh_token') {
    return handleRefreshToken(body);
  }

  return NextResponse.json({ error: 'unsupported_grant_type' }, { status: 400 });
}

async function handleAuthorizationCode(body: Record<string, string>) {
  const { code, code_verifier, redirect_uri } = body;

  if (!code || !code_verifier || !redirect_uri) {
    return NextResponse.json({ error: 'invalid_request', message: 'Missing required parameters' }, { status: 400 });
  }

  // Consume the authorization code
  const codeResult = await consumeAuthorizationCode(code);
  if (!codeResult.ok) {
    console.warn('[oauth] token exchange failed: invalid code');
    return NextResponse.json({ error: 'invalid_grant', message: codeResult.error.message }, { status: 400 });
  }

  const { userId, codeChallenge, redirectUri: storedRedirectUri } = codeResult.value;

  // Verify redirect_uri matches
  if (redirect_uri !== storedRedirectUri) {
    console.warn('[oauth] token exchange failed: redirect_uri mismatch');
    return NextResponse.json({ error: 'invalid_grant', message: 'Redirect URI mismatch' }, { status: 400 });
  }

  // Verify PKCE challenge
  if (!verifyPkceChallenge(code_verifier, codeChallenge)) {
    console.warn('[oauth] token exchange failed: PKCE verification failed');
    return NextResponse.json({ error: 'invalid_grant', message: 'PKCE verification failed' }, { status: 400 });
  }

  // Issue tokens
  const tokens = await issueTokens(userId);

  console.info('[oauth] token exchange successful', { userId });
  return NextResponse.json({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    token_type: 'Bearer',
    expires_in: tokens.expiresIn,
  });
}

async function handleRefreshToken(body: Record<string, string>) {
  const { refresh_token } = body;

  if (!refresh_token) {
    return NextResponse.json({ error: 'invalid_request', message: 'Missing refresh_token' }, { status: 400 });
  }

  const result = await refreshTokens(refresh_token);
  if (!result.ok) {
    console.warn('[oauth] refresh failed:', result.error.code);
    return NextResponse.json({ error: 'invalid_grant', message: result.error.message }, { status: 400 });
  }

  const tokens = result.value;
  console.info('[oauth] token refresh successful');
  return NextResponse.json({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    token_type: 'Bearer',
    expires_in: tokens.expiresIn,
  });
}

/**
 * OAuth PKCE utilities for Flow CLI authentication.
 *
 * Server-side: code generation, PKCE verification, token management.
 * All tokens are hashed before storage — plaintext never hits the DB.
 */

import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { SignJWT, jwtVerify } from 'jose';
import { getDb } from '@/platform/db';
import { oauthCodes, oauthTokens } from '@/platform/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { Ok, Err, AuthError } from '@/platform/lib/result';
import type { Result } from '@/platform/lib/result';

// ── Constants ───────────────────────────────────────────────────────

const CODE_EXPIRY_MS = 5 * 60 * 1000;         // 5 minutes
const ACCESS_TOKEN_EXPIRY_S = 60 * 60;         // 1 hour
const REFRESH_TOKEN_EXPIRY_S = 30 * 24 * 60 * 60; // 30 days

// ── PKCE ────────────────────────────────────────────────────────────

/** Compute the S256 code_challenge from a code_verifier (RFC 7636 §4.2) */
export function computeCodeChallenge(verifier: string): string {
  return createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

/** Verify a PKCE code_verifier against a stored code_challenge */
export function verifyPkceChallenge(verifier: string, challenge: string): boolean {
  const computed = computeCodeChallenge(verifier);
  if (computed.length !== challenge.length) return false;
  return timingSafeEqual(Buffer.from(computed), Buffer.from(challenge));
}

// ── Token Hashing ───────────────────────────────────────────────────

/** SHA-256 hash a token for storage */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Generate a cryptographically random token */
export function generateToken(): string {
  return randomBytes(32).toString('base64url');
}

/** Generate a random authorization code */
export function generateAuthCode(): string {
  return randomBytes(32).toString('base64url');
}

// ── Authorization Codes ─────────────────────────────────────────────

interface CreateCodeParams {
  userId: string;
  codeChallenge: string;
  redirectUri: string;
}

/** Create an authorization code and store it hashed in the DB */
export async function createAuthorizationCode(params: CreateCodeParams): Promise<string> {
  const db = getDb();
  const code = generateAuthCode();
  const codeHash = hashToken(code);

  await db.insert(oauthCodes).values({
    userId: params.userId,
    codeHash,
    codeChallenge: params.codeChallenge,
    redirectUri: params.redirectUri,
    expiresAt: new Date(Date.now() + CODE_EXPIRY_MS),
  });

  console.info('[oauth] authorization code created', { userId: params.userId });
  return code;
}

interface CodeExchangeResult {
  userId: string;
  codeChallenge: string;
  redirectUri: string;
}

/** Look up and consume an authorization code. Returns the associated data or error. */
export async function consumeAuthorizationCode(code: string): Promise<Result<CodeExchangeResult, AuthError>> {
  const db = getDb();
  const codeHash = hashToken(code);

  const rows = await db
    .select()
    .from(oauthCodes)
    .where(and(eq(oauthCodes.codeHash, codeHash), isNull(oauthCodes.usedAt)));

  if (rows.length === 0) {
    console.warn('[oauth] authorization code not found or already used');
    return Err(new AuthError('invalid_code', 'Invalid or expired authorization code'));
  }

  const row = rows[0];

  if (row.expiresAt < new Date()) {
    console.warn('[oauth] authorization code expired', { codeId: row.id });
    return Err(new AuthError('code_expired', 'Authorization code has expired'));
  }

  // Mark as used
  await db.update(oauthCodes).set({ usedAt: new Date() }).where(eq(oauthCodes.id, row.id));

  console.info('[oauth] authorization code consumed', { userId: row.userId });
  return Ok({
    userId: row.userId,
    codeChallenge: row.codeChallenge,
    redirectUri: row.redirectUri,
  });
}

// ── Token Issuance ──────────────────────────────────────────────────

interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** Issue an access/refresh token pair and store hashes in the DB */
export async function issueTokens(userId: string): Promise<TokenPair> {
  const db = getDb();
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

  const accessToken = await new SignJWT({ userId, type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${ACCESS_TOKEN_EXPIRY_S}s`)
    .setIssuedAt()
    .sign(secret);

  const refreshToken = generateToken();

  await db.insert(oauthTokens).values({
    userId,
    accessTokenHash: hashToken(accessToken),
    refreshTokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_S * 1000),
  });

  console.info('[oauth] tokens issued', { userId });
  return {
    accessToken,
    refreshToken,
    expiresIn: ACCESS_TOKEN_EXPIRY_S,
  };
}

// ── Token Verification ──────────────────────────────────────────────

interface AccessTokenPayload {
  userId: string;
}

/** Verify an access token JWT and return the payload */
export async function verifyAccessToken(token: string): Promise<Result<AccessTokenPayload, AuthError>> {
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.type !== 'access' || typeof payload.userId !== 'string') {
      return Err(new AuthError('invalid_token', 'Invalid access token'));
    }
    return Ok({ userId: payload.userId });
  } catch {
    return Err(new AuthError('token_expired', 'Access token expired or invalid'));
  }
}

// ── Token Refresh ───────────────────────────────────────────────────

/** Refresh tokens: validate refresh_token, revoke old pair, issue new pair */
export async function refreshTokens(refreshToken: string): Promise<Result<TokenPair, AuthError>> {
  const db = getDb();
  const refreshHash = hashToken(refreshToken);

  const rows = await db
    .select()
    .from(oauthTokens)
    .where(and(eq(oauthTokens.refreshTokenHash, refreshHash), isNull(oauthTokens.revokedAt)));

  if (rows.length === 0) {
    console.warn('[oauth] refresh token not found or revoked');
    return Err(new AuthError('invalid_refresh', 'Invalid or revoked refresh token'));
  }

  const row = rows[0];

  if (row.expiresAt < new Date()) {
    console.warn('[oauth] refresh token expired', { tokenId: row.id });
    return Err(new AuthError('refresh_expired', 'Refresh token has expired'));
  }

  // Revoke old token pair
  await db.update(oauthTokens).set({ revokedAt: new Date() }).where(eq(oauthTokens.id, row.id));

  // Issue new pair
  const newTokens = await issueTokens(row.userId);
  console.info('[oauth] tokens refreshed', { userId: row.userId });
  return Ok(newTokens);
}

// ── Token Revocation ────────────────────────────────────────────────

/** Revoke a refresh token (logout) */
export async function revokeToken(refreshToken: string): Promise<Result<void, AuthError>> {
  const db = getDb();
  const refreshHash = hashToken(refreshToken);

  const result = await db
    .update(oauthTokens)
    .set({ revokedAt: new Date() })
    .where(and(eq(oauthTokens.refreshTokenHash, refreshHash), isNull(oauthTokens.revokedAt)));

  if (result.rowCount === 0) {
    console.warn('[oauth] revoke: token not found or already revoked');
    return Err(new AuthError('invalid_token', 'Token not found or already revoked'));
  }

  console.info('[oauth] token revoked');
  return Ok(undefined);
}

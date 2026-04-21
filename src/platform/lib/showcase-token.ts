import { SignJWT } from 'jose';

const TOKEN_EXPIRY = '5m';

function getShowcaseSecret(): Uint8Array {
  const secret = process.env.SHOWCASE_JWT_SECRET;
  if (!secret) throw new Error('SHOWCASE_JWT_SECRET environment variable is required');
  return new TextEncoder().encode(secret);
}

/**
 * Signs a showcase deploy URL with a short-lived JWT token.
 * The token is appended as a `?token=` query parameter and verified
 * by Edge Middleware before the iframe content is served.
 */
export async function signShowcaseUrl(deployUrl: string): Promise<string> {
  const token = await new SignJWT({ url: deployUrl })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(getShowcaseSecret());

  const url = new URL(deployUrl);
  url.searchParams.set('token', token);
  return url.toString();
}

/**
 * Generate a standalone share URL for a showcase.
 * Points directly at the Vercel deployment — no AI Centre chrome.
 * Longer-lived token (matches the share link expiry).
 */
export async function signStandaloneShowcaseUrl(
  deployUrl: string,
  expiresInHours: number = 168, // 7 days default
): Promise<string> {
  const expiry = expiresInHours > 0 ? `${expiresInHours}h` : '365d'; // "never" = 1 year

  const token = await new SignJWT({ url: deployUrl, standalone: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiry)
    .setIssuedAt()
    .sign(getShowcaseSecret());

  const url = new URL(deployUrl);
  url.searchParams.set('token', token);
  return url.toString();
}

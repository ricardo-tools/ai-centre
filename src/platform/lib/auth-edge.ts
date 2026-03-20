import { jwtVerify } from 'jose';
import type { Session } from './auth';

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET environment variable is required');
  return new TextEncoder().encode(secret);
}

export async function verifySessionEdge(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      roleId: payload.roleId as string,
      roleSlug: payload.roleSlug as string,
    };
  } catch (err) {
    // Log the reason for verification failure (visible in Vercel function logs)
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('AUTH_SECRET')) {
      console.error('[auth-edge] verifySessionEdge failed: AUTH_SECRET is not configured');
    }
    return null;
  }
}

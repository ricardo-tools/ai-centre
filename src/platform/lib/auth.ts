import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

export interface Session {
  userId: string;
  email: string;
  roleId: string;
  roleSlug: string;
}

const COOKIE_NAME = 'auth-token';
const JWT_EXPIRY = '7d';

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET environment variable is required');
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: string, email: string, roleId: string, roleSlug: string): Promise<void> {
  const token = await new SignJWT({ userId, email, roleId, roleSlug })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRY)
    .setIssuedAt()
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

const DEV_IDENTITY_COOKIE = 'dev-identity';

export async function getSession(): Promise<Session | null> {
  if (process.env.NODE_ENV === 'development') {
    const cookieStore = await cookies();
    const devIdentity = cookieStore.get(DEV_IDENTITY_COOKIE)?.value;
    if (devIdentity) {
      try {
        const parsed = JSON.parse(decodeURIComponent(devIdentity));
        return {
          userId: parsed.userId ?? 'dev',
          email: parsed.email ?? 'dev@local',
          roleId: parsed.roleId ?? 'dev-admin-role',
          roleSlug: parsed.roleSlug ?? 'admin',
        };
      } catch { /* fall through */ }
    }
    return { userId: 'dev', email: 'dev@local', roleId: 'dev-admin-role', roleSlug: 'admin' };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      roleId: payload.roleId as string,
      roleSlug: payload.roleSlug as string,
    };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

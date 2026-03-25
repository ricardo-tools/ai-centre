import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { hasDatabase } from '@/platform/db/client';

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

// Cached role slug→UUID map — looked up once from DB, reused for all dev sessions
const cachedRoleIds: Record<string, string> = {};

async function getRoleId(slug: string): Promise<string> {
  if (cachedRoleIds[slug]) return cachedRoleIds[slug];
  if (!hasDatabase()) return '00000000-0000-0000-0000-000000000001';
  try {
    const { getDb } = await import('@/platform/db/client');
    const { roles } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();
    const [row] = await db.select({ id: roles.id }).from(roles).where(eq(roles.slug, slug)).limit(1);
    cachedRoleIds[slug] = row?.id ?? '00000000-0000-0000-0000-000000000001';
  } catch {
    cachedRoleIds[slug] = '00000000-0000-0000-0000-000000000001';
  }
  return cachedRoleIds[slug];
}

export async function getSession(): Promise<Session | null> {
  if (process.env.SKIP_AUTH === 'true') {
    const cookieStore = await cookies();
    const devIdentity = cookieStore.get(DEV_IDENTITY_COOKIE)?.value;
    if (devIdentity) {
      try {
        const parsed = JSON.parse(decodeURIComponent(devIdentity));
        const roleSlug = parsed.roleSlug ?? 'admin';
        const roleId = await getRoleId(roleSlug);
        return {
          userId: parsed.userId ?? '00000000-0000-0000-0000-000000000000',
          email: parsed.email ?? 'dev@local',
          roleId,
          roleSlug,
        };
      } catch { /* fall through */ }
    }
    const roleId = await getRoleId('admin');
    return { userId: '00000000-0000-0000-0000-000000000000', email: 'dev@local', roleId, roleSlug: 'admin' };
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

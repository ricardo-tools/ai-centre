import { NextResponse, type NextRequest } from 'next/server';
import { SignJWT } from 'jose';

/**
 * POST /api/debug/session — Create a debug session cookie.
 * Requires x-debug-key header matching DEBUG_API_KEY.
 * Returns a Set-Cookie header with a valid auth-token.
 */
export async function POST(request: NextRequest) {
  const debugKey = request.headers.get('x-debug-key');
  if (!debugKey || !process.env.DEBUG_API_KEY || debugKey !== process.env.DEBUG_API_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!process.env.AUTH_SECRET) {
    return NextResponse.json({ error: 'AUTH_SECRET not configured' }, { status: 500 });
  }

  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  const token = await new SignJWT({
    userId: '00000000-0000-0000-0000-000000000000',
    email: 'debug@ai-centre.local',
    roleId: '00000000-0000-0000-0000-000000000001',
    roleSlug: 'admin',
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .setIssuedAt()
    .sign(secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 3600,
  });

  return response;
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { verifySessionEdge } from '@/platform/lib/auth-edge';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dev bypass: only when EXPLICITLY opted in via env var (never set this in production)
  if (process.env.SKIP_AUTH === 'true') {
    return NextResponse.next();
  }

  // Fail closed: if AUTH_SECRET is not configured in production, block all access
  if (!process.env.AUTH_SECRET) {
    console.error('[middleware] CRITICAL: AUTH_SECRET is not set in production. Blocking all requests.');
    return new NextResponse('Service unavailable — authentication not configured', { status: 503 });
  }

  // Debug endpoints: allow with API key header (works in all environments)
  if (pathname.startsWith('/api/debug') || pathname === '/api/logs') {
    const debugKey = request.headers.get('x-debug-key');
    if (debugKey && process.env.DEBUG_API_KEY && debugKey === process.env.DEBUG_API_KEY) {
      return NextResponse.next();
    }
  }

  // Debug session cookie bypass: allow all pages when debug-authed
  // (debug sessions use a known userId that maps to no real user)
  if (process.env.DEBUG_API_KEY) {
    const debugKey = request.headers.get('x-debug-key');
    if (debugKey && debugKey === process.env.DEBUG_API_KEY) {
      return NextResponse.next();
    }
  }

  if (
    pathname === '/login' ||
    pathname === '/robots.txt' ||
    pathname === '/api/health' ||
    pathname === '/api/debug' ||
    pathname === '/api/skills/catalog' ||
    pathname === '/api/skills/search' ||
    pathname === '/api/shares/link' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/webhooks/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logos/')
  ) {
    return NextResponse.next();
  }

  // OAuth Bearer token support for API routes (Flow CLI access).
  // Access tokens are signed with AUTH_SECRET and carry { userId, type: 'access' }.
  if (pathname.startsWith('/api/')) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const bearerToken = authHeader.slice('Bearer '.length).trim();
      try {
        const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
        const { payload } = await jwtVerify(bearerToken, secret);
        if (payload.type === 'access' && typeof payload.userId === 'string') {
          return NextResponse.next();
        }
      } catch {
        // Invalid/expired bearer — fall through to cookie check
      }
    }
  }

  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    console.log('[middleware] path:', pathname, 'has token: false — redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  let session;
  try {
    session = await verifySessionEdge(token);
  } catch (err) {
    console.error('[middleware] verifySessionEdge threw unexpectedly:', err);
    session = null;
  }

  if (!session) {
    console.log('[middleware] path:', pathname, 'has token: true, session valid: false — redirecting to /login');
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }

  // Admin route protection — defense-in-depth (actions also check permissions)
  if (pathname.startsWith('/admin') && session.roleSlug !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|logos/|favicon\\.svg).*)'],
};

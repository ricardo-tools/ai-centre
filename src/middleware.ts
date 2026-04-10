import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
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

  if (
    pathname === '/login' ||
    pathname === '/robots.txt' ||
    pathname === '/api/health' ||
    pathname === '/api/debug' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/logos/')
  ) {
    return NextResponse.next();
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

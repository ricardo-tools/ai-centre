/**
 * Template files injected into every showcase deployment.
 *
 * These are STRING constants — they become real files in the deployed project.
 * The deployed project has its own `jose` dependency and env vars.
 */

// ── Middleware Template ────────────────────────────────────────────

const MIDDLEWARE_TEMPLATE = `\
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const AUTH_COOKIE = 'showcase-auth';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Fail closed: if JWT_SECRET is not configured, block everything
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.warn('[showcase-middleware] blocked:', { reason: 'JWT_SECRET not configured', url: url.pathname });
    return new Response(BLOCKED_HTML, { status: 403, headers: { 'Content-Type': 'text/html' } });
  }

  const secret = new TextEncoder().encode(jwtSecret);

  // Check 1: token in URL query param (initial load from AI Centre iframe)
  const token = url.searchParams.get('token');
  if (token) {
    try {
      await jwtVerify(token, secret);
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'invalid token';
      console.warn('[showcase-middleware] blocked:', { reason, url: url.pathname });
      return new Response(BLOCKED_HTML, { status: 403, headers: { 'Content-Type': 'text/html' } });
    }

    // Token valid — set auth cookie so subsequent requests (sub-routes, assets) work
    const allowedOrigins = process.env.ALLOWED_ORIGINS ?? "'self'";
    const response = NextResponse.next();
    response.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',  // needed for cross-origin iframe
      maxAge: 300,        // 5 minutes — matches JWT expiry
      path: '/',
    });
    response.headers.set('Content-Security-Policy', \`frame-ancestors \${allowedOrigins}\`);
    response.headers.delete('X-Frame-Options');
    response.headers.set('Cache-Control', 'private, no-store, no-cache, must-revalidate');
    response.headers.set('x-showcase-auth', 'verified');
    return response;
  }

  // Check 2: auth cookie (subsequent requests — sub-routes, assets, _next bundles)
  const cookieToken = request.cookies.get(AUTH_COOKIE)?.value;
  if (cookieToken) {
    try {
      await jwtVerify(cookieToken, secret);
      const allowedOrigins = process.env.ALLOWED_ORIGINS ?? "'self'";
      const response = NextResponse.next();
      response.headers.set('Content-Security-Policy', \`frame-ancestors \${allowedOrigins}\`);
      response.headers.delete('X-Frame-Options');
      return response;
    } catch {
      // Cookie expired — fall through to blocked
    }
  }

  // No valid token or cookie — blocked
  console.warn('[showcase-middleware] blocked:', { reason: 'no valid token or session', url: url.pathname });
  return new Response(BLOCKED_HTML, { status: 403, headers: { 'Content-Type': 'text/html' } });
}

const BLOCKED_HTML = \`<!DOCTYPE html>
<html>
<head><title>Access Denied</title></head>
<body style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:sans-serif;background:#111;color:#fff;">
  <div style="text-align:center;">
    <h1>403</h1>
    <p>This preview is only available within AI Centre</p>
  </div>
</body>
</html>\`;

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\\\.ico).*)'],
};
`;

// ── Vercel JSON Template ───────────────────────────────────────────

const VERCEL_JSON_TEMPLATE = JSON.stringify({
  framework: 'nextjs',
  headers: [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: '' },
      ],
    },
  ],
}, null, 2);

// ── Public API ─────────────────────────────────────────────────────

export function getTemplateFiles(hasSrcDir: boolean): Record<string, string> {
  const middlewarePath = hasSrcDir ? 'src/middleware.ts' : 'middleware.ts';
  return {
    [middlewarePath]: MIDDLEWARE_TEMPLATE,
    'vercel.json': VERCEL_JSON_TEMPLATE,
  };
}

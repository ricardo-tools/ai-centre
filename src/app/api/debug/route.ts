import { NextResponse, type NextRequest } from 'next/server';

/**
 * GET /api/debug — Basic env diagnostics (safe info only, no auth needed).
 * GET /api/debug?detail=true + x-debug-key header — Full diagnostics including log buffer stats.
 */

export async function GET(request: NextRequest) {
  const basic = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV ?? '(not set)',
      VERCEL_URL: process.env.VERCEL_URL ?? '(not set)',
      AUTH_SECRET_SET: !!process.env.AUTH_SECRET,
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      BLOB_TOKEN_SET: !!process.env.BLOB_READ_WRITE_TOKEN,
      DEBUG_API_KEY_SET: !!process.env.DEBUG_API_KEY,
      SKIP_AUTH: process.env.SKIP_AUTH ?? '(not set)',
    },
  };

  // Extended diagnostics require the debug key
  const debugKey = request.headers.get('x-debug-key');
  const isDebugAuthed = !!(debugKey && process.env.DEBUG_API_KEY && debugKey === process.env.DEBUG_API_KEY);

  if (!isDebugAuthed || request.nextUrl.searchParams.get('detail') !== 'true') {
    return NextResponse.json(basic);
  }

  // Import log buffer stats
  const { getServerLogs } = await import('@/platform/lib/server-logs');
  const allLogs = getServerLogs({ limit: 1000 });
  const errorCount = allLogs.filter(l => l.level === 'error').length;
  const warnCount = allLogs.filter(l => l.level === 'warn').length;
  const lastError = allLogs.find(l => l.level === 'error');

  return NextResponse.json({
    ...basic,
    logCapture: {
      active: true,
      totalEntries: allLogs.length,
      errors: errorCount,
      warnings: warnCount,
      lastError: lastError ? { message: lastError.message.slice(0, 200), at: lastError.timestamp } : null,
    },
    env: {
      ...basic.env,
      MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN ?? '(not set)',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? '(not set)',
      OPENROUTER_KEY_SET: !!process.env.OPENROUTER_API_KEY,
      ANTHROPIC_KEY_SET: !!process.env.ANTHROPIC_API_KEY,
      VERCEL_SHOWCASE_TOKEN_SET: !!process.env.VERCEL_SHOWCASE_TOKEN,
      SHOWCASE_JWT_SECRET_SET: !!process.env.SHOWCASE_JWT_SECRET,
    },
  });
}

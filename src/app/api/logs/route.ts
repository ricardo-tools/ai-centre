import { NextResponse, type NextRequest } from 'next/server';
import { getServerLogs, clearServerLogs, type LogLevel } from '@/platform/lib/server-logs';

/**
 * GET /api/logs — Query server-side console logs (dev only).
 *
 * Query params:
 *   level  — filter by debug|info|log|warn|error
 *   since  — ISO timestamp, only logs after this time
 *   limit  — max entries (default 100)
 *   search — substring match in message
 *
 * POST /api/logs — Clear the log buffer.
 */

const VALID_LEVELS: LogLevel[] = ['debug', 'info', 'log', 'warn', 'error'];

export async function GET(request: NextRequest) {
  if (process.env.SKIP_AUTH !== 'true') {
    return NextResponse.json({ error: 'Forbidden — dev only' }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const levelParam = searchParams.get('level');
  const level = levelParam && VALID_LEVELS.includes(levelParam as LogLevel)
    ? (levelParam as LogLevel)
    : undefined;
  const since = searchParams.get('since') ?? undefined;
  const limit = parseInt(searchParams.get('limit') ?? '100', 10);
  const search = searchParams.get('search') ?? undefined;

  const logs = getServerLogs({ level, since, limit, search });

  return NextResponse.json({ count: logs.length, logs });
}

export async function POST(request: NextRequest) {
  if (process.env.SKIP_AUTH !== 'true') {
    return NextResponse.json({ error: 'Forbidden — dev only' }, { status: 403 });
  }

  clearServerLogs();
  return NextResponse.json({ ok: true, message: 'Log buffer cleared' });
}

/**
 * In-memory ring buffer for server-side logs.
 * Only active when SKIP_AUTH=true (local dev).
 * Uses globalThis to share state across module boundaries (Next.js bundles
 * instrumentation.ts and API routes separately).
 *
 * Captures all levels: debug, info, log, warn, error.
 * In dev/test, console.debug is enabled so you get full tracing.
 */

export type LogLevel = 'debug' | 'info' | 'log' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
}

const MAX_ENTRIES = 1000;

// globalThis survives across module re-imports within the same Node.js process
const g = globalThis as typeof globalThis & {
  __devLogBuffer?: LogEntry[];
  __devLogPatched?: boolean;
};

function getBuffer(): LogEntry[] {
  if (!g.__devLogBuffer) g.__devLogBuffer = [];
  return g.__devLogBuffer;
}

function push(level: LogLevel, args: unknown[]) {
  const buffer = getBuffer();
  const message = args
    .map((a) => {
      if (a instanceof Error) return `${a.message}\n${a.stack}`;
      if (typeof a === 'object') {
        try { return JSON.stringify(a, null, 2); } catch { return String(a); }
      }
      return String(a);
    })
    .join(' ');

  buffer.push({ level, message, timestamp: new Date().toISOString() });
  if (buffer.length > MAX_ENTRIES) buffer.shift();
}

/** Patch console once — call from instrumentation.ts.
 *  Active when SKIP_AUTH=true (dev) OR DEBUG_API_KEY is set (prod debugging). */
export function installLogCapture() {
  if (g.__devLogPatched) return;
  if (process.env.SKIP_AUTH !== 'true' && !process.env.DEBUG_API_KEY) return;
  g.__devLogPatched = true;

  const origDebug = console.debug;
  const origInfo = console.info;
  const origLog = console.log;
  const origWarn = console.warn;
  const origError = console.error;

  console.debug = (...args: unknown[]) => { push('debug', args); origDebug.apply(console, args); };
  console.info = (...args: unknown[]) => { push('info', args); origInfo.apply(console, args); };
  console.log = (...args: unknown[]) => { push('log', args); origLog.apply(console, args); };
  console.warn = (...args: unknown[]) => { push('warn', args); origWarn.apply(console, args); };
  console.error = (...args: unknown[]) => { push('error', args); origError.apply(console, args); };
}

/** Get recent logs, optionally filtered */
export function getServerLogs(opts?: {
  level?: LogLevel;
  since?: string;
  limit?: number;
  search?: string;
}): LogEntry[] {
  let result = [...getBuffer()];

  if (opts?.level) {
    result = result.filter((e) => e.level === opts.level);
  }
  if (opts?.since) {
    const since = opts.since;
    result = result.filter((e) => e.timestamp >= since);
  }
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    result = result.filter((e) => e.message.toLowerCase().includes(q));
  }

  // Most recent first
  result.reverse();

  if (opts?.limit) {
    result = result.slice(0, opts.limit);
  }

  return result;
}

/** Clear the buffer */
export function clearServerLogs() {
  const buffer = getBuffer();
  buffer.length = 0;
}

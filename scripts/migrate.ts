#!/usr/bin/env npx tsx
/**
 * Build-time migration script.
 *
 * Runs ONCE during `next build` (before any serverless functions start),
 * avoiding the race condition where multiple Vercel cold starts try to
 * migrate the same database simultaneously.
 *
 * Order: pre-migration resets → Drizzle SQL migrations
 * Seeds still run at runtime (instrumentation.ts) since they're idempotent.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local for local dev (Vercel provides env vars natively)
function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* no .env.local — rely on env vars */ }
}

loadEnvFile();

async function main() {
  const { runPreMigrationResets, runMigrations } = await import('../src/platform/lib/migrate');

  console.log('[build:migrate] Starting build-time database migration...');

  await runPreMigrationResets();
  await runMigrations();

  console.log('[build:migrate] Done.');
}

main().catch(err => {
  console.error('[build:migrate] Failed:', err);
  process.exit(1);
});

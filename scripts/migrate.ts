#!/usr/bin/env npx tsx
/**
 * Build-time migration script.
 *
 * 1. One-shot pre-migration reset (if needed) — drops schemas for clean rebuild
 * 2. Drizzle SQL migrations via drizzle-kit
 *
 * Runs ONCE during build, before any serverless functions start.
 * Seeds run at runtime in instrumentation.ts (idempotent).
 *
 * This script is standalone — no @/ path aliases, no Next.js dependencies.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// One-shot reset (tracked in __pre_migrations__ table)
// ---------------------------------------------------------------------------
const RESET_TAG = '0003_reset_db_v4';

async function runResetIfNeeded(
  query: (sql: string, params?: unknown[]) => Promise<unknown[]>,
  isLocal: boolean,
): Promise<boolean> {
  console.log(`[pre-migrate] Checking reset tag: ${RESET_TAG}`);

  await query('CREATE TABLE IF NOT EXISTS "__pre_migrations__" (id SERIAL PRIMARY KEY, tag TEXT NOT NULL UNIQUE, applied_at TIMESTAMP NOT NULL DEFAULT NOW())');
  console.log('[pre-migrate] Tracking table ready');

  const applied = await query(
    'SELECT tag FROM "__pre_migrations__" WHERE tag = $1',
    [RESET_TAG],
  );
  console.log(`[pre-migrate] Tag lookup result: ${(applied as unknown[]).length} row(s)`);
  if ((applied as unknown[]).length > 0) {
    console.log('[pre-migrate] Reset already applied — skipping');
    return false;
  }

  console.log(`[pre-migrate] Running: ${RESET_TAG} — dropping all schemas for clean rebuild`);

  await query('DROP SCHEMA IF EXISTS public CASCADE');
  await query('CREATE SCHEMA public');
  await query('DROP SCHEMA IF EXISTS drizzle CASCADE');

  if (!isLocal) {
    await query('CREATE EXTENSION IF NOT EXISTS vector');
  }

  await query('CREATE TABLE IF NOT EXISTS "__pre_migrations__" (id SERIAL PRIMARY KEY, tag TEXT NOT NULL UNIQUE, applied_at TIMESTAMP NOT NULL DEFAULT NOW())');
  await query('INSERT INTO "__pre_migrations__" (tag) VALUES ($1)', [RESET_TAG]);

  console.log(`[pre-migrate] ${RESET_TAG} complete — all tables dropped, migrations will re-apply`);
  return true;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.log('[build:migrate] No DATABASE_URL — skipping');
    return;
  }

  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  console.log(`[build:migrate] Target: ${isLocal ? 'local Postgres' : 'remote Neon'}`);

  // --- Pre-migration reset ---
  if (isLocal) {
    const { default: pg } = await import('pg');
    const pool = new pg.Pool({ connectionString: dbUrl });
    await runResetIfNeeded(
      (q, p) => pool.query(q, p).then(r => r.rows),
      true,
    );
    await pool.end();
  } else {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(dbUrl);
    await runResetIfNeeded(
      (q, p) => sql(q, (p ?? []) as unknown[]) as Promise<unknown[]>,
      false,
    );
  }

  // --- Drizzle migrations (via drizzle-kit CLI) ---
  console.log('[build:migrate] Running drizzle-kit migrate...');
  const { execSync } = await import('child_process');
  execSync('npx drizzle-kit migrate', { stdio: 'inherit' });

  console.log('[build:migrate] Done.');
}

main().catch(err => {
  console.error('[build:migrate] Failed:', err);
  process.exit(1);
});

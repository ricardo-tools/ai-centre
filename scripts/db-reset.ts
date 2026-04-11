#!/usr/bin/env npx tsx
/**
 * Database reset script — drops all tables and schemas, so the next server
 * startup re-applies all Drizzle SQL migrations + code seeds from scratch.
 *
 * Works for both local Postgres and remote Neon databases.
 *
 * Usage:
 *   npx tsx scripts/db-reset.ts              # uses DATABASE_URL from .env.local
 *   DATABASE_URL=... npx tsx scripts/db-reset.ts   # explicit connection string
 *
 * After running, start the dev server (`npm run dev`) or redeploy to Vercel —
 * instrumentation.ts will run all migrations and seeds automatically.
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually (no dotenv dependency)
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
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set. Add it to .env.local or pass it directly.');
    process.exit(1);
  }

  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  console.log(`[db-reset] Target: ${isLocal ? 'local Postgres' : 'remote Neon'}`);
  console.log(`[db-reset] URL: ${dbUrl.replace(/\/\/.*@/, '//***@')}`);

  // Safety prompt for remote databases
  if (!isLocal) {
    const readline = await import('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise<string>(resolve => {
      rl.question('[db-reset] WARNING: This will destroy ALL data in the remote database. Type "yes" to confirm: ', resolve);
    });
    rl.close();
    if (answer.trim().toLowerCase() !== 'yes') {
      console.log('[db-reset] Aborted.');
      process.exit(0);
    }
  }

  // pgvector only available on Neon, not local Docker Postgres
  const resetStatements = [
    'DROP SCHEMA IF EXISTS public CASCADE',
    'CREATE SCHEMA public',
    'DROP SCHEMA IF EXISTS drizzle CASCADE',
    ...(isLocal ? [] : ['CREATE EXTENSION IF NOT EXISTS vector']),
  ];

  console.log('[db-reset] Dropping all schemas...');

  if (isLocal) {
    const { default: pg } = await import('pg');
    const pool = new pg.Pool({ connectionString: dbUrl });
    for (const stmt of resetStatements) {
      await pool.query(stmt);
    }
    await pool.end();
  } else {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(dbUrl);
    for (const stmt of resetStatements) {
      await sql(stmt);
    }
  }

  console.log('[db-reset] Done. All tables and migration history cleared.');
  console.log('[db-reset] Next server start will re-apply all migrations and seeds.');
}

main().catch(err => {
  console.error('[db-reset] Failed:', err);
  process.exit(1);
});

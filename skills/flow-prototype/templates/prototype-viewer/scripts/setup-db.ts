/**
 * Idempotent database setup script.
 * Creates the SQLite file + all tables if they don't exist.
 *
 * Runs automatically via `predev` script in package.json.
 * Safe to run repeatedly — all statements are IF NOT EXISTS.
 *
 * Usage: tsx scripts/setup-db.ts
 */

import { createClient } from '@libsql/client';
import { SCHEMA_STATEMENTS } from '../src/db/schema';

const url = process.env.TURSO_DATABASE_URL ?? 'file:data/prototype-viewer.db';

async function main() {
  console.log(`[setup-db] Connecting to ${url}`);

  const db = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  for (const sql of SCHEMA_STATEMENTS) {
    await db.execute(sql);
  }

  console.log(`[setup-db] Schema ready (${SCHEMA_STATEMENTS.length} statements)`);
}

main().catch((err) => {
  console.error('[setup-db] Failed:', err);
  process.exit(1);
});

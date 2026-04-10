import { join } from 'path';
import { existsSync } from 'fs';

export async function runMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.log('[migrate] No DATABASE_URL — skipping migrations');
    return;
  }

  const dbUrl = process.env.DATABASE_URL;
  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

  // Local Postgres: schema is pushed by drizzle-kit push in dev script — skip migrations
  if (isLocal) {
    console.log('[migrate] Local Postgres detected — schema managed by drizzle-kit push');
    return;
  }

  // Remote (Neon): run migrations using the Neon HTTP driver
  const started = Date.now();
  console.log('[migrate] Running pending migrations...');

  const candidates = [
    join(process.cwd(), 'src/platform/db/migrations'),
    join(process.cwd(), '.next/server/src/platform/db/migrations'),
  ];

  const migrationsFolder = candidates.find(p => existsSync(p));

  if (!migrationsFolder) {
    console.log('[migrate] Migrations folder not found — skipping');
    return;
  }

  console.log(`[migrate] Using migrations from: ${migrationsFolder}`);

  try {
    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');
    const { migrate } = await import('drizzle-orm/neon-http/migrator');

    const sql = neon(dbUrl);
    const db = drizzle(sql);

    // Ensure pgvector extension is available (needed for feedback RAG embeddings)
    await sql('CREATE EXTENSION IF NOT EXISTS vector');

    await migrate(db, { migrationsFolder });

    // Log migration status for visibility
    try {
      const rows = await sql('SELECT hash, created_at FROM __drizzle_migrations__ ORDER BY created_at DESC LIMIT 5');
      console.log(`[migrate] Migrations complete (${Date.now() - started}ms) — ${rows.length} applied, latest: ${rows[0]?.hash ?? 'none'}`);
    } catch {
      console.log(`[migrate] Migrations complete (${Date.now() - started}ms) — status table not readable`);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('already exists')) {
      console.log('[migrate] Tables already exist — skipping');
      return;
    }
    console.error('[migrate] Migration failed:', msg);
  }
}

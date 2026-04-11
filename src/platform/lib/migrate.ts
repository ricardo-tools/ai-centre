import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Run one-shot pre-migration resets (e.g. drop all schemas for clean rebuild).
 * These run BEFORE Drizzle migrations and track themselves in a separate
 * `__pre_migrations__` table that survives schema drops.
 */
export async function runPreMigrationResets(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return;

  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  const { runResetIfNeeded } = await import('@/platform/db/seeds/0000_reset_db');

  if (isLocal) {
    const { Pool } = await import('pg');
    const pool = new Pool({ connectionString: dbUrl });
    const didReset = await runResetIfNeeded(
      (q, p) => pool.query(q, p).then(r => r.rows),
      true,
    );
    await pool.end();
    if (didReset) console.log('[pre-migrate] Local DB reset complete');
  } else {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(dbUrl);
    const didReset = await runResetIfNeeded(
      (q, p) => sql(q, p as unknown[]) as Promise<unknown[]>,
      false,
    );
    if (didReset) console.log('[pre-migrate] Remote DB reset complete');
  }
}

export async function runMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.log('[migrate] No DATABASE_URL — skipping migrations');
    return;
  }

  const dbUrl = process.env.DATABASE_URL;
  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');

  // Remote (Neon) or Local Postgres: run migrations
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
    if (isLocal) {
      const { Pool } = await import('pg');
      const { drizzle } = await import('drizzle-orm/node-postgres');
      const { migrate } = await import('drizzle-orm/node-postgres/migrator');
      const pool = new Pool({ connectionString: dbUrl });
      const db = drizzle(pool);
      await migrate(db, { migrationsFolder });
      await pool.end();
    } else {
      const { neon } = await import('@neondatabase/serverless');
      const { drizzle } = await import('drizzle-orm/neon-http');
      const { migrate } = await import('drizzle-orm/neon-http/migrator');

      const sql = neon(dbUrl);
      const db = drizzle(sql);

      // Ensure pgvector extension is available (needed for feedback RAG embeddings)
      await sql('CREATE EXTENSION IF NOT EXISTS vector');

      await migrate(db, { migrationsFolder });
    }

    console.log(`[migrate] Migrations complete (${Date.now() - started}ms)`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[migrate] Migration failed:', msg);
    throw err;
  }
}

export async function runSeedsFromInstrumentation(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return;

  const isLocal = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
  const { runSeeds } = await import('@/platform/db/seeds/runner');

  if (isLocal) {
    const { Pool } = await import('pg');
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const pool = new Pool({ connectionString: dbUrl });
    const db = drizzle(pool);
    await runSeeds(db, (q, p) => pool.query(q, p).then(r => r.rows));
    await pool.end();
  } else {
    const { neon } = await import('@neondatabase/serverless');
    const { drizzle } = await import('drizzle-orm/neon-http');
    const sql = neon(dbUrl);
    const db = drizzle(sql);
    await runSeeds(db, (q, p) => sql(q, p as unknown[]) as Promise<unknown[]>);
  }
}

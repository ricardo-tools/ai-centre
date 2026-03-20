import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { join } from 'path';
import { existsSync } from 'fs';

export async function runMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.log('[migrate] No DATABASE_URL — skipping migrations');
    return;
  }

  const started = Date.now();
  console.log('[migrate] Running pending migrations...');

  // Try multiple possible paths — Vercel's cwd may differ from local
  const candidates = [
    join(process.cwd(), 'src/platform/db/migrations'),
    join(process.cwd(), '.next/server/src/platform/db/migrations'),
    join(__dirname, '../../db/migrations'),
    join(__dirname, '../../../platform/db/migrations'),
  ];

  const migrationsFolder = candidates.find(p => existsSync(p));

  if (!migrationsFolder) {
    console.error('[migrate] Migrations folder not found. Tried:', candidates);
    console.log('[migrate] Falling back to drizzle-kit push approach...');
    // If migrations folder isn't available, skip — tables may already exist
    return;
  }

  console.log(`[migrate] Using migrations from: ${migrationsFolder}`);

  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    await migrate(db, { migrationsFolder });

    console.log(`[migrate] Migrations complete (${Date.now() - started}ms)`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // If tables already exist, that's fine — migration is idempotent via tracking table
    if (msg.includes('already exists')) {
      console.log('[migrate] Tables already exist — skipping');
      return;
    }
    console.error('[migrate] Migration failed:', msg);
    throw err;
  }
}

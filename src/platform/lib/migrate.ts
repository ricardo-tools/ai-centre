import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { join } from 'path';

export async function runMigrations(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    console.log('[migrate] No DATABASE_URL — skipping migrations');
    return;
  }

  const started = Date.now();
  console.log('[migrate] Running pending migrations...');

  try {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);

    await migrate(db, {
      migrationsFolder: join(process.cwd(), 'src/platform/db/migrations'),
    });

    console.log(`[migrate] Migrations complete (${Date.now() - started}ms)`);
  } catch (err) {
    console.error('[migrate] Migration failed:', err instanceof Error ? err.message : err);
    throw err; // Migrations are critical — don't swallow the error
  }
}

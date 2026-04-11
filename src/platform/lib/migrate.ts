/**
 * Runtime seed runner — called from instrumentation.ts on each cold start.
 * Migrations now run at build time via scripts/migrate.ts + drizzle-kit.
 */
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

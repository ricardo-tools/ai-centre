/**
 * Seed 0000: One-shot database reset.
 *
 * Drops all schemas so Drizzle migrations and subsequent seeds re-apply
 * from scratch. This seed is special — it runs BEFORE migrations in
 * instrumentation.ts, not in the normal seed runner. After running, it
 * records itself in a lightweight tracking table so it never runs again.
 *
 * To trigger a fresh reset in a future deploy, create a new 0000-style
 * seed with a different tag.
 */

export const RESET_TAG = '0000_reset_db';

export async function runResetIfNeeded(
  query: (sql: string, params?: unknown[]) => Promise<unknown[]>,
  isLocal: boolean,
): Promise<boolean> {
  console.log(`[pre-migrate] Checking reset tag: ${RESET_TAG}`);

  // Create tracking table if it doesn't exist (survives across resets
  // because we check BEFORE dropping)
  // Single-line SQL — Neon HTTP driver rejects multi-line as "multiple commands"
  await query('CREATE TABLE IF NOT EXISTS "__pre_migrations__" (id SERIAL PRIMARY KEY, tag TEXT NOT NULL UNIQUE, applied_at TIMESTAMP NOT NULL DEFAULT NOW())');
  console.log('[pre-migrate] Tracking table ready');

  // Check if this reset has already run
  const applied = await query(
    'SELECT tag FROM "__pre_migrations__" WHERE tag = $1',
    [RESET_TAG],
  );
  console.log(`[pre-migrate] Tag lookup result: ${(applied as unknown[]).length} row(s)`);
  if ((applied as unknown[]).length > 0) {
    console.log('[pre-migrate] Reset already applied — skipping');
    return false; // Already applied
  }

  console.log(`[pre-migrate] Running: ${RESET_TAG} — dropping all schemas for clean rebuild`);

  // Drop everything
  await query('DROP SCHEMA IF EXISTS public CASCADE');
  await query('CREATE SCHEMA public');
  await query('DROP SCHEMA IF EXISTS drizzle CASCADE');

  // pgvector only on Neon
  if (!isLocal) {
    await query('CREATE EXTENSION IF NOT EXISTS vector');
  }

  // Re-create tracking table (it was just dropped with public schema)
  await query('CREATE TABLE IF NOT EXISTS "__pre_migrations__" (id SERIAL PRIMARY KEY, tag TEXT NOT NULL UNIQUE, applied_at TIMESTAMP NOT NULL DEFAULT NOW())');

  // Record that this reset ran
  await query('INSERT INTO "__pre_migrations__" (tag) VALUES ($1)', [RESET_TAG]);

  console.log(`[pre-migrate] ${RESET_TAG} complete — all tables dropped, migrations will re-apply`);
  return true;
}

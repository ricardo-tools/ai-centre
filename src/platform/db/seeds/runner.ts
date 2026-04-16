/**
 * Versioned seed runner — same concept as schema migrations but for data.
 *
 * Each seed is a numbered file (0001_name.ts) that exports a `run(db)` function.
 * The runner tracks which seeds have been applied in a `__seed_migrations__` table.
 * On startup it runs any unapplied seeds in order, then records them.
 *
 * Add new seeds incrementally — they only run once per environment.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type SeedDb = NeonHttpDatabase | NodePgDatabase;

export interface Seed {
  tag: string;
  run: (db: SeedDb) => Promise<void>;
}

// Registry — import each seed and list here in order.
// New seeds are added to the end of this array.
import { seed as seed0001 } from './0001_roles_and_admin';
import { seed as seed0002 } from './0002_skills';
import { seed as seed0003 } from './0003_dev_user';
import { seed as seed0004 } from './0004_skill_embeddings';

const SEEDS: Seed[] = [
  seed0001,
  seed0002,
  seed0003,
  seed0004,
];

export async function runSeeds(db: SeedDb, query: (sql: string, params?: unknown[]) => Promise<unknown[]>): Promise<void> {
  // Ensure tracking table exists (single-line for Neon HTTP driver compatibility)
  await query('CREATE TABLE IF NOT EXISTS "__seed_migrations__" (id SERIAL PRIMARY KEY, tag TEXT NOT NULL UNIQUE, applied_at TIMESTAMP NOT NULL DEFAULT NOW())');

  // Get already-applied seeds
  const applied = await query('SELECT tag FROM "__seed_migrations__" ORDER BY id');
  const appliedSet = new Set((applied as { tag: string }[]).map(r => r.tag));

  let ran = 0;
  for (const seed of SEEDS) {
    if (appliedSet.has(seed.tag)) continue;

    console.log(`[seed] Running: ${seed.tag}`);
    await seed.run(db);
    await query('INSERT INTO "__seed_migrations__" (tag) VALUES ($1)', [seed.tag]);
    ran++;
  }

  if (ran > 0) {
    console.log(`[seed] Applied ${ran} seed(s)`);
  } else {
    console.log('[seed] All seeds already applied');
  }
}

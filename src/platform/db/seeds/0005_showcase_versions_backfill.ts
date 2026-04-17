/**
 * Seed 0005: Backfill showcase_versions for existing showcases.
 *
 * Creates a version 1 entry for every non-archived showcase that doesn't
 * already have a version record. Idempotent — safe to run multiple times.
 */

import type { Seed, SeedDb } from './runner';

async function run(db: SeedDb): Promise<void> {
  const { showcaseUploads, showcaseVersions } = await import('../schema');
  const { eq: eqOp, and } = await import('drizzle-orm');

  // Get all non-archived showcases
  const showcases = await (db as any).select({
    id: showcaseUploads.id,
    blobUrl: showcaseUploads.blobUrl,
    createdAt: showcaseUploads.createdAt,
  }).from(showcaseUploads)
    .where(eqOp(showcaseUploads.archived, false));

  let migrated = 0;
  let skipped = 0;

  for (const showcase of showcases) {
    // Check if already has versions (idempotent)
    const existing = await (db as any).select({ id: showcaseVersions.id })
      .from(showcaseVersions)
      .where(eqOp(showcaseVersions.showcaseId, showcase.id))
      .limit(1);

    if (existing.length > 0) {
      skipped++;
      continue;
    }

    await (db as any).insert(showcaseVersions).values({
      showcaseId: showcase.id,
      versionNumber: 1,
      blobUrl: showcase.blobUrl,
      commitMessage: 'Initial version',
    });

    migrated++;
  }

  console.log(`[seed:0005] Backfilled ${migrated} showcase versions (${skipped} already versioned)`);
}

export const seed: Seed = { tag: '0005_showcase_versions_backfill', run };

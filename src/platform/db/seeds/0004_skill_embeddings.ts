/**
 * Seed 0004: Skill embeddings.
 *
 * For each skill in the DB, generates a vector embedding via OpenRouter and
 * upserts it into `skill_embeddings`. Enables RAG-based skill matching for
 * the bootstrap flow (Plan 02 Ch 3).
 *
 * Bails silently if OPENROUTER_API_KEY is not set. Marks itself as applied
 * either way so it doesn't block other seeds — if the key is added later,
 * re-run embeddings via the standalone `npm run db:seed` or a dedicated
 * management command.
 */

import type { Seed, SeedDb } from './runner';
import { skills, skillEmbeddings } from '../schema';
import {
  buildEmbeddingText,
  embedText,
  EMBEDDING_MODEL,
  isEmbeddingEnabled,
  serializeVector,
} from '@/platform/lib/embeddings';

async function run(db: SeedDb): Promise<void> {
  if (!isEmbeddingEnabled()) {
    console.warn('[seed:0004] OPENROUTER_API_KEY not set — skipping embedding generation');
    return;
  }

  const { getAllSkills } = await import('@/platform/lib/skills');
  const all = getAllSkills();

  // Load existing skill rows so we can map slug -> id
  const rows = await (db as any).select({ id: skills.id, slug: skills.slug }).from(skills);
  const idBySlug = new Map<string, string>();
  for (const row of rows) idBySlug.set(row.slug, row.id);

  let generated = 0;
  let skipped = 0;

  for (const skill of all) {
    const skillId = idBySlug.get(skill.slug);
    if (!skillId) {
      console.warn(`[seed:0004] No DB row for slug "${skill.slug}" — skipping`);
      skipped++;
      continue;
    }

    const text = buildEmbeddingText({
      name: skill.title,
      description: skill.description,
    });
    if (!text) {
      skipped++;
      continue;
    }

    const vector = await embedText(text);
    if (vector.length === 0) {
      console.warn(`[seed:0004] Empty vector for "${skill.slug}" — skipping`);
      skipped++;
      continue;
    }

    await (db as any).insert(skillEmbeddings).values({
      skillId,
      embedding: serializeVector(vector),
      model: EMBEDDING_MODEL,
    }).onConflictDoUpdate({
      target: skillEmbeddings.skillId,
      set: {
        embedding: serializeVector(vector),
        model: EMBEDDING_MODEL,
        updatedAt: new Date(),
      },
    });

    generated++;
  }

  console.log(`[seed:0004] Generated ${generated} embeddings (${skipped} skipped)`);
}

export const seed: Seed = { tag: '0004_skill_embeddings', run };

/**
 * Unified skill content resolver.
 *
 * In dev without a DB → reads from disk (current behaviour via skills.ts).
 * In production → fetches from DB, preferring Blob URL over inline content.
 */

import { eq } from 'drizzle-orm';
import { skills, skillVersions } from '@/platform/db/schema';

export async function getSkillContent(slug: string): Promise<string | null> {
  // In dev without DB, read from disk (current behaviour)
  if (!process.env.DATABASE_URL) {
    const { getSkillBySlug } = await import('./skills');
    const skill = getSkillBySlug(slug);
    return skill?.content ?? null;
  }

  // In production, fetch from DB (which has the blob URL)
  const { db } = await import('@/platform/db/index');

  const skillRows = await db
    .select()
    .from(skills)
    .where(eq(skills.slug, slug))
    .limit(1);

  if (!skillRows[0]?.currentPublishedVersionId) return null;

  const versionRows = await db
    .select()
    .from(skillVersions)
    .where(eq(skillVersions.id, skillRows[0].currentPublishedVersionId))
    .limit(1);

  if (!versionRows[0]) return null;

  const version = versionRows[0];

  // Prefer blob URL, fall back to inline content
  if (version.contentBlobUrl && !version.contentBlobUrl.startsWith('file://')) {
    try {
      const response = await fetch(version.contentBlobUrl);
      if (response.ok) {
        return response.text();
      }
    } catch {
      // Fall through to inline content on fetch failure
    }
  }

  return version.content;
}

/**
 * Get all skill content as a map of slug → content.
 * Useful for bulk operations where fetching one-by-one is inefficient.
 */
export async function getAllSkillContent(): Promise<Map<string, string>> {
  const contentMap = new Map<string, string>();

  if (!process.env.DATABASE_URL) {
    const { getAllSkills } = await import('./skills');
    for (const skill of getAllSkills()) {
      contentMap.set(skill.slug, skill.content);
    }
    return contentMap;
  }

  const { db } = await import('@/platform/db/index');

  const allSkills = await db
    .select({
      slug: skills.slug,
      currentPublishedVersionId: skills.currentPublishedVersionId,
    })
    .from(skills);

  for (const skill of allSkills) {
    if (!skill.currentPublishedVersionId) continue;

    const versionRows = await db
      .select()
      .from(skillVersions)
      .where(eq(skillVersions.id, skill.currentPublishedVersionId))
      .limit(1);

    if (versionRows[0]) {
      contentMap.set(skill.slug, versionRows[0].content);
    }
  }

  return contentMap;
}

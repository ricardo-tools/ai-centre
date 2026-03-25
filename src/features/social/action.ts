'use server';

import { eq, and, inArray, sql } from 'drizzle-orm';
import { skillDownloads, showcaseViews, reactions, bookmarks, comments } from '@/platform/db/schema';
import { getDb as getDatabase, hasDatabase } from '@/platform/db/client';
import { type Result, Ok, Err } from '@/platform/lib/result';

function getDb() {
  if (!hasDatabase()) return null;
  return getDatabase();
}

export async function trackSkillDownload(
  skillSlug: string,
  context: string = 'detail_download',
): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.insert(skillDownloads).values({ skillSlug, userId: null, context });
  } catch (err) {
    console.error('[social] trackSkillDownload failed:', err);
  }
}

export async function trackShowcaseView(showcaseId: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.insert(showcaseViews).values({ showcaseId, userId: null });
  } catch (err) {
    console.error('[social] trackShowcaseView failed:', err);
  }
}

export async function getSkillDownloadCount(skillSlug: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(skillDownloads)
      .where(eq(skillDownloads.skillSlug, skillSlug));
    return Number(result[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

export async function getShowcaseViewCount(showcaseId: string): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(showcaseViews)
      .where(eq(showcaseViews.showcaseId, showcaseId));
    return Number(result[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

export type BulkSocialSignal = { upvoteCount: number; commentCount: number; isUpvoted: boolean; isBookmarked: boolean };

export async function getBulkSocialSignals(
  entityType: string,
  entityIds: string[],
  userId?: string,
): Promise<Record<string, BulkSocialSignal>> {
  const db = getDb();
  if (!db || entityIds.length === 0) return {};

  try {
    // Bulk fetch all reactions for these entities
    const allReactions = await db
      .select()
      .from(reactions)
      .where(
        and(
          eq(reactions.entityType, entityType),
          inArray(reactions.entityId, entityIds),
        ),
      );

    // Bulk fetch bookmarks for current user
    let userBookmarkSet: Set<string> = new Set();
    if (userId) {
      const bookmarkRows = await db
        .select()
        .from(bookmarks)
        .where(
          and(
            eq(bookmarks.userId, userId),
            eq(bookmarks.entityType, entityType),
            inArray(bookmarks.entityId, entityIds),
          ),
        );
      userBookmarkSet = new Set(bookmarkRows.map((b) => b.entityId));
    }

    // Bulk fetch comment counts
    const allComments = await db
      .select({ entityId: comments.entityId })
      .from(comments)
      .where(
        and(
          eq(comments.entityType, entityType),
          inArray(comments.entityId, entityIds),
        ),
      );

    // Aggregate per entity
    const result: Record<string, BulkSocialSignal> = {};

    for (const id of entityIds) {
      const entityReactions = allReactions.filter((r) => r.entityId === id);
      const upvoteCount = entityReactions.filter((r) => r.emoji === 'thumbsup').length;
      const isUpvoted = userId
        ? entityReactions.some((r) => r.emoji === 'thumbsup' && r.userId === userId)
        : false;
      const commentCount = allComments.filter((c) => c.entityId === id).length;
      result[id] = {
        upvoteCount,
        commentCount,
        isUpvoted,
        isBookmarked: userBookmarkSet.has(id),
      };
    }

    return result;
  } catch {
    return {};
  }
}

export async function getRelatedSkills(
  slug: string,
  domains: string[],
  layer: string,
  type: string,
  limit: number = 4,
): Promise<Array<{ slug: string; title: string; description: string; isOfficial: boolean; version: string; tags: { type: string; domain: string[]; layer: string } }>> {
  try {
    const { getAllSkills } = await import('@/platform/lib/skills');
    const allSkills = getAllSkills();
    
    return allSkills
      .filter(s => s.slug !== slug)
      .map(s => ({
        skill: s,
        score: (
          s.tags.domain.filter(d => domains.includes(d)).length * 2 +
          (s.tags.layer === layer ? 1 : 0) +
          (s.tags.type === type ? 1 : 0)
        ),
      }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => ({
        slug: s.skill.slug,
        title: s.skill.title,
        description: s.skill.description,
        isOfficial: s.skill.isOfficial,
        version: s.skill.version,
        tags: s.skill.tags,
      }));
  } catch {
    return [];
  }
}

export async function downloadSkillWithCompanions(slug: string): Promise<Result<{ zipBase64: string; fileName: string; isSingle: boolean }, Error>> {
  try {
    const { getAllSkills, getCompanionsFor } = await import('@/platform/lib/skills');
    const allSkills = getAllSkills();
    const skill = allSkills.find(s => s.slug === slug);
    if (!skill) return Err(new Error('Skill not found'));

    const companions = getCompanionsFor(slug);

    if (companions.length === 0) {
      // Single file — return as base64 text (no ZIP needed)
      const base64 = Buffer.from(skill.content, 'utf-8').toString('base64');
      return Ok({ zipBase64: base64, fileName: `${slug}.md`, isSingle: true });
    }

    // Has companions — bundle as ZIP
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    zip.file(`${skill.slug}.md`, skill.content);
    for (const comp of companions) {
      zip.file(`${comp.slug}.md`, comp.content);
    }

    const blob = await zip.generateAsync({ type: 'nodebuffer' });
    const base64 = blob.toString('base64');
    return Ok({ zipBase64: base64, fileName: `${slug}-with-references.zip`, isSingle: false });
  } catch (err) {
    console.error('[social] downloadSkillWithCompanions failed:', err);
    return Err(new Error('Download failed'));
  }
}

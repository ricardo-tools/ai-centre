'use server';

import { eq, sql } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { skillDownloads, showcaseViews } from '@/platform/db/schema';

function getDb() {
  if (!process.env.DATABASE_URL) return null;
  const s = neon(process.env.DATABASE_URL);
  return drizzle(s);
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

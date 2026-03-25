'use server';

import { requirePermission } from '@/platform/lib/guards';
import { type Result, Ok, Err, ForbiddenError } from '@/platform/lib/result';

import { getDb, hasDatabase } from '@/platform/db/client';

const hasDb = hasDatabase();

export interface CommunityAnalytics {
  topSkills: Array<{ slug: string; downloads: number }>;
  topShowcases: Array<{ id: string; title: string; views: number }>;
  recentActivity: Array<{ id: string; action: string; entityType: string; actorName: string; createdAt: string }>;
  totalUsers: number;
  totalShowcases: number;
  showcasesThisMonth: number;
}

export async function getCommunityAnalytics(): Promise<Result<CommunityAnalytics, ForbiddenError | Error>> {
  // Admin-only
  const authResult = await requirePermission('audit:view');
  if (!authResult.ok) return authResult;

  if (!hasDb) {
    return Ok({
      topSkills: [],
      topShowcases: [],
      recentActivity: [],
      totalUsers: 0,
      totalShowcases: 0,
      showcasesThisMonth: 0,
    });
  }

  try {
    const { skillDownloads, showcaseViews, showcaseUploads, users, activityEvents } = await import('@/platform/db/schema');
    const { sql, desc, gte } = await import('drizzle-orm');
    const db = getDb();

    // Top downloaded skills
    const topSkills = await db
      .select({
        skillSlug: skillDownloads.skillSlug,
        count: sql<number>`count(*)::int`,
      })
      .from(skillDownloads)
      .groupBy(skillDownloads.skillSlug)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Top viewed showcases (join to get title)
    const topShowcasesRaw = await db
      .select({
        showcaseId: showcaseViews.showcaseId,
        title: showcaseUploads.title,
        count: sql<number>`count(*)::int`,
      })
      .from(showcaseViews)
      .leftJoin(showcaseUploads, sql`${showcaseViews.showcaseId} = ${showcaseUploads.id}`)
      .groupBy(showcaseViews.showcaseId, showcaseUploads.title)
      .orderBy(desc(sql`count(*)`))
      .limit(10);

    // Recent activity (last 20)
    const recentActivityRaw = await db
      .select({
        id: activityEvents.id,
        action: activityEvents.action,
        entityType: activityEvents.entityType,
        actorName: users.name,
        createdAt: activityEvents.createdAt,
      })
      .from(activityEvents)
      .leftJoin(users, sql`${activityEvents.actorId} = ${users.id}`)
      .orderBy(desc(activityEvents.createdAt))
      .limit(20);

    // Total counts
    const [userCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [showcaseCount] = await db.select({ count: sql<number>`count(*)::int` }).from(showcaseUploads);

    // Showcases this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const [showcasesMonth] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(showcaseUploads)
      .where(gte(showcaseUploads.createdAt, monthStart));

    return Ok({
      topSkills: topSkills.map((s: { skillSlug: string; count: number }) => ({
        slug: s.skillSlug,
        downloads: Number(s.count),
      })),
      topShowcases: topShowcasesRaw.map((s: { showcaseId: string; title: string | null; count: number }) => ({
        id: s.showcaseId,
        title: (s.title as string) ?? 'Untitled',
        views: Number(s.count),
      })),
      recentActivity: recentActivityRaw.map((a: { id: string; action: string; entityType: string; actorName: string | null; createdAt: Date }) => ({
        id: a.id,
        action: a.action,
        entityType: a.entityType,
        actorName: (a.actorName as string) ?? 'Unknown',
        createdAt: a.createdAt.toISOString(),
      })),
      totalUsers: Number(userCount?.count ?? 0),
      totalShowcases: Number(showcaseCount?.count ?? 0),
      showcasesThisMonth: Number(showcasesMonth?.count ?? 0),
    });
  } catch (err) {
    console.error('[analytics] getCommunityAnalytics failed:', err);
    return Err(new Error('Failed to load analytics'));
  }
}

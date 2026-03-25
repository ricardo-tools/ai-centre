'use server';

import { type Result, Ok, Err } from '@/platform/lib/result';

import { getDb, hasDatabase } from '@/platform/db/client';

const hasDb = hasDatabase();

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  createdAt: string;
  showcaseCount: number;
  showcases: Array<{ id: string; title: string; fileType: string; createdAt: string }>;
  skillsAuthoredCount: number;
  skillsAuthored: Array<{ slug: string; title: string; description: string }>;
}

export async function getProfile(userId: string): Promise<Result<UserProfileData, Error>> {
  if (!hasDb) {
    // Dev mode fallback — return minimal mock profile
    return Ok({
      id: userId,
      name: 'Dev User',
      email: 'dev@ezycollect.com.au',
      avatarUrl: null,
      createdAt: new Date().toISOString(),
      showcaseCount: 0,
      showcases: [],
      skillsAuthoredCount: 0,
      skillsAuthored: [],
    });
  }

  try {
    const { users, showcaseUploads, skills } = await import('@/platform/db/schema');
    const { eq } = await import('drizzle-orm');
    const db = getDb();

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) return Err(new Error('User not found'));

    const showcases = await db
      .select({
        id: showcaseUploads.id,
        title: showcaseUploads.title,
        fileType: showcaseUploads.fileType,
        createdAt: showcaseUploads.createdAt,
      })
      .from(showcaseUploads)
      .where(eq(showcaseUploads.userId, userId));

    const authoredSkills = await db
      .select({
        slug: skills.slug,
        title: skills.title,
        description: skills.description,
      })
      .from(skills)
      .where(eq(skills.authorId, userId));

    return Ok({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
      showcaseCount: showcases.length,
      showcases: showcases.map((s: { id: string; title: string; fileType: string; createdAt: Date }) => ({
        id: s.id,
        title: s.title,
        fileType: s.fileType,
        createdAt: s.createdAt.toISOString(),
      })),
      skillsAuthoredCount: authoredSkills.length,
      skillsAuthored: authoredSkills.map((s: { slug: string; title: string; description: string }) => ({
        slug: s.slug,
        title: s.title,
        description: s.description,
      })),
    });
  } catch (err) {
    console.error('[profile] getProfile failed:', err);
    return Err(new Error('Failed to load profile'));
  }
}

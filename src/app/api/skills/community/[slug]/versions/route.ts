import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/platform/db/client';
import { communitySkills, communitySkillVersions, users } from '@/platform/db/schema';
import { eq, desc } from 'drizzle-orm';

/**
 * GET /api/skills/community/:slug/versions?userId=...
 *
 * Returns version history for a community skill.
 * Since community skill slugs are unique per user (not globally),
 * the userId query param identifies which user's skill to look up.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const userId = request.nextUrl.searchParams.get('userId');

  console.info('[skills-versions] start', { slug, userId });

  if (!slug) {
    return NextResponse.json({ error: 'missing_slug' }, { status: 400 });
  }

  const db = getDb();

  // Build query — if userId provided, scope to that user; otherwise return first match
  let skillQuery = db.select({
    id: communitySkills.id,
    name: communitySkills.name,
    description: communitySkills.description,
    authorId: communitySkills.userId,
  }).from(communitySkills).where(eq(communitySkills.slug, slug));

  if (userId) {
    skillQuery = db.select({
      id: communitySkills.id,
      name: communitySkills.name,
      description: communitySkills.description,
      authorId: communitySkills.userId,
    }).from(communitySkills).where(eq(communitySkills.slug, slug));
    // Re-filter with userId — Drizzle doesn't chain .where, so use and()
    const { and } = await import('drizzle-orm');
    const rows = await db.select({
      id: communitySkills.id,
      name: communitySkills.name,
      description: communitySkills.description,
      authorId: communitySkills.userId,
    }).from(communitySkills).where(and(eq(communitySkills.slug, slug), eq(communitySkills.userId, userId))).limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'not_found', message: 'Skill not found' }, { status: 404 });
    }

    const skill = rows[0];
    const versions = await db.select({
      versionNumber: communitySkillVersions.versionNumber,
      commitMessage: communitySkillVersions.commitMessage,
      checksum: communitySkillVersions.checksum,
      createdAt: communitySkillVersions.createdAt,
    }).from(communitySkillVersions)
      .where(eq(communitySkillVersions.skillId, skill.id))
      .orderBy(desc(communitySkillVersions.versionNumber));

    // Get author name
    const [author] = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, skill.authorId)).limit(1);

    console.info('[skills-versions] complete', { slug, versions: versions.length });

    return NextResponse.json({
      slug,
      name: skill.name,
      description: skill.description,
      author: author?.name ?? author?.email ?? 'Unknown',
      versions: versions.map(v => ({
        version: v.versionNumber,
        commitMessage: v.commitMessage,
        checksum: v.checksum,
        createdAt: v.createdAt.toISOString(),
      })),
    });
  }

  // No userId — find first matching skill
  const rows = await skillQuery.limit(1);
  if (rows.length === 0) {
    return NextResponse.json({ error: 'not_found', message: 'Skill not found' }, { status: 404 });
  }

  const skill = rows[0];
  const versions = await db.select({
    versionNumber: communitySkillVersions.versionNumber,
    commitMessage: communitySkillVersions.commitMessage,
    checksum: communitySkillVersions.checksum,
    createdAt: communitySkillVersions.createdAt,
  }).from(communitySkillVersions)
    .where(eq(communitySkillVersions.skillId, skill.id))
    .orderBy(desc(communitySkillVersions.versionNumber));

  const [author] = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, skill.authorId)).limit(1);

  console.info('[skills-versions] complete', { slug, versions: versions.length });

  return NextResponse.json({
    slug,
    name: skill.name,
    description: skill.description,
    author: author?.name ?? author?.email ?? 'Unknown',
    versions: versions.map(v => ({
      version: v.versionNumber,
      commitMessage: v.commitMessage,
      checksum: v.checksum,
      createdAt: v.createdAt.toISOString(),
    })),
  });
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/platform/db/client';
import { communitySkills, communitySkillVersions } from '@/platform/db/schema';
import { verifyAccessToken } from '@/platform/lib/oauth';
import { computeNextVersion, computeContentChecksum } from '@/platform/lib/community-skills';
import { eq, and, desc } from 'drizzle-orm';

/**
 * POST /api/skills/community/:slug/rollback
 *
 * Roll back a community skill to a previous version.
 * Creates a NEW version with the old version's content (append-only history).
 * Owner only — verified via Bearer token.
 *
 * Body: { targetVersion: number }
 * Returns: { slug, version, rolledBackFrom, rolledBackTo }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const started = Date.now();
  const { slug } = await params;
  console.info('[skills-rollback] start', { slug });

  // Auth
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const tokenResult = await verifyAccessToken(authHeader.slice('Bearer '.length).trim());
  if (!tokenResult.ok) {
    return NextResponse.json({ error: 'unauthorized', message: tokenResult.error.message }, { status: 401 });
  }

  const { userId } = tokenResult.value;

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const targetVersion = Number(body.targetVersion);
  if (!Number.isInteger(targetVersion) || targetVersion < 1) {
    return NextResponse.json({ error: 'invalid_version', message: 'targetVersion must be a positive integer' }, { status: 400 });
  }

  const db = getDb();

  // Find the skill — must belong to this user
  const [skill] = await db.select({ id: communitySkills.id, name: communitySkills.name })
    .from(communitySkills)
    .where(and(eq(communitySkills.slug, slug), eq(communitySkills.userId, userId)))
    .limit(1);

  if (!skill) {
    console.warn('[skills-rollback] not found or not owner', { slug, userId });
    return NextResponse.json({ error: 'not_found', message: 'Skill not found or you are not the owner' }, { status: 404 });
  }

  // Get all versions
  const versions = await db.select({
    versionNumber: communitySkillVersions.versionNumber,
    content: communitySkillVersions.content,
  }).from(communitySkillVersions)
    .where(eq(communitySkillVersions.skillId, skill.id))
    .orderBy(desc(communitySkillVersions.versionNumber));

  if (versions.length <= 1) {
    console.info('[skills-rollback] only one version, no-op', { slug });
    return NextResponse.json({
      error: 'no_rollback',
      message: 'Only one version exists — nothing to roll back to',
    }, { status: 400 });
  }

  // Find the target version
  const target = versions.find(v => v.versionNumber === targetVersion);
  if (!target) {
    console.warn('[skills-rollback] target version not found', { slug, targetVersion });
    return NextResponse.json({ error: 'version_not_found', message: `Version ${targetVersion} does not exist` }, { status: 404 });
  }

  // If target is already the latest, no-op
  const currentVersion = versions[0].versionNumber;
  if (targetVersion === currentVersion) {
    console.info('[skills-rollback] target is current, no-op', { slug, targetVersion });
    return NextResponse.json({
      slug,
      version: currentVersion,
      message: 'Already at this version',
    });
  }

  // Create new version with target's content
  const newVersionNumber = computeNextVersion(versions.map(v => v.versionNumber));
  const checksum = computeContentChecksum(target.content);

  await db.insert(communitySkillVersions).values({
    skillId: skill.id,
    versionNumber: newVersionNumber,
    content: target.content,
    commitMessage: `Rollback to v${targetVersion}`,
    checksum,
  });

  // Update skill timestamp
  await db.update(communitySkills)
    .set({ updatedAt: new Date() })
    .where(eq(communitySkills.id, skill.id));

  console.info('[skills-rollback] complete', {
    slug,
    from: currentVersion,
    to: targetVersion,
    newVersion: newVersionNumber,
    latencyMs: Date.now() - started,
  });

  return NextResponse.json({
    slug,
    version: newVersionNumber,
    rolledBackFrom: currentVersion,
    rolledBackTo: targetVersion,
  });
}

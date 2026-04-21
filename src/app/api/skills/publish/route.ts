import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDb } from '@/platform/db/client';
import { communitySkills, communitySkillVersions, userQuotas } from '@/platform/db/schema';
import { verifyAccessToken } from '@/platform/lib/oauth';
import {
  validatePublishInput,
  computeNextVersion,
  computeContentChecksum,
} from '@/platform/lib/community-skills';
import { eq, and, count } from 'drizzle-orm';

/**
 * POST /api/skills/publish
 *
 * Publish a community skill. Requires OAuth Bearer token.
 * Creates a new skill or adds a new version to an existing one.
 * Enforces per-user skill quota.
 *
 * Body: { slug, name, description, content, commitMessage, category? }
 * Returns: { slug, version, publishedAt }
 */
export async function POST(request: NextRequest) {
  const started = Date.now();
  console.info('[skills-publish] start');

  // Auth — Bearer token
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    console.warn('[skills-publish] missing bearer token');
    return NextResponse.json({ error: 'unauthorized', message: 'Bearer token required' }, { status: 401 });
  }

  const tokenResult = await verifyAccessToken(authHeader.slice('Bearer '.length).trim());
  if (!tokenResult.ok) {
    console.warn('[skills-publish] invalid token', { error: tokenResult.error.code });
    return NextResponse.json({ error: 'unauthorized', message: tokenResult.error.message }, { status: 401 });
  }

  const { userId } = tokenResult.value;

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body', message: 'Invalid JSON body' }, { status: 400 });
  }

  // Validate input
  const validation = validatePublishInput({
    slug: String(body.slug ?? ''),
    name: String(body.name ?? ''),
    description: String(body.description ?? ''),
    content: String(body.content ?? ''),
    commitMessage: String(body.commitMessage ?? ''),
    category: body.category ? String(body.category) : undefined,
  });

  if (!validation.ok) {
    console.warn('[skills-publish] validation failed', { code: validation.error.code });
    return NextResponse.json({ error: validation.error.code, message: validation.error.message }, { status: 400 });
  }

  const input = validation.value;
  const db = getDb();

  // Guard: flow skills are admin-only — no one else can publish slugs starting with "flow"
  const isFlowSkill = input.slug === 'flow' || input.slug.startsWith('flow-');
  if (isFlowSkill) {
    const { users, roles } = await import('@/platform/db/schema');
    const [userRow] = await db.select({ roleId: users.roleId }).from(users).where(eq(users.id, userId)).limit(1);
    if (userRow?.roleId) {
      const [role] = await db.select({ slug: roles.slug }).from(roles).where(eq(roles.id, userRow.roleId)).limit(1);
      if (role?.slug !== 'admin') {
        console.warn('[skills-publish] non-admin attempted to publish flow skill', { slug: input.slug, userId });
        return NextResponse.json({ error: 'forbidden', message: 'Only administrators can publish flow skills' }, { status: 403 });
      }
    } else {
      return NextResponse.json({ error: 'forbidden', message: 'Only administrators can publish flow skills' }, { status: 403 });
    }
  }

  // Quota check — count user's community skills
  const [quotaRow] = await db.select({ skillLimit: userQuotas.skillLimit }).from(userQuotas).where(eq(userQuotas.userId, userId)).limit(1);
  const skillLimit = quotaRow?.skillLimit ?? 5000; // default if no quota row

  const [countRow] = await db.select({ total: count() }).from(communitySkills).where(eq(communitySkills.userId, userId));
  const currentCount = countRow?.total ?? 0;

  // Check if this is an update to an existing skill (doesn't count against quota)
  const [existingSkill] = await db.select({ id: communitySkills.id })
    .from(communitySkills)
    .where(and(eq(communitySkills.slug, input.slug), eq(communitySkills.userId, userId)))
    .limit(1);

  if (!existingSkill && currentCount >= skillLimit) {
    console.warn('[skills-publish] quota exceeded', { userId, currentCount, skillLimit });
    return NextResponse.json({
      error: 'quota_exceeded',
      message: `You have ${currentCount}/${skillLimit} skills. Delete an existing skill or request a higher quota.`,
    }, { status: 429 });
  }

  // Create or update skill
  let skillId: string;
  if (existingSkill) {
    // Update existing skill metadata
    await db.update(communitySkills)
      .set({ name: input.name, description: input.description, category: input.category, updatedAt: new Date() })
      .where(eq(communitySkills.id, existingSkill.id));
    skillId = existingSkill.id;
    console.info('[skills-publish] updating existing skill', { slug: input.slug, userId });
  } else {
    // Create new skill
    const [newSkill] = await db.insert(communitySkills).values({
      slug: input.slug,
      userId,
      name: input.name,
      description: input.description,
      category: input.category,
    }).returning();
    skillId = newSkill.id;
    console.info('[skills-publish] created new skill', { slug: input.slug, userId });
  }

  // Get existing version numbers for this skill
  const versions = await db.select({ versionNumber: communitySkillVersions.versionNumber })
    .from(communitySkillVersions)
    .where(eq(communitySkillVersions.skillId, skillId));
  const versionNumber = computeNextVersion(versions.map(v => v.versionNumber));
  const checksum = computeContentChecksum(input.content);

  // Create version
  await db.insert(communitySkillVersions).values({
    skillId,
    versionNumber,
    content: input.content,
    commitMessage: input.commitMessage,
    checksum,
  });

  const publishedAt = new Date().toISOString();
  console.info('[skills-publish] complete', {
    slug: input.slug,
    version: versionNumber,
    userId,
    latencyMs: Date.now() - started,
  });

  return NextResponse.json({ slug: input.slug, version: versionNumber, publishedAt });
}

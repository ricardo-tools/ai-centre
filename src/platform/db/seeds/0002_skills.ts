/**
 * Seed 0002: Skill library.
 * Reads skill definitions from the filesystem and inserts them into the DB.
 * Skills are the same in all environments — sourced from skills/*.md files.
 */

import type { Seed, SeedDb } from './runner';
import { skills, skillVersions, auditLog, users, roles } from '../schema';
import { eq } from 'drizzle-orm';

async function run(db: SeedDb): Promise<void> {
  const { getAllSkills } = await import('@/platform/lib/skills');
  const allSkills = getAllSkills();

  // Get system admin user as author
  const [adminRole] = await (db as any).select({ id: roles.id }).from(roles).where(eq(roles.slug, 'admin')).limit(1);
  if (!adminRole) {
    console.warn('[seed:0002] No admin role found — skipping skill seeding');
    return;
  }

  const [adminUser] = await (db as any).select({ id: users.id }).from(users).where(eq(users.email, 'system@ai-centre.local')).limit(1);
  if (!adminUser) {
    console.warn('[seed:0002] No system admin user found — skipping skill seeding');
    return;
  }

  let seeded = 0;
  for (const skill of allSkills) {
    if (!skill.content) continue;

    // Upsert skill — onConflictDoNothing handles concurrent cold starts racing
    const [newSkill] = await (db as any).insert(skills).values({
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
      authorId: adminUser.id,
      isOfficial: true,
    }).onConflictDoNothing({ target: skills.slug }).returning();

    // Already existed — skip version + audit
    if (!newSkill) continue;

    // Create published version
    const [version] = await (db as any).insert(skillVersions).values({
      skillId: newSkill.id,
      version: skill.version,
      content: skill.content,
      status: 'published',
      publishedAt: new Date(),
      publishedById: adminUser.id,
    }).returning();

    // Link published version
    await (db as any).update(skills)
      .set({ currentPublishedVersionId: version.id })
      .where(eq(skills.id, newSkill.id));

    // Audit log
    await (db as any).insert(auditLog).values({
      entityType: 'skill',
      entityId: newSkill.id,
      action: 'published',
      userId: adminUser.id,
      metadata: { version: skill.version },
    });

    seeded++;
  }

  console.log(`[seed:0002] Seeded ${seeded} skills (${allSkills.length - seeded} already existed)`);
}

export const seed: Seed = { tag: '0002_skills', run };

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users, skills, skillVersions, auditLog, roles, rolePermissions } from './schema';
import { SYSTEM_ROLE_SEEDS } from '@/platform/lib/permissions';
import { getAllSkills } from '@/platform/lib/skills';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required. Set it in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  console.log('Seeding database...\n');

  // Create system roles
  const [adminRole] = await db.insert(roles).values({
    slug: 'admin',
    name: 'Administrator',
    description: 'Full access to all features and settings',
    isSystem: true,
  }).returning();

  const [memberRole] = await db.insert(roles).values({
    slug: 'member',
    name: 'Member',
    description: 'Standard user — create, edit own content, generate projects',
    isSystem: true,
  }).returning();

  const [developerRole] = await db.insert(roles).values({
    slug: 'developer',
    name: 'Developer',
    description: 'API documentation and testing access',
    isSystem: true,
  }).returning();

  // Seed role permissions
  for (const permission of SYSTEM_ROLE_SEEDS.admin) {
    await db.insert(rolePermissions).values({ roleId: adminRole.id, permission });
  }
  for (const permission of SYSTEM_ROLE_SEEDS.member) {
    await db.insert(rolePermissions).values({ roleId: memberRole.id, permission });
  }
  for (const permission of SYSTEM_ROLE_SEEDS.developer) {
    await db.insert(rolePermissions).values({ roleId: developerRole.id, permission });
  }

  console.log(`Created roles: admin (${SYSTEM_ROLE_SEEDS.admin.length} perms), member (${SYSTEM_ROLE_SEEDS.member.length} perms), developer (${SYSTEM_ROLE_SEEDS.developer.length} perms)`);

  // Create system admin user
  const [adminUser] = await db.insert(users).values({
    email: 'system@ai-centre.local',
    name: 'System',
    roleId: adminRole.id,
  }).returning();

  console.log(`Created admin user: ${adminUser.id}`);

  // Use SKILL_DEFINITIONS (via getAllSkills) as the single source of truth
  const allSkills = getAllSkills();
  console.log(`\nSeeding ${allSkills.length} skills from SKILL_DEFINITIONS...\n`);

  for (const skill of allSkills) {
    if (!skill.content) {
      console.warn(`  SKIP: ${skill.slug} — no content file found`);
      continue;
    }

    // Create skill
    const [newSkill] = await db.insert(skills).values({
      slug: skill.slug,
      title: skill.title,
      description: skill.description,
      authorId: adminUser.id,
      isOfficial: true,
    }).returning();

    // Create published version
    const [version] = await db.insert(skillVersions).values({
      skillId: newSkill.id,
      version: skill.version,
      content: skill.content,
      status: 'published',
      publishedAt: new Date(),
      publishedById: adminUser.id,
    }).returning();

    // Update skill with published version reference
    await db.update(skills)
      .set({ currentPublishedVersionId: version.id })
      .where(eq(skills.id, newSkill.id));

    // Audit log
    await db.insert(auditLog).values({
      entityType: 'skill',
      entityId: newSkill.id,
      action: 'published',
      userId: adminUser.id,
      metadata: { version: skill.version },
    });

    console.log(`  Seeded: ${skill.title} (v${skill.version})`);
  }

  console.log('\nSeed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

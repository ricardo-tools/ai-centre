import { readFileSync } from 'fs';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users, skills, skillVersions, auditLog } from './schema';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required. Set it in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const SKILLS = [
  {
    slug: 'app-layout',
    title: 'App Layout',
    description: 'Shell layout patterns (TopBar+Sidebar, TopBar+MegaMenus, SidebarOnly, Minimal) with responsive grid configs, navigation widgets, and spacing principles.',
    file: 'app-layout/SKILL.md',
  },
  {
    slug: 'brand-design-system',
    title: 'Brand Design System',
    description: 'Brand color palette, typography, logo, favicon, semantic design tokens, theming (Light, Dark, Night, Legacy), Phosphor Icons, and asset libraries.',
    file: 'brand-design-system/SKILL.md',
  },
  {
    slug: 'design-excellence',
    title: 'Design Excellence',
    description: 'Visual hierarchy, 8px spacing system, negative space, alignment, element interactions, consistency, and attention to detail — medium-agnostic design principles.',
    file: 'design-excellence/SKILL.md',
  },
  {
    slug: 'frontend-architecture',
    title: 'Frontend Architecture',
    description: '7-layer architecture (Components, Widgets, Domain Objects, ACL, Screen Renderer, Slots), CSS custom property styling, grid system, and TypeScript conventions.',
    file: 'frontend-architecture/SKILL.md',
  },
  {
    slug: 'print-design',
    title: 'Print Design',
    description: 'Print-ready design standards: 3-zone system (bleed/trim/safe), export requirements (PDF, 300+ DPI), typography for print, QR codes, and pre-flight checklist.',
    file: 'print-design/SKILL.md',
  },
];

async function seed() {
  console.log('Seeding database...\n');

  // Create system admin user
  const [adminUser] = await db.insert(users).values({
    email: 'system@ai-centre.local',
    name: 'System',
    role: 'admin',
  }).returning();

  console.log(`Created admin user: ${adminUser.id}`);

  const projectRoot = resolve(process.cwd());

  for (const skill of SKILLS) {
    const content = readFileSync(resolve(projectRoot, skill.file), 'utf-8');

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
      version: '1.0.0',
      content,
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
      metadata: { version: '1.0.0' },
    });

    console.log(`  Seeded: ${skill.title} (v1.0.0)`);
  }

  console.log('\nSeed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

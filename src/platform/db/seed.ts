import { readFileSync } from 'fs';
import { resolve } from 'path';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { users, skills, skillVersions, auditLog, roles, rolePermissions } from './schema';
import { SYSTEM_ROLE_SEEDS } from '@/platform/lib/permissions';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is required. Set it in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

const SKILLS = [
  // ── Behavioural skills ─────────────────────────────────────────────
  {
    slug: 'accessibility',
    title: 'Accessibility',
    description: 'Semantic HTML, keyboard navigation, focus management, ARIA patterns, color contrast, motion preferences.',
    file: 'skills/accessibility.md',
  },
  {
    slug: 'ai-capabilities',
    title: 'AI Capabilities',
    description: 'AI capabilities landscape — what exists, when to use each capability, and how to make good integration decisions.',
    file: 'skills/ai-capabilities.md',
  },
  {
    slug: 'ai-claude',
    title: 'AI: Claude',
    description: 'Patterns for integrating the Anthropic Claude API. Prompt management, structured output, streaming, tool use.',
    file: 'skills/ai-claude.md',
  },
  {
    slug: 'ai-fal',
    title: 'AI: fal.ai',
    description: 'Generate images, videos, and audio using AI models via fal.ai MCP. Prompt craft, model discovery, iteration workflow.',
    file: 'skills/ai-fal.md',
  },
  {
    slug: 'ai-openrouter',
    title: 'AI: OpenRouter',
    description: 'Patterns for integrating OpenRouter as a unified AI gateway. Model routing, fallback chains, structured output.',
    file: 'skills/ai-openrouter.md',
  },
  {
    slug: 'authentication',
    title: 'Authentication',
    description: 'Auth patterns — passwordless, OAuth, MFA, session management, token lifecycle.',
    file: 'skills/authentication.md',
  },
  {
    slug: 'auth-clerk',
    title: 'Auth: Clerk',
    description: 'Clerk integration for Next.js App Router.',
    file: 'skills/auth-clerk.md',
  },
  {
    slug: 'auth-custom-otp',
    title: 'Auth: Custom OTP',
    description: 'Custom email OTP auth with Jose JWT.',
    file: 'skills/auth-custom-otp.md',
  },
  {
    slug: 'authz-rbac-drizzle',
    title: 'Authz: RBAC with Drizzle',
    description: 'RBAC implementation with Drizzle ORM.',
    file: 'skills/authz-rbac-drizzle.md',
  },
  {
    slug: 'authorization',
    title: 'Authorization',
    description: 'RBAC, ABAC, permission checks, policy enforcement, resource-level access.',
    file: 'skills/authorization.md',
  },
  {
    slug: 'app-layout',
    title: 'App Layout',
    description: 'Shell layout patterns, responsive grid configs, navigation widgets. Pattern A (TopBar + Sidebar).',
    file: 'skills/app-layout.md',
  },
  {
    slug: 'backend-patterns',
    title: 'Backend Patterns',
    description: 'Server-side patterns for reliable, maintainable backend code. Repositories, use cases, error handling, validation.',
    file: 'skills/backend-patterns.md',
  },
  {
    slug: 'brand-design-system',
    title: 'Brand Design System',
    description: 'Semantic color tokens, typography (Jost), theming (Light + Night), Phosphor Icons, logo/favicon rules.',
    file: 'skills/brand-design-system.md',
  },
  {
    slug: 'clean-architecture',
    title: 'Clean Architecture',
    description: 'Project structure, domain objects, use cases, repositories, mappers, entities, and feature organization.',
    file: 'skills/clean-architecture.md',
  },
  {
    slug: 'coding-standards',
    title: 'Coding Standards',
    description: 'Small composable functions, functional core/imperative shell, naming conventions, Result<T,E>, immutability.',
    file: 'skills/coding-standards.md',
  },
  {
    slug: 'content-design',
    title: 'Content Design',
    description: 'User-facing text patterns, microcopy, error messages, empty states, confirmation dialogs, loading states.',
    file: 'skills/content-design.md',
  },
  {
    slug: 'creative-toolkit',
    title: 'Creative Toolkit',
    description: 'Design patterns for visual storytelling, glassmorphism, layered backgrounds, color composition, motion principles.',
    file: 'skills/creative-toolkit.md',
  },
  {
    slug: 'database-design',
    title: 'Database Design',
    description: 'SQL vs NoSQL vs cache. Schema patterns, migrations, indexing, transactions.',
    file: 'skills/database-design.md',
  },
  {
    slug: 'db-neon-drizzle',
    title: 'DB: Neon + Drizzle',
    description: 'Neon serverless Postgres with Drizzle ORM.',
    file: 'skills/db-neon-drizzle.md',
  },
  {
    slug: 'db-redis',
    title: 'DB: Redis / Upstash',
    description: 'Redis via Upstash for caching, rate limiting, sessions.',
    file: 'skills/db-redis.md',
  },
  {
    slug: 'db-supabase',
    title: 'DB: Supabase',
    description: 'Supabase integration with RLS, realtime, storage.',
    file: 'skills/db-supabase.md',
  },
  {
    slug: 'design-foundations',
    title: 'Design Foundations',
    description: 'Gestalt principles, 8px spacing system, visual hierarchy, alignment, contrast, negative space, squint test.',
    file: 'skills/design-foundations.md',
  },
  {
    slug: 'documentation-research',
    title: 'Documentation Research',
    description: 'When to consult documentation vs knowledge, source hierarchy, checklist for finding authoritative sources.',
    file: 'skills/documentation-research.md',
  },
  {
    slug: 'email-sending',
    title: 'Email Sending',
    description: 'Transactional vs marketing, templates, deliverability, bounce handling, unsubscribe.',
    file: 'skills/email-sending.md',
  },
  {
    slug: 'email-mailgun',
    title: 'Email: Mailgun',
    description: 'Mailgun SDK integration for email sending.',
    file: 'skills/email-mailgun.md',
  },
  {
    slug: 'eval-driven-development',
    title: 'Eval-Driven Development',
    description: 'EDD workflow, deterministic vs LLM-as-judge evaluations, handling non-determinism, quality gates.',
    file: 'skills/eval-driven-development.md',
  },
  {
    slug: 'file-storage',
    title: 'File Storage',
    description: 'Upload validation, CDN, access control, signed URLs, size/format limits, cleanup.',
    file: 'skills/file-storage.md',
  },
  {
    slug: 'frontend-architecture',
    title: 'Frontend Architecture',
    description: '7-layer UI architecture (Components → Widgets → Domain Objects → ACL → Screen Renderer → Slots), inline styles with CSS custom properties.',
    file: 'skills/frontend-architecture.md',
  },
  {
    slug: 'interaction-motion',
    title: 'Interaction & Motion',
    description: 'Motion vocabulary, duration principles, easing patterns, state transitions, choreography.',
    file: 'skills/interaction-motion.md',
  },
  {
    slug: 'local-development',
    title: 'Local Development',
    description: 'Dev/prod parity, env vars, service fallbacks, seed data, dev bypasses.',
    file: 'skills/local-development.md',
  },
  {
    slug: 'mcp-server-patterns',
    title: 'MCP Server Patterns',
    description: 'Model Context Protocol server patterns for agentic tool integration. Tool descriptions, resource design, input validation.',
    file: 'skills/mcp-server-patterns.md',
  },
  {
    slug: 'nextjs-app-router-turbopack',
    title: 'Next.js App Router + Turbopack',
    description: 'Next.js App Router patterns with Turbopack, Server Components by default, streaming, caching model, edge functions.',
    file: 'skills/nextjs-app-router-turbopack.md',
  },
  {
    slug: 'observability',
    title: 'Observability',
    description: 'Post-launch quality — error tracking, structured logging, real user monitoring, uptime, alerting.',
    file: 'skills/observability.md',
  },
  {
    slug: 'playwright-e2e',
    title: 'Playwright E2E',
    description: 'End-to-end testing patterns with Playwright. Test structure, locators, assertions, fixtures, CI integration.',
    file: 'skills/playwright-e2e.md',
  },
  {
    slug: 'planning',
    title: 'Planning',
    description: 'The discipline of planning before execution in AI-human collaborative development. Structured planning with progressive elaboration.',
    file: 'skills/planning.md',
  },
  {
    slug: 'pptx-export',
    title: 'PPTX Export',
    description: 'PowerPoint generation with PptxGenJS. Brand fidelity, text overflow prevention, file integrity, spatial balance.',
    file: 'skills/pptx-export.md',
  },
  {
    slug: 'presentation',
    title: 'Presentation',
    description: 'Narrative-driven presentation design. 7-phase planning process, story structure, art direction, composition patterns.',
    file: 'skills/presentation.md',
  },
  {
    slug: 'presentation-html-implementation',
    title: 'Presentation HTML Implementation',
    description: 'Single HTML file presentation pattern with slide transitions, footer bar, glassmorphism, responsive slide sizing.',
    file: 'skills/presentation-html-implementation.md',
  },
  {
    slug: 'print-design',
    title: 'Print Design',
    description: 'Print publication design. Three-zone system, 300 DPI minimum, CMYK color, print measurements in mm, crop marks.',
    file: 'skills/print-design.md',
  },
  {
    slug: 'prompt-refinement',
    title: 'Prompt Refinement',
    description: 'Translates unstructured user requests into clear, AI-effective prompts. Clarifies intent, identifies scope, selects relevant skills.',
    file: 'skills/prompt-refinement.md',
  },
  {
    slug: 'project-documentation',
    title: 'Project Documentation',
    description: 'How to build and maintain living project documentation that auto-updates alongside development. Diataxis structure, MDX authoring.',
    file: 'skills/project-documentation.md',
  },
  {
    slug: 'project-reference',
    title: 'Project Reference',
    description: 'How to maintain a living project reference document that AI agents and humans use to prevent regression and context loss.',
    file: 'skills/project-reference.md',
  },
  {
    slug: 'quality-assurance',
    title: 'Quality Assurance',
    description: 'Quality dimensions — trust, effectiveness, reliability, emotion, craft. Top-down and bottom-up quality flows.',
    file: 'skills/quality-assurance.md',
  },
  {
    slug: 'research',
    title: 'Research',
    description: 'The discipline of investigating before acting. Calibrate research depth to decision impact, evaluate sources, falsify hypotheses.',
    file: 'skills/research.md',
  },
  {
    slug: 'responsiveness',
    title: 'Responsiveness',
    description: 'Content-driven responsive design. Breakpoint discovery from content priorities, behavior specification per breakpoint.',
    file: 'skills/responsiveness.md',
  },
  {
    slug: 'roadmap',
    title: 'Roadmap',
    description: 'How to maintain a living roadmap that auto-updates as work progresses. Now / Next / Later / Parking Lot structure.',
    file: 'skills/roadmap.md',
  },
  {
    slug: 'security-review',
    title: 'Security Review',
    description: 'Threat modeling, least privilege, defense in depth, secure by default. Authentication, authorization, secrets management.',
    file: 'skills/security-review.md',
  },
  {
    slug: 'skill-creation',
    title: 'Skill Creation',
    description: 'How to write effective AI coding skills (SKILL.md files). Self-contained instruction sets for AI code generation.',
    file: 'skills/skill-creation.md',
  },
  {
    slug: 'skill-review',
    title: 'Skill Review',
    description: 'Three-layer skill quality audit: structural, individual, collection coherence.',
    file: 'skills/skill-review.md',
  },
  {
    slug: 'strategic-context',
    title: 'Strategic Context',
    description: 'Knowledge persistence across sessions. Checkpointing, ephemeral context in CLAUDE.md, decision history.',
    file: 'skills/strategic-context.md',
  },
  {
    slug: 'storage-vercel-blob',
    title: 'Storage: Vercel Blob',
    description: 'Vercel Blob storage for file uploads.',
    file: 'skills/storage-vercel-blob.md',
  },
  {
    slug: 'testing-strategy',
    title: 'Testing Strategy',
    description: 'Testing pyramid and trophy — behavior-driven tests, mocking external boundaries only. Vitest + RTL + Playwright.',
    file: 'skills/testing-strategy.md',
  },
  {
    slug: 'user-management',
    title: 'User Management',
    description: 'User lifecycle, profiles, account states, soft delete, data export, GDPR.',
    file: 'skills/user-management.md',
  },
  {
    slug: 'user-experience',
    title: 'User Experience',
    description: 'Jobs-to-be-done framing, cognitive principles, emotional design levels, trust, usability, delight.',
    file: 'skills/user-experience.md',
  },
  {
    slug: 'verification-loop',
    title: 'Verification Loop',
    description: 'Two modes of verification: quick check and full review. Verification phases, gating criteria, reporting.',
    file: 'skills/verification-loop.md',
  },
  {
    slug: 'web-performance',
    title: 'Web Performance',
    description: 'Core Web Vitals, loading strategies, bundle optimization, perceived performance, Next.js-specific patterns.',
    file: 'skills/web-performance.md',
  },

  {
    slug: 'social-features',
    title: 'Social Features',
    description: 'Defines when and how to add social features (comments, reactions, mentions, notifications, activity feeds) to enterprise applications.',
    file: 'skills/social-features.md',
  },
  {
    slug: 'comments-reactions',
    title: 'Comments & Reactions',
    description: 'Implementation patterns for polymorphic comments (threaded), emoji reactions, and @mentions in enterprise applications.',
    file: 'skills/comments-reactions.md',
  },
  {
    slug: 'activity-notifications',
    title: 'Activity & Notifications',
    description: 'Implementation patterns for activity event logging, notification delivery (in-app + email), preference management, and batched email digests.',
    file: 'skills/activity-notifications.md',
  },

  // ── Reference companions (5) ──────────────────────────────────────
  {
    slug: 'app-layout-patterns-reference',
    title: 'App Layout Patterns Reference',
    description: 'Layout pattern specifications for Patterns B, C, and D. Reference companion to app-layout.',
    file: 'skills/app-layout-patterns-reference.md',
  },
  {
    slug: 'brand-tokens-reference',
    title: 'Brand Tokens Reference',
    description: 'Token lookup tables and CSS variable mappings for all themes. Reference companion to brand-design-system.',
    file: 'skills/brand-tokens-reference.md',
  },
  {
    slug: 'pptx-export-reference',
    title: 'PPTX Export Reference',
    description: 'Quality gate checklist and spacing constants for PPTX export. Reference companion to pptx-export.',
    file: 'skills/pptx-export-reference.md',
  },
  {
    slug: 'creative-toolkit-charts-reference',
    title: 'Creative Toolkit Charts Reference',
    description: 'Nivo chart theme configuration and chart-specific styling patterns. Reference companion to creative-toolkit.',
    file: 'skills/creative-toolkit-charts-reference.md',
  },
  {
    slug: 'social-features-reference',
    title: 'Social Features Reference',
    description: 'Schema templates, reaction emoji registry, notification type registry, and UI patterns for social features. Reference companion to social-features.',
    file: 'skills/social-features-reference.md',
  },
];

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

  // Seed role permissions
  for (const permission of SYSTEM_ROLE_SEEDS.admin) {
    await db.insert(rolePermissions).values({ roleId: adminRole.id, permission });
  }
  for (const permission of SYSTEM_ROLE_SEEDS.member) {
    await db.insert(rolePermissions).values({ roleId: memberRole.id, permission });
  }

  console.log(`Created roles: admin (${SYSTEM_ROLE_SEEDS.admin.length} perms), member (${SYSTEM_ROLE_SEEDS.member.length} perms)`);

  // Create system admin user
  const [adminUser] = await db.insert(users).values({
    email: 'system@ai-centre.local',
    name: 'System',
    roleId: adminRole.id,
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

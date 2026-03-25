import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/** Skill type — what kind of skill this is */
export type SkillType = 'principle' | 'implementation' | 'reference';

/** Domain — who uses this skill */
export type SkillDomain = 'product-development' | 'marketing' | 'design' | 'engineering' | 'operations' | 'global';

/** Layer — where it applies in the stack */
export type SkillLayer = 'frontend' | 'backend' | 'fullstack' | 'infrastructure' | 'design' | 'process';

export interface SkillTags {
  type: SkillType;
  domain: SkillDomain[];
  layer: SkillLayer;
}

export interface SkillData {
  slug: string;
  title: string;
  description: string;
  isOfficial: boolean;
  version: string;
  content: string;
  tags: SkillTags;
  /** Slug of the parent skill this implementation accompanies */
  companionTo?: string;
}

/** All unique tag values for filter UI */
export const SKILL_TYPES: SkillType[] = ['principle', 'implementation', 'reference'];
export const SKILL_DOMAINS: SkillDomain[] = ['product-development', 'marketing', 'design', 'engineering', 'operations', 'global'];
export const SKILL_LAYERS: SkillLayer[] = ['frontend', 'backend', 'fullstack', 'infrastructure', 'design', 'process'];

/** Human-readable labels */
export const TYPE_LABELS: Record<SkillType, string> = { principle: 'Principle', implementation: 'Implementation', reference: 'Reference' };
export const DOMAIN_LABELS: Record<SkillDomain, string> = { 'product-development': 'Product', marketing: 'Marketing', design: 'Design', engineering: 'Engineering', operations: 'Operations', global: 'Global' };
export const LAYER_LABELS: Record<SkillLayer, string> = { frontend: 'Frontend', backend: 'Backend', fullstack: 'Full Stack', infrastructure: 'Infrastructure', design: 'Design', process: 'Process' };

type SkillDefinition = Omit<SkillData, 'content'>;

const SKILL_DEFINITIONS: SkillDefinition[] = [
  // ── Behavioural skills (59) ────────────────────────────────────────
  {
    slug: 'accessibility',
    title: 'Accessibility',
    description: 'Semantic HTML, keyboard navigation, focus management, ARIA patterns, color contrast, motion preferences. Apply when building interactive UI, handling forms, or ensuring compliance.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'design'], layer: 'frontend' },
  },
  {
    slug: 'ai-capabilities',
    title: 'AI Capabilities',
    description: 'AI capabilities landscape — what exists, when to use each capability, and how to make good integration decisions. Technology-agnostic principles for text, image, video, audio, embeddings, agents, and more.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'fullstack' },
  },
  {
    slug: 'ai-claude',
    title: 'AI: Claude',
    description: 'Implementation skill for ai-capabilities. Patterns for integrating the Anthropic Claude API. Covers architectural placement, prompt management, structured output, streaming, tool use, extended thinking, cost optimization, resilience, and testing.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['engineering'], layer: 'backend' },
    companionTo: 'ai-capabilities',
  },
  {
    slug: 'ai-fal',
    title: 'AI: fal.ai',
    description: 'Implementation skill for ai-capabilities. Generate images, videos, and audio using AI models via fal.ai MCP. Covers prompt craft, model discovery, iteration workflow, cost management, and quality evaluation.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['design', 'marketing'], layer: 'fullstack' },
    companionTo: 'ai-capabilities',
  },
  {
    slug: 'ai-openrouter',
    title: 'AI: OpenRouter',
    description: 'Implementation skill for ai-capabilities. Patterns for integrating OpenRouter as a unified AI gateway. Covers SDK options, model routing, fallback chains, provider preferences, structured output, streaming, tool use, and cost management.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['engineering'], layer: 'backend' },
    companionTo: 'ai-capabilities',
  },
  {
    slug: 'authentication',
    title: 'Authentication',
    description: 'Auth patterns — passwordless, OAuth, MFA, session management, token lifecycle, dev bypass. Language-agnostic principles.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'engineering'], layer: 'backend' },
  },
  {
    slug: 'auth-clerk',
    title: 'Auth: Clerk',
    description: 'Clerk integration for Next.js App Router. Provider setup, middleware, pre-built components, webhook sync to local DB.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'backend' },
    companionTo: 'authentication',
  },
  {
    slug: 'auth-custom-otp',
    title: 'Auth: Custom OTP',
    description: 'Custom email OTP auth with Jose JWT. OTP generation, hashing, verification, domain restriction, Edge-compatible middleware.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'backend' },
    companionTo: 'authentication',
  },
  {
    slug: 'authorization',
    title: 'Authorization',
    description: 'RBAC, ABAC, permission checks, policy enforcement, resource-level access, least privilege. Language-agnostic principles.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'engineering'], layer: 'backend' },
  },
  {
    slug: 'authz-rbac-drizzle',
    title: 'Authz: RBAC with Drizzle',
    description: 'RBAC implementation with Drizzle ORM. Role schema, permission checking, middleware guards, UI-level gates.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'backend' },
    companionTo: 'authorization',
  },
  {
    slug: 'app-layout',
    title: 'App Layout',
    description: 'Shell layout patterns, responsive grid configs, navigation widgets. This app uses Pattern A (TopBar + Sidebar) — responsive breakpoints (no sidebar on mobile, icon sidebar on tablet, full sidebar on desktop).',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'design'], layer: 'frontend' },
  },
  {
    slug: 'backend-patterns',
    title: 'Backend Patterns',
    description: 'Server-side patterns for reliable, maintainable backend code. Covers repositories, use cases, error handling, validation, caching, resilience, API design, rate limiting, and audit logging.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'engineering'], layer: 'backend' },
  },
  {
    slug: 'brand-design-system',
    title: 'Brand Design System',
    description: 'Semantic color tokens (var(--color-*)), typography (Jost), theming (Light + Night by default), Phosphor Icons rules, logo/favicon rules, brand voice.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['design', 'product-development'], layer: 'design' },
  },
  {
    slug: 'clean-architecture',
    title: 'Clean Architecture',
    description: 'Project structure, domain objects, use cases, repositories, mappers, entities, and feature organization. Separates concerns into layers: entities, use cases, gateways, and controllers.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'fullstack' },
  },
  {
    slug: 'coding-standards',
    title: 'Coding Standards',
    description: 'Small composable functions, functional core/imperative shell, naming conventions, Result<T,E> pattern, immutability, type safety.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'fullstack' },
  },
  {
    slug: 'content-design',
    title: 'Content Design',
    description: 'User-facing text patterns, microcopy, error messages, empty states, confirmation dialogs, loading states, accessibility in copy.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['design', 'product-development'], layer: 'frontend' },
  },
  {
    slug: 'creative-toolkit',
    title: 'Creative Toolkit',
    description: 'Design patterns for visual storytelling, glassmorphism, layered backgrounds, color composition, typography pairing, motion principles.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['design', 'marketing'], layer: 'design' },
  },
  {
    slug: 'database-design',
    title: 'Database Design',
    description: 'SQL vs NoSQL vs cache — when to use each. Schema patterns, migrations, indexing, transactions, soft deletes, audit trails. Language-agnostic principles.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'engineering'], layer: 'backend' },
  },
  {
    slug: 'db-neon-drizzle',
    title: 'DB: Neon + Drizzle',
    description: 'Neon serverless Postgres with Drizzle ORM. Connection setup, schema definition, migrations, query patterns, seed scripts.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'backend' },
    companionTo: 'database-design',
  },
  {
    slug: 'db-redis',
    title: 'DB: Redis / Upstash',
    description: 'Redis via Upstash for caching, rate limiting, sessions, pub/sub. REST-based, serverless-friendly.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'backend' },
    companionTo: 'database-design',
  },
  {
    slug: 'db-supabase',
    title: 'DB: Supabase',
    description: 'Supabase integration. RLS policies, realtime, storage, Edge Functions, migration workflow.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'backend' },
    companionTo: 'database-design',
  },
  {
    slug: 'design-foundations',
    title: 'Design Foundations',
    description: 'Gestalt principles, 8px spacing system, visual hierarchy, alignment, contrast, negative space, squint test, detail-oriented design.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['design'], layer: 'design' },
  },
  {
    slug: 'documentation-research',
    title: 'Documentation Research',
    description: 'When to consult documentation vs knowledge, source hierarchy for version-sensitive questions, checklist for finding authoritative sources.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'email-sending',
    title: 'Email Sending',
    description: 'Transactional vs marketing, templates, deliverability, rate limiting, bounce handling, unsubscribe. Language-agnostic principles.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'engineering'], layer: 'backend' },
  },
  {
    slug: 'email-mailgun',
    title: 'Email: Mailgun',
    description: 'Mailgun SDK integration. Sending, HTML templates, domain verification, webhooks, batch sending, sandbox mode.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'backend' },
    companionTo: 'email-sending',
  },
  {
    slug: 'eval-driven-development',
    title: 'Eval-Driven Development',
    description: 'EDD workflow, deterministic vs LLM-as-judge evaluations, handling non-determinism, eval iteration loops, quality gates via automated checks.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'file-storage',
    title: 'File Storage',
    description: 'Upload validation, CDN, access control, signed URLs, size/format limits, cleanup, dev fallbacks. Language-agnostic principles.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'engineering'], layer: 'backend' },
  },
  {
    slug: 'frontend-architecture',
    title: 'Frontend Architecture',
    description: '7-layer UI architecture (Components → Widgets → Domain Objects → ACL → Screen Renderer → Slots), inline styles with CSS custom properties, grid system, TypeScript conventions.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'engineering'], layer: 'frontend' },
  },
  {
    slug: 'interaction-motion',
    title: 'Interaction & Motion',
    description: 'Motion vocabulary, duration principles (micro/medium/large timescales), easing patterns (entrance vs exit), state transitions, choreography.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['design', 'product-development'], layer: 'frontend' },
  },
  {
    slug: 'local-development',
    title: 'Local Development',
    description: 'Dev/prod parity, env vars, service fallbacks, seed data, dev bypasses, one-command bootstrap. Language-agnostic principles.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global', 'operations'], layer: 'fullstack' },
  },
  {
    slug: 'mcp-server-patterns',
    title: 'MCP Server Patterns',
    description: 'Model Context Protocol server patterns for agentic tool integration. Covers tool descriptions, resource design, input validation, and output formatting.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['engineering', 'operations'], layer: 'infrastructure' },
  },
  {
    slug: 'nextjs-app-router-turbopack',
    title: 'Next.js App Router + Turbopack',
    description: 'Next.js App Router patterns with Turbopack bundler, Server Components by default, streaming, caching model, edge functions.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'fullstack' },
  },
  {
    slug: 'observability',
    title: 'Observability',
    description: 'Post-launch quality — error tracking, structured logging, real user monitoring, uptime, alerting, and AI feature monitoring.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['operations', 'engineering'], layer: 'infrastructure' },
  },
  {
    slug: 'playwright-e2e',
    title: 'Playwright E2E',
    description: 'End-to-end testing patterns with Playwright. Covers test structure, locators, assertions, fixtures, CI integration.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['engineering'], layer: 'fullstack' },
  },
  {
    slug: 'planning',
    title: 'Planning',
    description: 'The discipline of planning before execution in AI-human collaborative development. Structured planning with progressive elaboration, phase gates, dependency marking, and failure classification.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'pptx-export',
    title: 'PPTX Export',
    description: 'PowerPoint generation with PptxGenJS. Covers brand fidelity, text overflow prevention, file integrity, spatial balance, icon export, slide templating.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['marketing', 'design'], layer: 'frontend' },
  },
  {
    slug: 'presentation',
    title: 'Presentation',
    description: 'Narrative-driven presentation design. Covers 7-phase planning process, story structure, art direction, composition patterns, pacing, emotional arc.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['marketing', 'design'], layer: 'design' },
  },
  {
    slug: 'presentation-html-implementation',
    title: 'Presentation HTML Implementation',
    description: 'Single HTML file presentation pattern with slide transitions, footer bar, design toolkit. Covers glassmorphism, layered backgrounds, responsive slide sizing.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['marketing', 'design'], layer: 'frontend' },
  },
  {
    slug: 'print-design',
    title: 'Print Design',
    description: 'Print publication design. Covers three-zone system (bleed/trim/safe area), 300 DPI minimum, CMYK color, print measurements in mm, crop marks.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['design', 'marketing'], layer: 'design' },
  },
  {
    slug: 'prompt-refinement',
    title: 'Prompt Refinement',
    description: 'Translates unstructured user requests into clear, AI-effective prompts. Clarifies intent, identifies scope, selects relevant skills, and suggests a refined prompt proportional to the original request.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'project-documentation',
    title: 'Project Documentation',
    description: 'Defines how to build and maintain living project documentation that auto-updates alongside development, serves as a knowledge base for humans and AI, and is accessible through a URL. Covers Diataxis structure, MDX authoring, CI-enforced quality.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'project-reference',
    title: 'Project Reference',
    description: 'How to maintain a living project reference document that AI agents and humans use to prevent regression, context loss, and decision contradiction as projects grow.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'quality-assurance',
    title: 'Quality Assurance',
    description: 'Quality dimensions — trust, effectiveness, reliability, emotion, craft. Flowing top-down (from vision) and bottom-up (from implementation).',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'research',
    title: 'Research',
    description: 'The discipline of investigating before acting. Teaches how to calibrate research depth to decision impact, evaluate sources critically, falsify hypotheses, debug scientifically, and synthesise findings into trade-off analyses.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'responsiveness',
    title: 'Responsiveness',
    description: 'Content-driven responsive design. Breakpoint discovery from content priorities, not devices. Behavior specification per breakpoint, information density management.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'design'], layer: 'frontend' },
  },
  {
    slug: 'roadmap',
    title: 'Roadmap',
    description: 'Defines how to maintain a living roadmap that auto-updates as work progresses. Structured as Now / Next / Later / Parking Lot / Bugs / Completed. Works with any project type.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'security-review',
    title: 'Security Review',
    description: 'Threat modeling, least privilege, defense in depth, secure by default, never trust the client. Covers authentication, authorization, secrets management, injection prevention.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['engineering', 'operations'], layer: 'backend' },
  },
  {
    slug: 'skill-creation',
    title: 'Skill Creation',
    description: 'How to write effective AI coding skills (SKILL.md files). A skill is a self-contained instruction set that steers AI code generation toward a specific outcome.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'skill-review',
    title: 'Skill Review',
    description: 'Three-layer skill quality audit: structural (completeness, format), individual (clarity, verifiability), collection coherence.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'strategic-context',
    title: 'Strategic Context',
    description: 'Knowledge persistence across sessions. Checkpointing at phase boundaries, storing ephemeral context in CLAUDE.md, maintaining decision history.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'storage-vercel-blob',
    title: 'Storage: Vercel Blob',
    description: 'Vercel Blob storage. Server/client uploads, public access, listing, deletion, dev filesystem fallback.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development', 'engineering'], layer: 'backend' },
    companionTo: 'file-storage',
  },
  {
    slug: 'testing-strategy',
    title: 'Testing Strategy',
    description: 'Testing pyramid and trophy — behavior-driven tests, not implementation details. Test levels (unit/component/E2E), mocking external boundaries only.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global', 'engineering'], layer: 'fullstack' },
  },
  {
    slug: 'user-management',
    title: 'User Management',
    description: 'User lifecycle, profiles, account states, soft delete, data export, GDPR. Language-agnostic principles.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development'], layer: 'backend' },
  },
  {
    slug: 'user-experience',
    title: 'User Experience',
    description: 'Jobs-to-be-done framing, cognitive principles (Fitts\'s Law, Hick\'s Law, Miller\'s Law), emotional design levels, trust, usability, delight.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'design'], layer: 'frontend' },
  },
  {
    slug: 'verification-loop',
    title: 'Verification Loop',
    description: 'Two modes of verification: quick check (build, type, lint) and full review (tests, diff, behavior). Verification phases, gating criteria, reporting.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global', 'operations'], layer: 'process' },
  },
  {
    slug: 'web-performance',
    title: 'Web Performance',
    description: 'Performance as a quality dimension — Core Web Vitals, loading strategies, bundle optimization, perceived performance, and Next.js-specific patterns.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'engineering'], layer: 'fullstack' },
  },

  {
    slug: 'social-features',
    title: 'Social Features',
    description: 'Defines when and how to add social features (comments, reactions, mentions, notifications, activity feeds) to enterprise applications. Apply when adding any user-to-user interaction, feedback mechanism, or awareness feature. Enterprise-focused — productivity over engagement loops.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development'], layer: 'fullstack' },
  },
  {
    slug: 'comments-reactions',
    title: 'Comments & Reactions',
    description: 'Implementation patterns for polymorphic comments (threaded), emoji reactions, and @mentions in enterprise applications. Covers database schemas, server actions, mention parsing, and UI components. Apply when building any comment/feedback system. Implementation skill for social-features.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development'], layer: 'fullstack' },
    companionTo: 'social-features',
  },
  {
    slug: 'activity-notifications',
    title: 'Activity & Notifications',
    description: 'Implementation patterns for activity event logging, notification delivery (in-app + email), preference management, and batched email digests. Covers database schemas, server actions, SSE/polling, and Vercel Cron integration. Apply when building awareness features. Implementation skill for social-features.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'implementation', domain: ['product-development'], layer: 'fullstack' },
    companionTo: 'social-features',
  },

  // ── Reference companions (5) ──────────────────────────────────────
  {
    slug: 'app-layout-patterns-reference',
    title: 'App Layout Patterns Reference',
    description: 'Layout pattern specifications for Patterns B, C, and D. Reference lookup for app-layout skill. Contains shell configurations, responsive breakpoint mappings, and grid declarations.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'reference', domain: ['product-development', 'design'], layer: 'frontend' },
    companionTo: 'app-layout',
  },
  {
    slug: 'brand-tokens-reference',
    title: 'Brand Tokens Reference',
    description: 'Token lookup tables and CSS variable mappings for all themes (Light, Night, Dark, Legacy). Reference data companion to brand-design-system.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'reference', domain: ['design'], layer: 'design' },
    companionTo: 'brand-design-system',
  },
  {
    slug: 'pptx-export-reference',
    title: 'PPTX Export Reference',
    description: 'Quality gate checklist and spacing constants for PPTX export. Reference companion — for rules see pptx-export.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'reference', domain: ['design'], layer: 'design' },
    companionTo: 'pptx-export',
  },
  {
    slug: 'creative-toolkit-charts-reference',
    title: 'Creative Toolkit Charts Reference',
    description: 'Nivo chart theme configuration and chart-specific styling patterns. Reference lookup for creative-toolkit.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'reference', domain: ['design'], layer: 'design' },
    companionTo: 'creative-toolkit',
  },
  {
    slug: 'social-features-reference',
    title: 'Social Features Reference',
    description: 'Schema templates, reaction emoji registry, notification type registry, and UI patterns for social features. Reference companion — for rules see social-features, comments-reactions, and activity-notifications.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'reference', domain: ['product-development'], layer: 'fullstack' },
    companionTo: 'social-features',
  },
];

function getProjectRoot(): string {
  return resolve(process.cwd());
}

export function getAllSkills(): SkillData[] {
  const root = getProjectRoot();
  return SKILL_DEFINITIONS.map((skill) => {
    const filePath = resolve(root, 'skills', `${skill.slug}.md`);
    const content = existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
    return { ...skill, content };
  });
}

/** Lightweight catalog — slug, title, description only. No file I/O. */
export function getSkillCatalog(): Array<{ slug: string; title: string; description: string }> {
  return SKILL_DEFINITIONS.map(({ slug, title, description }) => ({ slug, title, description }));
}

export function getSkillBySlug(slug: string): SkillData | null {
  const root = getProjectRoot();
  const definition = SKILL_DEFINITIONS.find((s) => s.slug === slug);
  if (!definition) return null;

  const filePath = resolve(root, 'skills', `${slug}.md`);
  const content = existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
  return { ...definition, content };
}

/** Returns only behavioural skills (excludes reference companions) */
export function getBehaviouralSkills(): SkillData[] {
  return getAllSkills().filter((s) => s.tags.type !== 'reference');
}

/** Returns reference companions for a given parent skill slug */
export function getCompanionsFor(parentSlug: string): SkillData[] {
  return getAllSkills().filter((s) => s.companionTo === parentSlug);
}

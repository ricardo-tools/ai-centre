import skillsBundle from './skills-bundle.generated.json';

/** Skill type — what kind of skill this is */
export type SkillType = 'principle' | 'implementation' | 'reference';

/** Domain — who uses this skill */
export type SkillDomain = 'product-development' | 'marketing' | 'design' | 'engineering' | 'operations' | 'global';

/** Layer — where it applies in the stack */
export type SkillLayer = 'frontend' | 'backend' | 'fullstack' | 'infrastructure' | 'design' | 'process' | 'workflow';

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
export const SKILL_LAYERS: SkillLayer[] = ['frontend', 'backend', 'fullstack', 'infrastructure', 'design', 'process', 'workflow'];

/** Human-readable labels */
export const TYPE_LABELS: Record<SkillType, string> = { principle: 'Principle', implementation: 'Implementation', reference: 'Reference' };
export const DOMAIN_LABELS: Record<SkillDomain, string> = { 'product-development': 'Product', marketing: 'Marketing', design: 'Design', engineering: 'Engineering', operations: 'Operations', global: 'Global' };
export const LAYER_LABELS: Record<SkillLayer, string> = { frontend: 'Frontend', backend: 'Backend', fullstack: 'Full Stack', infrastructure: 'Infrastructure', design: 'Design', process: 'Process', workflow: 'Workflow' };

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
    slug: 'ai-fal-media',
    title: 'AI: fal.ai Media',
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
    slug: 'db-redis-upstash',
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
    slug: 'flow',
    title: 'Flow',
    description: 'Core workflow router for human-AI paired work. Defines phases (PLANNING, IMPLEMENTATION, POST-DELIVERY), safety guardrails, and session commands. Does not define HOW to implement — plan templates define methodology.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
  },
  {
    slug: 'flow-tdd',
    title: 'Flow: TDD',
    description: 'Opinion companion for flow. The single testing skill — covers what to test, at which level, how to write scenarios (Gherkin for integration + E2E), data isolation, test data factories, mocking strategy, and the hardening gate.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
  },
  {
    slug: 'flow-eval-driven',
    title: 'Flow: Eval-Driven',
    description: 'Opinion companion for flow. Eval-driven development — implement each scenario, evaluate by running the app like a real user (Playwright headless, console logs, server logs, HTML inspection, screenshots), then run the targeted test.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
  },
  {
    slug: 'flow-observability',
    title: 'Flow: Observability',
    description: 'Opinion companion for flow. Granular structured logging at every code path, controlled by log level per environment. Code MUST add logs — silent code is a bug.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
  },
  {
    slug: 'flow-plan-log',
    title: 'Flow: Plan Log',
    description: 'Opinion companion for flow. Maintains .plans/LOG.md — a structured execution log of all plans. Active Context (AI-optimised), Plan & Chapter Overview (human-readable), Execution Log (detailed history).',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
  },
  {
    slug: 'flow-planning',
    title: 'Flow: Planning',
    description: 'Plan structure and planning methodology. Defines folder layout (.plans/), templates, and the full planning cycle: triage, research, debate, drafting, and iterative review.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
  },
  {
    slug: 'flow-research',
    title: 'Flow: Research',
    description: 'Research methodology for evidence-based decisions. Covers four research types: documentation lookup, technology comparison, bug investigation, and pattern/best-practice research.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
  },
  {
    slug: 'flow-prototype',
    title: 'Flow: Prototype',
    description: 'Lightweight prototyping workflow. Prototypes live in /prototypes, use the same stack as the main app, require no tests or planning. Divergent exploration with three agents (Strict, Adaptive, Creative).',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
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
    description: 'End-to-end testing patterns with Playwright. Covers test structure, locators, assertions, fixture workarounds, per-worker DB isolation, 3-tier data lifecycle, diagnostics, CI integration.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'implementation', domain: ['engineering'], layer: 'fullstack' },
    companionTo: 'testing-strategy',
  },
  {
    slug: 'playwright-e2e-reference',
    title: 'Playwright E2E Reference',
    description: 'Copy-paste implementation templates for Playwright E2E infrastructure: config, helpers, seed data, test API, global setup/teardown, per-worker DB isolation, 3-tier data lifecycle.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'reference', domain: ['engineering'], layer: 'fullstack' },
    companionTo: 'playwright-e2e',
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
    slug: 'presentation-html',
    title: 'Presentation HTML',
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
    slug: 'flow-project-docs',
    title: 'Flow: Project Docs',
    description: 'Opinion companion for flow. Docs are a separate Next.js app at /docs. Diataxis structure, MDX authoring, React Flow diagrams with dagre auto-layout. Updated after plan completion, not per task.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
  },
  {
    slug: 'flow-project-reference',
    title: 'Flow: Project Reference',
    description: 'Opinion companion for flow. Living project reference document that AI agents and humans use to prevent regression, context loss, and decision contradiction as projects grow.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
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
    slug: 'responsiveness',
    title: 'Responsiveness',
    description: 'Content-driven responsive design. Breakpoint discovery from content priorities, not devices. Behavior specification per breakpoint, information density management.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['product-development', 'design'], layer: 'frontend' },
  },
  {
    slug: 'flow-roadmap',
    title: 'Flow: Roadmap',
    description: 'Opinion companion for flow. Defines how to maintain a living roadmap that auto-updates as work progresses. Structured as Now / Next / Later / Parking Lot / Bugs / Completed.',
    isOfficial: true,
    version: '1.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
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
    slug: 'skill-review',
    title: 'Skill Review',
    description: 'Audit and score skills against the Agent Skills open spec (9 dimensions, 27-point scale). Detects contradictions, staleness, gaps, and overlap across the library. Generates actionable improvement reports usable as prompts.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'process' },
  },
  {
    slug: 'flow-strategic-context',
    title: 'Flow: Strategic Context',
    description: 'Opinion companion for flow. Knowledge persistence across AI sessions. Dispatch-count checkpointing, phase-boundary compaction, decision history.',
    isOfficial: true,
    version: '2.0.0',
    tags: { type: 'principle', domain: ['global'], layer: 'workflow' },
    companionTo: 'flow',
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

];

const bundle = skillsBundle as Record<string, { slug: string; content: string; references: Array<{ filename: string; content: string }>; assets: Array<{ filename: string; base64: string }> }>;

export function getAllSkills(): SkillData[] {
  return SKILL_DEFINITIONS.map((skill) => {
    const entry = bundle[skill.slug];
    return { ...skill, content: entry?.content ?? '' };
  });
}

/** Lightweight catalog — slug, title, description only. No file I/O. */
export function getSkillCatalog(): Array<{ slug: string; title: string; description: string }> {
  return SKILL_DEFINITIONS.map(({ slug, title, description }) => ({ slug, title, description }));
}

export function getSkillBySlug(slug: string): SkillData | null {
  const definition = SKILL_DEFINITIONS.find((s) => s.slug === slug);
  if (!definition) return null;

  const entry = bundle[slug];
  return { ...definition, content: entry?.content ?? '' };
}

/** Returns only behavioural skills (excludes reference companions) */
export function getBehaviouralSkills(): SkillData[] {
  return getAllSkills().filter((s) => s.tags.type !== 'reference');
}

/** Returns companion skills (opinion/implementation) for a given parent skill slug */
export function getCompanionsFor(parentSlug: string): SkillData[] {
  return getAllSkills().filter((s) => s.companionTo === parentSlug);
}

/** Returns reference file contents from the pre-built bundle */
export function getReferencesFor(slug: string): Array<{ filename: string; content: string }> {
  return bundle[slug]?.references ?? [];
}

/** Returns asset file buffers from the pre-built bundle (decoded from base64) */
export function getAssetsFor(slug: string): Array<{ filename: string; buffer: Buffer }> {
  const entry = bundle[slug];
  if (!entry?.assets?.length) return [];
  return entry.assets.map((a) => ({
    filename: a.filename,
    buffer: Buffer.from(a.base64, 'base64'),
  }));
}

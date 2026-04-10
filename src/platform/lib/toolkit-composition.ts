// ─── Types ───────────────────────────────────────────────────────────────────

export type SkillSlug = string;

export interface DomainDefinition {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly skills: readonly SkillSlug[];
  readonly recommendedAddons: readonly string[];
}

export interface ImplementationOption {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly skills: readonly SkillSlug[];
}

export interface FeatureAddonDefinition {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  readonly principleSkills: readonly SkillSlug[];
  readonly implementations: readonly ImplementationOption[];
}

export interface CompositionSelection {
  readonly domainSlug: string;
  readonly addonSlugs: readonly string[];
  readonly implementationChoices: Readonly<Record<string, string | null>>;
}

// ─── Layer 1: Foundation Skills (always included) ────────────────────────────

export const FOUNDATION_SKILLS: readonly SkillSlug[] = [
  'coding-standards',
  'clean-architecture',
  'flow-strategic-context',
  'quality-assurance',
  'flow-project-reference',
  'flow-roadmap',
  'skill-review',
] as const;

// ─── Layer 2: Domains ────────────────────────────────────────────────────────

export const DOMAINS: readonly DomainDefinition[] = [
  {
    slug: 'web-app',
    title: 'Web Application',
    description: 'Full-stack web application with Next.js, responsive UI, and production-grade infrastructure.',
    icon: '🖥️',
    skills: [
      'nextjs-app-router-turbopack',
      'frontend-architecture',
      'brand-design-system',
      'design-foundations',
      'app-layout',
      'responsiveness',
      'content-design',
      'user-experience',
      'accessibility',
      'interaction-motion',
      'web-performance',
      'backend-patterns',
      'security-review',
      'observability',
      'local-development',
    ],
    recommendedAddons: ['auth', 'database', 'testing'],
  },
  {
    slug: 'api-service',
    title: 'API Service',
    description: 'Backend API service with clean architecture, security, and observability.',
    icon: '⚡',
    skills: [
      'backend-patterns',
      'security-review',
      'observability',
      'local-development',
    ],
    recommendedAddons: ['database', 'auth', 'testing'],
  },
  {
    slug: 'presentation',
    title: 'Presentation',
    description: 'Standalone HTML/JS presentations with themed slides and visual storytelling.',
    icon: '📊',
    skills: [
      'brand-design-system',
      'design-foundations',
      'presentation',
      'presentation-html',
      'creative-toolkit',
    ],
    recommendedAddons: ['pptx-export'],
  },
  {
    slug: 'print',
    title: 'Print Design',
    description: 'Print-ready designs with brand consistency and professional typography.',
    icon: '🖨️',
    skills: [
      'brand-design-system',
      'design-foundations',
      'print-design',
      'creative-toolkit',
    ],
    recommendedAddons: [],
  },
  {
    slug: 'landing-page',
    title: 'Landing Page',
    description: 'Marketing landing page with brand consistency, responsive design, and performance.',
    icon: '🚀',
    skills: [
      'nextjs-app-router-turbopack',
      'frontend-architecture',
      'brand-design-system',
      'design-foundations',
      'responsiveness',
      'content-design',
      'creative-toolkit',
      'interaction-motion',
      'web-performance',
      'accessibility',
      'user-experience',
    ],
    recommendedAddons: [],
  },
  {
    slug: 'documentation-site',
    title: 'Documentation Site',
    description: 'Documentation site with clear information architecture and accessible design.',
    icon: '📚',
    skills: [
      'nextjs-app-router-turbopack',
      'frontend-architecture',
      'brand-design-system',
      'design-foundations',
      'content-design',
      'responsiveness',
      'accessibility',
      'web-performance',
      'flow-project-docs',
    ],
    recommendedAddons: [],
  },
] as const;

// ─── Layer 3 & 4: Feature Add-ons ───────────────────────────────────────────

export const FEATURE_ADDONS: readonly FeatureAddonDefinition[] = [
  {
    slug: 'auth',
    title: 'Authentication & Users',
    description: 'User authentication and session management.',
    icon: '🔐',
    principleSkills: ['authentication', 'authorization', 'user-management'],
    implementations: [
      { slug: 'clerk', title: 'Clerk', description: 'Managed auth with Clerk.', skills: ['auth-clerk'] },
      { slug: 'custom-otp', title: 'Custom OTP', description: 'Custom email OTP with JWT sessions.', skills: ['auth-custom-otp'] },
    ],
  },
  {
    slug: 'database',
    title: 'Database',
    description: 'Persistent data storage and schema management.',
    icon: '🗄️',
    principleSkills: ['database-design'],
    implementations: [
      { slug: 'neon-drizzle', title: 'Neon + Drizzle', description: 'Serverless Postgres with Drizzle ORM.', skills: ['db-neon-drizzle'] },
      { slug: 'supabase', title: 'Supabase', description: 'Postgres with Supabase platform.', skills: ['db-supabase'] },
      { slug: 'redis', title: 'Redis', description: 'In-memory data store with Redis.', skills: ['db-redis-upstash'] },
    ],
  },
  {
    slug: 'rbac',
    title: 'Role-Based Access',
    description: 'Fine-grained role and permission management.',
    icon: '🛡️',
    principleSkills: ['authorization'],
    implementations: [
      { slug: 'rbac-drizzle', title: 'RBAC with Drizzle', description: 'Role-based access control via Drizzle ORM.', skills: ['authz-rbac-drizzle'] },
    ],
  },
  {
    slug: 'file-storage',
    title: 'File Storage',
    description: 'Upload, store, and serve files.',
    icon: '📁',
    principleSkills: ['file-storage'],
    implementations: [
      { slug: 'vercel-blob', title: 'Vercel Blob', description: 'File storage with Vercel Blob.', skills: ['storage-vercel-blob'] },
    ],
  },
  {
    slug: 'ai-features',
    title: 'AI Features',
    description: 'LLM integration and AI-powered capabilities.',
    icon: '🤖',
    principleSkills: ['ai-capabilities'],
    implementations: [
      { slug: 'openrouter', title: 'OpenRouter', description: 'Multi-model access via OpenRouter.', skills: ['ai-openrouter'] },
      { slug: 'claude', title: 'Claude', description: 'Direct Claude API integration.', skills: ['ai-claude'] },
      { slug: 'fal', title: 'fal.ai', description: 'Image and media generation via fal.ai.', skills: ['ai-fal-media'] },
    ],
  },
  {
    slug: 'email',
    title: 'Email Sending',
    description: 'Transactional and notification email delivery.',
    icon: '📧',
    principleSkills: ['email-sending'],
    implementations: [
      { slug: 'mailgun', title: 'Mailgun', description: 'Email delivery via Mailgun.', skills: ['email-mailgun'] },
    ],
  },
  {
    slug: 'pptx-export',
    title: 'PPTX Export',
    description: 'Export presentations to PowerPoint format.',
    icon: '📑',
    principleSkills: ['pptx-export'],
    implementations: [],
  },
  {
    slug: 'testing',
    title: 'Testing',
    description: 'Automated testing strategy and E2E coverage.',
    icon: '🧪',
    principleSkills: ['testing-strategy'],
    implementations: [
      { slug: 'playwright', title: 'Playwright E2E', description: 'End-to-end testing with Playwright.', skills: ['playwright-e2e'] },
    ],
  },
  {
    slug: 'observability-addon',
    title: 'Observability',
    description: 'Logging, metrics, and tracing for production systems.',
    icon: '📡',
    principleSkills: ['observability'],
    implementations: [],
  },
  {
    slug: 'mcp',
    title: 'MCP Server',
    description: 'Model Context Protocol server for AI tool integration.',
    icon: '🔌',
    principleSkills: ['mcp-server-patterns'],
    implementations: [],
  },
] as const;

// ─── Resolver ────────────────────────────────────────────────────────────────

export function resolveComposition(selection: CompositionSelection): SkillSlug[] {
  const skillSet = new Set<SkillSlug>();

  // Layer 1: Foundation (always)
  for (const s of FOUNDATION_SKILLS) skillSet.add(s);

  // Layer 2: Domain
  const domain = DOMAINS.find((d) => d.slug === selection.domainSlug);
  if (domain) {
    for (const s of domain.skills) skillSet.add(s);
  }

  // Layer 3+4: Feature add-ons + implementation choices
  for (const addonSlug of selection.addonSlugs) {
    const addon = FEATURE_ADDONS.find((f) => f.slug === addonSlug);
    if (!addon) continue;
    for (const s of addon.principleSkills) skillSet.add(s);

    const chosenImpl = selection.implementationChoices[addonSlug];
    if (chosenImpl) {
      const impl = addon.implementations.find((i) => i.slug === chosenImpl);
      if (impl) {
        for (const s of impl.skills) skillSet.add(s);
      }
    }
  }

  return Array.from(skillSet);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getDomain(slug: string): DomainDefinition | undefined {
  return DOMAINS.find((d) => d.slug === slug);
}

export function getFeatureAddon(slug: string): FeatureAddonDefinition | undefined {
  return FEATURE_ADDONS.find((f) => f.slug === slug);
}

export function getRecommendedAddons(domainSlug: string): FeatureAddonDefinition[] {
  const domain = getDomain(domainSlug);
  if (!domain) return [];
  return domain.recommendedAddons
    .map((slug) => getFeatureAddon(slug))
    .filter((addon): addon is FeatureAddonDefinition => addon !== undefined);
}

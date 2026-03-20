import { resolveComposition, type CompositionSelection } from './toolkit-composition';

// ─── Toolkit Presets (composition-based) ─────────────────────────────────────

export interface ToolkitPreset {
  slug: string;
  title: string;
  description: string;
  icon: string;
  compositionSelection: CompositionSelection;
  skills: string[];
}

function preset(
  slug: string,
  title: string,
  description: string,
  icon: string,
  selection: CompositionSelection,
): ToolkitPreset {
  return {
    slug,
    title,
    description,
    icon,
    compositionSelection: selection,
    skills: resolveComposition(selection),
  };
}

export const TOOLKIT_PRESETS: ToolkitPreset[] = [
  preset(
    'presentation',
    'Presentation Toolkit',
    'Standalone HTML/JS presentations with themed slides and PPTX export.',
    '📊',
    {
      domainSlug: 'presentation',
      addonSlugs: ['pptx-export'],
      implementationChoices: {},
    },
  ),
  preset(
    'web-dashboard',
    'Web Dashboard Toolkit',
    'Full-stack web app with auth, database, and observability.',
    '🖥️',
    {
      domainSlug: 'web-app',
      addonSlugs: ['auth', 'database', 'testing', 'observability-addon'],
      implementationChoices: { auth: 'custom-otp', database: 'neon-drizzle' },
    },
  ),
  preset(
    'api-starter',
    'API Starter Toolkit',
    'Backend API with clean architecture, auth, and database.',
    '⚡',
    {
      domainSlug: 'api-service',
      addonSlugs: ['auth', 'database', 'testing'],
      implementationChoices: { auth: 'custom-otp', database: 'neon-drizzle' },
    },
  ),
  preset(
    'marketing-site',
    'Marketing Site Toolkit',
    'Landing page with brand consistency and responsive design.',
    '🚀',
    {
      domainSlug: 'landing-page',
      addonSlugs: [],
      implementationChoices: {},
    },
  ),
  preset(
    'ai-assistant',
    'AI Assistant Toolkit',
    'AI-powered web app with LLM integration and eval-driven development.',
    '🤖',
    {
      domainSlug: 'web-app',
      addonSlugs: ['ai-features', 'database', 'auth', 'testing'],
      implementationChoices: { 'ai-features': 'openrouter', database: 'neon-drizzle', auth: 'custom-otp' },
    },
  ),
];

// ─── Backward compatibility ──────────────────────────────────────────────────

export interface ArchetypeData {
  slug: string;
  title: string;
  description: string;
  skills: string[];
  icon: string;
}

export const ARCHETYPES: ArchetypeData[] = TOOLKIT_PRESETS.map((p) => ({
  slug: p.slug,
  title: p.title,
  description: p.description,
  skills: p.skills,
  icon: p.icon,
}));

export function getArchetypeBySlug(slug: string): ArchetypeData | undefined {
  return ARCHETYPES.find((a) => a.slug === slug);
}

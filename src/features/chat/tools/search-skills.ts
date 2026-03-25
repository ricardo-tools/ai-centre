/**
 * Tool: search_skills
 *
 * Searches the skill library by keyword, domain, or layer.
 * Returns top matches with title, description, and slug.
 */

import { getAllSkills } from '@/platform/lib/skills';

export const searchSkillsDefinition = {
  type: 'function' as const,
  function: {
    name: 'search_skills',
    description: 'Search the skill library for skills matching a query. Returns titles, descriptions, and slugs.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query — keywords describing what the user needs' },
        domain: { type: 'string', description: 'Optional domain filter (e.g. "engineering", "design", "marketing")' },
        layer: { type: 'string', description: 'Optional layer filter (e.g. "frontend", "backend", "fullstack")' },
        limit: { type: 'number', description: 'Max results (default 5)' },
      },
      required: ['query'],
    },
  },
};

/** Common synonyms to expand search coverage */
const SYNONYMS: Record<string, string[]> = {
  auth: ['authentication', 'authorization', 'login', 'otp', 'clerk'],
  dashboard: ['frontend', 'layout', 'app-layout', 'charts', 'data', 'responsiveness'],
  ui: ['frontend', 'design', 'layout', 'interaction', 'accessibility'],
  ux: ['user-experience', 'design', 'accessibility', 'interaction'],
  api: ['backend', 'rest', 'endpoint', 'server'],
  db: ['database', 'neon', 'drizzle', 'supabase', 'redis'],
  css: ['design', 'brand', 'tokens', 'styling'],
  testing: ['playwright', 'test', 'e2e', 'quality'],
  ai: ['claude', 'openrouter', 'fal', 'capabilities', 'agent'],
  charts: ['creative-toolkit', 'nivo', 'visualization', 'data'],
  slides: ['presentation', 'pptx'],
  pdf: ['print', 'export'],
};

export async function executeSearchSkills(args: {
  query: string;
  domain?: string;
  layer?: string;
  limit?: number;
}): Promise<string> {
  const allSkills = getAllSkills();
  const limit = args.limit ?? 5;

  // Split query into words and expand with synonyms
  const queryWords = args.query.toLowerCase().split(/\s+/).filter(Boolean);
  const expandedWords = new Set(queryWords);
  for (const word of queryWords) {
    const syns = SYNONYMS[word];
    if (syns) syns.forEach((s) => expandedWords.add(s));
  }

  let results = allSkills.filter((s) => {
    const text = `${s.slug} ${s.title} ${s.description} ${s.tags.domain.join(' ')} ${s.tags.layer} ${s.tags.type}`.toLowerCase();
    // Match if ANY expanded word appears in the skill text
    return [...expandedWords].some((word) => text.includes(word));
  });

  if (args.domain) {
    results = results.filter((s) => s.tags.domain.some((d) => d.includes(args.domain!.toLowerCase())));
  }
  if (args.layer) {
    results = results.filter((s) => s.tags.layer.toLowerCase().includes(args.layer!.toLowerCase()));
  }

  const topResults = results.slice(0, limit).map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.description,
    type: s.tags.type,
    layer: s.tags.layer,
    domains: s.tags.domain,
    url: `/skills/${s.slug}`,
  }));

  return JSON.stringify({
    count: topResults.length,
    total: results.length,
    skills: topResults,
  });
}

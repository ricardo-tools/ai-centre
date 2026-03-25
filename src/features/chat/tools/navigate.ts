/**
 * Tool: navigate
 *
 * Suggests a URL for the user to visit.
 * The client renders this as a clickable link in the chat.
 * Validates skill slugs before returning URLs.
 */

import { getSkillCatalog } from '@/platform/lib/skills';

export const navigateDefinition = {
  type: 'function' as const,
  function: {
    name: 'navigate',
    description: 'Suggest a page for the user to visit. Returns a URL and label.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'The URL path (e.g. /skills/accessibility, /generate?preset=presentation)' },
        label: { type: 'string', description: 'Human-readable label for the link' },
      },
      required: ['url', 'label'],
    },
  },
};

export async function executeNavigate(args: {
  url: string;
  label: string;
}): Promise<string> {
  // Validate skill URLs — reject non-existent slugs
  const skillMatch = args.url.match(/^\/skills\/([a-z0-9-]+)$/);
  if (skillMatch) {
    const slug = skillMatch[1];
    const catalog = getSkillCatalog();
    const exists = catalog.some((s) => s.slug === slug);
    if (!exists) {
      const partial = catalog.find((s) => s.slug.includes(slug) || slug.includes(s.slug));
      return JSON.stringify({
        error: `Skill "${slug}" does not exist.${partial ? ` Did you mean "${partial.slug}" (${partial.title})?` : ' Use search_skills to find valid skills.'}`,
      });
    }
  }

  return JSON.stringify({
    url: args.url,
    label: args.label,
    message: `Navigate to: [${args.label}](${args.url})`,
  });
}

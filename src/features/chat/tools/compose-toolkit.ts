/**
 * Tool: compose_toolkit
 *
 * Composes a toolkit from a domain + feature add-ons.
 * Returns the resolved skill list.
 */

import { DOMAINS, FEATURE_ADDONS, resolveComposition } from '@/platform/lib/toolkit-composition';

export const composeToolkitDefinition = {
  type: 'function' as const,
  function: {
    name: 'compose_toolkit',
    description: 'Compose a toolkit by selecting a domain and feature add-ons. Returns the resolved list of skills.',
    parameters: {
      type: 'object',
      properties: {
        domainSlug: {
          type: 'string',
          description: `Domain to base the toolkit on. Options: ${DOMAINS.map((d) => d.slug).join(', ')}`,
        },
        addonSlugs: {
          type: 'array',
          items: { type: 'string' },
          description: `Feature add-ons to include. Options: ${FEATURE_ADDONS.map((f) => f.slug).join(', ')}`,
        },
      },
      required: ['domainSlug'],
    },
  },
};

export async function executeComposeToolkit(args: {
  domainSlug: string;
  addonSlugs?: string[];
}): Promise<string> {
  const domain = DOMAINS.find((d) => d.slug === args.domainSlug);
  if (!domain) {
    return JSON.stringify({ error: `Unknown domain: ${args.domainSlug}. Available: ${DOMAINS.map((d) => d.slug).join(', ')}` });
  }

  const addonSlugs = args.addonSlugs ?? domain.recommendedAddons;
  const resolvedSkills = resolveComposition({
    domainSlug: args.domainSlug,
    addonSlugs,
    implementationChoices: {},
  });

  return JSON.stringify({
    domain: { slug: domain.slug, title: domain.title },
    addons: addonSlugs.map((slug) => {
      const addon = FEATURE_ADDONS.find((f) => f.slug === slug);
      return { slug, title: addon?.title ?? slug };
    }),
    skillCount: resolvedSkills.length,
    skills: resolvedSkills,
  });
}

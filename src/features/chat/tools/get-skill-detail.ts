/**
 * Tool: get_skill_detail
 *
 * Reads the full markdown content of a specific skill by slug.
 * Returns the content as CONTEXT for the AI to read and explain — not for display to the user.
 * The AI should synthesize a conversational explanation from the content, never dump raw markdown.
 */

import { getAllSkills } from '@/platform/lib/skills';

export const getSkillDetailDefinition = {
  type: 'function' as const,
  function: {
    name: 'get_skill_detail',
    description: 'Read the full content of a specific skill by slug. Use this when the user asks for details about a skill. The content is for YOU to read and explain — never paste it raw to the user.',
    parameters: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: 'The skill slug (e.g. "accessibility", "frontend-architecture", "clean-architecture")',
        },
      },
      required: ['slug'],
    },
  },
};

export async function executeGetSkillDetail(args: { slug: string }): Promise<string> {
  const allSkills = getAllSkills();
  const skill = allSkills.find((s) => s.slug === args.slug);

  if (!skill) {
    // Try fuzzy match
    const partial = allSkills.find((s) =>
      s.slug.includes(args.slug.toLowerCase()) || s.title.toLowerCase().includes(args.slug.toLowerCase()),
    );
    if (partial) {
      return JSON.stringify({
        found: true,
        slug: partial.slug,
        title: partial.title,
        content: partial.content,
        note: `Did you mean "${partial.slug}"? Here is its full content.`,
      });
    }
    return JSON.stringify({
      found: false,
      error: `Skill "${args.slug}" not found. Use search_skills to find available skills first.`,
    });
  }

  return JSON.stringify({
    found: true,
    slug: skill.slug,
    title: skill.title,
    description: skill.description,
    type: skill.tags.type,
    layer: skill.tags.layer,
    domains: skill.tags.domain,
    content: skill.content,
  });
}

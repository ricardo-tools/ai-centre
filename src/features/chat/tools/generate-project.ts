/**
 * Tool: generate_project
 *
 * Generates a project ZIP with selected skills.
 * Returns a download URL or base64 data.
 */

export const generateProjectDefinition = {
  type: 'function' as const,
  function: {
    name: 'generate_project',
    description:
      'Generate a downloadable ZIP containing selected skills. ' +
      'Two modes: "project" creates a full project bootstrap with .claude/skills/ and a tailored CLAUDE.md (requires projectName and projectDescription). ' +
      '"skills-only" creates a flat skills/ folder with just the skill files — no CLAUDE.md, no .claude prefix. ' +
      'Ask the user how they plan to use the skills before choosing a mode.',
    parameters: {
      type: 'object',
      properties: {
        skillSlugs: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of skill slugs to include',
        },
        mode: {
          type: 'string',
          enum: ['project', 'skills-only'],
          description: '"project" for full bootstrap with CLAUDE.md, "skills-only" for just the skill files in a flat folder',
        },
        projectName: {
          type: 'string',
          description: 'Short name for the project (required for "project" mode, ignored for "skills-only")',
        },
        projectDescription: {
          type: 'string',
          description: 'What the user is building (required for "project" mode, ignored for "skills-only")',
        },
        targetAudience: {
          type: 'string',
          description: 'Who will use the end product (optional, "project" mode only)',
        },
        keyConstraints: {
          type: 'string',
          description: 'Key constraints, must-haves, or tech requirements (optional, "project" mode only)',
        },
      },
      required: ['skillSlugs', 'mode'],
    },
  },
};

export async function executeGenerateProject(args: {
  skillSlugs: string[];
  mode: 'project' | 'skills-only';
  projectName?: string;
  projectDescription?: string;
  targetAudience?: string;
  keyConstraints?: string;
}): Promise<string> {
  if (args.skillSlugs.length === 0) {
    return JSON.stringify({ error: 'No skills selected. Please specify at least one skill slug.' });
  }

  const isProject = args.mode === 'project';

  if (isProject && (!args.projectName || !args.projectDescription)) {
    return JSON.stringify({ error: 'Project mode requires projectName and projectDescription.' });
  }

  const JSZip = (await import('jszip')).default;
  const { getAllSkills, getCompanionsFor, getReferencesFor, getAssetsFor } = await import('@/platform/lib/skills');
  const allSkills = getAllSkills();

  const zip = new JSZip();
  const included = new Set<string>();
  const skillDetails: Array<{ slug: string; description: string }> = [];

  // In project mode: .claude/skills/{slug}/
  // In skills-only mode: skills/{slug}/
  const skillsPrefix = isProject ? '.claude/skills' : 'skills';

  function addSkillToZip(skill: { slug: string; content: string; description: string }) {
    const skillDir = `${skillsPrefix}/${skill.slug}`;
    zip.file(`${skillDir}/SKILL.md`, skill.content);

    const references = getReferencesFor(skill.slug);
    for (const ref of references) {
      zip.file(`${skillDir}/references/${ref.filename}`, ref.content);
    }

    if (skill.slug === 'brand-design-system') {
      const assets = getAssetsFor(skill.slug);
      for (const asset of assets) {
        zip.file(`${skillDir}/assets/${asset.filename}`, asset.buffer);
      }
    }
  }

  for (const slug of args.skillSlugs) {
    const skill = allSkills.find(s => s.slug === slug);
    if (!skill || included.has(slug)) continue;
    addSkillToZip(skill);
    included.add(slug);
    skillDetails.push({ slug: skill.slug, description: skill.description });

    const companions = getCompanionsFor(slug);
    for (const comp of companions) {
      if (!included.has(comp.slug)) {
        addSkillToZip(comp);
        included.add(comp.slug);
        skillDetails.push({ slug: comp.slug, description: comp.description });
      }
    }
  }

  if (included.size === 0) {
    return JSON.stringify({ error: 'None of the specified skill slugs were found.' });
  }

  // Only add CLAUDE.md in project mode
  if (isProject) {
    const skillList = skillDetails
      .map(s => `- **.claude/skills/${s.slug}/SKILL.md** — ${s.description}`)
      .join('\n');

    const hasFlow = included.has('flow');
    const flowDirective = hasFlow
      ? `\n> **On any request:** apply the **flow** skill (\`.claude/skills/flow/SKILL.md\`). Scan the skill library for applicable skills. Triage the request, suggest research if non-trivial, suggest planning if multi-step. **Wait for user confirmation before starting work.** Always execute, no exceptions.\n`
      : '';

    const audienceSection = args.targetAudience
      ? `\n## Target Audience\n\n${args.targetAudience}\n`
      : '';

    const constraintsSection = args.keyConstraints
      ? `\n## Key Constraints\n\n${args.keyConstraints}\n`
      : '';

    const claudeMd = `# ${args.projectName}
${flowDirective}
## Project Description

${args.projectDescription}
${audienceSection}${constraintsSection}
---

## Included Skills

${skillList}

---

## Key Conventions

- **Styling:** Inline styles with \`var(--color-*)\` CSS custom properties. NO Tailwind. NO hardcoded hex colors.
- **Theming:** Light + Night themes. \`data-theme\` attribute on \`<html>\`.
- **Icons:** Phosphor Icons — \`regular\` weight default, \`fill\` for active, 20px default.
- **Spacing:** 8px base system (4/8/16/24/32/48).
- **Typography:** Jost font, weights 300-800.

---

## Getting Started

1. Open this project folder in VS Code
2. Start Claude Code
3. Claude will read this CLAUDE.md and the skill files automatically
4. Describe what you want to build — the skills guide Claude's output
`;
    zip.file('CLAUDE.md', claudeMd);
  }

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  const base64 = buffer.toString('base64');
  const nameSlug = isProject
    ? (args.projectName!.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) || 'project')
    : 'skills';
  const fileName = `${nameSlug}.zip`;

  return JSON.stringify({
    success: true,
    mode: args.mode,
    skillCount: included.size,
    fileName,
    base64,
    message: isProject
      ? `Project ZIP generated with ${included.size} skill(s). The download button is now available.`
      : `Skills ZIP generated with ${included.size} skill file(s). The download button is now available.`,
  });
}

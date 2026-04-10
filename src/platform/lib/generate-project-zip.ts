import JSZip from 'jszip';
import type { Skill } from '@/platform/domain/Skill';

export interface SkillReference {
  filename: string;
  content: string;
}

export interface SkillAsset {
  filename: string;
  buffer: Buffer;
}

export interface SkillBundle {
  skill: Skill;
  references: SkillReference[];
  assets: SkillAsset[];
}

interface GenerateZipOptions {
  archetypeName: string;
  archetypeDescription: string;
  skillBundles: SkillBundle[];
  userDescription: string;
  targetAudience?: string;
  keyConstraints?: string;
  includeTemplate?: boolean;
}

function generateClaudeMd(options: GenerateZipOptions): string {
  const hasFlow = options.skillBundles.some(b => b.skill.slug === 'flow');

  const skillList = options.skillBundles
    .map((b) => `- **.claude/skills/${b.skill.slug}/SKILL.md** — ${b.skill.description}`)
    .join('\n');

  const flowDirective = hasFlow
    ? `\n> **On any request:** apply the **flow** skill (\`.claude/skills/flow/SKILL.md\`). Scan the skill library for applicable skills. Triage the request, suggest research if non-trivial, suggest planning if multi-step. **Wait for user confirmation before starting work.** Always execute, no exceptions.\n`
    : '';

  const audienceSection = options.targetAudience
    ? `\n## Target Audience\n\n${options.targetAudience}\n`
    : '';

  const constraintsSection = options.keyConstraints
    ? `\n## Key Constraints\n\n${options.keyConstraints}\n`
    : '';

  return `# ${options.archetypeName}
${flowDirective}
${options.archetypeDescription}

---

## Project Description

${options.userDescription || '_No description provided._'}
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
}

function generatePresentationTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Presentation</title>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; font-family: 'Jost', sans-serif; }
    [data-theme="light"] { --bg: #FFFFFF; --text: #1A1B2E; --muted: #6B6E80; --accent: #FF5A28; --border: #E2E3EB; }
    [data-theme="night"] { --bg: #1A1B2E; --text: #E8E9F0; --muted: #9395A5; --accent: #FF5A28; --border: #2A2B3D; }
    body { background: var(--bg); color: var(--text); display: flex; flex-direction: column; }
    .slide-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px; cursor: pointer; }
    .footer { height: 44px; display: flex; align-items: center; justify-content: center; border-top: 1px solid var(--border); color: var(--muted); font-size: 14px; }
  </style>
</head>
<body>
  <div class="slide-container" onclick="alert('Replace this template with your presentation slides!')">
    <div style="text-align:center">
      <h1 style="font-size:48px;font-weight:800;margin-bottom:16px">Your Presentation Title</h1>
      <p style="font-size:20px;color:var(--muted)">Replace this template with your slides. See the presentation SKILL.md for the full specification.</p>
    </div>
  </div>
  <div class="footer">Template — Edit to add your slides</div>
</body>
</html>`;
}

export async function generateProjectZip(options: GenerateZipOptions): Promise<Blob> {
  const zip = new JSZip();

  zip.file('CLAUDE.md', generateClaudeMd(options));

  for (const { skill, references, assets } of options.skillBundles) {
    if (skill.content) {
      const skillDir = `.claude/skills/${skill.slug}`;
      zip.file(`${skillDir}/SKILL.md`, skill.content);

      for (const ref of references) {
        zip.file(`${skillDir}/references/${ref.filename}`, ref.content);
      }

      for (const asset of assets) {
        zip.file(`${skillDir}/assets/${asset.filename}`, asset.buffer);
      }
    }
  }

  if (options.includeTemplate) {
    zip.file('presentation-template.html', generatePresentationTemplate());
  }

  return zip.generateAsync({ type: 'blob' });
}

import JSZip from 'jszip';
import type { Skill } from '@/platform/domain/Skill';

interface GenerateZipOptions {
  archetypeName: string;
  archetypeDescription: string;
  selectedSkills: Skill[];
  userDescription: string;
  includeTemplate?: boolean;
}

function generateClaudeMd(options: GenerateZipOptions): string {
  const hasPromptRefinement = options.selectedSkills.some(s => s.slug === 'prompt-refinement');

  const skillList = options.selectedSkills
    .map((s) => `- **skills/${s.slug}.md** — ${s.description}`)
    .join('\n');

  const promptRefinementDirective = hasPromptRefinement
    ? `\n> **On any request:** apply the **prompt-refinement** skill (\`skills/prompt-refinement.md\`). Scan the skill library for applicable skills. Suggest research if non-trivial. Suggest planning if multi-step. Present a refined prompt. **Wait for user confirmation before starting work.** Always execute, no exceptions.\n`
    : '';

  return `# ${options.archetypeName} Project
${promptRefinementDirective}
${options.archetypeDescription}

---

## User Brief

${options.userDescription || '_No description provided._'}

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

  for (const skill of options.selectedSkills) {
    if (skill.content) {
      zip.file(`skills/${skill.slug}.md`, skill.content);
    }
  }

  if (options.includeTemplate) {
    zip.file('presentation-template.html', generatePresentationTemplate());
  }

  return zip.generateAsync({ type: 'blob' });
}

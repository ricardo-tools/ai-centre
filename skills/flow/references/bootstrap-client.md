---
name: flow-bootstrap-client
description: >
  Bootstrap flow for Flow CLI. Fetches skill catalog, downloads selected skills,
  creates .flow/project.json and CLAUDE.md. Companion to flow.
  Agent copies this code to .flow/lib/bootstrap.ts in the user's project.
---

# Flow Bootstrap Client

Implementation template for the `flow-bootstrap` command. The agent reads this reference and copies the code to `.flow/lib/bootstrap.ts`.

---

## .flow/lib/bootstrap.ts

```typescript
import { writeFileSync, mkdirSync, existsSync, readFileSync, appendFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { authenticatedFetch } from './auth';

const AI_CENTRE_URL = 'https://ai.ezycollect.tools';

interface CatalogSkill {
  slug: string;
  title: string;
  description: string;
  version: string;
  tags: { type: string; domain: string[]; layer: string };
  companionTo: string | null;
}

interface SkillContent {
  slug: string;
  title: string;
  version: string;
  content: string;
  references: Array<{ filename: string; content: string }>;
  assets: Array<{ filename: string; base64: string }>;
  checksum: string;
}

interface FlowProject {
  id: string;
  name: string;
  description: string;
  mode: 'claude-code' | 'claude-chat';
  skills: Array<{
    slug: string;
    version: string;
    checksum: string;
    forked: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

/** Fetch the skill catalog (public, no auth needed) */
export async function fetchCatalog(): Promise<CatalogSkill[]> {
  const res = await fetch(`${AI_CENTRE_URL}/api/skills/catalog`);
  if (!res.ok) throw new Error(`Failed to fetch skill catalog: ${res.status}`);
  return res.json();
}

/** Download a single skill's content (requires auth) */
export async function downloadSkill(slug: string): Promise<SkillContent> {
  const res = await authenticatedFetch(`/api/skills/${slug}/content`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'unknown' }));
    throw new Error(`Failed to download skill "${slug}": ${err.message || err.error}`);
  }
  return res.json();
}

/** Write a downloaded skill to the project's skills directory */
export function writeSkill(projectRoot: string, skill: SkillContent): void {
  const skillDir = join(projectRoot, '.claude', 'skills', skill.slug);
  mkdirSync(skillDir, { recursive: true });

  // Write main skill file
  writeFileSync(join(skillDir, 'SKILL.md'), skill.content);

  // Write references
  if (skill.references.length > 0) {
    const refsDir = join(skillDir, 'references');
    mkdirSync(refsDir, { recursive: true });
    for (const ref of skill.references) {
      writeFileSync(join(refsDir, ref.filename), ref.content);
    }
  }

  // Write assets
  if (skill.assets.length > 0) {
    const assetsDir = join(skillDir, 'assets');
    mkdirSync(assetsDir, { recursive: true });
    for (const asset of skill.assets) {
      writeFileSync(join(assetsDir, asset.filename), Buffer.from(asset.base64, 'base64'));
    }
  }
}

/** Create .flow/project.json */
export function writeProjectJson(
  projectRoot: string,
  name: string,
  description: string,
  skills: SkillContent[],
): FlowProject {
  const flowDir = join(projectRoot, '.flow');
  mkdirSync(flowDir, { recursive: true });
  mkdirSync(join(flowDir, 'plans'), { recursive: true });

  const project: FlowProject = {
    id: randomUUID(),
    name,
    description,
    mode: 'claude-code',
    skills: skills.map((s) => ({
      slug: s.slug,
      version: s.version,
      checksum: s.checksum,
      forked: false,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  writeFileSync(join(flowDir, 'project.json'), JSON.stringify(project, null, 2));
  return project;
}

/** Generate CLAUDE.md from selected skills */
export function generateClaudeMd(projectRoot: string, skills: SkillContent[]): void {
  const lines = [
    `# ${projectRoot.split('/').pop() ?? 'Project'}`,
    '',
    '## Applied Skills',
    '',
  ];

  for (const skill of skills) {
    lines.push(`> Apply the **${skill.title}** skill (\`.claude/skills/${skill.slug}/SKILL.md\`).`);
    lines.push('');
  }

  writeFileSync(join(projectRoot, 'CLAUDE.md'), lines.join('\n'));
}

/** Ensure .flow/credentials.json is in .gitignore */
export function ensureGitignore(projectRoot: string): void {
  const gitignorePath = join(projectRoot, '.gitignore');
  const entry = '.flow/credentials.json';

  if (existsSync(gitignorePath)) {
    const content = readFileSync(gitignorePath, 'utf-8');
    if (content.includes(entry)) return;
    appendFileSync(gitignorePath, `\n# Flow credentials (never commit)\n${entry}\n`);
  } else {
    writeFileSync(gitignorePath, `# Flow credentials (never commit)\n${entry}\n`);
  }
}
```

/**
 * Pre-build script: reads all skill files from disk and generates a JSON bundle.
 * This runs before `next build` so that runtime code never needs filesystem access.
 *
 * Output: src/platform/lib/skills-bundle.generated.json
 */

import { readFileSync, existsSync, readdirSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(__dirname, '..');
const SKILLS_DIR = join(ROOT, 'skills');
const OUTPUT = join(ROOT, 'src/platform/lib/skills-bundle.generated.json');

interface SkillBundle {
  slug: string;
  content: string;
  references: Array<{ filename: string; content: string }>;
  assets: Array<{ filename: string; base64: string }>;
}

function resolveSkillPath(slug: string): string {
  const dirPath = join(SKILLS_DIR, slug, 'SKILL.md');
  if (existsSync(dirPath)) return dirPath;
  return join(SKILLS_DIR, `${slug}.md`);
}

function getReferences(slug: string): Array<{ filename: string; content: string }> {
  const refsDir = join(SKILLS_DIR, slug, 'references');
  if (!existsSync(refsDir)) return [];
  return readdirSync(refsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({
      filename: f,
      content: readFileSync(join(refsDir, f), 'utf-8'),
    }));
}

function getAssets(slug: string): Array<{ filename: string; base64: string }> {
  const assetsDir = join(SKILLS_DIR, slug, 'assets');
  if (!existsSync(assetsDir)) return [];
  return readdirSync(assetsDir).map((f) => ({
    filename: f,
    base64: readFileSync(join(assetsDir, f)).toString('base64'),
  }));
}

// Read all skill slugs from the skills directory
const slugs = readdirSync(SKILLS_DIR).filter((entry) => {
  const entryPath = join(SKILLS_DIR, entry);
  // Include directories that contain SKILL.md, or .md files directly
  if (existsSync(join(entryPath, 'SKILL.md'))) return true;
  if (entry.endsWith('.md')) return true;
  return false;
});

const bundle: Record<string, SkillBundle> = {};

for (const entry of slugs) {
  const slug = entry.endsWith('.md') ? entry.replace(/\.md$/, '') : entry;
  const filePath = resolveSkillPath(slug);
  const content = existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';

  bundle[slug] = {
    slug,
    content,
    references: getReferences(slug),
    assets: getAssets(slug),
  };
}

writeFileSync(OUTPUT, JSON.stringify(bundle, null, 0));
const count = Object.keys(bundle).length;
const sizeKB = Math.round(readFileSync(OUTPUT).length / 1024);
console.log(`[prebuild-skills] Bundled ${count} skills (${sizeKB} KB) → ${OUTPUT}`);

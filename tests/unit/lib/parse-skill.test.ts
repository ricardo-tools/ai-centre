import { describe, it, expect } from 'vitest';
import { parseSkillContent } from '@/platform/lib/parse-skill';

describe('parseSkillContent', () => {
  const SKILL_WITH_FRONTMATTER = `---
name: test-skill
description: A test skill
---

# Test Skill

This is the intro paragraph.

- Feature one is important
- Feature two is also important
- Short

## Section One

Some content here.

\`\`\`ts
const x = 1;
\`\`\`

## Section Two

| Col A | Col B |
|---|---|
| 1 | 2 |

### Subsection

More content.
`;

  it('strips frontmatter and extracts the skill name from h1', () => {
    const result = parseSkillContent(SKILL_WITH_FRONTMATTER);
    expect(result.name).toBe('Test Skill');
  });

  it('extracts the intro text between h1 and first h2', () => {
    const result = parseSkillContent(SKILL_WITH_FRONTMATTER);
    expect(result.intro).toContain('intro paragraph');
  });

  it('extracts h2 sections', () => {
    const result = parseSkillContent(SKILL_WITH_FRONTMATTER);
    expect(result.sections).toHaveLength(2);
    expect(result.sections[0].title).toBe('Section One');
    expect(result.sections[1].title).toBe('Section Two');
  });

  it('nests h3 content within the parent h2 section', () => {
    const result = parseSkillContent(SKILL_WITH_FRONTMATTER);
    expect(result.sections[1].content).toContain('### Subsection');
  });

  it('extracts code blocks from sections', () => {
    const result = parseSkillContent(SKILL_WITH_FRONTMATTER);
    expect(result.sections[0].codeBlocks).toHaveLength(1);
    expect(result.sections[0].codeBlocks[0].language).toBe('ts');
    expect(result.sections[0].codeBlocks[0].code).toBe('const x = 1;');
  });

  it('counts total code examples', () => {
    const result = parseSkillContent(SKILL_WITH_FRONTMATTER);
    expect(result.codeExampleCount).toBe(1);
  });

  it('counts table rows', () => {
    const result = parseSkillContent(SKILL_WITH_FRONTMATTER);
    // Header + separator + data row = 3 lines matching |...|
    expect(result.tableCount).toBeGreaterThanOrEqual(2);
  });

  it('extracts key features from intro bullet points', () => {
    const result = parseSkillContent(SKILL_WITH_FRONTMATTER);
    // "Short" is < 10 chars so it should be filtered out
    expect(result.keyFeatures).toContain('Feature one is important');
    expect(result.keyFeatures).toContain('Feature two is also important');
    expect(result.keyFeatures).not.toContain('Short');
  });

  it('caps key features at 6', () => {
    const manyBullets = `# Skill\n\n${Array.from({ length: 10 }, (_, i) => `- Feature number ${i + 1} is here`).join('\n')}\n\n## Section\nContent.`;
    const result = parseSkillContent(manyBullets);
    expect(result.keyFeatures.length).toBeLessThanOrEqual(6);
  });

  it('handles empty content', () => {
    const result = parseSkillContent('');
    expect(result.name).toBe('Untitled Skill');
    expect(result.intro).toBe('');
    expect(result.sections).toEqual([]);
    expect(result.keyFeatures).toEqual([]);
  });

  it('handles content with no frontmatter', () => {
    const result = parseSkillContent('# My Skill\n\nHello.\n\n## First\n\nContent.');
    expect(result.name).toBe('My Skill');
    expect(result.sections).toHaveLength(1);
  });
});

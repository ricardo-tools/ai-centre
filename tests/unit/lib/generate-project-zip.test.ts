import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { generateProjectZip, type SkillBundle } from '@/platform/lib/generate-project-zip';
import { skillFactory } from '../../factories';

describe('generateProjectZip', () => {
  const bundles: SkillBundle[] = [
    {
      skill: skillFactory.build({ slug: 'brand-design-system', content: '# Brand Design System\n\nContent.' }),
      references: [{ filename: 'tokens.md', content: '# Tokens\n\nToken content.' }],
      assets: [{ filename: 'favicon.svg', buffer: Buffer.from('<svg></svg>') }],
    },
    {
      skill: skillFactory.build({ slug: 'frontend-architecture', content: '# Frontend Architecture\n\nContent.' }),
      references: [],
      assets: [],
    },
  ];

  it('produces a valid ZIP blob', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test Project',
      archetypeDescription: 'A test project',
      skillBundles: bundles,
      userDescription: 'Build something cool',
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('includes CLAUDE.md at the root', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      skillBundles: bundles,
      userDescription: 'My idea',
    });

    const zip = await JSZip.loadAsync(blob);
    const claudeMd = zip.file('CLAUDE.md');
    expect(claudeMd).not.toBeNull();

    const content = await claudeMd!.async('string');
    expect(content).toContain('# Test');
    expect(content).toContain('My idea');
  });

  it('includes skill files in .claude/skills/<slug>/SKILL.md structure', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      skillBundles: bundles,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    expect(zip.file('.claude/skills/brand-design-system/SKILL.md')).not.toBeNull();
    expect(zip.file('.claude/skills/frontend-architecture/SKILL.md')).not.toBeNull();
  });

  it('generates CLAUDE.md with .claude/skills/ references', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Presentation',
      archetypeDescription: 'Slides',
      skillBundles: bundles,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    const content = await zip.file('CLAUDE.md')!.async('string');
    expect(content).toContain('.claude/skills/brand-design-system/SKILL.md');
    expect(content).toContain('.claude/skills/frontend-architecture/SKILL.md');
  });

  it('includes references/ subdirectory when skill has references', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      skillBundles: bundles,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    const tokensFile = zip.file('.claude/skills/brand-design-system/references/tokens.md');
    expect(tokensFile).not.toBeNull();
    const content = await tokensFile!.async('string');
    expect(content).toContain('# Tokens');
  });

  it('includes assets/ for brand-design-system', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      skillBundles: bundles,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    const faviconFile = zip.file('.claude/skills/brand-design-system/assets/favicon.svg');
    expect(faviconFile).not.toBeNull();
  });

  it('includes presentation template when requested', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Presentation',
      archetypeDescription: 'Slides',
      skillBundles: bundles,
      userDescription: '',
      includeTemplate: true,
    });

    const zip = await JSZip.loadAsync(blob);
    const template = zip.file('presentation-template.html');
    expect(template).not.toBeNull();
    const html = await template!.async('string');
    expect(html).toContain('<!DOCTYPE html>');
  });

  it('omits presentation template by default', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      skillBundles: bundles,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    expect(zip.file('presentation-template.html')).toBeNull();
  });

  it('skips skills with empty content', async () => {
    const emptyBundle: SkillBundle = {
      skill: skillFactory.build({ slug: 'empty', content: '' }),
      references: [],
      assets: [],
    };
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      skillBundles: [emptyBundle],
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    expect(zip.file('.claude/skills/empty/SKILL.md')).toBeNull();
  });

  it('shows placeholder when no user description provided', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      skillBundles: bundles,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    const content = await zip.file('CLAUDE.md')!.async('string');
    expect(content).toContain('No description provided');
  });
});

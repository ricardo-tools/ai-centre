import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { generateProjectZip } from '@/platform/lib/generate-project-zip';
import { skillFactory } from '../../factories';

describe('generateProjectZip', () => {
  const skills = [
    skillFactory.build({ slug: 'brand-design-system', content: '# Brand Design System\n\nContent.' }),
    skillFactory.build({ slug: 'frontend-architecture', content: '# Frontend Architecture\n\nContent.' }),
  ];

  it('produces a valid ZIP blob', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test Project',
      archetypeDescription: 'A test project',
      selectedSkills: skills,
      userDescription: 'Build something cool',
    });

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);
  });

  it('includes CLAUDE.md at the root', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      selectedSkills: skills,
      userDescription: 'My idea',
    });

    const zip = await JSZip.loadAsync(blob);
    const claudeMd = zip.file('CLAUDE.md');
    expect(claudeMd).not.toBeNull();

    const content = await claudeMd!.async('string');
    expect(content).toContain('# Test Project');
    expect(content).toContain('My idea');
  });

  it('includes skill files in skills/ directory', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      selectedSkills: skills,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    expect(zip.file('skills/brand-design-system.md')).not.toBeNull();
    expect(zip.file('skills/frontend-architecture.md')).not.toBeNull();
  });

  it('generates CLAUDE.md with skill references', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Presentation',
      archetypeDescription: 'Slides',
      selectedSkills: skills,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    const content = await zip.file('CLAUDE.md')!.async('string');
    expect(content).toContain('skills/brand-design-system.md');
    expect(content).toContain('skills/frontend-architecture.md');
  });

  it('includes presentation template when requested', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Presentation',
      archetypeDescription: 'Slides',
      selectedSkills: skills,
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
      selectedSkills: skills,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    expect(zip.file('presentation-template.html')).toBeNull();
  });

  it('skips skills with empty content', async () => {
    const emptySkill = skillFactory.build({ slug: 'empty', content: '' });
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      selectedSkills: [emptySkill],
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    expect(zip.file('skills/empty.md')).toBeNull();
  });

  it('shows placeholder when no user description provided', async () => {
    const blob = await generateProjectZip({
      archetypeName: 'Test',
      archetypeDescription: 'Desc',
      selectedSkills: skills,
      userDescription: '',
    });

    const zip = await JSZip.loadAsync(blob);
    const content = await zip.file('CLAUDE.md')!.async('string');
    expect(content).toContain('No description provided');
  });
});

import { describe, it, expect } from 'vitest';
import { toSkill, toSkills, type RawSkillData } from '@/platform/acl/skill.mapper';
import { Skill } from '@/platform/domain/Skill';

describe('skill.mapper', () => {
  const raw: RawSkillData = {
    slug: 'brand-design-system',
    title: 'Brand Design System',
    description: 'Semantic color tokens and theming.',
    isOfficial: true,
    version: '1.4.0',
    content: '# Brand Design System\n\nContent.',
    tags: { type: 'principle', domain: ['design'], layer: 'design' },
  };

  describe('toSkill', () => {
    it('maps raw data to a Skill domain object', () => {
      const skill = toSkill(raw);

      expect(skill).toBeInstanceOf(Skill);
      expect(skill.slug).toBe('brand-design-system');
      expect(skill.title).toBe('Brand Design System');
      expect(skill.description).toBe('Semantic color tokens and theming.');
      expect(skill.isOfficial).toBe(true);
      expect(skill.version).toBe('1.4.0');
      expect(skill.content).toContain('Brand Design System');
    });
  });

  describe('toSkills', () => {
    it('maps an array of raw data to Skill instances', () => {
      const skills = toSkills([raw, { ...raw, slug: 'other', title: 'Other' }]);

      expect(skills).toHaveLength(2);
      expect(skills[0]).toBeInstanceOf(Skill);
      expect(skills[1].slug).toBe('other');
    });

    it('returns empty array for empty input', () => {
      expect(toSkills([])).toEqual([]);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { getAllSkills, getSkillBySlug, getBehaviouralSkills, getCompanionsFor } from '@/platform/lib/skills';

describe('skills registry', () => {
  it('returns all registered skills', () => {
    const skills = getAllSkills();
    expect(skills.length).toBe(60);
  });

  it('includes both behavioural and reference skills', () => {
    const all = getAllSkills();
    const references = all.filter((s) => s.tags.type === 'reference');
    const behavioural = all.filter((s) => s.tags.type !== 'reference');
    expect(references.length).toBe(4);
    expect(behavioural.length).toBe(56);
  });

  it('finds a skill by slug', () => {
    const skill = getSkillBySlug('frontend-architecture');
    expect(skill).not.toBeNull();
    expect(skill!.title).toBe('Frontend Architecture');
    expect(skill!.content.length).toBeGreaterThan(0);
  });

  it('returns null for unknown slug', () => {
    expect(getSkillBySlug('nonexistent')).toBeNull();
  });

  it('returns only behavioural skills', () => {
    const skills = getBehaviouralSkills();
    expect(skills.length).toBe(56);
    expect(skills.every((s) => s.tags.type !== 'reference')).toBe(true);
  });

  it('returns companions for a parent skill', () => {
    const companions = getCompanionsFor('brand-design-system');
    expect(companions.length).toBe(1);
    expect(companions[0].slug).toBe('brand-tokens-reference');
  });

  it('returns empty array when no companions exist', () => {
    const companions = getCompanionsFor('accessibility');
    expect(companions).toEqual([]);
  });

  it('loads content from skill files on disk', () => {
    const skill = getSkillBySlug('accessibility');
    expect(skill).not.toBeNull();
    expect(skill!.content).toContain('# Accessibility');
  });
});

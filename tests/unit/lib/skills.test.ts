import { describe, it, expect } from 'vitest';
import { getAllSkills, getSkillBySlug, getBehaviouralSkills, getCompanionsFor, getReferencesFor } from '@/platform/lib/skills';

describe('skills registry', () => {
  it('returns all registered skills', () => {
    const skills = getAllSkills();
    expect(skills.length).toBe(61);
  });

  it('includes both behavioural and reference skills', () => {
    const all = getAllSkills();
    const references = all.filter((s) => s.tags.type === 'reference');
    const behavioural = all.filter((s) => s.tags.type !== 'reference');
    expect(references.length).toBe(1);
    expect(behavioural.length).toBe(60);
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
    expect(skills.length).toBe(60);
    expect(skills.every((s) => s.tags.type !== 'reference')).toBe(true);
  });

  it('returns companions for a parent skill', () => {
    const companions = getCompanionsFor('testing-strategy');
    expect(companions.length).toBeGreaterThanOrEqual(1);
    expect(companions.some((c) => c.slug === 'playwright-e2e')).toBe(true);
  });

  it('returns empty array when no companions exist', () => {
    const companions = getCompanionsFor('accessibility');
    expect(companions).toEqual([]);
  });

  it('loads content from skill files on disk (directory format)', () => {
    const skill = getSkillBySlug('accessibility');
    expect(skill).not.toBeNull();
    expect(skill!.content).toContain('# Accessibility');
  });

  it('returns references for skills with references/ directory', () => {
    const refs = getReferencesFor('brand-design-system');
    expect(refs.length).toBeGreaterThan(0);
    expect(refs[0].filename).toBe('tokens.md');
  });

  it('returns empty array for skills without references', () => {
    const refs = getReferencesFor('accessibility');
    expect(refs).toEqual([]);
  });
});

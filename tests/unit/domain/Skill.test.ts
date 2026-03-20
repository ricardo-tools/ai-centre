import { describe, it, expect } from 'vitest';
import { Skill } from '@/platform/domain/Skill';

describe('Skill', () => {
  const skill = new Skill(
    'frontend-architecture',
    'Frontend Architecture',
    '7-layer UI architecture',
    true,
    '2.1.0',
    '# Frontend Architecture\n\nContent here.',
    { type: 'principle', domain: ['product-development', 'engineering'], layer: 'frontend' },
  );

  it('returns the correct download filename', () => {
    expect(skill.downloadFilename).toBe('frontend-architecture-SKILL.md');
  });

  it('formats version with v prefix', () => {
    expect(skill.formatVersion('en-AU')).toBe('v2.1.0');
  });

  it('reports hasContent when content is non-empty', () => {
    expect(skill.hasContent).toBe(true);
  });

  it('reports no content when empty', () => {
    const empty = new Skill('test', 'Test', 'desc', false, '1.0.0', '', { type: 'principle', domain: ['global'], layer: 'fullstack' });
    expect(empty.hasContent).toBe(false);
  });

  // Removed: "exposes all readonly properties" — TypeScript enforces readonly at compile time.
  // Testing getters that simply return constructor args provides no confidence.
});

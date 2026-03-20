import { describe, it, expect } from 'vitest';
import { Archetype } from '@/platform/domain/Archetype';

describe('Archetype', () => {
  const archetype = new Archetype(
    'presentation',
    'Presentation',
    'Generate standalone HTML/JS presentations.',
    ['brand-design-system', 'design-foundations', 'presentation'],
    '📊',
  );

  it('returns the correct skill count', () => {
    expect(archetype.skillCount).toBe(3);
  });

  it('detects included skills', () => {
    expect(archetype.hasSkill('brand-design-system')).toBe(true);
    expect(archetype.hasSkill('presentation')).toBe(true);
  });

  it('detects missing skills', () => {
    expect(archetype.hasSkill('nonexistent')).toBe(false);
  });

  it('exposes all readonly properties', () => {
    expect(archetype.slug).toBe('presentation');
    expect(archetype.title).toBe('Presentation');
    expect(archetype.icon).toBe('📊');
  });
});

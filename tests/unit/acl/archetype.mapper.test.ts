import { describe, it, expect } from 'vitest';
import { toArchetype, toArchetypes, type RawArchetypeData } from '@/platform/acl/archetype.mapper';
import { Archetype } from '@/platform/domain/Archetype';

describe('archetype.mapper', () => {
  const raw: RawArchetypeData = {
    slug: 'presentation',
    title: 'Presentation',
    description: 'Generate standalone HTML/JS presentations.',
    skills: ['brand-design-system', 'design-foundations', 'presentation'],
    icon: '📊',
  };

  describe('toArchetype', () => {
    it('maps raw data to an Archetype domain object', () => {
      const archetype = toArchetype(raw);

      expect(archetype).toBeInstanceOf(Archetype);
      expect(archetype.slug).toBe('presentation');
      expect(archetype.title).toBe('Presentation');
      expect(archetype.skills).toEqual(['brand-design-system', 'design-foundations', 'presentation']);
      expect(archetype.icon).toBe('📊');
    });
  });

  describe('toArchetypes', () => {
    it('maps an array of raw data', () => {
      const archetypes = toArchetypes([raw, { ...raw, slug: 'dashboard', title: 'Dashboard' }]);
      expect(archetypes).toHaveLength(2);
      expect(archetypes[0]).toBeInstanceOf(Archetype);
      expect(archetypes[1].slug).toBe('dashboard');
    });

    it('returns empty array for empty input', () => {
      expect(toArchetypes([])).toEqual([]);
    });
  });
});

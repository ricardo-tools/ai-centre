'use client';

import { useState, useEffect } from 'react';
import { Archetype } from '@/platform/domain/Archetype';
import { fetchAllArchetypes } from '@/features/archetypes/action';
import { toArchetypes } from '@/platform/acl/archetype.mapper';

interface UseArchetypeCardOptions {
  slug: string;
  mock?: boolean;
}

interface UseArchetypeCardResult {
  archetype: Archetype | null;
  loading: boolean;
}

function createMockArchetype(slug: string): Archetype {
  return new Archetype(
    slug,
    'Mock Archetype',
    'A mock archetype for development and testing purposes.',
    ['frontend-architecture', 'brand-design-system', 'design-foundations'],
    '\uD83D\uDCCB',
  );
}

export function useArchetypeCard({ slug, mock }: UseArchetypeCardOptions): UseArchetypeCardResult {
  const [archetype, setArchetype] = useState<Archetype | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mock) {
      setArchetype(createMockArchetype(slug));
      setLoading(false);
      return;
    }

    fetchAllArchetypes().then((result) => {
      if (result.ok) {
        const archetypes = toArchetypes(result.value);
        const found = archetypes.find((a) => a.slug === slug) ?? null;
        setArchetype(found);
      }
      setLoading(false);
    });
  }, [slug, mock]);

  return { archetype, loading };
}

'use client';

import { useState, useEffect } from 'react';
import { Skill } from '@/platform/domain/Skill';
import { Archetype } from '@/platform/domain/Archetype';
import { fetchAllSkills } from '@/features/skill-library/action';
import { fetchAllArchetypes } from '@/features/archetypes/action';
import { toSkills } from '@/platform/acl/skill.mapper';
import { toArchetypes } from '@/platform/acl/archetype.mapper';

interface UseProjectGeneratorOptions {
  mock?: boolean;
}

interface UseProjectGeneratorResult {
  skills: Skill[];
  archetypes: Archetype[];
  loading: boolean;
}

function createMockSkills(): Skill[] {
  return [
    new Skill('brand-design-system', 'Brand Design System', 'Semantic color tokens, themes, typography, and asset libraries.', true, '1.0.0', '# Brand Design System', { type: 'principle', domain: ['design'], layer: 'design' }),
    new Skill('frontend-architecture', 'Frontend Architecture', '7-layer architecture with components, widgets, and domain objects.', true, '1.0.0', '# Frontend Architecture', { type: 'principle', domain: ['engineering'], layer: 'frontend' }),
    new Skill('design-foundations', 'Design Foundations', '8px spacing system, visual hierarchy, alignment, and negative space.', true, '1.0.0', '# Design Foundations', { type: 'principle', domain: ['design'], layer: 'design' }),
  ];
}

function createMockArchetypes(): Archetype[] {
  return [
    new Archetype('presentation', 'Presentation', 'Generate standalone HTML/JS presentations with themed slides.', ['brand-design-system', 'design-foundations', 'presentation'], '📊'),
  ];
}

export function useProjectGenerator({ mock }: UseProjectGeneratorOptions = {}): UseProjectGeneratorResult {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mock) {
      setSkills(createMockSkills());
      setArchetypes(createMockArchetypes());
      setLoading(false);
      return;
    }

    Promise.all([fetchAllSkills(), fetchAllArchetypes()]).then(([skillsResult, archetypesResult]) => {
      if (skillsResult.ok) setSkills(toSkills(skillsResult.value));
      if (archetypesResult.ok) setArchetypes(toArchetypes(archetypesResult.value));
      setLoading(false);
    });
  }, [mock]);

  return { skills, archetypes, loading };
}

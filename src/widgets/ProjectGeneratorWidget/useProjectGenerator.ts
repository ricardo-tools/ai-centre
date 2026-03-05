'use client';

import { useState, useEffect } from 'react';
import { Skill } from '@/domain/Skill';
import { Archetype } from '@/domain/Archetype';
import { fetchAllSkills } from '@/server/actions/skills';
import { fetchAllArchetypes } from '@/server/actions/archetypes';
import { toSkills } from '@/acl/skill.mapper';
import { toArchetypes } from '@/acl/archetype.mapper';

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
    new Skill('brand-design-system', 'Brand Design System', 'Semantic color tokens, themes, typography, and asset libraries.', true, '1.0.0', '# Brand Design System'),
    new Skill('frontend-architecture', 'Frontend Architecture', '7-layer architecture with components, widgets, and domain objects.', true, '1.0.0', '# Frontend Architecture'),
    new Skill('design-excellence', 'Design Excellence', '8px spacing system, visual hierarchy, alignment, and negative space.', true, '1.0.0', '# Design Excellence'),
  ];
}

function createMockArchetypes(): Archetype[] {
  return [
    new Archetype('presentation', 'Presentation', 'Generate standalone HTML/JS presentations with themed slides.', ['brand-design-system', 'design-excellence', 'presentation'], '📊'),
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

    Promise.all([fetchAllSkills(), fetchAllArchetypes()]).then(([rawSkills, rawArchetypes]) => {
      setSkills(toSkills(rawSkills));
      setArchetypes(toArchetypes(rawArchetypes));
      setLoading(false);
    });
  }, [mock]);

  return { skills, archetypes, loading };
}

'use client';

import { useState, useEffect } from 'react';
import { Skill } from '@/platform/domain/Skill';
import { fetchAllSkills } from '@/features/skill-library/action';
import { toSkills } from '@/platform/acl/skill.mapper';

interface UseSkillListOptions {
  mock?: boolean;
}

interface UseSkillListResult {
  skills: Skill[];
  loading: boolean;
}

function createMockSkills(): Skill[] {
  return [
    new Skill('frontend-architecture', 'Frontend Architecture', 'Component-based architecture with 7 layers.', true, '2.1.0', '', { type: 'principle', domain: ['engineering'], layer: 'frontend' }),
    new Skill('brand-design-system', 'Brand Design System', 'Semantic color tokens, typography, and icon guidelines.', true, '1.4.0', '', { type: 'principle', domain: ['design'], layer: 'design' }),
    new Skill('design-foundations', 'Design Foundations', '8px spacing system, visual hierarchy, and alignment.', true, '1.0.0', '', { type: 'principle', domain: ['design'], layer: 'design' }),
  ];
}

export function useSkillList({ mock }: UseSkillListOptions = {}): UseSkillListResult {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mock) {
      setSkills(createMockSkills());
      setLoading(false);
      return;
    }

    fetchAllSkills().then((result) => {
      if (result.ok) setSkills(toSkills(result.value));
      setLoading(false);
    });
  }, [mock]);

  return { skills, loading };
}

'use client';

import { useState, useEffect } from 'react';
import { Skill } from '@/domain/Skill';
import { fetchAllSkills } from '@/server/actions/skills';
import { toSkills } from '@/acl/skill.mapper';

interface UseSkillListOptions {
  mock?: boolean;
}

interface UseSkillListResult {
  skills: Skill[];
  loading: boolean;
}

function createMockSkills(): Skill[] {
  return [
    new Skill('frontend-architecture', 'Frontend Architecture', 'Component-based architecture with 7 layers.', true, '2.1.0', ''),
    new Skill('brand-design-system', 'Brand Design System', 'Semantic color tokens, typography, and icon guidelines.', true, '1.4.0', ''),
    new Skill('design-excellence', 'Design Excellence', '8px spacing system, visual hierarchy, and alignment.', true, '1.0.0', ''),
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

    fetchAllSkills().then((rawList) => {
      setSkills(toSkills(rawList));
      setLoading(false);
    });
  }, [mock]);

  return { skills, loading };
}

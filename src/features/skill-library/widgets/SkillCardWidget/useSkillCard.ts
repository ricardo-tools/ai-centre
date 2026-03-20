'use client';

import { useState, useEffect } from 'react';
import { Skill } from '@/platform/domain/Skill';
import { fetchSkillBySlug } from '@/features/skill-library/action';
import { toSkill } from '@/platform/acl/skill.mapper';

interface UseSkillCardOptions {
  slug: string;
  mock?: boolean;
}

interface UseSkillCardResult {
  skill: Skill | null;
  loading: boolean;
}

function createMockSkill(slug: string): Skill {
  return new Skill(
    slug,
    'Mock Skill',
    'This is a mock skill description for development and testing purposes.',
    true,
    '1.0.0',
    '# Mock Skill\n\nMock content.',
    { type: 'principle', domain: ['global'], layer: 'fullstack' },
  );
}

export function useSkillCard({ slug, mock }: UseSkillCardOptions): UseSkillCardResult {
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (mock) {
      setSkill(createMockSkill(slug));
      setLoading(false);
      return;
    }

    fetchSkillBySlug(slug).then((result) => {
      if (result.ok) {
        setSkill(toSkill(result.value));
      }
      setLoading(false);
    });
  }, [slug, mock]);

  return { skill, loading };
}

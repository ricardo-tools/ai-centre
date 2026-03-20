'use client';

import Link from 'next/link';
import type { Skill } from '@/platform/domain/Skill';

interface SkillCardXSProps {
  skill: Skill;
}

export function SkillCardXS({ skill }: SkillCardXSProps) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      style={{
        display: 'inline-block',
        fontSize: 13,
        padding: '6px 12px',
        color: 'var(--color-text-heading)',
        textDecoration: 'none',
        fontWeight: 500,
      }}
    >
      {skill.title}
    </Link>
  );
}

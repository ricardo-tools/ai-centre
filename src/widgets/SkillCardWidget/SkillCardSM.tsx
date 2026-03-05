'use client';

import Link from 'next/link';
import type { Skill } from '@/domain/Skill';

interface SkillCardSMProps {
  skill: Skill;
  officialLabel?: string;
}

export function SkillCardSM({ skill, officialLabel = 'Official' }: SkillCardSMProps) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        textDecoration: 'none',
      }}
    >
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
        }}
      >
        {skill.title}
      </span>
      {skill.isOfficial && (
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: 4,
            background: 'var(--color-primary-muted)',
            color: 'var(--color-primary)',
          }}
        >
          {officialLabel}
        </span>
      )}
    </Link>
  );
}

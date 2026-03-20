'use client';

import Link from 'next/link';
import type { Skill } from '@/platform/domain/Skill';

interface SkillCardMDProps {
  skill: Skill;
  officialLabel?: string;
}

export function SkillCardMD({ skill, officialLabel = 'Official' }: SkillCardMDProps) {
  return (
    <Link
      href={`/skills/${skill.slug}`}
      style={{
        display: 'block',
        padding: 16,
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-surface)',
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span
          style={{
            fontSize: 15,
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
      </div>
      <p
        style={{
          fontSize: 13,
          color: 'var(--color-text-muted)',
          margin: 0,
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {skill.description}
      </p>
    </Link>
  );
}

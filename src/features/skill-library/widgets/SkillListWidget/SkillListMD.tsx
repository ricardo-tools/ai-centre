'use client';

import Link from 'next/link';
import type { Skill } from '@/platform/domain/Skill';

interface SkillListMDProps {
  skills: Skill[];
}

export function SkillListMD({ skills }: SkillListMDProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {skills.map((skill) => (
        <Link
          key={skill.slug}
          href={`/skills/${skill.slug}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid var(--color-border)',
            textDecoration: 'none',
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text-heading)',
              }}
            >
              {skill.title}
            </span>
            <p
              style={{
                fontSize: 13,
                color: 'var(--color-text-muted)',
                margin: '2px 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {skill.description}
            </p>
          </div>
          <span
            style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
              flexShrink: 0,
              marginLeft: 16,
            }}
          >
            v{skill.version}
          </span>
        </Link>
      ))}
    </div>
  );
}

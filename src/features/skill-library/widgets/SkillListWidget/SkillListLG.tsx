'use client';

import Link from 'next/link';
import type { Skill } from '@/platform/domain/Skill';

interface SkillListLGProps {
  skills: Skill[];
}

export function SkillListLG({ skills }: SkillListLGProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {skills.map((skill) => (
        <Link
          key={skill.slug}
          href={`/skills/${skill.slug}`}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            textDecoration: 'none',
            transition: 'border-color 150ms',
          }}
        >
          <div>
            <span
              style={{
                fontSize: 15,
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
                margin: '4px 0 0',
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

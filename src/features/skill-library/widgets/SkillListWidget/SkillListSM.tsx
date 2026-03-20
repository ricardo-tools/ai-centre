'use client';

import Link from 'next/link';
import type { Skill } from '@/platform/domain/Skill';

interface SkillListSMProps {
  skills: Skill[];
}

export function SkillListSM({ skills }: SkillListSMProps) {
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
            fontSize: 13,
            padding: '8px 0',
            borderBottom: '1px solid var(--color-border)',
            textDecoration: 'none',
            color: 'var(--color-text-heading)',
          }}
        >
          <span style={{ fontWeight: 500 }}>{skill.title}</span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
            v{skill.version}
          </span>
        </Link>
      ))}
    </div>
  );
}

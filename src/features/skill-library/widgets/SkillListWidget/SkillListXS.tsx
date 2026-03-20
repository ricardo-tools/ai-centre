'use client';

import type { Skill } from '@/platform/domain/Skill';

interface SkillListXSProps {
  skills: Skill[];
}

export function SkillListXS({ skills }: SkillListXSProps) {
  return (
    <span
      style={{
        fontSize: 12,
        color: 'var(--color-text-muted)',
      }}
    >
      {skills.map((skill) => skill.title).join(', ')}
    </span>
  );
}

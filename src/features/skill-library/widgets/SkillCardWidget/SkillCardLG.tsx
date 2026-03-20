'use client';

import { SkillCard } from '@/platform/components/SkillCard';
import type { Skill } from '@/platform/domain/Skill';

interface SkillCardLGProps {
  skill: Skill;
  officialLabel?: string;
  viewLabel?: string;
}

export function SkillCardLG({ skill, officialLabel, viewLabel }: SkillCardLGProps) {
  return (
    <SkillCard
      slug={skill.slug}
      title={skill.title}
      description={skill.description}
      isOfficial={skill.isOfficial}
      version={skill.version}
      officialLabel={officialLabel}
      viewLabel={viewLabel}
    />
  );
}

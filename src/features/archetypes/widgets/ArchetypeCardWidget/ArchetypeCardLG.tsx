'use client';

import { ArchetypeCard } from '@/platform/components/ArchetypeCard';
import type { Archetype } from '@/platform/domain/Archetype';

interface ArchetypeCardLGProps {
  archetype: Archetype;
  suggestedSkillsLabel?: string;
  ctaLabel?: string;
}

export function ArchetypeCardLG({ archetype, suggestedSkillsLabel, ctaLabel }: ArchetypeCardLGProps) {
  return (
    <ArchetypeCard
      slug={archetype.slug}
      title={archetype.title}
      description={archetype.description}
      icon={archetype.icon}
      skills={archetype.skills}
      suggestedSkillsLabel={suggestedSkillsLabel}
      ctaLabel={ctaLabel}
    />
  );
}

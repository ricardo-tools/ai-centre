'use client';

import { ArchetypeCard } from '@/components/ArchetypeCard';
import type { Archetype } from '@/domain/Archetype';

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

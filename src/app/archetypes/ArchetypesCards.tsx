'use client';

import { useState, useEffect } from 'react';
import { fetchAllArchetypes } from '@/features/archetypes/action';
import { toArchetypes } from '@/platform/acl/archetype.mapper';
import type { Archetype } from '@/platform/domain/Archetype';
import { ArchetypeCard } from '@/platform/components/ArchetypeCard';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';

export function ArchetypesCards() {
  const { t } = useLocale();
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllArchetypes().then((result) => {
      if (result.ok) setArchetypes(toArchetypes(result.value));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))', gap: 24 }}>
        {archetypes.map((a) => (
          <ArchetypeCard
            key={a.slug}
            slug={a.slug}
            title={a.title}
            description={a.description}
            icon={a.icon}
            skills={a.skills}
            suggestedSkillsLabel={t('archetypes.suggestedSkills')}
            ctaLabel={t('archetypes.useThis')}
          />
        ))}
      </div>
    </div>
  );
}

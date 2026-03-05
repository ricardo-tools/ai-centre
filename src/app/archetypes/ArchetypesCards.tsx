'use client';

import { useState, useEffect } from 'react';
import { fetchAllArchetypes } from '@/server/actions/archetypes';
import { toArchetypes } from '@/acl/archetype.mapper';
import type { Archetype } from '@/domain/Archetype';
import { ArchetypeCard } from '@/components/ArchetypeCard';
import { useLocale } from '@/screen-renderer/LocaleContext';

export function ArchetypesCards() {
  const { t } = useLocale();
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllArchetypes().then((raw) => {
      setArchetypes(toArchetypes(raw));
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
    <div style={{ maxWidth: 960 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
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

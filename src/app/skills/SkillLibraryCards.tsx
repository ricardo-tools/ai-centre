'use client';

import { useState, useEffect } from 'react';
import { fetchAllSkills } from '@/server/actions/skills';
import { toSkills } from '@/acl/skill.mapper';
import type { Skill } from '@/domain/Skill';
import { SkillCard } from '@/components/SkillCard';
import { useLocale } from '@/screen-renderer/LocaleContext';

export function SkillLibraryCards() {
  const { t } = useLocale();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllSkills().then((raw) => {
      setSkills(toSkills(raw));
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}
    >
      {skills.map((skill) => (
        <SkillCard
          key={skill.slug}
          slug={skill.slug}
          title={skill.title}
          description={skill.description}
          isOfficial={skill.isOfficial}
          version={skill.version}
          officialLabel={t('skills.official')}
          viewLabel={t('skills.view')}
        />
      ))}
    </div>
  );
}

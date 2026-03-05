'use client';

import { DownloadSimple } from '@phosphor-icons/react';
import { useLocale } from '@/screen-renderer/LocaleContext';
import type { Skill } from '@/domain/Skill';
import type { ParsedSkillContent } from '@/domain/ParsedSkill';

interface SkillDetailXSProps {
  skill: Skill;
  parsed: ParsedSkillContent;
}

export function SkillDetailXS({ skill }: SkillDetailXSProps) {
  const { t } = useLocale();

  const downloadUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(skill.content)}`;

  return (
    <div style={{ padding: 16 }}>
      <h1
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          marginBottom: 12,
          margin: '0 0 12px',
        }}
      >
        {skill.title}
      </h1>
      <a
        href={downloadUrl}
        download={skill.downloadFilename}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 6,
          background: 'var(--color-primary)',
          color: '#fff',
          textDecoration: 'none',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <DownloadSimple size={14} weight="bold" /> {t('skillDetail.download')}
      </a>
    </div>
  );
}

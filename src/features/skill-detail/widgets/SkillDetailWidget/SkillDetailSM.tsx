'use client';

import { useState } from 'react';
import { DownloadSimple, Lightning, FileText } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { SkillShowcase } from '@/platform/components/SkillShowcase';
import { SkillInPractice } from './SkillInPractice';
import type { Skill } from '@/platform/domain/Skill';
import type { ParsedSkillContent } from '@/platform/domain/ParsedSkill';

interface SkillDetailSMProps {
  skill: Skill;
  parsed: ParsedSkillContent;
}

export function SkillDetailSM({ skill, parsed }: SkillDetailSMProps) {
  const { t } = useLocale();
  const [view, setView] = useState<'practice' | 'markdown'>('practice');

  const downloadUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(skill.content)}`;

  return (
    <div style={{ padding: 16 }}>
      {/* Hero */}
      <h1
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          margin: '0 0 8px',
        }}
      >
        {skill.title}
      </h1>

      <p
        style={{
          fontSize: 13,
          color: 'var(--color-text-body)',
          lineHeight: 1.5,
          marginBottom: 16,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {skill.description}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
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

        {/* Toggle buttons */}
        <div
          style={{
            display: 'flex',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setView('practice')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              fontSize: 12,
              fontWeight: view === 'practice' ? 600 : 400,
              fontFamily: 'inherit',
              border: 'none',
              cursor: 'pointer',
              background: view === 'practice' ? 'var(--color-surface-active)' : 'var(--color-surface)',
              color: view === 'practice' ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
              transition: 'background 150ms, color 150ms',
            }}
          >
            <Lightning size={12} /> {t('skillDetail.skillInPractice')}
          </button>
          <button
            onClick={() => setView('markdown')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              fontSize: 12,
              fontWeight: view === 'markdown' ? 600 : 400,
              fontFamily: 'inherit',
              border: 'none',
              cursor: 'pointer',
              background: view === 'markdown' ? 'var(--color-surface-active)' : 'var(--color-surface)',
              color: view === 'markdown' ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
              transition: 'background 150ms, color 150ms',
            }}
          >
            <FileText size={12} /> {t('skillDetail.viewSkillMd')}
          </button>
        </div>
      </div>

      {/* Content — grid-stack to prevent layout shift on toggle */}
      <div style={{ display: 'grid' }}>
        <div style={{ gridArea: '1 / 1', visibility: view === 'practice' ? 'visible' : 'hidden' }}>
          <SkillInPractice slug={skill.slug} parsed={parsed} />
        </div>
        <div style={{ gridArea: '1 / 1', visibility: view === 'markdown' ? 'visible' : 'hidden' }}>
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <SkillShowcase content={skill.content} />
          </div>
        </div>
      </div>
    </div>
  );
}

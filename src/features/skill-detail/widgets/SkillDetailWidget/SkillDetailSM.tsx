'use client';

import { useState, useCallback } from 'react';
import { DownloadSimple, Lightning, FileText } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { SkillContentTabs } from './SkillContentTabs';
import { SkillInPractice } from './SkillInPractice';
import { trackSkillDownload, downloadSkillWithCompanions } from '@/features/social/action';
import type { Skill } from '@/platform/domain/Skill';
import type { ParsedSkillContent } from '@/platform/domain/ParsedSkill';
import type { SkillReference } from '@/features/skill-library/action';

interface SkillDetailSMProps {
  skill: Skill;
  parsed: ParsedSkillContent;
  references: SkillReference[];
}

export function SkillDetailSM({ skill, parsed, references }: SkillDetailSMProps) {
  const { t } = useLocale();
  const [view, setView] = useState<'practice' | 'markdown'>('practice');
  const isWorkflow = skill.tags.layer === 'workflow';

  const handleDownload = useCallback(async () => {
    trackSkillDownload(skill.slug, 'detail_download');
    const result = await downloadSkillWithCompanions(skill.slug);
    if (!result.ok) return;

    const { zipBase64, fileName } = result.value;
    const bytes = Uint8Array.from(atob(zipBase64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [skill.slug]);

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
        {!isWorkflow && (
          <button
            onClick={handleDownload}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            <DownloadSimple size={14} weight="bold" /> {t('skillDetail.download')}
          </button>
        )}

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
            <SkillContentTabs skillContent={skill.content} references={references} />
          </div>
        </div>
      </div>
    </div>
  );
}

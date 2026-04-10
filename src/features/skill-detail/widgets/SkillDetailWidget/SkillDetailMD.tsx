'use client';

import { useState, useCallback } from 'react';
import { DownloadSimple, Lightning, FileText, Code, Table, ListBullets } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { Stat } from '@/platform/components/Stat';
import { ToggleButton } from '@/platform/components/ToggleButton';
import { SkillContentTabs } from './SkillContentTabs';
import { SkillInPractice } from './SkillInPractice';
import { trackSkillDownload, downloadSkillWithCompanions } from '@/features/social/action';
import type { Skill } from '@/platform/domain/Skill';
import type { ParsedSkillContent } from '@/platform/domain/ParsedSkill';
import type { SkillReference } from '@/features/skill-library/action';

interface SkillDetailMDProps {
  skill: Skill;
  parsed: ParsedSkillContent;
  references: SkillReference[];
}

export function SkillDetailMD({ skill, parsed, references }: SkillDetailMDProps) {
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
    <div style={{ maxWidth: 'max(720px, 70vw)', padding: 16 }}>
      {/* Hero */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              margin: 0,
            }}
          >
            {skill.title}
          </h1>
          {skill.isOfficial && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'var(--color-primary-muted)',
                color: 'var(--color-primary)',
              }}
            >
              {t('skills.official')}
            </span>
          )}
        </div>

        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-body)',
            lineHeight: 1.5,
            marginBottom: 16,
            maxWidth: 600,
          }}
        >
          {skill.description}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
          <Stat icon={<ListBullets size={16} />} label={t('skillDetail.sections')} value={parsed.sectionCount} />
          <Stat icon={<Code size={16} />} label={t('skillDetail.codeExamples')} value={parsed.codeExampleCount} />
          <Stat icon={<Table size={16} />} label={t('skillDetail.referenceTables')} value={parsed.referenceTableCount} />
          <Stat icon={<FileText size={16} />} label={t('skillDetail.version')} value={skill.formatVersion('')} />
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isWorkflow && (
            <button
              onClick={handleDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 6,
                background: 'var(--color-primary)',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              <DownloadSimple size={16} weight="bold" /> {t('skillDetail.download')}
            </button>
          )}

          {/* View toggle */}
          <div
            style={{
              display: 'flex',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
            }}
          >
            <ToggleButton
              active={view === 'practice'}
              onClick={() => setView('practice')}
              icon={<Lightning size={14} />}
              label={t('skillDetail.skillInPractice')}
            />
            <ToggleButton
              active={view === 'markdown'}
              onClick={() => setView('markdown')}
              icon={<FileText size={14} />}
              label={t('skillDetail.viewSkillMd')}
            />
          </div>
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
              padding: 24,
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

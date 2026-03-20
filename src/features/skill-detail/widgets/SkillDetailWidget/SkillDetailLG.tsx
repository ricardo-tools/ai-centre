'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DownloadSimple, FileText, Lightning, ArrowLeft, Code, Table, ListBullets } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { Stat } from '@/platform/components/Stat';
import { ToggleButton } from '@/platform/components/ToggleButton';
import { SkillShowcase } from '@/platform/components/SkillShowcase';
import { SkillInPractice } from './SkillInPractice';
import type { Skill } from '@/platform/domain/Skill';
import type { ParsedSkillContent } from '@/platform/domain/ParsedSkill';

interface SkillDetailLGProps {
  skill: Skill;
  parsed: ParsedSkillContent;
}

export function SkillDetailLG({ skill, parsed }: SkillDetailLGProps) {
  const { t } = useLocale();
  const [view, setView] = useState<'practice' | 'markdown'>('practice');

  const downloadUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(skill.content)}`;

  return (
    <div style={{ maxWidth: 1024 }}>
      {/* Back link */}
      <Link
        href="/skills"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 13,
          color: 'var(--color-text-muted)',
          textDecoration: 'none',
          marginBottom: 24,
        }}
      >
        <ArrowLeft size={14} /> {t('skillDetail.backToSkills')}
      </Link>

      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1
            style={{
              fontSize: 24,
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
                fontSize: 12,
                fontWeight: 600,
                padding: '3px 8px',
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
            fontSize: 16,
            color: 'var(--color-text-body)',
            lineHeight: 1.6,
            marginBottom: 24,
            maxWidth: 700,
          }}
        >
          {skill.description}
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          <Stat icon={<ListBullets size={16} />} label={t('skillDetail.sections')} value={parsed.sectionCount} />
          <Stat icon={<Code size={16} />} label={t('skillDetail.codeExamples')} value={parsed.codeExampleCount} />
          <Stat icon={<Table size={16} />} label={t('skillDetail.referenceTables')} value={parsed.referenceTableCount} />
          <Stat icon={<FileText size={16} />} label={t('skillDetail.version')} value={skill.formatVersion('')} />
        </div>

        {/* Actions row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a
            href={downloadUrl}
            download={skill.downloadFilename}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '10px 20px',
              borderRadius: 6,
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <DownloadSimple size={16} weight="bold" /> {t('skillDetail.download')}
          </a>

          {/* View toggle */}
          <div
            style={{
              display: 'flex',
              borderRadius: 6,
              border: '1px solid var(--color-border)',
              background: 'transparent',
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
              padding: 32,
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

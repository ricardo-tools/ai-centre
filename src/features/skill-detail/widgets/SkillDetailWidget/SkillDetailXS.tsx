'use client';

import { useCallback } from 'react';
import { DownloadSimple } from '@phosphor-icons/react';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { trackSkillDownload, downloadSkillWithCompanions } from '@/features/social/action';
import type { Skill } from '@/platform/domain/Skill';
import type { ParsedSkillContent } from '@/platform/domain/ParsedSkill';
import type { SkillReference } from '@/features/skill-library/action';

interface SkillDetailXSProps {
  skill: Skill;
  parsed: ParsedSkillContent;
  references: SkillReference[];
}

export function SkillDetailXS({ skill }: SkillDetailXSProps) {
  const { t } = useLocale();
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
    </div>
  );
}

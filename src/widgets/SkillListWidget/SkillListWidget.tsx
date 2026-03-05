'use client';

import type { RenderableWidget, SizeVariant } from '@/screen-renderer/types';
import { useLocale } from '@/screen-renderer/LocaleContext';
import { useSkillList } from './useSkillList';
import { SkillListXS } from './SkillListXS';
import { SkillListSM } from './SkillListSM';
import { SkillListMD } from './SkillListMD';
import { SkillListLG } from './SkillListLG';

type SkillListWidgetProps = RenderableWidget;

const SIZE_MAP: Record<SizeVariant, React.ComponentType<{ skills: import('@/domain/Skill').Skill[] }>> = {
  xs: SkillListXS,
  sm: SkillListSM,
  md: SkillListMD,
  lg: SkillListLG,
};

export const widgetName = 'SkillListWidget';

export function SkillListWidget({ size }: SkillListWidgetProps) {
  const { t } = useLocale();
  const { skills, loading } = useSkillList();

  if (loading) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        {t('common.loading')}
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        {t('common.noResults')}
      </div>
    );
  }

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;
  return <SizeComponent skills={skills} />;
}

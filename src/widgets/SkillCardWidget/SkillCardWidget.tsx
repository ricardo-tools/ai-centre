'use client';

import type { RenderableWidget, SizeVariant } from '@/screen-renderer/types';
import { useLocale } from '@/screen-renderer/LocaleContext';
import { useSkillCard } from './useSkillCard';
import { SkillCardXS } from './SkillCardXS';
import { SkillCardSM } from './SkillCardSM';
import { SkillCardMD } from './SkillCardMD';
import { SkillCardLG } from './SkillCardLG';

interface SkillCardWidgetProps extends RenderableWidget {
  slug: string;
}

const SIZE_MAP: Record<SizeVariant, React.ComponentType<{ skill: import('@/domain/Skill').Skill }>> = {
  xs: SkillCardXS,
  sm: SkillCardSM,
  md: SkillCardMD,
  lg: SkillCardLG,
};

export const widgetName = 'SkillCardWidget';

export function SkillCardWidget({ size, slug }: SkillCardWidgetProps) {
  const { t } = useLocale();
  const { skill, loading } = useSkillCard({ slug });

  if (loading) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        {t('common.loading')}
      </div>
    );
  }

  if (!skill) {
    return null;
  }

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;
  return <SizeComponent skill={skill} />;
}

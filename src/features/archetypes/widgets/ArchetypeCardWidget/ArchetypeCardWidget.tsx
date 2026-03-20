'use client';

import type { RenderableWidget, SizeVariant } from '@/platform/screen-renderer/types';
import { useLocale } from '@/platform/screen-renderer/LocaleContext';
import { useArchetypeCard } from './useArchetypeCard';
import { ArchetypeCardXS } from './ArchetypeCardXS';
import { ArchetypeCardSM } from './ArchetypeCardSM';
import { ArchetypeCardMD } from './ArchetypeCardMD';
import { ArchetypeCardLG } from './ArchetypeCardLG';

interface ArchetypeCardWidgetProps extends RenderableWidget {
  slug: string;
}

const SIZE_MAP: Record<SizeVariant, React.ComponentType<{ archetype: import('@/platform/domain/Archetype').Archetype }>> = {
  xs: ArchetypeCardXS,
  sm: ArchetypeCardSM,
  md: ArchetypeCardMD,
  lg: ArchetypeCardLG,
};

export const widgetName = 'ArchetypeCardWidget';

export function ArchetypeCardWidget({ size, slug }: ArchetypeCardWidgetProps) {
  const { t } = useLocale();
  const { archetype, loading } = useArchetypeCard({ slug });

  if (loading) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        {t('common.loading')}
      </div>
    );
  }

  if (!archetype) {
    return null;
  }

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;
  return <SizeComponent archetype={archetype} />;
}

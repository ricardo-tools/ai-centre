'use client';

import type { RenderableWidget, SizeVariant } from '@/screen-renderer/types';
import { useTopNav } from './useTopNav';
import { TopNavXS } from './TopNavXS';
import { TopNavSM } from './TopNavSM';
import { TopNavMD } from './TopNavMD';
import { TopNavLG } from './TopNavLG';
import type { NavItem } from './useTopNav';

type TopNavWidgetProps = RenderableWidget;

const SIZE_MAP: Record<SizeVariant, React.ComponentType<{ items: NavItem[]; activePath: string }>> = {
  xs: TopNavXS,
  sm: TopNavSM,
  md: TopNavMD,
  lg: TopNavLG,
};

export const widgetName = 'TopNavWidget';

export function TopNavWidget({ size }: TopNavWidgetProps) {
  const { items, activePath } = useTopNav();

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;
  return <SizeComponent items={items} activePath={activePath} />;
}

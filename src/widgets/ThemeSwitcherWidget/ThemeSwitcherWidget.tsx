'use client';

import type { RenderableWidget, SizeVariant } from '@/screen-renderer/types';
import { useThemeSwitcher } from './useThemeSwitcher';
import { ThemeSwitcherXS } from './ThemeSwitcherXS';
import { ThemeSwitcherSM } from './ThemeSwitcherSM';
import { ThemeSwitcherMD } from './ThemeSwitcherMD';
import { ThemeSwitcherLG } from './ThemeSwitcherLG';

type ThemeSwitcherWidgetProps = RenderableWidget;

const SIZE_MAP: Record<SizeVariant, React.ComponentType<{ theme: 'light' | 'night'; toggle: () => void }>> = {
  xs: ThemeSwitcherXS,
  sm: ThemeSwitcherSM,
  md: ThemeSwitcherMD,
  lg: ThemeSwitcherLG,
};

export const widgetName = 'ThemeSwitcherWidget';

export function ThemeSwitcherWidget({ size }: ThemeSwitcherWidgetProps) {
  const { theme, toggle } = useThemeSwitcher();

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;
  return <SizeComponent theme={theme} toggle={toggle} />;
}

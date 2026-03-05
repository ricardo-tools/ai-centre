'use client';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface ThemeSwitcherMDProps {
  theme: 'light' | 'night';
  toggle: () => void;
}

export function ThemeSwitcherMD(_props: ThemeSwitcherMDProps) {
  return <ThemeSwitcher showLabel={true} />;
}

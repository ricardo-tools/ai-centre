'use client';

import { ThemeSwitcher } from '@/platform/components/ThemeSwitcher';

interface ThemeSwitcherLGProps {
  theme: 'light' | 'night';
  toggle: () => void;
}

export function ThemeSwitcherLG(_props: ThemeSwitcherLGProps) {
  return <ThemeSwitcher showLabel={true} />;
}

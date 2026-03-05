'use client';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';

interface ThemeSwitcherLGProps {
  theme: 'light' | 'night';
  toggle: () => void;
}

export function ThemeSwitcherLG(_props: ThemeSwitcherLGProps) {
  return <ThemeSwitcher showLabel={true} />;
}

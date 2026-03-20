'use client';

import { Sun, MonitorPlay } from '@phosphor-icons/react';

interface ThemeSwitcherXSProps {
  theme: 'light' | 'night';
  toggle: () => void;
}

export function ThemeSwitcherXS({ theme, toggle }: ThemeSwitcherXSProps) {
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'night' : 'light'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 6,
        border: 'none',
        background: 'transparent',
        color: 'var(--color-text-body)',
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      {theme === 'light' ? <Sun size={16} /> : <MonitorPlay size={16} />}
    </button>
  );
}

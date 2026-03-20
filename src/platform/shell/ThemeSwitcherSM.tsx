'use client';

import { Sun, MonitorPlay } from '@phosphor-icons/react';

interface ThemeSwitcherSMProps {
  theme: 'light' | 'night';
  toggle: () => void;
}

export function ThemeSwitcherSM({ theme, toggle }: ThemeSwitcherSMProps) {
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'night' : 'light'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px 8px',
        borderRadius: 6,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text-body)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 150ms',
      }}
    >
      {theme === 'light' ? <Sun size={16} /> : <MonitorPlay size={16} />}
    </button>
  );
}

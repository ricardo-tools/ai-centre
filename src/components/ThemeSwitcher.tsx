'use client';

import { useState, useEffect } from 'react';
import { Sun, MonitorPlay } from '@phosphor-icons/react';

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<'light' | 'night'>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'night') setTheme('night');
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'night' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('ai-centre-theme', next);
  }

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'night' : 'light'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 6,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        color: 'var(--color-text-body)',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        fontFamily: 'inherit',
        transition: 'background 150ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-surface-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-surface)';
      }}
    >
      {theme === 'light' ? <Sun size={16} /> : <MonitorPlay size={16} />}
      {theme === 'light' ? 'Light' : 'Night'}
    </button>
  );
}

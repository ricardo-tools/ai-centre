'use client';

import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, CloudMoon } from '@phosphor-icons/react';
import { Theme } from '../src/domain/types';

const themes: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'night', label: 'Night', icon: CloudMoon },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>('light');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('prototype-theme') as Theme | null;
    if (stored && ['light', 'dark', 'night'].includes(stored)) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function switchTheme(t: Theme) {
    setTheme(t);
    setOpen(false);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('prototype-theme', t);
  }

  const current = themes.find((t) => t.value === theme)!;
  const Icon = current.icon;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-text-body)',
          cursor: 'pointer',
          transition: 'background 150ms var(--ease-in-out)',
        }}
      >
        <Icon size={18} weight="regular" />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 4,
            minWidth: 140,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 'var(--z-dropdown)' as unknown as number,
            overflow: 'hidden',
          }}
        >
          {themes.map((t) => {
            const TIcon = t.icon;
            const isActive = theme === t.value;
            return (
              <button
                key={t.value}
                onClick={() => switchTheme(t.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  width: '100%',
                  padding: 'var(--space-2) var(--space-3)',
                  border: 'none',
                  background: isActive ? 'var(--color-border-light)' : 'transparent',
                  color: isActive ? 'var(--color-text-heading)' : 'var(--color-text-body)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                <TIcon size={16} weight={isActive ? 'fill' : 'regular'} />
                {t.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'night';

interface UseThemeSwitcherOptions {
  mock?: boolean;
}

interface UseThemeSwitcherResult {
  theme: Theme;
  toggle: () => void;
}

export function useThemeSwitcher({ mock }: UseThemeSwitcherOptions = {}): UseThemeSwitcherResult {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    if (mock) return;
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'night') {
      setTheme('night');
    }
  }, [mock]);

  const toggle = useCallback(() => {
    if (mock) return;
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'night' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('ai-centre-theme', next);
      return next;
    });
  }, [mock]);

  return { theme, toggle };
}

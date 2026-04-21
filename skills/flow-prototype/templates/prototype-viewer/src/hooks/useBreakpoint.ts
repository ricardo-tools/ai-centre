'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg';

// xs: 0–639px, sm: 640–767px, md: 768–1023px, lg: 1024px+
function getCurrentBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'lg';
  const w = window.innerWidth;
  if (w >= 1024) return 'lg';
  if (w >= 768) return 'md';
  if (w >= 640) return 'sm';
  return 'xs';
}

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    // Set correct value after mount (avoids SSR mismatch)
    setBreakpoint(getCurrentBreakpoint());

    const queries: [MediaQueryList, Breakpoint][] = [
      [window.matchMedia('(min-width: 1024px)'), 'lg'],
      [window.matchMedia('(min-width: 768px) and (max-width: 1023px)'), 'md'],
      [window.matchMedia('(min-width: 640px) and (max-width: 767px)'), 'sm'],
      [window.matchMedia('(max-width: 639px)'), 'xs'],
    ];

    function handleChange() {
      setBreakpoint(getCurrentBreakpoint());
    }

    queries.forEach(([mql]) => mql.addEventListener('change', handleChange));
    return () => {
      queries.forEach(([mql]) => mql.removeEventListener('change', handleChange));
    };
  }, []);

  return breakpoint;
}

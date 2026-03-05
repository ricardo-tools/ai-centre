'use client';

import { useState, useEffect } from 'react';
import type { SizeVariant } from './types';

const BREAKPOINTS: { size: SizeVariant; minWidth: number }[] = [
  { size: 'lg', minWidth: 1024 },
  { size: 'md', minWidth: 768 },
  { size: 'sm', minWidth: 640 },
];

function getCurrentBreakpoint(): SizeVariant {
  if (typeof window === 'undefined') return 'lg';

  for (const bp of BREAKPOINTS) {
    if (window.matchMedia(`(min-width: ${bp.minWidth}px)`).matches) {
      return bp.size;
    }
  }
  return 'xs';
}

/**
 * Returns the current SizeVariant based on viewport width.
 * Only the Screen Renderer should use this — widgets receive size as a prop.
 */
export function useBreakpoint(): SizeVariant {
  const [breakpoint, setBreakpoint] = useState<SizeVariant>(getCurrentBreakpoint);

  useEffect(() => {
    const queries = BREAKPOINTS.map((bp) => ({
      mql: window.matchMedia(`(min-width: ${bp.minWidth}px)`),
      size: bp.size,
    }));

    function handleChange() {
      setBreakpoint(getCurrentBreakpoint());
    }

    for (const q of queries) {
      q.mql.addEventListener('change', handleChange);
    }

    return () => {
      for (const q of queries) {
        q.mql.removeEventListener('change', handleChange);
      }
    };
  }, []);

  return breakpoint;
}

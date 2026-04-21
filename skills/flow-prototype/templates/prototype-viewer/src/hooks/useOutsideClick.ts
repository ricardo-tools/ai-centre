'use client';

import { useEffect, useRef, type RefObject } from 'react';

/**
 * Fire `onOutside` when the user clicks outside all provided refs.
 *
 * Uses a `skipNextRef` flag: the opening click sets it via requestAnimationFrame,
 * ensuring the very first mousedown after mount is ignored. Subsequent clicks
 * outside fire `onOutside`.
 */
export default function useOutsideClick(
  enabled: boolean,
  refs: Array<RefObject<HTMLElement | null>>,
  onOutside: () => void
): void {
  const skipNext = useRef(true);
  const callbackRef = useRef(onOutside);
  callbackRef.current = onOutside;

  useEffect(() => {
    if (!enabled) {
      skipNext.current = true;
      return;
    }

    /* Skip the first event (the opening click) by arming after one frame */
    skipNext.current = true;
    const raf = requestAnimationFrame(() => {
      skipNext.current = false;
    });

    function handler(e: MouseEvent) {
      if (skipNext.current) return;
      const target = e.target as Node | null;
      if (!target) return;
      for (const r of refs) {
        if (r.current?.contains(target)) return;
      }
      callbackRef.current();
    }

    document.addEventListener('mousedown', handler);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousedown', handler);
    };
    // We deliberately only react to `enabled` — refs are stable RefObjects
    // and callbackRef avoids needing onOutside in deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

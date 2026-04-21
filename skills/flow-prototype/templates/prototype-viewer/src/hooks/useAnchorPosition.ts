'use client';

import { useLayoutEffect, useState, type RefObject } from 'react';

export interface AnchorPosition {
  top: number;
  left: number;
  width: number;
}

type Align = 'left' | 'right';
type Side = 'top' | 'bottom';

interface Options {
  align?: Align;
  side?: Side;
  gap?: number;
}

/**
 * Computes a fixed-position coordinate for a popover anchored to a trigger
 * element. Uses useLayoutEffect so pos is set synchronously before paint —
 * avoids flicker on open. Re-measures on scroll/resize while open.
 */
export default function useAnchorPosition(
  triggerRef: RefObject<HTMLElement | null>,
  open: boolean,
  options: Options = {}
): AnchorPosition | null {
  const { align = 'left', side = 'bottom', gap = 4 } = options;
  const [pos, setPos] = useState<AnchorPosition | null>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) {
      setPos(null);
      return;
    }

    const measure = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const top = side === 'bottom' ? rect.bottom + gap : rect.top - gap;
      const left = align === 'left' ? rect.left : rect.right;
      setPos({ top, left, width: rect.width });
    };

    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [open, triggerRef, align, side, gap]);

  return pos;
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Global navigation progress bar.
 * Shows a thin animated bar at the top of the viewport during route transitions.
 * Automatically detects navigation via pathname changes.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    // Navigation completed — finish the bar
    setProgress(100);
    if (intervalRef.current) clearInterval(intervalRef.current);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, [pathname]);

  // Start progress on click of any internal link
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
      if (href === pathname) return;

      // Start the progress bar
      setVisible(true);
      setProgress(15);

      // Simulate incremental progress
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          // Slow down as it progresses — feels natural
          const increment = prev < 50 ? 8 : prev < 70 ? 4 : 2;
          return Math.min(prev + increment, 90);
        });
      }, 200);
    }

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 1000, /* --z-toast (above all UI except fullscreen) */
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'var(--color-primary)',
          transition: progress === 100
            ? 'width 200ms ease-out, opacity 300ms ease-out 200ms'
            : 'width 300ms ease-out',
          opacity: progress === 100 ? 0 : 1,
          boxShadow: '0 0 8px var(--color-primary)',
        }}
      />
    </div>
  );
}

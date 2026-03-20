'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Single standalone HTML file — zero external deps beyond Google Fonts and PptxGenJS CDN',
  'Every slide gets its own CSS namespace (.s0-wrap, .s3-bars) — no shared layout classes',
  'Light theme is always default — data-theme="light" on <html>',
  'Glassmorphism footer bar: backdrop-filter blur(20px), progress bar, nav controls',
  'Three background layers: base gradient, grid pattern (60px), glow orbs (blur 120px)',
  'Kicker-Title-Subtitle chain with clamp() for fluid typography',
  'Full keyboard, mouse click zones (15%/85%), and touch swipe navigation',
  'URL hash #slide-N persists position across reloads',
];

export function PresentationHtmlImplementationShowcaseXS(_props: RenderableWidget) {
  return (
    <div
      style={{
        padding: 24,
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-surface)',
      }}
    >
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          marginBottom: 16,
        }}
      >
        Presentation HTML Implementation — Key Takeaways
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {takeaways.map((text) => (
          <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                flexShrink: 0,
                marginTop: 6,
              }}
            />
            <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5 }}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

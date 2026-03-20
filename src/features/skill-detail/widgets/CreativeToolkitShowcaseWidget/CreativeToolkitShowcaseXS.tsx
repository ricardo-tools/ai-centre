'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'unDraw first for illustrations — brand-color to #FF5A28 or #1462D2',
  'Unsplash for photos, Pexels for video — always self-host in production',
  'Motion for React UI animation, GSAP for scroll/complex sequences',
  'Rive for interactive state-machine animations only — keep .riv < 50 KB',
  'Respect prefers-reduced-motion — simplify or disable animations',
  'Nivo for charts with getNivoTheme() — max 6 series, accent orange first',
  'Nivo uses hardcoded hex, not CSS vars — update chart-theme.ts when tokens change',
];

export function CreativeToolkitShowcaseXS(_props: RenderableWidget) {
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
        Creative Toolkit — Key Takeaways
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

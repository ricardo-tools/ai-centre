'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Asset Libraries',
    description: 'unDraw (scenes), Humaaans (characters), Unsplash (photos), Pexels (video), Mixkit (cinematic). Always brand-color illustrations and self-host for production.',
  },
  {
    title: 'Animation Stack',
    description: 'Motion (primary, React-first) for 90% of UI animation. GSAP for scroll-driven sequences and complex choreography. Rive for interactive state-machine animations.',
  },
  {
    title: 'Data Visualization',
    description: 'Nivo charts with brand theme object. Max 6 series per chart. Accent orange first. Clean over clever — remove non-essential gridlines and legends.',
  },
  {
    title: 'Nivo Limitation',
    description: 'Nivo uses JS objects with hex strings, not CSS vars. Brand theme must be manually synced with semantic tokens when colors change.',
  },
];

export function CreativeToolkitShowcaseSM(_props: RenderableWidget) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {highlights.map((h) => (
        <div
          key={h.title}
          style={{
            padding: 20,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            background: 'var(--color-surface)',
          }}
        >
          <h4
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              marginBottom: 4,
            }}
          >
            {h.title}
          </h4>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
            {h.description}
          </p>
        </div>
      ))}
    </div>
  );
}

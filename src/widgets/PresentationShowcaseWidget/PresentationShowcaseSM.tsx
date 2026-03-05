'use client';

import type { RenderableWidget } from '@/screen-renderer/types';

const highlights = [
  {
    title: '5-Phase Workflow',
    description: 'Strategy (audience + objectives), Content (messaging framework), Design (brand-aligned visuals), Build (standalone HTML), Polish (animation + transitions).',
  },
  {
    title: 'Messaging Frameworks',
    description: '6 proven structures: Problem\u2192Solution, Before/After, Data Story, Journey Map, Competitive Landscape, and Vision\u2192Roadmap. Each with clear slide-by-slide guidance.',
  },
  {
    title: 'Standalone HTML Output',
    description: 'Self-contained single-file presentations with keyboard navigation, fullscreen mode, progress indicators, and PPTX export capability. No dependencies required.',
  },
  {
    title: 'Design Toolkit',
    description: 'Glassmorphism cards, layered gradient backgrounds, stat cards with animated counters, and brand-aware color palettes. Headlines as assertions with 6-word max.',
  },
];

export function PresentationShowcaseSM(_props: RenderableWidget) {
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

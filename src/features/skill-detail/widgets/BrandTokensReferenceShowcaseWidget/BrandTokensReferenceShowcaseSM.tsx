'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Raw Palette Tokens',
    description: 'Light (8 tokens), Dark (12 tokens), Night (12 tokens) defined in :root. #FF5A28 orange is shared across all modes. Night uses true neutral greys; Dark uses blue-tinted surfaces.',
  },
  {
    title: 'Semantic Token Layers',
    description: '14 core tokens, 6 status tokens, 11 shell tokens, 7 data viz tokens. Each mapped per [data-theme] block. Components only reference --color-* semantic variables.',
  },
  {
    title: 'Complementary & Gradients',
    description: 'Five accent families (Violet, Teal, Rose, Sky, Fuchsia) with Light (600) and Night (400) variants. Six gradient tokens with per-theme CSS values for hero, brand, and data sections.',
  },
  {
    title: 'Contrast & Accessibility',
    description: 'Dark mode: text primary on surface-0 at ~14.5:1. Night mode: text primary on surface-0 at ~18.3:1. Text muted on surface-1 in Night is AA-large only (3.5:1, 18px+ text).',
  },
];

export function BrandTokensReferenceShowcaseSM(_props: RenderableWidget) {
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

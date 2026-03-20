'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Critical API Rules',
    description: 'No # in hex colors. Backgrounds use color not fill. Fresh objects per use (factory functions). Only valid PptxGenJS text properties — no CSS props.',
  },
  {
    title: 'Brand Fidelity',
    description: 'fontFace: Jost everywhere. All colors from palette object. footer() on every slide. Rectangle logo prominent on title + closing slides.',
  },
  {
    title: 'Text Overflow',
    description: 'The #1 PPTX defect. Title containers must accommodate 2-line wrapping. Adapt copy to containers, not containers to copy. Measure capacity before writing.',
  },
  {
    title: 'Spatial Balance',
    description: 'Content vertically centered on slide canvas. Bottom dead space < 1.5". Split layouts must have similar visual weight on both halves.',
  },
];

export function PptxExportShowcaseSM(_props: RenderableWidget) {
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

'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: '3-Zone System',
    description: 'Bleed zone extends 3mm past the trim edge for full-bleed printing. Trim marks show the cut line. Safe zone (5mm inside trim) contains all critical content.',
  },
  {
    title: 'Resolution & Color',
    description: '300+ DPI minimum for print output. CMYK color space for process printing. Spot colors (Pantone) for brand-critical elements. Always embed ICC profiles.',
  },
  {
    title: 'Typography Rules',
    description: 'Minimum 6pt for body text, 8pt for captions, 10pt for headlines at print scale. Embed all fonts in export. Avoid thin weights below 8pt — ink spread makes them illegible.',
  },
  {
    title: 'Pre-flight Checklist',
    description: '10 items before sending to print: bleed setup, safe zone margins, image resolution, color mode, font embedding, crop marks, file format, proof review, paper stock, and binding method.',
  },
];

export function PrintDesignShowcaseSM(_props: RenderableWidget) {
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

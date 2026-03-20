'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const brandColors = [
  { name: 'Orange', hex: '#FF5A28', color: '#FF5A28' },
  { name: 'Electric Blue', hex: '#1462D2', color: '#1462D2' },
  { name: 'Brand Blue', hex: '#1F2B7A', color: '#1F2B7A' },
  { name: 'Midnight Blue', hex: '#121948', color: '#121948' },
];

const highlights = [
  {
    title: 'Color Palette',
    description: 'Core brand colors with semantic token mapping for theme-agnostic styling.',
    content: (
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {brandColors.map((c) => (
          <div key={c.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
            <div
              style={{
                width: '100%',
                height: 32,
                borderRadius: 6,
                background: c.color,
                border: '1px solid var(--color-border)',
              }}
            />
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{c.hex}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: 'Typography',
    description: 'Jost font family used across all UI. Weights from 300 to 800.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text-body)' }}>Regular 400 — Body text</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>SemiBold 600 — Headings</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>Bold 700 — Emphasis</span>
      </div>
    ),
  },
  {
    title: 'Theme System',
    description: 'Light + Night modes controlled via data-theme attribute on <html>.',
    content: (
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <div
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            background: '#FFFFFF',
            border: '1px solid #E0E0E0',
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: '#121948',
          }}
        >
          Light
        </div>
        <div
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 6,
            background: '#121948',
            border: '1px solid #2A3080',
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: '#FFFFFF',
          }}
        >
          Night
        </div>
      </div>
    ),
  },
];

export function BrandDesignShowcaseSM(_props: RenderableWidget) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
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
          {h.content}
        </div>
      ))}
    </div>
  );
}

'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  '8px spacing system: 4/8/16/24/32/48px increments',
  'Gestalt principles: proximity, similarity, continuation, closure, figure/ground',
  'Visual weight hierarchy: size, color, position, isolation',
  '6 functions of negative space: grouping, emphasis, elegance, rhythm, reading comfort, scalability',
  'Optical alignment over mathematical — circles slightly larger than squares',
  'Layout QA: squint test, alignment check, responsive consistency',
];

export function DesignFoundationsShowcaseXS(_props: RenderableWidget) {
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
        Design Foundations — Key Takeaways
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

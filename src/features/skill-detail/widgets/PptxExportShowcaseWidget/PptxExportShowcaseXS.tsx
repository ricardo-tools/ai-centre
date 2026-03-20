'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'No # in hex colors — PptxGenJS uses stripped hex (FF5A28)',
  'Backgrounds: { color: \'...\' } not { fill: \'...\' }',
  'fontFace: Jost on every addText call, no exceptions',
  'Factory functions for shadows — PptxGenJS mutates objects',
  'Title containers: always h for 2-line wrapping',
  'Element bounds: x + w ≤ 10, y + h ≤ 5.625',
  'Content above y: 5.1" to clear footer area',
  '10-category validation checklist before delivery',
];

export function PptxExportShowcaseXS(_props: RenderableWidget) {
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
        PPTX Export — Key Takeaways
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

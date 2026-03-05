'use client';

import type { RenderableWidget } from '@/screen-renderer/types';

const takeaways = [
  '3-zone system: bleed (extends past trim), trim (cut line), safe (content area)',
  '300+ DPI for print \u2014 screen is only 72 DPI',
  'Export: PDF format, embedded fonts, CMYK color space',
  'Typography: minimum 6pt body, 8pt captions, 10pt headlines',
  'QR codes: minimum 10mm with quiet zone',
  'Pre-flight checklist: 10 items before sending to print',
];

export function PrintDesignShowcaseXS(_props: RenderableWidget) {
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
        Print Design — Key Takeaways
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

'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Four themes: Light (default), Night (always present), Dark and Legacy (on request only)',
  'Raw palette tokens per mode: --lm-*, --dm-*, --nm-* defined in :root',
  'Semantic tokens (--color-*) mapped per [data-theme] block — never use raw tokens in components',
  'Night mode: pure neutral greys (#0F0F0F base) modeled on YouTube/Google dark mode',
  'Dark mode: blue-tinted surfaces (#0C0F24 base) for polished brand feel',
  'Legacy mode: pixel-perfect ezyCollect recreation with #FF6600 orange, #272930 sidebar',
  'Five complementary colour families: Violet, Teal, Rose, Sky, Fuchsia — for tags and charts only',
  'Six gradient tokens: warm, cool, brand, neutral, vivid, ocean — with Light and Night variants',
];

export function BrandTokensReferenceShowcaseXS(_props: RenderableWidget) {
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
        Brand Tokens Reference — Key Takeaways
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

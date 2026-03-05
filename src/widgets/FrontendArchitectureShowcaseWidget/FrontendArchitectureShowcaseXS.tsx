'use client';

import type { RenderableWidget } from '@/screen-renderer/types';

const takeaways = [
  '7-layer architecture: Components → Widgets → Domain Objects → ACL → Screen Renderer',
  'Widgets are self-contained: own data hook, 4 size variants (XS/SM/MD/LG)',
  'CSS Grid system with Responsive<T> type for mobile-first layouts',
  'ACL mappers protect domain from API shape changes',
  'Screen configs declare typed grid layouts — no inline layout logic',
  'Inline styles with var(--color-*) semantic tokens — no Tailwind',
];

export function FrontendArchitectureShowcaseXS(_props: RenderableWidget) {
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
        Frontend Architecture — Key Takeaways
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

'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Pattern B (TopBar + Mega Menus): single-column grid, full-width content below navbar',
  'Pattern B mega menu: z-index 100, backdrop z-index 99, 150ms hover delay',
  'Pattern B mobile: hamburger opens accordion drawer, not mega menu panels',
  'Pattern C (Sidebar Only): three-zone sidebar — fixed logo, scrollable nav, fixed footer',
  'Pattern C icon sidebar (MD): 48px wide, tooltips on 400ms hover, no text labels',
  'Pattern C mobile: 48px floating header + 280px drawer overlay',
  'Pattern D (Minimal): no persistent nav, optional logo-only header, centered content',
  'Pattern D card: edge-to-edge on mobile (no border/radius), visible border on SM+',
];

export function AppLayoutPatternsReferenceShowcaseXS(_props: RenderableWidget) {
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
        App Layout Patterns Reference — Key Takeaways
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

'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Pattern B: TopBar + Mega Menus',
    description: 'Full-width navbar with dropdown mega menus. Single column grid. Mobile uses accordion drawer. Tablet uses "More" overflow dropdown. Desktop has hover-triggered mega panels.',
  },
  {
    title: 'Pattern C: Sidebar Only',
    description: 'No top bar. 220px sidebar at LG with three zones (logo, nav, footer). 48px icon-only at MD with tooltips. Mobile gets a floating 48px header + 280px drawer.',
  },
  {
    title: 'Pattern D: Minimal',
    description: 'No persistent navigation. Optional logo-only header (48px mobile, 56px desktop). Centered content container: 480px at MD, 520px at LG. Cards are edge-to-edge on mobile.',
  },
  {
    title: 'Cross-Pattern Consistency',
    description: 'Logo zone height is 56px across Patterns A, B, and C for visual consistency. Right controls use gap: 10 in A and B. Sidebar colours use --color-sidebar-* tokens in A and C.',
  },
];

export function AppLayoutPatternsReferenceShowcaseSM(_props: RenderableWidget) {
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

'use client';

import type { RenderableWidget } from '@/screen-renderer/types';

const highlights = [
  {
    title: 'Shell Patterns',
    description: 'Four layout patterns — TopBar+Sidebar, TopBar+MegaMenus (this app), Sidebar-only, and Minimal. Each adapts responsively.',
  },
  {
    title: 'TopNav Architecture',
    description: '3-zone layout: Logo zone (left), Navigation items (center), and Right controls (search, theme, user). Collapses to hamburger on mobile.',
  },
  {
    title: 'Mega Menu Panels',
    description: 'Deep navigation via dropdown panels with 2-column layouts. Supports grouped links, descriptions, and featured content areas.',
  },
  {
    title: 'Content Grid',
    description: 'Widget-based dashboard layouts using CSS Grid with Responsive<T> breakpoint system. Mobile-first column configurations.',
  },
];

export function AppLayoutShowcaseSM(_props: RenderableWidget) {
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

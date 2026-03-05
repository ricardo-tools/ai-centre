'use client';

import type { RenderableWidget } from '@/screen-renderer/types';

const takeaways = [
  '4 shell patterns: TopBar+Sidebar, TopBar+MegaMenus, Sidebar-only, Minimal',
  'This app uses Pattern B — TopBar Only with Mega Menus',
  'TopNav: 3-zone architecture (Logo, Nav Items, Right Controls)',
  'Responsive: mobile drawer for XS/SM, icon-only for MD, full for LG',
  'Mega menu panels for deep navigation (2-column layouts)',
  'Dashboard content grid for widget-based pages',
];

export function AppLayoutShowcaseXS(_props: RenderableWidget) {
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
        App Layout — Key Takeaways
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

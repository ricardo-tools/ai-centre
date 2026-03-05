'use client';

import type { RenderableWidget } from '@/screen-renderer/types';

const highlights = [
  {
    title: '7-Layer Stack',
    description: 'Screen Renderer → Screen Config → Slots → Widgets → Components → Domain Objects → ACL Mappers. Each layer has strict boundaries with data flowing down.',
  },
  {
    title: 'Widget System',
    description: 'Self-contained UI units with own data hook, 4 size variants (XS/SM/MD/LG), implementing the RenderableWidget interface. No layout logic inside widgets.',
  },
  {
    title: 'Responsive Grid',
    description: 'Mobile-first Responsive<T> type cascades from default → sm → md → lg. Screen configs declare grid layouts with typed column/row/gap specifications.',
  },
  {
    title: 'ACL Protection',
    description: 'Anti-corruption layer mappers transform raw API responses into domain objects. One mapper per entity — isolates your domain from external API changes.',
  },
];

export function FrontendArchitectureShowcaseSM(_props: RenderableWidget) {
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

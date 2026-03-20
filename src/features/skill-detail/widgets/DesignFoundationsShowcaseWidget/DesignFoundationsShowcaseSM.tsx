'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: '8px Spacing System',
    description: 'Every spacing value derives from the 8px base unit — 4 (tight), 8 (small), 16 (medium), 24 (large), 32 (xlarge), 48 (xxlarge). Creates consistent rhythm across all layouts.',
  },
  {
    title: 'Gestalt Principles',
    description: 'Proximity groups related items. Similarity signals shared purpose. Continuation guides the eye. Closure lets the brain complete shapes. Figure/ground creates depth.',
  },
  {
    title: 'Visual Hierarchy',
    description: 'Control attention via size, color, position, and isolation. Primary actions get the most visual weight. Secondary actions recede. Muted text for supporting context.',
  },
  {
    title: 'Negative Space',
    description: 'Six functions: grouping related elements, creating emphasis, conveying elegance, establishing rhythm, improving reading comfort, and enabling scalability.',
  },
];

export function DesignFoundationsShowcaseSM(_props: RenderableWidget) {
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

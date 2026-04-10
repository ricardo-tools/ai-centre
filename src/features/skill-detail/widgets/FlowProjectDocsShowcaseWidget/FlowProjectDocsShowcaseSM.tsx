'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Diataxis Quadrant',
    description: 'Tutorial (learning), How-to Guide (task), Reference (description), Explanation (understanding). Every page belongs to exactly one category.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'MDX Authoring',
    description: 'Embed actual React components with mocked data. Screenshots rot; components update with the codebase. Each page exports metadata + docMeta objects.',
    accent: 'var(--color-success)',
  },
  {
    title: 'React Flow Diagrams',
    description: 'Auto-layout with dagre (not elkjs). Architecture diagrams, data flow visuals. Mermaid only for sequence diagrams. All theme-aware.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'CI + Quality',
    description: 'Vale linter blocks PRs on style violations. Docs build with webapp. Preview deployments include /docs. Sync check is advisory.',
    accent: 'var(--color-error)',
  },
];

export function FlowProjectDocsShowcaseSM(_props: RenderableWidget) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      {highlights.map((h) => (
        <div
          key={h.title}
          style={{
            padding: 20,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            background: 'var(--color-surface)',
            borderLeft: `4px solid ${h.accent}`,
          }}
        >
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{h.title}</h4>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>{h.description}</p>
        </div>
      ))}
    </div>
  );
}

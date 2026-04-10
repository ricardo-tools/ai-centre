'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Three-Agent Dispatch',
    description: 'Strict (exact brand guidelines), Adaptive (innovate within constraints), Creative (push boundaries). Each reads the same brief but applies different philosophy.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Iteration Workflow',
    description: 'User picks a winner. Only that agent iterates. Previous versions preserved. Redesign (all 3) only on explicit request. Nothing is ever deleted.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Zero Ceremony',
    description: 'No tests, no planning methodology, no database (all mocked), no auth, no deployment, no code review gates. Fast prototyping, pure exploration.',
    accent: 'var(--color-error)',
  },
  {
    title: 'Graduation to Production',
    description: '/prototype guide generates: flow overview, widget decomposition, reusable components, critical implementation details, brand/token updates, code references.',
    accent: 'var(--color-success)',
  },
];

export function FlowPrototypeShowcaseSM(_props: RenderableWidget) {
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

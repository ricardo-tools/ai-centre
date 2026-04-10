'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Three-Tier Model',
    description: 'Hot (CLAUDE.md, <200 lines, always loaded), Warm (PROJECT_REFERENCE.md, 300-600 lines, on demand), Cold (ADRs, specs, when relevant). Only hot survives compaction.',
    accent: 'var(--color-error)',
  },
  {
    title: 'Feature Map',
    description: 'Every feature: name, status (built/partial/planned/removed), key files, dependencies, constraints. First thing checked before any change.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Decision Log',
    description: 'Format: Topic | Decision | Why (including rejected) | Date. Record real choices with alternatives. Full ADRs only for strategic decisions.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Post-Compaction Resilience',
    description: 'Any session can be compacted at any time. CLAUDE.md + PROJECT_REFERENCE.md must be self-contained enough for a fresh agent to understand the project.',
    accent: 'var(--color-success)',
  },
];

export function FlowProjectReferenceShowcaseSM(_props: RenderableWidget) {
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

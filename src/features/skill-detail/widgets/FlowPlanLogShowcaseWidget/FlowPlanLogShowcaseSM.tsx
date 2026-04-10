'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Active Context (Section 1)',
    description: 'Under 40 lines. Next chapter, current app state, test counts, dev login, environment requirements, key files, points of attention. Cross-reference, never duplicate.',
    accent: 'var(--color-error)',
  },
  {
    title: 'Plan Overview (Section 2)',
    description: 'One table per plan. Status (Complete/In progress/Not started), Key Decisions, Attention column. Post-plan state with concrete numbers for completed plans.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Execution Log (Section 3)',
    description: 'Grouped by session date, then by chapter. Capabilities over file lists. Test counts at end of each entry. Succinct but complete.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Entry Format',
    description: 'Decisions: "X over Y -- reason". Infrastructure: concrete numbers. Next action: immediately actionable with file path. No file-list dumping.',
    accent: 'var(--color-primary)',
  },
];

export function FlowPlanLogShowcaseSM(_props: RenderableWidget) {
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

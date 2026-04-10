'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Research before planning is a mandatory gate -- no exceptions',
  'Master plan first, iterate, then create all chapter files',
  'Plans live in .plans/ at project root (gitignored)',
  'Triage each topic: Simple / Moderate / Complex with evidence',
  '2-agent research with split knowledge bases for Moderate/Complex',
  'Debate moderator stress-tests agreement, not just disagreement',
  'Plan creation: 3-cycle minimum (draft, parallel review, final)',
  'Chapters are sequential unless explicitly independent',
];

export function FlowPlanningShowcaseXS(_props: RenderableWidget) {
  return (
    <div
      style={{
        padding: 24,
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-surface)',
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 16 }}>
        Flow Planning -- Key Takeaways
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {takeaways.map((text) => (
          <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 6 }} />
            <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

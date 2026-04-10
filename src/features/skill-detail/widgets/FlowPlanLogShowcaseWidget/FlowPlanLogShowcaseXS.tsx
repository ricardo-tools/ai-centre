'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'LOG.md has three sections: Active Context, Plan Overview, Execution Log',
  'Section 1 (Active Context): under 40 lines, for AI coordinator starting a new session',
  'Section 2 (Plan Overview): one table per plan with status, decisions, attention points',
  'Section 3 (Execution Log): grouped by session date, then by chapter',
  'Capabilities over file lists: "Users can invite team members" not file paths',
  'Decisions are real choices with rejected alternatives and reasons',
  'Infrastructure state is concrete numbers: "256 vitest, 22 E2E, 20 tables"',
  'Cross-reference other files by path -- never duplicate their content',
];

export function FlowPlanLogShowcaseXS(_props: RenderableWidget) {
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
        Flow Plan Log -- Key Takeaways
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

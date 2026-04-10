'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Three tiers: Hot (CLAUDE.md <200 lines), Warm (PROJECT_REFERENCE.md), Cold (ADRs, specs)',
  'Only the hot tier survives compaction -- it must tell agents where to look',
  'Record WHY decisions were made, not WHAT the code does',
  'Feature map is the backbone -- every feature gets a table entry',
  'Decision log includes rejected alternatives and reasons',
  '"Do Not Break" lists non-obvious constraints that would silently regress',
  'Update after plan completion, not after every task',
  'A fresh session with CLAUDE.md + PROJECT_REFERENCE.md should understand the project',
];

export function FlowProjectReferenceShowcaseXS(_props: RenderableWidget) {
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
        Flow Project Reference -- Key Takeaways
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

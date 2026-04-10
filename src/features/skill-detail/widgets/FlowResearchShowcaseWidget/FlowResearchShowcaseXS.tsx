'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Four research types: Documentation, Technology Comparison, Bug Investigation, Pattern Research',
  'CRAAP-test every source: Currency, Relevance, Authority, Accuracy, Purpose',
  'Two-source minimum for consequential decisions -- never act on a single source',
  'Three failed lookups = state uncertainty honestly, never fabricate confidence',
  'Three-option minimum for technology comparisons -- avoid false dilemmas',
  'Steel-man the alternative before recommending your preferred option',
  'Synthesise for user context -- never paste raw documentation',
  'Source hierarchy: official docs > changelog > GitHub > blog > training > community',
];

export function FlowResearchShowcaseXS(_props: RenderableWidget) {
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
        Flow Research -- Key Takeaways
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

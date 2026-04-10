'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Tests ARE the specification -- written before implementation, committed failing',
  'Test behaviours (given input, expect output), not implementations',
  'Gherkin vocabulary for integration and E2E: Given/When/Then/And/But/Rule',
  '3-tier data isolation: base data, file-level, test-level',
  'Mock only external boundaries (APIs, DB, email) -- let internals run for real',
  'Fishery factories + Faker for test data, never inline literals',
  'Hardening as final gate: full suite, 0 failures, tsc clean',
  'Snapshot testing is banned -- false confidence, rubber-stamped updates',
];

export function FlowTddShowcaseXS(_props: RenderableWidget) {
  return (
    <div
      style={{
        padding: 24,
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-surface)',
      }}
    >
      <h3
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          marginBottom: 16,
        }}
      >
        Flow TDD -- Key Takeaways
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {takeaways.map((text) => (
          <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                flexShrink: 0,
                marginTop: 6,
              }}
            />
            <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5 }}>
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

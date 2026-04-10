'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Testing Pyramid',
    description: 'Unit (most) > Integration (many) > Component (some) > E2E (few). Each level catches different problems at different costs.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Gherkin-Driven Scenarios',
    description: 'Integration and E2E tests use Given/When/Then/And/But as describe/it labels. Scenario Outlines with Examples for parameterised tests. Rules group related scenarios.',
    accent: 'var(--color-primary)',
  },
  {
    title: '3-Tier Data Isolation',
    description: 'Base data (suite-wide, recreated on startup), file-level (beforeAll/afterAll), test-level (per-test, afterEach rollback). No shared mutable state.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Hardening Gate',
    description: 'After all scenarios pass individually, run the FULL test suite. Fix regressions. Iterate until 0 failures. Verify: npm run build clean, tsc --noEmit clean.',
    accent: 'var(--color-error)',
  },
];

export function FlowTddShowcaseSM(_props: RenderableWidget) {
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

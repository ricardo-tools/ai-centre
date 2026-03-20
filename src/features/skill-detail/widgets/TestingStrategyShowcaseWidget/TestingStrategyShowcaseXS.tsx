'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Testing trophy: E2E ~40%, Component ~20%, Unit ~30%, Static always on',
  'Test behaviours (input/output), not implementations (function calls)',
  'Vitest for unit/component, Playwright for E2E — not Jest, not Cypress',
  'MSW v2 for API mocking — same handlers across all test levels',
  'Fishery + Faker for typed test data factories — no inline literals',
  'Mock external boundaries only — let domain objects run for real',
  'Snapshot testing is banned — false confidence, rubber-stamped updates',
  'Every test needs a reason to exist — if TypeScript catches it, skip it',
];

export function TestingStrategyShowcaseXS(_props: RenderableWidget) {
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
        Testing Strategy — Key Takeaways
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

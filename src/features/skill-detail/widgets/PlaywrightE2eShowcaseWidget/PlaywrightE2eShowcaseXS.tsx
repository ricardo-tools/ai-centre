'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Test user outcomes, not page internals — E2E is a user story executed by a robot',
  'Role-based selectors first: getByRole, getByLabel, getByText — not CSS or test IDs',
  'Each test is independent — own browser context, own auth session, own data',
  'Page objects for repeated interactions — single-point selector fix',
  'Auth via fixture (pre-set cookies), not UI login in every test',
  'Auto-waiting assertions only — never use waitForTimeout',
  'CI sharding across 4 runners — build first, then shard E2E',
  'Visual regression with toHaveScreenshot() for craft quality',
];

export function PlaywrightE2eShowcaseXS(_props: RenderableWidget) {
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
        Playwright E2E — Key Takeaways
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

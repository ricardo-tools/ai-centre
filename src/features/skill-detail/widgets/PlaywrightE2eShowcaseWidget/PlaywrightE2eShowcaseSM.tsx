'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Role-Based Locators',
    description: 'getByRole, getByLabel, getByText are the default. They enforce accessibility and are resilient to markup changes. data-testid is a last resort.',
  },
  {
    title: 'Page Object Pattern',
    description: 'Encapsulate selectors and common interactions per page. Tests use the page object, not raw selectors. Selector changes become a single-point fix.',
  },
  {
    title: 'Auth Fixtures',
    description: 'Set auth cookies directly — bypass the login UI. One dedicated test file exercises the actual login flow. Every other test uses the fixture.',
  },
  {
    title: 'CI Sharding',
    description: 'Build first, then shard E2E across 4 runners. Upload reports as artifacts on failure. retries: 1 in CI catches flaky tests automatically.',
  },
];

export function PlaywrightE2eShowcaseSM(_props: RenderableWidget) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {highlights.map((h) => (
        <div
          key={h.title}
          style={{
            padding: 20,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            background: 'var(--color-surface)',
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

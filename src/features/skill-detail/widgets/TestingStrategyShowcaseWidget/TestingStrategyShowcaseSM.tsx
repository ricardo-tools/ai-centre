'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Testing Trophy Model',
    description: 'E2E ~40% effort (critical paths), Component ~20% (widget interactions), Unit ~30% (domain logic), Static always on (TypeScript + ESLint). Integration is the largest confidence layer.',
  },
  {
    title: 'Behaviour over Implementation',
    description: 'Test what the system does (given input, expect output), not how it does it (function call counts, internal state). Behaviour tests survive refactoring.',
  },
  {
    title: 'Mock Boundaries Only',
    description: 'Mock external APIs (MSW), databases, file storage. Let domain objects, utilities, and mappers run for real. The more mocks, the less confidence.',
  },
  {
    title: 'Architecture Mapping',
    description: 'Domain objects → Unit. Use cases → Unit/Integration. Widgets → Component + MSW. Server Components → E2E only. Each code type has a specific test approach.',
  },
];

export function TestingStrategyShowcaseSM(_props: RenderableWidget) {
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

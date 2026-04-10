'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Log Level Matrix',
    description: 'debug (dev/test only) for internal state and cache hits. info/warn/error visible everywhere. The level determines who sees what, not whether to log.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Structured Format',
    description: 'Pino structured logger with dot-notation messages: module.operation.status. Every entry includes requestId and userId for correlation.',
    accent: 'var(--color-success)',
  },
  {
    title: '/api/dev/logs Endpoint',
    description: 'Ring buffer (200 entries) with filters: level, since, search, limit. Returns 403 in production. Feeds EDD verification.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Browser Console Collection',
    description: 'Client components log lifecycle events gated behind NODE_ENV. E2E tests capture console errors via page.on(console) for full observability.',
    accent: 'var(--color-error)',
  },
];

export function FlowObservabilityShowcaseSM(_props: RenderableWidget) {
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
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{h.title}</h4>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>{h.description}</p>
        </div>
      ))}
    </div>
  );
}

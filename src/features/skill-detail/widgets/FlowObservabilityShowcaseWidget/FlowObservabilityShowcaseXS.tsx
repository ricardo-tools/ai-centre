'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Every code path logs -- silence is a bug, not a style choice',
  'Log levels control visibility per environment, not whether to log',
  'debug: dev/test only. info/warn/error: all environments',
  'Pino structured format with dot-notation messages (module.operation.status)',
  '/api/dev/logs ring buffer for server log inspection (dev/test only)',
  'Browser console logs gated behind NODE_ENV === development',
  'E2E tests capture console errors via page.on(console)',
  'Never log secrets: tokens, passwords, OTPs, JWTs',
];

export function FlowObservabilityShowcaseXS(_props: RenderableWidget) {
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
        Flow Observability -- Key Takeaways
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

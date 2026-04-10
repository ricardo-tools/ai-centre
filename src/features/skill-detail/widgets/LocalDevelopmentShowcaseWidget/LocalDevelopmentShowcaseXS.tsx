'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Dev/prod parity: same database engine, framework, and runtime locally',
  'Environment variables are the configuration boundary — .env.local never committed',
  'Required vs optional: DATABASE_URL fails fast, BLOB_TOKEN falls back gracefully',
  'Service fallbacks: local filesystem, console log, canned responses, dev user bypass',
  'Seed data: idempotent, under 10 seconds, representative, no network calls',
  'Every dev bypass gated on NODE_ENV === development — production-safe',
  'Hot reload under 2 seconds — never break the feedback loop',
  'One command to start: npm run dev starts everything needed',
];

export function LocalDevelopmentShowcaseXS(_props: RenderableWidget) {
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
        Local Development — Key Takeaways
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

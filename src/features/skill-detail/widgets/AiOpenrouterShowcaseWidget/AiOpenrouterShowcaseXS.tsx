'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Unified gateway to 500+ models from 60+ providers via a single API key',
  'OpenAI SDK-compatible — change baseURL to connect to any provider',
  'Fallback chains: 2-3 models from different providers for resilience',
  'Routing variants: :nitro (speed), :floor (cost), :free (dev), :exacto (tools)',
  'Provider preferences: sort by price, latency, or throughput',
  'Zero Data Retention (ZDR) for PII — data_collection: deny',
  'Automatic prompt caching via sticky routing — no code changes needed',
  'BYOK (Bring Your Own Key) for high-volume direct pricing',
];

export function AiOpenrouterShowcaseXS(_props: RenderableWidget) {
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
        OpenRouter Integration — Key Takeaways
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

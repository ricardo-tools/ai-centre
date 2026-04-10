'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Model Routing',
    description: 'Models use provider/model-name format. Define fallback chains with 2-3 models from different providers. OpenRouter tries them in order on provider errors.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Routing Variants',
    description: 'Append :nitro for speed, :floor for cost, :free for dev, :exacto for tool accuracy, :online for web search. Match the variant to the use case.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Cost Management',
    description: 'Pass-through pricing with 5.5% markup on credits. BYOK eliminates markup. Track usage via response.usage field. Monitor per-model costs on dashboard.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Error Handling',
    description: '400/401/402: do not retry. 429: exponential backoff. 502/503: fallback chain handles automatically. Always handle 402 (credits exhausted) with alerts.',
    accent: 'var(--color-error)',
  },
];

export function AiOpenrouterShowcaseSM(_props: RenderableWidget) {
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

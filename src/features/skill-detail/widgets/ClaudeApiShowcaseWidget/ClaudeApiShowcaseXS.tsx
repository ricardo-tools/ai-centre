'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'AI calls are infrastructure services — never in UI or use cases',
  'Prompts are structured templates, not inline strings',
  'Choose model per task: Opus (reasoning), Sonnet (generation), Haiku (classification)',
  'Stream any response expected to take > 1 second',
  'Cache repeated system prompts for up to 90% token savings',
  'Handle 429 (rate limit), 529 (overload), 400 (context) explicitly',
  'Mock AI service at boundary for testing — never call real API in tests',
  'Log token usage per call, track costs per feature',
];

export function ClaudeApiShowcaseXS(_props: RenderableWidget) {
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
        Claude API Integration — Key Takeaways
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

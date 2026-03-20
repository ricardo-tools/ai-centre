'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Architecture Placement',
    description: 'Claude API is an infrastructure service — like a database. Use cases orchestrate; the AI service handles SDK calls, prompts, and retries. Only the service imports @anthropic-ai/sdk.',
  },
  {
    title: 'Model Selection',
    description: 'Choose per task: Opus for deep reasoning, Sonnet for complex generation, Haiku for classification/extraction. Batches API for 50+ items at 50% cost reduction.',
  },
  {
    title: 'Streaming & Caching',
    description: 'Stream any generation > 1s via ReadableStream. Cache repeated system prompts (> 1024 tokens) for up to 90% input savings. App-side cache for identical requests.',
  },
  {
    title: 'Resilience & Testing',
    description: 'Handle 429 (backoff), 529 (fallback model), 400 (truncate). Mock AI service at boundary — tests never hit real API. Log token usage per call.',
  },
];

export function ClaudeApiShowcaseSM(_props: RenderableWidget) {
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

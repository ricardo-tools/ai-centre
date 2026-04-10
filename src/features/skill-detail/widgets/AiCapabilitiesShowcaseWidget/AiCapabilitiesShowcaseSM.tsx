'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Capability Map',
    description: '14 categories across text, image, video, audio, embeddings, agents, code, moderation, and more. Each rated by maturity, cost, and latency.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Decision Tree',
    description: 'Prompting (hours) > RAG (days) > Fine-tuning (weeks). Prove simpler approach is insufficient before escalating. Most tasks never need fine-tuning.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Model Size Tiers',
    description: 'Haiku for classification, Sonnet for generation, Opus for reasoning. If cheaper model achieves 90%+ quality, use it. 5-20x savings.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Pipeline Composition',
    description: 'Capabilities compose into workflows: document processing, meeting intelligence, content creation, customer support. Validate between every step.',
    accent: 'var(--color-error)',
  },
];

export function AiCapabilitiesShowcaseSM(_props: RenderableWidget) {
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

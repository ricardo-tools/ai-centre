'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  '14 capability categories: text, image, video, audio, embeddings, agents, and more',
  'Maturity levels: Production (reliable), Partial (common cases), Experimental (demos only)',
  'Start with prompting, then RAG, then fine-tuning — each step is 10x more effort',
  'Use the smallest model that works — 5-20x cost difference between tiers',
  'AI calls are infrastructure, not business logic — behind interfaces, called by use cases',
  'Design for failure: validate with schemas, set timeouts, have fallbacks',
  'Cache aggressively: prompts, embeddings, and generated assets',
  'Human-in-the-loop by default — remove only when evals prove quality',
];

export function AiCapabilitiesShowcaseXS(_props: RenderableWidget) {
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
        AI Capabilities — Key Takeaways
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

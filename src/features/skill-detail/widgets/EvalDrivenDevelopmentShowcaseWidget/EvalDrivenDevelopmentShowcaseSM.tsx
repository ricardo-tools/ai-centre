'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'The EDD Loop',
    description: 'Define constraints, build v1, generate outputs, analyse errors, write evals, fix system, re-run. Step 4 (error analysis) is the most valuable — real failures reveal what you cannot anticipate.',
  },
  {
    title: 'Eval Layering',
    description: 'Deterministic evals first (free, instant) for format, structure, safety. LLM-as-judge second (~$0.01-0.10) for quality, coherence, accuracy. Human review for calibration only.',
  },
  {
    title: 'Non-Determinism',
    description: 'Run 5+ times during dev, 20+ for release decisions. Report pass rates with confidence intervals. Use temperature 0 for eval judges. Binary PASS/FAIL, not 1-5 scales.',
  },
  {
    title: 'CI Integration',
    description: 'Deterministic evals on every commit (free). LLM-judge on every PR (~$0.50-5). Full suite nightly. Block merge if pass rates drop below 85%.',
  },
];

export function EvalDrivenDevelopmentShowcaseSM(_props: RenderableWidget) {
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

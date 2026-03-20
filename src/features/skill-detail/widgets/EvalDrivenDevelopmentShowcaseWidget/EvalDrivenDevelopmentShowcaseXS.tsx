'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'The eval is the spec — if you cannot define "correct" as a function, you are not ready to build',
  'Start from real failures, not imagined ones — generate 20-50 outputs first',
  'Layer evals: deterministic (free, instant) then LLM-judge (paid, slower)',
  'Grade outcomes, not paths — AI finds valid approaches you did not anticipate',
  'Handle non-determinism statistically — run N times, measure pass rates',
  'Binary PASS/FAIL forces clarity — avoid 1-5 scales',
  'Evals are living artifacts — 100% pass rate means add harder cases',
  'CI: deterministic every commit, LLM-judge every PR, full suite nightly',
];

export function EvalDrivenDevelopmentShowcaseXS(_props: RenderableWidget) {
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
        Eval Driven Development — Key Takeaways
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

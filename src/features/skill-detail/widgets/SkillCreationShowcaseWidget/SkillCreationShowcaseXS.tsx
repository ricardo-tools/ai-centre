'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'A skill is a behavioural contract, not documentation — every sentence changes output',
  'One skill, one concern — composability over monoliths',
  'Every instruction must be verifiable from generated output',
  'Lead with what to do, reinforce with what not to do',
  'Include the "why" for non-obvious rules — agents generalise from rationale',
  'Keep under 500 lines — extract reference data to companion files',
  'Required sections: Frontmatter, When to Use, Core Rules, Banned Patterns, Quality Gate',
  'Structure for scanning: headers, bullets, code blocks — no prose walls',
];

export function SkillCreationShowcaseXS(_props: RenderableWidget) {
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
        Skill Creation — Key Takeaways
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

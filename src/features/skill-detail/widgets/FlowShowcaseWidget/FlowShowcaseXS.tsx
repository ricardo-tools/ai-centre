'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Three phases: PLANNING > IMPLEMENTATION > POST-DELIVERY',
  'Read during planning, write after delivery — never update docs mid-implementation',
  'Plan before acting: explore, design, get approval before writing code',
  'Never take destructive actions without authorisation — each action needs fresh consent',
  'Proportional: one-line fix = one-line answer, feature = full plan with chapters',
  'Commands: /continue, /plan, /status, /research, /audit, /park',
  '10 opinion skills available: TDD, EDD, research, planning, observability, and more',
  'Templates define methodology — flow defines when, templates define how',
];

export function FlowShowcaseXS(_props: RenderableWidget) {
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
        Flow — Key Takeaways
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

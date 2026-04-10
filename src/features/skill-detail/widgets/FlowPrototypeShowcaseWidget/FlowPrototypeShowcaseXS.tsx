'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Three-agent dispatch: Strict (on-brand), Adaptive (innovate within), Creative (push boundaries)',
  'Prototypes live in /prototypes with the same stack as the main app',
  'No tests, no planning, no database, no auth -- fast and creative',
  'Iterations use only the winning agent type, not all three',
  'Redesign (all 3 agents) only on explicit user request',
  'Previous versions are always preserved -- nothing is deleted',
  'Random funny names: Turbo Falcon, Dizzy Panda, Cosmic Waffle',
  '/prototype guide generates implementation guide for production graduation',
];

export function FlowPrototypeShowcaseXS(_props: RenderableWidget) {
  return (
    <div
      style={{
        padding: 24,
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-surface)',
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 16 }}>
        Flow Prototype -- Key Takeaways
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {takeaways.map((text) => (
          <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 6 }} />
            <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

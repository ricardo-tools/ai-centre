'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Roadmap lives in ROADMAP.md in the repo — not Jira, Linear, or Notion',
  'Six sections: Now / Next / Later / Parking Lot / Bugs / Completed',
  'Each item is self-contained: title, rationale, acceptance criteria, priority tag',
  'Auto-update protocol: agent reads at session start, updates after every completed task',
  'Bugs override by severity: P0 = drop everything, P1 = before features, P2 = schedule, P3 = later',
  'Parking Lot captures discoveries — humans triage, items never auto-promote',
  'MoSCoW within time horizons: Must/Should/Could labels in each section',
  'Keep Now to 3-5 items, scannable in under 30 seconds',
];

export function RoadmapShowcaseXS(_props: RenderableWidget) {
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
        Roadmap — Key Takeaways
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

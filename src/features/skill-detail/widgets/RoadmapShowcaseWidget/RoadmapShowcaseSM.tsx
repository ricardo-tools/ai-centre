'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Now / Next / Later',
    description: 'Now = commitments for this iteration (3-5 items max). Next = validated and ready. Later = directional ideas, not promises. Only Now carries commitment weight.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Auto-Update Protocol',
    description: 'Agent reads roadmap at session start. After completing work: check off sub-tasks, move items between sections, append discoveries to Parking Lot. Update is part of definition of done.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Bug Severity',
    description: 'P0: system down, fix immediately. P1: major feature broken, fix before features. P2: degraded, has workaround. P3: cosmetic, defer. Without severity tags all bugs look equal.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Parking Lot',
    description: 'Captures discoveries during implementation with date and context. Never auto-promotes to Now, Next, or Later. AI agents notice well but prioritise poorly — humans always triage.',
    accent: 'var(--color-error)',
  },
];

export function RoadmapShowcaseSM(_props: RenderableWidget) {
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

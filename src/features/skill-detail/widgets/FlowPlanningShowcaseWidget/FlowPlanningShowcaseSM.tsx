'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Triage Complexity',
    description: 'Simple (1 agent, no debate), Moderate (2 agents, 1 debate round), Complex (2 agents, 2+ debate rounds). Triage agent classifies with evidence; coordinator can override.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Research + Debate',
    description: 'Two agents MUST use different knowledge bases. Debate moderator receives both proposals + cited file paths. Argues FOR and AGAINST, then declares winner with evidence.',
    accent: 'var(--color-primary)',
  },
  {
    title: '3-Cycle Plan Review',
    description: 'Cycle 1: Planner drafts. Cycle 2: Detail + Conciseness reviewers challenge in parallel, Planner revises. Cycle 3: Final review. If unresolved, defer to user.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Plan Structure',
    description: '.plans/NN-kebab-name_YYYY-MM-DD/ with plan.md (master) + chN-slug.md (chapters). Decisions in plan.md inline. Chapters replicate full template.',
    accent: 'var(--color-secondary)',
  },
];

export function FlowPlanningShowcaseSM(_props: RenderableWidget) {
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
          <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{h.title}</h4>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>{h.description}</p>
        </div>
      ))}
    </div>
  );
}

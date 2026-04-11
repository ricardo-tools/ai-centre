'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Three Phases',
    description: 'PLANNING: explore codebase, design approach, get approval. IMPLEMENTATION: follow the active plan template. POST-DELIVERY: update LOG.md, PROJECT_REFERENCE.md, strategic context.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Safety Guardrails',
    description: 'Plan before acting. Never commit/push/delete without authorisation. Proportional responses: one-line fix needs no plan, new feature needs full planning.',
    accent: 'var(--color-error)',
  },
  {
    title: 'Command Reference',
    description: '/flow-continue resumes from park. /flow-plan creates plan. /flow-status gives summary. /flow-research investigates. /flow-audit runs quality gates. /flow-execute-plan implements chapters via subagents. /flow-park ends session.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Opinion System',
    description: '10 modular opinions activated per project: TDD, eval-driven, research, planning, observability, project-reference, project-docs, strategic-context, and more.',
    accent: 'var(--color-warning)',
  },
];

export function FlowShowcaseSM(_props: RenderableWidget) {
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

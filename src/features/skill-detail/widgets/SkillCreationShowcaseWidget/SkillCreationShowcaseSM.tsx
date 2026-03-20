'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Skill Anatomy',
    description: '5 required sections in order: Frontmatter, When to Use, Core Rules, Banned Patterns, Quality Gate. Custom sections go between Core Rules and Banned Patterns.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Good vs Bad Rules',
    description: 'Good: "Use var(--color-surface) for card backgrounds." Bad: "Write clean code." Every rule must be verifiable from the generated output.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Line Count Discipline',
    description: 'Under 200 lines for always-loaded skills. 200-500 for on-demand. Over 500: split into focused skills or extract reference data into companion files.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'Anti-Patterns to Avoid',
    description: 'Vague language, duplicating framework docs, urgency markers everywhere, negative-only instructions, and monolithic 1000-line skills covering multiple concerns.',
    accent: 'var(--color-error)',
  },
];

export function SkillCreationShowcaseSM(_props: RenderableWidget) {
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

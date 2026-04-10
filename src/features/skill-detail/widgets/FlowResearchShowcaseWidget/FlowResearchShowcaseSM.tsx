'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Documentation Lookup',
    description: 'Stable APIs: answer from knowledge. Evolving APIs: always look up. Check changelogs for version-specific questions. Synthesise, never paste raw docs.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Technology Comparison',
    description: 'Three-option minimum. Steel-man the alternative. Structured comparison table with real pricing, strengths, weaknesses, and sources.',
    accent: 'var(--color-secondary)',
  },
  {
    title: 'Bug Investigation',
    description: 'Search exact error message. Check open AND closed issues. Reproduce, search, scientific debug, 5 Whys. Report with GitHub issue links.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'CRAAP Framework',
    description: 'Currency (when?), Relevance (to this question?), Authority (who?), Accuracy (evidence?), Purpose (informative or selling?). Apply to every source.',
    accent: 'var(--color-success)',
  },
];

export function FlowResearchShowcaseSM(_props: RenderableWidget) {
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

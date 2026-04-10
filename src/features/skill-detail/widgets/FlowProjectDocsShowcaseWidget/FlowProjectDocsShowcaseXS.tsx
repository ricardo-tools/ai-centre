'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Diataxis: Tutorial / How-to Guide / Reference / Explanation -- one category per page',
  'MDX authoring: embed actual React components, not screenshots',
  'React Flow + dagre for architecture diagrams (not elkjs)',
  'Mermaid kept only for sequence diagrams (lifelines)',
  'One concept per page for human findability and AI chunking',
  'Docs are a webapp route (/docs), not a separate site',
  'Bookmark pages for planned docs -- visible structure before content',
  'Vale linter in CI blocks merges on style violations',
];

export function FlowProjectDocsShowcaseXS(_props: RenderableWidget) {
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
        Flow Project Docs -- Key Takeaways
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

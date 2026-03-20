'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Architecture',
    description: 'Client ↔ Transport ↔ MCP Server ↔ Domain. The server is a thin transport layer — business logic stays in your use cases and repositories.',
  },
  {
    title: 'Tool Design',
    description: 'Precise descriptions (what, when, returns). Zod schemas with .describe() on every parameter. 5-10 tools per server, grouped by naming prefix.',
  },
  {
    title: 'Resources vs Tools',
    description: 'Resources are read-only data by URI (like GET). Tools are actions that may change state (like POST). Never mutate in a resource handler.',
  },
  {
    title: 'Testing',
    description: 'Extract handler logic into standalone functions for unit tests. Use InMemoryTransport for integration tests against the full MCP server.',
  },
];

export function McpServerPatternsShowcaseSM(_props: RenderableWidget) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {highlights.map((h) => (
        <div
          key={h.title}
          style={{
            padding: 20,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            background: 'var(--color-surface)',
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

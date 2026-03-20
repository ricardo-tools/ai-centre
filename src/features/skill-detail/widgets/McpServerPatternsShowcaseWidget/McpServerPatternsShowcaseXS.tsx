'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  'Tool descriptions are the most important field — precise multi-sentence descriptions drive accuracy',
  'Tool handlers are thin controllers — validate, delegate to use case, return structured result',
  'Keep tool sets small: 5-10 ideal, never exceed 15 per server',
  'Resources are for reading (GET), tools are for doing (POST) — never mutate in resources',
  'Transport is a deployment decision — keep all server logic transport-agnostic',
  'Return structured JSON, not prose — let the model format for the user',
  'Every Zod parameter needs .describe() with clear semantics',
  'Extract handler logic into standalone functions for unit testing',
];

export function McpServerPatternsShowcaseXS(_props: RenderableWidget) {
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
        MCP Server Patterns — Key Takeaways
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

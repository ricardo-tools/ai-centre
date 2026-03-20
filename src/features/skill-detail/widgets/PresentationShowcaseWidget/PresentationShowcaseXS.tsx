'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const takeaways = [
  '5-phase creation: Strategy \u2192 Content \u2192 Design \u2192 Build \u2192 Polish',
  'Pre-flight brand context: ask if ezyCollect/Sidetrade before proceeding',
  'Standalone HTML with keyboard nav, fullscreen, PPTX export',
  '6 messaging frameworks: Problem\u2192Solution, Before/After, Data Story, etc.',
  'Copy craft: headlines as assertions, 6-word max, power verbs',
  'Design toolkit: glassmorphism cards, layered backgrounds, stat cards',
];

export function PresentationShowcaseXS(_props: RenderableWidget) {
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
        Presentation Skill — Key Takeaways
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

'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Single-File Architecture',
    description: 'One HTML file with embedded CSS, JS, navigation, themes, and PPTX export. Works when opened locally — no server needed.',
  },
  {
    title: 'Design Toolkit',
    description: 'Three-layer backgrounds (gradient + grid + glow orbs), glassmorphism cards, staggered reveals, and Kicker-Title-Subtitle typography chain.',
  },
  {
    title: 'Navigation',
    description: 'Full keyboard (arrows, space, home/end, F, 1-9), mouse click zones (left 15% / right 85%), touch swipe, and URL hash persistence.',
  },
  {
    title: 'Footer Bar',
    description: 'Glassmorphism nav bar with backdrop-filter blur(20px), progress bar, theme toggle, fullscreen, PPTX export, and slide counter.',
  },
];

export function PresentationHtmlImplementationShowcaseSM(_props: RenderableWidget) {
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

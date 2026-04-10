'use client';

import type { RenderableWidget } from '@/platform/screen-renderer/types';

const highlights = [
  {
    title: 'Dev/Prod Parity',
    description: 'Run the same database engine and framework locally. Mocking Postgres with SQLite creates bugs you only discover in production.',
    accent: 'var(--color-primary)',
  },
  {
    title: 'Service Fallbacks',
    description: 'File storage falls back to local filesystem, email to console log, auth to dev user bypass. Development keeps moving without cloud credentials.',
    accent: 'var(--color-success)',
  },
  {
    title: 'Environment Variables',
    description: '.env.example committed with placeholders. .env.local gitignored with real values. App validates required vars on startup, logs missing optional ones.',
    accent: 'var(--color-warning)',
  },
  {
    title: 'One-Command Bootstrap',
    description: 'git clone > cp .env.example .env.local > npm install > npm run db:migrate > npm run db:seed > npm run dev. Under 5 minutes total.',
    accent: 'var(--color-error)',
  },
];

export function LocalDevelopmentShowcaseSM(_props: RenderableWidget) {
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

'use client';

import Link from 'next/link';
import { TOOLKIT_PRESETS } from '@/platform/lib/archetypes';
import { getDomain } from '@/platform/lib/toolkit-composition';

export function HomeToolkits() {
  return (
    <section>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          margin: '0 0 16px',
        }}
      >
        Pick a toolkit to start
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}
      >
        {TOOLKIT_PRESETS.map((preset) => {
          const domain = getDomain(preset.compositionSelection.domainSlug);
          return (
            <Link
              key={preset.slug}
              href={`/generate?preset=${preset.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: 20,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'border-color 150ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
              }}
            >
              <span style={{ fontSize: 28, marginBottom: 8 }}>{preset.icon}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  marginBottom: 4,
                }}
              >
                {preset.title}
              </span>
              {domain && (
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                    marginBottom: 8,
                  }}
                >
                  {domain.title}
                </span>
              )}
              <span
                style={{
                  display: 'inline-flex',
                  alignSelf: 'flex-start',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: 'var(--color-primary-muted)',
                  color: 'var(--color-primary)',
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {preset.skills.length} skills
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

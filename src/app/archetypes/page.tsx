import Link from 'next/link';
import { ARCHETYPES } from '@/lib/archetypes';

export default function ArchetypesPage() {
  return (
    <div style={{ maxWidth: 960 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
        Archetypes
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 32 }}>
        Pre-configured project templates that suggest the right skills for your use case.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {ARCHETYPES.map((a) => (
          <div
            key={a.slug}
            style={{
              padding: 24,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 32 }}>{a.icon}</span>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{a.title}</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{a.description}</p>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {a.skills.map((s) => (
                  <Link
                    key={s}
                    href={`/skills/${s}`}
                    style={{
                      fontSize: 12,
                      padding: '3px 10px',
                      borderRadius: 4,
                      background: 'var(--color-primary-muted)',
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: 8 }}>
              <Link
                href={`/generate?archetype=${a.slug}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 6,
                  background: 'var(--color-primary)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Use this archetype →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

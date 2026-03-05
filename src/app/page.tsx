import Link from 'next/link';
import { getAllSkills } from '@/lib/skills';

export default function HomePage() {
  const skills = getAllSkills();

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
        AI Centre
      </h1>
      <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
        Select an archetype, choose your skills, describe your idea — download a project ready for Claude Code.
      </p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
        <Link
          href="/skills"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            borderRadius: 6,
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Browse Skills
        </Link>
        <Link
          href="/generate"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Generate Project
        </Link>
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 16 }}>
        Official Skills ({skills.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {skills.map((skill) => (
          <Link
            key={skill.slug}
            href={`/skills/${skill.slug}`}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              textDecoration: 'none',
              transition: 'border-color 150ms',
            }}
          >
            <div>
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                {skill.title}
              </span>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>
                {skill.description}
              </p>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: 16 }}>
              v{skill.version}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

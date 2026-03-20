import Link from 'next/link';

interface ArchetypeCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  skills: string[];
  suggestedSkillsLabel?: string;
  ctaLabel?: string;
}

export function ArchetypeCard({
  slug,
  title,
  description,
  icon,
  skills,
  suggestedSkillsLabel = 'Suggested Skills',
  ctaLabel = 'Use this archetype →',
}: ArchetypeCardProps) {
  return (
    <div
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
        <span style={{ fontSize: 32 }}>{icon}</span>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{title}</h2>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{description}</p>
      <div>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {suggestedSkillsLabel}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {skills.map((s) => (
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
          href={`/generate?archetype=${slug}`}
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
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}

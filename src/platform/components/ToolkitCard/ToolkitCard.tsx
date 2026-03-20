import Link from 'next/link';

interface ToolkitCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  domainName: string;
  addonNames: string[];
  skillCount: number;
}

export function ToolkitCard({
  slug,
  title,
  description,
  icon,
  domainName,
  addonNames,
  skillCount,
}: ToolkitCardProps) {
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

      {/* Domain badge */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 4,
            background: 'var(--color-primary-muted)',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {domainName}
        </span>

        {/* Addon pills */}
        {addonNames.map((addon) => (
          <span
            key={addon}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
              background: 'var(--color-surface-raised)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            {addon}
          </span>
        ))}
      </div>

      {/* Skill count */}
      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
        {skillCount} skill{skillCount !== 1 ? 's' : ''} included
      </p>

      <div style={{ marginTop: 'auto', paddingTop: 8 }}>
        <Link
          href={`/generate?preset=${slug}`}
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
          Use this toolkit →
        </Link>
      </div>
    </div>
  );
}

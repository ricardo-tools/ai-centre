import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

interface SkillCardProps {
  slug: string;
  title: string;
  description: string;
  isOfficial: boolean;
  version: string | null;
}

export function SkillCard({ slug, title, description, isOfficial, version }: SkillCardProps) {
  return (
    <Link
      href={`/skills/${slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        textDecoration: 'none',
        transition: 'border-color 150ms, box-shadow 150ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
          {title}
        </h3>
        {isOfficial && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
            }}
          >
            Official
          </span>
        )}
      </div>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0, flex: 1, lineHeight: 1.5 }}>
        {description}
      </p>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid var(--color-border)',
        }}
      >
        {version && (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>v{version}</span>
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-secondary)', fontWeight: 500 }}>
          View <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

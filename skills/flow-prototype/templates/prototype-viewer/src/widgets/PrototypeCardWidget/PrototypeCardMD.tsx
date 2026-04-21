'use client';

import Link from 'next/link';
import TagBadge from '../../components/TagBadge';

interface PrototypeData {
  slug: string;
  projectSlug: string;
  name: string;
  agent: string;
  tags: string[];
  commentCount: number;
  formattedUpdatedAt: string;
}

interface Props {
  prototype?: PrototypeData;
}

export default function PrototypeCardMD({ prototype }: Props) {
  if (!prototype) return null;

  return (
    <Link href={`/${prototype.projectSlug}/${prototype.slug}`} style={{ width: '100%', display: 'block' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          padding: 'var(--space-3)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'box-shadow 150ms var(--ease-in-out), border-color 150ms var(--ease-in-out)',
          width: '100%',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.borderColor = 'var(--color-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'var(--color-border)';
        }}
      >
        <h4
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {prototype.name}
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', alignItems: 'center' }}>
          <TagBadge label={prototype.agent} variant="agent" />
          {prototype.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          {prototype.formattedUpdatedAt}
        </div>
      </div>
    </Link>
  );
}

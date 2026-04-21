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

export default function PrototypeCardXS({ prototype }: Props) {
  if (!prototype) return null;

  return (
    <Link href={`/${prototype.projectSlug}/${prototype.slug}`} style={{ width: '100%', display: 'block' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          transition: 'box-shadow 150ms var(--ease-in-out), border-color 150ms var(--ease-in-out)',
          width: '100%',
          minHeight: 44,
          overflow: 'hidden',
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
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          {prototype.name}
        </span>
        <span style={{ flexShrink: 0 }}>
          <TagBadge label={prototype.agent} variant="agent" />
        </span>
      </div>
    </Link>
  );
}

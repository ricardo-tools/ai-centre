'use client';

import Link from 'next/link';
import { ArrowFatUp, ChatCircle, BookmarkSimple } from '@phosphor-icons/react';

interface ToolkitCardProps {
  slug: string;
  title: string;
  description: string;
  icon: string;
  domainName: string;
  addonNames: string[];
  skillCount: number;
  upvoteCount?: number;
  commentCount?: number;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
  onToggleUpvote?: () => void;
  onToggleBookmark?: () => void;
  onCommentClick?: () => void;
}

export function ToolkitCard({
  slug,
  title,
  description,
  icon,
  domainName,
  addonNames,
  skillCount,
  upvoteCount,
  commentCount,
  isUpvoted,
  isBookmarked,
  onToggleUpvote,
  onToggleBookmark,
  onCommentClick,
}: ToolkitCardProps) {
  return (
    <Link
      href={`/generate?preset=${slug}`}
      className="card-hover"
      data-entity-id={slug}
      data-entity-type="toolkit"
      style={{
        padding: 24,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        textDecoration: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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

      <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
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
          }}
        >
          Use this toolkit →
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            data-testid="upvote-button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleUpvote?.(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: isUpvoted ? 'var(--color-primary)' : 'var(--color-text-muted)', fontSize: 12, fontFamily: 'inherit', fontWeight: isUpvoted ? 600 : 400, padding: 0, transition: 'color 150ms' }}
          >
            <ArrowFatUp size={14} weight={isUpvoted ? 'fill' : 'regular'} /> {upvoteCount ?? 0}
          </button>

          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCommentClick?.(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'inherit', padding: 0 }}
          >
            <ChatCircle size={14} /> {commentCount ?? 0}
          </button>
        </div>
      </div>
    </Link>
  );
}

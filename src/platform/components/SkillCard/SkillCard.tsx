'use client';

import Link from 'next/link';
import { ArrowRight, DownloadSimple, ArrowFatUp, ChatCircle, BookmarkSimple } from '@phosphor-icons/react';

const TYPE_LABELS: Record<string, string> = { principle: 'Principle', implementation: 'Implementation', reference: 'Reference' };
const LAYER_LABELS: Record<string, string> = { frontend: 'Frontend', backend: 'Backend', fullstack: 'Full Stack', infrastructure: 'Infra', design: 'Design', process: 'Process', workflow: 'Workflow' };
const DOMAIN_LABELS: Record<string, string> = { 'product-development': 'Product', marketing: 'Marketing', design: 'Design', engineering: 'Engineering', operations: 'Ops', global: 'Global' };

interface SkillCardProps {
  slug: string;
  title: string;
  description: string;
  isOfficial: boolean;
  version: string | null;
  tags?: { type: 'principle' | 'implementation' | 'reference'; domain: string[]; layer: string; };
  officialLabel?: string;
  viewLabel?: string;
  author?: string;
  downloadCount?: number;
  upvoteCount?: number;
  commentCount?: number;
  isUpvoted?: boolean;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onToggleUpvote?: () => void;
  onCommentClick?: () => void;
}

export function SkillCard({ slug, title, description, isOfficial, version, tags, officialLabel = 'Official', viewLabel = 'View', author, downloadCount, upvoteCount, commentCount, isUpvoted, isBookmarked, onToggleBookmark, onToggleUpvote, onCommentClick }: SkillCardProps) {
  const isWorkflow = tags?.layer === 'workflow';
  const showNewBadge = !isWorkflow && (downloadCount === undefined || downloadCount === 0);
  return (
    <div
      className="card-hover"
      data-entity-id={slug}
      data-entity-type="skill"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
      }}
    >
    <Link
      href={`/skills/${slug}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        paddingBottom: 0,
        textDecoration: 'none',
        flex: 1,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
          {title}
        </h3>
        {isOfficial ? (
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
            {officialLabel}
          </span>
        ) : (
          <span
            data-testid="skill-badge-community"
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 4,
              background: 'var(--color-comp-violet-muted)',
              color: 'var(--color-comp-violet)',
            }}
            aria-label="Community skill"
          >
            Community
          </span>
        )}
      </div>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0, flex: 1, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
        {description}
      </p>
      {tags && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 16 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
            background: tags.type === 'principle' ? 'var(--color-primary-muted)' : tags.type === 'implementation' ? 'var(--color-success-muted)' : 'var(--color-bg-alt)',
            color: tags.type === 'principle' ? 'var(--color-primary)' : tags.type === 'implementation' ? 'var(--color-success)' : 'var(--color-text-muted)',
          }}>{TYPE_LABELS[tags.type]}</span>
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3,
            background: isWorkflow ? 'var(--color-warning-muted, var(--color-bg-alt))' : 'var(--color-bg-alt)',
            color: isWorkflow ? 'var(--color-warning, var(--color-text-muted))' : 'var(--color-text-muted)',
          }}>
            {LAYER_LABELS[tags.layer]}
          </span>
          {tags.domain.slice(0, 2).map(d => (
            <span key={d} style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}>
              {DOMAIN_LABELS[d]}
            </span>
          ))}
        </div>
      )}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {author && (
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              By {author}
            </span>
          )}
          {author && version && (
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', opacity: 0.5 }}>&middot;</span>
          )}
          {version && (
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>v{version}</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isWorkflow && downloadCount !== undefined && downloadCount > 0 ? (
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <DownloadSimple size={12} /> {downloadCount}
            </span>
          ) : showNewBadge ? (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: 4,
                background: 'var(--color-success-muted)',
                color: 'var(--color-success)',
              }}
            >
              New
            </span>
          ) : null}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-body)', fontWeight: 500 }}>
            {viewLabel} <ArrowRight size={14} />
          </span>
        </div>
      </div>
      </Link>
      {/* Social signals — OUTSIDE Link to prevent navigation on click */}
      <div data-testid="social-row" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 24px 16px', borderTop: '1px solid var(--color-border)', marginTop: 8 }}>
        <button
          data-testid="upvote-button"
          onClick={() => onToggleUpvote?.()}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            color: isUpvoted ? 'var(--color-primary)' : 'var(--color-text-muted)',
            fontSize: 12, fontFamily: 'inherit', fontWeight: isUpvoted ? 600 : 400, padding: 0,
            transition: 'color 150ms',
          }}
        >
          <ArrowFatUp size={14} weight={isUpvoted ? 'fill' : 'regular'} /> {upvoteCount ?? 0}
        </button>

        <button
          data-testid="comment-button"
          onClick={() => onCommentClick?.()}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)',
            fontSize: 12, fontFamily: 'inherit', padding: 0,
          }}
        >
          <ChatCircle size={14} /> {commentCount ?? 0}
        </button>

        <span style={{ flex: 1 }} />

        {onToggleBookmark && (
          <button
            data-testid="bookmark-button"
            onClick={() => onToggleBookmark()}
            style={{
              display: 'flex', alignItems: 'center',
              background: 'none', border: 'none', cursor: 'pointer',
              color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-muted)',
              padding: 0, transition: 'color 150ms',
            }}
          >
            <BookmarkSimple size={16} weight={isBookmarked ? 'fill' : 'regular'} />
          </button>
        )}
      </div>
    </div>
  );
}

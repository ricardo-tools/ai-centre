import Link from 'next/link';
import { ArrowRight, DownloadSimple, ThumbsUp, ChatCircle, BookmarkSimple } from '@phosphor-icons/react/dist/ssr';

const TYPE_LABELS: Record<string, string> = { principle: 'Principle', implementation: 'Implementation', reference: 'Reference' };
const LAYER_LABELS: Record<string, string> = { frontend: 'Frontend', backend: 'Backend', fullstack: 'Full Stack', infrastructure: 'Infra', design: 'Design', process: 'Process' };
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
  likeCount?: number;
  commentCount?: number;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onToggleLike?: () => void;
}

export function SkillCard({ slug, title, description, isOfficial, version, tags, officialLabel = 'Official', viewLabel = 'View', author, downloadCount, likeCount, commentCount, isBookmarked, onToggleBookmark, onToggleLike }: SkillCardProps) {
  const showNewBadge = downloadCount === undefined || downloadCount === 0;
  return (
    <Link
      href={`/skills/${slug}`}
      className="card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        textDecoration: 'none',
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
            {officialLabel}
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
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 3, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}>
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
          {downloadCount !== undefined && downloadCount > 0 ? (
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
      {/* Social signals */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike?.(); }}
          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'inherit', padding: 0 }}
        >
          <ThumbsUp size={14} /> {likeCount ?? 0}
        </button>

        <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-text-muted)', fontSize: 12 }}>
          <ChatCircle size={14} /> {commentCount ?? 0}
        </span>

        <span style={{ flex: 1 }} />

        {onToggleBookmark && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleBookmark(); }}
            style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', color: isBookmarked ? 'var(--color-primary)' : 'var(--color-text-muted)', padding: 0 }}
          >
            <BookmarkSimple size={16} weight={isBookmarked ? 'fill' : 'regular'} />
          </button>
        )}
      </div>
    </Link>
  );
}

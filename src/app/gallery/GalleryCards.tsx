'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  UploadSimple,
  MagnifyingGlass,
  FileHtml,
  FileZip,
  Globe,
  Code,
  User,
  ArrowRight,
} from '@phosphor-icons/react';
import { fetchAllShowcases, type RawShowcaseUpload } from '@/features/showcase-gallery/action';

/* ── Helpers ─────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function TypeBadge({ fileType }: { fileType: 'html' | 'zip' }) {
  const Icon = fileType === 'html' ? FileHtml : FileZip;
  const label = fileType === 'html' ? 'HTML' : 'ZIP';
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 4,
        background: 'var(--color-primary-muted)',
        color: 'var(--color-primary)',
        fontSize: 11,
        fontWeight: 600,
      }}
    >
      <Icon size={14} weight="bold" />
      {label}
    </div>
  );
}

function SkillBadges({ skillIds, max = 3 }: { skillIds: string[]; max?: number }) {
  if (skillIds.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {skillIds.slice(0, max).map((slug) => (
        <span
          key={slug}
          style={{
            fontSize: 10,
            fontWeight: 500,
            padding: '2px 6px',
            borderRadius: 3,
            background: 'var(--color-bg-alt)',
            color: 'var(--color-text-muted)',
          }}
        >
          {slug}
        </span>
      ))}
      {skillIds.length > max && (
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
          +{skillIds.length - max} more
        </span>
      )}
    </div>
  );
}

function Preview({ showcase }: { showcase: RawShowcaseUpload }) {
  if (showcase.fileType === 'html') {
    return (
      <div
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--color-bg-alt)',
          height: 160,
        }}
      >
        <iframe
          src={showcase.blobUrl}
          title={showcase.title}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        borderRadius: 8,
        background: 'var(--color-bg-alt)',
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TypeBadge fileType={showcase.fileType} />
    </div>
  );
}

function FeaturedPreview({ showcase }: { showcase: RawShowcaseUpload }) {
  if (showcase.fileType === 'html') {
    return (
      <div
        style={{
          borderRadius: 8,
          overflow: 'hidden',
          background: 'var(--color-bg-alt)',
          height: 400,
        }}
      >
        <iframe
          src={showcase.blobUrl}
          title={showcase.title}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  }
  return (
    <div
      style={{
        borderRadius: 8,
        background: 'var(--color-bg-alt)',
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TypeBadge fileType={showcase.fileType} />
    </div>
  );
}

/* ── Card variants ───────────────────────────────────────── */

function FeaturedCard({ showcase }: { showcase: RawShowcaseUpload }) {
  return (
    <Link
      href={`/gallery/${showcase.id}`}
      className="card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        textDecoration: 'none',
        overflow: 'hidden',
      }}
    >
      <FeaturedPreview showcase={showcase} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <TypeBadge fileType={showcase.fileType} />
        </div>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: '0 0 8px',
          }}
        >
          {showcase.title}
        </h3>
        {showcase.description && (
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              margin: '0 0 16px',
              lineHeight: 1.5,
            }}
          >
            {showcase.description}
          </p>
        )}
        <div style={{ marginBottom: 16 }}>
          <SkillBadges skillIds={showcase.skillIds} />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            <User size={14} />
            <span>{showcase.userName}</span>
            <span style={{ opacity: 0.5 }}>&middot;</span>
            <span>{formatDate(showcase.createdAt)}</span>
          </div>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              color: 'var(--color-text-body)',
              fontWeight: 500,
            }}
          >
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function StandardCard({ showcase }: { showcase: RawShowcaseUpload }) {
  return (
    <Link
      href={`/gallery/${showcase.id}`}
      className="card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        textDecoration: 'none',
        overflow: 'hidden',
      }}
    >
      <Preview showcase={showcase} />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <TypeBadge fileType={showcase.fileType} />
        </div>
        <h3
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: '0 0 8px',
          }}
        >
          {showcase.title}
        </h3>
        <div style={{ marginBottom: 16 }}>
          <SkillBadges skillIds={showcase.skillIds} max={3} />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
            paddingTop: 16,
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            <User size={14} />
            <span>{showcase.userName}</span>
            <span style={{ opacity: 0.5 }}>&middot;</span>
            <span>{formatDate(showcase.createdAt)}</span>
          </div>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 13,
              color: 'var(--color-text-body)',
              fontWeight: 500,
            }}
          >
            View <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Empty state ─────────────────────────────────────────── */

function EmptyState() {
  return (
    <div>
      {/* Main invite card */}
      <div
        style={{
          border: '2px dashed var(--color-border)',
          borderRadius: 12,
          padding: '64px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <UploadSimple
          size={48}
          weight="regular"
          style={{ color: 'var(--color-text-muted)', marginBottom: 16 }}
        />
        <h3
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            margin: '0 0 8px',
          }}
        >
          No showcases yet
        </h3>
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-muted)',
            margin: '0 0 24px',
            maxWidth: 400,
            lineHeight: 1.5,
          }}
        >
          Be the first to share a project built with AI Centre skills. Upload an
          HTML file or a Next.js project ZIP.
        </p>
        <Link
          href="/gallery/upload"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 24px',
            borderRadius: 6,
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Upload the first showcase &rarr;
        </Link>
      </div>

      {/* Hint cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
          gap: 16,
        }}
      >
        {[
          { icon: FileHtml, label: 'HTML presentations' },
          { icon: Code, label: 'Next.js projects' },
          { icon: Globe, label: 'Any web creation' },
        ].map(({ icon: HintIcon, label }) => (
          <div
            key={label}
            style={{
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <HintIcon
              size={20}
              weight="regular"
              style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}
            />
            <span
              style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Search input ────────────────────────────────────────── */

function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      className="search-wrapper"
      style={{
        position: 'relative',
        marginBottom: 24,
      }}
    >
      <MagnifyingGlass
        size={18}
        weight="regular"
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--color-text-muted)',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search showcases..."
        style={{
          width: '100%',
          padding: '8px 16px 8px 40px',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          color: 'var(--color-text-body)',
          fontSize: 14,
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────── */

export function GalleryCards() {
  const [showcases, setShowcases] = useState<RawShowcaseUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchAllShowcases()
      .then((result) => {
        if (result.ok) setShowcases(result.value);
      })
      .catch(() => {
        // Server action threw — gallery renders empty
      })
      .finally(() => setLoading(false));
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  // No showcases at all — show elaborate empty state (no search bar)
  if (showcases.length === 0) {
    return <EmptyState />;
  }

  // Filter by search
  const needle = debouncedQuery.toLowerCase().trim();
  const filtered = needle
    ? showcases.filter(
        (s) =>
          s.title.toLowerCase().includes(needle) ||
          (s.description ?? '').toLowerCase().includes(needle),
      )
    : showcases;

  const count = filtered.length;

  return (
    <div>
      <SearchInput value={query} onChange={handleQueryChange} />

      {/* Result count */}
      <p
        style={{
          fontSize: 13,
          color: 'var(--color-text-muted)',
          margin: '0 0 16px',
        }}
      >
        {needle
          ? count === 0
            ? 'No showcases match your search'
            : `${count} showcase${count === 1 ? '' : 's'}`
          : `${count} showcase${count === 1 ? '' : 's'}`}
      </p>

      {/* Search returned nothing */}
      {count === 0 && needle && (
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            borderRadius: 8,
            border: '1px dashed var(--color-border)',
          }}
        >
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              margin: 0,
            }}
          >
            No showcases match &ldquo;{debouncedQuery}&rdquo;
          </p>
        </div>
      )}

      {/* 1 showcase — full-width featured */}
      {count === 1 && <FeaturedCard showcase={filtered[0]} />}

      {/* 2-3 showcases — magazine layout */}
      {count >= 2 && count <= 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FeaturedCard showcase={filtered[0]} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
            }}
          >
            {filtered.slice(1).map((s) => (
              <StandardCard key={s.id} showcase={s} />
            ))}
          </div>
        </div>
      )}

      {/* 4+ showcases — responsive grid */}
      {count >= 4 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 16,
          }}
        >
          {filtered.map((s) => (
            <StandardCard key={s.id} showcase={s} />
          ))}
        </div>
      )}
    </div>
  );
}

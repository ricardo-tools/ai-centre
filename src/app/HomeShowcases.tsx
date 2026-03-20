'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight, FileHtml, FileZip, User } from '@phosphor-icons/react';
import { fetchAllShowcases, type RawShowcaseUpload } from '@/features/showcase-gallery/action';

function ShowcaseCard({ showcase, fullWidth }: { showcase: RawShowcaseUpload; fullWidth?: boolean }) {
  const Icon = showcase.fileType === 'html' ? FileHtml : FileZip;
  const typeLabel = showcase.fileType === 'html' ? 'HTML' : 'Next.js';
  const date = new Date(showcase.createdAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Link
      href={`/gallery/${showcase.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        textDecoration: 'none',
        transition: 'border-color 150ms',
        gridColumn: fullWidth ? '1 / -1' : undefined,
      }}
    >
      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
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
          {typeLabel}
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: fullWidth ? 18 : 16,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          margin: '0 0 8px',
        }}
      >
        {showcase.title}
      </h3>

      {/* Description */}
      {showcase.description && (
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-muted)',
            margin: '0 0 16px',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {showcase.description}
        </p>
      )}

      {/* Skills used */}
      {showcase.skillIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
          {showcase.skillIds.slice(0, 4).map((slug) => (
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
          {showcase.skillIds.length > 4 && (
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
              +{showcase.skillIds.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
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
          <span style={{ opacity: 0.5 }}>·</span>
          <span>{date}</span>
        </div>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            color: 'var(--color-secondary)',
            fontWeight: 500,
          }}
        >
          View <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

export function HomeShowcases() {
  const [showcases, setShowcases] = useState<RawShowcaseUpload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllShowcases()
      .then((result) => {
        if (result.ok) setShowcases(result.value);
      })
      .catch(() => {
        // Server action threw — section renders empty state
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
            Community showcases
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 16,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: 'var(--color-bg-alt)',
                borderRadius: 8,
                height: 200,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
          Community showcases
        </h2>
        <Link
          href="/gallery/upload"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            color: 'var(--color-secondary)',
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          Upload yours <ArrowRight size={14} />
        </Link>
      </div>

      {/* 0 items — invite card */}
      {showcases.length === 0 && (
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            borderRadius: 8,
            border: '1px dashed var(--color-border)',
            background: 'var(--color-surface)',
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--color-text-heading)',
              margin: '0 0 8px',
            }}
          >
            Be the first to share what you&apos;ve built.
          </p>
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              margin: '0 0 16px',
            }}
          >
            Upload a showcase to share it with the team.
          </p>
          <Link
            href="/gallery/upload"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 6,
              background: 'var(--color-primary)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <Plus size={16} weight="bold" /> Upload showcase
          </Link>
        </div>
      )}

      {/* 1 item — full-width featured card */}
      {showcases.length === 1 && <ShowcaseCard showcase={showcases[0]} fullWidth />}

      {/* 2-3 items — magazine layout: first full-width, rest in 2-column */}
      {showcases.length >= 2 && showcases.length <= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ShowcaseCard showcase={showcases[0]} fullWidth />
          {showcases.slice(1).map((s) => (
            <ShowcaseCard key={s.id} showcase={s} />
          ))}
        </div>
      )}

      {/* 4+ items — standard grid */}
      {showcases.length >= 4 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
            gap: 16,
          }}
        >
          {showcases.map((s) => (
            <ShowcaseCard key={s.id} showcase={s} />
          ))}
        </div>
      )}
    </section>
  );
}

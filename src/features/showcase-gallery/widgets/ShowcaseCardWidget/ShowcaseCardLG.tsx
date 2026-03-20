'use client';

import Link from 'next/link';
import { FileHtml, FileZip, User, ArrowRight } from '@phosphor-icons/react';
import type { RenderableWidget } from '@/platform/screen-renderer/types';

interface ShowcaseCardData {
  id: string;
  title: string;
  description: string | null;
  userName: string;
  fileType: 'html' | 'zip';
  skillIds: string[];
  createdAt: string;
}

interface ShowcaseCardLGProps extends RenderableWidget {
  showcase?: ShowcaseCardData;
}

export function ShowcaseCardLG({ showcase }: ShowcaseCardLGProps) {
  if (!showcase) return null;

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
        transition: 'border-color 150ms, box-shadow 150ms',
      }}
    >
      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 4,
            background: showcase.fileType === 'html' ? 'var(--color-primary-muted)' : 'var(--color-secondary-muted, var(--color-primary-muted))',
            color: showcase.fileType === 'html' ? 'var(--color-primary)' : 'var(--color-secondary)',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <Icon size={14} weight="bold" />
          {typeLabel}
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 6px' }}>
        {showcase.title}
      </h3>

      {/* Description */}
      {showcase.description && (
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-muted)',
            margin: '0 0 12px',
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
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
          paddingTop: 12,
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
          <User size={14} />
          <span>{showcase.userName}</span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span>{date}</span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-secondary)', fontWeight: 500 }}>
          View <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

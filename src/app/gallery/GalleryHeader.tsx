'use client';

import Link from 'next/link';
import { UploadSimple } from '@phosphor-icons/react';

export function GalleryHeader() {
  return (
    <div style={{ padding: '0 0 24px' }}>
      {/* Title row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              margin: '0 0 4px',
            }}
          >
            Showcase Gallery
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Projects built with AI Centre skills
          </p>
        </div>
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
            flexShrink: 0,
          }}
        >
          <UploadSimple size={16} weight="bold" />
          Share your project &rarr;
        </Link>
      </div>
    </div>
  );
}

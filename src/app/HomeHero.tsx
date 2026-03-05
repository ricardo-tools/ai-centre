'use client';

import Link from 'next/link';
import { useLocale } from '@/screen-renderer/LocaleContext';

export function HomeHero() {
  const { t } = useLocale();

  return (
    <div style={{ maxWidth: 800 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
        {t('home.title')}
      </h1>
      <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
        {t('home.subtitle')}
      </p>

      <div style={{ display: 'flex', gap: 16, marginBottom: 48 }}>
        <Link
          href="/skills"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            borderRadius: 6,
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {t('home.browseSkills')}
        </Link>
        <Link
          href="/generate"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '10px 20px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {t('home.generateProject')}
        </Link>
      </div>
    </div>
  );
}

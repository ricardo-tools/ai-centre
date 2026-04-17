'use client';

import Link from 'next/link';
import { Books } from '@phosphor-icons/react';

export function HomeHero() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: 48,
        paddingBottom: 32,
        background: 'var(--color-bg)',
      }}
    >
      {/* Theme-aware logo: colour on light/legacy, white on dark/night */}
      <div style={{ marginBottom: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/rectangle-color.png"
          alt="ezyCollect by Sidetrade"
          className="logo-color"
          style={{ height: 24 }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logos/rectangle-white.png"
          alt="ezyCollect by Sidetrade"
          className="logo-white"
          style={{ height: 24 }}
        />
      </div>

      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: 'var(--color-text-heading)',
          margin: '0 0 8px',
          lineHeight: 1.3,
        }}
      >
        AI skills for every team
      </h1>
      <p
        style={{
          fontSize: 15,
          color: 'var(--color-text-body)',
          maxWidth: 480,
          margin: '0 0 24px',
          lineHeight: 1.6,
        }}
      >
        Browse the skill library, add Flow to Claude Code, and start building.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/skills"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            borderRadius: 6,
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <Books size={18} />
          Browse skills
        </Link>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Rocket, Books } from '@phosphor-icons/react';

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
      {/* Theme-aware logo */}
      <div style={{ marginBottom: 24 }}>
        <Image
          src="/logos/rectangle-color.png"
          alt="AI Centre"
          width={180}
          height={40}
          style={{ height: 40, width: 'auto' }}
          priority
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
        Compose a toolkit. Generate a project. Open it in VS Code with Claude Code and start building.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/generate"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            borderRadius: 6,
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <Rocket size={18} />
          Build a project
        </Link>
        <Link
          href="/skills"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <Books size={18} />
          Browse skills
        </Link>
      </div>
    </div>
  );
}

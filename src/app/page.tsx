import Link from 'next/link';
import { HomeHero } from './HomeHero';
import { HomeToolkits } from './HomeToolkits';
import { HomeStats } from './HomeStats';
import { HomeSkillSpotlights } from './HomeSkillSpotlights';
import { HomeShowcases } from './HomeShowcases';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <HomeHero />
      <HomeToolkits />
      <HomeStats />
      <HomeSkillSpotlights />
      <HomeShowcases />

      {/* CTA footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          background: 'var(--color-primary-muted)',
          borderRadius: 8,
        }}
      >
        <p
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: 'var(--color-text-heading)',
            margin: '0 0 16px',
          }}
        >
          Built something with AI skills? Share it with the team.
        </p>
        <Link
          href="/gallery/upload"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'transparent',
            border: '1px solid var(--color-primary)',
            color: 'var(--color-primary)',
            borderRadius: 6,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Upload showcase
        </Link>
      </div>
    </div>
  );
}

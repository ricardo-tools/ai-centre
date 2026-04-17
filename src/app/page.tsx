import Link from 'next/link';
import { HomeHero } from './HomeHero';
import { HomeStats } from './HomeStats';
import { HomeSkillSpotlights } from './HomeSkillSpotlights';
import { HomeShowcases } from './HomeShowcases';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      <HomeHero />

      {/* Flow CTA */}
      <section
        data-testid="flow-cta"
        style={{
          padding: '48px 24px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: '0 0 8px',
          }}
        >
          Get Started with Flow
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-muted)',
            margin: '0 0 24px',
          }}
        >
          The AI skill library for every team.
        </p>
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {[
            { step: '1', text: 'Add the Flow skill to Claude Code' },
            { step: '2', text: 'Run /flow login' },
            { step: '3', text: 'Run /flow bootstrap' },
          ].map((item) => (
            <li
              key={item.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                fontSize: 14,
                color: 'var(--color-text)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-primary-muted)',
                  color: 'var(--color-primary)',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.step}
              </span>
              <span style={{ fontFamily: 'monospace' }}>{item.text}</span>
            </li>
          ))}
        </ol>
        <Link
          href="/skills"
          data-testid="browse-skills-link"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: 6,
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          Browse Skills
        </Link>
      </section>

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

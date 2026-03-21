import Link from 'next/link';
import { getAllSkills, TYPE_LABELS, DOMAIN_LABELS } from '@/platform/lib/skills';

const FEATURED_SLUGS = ['brand-design-system', 'clean-architecture', 'creative-toolkit', 'presentation'];

export function HomeSkillSpotlights() {
  const allSkills = getAllSkills();
  const featuredSkills = FEATURED_SLUGS.map(
    (slug) => allSkills.find((s) => s.slug === slug)!,
  ).filter(Boolean);

  return (
    <section>
      <h2
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          margin: '0 0 16px',
        }}
      >
        Featured skills
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))',
          gap: 16,
        }}
      >
        {featuredSkills.map((skill) => (
          <Link
            key={skill.slug}
            href={`/skills/${skill.slug}`}
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
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text-heading)',
                marginBottom: 4,
              }}
            >
              {skill.title}
            </span>
            {skill.isOfficial && (
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>
                By Official
              </span>
            )}
            <p
              style={{
                fontSize: 13,
                color: 'var(--color-text-muted)',
                lineHeight: 1.5,
                margin: '0 0 16px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const,
                overflow: 'hidden',
              }}
            >
              {skill.description}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  padding: '2px 6px',
                  borderRadius: 3,
                  background: 'var(--color-primary-muted)',
                  color: 'var(--color-primary)',
                }}
              >
                {TYPE_LABELS[skill.tags.type]}
              </span>
              {skill.tags.domain.slice(0, 2).map((d) => (
                <span
                  key={d}
                  style={{
                    fontSize: 10,
                    fontWeight: 500,
                    padding: '2px 6px',
                    borderRadius: 3,
                    background: 'var(--color-bg-alt)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {DOMAIN_LABELS[d]}
                </span>
              ))}
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 13,
                color: 'var(--color-text-body)',
                fontWeight: 500,
                marginTop: 'auto',
              }}
            >
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

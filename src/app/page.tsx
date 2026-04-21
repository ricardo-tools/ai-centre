import Link from 'next/link';
import {
  Terminal,
  Check,
  ArrowRight,
  EnvelopeSimple,
  LockSimple,
  Database,
  CloudArrowUp,
  Code,
  Shuffle,
  ListChecks,
  Pencil,
} from '@phosphor-icons/react/dist/ssr';
import { getAllSkills, DOMAIN_LABELS } from '@/platform/lib/skills';
import { fetchAllShowcases, type RawShowcaseUpload } from '@/features/showcase-gallery/action';

// ── Shared styles ──────────────────────────────────────────────────

const MAX_WIDTH = 1080;

const sectionStyle: React.CSSProperties = {
  maxWidth: MAX_WIDTH,
  margin: '0 auto',
  padding: '0 24px',
};

const sectionGap: React.CSSProperties = {
  paddingTop: 64,
  paddingBottom: 64,
};

const cardBase: React.CSSProperties = {
  padding: 24,
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
};

const terminalCard: React.CSSProperties = {
  background: '#1a1b2e',
  borderRadius: 8,
  padding: '16px 20px',
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: 14,
  color: '#a0a4b8',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
};

const primaryButton: React.CSSProperties = {
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
  border: 'none',
};

const ghostButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 24px',
  borderRadius: 6,
  background: 'transparent',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-body)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
};

const pillBase: React.CSSProperties = {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
};

const sectionHeading: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  color: 'var(--color-text-heading)',
  margin: '0 0 8px',
};

const sectionSubtext: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--color-text-muted)',
  margin: '0 0 32px',
  lineHeight: 1.6,
};

// ── Data ───────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    num: '01',
    title: 'Describe',
    subtitle: 'What are you building?',
    example: '"A dashboard with auth and charts"',
  },
  {
    num: '02',
    title: 'Flow sets up',
    subtitle: 'Skills matched to your project. Templates copied. Infrastructure configured.',
    checks: ['auth-otp', 'db-turso-drizzle', 'creative-toolkit'],
  },
  {
    num: '03',
    title: 'Work',
    subtitle: 'Flow follows the process — strict or freeform, depending on the work. You review. You approve. You ship.',
  },
];

const PROCESS_MODES = [
  {
    title: 'Strict',
    steps: 'TEST \u2192 BUILD \u2192 EVAL \u2192 RUN \u2192 AUDIT \u2192 LOG',
    desc: 'Code, security, infrastructure',
    icon: ListChecks,
  },
  {
    title: 'Standard',
    steps: 'PLAN \u2192 BUILD \u2192 VERIFY',
    desc: 'Features, integrations',
    icon: Code,
  },
  {
    title: 'Creative',
    steps: 'DRAFT \u2192 REVIEW \u2192 REFINE \u2192 DELIVER',
    desc: 'Copy, design, campaigns',
    icon: Pencil,
  },
  {
    title: 'Free',
    steps: 'No gates',
    desc: 'Just ask and go',
    icon: Shuffle,
  },
];

const FEATURED_SKILL_SLUGS = ['flow-tdd', 'brand-design-system', 'presentation'];

const CATEGORY_PILLS = ['All', 'Engineering', 'Design', 'Marketing', 'Presentations'];

const TEMPLATES = [
  { title: 'Email', detail: 'Mailpit / Mailgun', Icon: EnvelopeSimple },
  { title: 'Auth', detail: 'OTP / JWT', Icon: LockSimple },
  { title: 'Database', detail: 'Turso / Drizzle', Icon: Database },
  { title: 'Storage', detail: 'Vercel Blob / local', Icon: CloudArrowUp },
];

const ACTIVITY_FEED = [
  { person: 'Ricardo', action: 'published', thing: 'Q4 Investor Deck', time: '2h ago' },
  { person: 'Sarah', action: 'added skill', thing: 'brand-design-system', time: '5h ago' },
  { person: 'Tom', action: 'deployed', thing: 'Customer Portal v2', time: '1d ago' },
  { person: 'Mia', action: 'updated', thing: 'flow-tdd', time: '2d ago' },
  { person: 'James', action: 'uploaded', thing: 'Sales Enablement Kit', time: '3d ago' },
];

// ── Page ───────────────────────────────────────────────────────────

export default async function HomePage() {
  const allSkills = getAllSkills();
  const skillCount = allSkills.length;
  const featuredSkills = FEATURED_SKILL_SLUGS.map(
    (slug) => allSkills.find((s) => s.slug === slug)!,
  ).filter(Boolean);

  let showcases: RawShowcaseUpload[] = [];
  try {
    const result = await fetchAllShowcases();
    if (result.ok) {
      showcases = result.value
        .filter((s) => s.visibility === 'public')
        .slice(0, 3);
    }
  } catch {
    // Section renders empty if fetch fails
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ── 1. Hero ──────────────────────────────────────────────── */}
      <section style={{ ...sectionGap, paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ ...sectionStyle, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: 'var(--color-text-heading)',
              margin: '0 0 16px',
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            Flow
          </h1>
          <p
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: 'var(--color-text-body)',
              margin: '0 0 8px',
            }}
          >
            A skill library and workflow system for AI.
          </p>
          <p
            style={{
              fontSize: 14,
              color: 'var(--color-text-muted)',
              margin: '0 auto 32px',
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            Skills teach it how to work. Templates give you a head start.
            The process adapts to the job.
          </p>

          {/* Terminal card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={terminalCard}>
              <Terminal size={16} color="#a0a4b8" />
              <span style={{ color: '#6b6f85' }}>{'>'}</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>/flow bootstrap</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/skills" style={primaryButton}>
              Get Started
            </Link>
            <Link href="/skills" style={ghostButton}>
              Browse Skills <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. How It Works ──────────────────────────────────────── */}
      <section style={{ ...sectionGap, background: 'var(--color-bg-alt)' }}>
        <div style={sectionStyle}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: 24,
            }}
          >
            {HOW_IT_WORKS.map((item) => (
              <div key={item.num} style={cardBase}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  {item.num}
                </span>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--color-text-heading)',
                    margin: '0 0 8px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {item.subtitle}
                </p>
                {item.example && (
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--color-text-body)',
                      fontStyle: 'italic',
                      margin: '12px 0 0',
                    }}
                  >
                    {item.example}
                  </p>
                )}
                {item.checks && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
                    {item.checks.map((c) => (
                      <div
                        key={c}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          color: 'var(--color-success)',
                        }}
                      >
                        <Check size={14} weight="bold" />
                        <span style={{ fontFamily: 'monospace', color: 'var(--color-text-body)' }}>{c}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Process ───────────────────────────────────────────── */}
      <section style={sectionGap}>
        <div style={sectionStyle}>
          <h2 style={sectionHeading}>Choose how structured you want it.</h2>
          <p style={sectionSubtext}>
            Every project is different. Pick a methodology or let Flow decide.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
              gap: 16,
            }}
          >
            {PROCESS_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <div key={mode.title} style={cardBase}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Icon size={20} color="var(--color-primary)" />
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'var(--color-text-heading)',
                      }}
                    >
                      {mode.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      fontFamily: 'monospace',
                      color: 'var(--color-text-body)',
                      margin: '0 0 8px',
                      lineHeight: 1.5,
                    }}
                  >
                    {mode.steps}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
                    {mode.desc}
                  </p>
                </div>
              );
            })}
          </div>
          <p
            style={{
              fontSize: 13,
              color: 'var(--color-text-muted)',
              marginTop: 16,
              fontStyle: 'italic',
            }}
          >
            Or build your own process. Coming soon.
          </p>
        </div>
      </section>

      {/* ── 4. Skills ────────────────────────────────────────────── */}
      <section style={{ ...sectionGap, background: 'var(--color-bg-alt)' }}>
        <div style={sectionStyle}>
          <h2 style={sectionHeading}>{skillCount}+ skills across every department.</h2>
          <p style={sectionSubtext}>
            Engineering, design, marketing, presentations, and more.
          </p>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {CATEGORY_PILLS.map((cat, i) => (
              <span
                key={cat}
                style={{
                  ...pillBase,
                  background: i === 0 ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: i === 0 ? '#FFFFFF' : 'var(--color-text-body)',
                  border: i === 0 ? 'none' : '1px solid var(--color-border)',
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Featured skill cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: 16,
              marginBottom: 24,
            }}
          >
            {featuredSkills.map((skill) => (
              <Link
                key={skill.slug}
                href={`/skills/${skill.slug}`}
                className="card-hover"
                style={{
                  ...cardBase,
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    margin: '0 0 6px',
                  }}
                >
                  {skill.title}
                </h3>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
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
                  <span style={{ fontSize: 13, color: 'var(--color-secondary)', fontWeight: 500 }}>
                    View <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/skills"
            style={{
              fontSize: 14,
              color: 'var(--color-secondary)',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            Browse all skills <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── 5. Templates ─────────────────────────────────────────── */}
      <section style={sectionGap}>
        <div style={sectionStyle}>
          <h2 style={sectionHeading}>Pre-built infrastructure.</h2>
          <p style={sectionSubtext}>
            Say what you need, get working code.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
              gap: 16,
              marginBottom: 16,
            }}
          >
            {TEMPLATES.map((t) => {
              const Icon = t.Icon;
              return (
                <div key={t.title} style={{ ...cardBase, textAlign: 'center', padding: '32px 24px' }}>
                  <Icon size={28} color="var(--color-primary)" style={{ marginBottom: 12 }} />
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--color-text-heading)',
                      margin: '0 0 4px',
                    }}
                  >
                    {t.title}
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>
                    {t.detail}
                  </p>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
            Included automatically when your project needs them.
          </p>
        </div>
      </section>

      {/* ── 6. Built with Flow ───────────────────────────────────── */}
      <section style={{ ...sectionGap, background: 'var(--color-bg-alt)' }}>
        <div style={sectionStyle}>
          <h2 style={sectionHeading}>Built with Flow</h2>
          <p style={sectionSubtext}>
            Projects shipped using the skill library.
          </p>

          {showcases.length === 0 ? (
            <div
              style={{
                padding: 48,
                textAlign: 'center',
                borderRadius: 8,
                border: '1px dashed var(--color-border)',
                background: 'var(--color-surface)',
                marginBottom: 24,
              }}
            >
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
                No showcases yet. Be the first to share what you have built.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
                gap: 16,
                marginBottom: 24,
              }}
            >
              {showcases.map((s) => (
                <Link
                  key={s.id}
                  href={`/gallery/${s.id}`}
                  className="card-hover"
                  style={{
                    ...cardBase,
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Thumbnail placeholder */}
                  <div
                    style={{
                      width: '100%',
                      height: 140,
                      borderRadius: 6,
                      background: s.thumbnailUrl
                        ? `url(${s.thumbnailUrl}) center/cover no-repeat`
                        : 'var(--color-bg-alt)',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {!s.thumbnailUrl && 'Preview'}
                  </div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--color-text-heading)',
                      margin: '0 0 6px',
                    }}
                  >
                    {s.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {s.userName}
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--color-secondary)', fontWeight: 500 }}>
                      View <ArrowRight size={14} style={{ verticalAlign: 'middle' }} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/gallery"
            style={{
              fontSize: 14,
              color: 'var(--color-secondary)',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            See all showcases <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── 7. Activity Feed ─────────────────────────────────────── */}
      <section style={sectionGap}>
        <div style={sectionStyle}>
          <h2 style={sectionHeading}>Recent activity</h2>
          <p style={sectionSubtext}>What the team has been working on.</p>
          <div
            style={{
              ...cardBase,
              padding: 0,
              overflow: 'hidden',
            }}
          >
            {ACTIVITY_FEED.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 24px',
                  borderBottom: i < ACTIVITY_FEED.length - 1 ? '1px solid var(--color-border)' : 'none',
                  fontSize: 13,
                }}
              >
                {/* Dot indicator */}
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--color-success)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  {item.person}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {item.action}
                </span>
                <span style={{ fontWeight: 500, color: 'var(--color-text-body)' }}>
                  {item.thing}
                </span>
                <span style={{ marginLeft: 'auto', color: 'var(--color-text-muted)', fontSize: 12, flexShrink: 0 }}>
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Final CTA ─────────────────────────────────────────── */}
      <section style={{ ...sectionGap, background: 'var(--color-bg-alt)' }}>
        <div style={{ ...sectionStyle, textAlign: 'center' }}>
          {/* Terminal card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={terminalCard}>
              <Terminal size={16} color="#a0a4b8" />
              <span style={{ color: '#6b6f85' }}>{'>'}</span>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>/flow bootstrap</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/skills" style={{ ...primaryButton, padding: '10px 20px', fontSize: 13 }}>
              Get Started
            </Link>
            <Link
              href="/skills"
              style={{
                fontSize: 14,
                color: 'var(--color-secondary)',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Browse Skills <ArrowRight size={14} />
            </Link>
            <Link
              href="/gallery"
              style={{
                fontSize: 14,
                color: 'var(--color-secondary)',
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Showcases <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

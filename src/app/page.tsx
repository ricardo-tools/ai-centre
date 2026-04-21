import Link from 'next/link';
import {
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

const cardBase: React.CSSProperties = {
  padding: 28,
  borderRadius: 12,
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
};

const terminalCard: React.CSSProperties = {
  background: 'var(--color-bg-alt)',
  borderRadius: 10,
  padding: '14px 24px',
  fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
  fontSize: 14,
  color: 'var(--color-text-muted)',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  border: '1px solid var(--color-border)',
};

const primaryButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '14px 28px',
  borderRadius: 8,
  background: 'var(--color-primary)',
  color: '#FFFFFF',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  border: 'none',
  transition: 'opacity 200ms ease',
};

const ghostButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '14px 28px',
  borderRadius: 8,
  background: 'transparent',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-body)',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  transition: 'border-color 200ms ease',
};

const pillBase: React.CSSProperties = {
  display: 'inline-block',
  padding: '6px 14px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
};

const sectionHeading: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 700,
  color: 'var(--color-text-heading)',
  margin: '0 0 8px',
  letterSpacing: '-0.01em',
};

const sectionSubtext: React.CSSProperties = {
  fontSize: 15,
  color: 'var(--color-text-muted)',
  margin: '0 0 40px',
  lineHeight: 1.6,
};

// Dark section text overrides (for midnight blue backgrounds)
const darkSectionHeading: React.CSSProperties = {
  ...sectionHeading,
  color: 'var(--color-section-alt-heading)',
};

const darkSectionSubtext: React.CSSProperties = {
  ...sectionSubtext,
  color: 'var(--color-section-alt-muted)',
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
    accent: 'var(--color-comp-violet-muted)',
    iconColor: 'var(--color-comp-violet)',
  },
  {
    title: 'Standard',
    steps: 'PLAN \u2192 BUILD \u2192 VERIFY',
    desc: 'Features, integrations',
    icon: Code,
    accent: 'var(--color-comp-sky-muted)',
    iconColor: 'var(--color-comp-sky)',
  },
  {
    title: 'Creative',
    steps: 'DRAFT \u2192 REVIEW \u2192 REFINE \u2192 DELIVER',
    desc: 'Copy, design, campaigns',
    icon: Pencil,
    accent: 'var(--color-primary-muted)',
    iconColor: 'var(--color-primary)',
  },
  {
    title: 'Free',
    steps: 'No gates',
    desc: 'Just ask and go',
    icon: Shuffle,
    accent: 'var(--color-comp-teal-muted)',
    iconColor: 'var(--color-comp-teal)',
  },
];

const FEATURED_SKILL_SLUGS = ['flow-tdd', 'brand-design-system', 'presentation'];

const CATEGORY_PILLS = ['All', 'Engineering', 'Design', 'Marketing', 'Presentations'];

const TEMPLATES = [
  { title: 'Email', detail: 'Mailpit / Mailgun', Icon: EnvelopeSimple, color: 'var(--color-comp-violet)', mutedBg: 'var(--color-comp-violet-muted)' },
  { title: 'Auth', detail: 'OTP / JWT', Icon: LockSimple, color: 'var(--color-primary)', mutedBg: 'var(--color-primary-muted)' },
  { title: 'Database', detail: 'Turso / Drizzle', Icon: Database, color: 'var(--color-comp-teal)', mutedBg: 'var(--color-comp-teal-muted)' },
  { title: 'Storage', detail: 'Vercel Blob / local', Icon: CloudArrowUp, color: 'var(--color-comp-sky)', mutedBg: 'var(--color-comp-sky-muted)' },
];

// Activity feed removed — will be implemented with real data later

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
      <section
        style={{
          paddingTop: 120,
          paddingBottom: 100,
          position: 'relative',
          overflow: 'hidden',
          background: 'var(--color-section-alt)',
        }}
      >
        {/* Gradient orbs — decorative background */}
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-15%',
            width: '50vw',
            height: '50vw',
            borderRadius: '50%',
            background: 'var(--color-primary-muted)',
            opacity: 0.35,
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30%',
            left: '-15%',
            width: '45vw',
            height: '45vw',
            borderRadius: '50%',
            background: 'var(--color-comp-sky-muted)',
            opacity: 0.25,
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ ...sectionStyle, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: 'var(--color-section-alt-heading)',
              margin: '0 0 20px',
              letterSpacing: -2,
              lineHeight: 1.0,
            }}
          >
            Flow
          </h1>
          <p
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: 'var(--color-section-alt-body)',
              margin: '0 0 12px',
            }}
          >
            A skill library and workflow system for AI.
          </p>
          <p
            style={{
              fontSize: 15,
              color: 'var(--color-section-alt-muted)',
              margin: '0 auto 40px',
              maxWidth: 520,
              lineHeight: 1.7,
            }}
          >
            Skills teach it how to work. Templates give you a head start.
            The process adapts to the job.
          </p>

          {/* Terminal card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
            <div style={terminalCard}>
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
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={sectionStyle}>
          <h2 style={sectionHeading}>How it works</h2>
          <p style={sectionSubtext}>
            Three steps from idea to working project.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: 24,
            }}
          >
            {HOW_IT_WORKS.map((item) => (
              <div key={item.num} style={cardBase}>
                {/* Step number with muted circle */}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--color-primary-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                    }}
                  >
                    {item.num}
                  </span>
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--color-text-heading)',
                    margin: '0 0 8px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
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
                      margin: '16px 0 0',
                    }}
                  >
                    {item.example}
                  </p>
                )}
                {item.checks && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                    {item.checks.map((c) => (
                      <div
                        key={c}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: 12,
                          color: 'var(--color-success)',
                        }}
                      >
                        <Check size={14} weight="bold" />
                        <span style={{ fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace", fontSize: 12, color: 'var(--color-text-body)' }}>{c}</span>
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
      <section style={{ paddingTop: 80, paddingBottom: 80, background: 'var(--color-section-alt)' }}>
        <div style={sectionStyle}>
          <h2 style={darkSectionHeading}>Choose how structured you want it.</h2>
          <p style={darkSectionSubtext}>
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
                <div
                  key={mode.title}
                  style={{
                    ...cardBase,
                    borderLeft: `3px solid ${mode.accent}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: mode.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} color={mode.iconColor} />
                    </div>
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
                      fontSize: 11,
                      fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace",
                      color: 'var(--color-text-muted)',
                      margin: '0 0 10px',
                      lineHeight: 1.6,
                      letterSpacing: '0.02em',
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
              color: 'var(--color-section-alt-muted)',
              marginTop: 20,
              fontStyle: 'italic',
            }}
          >
            Or build your own process. Coming soon.
          </p>
        </div>
      </section>

      {/* ── 4. Skills ────────────────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={sectionStyle}>
          <h2 style={sectionHeading}>{skillCount}+ skills across every department.</h2>
          <p style={sectionSubtext}>
            Engineering, design, marketing, presentations, and more.
          </p>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {CATEGORY_PILLS.map((cat, i) => (
              <span
                key={cat}
                style={{
                  ...pillBase,
                  background: i === 0 ? 'var(--color-primary)' : 'transparent',
                  color: i === 0 ? '#FFFFFF' : 'var(--color-text-muted)',
                  border: i === 0 ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
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
              marginBottom: 32,
            }}
          >
            {featuredSkills.map((skill) => {
              const domainColor =
                skill.tags.domain[0] === 'engineering'
                  ? 'var(--color-comp-sky)'
                  : skill.tags.domain[0] === 'design'
                    ? 'var(--color-comp-violet)'
                    : skill.tags.domain[0] === 'marketing'
                      ? 'var(--color-comp-teal)'
                      : 'var(--color-primary)';

              return (
                <Link
                  key={skill.slug}
                  href={`/skills/${skill.slug}`}
                  className="card-hover"
                  style={{
                    ...cardBase,
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    borderTop: `2px solid ${domainColor}`,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--color-text-heading)',
                      margin: '0 0 8px',
                    }}
                  >
                    {skill.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.6,
                      margin: '0 0 20px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}
                  >
                    {skill.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {skill.tags.domain.slice(0, 2).map((d) => (
                        <span
                          key={d}
                          style={{
                            fontSize: 10,
                            fontWeight: 500,
                            padding: '3px 8px',
                            borderRadius: 4,
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
              );
            })}
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
              gap: 6,
            }}
          >
            Browse all skills <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── 5. Templates ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 80, background: 'var(--color-section-alt)' }}>
        <div style={sectionStyle}>
          <h2 style={darkSectionHeading}>Pre-built infrastructure.</h2>
          <p style={darkSectionSubtext}>
            Say what you need, get working code.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
              gap: 16,
              marginBottom: 20,
            }}
          >
            {TEMPLATES.map((t) => {
              const Icon = t.Icon;
              return (
                <div key={t.title} style={{ ...cardBase, textAlign: 'center', padding: '36px 24px' }}>
                  {/* Icon with muted background circle */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: t.mutedBg,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Icon size={28} color={t.color} />
                  </div>
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
          <p style={{ fontSize: 13, color: 'var(--color-section-alt-muted)', fontStyle: 'italic' }}>
            Included automatically when your project needs them.
          </p>
        </div>
      </section>

      {/* ── 6. Built with Flow ───────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={sectionStyle}>
          <h2 style={sectionHeading}>Built with Flow</h2>
          <p style={sectionSubtext}>
            Projects shipped using the skill library.
          </p>

          {showcases.length === 0 ? (
            <div
              style={{
                padding: 56,
                textAlign: 'center',
                borderRadius: 12,
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
                marginBottom: 32,
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
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '100%',
                      height: 160,
                      borderRadius: 8,
                      background: s.thumbnailUrl
                        ? `url(${s.thumbnailUrl}) center/cover no-repeat`
                        : 'var(--color-surface-hover)',
                      marginBottom: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: 'var(--color-text-muted)',
                      transition: 'transform 200ms ease',
                    }}
                  >
                    {!s.thumbnailUrl && 'Preview'}
                  </div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: 'var(--color-text-heading)',
                      margin: '0 0 8px',
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
              gap: 6,
            }}
          >
            See all showcases <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Activity feed placeholder — will be implemented with real data */}

      {/* ── 8. Final CTA ─────────────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 100, background: 'var(--color-section-alt)' }}>
        <div style={{ ...sectionStyle, textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--color-section-alt-heading)',
              margin: '0 0 12px',
              letterSpacing: '-0.01em',
            }}
          >
            Start building with Flow
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'var(--color-section-alt-muted)',
              margin: '0 0 40px',
              lineHeight: 1.6,
            }}
          >
            One command. Full project setup. Curated skills.
          </p>

          {/* Terminal card */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
            <div style={terminalCard}>
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>/flow bootstrap</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link href="/skills" style={{ ...primaryButton, padding: '12px 24px', fontSize: 14 }}>
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
                gap: 6,
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
                gap: 6,
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

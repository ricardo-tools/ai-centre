import Link from 'next/link';
import { getAllSkills, DOMAIN_LABELS } from '@/platform/lib/skills';
import { fetchAllShowcases, type RawShowcaseUpload } from '@/features/showcase-gallery/action';

// ── Constants ──────────────────────────────────────────────────────
const MAX_W = 1120;
const SECTION_PY = 96;
const MONO = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace";

const FEATURED_SKILL_SLUGS = ['flow-tdd', 'brand-design-system', 'presentation'];
const CATEGORY_PILLS = ['All', 'Engineering', 'Design', 'Marketing', 'Presentations'];

const PROCESS_MODES = [
  {
    type: 'strict',
    label: 'Strict',
    steps: ['TEST', 'BUILD', 'EVAL', 'RUN', 'AUDIT', 'LOG'],
    domain: 'Code, security, infrastructure',
  },
  {
    type: 'standard',
    label: 'Standard',
    steps: ['PLAN', 'BUILD', 'VERIFY'],
    domain: 'Features, integrations',
  },
  {
    type: 'creative',
    label: 'Creative',
    steps: ['DRAFT', 'REVIEW', 'REFINE', 'DELIVER'],
    domain: 'Copy, design, campaigns',
  },
  {
    type: 'free',
    label: 'Free',
    steps: [],
    domain: 'Just ask and go',
    noGates: true,
  },
];

const TEMPLATES = [
  { emoji: '📧', name: 'Email', stack: 'Mailpit / Mailgun' },
  { emoji: '🔐', name: 'Auth', stack: 'OTP / JWT' },
  { emoji: '🗄', name: 'Database', stack: 'Turso / Drizzle' },
  { emoji: '📦', name: 'Storage', stack: 'Vercel Blob / local' },
];

// ── Skill tag colour helpers ───────────────────────────────────────
function skillTagStyle(domain: string): React.CSSProperties {
  const map: Record<string, { bg: string; color: string }> = {
    engineering: { bg: 'rgba(59,130,246,0.12)', color: '#3B82F6' },
    design: { bg: 'rgba(168,85,247,0.12)', color: '#A855F7' },
    marketing: { bg: 'rgba(249,115,22,0.12)', color: '#F97316' },
    presentations: { bg: 'rgba(16,185,129,0.12)', color: '#10B981' },
  };
  const t = map[domain] ?? { bg: 'rgba(255,90,40,0.12)', color: '#FF5A28' };
  return {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 9px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 16,
    letterSpacing: '0.03em',
    background: t.bg,
    color: t.color,
  };
}

// ── Page ───────────────────────────────────────────────────────────
export default async function HomePage() {
  const allSkills = getAllSkills();
  const skillCount = allSkills.length;
  const featuredSkills = FEATURED_SKILL_SLUGS
    .map((slug) => allSkills.find((s) => s.slug === slug)!)
    .filter(Boolean);

  let showcases: RawShowcaseUpload[] = [];
  try {
    const result = await fetchAllShowcases();
    if (result.ok) {
      showcases = result.value.filter((s) => s.visibility === 'public').slice(0, 3);
    }
  } catch {
    // Section renders empty if fetch fails
  }

  const container: React.CSSProperties = {
    maxWidth: MAX_W,
    margin: '0 auto',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', fontFamily: "'Jost', system-ui, sans-serif" }}>

      {/* ── Blink animation ──────────────────────────────────────── */}
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .t-cursor {
          display: inline-block;
          width: 2px;
          height: 14px;
          background: #FF5A28;
          border-radius: 1px;
          vertical-align: middle;
          animation: blink 1.1s step-end infinite;
        }
      `}</style>

      {/* ── 1. Hero ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: `${SECTION_PY}px 24px`,
          background: 'var(--color-bg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle gradient glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,90,40,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 40% 40% at 80% 80%, rgba(18,25,72,0.05) 0%, transparent 60%)',
          ].join(', '),
          pointerEvents: 'none',
        }} />

        <div style={{ ...container, textAlign: 'center', position: 'relative' }}>

          {/* Command pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            background: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
            borderRadius: 999,
            fontFamily: MONO,
            fontSize: 13,
            color: 'var(--color-primary)',
            marginBottom: 32,
          }}>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 11 }}>$</span>
            {' '}/flow bootstrap
          </div>

          {/* Big title */}
          <h1 style={{
            fontSize: 'clamp(56px, 10vw, 100px)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            color: 'var(--color-text-heading)',
            marginBottom: 24,
          }}>
            Flow
          </h1>

          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            fontWeight: 400,
            color: 'var(--color-text-muted)',
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}>
            A skill library and workflow system for AI.
          </p>

          <p style={{
            fontSize: 16,
            color: 'var(--color-text-muted)',
            maxWidth: 460,
            margin: '0 auto 40px',
            lineHeight: 1.65,
          }}>
            Skills teach it how to work. Templates give you a head start.
            The process adapts to the job.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/skills" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '11px 22px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(255,90,40,0.25)',
            }}>
              Get Started
            </Link>
            <Link href="/skills" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '11px 22px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              background: 'transparent',
              color: 'var(--color-text-heading)',
              border: '1px solid var(--color-border)',
            }}>
              Browse Skills →
            </Link>
          </div>

          {/* Terminal mockup — always dark */}
          <div style={{
            marginTop: 64,
            background: '#0A0A0F',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.3)',
            textAlign: 'left',
            maxWidth: 680,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {/* Terminal bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#FEBC2E' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28C840' }} />
              <div style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: MONO }}>
                flow — bootstrap
              </div>
            </div>
            {/* Terminal body */}
            <div style={{ padding: 24, fontFamily: MONO, fontSize: 13, lineHeight: 1.8 }}>
              <span style={{ display: 'block' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>$ </span>
                <span style={{ color: '#FF5A28' }}>/flow bootstrap</span>
              </span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.5)' }}>────────────────────────────────</span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>What are you building?</span>
              <span style={{ display: 'block' }}>
                <span style={{ color: '#7DD3FC' }}>&gt;</span>
                <span style={{ color: '#86EFAC' }}> A dashboard with auth and charts</span>
              </span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.5)' }}>&nbsp;</span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>Matching skills...</span>
              <span style={{ display: 'block' }}>
                <span style={{ color: '#34D399' }}>✓ </span>
                <span style={{ color: '#7DD3FC' }}>flow-tdd</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>       testing discipline</span>
              </span>
              <span style={{ display: 'block' }}>
                <span style={{ color: '#34D399' }}>✓ </span>
                <span style={{ color: '#7DD3FC' }}>auth-otp</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>       email OTP + JWT</span>
              </span>
              <span style={{ display: 'block' }}>
                <span style={{ color: '#34D399' }}>✓ </span>
                <span style={{ color: '#7DD3FC' }}>db-turso-drizzle</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}> edge database</span>
              </span>
              <span style={{ display: 'block' }}>
                <span style={{ color: '#34D399' }}>✓ </span>
                <span style={{ color: '#7DD3FC' }}>creative-toolkit</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}> Nivo charts</span>
              </span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.5)' }}>&nbsp;</span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>
                Process: <span style={{ color: '#34D399' }}>Strict</span>{'  '}TEST→BUILD→EVAL→RUN→AUDIT→LOG
              </span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.5)' }}>&nbsp;</span>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.85)' }}>
                Ready. <span className="t-cursor" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ height: 1, background: 'var(--color-border)', border: 'none', margin: 0 }} />

      {/* ── 2. How It Works ──────────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY}px 24px`, background: 'var(--color-bg-alt)' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              marginBottom: 16,
            }}>
              <span style={{ display: 'block', width: 16, height: 1.5, background: 'var(--color-primary)', borderRadius: 2 }} />
              How it works
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-heading)',
              lineHeight: 1.15,
              marginBottom: 12,
            }}>
              Three steps.<br />Done building, not tinkering.
            </h2>
          </div>

          {/* Steps grid — 3 cols joined */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 2 }}>
            {/* Step 1 */}
            <div style={{
              background: 'var(--color-surface)',
              padding: '36px 32px',
              borderRadius: '16px 0 0 16px',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 20, fontFamily: MONO }}>01</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-heading)', marginBottom: 10 }}>Describe</div>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: 24 }}>What are you building?</p>
              <div style={{
                background: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                borderRadius: 10,
                padding: '12px 14px',
                fontSize: 13,
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
              }}>
                &quot;A dashboard with auth and charts&quot;
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ background: 'var(--color-surface)', padding: '36px 32px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 20, fontFamily: MONO }}>02</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-heading)', marginBottom: 10 }}>Flow sets up</div>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
                Skills matched to your project. Templates copied. Infrastructure configured.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['auth-otp', 'db-turso-drizzle', 'creative-toolkit'].map((item) => (
                  <div key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 12px',
                    background: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 7,
                    fontFamily: MONO,
                    fontSize: 12,
                    color: 'var(--color-text-body)',
                  }}>
                    <div style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'rgba(52,211,153,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: 9,
                      color: '#34D399',
                    }}>✓</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              background: 'var(--color-surface)',
              padding: '36px 32px',
              borderRadius: '0 16px 16px 0',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: 20, fontFamily: MONO }}>03</div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--color-text-heading)', marginBottom: 10 }}>Work</div>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: 24 }}>
                Flow follows the process — strict or freeform, depending on the work. You review. You approve. You ship.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['TEST', 'BUILD', 'EVAL', 'RUN', 'AUDIT', 'LOG'].map((token) => (
                  <span key={token} style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontFamily: MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    background: 'rgba(255,90,40,0.12)',
                    color: 'var(--color-primary)',
                    border: '1px solid rgba(255,90,40,0.2)',
                  }}>{token}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr style={{ height: 1, background: 'var(--color-border)', border: 'none', margin: 0 }} />

      {/* ── 3. Process ───────────────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY}px 24px`, background: 'var(--color-bg)' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              marginBottom: 16,
            }}>
              <span style={{ display: 'block', width: 16, height: 1.5, background: 'var(--color-primary)', borderRadius: 2 }} />
              Process
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-heading)',
              lineHeight: 1.15,
              marginBottom: 12,
            }}>
              The right process<br />for the right work.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 480, margin: '0 auto' }}>
              Flow matches methodology to context — not the other way around.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 16,
          }}>
            {PROCESS_MODES.map((mode) => (
              <div key={mode.type} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 16,
                padding: 28,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* No colored top border as per rules */}
                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 14,
                  color: 'var(--color-text-muted)',
                }}>
                  {mode.label}
                </div>
                {mode.noGates ? (
                  <div style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: 'var(--color-text-muted)',
                    letterSpacing: '-0.02em',
                    marginBottom: 12,
                  }}>
                    No gates
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {mode.steps.map((step) => (
                      <span key={step} style={{
                        padding: '3px 9px',
                        borderRadius: 5,
                        fontFamily: MONO,
                        fontSize: 11,
                        fontWeight: 600,
                        background: 'var(--color-bg-alt)',
                        color: 'var(--color-text-body)',
                        border: '1px solid var(--color-border)',
                      }}>{step}</span>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  {mode.domain}
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--color-text-muted)' }}>
            <strong style={{ color: 'var(--color-text-body)' }}>Or build your own process.</strong> Coming soon.
          </p>
        </div>
      </section>

      <hr style={{ height: 1, background: 'var(--color-border)', border: 'none', margin: 0 }} />

      {/* ── 4. Skills ────────────────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY}px 24px`, background: 'var(--color-bg-alt)' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              marginBottom: 16,
            }}>
              <span style={{ display: 'block', width: 16, height: 1.5, background: 'var(--color-primary)', borderRadius: 2 }} />
              Skill Library
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: 'rgba(255,90,40,0.12)',
              border: '1px solid rgba(255,90,40,0.2)',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-primary)',
              marginBottom: 12,
            }}>
              {skillCount}+ skills
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-heading)',
              lineHeight: 1.15,
              marginBottom: 12,
            }}>
              {skillCount}+ skills across every department.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 480, margin: '0 auto' }}>
              Portable, composable, and ready to drop into any project.
            </p>
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
            {CATEGORY_PILLS.map((cat, i) => (
              <span key={cat} style={{
                padding: '7px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid var(--color-border)',
                background: i === 0 ? 'var(--color-text-heading)' : 'transparent',
                color: i === 0 ? '#fff' : 'var(--color-text-muted)',
                cursor: 'default',
              }}>
                {cat}
              </span>
            ))}
          </div>

          {/* Featured skill cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 16,
          }}>
            {featuredSkills.map((skill) => {
              const domain = skill.tags.domain[0] ?? 'engineering';
              return (
                <Link key={skill.slug} href={`/skills/${skill.slug}`} style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 16,
                  padding: 24,
                  textDecoration: 'none',
                  display: 'block',
                }}>
                  <div style={skillTagStyle(domain)}>
                    {DOMAIN_LABELS[domain] ?? domain}
                  </div>
                  <div style={{
                    fontFamily: MONO,
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    marginBottom: 8,
                  }}>
                    {skill.slug}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.55, margin: 0 }}>
                    {skill.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <hr style={{ height: 1, background: 'var(--color-border)', border: 'none', margin: 0 }} />

      {/* ── 5. Templates — always dark ───────────────────────────── */}
      <section style={{
        padding: `${SECTION_PY}px 24px`,
        background: '#0A0A0F',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: [
            'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(255,90,40,0.07) 0%, transparent 60%)',
            'radial-gradient(ellipse 50% 60% at 100% 50%, rgba(100,100,255,0.05) 0%, transparent 60%)',
          ].join(', '),
          pointerEvents: 'none',
        }} />

        <div style={{ ...container, position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#FF5A28',
              marginBottom: 16,
            }}>
              <span style={{ display: 'block', width: 16, height: 1.5, background: '#FF5A28', borderRadius: 2 }} />
              Templates
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: 12,
            }}>
              Pre-built infrastructure.<br />Say what you need, get working code.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto' }}>
              Infrastructure templates wired in automatically when your project needs them.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
            gap: 12,
          }}>
            {TEMPLATES.map((t) => (
              <div key={t.name} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: 24,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'rgba(255,90,40,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  fontSize: 18,
                }}>
                  {t.emoji}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>
                  {t.name}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                  {t.stack}
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            Included automatically when your project needs them.
          </p>
        </div>
      </section>

      <hr style={{ height: 1, background: 'var(--color-border)', border: 'none', margin: 0 }} />

      {/* ── 6. Showcases ─────────────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY}px 24px`, background: 'var(--color-bg)' }}>
        <div style={container}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              marginBottom: 16,
            }}>
              <span style={{ display: 'block', width: 16, height: 1.5, background: 'var(--color-primary)', borderRadius: 2 }} />
              Showcases
            </div>
            <h2 style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--color-text-heading)',
              lineHeight: 1.15,
              marginBottom: 12,
            }}>
              Built with Flow.
            </h2>
            <p style={{ fontSize: 16, color: 'var(--color-text-muted)', maxWidth: 480, margin: '0 auto' }}>
              Real projects, shipped faster.
            </p>
          </div>

          {showcases.length === 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: 16,
            }}>
              {[
                { title: 'Analytics Dashboard', meta: 'flow-tdd · db-turso-drizzle · creative-toolkit' },
                { title: 'Marketing Site', meta: 'brand-design-system · presentation · flow-research' },
                { title: 'Internal Tool', meta: 'auth-otp · flow-tdd · flow-observability' },
              ].map((item) => (
                <div key={item.title} style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    aspectRatio: '16 / 10',
                    background: 'var(--color-bg-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Grid pattern */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
                      backgroundSize: '32px 32px',
                    }} />
                    <span style={{
                      position: 'relative',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-muted)',
                    }}>Coming Soon</span>
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {item.meta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
              gap: 16,
            }}>
              {showcases.map((s) => (
                <Link key={s.id} href={`/gallery/${s.id}`} style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  display: 'block',
                }}>
                  <div style={{
                    aspectRatio: '16 / 10',
                    background: s.thumbnailUrl
                      ? `url(${s.thumbnailUrl}) center/cover no-repeat`
                      : 'var(--color-bg-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                  }}>
                    {!s.thumbnailUrl && 'Preview'}
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {s.userName}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <hr style={{ height: 1, background: 'var(--color-border)', border: 'none', margin: 0 }} />

      {/* ── 7. Final CTA ─────────────────────────────────────────── */}
      <section style={{ padding: `${SECTION_PY}px 24px`, background: 'var(--color-bg-alt)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {/* CTA command */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 999,
            fontFamily: MONO,
            fontSize: 16,
            color: 'var(--color-primary)',
            marginBottom: 40,
            userSelect: 'all',
          }}>
            <span style={{ color: 'var(--color-text-muted)' }}>$</span> /flow bootstrap
          </div>

          <h2 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-heading)',
            marginBottom: 16,
            lineHeight: 1.1,
          }}>
            Start your next project<br />the right way.
          </h2>

          <p style={{ fontSize: 16, color: 'var(--color-text-muted)', marginBottom: 40 }}>
            Pick your skills. Set your process. Ship.
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/skills" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '11px 22px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              background: 'var(--color-primary)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(255,90,40,0.25)',
            }}>
              Get Started
            </Link>
            <Link href="/skills" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '11px 22px',
              borderRadius: 999,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              background: 'transparent',
              color: 'var(--color-text-heading)',
              border: '1px solid var(--color-border)',
            }}>
              Browse Skills →
            </Link>
          </div>

          {/* Footer links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            <Link href="/skills" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Browse Skills
            </Link>
            <Link href="/gallery" style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-muted)', textDecoration: 'none' }}>
              Showcases
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';

/* ── Embedded Presentation ── */
function EmbeddedPresentation({ src, title }: { src: string; title: string }) {
  const [isFs, setIsFs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const toggleFs = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    a.click();
  };

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: isFs ? 0 : 8,
        border: isFs ? 'none' : '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        height: isFs ? '100vh' : 540,
      }}
    >
      {/* Iframe */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          src={src}
          title={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
        />
      </div>

      {/* Controls bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 40,
        padding: '0 12px',
        gap: 8,
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        flexShrink: 0,
      }}>
        <span style={{
          flex: 1,
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: 0.3,
        }}>
          {title}
        </span>
        <button
          onClick={download}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Download HTML
        </button>
        <button
          onClick={toggleFs}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isFs ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
}

/* ── Section Wrapper ── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

/* ── Main Showcase ── */
export function PresentationShowcase() {
  return (
    <div>
      <Section title="Coffee & Health — Research Briefing">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          What / So What / Now What framework. Warm art direction with unique compositions per slide — hero numbers, split layouts, dose-response bars, numbered action cards. 7 slides.
        </p>
        <EmbeddedPresentation
          src="/showcases/coffee-health.html"
          title="Coffee and Your Health"
        />
      </Section>

      <Section title="Slack Recap — Product Launch">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Problem-Agitation-Solution framework. Tech-product visual language — morning timeline, raw agitation numbers, three-step flow, before/after comparison, testimonial. 9 slides.
        </p>
        <EmbeddedPresentation
          src="/showcases/slack-recap.html"
          title="Introducing Slack Recap"
        />
      </Section>

      <Section title="Features">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Standalone HTML', desc: 'Each presentation is a self-contained HTML file with its own CSS, JS, and visual identity' },
            { label: 'Navigation', desc: 'Keyboard, click zones, touch swipe, and footer controls — all built in' },
            { label: 'PPTX Export', desc: 'One-click PowerPoint export via PptxGenJS with themed layouts' },
            { label: 'Light + Night', desc: 'Full dual-theme support with theme toggle in the footer bar' },
            { label: 'Fullscreen', desc: 'Native fullscreen presentation mode via F key or footer button' },
            { label: 'Unique Per Slide', desc: 'No rigid template — each slide has its own visual composition and layout' },
          ].map((f) => (
            <div key={f.label} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>{f.label}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- 5-Phase Planning Process ---- */}
      <Section title="5-Phase Planning Process">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>80% strategy, 20% production. Code is the last step, not the first.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { phase: '1', name: 'Audience & Purpose', desc: 'Who is the audience? What should they think, feel, or do differently? What is at stake?', accent: '#FF5A28' },
            { phase: '2', name: 'Core Message & Narrative', desc: 'Distill the Big Idea in one sentence. Choose a messaging framework. Build the ghost deck.', accent: '#B88A30' },
            { phase: '3', name: 'Art Direction', desc: 'Mood, accent color native to the topic, background textures, visual metaphor system.', accent: '#2E9089' },
            { phase: '4', name: 'Slide-by-Slide Blueprint', desc: 'Purpose, governing thought, focal point, composition, visual weight, copy, transition role.', accent: '#1462D2' },
            { phase: '5', name: 'Execution', desc: 'Only now write code. Apply the plan, design system, narrative, and audience understanding.', accent: '#1F2B7A' },
          ].map((p) => (
            <div key={p.phase} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 32, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', flexShrink: 0 }}>{p.phase}</div>
              <div style={{ flex: 1, padding: '10px 16px', borderRadius: 6, background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{p.name}</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '2px 0 0' }}>{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Messaging Frameworks ---- */}
      <Section title="Messaging Frameworks">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Choose the framework that fits the context. The structure shapes how the audience receives the message.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { name: 'Contrast Pattern (Duarte)', best: 'Keynotes, vision', structure: '"What is" vs "what could be" — building tension to a climactic call to action' },
            { name: 'Situation-Complication-Resolution (Minto)', best: 'Board decks, exec briefs', structure: 'Agreed facts → what changed → recommendation. Lead with the answer.' },
            { name: 'Problem-Agitation-Solution', best: 'Sales, fundraising', structure: 'Name the problem → make it worse → present relief' },
            { name: 'What / So What / Now What', best: 'Data presentations', structure: 'Present facts → interpret why they matter → recommend action' },
            { name: 'Monroe\'s Motivated Sequence', best: 'Proposals, change mgmt', structure: 'Attention → Need → Satisfaction → Visualization → Action' },
            { name: 'Before-After-Bridge', best: 'Product launches', structure: 'World today → world with this → how we get there' },
          ].map((fw) => (
            <div key={fw.name} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{fw.name}</span>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', fontWeight: 600, display: 'block', marginTop: 2 }}>{fw.best}</span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '6px 0 0', lineHeight: 1.4 }}>{fw.structure}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Copy Craft ---- */}
      <Section title="Copy Craft">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Headlines */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Headlines Are Assertions, Not Labels</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: 10, borderRadius: 6, border: '2px solid var(--color-danger)', background: 'var(--color-surface)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-danger)' }}>BAD</span>
                <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: '2px 0 0' }}>{'"Customer Satisfaction Results"'}</p>
              </div>
              <div style={{ padding: 10, borderRadius: 6, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-success)' }}>GOOD</span>
                <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: '2px 0 0' }}>{'"Customer satisfaction dropped 15% after the redesign, driven by checkout friction"'}</p>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--color-text-muted)' }}>
              <strong>Tests:</strong> The {'"so what?"'} test · The ghost deck test · The specificity test
            </div>
          </div>
          {/* Rules */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Writing Rules</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { rule: 'Billboard Test', desc: 'Readable in 3 seconds at 65mph. One idea per slide.' },
                { rule: 'Specificity', desc: '"12% to 31% in 18 months" not "significant growth"' },
                { rule: 'Emotion Before Logic', desc: 'Story → data → action. Customer story before NPS data.' },
                { rule: 'Tight Bullets', desc: 'Max 3-4 per slide, each under 12 words. Min 18px body, 32px+ headlines.' },
              ].map((r) => (
                <div key={r.rule} style={{ paddingLeft: 10, borderLeft: '2px solid var(--color-secondary)' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{r.rule}</span>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Visual Composition ---- */}
      <Section title="Visual Composition Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>No rigid slide types. Each slide is a unique composition. Mix, combine, and invent.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { name: 'Hero Number', when: 'Single metric headline' },
            { name: 'Split', when: 'Text + visual' },
            { name: 'Before/After', when: 'Contrast or transformation' },
            { name: 'Timeline', when: 'Sequential events' },
            { name: 'Horizontal Bars', when: 'Comparing quantities' },
            { name: 'Numbered Cards', when: 'Ordered steps' },
            { name: 'Icon Rows', when: 'Categorized benefits' },
            { name: 'Three-Step Flow', when: 'Simple process' },
            { name: 'Left-Bar Quote', when: 'Testimonial' },
            { name: 'Centered Quote', when: 'High-impact statement' },
            { name: 'Asymmetric Title', when: 'Bold opening' },
            { name: 'Full-Accent Divider', when: 'Section break' },
          ].map((p) => (
            <div key={p.name} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{p.name}</span>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{p.when}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { rule: 'One Focal Point', desc: 'Every slide has ONE thing the eye sees first. Hierarchy: size → color → position → isolation → weight → motion.' },
            { rule: 'Negative Space', desc: 'Title slides: 60-70% empty. Content: 30-40%. Quote: 50-60%. Breathing: 80%+. Fills every inch = anxiety.' },
            { rule: 'Pacing Through Contrast', desc: 'Dense → light → dense. Analytical → personal. After every 3-4 dense slides, include a breathing moment.' },
          ].map((r) => (
            <div key={r.rule} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{r.rule}</span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Design Toolkit ---- */}
      <Section title="Design Toolkit">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Visual building blocks that combine differently for each slide.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Left: Layered Backgrounds + Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Layered Backgrounds</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { layer: '1. Base', detail: 'Radial or linear gradient' },
                  { layer: '2. Grid', detail: 'Thin lines at 2-3% opacity, 60px spacing' },
                  { layer: '3. Glow Orbs', detail: 'blur(120px), 6-15% opacity, accent-colored' },
                ].map((l) => (
                  <div key={l.layer} style={{ fontSize: 12, color: 'var(--color-text-body)', paddingLeft: 10, borderLeft: '2px solid var(--color-border)' }}>
                    <strong>{l.layer}</strong> — {l.detail}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Glassmorphism Cards</p>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8 }}>
                <div>border-radius: 12–16px</div>
                <div>Subtle border (8% opacity dark, 7% light)</div>
                <div>Hover: accent border, translateY(-4px), deeper shadow</div>
                <div>Optional accent top-line (::before gradient)</div>
              </div>
            </div>
          </div>
          {/* Right: Typography Chain + Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kicker → Title → Subtitle</p>
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-bg-alt)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--color-primary)', marginBottom: 4 }}>KICKER TEXT</div>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: 'var(--color-text-heading)', marginBottom: 4 }}>The Main Headline Goes Here</div>
                <div style={{ fontSize: 14, fontWeight: 300, color: 'var(--color-text-muted)' }}>Supporting subtitle with additional context and detail</div>
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stats as Large Numbers</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { val: '42%', label: 'INCREASE' },
                  { val: '$2.3M', label: 'SAVED' },
                  { val: '14', label: 'STEPS CUT' },
                ].map((s) => (
                  <div key={s.label} style={{ flex: 1, padding: 12, borderRadius: 8, background: 'var(--color-bg-alt)', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>{s.val}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>Never use donut charts for simple percentages. Large bold numbers are cleaner.</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Staggered Reveals:</strong> Content appears with cascading 0.1s delays. translateY(24px) → 0.</p>
          </div>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Check Lists:</strong> Bullet items as cards with accent check icons, not plain text lists.</p>
          </div>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Breathing Slides:</strong> Section dividers with full accent bg, emoji + large text. Reset attention.</p>
          </div>
        </div>
      </Section>

      {/* ---- Navigation & Footer ---- */}
      <Section title="Navigation & Footer Bar">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Keyboard & Touch Navigation</span>
            </div>
            {[
              { input: 'Arrow R/D, Space', action: 'Next slide' },
              { input: 'Arrow L/U', action: 'Previous slide' },
              { input: 'Home / End', action: 'First / last slide' },
              { input: 'F', action: 'Toggle fullscreen' },
              { input: 'Escape', action: 'Exit fullscreen' },
              { input: '1-9', action: 'Jump to slide' },
              { input: 'Click right 85%', action: 'Next slide' },
              { input: 'Click left 15%', action: 'Previous slide' },
              { input: 'Swipe L/R', action: 'Next / previous (touch)' },
            ].map((row, i) => (
              <div key={row.input} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 16px', borderBottom: i < 8 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
                <code style={{ fontSize: 12, color: 'var(--color-secondary)', fontFamily: 'monospace' }}>{row.input}</code>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.action}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Footer bar mockup */}
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Glassmorphism Footer Bar</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-body)', flexShrink: 0 }}>Title</span>
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--color-border)', overflow: 'hidden' }}>
                  <div style={{ width: '25%', height: '100%', borderRadius: 2, background: 'var(--color-primary)' }} />
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>⤓</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>☀</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>⛶</span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>← 3/12 →</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>backdrop-filter: blur(20px). Round 40px nav buttons. 3px progress bar with accent fill.</p>
            </div>
            {/* PPTX rules */}
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PPTX Export Rules</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  'NEVER use # in hex colors (FF5A28 not #FF5A28)',
                  'NEVER encode opacity in hex — use transparency prop',
                  'NEVER reuse option objects — PptxGenJS mutates in place',
                  'Fresh new PptxGenJS() per export',
                  'Use bullet: true, not Unicode bullet characters',
                  'LAYOUT_16x9, Calibri font, ROUNDED_RECTANGLE cards',
                ].map((rule, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--color-text-body)', paddingLeft: 10, borderLeft: `2px solid ${i < 3 ? 'var(--color-danger)' : 'var(--color-border)'}` }}>{rule}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

'use client';

import { CodeBlock } from '@/platform/components/CodeBlock';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function PresentationHtmlImplementationShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Use <strong>presentation</strong> for narrative planning and slide strategy.
          Apply <strong>brand-design-system</strong> for color tokens and typography.
          See <strong>pptx-export</strong> for PPTX API rules and validation.
        </p>
      </div>

      {/* ---- Single-File HTML Structure ---- */}
      <Section title="Single-File HTML Structure">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Zero external dependencies beyond Google Fonts and PptxGenJS CDN. The file works when opened locally — no server needed.
        </p>

        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>File Anatomy</span>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { tag: '<!DOCTYPE html>', desc: 'Standard HTML5', color: 'var(--color-text-muted)', height: 24 },
                { tag: '<html data-theme="light">', desc: 'Light theme default', color: 'var(--color-primary)', height: 24 },
                { tag: '<head>', desc: '', color: 'var(--color-text-muted)', height: 16 },
                { tag: '  Google Fonts (Jost)', desc: 'External font link', color: 'var(--color-secondary)', height: 28 },
                { tag: '  PptxGenJS CDN', desc: 'Export dependency', color: 'var(--color-secondary)', height: 28 },
                { tag: '  <style>', desc: 'Theme tokens + slide CSS + nav + animations', color: 'var(--color-primary)', height: 48 },
                { tag: '</head>', desc: '', color: 'var(--color-text-muted)', height: 16 },
                { tag: '<body>', desc: '', color: 'var(--color-text-muted)', height: 16 },
                { tag: '  <div class="deck">', desc: 'Slide container', color: 'var(--color-primary)', height: 28 },
                { tag: '    .slide (x N)', desc: 'Each slide: layered bg + grid + glow + content', color: 'var(--color-primary)', height: 48 },
                { tag: '  </div>', desc: '', color: 'var(--color-text-muted)', height: 16 },
                { tag: '  <nav class="nav-bar">', desc: 'Glassmorphism footer bar', color: 'var(--color-primary)', height: 28 },
                { tag: '  <script>', desc: 'Navigation + themes + PPTX export + touch handlers', color: 'var(--color-primary)', height: 48 },
                { tag: '</body>', desc: '', color: 'var(--color-text-muted)', height: 16 },
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, height: line.height, paddingLeft: line.tag.startsWith('  ') ? 16 : 0 }}>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: line.color, minWidth: 200, whiteSpace: 'nowrap' }}>{line.tag}</code>
                  {line.desc && <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{line.desc}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Key rule:</strong> Every slide gets its own CSS namespace (<code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>.s0-wrap</code>,
            <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>.s3-bars</code>,
            <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>.s5-cards</code>).
            No generic <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>.content-slide</code> class.
          </p>
        </div>
      </Section>

      {/* ---- Slide Transitions ---- */}
      <Section title="Slide Transition Types">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Slides use CSS transitions with cubic-bezier easing. The active slide fades in and translates up from 30px below.
        </p>

        <style>{`
          @keyframes phSlideInactive { 0%,100% { opacity: 0.3; transform: translateY(12px) scale(0.96); } }
          @keyframes phSlideActive { 0% { opacity: 0.3; transform: translateY(12px) scale(0.96); } 40%,100% { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes phReveal1 { 0%,50% { opacity: 0; transform: translateY(16px); } 60%,100% { opacity: 1; transform: translateY(0); } }
          @keyframes phReveal2 { 0%,60% { opacity: 0; transform: translateY(16px); } 70%,100% { opacity: 1; transform: translateY(0); } }
          @keyframes phReveal3 { 0%,70% { opacity: 0; transform: translateY(16px); } 80%,100% { opacity: 1; transform: translateY(0); } }
        `}</style>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {/* Inactive */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ width: '100%', height: 100, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, animation: 'phSlideInactive 3s ease infinite' }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-muted)' }}>Slide 2</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Inactive</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>opacity: 0, translateY(30px)</p>
          </div>

          {/* Active */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ width: '100%', height: 100, borderRadius: 6, background: 'var(--color-bg-alt)', border: '2px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, animation: 'phSlideActive 3s ease infinite' }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)' }}>Slide 3</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Active</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>opacity: 1, translateY(0)</p>
          </div>

          {/* Staggered reveals */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
              <div style={{ height: 28, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.8, animation: 'phReveal1 4s ease infinite' }} />
              <div style={{ height: 28, borderRadius: 4, background: 'var(--color-secondary)', opacity: 0.8, animation: 'phReveal2 4s ease infinite' }} />
              <div style={{ height: 28, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.6, animation: 'phReveal3 4s ease infinite' }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Staggered Reveal</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>.d1 (0.1s), .d2 (0.2s), .d3 (0.3s)</p>
          </div>
        </div>

        <CodeBlock language="css" title="Slide transition CSS">{`.slide {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide.active {
  opacity: 1;
  transform: translateY(0);
}
.active .reveal.d1 { transition-delay: 0.1s; }
.active .reveal.d2 { transition-delay: 0.2s; }
.active .reveal.d3 { transition-delay: 0.3s; }`}</CodeBlock>
      </Section>

      {/* ---- Footer Bar Anatomy ---- */}
      <Section title="Footer Bar Anatomy (Glassmorphism)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          The navigation bar uses backdrop-filter blur for a glass effect. Fixed to the bottom, it contains title, progress bar, and controls.
        </p>

        {/* Visual footer bar mockup */}
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-border)', marginBottom: 20 }}>
          {/* Slide preview background */}
          <div style={{ height: 160, background: 'linear-gradient(135deg, var(--color-bg-alt), var(--color-surface))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)', opacity: 0.3 }}>Slide Content Area</span>
          </div>

          {/* Footer bar */}
          <div style={{
            padding: '10px 20px',
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Left: Title + logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: '#fff' }}>AI</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Presentation Title</span>
            </div>

            {/* Center: Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--color-border)', overflow: 'hidden' }}>
                <div style={{ width: '25%', height: '100%', borderRadius: 2, background: 'var(--color-primary)', transition: 'width 0.3s ease' }} />
              </div>
            </div>

            {/* Right: Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
              {[
                { label: 'PPTX', icon: '↓' },
                { label: 'Theme', icon: '☀' },
                { label: 'Full', icon: '⛶' },
              ].map((ctrl) => (
                <div key={ctrl.label} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)', cursor: 'pointer' }}>
                  <span style={{ fontSize: 14 }}>{ctrl.icon}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)' }}>
                  <span style={{ fontSize: 12 }}>←</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', minWidth: 36, textAlign: 'center' }}>3/12</span>
                <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)' }}>
                  <span style={{ fontSize: 12 }}>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Backdrop Blur', value: 'blur(20px)', desc: 'With -webkit prefix for Safari' },
            { label: 'Button Size', value: '40px round', desc: 'Hover turns accent color' },
            { label: 'Progress Bar', value: '3px track', desc: 'Accent fill, smooth transition' },
          ].map((spec) => (
            <div key={spec.label} style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>{spec.label}</span>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace', margin: '4px 0' }}>{spec.value}</div>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{spec.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Glassmorphism Cards ---- */}
      <Section title="Glassmorphism Demo">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Containers for stats, bullets, and info blocks. Subtle borders, hover effects, optional accent top-line.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {/* Basic card */}
          <div style={{ padding: 24, borderRadius: 14, background: 'var(--color-surface)', border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))' }} />
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 4 }}>$2.4M</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Total Collected</div>
          </div>

          {/* Stat card */}
          <div style={{ padding: 24, borderRadius: 14, background: 'var(--color-surface)', border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--color-secondary)' }} />
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-secondary)', marginBottom: 4 }}>42</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Days DSO</div>
          </div>

          {/* Icon stat card */}
          <div style={{ padding: 24, borderRadius: 14, background: 'var(--color-surface)', border: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--color-primary), transparent)' }} />
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 16, color: '#fff' }}>%</span>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 4 }}>94%</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Recovery Rate</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: 12 }}>Card CSS specs</span>
          <CodeBlock language="css" title="Glassmorphism card CSS">{`/* Glassmorphism card */
.glass-card {
  border-radius: 12-16px;
  border: 1px solid rgba(0,0,0,0.08);   /* dark */
  border: 1px solid rgba(255,255,255,0.07); /* light */
}

/* Hover effect */
.glass-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}

/* Accent top-line (::before) */
.glass-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), transparent);
}`}</CodeBlock>
        </div>
      </Section>

      {/* ---- Responsive Slide Sizing ---- */}
      <Section title="Responsive Slide Sizing">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Slides use viewport-relative sizing with clamp() for fluid typography and responsive layouts.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          {[
            { label: 'Mobile', width: '100%', aspect: '16:9', font: '32px', desc: '< 640px viewport' },
            { label: 'Tablet', width: '100%', aspect: '16:9', font: '40px', desc: '640-1024px viewport' },
            { label: 'Desktop', width: '100%', aspect: '16:9', font: '48px', desc: '> 1024px viewport' },
          ].map((size) => (
            <div key={size.label} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-surface)' }}>
              <div style={{ padding: '8px 12px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>{size.label}</span>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 8 }}>{size.desc}</span>
              </div>
              <div style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ aspectRatio: '16/9', background: 'var(--color-bg-alt)', borderRadius: 4, border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>Title</span>
                  <span style={{ fontSize: 8, color: 'var(--color-text-muted)' }}>{size.font}</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{size.aspect} aspect ratio</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: 12 }}>Kicker-Title-Subtitle chain</span>
        </div>

        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--color-primary)', marginBottom: 8 }}>
            GROWTH STRATEGY
          </div>
          <div style={{ fontSize: 'clamp(32px, 3.5vw, 48px)', fontWeight: 800, color: 'var(--color-text-heading)', letterSpacing: -0.5, marginBottom: 8, lineHeight: 1.1 }}>
            Accelerate Cash Flow
          </div>
          <div style={{ fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 300, color: 'var(--color-text-muted)', maxWidth: 600 }}>
            AI-powered collections that get you paid 3x faster with zero manual effort
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { element: 'Kicker', size: '11-13px', weight: '600', extra: 'uppercase, letter-spacing 3px, accent' },
            { element: 'Title', size: 'clamp(32px, 3.5vw, 48px)', weight: '700-800', extra: 'letter-spacing -0.5px' },
            { element: 'Subtitle', size: 'clamp(16px, 1.8vw, 22px)', weight: '300', extra: 'muted color, max-width 600px' },
          ].map((el) => (
            <div key={el.element} style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>{el.element}</span>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-primary)', margin: '4px 0' }}>{el.size}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>weight: {el.weight}</div>
              <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{el.extra}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Design Toolkit Palette ---- */}
      <Section title="Design Toolkit Palette">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Three visual layers for depth: base gradient, grid pattern, and glow orbs.
        </p>

        {/* Layered backgrounds demo */}
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Layered Background — 3 Depth Layers</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
            {/* Layer 1: Base gradient */}
            <div style={{ padding: 20, textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
              <div style={{
                width: '100%', height: 100, borderRadius: 6,
                background: 'linear-gradient(135deg, var(--color-bg-alt) 0%, var(--color-surface) 100%)',
                marginBottom: 8,
              }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Layer 1: Base</span>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>Radial or linear gradient</p>
            </div>

            {/* Layer 2: Grid */}
            <div style={{ padding: 20, textAlign: 'center', borderRight: '1px solid var(--color-border)' }}>
              <div style={{
                width: '100%', height: 100, borderRadius: 6,
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 59px, var(--color-border) 59px, var(--color-border) 60px), repeating-linear-gradient(90deg, transparent, transparent 59px, var(--color-border) 59px, var(--color-border) 60px)`,
                backgroundSize: '60px 60px',
                opacity: 0.3,
                marginBottom: 8,
              }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Layer 2: Grid</span>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>2-3% opacity, 60px spacing</p>
            </div>

            {/* Layer 3: Glow orbs */}
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{
                width: '100%', height: 100, borderRadius: 6, position: 'relative',
                background: 'var(--color-surface)', overflow: 'hidden',
                marginBottom: 8,
              }}>
                <div style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'var(--color-primary)', filter: 'blur(30px)', opacity: 0.12, top: 10, left: 10 }} />
                <div style={{ position: 'absolute', width: 60, height: 60, borderRadius: '50%', background: 'var(--color-secondary)', filter: 'blur(25px)', opacity: 0.1, bottom: 5, right: 10 }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Layer 3: Glow Orbs</span>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>blur(120px), 6-15% opacity</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Navigation Map ---- */}
      <Section title="Navigation — Keyboard, Mouse, and Touch">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Keyboard */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Keyboard Shortcuts</span>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { keys: '→ ↓ Space', action: 'Next slide' },
                { keys: '← ↑', action: 'Previous slide' },
                { keys: 'Home / End', action: 'First / last slide' },
                { keys: 'F', action: 'Toggle fullscreen' },
                { keys: 'Escape', action: 'Exit fullscreen' },
                { keys: '1-9', action: 'Jump to slide N' },
              ].map((shortcut) => (
                <div key={shortcut.keys} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {shortcut.keys.split(' ').map((k) => (
                      <kbd key={k} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', fontFamily: 'monospace', color: 'var(--color-text-heading)' }}>{k}</kbd>
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{shortcut.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mouse + Touch */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Mouse + Touch</span>
            </div>
            <div style={{ padding: 12 }}>
              {/* Click zone diagram */}
              <div style={{ display: 'flex', height: 80, borderRadius: 6, overflow: 'hidden', marginBottom: 12, border: '1px solid var(--color-border)' }}>
                <div style={{ width: '15%', background: 'var(--color-secondary)', opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px dashed var(--color-border)' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)' }}>← 15%</span>
                </div>
                <div style={{ width: '85%', background: 'var(--color-primary)', opacity: 0.1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)' }}>85% →</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>Click left 15% = previous slide</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>Click right 85% = next slide</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>Swipe left/right = navigate (touch)</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>URL hash #slide-N persists position</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Theming ---- */}
      <Section title="Theming — Light and Night">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Light theme is always default. Footer toggle switches between light and night. All CSS uses semantic tokens.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Light preview */}
          <div style={{ borderRadius: 8, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: '#f8f8fa', borderBottom: '1px solid #e0e0e0' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a2e' }}>Light (default)</span>
            </div>
            <div style={{ padding: 20, background: '#ffffff' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#FF5A28', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>KICKER</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Presentation Title</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>Subtitle text here</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <div style={{ padding: '4px 12px', borderRadius: 4, background: '#FF5A28', color: '#fff', fontSize: 10, fontWeight: 600 }}>Primary</div>
                <div style={{ padding: '4px 12px', borderRadius: 4, background: '#1462D2', color: '#fff', fontSize: 10, fontWeight: 600 }}>Secondary</div>
              </div>
            </div>
          </div>

          {/* Night preview */}
          <div style={{ borderRadius: 8, border: '1px solid #2a2a3e', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: '#1a1a2e', borderBottom: '1px solid #2a2a3e' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#e5e5f0' }}>Night</span>
            </div>
            <div style={{ padding: 20, background: '#121228' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#FF7A50', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>KICKER</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#e5e5f0', marginBottom: 4 }}>Presentation Title</div>
              <div style={{ fontSize: 12, color: '#8888aa' }}>Subtitle text here</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <div style={{ padding: '4px 12px', borderRadius: 4, background: '#FF7A50', color: '#fff', fontSize: 10, fontWeight: 600 }}>Primary</div>
                <div style={{ padding: '4px 12px', borderRadius: 4, background: '#4488EE', color: '#fff', fontSize: 10, fontWeight: 600 }}>Secondary</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Banned Patterns ---- */}
      <Section title="Banned Patterns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { banned: 'Generic shared layout classes (.content-slide)', fix: 'Each slide gets its own CSS namespace' },
            { banned: 'Dark theme as default', fix: 'Light theme is always default' },
            { banned: 'External CSS/JS dependencies', fix: 'Single standalone file (Fonts + PptxGenJS only)' },
            { banned: 'Missing keyboard navigation', fix: 'Full arrow/space/home/end/escape/F support' },
            { banned: 'Missing touch navigation', fix: 'Swipe left/right support' },
            { banned: 'Missing theme toggle', fix: 'Footer must have light <-> night switch' },
            { banned: 'PPTX export without validation', fix: 'Pass pptx-export checklist before delivering' },
            { banned: 'Hardcoded colours', fix: 'All CSS uses var(--color-*) or theme-derived values' },
            { banned: 'Missing URL hash persistence', fix: '#slide-N must survive reload' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '10px 12px', borderRadius: 6, background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, color: 'var(--color-danger, #FF3B30)', fontWeight: 700 }}>x</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>{row.banned}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)' }}>{row.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

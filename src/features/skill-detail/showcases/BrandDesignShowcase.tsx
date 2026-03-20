'use client';

import { Sun, MonitorPlay, Moon, ClockCounterClockwise, ArrowRight, Bell, Gear, MagnifyingGlass, Heart, Star, ChatCircle, Lightning } from '@phosphor-icons/react';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const Swatch = ({ color, name, hex }: { color: string; name: string; hex: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ width: '100%', height: 64, borderRadius: 8, background: color, border: '1px solid var(--color-border)' }} />
    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{name}</span>
    <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{hex}</span>
  </div>
);

const SemanticToken = ({ token, label }: { token: string; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ width: 32, height: 32, borderRadius: 6, background: `var(${token})`, border: '1px solid var(--color-border)', flexShrink: 0 }} />
    <div>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)', display: 'block' }}>{label}</span>
      <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{token}</code>
    </div>
  </div>
);

export function BrandDesignShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This brand design system works best alongside{' '}
          <strong>frontend-architecture</strong> (implementation patterns and component layers),{' '}
          <strong>design-foundations</strong> (spacing, hierarchy, and visual principles), and{' '}
          <strong>creative-toolkit</strong> (asset libraries, animation engines, and data visualization). Apply them together for any UI work.
        </p>
      </div>

      {/* ---- Color Palette ---- */}
      <Section title="Color Palette">
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(120px, 100%), 1fr))', gap: 16, marginBottom: 32 }}>
          <Swatch color="#FF5A28" name="Orange" hex="#FF5A28" />
          <Swatch color="#FFF2EB" name="Light Orange" hex="#FFF2EB" />
          <Swatch color="#1462D2" name="Electric Blue" hex="#1462D2" />
          <Swatch color="#1F2B7A" name="Brand Blue" hex="#1F2B7A" />
          <Swatch color="#121948" name="Midnight Blue" hex="#121948" />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Night Mode Surfaces</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(120px, 100%), 1fr))', gap: 16 }}>
          <Swatch color="#0F0F0F" name="Surface 0" hex="#0F0F0F" />
          <Swatch color="#212121" name="Surface 1" hex="#212121" />
          <Swatch color="#272727" name="Surface 2" hex="#272727" />
          <Swatch color="#3A3A3A" name="Surface 3" hex="#3A3A3A" />
          <Swatch color="#3F3F3F" name="Border" hex="#3F3F3F" />
        </div>
      </Section>

      {/* ---- Semantic Tokens Live ---- */}
      <Section title="Semantic Tokens (Live)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>These swatches reflect your current theme. Toggle Light/Night to see them change.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 16 }}>
          <SemanticToken token="--color-primary" label="Primary" />
          <SemanticToken token="--color-primary-muted" label="Primary Muted" />
          <SemanticToken token="--color-secondary" label="Secondary" />
          <SemanticToken token="--color-brand" label="Brand" />
          <SemanticToken token="--color-bg" label="Background" />
          <SemanticToken token="--color-surface" label="Surface" />
          <SemanticToken token="--color-border" label="Border" />
          <SemanticToken token="--color-text-heading" label="Text Heading" />
          <SemanticToken token="--color-text-body" label="Text Body" />
          <SemanticToken token="--color-text-muted" label="Text Muted" />
          <SemanticToken token="--color-success" label="Success" />
          <SemanticToken token="--color-warning" label="Warning" />
          <SemanticToken token="--color-danger" label="Danger" />
          <SemanticToken token="--color-topnav-bg" label="TopNav BG" />
          <SemanticToken token="--color-topnav-text" label="TopNav Text" />
          <SemanticToken token="--color-topnav-border" label="TopNav Border" />
        </div>
      </Section>

      {/* ---- Typography Specimen ---- */}
      <Section title="Typography — Jost">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          {[
            { weight: 350, label: 'Descriptions (350)' },
            { weight: 400, label: 'Regular (400)' },
            { weight: 500, label: 'Medium (500)' },
            { weight: 600, label: 'SemiBold (600)' },
            { weight: 700, label: 'Bold (700)' },
            { weight: 800, label: 'ExtraBold (800)' },
          ].map((w) => (
            <div key={w.weight} style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', width: 120, flexShrink: 0, fontFamily: 'monospace' }}>{w.label}</span>
              <span style={{ fontSize: 28, fontWeight: w.weight, color: 'var(--color-text-heading)' }}>
                The quick brown fox jumps over the lazy dog
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type Scale</p>
          {[
            { size: 32, weight: 700, label: 'Page Title', role: 'h1' },
            { size: 24, weight: 600, label: 'Section Title', role: 'h2' },
            { size: 18, weight: 600, label: 'Subsection', role: 'h3' },
            { size: 16, weight: 400, label: 'Body', role: 'p' },
            { size: 14, weight: 400, label: 'Small / UI', role: 'small' },
            { size: 12, weight: 400, label: 'Caption', role: 'caption' },
          ].map((t) => (
            <div key={t.role} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 80, fontFamily: 'monospace' }}>{t.size}px</span>
              <span style={{ fontSize: t.size, fontWeight: t.weight, color: 'var(--color-text-heading)', flex: 1 }}>{t.label}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{t.role}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Phosphor Icons ---- */}
      <Section title="Phosphor Icons">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { Icon: Heart, label: 'Heart' },
            { Icon: Star, label: 'Star' },
            { Icon: Bell, label: 'Bell' },
            { Icon: Gear, label: 'Gear' },
            { Icon: MagnifyingGlass, label: 'Search' },
            { Icon: ChatCircle, label: 'Chat' },
            { Icon: Lightning, label: 'Lightning' },
            { Icon: ArrowRight, label: 'Arrow' },
          ].map(({ Icon, label }) => (
            <div key={label} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12 }}>{label}</p>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Icon size={24} weight="thin" />
                <Icon size={24} weight="light" />
                <Icon size={24} weight="regular" />
                <Icon size={24} weight="bold" />
                <Icon size={24} weight="fill" />
                <Icon size={24} weight="duotone" />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                {['thin', 'light', 'regular', 'bold', 'fill', 'duotone'].map((w) => (
                  <span key={w} style={{ fontSize: 9, color: 'var(--color-text-muted)', width: 24, textAlign: 'center' }}>{w.slice(0, 3)}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-body)' }}>
            <strong>Convention:</strong> Use <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>regular</code> weight by default.
            Use <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>fill</code> for active/selected states. Never mix weights in the same toolbar or context.
          </p>
        </div>
      </Section>

      {/* ---- Theme Switcher Icons ---- */}
      <Section title="Theme Switcher">
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { Icon: Sun, label: 'Light', desc: 'Default' },
            { Icon: MonitorPlay, label: 'Night', desc: 'Dark mode' },
            { Icon: Moon, label: 'Dark', desc: 'On request' },
            { Icon: ClockCounterClockwise, label: 'Legacy', desc: 'On request' },
          ].map(({ Icon, label, desc }) => (
            <div key={label} style={{ flex: 1, padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <Icon size={28} weight="regular" style={{ marginBottom: 8, color: 'var(--color-text-heading)' }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{label}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Status Colors ---- */}
      <Section title="Status Colors">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { token: '--color-success', mutedToken: '--color-success-muted', label: 'Success' },
            { token: '--color-warning', mutedToken: '--color-warning-muted', label: 'Warning' },
            { token: '--color-danger', mutedToken: '--color-danger-muted', label: 'Danger' },
          ].map(({ token, mutedToken, label }) => (
            <div key={label} style={{ padding: 16, borderRadius: 8, background: `var(${mutedToken})`, border: `1px solid var(${token})` }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: `var(${token})` }}>{label}</span>
              <p style={{ fontSize: 12, color: `var(${token})`, opacity: 0.8, margin: '4px 0 0' }}>Background + foreground pairing</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Complementary Colors ---- */}
      <Section title="Complementary Colors">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Five Tailwind-sourced accent families for tags, badges, chart series, and decorative elements. Each adapts per theme. These are NOT status colors — success, warning, and danger remain the only semantic status indicators.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { name: 'Violet', token: '--color-comp-violet', mutedToken: '--color-comp-violet-muted' },
            { name: 'Teal', token: '--color-comp-teal', mutedToken: '--color-comp-teal-muted' },
            { name: 'Rose', token: '--color-comp-rose', mutedToken: '--color-comp-rose-muted' },
            { name: 'Sky', token: '--color-comp-sky', mutedToken: '--color-comp-sky-muted' },
            { name: 'Fuchsia', token: '--color-comp-fuchsia', mutedToken: '--color-comp-fuchsia-muted' },
          ].map(({ name, token, mutedToken }) => (
            <div key={name} style={{ borderRadius: 8, border: `1px solid var(${token})`, background: `var(${mutedToken})`, padding: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: `var(${token})` }}>{name}</span>
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <code style={{ fontSize: 10, fontFamily: 'monospace', color: `var(${token})`, opacity: 0.8 }}>{token}</code>
                <code style={{ fontSize: 10, fontFamily: 'monospace', color: `var(${token})`, opacity: 0.8 }}>{mutedToken}</code>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {[
            { name: 'Violet', token: '--color-comp-violet', mutedToken: '--color-comp-violet-muted' },
            { name: 'Teal', token: '--color-comp-teal', mutedToken: '--color-comp-teal-muted' },
            { name: 'Rose', token: '--color-comp-rose', mutedToken: '--color-comp-rose-muted' },
            { name: 'Sky', token: '--color-comp-sky', mutedToken: '--color-comp-sky-muted' },
            { name: 'Fuchsia', token: '--color-comp-fuchsia', mutedToken: '--color-comp-fuchsia-muted' },
          ].map(({ name, token, mutedToken }) => (
            <span key={name} style={{ padding: '4px 12px', borderRadius: 999, background: `var(${mutedToken})`, color: `var(${token})`, fontSize: 12, fontWeight: 600 }}>
              {name}
            </span>
          ))}
        </div>

        <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Note:</strong> Complementary colors are for categories, data series, visual interest, and decorative use. They must NOT replace status colors (success/warning/danger).
          </p>
        </div>
      </Section>

      {/* ---- Gradients ---- */}
      <Section title="Gradients">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Theme-aware gradient presets. Each adapts automatically when the theme switches. Use sparingly — hero sections, featured cards, empty states.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { name: 'Warm', token: '--gradient-warm', desc: 'Orange \u2192 Rose \u2014 CTAs, hero sections' },
            { name: 'Cool', token: '--gradient-cool', desc: 'Blue \u2192 Teal \u2014 data headers, info panels' },
            { name: 'Brand', token: '--gradient-brand', desc: 'Orange \u2192 Blue \u2014 brand-forward areas' },
            { name: 'Neutral', token: '--gradient-neutral', desc: 'Surface depth \u2014 page backgrounds' },
            { name: 'Vivid', token: '--gradient-vivid', desc: 'Violet \u2192 Fuchsia \u2192 Rose \u2014 creative sections' },
            { name: 'Ocean', token: '--gradient-ocean', desc: 'Sky \u2192 Teal \u2014 analytical, calm areas' },
          ].map(({ name, token, desc }) => (
            <div key={name} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-surface)' }}>
              <div style={{ height: 80, borderRadius: '8px 8px 0 0', background: `var(${token})` }} />
              <div style={{ padding: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>{name}</span>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 6px' }}>{desc}</p>
                <code style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{token}</code>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Usage:</strong>{' '}
            <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>background: var(--gradient-warm);</code>
          </p>
        </div>
      </Section>

      {/* ---- Logo & Favicon ---- */}
      <Section title="Logo & Favicon">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: '#FFFFFF', textAlign: 'center' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Light / Legacy Mode</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/rectangle_logo_orange_ezycollect_by_sidetrade.png" alt="Color logo" style={{ height: 32, objectFit: 'contain' }} />
            <p style={{ fontSize: 11, color: '#6B7280', marginTop: 8 }}>Rectangle — Color variant</p>
          </div>
          <div style={{ padding: 24, borderRadius: 8, border: '1px solid #3F3F3F', background: '#0F0F0F', textAlign: 'center' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#717171', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dark / Night Mode</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/rectangle_logo_white_ezycollect_by_sidetrade.png" alt="White logo" style={{ height: 32, objectFit: 'contain' }} />
            <p style={{ fontSize: 11, color: '#717171', marginTop: 8 }}>Rectangle — White variant</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Default to rectangle logo', desc: 'Headers, navbars, footers, hero sections' },
            { label: 'Square for constrained spaces', desc: 'App icons, sidebar compact, avatars' },
            { label: 'Never modify the logo', desc: 'No recoloring, stretching, or effects' },
          ].map((rule) => (
            <div key={rule.label} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{rule.label}</span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{rule.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Logo Sizing by Viewport</span>
          </div>
          {[
            { viewport: 'LG (desktop)', logo: '32px', navbar: '56px' },
            { viewport: 'MD (tablet)', logo: '32px', navbar: '52px' },
            { viewport: 'SM / XS (mobile)', logo: '26px', navbar: '52px' },
          ].map((row, i) => (
            <div key={row.viewport} style={{ display: 'flex', padding: '8px 16px', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)', width: 160 }}>{row.viewport}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)', width: 80 }}>{row.logo}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Navbar: {row.navbar}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Color Usage Rules ---- */}
      <Section title="Color Usage Rules">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Hierarchy */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color Hierarchy</p>
            {[
              { color: '#FF5A28', label: 'Orange — Primary CTA', desc: 'Use sparingly for max impact' },
              { color: '#1462D2', label: 'Electric Blue — Secondary', desc: 'Links, charts, interactive elements' },
              { color: 'var(--color-text-heading)', label: 'Text — Headings & Body', desc: '3-tier text system per theme' },
              { color: 'var(--color-bg-alt)', label: 'Neutral Surfaces — Structure', desc: 'Warm tones only for highlights' },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: item.color, border: '1px solid var(--color-border)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.label}</span>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Do's and Don'ts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)', flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>DO</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8 }}>
                <li>Orange for primary CTA only</li>
                <li>Surface elevation ladder in dark/night</li>
                <li>Orange-muted for subtle tag backgrounds</li>
                <li>Neutral first — let content speak</li>
              </ul>
            </div>
            <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-danger)', background: 'var(--color-surface)', flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>DON{"'"}T</p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8 }}>
                <li>More than 2 accent colors per component</li>
                <li>Raw #FFFFFF as text in dark/night mode</li>
                <li>Skip surface levels (0→3 without reason)</li>
                <li>Orange + Blue at equal visual weight</li>
              </ul>
            </div>
          </div>
        </div>
        {/* Component Patterns */}
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Component Patterns</span>
          </div>
          {[
            { component: 'Buttons', pattern: 'Primary = Orange bg, white text. Secondary = transparent, blue text + border' },
            { component: 'Cards', pattern: 'Light: white + #DADBE6 border. Dark/Night: surface-1 + theme border' },
            { component: 'Inputs', pattern: 'Theme surface bg, theme border. Focus = Electric Blue border' },
            { component: 'Tags', pattern: 'Light: light-orange bg. Dark/Night: orange-muted bg, orange text' },
            { component: 'Toasts', pattern: 'Translucent accent bg (10-15% opacity) + matching text + status dot' },
          ].map((row, i) => (
            <div key={row.component} style={{ display: 'flex', padding: '10px 16px', borderBottom: i < 4 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)', width: 80, flexShrink: 0 }}>{row.component}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.pattern}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- All 4 Themes ---- */}
      <Section title="All Four Themes">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Light + Night are default. Dark + Legacy only when explicitly requested.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ThemeCard mode="light" label="Light" bg="#FFFFFF" surface="#FFFFFF" text="#121948" muted="#6B7280" border="#DADBE6" primary="#FF5A28" secondary="#1462D2" />
          <ThemeCard mode="night" label="Night (YouTube/Google)" bg="#0F0F0F" surface="#212121" text="#F1F1F1" muted="#717171" border="#3F3F3F" primary="#FF5A28" secondary="#3EA6FF" />
          <ThemeCard mode="dark" label="Dark (Blue-tinted)" bg="#0C0F24" surface="#131733" text="#E8EAF6" muted="#8089B5" border="#2A3168" primary="#FF5A28" secondary="#4D8EF7" />
          <ThemeCard mode="legacy" label="Legacy (Original)" bg="#F1F1F1" surface="#FFFFFF" text="#333333" muted="#999999" border="#e6e6e6" primary="#FF6600" secondary="#169dd6" />
        </div>
      </Section>

      {/* ---- Contrast Reference ---- */}
      <Section title="Contrast Reference (WCAG AA)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { theme: 'Dark Mode', pairs: [
              { pairing: 'Text Primary on Surface 0', ratio: '~14.5:1' },
              { pairing: 'Text Primary on Surface 1', ratio: '~12.2:1' },
              { pairing: 'Text Secondary on Surface 0', ratio: '~7.0:1' },
              { pairing: 'Orange on Surface 0', ratio: '~5.1:1' },
              { pairing: 'Electric Blue on Surface 0', ratio: '~4.8:1' },
              { pairing: 'Text Muted on Surface 1', ratio: '~4.7:1' },
            ]},
            { theme: 'Night Mode', pairs: [
              { pairing: 'Text Primary on Surface 0', ratio: '~18.3:1' },
              { pairing: 'Text Primary on Surface 1', ratio: '~12.1:1' },
              { pairing: 'Text Secondary on Surface 0', ratio: '~8.3:1' },
              { pairing: 'Orange on Surface 0', ratio: '~5.7:1' },
              { pairing: 'Electric Blue on Surface 0', ratio: '~7.9:1' },
              { pairing: 'Text Muted on Surface 1', ratio: '~3.5:1', note: 'AA-large only (18px+)' },
            ]},
          ].map((group) => (
            <div key={group.theme} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{group.theme}</span>
              </div>
              {group.pairs.map((pair: { pairing: string; ratio: string; note?: string }, i: number) => (
                <div key={pair.pairing} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 16px', borderBottom: i < group.pairs.length - 1 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{pair.pairing}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: pair.note ? 'var(--color-warning)' : 'var(--color-success)', whiteSpace: 'nowrap' }}>
                    {pair.ratio} {pair.note ? `(${pair.note})` : null}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Creative Toolkit cross-reference ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', marginBottom: 48 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>See also:</strong> The <strong>creative-toolkit</strong> skill covers asset libraries (unDraw, Humaaans, Unsplash, Pexels, Mixkit), animation engines (Motion, GSAP, Rive), and data visualization (Nivo). Apply it alongside this skill for illustrations, photos, video, animation, and charts.
        </p>
      </div>

      {/* [old Asset Libraries / Animation / Data Viz sections removed — now in creative-toolkit showcase] */}

      {/* ---- Mood: Component Example ---- */}
      <Section title="Mood in Practice — Clean & Minimal">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 16 }}>
          The overall look and feel across all themes must be <strong>clean and modern</strong>. Every surface, component, and interaction should feel intentional and uncluttered.
        </p>

        {/* Mood philosophy pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { title: 'Generous whitespace', desc: 'Let content breathe. Avoid cramming elements together.' },
            { title: 'Minimal visual noise', desc: 'No gratuitous borders, shadows, or decorations. Every visual element should earn its place.' },
            { title: 'Crisp typography', desc: 'Clear hierarchy through weight and size, not through color overload or excessive styling.' },
            { title: 'Subtle depth', desc: 'Use elevation (surface levels) and soft transitions rather than heavy drop shadows or outlines.' },
            { title: 'Restrained color', desc: 'Accent colors (orange, blue) appear sparingly and purposefully. The majority of the UI is neutral surfaces and text.' },
            { title: 'Smooth interactions', desc: 'Micro-transitions on hover/focus/active states. Nothing should feel abrupt or static.' },
            { title: 'Consistent spatial rhythm', desc: 'Use a base spacing unit and stick to it. Group related items tighter, separate groups wider.' },
          ].map((pillar) => (
            <div key={pillar.title} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>{pillar.title}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* Reference companies */}
        <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Think:</strong>{' '}
            {['Linear', 'Vercel', 'Stripe', 'Notion'].map((company, i) => (
              <span key={company}>
                <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>{company}</span>
                {i < 3 ? <span style={{ color: 'var(--color-text-muted)' }}>{' / '}</span> : null}
              </span>
            ))}
            <span style={{ color: 'var(--color-text-muted)' }}> — functional beauty, not decorative excess.</span>
          </p>
        </div>

        {/* Mood Over Brand Saturation */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 12 }}>Mood Over Brand Saturation</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
            The clean, modern, minimalist aesthetic always takes priority over using all brand colors. A page that is 90% neutral surfaces with a single orange CTA is better than a page that forces orange and blue into every section.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
            {[
              { title: 'Neutral first', desc: 'Surfaces, text, and structural elements use neutral tokens. Let the content and layout do the talking.' },
              { title: 'Accent as punctuation', desc: 'Use orange for the one thing you want users to click. Use blue sparingly for secondary actions and links.' },
              { title: 'Squint test', desc: 'Blur your eyes or zoom to 25%. If you see large blocks of orange or blue, you have over-applied brand color.' },
            ].map((rule) => (
              <div key={rule.title} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>{rule.title}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{rule.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Existing dashboard component example */}
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Neutral surfaces dominate. Orange appears only on the primary CTA. Blue only on secondary links.</p>
        <div style={{ padding: 32, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>Welcome back</h3>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>You have 3 pending invoices requiring attention.</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <button style={{ padding: '10px 20px', borderRadius: 6, border: 'none', background: 'var(--color-primary)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              Review Invoices
            </button>
            <button style={{ padding: '10px 20px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-secondary)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              View Dashboard
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { label: 'Total Outstanding', value: '$24,500', color: 'var(--color-text-heading)' },
              { label: 'Overdue', value: '$8,200', color: 'var(--color-danger)' },
              { label: 'Collected this month', value: '$42,100', color: 'var(--color-success)' },
            ].map((stat) => (
              <div key={stat.label} style={{ padding: 16, borderRadius: 6, background: 'var(--color-bg-alt)' }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 4px' }}>{stat.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Failure Patterns ---- */}
      <Section title="Failure Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Common mistakes to watch for during code review. Each has a clear fix.</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', flex: 1 }}>Failure</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', flex: 1 }}>Fix</span>
          </div>
          {[
            { failure: 'Hardcoded hex instead of semantic token', fix: 'Use var(--color-*) tokens' },
            { failure: 'Wrong icon weight mixing', fix: 'Use regular weight default, fill for active' },
            { failure: 'Logo used on clashing background', fix: 'Check logo variant rules' },
            { failure: 'Missing Night mode token', fix: 'Add to [data-theme="night"] block' },
            { failure: 'Nivo chart colors out of sync', fix: 'Update chart-theme.ts (now in creative-toolkit)' },
            { failure: 'Font fallback to system font', fix: 'Ensure Jost is loaded via next/font' },
          ].map((row, i) => (
            <div key={row.failure} style={{ display: 'flex', padding: '10px 16px', borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 13, color: 'var(--color-danger)', flex: 1 }}>{row.failure}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)', flex: 1 }}>{row.fix}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ---- Theme comparison card ---- */
function ThemeCard({ mode, label, bg, surface, text, muted, border, primary, secondary }: {
  mode: string; label: string; bg: string; surface: string; text: string; muted: string; border: string; primary: string; secondary: string;
}) {
  return (
    <div style={{ padding: 20, borderRadius: 8, background: bg, border: `1px solid ${border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: text }}>{label}</span>
        <span style={{ fontSize: 11, fontFamily: 'monospace', color: muted }}>{mode}</span>
      </div>
      <div style={{ padding: 16, borderRadius: 6, background: surface, border: `1px solid ${border}`, marginBottom: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: text, margin: '0 0 4px' }}>Card Title</p>
        <p style={{ fontSize: 13, color: muted, margin: '0 0 12px' }}>Secondary description text</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ padding: '4px 10px', borderRadius: 4, background: primary, color: '#fff', fontSize: 12, fontWeight: 600 }}>Primary</span>
          <span style={{ padding: '4px 10px', borderRadius: 4, border: `1px solid ${border}`, color: secondary, fontSize: 12, fontWeight: 500 }}>Secondary</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {[bg, surface, border, text, muted, primary, secondary].map((c, i) => (
          <div key={i} style={{ flex: 1, height: 24, borderRadius: 4, background: c, border: `1px solid ${border}` }} />
        ))}
      </div>
    </div>
  );
}

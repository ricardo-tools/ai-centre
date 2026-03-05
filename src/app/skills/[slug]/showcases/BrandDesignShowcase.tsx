'use client';

import { Sun, MonitorPlay, Moon, ClockCounterClockwise, ArrowRight, Bell, Gear, MagnifyingGlass, Heart, Star, ChatCircle, Lightning } from '@phosphor-icons/react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';

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
      {/* ---- Color Palette ---- */}
      <Section title="Color Palette">
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Brand Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16, marginBottom: 32 }}>
          <Swatch color="#FF5A28" name="Orange" hex="#FF5A28" />
          <Swatch color="#FFF2EB" name="Light Orange" hex="#FFF2EB" />
          <Swatch color="#1462D2" name="Electric Blue" hex="#1462D2" />
          <Swatch color="#1F2B7A" name="Brand Blue" hex="#1F2B7A" />
          <Swatch color="#121948" name="Midnight Blue" hex="#121948" />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Night Mode Surfaces</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
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
            { weight: 300, label: 'Light (300)' },
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
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

      {/* ---- Supporting Palette ---- */}
      <Section title="Supporting Palette">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Brand orange and blue are the stars — these harmonious accents are the stage. Derived from split-complementary, triadic, and analogous positions on the color wheel, all desaturated 50–90% below the brand colors so they never compete.</p>

        {/* Color wheel diagram */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 24, marginBottom: 24 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              {/* Outer ring segments representing hue positions */}
              <circle cx="80" cy="80" r="70" fill="none" stroke="var(--color-border)" strokeWidth="1" />
              <circle cx="80" cy="80" r="55" fill="none" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 4" />
              {/* Brand anchors */}
              <circle cx={80 + 62 * Math.cos((14 - 90) * Math.PI / 180)} cy={80 + 62 * Math.sin((14 - 90) * Math.PI / 180)} r="8" fill="#FF5A28" stroke="#fff" strokeWidth="2" />
              <circle cx={80 + 62 * Math.cos((213 - 90) * Math.PI / 180)} cy={80 + 62 * Math.sin((213 - 90) * Math.PI / 180)} r="8" fill="#1462D2" stroke="#fff" strokeWidth="2" />
              {/* Supporting positions */}
              {[
                { deg: 170, color: '#4FA6A0', label: 'Teal' },
                { deg: 265, color: '#8672B3', label: 'Violet' },
                { deg: 38, color: '#C99640', label: 'Amber' },
                { deg: 145, color: '#4E9E72', label: 'Sage' },
                { deg: 345, color: '#B57B8A', label: 'Rose' },
              ].map((p) => (
                <circle key={p.label} cx={80 + 62 * Math.cos((p.deg - 90) * Math.PI / 180)} cy={80 + 62 * Math.sin((p.deg - 90) * Math.PI / 180)} r="5" fill={p.color} />
              ))}
              {/* Center label */}
              <text x="80" y="78" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-text-muted)">Harmonic</text>
              <text x="80" y="90" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-text-muted)">Positions</text>
            </svg>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '8px 0 0', textAlign: 'center' }}>Large dots = brand anchors</p>
          </div>

          {/* Palette grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {[
              { name: 'Muted Teal', hex: '#4FA6A0', bg: '#E8F5F4', role: 'Split-comp to orange', use: 'Data viz, info tags, categories' },
              { name: 'Soft Violet', hex: '#8672B3', bg: '#F0EDF6', role: 'Triadic to orange', use: 'Badges, diagram nodes, metadata' },
              { name: 'Warm Amber', hex: '#C99640', bg: '#FDF5E8', role: 'Analogous to orange', use: 'Callouts, highlights, warnings' },
              { name: 'Sage Green', hex: '#4E9E72', bg: '#E9F4ED', role: 'Triadic position', use: 'Progress, positive trends' },
              { name: 'Dusty Rose', hex: '#B57B8A', bg: '#F6EEF0', role: 'Warm comp bridge', use: 'Soft tags, visual interest' },
              { name: 'Slate Blue', hex: '#738099', bg: '#EFF1F4', role: 'Desaturated brand blue', use: 'Secondary surfaces, muted meta' },
              { name: 'Soft Indigo', hex: '#7B83B3', bg: '#EEEEF5', role: 'Brand blue extension', use: 'Code blocks, metadata badges' },
              { name: 'Warm Grey', hex: '#A69D96', bg: '#F4F2F1', role: 'Warm neutral', use: 'Disabled states, dividers' },
            ].map((c) => (
              <div key={c.name} style={{ borderRadius: 6, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <div style={{ height: 40, background: c.hex }} />
                <div style={{ height: 20, background: c.bg }} />
                <div style={{ padding: '8px 10px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block' }}>{c.name}</span>
                  <code style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{c.hex}</code>
                  <p style={{ fontSize: 9, color: 'var(--color-text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage examples — cards using supporting palette */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Practice — Category Tags</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {[
            { label: 'Payments', bg: '#E8F5F4', color: '#4FA6A0' },
            { label: 'Analytics', bg: '#F0EDF6', color: '#8672B3' },
            { label: 'Urgent', bg: '#FDF5E8', color: '#C99640' },
            { label: 'Completed', bg: '#E9F4ED', color: '#4E9E72' },
            { label: 'Archived', bg: '#F6EEF0', color: '#B57B8A' },
            { label: 'Draft', bg: '#EFF1F4', color: '#738099' },
            { label: 'API', bg: '#EEEEF5', color: '#7B83B3' },
            { label: 'Disabled', bg: '#F4F2F1', color: '#A69D96' },
          ].map((tag) => (
            <span key={tag.label} style={{ padding: '4px 12px', borderRadius: 12, background: tag.bg, color: tag.color, fontSize: 12, fontWeight: 600 }}>{tag.label}</span>
          ))}
        </div>

        {/* Usage example — stat cards with supporting colors */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>In Practice — Metric Cards with Accent Borders</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Active Plans', value: '1,243', accent: '#4FA6A0' },
            { label: 'In Review', value: '87', accent: '#8672B3' },
            { label: 'Due This Week', value: '32', accent: '#C99640' },
            { label: 'Resolved', value: '456', accent: '#4E9E72' },
          ].map((stat) => (
            <div key={stat.label} style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderLeft: `3px solid ${stat.accent}` }}>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '0 0 4px' }}>{stat.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-heading)', margin: 0 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Data visualization palette */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data Visualization Sequence (elevated saturation)</p>
        <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
          {[
            { hex: '#FF5A28', label: 'Orange' },
            { hex: '#1462D2', label: 'Blue' },
            { hex: '#2A9D93', label: 'Teal' },
            { hex: '#8B6BBF', label: 'Violet' },
            { hex: '#D4A03A', label: 'Amber' },
            { hex: '#3D9E65', label: 'Green' },
            { hex: '#C96B80', label: 'Rose' },
            { hex: '#6B76B5', label: 'Indigo' },
          ].map((c) => (
            <div key={c.hex} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: 32, borderRadius: 4, background: c.hex }} />
              <span style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>{c.label}</span>
              <code style={{ fontSize: 8, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{c.hex}</code>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Same hue positions as above but with bumped saturation for chart readability. Adjacent series are maximally distinct.</p>

        {/* Design principle callout */}
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Principle:</strong> Supporting colors at 25–55% saturation vs brand orange at 100% and blue at 83%. They provide variety and utility without visual competition. Use the background tints for section fills and card backgrounds.</p>
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
            ]},
            { theme: 'Night Mode', pairs: [
              { pairing: 'Text Primary on Surface 0', ratio: '~18.3:1' },
              { pairing: 'Text Primary on Surface 1', ratio: '~12.1:1' },
              { pairing: 'Text Secondary on Surface 0', ratio: '~8.3:1' },
              { pairing: 'Orange on Surface 0', ratio: '~5.7:1' },
              { pairing: 'Electric Blue on Surface 0', ratio: '~7.9:1' },
            ]},
          ].map((group) => (
            <div key={group.theme} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{group.theme}</span>
              </div>
              {group.pairs.map((pair, i) => (
                <div key={pair.pairing} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderBottom: i < group.pairs.length - 1 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{pair.pairing}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)' }}>{pair.ratio} ✓</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Asset Libraries ---- */}
      <Section title="Asset Libraries">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Assets are a primary tool for visual warmth — a page with a well-chosen illustration on a neutral background is more on-brand than one saturated with orange and blue.</p>

        {/* --- unDraw — real illustration examples --- */}
        <div style={{ marginBottom: 24, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>unDraw</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Illustrations (Primary) — MIT</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>500+ flat SVGs. Customize the accent color on-site before downloading — always use <span style={{ color: '#FF5A28', fontWeight: 600 }}>#FF5A28</span> or <span style={{ color: '#1462D2', fontWeight: 600 }}>#1462D2</span>, never the default purple.</p>
            {/* Example usage: empty state with unDraw-style illustration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Empty state example */}
              <div style={{ padding: 32, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                {/* unDraw-style illustration mockup — brand orange */}
                <svg width="120" height="100" viewBox="0 0 120 100" style={{ marginBottom: 16 }}>
                  <rect x="20" y="10" width="80" height="60" rx="6" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
                  <rect x="30" y="20" width="25" height="3" rx="1.5" fill="#FF5A28" />
                  <rect x="30" y="28" width="60" height="2" rx="1" fill="var(--color-border)" />
                  <rect x="30" y="34" width="50" height="2" rx="1" fill="var(--color-border)" />
                  <rect x="30" y="40" width="55" height="2" rx="1" fill="var(--color-border)" />
                  <circle cx="90" cy="24" r="8" fill="#FF5A28" opacity="0.15" />
                  <circle cx="90" cy="24" r="4" fill="#FF5A28" />
                  <rect x="30" y="50" width="24" height="10" rx="5" fill="#FF5A28" />
                  <rect x="58" y="50" width="24" height="10" rx="5" fill="var(--color-border)" />
                  <circle cx="60" cy="88" r="5" fill="#FF5A28" opacity="0.2" />
                  <circle cx="45" cy="92" r="3" fill="#1462D2" opacity="0.15" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>No invoices yet</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>Create your first invoice to get started</p>
                <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 4, background: '#FF5A28', color: '#fff', fontWeight: 600 }}>Create Invoice</span>
              </div>
              {/* Feature section example */}
              <div style={{ padding: 32, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                {/* unDraw-style illustration mockup — brand blue */}
                <svg width="120" height="100" viewBox="0 0 120 100" style={{ marginBottom: 16 }}>
                  <rect x="10" y="20" width="45" height="55" rx="4" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
                  <rect x="65" y="20" width="45" height="55" rx="4" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
                  <rect x="18" y="35" width="30" height="20" rx="3" fill="#1462D2" opacity="0.12" />
                  <rect x="22" y="40" width="12" height="12" rx="2" fill="#1462D2" />
                  <rect x="73" y="30" width="30" height="3" rx="1.5" fill="#1462D2" />
                  <rect x="73" y="37" width="25" height="2" rx="1" fill="var(--color-border)" />
                  <rect x="73" y="43" width="28" height="2" rx="1" fill="var(--color-border)" />
                  <rect x="73" y="55" width="20" height="8" rx="4" fill="#1462D2" />
                  <path d="M55 50 L65 50" stroke="#1462D2" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="60" cy="12" r="6" fill="#1462D2" opacity="0.1" />
                  <circle cx="60" cy="12" r="3" fill="#1462D2" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>Smart Matching</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>AI matches payments to invoices automatically</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: 0 }}>Search undraw.co for: dashboard, analytics, payments, invoice, onboarding, empty, error, collaboration, security, team</p>
          </div>
        </div>

        {/* --- Humaaans --- */}
        <div style={{ marginBottom: 24, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Humaaans</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>People (Supplementary) — CC0</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>Mix-and-match modular characters. Use when the context specifically needs human figures — team pages, testimonials, onboarding.</p>
            {/* Team section mockup using Humaaans-style characters */}
            <div style={{ padding: 24, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>Meet the Team</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                {[
                  { hair: '#2C1810', skin: '#D4A574', top: '#FF5A28', pants: '#1F2B7A', name: 'Sarah K.', role: 'Product' },
                  { hair: '#F0C080', skin: '#F5D0A9', top: '#1462D2', pants: '#333', name: 'James L.', role: 'Engineering' },
                  { hair: '#1A1A1A', skin: '#8D5524', top: '#34C759', pants: '#121948', name: 'Priya M.', role: 'Design' },
                  { hair: '#A0522D', skin: '#F5D0A9', top: '#FF5A28', pants: '#1462D2', name: 'Alex R.', role: 'Sales' },
                ].map((person) => (
                  <div key={person.name} style={{ textAlign: 'center' }}>
                    {/* Simplified character */}
                    <svg width="48" height="80" viewBox="0 0 48 80" style={{ marginBottom: 8 }}>
                      {/* Hair */}
                      <ellipse cx="24" cy="12" rx="12" ry="12" fill={person.hair} />
                      {/* Face */}
                      <circle cx="24" cy="14" r="9" fill={person.skin} />
                      {/* Body/shirt */}
                      <path d="M12 30 Q12 26 24 26 Q36 26 36 30 L38 55 L10 55 Z" fill={person.top} />
                      {/* Arms */}
                      <rect x="6" y="30" width="6" height="20" rx="3" fill={person.skin} />
                      <rect x="36" y="30" width="6" height="20" rx="3" fill={person.skin} />
                      {/* Legs */}
                      <rect x="14" y="55" width="8" height="22" rx="4" fill={person.pants} />
                      <rect x="26" y="55" width="8" height="22" rx="4" fill={person.pants} />
                    </svg>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>{person.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>{person.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Unsplash — real photos --- */}
        <div style={{ marginBottom: 24, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Unsplash</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Stock Photos — Free</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>3M+ high-res photos. Always optimize with URL params: <code style={{ fontSize: 11, background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>?w=800&q=80</code>. Self-host in production.</p>
            {/* Real Unsplash photos grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              {[
                { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80', label: '"modern office"' },
                { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&q=80', label: '"team meeting"' },
                { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80', label: '"data analytics"' },
                { url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&q=80', label: '"laptop workspace"' },
              ].map((img) => (
                <div key={img.label} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.label} style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '6px 8px', background: 'var(--color-surface)' }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{img.label}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Hero section example using Unsplash */}
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Hero background" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block', filter: 'brightness(0.4)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                <p style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 8px', textAlign: 'center' }}>Collect smarter, faster</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '0 0 16px', textAlign: 'center' }}>AI-powered accounts receivable for modern teams</p>
                <span style={{ padding: '8px 20px', borderRadius: 6, background: '#FF5A28', color: '#fff', fontSize: 13, fontWeight: 600 }}>Get Started</span>
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, fontStyle: 'italic' }}>Prefer search terms with &quot;minimal&quot;, &quot;modern&quot;, or &quot;clean&quot; to match the brand mood</p>
          </div>
        </div>

        {/* --- Pexels & Mixkit — video usage --- */}
        <div style={{ marginBottom: 24, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Pexels + Mixkit</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Stock Video — Free</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>Pexels for API-driven workflows (200 req/hr). Mixkit for hand-picked hero quality. Always self-host in production.</p>
            {/* Hero video background mockup */}
            <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative', background: '#0a0a0a', height: 180, marginBottom: 12 }}>
              {/* Simulated video bg with animated gradient */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0C0F24 0%, #1462D2 40%, #121948 70%, #FF5A28 100%)', opacity: 0.4 }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 50%)' }} />
              {/* Play indicator */}
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 4, background: 'rgba(0,0,0,0.5)' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
                <span style={{ fontSize: 9, color: '#fff', fontWeight: 600 }}>VIDEO BG</span>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24 }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>Automate your AR</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>Watch how ezyCollect transforms collections</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ padding: '8px 20px', borderRadius: 6, background: '#FF5A28', color: '#fff', fontSize: 13, fontWeight: 600 }}>Start Free Trial</span>
                  <span style={{ padding: '8px 20px', borderRadius: 6, background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, fontWeight: 500, border: '1px solid rgba(255,255,255,0.2)' }}>Watch Demo</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginBottom: 4 }}>Pexels — API-driven</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>150K+ videos, up to 4K. Use for automated selection, dynamic backgrounds. Keywords: technology, abstract, city aerial, minimal</p>
              </div>
              <div style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: 4 }}>Mixkit — Hero quality</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Curated by Envato. No API — manual only. Use for hero backgrounds, landing cinematics, brand videos</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Animation Stack ---- */}
      <Section title="Animation Stack">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Motion first (90% of cases). GSAP for the heavy lifting. They coexist. Rive for interactive assets.</p>
        <style>{`
          @keyframes showcaseFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes showcaseSlideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes showcaseScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes showcaseStagger1 { 0%,30% { opacity: 0; transform: translateY(12px); } 40%,100% { opacity: 1; transform: translateY(0); } }
          @keyframes showcaseStagger2 { 0%,45% { opacity: 0; transform: translateY(12px); } 55%,100% { opacity: 1; transform: translateY(0); } }
          @keyframes showcaseStagger3 { 0%,60% { opacity: 0; transform: translateY(12px); } 70%,100% { opacity: 1; transform: translateY(0); } }
          @keyframes showcaseScrollReveal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes showcaseTextSplit { 0% { opacity: 0; transform: translateY(100%); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes showcaseRivePulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
          @keyframes showcaseRiveCheck { 0% { stroke-dashoffset: 24; } 100% { stroke-dashoffset: 0; } }
          @keyframes showcaseRiveToggle { 0%,45% { transform: translateX(0); background: var(--color-border); } 55%,100% { transform: translateX(18px); background: #FF5A28; } }
          @keyframes showcaseLayoutFlip { 0%,40% { width: 60px; height: 60px; border-radius: 8px; } 50%,90% { width: 120px; height: 40px; border-radius: 20px; } 100% { width: 60px; height: 60px; border-radius: 8px; } }
        `}</style>

        {/* Motion — live demos */}
        <div style={{ marginBottom: 20, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Motion</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Primary (React) — ~3.8–25 KB</span>
            </div>
            <code style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>npm i motion</code>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
              {/* Fade up */}
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#FF5A28', margin: '0 auto 8px', animation: 'showcaseFadeUp 1.5s ease-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Fade Up</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Mount animation</p>
              </div>
              {/* Slide in */}
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#1462D2', margin: '0 auto 8px', animation: 'showcaseSlideIn 1.5s ease-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Slide In</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>AnimatePresence</p>
              </div>
              {/* Scale */}
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#34C759', margin: '0 auto 8px', animation: 'showcaseScale 1.5s ease-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Scale</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Hover / tap</p>
              </div>
              {/* Layout FLIP */}
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#FF5A28', animation: 'showcaseLayoutFlip 3s ease-in-out infinite', marginBottom: 8 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Layout FLIP</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Auto layout shift</p>
              </div>
            </div>
            {/* Staggered list demo */}
            <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Staggered List — common pattern for card grids</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { anim: 'showcaseStagger1', label: '$24,500', sub: 'Outstanding' },
                  { anim: 'showcaseStagger2', label: '$8,200', sub: 'Overdue' },
                  { anim: 'showcaseStagger3', label: '$42,100', sub: 'Collected' },
                ].map((item) => (
                  <div key={item.sub} style={{ flex: 1, padding: 16, borderRadius: 6, background: 'var(--color-bg-alt)', animation: `${item.anim} 3s ease-out infinite` }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GSAP — live demos */}
        <div style={{ marginBottom: 20, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>GSAP</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Complex Sequences — ~30 KB core</span>
            </div>
            <code style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>npm i gsap</code>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* ScrollTrigger demo */}
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>ScrollTrigger — reveal on scroll</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Collect faster with AI', 'Automate follow-ups', 'Real-time dashboards'].map((text, i) => (
                    <div key={text} style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', animation: `showcaseScrollReveal 2s ease-out infinite`, animationDelay: `${i * 0.3}s` }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* SplitText demo */}
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>SplitText — character animation</p>
                <div style={{ overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {'Get paid faster'.split('').map((char, i) => (
                      <span key={i} style={{ fontSize: 24, fontWeight: 800, color: char === ' ' ? 'transparent' : 'var(--color-text-heading)', display: 'inline-block', animation: `showcaseTextSplit 2.5s ease-out infinite`, animationDelay: `${i * 0.05}s`, minWidth: char === ' ' ? 8 : undefined }}>
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Each character animates independently via GSAP SplitText + timeline stagger</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rive — live demos */}
        <div style={{ marginBottom: 20, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Rive</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Interactive Assets — MIT runtime</span>
            </div>
            <code style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>npm i @rive-app/react-canvas</code>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>State machine-driven animations that react to user input, data, and app state in real time.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {/* Interactive loader */}
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--color-border)', borderTopColor: '#FF5A28', margin: '0 auto 10px', animation: 'showcaseRivePulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Interactive Loader</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Reacts to loading progress state</p>
              </div>
              {/* Animated check */}
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ margin: '0 auto 10px', display: 'block' }}>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#34C759" strokeWidth="2.5" opacity="0.2" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#34C759" strokeWidth="2.5" strokeDasharray="126" strokeDashoffset="0" style={{ animation: 'showcaseRiveCheck 1.5s ease-out infinite' }} />
                  <path d="M15 24 L21 30 L33 18" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" style={{ animation: 'showcaseRiveCheck 1.5s ease-out 0.3s infinite' }} />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Success Check</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Triggers on payment confirmed</p>
              </div>
              {/* Toggle */}
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 26, borderRadius: 13, background: 'var(--color-border)', margin: '11px auto 10px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: 3, animation: 'showcaseRiveToggle 2.5s ease-in-out infinite', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>State Toggle</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Bound to app state machine</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Rule:</strong> Motion first for all React UI. GSAP for scroll-driven sequences, text splitting, SVG morphing. Rive for interactive assets only. Always respect <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>prefers-reduced-motion</code>.</p>
        </div>
      </Section>

      {/* ---- Data Visualization ---- */}
      <Section title="Data Visualization — Nivo">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>SVG-based, theme-aware charts. Use the brand theme object — never hardcode colors in individual charts.</p>

        {/* Live chart examples */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Bar chart */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>Collections by month are trending up</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Title states the insight, not a label</p>
            </div>
            <div style={{ height: 220, padding: '8px 0' }}>
              <ResponsiveBar
                data={[
                  { month: 'Jan', collected: 32000, outstanding: 12000 },
                  { month: 'Feb', collected: 38000, outstanding: 9000 },
                  { month: 'Mar', collected: 42000, outstanding: 8200 },
                  { month: 'Apr', collected: 45000, outstanding: 7500 },
                  { month: 'May', collected: 51000, outstanding: 6000 },
                  { month: 'Jun', collected: 55000, outstanding: 5200 },
                ]}
                keys={['collected', 'outstanding']}
                indexBy="month"
                margin={{ top: 16, right: 16, bottom: 40, left: 56 }}
                padding={0.35}
                groupMode="grouped"
                colors={['#FF5A28', '#1462D2']}
                borderRadius={4}
                enableGridY={false}
                enableLabel={false}
                axisBottom={{ tickSize: 0, tickPadding: 8 }}
                axisLeft={{ tickSize: 0, tickPadding: 8, format: (v: number) => `$${v / 1000}k` }}
                motionConfig="gentle"
                theme={{
                  axis: { ticks: { text: { fontSize: 10, fill: '#717171' } } },
                  grid: { line: { stroke: 'transparent' } },
                }}
              />
            </div>
          </div>

          {/* Line chart */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>DSO dropped 23% since Q1</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Days Sales Outstanding trend</p>
            </div>
            <div style={{ height: 220, padding: '8px 0' }}>
              <ResponsiveLine
                data={[{
                  id: 'DSO',
                  data: [
                    { x: 'Jan', y: 52 }, { x: 'Feb', y: 48 }, { x: 'Mar', y: 45 },
                    { x: 'Apr', y: 42 }, { x: 'May', y: 38 }, { x: 'Jun', y: 35 },
                  ],
                }]}
                margin={{ top: 16, right: 16, bottom: 40, left: 48 }}
                colors={['#FF5A28']}
                lineWidth={2.5}
                pointSize={8}
                pointColor="#FF5A28"
                pointBorderWidth={2}
                pointBorderColor="#fff"
                enableGridX={false}
                enableGridY={false}
                enableArea={true}
                areaOpacity={0.08}
                axisBottom={{ tickSize: 0, tickPadding: 8 }}
                axisLeft={{ tickSize: 0, tickPadding: 8, format: (v: number) => `${v}d` }}
                motionConfig="gentle"
                theme={{
                  axis: { ticks: { text: { fontSize: 10, fill: '#717171' } } },
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Pie chart */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>Payment methods</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Use donut sparingly — prefer bars for comparison</p>
            </div>
            <div style={{ height: 200, padding: '8px 0' }}>
              <ResponsivePie
                data={[
                  { id: 'Card', value: 45, color: '#FF5A28' },
                  { id: 'Bank', value: 30, color: '#1462D2' },
                  { id: 'Direct Debit', value: 15, color: '#3EA6FF' },
                  { id: 'Other', value: 10, color: '#FFB800' },
                ]}
                margin={{ top: 16, right: 80, bottom: 16, left: 16 }}
                innerRadius={0.55}
                padAngle={1.5}
                cornerRadius={3}
                colors={{ datum: 'data.color' }}
                enableArcLinkLabels={false}
                enableArcLabels={false}
                motionConfig="gentle"
                legends={[{
                  anchor: 'right',
                  direction: 'column',
                  translateX: 70,
                  itemWidth: 60,
                  itemHeight: 20,
                  itemTextColor: '#717171',
                  symbolSize: 10,
                  symbolShape: 'circle',
                }]}
              />
            </div>
          </div>

          {/* Color palette + rules */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chart Color Sequence</p>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {['#FF5A28', '#1462D2', '#3EA6FF', '#FFB800', '#34C759', '#6366F1'].map((c) => (
                <div key={c} style={{ flex: 1, height: 28, borderRadius: 4, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Orange always first — it\'s the accent',
                'Max 6 series per chart',
                'borderRadius: 4 on bars',
                'motionConfig="gentle"',
                'enableGridY={false} for clean look',
                'Title = insight, not label',
              ].map((rule, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--color-text-body)', paddingLeft: 10, borderLeft: '2px solid var(--color-border)' }}>{rule}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Mood: Component Example ---- */}
      <Section title="Mood in Practice — Clean & Minimal">
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

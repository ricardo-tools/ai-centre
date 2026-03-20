'use client';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
      {children}
    </section>
  );
}

const cellStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--color-text-body)',
  borderBottom: '1px solid var(--color-border)',
  lineHeight: 1.5,
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: 'var(--color-text-muted)',
  background: 'var(--color-bg-alt)',
};

function Swatch({ hex, label }: { hex: string; label?: string }) {
  const isDark = hex.startsWith('#0') || hex.startsWith('#1') || hex.startsWith('#2') || hex.startsWith('#3') || hex.startsWith('#04');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: hex,
          border: '1px solid var(--color-border)',
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {label && <span style={{ fontSize: 11, fontWeight: 600, color: isDark ? 'var(--color-text-body)' : 'var(--color-text-body)' }}>{label}</span>}
        <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{hex}</code>
      </div>
    </div>
  );
}

function SwatchRow({ hex, token, role }: { hex: string; token: string; role: string }) {
  return (
    <tr>
      <td style={cellStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 4, background: hex, border: '1px solid var(--color-border)', flexShrink: 0 }} />
          <code style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{token}</code>
        </div>
      </td>
      <td style={cellStyle}><code style={{ fontSize: 12 }}>{hex}</code></td>
      <td style={cellStyle}>{role}</td>
    </tr>
  );
}

const LIGHT_PALETTE = [
  { token: '--lm-orange', hex: '#FF5A28', role: 'Primary CTA, highlights, graphic accents' },
  { token: '--lm-light-orange', hex: '#FFF2EB', role: 'Warm background sections, tag backgrounds' },
  { token: '--lm-electric-blue', hex: '#1462D2', role: 'Secondary CTA, links, charts' },
  { token: '--lm-brand-blue', hex: '#1F2B7A', role: 'Logo, brand panels, overlays' },
  { token: '--lm-midnight-blue', hex: '#121948', role: 'Headings, accent text, footers' },
  { token: '--lm-neutral-text', hex: '#333333', role: 'Main body text, paragraphs' },
  { token: '--lm-white', hex: '#FFFFFF', role: 'Main background' },
  { token: '--lm-light-blue', hex: '#EBEBF3', role: 'Soft background, section separation' },
];

const DARK_PALETTE = [
  { token: '--dm-orange', hex: '#FF5A28', role: 'Primary CTA (shared with light)' },
  { token: '--dm-orange-muted', hex: '#33200F', role: 'Warm background zones, tags, toasts' },
  { token: '--dm-electric-blue', hex: '#4D8EF7', role: 'Secondary CTA, links (lifted for contrast)' },
  { token: '--dm-brand-blue', hex: '#5A6BD4', role: 'Logo on dark, decorative brand use' },
  { token: '--dm-surface-0', hex: '#0C0F24', role: 'Page background (base)' },
  { token: '--dm-surface-1', hex: '#131733', role: 'Cards, modals, dropdowns' },
  { token: '--dm-surface-2', hex: '#1A2044', role: 'Hover states, inputs' },
  { token: '--dm-surface-3', hex: '#232A56', role: 'Active states, selected items' },
  { token: '--dm-border', hex: '#2A3168', role: 'Card borders, dividers' },
  { token: '--dm-text-primary', hex: '#E8EAF6', role: 'Headings, body text' },
  { token: '--dm-text-secondary', hex: '#9CA3C9', role: 'Descriptions, meta text' },
  { token: '--dm-text-muted', hex: '#8089B5', role: 'Placeholders, disabled states' },
];

const NIGHT_PALETTE = [
  { token: '--nm-orange', hex: '#FF5A28', role: 'Primary CTA (same across all)' },
  { token: '--nm-orange-muted', hex: '#261A10', role: 'Subtle dark background for tags' },
  { token: '--nm-electric-blue', hex: '#3EA6FF', role: 'Secondary CTA, links (YouTube blue)' },
  { token: '--nm-brand-blue', hex: '#8AB4F8', role: 'Logo on night (Google blue)' },
  { token: '--nm-surface-0', hex: '#0F0F0F', role: 'Page background (YouTube main)' },
  { token: '--nm-surface-1', hex: '#212121', role: 'Cards, modals, dropdowns' },
  { token: '--nm-surface-2', hex: '#272727', role: 'Hover states, inputs' },
  { token: '--nm-surface-3', hex: '#3A3A3A', role: 'Active states, selected items' },
  { token: '--nm-border', hex: '#3F3F3F', role: 'Card borders, dividers' },
  { token: '--nm-text-primary', hex: '#F1F1F1', role: 'Headings, body text' },
  { token: '--nm-text-secondary', hex: '#AAAAAA', role: 'Descriptions, meta text' },
  { token: '--nm-text-muted', hex: '#717171', role: 'Placeholders, disabled states' },
];

const SEMANTIC_CORE = [
  { variable: '--color-primary', role: 'Primary CTA (orange)' },
  { variable: '--color-primary-hover', role: 'Primary CTA hover state' },
  { variable: '--color-primary-muted', role: 'Soft orange background (tags, toasts)' },
  { variable: '--color-secondary', role: 'Secondary CTA / links (electric blue)' },
  { variable: '--color-brand', role: 'Brand blue accent' },
  { variable: '--color-bg', role: 'Page background' },
  { variable: '--color-bg-alt', role: 'Alternative background (section separation)' },
  { variable: '--color-surface', role: 'Cards, modals, dropdowns' },
  { variable: '--color-surface-hover', role: 'Hover state on surfaces' },
  { variable: '--color-surface-active', role: 'Active / selected state' },
  { variable: '--color-border', role: 'Borders and dividers' },
  { variable: '--color-text-heading', role: 'Headings, prominent text' },
  { variable: '--color-text-body', role: 'Body / paragraph text' },
  { variable: '--color-text-muted', role: 'Captions, placeholders, disabled' },
];

const SEMANTIC_STATUS = [
  { variable: '--color-success', role: 'Success states, active indicators' },
  { variable: '--color-success-muted', role: 'Success background (tags, banners)' },
  { variable: '--color-warning', role: 'Warning states' },
  { variable: '--color-warning-muted', role: 'Warning background' },
  { variable: '--color-danger', role: 'Error / danger states' },
  { variable: '--color-danger-muted', role: 'Error background' },
];

const SEMANTIC_SHELL = [
  { variable: '--color-sidebar-bg', role: 'Sidebar background' },
  { variable: '--color-sidebar-text', role: 'Sidebar nav item text' },
  { variable: '--color-sidebar-text-active', role: 'Active nav item text' },
  { variable: '--color-sidebar-hover', role: 'Nav item hover background' },
  { variable: '--color-sidebar-section', role: 'Section header / divider' },
  { variable: '--color-topnav-bg', role: 'Navbar background' },
  { variable: '--color-topnav-text', role: 'Navbar text (active tabs)' },
  { variable: '--color-topnav-text-muted', role: 'Navbar secondary text' },
  { variable: '--color-topnav-border', role: 'Navbar bottom border' },
  { variable: '--color-topnav-badge-bg', role: 'Status badge background' },
  { variable: '--color-topnav-badge-text', role: 'Status badge text' },
];

const COMPLEMENTARY = [
  { family: 'Violet', light: '#7C3AED', night: '#A78BFA', mutedLight: '#EDE9FE', mutedNight: '#2E1065' },
  { family: 'Teal', light: '#0D9488', night: '#2DD4BF', mutedLight: '#CCFBF1', mutedNight: '#042F2E' },
  { family: 'Rose', light: '#E11D48', night: '#FB7185', mutedLight: '#FFE4E6', mutedNight: '#4C0519' },
  { family: 'Sky', light: '#0284C7', night: '#38BDF8', mutedLight: '#E0F2FE', mutedNight: '#082F49' },
  { family: 'Fuchsia', light: '#C026D3', night: '#E879F9', mutedLight: '#FAE8FF', mutedNight: '#4A044E' },
];

const GRADIENTS = [
  { token: '--gradient-warm', desc: 'Orange to Rose', use: 'Hero sections, CTA banners', light: 'linear-gradient(135deg, #FF5A28, #E11D48)', night: 'linear-gradient(135deg, #FF5A28, #FB7185)' },
  { token: '--gradient-cool', desc: 'Blue to Teal', use: 'Data headers, info panels', light: 'linear-gradient(135deg, #1462D2, #0D9488)', night: 'linear-gradient(135deg, #3EA6FF, #2DD4BF)' },
  { token: '--gradient-brand', desc: 'Orange to Blue', use: 'Brand callouts, featured', light: 'linear-gradient(135deg, #FF5A28, #1462D2)', night: 'linear-gradient(135deg, #FF5A28, #3EA6FF)' },
  { token: '--gradient-neutral', desc: 'White to Light Blue', use: 'Backgrounds, separators', light: 'linear-gradient(180deg, #FFFFFF, #EBEBF3)', night: 'linear-gradient(180deg, #212121, #0F0F0F)' },
  { token: '--gradient-vivid', desc: 'Violet to Fuchsia to Rose', use: 'Creative, marketing', light: 'linear-gradient(135deg, #7C3AED, #C026D3, #E11D48)', night: 'linear-gradient(135deg, #A78BFA, #E879F9, #FB7185)' },
  { token: '--gradient-ocean', desc: 'Sky to Teal', use: 'Analytical, charts', light: 'linear-gradient(135deg, #0284C7, #0D9488)', night: 'linear-gradient(135deg, #38BDF8, #2DD4BF)' },
];

const CONTRAST_DARK = [
  { pairing: 'Text Primary on Surface 0', ratio: '~14.5:1' },
  { pairing: 'Text Primary on Surface 1', ratio: '~12.2:1' },
  { pairing: 'Text Secondary on Surface 0', ratio: '~7.0:1' },
  { pairing: 'Orange on Surface 0', ratio: '~5.1:1' },
  { pairing: 'Electric Blue on Surface 0', ratio: '~4.8:1' },
  { pairing: 'Text Muted on Surface 1', ratio: '~4.7:1' },
];

const CONTRAST_NIGHT = [
  { pairing: 'Text Primary on Surface 0', ratio: '~18.3:1' },
  { pairing: 'Text Primary on Surface 1', ratio: '~12.1:1' },
  { pairing: 'Text Secondary on Surface 0', ratio: '~8.3:1' },
  { pairing: 'Orange on Surface 0', ratio: '~5.7:1' },
  { pairing: 'Electric Blue on Surface 0', ratio: '~7.9:1' },
  { pairing: 'Text Muted on Surface 1', ratio: '~3.5:1 (AA-large only)' },
];

const CROSS_MODE_MAP = [
  { light: '--lm-orange', dark: '--dm-orange', night: '--nm-orange', note: 'Same #FF5A28 across all' },
  { light: '--lm-light-orange', dark: '--dm-orange-muted', night: '--nm-orange-muted', note: 'Subtle dark orange tint' },
  { light: '--lm-electric-blue', dark: '--dm-electric-blue', night: '--nm-electric-blue', note: '#3EA6FF YouTube blue' },
  { light: '--lm-brand-blue', dark: '--dm-brand-blue', night: '--nm-brand-blue', note: '#8AB4F8 Google blue' },
  { light: '--lm-white (bg)', dark: '--dm-surface-0', night: '--nm-surface-0', note: '#0F0F0F YouTube near-black' },
  { light: '--lm-light-blue (bg)', dark: '--dm-surface-1', night: '--nm-surface-1', note: '#212121 YouTube card' },
  { light: '--lm-midnight-blue (headings)', dark: '--dm-text-primary', night: '--nm-text-primary', note: '#F1F1F1 YouTube text' },
  { light: '--lm-neutral-text (body)', dark: '--dm-text-secondary', night: '--nm-text-secondary', note: '#AAAAAA YouTube secondary' },
];

function PaletteTable({ title, palette }: { title: string; palette: typeof LIGHT_PALETTE }) {
  return (
    <div>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>{title}</h4>
      <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Token</th>
              <th style={headerCellStyle}>Hex</th>
              <th style={headerCellStyle}>Role</th>
            </tr>
          </thead>
          <tbody>
            {palette.map((p) => (
              <SwatchRow key={p.token} hex={p.hex} token={p.token} role={p.role} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BrandTokensReferenceShowcase() {
  return (
    <div style={{ maxWidth: 960 }}>
      {/* Reference companion callout */}
      <div
        style={{
          padding: '16px 20px',
          background: 'var(--color-primary-muted)',
          border: '1px solid var(--color-primary)',
          borderRadius: 8,
          marginBottom: 40,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 7 }} />
        <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
          This is a reference companion to <strong style={{ color: 'var(--color-text-heading)' }}>brand-design-system</strong>. It contains lookup data — token values, CSS blocks, and mapping tables. For usage rules, principles, and banned patterns, see the main skill.
        </p>
      </div>

      {/* Section 1: Light Mode Raw Palette */}
      <Section title="Light Mode Raw Palette">
        <PaletteTable title="" palette={LIGHT_PALETTE} />
      </Section>

      {/* Section 2: Dark Mode Raw Palette */}
      <Section title="Dark Mode Raw Palette">
        <PaletteTable title="" palette={DARK_PALETTE} />
      </Section>

      {/* Section 3: Night Mode Raw Palette */}
      <Section title="Night Mode Raw Palette">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, marginTop: 0 }}>
          Pure neutral dark surfaces modeled on YouTube / Google dark mode. Unlike dark mode&apos;s blue-tinted surfaces, night mode uses true neutral greys anchored on #0F0F0F.
        </p>
        <PaletteTable title="" palette={NIGHT_PALETTE} />
      </Section>

      {/* Section 4: Semantic Tokens — Core */}
      <Section title="Semantic Tokens — Core">
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Variable</th>
                <th style={headerCellStyle}>Role</th>
                <th style={headerCellStyle}>Preview</th>
              </tr>
            </thead>
            <tbody>
              {SEMANTIC_CORE.map((t) => (
                <tr key={t.variable}>
                  <td style={cellStyle}><code style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{t.variable}</code></td>
                  <td style={cellStyle}>{t.role}</td>
                  <td style={cellStyle}>
                    <div style={{ width: 32, height: 20, borderRadius: 4, background: `var(${t.variable})`, border: '1px solid var(--color-border)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 5: Semantic Tokens — Status + Shell */}
      <Section title="Semantic Tokens — Status & Shell">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Status Tokens</h4>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Variable</th>
                    <th style={headerCellStyle}>Role</th>
                    <th style={headerCellStyle}>Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {SEMANTIC_STATUS.map((t) => (
                    <tr key={t.variable}>
                      <td style={cellStyle}><code style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{t.variable}</code></td>
                      <td style={cellStyle}>{t.role}</td>
                      <td style={cellStyle}>
                        <div style={{ width: 32, height: 20, borderRadius: 4, background: `var(${t.variable})`, border: '1px solid var(--color-border)' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Shell Tokens</h4>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Variable</th>
                    <th style={headerCellStyle}>Role</th>
                    <th style={headerCellStyle}>Preview</th>
                  </tr>
                </thead>
                <tbody>
                  {SEMANTIC_SHELL.map((t) => (
                    <tr key={t.variable}>
                      <td style={cellStyle}><code style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{t.variable}</code></td>
                      <td style={cellStyle}>{t.role}</td>
                      <td style={cellStyle}>
                        <div style={{ width: 32, height: 20, borderRadius: 4, background: `var(${t.variable})`, border: '1px solid var(--color-border)' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 6: Complementary Colour Swatches */}
      <Section title="Complementary Colours">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, marginTop: 0 }}>
          Five Tailwind-sourced accent families for tags, badges, chart series, and categorisation. NOT status colours.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {COMPLEMENTARY.map((c) => (
            <div key={c.family} style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 12 }}>{c.family}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Swatch hex={c.light} label="Light (600)" />
                <Swatch hex={c.night} label="Night (400)" />
                <Swatch hex={c.mutedLight} label="Muted Light (100)" />
                <Swatch hex={c.mutedNight} label="Muted Night (950)" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 7: Gradients */}
      <Section title="Gradient Tokens">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {GRADIENTS.map((g) => (
            <div key={g.token} style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', height: 48 }}>
                <div style={{ flex: 1, background: g.light }} title="Light" />
                <div style={{ flex: 1, background: g.night }} title="Night" />
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <code style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)' }}>{g.token}</code>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Light | Night</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)', marginBottom: 2 }}>{g.desc}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{g.use}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 8: Cross-Mode Mapping */}
      <Section title="Light / Dark / Night Mapping">
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Light Mode</th>
                <th style={headerCellStyle}>Dark Mode</th>
                <th style={headerCellStyle}>Night Mode</th>
                <th style={headerCellStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {CROSS_MODE_MAP.map((row) => (
                <tr key={row.light}>
                  <td style={cellStyle}><code style={{ fontSize: 11 }}>{row.light}</code></td>
                  <td style={cellStyle}><code style={{ fontSize: 11 }}>{row.dark}</code></td>
                  <td style={cellStyle}><code style={{ fontSize: 11 }}>{row.night}</code></td>
                  <td style={{ ...cellStyle, fontSize: 12, color: 'var(--color-text-muted)' }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 9: Contrast References */}
      <Section title="Contrast References">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Dark Mode</h4>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Pairing</th>
                    <th style={headerCellStyle}>Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRAST_DARK.map((c) => (
                    <tr key={c.pairing}>
                      <td style={cellStyle}>{c.pairing}</td>
                      <td style={{ ...cellStyle, fontWeight: 600, fontFamily: 'monospace' }}>{c.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Night Mode</h4>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Pairing</th>
                    <th style={headerCellStyle}>Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTRAST_NIGHT.map((c) => (
                    <tr key={c.pairing}>
                      <td style={cellStyle}>{c.pairing}</td>
                      <td style={{ ...cellStyle, fontWeight: 600, fontFamily: 'monospace' }}>{c.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 10: Legacy Mode */}
      <Section title="Legacy Mode Tokens">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, marginTop: 0 }}>
          Pixel-perfect recreation of the original ezyCollect app. Uses hardcoded hex values, not :root palette tokens.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { token: '--color-primary', hex: '#FF6600' },
            { token: '--color-primary-hover', hex: '#cc5200' },
            { token: '--color-secondary', hex: '#169dd6' },
            { token: '--color-brand', hex: '#2494F2' },
            { token: '--color-bg', hex: '#F1F1F1' },
            { token: '--color-surface', hex: '#FFFFFF' },
            { token: '--color-border', hex: '#e6e6e6' },
            { token: '--color-text-heading', hex: '#333333' },
            { token: '--color-text-body', hex: '#666666' },
            { token: '--color-text-muted', hex: '#999999' },
            { token: '--color-success', hex: '#008000' },
            { token: '--color-danger', hex: '#C40000' },
            { token: '--color-sidebar-bg', hex: '#272930' },
            { token: '--color-sidebar-text', hex: '#c9d4f6' },
            { token: '--color-topnav-text-muted', hex: '#169dd6' },
          ].map((t) => (
            <div key={t.token} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--color-bg-alt)', borderRadius: 6, border: '1px solid var(--color-border)' }}>
              <div style={{ width: 24, height: 24, borderRadius: 4, background: t.hex, border: '1px solid var(--color-border)', flexShrink: 0 }} />
              <div>
                <code style={{ fontSize: 11, color: 'var(--color-secondary)', display: 'block' }}>{t.token}</code>
                <code style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{t.hex}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 11: Theme Selection Guide */}
      <Section title="When to Use Each Theme">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { theme: 'Light', desc: 'Default. Clean, professional, brand-forward.', status: 'Always present' },
            { theme: 'Night', desc: 'YouTube/Google neutral greys. Content-first. Best for low-light and OLED/AMOLED.', status: 'Always present' },
            { theme: 'Dark', desc: 'Blue-tinted surfaces. Carries brand identity. Polished for general dark use.', status: 'Only when requested' },
            { theme: 'Legacy', desc: 'Pixel-perfect original ezyCollect recreation. Own palette (#FF6600 orange, #272930 sidebar).', status: 'Only when requested' },
          ].map((t) => (
            <div key={t.theme} style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{t.theme}</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5, margin: 0, marginBottom: 8 }}>{t.desc}</p>
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 4,
                background: t.status === 'Always present' ? 'var(--color-success-muted)' : 'var(--color-warning-muted)',
                color: t.status === 'Always present' ? 'var(--color-success)' : 'var(--color-warning)',
              }}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

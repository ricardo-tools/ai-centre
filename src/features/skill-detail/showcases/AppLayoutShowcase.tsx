'use client';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const PatternLabel = ({ letter, name, badge }: { letter: string; name: string; badge?: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
    <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{letter}</span>
    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)' }}>{name}</span>
    {badge && <span style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'var(--color-primary-muted)', color: 'var(--color-primary)', fontWeight: 600 }}>{badge}</span>}
  </div>
);

/* Mini layout diagram boxes */
const Box = ({ label, bg, color, style: extra }: { label: string; bg: string; color: string; style?: React.CSSProperties }) => (
  <div style={{ background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, borderRadius: 3, ...extra }}>{label}</div>
);

export function AppLayoutShowcase() {
  return (
    <div>
      {/* ---- Pattern Overview ---- */}
      <Section title="Shell Layout Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>Four shell patterns define the outer frame of any page. Each adapts responsively across breakpoints.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Pattern A */}
          <div style={{ padding: 20, borderRadius: 8, border: '2px solid var(--color-primary)', background: 'var(--color-surface)' }}>
            <PatternLabel letter="A" name="TopBar + Sidebar" badge="This App" />
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gridTemplateRows: '24px 1fr', height: 160, gap: 2, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <Box label="" bg="var(--color-sidebar-bg)" color="var(--color-sidebar-text-active)" style={{ gridRow: '1 / -1' }} />
              <Box label="TopBar" bg="var(--color-topnav-bg)" color="var(--color-topnav-text)" />
              <Box label="Content" bg="var(--color-bg)" color="var(--color-text-muted)" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>Dashboard apps, admin panels — persistent sidebar navigation with top header.</p>
          </div>

          {/* Pattern B */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <PatternLabel letter="B" name="TopBar + Mega Menus" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: '24px 20px 1fr', height: 160, gap: 2, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <Box label="Logo  |  Nav Items  |  Controls" bg="var(--color-topnav-bg)" color="var(--color-topnav-text)" />
              <Box label="▼ Mega Menu Panel ▼" bg="var(--color-surface-hover)" color="var(--color-text-muted)" />
              <Box label="Content" bg="var(--color-bg)" color="var(--color-text-muted)" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>Marketing sites, e-commerce, content-heavy apps — full-width top navigation with dropdown mega menus.</p>
          </div>

          {/* Pattern C */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <PatternLabel letter="C" name="Sidebar Only" />
            <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gridTemplateRows: '1fr', height: 160, gap: 2, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
              <Box label="Nav" bg="var(--color-sidebar-bg)" color="var(--color-sidebar-text-active)" />
              <Box label="Content" bg="var(--color-bg)" color="var(--color-text-muted)" />
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>Figma/Linear-style tools, settings-heavy apps — no top bar, sidebar-driven navigation.</p>
          </div>

          {/* Pattern D */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <PatternLabel letter="D" name="Minimal / No Shell" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)' }}>
              <div style={{ width: 120, padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 6 }}>Login</div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--color-border)', marginBottom: 4 }} />
                <div style={{ height: 6, borderRadius: 3, background: 'var(--color-border)', marginBottom: 8 }} />
                <div style={{ height: 14, borderRadius: 4, background: 'var(--color-primary)' }} />
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8 }}>Login, onboarding, landing pages, full-screen editors — centered content, no navigation chrome.</p>
          </div>
        </div>
      </Section>

      {/* ---- Responsive Breakpoints ---- */}
      <Section title="Responsive Breakpoints">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'XS / SM', range: '< 768px', desc: 'Mobile: hamburger drawer, stacked layout, full-width content', color: 'var(--color-danger)' },
            { label: 'MD', range: '768 – 1023px', desc: 'Tablet: condensed nav, "More" overflow, icon-only sidebars', color: 'var(--color-warning)' },
            { label: 'LG', range: '1024px+', desc: 'Desktop: full navigation, mega menus, expanded sidebars', color: 'var(--color-success)' },
          ].map((bp) => (
            <div key={bp.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ width: 8, height: 40, borderRadius: 4, background: bp.color, flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-heading)' }}>{bp.label}</span>
                  <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{bp.range}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{bp.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Pattern B Deep Dive ---- */}
      <Section title="Pattern B — TopBar Deep Dive">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>The top navigation bar uses a 3-zone layout at desktop: Logo (fixed 160px), Nav Items (flex), Right Controls.</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {/* Desktop TopBar mockup */}
          <div style={{ display: 'flex', height: 48, background: 'var(--color-topnav-bg)', borderBottom: '1px solid var(--color-topnav-border)', alignItems: 'center', padding: '0 16px' }}>
            <span style={{ width: 120, fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', flexShrink: 0 }}>Logo</span>
            <div style={{ flex: 1, display: 'flex', gap: 0, height: '100%', alignItems: 'center' }}>
              {['Home', 'Skills', 'Archetypes', 'Docs'].map((item, i) => (
                <span key={item} style={{ padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: i === 1 ? 600 : 400, color: i === 1 ? 'var(--color-topnav-text)' : 'var(--color-topnav-text-muted)', borderBottom: i === 1 ? '2px solid var(--color-primary)' : '2px solid transparent' }}>{item}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--color-text-muted)' }} />
              </div>
            </div>
          </div>
          {/* Mega menu open */}
          <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {['Getting Started', 'Core Skills', 'Resources'].map((section) => (
                <div key={section}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{section}</p>
                  {['Link item one', 'Link item two', 'Link item three'].map((link, i) => (
                    <p key={i} style={{ fontSize: 13, color: 'var(--color-secondary)', margin: '4px 0', cursor: 'pointer' }}>{link}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Content area */}
          <div style={{ height: 80, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Page Content</span>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', fontSize: 13, color: 'var(--color-text-body)' }}>
            <strong>Hover trigger:</strong> 150ms delay on desktop, click-only on tablet/mobile
          </div>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', fontSize: 13, color: 'var(--color-text-body)' }}>
            <strong>Keyboard:</strong> Tab between items, Enter/Space opens, ArrowDown enters menu, Escape closes
          </div>
        </div>
      </Section>

      {/* ---- Grid Config ---- */}
      <Section title="Grid System">
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Responsive Grid Config</p>
          <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8, color: 'var(--color-text-body)' }}>
            <div><span style={{ color: 'var(--color-text-muted)' }}>columns:</span> <span style={{ color: 'var(--color-secondary)' }}>{'{ default: 1, md: 2, lg: 4 }'}</span></div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>gap:</span> <span style={{ color: 'var(--color-secondary)' }}>{'{ default: 16, lg: 24 }'}</span></div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>rowHeight:</span> <span style={{ color: 'var(--color-secondary)' }}>{'{ default: "auto", lg: 60 }'}</span></div>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: 16, borderRadius: 8, background: 'var(--color-bg-alt)' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 48, borderRadius: 6, background: 'var(--color-surface)', border: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--color-text-muted)' }}>
              Widget {i + 1}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Pattern C Deep Dive ---- */}
      <Section title="Pattern C — Sidebar Deep Dive">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>No top bar. Three vertical zones: fixed logo, scrollable nav, fixed footer. Icon-only at MD, full at LG.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* LG full sidebar */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>LG — Full Sidebar (220px)</span>
            </div>
            <div style={{ display: 'flex', height: 220 }}>
              <div style={{ width: 140, background: 'var(--color-sidebar-bg)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
                {/* Zone 1: Logo */}
                <div style={{ padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-sidebar-text-active)' }}>Logo</span>
                </div>
                {/* Zone 2: Nav (scrollable) */}
                <div style={{ flex: 1, padding: '6px 0', overflow: 'hidden' }}>
                  <div style={{ padding: '6px 8px 2px', fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Section</div>
                  {['Dashboard', 'Skills', 'Archetypes', 'Generate'].map((item, i) => (
                    <div key={item} style={{ margin: '1px 6px', padding: '5px 8px', borderRadius: 4, fontSize: 10, color: i === 0 ? 'var(--color-sidebar-text-active)' : 'var(--color-sidebar-text)', background: i === 0 ? 'var(--color-sidebar-hover)' : 'transparent', fontWeight: i === 0 ? 600 : 400 }}>{item}</div>
                  ))}
                </div>
                {/* Zone 3: Footer */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 12px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>User</span>
                </div>
              </div>
              <div style={{ flex: 1, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Content</span>
              </div>
            </div>
          </div>
          {/* MD icon-only sidebar */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>MD — Icon-Only (48px)</span>
            </div>
            <div style={{ display: 'flex', height: 220 }}>
              <div style={{ width: 36, background: 'var(--color-sidebar-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 8, flexShrink: 0 }}>
                <div style={{ width: 16, height: 16, borderRadius: 3, background: 'rgba(255,255,255,0.3)' }} />
                <div style={{ height: 1, borderTop: '1px solid rgba(255,255,255,0.1)', width: 16 }} />
                {[0.6, 0.4, 0.4, 0.4].map((op, i) => (
                  <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: `rgba(255,255,255,${op})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: i === 0 ? 'rgba(255,255,255,0.5)' : 'transparent' }} />
                  </div>
                ))}
              </div>
              <div style={{ flex: 1, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Content (maximized)</span>
              </div>
            </div>
            <div style={{ padding: '8px 12px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Tooltips appear on hover (400ms delay). No text labels, no section headers.</p>
            </div>
          </div>
        </div>
        {/* 3-zone explanation */}
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {[
            { zone: 'Zone 1: Logo', height: '56px (fixed)', scroll: 'No', details: 'Logo 28px height, borderBottom separator, matches topbar height for consistency' },
            { zone: 'Zone 2: Nav', height: 'flex: 1', scroll: 'Yes (overflowY: auto)', details: 'Sections with headers, nav items with marginInline:8 for rounded inset style' },
            { zone: 'Zone 3: Footer', height: 'auto (fixed)', scroll: 'No', details: 'Avatar 32×32, user name, settings gear, optional ThemeSwitcher' },
          ].map((z, i) => (
            <div key={z.zone} style={{ display: 'flex', padding: '10px 16px', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)', width: 120, flexShrink: 0 }}>{z.zone}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', width: 120, flexShrink: 0 }}>{z.height}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{z.details}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Pattern D Deep Dive ---- */}
      <Section title="Pattern D — Minimal Deep Dive">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>No persistent navigation. Optional logo-only header. Content centered with breakpoint-aware max-widths.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Mobile */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>XS/SM — Full Width</span>
            </div>
            <div style={{ height: 160, background: 'var(--color-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--color-text-heading)' }}>Logo</span>
              </div>
              <div style={{ flex: 1, width: '85%', display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', padding: 12, borderRadius: 0, background: 'var(--color-surface)' }}>
                  <div style={{ height: 5, borderRadius: 2, background: 'var(--color-border)', marginBottom: 4, width: '60%' }} />
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--color-border)', marginBottom: 8 }} />
                  <div style={{ height: 12, borderRadius: 3, background: 'var(--color-primary)' }} />
                </div>
              </div>
            </div>
            <div style={{ padding: '6px 12px', borderTop: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>Edge-to-edge card, no border/radius</p>
            </div>
          </div>
          {/* Tablet */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>MD — max 480px</span>
            </div>
            <div style={{ height: 160, background: 'var(--color-bg-alt)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--color-text-heading)' }}>Logo</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 120, padding: 12, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ height: 5, borderRadius: 2, background: 'var(--color-border)', marginBottom: 4, width: '60%' }} />
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--color-border)', marginBottom: 8 }} />
                  <div style={{ height: 12, borderRadius: 3, background: 'var(--color-primary)' }} />
                </div>
              </div>
            </div>
          </div>
          {/* Desktop */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>LG — max 520px</span>
            </div>
            <div style={{ height: 160, background: 'var(--color-bg-alt)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%', height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--color-text-heading)' }}>Logo</span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: 130, padding: 14, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                  <div style={{ height: 5, borderRadius: 2, background: 'var(--color-border)', marginBottom: 4, width: '60%' }} />
                  <div style={{ height: 4, borderRadius: 2, background: 'var(--color-border)', marginBottom: 8 }} />
                  <div style={{ height: 12, borderRadius: 3, background: 'var(--color-primary)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background treatments */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Solid (default)', desc: 'var(--color-bg) or var(--color-bg-alt)', bg: 'var(--color-bg-alt)' },
            { label: 'Gradient', desc: 'Subtle neutral gradient for landing/onboarding', bg: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 100%)' },
            { label: 'Image + Frosted Card', desc: 'backdropFilter: blur(8px) on card', bg: 'var(--color-bg-alt)' },
          ].map((opt) => (
            <div key={opt.label} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: opt.bg }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{opt.label}</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{opt.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Mobile Navigation ---- */}
      <Section title="Mobile Navigation">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Patterns A, B, and C collapse to a drawer on XS/SM. Pattern D has no persistent navigation and therefore no drawer.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Drawer specs */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Drawer Specs</p>
            {[
              { prop: 'Width', val: '280px' },
              { prop: 'Height', val: '100vh' },
              { prop: 'Animation', val: 'translateX(-100% → 0), 250ms' },
              { prop: 'Ease', val: 'cubic-bezier(0.16, 1, 0.3, 1)' },
              { prop: 'z-index', val: '200 (drawer), 199 (backdrop)' },
              { prop: 'Backdrop', val: 'rgba(0,0,0,0.4)' },
              { prop: 'Close', val: 'Swipe left, tap backdrop, X button' },
              { prop: 'Open gesture', val: 'Swipe from left edge (first 20px)' },
            ].map((item) => (
              <div key={item.prop} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-body)' }}>{item.prop}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{item.val}</span>
              </div>
            ))}
          </div>
          {/* Accordion mockup */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-surface)' }}>
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Accordion Nav</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>✕</span>
            </div>
            {/* Expanded category */}
            <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)' }}>Skills</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>▾</span>
            </div>
            {['Browse All', 'Official', 'Community', 'My Skills'].map((sub) => (
              <div key={sub} style={{ padding: '8px 16px 8px 32px', fontSize: 13, color: 'var(--color-text-body)', borderBottom: '1px solid var(--color-border)' }}>{sub}</div>
            ))}
            {/* Collapsed category */}
            <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)' }}>Archetypes</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>▸</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Mega Menu Panel Specs ---- */}
      <Section title="Mega Menu Panel Specs">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Positioning & Chrome</p>
            {[
              { prop: 'Full-width', val: 'left:0, right:0 — for 3+ sections' },
              { prop: 'Content-width', val: 'min:480px, max:720px — for 1-2 sections' },
              { prop: 'Background', val: 'var(--color-surface)' },
              { prop: 'Border', val: '1px solid var(--color-border), borderTop:none' },
              { prop: 'Border radius', val: '0 0 8px 8px (bottom only)' },
              { prop: 'Shadow', val: '0 8px 24px rgba(0,0,0,0.12)' },
              { prop: 'z-index', val: '100 (panel), 99 (backdrop)' },
              { prop: 'Backdrop', val: 'rgba(0,0,0,0.15)' },
            ].map((item) => (
              <div key={item.prop} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-body)' }}>{item.prop}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.val}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Animation & Interaction</p>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: 4 }}>Open</span>
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>translateY(-8px) → 0, opacity 0→1, 200ms</code>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: 4 }}>Close</span>
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>opacity 1→0, 150ms, ease-in</code>
            </div>
            <div style={{ marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: 4 }}>Desktop trigger</span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>Hover opens after 150ms delay. Click also toggles. Hover away closes after 300ms.</p>
            </div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: 4 }}>Keyboard</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {['Tab', 'Enter/Space', 'ArrowDown', 'ArrowUp', 'ArrowL/R', 'Escape'].map((key) => (
                  <span key={key} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-body)', fontFamily: 'monospace' }}>{key}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Dashboard Content Grid ---- */}
      <Section title="Dashboard Content Grid">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Responsive content layout inside the shell — stacked on mobile, paired on tablet, full 12-column on desktop.</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 16 }}>
          {[
            { bp: 'XS (< 640px)', cols: '1', rowH: 'auto', gap: '12px', layout: 'Widgets stacked vertically' },
            { bp: 'SM (640–767px)', cols: '2', rowH: 'auto', gap: '12px', layout: 'KPIs paired, charts full width' },
            { bp: 'MD (768–1023px)', cols: '2', rowH: 'auto', gap: '16px', layout: 'Same as SM with more gap' },
            { bp: 'LG (1024+)', cols: '12', rowH: '60px', gap: '16px', layout: 'Full desktop grid' },
          ].map((row, i) => (
            <div key={row.bp} style={{ display: 'flex', padding: '10px 16px', borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', width: 140, flexShrink: 0 }}>{row.bp}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', width: 60, flexShrink: 0 }}>{row.cols} col</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', width: 60, flexShrink: 0 }}>{row.rowH}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.layout}</span>
            </div>
          ))}
        </div>
        {/* Visual grid demo */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4, padding: 16, borderRadius: 8, background: 'var(--color-bg-alt)' }}>
          {[
            { col: '1 / span 4', row: '1 / span 1', label: 'KPI' },
            { col: '5 / span 4', row: '1 / span 1', label: 'KPI' },
            { col: '9 / span 4', row: '1 / span 1', label: 'KPI' },
            { col: '1 / span 8', row: '2 / span 2', label: 'Chart' },
            { col: '9 / span 4', row: '2 / span 2', label: 'Table' },
          ].map((w, i) => (
            <div key={i} style={{ gridColumn: w.col, gridRow: w.row, height: w.label === 'KPI' ? 36 : 72, borderRadius: 6, background: 'var(--color-surface)', border: '1px dashed var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--color-text-muted)' }}>
              {w.label}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>Content grids use uniform <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>1fr</code> columns (no columnTemplate). Dashboard wrapper adds <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>background: var(--color-bg-alt)</code> and <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>padding: 16</code>.</p>
        </div>
      </Section>

      {/* ---- Spacing Principles ---- */}
      <Section title="Spacing Principles">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Intentional grouping: related items closer together, distinct controls further apart.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Right Controls Grouping</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 12, background: 'var(--color-bg-alt)', borderRadius: 6 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ padding: '4px 10px', borderRadius: 99, background: 'var(--color-topnav-badge-bg)', fontSize: 10, color: 'var(--color-topnav-badge-text)' }}>Badge</div>
                <div style={{ padding: '4px 10px', borderRadius: 99, background: 'var(--color-topnav-badge-bg)', fontSize: 10, color: 'var(--color-topnav-badge-text)' }}>Badge</div>
              </div>
              <div style={{ width: 1, height: 20, background: 'var(--color-border)' }} />
              <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--color-bg-alt)' }} />
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-secondary)' }} />
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 10, color: 'var(--color-text-muted)' }}>
              <span>← gap: 8 →</span>
              <span>← gap: 10 →</span>
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Horizontal Padding by Breakpoint</p>
            {[
              { bp: 'XS/SM', nav: '12px', mega: '16px', content: '16px' },
              { bp: 'MD', nav: '16px', mega: '20px', content: '16px' },
              { bp: 'LG', nav: '24px', mega: '24px', content: '16px' },
            ].map((row) => (
              <div key={row.bp} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', width: 56 }}>{row.bp}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>Nav: {row.nav}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>Mega: {row.mega}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>Content: {row.content}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Failure Patterns ---- */}
      <Section title="Failure Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Common layout mistakes and how to fix them.</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', padding: '10px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Failure</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Why It Happens</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fix</span>
          </div>
          {/* Table rows */}
          {[
            { failure: 'Sidebar overlaps content on tablet', cause: 'Missing responsive breakpoint', fix: 'Use responsive columnTemplate' },
            { failure: 'z-index conflicts', cause: 'No z-index system', fix: 'TopBar: 100, Sidebar: 90, Modal: 200' },
            { failure: 'Not keyboard accessible', cause: 'Click-only nav', fix: 'Use button/a with keyboard handlers' },
            { failure: 'Shell height > 100vh', cause: 'Fixed + scrollable conflict', fix: 'Shell height: 100vh, content overflow: auto' },
            { failure: 'Mobile nav missing', cause: 'No drawer implemented', fix: 'Add hamburger + drawer at XS/SM' },
            { failure: 'Sidebar state lost on navigation', cause: 'Component remounts', fix: 'Lift sidebar state to shell' },
            { failure: 'TopBar obscures content on scroll', cause: 'Fixed position without offset', fix: 'Add padding-top equal to TopBar height' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '10px 16px', borderBottom: i < 6 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-danger)', paddingRight: 12 }}>{row.failure}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-muted)', paddingRight: 12 }}>{row.cause}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{row.fix}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

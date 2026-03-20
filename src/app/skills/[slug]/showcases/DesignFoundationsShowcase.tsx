'use client';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function DesignFoundationsShowcase() {
  return (
    <div>
      {/* ---- Spacing Scale ---- */}
      <Section title="8px Spacing System">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Every spacing value derives from the 8px base unit. This creates consistent rhythm across all layouts.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { name: 'Tight', value: 4, usage: 'Icon + label, inline elements' },
            { name: 'Small', value: 8, usage: 'Related items within a group' },
            { name: 'Medium', value: 16, usage: 'Between groups, form fields' },
            { name: 'Large', value: 24, usage: 'Between sections' },
            { name: 'XLarge', value: 32, usage: 'Major separation' },
            { name: 'XXLarge', value: 48, usage: 'Page-level spacing' },
          ].map((s) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '8px 0' }}>
              <span style={{ width: 70, fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-muted)', textAlign: 'right', flexShrink: 0 }}>{s.value}px</span>
              <div style={{ width: s.value, height: 32, background: 'var(--color-primary)', borderRadius: 3, flexShrink: 0, minWidth: 4 }} />
              <div style={{ width: s.value * 4, height: 32, background: 'var(--color-primary)', opacity: 0.2, borderRadius: 3, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.name}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>{s.usage}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Vertical Rhythm ---- */}
      <Section title="Vertical Rhythm">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>When stacking elements vertically, spacing should follow a predictable pattern. The viewer intuitively feels the grouping without needing explicit dividers.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Same-group items */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 10, width: '60%', borderRadius: 3, background: 'var(--color-text-heading)', opacity: 0.8, marginBottom: 3 }} />
                  <div style={{ height: 7, width: '40%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.5 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 1, height: 16, background: 'var(--color-secondary)' }} />
                  <span style={{ fontSize: 9, color: 'var(--color-secondary)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>2-4px</span>
                </div>
              </div>

              {/* Between groups gap */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                <div style={{ flex: 1, borderTop: '1px dashed var(--color-border)' }} />
                <span style={{ fontSize: 9, color: 'var(--color-secondary)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>16-24px between groups</span>
              </div>

              {/* Second group */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 10, width: '55%', borderRadius: 3, background: 'var(--color-text-heading)', opacity: 0.8, marginBottom: 3 }} />
                  <div style={{ height: 7, width: '70%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.5, marginBottom: 3 }} />
                  <div style={{ height: 7, width: '50%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.5 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 1, height: 16, background: 'var(--color-secondary)' }} />
                  <span style={{ fontSize: 9, color: 'var(--color-secondary)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>2-4px</span>
                </div>
              </div>

              {/* Between sections gap */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 40 }}>
                <div style={{ flex: 1, borderTop: '2px dashed var(--color-primary)', opacity: 0.3 }} />
                <span style={{ fontSize: 9, color: 'var(--color-primary)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>32-48px between sections</span>
              </div>

              {/* New section */}
              <div style={{ marginTop: 40 }}>
                <div style={{ height: 12, width: '45%', borderRadius: 3, background: 'var(--color-text-heading)', opacity: 0.8, marginBottom: 8 }} />
                <div style={{ height: 7, width: '80%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.5 }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { level: 'Same-group', spacing: '2-4px', example: 'Name + job title', color: 'var(--color-secondary)' },
              { level: 'Between groups', spacing: '16-24px', example: 'Name/title block to contact block', color: 'var(--color-secondary)' },
              { level: 'Between sections', spacing: '32-48px', example: 'Content area to footer', color: 'var(--color-primary)' },
            ].map((item) => (
              <div key={item.level} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.level}</span>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: item.color }}>{item.spacing}</code>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, paddingLeft: 16 }}>{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Visual Hierarchy ---- */}
      <Section title="Visual Hierarchy">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Max 3-4 levels. The primary element should be identifiable within 1 second.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clear Hierarchy</p>
            <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>Primary</p>
              <p style={{ fontSize: 16, fontWeight: 400, color: 'var(--color-text-body)', margin: '0 0 8px' }}>Secondary supporting text</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 16px' }}>Tertiary — caption or metadata</p>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', opacity: 0.6 }}>Ambient: borders, dividers, subtle patterns</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Flat — No Hierarchy</p>
            <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-body)', margin: '0 0 4px' }}>Everything looks</p>
              <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-body)', margin: '0 0 4px' }}>the same weight</p>
              <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-body)', margin: '0 0 4px' }}>and same size</p>
              <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-body)', margin: 0 }}>nothing stands out</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Scale & Proportion ---- */}
      <Section title="Scale & Proportion">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Use a mathematical ratio to derive sizes. Harmony comes from proportional relationships, not arbitrary values.</p>
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          {[
            { label: 'Caption', size: 12, ratio: '0.75×' },
            { label: 'Body', size: 16, ratio: '1× base' },
            { label: 'H3', size: 20, ratio: '1.25×' },
            { label: 'H2', size: 25, ratio: '1.56×' },
            { label: 'H1', size: 31, ratio: '1.95×' },
          ].map((t) => (
            <div key={t.label} style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 56, textAlign: 'right', fontFamily: 'monospace', flexShrink: 0 }}>{t.ratio}</span>
              <span style={{ fontSize: t.size, fontWeight: t.size > 20 ? 600 : 400, color: 'var(--color-text-heading)', lineHeight: 1.2 }}>{t.label} — {t.size}px</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12, paddingLeft: 72 }}>Major Third ratio (1.25) from 16px base</p>
        </div>
      </Section>

      {/* ---- Contrast ---- */}
      <Section title="Contrast">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Make differences decisive. If two elements are supposed to be different, make them obviously different.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Decisive Contrast</p>
            <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>Heading</p>
              <p style={{ fontSize: 14, fontWeight: 400, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>Body text — the size, weight, and color differences are unmistakable</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ambiguous Contrast</p>
            <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <p style={{ fontSize: 17, fontWeight: 500, color: 'var(--color-text-body)', margin: '0 0 4px' }}>Heading</p>
              <p style={{ fontSize: 15, fontWeight: 400, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>Is this a heading or body text? A 2px size difference is ambiguous — intentional or a bug?</p>
            </div>
          </div>
        </div>

        {/* Types of Contrast */}
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginTop: 24, marginBottom: 12 }}>Five Types of Contrast</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
          {/* Size */}
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6, marginBottom: 8, height: 40 }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: 'var(--color-primary)', opacity: 0.6 }} />
              <div style={{ width: 32, height: 32, borderRadius: 4, background: 'var(--color-primary)' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Size</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Large vs small establishes hierarchy</p>
          </div>
          {/* Weight */}
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, marginBottom: 8, height: 40 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>Bold</span>
              <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--color-text-muted)' }}>Light</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Weight</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Bold vs light distinguishes roles</p>
          </div>
          {/* Color */}
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8, height: 40 }}>
              <div style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--color-primary)' }} />
              <div style={{ width: 24, height: 24, borderRadius: 4, background: 'var(--color-text-muted)', opacity: 0.25 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Color</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Saturated vs muted signals state</p>
          </div>
          {/* Density */}
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8, height: 40 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                {[1,2,3,4,5,6,7,8,9].map((i) => <div key={i} style={{ width: 6, height: 6, borderRadius: 1, background: 'var(--color-border)' }} />)}
              </div>
              <div style={{ width: 20, height: 20, borderRadius: 3, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Density</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Dense vs sparse controls pacing</p>
          </div>
          {/* Shape */}
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8, height: 40 }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: 'var(--color-primary)', opacity: 0.6 }} />
              <div style={{ width: 24, height: 24, borderRadius: 3, background: 'var(--color-primary)', opacity: 0.6 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Shape</span>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Circle in a field of rectangles stands out</p>
          </div>
        </div>

        {/* WCAG Contrast Minimums */}
        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>WCAG Accessibility Minimums:</strong>{' '}
            <span style={{ fontFamily: 'monospace', fontSize: 11 }}>4.5:1</span> normal text{' '}
            <span style={{ color: 'var(--color-text-muted)' }}>|</span>{' '}
            <span style={{ fontFamily: 'monospace', fontSize: 11 }}>3:1</span> large text (18px+ or 14px+ bold){' '}
            <span style={{ color: 'var(--color-text-muted)' }}>|</span>{' '}
            <span style={{ fontFamily: 'monospace', fontSize: 11 }}>3:1</span> UI components. Use a contrast checker — don{"'"}t eyeball it.
          </p>
        </div>
      </Section>

      {/* ---- Negative Space ---- */}
      <Section title="Negative Space">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Coverage varies by composition — Hero/Title: 25-40%, CTA: 20-35%, Quote: 30-45%, Card: 55-70%, Dashboard: 65-80%. Isolation = emphasis.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Breathing Room</p>
            <div style={{ padding: 48, borderRadius: 8, background: 'var(--color-bg-alt)', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 8px' }}>Featured</p>
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>Space draws the eye here</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cramped</p>
            <div style={{ padding: 8, borderRadius: 8, background: 'var(--color-bg-alt)', flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '0 0 4px' }}>Too much content</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '0 0 4px' }}>packed into a small area</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '0 0 4px' }}>with no room to breathe</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '0 0 4px' }}>everything feels tense</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '0 0 4px' }}>and overwhelming</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>hard to find focus</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Alignment ---- */}
      <Section title="Alignment">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Pick one dominant system per composition. Maintain invisible alignment lines.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aligned</p>
            <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', borderLeft: '2px solid var(--color-secondary)', flex: 1 }}>
              <div style={{ height: 12, width: '80%', borderRadius: 3, background: 'var(--color-text-heading)', opacity: 0.8, marginBottom: 8 }} />
              <div style={{ height: 8, width: '60%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.5, marginBottom: 16 }} />
              <div style={{ height: 8, width: '90%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 6 }} />
              <div style={{ height: 8, width: '85%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 6 }} />
              <div style={{ height: 8, width: '70%', borderRadius: 3, background: 'var(--color-border)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Misaligned</p>
            <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <div style={{ height: 12, width: '70%', borderRadius: 3, background: 'var(--color-text-heading)', opacity: 0.8, marginBottom: 8, marginLeft: 12 }} />
              <div style={{ height: 8, width: '50%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.5, marginBottom: 16, marginLeft: 4 }} />
              <div style={{ height: 8, width: '80%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 6, marginLeft: 20 }} />
              <div style={{ height: 8, width: '75%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 6, marginLeft: 8 }} />
              <div style={{ height: 8, width: '65%', borderRadius: 3, background: 'var(--color-border)', marginLeft: 16 }} />
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Cross-Element Inner Alignment ---- */}
      <Section title="Cross-Element Inner Alignment">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Inner elements of sibling containers must share horizontal lines — titles at the same height, descriptions at the same start, actions at the same bottom.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aligned Zones</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1 }}>
              {[
                { title: 'Analytics', desc: 'Real-time metrics' },
                { title: 'User Management & Permissions', desc: 'Role-based access' },
                { title: 'Reports', desc: 'Export in any format' },
              ].map((card) => (
                <div key={card.title} style={{ display: 'flex', flexDirection: 'column', padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, marginBottom: 8, flexShrink: 0 }} />
                  <div style={{ minHeight: 32, marginBottom: 6 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.3, margin: 0 }}>{card.title}</p>
                  </div>
                  <p style={{ fontSize: 10, color: 'var(--color-text-muted)', lineHeight: 1.4, margin: 0, flex: 1 }}>{card.desc}</p>
                  <div style={{ height: 20, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.08, marginTop: 8, flexShrink: 0 }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>No Zone Alignment</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1 }}>
              {[
                { title: 'Analytics', desc: 'Real-time metrics', iconSize: 20, pad: 12 },
                { title: 'User Management & Permissions', desc: 'Role-based access for all team members across orgs', iconSize: 28, pad: 16 },
                { title: 'Reports', desc: 'Export', iconSize: 16, pad: 10 },
              ].map((card) => (
                <div key={card.title} style={{ padding: card.pad, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                  <div style={{ width: card.iconSize, height: card.iconSize, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, marginBottom: 8 }} />
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.3, margin: '0 0 6px' }}>{card.title}</p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-muted)', lineHeight: 1.4, margin: 0 }}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Proximity ---- */}
      <Section title="Proximity & Grouping">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Close = related. Far = separate. Group tight, separate wide.</p>
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Personal Info</span>
              <div style={{ height: 28, width: 180, borderRadius: 4, border: '1px solid var(--color-border)' }} />
              <div style={{ height: 28, width: 180, borderRadius: 4, border: '1px solid var(--color-border)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Preferences</span>
              <div style={{ height: 28, width: 180, borderRadius: 4, border: '1px solid var(--color-border)' }} />
              <div style={{ height: 28, width: 180, borderRadius: 4, border: '1px solid var(--color-border)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>8px within groups</span>
            <div style={{ flex: 1, borderTop: '1px dashed var(--color-border)' }} />
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>48px between groups</span>
          </div>
        </div>
      </Section>

      {/* ---- Gestalt: Continuation ---- */}
      <Section title="Gestalt: Continuation">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>The eye follows lines, curves, and edges. Align elements along invisible lines to create visual flow.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aligned — Eye Follows the Edge</p>
            <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1, position: 'relative' }}>
              {/* Left edge guide */}
              <div style={{ position: 'absolute', left: 24, top: 16, bottom: 16, width: 1, borderLeft: '1px dashed var(--color-secondary)', opacity: 0.4 }} />
              <div style={{ height: 12, width: '60%', borderRadius: 3, background: 'var(--color-text-heading)', opacity: 0.8, marginBottom: 6 }} />
              <div style={{ height: 8, width: '45%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.4, marginBottom: 16 }} />
              <div style={{ height: 8, width: '80%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 6 }} />
              <div style={{ height: 8, width: '75%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 6 }} />
              <div style={{ height: 8, width: '70%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 16 }} />
              <div style={{ height: 28, width: 80, borderRadius: 6, background: 'var(--color-primary)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Broken Line — Eye Stumbles</p>
            <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <div style={{ height: 12, width: '60%', borderRadius: 3, background: 'var(--color-text-heading)', opacity: 0.8, marginBottom: 6, marginLeft: 16 }} />
              <div style={{ height: 8, width: '45%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.4, marginBottom: 16 }} />
              <div style={{ height: 8, width: '80%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 6, marginLeft: 8 }} />
              <div style={{ height: 8, width: '75%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 6 }} />
              <div style={{ height: 8, width: '70%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 16, marginLeft: 24 }} />
              <div style={{ height: 28, width: 80, borderRadius: 6, background: 'var(--color-primary)', marginLeft: 12 }} />
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Gestalt: Closure ---- */}
      <Section title="Gestalt: Closure">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>The brain fills in gaps to perceive complete shapes. Incomplete forms signal {"\""}there is more.{"\""}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom: 12 }}>
              <circle cx="40" cy="40" r="36" fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeDasharray="180 50" />
            </svg>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>Progress Ring</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Incomplete circle implies progress toward whole</p>
          </div>
          <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, background: 'var(--color-bg-alt)', flexShrink: 0 }} />
              <div style={{ width: 64, height: 64, borderRadius: 8, background: 'var(--color-bg-alt)', flexShrink: 0 }} />
              <div style={{ width: 64, height: 64, borderRadius: 8, background: 'var(--color-bg-alt)', flexShrink: 0, opacity: 0.5, marginRight: -32 }} />
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '12px 0 2px' }}>Peek-Through Card</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Partial element at edge means {"\""}scroll for more{"\""}</p>
          </div>
          <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <svg width="80" height="80" viewBox="0 0 80 80" style={{ marginBottom: 12 }}>
              <circle cx="20" cy="30" r="18" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
              <circle cx="60" cy="30" r="18" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
              <circle cx="40" cy="58" r="18" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
            </svg>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>Implied Shape</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Three circles, brain sees a triangle</p>
          </div>
        </div>
      </Section>

      {/* ---- Gestalt: Figure/Ground ---- */}
      <Section title="Gestalt: Figure/Ground">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Viewers separate elements into foreground (figure) and background (ground). Clear separation = clear focus.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clear Separation</p>
            <div style={{ padding: 24, borderRadius: 8, background: 'var(--color-bg-alt)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>Modal Content</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>Shadow and border create clear figure/ground</p>
                <div style={{ height: 28, width: 80, borderRadius: 6, background: 'var(--color-primary)' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ambiguous Separation</p>
            <div style={{ padding: 24, borderRadius: 8, background: 'var(--color-surface)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>Is this a card?</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>No border, no shadow — content blends with background</p>
                <div style={{ height: 28, width: 80, borderRadius: 6, background: 'var(--color-primary)' }} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Gestalt: Common Region ---- */}
      <Section title="Gestalt: Common Region">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Elements inside a shared boundary are perceived as grouped — even overriding proximity.</p>
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {/* Grouped by region despite distance */}
            <div style={{ flex: 1, padding: 16, borderRadius: 8, background: 'var(--color-bg-alt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-primary)', opacity: 0.15 }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>Far apart but grouped by shared background</span>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-primary)', opacity: 0.15 }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-border)' }} />
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-border)' }} />
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-border)', marginRight: 8 }} />
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-border)' }} />
            <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--color-border)' }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>Close together but no boundary — perceived as one big group, not two distinct ones</p>
        </div>
      </Section>

      {/* ---- Gestalt: Similarity ---- */}
      <Section title="Gestalt: Similarity">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Elements sharing visual attributes are perceived as related. Break the pattern deliberately to create a focal point.</p>
        <div style={{ padding: 32, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ width: 40, height: 40, borderRadius: 8, background: i === 4 ? 'var(--color-primary)' : 'var(--color-border)' }} />
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', margin: '0 0 24px' }}>One different element becomes the instant focal point</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ width: 40, height: 40, borderRadius: i === 3 ? 20 : 8, background: 'var(--color-border)' }} />
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', margin: '16px 0 0' }}>Shape difference also breaks the pattern — the circle stands out from rectangles</p>
        </div>
      </Section>

      {/* ---- Compositional Balance ---- */}
      <Section title="Compositional Balance">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Balance is even distribution of visual weight. Asymmetrical balance is harder to execute but produces more engaging compositions.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Symmetrical</p>
            <div style={{ padding: 32, borderRadius: 8, background: 'var(--color-bg-alt)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, background: 'var(--color-primary)', opacity: 0.15 }} />
              <div style={{ width: 2, height: 48, background: 'var(--color-border)' }} />
              <div style={{ width: 64, height: 64, borderRadius: 8, background: 'var(--color-primary)', opacity: 0.15 }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asymmetrical (Balanced)</p>
            <div style={{ padding: 32, borderRadius: 8, background: 'var(--color-bg-alt)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
              <div style={{ width: 88, height: 88, borderRadius: 12, background: 'var(--color-primary)', opacity: 0.2 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ width: 56, height: 10, borderRadius: 3, background: 'var(--color-text-heading)', opacity: 0.6 }} />
                <div style={{ width: 80, height: 6, borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.3 }} />
                <div style={{ width: 64, height: 6, borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.3 }} />
                <div style={{ width: 48, height: 6, borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.3 }} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Visual Weight ---- */}
      <Section title="Visual Weight">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Every element has weight — how much it attracts the eye. Understanding weight lets you balance compositions intentionally.</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Weight Factors</span>
          </div>
          {[
            { factor: 'Size', heavier: 'Larger', lighter: 'Smaller' },
            { factor: 'Color', heavier: 'Darker, saturated', lighter: 'Lighter, muted' },
            { factor: 'Contrast', heavier: 'High contrast', lighter: 'Low contrast' },
            { factor: 'Density', heavier: 'Complex, detailed', lighter: 'Simple, sparse' },
            { factor: 'Shape', heavier: 'Irregular, compact', lighter: 'Regular, extended' },
            { factor: 'Position', heavier: 'Center, top', lighter: 'Periphery, bottom' },
          ].map((row, i) => (
            <div key={row.factor} style={{ display: 'flex', padding: '8px 16px', borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', width: 80, flexShrink: 0 }}>{row.factor}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', width: 160, flexShrink: 0 }}>{row.heavier}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.lighter}</span>
            </div>
          ))}
        </div>
        {/* Visual demo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 24, borderRadius: 8, background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: 8, background: 'var(--color-text-heading)', opacity: 0.9 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ width: 48, height: 8, borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.4 }} />
              <div style={{ width: 64, height: 6, borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.3 }} />
              <div style={{ width: 56, height: 6, borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.3 }} />
              <div style={{ width: 40, height: 6, borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.3 }} />
            </div>
          </div>
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: 12, color: 'var(--color-text-body)', display: 'flex', alignItems: 'center' }}>
            <p style={{ margin: 0, lineHeight: 1.6 }}>One large, dark element balanced by multiple small, light ones. This is <strong>asymmetrical balance</strong> — the most common pattern in modern UI design.</p>
          </div>
        </div>
      </Section>

      {/* ---- Positioning Frameworks ---- */}
      <Section title="Positioning Frameworks">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>{"Don't guess where to place elements. Use compositional frameworks."}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 16 }}>
          {/* Rule of Thirds */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Rule of Thirds</span>
            </div>
            <div style={{ position: 'relative', height: 150, background: 'var(--color-bg-alt)', margin: 12, borderRadius: 4 }}>
              {/* Grid lines */}
              <div style={{ position: 'absolute', left: '33.3%', top: 0, bottom: 0, width: 1, background: 'var(--color-border)' }} />
              <div style={{ position: 'absolute', left: '66.6%', top: 0, bottom: 0, width: 1, background: 'var(--color-border)' }} />
              <div style={{ position: 'absolute', top: '33.3%', left: 0, right: 0, height: 1, background: 'var(--color-border)' }} />
              <div style={{ position: 'absolute', top: '66.6%', left: 0, right: 0, height: 1, background: 'var(--color-border)' }} />
              {/* Focal point at intersection */}
              <div style={{ position: 'absolute', left: 'calc(33.3% - 6px)', top: 'calc(33.3% - 6px)', width: 12, height: 12, borderRadius: '50%', background: 'var(--color-primary)' }} />
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', padding: '0 12px 12px', margin: 0 }}>Place focal elements at intersection points</p>
          </div>
          {/* Z-Pattern */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Z-Pattern</span>
            </div>
            <div style={{ position: 'relative', height: 150, margin: 12, borderRadius: 4 }}>
              <svg width="100%" height="100%" viewBox="0 0 200 150" preserveAspectRatio="none">
                <path d="M20 30 L180 30 L20 120 L180 120" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="6 4" opacity="0.5" />
                <circle cx="20" cy="30" r="6" fill="var(--color-primary)" opacity="0.3" />
                <circle cx="180" cy="30" r="6" fill="var(--color-primary)" opacity="0.3" />
                <circle cx="20" cy="120" r="6" fill="var(--color-primary)" opacity="0.3" />
                <circle cx="180" cy="120" r="8" fill="var(--color-primary)" />
              </svg>
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', padding: '0 12px 12px', margin: 0 }}>CTA at terminal point (bottom-right)</p>
          </div>
          {/* F-Pattern */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>F-Pattern</span>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ height: 8, width: '90%', borderRadius: 3, background: 'var(--color-primary)', opacity: 0.6, marginBottom: 8 }} />
              <div style={{ height: 6, width: '70%', borderRadius: 3, background: 'var(--color-primary)', opacity: 0.35, marginBottom: 12 }} />
              <div style={{ height: 4, width: '20%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 4 }} />
              <div style={{ height: 4, width: '20%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 4 }} />
              <div style={{ height: 4, width: '20%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 4 }} />
              <div style={{ height: 4, width: '20%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 4 }} />
              <div style={{ height: 4, width: '20%', borderRadius: 3, background: 'var(--color-border)' }} />
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', padding: '0 12px 12px', margin: 0 }}>Text-heavy: eye scans top then left edge</p>
          </div>
          {/* Gutenberg Diagram */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Gutenberg Diagram</span>
            </div>
            <div style={{ position: 'relative', margin: 12, borderRadius: 4 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                <div style={{ padding: 10, borderRadius: 4, background: 'var(--color-primary-muted)', textAlign: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.3, display: 'block' }}>Primary Optical Area</span>
                </div>
                <div style={{ padding: 10, borderRadius: 4, background: 'var(--color-bg-alt)', textAlign: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-muted)', lineHeight: 1.3, display: 'block' }}>Strong Fallow</span>
                </div>
                <div style={{ padding: 10, borderRadius: 4, background: 'var(--color-bg-alt)', textAlign: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-muted)', lineHeight: 1.3, display: 'block' }}>Weak Fallow</span>
                </div>
                <div style={{ padding: 10, borderRadius: 4, background: 'var(--color-primary-muted)', textAlign: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.3, display: 'block' }}>Terminal Area</span>
                </div>
              </div>
              {/* Diagonal reading gravity arrow */}
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <path d="M15 20 L85 80" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5" />
                <polygon points="85,80 78,76 80,83" fill="var(--color-primary)" opacity="0.5" />
              </svg>
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', padding: '0 12px 12px', margin: 0 }}>Reading gravity flows top-left to bottom-right</p>
          </div>
        </div>
        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Optical center</strong> is ~5% above the mathematical center. Geometrically centered content often feels like it{"'"}s sinking — nudge it up.</p>
        </div>
      </Section>

      {/* ---- Compositional Rhythm ---- */}
      <Section title="Compositional Rhythm">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Rhythm is patterned repetition that guides the eye. Like music has tempo, design has visual rhythm.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {/* Regular */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Regular</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2, 3, 4].map((i) => <div key={i} style={{ flex: 1, height: 32, borderRadius: 4, background: 'var(--color-border)' }} />)}
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '8px 0 0' }}>Same element, same interval — order</p>
          </div>
          {/* Alternating */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Alternating</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[1, 2, 3, 4].map((i) => <div key={i} style={{ height: 12, borderRadius: 3, background: i % 2 === 0 ? 'var(--color-bg-alt)' : 'var(--color-border)' }} />)}
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '8px 0 0' }}>Two contrasts in sequence — energy</p>
          </div>
          {/* Progressive */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Progressive</p>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
              {[16, 24, 32, 44].map((h, i) => <div key={i} style={{ flex: 1, height: h, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.3 + i * 0.2 }} />)}
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '8px 0 0' }}>Gradual change — direction</p>
          </div>
          {/* Flowing */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Flowing</p>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
              {[28, 18, 36, 22, 32].map((h, i) => <div key={i} style={{ flex: 1, height: h, borderRadius: 4, background: 'var(--color-border)' }} />)}
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '8px 0 0' }}>Organic intervals — natural</p>
          </div>
        </div>
      </Section>

      {/* ---- Typography ---- */}
      <Section title="Typography">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Body text: 1.4-1.6x line height. Headings: 1.05-1.2x. Optimal line length: 45-75 characters.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, gridAutoRows: '1fr' }}>
          {[
            { label: 'Too Tight (1.0x)', lh: 1.0, good: false },
            { label: 'Just Right (1.5x)', lh: 1.5, good: true },
            { label: 'Too Loose (2.2x)', lh: 2.2, good: false },
          ].map((t) => (
            <div key={t.label} style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: t.good ? 'var(--color-success)' : 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.label}</p>
              <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
                <p style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: t.lh, margin: 0 }}>Good typography is invisible. The reader should never fight the text to extract meaning. Line height and measure work together.</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Micro vs Macro Whitespace ---- */}
      <Section title="Micro vs Macro Whitespace">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Both scales must be intentional. A common failure: perfecting micro spacing inside components while neglecting macro spacing between them.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Micro — Inside Components</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--color-primary)' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Button label</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                  <span style={{ fontSize: 9, color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '1px 4px', borderRadius: 2 }}>icon gap: 8px</span>
                  <span style={{ fontSize: 9, color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '1px 4px', borderRadius: 2 }}>padding: 12px</span>
                  <span style={{ fontSize: 9, color: 'var(--color-text-muted)', background: 'var(--color-surface)', padding: '1px 4px', borderRadius: 2 }}>line-height</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>Letter-spacing, line-height, padding, icon gaps</p>
            </div>
          </div>
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Macro — Between Sections</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ height: 16, borderRadius: 4, background: 'var(--color-bg-alt)' }} />
                <div style={{ height: 8, borderRadius: 3, background: 'var(--color-border)', width: '70%' }} />
              </div>
              <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 9, color: 'var(--color-secondary)' }}>← 48px →</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ height: 16, borderRadius: 4, background: 'var(--color-bg-alt)' }} />
                <div style={{ height: 8, borderRadius: 3, background: 'var(--color-border)', width: '60%' }} />
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>Section gaps, margins, canvas edges</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Content Coverage Targets ---- */}
      <Section title="Content Coverage Targets">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>How much of the canvas should be filled depends on the composition type.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
          {[
            { type: 'Hero / Title', coverage: '25–40%', fill: 32 },
            { type: 'CTA / Action', coverage: '20–35%', fill: 27 },
            { type: 'Quote', coverage: '30–45%', fill: 37 },
            { type: 'Card / Component', coverage: '55–70%', fill: 62 },
            { type: 'Dashboard', coverage: '65–80%', fill: 72 },
          ].map((item) => (
            <div key={item.type} style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
              <div style={{ height: 80, position: 'relative', background: 'var(--color-bg-alt)' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${item.fill}%`, background: 'var(--color-primary)', opacity: 0.12, borderTop: '1px dashed var(--color-primary)' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>{item.coverage}</span>
                </div>
              </div>
              <div style={{ padding: '8px 10px', textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Six Functions of Negative Space ---- */}
      <Section title="Six Functions of Negative Space">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { fn: 'Emphasis', desc: 'Isolating an element in space draws the eye to it', example: 'Lone CTA surrounded by whitespace' },
            { fn: 'Grouping', desc: 'Space between groups wider than within (proximity)', example: 'Form sections separated by larger gaps' },
            { fn: 'Hierarchy', desc: 'More space around an element = more importance', example: 'Headline with 48px margin vs 16px' },
            { fn: 'Pacing', desc: 'Alternating dense and open controls reading tempo', example: 'Data table → spacious summary card' },
            { fn: 'Elegance', desc: 'Generous space signals confidence', example: 'Luxury: 50-70% white space' },
            { fn: 'Separation', desc: 'Space replaces borders and dividers', example: '48px gap instead of an <hr>' },
          ].map((item) => (
            <div key={item.fn} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.fn}</span>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '4px 0 6px', lineHeight: 1.4 }}>{item.desc}</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>{item.example}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Optical Alignment ---- */}
      <Section title="Optical Alignment">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Mathematical centering often looks wrong. Trust your eyes over the pixel inspector.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: 4, background: 'var(--color-border)' }} />
              <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--color-border)' }} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>Circles vs Squares</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>Circles need ~5-10% larger to appear equal</p>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 2 }}>
              <div style={{ width: 0, height: 0, borderLeft: '10px solid var(--color-primary)', borderTop: '7px solid transparent', borderBottom: '7px solid transparent' }} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>Play Button</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>Nudge 1-2px right to look centered</p>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--color-primary)', margin: '0 auto 8px', display: 'inline-block' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>SUBMIT</span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>Uppercase in Buttons</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>Add 1-2px top padding — no descenders</p>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 4, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 3 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)' }}>A</span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>Visual Center</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>~5% above math center to not {"\""}sink{"\""}</p>
          </div>
        </div>
      </Section>

      {/* ---- Unity & Variety ---- */}
      <Section title="Unity & Variety">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Unity makes it cohesive. Variety makes it interesting. Great design lives in the tension between them.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unity — Repeat Key Attributes</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1 }}>
              {['Analytics', 'Users', 'Reports'].map((label) => (
                <div key={label} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--color-primary)', opacity: 0.15 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Variety — Break ONE Thing</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, flex: 1 }}>
              {['Analytics', 'Featured', 'Reports'].map((label, i) => (
                <div key={label} style={{ padding: 12, borderRadius: 8, border: `1px solid ${i === 1 ? 'var(--color-primary)' : 'var(--color-border)'}`, background: i === 1 ? 'var(--color-primary-muted)' : 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, gridColumn: i === 1 ? 'span 1' : undefined }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--color-primary)', opacity: i === 1 ? 0.4 : 0.15 }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { rule: 'Repeat key attributes', desc: 'Same border-radius, padding, border, font size across same-role elements' },
            { rule: 'Vary one thing at a time', desc: 'Change color OR size OR shape — never all three simultaneously' },
            { rule: 'Variety serves a purpose', desc: 'Every departure from the pattern must communicate something' },
          ].map((r) => (
            <div key={r.rule} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{r.rule}</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Squint Test ---- */}
      <Section title="The Squint Test">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Blur your eyes or zoom to 25%. You should still see: clear hierarchy, balanced composition, distinct groupings, clean edges.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Normal View</p>
            <div style={{ padding: 24, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', flex: 1 }}>
              <div style={{ height: 16, width: '50%', borderRadius: 3, background: 'var(--color-text-heading)', marginBottom: 8 }} />
              <div style={{ height: 8, width: '80%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.4, marginBottom: 16 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[1, 2, 3].map((i) => <div key={i} style={{ height: 48, borderRadius: 6, background: 'var(--color-bg-alt)' }} />)}
              </div>
              <div style={{ height: 32, width: 100, borderRadius: 6, background: 'var(--color-primary)' }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Squinted (Blurred)</p>
            <div style={{ padding: 24, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', filter: 'blur(3px)', flex: 1 }}>
              <div style={{ height: 16, width: '50%', borderRadius: 3, background: 'var(--color-text-heading)', marginBottom: 8 }} />
              <div style={{ height: 8, width: '80%', borderRadius: 3, background: 'var(--color-text-muted)', opacity: 0.4, marginBottom: 16 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[1, 2, 3].map((i) => <div key={i} style={{ height: 48, borderRadius: 6, background: 'var(--color-bg-alt)' }} />)}
              </div>
              <div style={{ height: 32, width: 100, borderRadius: 6, background: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Element Interactions ---- */}
      <Section title="Element Interactions">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>When elements share a canvas, they interact. Controlling these interactions separates good from great.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 16 }}>
          {/* Overlap */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Intentional vs Accidental Overlap</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
              <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)', padding: 16, position: 'relative', overflow: 'hidden' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8 }}>GOOD</p>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', opacity: 0.15, position: 'absolute', right: -12, top: -8 }} />
                <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: 0, position: 'relative' }}>Decorative shape extends behind text — intentional depth</p>
              </div>
              <div style={{ borderRadius: 8, border: '2px solid var(--color-danger)', background: 'var(--color-surface)', padding: 16, position: 'relative', overflow: 'hidden' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8 }}>BAD</p>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-primary)', opacity: 0.6, position: 'absolute', right: 4, bottom: 8 }} />
                <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: 0, position: 'relative' }}>Element covers text because dimensions unconstrained</p>
              </div>
            </div>
          </div>
          {/* Background coverage */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Background Coverage Rule</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flex: 1 }}>
              <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', overflow: 'hidden' }}>
                <div style={{ background: 'var(--color-primary)', padding: '20px 16px' }}>
                  <p style={{ fontSize: 12, color: '#fff', fontWeight: 600, margin: 0 }}>Full Coverage</p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>Comfortable padding around text</p>
                </div>
              </div>
              <div style={{ borderRadius: 8, border: '2px solid var(--color-danger)', overflow: 'hidden', position: 'relative' }}>
                <div style={{ background: 'var(--color-primary)', padding: '4px 6px', position: 'relative' }}>
                  <p style={{ fontSize: 12, color: '#fff', fontWeight: 600, margin: 0 }}>Text bleeds</p>
                </div>
                <p style={{ fontSize: 10, color: 'var(--color-danger)', margin: 0, padding: '4px 6px' }}>past its background</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { method: 'Space', desc: 'Gap between elements (most common)' },
            { method: 'Color', desc: 'Different backgrounds distinguish zones' },
            { method: 'Lines', desc: 'Explicit dividers (use sparingly)' },
            { method: 'Size', desc: 'Large heading separates from small body' },
          ].map((m) => (
            <div key={m.method} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)' }}>{m.method}</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Connectors & Arrows ---- */}
      <Section title="Connectors & Arrows Between Elements">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Connectors must be centered in dedicated gap space between elements — never overlapping element bounding boxes. Make them proper flex children, not absolutely positioned.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, gridAutoRows: '1fr' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct — Flex Children</p>
            <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {/* Card 1 */}
                <div style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', textAlign: 'center' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, margin: '0 auto 4px' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)' }}>Step 1</span>
                </div>
                {/* Arrow container — proper flex child */}
                <div style={{ width: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="12" viewBox="0 0 16 12"><path d="M0 6h12M10 2l4 4-4 4" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" /></svg>
                </div>
                {/* Card 2 */}
                <div style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', textAlign: 'center' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, margin: '0 auto 4px' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)' }}>Step 2</span>
                </div>
                {/* Arrow container */}
                <div style={{ width: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="12" viewBox="0 0 16 12"><path d="M0 6h12M10 2l4 4-4 4" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" /></svg>
                </div>
                {/* Card 3 */}
                <div style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', textAlign: 'center' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, margin: '0 auto 4px' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)' }}>Step 3</span>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-success)', margin: '8px 0 0', textAlign: 'center' }}>Arrow containers are flex children with fixed width — centered in the gap</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wrong — Absolutely Positioned</p>
            <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Card 1 with overlapping arrow */}
                <div style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', textAlign: 'center', position: 'relative' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, margin: '0 auto 4px' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)' }}>Step 1</span>
                  <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)' }}>
                    <svg width="16" height="12" viewBox="0 0 16 12"><path d="M0 6h12M10 2l4 4-4 4" fill="none" stroke="var(--color-danger)" strokeWidth="1.5" /></svg>
                  </div>
                </div>
                {/* Card 2 with overlapping arrow */}
                <div style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', textAlign: 'center', position: 'relative' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, margin: '0 auto 4px' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)' }}>Step 2</span>
                  <div style={{ position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)' }}>
                    <svg width="16" height="12" viewBox="0 0 16 12"><path d="M0 6h12M10 2l4 4-4 4" fill="none" stroke="var(--color-danger)" strokeWidth="1.5" /></svg>
                  </div>
                </div>
                {/* Card 3 */}
                <div style={{ flex: 1, padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', textAlign: 'center' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, margin: '0 auto 4px' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-heading)' }}>Step 3</span>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-danger)', margin: '8px 0 0', textAlign: 'center' }}>Arrows overlap card edges — breaks at different screen sizes</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginTop: 16 }}>
          {[
            { check: 'Is it a flex child?', desc: 'Connectors must be layout elements, not absolutely positioned' },
            { check: 'Does it overlap?', desc: 'Must not overlap either adjacent element\'s bounding box' },
            { check: 'Is it centered?', desc: 'Centered on both axes within its dedicated gap space' },
          ].map((item) => (
            <div key={item.check} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)' }}>{item.check}</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Inline Badge/Icon Alignment ---- */}
      <Section title="Inline Badge & Icon Alignment">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>When badges, numbers, or icons sit next to text, the alignment strategy depends on whether the text wraps.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, gridAutoRows: '1fr' }}>
          {/* Single-line: center-align */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Single Line — Center</p>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>1</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>Short title text</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '8px 0 0', fontStyle: 'italic' }}>align-items: center works naturally</p>
            </div>
          </div>
          {/* Multi-line: top-align */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Multi-Line — Top-Align</p>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>2</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.4 }}>A longer title that wraps to multiple lines of text</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '8px 0 0', fontStyle: 'italic' }}>align-items: flex-start + small top offset</p>
            </div>
          </div>
          {/* Multi-line: wrong centering */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Multi-Line — Center (Wrong)</p>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--color-danger)', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>3</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', lineHeight: 1.4 }}>A longer title that wraps to multiple lines of text</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-danger)', margin: '8px 0 0', fontStyle: 'italic' }}>Badge floats awkwardly in the middle</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>When unsure, default to top-align.</strong> It works for both single-line and multi-line text. Center-align only when you can guarantee the text will never wrap.</p>
        </div>
      </Section>

      {/* ---- Motion & Animation ---- */}
      <Section title="Motion & Animation">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Every animation must have a purpose: feedback, spatial relationship, attention guidance, or state change. If none — remove it.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Duration */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Duration Guide</span>
            </div>
            {[
              { range: '150–250ms', use: 'Micro-interactions', example: 'Button press, toggle, hover' },
              { range: '300–500ms', use: 'Transitions', example: 'Panel open, page change, modal' },
              { range: '500ms+', use: 'Dramatic reveals only', example: 'Hero entrance, onboarding' },
            ].map((row, i) => (
              <div key={row.range} style={{ display: 'flex', padding: '8px 16px', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
                <code style={{ fontSize: 12, color: 'var(--color-secondary)', fontFamily: 'monospace', width: 90, flexShrink: 0 }}>{row.range}</code>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)', width: 120, flexShrink: 0 }}>{row.use}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.example}</span>
              </div>
            ))}
          </div>
          {/* Easing */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Easing — Never Use Linear</span>
            </div>
            {[
              { easing: 'ease-out', use: 'Enters', desc: 'Fast start, gentle stop' },
              { easing: 'ease-in', use: 'Exits', desc: 'Gentle start, fast exit' },
              { easing: 'ease-in-out', use: 'Position changes', desc: 'Smooth both directions' },
              { easing: 'linear', use: 'NEVER for UI', desc: 'Feels robotic and unnatural' },
            ].map((row, i) => (
              <div key={row.easing} style={{ display: 'flex', padding: '8px 16px', borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)', opacity: i === 3 ? 0.5 : 1 }}>
                <code style={{ fontSize: 12, color: i === 3 ? 'var(--color-danger)' : 'var(--color-secondary)', fontFamily: 'monospace', width: 100, flexShrink: 0 }}>{row.easing}</code>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)', width: 110, flexShrink: 0 }}>{row.use}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Stagger reveals:</strong> Cards appear with cascading 50–100ms delays. Total stagger max ~400ms. Beyond that feels slow.</p>
          </div>
          <div style={{ padding: 12, borderRadius: 6, border: '2px solid var(--color-danger)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Respect <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>prefers-reduced-motion</code>.</strong> Replace transitions with instant state changes. Never ignore this.</p>
          </div>
        </div>
      </Section>

      {/* ---- Responsive Consistency ---- */}
      <Section title="Responsive Consistency">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>The design reflows across breakpoints — but the principles don{"'"}t change.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Equal height */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Equal-Height Containers</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, gridAutoRows: '1fr', marginBottom: 8 }}>
              <div style={{ padding: 8, borderRadius: 6, border: '2px solid var(--color-success)', background: 'var(--color-bg-alt)' }}>
                <div style={{ height: 8, width: '70%', borderRadius: 2, background: 'var(--color-border)', marginBottom: 4 }} />
                <div style={{ height: 6, width: '100%', borderRadius: 2, background: 'var(--color-border)', opacity: 0.5 }} />
              </div>
              <div style={{ padding: 8, borderRadius: 6, border: '2px solid var(--color-success)', background: 'var(--color-bg-alt)' }}>
                <div style={{ height: 8, width: '80%', borderRadius: 2, background: 'var(--color-border)', marginBottom: 4 }} />
                <div style={{ height: 6, width: '100%', borderRadius: 2, background: 'var(--color-border)', opacity: 0.5, marginBottom: 4 }} />
                <div style={{ height: 6, width: '60%', borderRadius: 2, background: 'var(--color-border)', opacity: 0.5 }} />
              </div>
              <div style={{ padding: 8, borderRadius: 6, border: '2px solid var(--color-success)', background: 'var(--color-bg-alt)' }}>
                <div style={{ height: 8, width: '60%', borderRadius: 2, background: 'var(--color-border)', marginBottom: 4 }} />
                <div style={{ height: 6, width: '90%', borderRadius: 2, background: 'var(--color-border)', opacity: 0.5 }} />
              </div>
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-success)', margin: 0 }}>grid-auto-rows: 1fr — all rows equal height</p>
          </div>
          {/* Cross-breakpoint */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cross-Breakpoint Rules</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Spacing ratios scale proportionally, never collapse to 0',
                'Alignment edges survive reflow (left edge stays consistent)',
                'Touch targets: 44×44px minimum with 8px+ gaps',
                'Body text never below 14px on mobile',
                'Design for longest realistic content first',
              ].map((rule, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--color-text-body)', paddingLeft: 10, borderLeft: '2px solid var(--color-border)', lineHeight: 1.4 }}>{rule}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Consistency ---- */}
      <Section title="Consistency Rules">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, gridAutoRows: '1fr' }}>
          {[
            'Same hierarchy level = same font size everywhere',
            'Same role = same weight, color, spacing, border radius',
            'Design for worst case (longest name, all fields)',
            'Sub-pixel alignment: always whole-pixel boundaries',
            'Edge relationships: flush or 15px+, never 3px mistakes',
            'No large voids without a visual anchor',
          ].map((rule, i) => (
            <div key={i} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5, display: 'flex', alignItems: 'center' }}>
              {rule}
            </div>
          ))}
        </div>
      </Section>
      {/* ---- Layout QA Checklist ---- */}
      <Section title="Layout QA Checklist">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Run this on every design before delivering. Prevents the most common layout failures.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          {[
            { phase: 'Before Writing', items: [
              'Establish a stacking plan for positioned elements',
              'Reserve space for absolute/fixed elements (padding formula)',
              'Assume maximum content — longest name, all fields filled',
            ]},
            { phase: 'After Each Section', items: [
              'No text overlaps logos, icons, or decorative elements',
              'All text stays within its background area',
              'Check all variants — profiles, data lengths, themes',
              'Cards in same row are equal height',
            ]},
            { phase: 'After Responsive', items: [
              'Check at 320, 640, 768, 1024, 1440px minimum',
              'Spacing ratios remain consistent',
              'Touch targets ≥ 44×44px with 8px+ gaps',
              'Body text ≥ 14px on mobile',
            ]},
          ].map((group) => (
            <div key={group.phase} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{group.phase}</span>
              </div>
              <div style={{ padding: 12 }}>
                {group.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: i < group.items.length - 1 ? 8 : 0 }}>
                    <div style={{ width: 16, height: 16, borderRadius: 3, border: '1.5px solid var(--color-border)', flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 11, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Common Overlap Pitfalls</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {[
              { issue: 'Competing for the bottom', fix: 'Add bottom padding = logo height + gap' },
              { issue: 'Decorative overflow', fix: 'Constrain dimensions, push into corners' },
              { issue: 'Dynamic clip-paths', fix: 'Recalculate break points when content changes' },
              { issue: 'Z-index collisions', fix: 'Establish clear z-index hierarchy at design level' },
            ].map((row, i) => (
              <div key={row.issue} style={{ display: 'flex', flexDirection: 'column', padding: '8px 16px', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none', borderRight: i % 2 === 0 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-danger)' }}>{row.issue}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.fix}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Design Decision Framework ---- */}
      <Section title="Design Decision Framework">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>When facing a design choice, evaluate in this order. When in doubt, choose the simpler option.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { num: '1', name: 'Clarity', desc: 'Does the viewer immediately understand the information hierarchy?', color: '#FF5A28' },
            { num: '2', name: 'Balance', desc: 'Does the composition feel visually stable?', color: '#B88A30' },
            { num: '3', name: 'Consistency', desc: 'Does this choice match the patterns already established?', color: '#2E9089' },
            { num: '4', name: 'Simplicity', desc: 'Is this the simplest solution? Fewer elements, colors, type sizes.', color: '#1462D2' },
            { num: '5', name: 'Polish', desc: 'Are the details refined? Alignment, spacing, edge treatment, color harmony.', color: '#1F2B7A' },
          ].map((step) => (
            <div key={step.num} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 32, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', flexShrink: 0 }}>{step.num}</div>
              <div style={{ flex: 1, padding: '10px 16px', borderRadius: 6, background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{step.name}</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '2px 0 0' }}>{step.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Simplicity scales; complexity compounds.</strong> Three similar lines of code is better than a premature abstraction. Apply the same principle to design — three simple cards beat one over-engineered component.</p>
        </div>
      </Section>

      {/* ---- Failure Patterns ---- */}
      <Section title="Failure Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Common design failures, their root causes, and how to fix them.</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ padding: '8px 16px' }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Failure</span></div>
            <div style={{ padding: '8px 16px' }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Why It Happens</span></div>
            <div style={{ padding: '8px 16px' }}><span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Fix</span></div>
          </div>
          {[
            { failure: 'Visual hierarchy unclear', cause: 'Equal weight on all elements', fix: 'Apply size/weight/color contrast' },
            { failure: 'Uneven spacing', cause: 'Inconsistent gaps between elements', fix: 'Use 8px system consistently' },
            { failure: 'Cards with misaligned actions', cause: 'Buttons at different heights', fix: 'Equal-height containers with bottom-pinned actions' },
            { failure: 'Dead space vs intentional whitespace', cause: 'Unfilled areas with no purpose', fix: 'Every space must serve a function' },
            { failure: 'Connectors overlap content', cause: 'Arrow drawn over text', fix: 'Reserve dedicated gap between elements' },
            { failure: 'Typography too many sizes', cause: '6+ font sizes on one page', fix: 'Max 3-4 sizes from type scale' },
            { failure: 'No visual path', cause: 'Eye wanders without direction', fix: 'Apply Z or F pattern' },
            { failure: 'Inconsistent border radius', cause: 'Mixed radius values', fix: 'Pick one radius, apply everywhere' },
            { failure: 'Icon size mismatch', cause: 'Icons at different sizes in same context', fix: 'Standardize to 20px default' },
            { failure: 'Color used without meaning', cause: 'Decorative color with no semantic purpose', fix: 'Every color must communicate something' },
          ].map((row, i) => (
            <div key={row.failure} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < 9 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <div style={{ padding: '8px 16px' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)' }}>{row.failure}</span>
              </div>
              <div style={{ padding: '8px 16px' }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.cause}</span>
              </div>
              <div style={{ padding: '8px 16px' }}>
                <span style={{ fontSize: 12, color: 'var(--color-success)' }}>{row.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

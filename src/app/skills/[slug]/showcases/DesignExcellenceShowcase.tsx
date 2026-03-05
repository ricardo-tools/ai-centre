'use client';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function DesignExcellenceShowcase() {
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
            { label: 'H4', size: 20, ratio: '1.25×' },
            { label: 'H3', size: 25, ratio: '1.56×' },
            { label: 'H2', size: 31, ratio: '1.95×' },
            { label: 'H1', size: 39, ratio: '2.44×' },
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
      </Section>

      {/* ---- Negative Space ---- */}
      <Section title="Negative Space">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>60-75% content coverage is the sweet spot. Isolation = emphasis.</p>
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
    </div>
  );
}

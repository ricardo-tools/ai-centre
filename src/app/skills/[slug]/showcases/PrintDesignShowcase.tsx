'use client';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function PrintDesignShowcase() {
  return (
    <div>
      {/* ---- 3-Zone System ---- */}
      <Section title="3-Zone System: Bleed / Trim / Safe">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Every print document has three nested zones. Content must stay within the safe zone. Backgrounds extend to the bleed zone.</p>
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          {/* Bleed zone */}
          <div style={{ position: 'relative', width: 360, height: 480, background: '#FF5A28', borderRadius: 4, padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ position: 'absolute', top: 4, left: 8, fontSize: 10, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>BLEED ZONE — 3mm beyond trim</span>
            {/* Trim zone */}
            <div style={{ width: '100%', height: '100%', border: '2px dashed rgba(255,255,255,0.5)', borderRadius: 2, padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ position: 'absolute', top: 4, left: 8, fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>TRIM LINE — final cut edge</span>
              {/* Safe zone */}
              <div style={{ width: '100%', height: '100%', background: 'var(--color-surface)', borderRadius: 4, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', border: '2px solid var(--color-success)' }}>
                <span style={{ position: 'absolute', top: 4, left: 8, fontSize: 10, color: 'var(--color-success)', fontWeight: 600 }}>SAFE ZONE — all content here</span>
                <div style={{ marginTop: 24 }}>
                  <div style={{ height: 16, width: '70%', borderRadius: 3, background: 'var(--color-text-heading)', marginBottom: 8 }} />
                  <div style={{ height: 8, width: '90%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 4 }} />
                  <div style={{ height: 8, width: '85%', borderRadius: 3, background: 'var(--color-border)', marginBottom: 4 }} />
                  <div style={{ height: 8, width: '60%', borderRadius: 3, background: 'var(--color-border)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: 4, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: 'var(--color-text-muted)', textAlign: 'center' }}>QR Code</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
          <div style={{ padding: 12, borderRadius: 6, background: '#FF5A28', color: '#fff', fontSize: 13, textAlign: 'center' }}>
            <strong>Bleed</strong><br />3mm beyond trim
          </div>
          <div style={{ padding: 12, borderRadius: 6, border: '2px dashed var(--color-border)', fontSize: 13, color: 'var(--color-text-body)', textAlign: 'center' }}>
            <strong>Trim</strong><br />Final cut edge
          </div>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-success-muted)', border: '1px solid var(--color-success)', fontSize: 13, color: 'var(--color-success)', textAlign: 'center' }}>
            <strong>Safe</strong><br />3–5mm inside trim (4mm standard)
          </div>
        </div>
      </Section>

      {/* ---- DPI Comparison ---- */}
      <Section title="Resolution: Screen vs Print">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4, width: 120, height: 120, margin: '0 auto 16px' }}>
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 1, background: i % 3 === 0 ? 'var(--color-text-heading)' : 'var(--color-border)' }} />
              ))}
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-danger)', margin: '0 0 4px' }}>72 DPI</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Screen only — visible pixels when printed</p>
          </div>
          <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ width: 120, height: 120, margin: '0 auto 16px', borderRadius: 4, background: `linear-gradient(135deg, var(--color-text-heading) 25%, var(--color-border) 25%, var(--color-border) 50%, var(--color-text-heading) 50%, var(--color-text-heading) 75%, var(--color-border) 75%)`, backgroundSize: '4px 4px' }} />
            <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-success)', margin: '0 0 4px' }}>300+ DPI</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Print ready — crisp at any size</p>
          </div>
        </div>
      </Section>

      {/* ---- Export Formats ---- */}
      <Section title="Export Requirements">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {[
            { format: 'PDF', use: 'Universal standard', desc: 'Vectors stay scalable, rasters meet DPI. Always export as PDF.' },
            { format: '300+ DPI', use: 'Resolution', desc: '4× screen scale at 5px/mm ≈ 508 DPI. Photos: min 300 DPI at print size.' },
            { format: 'CMYK', use: 'Color space', desc: 'Bright RGB colors (blues, oranges) appear duller. Rich black: C40 M30 Y30 K100.' },
            { format: 'Embedded Fonts', use: 'Typography', desc: 'All fonts embedded. Convert to outlines as last resort. No external deps.' },
          ].map((f) => (
            <div key={f.format} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>{f.format}</p>
              <p style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, margin: '0 0 6px' }}>{f.use}</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Typography for Print ---- */}
      <Section title="Typography for Print">
        <div style={{ padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Minimum Sizes</p>
              {[
                { label: 'Body text', size: '7pt min', note: '≈ 2.5mm cap height. Below this = illegible' },
                { label: 'Fine print', size: '6pt abs min', note: 'Use sparingly, non-critical only' },
                { label: 'Headings', size: '10–16pt', note: 'Readable at arm\'s length' },
              ].map((t) => (
                <div key={t.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', width: 80 }}>{t.label}</span>
                  <span style={{ fontSize: 14, fontFamily: 'monospace', color: 'var(--color-secondary)' }}>{t.size}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.note}</span>
                </div>
              ))}
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Rules</p>
              <ul style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 2, listStyle: 'none', padding: 0 }}>
                <li>Embed all fonts — never rely on system fonts</li>
                <li>Convert text to outlines for logos</li>
                <li>Line height: 120-145% for body text</li>
                <li>Avoid pure black (#000) — use rich black</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- QR Code Specs ---- */}
      <Section title="QR Code Specifications">
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <div style={{ width: 100, height: 100, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2, width: 50, height: 50 }}>
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 1, background: [0, 1, 2, 5, 6, 10, 12, 14, 18, 20, 22, 23, 24].includes(i) ? 'var(--color-text-heading)' : 'transparent' }} />
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 8px' }}>Min 10×10mm — Recommended 12–15mm</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 4px' }}>Quiet zone: 4 modules minimum (white padding on dark bg)</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 4px' }}>Short URL = simpler QR = more reliable scan. Use UTM for tracking.</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: '0 0 4px' }}>Large format (posters): 25mm+ for scanning from {'>'} 1m</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>Must be fully within safe zone — never in bleed.</p>
          </div>
        </div>
      </Section>

      {/* ---- Pre-flight Checklist ---- */}
      <Section title="Pre-Flight Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            'Resolution ≥ 300 DPI (4× at 5px/mm ≈ 508 DPI)',
            'Bleed: 3–5mm on all sides (backgrounds extend to bleed)',
            'Safe zone: 3–5mm inside trim (4mm standard)',
            'All fonts embedded — no external dependencies',
            'Color awareness: RGB → CMYK shift. No neon colors.',
            'All images local/embedded — no external URLs',
            'No trim marks in design file — printer adds these',
            'QR codes scannable: min 10mm, quiet zone, short URL',
            'All content in safe zone — nothing functional outside',
            'Rich black (C40 M30 Y30 K100) for large dark areas',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, border: '2px solid var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--color-success)' }}>✓</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Common Print Formats ---- */}
      <Section title="Common Print Format Reference">
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', width: 160 }}>Format</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', width: 140 }}>Trim Size</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', width: 140 }}>Bleed (5mm)</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Safe (4mm inset)</span>
          </div>
          {[
            { format: 'Business card', trim: '90 × 55 mm', bleed: '100 × 65 mm', safe: '82 × 47 mm' },
            { format: 'Business card (US)', trim: '89 × 51 mm', bleed: '99 × 61 mm', safe: '81 × 43 mm' },
            { format: 'DL flyer', trim: '99 × 210 mm', bleed: '109 × 220 mm', safe: '91 × 202 mm' },
            { format: 'A6 flyer', trim: '105 × 148 mm', bleed: '115 × 158 mm', safe: '97 × 140 mm' },
            { format: 'A5 flyer', trim: '148 × 210 mm', bleed: '158 × 220 mm', safe: '140 × 202 mm' },
            { format: 'A4 flyer/brochure', trim: '210 × 297 mm', bleed: '220 × 307 mm', safe: '202 × 289 mm' },
            { format: 'A3 poster', trim: '297 × 420 mm', bleed: '307 × 430 mm', safe: '289 × 412 mm' },
            { format: 'Square sticker (50mm)', trim: '50 × 50 mm', bleed: '60 × 60 mm', safe: '42 × 42 mm' },
          ].map((row, i) => (
            <div key={row.format} style={{ display: 'flex', padding: '8px 16px', borderBottom: i < 7 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-body)', width: 160 }}>{row.format}</span>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-secondary)', width: 140 }}>{row.trim}</span>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-muted)', width: 140 }}>{row.bleed}</span>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-success)' }}>{row.safe}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Formula:</strong> Bleed = Trim + (2 × bleed margin) &nbsp;|&nbsp; Safe = Trim − (2 × safe inset)
          </p>
        </div>
      </Section>

      {/* ---- Screen-to-Print Conversion ---- */}
      <Section title="Screen-to-Print Conversion">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Design at 5 px/mm for clean integer dimensions. Export at 4× scale for ~508 DPI.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Conversion table */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>px/mm Conversion (at 5 px/mm)</span>
            </div>
            {[
              { mm: '1 mm', px: '5 px' },
              { mm: '3 mm', px: '15 px' },
              { mm: '5 mm', px: '25 px' },
              { mm: '10 mm', px: '50 px' },
              { mm: '55 mm', px: '275 px' },
              { mm: '90 mm', px: '450 px' },
            ].map((row, i) => (
              <div key={row.mm} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 16px', borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.mm}</span>
                <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-secondary)' }}>{row.px}</span>
              </div>
            ))}
          </div>
          {/* Two-box architecture */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Two-Box Architecture (Code)</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 12 }}>When implementing print designs in HTML/CSS/React:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: 10, borderRadius: 6, border: '2px solid #FF5A28', background: 'rgba(255,90,40,0.06)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#FF5A28' }}>1. Outer Box (Bleed Box)</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Full bleed dimensions. Backgrounds, decorative elements, images that bleed to edges.</p>
              </div>
              <div style={{ padding: 10, borderRadius: 6, border: '2px solid var(--color-success)', background: 'var(--color-success-muted)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-success)' }}>2. Inner Box (Content Box)</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Trim area with safe inset padding. All readable content goes here.</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 10 }}>Screen display: wrap bleed box in clip container sized to trim (<code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>overflow: hidden</code>). Export: capture full bleed box.</p>
          </div>
        </div>
      </Section>

      {/* ---- Line Spacing & Color Space ---- */}
      <Section title="Line Spacing & Color Space">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Line Spacing</p>
            {[
              { context: 'Body text', spacing: '120–150%', note: '10pt text → 12–15pt line height' },
              { context: 'Headings', spacing: '100–120%', note: 'Tighter spacing acceptable' },
              { context: 'Small text', spacing: '130–160%', note: 'More generous aids readability' },
            ].map((row) => (
              <div key={row.context} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', width: 72 }}>{row.context}</span>
                <span style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-secondary)', width: 80 }}>{row.spacing}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.note}</span>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>Hierarchy (max 3–4 levels):</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: 0 }}>Primary heading → Secondary heading → Body text → Fine print. Max 2 typefaces per piece.</p>
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Color Space (CMYK)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, padding: 8, borderRadius: 4, background: '#1462D2', textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>RGB Blue</span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--color-text-muted)' }}>→</span>
                <div style={{ flex: 1, padding: 8, borderRadius: 4, background: '#365FA0', textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>CMYK (duller)</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, padding: 8, borderRadius: 4, background: '#FF5A28', textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>RGB Orange</span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--color-text-muted)' }}>→</span>
                <div style={{ flex: 1, padding: 8, borderRadius: 4, background: '#D46030', textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 600 }}>CMYK (shifted)</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: 'var(--color-bg-alt)' }}>
              <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: '0 0 4px' }}><strong>Rich black:</strong> C:40 M:30 Y:30 K:100 — for large dark areas</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: 0 }}><strong>Neon/fluorescent:</strong> Do not reproduce in standard CMYK</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

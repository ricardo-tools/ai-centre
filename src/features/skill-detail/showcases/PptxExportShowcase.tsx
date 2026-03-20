'use client';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
      {children}
    </div>
  );
}

const GRID_CONSTANTS = [
  { label: 'M', value: '0.7"', desc: 'Edge margin' },
  { label: 'CW', value: '8.6"', desc: 'Content width (10" − 2×M)' },
  { label: 'KY', value: '0.45"', desc: 'Kicker Y position' },
  { label: 'TY', value: '0.85"', desc: 'Title Y position' },
  { label: 'SY', value: '1.55"', desc: 'Subtitle Y position' },
  { label: 'BY', value: '2.55"', desc: 'Body content Y' },
  { label: 'IX / IW', value: '1.5" / 7"', desc: 'Inner centered text' },
];

const API_RULES = [
  { rule: 'No # in hex colors', bad: '#FF5A28', good: 'FF5A28' },
  { rule: 'No opacity in hex', bad: 'FF5A2880', good: 'transparency: 50' },
  { rule: 'Backgrounds use color', bad: '{ fill: \'FAFAFA\' }', good: '{ color: \'FAFAFA\' }' },
  { rule: 'Fresh objects per use', bad: 'Shared const shadow', good: 'mkShadow() factory' },
  { rule: 'bullet: true for lists', bad: 'Unicode • characters', good: 'bullet: true property' },
  { rule: 'lineSpacingMultiple ≥ 1.0', bad: '0.8 (corrupt XML)', good: '1.0 minimum' },
  { rule: 'Valid text props only', bad: 'letterSpacing, gap', good: 'fontSize, fontFace, bold' },
  { rule: 'Fresh PptxGenJS()', bad: 'Reuse instance', good: 'new PptxGenJS() per export' },
  { rule: 'LAYOUT_16x9', bad: 'Custom dimensions', good: '10" × 5.625"' },
];

const DESIGN_TRANSLATION = [
  { concept: 'Visual hierarchy', html: 'Font size, weight, color via CSS', pptx: 'fontSize, bold, color on addText' },
  { concept: 'Negative space', html: 'Padding, margin, gap', pptx: 'X/Y positioning with deliberate gaps' },
  { concept: 'Alignment', html: 'Flexbox, grid, text-align', pptx: 'Shared X and Y positions' },
  { concept: 'Consistency', html: 'Shared CSS classes/variables', pptx: 'Shared helper functions' },
  { concept: 'One focal point', html: 'Size, color, position emphasis', pptx: 'One element 36px+ or bold' },
  { concept: 'Cards', html: 'border-radius, background, shadow', pptx: 'ROUNDED_RECTANGLE + fill + shadow' },
  { concept: 'Spacing rhythm', html: '8px base unit', pptx: '0.08" base unit in PPTX' },
];

const TITLE_SIZES = [
  { fontSize: '24px', oneLine: '0.45"', twoLine: '0.85"', rule: 'Always use 0.85"+ for slide titles' },
  { fontSize: '20px', oneLine: '0.36"', twoLine: '0.72"', rule: 'Use 0.7"+ for section titles' },
  { fontSize: '17px', oneLine: '0.31"', twoLine: '0.61"', rule: 'Use 0.6"+ for sub-titles' },
  { fontSize: '14px', oneLine: '0.25"', twoLine: '0.50"', rule: 'Use 0.5"+ for card titles' },
];

const INTEGRITY_CAUSES = [
  { cause: 'fill instead of color', effect: 'Repair prompt on open', fix: 'sl.background = { color: \'...\' }' },
  { cause: 'CSS props in addText', effect: 'Invalid XML, silent corruption', fix: 'Only use PptxGenJS text props' },
  { cause: 'Shared mutable objects', effect: 'Corrupted slides after first use', fix: 'Factory functions (mkShadow())' },
  { cause: 'lineSpacingMultiple < 1.0', effect: 'Invalid XML structure', fix: 'Use 1.0 minimum' },
  { cause: 'Broken image path URLs', effect: 'Missing images after repair', fix: 'Prefer data (base64) over path' },
];

const BOUNDS_PATTERNS = [
  { pattern: 'Loop-generated cards', risk: 'Last item exceeds right edge', fix: 'Verify M + (count−1)×step + w ≤ 10' },
  { pattern: 'Two-column layout', risk: 'Right column overflows', fix: 'Verify M + offset + colW ≤ 10' },
  { pattern: 'Stacked items', risk: 'Bottom items exceed 5.625"', fix: 'Verify startY + (count−1)×step + h ≤ 5.625' },
  { pattern: 'Corner watermark', risk: 'Too close to edge', fix: 'Keep 0.1" min from edges' },
];

const CHECKLIST_CATEGORIES = [
  { category: 'File Integrity', items: ['Backgrounds: color not fill', 'No CSS props in addText', 'Factory functions for shadows', 'lineSpacing ≥ 1.0', 'No # in hex colors', 'No opacity in hex strings', 'Fresh PptxGenJS() per export', 'bullet: true for bullet items', 'Image path URLs accessible'] },
  { category: 'Element Bounds', items: ['x + w ≤ 10.0, y + h ≤ 5.625', 'Loop last-item verified', 'Content right ≤ 9.3", bottom ≤ 5.1"'] },
  { category: 'Brand', items: ['fontFace: Jost everywhere', 'Colors from palette object', 'footer() on every slide', 'Logo on title + closing slides', 'Footer: logo, section, page number all present', 'Palette matches brand tokens'] },
  { category: 'Design', items: ['One focal point per slide', 'Cards centered on slide', 'Content ≤ 70% of slide area', 'Child elements mathematically centered', 'Kicker/title/subtitle consistent positioning', 'Equivalent elements share identical formatting'] },
  { category: 'Text Overflow', items: ['Title h accommodates 2 lines', 'Bullets under 70 chars', 'Card text fits container width', 'Titles in constrained-width areas checked', 'Card text sized for container width'] },
  { category: 'Spatial Balance', items: ['Content vertically centered', 'Bottom dead space < 1.5"', 'Split layouts visually balanced', 'Empty areas on lighter side filled with supporting content'] },
  { category: 'Overlap', items: ['No bounding box collisions', '≥ 0.15" clearance between elements', 'Split titles use column width', 'Title-to-subtitle gap >= 0.15"', 'Loop-generated rows: step >= h + 0.15"'] },
  { category: 'Images', items: ['Aspect ratio preserved', 'Rectangle logo: 4:1 ratio', 'Footer logo vertically centered'] },
  { category: 'Icons', items: ['Prominent icons exported via renderPhosphorIcon', 'Icon images square (w === h)', 'Icons centered in containers', 'Icon color passed as CSS hex with # prefix'] },
  { category: 'Vertical Alignment', items: ['Vertical flow shares common horizontal center', 'Horizontal row shares common Y per layer'] },
  { category: 'Element Consistency', items: ['All siblings share same visual properties', 'PPTX reproduces all HTML visual elements', 'No card missing icon/badge its siblings have', 'If HTML cards have icons, PPTX has icons via renderPhosphorIcon'] },
  { category: 'Connectors', items: ['No overlap with adjacent elements', 'Centered in gap between elements', 'Arrow y centered on card midline'] },
];

export function PptxExportShowcase() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Intro */}
      <div
        style={{
          padding: 24,
          marginBottom: 32,
          borderRadius: 8,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Companion Skill
          </span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6, margin: 0 }}>
          PPTX export is the most error-prone part of the pipeline. The HTML slide is the source of truth — the PPTX must
          faithfully reproduce it, not approximate it. This skill requires <strong>brand-design-system</strong>, <strong>design-foundations</strong>, and <strong>presentation</strong> as companions.
        </p>
      </div>

      {/* Section 1: Spacing Grid & Constants */}
      <Section title="Spacing Grid & Constants">
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {/* Slide canvas diagram */}
          <div
            style={{
              flex: '0 0 280px',
              height: 157.5,
              position: 'relative',
              background: 'var(--color-bg-alt)',
              border: '2px solid var(--color-border)',
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
            {/* Margin guides */}
            <div style={{ position: 'absolute', top: 0, left: 19.6, width: 1, height: '100%', borderLeft: '1px dashed var(--color-primary)', opacity: 0.4 }} />
            <div style={{ position: 'absolute', top: 0, right: 19.6, width: 1, height: '100%', borderLeft: '1px dashed var(--color-primary)', opacity: 0.4 }} />
            {/* KY line */}
            <div style={{ position: 'absolute', top: 22.4, left: 19.6, right: 19.6, height: 1, borderTop: '1px dashed var(--color-text-muted)', opacity: 0.3 }} />
            {/* TY line */}
            <div style={{ position: 'absolute', top: 42.3, left: 19.6, right: 19.6, height: 1, borderTop: '1px dashed var(--color-success)', opacity: 0.4 }} />
            {/* SY line */}
            <div style={{ position: 'absolute', top: 77.2, left: 19.6, right: 19.6, height: 1, borderTop: '1px dashed var(--color-warning)', opacity: 0.4 }} />
            {/* BY line */}
            <div style={{ position: 'absolute', top: 127, left: 19.6, right: 19.6, height: 1, borderTop: '1px dashed var(--color-secondary)', opacity: 0.4 }} />
            {/* Labels */}
            <span style={{ position: 'absolute', top: 1, left: 2, fontSize: 8, color: 'var(--color-primary)', fontFamily: 'monospace' }}>M</span>
            <span style={{ position: 'absolute', top: 16, right: 22, fontSize: 7, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>KY</span>
            <span style={{ position: 'absolute', top: 36, right: 22, fontSize: 7, color: 'var(--color-success)', fontFamily: 'monospace' }}>TY</span>
            <span style={{ position: 'absolute', top: 70, right: 22, fontSize: 7, color: 'var(--color-warning)', fontFamily: 'monospace' }}>SY</span>
            <span style={{ position: 'absolute', top: 120, right: 22, fontSize: 7, color: 'var(--color-secondary)', fontFamily: 'monospace' }}>BY</span>
            <span style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              10" × 5.625" (16:9)
            </span>
          </div>

          {/* Constants table */}
          <div style={{ flex: 1 }}>
            {GRID_CONSTANTS.map((c, i) => (
              <div
                key={c.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 12px',
                  background: i % 2 === 0 ? 'var(--color-surface)' : 'transparent',
                  borderRadius: 4,
                }}
              >
                <span style={{ width: 56, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                  {c.label}
                </span>
                <span style={{ width: 80, fontSize: 13, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>
                  {c.value}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shadow factory callout */}
        <div
          style={{
            padding: 16,
            borderRadius: 6,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>
            Shadow Factory (must be a function — PptxGenJS mutates objects)
          </div>
          <code style={{ fontSize: 12, color: 'var(--color-text-body)', fontFamily: 'monospace', lineHeight: 1.6 }}>
            {'const mkShadow = () => ({ type:\'outer\', blur:6, offset:2, angle:135, color:\'000000\', opacity:0.1 });'}
          </code>
        </div>
      </Section>

      {/* Section 2: Critical API Rules */}
      <Section title="Critical API Rules">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
          Violating these corrupts the PPTX file. Every rule below prevents a specific XML corruption or rendering failure.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {API_RULES.map((r, i) => (
            <div
              key={r.rule}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 16,
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'transparent',
                borderRadius: 6,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)' }}>{r.rule}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-danger)', textTransform: 'uppercase' }}>Bad</span>
                <code style={{ fontSize: 11, color: 'var(--color-danger)', fontFamily: 'monospace', opacity: 0.8 }}>{r.bad}</code>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-success)', textTransform: 'uppercase' }}>Good</span>
                <code style={{ fontSize: 11, color: 'var(--color-success)', fontFamily: 'monospace', opacity: 0.8 }}>{r.good}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 3: Brand Fidelity */}
      <Section title="Brand Fidelity">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Typography */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 12 }}>Typography</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)' }}>Jost — The Brand Typeface</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
                Use <code style={{ fontFamily: 'monospace', fontSize: 11 }}>fontFace: &apos;Jost&apos;</code> for ALL text elements.
                Never use Calibri, Arial, or any other font. Weight mapping: <code style={{ fontFamily: 'monospace', fontSize: 11 }}>bold: true</code> for weights 600+.
              </p>
            </div>
          </div>

          {/* Colors */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 12 }}>Colors</h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              Derive ALL colors from brand-design-system tokens. Build a palette object. Strip # from all hex values.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { label: 'P.accent', color: '#FF5A28' },
                { label: 'P.text', color: '#1A1B2E' },
                { label: 'P.muted', color: '#6B6F80' },
                { label: 'P.bg', color: '#FAFAFA' },
                { label: 'P.border', color: '#E8E9F0' },
              ].map((c) => (
                <div key={c.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: c.color, border: '1px solid var(--color-border)' }} />
                  <span style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logos */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 12 }}>Logos</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { where: 'Title + closing slides', what: 'Rectangle logo, ~2" wide, prominent' },
                { where: 'Footer (every slide)', what: 'Small rectangle logo, left edge' },
                { where: 'Ratio', what: 'Rectangle: 4:1 — always preserve' },
              ].map((item) => (
                <div key={item.where} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', minWidth: 120 }}>{item.where}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.what}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer bar */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 12 }}>Footer Bar (Every Slide)</h4>
            {/* Mini footer mockup */}
            <div
              style={{
                position: 'relative',
                height: 28,
                borderTop: '1px solid var(--color-border)',
                background: 'var(--color-bg-alt)',
                borderRadius: '0 0 4px 4px',
                display: 'flex',
                alignItems: 'center',
                paddingInline: 12,
              }}
            >
              <div style={{ width: 40, height: 10, borderRadius: 2, background: 'var(--color-primary)', opacity: 0.6 }} />
              <span style={{ fontSize: 8, color: 'var(--color-text-muted)', marginLeft: 8 }}>Section Name</span>
              <span style={{ fontSize: 8, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>3 / 12</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.5, marginTop: 8, marginBottom: 0 }}>
              y: 5.25", h: 0.375". Logo left, section center-left, page number right. Content must end above y: 5.1".
            </p>
          </div>
        </div>

        {/* Self-check */}
        <div style={{ padding: 16, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Brand Self-Check</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 6 }}>
            {[
              'fontFace: \'Jost\' on every addText call?',
              'All colors reference palette object?',
              'Every slide calls footer()?',
              'Logos on first + last slides?',
              'Palette matches brand tokens exactly?',
            ].map((q) => (
              <div key={q} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-body)' }}>
                <div style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, color: 'var(--color-success)', fontWeight: 700 }}>✓</span>
                </div>
                {q}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 4: Design Translation */}
      <Section title="Design Translation — HTML to PPTX">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr 1.2fr',
              gap: 16,
              padding: '10px 16px',
              background: 'var(--color-primary)',
              borderRadius: '6px 6px 0 0',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Concept</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>HTML</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PPTX</span>
          </div>
          {DESIGN_TRANSLATION.map((r, i) => (
            <div
              key={r.concept}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 1.2fr',
                gap: 16,
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'transparent',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)' }}>{r.concept}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.html}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{r.pptx}</span>
            </div>
          ))}
        </div>

        {/* PPTX composition rules */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Horizontal Centering</h4>
            <code style={{ fontSize: 11, color: 'var(--color-text-body)', fontFamily: 'monospace', lineHeight: 1.8, display: 'block' }}>
              total = (count × cardW) + ((count − 1) × gap){'\n'}
              startX = (10 − total) / 2
            </code>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>
              Center card groups on the slide — don&apos;t left-align at margin.
            </p>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Child Centering</h4>
            <code style={{ fontSize: 11, color: 'var(--color-text-body)', fontFamily: 'monospace', lineHeight: 1.8, display: 'block' }}>
              childX = parentX + (parentW − childW) / 2{'\n'}
              childY = parentY + (parentH − childH) / 2
            </code>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>
              Icons, badges, images — always calculate centered position mathematically.
            </p>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Vertical Stacking</h4>
            <code style={{ fontSize: 11, color: 'var(--color-text-body)', fontFamily: 'monospace', lineHeight: 1.8, display: 'block' }}>
              y = startY + i × (itemH + gap)
            </code>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>
              Consistent Y increments form an arithmetic sequence. Card text inset: (x+0.2, y+0.15, w−0.4, h−0.3).
            </p>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Connector Positioning</h4>
            <code style={{ fontSize: 11, color: 'var(--color-text-body)', fontFamily: 'monospace', lineHeight: 1.8, display: 'block' }}>
              arrowX = gapStart + (gapW − arrowW) / 2{'\n'}
              arrowY = cardY + (cardH − arrowH) / 2
            </code>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>
              Arrows occupy dedicated gaps — never overlap card bounding boxes.
            </p>
          </div>
        </div>
      </Section>

      {/* Section 5: Text Overflow Prevention */}
      <Section title="Text Overflow Prevention">
        <div
          style={{
            padding: 16,
            marginBottom: 20,
            borderRadius: 6,
            borderLeft: '3px solid var(--color-danger)',
            background: 'var(--color-surface)',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-danger)' }}>
            The #1 PPTX visual defect: title containers too short for wrapped text
          </span>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, marginBottom: 0, lineHeight: 1.5 }}>
            PptxGenJS does not auto-shrink text. If text overflows, it gets clipped or bleeds. Adapt copy to containers, not containers to copy.
          </p>
        </div>

        {/* Title size reference */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 12 }}>Standard Title Container Sizes</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 80px 1fr', gap: 12, padding: '8px 12px', background: 'var(--color-primary)', borderRadius: '6px 6px 0 0' }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>Font Size</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>1 Line</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>2 Lines</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>Rule</span>
            </div>
            {TITLE_SIZES.map((r, i) => (
              <div
                key={r.fontSize}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 80px 80px 1fr',
                  gap: 12,
                  padding: '8px 12px',
                  background: i % 2 === 0 ? 'var(--color-surface)' : 'transparent',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>{r.fontSize}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{r.oneLine}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)', fontFamily: 'monospace' }}>{r.twoLine}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Capacity formulas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Capacity Formulas</h4>
            <code style={{ fontSize: 11, color: 'var(--color-text-body)', fontFamily: 'monospace', lineHeight: 2, display: 'block' }}>
              chars/line = w / (fontSize × 0.0055){'\n'}
              lines = h / (fontSize × 0.018){'\n'}
              min_h = ceil(chars / chars_per_line) × fontSize × 0.018
            </code>
          </div>
          <div style={{ padding: 16, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Fix Priority</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                '1. Shorten the title copy',
                '2. Increase h to fit wrapped lines',
                '3. Reduce fontSize by 1-2px',
                '4. Never hope it fits — measure it',
              ].map((s) => (
                <span key={s} style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 4-step overflow audit */}
        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 8,
            border: '1px solid var(--color-warning)',
            background: 'var(--color-surface)',
          }}
        >
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-warning)', marginBottom: 12 }}>
            Overflow Audit — Run Per Slide After Positioning
          </h4>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
            For every <code style={{ fontFamily: 'monospace', fontSize: 11 }}>addText</code> call, mentally verify these four checks in order:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { step: '1', text: 'Does the text fit within (w, h) at this fontSize?' },
              { step: '2', text: 'If text wraps, is h tall enough for the wrapped lines?' },
              { step: '3', text: 'Does the text element overlap any adjacent element\'s (x, y, w, h) bounding box?' },
              { step: '4', text: 'Is there at least 0.1" clearance from nearest neighbor?' },
            ].map((item) => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--color-warning)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#FFFFFF' }}>{item.step}</span>
                </div>
                <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5, paddingTop: 2 }}>{item.text}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 16, marginBottom: 0, lineHeight: 1.5 }}>
            If any check fails, fix it before moving to the next slide. Do not defer overflow issues — they compound.
          </p>
        </div>
      </Section>

      {/* Section 6: File Integrity */}
      <Section title="File Integrity — Preventing Repair Errors">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
          Invalid properties or wrong API usage produces corrupt XML that triggers the &ldquo;This file needs to be repaired&rdquo; dialog.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.5fr', gap: 16, padding: '10px 16px', background: 'var(--color-primary)', borderRadius: '6px 6px 0 0' }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>Root Cause</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>Effect</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#FFFFFF', textTransform: 'uppercase' }}>Fix</span>
          </div>
          {INTEGRITY_CAUSES.map((r, i) => (
            <div
              key={r.cause}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1.2fr 1.5fr',
                gap: 16,
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'transparent',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-heading)' }}>{r.cause}</span>
              <span style={{ fontSize: 12, color: 'var(--color-danger)', opacity: 0.8 }}>{r.effect}</span>
              <span style={{ fontSize: 12, color: 'var(--color-success)' }}>{r.fix}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 7: Element Bounds */}
      <Section title="Element Bounds — Preventing Zoom-Out Warnings">
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {/* Visual: slide bounds diagram */}
          <div
            style={{
              flex: '0 0 200px',
              height: 112.5,
              position: 'relative',
              background: 'var(--color-bg-alt)',
              border: '2px solid var(--color-border)',
              borderRadius: 6,
            }}
          >
            {/* Safe area */}
            <div
              style={{
                position: 'absolute',
                top: 6,
                left: 14,
                right: 14,
                bottom: 14,
                border: '1px dashed var(--color-success)',
                borderRadius: 3,
                opacity: 0.5,
              }}
            />
            {/* Out of bounds element */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: -8,
                width: 40,
                height: 24,
                background: 'var(--color-danger)',
                opacity: 0.2,
                borderRadius: 3,
                border: '1px solid var(--color-danger)',
              }}
            />
            <span style={{ position: 'absolute', top: 9, left: 18, fontSize: 7, color: 'var(--color-success)', fontFamily: 'monospace' }}>Safe</span>
            <span style={{ position: 'absolute', top: 22, right: -4, fontSize: 6, color: 'var(--color-danger)', fontFamily: 'monospace' }}>OOB</span>
            <span style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', fontSize: 7, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
              x+w ≤ 10, y+h ≤ 5.625
            </span>
          </div>

          {/* Bounds table */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {BOUNDS_PATTERNS.map((b) => (
                <div key={b.pattern} style={{ display: 'flex', gap: 12, padding: '8px 12px', background: 'var(--color-surface)', borderRadius: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-heading)', minWidth: 130 }}>{b.pattern}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-danger)', minWidth: 150, opacity: 0.8 }}>{b.risk}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-success)' }}>{b.fix}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 10, borderRadius: 4, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                Safe margins: right edge ≤ 9.3" (0.7" margin), bottom ≤ 5.1" (above footer)
              </span>
            </div>
          </div>
        </div>

        {/* Bounds-checking helper */}
        <div
          style={{
            padding: 20,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}
        >
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>
            Bounds-Checking Helper
          </h4>
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
            Add this guard at the top of the export function. All elements must satisfy{' '}
            <code style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-heading)' }}>x + w &lt;= 10.0</code> and{' '}
            <code style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-heading)' }}>y + h &lt;= 5.625</code>.
            Call it for every <code style={{ fontFamily: 'monospace', fontSize: 11 }}>addText</code>,{' '}
            <code style={{ fontFamily: 'monospace', fontSize: 11 }}>addShape</code>, and{' '}
            <code style={{ fontFamily: 'monospace', fontSize: 11 }}>addImage</code> during development.
          </p>
          <div
            style={{
              padding: 12,
              borderRadius: 6,
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
            }}
          >
            <code style={{ fontSize: 11, color: 'var(--color-text-body)', fontFamily: 'monospace', lineHeight: 1.8, display: 'block', whiteSpace: 'pre' }}>
              {'const SW = 10, SH = 5.625;\nfunction chk(x, y, w, h) {\n  if (x + w > SW || y + h > SH)\n    console.warn(`OOB: (${x},${y}) ${w}x${h} exceeds ${SW}x${SH}`);\n}'}
            </code>
          </div>
        </div>
      </Section>

      {/* Section 8: Spatial Balance */}
      <Section title="Spatial Balance">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Good: centered */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balanced</span>
            </div>
            <div style={{ height: 100, background: 'var(--color-bg-alt)', borderRadius: 4, position: 'relative', border: '1px solid var(--color-border)' }}>
              <div style={{ position: 'absolute', top: 20, left: 20, right: 20, height: 60, background: 'var(--color-primary)', opacity: 0.15, borderRadius: 4 }} />
              <span style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'var(--color-text-muted)' }}>equal</span>
              <span style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'var(--color-text-muted)' }}>equal</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>
              Content vertically centered: center_y = (5.625 − content_h) / 2
            </p>
          </div>

          {/* Bad: top-heavy */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-danger)', background: 'var(--color-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-danger)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Top-Heavy</span>
            </div>
            <div style={{ height: 100, background: 'var(--color-bg-alt)', borderRadius: 4, position: 'relative', border: '1px solid var(--color-border)' }}>
              <div style={{ position: 'absolute', top: 6, left: 20, right: 20, height: 40, background: 'var(--color-danger)', opacity: 0.15, borderRadius: 4 }} />
              <span style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'var(--color-danger)' }}>dead space</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, marginBottom: 0 }}>
              Content anchored to top with 1.5"+ empty space at bottom.
            </p>
          </div>
        </div>

        {/* Split layout balance */}
        <div style={{ padding: 16, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Split Layout Balance</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {[
              'Add supporting detail text on lighter side',
              'Add secondary visual (stat, badge, accent)',
              'Redistribute content to equalize',
              'Switch to full-width if split fails',
              'Use valign: middle to spread elements',
            ].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--color-text-body)' }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 6 }} />
                {s}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12, marginBottom: 0 }}>
            The test: draw a vertical line down the middle. Does each half have roughly similar visual weight?
          </p>
        </div>
      </Section>

      {/* Section 9: Image Aspect Ratio & Icon Export */}
      <Section title="Image Aspect Ratio & Icon Export">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Aspect ratio */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 12 }}>Aspect Ratio Preservation</h4>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 12 }}>
              {/* Correct ratio */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 20, background: 'var(--color-primary)', borderRadius: 4, opacity: 0.7 }} />
                <span style={{ fontSize: 10, color: 'var(--color-success)', marginTop: 4, display: 'block' }}>4:1 correct</span>
              </div>
              {/* Wrong ratio */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 80, height: 40, background: 'var(--color-danger)', borderRadius: 4, opacity: 0.3 }} />
                <span style={{ fontSize: 10, color: 'var(--color-danger)', marginTop: 4, display: 'block' }}>stretched</span>
              </div>
            </div>
            <code style={{ fontSize: 11, color: 'var(--color-text-body)', fontFamily: 'monospace', display: 'block', lineHeight: 1.8 }}>
              h = w / ratio{'\n'}
              Rectangle logo: w:2, h:0.5 (4:1){'\n'}
              Square logo: w:0.4, h:0.4 (1:1)
            </code>
          </div>

          {/* Icon export */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 12 }}>renderPhosphorIcon</h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
              Converts Phosphor Icon CSS classes to PNG data URIs at export time via canvas rendering.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Use for prominent visual icons (cards, features)',
                'Always square: w === h',
                'Full class: \'ph ph-envelope-simple\'',
                'Color with # prefix (CSS hex)',
                'Center in container mathematically',
              ].map((s) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-body)' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 10: Element Overlap */}
      <Section title="Element Overlap — Bounding Box Collisions">
        <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
          {/* Visual: overlap diagram */}
          <div style={{ flex: '0 0 200px' }}>
            <div style={{ position: 'relative', height: 100, background: 'var(--color-bg-alt)', borderRadius: 6, border: '1px solid var(--color-border)' }}>
              {/* Two overlapping boxes */}
              <div style={{ position: 'absolute', top: 15, left: 15, width: 100, height: 35, border: '1.5px solid var(--color-danger)', borderRadius: 4, opacity: 0.5 }}>
                <span style={{ fontSize: 8, padding: 4, color: 'var(--color-danger)' }}>Title w:8.6"</span>
              </div>
              <div style={{ position: 'absolute', top: 25, left: 90, width: 90, height: 55, border: '1.5px solid var(--color-secondary)', borderRadius: 4, background: 'var(--color-secondary)', opacity: 0.1 }} />
              <span style={{ position: 'absolute', top: 27, left: 95, fontSize: 8, color: 'var(--color-secondary)' }}>Card</span>
              <span style={{ position: 'absolute', bottom: 4, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'var(--color-danger)' }}>Overlap!</span>
            </div>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4, textAlign: 'center' }}>
              Fix: restrict title w to stop before card
            </p>
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.6, marginTop: 0, marginBottom: 12 }}>
              No two independent element bounding boxes should overlap. Minimum clearance: <strong>0.15&quot;</strong> between adjacent elements.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Full-width title + side card → restrict title w before card x',
                'Tight title-subtitle stacking → ensure 0.15" gap (not 0.05")',
                'Loop-generated elements → verify step ≥ h + 0.15',
                'Split layouts → titles use column width, not CW',
              ].map((s) => (
                <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--color-text-body)' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 6 }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 11: Validation Checklist */}
      <Section title="Validation Checklist">
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
          Run this 12-category checklist after completing the PPTX export function, before delivering.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {CHECKLIST_CATEGORIES.map((cat) => (
            <div
              key={cat.category}
              style={{
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 10 }}>
                {cat.category}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cat.items.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        border: '1.5px solid var(--color-border)',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

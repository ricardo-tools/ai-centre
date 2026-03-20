'use client';

import { CodeBlock } from '@/platform/components/CodeBlock';

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

function DiagramBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flex: 1, minWidth: 200 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{label}</div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 11,
          lineHeight: 1.6,
          color: 'var(--color-text-body)',
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: 16,
          whiteSpace: 'pre',
          overflowX: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  );
}


function ChecklistGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ padding: 16, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}>
      <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 12 }}>{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((item) => (
          <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-border)', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppLayoutPatternsReferenceShowcase() {
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
          This is a reference companion to <strong style={{ color: 'var(--color-text-heading)' }}>app-layout</strong>. It contains lookup data — token values, pattern specifications, and configuration templates. Pattern A (TopBar + Sidebar) is documented in the main app-layout skill.
        </p>
      </div>

      {/* Section 1: Pattern B — TopBar + Mega Menus */}
      <Section title="Pattern B: TopBar + Mega Menus">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
          Single horizontal navigation bar with dropdown mega menus. Full-width content below. Best for marketing sites, e-commerce, and documentation with 4-8 top-level categories.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <DiagramBox label="XS/SM — Mobile">
{`┌──────────────────────────┐
│ [☰] [Logo]    [Search] [A]│
├──────────────────────────┤
│                          │
│     Content Slot         │
│     (full width)         │
│                          │
└──────────────────────────┘`}
          </DiagramBox>
          <DiagramBox label="MD — Tablet">
{`┌──────────────────────────────┐
│ [Logo] [Cat1] [Cat2] [More ▾]│
├──────────────────────────────┤
│                              │
│       Content Slot           │
│       (full width)           │
│                              │
└──────────────────────────────┘`}
          </DiagramBox>
          <DiagramBox label="LG — Desktop">
{`┌──────────────────────────────────────┐
│ [Logo] [Cat1]..[Cat5] [Search] [A]  │
├──────────────────────────────────────┤
│                                      │
│         Content Slot                 │
│         (full width)                 │
│                                      │
└──────────────────────────────────────┘
  ── Mega menu on hover/click ──
  ┌────────────────────────────────────┐
  │ Section A    Section B    Featured │
  │ Link 1       Link 1       [Image] │
  │ Link 2       Link 2       Promo   │
  └────────────────────────────────────┘`}
          </DiagramBox>
        </div>
      </Section>

      {/* Section 2: Pattern B Breakpoint Table */}
      <Section title="Pattern B — Breakpoint Behavior">
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Breakpoint</th>
                <th style={headerCellStyle}>Columns</th>
                <th style={headerCellStyle}>Nav State</th>
                <th style={headerCellStyle}>MegaNav Variant</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>XS/SM (&lt; 768px)</td>
                <td style={cellStyle}>1 col, 1fr</td>
                <td style={cellStyle}>Hamburger; slide-out drawer from left</td>
                <td style={cellStyle}>Compact: logo + hamburger + avatar</td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>MD (768-1023px)</td>
                <td style={cellStyle}>1 col, 1fr</td>
                <td style={cellStyle}>Condensed horizontal; overflow into "More" dropdown</td>
                <td style={cellStyle}>Medium: logo + truncated nav + avatar</td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>LG (1024px+)</td>
                <td style={cellStyle}>1 col, 1fr</td>
                <td style={cellStyle}>Full horizontal nav with mega menu on hover/click</td>
                <td style={cellStyle}>Full: logo + all nav + search + controls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 3: Pattern B Grid & Widget Config */}
      <Section title="Pattern B — Grid & Widget Positions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Grid Config</h4>
            <CodeBlock language="ts">{`grid: {
  columns: 1,
  rows: 'auto',
  rowHeight: { default: 52, lg: 56 },
  gap: 0,
}`}</CodeBlock>
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Widget Positions</h4>
            <CodeBlock language="ts">{`widgets: [
  { widgetName: 'mega-nav',
    size: { default: 'xs', sm: 'sm',
            md: 'md', lg: 'lg' },
    grid: { default: { col: 1, colSpan: 1,
                        row: 1, rowSpan: 1 } } },
  { type: 'slot', name: 'main-content',
    grid: { default: { col: 1, colSpan: 1,
                        row: 2, rowSpan: 20 } } },
]`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 4: Pattern B — MegaNav Zone Layout */}
      <Section title="Pattern B — MegaNav Three-Zone Layout (LG)">
        <div style={{ marginBottom: 16 }}>
          <DiagramBox label="56px NavBar">
{`┌──────────────────────────────────────────────────────┐
│ [Logo 160px] │ [Nav Items flex:1 gap:0] │ [Controls] │
└──────────────────────────────────────────────────────┘`}
          </DiagramBox>
        </div>
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Zone</th>
                <th style={headerCellStyle}>Width</th>
                <th style={headerCellStyle}>Key Styles</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>Logo (left)</td>
                <td style={cellStyle}>160px fixed</td>
                <td style={cellStyle}>flexShrink: 0, paddingLeft: 24, logo 32px tall</td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>Nav Items (center)</td>
                <td style={cellStyle}>flex: 1</td>
                <td style={cellStyle}>alignItems: stretch, gap: 0, paddingLeft: 8. Items: paddingInline: 16, fontSize: 14, fontWeight: 500</td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>Controls (right)</td>
                <td style={cellStyle}>auto</td>
                <td style={cellStyle}>gap: 10, paddingRight: 24, search 36x36, avatar 36x36 circle</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 5: Mega Menu Panel Specs */}
      <Section title="Pattern B — Mega Menu Panel Specs">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 12 }}>
          {[
            { label: 'Position', value: 'absolute, top: 56px, flush below navbar' },
            { label: 'Full-width variant', value: 'left: 0, right: 0 — for 3+ sections' },
            { label: 'Content-width', value: 'minWidth: 480px, maxWidth: 720px — for 1-2 sections' },
            { label: 'Background', value: 'var(--color-surface)' },
            { label: 'Border', value: '1px solid var(--color-border), borderTop: none' },
            { label: 'Border Radius', value: '0 0 8px 8px (bottom corners)' },
            { label: 'Shadow', value: '0 8px 24px rgba(0,0,0,0.12)' },
            { label: 'Padding', value: '24px' },
            { label: 'Z-Index', value: '100 (panel), 99 (backdrop)' },
            { label: 'Internal Grid', value: 'repeat(auto-fit, minmax(180px, 1fr)), gap: 32' },
            { label: 'Open Animation', value: 'translateY(-8px) → 0, 200ms' },
            { label: 'Close Animation', value: 'opacity 1 → 0, 150ms' },
          ].map((spec) => (
            <div key={spec.label} style={{ padding: 12, background: 'var(--color-bg-alt)', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{spec.label}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{spec.value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 6: Pattern C — Sidebar Only */}
      <Section title="Pattern C: Sidebar Only">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
          No top bar. Fixed sidebar contains logo, navigation, and user controls. Content fills the remaining viewport. Best for admin panels, settings-heavy apps, and developer tools.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <DiagramBox label="XS/SM — Mobile">
{`┌──────────────────────────┐
│ [☰] [Logo]         [A]  │ ← 48px
├──────────────────────────┤
│                          │
│     Content Slot         │
│     (full width)         │
│                          │
└──────────────────────────┘`}
          </DiagramBox>
          <DiagramBox label="MD — Tablet (48px icon sidebar)">
{`┌────┬─────────────────────┐
│ ⌂  │                     │
│ ☐  │                     │
│ ☐  │   Content Slot      │
│ ☐  │   (flexible)        │
│    │                     │
│ [A]│                     │
└────┴─────────────────────┘
 48px`}
          </DiagramBox>
          <DiagramBox label="LG — Desktop (220px sidebar)">
{`┌──────────┬───────────────────┐
│ [Logo]   │                   │
│ ──────── │                   │
│ Section  │                   │
│  Nav 1   │  Content Slot     │
│  Nav 2 ● │  (flexible)       │
│  Nav 3   │                   │
│ ──────── │                   │
│ [Avatar] │                   │
│ [Gear]   │                   │
└──────────┴───────────────────┘
   220px`}
          </DiagramBox>
        </div>
      </Section>

      {/* Section 7: Pattern C Breakpoint + Grid */}
      <Section title="Pattern C — Breakpoint Behavior & Grid">
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8, marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Breakpoint</th>
                <th style={headerCellStyle}>Columns</th>
                <th style={headerCellStyle}>Sidebar State</th>
                <th style={headerCellStyle}>Mobile Header</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>XS/SM (&lt; 768px)</td>
                <td style={cellStyle}>1 col, 1fr</td>
                <td style={cellStyle}>Hidden; slide-out drawer via hamburger</td>
                <td style={cellStyle}>Visible: 48px header</td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>MD (768-1023px)</td>
                <td style={cellStyle}>2 cols, 48px 1fr</td>
                <td style={cellStyle}>Icon-only (48px) with tooltips</td>
                <td style={cellStyle}>Hidden</td>
              </tr>
              <tr>
                <td style={{ ...cellStyle, fontWeight: 600 }}>LG (1024px+)</td>
                <td style={cellStyle}>2 cols, 220px 1fr</td>
                <td style={cellStyle}>Full sidebar with logo, nav, footer</td>
                <td style={cellStyle}>Hidden</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Grid Config</h4>
            <CodeBlock language="ts">{`grid: {
  columns: { default: 1, md: 2 },
  columnTemplate: {
    default: '1fr',
    md: '48px 1fr',
    lg: '220px 1fr',
  },
  rows: 'auto',
  rowHeight: 'auto',
  gap: 0,
}`}</CodeBlock>
          </div>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Widget Positions</h4>
            <CodeBlock language="ts">{`widgets: [
  { widgetName: 'mobile-header',
    size: { default: 'xs', sm: 'sm' },
    grid: {
      default: { col:1, colSpan:1,
                  row:1, rowSpan:1 },
      md: null } },
  { widgetName: 'sidebar-full',
    size: { default:'xs', md:'md', lg:'lg' },
    grid: {
      default: null,
      md: { col:1, colSpan:1,
            row:1, rowSpan:20 } } },
  { type:'slot', name:'main-content',
    grid: {
      default: { col:1, row:2, rowSpan:20 },
      md: { col:2, row:1, rowSpan:20 } } },
]`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 8: Pattern C — Sidebar Three-Zone Layout */}
      <Section title="Pattern C — Sidebar Three-Zone Layout (LG)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: '1 1 200px', minWidth: 200 }}>
            <DiagramBox label="220px Sidebar Zones">
{`┌──────────────────┐
│  Zone 1: Logo    │  fixed (56px)
│  (56px)          │
├──────────────────┤
│  Zone 2: Nav     │  scrollable
│  (flex: 1)       │  overflowY: auto
│  ...             │
├──────────────────┤
│  Zone 3: Footer  │  fixed
│  (auto)          │
└──────────────────┘`}
            </DiagramBox>
          </div>
          <div style={{ flex: '2 1 320px', minWidth: 280 }}>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Zone</th>
                    <th style={headerCellStyle}>Height</th>
                    <th style={headerCellStyle}>Key Specs</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>Logo (top)</td>
                    <td style={cellStyle}>56px</td>
                    <td style={cellStyle}>paddingInline: 16, logo 28px, borderBottom: 1px var(--color-sidebar-section)</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>Nav (middle)</td>
                    <td style={cellStyle}>flex: 1</td>
                    <td style={cellStyle}>overflowY: auto, padding 8px top/bottom. Items: padding 8px 16px, marginInline 8, borderRadius 6</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>Footer (bottom)</td>
                    <td style={cellStyle}>auto</td>
                    <td style={cellStyle}>padding: 12, borderTop: 1px, avatar 32x32, name fontSize: 13, gear icon 18px</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16, overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Nav Element</th>
                    <th style={headerCellStyle}>Font</th>
                    <th style={headerCellStyle}>Active State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>Section header</td>
                    <td style={cellStyle}>11px, 700, uppercase, 0.5px spacing</td>
                    <td style={cellStyle}>--color-sidebar-section</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>Nav item</td>
                    <td style={cellStyle}>14px, 400, icon 20px regular</td>
                    <td style={cellStyle}>bg: --color-sidebar-hover, icon: fill weight, text: --color-sidebar-text-active</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>Sub-nav item</td>
                    <td style={cellStyle}>13px, 400, paddingLeft: 46px, no icon</td>
                    <td style={cellStyle}>text: --color-sidebar-text-active, fontWeight: 500</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 9: Pattern D — Minimal */}
      <Section title="Pattern D: Minimal (No Shell)">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: 24, marginTop: 0 }}>
          No persistent navigation. The entire viewport is the content area. Optional minimal header (logo only) for brand presence. Used for login, onboarding, full-screen editors, and focused flows.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <DiagramBox label="XS/SM — With Header">
{`┌──────────────────────────┐
│        [Logo]            │ ← 48px
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │   Card / Form      │  │
│  │   (full width      │  │
│  │    minus padding)  │  │
│  └────────────────────┘  │
│                          │
└──────────────────────────┘`}
          </DiagramBox>
          <DiagramBox label="MD — Centered Content">
{`┌──────────────────────────────┐
│           [Logo]             │ ← 56px
├──────────────────────────────┤
│                              │
│     ┌──────────────────┐     │
│     │   Card / Form    │     │
│     │   (max-w 480px)  │     │
│     │   centered       │     │
│     └──────────────────┘     │
│                              │
└──────────────────────────────┘`}
          </DiagramBox>
          <DiagramBox label="LG — Full-screen Editor">
{`┌──────────────────────────────┐
│                              │
│    Full-screen content       │
│    (no constraints)          │
│                              │
└──────────────────────────────┘`}
          </DiagramBox>
        </div>
      </Section>

      {/* Section 10: Pattern D — Content Container Specs */}
      <Section title="Pattern D — Content Container & Card Specs">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Container Max-Widths</h4>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Breakpoint</th>
                    <th style={headerCellStyle}>Max Width</th>
                    <th style={headerCellStyle}>Padding</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>XS (&lt; 640px)</td>
                    <td style={cellStyle}>100%</td>
                    <td style={cellStyle}>16px each side</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>SM (640-767px)</td>
                    <td style={cellStyle}>100%</td>
                    <td style={cellStyle}>24px each side</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>MD (768-1023px)</td>
                    <td style={cellStyle}>480px</td>
                    <td style={cellStyle}>24px each side</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>LG (1024px+)</td>
                    <td style={cellStyle}>520px</td>
                    <td style={cellStyle}>32px each side</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Card Styles by Breakpoint</h4>
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={headerCellStyle}>Property</th>
                    <th style={headerCellStyle}>XS</th>
                    <th style={headerCellStyle}>SM+</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>borderRadius</td>
                    <td style={cellStyle}>0</td>
                    <td style={cellStyle}>12</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>border</td>
                    <td style={cellStyle}>none</td>
                    <td style={cellStyle}>1px solid var(--color-border)</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>boxShadow</td>
                    <td style={cellStyle}>none</td>
                    <td style={cellStyle}>0 1px 3px rgba(0,0,0,0.06)</td>
                  </tr>
                  <tr>
                    <td style={{ ...cellStyle, fontWeight: 600 }}>padding</td>
                    <td style={cellStyle}>24</td>
                    <td style={cellStyle}>32 (MD), 40 (LG)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Background Treatment Options</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 12 }}>
            {[
              { name: 'Solid (default)', use: 'Login, signup, forms', value: 'var(--color-bg) or var(--color-bg-alt)' },
              { name: 'Gradient', use: 'Landing, onboarding', value: 'linear-gradient(135deg, var(--color-bg), var(--color-bg-alt))' },
              { name: 'Image', use: 'Marketing (sparingly)', value: 'backgroundSize: cover + card backdrop blur' },
            ].map((opt) => (
              <div key={opt.name} style={{ padding: 14, border: '1px solid var(--color-border)', borderRadius: 8, background: 'var(--color-surface)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{opt.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>{opt.use}</div>
                <code style={{ fontSize: 11, color: 'var(--color-secondary)', wordBreak: 'break-all' }}>{opt.value}</code>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Section 11: Spacing Reference Table */}
      <Section title="Spacing Principles by Pattern">
        <div style={{ overflowX: 'auto', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={headerCellStyle}>Metric</th>
                <th style={headerCellStyle}>Pattern B</th>
                <th style={headerCellStyle}>Pattern C</th>
                <th style={headerCellStyle}>Pattern D</th>
              </tr>
            </thead>
            <tbody>
              {[
                { metric: 'Horizontal padding (LG)', b: '24px', c: '16px (sidebar)', d: '32px (page)' },
                { metric: 'Horizontal padding (MD)', b: '16px', c: '0px (icon sidebar)', d: '24px' },
                { metric: 'Horizontal padding (XS)', b: '12px', c: '12px (header)', d: '16px' },
                { metric: 'Nav item gap', b: '0 (paddingInline: 16)', c: 'marginInline: 8, borderRadius: 6', d: 'N/A' },
                { metric: 'Right controls gap', b: '10px', c: 'N/A', d: 'N/A' },
                { metric: 'Section separation', b: 'N/A (mega menu columns)', c: '8px + 1px border + 8px = 17px', d: 'N/A' },
                { metric: 'Logo zone height', b: '56px (navbar)', c: '56px (matches Pattern A)', d: '48px (XS) / 56px (MD+)' },
              ].map((row) => (
                <tr key={row.metric}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{row.metric}</td>
                  <td style={cellStyle}>{row.b}</td>
                  <td style={cellStyle}>{row.c}</td>
                  <td style={cellStyle}>{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Section 12: Implementation Checklists */}
      <Section title="Implementation Checklists">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
          <ChecklistGroup
            title="Pattern B (TopBar + Mega Menus)"
            items={[
              'Shell grid: single column at all breakpoints',
              'MegaNav widget spans full width every breakpoint',
              'Mega menu uses var(--color-surface) + var(--color-border)',
              'Mega menu z-index: 100, backdrop z-index: 99',
              'Hover trigger: 150ms delay',
              'Close: click outside, Escape, hover away (300ms)',
              'Keyboard nav: Tab, Enter, ArrowDown, ArrowLeft/Right, Escape',
              'Mobile: accordion nav in drawer (not mega menu)',
              'Tablet: "More" overflow dropdown',
              'Open animation: translateY(-8px) to 0, 200ms',
              'Full-width menus for 3+ sections',
            ]}
          />
          <ChecklistGroup
            title="Pattern C (Sidebar Only)"
            items={[
              'Three-zone layout: fixed logo, scrollable nav, fixed footer',
              'Nav zone scrolls independently (overflowY: auto)',
              'Icon-only (MD): tooltips on 400ms hover delay',
              'Icon-only hides text labels, section headers, gear',
              'Mobile header only renders at XS/SM (md: null)',
              'Mobile drawer: 280px, left-to-right slide',
              'Backdrop rgba(0,0,0,0.4) at z-index 199, drawer z-index 200',
              'Nav items: marginInline 8, borderRadius 6',
              'Sub-nav: paddingLeft 46px (aligns with parent label)',
              'Active: fill icon + --color-sidebar-text-active',
              'Logo zone 56px (matches Pattern A)',
            ]}
          />
          <ChecklistGroup
            title="Pattern D (Minimal / No Shell)"
            items={[
              'Decided: minimal header or fully headerless',
              'Minimal header: centered, logo-only, no navigation',
              'Container maxWidth: 100% mobile, 480px tablet, 520px desktop',
              'Card edge-to-edge on mobile (no border/radius/shadow)',
              'Card has border + shadow on SM+',
              'Vertical centering when short, flex-start when tall',
              'Background treatment chosen (solid / gradient / image)',
              'paddingInline scales: 16 / 24 / 32',
              'Card padding scales: 24 / 32 / 40',
              'No persistent navigation elements',
              'overflow: auto (forms) or hidden (editors)',
            ]}
          />
        </div>
      </Section>
    </div>
  );
}

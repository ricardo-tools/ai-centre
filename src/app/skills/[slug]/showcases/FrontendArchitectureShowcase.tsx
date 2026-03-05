'use client';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const LAYERS = [
  { name: 'Screen Renderer', desc: 'Typed config → responsive grid → renders widgets into cells', color: '#FF5A28', file: 'ScreenRenderer.tsx' },
  { name: 'Screen Config', desc: 'Declares theme, locale, grid layout, and widget placements', color: '#B88A30', file: 'Dashboard.screen.ts' },
  { name: 'Slots', desc: 'Named insertion points for infinite nesting of screen configs', color: '#3D8B62', file: '{ type: "slot", name }' },
  { name: 'Widgets', desc: 'Self-contained UI + data hook, implements RenderableWidget, 4 size variants', color: '#2E9089', file: 'TopNavWidget.tsx' },
  { name: 'Components', desc: 'Stateless, props-only, no data fetching — pure UI atoms', color: '#1462D2', file: 'Button.tsx' },
  { name: 'Domain Objects', desc: 'TypeScript classes, zero framework deps, pure business logic', color: '#6858A5', file: 'Order.ts' },
  { name: 'ACL Mappers', desc: 'API shape → domain object, protects your domain from external changes', color: '#1F2B7A', file: 'order.mapper.ts' },
];

export function FrontendArchitectureShowcase() {
  return (
    <div>
      {/* ---- 7-Layer Architecture ---- */}
      <Section title="7-Layer Architecture">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>Each layer has a strict boundary. Data flows down, events bubble up. No layer skips.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {LAYERS.map((layer, i) => (
            <div key={layer.name} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              {/* Layer number */}
              <div style={{ width: 32, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', flexShrink: 0 }}>
                {i + 1}
              </div>
              {/* Layer bar */}
              <div style={{ flex: 1, padding: '12px 16px', borderRadius: 6, background: layer.color, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{layer.name}</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '2px 0 0' }}>{layer.desc}</p>
                </div>
                <code style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', flexShrink: 0, marginLeft: 16 }}>{layer.file}</code>
              </div>
            </div>
          ))}
        </div>
        {/* Arrow */}
        <div style={{ textAlign: 'center', margin: '12px 0', fontSize: 12, color: 'var(--color-text-muted)' }}>
          ↑ External Data (REST, GraphQL, CMS) enters through ACL Mappers
        </div>
      </Section>

      {/* ---- Data Flow ---- */}
      <Section title="Data Flow">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 24, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'API Response', bg: 'var(--color-bg-alt)' },
            { label: 'ACL Mapper', bg: '#1F2B7A' },
            { label: 'Domain Object', bg: '#6858A5' },
            { label: 'Widget Hook', bg: '#2E9089' },
            { label: 'Widget UI', bg: '#2E9089' },
            { label: 'Component', bg: '#1462D2' },
          ].map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ padding: '8px 14px', borderRadius: 6, background: step.bg, color: i === 0 ? 'var(--color-text-body)' : '#fff', fontSize: 12, fontWeight: 600, border: i === 0 ? '1px solid var(--color-border)' : 'none' }}>
                {step.label}
              </div>
              {i < 5 && <span style={{ color: 'var(--color-text-muted)', fontSize: 16 }}>→</span>}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Widget Anatomy ---- */}
      <Section title="Widget Anatomy">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>A widget is self-contained: it fetches its own data, manages its state, and renders at 4 size variants.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>File Structure</p>
            <div style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 2, color: 'var(--color-text-body)' }}>
              <div>📁 <strong>TopNavWidget/</strong></div>
              <div style={{ paddingLeft: 20 }}>├─ TopNavWidget.tsx <span style={{ color: 'var(--color-text-muted)' }}>← root</span></div>
              <div style={{ paddingLeft: 20 }}>├─ TopNavLG.tsx <span style={{ color: 'var(--color-text-muted)' }}>← desktop</span></div>
              <div style={{ paddingLeft: 20 }}>├─ TopNavMD.tsx <span style={{ color: 'var(--color-text-muted)' }}>← tablet</span></div>
              <div style={{ paddingLeft: 20 }}>├─ TopNavSM.tsx <span style={{ color: 'var(--color-text-muted)' }}>← mobile</span></div>
              <div style={{ paddingLeft: 20 }}>└─ useTopNav.ts <span style={{ color: 'var(--color-text-muted)' }}>← data hook</span></div>
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size Variants</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['XS', 'SM', 'MD', 'LG'].map((size) => (
                <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 22, borderRadius: 4, background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)' }}>{size}</span>
                  <div style={{ flex: 1, height: 22, borderRadius: 4, background: 'var(--color-secondary)', opacity: size === 'LG' ? 1 : size === 'MD' ? 0.7 : size === 'SM' ? 0.5 : 0.3 }} />
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>Screen Renderer passes <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>size</code> prop based on grid config + breakpoint</p>
          </div>
        </div>
      </Section>

      {/* ---- Grid System ---- */}
      <Section title="Grid System">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Every screen uses a column × row grid. Both axes are explicit — widgets declare position and span on both. This enforces consistent alignment across the entire layout.</p>

        {/* Responsive<T> */}
        <div style={{ marginBottom: 20, padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Responsive{'<T>'} — Mobile-First Values</p>
          <pre style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-body)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
{`type Responsive<T> = T | { default: T; sm?: T; md?: T; lg?: T };

// Plain value → same at all breakpoints
columns: 12

// Object → cascades mobile-first: default → sm → md → lg
columns: { default: 1, sm: 2, lg: 12 }`}
          </pre>
        </div>

        {/* GridConfig */}
        <div style={{ marginBottom: 20, padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>GridConfig (Screen-Level)</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { prop: 'columns', desc: 'Number of column tracks', example: '{ default: 1, sm: 2, lg: 12 }' },
              { prop: 'columnTemplate', desc: 'CSS grid-template-columns override', example: "{ default: '1fr', lg: '220px 1fr' }" },
              { prop: 'rows', desc: "Explicit count or 'auto' to grow", example: "'auto'" },
              { prop: 'rowHeight', desc: "Fixed px or 'auto' for content-sized", example: "{ default: 'auto', lg: 60 }" },
              { prop: 'gap', desc: 'Gap between cells in px', example: '{ default: 12, md: 16 }' },
            ].map((item) => (
              <div key={item.prop} style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)' }}>
                <code style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)' }}>{item.prop}</code>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '4px 0 4px' }}>{item.desc}</p>
                <code style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{item.example}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Visual grid demo */}
        <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Widget Positioning — col, colSpan, row, rowSpan</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'repeat(4, 48px)', gap: 4 }}>
            {/* Widget A: col 1, colSpan 4, row 1, rowSpan 2 */}
            <div style={{ gridColumn: '1 / span 4', gridRow: '1 / span 2', borderRadius: 6, background: '#1462D2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Widget A</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>col:1 span:4 row:1 span:2</span>
            </div>
            {/* Widget B: col 5, colSpan 8, row 1, rowSpan 4 */}
            <div style={{ gridColumn: '5 / span 8', gridRow: '1 / span 4', borderRadius: 6, background: '#FF5A28', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Widget B</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>col:5 span:8 row:1 span:4</span>
            </div>
            {/* Widget C: col 1, colSpan 4, row 3, rowSpan 2 */}
            <div style={{ gridColumn: '1 / span 4', gridRow: '3 / span 2', borderRadius: 6, background: '#1F2B7A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>Widget C</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>col:1 span:4 row:3 span:2</span>
            </div>
          </div>
          <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12 }}>Grid cells use <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>display: grid</code> — widgets stretch to fill automatically. No manual height hacks.</p>
        </div>
      </Section>

      {/* ---- Screen Config & Slots ---- */}
      <Section title="Screen Config & Slots">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Screen Config</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 12 }}>A typed class that declares the entire page layout — grid, widgets, positions, theme, and locale.</p>
            <pre style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-body)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
{`class DashboardConfig {
  grid = { columns: 12,
           rows: 'auto',
           rowHeight: 60, gap: 16 };
  theme = 'light';
  locale = 'en-AU';
  widgets = [
    { widgetName: 'overdue-amount',
      size: { default:'xs', lg:'lg' },
      grid: { col:1, colSpan:4,
              row:1, rowSpan:2 } },
  ];
}`}
            </pre>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Slots — Infinite Nesting</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 12 }}>Named mount points where child Screen Renderers are injected. Nesting is unlimited.</p>
            {/* Nesting diagram */}
            <div style={{ padding: 12, borderRadius: 6, border: '2px solid #FF5A28', background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#FF5A28' }}>App Shell (Screen Renderer)</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <div style={{ padding: 8, borderRadius: 4, background: '#1462D2', flex: '0 0 60px' }}>
                  <span style={{ fontSize: 10, color: '#fff' }}>TopNav</span>
                </div>
                <div style={{ flex: 1, padding: 8, borderRadius: 4, border: '2px dashed var(--color-secondary)' }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-secondary)' }}>Slot: main-content</span>
                  <div style={{ marginTop: 6, padding: 8, borderRadius: 4, border: '2px solid #1F2B7A', background: 'var(--color-surface)' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#1F2B7A' }}>Dashboard (nested Screen Renderer)</span>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      <div style={{ flex: 1, padding: 4, borderRadius: 3, background: '#1462D2', fontSize: 9, color: '#fff', textAlign: 'center' }}>Widget</div>
                      <div style={{ flex: 2, padding: 4, borderRadius: 3, background: '#1462D2', fontSize: 9, color: '#fff', textAlign: 'center' }}>Widget</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>No parent/child awareness — each Screen Renderer is independent.</p>
          </div>
        </div>
      </Section>

      {/* ---- Responsiveness ---- */}
      <Section title="Responsiveness">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Handled entirely by the Screen Renderer — widgets never detect their own breakpoint.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Breakpoints */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Breakpoints</span>
            </div>
            {[
              { size: 'xs', min: '0px', desc: 'Mobile (default)' },
              { size: 'sm', min: '640px', desc: 'Small tablet' },
              { size: 'md', min: '768px', desc: 'Tablet' },
              { size: 'lg', min: '1024px', desc: 'Desktop' },
            ].map((bp, i) => (
              <div key={bp.size} style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
                <code style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-secondary)', width: 32 }}>{bp.size}</code>
                <span style={{ fontSize: 13, color: 'var(--color-text-body)', width: 64 }}>{bp.min}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{bp.desc}</span>
              </div>
            ))}
          </div>
          {/* Size resolution flow */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size Resolution Flow</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Screen Renderer detects viewport breakpoint', icon: '1' },
                { label: 'Reads widget size config for that breakpoint', icon: '2' },
                { label: 'Passes size prop (xs/sm/md/lg) to widget', icon: '3' },
                { label: 'Widget renders the matching variant', icon: '4' },
              ].map((step) => (
                <div key={step.icon} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{step.icon}</div>
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{step.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: 0 }}><strong>Rule:</strong> Widgets NEVER import useMediaQuery or detect breakpoints. Only consume the <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>size</code> prop.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Styling Rules ---- */}
      <Section title="Styling Rules">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 12 }}>CORRECT</p>
            <pre style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-body)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
{`<div style={{
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-body)',
  padding: 16,
  borderRadius: 8,
}}>`}
            </pre>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '2px solid var(--color-danger)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 12 }}>WRONG</p>
            <pre style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-body)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
{`<div style={{
  background: '#FFFFFF',
  border: '1px solid #DADBE6',
  color: '#333333',
  padding: 16,
  borderRadius: 8,
}}>`}
            </pre>
            <p style={{ fontSize: 11, color: 'var(--color-danger)', marginTop: 8 }}>Hardcoded hex = breaks when theme changes</p>
          </div>
        </div>
        <div style={{ marginTop: 16, padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>No Tailwind</strong> utility classes in component/widget JSX. Inline styles with CSS custom properties only.
          </p>
        </div>
      </Section>

      {/* ---- File Naming ---- */}
      <Section title="File Naming Conventions">
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          {[
            { pattern: 'PascalCase.tsx', example: 'Button.tsx', layer: 'Component' },
            { pattern: 'PascalCaseWidget.tsx', example: 'TopNavWidget.tsx', layer: 'Widget root' },
            { pattern: 'PascalCase{Size}.tsx', example: 'TopNavLG.tsx', layer: 'Widget variant' },
            { pattern: 'camelCase.ts', example: 'useTopNav.ts', layer: 'Data hook' },
            { pattern: 'entity.mapper.ts', example: 'order.mapper.ts', layer: 'ACL mapper' },
            { pattern: 'PascalCase.screen.ts', example: 'Dashboard.screen.ts', layer: 'Screen config' },
            { pattern: 'PascalCase.ts', example: 'Order.ts', layer: 'Domain object' },
          ].map((row, i) => (
            <div key={row.pattern} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: i < 6 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <code style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-secondary)', width: 220, flexShrink: 0 }}>{row.pattern}</code>
              <code style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--color-text-body)', width: 200, flexShrink: 0 }}>{row.example}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.layer}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Theme Consumption ---- */}
      <Section title="Theme Consumption">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>Components only reference semantic CSS variables — never raw mode tokens or hex values. The <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>data-theme</code> attribute on {'<html>'} controls which values the variables resolve to.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { category: 'Surfaces', vars: ['--color-bg', '--color-bg-alt', '--color-surface', '--color-surface-hover', '--color-surface-active', '--color-border'] },
            { category: 'Text', vars: ['--color-text-heading', '--color-text-body', '--color-text-muted'] },
            { category: 'Actions & Status', vars: ['--color-primary', '--color-primary-hover', '--color-primary-muted', '--color-secondary', '--color-success', '--color-warning', '--color-danger'] },
          ].map((group) => (
            <div key={group.category} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.category}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {group.vars.map((v) => (
                  <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: `var(${v})`, border: '1px solid var(--color-border)', flexShrink: 0 }} />
                    <code style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-body)' }}>{v}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { category: 'Navigation', vars: ['--color-topnav-bg', '--color-topnav-text', '--color-topnav-text-muted', '--color-topnav-border', '--color-topnav-badge-bg'] },
            { category: 'Specialty', vars: ['--color-brand', '--color-table-stripe', '--color-sidebar-bg', '--color-sidebar-text', '--color-sidebar-hover'] },
          ].map((group) => (
            <div key={group.category} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.category}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {group.vars.map((v) => (
                  <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: `var(${v})`, border: '1px solid var(--color-border)', flexShrink: 0 }} />
                    <code style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-body)' }}>{v}</code>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Localisation ---- */}
      <Section title="Localisation">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20 }}>The Screen Renderer passes locale via context. Widgets and domain objects use it — never hardcode a locale string.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Translation Keys in Widgets</p>
            <pre style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-body)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
{`// ✅ CORRECT
const { t } = useLocale();
<h2>{t('orders.recentOrders')}</h2>

// ❌ WRONG — hardcoded string
<h2>Recent Orders</h2>`}
            </pre>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Locale-Aware Domain Methods</p>
            <pre style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-body)', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
{`// Money.ts
format(locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: this.currency,
  }).format(this.amount);
}

// Widget usage
const { locale } = useLocale();
<span>{order.total.format(locale)}</span>`}
            </pre>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 12, borderRadius: 6, fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-body)', background: 'var(--color-bg-alt)' }}>
          src/i18n/en-AU.ts &nbsp;·&nbsp; src/i18n/en-US.ts &nbsp;·&nbsp; src/i18n/index.ts → typed key union
        </div>
      </Section>

      {/* ---- TypeScript Conventions ---- */}
      <Section title="TypeScript Conventions">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { rule: 'strict: true', desc: 'Always enabled in tsconfig.json', icon: '⚙' },
            { rule: 'class for models', desc: 'Domain objects and screen configs', icon: '◆' },
            { rule: 'interface for contracts', desc: 'RenderableWidget, GridConfig, etc.', icon: '◇' },
            { rule: 'No any', desc: 'Zero any types in the codebase', icon: '✕' },
            { rule: 'No as casts', desc: 'Except inside ACL mappers', icon: '⚠' },
            { rule: 'Named exports', desc: 'Default exports only for widget dynamic loading', icon: '→' },
          ].map((item) => (
            <div key={item.rule} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.rule}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

'use client';

import { CodeBlock } from '@/platform/components/CodeBlock';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 12 }}>{children}</p>
);

export function ResponsivenessShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Use with <strong>frontend-architecture</strong> (CSS Grid, widget size variants, breakpoint values), <strong>app-layout</strong> (shell layout patterns, sidebar/topbar), and <strong>design-foundations</strong> (spacing system, visual hierarchy). This skill covers the <em>thinking</em> behind responsive design.
        </p>
      </div>

      {/* ---- Section 1: Content Priority ---- */}
      <Section title="Content Priority — Start Here, Not With Breakpoints">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Before any layout work, list every content element and rank them by user priority. This single-column priority list drives all responsive decisions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Priority Stack */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Priority Stack</span>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Primary Action', priority: 1, color: 'var(--color-primary)' },
                { label: 'Key Content', priority: 2, color: 'var(--color-primary)' },
                { label: 'Supporting Data', priority: 3, color: 'var(--color-secondary)' },
                { label: 'Navigation', priority: 4, color: 'var(--color-secondary)' },
                { label: 'Metadata', priority: 5, color: 'var(--color-text-muted)' },
                { label: 'Related Items', priority: 6, color: 'var(--color-text-muted)' },
                { label: 'Footer / Legal', priority: 7, color: 'var(--color-border)' },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 4, background: 'var(--color-surface)' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-on-primary)' }}>{item.priority}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Mobile: Focus</span>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ width: '70%', margin: '0 auto', border: '2px solid var(--color-border)', borderRadius: 12, overflow: 'hidden', background: 'var(--color-surface)' }}>
                {/* Top bar */}
                <div style={{ height: 20, background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 6px', gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--color-border)' }} />
                  <div style={{ flex: 1 }} />
                  <div style={{ width: 12, height: 6, borderRadius: 2, background: 'var(--color-border)' }} />
                </div>
                {/* Primary action */}
                <div style={{ padding: 8 }}>
                  <div style={{ height: 24, borderRadius: 4, background: 'var(--color-primary)', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 8, color: 'var(--color-text-on-primary)', fontWeight: 700 }}>Primary Action</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 2, background: 'var(--color-primary)', opacity: 0.3, marginBottom: 4 }} />
                  <div style={{ height: 6, borderRadius: 2, background: 'var(--color-border)', marginBottom: 3 }} />
                  <div style={{ height: 6, borderRadius: 2, background: 'var(--color-border)', marginBottom: 3, width: '80%' }} />
                  <div style={{ height: 6, borderRadius: 2, background: 'var(--color-border)', width: '60%' }} />
                </div>
                {/* Bottom tabs */}
                <div style={{ height: 18, background: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: 2, background: i === 1 ? 'var(--color-primary)' : 'var(--color-border)' }} />
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 8 }}>Show top 1-2 priorities only</p>
            </div>
          </div>

          {/* Desktop View */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Desktop: Density</span>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ border: '2px solid var(--color-border)', borderRadius: 8, overflow: 'hidden', background: 'var(--color-surface)' }}>
                {/* Top bar */}
                <div style={{ height: 16, background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', padding: '0 6px', gap: 6 }}>
                  <div style={{ width: 20, height: 6, borderRadius: 2, background: 'var(--color-primary)' }} />
                  {[1, 2, 3].map((i) => <div key={i} style={{ width: 14, height: 4, borderRadius: 2, background: 'var(--color-border)' }} />)}
                </div>
                <div style={{ display: 'flex' }}>
                  {/* Sidebar */}
                  <div style={{ width: '25%', borderRight: '1px solid var(--color-border)', padding: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ height: 8, borderRadius: 2, background: i === 1 ? 'var(--color-primary)' : 'var(--color-bg-alt)', marginBottom: 3, opacity: i === 1 ? 0.3 : 1 }} />
                    ))}
                  </div>
                  {/* Main */}
                  <div style={{ flex: 1, padding: 6 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 4 }}>
                      <div>
                        <div style={{ height: 16, borderRadius: 3, background: 'var(--color-primary)', marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: 6, color: 'var(--color-text-on-primary)', fontWeight: 700 }}>Primary</span>
                        </div>
                        <div style={{ height: 5, borderRadius: 2, background: 'var(--color-border)', marginBottom: 2 }} />
                        <div style={{ height: 5, borderRadius: 2, background: 'var(--color-border)', width: '80%' }} />
                      </div>
                      <div>
                        <div style={{ height: 5, borderRadius: 2, background: 'var(--color-secondary)', opacity: 0.3, marginBottom: 2 }} />
                        <div style={{ height: 5, borderRadius: 2, background: 'var(--color-border)', marginBottom: 2 }} />
                        <div style={{ height: 5, borderRadius: 2, background: 'var(--color-border)' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 8 }}>Show all priorities, increase density</p>
            </div>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Key principle:</strong> Content determines breakpoints, not devices. Start at ~320px, expand slowly, and add a breakpoint where content breaks or wastes space. Content-driven breakpoints work on devices that don&apos;t exist yet.
          </p>
        </div>
      </Section>

      {/* ---- Section 2: Density Management ---- */}
      <Section title="Density Management — Same Content, Different Resolutions">
        <SubHeading>Information Density Scaling</SubHeading>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          When scaling from mobile to desktop, increase density (more items, more detail) — don&apos;t just enlarge mobile elements. Desktop users need more information visible, not bigger UI.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { device: 'Mobile', strategy: 'Single task focus', items: 1, detail: 'Minimal', color: 'var(--color-primary)' },
            { device: 'Tablet', strategy: 'Related items together', items: 3, detail: 'Moderate', color: 'var(--color-secondary)' },
            { device: 'Desktop', strategy: 'Maximize useful info', items: 6, detail: 'Rich', color: 'var(--color-success)' },
            { device: 'Ultrawide', strategy: 'Constrain + context', items: 6, detail: 'Rich + panels', color: 'var(--color-text-muted)' },
          ].map((d) => (
            <div key={d.device} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>{d.device}</span>
              </div>
              <div style={{ padding: 12 }}>
                {/* Visual: card grid showing density */}
                <div style={{ display: 'grid', gridTemplateColumns: d.items <= 1 ? '1fr' : d.items <= 3 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 4, marginBottom: 8 }}>
                  {Array.from({ length: Math.min(d.items, 6) }).map((_, i) => (
                    <div key={i} style={{ height: d.items <= 1 ? 40 : d.items <= 3 ? 20 : 16, borderRadius: 3, background: d.color, opacity: 0.2 + (i * 0.1) }} />
                  ))}
                </div>
                <p style={{ fontSize: 11, fontWeight: 600, color: d.color, margin: '0 0 2px' }}>{d.strategy}</p>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>Detail: {d.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-danger-muted)', border: '1px solid var(--color-danger)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-danger)', margin: 0 }}>
            <strong>Banned:</strong> Enlarging mobile elements to fill desktop space. More items, not bigger items. Ultrawide must constrain primary content to 65-80 characters per line.
          </p>
        </div>
      </Section>

      {/* ---- Section 3: Behaviour Specification Grid ---- */}
      <Section title="Behaviour Specification — Beyond Layout">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Reflowing columns is table stakes. The real responsive work is adapting interaction patterns, navigation models, and cognitive context.
        </p>

        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 12, color: 'var(--color-text-heading)' }}>Dimension</div>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 12, color: 'var(--color-primary)', borderLeft: '1px solid var(--color-border)' }}>Small / Touch</div>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 12, color: 'var(--color-secondary)', borderLeft: '1px solid var(--color-border)' }}>Large / Pointer</div>
          </div>
          {[
            { dim: 'Input Model', small: 'Imprecise, gesture-rich, two-state (touched/not)', large: 'Precise, hover-capable, three-state (up/down/hover)' },
            { dim: 'Navigation', small: 'Bottom tabs, hamburger, minimal top bar', large: 'Sidebar, top nav, command palette, keyboard shortcuts' },
            { dim: 'Info Reveal', small: 'Tap-to-expand, progressive disclosure', large: 'Hover-to-preview, tooltips, higher upfront density' },
            { dim: 'Gestures', small: 'Swipe, long-press, pinch-to-zoom', large: 'Right-click menus, drag-and-drop, scroll-to-zoom' },
            { dim: 'Cognitive Mode', small: 'Quick, task-focused, distracted', large: 'Focused, exploratory, sustained attention' },
            { dim: 'Content Density', small: 'Low — single most important action', large: 'High — show more things, not bigger things' },
            { dim: 'Touch Targets', small: 'Minimum 48px with 8px spacing', large: 'Can be smaller; hover states provide affordance' },
          ].map((row, i) => (
            <div key={row.dim} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', borderBottom: i < 6 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', background: 'var(--color-surface)' }}>{row.dim}</div>
              <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--color-text-body)', borderLeft: '1px solid var(--color-border)' }}>{row.small}</div>
              <div style={{ padding: '8px 16px', fontSize: 12, color: 'var(--color-text-body)', borderLeft: '1px solid var(--color-border)' }}>{row.large}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 4: Canonical Layouts ---- */}
      <Section title="Canonical Layouts">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Most screens map to one of three patterns. Start from the canonical layout, then adapt.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              name: 'List-Detail',
              mobile: 'List view, tap to navigate to detail',
              desktop: 'Split pane',
              mobileVisual: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ height: 12, borderRadius: 3, background: i === 2 ? 'var(--color-primary)' : 'var(--color-bg-alt)', opacity: i === 2 ? 0.5 : 1 }} />
                  ))}
                </div>
              ),
              desktopVisual: (
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ width: '35%' }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} style={{ height: 8, borderRadius: 2, background: i === 2 ? 'var(--color-primary)' : 'var(--color-bg-alt)', marginBottom: 2, opacity: i === 2 ? 0.5 : 1 }} />
                    ))}
                  </div>
                  <div style={{ flex: 1, background: 'var(--color-bg-alt)', borderRadius: 3, padding: 4 }}>
                    <div style={{ height: 6, borderRadius: 2, background: 'var(--color-primary)', opacity: 0.3, marginBottom: 3, width: '60%' }} />
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--color-border)', marginBottom: 2 }} />
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--color-border)', width: '80%' }} />
                  </div>
                </div>
              ),
            },
            {
              name: 'Supporting Pane',
              mobile: 'Primary only, supporting behind tab/drawer',
              desktop: 'Side-by-side',
              mobileVisual: (
                <div>
                  <div style={{ height: 28, borderRadius: 3, background: 'var(--color-primary)', opacity: 0.2, marginBottom: 4 }} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <div style={{ flex: 1, height: 6, borderRadius: 2, background: 'var(--color-primary)', opacity: 0.5 }} />
                    <div style={{ flex: 1, height: 6, borderRadius: 2, background: 'var(--color-bg-alt)' }} />
                  </div>
                </div>
              ),
              desktopVisual: (
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ flex: 2, height: 36, borderRadius: 3, background: 'var(--color-primary)', opacity: 0.2 }} />
                  <div style={{ flex: 1, height: 36, borderRadius: 3, background: 'var(--color-secondary)', opacity: 0.15 }} />
                </div>
              ),
            },
            {
              name: 'Feed',
              mobile: 'Single column',
              desktop: '3-4 columns with filters visible',
              mobileVisual: (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ height: 14, borderRadius: 3, background: 'var(--color-bg-alt)' }} />
                  ))}
                </div>
              ),
              desktopVisual: (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} style={{ height: 14, borderRadius: 2, background: 'var(--color-bg-alt)' }} />
                  ))}
                </div>
              ),
            },
          ].map((layout) => (
            <div key={layout.name} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>{layout.name}</span>
              </div>
              <div style={{ padding: 12 }}>
                <SubHeading>Mobile</SubHeading>
                <div style={{ padding: 8, borderRadius: 6, border: '1px solid var(--color-border)', marginBottom: 12 }}>
                  {layout.mobileVisual}
                </div>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 12 }}>{layout.mobile}</p>
                <SubHeading>Desktop</SubHeading>
                <div style={{ padding: 8, borderRadius: 6, border: '1px solid var(--color-border)', marginBottom: 4 }}>
                  {layout.desktopVisual}
                </div>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>{layout.desktop}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 5: Content Choreography ---- */}
      <Section title="Content Choreography">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          When columns collapse on small screens, visual hierarchy can be destroyed. Content choreography means deliberately rearranging content blocks so priority is maintained at every width.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Wrong */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-danger)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-danger-muted)', borderBottom: '1px solid var(--color-danger)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)' }}>Naive Reflow (Wrong)</span>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ height: 40, borderRadius: 4, background: 'var(--color-text-muted)', opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Sidebar (secondary)</span>
                </div>
                <div style={{ height: 60, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--color-primary)' }}>Main content (primary)</span>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-danger)', marginTop: 8 }}>Secondary content shoved above primary</p>
            </div>
          </div>

          {/* Right */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-success-muted)', borderBottom: '1px solid var(--color-success)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>Choreographed (Right)</span>
            </div>
            <div style={{ padding: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ height: 60, borderRadius: 4, background: 'var(--color-primary)', opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--color-primary)' }}>Main content (primary)</span>
                </div>
                <div style={{ height: 24, borderRadius: 4, background: 'var(--color-text-muted)', opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>Sidebar collapsed to toggle</span>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-success)', marginTop: 8 }}>Primary stays prominent, secondary behind toggle</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 6: Responsive Typography ---- */}
      <Section title="Responsive Typography">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Type does not just get smaller on small screens. The entire typographic system adapts as a coherent unit.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Scale compression visual */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Scale Compression</SubHeading>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 8 }}>Mobile</p>
                <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 2px', lineHeight: 1.2 }}>H1</p>
                <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px', lineHeight: 1.2 }}>H2</p>
                <p style={{ fontSize: 14, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.2 }}>Body</p>
                <p style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 4 }}>1.4x ratio</p>
              </div>
              <div style={{ width: 1, background: 'var(--color-border)' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 8 }}>Desktop</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 2px', lineHeight: 1.2 }}>H1</p>
                <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px', lineHeight: 1.2 }}>H2</p>
                <p style={{ fontSize: 14, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.2 }}>Body</p>
                <p style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 4 }}>2.0x ratio</p>
              </div>
            </div>
          </div>

          {/* Line length */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Line Length Constraint</SubHeading>
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--color-success)', marginBottom: 4, width: '75%' }} />
              <p style={{ fontSize: 10, color: 'var(--color-success)', margin: '0 0 8px' }}>65-80 characters = optimal readability</p>
            </div>
            <div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--color-danger)', marginBottom: 4, width: '100%' }} />
              <p style={{ fontSize: 10, color: 'var(--color-danger)', margin: 0 }}>Full-width text on ultrawide = unreadable</p>
            </div>
          </div>
        </div>

        <CodeBlock language="css" title="Fluid typography">{`/* Fluid typography — scale smoothly, not in jumps */
:root {
  --text-h1: clamp(1.5rem, 1rem + 2vw, 2.5rem);
  --text-h2: clamp(1.25rem, 0.9rem + 1.5vw, 1.75rem);
  --text-body: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
}

/* Line length constraint */
.prose { max-width: 65ch; }`}</CodeBlock>
      </Section>

      {/* ---- Section 7: Performance as Responsiveness ---- */}
      <Section title="Performance as Responsiveness">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Desktop users notice speed. Mobile users notice reliability. Performance strategy must adapt to context.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', margin: '0 0 12px' }}>Mobile / Slow Connection</p>
            {[
              'Lazy-load below the fold',
              'Serve appropriately-sized images (WebP/AVIF)',
              'Immediate visual feedback for every touch (<50ms)',
              'Minimize payload, defer non-essential resources',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-secondary)', margin: '0 0 12px' }}>Desktop / Fast Connection</p>
            {[
              'Prefetch likely navigation targets',
              'Serve high-resolution for retina displays',
              'Instant state changes, richer transition animations',
              'Full payloads acceptable',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-secondary)', flexShrink: 0, marginTop: 5 }} />
                <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Section 8: The Uncomfortable Middle ---- */}
      <Section title="The Uncomfortable Middle (700-900px)">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          The 700-900px range is too wide for mobile layout, too narrow for desktop. It must be explicitly designed for, not ignored.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16 }}>
          <div style={{ flex: 1, padding: 12, background: 'var(--color-primary)', opacity: 0.15, borderRadius: '6px 0 0 6px', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', margin: 0 }}>Mobile</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>0-640px</p>
          </div>
          <div style={{ flex: 1, padding: 12, background: 'var(--color-warning)', opacity: 0.2, textAlign: 'center', border: '2px dashed var(--color-warning)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-warning)', margin: 0 }}>Uncomfortable Middle</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>700-900px</p>
          </div>
          <div style={{ flex: 1, padding: 12, background: 'var(--color-secondary)', opacity: 0.15, borderRadius: '0 6px 6px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-secondary)', margin: 0 }}>Desktop</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>1024px+</p>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-text-body)' }}>
          Test continuously from 320px to max width. No broken layouts, clipped content, or unusable states at any width.
        </p>
      </Section>

      {/* ---- Section 9: Planning Methodology ---- */}
      <Section title="The Four-Phase Planning Methodology">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { phase: '1', name: 'Content Priority', desc: 'List every element, rank by user priority. No layout — just hierarchy.' },
            { phase: '2', name: 'Breakpoint Discovery', desc: 'Start at 320px, expand slowly. Add breakpoints where content breaks.' },
            { phase: '3', name: 'Behaviour Specification', desc: 'For each range: input model, navigation, density, gestures, cognitive mode.' },
            { phase: '4', name: 'Canonical Layout', desc: 'Pick List-Detail, Supporting Pane, or Feed. Adapt to your content.' },
          ].map((p) => (
            <div key={p.phase} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '8px 12px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text-on-primary)' }}>{p.phase}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-on-primary)' }}>{p.name}</span>
              </div>
              <div style={{ padding: 12 }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 10: Banned Patterns ---- */}
      <Section title="Banned Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { ban: 'Desktop-first then shrink', fix: 'Start from content priority, build upward' },
            { ban: 'Breakpoints based on device widths', fix: 'Based on where content breaks' },
            { ban: 'Hover-dependent on touch devices', fix: 'Provide tap alternatives for all hover' },
            { ban: 'Enlarge mobile elements for desktop', fix: 'Increase density (more items, more detail)' },
            { ban: 'Same navigation at all resolutions', fix: 'Adapt to input model (sidebar, tabs, hamburger)' },
            { ban: 'Layout-only responsiveness', fix: 'Adapt behaviour, density, and navigation too' },
          ].map((item) => (
            <div key={item.ban} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 10, borderRadius: 6, background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 14, color: 'var(--color-danger)', flexShrink: 0 }}>&times;</span>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.ban}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>&rarr; {item.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

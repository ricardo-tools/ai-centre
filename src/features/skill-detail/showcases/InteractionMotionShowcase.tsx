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

export function InteractionMotionShowcase() {
  return (
    <div>
      {/* Inline keyframes */}
      <style>{`
        @keyframes im-pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes im-fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes im-fadeOutDown {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(4px); }
        }
        @keyframes im-scalePress {
          0% { transform: scale(1); }
          50% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }
        @keyframes im-slideInLeft {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes im-slideOutRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(16px); }
        }
        @keyframes im-crossfade {
          0% { opacity: 1; }
          45% { opacity: 0; }
          55% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes im-stagger1 { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes im-spring {
          0% { transform: scale(0.8); }
          60% { transform: scale(1.05); }
          80% { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        @keyframes im-progressAccel {
          0% { width: 0%; }
          30% { width: 10%; }
          60% { width: 35%; }
          80% { width: 70%; }
          100% { width: 100%; }
        }
        @keyframes im-easeCurvePoint {
          0% { left: 0%; bottom: 0%; }
          100% { left: 100%; bottom: 100%; }
        }
      `}</style>

      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Use with <strong>creative-toolkit</strong> (animation libraries: Motion, GSAP, Rive) and <strong>frontend-architecture</strong> (CSS implementation). This skill covers animation <em>thinking</em> — when and how to animate, not which library to use.
        </p>
      </div>

      {/* ---- Section 1: Purpose-Driven Motion ---- */}
      <Section title="Every Animation Needs a Purpose">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Before animating anything, ask: <em>what does this motion communicate?</em> If the answer is &quot;nothing, it just looks nice,&quot; don&apos;t animate. Motion without purpose is clutter.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { purpose: 'Feedback', desc: 'Button depresses on click', label: 'I received your input', demo: 'im-scalePress', duration: '0.3s', easing: 'ease-out' },
            { purpose: 'Spatial Orientation', desc: 'Modal slides up from trigger', label: 'This came from there', demo: 'im-fadeInUp', duration: '0.3s', easing: 'ease-out' },
            { purpose: 'State Change', desc: 'Item fades out when deleted', label: 'This is gone', demo: 'im-fadeOutDown', duration: '0.25s', easing: 'ease-in' },
          ].map((item) => (
            <div key={item.purpose} style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, background: 'var(--color-primary)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: `${item.demo} ${item.duration} ${item.easing} infinite`, animationDelay: '0s', animationDuration: '2s' }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--color-text-on-primary)' }} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>{item.purpose}</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '0 0 6px' }}>{item.desc}</p>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>&ldquo;{item.label}&rdquo;</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { purpose: 'Continuity', desc: 'Page cross-fades', color: 'var(--color-secondary)' },
            { purpose: 'Perceived Performance', desc: 'Skeleton pulses', color: 'var(--color-warning)' },
            { purpose: 'Attention Direction', desc: 'Error message shakes', color: 'var(--color-danger)' },
            { purpose: 'Hierarchy', desc: 'Staggered list entrance', color: 'var(--color-success)' },
          ].map((item) => (
            <div key={item.purpose} style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ width: '100%', height: 4, borderRadius: 2, background: item.color, marginBottom: 8 }} />
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>{item.purpose}</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 2: Duration Scale ---- */}
      <Section title="Duration Follows Function">
        <SubHeading>The Duration Scale</SubHeading>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Different motion types need different durations. Too fast is missed. Too slow is annoying. Never exceed 500ms for interactive transitions.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { type: 'Micro-interaction', range: '100-150ms', example: 'Button press, toggle, hover', width: '15%', color: 'var(--color-primary)' },
            { type: 'Small Transition', range: '150-250ms', example: 'Tooltip, dropdown, fade', width: '25%', color: 'var(--color-primary)' },
            { type: 'Medium Transition', range: '250-350ms', example: 'Modal, panel, card expand', width: '45%', color: 'var(--color-secondary)' },
            { type: 'Large Transition', range: '300-500ms', example: 'Page, route, full-screen', width: '65%', color: 'var(--color-secondary)' },
            { type: 'Decorative / Ambient', range: '1000-2000ms', example: 'Loading pulse, background', width: '100%', color: 'var(--color-text-muted)' },
          ].map((item) => (
            <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 140, flexShrink: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{item.type}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{item.range}</p>
              </div>
              <div style={{ flex: 1, height: 28, background: 'var(--color-bg-alt)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: item.width, height: '100%', background: item.color, borderRadius: 4, opacity: 0.7, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-on-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.example}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-danger-muted)', border: '1px solid var(--color-danger)', marginBottom: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', margin: 0 }}>
            Hard limit: 500ms maximum for interactive transitions. Beyond that, the user waits for the animation, not the content.
          </p>
        </div>
      </Section>

      {/* ---- Section 3: Easing Curves ---- */}
      <Section title="Easing Communicates Physics">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Easing curves determine the character of motion. Different easings feel fundamentally different and serve different purposes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { name: 'ease-out', cubic: '(0.0, 0.0, 0.2, 1)', feel: 'Responsive, decelerating', use: 'Entrances', points: [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 20, y: 100 }, { x: 100, y: 100 }] },
            { name: 'ease-in', cubic: '(0.4, 0.0, 1, 1)', feel: 'Accelerating, departing', use: 'Exits', points: [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 100, y: 100 }, { x: 100, y: 100 }] },
            { name: 'ease-in-out', cubic: '(0.4, 0.0, 0.2, 1)', feel: 'Smooth, symmetric', use: 'State changes', points: [{ x: 0, y: 0 }, { x: 40, y: 0 }, { x: 20, y: 100 }, { x: 100, y: 100 }] },
            { name: 'spring', cubic: 'overshoot + settle', feel: 'Bouncy, physical', use: 'Arrivals (toasts, modals)', points: [{ x: 0, y: 0 }, { x: 20, y: 80 }, { x: 60, y: 110 }, { x: 100, y: 100 }] },
          ].map((curve) => (
            <div key={curve.name} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{curve.name}</span>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)', background: 'var(--color-bg-alt)', padding: '2px 6px', borderRadius: 3 }}>{curve.cubic}</span>
              </div>
              {/* SVG curve visualization */}
              <div style={{ height: 80, background: 'var(--color-bg-alt)', borderRadius: 4, padding: 8, marginBottom: 12, position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 120 64" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="32" x2="120" y2="32" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 2" />
                  <line x1="60" y1="0" x2="60" y2="64" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="2 2" />
                  {/* Curve */}
                  <path
                    d={`M ${curve.points[0].x * 1.2} ${64 - curve.points[0].y * 0.64} C ${curve.points[1].x * 1.2} ${64 - curve.points[1].y * 0.64}, ${curve.points[2].x * 1.2} ${64 - curve.points[2].y * 0.64}, ${curve.points[3].x * 1.2} ${64 - curve.points[3].y * 0.64}`}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                  />
                  {/* Start/end dots */}
                  <circle cx={curve.points[0].x * 1.2} cy={64 - curve.points[0].y * 0.64} r="3" fill="var(--color-primary)" />
                  <circle cx={curve.points[3].x * 1.2} cy={64 - curve.points[3].y * 0.64} r="3" fill="var(--color-primary)" />
                </svg>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '0 0 4px' }}><strong>Feel:</strong> {curve.feel}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}><strong>Use for:</strong> {curve.use}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Default rule:</strong> ease-out for entrances (element arrives and settles), ease-in for exits (element gathers speed and leaves). Never use <code style={{ fontSize: 11, background: 'var(--color-surface)', padding: '1px 4px', borderRadius: 3 }}>linear</code> for UI transitions — it feels mechanical and robotic.
          </p>
        </div>
      </Section>

      {/* ---- Section 4: Entrance vs Exit ---- */}
      <Section title="Entrance vs Exit Patterns">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Exits should be 20-30% shorter than entrances. The user has already decided to dismiss — don&apos;t make them wait.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Entrance */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-success-muted)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success)' }}>Entrance</span>
            </div>
            <div style={{ padding: 16 }}>
              {/* Animated demo box */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ width: 80, height: 48, borderRadius: 6, background: 'var(--color-primary)', opacity: 0.85, animation: 'im-fadeInUp 0.5s ease-out infinite', animationDuration: '2.5s' }} />
              </div>
              <CodeBlock language="css" title="Entrance animation">{`Enter: fade in + translateY(-8px → 0)
Easing: ease-out
Duration: 200ms

// CSS
opacity: 0 → 1;
transform: translateY(8px) → translateY(0);
transition: all 200ms ease-out;`}</CodeBlock>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>Apply to: modals, toasts, dropdowns, popovers, tooltips, new list items</p>
            </div>
          </div>

          {/* Exit */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-danger-muted)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-danger)' }}>Exit</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <div style={{ width: 80, height: 48, borderRadius: 6, background: 'var(--color-danger)', opacity: 0.85, animation: 'im-fadeOutDown 0.4s ease-in infinite', animationDuration: '2.5s' }} />
              </div>
              <CodeBlock language="css" title="Exit animation">{`Exit: fade out + translateY(0 → 4px)
Easing: ease-in
Duration: 150ms  (25% shorter!)

// CSS
opacity: 1 → 0;
transform: translateY(0) → translateY(4px);
transition: all 150ms ease-in;`}</CodeBlock>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>Exits are faster — user has decided to dismiss</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 5: Motion Vocabulary ---- */}
      <Section title="The Motion Vocabulary">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          A coherent product uses the same motion patterns everywhere. Define your vocabulary and stick to it.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { pattern: 'Enter / Exit', enter: 'fade in + translate up 8px', exit: 'fade out + translate down 4px', enterDur: '200ms ease-out', exitDur: '150ms ease-in', use: 'Modals, toasts, dropdowns, popovers, tooltips' },
            { pattern: 'Expand / Collapse', enter: 'height auto + fade in', exit: 'height 0 + fade out', enterDur: '250ms ease-out', exitDur: '200ms ease-in', use: 'Accordions, detail panels, disclosure widgets' },
            { pattern: 'State Change', enter: 'cross-fade', exit: 'cross-fade', enterDur: '150ms ease-in-out', exitDur: '150ms ease-in-out', use: 'Tab switches, view toggles, theme changes' },
            { pattern: 'Button Feedback', enter: 'scale(0.97)', exit: 'scale(1.0) spring', enterDur: '100ms ease-out', exitDur: '150ms spring', use: 'All clickable elements — physical push feeling' },
          ].map((p) => (
            <div key={p.pattern} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 10px' }}>{p.pattern}</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <div style={{ flex: 1, padding: 8, borderRadius: 4, background: 'var(--color-success-muted)', fontSize: 11, color: 'var(--color-success)' }}>
                  <strong>In:</strong> {p.enter}<br />{p.enterDur}
                </div>
                <div style={{ flex: 1, padding: 8, borderRadius: 4, background: 'var(--color-danger-muted)', fontSize: 11, color: 'var(--color-danger)' }}>
                  <strong>Out:</strong> {p.exit}<br />{p.exitDur}
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{p.use}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 6: Stagger Choreography ---- */}
      <Section title="Stagger Choreography">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          When multiple items enter, stagger their entrance to communicate order and separateness. Cap total stagger at 300-500ms.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Timeline visual */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Stagger Timeline</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', width: 48, textAlign: 'right', fontFamily: 'monospace' }}>Item {i + 1}</span>
                  <div style={{ flex: 1, height: 20, background: 'var(--color-bg-alt)', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      left: `${i * 10}%`,
                      width: '40%',
                      height: '100%',
                      background: 'var(--color-primary)',
                      borderRadius: 3,
                      opacity: 0.7,
                      animation: `im-stagger1 0.3s ease-out`,
                      animationDelay: `${i * 0.15}s`,
                      animationFillMode: 'both',
                      animationIterationCount: 'infinite',
                      animationDuration: '3s',
                    }} />
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'monospace', width: 40 }}>{i * 40}ms</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12 }}>30-50ms per item, capped at 300-500ms total</p>
          </div>

          {/* Rules */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Stagger Rules</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Stagger delay: 30-50ms per item',
                'Cap total stagger at 300-500ms (even for 20+ items)',
                'Items past the viewport skip entrance animation',
                'All items use same duration and easing (only start time differs)',
                'For long lists: animate first ~8 items, rest appear instantly',
              ].map((rule) => (
                <div key={rule} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 7: Skeleton / Perceived Performance ---- */}
      <Section title="Perceived Performance Through Motion">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {/* Skeleton Pulse Demo */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Skeleton Pulse</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ width: '60%', height: 14, borderRadius: 4, background: 'var(--color-bg-alt)', animation: 'im-pulse 1.5s ease-in-out infinite' }} />
              <div style={{ width: '100%', height: 10, borderRadius: 4, background: 'var(--color-bg-alt)', animation: 'im-pulse 1.5s ease-in-out infinite', animationDelay: '0.1s' }} />
              <div style={{ width: '85%', height: 10, borderRadius: 4, background: 'var(--color-bg-alt)', animation: 'im-pulse 1.5s ease-in-out infinite', animationDelay: '0.2s' }} />
              <div style={{ width: '40%', height: 10, borderRadius: 4, background: 'var(--color-bg-alt)', animation: 'im-pulse 1.5s ease-in-out infinite', animationDelay: '0.3s' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 10 }}>opacity 0.4 to 1.0, 1500ms, infinite</p>
          </div>

          {/* Accelerating Progress */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Accelerating Progress</SubHeading>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-alt)', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 4, animation: 'im-progressAccel 3s ease-in infinite' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Perceived as 12% faster than linear (Harrison et al., CHI 2010)</p>
          </div>

          {/* Spring Arrival */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Spring Arrival</SubHeading>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--color-secondary)', animation: 'im-spring 1.5s ease-out infinite' }} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Overshoot + settle creates energy. Use for toasts, modals, popovers.</p>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Avoid:</strong> Centred spinners and bouncing dots. These demand attention. Use a subtle top-bar progress indicator or skeleton screens instead.
          </p>
        </div>
      </Section>

      {/* ---- Section 8: Spatial Memory ---- */}
      <Section title="Motion Creates Spatial Memory">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Users build a mental map of your interface. Motion reinforces this map by showing where things come from and where they go.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { label: 'Sidebar slides from left', desc: 'User knows it lives "to the left"', icon: 'im-slideInLeft', color: 'var(--color-primary)' },
            { label: 'Modal rises from trigger', desc: 'User knows it\'s related to what they clicked', icon: 'im-fadeInUp', color: 'var(--color-secondary)' },
            { label: 'Deleted item collapses', desc: 'User knows it\'s gone (not just hidden)', icon: 'im-fadeOutDown', color: 'var(--color-danger)' },
            { label: 'Page cross-fades', desc: 'User knows they\'re in the same context', icon: 'im-crossfade', color: 'var(--color-text-muted)' },
          ].map((item) => (
            <div key={item.label} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 6, background: item.color, flexShrink: 0, animation: `${item.icon} 2.5s ease-out infinite` }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>{item.label}</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-warning-muted)', border: '1px solid var(--color-warning)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-warning)', margin: 0 }}>
            <strong>Warning:</strong> When motion contradicts the spatial model (sidebar fading from the right, modal dropping from above when trigger is below), it creates disorientation.
          </p>
        </div>
      </Section>

      {/* ---- Section 9: Reduced Motion ---- */}
      <Section title="Respect prefers-reduced-motion">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Always. Non-negotiable. ~25% of users have vestibular sensitivities. Replace animation with instant state changes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>CSS Approach</SubHeading>
            <CodeBlock language="css" title="Reduced motion CSS">{`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`}</CodeBlock>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>JavaScript Check</SubHeading>
            <CodeBlock language="tsx" title="Reduced motion JS check">{`const prefersReduced = window
  .matchMedia('(prefers-reduced-motion: reduce)')
  .matches;

// In Motion (framer-motion)
<motion.div
  transition={prefersReduced
    ? { duration: 0 }
    : { duration: 0.3, ease: 'easeOut' }}
/>`}</CodeBlock>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-text-body)' }}>
          The UI must still communicate all state changes — just without movement. If removing an animation breaks the UX, the design is too dependent on animation.
        </p>
      </Section>

      {/* ---- Section 10: Performance ---- */}
      <Section title="GPU-Composited Properties Only">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-success)', margin: '0 0 12px' }}>Animate These (Jank-Free)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['transform (translate, scale, rotate)', 'opacity'].map((prop) => (
                <div key={prop} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>&#10003;</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)', fontFamily: 'monospace' }}>{prop}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 10 }}>GPU-composited, no layout recalculation</p>
          </div>

          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-danger)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-danger)', margin: '0 0 12px' }}>Never Animate (Layout Jank)</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['width / height', 'top / left / right / bottom', 'margin / padding', 'border-width'].map((prop) => (
                <div key={prop} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontSize: 10, fontWeight: 700 }}>&times;</span>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)', fontFamily: 'monospace' }}>{prop}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 10 }}>Triggers layout recalculation = frame drops</p>
          </div>
        </div>
      </Section>

      {/* ---- Section 11: Common Mistakes ---- */}
      <Section title="Common Mistakes">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
          {[
            { mistake: 'Everything animates', fix: 'Animate only state changes and feedback. Static content stays static.' },
            { mistake: 'All transitions are 500ms+', fix: 'Micro: 100-150ms. Transitions: 200-350ms.' },
            { mistake: 'Linear easing on UI transitions', fix: 'ease-out for entrances, ease-in for exits, spring for arrivals.' },
            { mistake: 'Exit same duration as entrance', fix: 'Exits 20-30% shorter.' },
            { mistake: 'Stagger on 50+ items', fix: 'Cap total stagger at 300-500ms. Skip offscreen items.' },
            { mistake: 'Animating layout properties', fix: 'Only transform and opacity. GPU-composited = jank-free.' },
          ].map((item) => (
            <div key={item.mistake} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 10, borderRadius: 6, background: 'var(--color-bg-alt)' }}>
              <span style={{ fontSize: 14, color: 'var(--color-danger)', flexShrink: 0 }}>&times;</span>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.mistake}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>&rarr; {item.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

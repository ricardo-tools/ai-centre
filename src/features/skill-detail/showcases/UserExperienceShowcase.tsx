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

export function UserExperienceShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Use with <strong>content-design</strong> (error message copy, empty state copy, toast copy), <strong>accessibility</strong> (focus management, ARIA, screen readers), and <strong>interaction-motion</strong> (animation feedback patterns). This skill covers <em>why</em> and <em>what</em> — companions cover <em>how</em>.
        </p>
      </div>

      {/* ---- Section 1: Jobs-to-Be-Done Framework ---- */}
      <Section title="Jobs-to-Be-Done Framework">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Every screen exists to help a user make progress on a job. Frame it as: <em>&ldquo;When [situation], I want to [motivation], so I can [expected outcome].&rdquo;</em>
        </p>

        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 24 }}>
          {/* Visual framework */}
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>The JTBD Template</span>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20 }}>
              {[
                { label: 'When', content: '[situation]', color: 'var(--color-secondary)' },
                { label: 'I want to', content: '[motivation]', color: 'var(--color-primary)' },
                { label: 'So I can', content: '[outcome]', color: 'var(--color-success)' },
              ].map((part, i) => (
                <div key={part.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: part.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-on-primary)' }}>{i + 1}</span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: part.color, margin: '0 0 2px' }}>{part.label}</p>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{part.content}</p>
                  {i < 2 && (
                    <div style={{ position: 'absolute', right: -8, top: 24, width: 16, height: 2, background: 'var(--color-border)' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Example */}
            <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
                <strong>Example:</strong> &ldquo;When <span style={{ color: 'var(--color-secondary)' }}>I need to generate a project</span>, I want to <span style={{ color: 'var(--color-primary)' }}>select skills and describe my idea</span>, so I can <span style={{ color: 'var(--color-success)' }}>download a ready-to-use project scaffold</span>.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>This shapes information hierarchy, primary actions, and what to leave out. Everything that doesn&apos;t serve the user&apos;s bridge between before and after is noise.</p>
      </Section>

      {/* ---- Section 2: Cognitive Law Cards ---- */}
      <Section title="Cognitive Principles — UI Decisions, Not Theory">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            {
              name: 'Fitts\'s Law',
              principle: 'Time to reach a target depends on distance and size.',
              rule: 'Primary actions must be large and close to focus.',
              examples: ['Sticky action bars, not buttons at page bottom', 'Touch targets minimum 44x44px', 'Close button at top-right corner of modals'],
              color: 'var(--color-primary)',
              visual: (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12, padding: 12, background: 'var(--color-bg-alt)', borderRadius: 6 }}>
                  {/* Small distant target */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-danger)', margin: '0 auto 4px' }} />
                    <span style={{ fontSize: 9, color: 'var(--color-danger)' }}>Hard to reach</span>
                  </div>
                  <span style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>&rarr;</span>
                  {/* Large close target */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--color-success)', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>44px</span>
                    </div>
                    <span style={{ fontSize: 9, color: 'var(--color-success)' }}>Easy to reach</span>
                  </div>
                </div>
              ),
            },
            {
              name: 'Hick\'s Law',
              principle: 'Decision time increases with the number of choices.',
              rule: 'Top-level navigation: max 7 items. Add search above 15.',
              examples: ['3-4 top-level groups of 4-5 items each', 'Search/filter above 15 items', 'Progressive disclosure for complex features'],
              color: 'var(--color-secondary)',
              visual: (
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginBottom: 12, padding: 12, background: 'var(--color-bg-alt)', borderRadius: 6 }}>
                  {[3, 5, 7, 12, 20].map((n) => (
                    <div key={n} style={{ textAlign: 'center' }}>
                      <div style={{ width: 24, height: n * 3, background: n <= 7 ? 'var(--color-success)' : 'var(--color-danger)', borderRadius: 3, opacity: 0.6 }} />
                      <span style={{ fontSize: 8, color: 'var(--color-text-muted)' }}>{n}</span>
                    </div>
                  ))}
                  <span style={{ fontSize: 8, color: 'var(--color-text-muted)', marginLeft: 4 }}>choices &rarr; time</span>
                </div>
              ),
            },
            {
              name: 'Miller\'s Law',
              principle: 'Working memory holds ~7 chunks.',
              rule: 'Group form fields into chunks of 3-5 related fields.',
              examples: ['Phone numbers as groups, not 10 digits', 'Navigation grouped into labelled sections', 'Step-by-step forms with progress indicators'],
              color: 'var(--color-success)',
              visual: (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, padding: 12, background: 'var(--color-bg-alt)', borderRadius: 6, justifyContent: 'center' }}>
                  {/* Chunked group */}
                  {[0, 1, 2].map((group) => (
                    <div key={group} style={{ display: 'flex', gap: 2, padding: '4px 6px', borderRadius: 4, border: '1px dashed var(--color-success)' }}>
                      {[0, 1, 2].map((item) => (
                        <div key={item} style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-success)', opacity: 0.5 }} />
                      ))}
                    </div>
                  ))}
                </div>
              ),
            },
            {
              name: 'Cognitive Load',
              principle: 'Eliminate extraneous load, maximize germane load.',
              rule: 'Don\'t make users cross-reference between screens.',
              examples: ['Show selected skills on generation screen', 'Consistent patterns so mental models transfer', 'Dropdowns over free-text for constrained choices'],
              color: 'var(--color-warning)',
              visual: (
                <div style={{ display: 'flex', gap: 6, marginBottom: 12, padding: 12, background: 'var(--color-bg-alt)', borderRadius: 6, justifyContent: 'center' }}>
                  {[
                    { label: 'Intrinsic', desc: 'Can\'t reduce', opacity: 0.4 },
                    { label: 'Extraneous', desc: 'Must eliminate', opacity: 0.7 },
                    { label: 'Germane', desc: 'Maximize', opacity: 1 },
                  ].map((load) => (
                    <div key={load.label} style={{ textAlign: 'center', padding: '4px 8px' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-warning)', opacity: load.opacity, margin: '0 auto 4px' }} />
                      <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block' }}>{load.label}</span>
                      <span style={{ fontSize: 7, color: 'var(--color-text-muted)' }}>{load.desc}</span>
                    </div>
                  ))}
                </div>
              ),
            },
          ].map((law) => (
            <div key={law.name} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: law.color }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{law.name}</span>
              </div>
              <div style={{ padding: 16 }}>
                {law.visual}
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-body)', margin: '0 0 4px' }}>{law.principle}</p>
                <p style={{ fontSize: 12, color: law.color, margin: '0 0 10px', fontWeight: 600 }}>{law.rule}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {law.examples.map((ex) => (
                    <div key={ex} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: law.color, flexShrink: 0, marginTop: 5 }} />
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 3: Emotional Design Pyramid ---- */}
      <Section title="Emotional Design — Three Levels">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 20 }}>
          The aesthetic-usability effect: attractive interfaces are perceived as more functional even when they&apos;re not. First impressions form in 50ms.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, marginBottom: 24 }}>
          {[
            { level: 'Reflective', desc: 'How the user feels about having used it', detail: 'Does the tool make them feel competent and efficient?', color: 'var(--color-primary)', width: '50%' },
            { level: 'Behavioural', desc: 'The feel of using it', detail: 'Does it respond immediately? Does it do what I expect?', color: 'var(--color-secondary)', width: '70%' },
            { level: 'Visceral', desc: 'First impression, visual quality', detail: 'Clean layout, consistent spacing, purposeful colour. Before conscious thought.', color: 'var(--color-text-muted)', width: '90%' },
          ].map((level, i) => (
            <div key={level.level} style={{ width: level.width, padding: 16, background: level.color, borderRadius: i === 0 ? '8px 8px 0 0' : i === 2 ? '0 0 8px 8px' : 0, opacity: 0.85, textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{level.level}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', margin: '0 0 2px' }}>{level.desc}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{level.detail}</p>
            </div>
          ))}
        </div>

        <SubHeading>Micro-interactions That Create Satisfaction</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {[
            { name: 'State Transitions', desc: 'Fade + slight translate (150-300ms). Jump cuts break spatial awareness.' },
            { name: 'Cause & Effect', desc: 'Button click to visual change within 100ms. User feels the action worked.' },
            { name: 'Spring Easing', desc: 'Slight overshoot + settle feels natural. Physical objects behave this way.' },
            { name: 'Fast Progress', desc: 'Accelerating progress bars perceived 12% faster than linear.' },
          ].map((mi) => (
            <div key={mi.name} style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>{mi.name}</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{mi.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 4: Response Time Thresholds ---- */}
      <Section title="Response Time Thresholds">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          The brain&apos;s causality window is ~100ms. Feedback within that window feels like it <em>caused</em> the result.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {[
            { range: '0-100ms', perception: 'Instantaneous', response: 'Direct visual change (button state, ripple)', width: '10%', color: 'var(--color-success)' },
            { range: '100-300ms', perception: 'Slight delay', response: 'Visual acknowledgment', width: '20%', color: 'var(--color-success)' },
            { range: '300ms-1s', perception: 'System working', response: 'Loading indicator or skeleton', width: '35%', color: 'var(--color-warning)' },
            { range: '1-5s', perception: 'Attention drifts', response: 'Progress with context ("Generating project...")', width: '55%', color: 'var(--color-warning)' },
            { range: '5-10s', perception: 'Significant wait', response: 'Percentage or time estimate', width: '75%', color: 'var(--color-danger)' },
            { range: '>10s', perception: 'User abandons', response: 'Background task with notification', width: '100%', color: 'var(--color-danger)' },
          ].map((t) => (
            <div key={t.range} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 80, flexShrink: 0, textAlign: 'right' }}>
                <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'monospace', color: t.color }}>{t.range}</span>
              </div>
              <div style={{ flex: 1, height: 24, background: 'var(--color-bg-alt)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                <div style={{ width: t.width, height: '100%', background: t.color, borderRadius: 4, opacity: 0.3 }} />
              </div>
              <div style={{ width: 200, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{t.response}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 5: Trust Signals ---- */}
      <Section title="Trust Signals & Flow Preservation">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Trust */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Building Trust</span>
            </div>
            <div style={{ padding: 16 }}>
              {[
                { signal: 'Skeleton screens over spinners', desc: 'Reduce perceived load time by ~30%' },
                { signal: 'Optimistic updates', desc: 'For >95% success rate ops, update UI immediately' },
                { signal: 'Undo over confirmation', desc: '"Are you sure?" trains reflexive OK clicking' },
                { signal: 'Inline validation on blur', desc: 'Prevent errors, don\'t just report them' },
                { signal: 'Auto-save drafts', desc: 'No data loss on navigation' },
              ].map((s) => (
                <div key={s.signal} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 10, color: '#fff', fontWeight: 700 }}>&#10003;</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>{s.signal}</p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flow */}
          <div>
            <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '10px 16px', background: 'var(--color-danger-muted)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-danger)' }}>Flow Breakers (Eliminate)</span>
              </div>
              <div style={{ padding: 12 }}>
                {[
                  'Unexpected navigation without warning',
                  'Modal interruptions for non-destructive actions',
                  'Data loss on navigation',
                  'Full-page loading spinners',
                  'Context switches to external tools',
                ].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>&times;</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: 'var(--color-success-muted)', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success)' }}>Flow Enablers (Maximize)</span>
              </div>
              <div style={{ padding: 12 }}>
                {[
                  'Inline editing over navigate-to-edit',
                  'Keyboard shortcuts for power users',
                  'URL-driven state (shareable deep links)',
                  'Consistent patterns that transfer across screens',
                ].map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-success)' }}>&#10003;</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 6: Progressive Disclosure ---- */}
      <Section title="Information Architecture — Progressive Disclosure">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Disclosure Layers</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Primary action + required inputs', opacity: 1, height: 32 },
                { label: 'Advanced options (behind "More options")', opacity: 0.6, height: 24 },
                { label: 'Full documentation (help links)', opacity: 0.3, height: 16 },
              ].map((layer) => (
                <div key={layer.label} style={{ background: 'var(--color-primary)', opacity: layer.opacity, padding: '6px 12px', borderRadius: 0, marginBottom: 2, height: layer.height, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#fff', fontWeight: 500 }}>{layer.label}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>Reduces error rates by 20%, improves task completion by 25%</p>
          </div>

          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Information Scent</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 4, border: '1px solid var(--color-success)' }}>
                <span style={{ fontSize: 14, color: 'var(--color-success)' }}>&#10003;</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>Strong scent</p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>Descriptive labels, relevant previews, contextual metadata</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, borderRadius: 4, border: '1px solid var(--color-danger)' }}>
                <span style={{ fontSize: 14, color: 'var(--color-danger)' }}>&times;</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>Weak scent</p>
                  <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>Vague labels (&ldquo;Miscellaneous&rdquo;, &ldquo;Advanced&rdquo;), icons without text</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 7: Multi-Step Flows ---- */}
      <Section title="Multi-Step Flow Design">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Maximum 5 steps with visible progress and back navigation without data loss. Abandonment increases sharply beyond 5 steps.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16, padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          {[1, 2, 3, 4, 5].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: step <= 3 ? 'var(--color-primary)' : step === 4 ? 'var(--color-bg-alt)' : 'var(--color-bg-alt)',
                border: step <= 3 ? 'none' : '2px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: step <= 3 ? 'var(--color-text-on-primary)' : 'var(--color-text-muted)',
                }}>
                  {step <= 2 ? '\u2713' : step}
                </span>
              </div>
              {i < 4 && (
                <div style={{ flex: 1, height: 2, background: step <= 2 ? 'var(--color-primary)' : 'var(--color-border)', margin: '0 4px' }} />
              )}
            </div>
          ))}
        </div>

        <CodeBlock language="text" title="Multi-step flow rules">{`Rules for multi-step flows:
- Maximum 5 steps with visible progress
- Back navigation without data loss
- Every step has a clear "done" condition
- Each step validates independently
- Summary/review before final submission`}</CodeBlock>
      </Section>

      {/* ---- Section 8: Error Recovery ---- */}
      <Section title="Error Recovery Patterns">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          One-click recovery paths reduce abandonment by 50-70%. Every error state must provide an action — never a dead end.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Good */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-success-muted)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>With Recovery Action</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-danger-muted)', border: '1px solid var(--color-danger)', marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', margin: '0 0 4px' }}>Couldn&apos;t publish skill</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: '0 0 8px' }}>The draft has no content. Add content and try again.</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 4, background: 'var(--color-primary)', color: '#fff', fontWeight: 600 }}>Edit draft</span>
                  <span style={{ fontSize: 10, padding: '4px 10px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}>Dismiss</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bad */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-danger)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-danger-muted)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)' }}>Dead End (Never Do This)</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-danger-muted)', border: '1px solid var(--color-danger)' }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', margin: '0 0 4px' }}>An error occurred.</p>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Please try again later.</p>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-danger)', marginTop: 8 }}>No explanation, no recovery action, vague message</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 9: Toast Timing ---- */}
      <Section title="Toast Timing Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { type: 'Success', timing: 'Auto-dismiss 3-5s', example: 'Skill published - v1.0.0', color: 'var(--color-success)' },
            { type: 'Warning', timing: 'Persist 8-10s', example: 'Your session expires in 5 minutes', color: 'var(--color-warning)' },
            { type: 'Error', timing: 'Persist until dismissed', example: 'Couldn\'t save changes. Try again.', color: 'var(--color-danger)' },
          ].map((toast) => (
            <div key={toast.type} style={{ padding: 12, borderRadius: 8, border: `1px solid ${toast.color}`, background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: toast.color }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: toast.color }}>{toast.type}</span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>{toast.timing}</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>&ldquo;{toast.example}&rdquo;</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 10: Banned Patterns ---- */}
      <Section title="Banned Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6 }}>
          {[
            { ban: 'Error messages without recovery action', fix: 'Always include what happened, why, and what to do next' },
            { ban: 'Colour as sole state indicator', fix: 'Pair with icon, text, or shape (8% of men are colourblind)' },
            { ban: '"Are you sure?" for reversible actions', fix: 'Use undo instead' },
            { ban: 'Full-page spinners blocking interaction', fix: 'Use skeleton screens or partial loading' },
            { ban: 'Form validation only on submit', fix: 'Validate inline on blur' },
            { ban: 'Screens where next action is ambiguous', fix: 'Primary action must be visually dominant and obvious' },
            { ban: 'Interactive elements below 44x44px', fix: 'Minimum touch/click target size' },
          ].map((item) => (
            <div key={item.ban} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: 8, borderRadius: 6, background: 'var(--color-bg-alt)' }}>
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

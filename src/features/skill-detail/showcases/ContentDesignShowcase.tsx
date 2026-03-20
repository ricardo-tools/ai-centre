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

export function ContentDesignShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Use with <strong>user-experience</strong> (error recovery patterns, toast timing, empty state UX) and <strong>brand-design-system</strong> (typography and visual text styling). This skill covers the <em>words</em> — what to say, how to say it, and what tone to use.
        </p>
      </div>

      {/* ---- Section 1: Core Rule — Lead With Action ---- */}
      <Section title="Lead With What The User Can Do">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 20 }}>
          Users read UI text in a state of action. The most useful text tells them what to do next, not what just happened.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Do */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-success-muted)', borderBottom: '1px solid var(--color-success)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>Do: Lead With Action</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Sign in to continue',
                'Add your first skill to get started',
                'Try a different search term',
              ].map((text) => (
                <div key={text} style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Don't */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-danger)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-danger-muted)', borderBottom: '1px solid var(--color-danger)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)' }}>Don&apos;t: Lead With Problem</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'You are not authenticated',
                'No skills exist in the database',
                'Your query returned zero results',
              ].map((text) => (
                <div key={text} style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textDecoration: 'line-through', opacity: 0.7 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 2: User Language vs System Language ---- */}
      <Section title="User Language vs System Language">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          The user doesn&apos;t know what a &ldquo;slug&rdquo; is. They don&apos;t think in &ldquo;entities&rdquo; or &ldquo;instances.&rdquo; They have skills, projects, and ideas.
        </p>

        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 12, color: 'var(--color-success)' }}>User Language</div>
            <div style={{ padding: '10px 16px', fontWeight: 700, fontSize: 12, color: 'var(--color-danger)', borderLeft: '1px solid var(--color-border)' }}>System Language</div>
          </div>
          {[
            { user: 'This skill has already been published', system: 'Entity with status \'published\' cannot be republished' },
            { user: 'Your project is ready to download', system: 'Blob upload complete for generated_project record' },
            { user: 'We couldn\'t find any skills matching \'architecture\'', system: 'Query for skill_versions returned empty resultset' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: i < 2 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ padding: '10px 16px', fontSize: 12, color: 'var(--color-text-body)' }}>{row.user}</div>
              <div style={{ padding: '10px 16px', fontSize: 12, color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', fontFamily: 'monospace', textDecoration: 'line-through', opacity: 0.7 }}>{row.system}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 3: Error Message Patterns ---- */}
      <Section title="Error Message Pattern — Three Parts">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Every error message needs three parts: <strong>what happened</strong> + <strong>why</strong> + <strong>what to do next</strong>.
        </p>

        <div style={{ marginBottom: 24 }}>
          {/* Formula */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
            {[
              { label: 'What happened', color: 'var(--color-danger)' },
              { label: 'Why', color: 'var(--color-warning)' },
              { label: 'What to do', color: 'var(--color-success)' },
            ].map((part, i) => (
              <div key={part.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ padding: '6px 14px', borderRadius: 20, background: part.color, opacity: 0.85 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{part.label}</span>
                </div>
                {i < 2 && <span style={{ fontSize: 16, color: 'var(--color-text-muted)' }}>+</span>}
              </div>
            ))}
          </div>

          {/* Examples */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { what: 'Couldn\'t publish.', why: 'The draft has no content.', action: 'Add content and try again.' },
              { what: 'Sign-in failed.', why: 'This email domain isn\'t allowed.', action: 'Use a @ezycollect.com.au or @sidetrade.com address.' },
              { what: 'Upload failed', why: '— file is too large.', action: 'Maximum size is 5 MB.' },
              { what: 'Connection lost.', why: '', action: 'Your changes are saved locally and will sync when you\'re back online.' },
            ].map((ex, i) => (
              <div key={i} style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <span style={{ fontSize: 13, color: 'var(--color-danger)', fontWeight: 600 }}>{ex.what}</span>
                {ex.why && <span style={{ fontSize: 13, color: 'var(--color-warning)' }}> {ex.why}</span>}
                <span style={{ fontSize: 13, color: 'var(--color-success)' }}> {ex.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-danger-muted)', border: '1px solid var(--color-danger)' }}>
            <SubHeading>Never Expose</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Stack traces', 'Error codes without explanation', 'Database errors', 'Raw HTTP status codes', 'Internal field names'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>&times;</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-success-muted)', border: '1px solid var(--color-success)' }}>
            <SubHeading>Never Blame The User</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-danger)', textDecoration: 'line-through' }}>&ldquo;Invalid input&rdquo;</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}> implies user did something wrong</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-success)' }}>&ldquo;This field needs a valid email address&rdquo;</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}> guides them to fix it</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 4: Empty State Examples ---- */}
      <Section title="Empty State Patterns">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Empty states are opportunities, not dead ends. They answer: <em>why is this empty?</em> and <em>what should I do?</em>
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          {/* First-time empty */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', overflow: 'hidden' }}>
            <div style={{ padding: '6px 12px', background: 'var(--color-success-muted)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)' }}>First-Time Empty</span>
            </div>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--color-bg-alt)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="3" stroke="var(--color-text-muted)" strokeWidth="1.5" />
                  <line x1="12" y1="8" x2="12" y2="16" stroke="var(--color-text-muted)" strokeWidth="1.5" />
                  <line x1="8" y1="12" x2="16" y2="12" stroke="var(--color-text-muted)" strokeWidth="1.5" />
                </svg>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>No skills yet</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>Create your first one to get started</p>
              <span style={{ fontSize: 11, padding: '6px 14px', borderRadius: 4, background: 'var(--color-primary)', color: '#fff', fontWeight: 600 }}>Create skill</span>
            </div>
          </div>

          {/* Search empty */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', overflow: 'hidden' }}>
            <div style={{ padding: '6px 12px', background: 'var(--color-success-muted)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)' }}>Search Empty</span>
            </div>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--color-bg-alt)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="6" stroke="var(--color-text-muted)" strokeWidth="1.5" />
                  <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="var(--color-text-muted)" strokeWidth="1.5" />
                </svg>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>No skills match &ldquo;xyzzy&rdquo;</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Try a different search term or browse all skills.</p>
            </div>
          </div>

          {/* Dead-end empty (don't) */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-danger)', overflow: 'hidden' }}>
            <div style={{ padding: '6px 12px', background: 'var(--color-danger-muted)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-danger)' }}>Dead-End Empty (Don&apos;t)</span>
            </div>
            <div style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--color-bg-alt)', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>?</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px', textDecoration: 'line-through', opacity: 0.6 }}>No data</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, textDecoration: 'line-through', opacity: 0.6 }}>0 results</p>
              <p style={{ fontSize: 10, color: 'var(--color-danger)', marginTop: 8 }}>No explanation, no action</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 5: Button Label Conventions ---- */}
      <Section title="Button Label Conventions">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Buttons describe what happens when clicked. Use a verb (or verb + noun). Never use generic labels when specific ones work.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Good buttons */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Specific Verb + Noun</SubHeading>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Publish skill', 'Download ZIP', 'Generate project', 'Send code', 'Sign in', 'Delete skill'].map((label) => (
                <span key={label} style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  borderRadius: 6,
                  background: label.startsWith('Delete') ? 'var(--color-danger)' : 'var(--color-primary)',
                  color: '#fff',
                  fontWeight: 600,
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Bad buttons */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Generic (Never Use)</SubHeading>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Submit', 'OK', 'Continue', 'Go', 'Click here', 'Yes', 'No'].map((label) => (
                <span key={label} style={{
                  fontSize: 12,
                  padding: '6px 14px',
                  borderRadius: 6,
                  background: 'var(--color-bg-alt)',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                  textDecoration: 'line-through',
                  opacity: 0.6,
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>Destructive buttons</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Include the consequence: &ldquo;Delete skill&rdquo; not &ldquo;Delete&rdquo;. &ldquo;Remove from project&rdquo; not &ldquo;Remove&rdquo;.</p>
          </div>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>Loading state buttons</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Show what&apos;s happening: &ldquo;Publishing...&rdquo; / &ldquo;Generating...&rdquo; / &ldquo;Sending...&rdquo;</p>
          </div>
        </div>
      </Section>

      {/* ---- Section 6: Loading State Text ---- */}
      <Section title="Loading State Text Patterns">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Tell the user what&apos;s happening, not just that something is happening.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Good */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', background: 'var(--color-success-muted)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)' }}>Contextual Loading</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { text: 'Generating your project...', phase: '' },
                { text: 'Publishing skill...', phase: '' },
                { text: 'Assembling files...', phase: '(2 of 4)' },
              ].map((item) => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid var(--color-primary)', borderTopColor: 'transparent' }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.text}</span>
                  {item.phase && <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.phase}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Bad */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-danger)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', background: 'var(--color-danger-muted)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-danger)' }}>Generic Loading (Never)</span>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Loading...',
                'Please wait...',
                '[Spinner with no text]',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.6 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>&times;</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 12 }}>
          For operations longer than 5 seconds, add progress or phase indication.
        </p>
      </Section>

      {/* ---- Section 7: Tone Matching ---- */}
      <Section title="Match the Tone to the Moment">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          The tone should match what the user is feeling. Not every message needs the same energy.
        </p>

        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 120px 1fr 1fr', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)' }}>Moment</div>
            <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)', borderLeft: '1px solid var(--color-border)' }}>User Feeling</div>
            <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)', borderLeft: '1px solid var(--color-border)' }}>Tone</div>
            <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)', borderLeft: '1px solid var(--color-border)' }}>Example</div>
          </div>
          {[
            { moment: 'Success', feeling: 'Accomplished', tone: 'Brief, confirming', example: 'Published — v1.0.0', color: 'var(--color-success)' },
            { moment: 'Progress', feeling: 'Waiting', tone: 'Reassuring, informative', example: 'Generating your project...', color: 'var(--color-secondary)' },
            { moment: 'Error', feeling: 'Frustrated', tone: 'Calm, helpful, specific', example: 'Couldn\'t connect. Check your internet and try again.', color: 'var(--color-danger)' },
            { moment: 'Destructive', feeling: 'Cautious', tone: 'Clear, stakes-aware', example: 'Delete this skill? Published versions will be removed.', color: 'var(--color-warning)' },
            { moment: 'Empty state', feeling: 'Uncertain', tone: 'Encouraging, directive', example: 'No skills yet. Create your first one to get started.', color: 'var(--color-text-muted)' },
            { moment: 'First-time', feeling: 'Curious', tone: 'Welcoming, focused', example: 'Welcome. Start by browsing skills or generating a project.', color: 'var(--color-primary)' },
          ].map((row, i) => (
            <div key={row.moment} style={{ display: 'grid', gridTemplateColumns: '100px 120px 1fr 1fr', borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none' }}>
              <div style={{ padding: '8px 12px', fontSize: 11, fontWeight: 600, color: row.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.color }} />
                {row.moment}
              </div>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)' }}>{row.feeling}</div>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--color-text-body)', borderLeft: '1px solid var(--color-border)' }}>{row.tone}</div>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--color-text-body)', borderLeft: '1px solid var(--color-border)', fontStyle: 'italic' }}>&ldquo;{row.example}&rdquo;</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 8: Confirmation Dialogs ---- */}
      <Section title="Confirmation Dialog Patterns">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Use only for destructive or significant actions. The message must make the stakes clear.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Good */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-success)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', background: 'var(--color-success-muted)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)' }}>Clear Stakes, Specific Consequence</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 8px' }}>Delete &ldquo;Clean Architecture&rdquo;?</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '0 0 16px', lineHeight: 1.5 }}>This will remove the skill and all published versions from the library. Users who downloaded it won&apos;t be affected. This can&apos;t be undone.</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <span style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: 'var(--color-bg-alt)', color: 'var(--color-text-body)' }}>Cancel</span>
                  <span style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: 'var(--color-danger)', color: '#fff', fontWeight: 600 }}>Delete skill</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bad */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-danger)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 12px', background: 'var(--color-danger-muted)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-danger)' }}>Generic Confirmation (Never)</span>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', opacity: 0.7 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', margin: '0 0 8px', textDecoration: 'line-through' }}>Are you sure?</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 16px', textDecoration: 'line-through' }}>This action cannot be undone.</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <span style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>No</span>
                  <span style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>Yes</span>
                </div>
              </div>
              <p style={{ fontSize: 10, color: 'var(--color-danger)', marginTop: 8 }}>No specific consequence, generic button labels</p>
            </div>
          </div>
        </div>

        <SubHeading>Confirmation Hierarchy</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { stakes: 'Low', examples: 'Draft save, preference change', action: 'No confirmation, provide undo', color: 'var(--color-success)' },
            { stakes: 'Medium', examples: 'Publish, send', action: 'Brief confirmation with consequence', color: 'var(--color-warning)' },
            { stakes: 'High', examples: 'Delete, revoke access', action: 'Full confirmation, typed input for critical', color: 'var(--color-danger)' },
          ].map((level) => (
            <div key={level.stakes} style={{ padding: 12, borderRadius: 6, border: `1px solid ${level.color}`, background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: level.color, margin: '0 0 4px' }}>{level.stakes} Stakes</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '0 0 6px' }}>{level.examples}</p>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-body)', margin: 0 }}>{level.action}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 9: Shorter Is Better ---- */}
      <Section title="Shorter Is Almost Always Better">
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>
          Every word costs the user&apos;s attention. Cut ruthlessly. Exception: error messages and destructive confirmations benefit from completeness.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Concise</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Saved', 'Copied to clipboard', '3 skills selected', 'Publish'].map((text) => (
                <div key={text} style={{ padding: '6px 10px', borderRadius: 4, background: 'var(--color-success-muted)', border: '1px solid var(--color-success)' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Verbose (Don&apos;t)</SubHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Your changes have been saved successfully',
                'The content has been copied to your clipboard',
                'You have currently selected 3 skills',
                'Publish this skill to the library',
              ].map((text) => (
                <div key={text} style={{ padding: '6px 10px', borderRadius: 4, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', opacity: 0.6 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 10: Tooltips & Helper Text ---- */}
      <Section title="Tooltips and Helper Text">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Helper Text Under Fields</SubHeading>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>Slug</label>
              <div style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', fontSize: 13, color: 'var(--color-text-muted)' }}>clean-architecture</div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, margin: '4px 0 0' }}>URL-friendly name. Lowercase letters, numbers, and hyphens only.</p>
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <SubHeading>Critical Info in Tooltips (Don&apos;t)</SubHeading>
            <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-danger-muted)', border: '1px solid var(--color-danger)' }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '0 0 4px' }}>Enter your API key <span style={{ fontSize: 10, padding: '1px 4px', borderRadius: 3, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)' }}>?</span></p>
              <p style={{ fontSize: 10, color: 'var(--color-danger)', margin: 0 }}>Critical info hidden in tooltip should be a visible link instead</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Section 11: One Message, One Idea ---- */}
      <Section title="One Message, One Idea">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', margin: '0 0 8px' }}>One idea per message</p>
            <div style={{ padding: 10, borderRadius: 6, background: 'var(--color-success-muted)', border: '1px solid var(--color-success)', marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>Skill published — v1.0.0</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--color-primary)', textDecoration: 'underline' }}>View in library</span>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-danger)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', margin: '0 0 8px' }}>Multiple ideas crammed in</p>
            <div style={{ padding: 10, borderRadius: 6, background: 'var(--color-danger-muted)', border: '1px solid var(--color-danger)', opacity: 0.7 }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Your skill has been published as version 1.0.0 and is now visible in the skill library where other users can browse and download it. A showcase page will be generated shortly.</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

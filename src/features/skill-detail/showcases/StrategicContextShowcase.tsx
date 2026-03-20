'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre
    style={{
      fontSize: 12,
      fontFamily: 'monospace',
      lineHeight: 1.8,
      padding: 16,
      borderRadius: 6,
      background: 'var(--color-bg-alt)',
      border: '1px solid var(--color-border)',
      overflow: 'auto',
    }}
  >
    {children}
  </pre>
);

const phaseSteps = [
  { label: 'Start Session', desc: 'CLAUDE.md loads automatically', checkpoint: false, color: 'var(--color-text-muted)' },
  { label: 'Research / Explore', desc: 'Gather information, read files, understand scope', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'CHECKPOINT', desc: 'Write findings to file', checkpoint: true, color: 'var(--color-success)' },
  { label: 'Plan Approach', desc: 'Design solution, evaluate trade-offs', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'CHECKPOINT', desc: 'Write plan to file or tasks', checkpoint: true, color: 'var(--color-success)' },
  { label: 'Implement', desc: 'Write the code', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'Verify', desc: 'Test, build, review', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'Commit', desc: 'Descriptive commit message', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'CHECKPOINT', desc: 'Update current work state', checkpoint: true, color: 'var(--color-success)' },
  { label: 'Compact / New Session', desc: 'Safe to compact — all value is persisted', checkpoint: false, color: 'var(--color-primary)' },
];

const recoveryCosts = [
  { cost: 'Free', examples: 'File contents, git state, build output', action: 'Let go — re-read on demand', color: 'var(--color-success)' },
  { cost: 'Cheap', examples: 'Project structure, test results, specific file contents', action: 'Let go — re-derive quickly (1-3 tool calls)', color: 'var(--color-success)' },
  { cost: 'Expensive', examples: 'Architectural understanding, data flow mapping, which files are relevant', action: 'Persist to a file (10+ tool calls to recover)', color: 'var(--color-warning)' },
  { cost: 'Impossible', examples: 'Rejected approaches + why, user corrections, debugging hypotheses ruled out', action: 'Persist immediately — gone forever after compaction', color: 'var(--color-error)' },
];

export function StrategicContextShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Pairs with{' '}
          <strong>skill-creation</strong> (writing skills that survive context boundaries) and{' '}
          <strong>skill-review</strong> (long review sessions that benefit from checkpointing). Also relevant when using any skill in a long coding session.
        </p>
      </div>

      {/* ---- Checkpoint Diagram ---- */}
      <Section title="Session Flow with Checkpoints">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Work in checkpoint-to-checkpoint sprints. Each checkpoint converts ephemeral session value into durable artifacts.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: 20,
            borderRadius: 8,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          {phaseSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Timeline connector */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                <div
                  style={{
                    width: step.checkpoint ? 20 : 12,
                    height: step.checkpoint ? 20 : 12,
                    borderRadius: '50%',
                    background: step.checkpoint ? 'var(--color-success)' : 'var(--color-border)',
                    border: step.checkpoint ? '3px solid var(--color-success)' : '2px solid var(--color-border)',
                    flexShrink: 0,
                  }}
                />
                {i < phaseSteps.length - 1 && (
                  <div style={{ width: 2, height: 20, background: 'var(--color-border)' }} />
                )}
              </div>
              {/* Content */}
              <div
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: 6,
                  background: step.checkpoint ? 'var(--color-primary-muted)' : 'transparent',
                  border: step.checkpoint ? '1px solid var(--color-success)' : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: step.checkpoint ? 700 : 500, color: step.color }}>{step.label}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>{step.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Recovery Cost Matrix ---- */}
      <Section title="Knowledge Recovery Cost">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Not all knowledge is equal. Focus persistence effort on the expensive and impossible to recover.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recoveryCosts.map((row) => (
            <div
              key={row.cost}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr',
                gap: 16,
                padding: '14px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${row.color}`,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: row.color }}>{row.cost}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{row.examples}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4, fontStyle: 'italic' }}>{row.action}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- CLAUDE.md Anatomy ---- */}
      <Section title="CLAUDE.md as Persistence Layer">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          CLAUDE.md is re-read automatically on every turn. Anything written there survives compaction intact.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>What to Persist</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Constraints discovered during session',
                'Architectural decisions made',
                'Active work state (done, in progress, next)',
                'Rejected approaches with reasons',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-success)',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Safe to Let Go</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'File contents (re-read on demand)',
                'Git state (re-check instantly)',
                'Build output (re-run cheaply)',
                'Test results (re-derive quickly)',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Checkpoint Content Template ---- */}
      <Section title="Checkpoint Template">
        <CodeBlock>{`## Current Work (session checkpoint)
- Completed: skill showcase API integration, prompt template
- In progress: HTML sanitisation and caching
- Next: rate limiting for Claude API calls
- Blocked on: nothing currently

## Decisions Made
- Showcase HTML generated on publish, cached in DB
- Using DOMPurify with explicit tag allowlist
- Chose Sonnet over Haiku — quality matters more than cost

## Rejected Approaches
- Tried generating showcase at render time — too slow (3-5s)
- Tried storing as markdown instead of HTML — lost layout fidelity

## Active Constraints
- Published skill_versions rows are immutable
- AI-generated HTML is untrusted — always sanitise`}</CodeBlock>
      </Section>

      {/* ---- Decision Log Pattern ---- */}
      <Section title="Decision Log Pattern">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Rejected approaches are the highest-value ephemeral knowledge. Without documentation, the model will re-suggest the same failed approach post-compaction.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'What was tried', example: 'Generating showcase at page render time', color: 'var(--color-primary)' },
            { label: 'Why it failed', example: 'Too slow — 3-5 seconds visible delay to user', color: 'var(--color-error)' },
            { label: 'The directive', example: '"We tried X. It failed because Y. Don\'t retry."', color: 'var(--color-success)' },
          ].map((d) => (
            <div
              key={d.label}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${d.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: d.color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.label}</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{d.example}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- What Survives Compaction ---- */}
      <Section title="What Survives Compaction">
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>Survives Intact</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-warning)' }}>Compressed into Summary</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)' }}>Lost Entirely</span>
          </div>
          {[
            ['CLAUDE.md content', 'What files were read/changed', 'Nuanced reasoning chains'],
            ['Files on disk', 'Decisions discussed', 'Why alternatives were rejected'],
            ['Git history', 'Errors encountered', 'User\'s tone and style preferences'],
            ['Todo list', 'Task progress context', 'Intermediate hypotheses'],
            ['Memory files', 'Conversation flow', 'Verbal corrections not in files'],
          ].map((row, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 12, color: 'var(--color-success)' }}>{row[0]}</span>
              <span style={{ fontSize: 12, color: 'var(--color-warning)' }}>{row[1]}</span>
              <span style={{ fontSize: 12, color: 'var(--color-error)' }}>{row[2]}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Compact vs New Session ---- */}
      <Section title="Compact vs New Session">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { signal: 'Continuing same task, need continuity', action: '/compact — summary preserves context', icon: 'C' },
            { signal: 'Switching to fundamentally different task', action: 'New session — clean context is better', icon: 'N' },
            { signal: 'Quality fine but 40+ exchanges', action: 'Proactive /compact with checkpoint', icon: 'C' },
            { signal: 'Model contradicts earlier decisions', action: 'Immediate checkpoint + /compact', icon: '!' },
          ].map((item) => (
            <div
              key={item.signal}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: item.icon === '!' ? 'var(--color-error)' : 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 2 }}>{item.signal}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.action}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Handoff Template ---- */}
      <Section title="Session Handoff Template">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          When starting a new session to continue work, include this in the initial message so the new session has full context.
        </p>
        <CodeBlock>{`Continuing work from a previous session.

## Context
- Task: [what you're building]
- Current state: [what's done, what's in progress]
- Key decisions: see CLAUDE.md "Decisions Made" section

## What's left
1. [next task]
2. [following task]
3. [final task]

## Important constraints
- [constraint from previous session]
- [another constraint]

## Files to review first
- src/server/services/showcase-generator.ts (main logic)
- src/lib/sanitise.ts (HTML sanitisation config)`}</CodeBlock>
      </Section>

      {/* ---- Safe/Unsafe Compaction Zones ---- */}
      <Section title="Safe vs Unsafe Compaction Zones">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Safe to Compact After</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { phase: 'Research / explore', output: 'Findings written to file' },
                { phase: 'Plan', output: 'Plan written to file or tasks' },
                { phase: 'Implement', output: 'Code committed' },
                { phase: 'Verify', output: 'Test results captured' },
              ].map((item) => (
                <div
                  key={item.phase}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-success)',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-heading)' }}>{item.phase}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.output}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Never Compact During</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { phase: 'Mid-implementation', reason: 'Partial changes, mental model lost' },
                { phase: 'Active debugging (unresolved)', reason: 'Hypotheses and diagnosis lost' },
              ].map((item) => (
                <div
                  key={item.phase}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-error)',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-heading)' }}>{item.phase}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

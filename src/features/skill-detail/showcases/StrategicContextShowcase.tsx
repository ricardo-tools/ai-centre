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

const checkpointTriggers = [
  { trigger: '10 dispatches', when: 'At the next scenario or phase boundary after the 10th dispatch', color: 'var(--color-warning)' },
  { trigger: 'Phase boundary', when: 'After completing each phase (e.g., all Phase 1 scenarios done)', color: 'var(--color-primary)' },
  { trigger: 'Emergency', when: 'Model contradicts earlier decisions or re-suggests rejected approaches', color: 'var(--color-error)' },
];

const recoveryCosts = [
  { cost: 'Free', examples: 'File contents, git state, build output', action: 'Let go -- re-read on demand', color: 'var(--color-success)' },
  { cost: 'Cheap', examples: 'Project structure, test results, specific file contents', action: 'Let go -- re-derive quickly (1-3 tool calls)', color: 'var(--color-success)' },
  { cost: 'Expensive', examples: 'Architectural understanding, data flow mapping, which files are relevant', action: 'Persist to checkpoint file (10+ tool calls)', color: 'var(--color-warning)' },
  { cost: 'Impossible', examples: 'Rejected approaches + why, user corrections, debugging hypotheses ruled out', action: 'Persist immediately -- gone forever after compaction', color: 'var(--color-error)' },
];

const sessionSteps = [
  { label: 'Start session', desc: 'CLAUDE.md + LOG.md load automatically', checkpoint: false, color: 'var(--color-text-muted)' },
  { label: 'Read chapter plan', desc: 'Extract methodology', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'Phase 1, Scenario 1', desc: 'Steps 1-4a (dispatches 1-5)', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'Phase 1, Scenario 2', desc: 'Steps 1-4a (dispatches 6-10)', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'DISPATCH BUDGET HIT', desc: 'Checkpoint + /compact', checkpoint: true, color: 'var(--color-warning)' },
  { label: 'Re-read chapter plan', desc: 'Re-read plan + methodology after compact', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'Steps 4b-5', desc: 'Dispatches 11-13', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'PHASE BOUNDARY', desc: 'Checkpoint + /compact', checkpoint: true, color: 'var(--color-primary)' },
  { label: 'Phase 2...', desc: 'Dispatch counter resets after compact', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'Steps 6-9', desc: 'Audits, compliance, logs', checkpoint: false, color: 'var(--color-text-body)' },
  { label: 'Chapter complete', desc: 'Stop. New session for next chapter.', checkpoint: true, color: 'var(--color-success)' },
];

export function StrategicContextShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Opinion companion for flow.</strong> Knowledge persistence across sessions and within long coordinator sessions.
          Checkpoint every 10 dispatches and at every phase boundary. Convert ephemeral knowledge into persistent artifacts at strategic moments.
        </p>
      </div>

      {/* ---- Checkpoint Triggers ---- */}
      <Section title="Checkpoint Triggers">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          The coordinator compacts at these triggers -- whichever comes first. Never checkpoint mid-step.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {checkpointTriggers.map((t) => (
            <div
              key={t.trigger}
              style={{
                padding: '16px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${t.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: t.color }}>{t.trigger}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'var(--color-primary-muted)', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  .claude/.strategic-context/
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t.when}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Knowledge Recovery Cost ---- */}
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

      {/* ---- Coordinator Session Structure ---- */}
      <Section title="Coordinator Session Structure">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          One chapter per session. After completing a chapter, stop. Start a new session for the next chapter. The dispatch budget forces proactive checkpoints before context degrades.
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
          {sessionSteps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 24, flexShrink: 0 }}>
                <div
                  style={{
                    width: step.checkpoint ? 20 : 12,
                    height: step.checkpoint ? 20 : 12,
                    borderRadius: '50%',
                    background: step.checkpoint ? step.color : 'var(--color-border)',
                    border: step.checkpoint ? `3px solid ${step.color}` : '2px solid var(--color-border)',
                    flexShrink: 0,
                  }}
                />
                {i < sessionSteps.length - 1 && (
                  <div style={{ width: 2, height: 20, background: 'var(--color-border)' }} />
                )}
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '8px 14px',
                  borderRadius: 6,
                  background: step.checkpoint ? 'var(--color-primary-muted)' : 'transparent',
                  border: step.checkpoint ? `1px solid ${step.color}` : '1px solid transparent',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: step.checkpoint ? 700 : 500, color: step.color }}>{step.label}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>{step.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Checkpoint Content Template ---- */}
      <Section title="Checkpoint Content">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          A checkpoint converts the session&#39;s ephemeral value into a durable file. Written to <code style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>.claude/.strategic-context/</code>, named by chapter and dispatch count.
        </p>
        <CodeBlock>{`## Checkpoint: Ch 27, after Phase 1 (dispatch 8)

### Completed
- Phase 1: Post-login redirect fix. Integration + E2E tests pass.
- Scenarios S1 (integration) and S2 (E2E) both green.

### Next
- Phase 2: Persona card heading navigation fix (1 E2E scenario)
- Phase 3: Verify both journey tests pass

### Decisions
- Scoped login E2E assertion to content heading (was matching multiple)
- PersonaForm htmlFor/id added for a11y + Playwright testability

### Rejected approaches
- Tried getByText('ricardo.admin') for post-login verification
  -- matches 6 elements on /content page (owner column). Use heading.

### Active constraints
- Build with NODE_ENV=test for Playwright
- Don't delete .next unless build-affecting files changed

### Test state
- 446 vitest, 22 E2E (login + personas updated)`}</CodeBlock>
      </Section>

      {/* ---- Rejected Approaches ---- */}
      <Section title="Rejected Approaches = Highest-Value Knowledge">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          When an approach is tried and abandoned, the reasoning exists only in conversation. After compaction, the model will re-suggest the same failed approach.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'What was tried', example: 'Generating showcase at page render time', color: 'var(--color-primary)' },
            { label: 'Why it failed', example: 'Too slow -- 3-5 seconds visible delay to user', color: 'var(--color-error)' },
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
            ['Checkpoint files on disk', 'Decisions discussed', 'Why alternatives were rejected'],
            ['Git history', 'Errors encountered', 'User\'s tone and style preferences'],
            ['Todo list', 'Task progress context', 'Intermediate hypotheses'],
            ['LOG.md, PROJECT_REFERENCE.md', 'Conversation flow', 'Verbal corrections not in files'],
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

      {/* ---- Post-Compact Protocol ---- */}
      <Section title="Post-Compact Protocol">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '2px solid var(--color-success)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>After Checkpointing</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Compact with focus hint referencing checkpoint file',
                'Re-read the chapter plan and methodology',
                'Do not rely on compressed context for compliance',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-success)' }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '2px solid var(--color-error)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-error)', marginBottom: 8 }}>Never Compact During</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Mid-step (between implementer and its test runner)',
                'Active debugging with unresolved hypotheses',
                'Multiple chapters in one session -- stop after Step 9',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-error)' }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'Checkpoint file written with: done, next, decisions, rejected, constraints, test state',
            'Rejected approaches documented with reasons',
            'Active constraints persisted ("do NOT do X because Y")',
            'In-progress code committed or changes safe to re-derive',
            'No active debugging session with unresolved hypotheses',
            'Dispatch count noted in checkpoint filename',
          ].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 6,
                background: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

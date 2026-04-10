'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const phases = [
  {
    name: 'PLANNING',
    color: 'var(--color-primary)',
    description: 'Explore codebase, design approach, present for approval',
    actions: [
      { label: 'flow-plan', desc: 'Create plan under .plans/, pick template, structure chapters' },
      { label: 'flow-plan-log', desc: 'READ .plans/LOG.md to understand current position' },
      { label: 'flow-project-reference', desc: 'READ PROJECT_REFERENCE.md to understand what exists' },
    ],
  },
  {
    name: 'IMPLEMENTATION',
    color: 'var(--color-secondary)',
    description: 'Follow the active plan template methodology',
    actions: [
      { label: 'Template-driven', desc: 'PLAN_TEMPLATE_DEV.md or PLAN_TEMPLATE_TOOLING.md' },
      { label: 'Testing per template', desc: 'TDD, EDD, design gates as template prescribes' },
      { label: 'No doc updates', desc: 'Write docs after delivery, never mid-implementation' },
    ],
  },
  {
    name: 'POST-DELIVERY',
    color: 'var(--color-success)',
    description: 'Update all living documents after each chapter',
    actions: [
      { label: 'flow-plan-log', desc: 'UPDATE: mark chapter complete, update infrastructure state' },
      { label: 'flow-project-reference', desc: 'WRITE: update feature map and status' },
      { label: 'flow-strategic-context', desc: 'Checkpoint decisions for future sessions' },
    ],
  },
];

const guardrails = [
  {
    rule: 'Plan before acting',
    desc: 'Enter plan mode before writing code. Explore, design, get approval. Exception: trivially small tasks.',
    severity: 'Critical',
    color: 'var(--color-error)',
  },
  {
    rule: 'Never take destructive actions without authorisation',
    desc: 'Ask before: git commit, git push, deleting files, modifying production config, deploying, destructive DB operations.',
    severity: 'Critical',
    color: 'var(--color-error)',
  },
  {
    rule: 'Proportional to request size',
    desc: 'One-line fix = one-line answer. Bug = minimal research + fix. Feature = full plan. Architecture = deep research.',
    severity: 'Important',
    color: 'var(--color-warning)',
  },
];

const proportionalScale = [
  { size: 'One-line fix', response: 'One-line answer, no plan', effort: 'Seconds', color: 'var(--color-success)' },
  { size: 'Bug with clear cause', response: 'Minimal research, fix + test', effort: 'Minutes', color: 'var(--color-success)' },
  { size: 'New feature', response: 'Full plan with chapters', effort: 'Hours', color: 'var(--color-warning)' },
  { size: 'Architecture decision', response: 'Deep research, comparison tables', effort: 'Session', color: 'var(--color-error)' },
];

const commands = [
  { cmd: '/continue', trigger: 'Start of session', desc: 'Read LOG.md, check for parked position, resume or start next chapter', color: 'var(--color-primary)' },
  { cmd: '/plan <topic>', trigger: 'User asks to plan', desc: 'Determine plan type (dev/tooling), research, debate, produce plan file', color: 'var(--color-secondary)' },
  { cmd: '/status', trigger: 'Mid-session check', desc: 'Read-only summary: current plan, chapter, progress, test counts, blockers', color: 'var(--color-brand)' },
  { cmd: '/research <topic>', trigger: 'Standalone research', desc: 'Triage complexity, dispatch research agents, report with confidence levels', color: 'var(--color-success)' },
  { cmd: '/audit [scope]', trigger: 'Quality check', desc: 'Parallel audit subagents: observability, security, a11y, code quality, UX', color: 'var(--color-warning)' },
  { cmd: '/park', trigger: 'End of session', desc: 'Write parked block to LOG.md with position, decisions, warnings', color: 'var(--color-error)' },
];

const opinions = [
  { name: 'flow-plan', purpose: 'Plan structure, template selection, mandatory pre-plan research' },
  { name: 'flow-plan-log', purpose: 'Maintain .plans/LOG.md execution log' },
  { name: 'flow-tdd', purpose: 'Testing: Gherkin scenarios, data isolation, hardening' },
  { name: 'flow-eval-driven', purpose: 'EDD: Playwright headless, screenshots, logs, vision' },
  { name: 'flow-research', purpose: 'Structured research with CRAAP-tested sources' },
  { name: 'flow-planning', purpose: 'Full planning cycle: triage, research, debate, plan review' },
  { name: 'flow-observability', purpose: 'Server log API, structured logging, diagnostics' },
  { name: 'flow-project-reference', purpose: 'Maintain PROJECT_REFERENCE.md' },
  { name: 'flow-project-docs', purpose: 'Maintain docs route in webapp' },
  { name: 'flow-strategic-context', purpose: 'Checkpoint decisions for future sessions' },
];

export function FlowShowcase() {
  return (
    <div>
      {/* ---- Intro Banner ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Core workflow router</strong> for human-AI paired work. Defines phases, hooks, and safety guardrails. Plan templates define methodology. Opinion skills define specifics. Principle: <strong>read during planning, write after delivery.</strong>
        </p>
      </div>

      {/* ---- Three-Phase Diagram ---- */}
      <Section title="Three-Phase Workflow">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {phases.map((phase, i) => (
            <div key={phase.name} style={{ display: 'flex', alignItems: 'stretch', gap: 12, flex: 1, minWidth: 260 }}>
              <div
                style={{
                  flex: 1,
                  borderRadius: 8,
                  border: `2px solid ${phase.color}`,
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: '14px 16px', background: phase.color }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-bg-surface)', letterSpacing: '0.1em' }}>{phase.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-bg-surface)', opacity: 0.8, marginTop: 4 }}>{phase.description}</div>
                </div>
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, background: 'var(--color-surface)' }}>
                  {phase.actions.map((a) => (
                    <div
                      key={a.label}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 6,
                        background: 'var(--color-bg-alt)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: phase.color, fontFamily: 'monospace' }}>{a.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2, lineHeight: 1.4 }}>{a.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              {i < phases.length - 1 && (
                <div style={{ display: 'flex', alignItems: 'center', fontSize: 20, color: 'var(--color-text-muted)', fontWeight: 300 }}>{'>'}</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Safety Guardrails ---- */}
      <Section title="Safety Guardrails">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Always active regardless of template or opinions. No exceptions, no assumptions from prior approvals.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {guardrails.map((g) => (
            <div
              key={g.rule}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${g.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: g.color,
                    color: 'var(--color-bg-surface)',
                    textTransform: 'uppercase',
                  }}
                >
                  {g.severity}
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>{g.rule}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.6 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Proportional Response ---- */}
      <Section title="Proportional Response Scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {proportionalScale.map((p) => (
            <div
              key={p.size}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${p.color}`,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', minWidth: 180 }}>{p.size}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', flex: 1 }}>{p.response}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: p.color, fontFamily: 'monospace' }}>{p.effort}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Command Reference Table ---- */}
      <Section title="Command Reference">
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
              gridTemplateColumns: '140px 140px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Command</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Trigger</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Description</span>
          </div>
          {commands.map((c, i) => (
            <div
              key={c.cmd}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 140px 1fr',
                padding: '12px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, fontWeight: 700, color: c.color, fontFamily: 'monospace' }}>{c.cmd}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.trigger}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{c.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Available Opinions ---- */}
      <Section title="Available Opinions">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Activated per project in CLAUDE.md. Each opinion adds specific methodology without changing the flow phases.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 8 }}>
          {opinions.map((o) => (
            <div
              key={o.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <code style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace', minWidth: 160 }}>{o.name}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{o.purpose}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

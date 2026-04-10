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

const logSections = [
  {
    number: '1',
    name: 'Active Context',
    audience: 'AI coordinator starting a new session',
    purpose: 'Everything needed to pick up where work left off',
    limit: 'Under 40 lines',
    color: 'var(--color-error)',
    fields: ['Next chapter + plan file path', 'Current app state (one sentence)', 'Test counts', 'Dev login', 'Environment requirements', 'Key files to read', 'Points of attention'],
  },
  {
    number: '2',
    name: 'Plan Overview',
    audience: 'Human reviewing project progress',
    purpose: 'At-a-glance status of everything',
    limit: 'No limit',
    color: 'var(--color-warning)',
    fields: ['One table per plan', 'Status: Complete / In progress / Not started', 'Key Decisions column', 'Attention column', 'Post-plan state for completed plans'],
  },
  {
    number: '3',
    name: 'Execution Log',
    audience: 'Anyone needing detailed history',
    purpose: 'What was done, when, with enough detail to understand',
    limit: 'No limit',
    color: 'var(--color-success)',
    fields: ['Grouped by session date', 'Within session, grouped by chapter', 'Capabilities over file lists', 'Test counts per chapter entry', 'Infrastructure changes noted'],
  },
];

const updateEvents = [
  { event: 'Chapter completed', section1: 'Next chapter', section2: 'Status -> Complete', section3: 'Add entry' },
  { event: 'Plan completed', section1: 'Next plan/chapter', section2: 'Post-plan state', section3: 'Add entry' },
  { event: 'New plan started', section1: '--', section2: 'Add plan table', section3: 'Add entry' },
  { event: 'Session ending mid-chapter', section1: 'Points of attention', section2: '--', section3: '--' },
  { event: 'Decision made', section1: '--', section2: 'Key Decisions', section3: '--' },
];

export function FlowPlanLogShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Opinion companion for flow.</strong> Maintains <code style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>.plans/LOG.md</code> as the canonical record of plan execution.
          Hooks into POST-DELIVERY via Step 8a in the methodology.
        </p>
      </div>

      {/* ---- Three-Section Structure ---- */}
      <Section title="LOG.md Three-Section Structure">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {logSections.map((s) => (
            <div
              key={s.number}
              style={{
                borderRadius: 8,
                border: `2px solid ${s.color}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  background: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-bg-surface)', opacity: 0.5 }}>{s.number}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{s.name}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-bg-surface)', opacity: 0.8 }}>{s.limit}</span>
              </div>
              <div style={{ padding: 16, background: 'var(--color-surface)' }}>
                <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Audience</span>
                    <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.audience}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Purpose</span>
                    <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.purpose}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {s.fields.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: 4,
                        background: 'var(--color-bg-alt)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-body)',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 1: Active Context Template ---- */}
      <Section title="Active Context Template">
        <CodeBlock>{`## Active Context (read this first)

**Next chapter:** Ch N -- Title
**Plan file:** \`.plans/plan-name/chN-slug.md\`
**Methodology:** Extract from the chapter file

**Current app state:** [One sentence]
**Test counts:** [N vitest (N skipped) + N Playwright E2E]
**Dev login:** [How to log in locally]

**Environment requirements:**
- [Docker, ports, env vars, services]

**Key files to read:**
- [Cross-references to ARCHITECTURE.md, etc.]

**Points of attention:**
- [Gotchas, known issues, non-obvious things]`}</CodeBlock>
      </Section>

      {/* ---- Entry Format Rules ---- */}
      <Section title="Entry Format Rules">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { rule: 'Capabilities over file lists', example: '"Users can invite team members" not "Created src/features/users/actions.ts"', color: 'var(--color-primary)' },
            { rule: 'Decisions are real choices', example: '"postgres.js over @neondatabase/serverless -- works with Docker and Neon"', color: 'var(--color-warning)' },
            { rule: 'Infrastructure state is numbers', example: '"256 vitest, 22 E2E, 20 tables, 15 routes"', color: 'var(--color-success)' },
            { rule: 'Next action is immediately actionable', example: '"Ch 16 -- Embeddings + Graph Sync" with the plan file path', color: 'var(--color-error)' },
          ].map((r) => (
            <div
              key={r.rule}
              style={{
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${r.color}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{r.rule}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{r.example}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- When to Update ---- */}
      <Section title="When to Update">
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)', padding: '10px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Event</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)' }}>Section 1</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-warning)' }}>Section 2</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>Section 3</span>
          </div>
          {updateEvents.map((e, i) => (
            <div
              key={e.event}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                padding: '8px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{e.event}</span>
              <span style={{ fontSize: 12, color: e.section1 === '--' ? 'var(--color-border)' : 'var(--color-text-body)' }}>{e.section1}</span>
              <span style={{ fontSize: 12, color: e.section2 === '--' ? 'var(--color-border)' : 'var(--color-text-body)' }}>{e.section2}</span>
              <span style={{ fontSize: 12, color: e.section3 === '--' ? 'var(--color-border)' : 'var(--color-text-body)' }}>{e.section3}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Section 2: Plan Overview Example ---- */}
      <Section title="Plan Overview Example">
        <CodeBlock>{`## Plan & Chapter Overview

### Plan 01: Persona Management

| Ch | Title          | Status   | Key Decisions              | Attention         |
|----|----------------|----------|----------------------------|-------------------|
| 1  | Schema + Seed  | Complete | Custom fetch, no SDK       | Sub-entities def. |
| 2  | CRUD Actions   | Complete | Result<T,E> pattern        | --                |
| 3  | UI Widgets     | Active   | --                         | --                |

**Post-plan state:** 20 tables, 256 vitest, 22 E2E`}</CodeBlock>
      </Section>
    </div>
  );
}

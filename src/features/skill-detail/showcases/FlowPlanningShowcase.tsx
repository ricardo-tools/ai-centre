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

const corePrinciples = [
  { name: 'Vertical slices', desc: 'Every chapter delivers visible, testable UI. No backend-only chapters.' },
  { name: 'One concern per chapter', desc: 'If the description needs "and" between two verbs, split it.' },
  { name: 'Polish is built-in', desc: 'Animations, feedback, keyboard, empty states are acceptance criteria.' },
  { name: 'Prove the pattern first', desc: 'Foundation chapter builds the pattern end-to-end. Others extend.' },
  { name: 'Research scales to risk', desc: 'Foundation chapters get full research. Extensions get none.' },
  { name: 'Incremental journey', desc: 'Each chapter extends the same E2E journey test.' },
  { name: 'Per-chapter audit', desc: 'Proportional to what changed. No separate audit gate for simple plans.' },
];

const triageClassifications = [
  {
    level: 'Simple',
    criteria: 'One clear solution, no real alternatives',
    evidence: 'Name the solution + why alternatives don\'t exist',
    agents: '1 research agent',
    debate: 'No debate',
    color: 'var(--color-success)',
  },
  {
    level: 'Moderate',
    criteria: '2-3 viable approaches, needs comparison',
    evidence: 'Name approaches + trade-off dimensions',
    agents: '2 research agents (split KBs)',
    debate: '1 debate round',
    color: 'var(--color-warning)',
  },
  {
    level: 'Complex',
    criteria: 'Multiple approaches with architectural trade-offs',
    evidence: 'Name approaches, impacted systems, risk if wrong',
    agents: '2 research agents (split KBs)',
    debate: '2+ debate rounds',
    color: 'var(--color-error)',
  },
];

const chapterTiers = [
  {
    tier: 'Foundation',
    when: 'First chapter. Builds the pattern, makes architectural decisions.',
    research: 'Full (1-2 agents, per plan triage)',
    debate: 'Full (if Moderate/Complex topic)',
    color: 'var(--color-error)',
  },
  {
    tier: 'New Capability',
    when: 'Adds a new interaction or flow to the proven pattern.',
    research: 'Light (1 agent, one scoped question)',
    debate: 'None (unless coordinator flags a decision)',
    color: 'var(--color-warning)',
  },
  {
    tier: 'Extension',
    when: 'Wires more data to a proven pattern. No new interactions.',
    research: 'None',
    debate: 'None',
    color: 'var(--color-success)',
  },
];

const summarySteps = [
  { step: '0', name: 'Topic Triage', desc: 'Classify plan topic: Simple / Moderate / Complex', color: 'var(--color-text-muted)' },
  { step: '1', name: 'Chapter Shaping', desc: 'Vertical slices, one-concern rule, order, tier each chapter, define journey', color: 'var(--color-primary)' },
  { step: '2', name: 'Foundation Chapter', desc: 'Research (scaled to triage) > Debate (if needed) > Plan + Review (1 cycle)', color: 'var(--color-warning)' },
  { step: '3', name: 'Remaining Chapters', desc: 'New Capability: Light research > Plan. Extension: Plan only.', color: 'var(--color-success)' },
  { step: '4', name: 'Cross-Chapter Review', desc: 'Reviewer reads all chapters: gaps, ordering, journey progression, merge candidates', color: 'var(--color-secondary)' },
];

export function FlowPlanningShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Planning methodology for chapter plans.</strong> Produces plans where every chapter is a small vertical slice -- schema through UI -- with polish built into acceptance criteria.
          Includes plan templates under <code style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>references/</code>.
        </p>
      </div>

      {/* ---- Core Principles ---- */}
      <Section title="Core Principles">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 8 }}>
          {corePrinciples.map((p, i) => (
            <div
              key={p.name}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', minWidth: 20 }}>{i + 1}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Summary Flow ---- */}
      <Section title="Planning Flow">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {summarySteps.map((s, i) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: s.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{s.step}</span>
              </div>
              <div style={{ flex: 1, padding: '12px 16px', borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.desc}</div>
              </div>
              {i < summarySteps.length - 1 && <div style={{ width: 0 }} />}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Triage Complexity Levels ---- */}
      <Section title="Topic Triage (Step 0)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Classify the overall plan topic. Triage controls research intensity and debate depth. The triage agent must justify with evidence.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {triageClassifications.map((t) => (
            <div
              key={t.level}
              style={{
                borderRadius: 8,
                border: `2px solid ${t.color}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 20px',
                  background: t.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{t.level}</span>
                <span style={{ fontSize: 12, color: 'var(--color-bg-surface)', opacity: 0.8 }}>{t.criteria}</span>
              </div>
              <div style={{ padding: 16, background: 'var(--color-surface)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Evidence</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t.evidence}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Research</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t.agents}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Debate</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t.debate}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Chapter Complexity Tiers ---- */}
      <Section title="Chapter Complexity Tiers (Step 1)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          After triage, shape the plan into vertical slices. Each chapter is classified by complexity tier which determines its research and debate depth.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {chapterTiers.map((ct) => (
            <div
              key={ct.tier}
              style={{
                padding: '16px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${ct.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: ct.color }}>{ct.tier}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'var(--color-primary-muted)', color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                    {ct.research}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    {ct.debate}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{ct.when}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            <strong>Sizing test:</strong> Can a single subagent implement the chapter in one dispatch without needing a Context Builder? If it needs a Context Builder, the chapter is too large -- split it.
          </div>
        </div>
      </Section>

      {/* ---- Foundation Chapter Detail ---- */}
      <Section title="Foundation Chapter (Step 2)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          The Foundation chapter gets the full treatment. Scale research intensity based on Step 0 triage.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { step: '2a', title: 'Research', desc: 'Simple: 1 agent. Moderate: 2 agents with split knowledge bases. Complex: 2 agents, discover subtopics.', color: 'var(--color-primary)' },
            { step: '2b', title: 'Debate', desc: 'Moderate: 1 round, moderator challenges disagreements. Complex: 2+ rounds, stress-tests 4-5 specific points.', color: 'var(--color-warning)' },
            { step: '2c', title: 'Plan + Review', desc: 'Planner drafts following template. Detail + Conciseness reviewers in parallel. 1 review cycle.', color: 'var(--color-success)' },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${s.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.step}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>{s.title}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Knowledge Base Split ---- */}
      <Section title="Knowledge Base Split (2-Agent Research)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Two research agents MUST use different sources. Identical inputs produce identical outputs.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '2px solid var(--color-primary)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Agent A</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Official docs', 'Framework source code', 'API references'].map((s) => (
                <div key={s} style={{ fontSize: 12, color: 'var(--color-text-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)' }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '2px solid var(--color-secondary)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-secondary)', marginBottom: 8 }}>Agent B</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['GitHub repos', 'Community blog posts', 'Stack Overflow', 'Real-world patterns'].map((s) => (
                <div key={s} style={{ fontSize: 12, color: 'var(--color-text-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-secondary)' }} />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Plan Templates ---- */}
      <Section title="Plan Templates (references/)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { name: 'PLAN_TEMPLATE_DEV.md', desc: 'Features, schema, UI, API endpoints, auth. Full methodology pipeline.', color: 'var(--color-primary)' },
            { name: 'PLAN_TEMPLATE_TOOLING.md', desc: 'CI, testing setup, skills, process, developer tooling.', color: 'var(--color-warning)' },
            { name: 'PLAN_TEMPLATE_MASTER.md', desc: 'Multi-plan coordination, post-plan completion triggers.', color: 'var(--color-error)' },
          ].map((t) => (
            <div
              key={t.name}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `3px solid ${t.color}`,
              }}
            >
              <code style={{ fontSize: 12, fontWeight: 700, color: t.color, fontFamily: 'monospace' }}>{t.name}</code>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 6 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Checks ---- */}
      <Section title="Quality Checks">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { check: 'Every chapter includes schema changes alongside the UI that uses them', color: 'var(--color-primary)' },
            { check: 'Every chapter ships with polish in its acceptance criteria', color: 'var(--color-primary)' },
            { check: 'Extension chapters reference Foundation, no new research', color: 'var(--color-success)' },
            { check: 'Chapter Shaping runs before any research begins', color: 'var(--color-warning)' },
            { check: 'Each chapter described with a single verb ("browse", "edit", "create")', color: 'var(--color-warning)' },
            { check: 'Each chapter fits in one subagent dispatch', color: 'var(--color-error)' },
            { check: 'Audits and journey tests built into each chapter', color: 'var(--color-error)' },
            { check: '"User can" line is the spec -- test writer translates to tests', color: 'var(--color-secondary)' },
          ].map((item) => (
            <div
              key={item.check}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${item.color}`,
              }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 3, border: '2px solid var(--color-border)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.check}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const agents = [
  {
    name: 'Strict',
    philosophy: 'Follow brand guidelines exactly. No deviation from existing patterns, spacing, typography, or colour system. Compose from existing primitives.',
    color: 'var(--color-primary)',
    icon: 'S',
  },
  {
    name: 'Adaptive',
    philosophy: 'Innovate within guidelines. New layout patterns and interactions allowed, but keep most styling on-brand. Break only for clear UX improvement with a comment.',
    color: 'var(--color-warning)',
    icon: 'A',
  },
  {
    name: 'Creative',
    philosophy: 'Lead with creativity. Brand guidelines are a starting point, not a constraint. Push boundaries on layout, interaction, and visual design.',
    color: 'var(--color-error)',
    icon: 'C',
  },
];

const workflowSteps = [
  { step: '1', name: 'Create Project', desc: 'Folder under prototypes/projects/<slug>/ with project.json + brief.md', color: 'var(--color-text-muted)' },
  { step: '2', name: 'Dispatch 3 Agents', desc: 'Strict, Adaptive, Creative -- all work independently in parallel', color: 'var(--color-primary)' },
  { step: '3', name: 'Present', desc: 'User reviews 3 prototypes with funny random names in the prototype app', color: 'var(--color-secondary)' },
  { step: '4', name: 'Iterate', desc: 'User picks winner; only that agent iterates. Previous versions preserved.', color: 'var(--color-warning)' },
  { step: '5', name: 'Redesign', desc: 'Explicit request only: all 3 agents with current best as base', color: 'var(--color-error)' },
];

const notIncluded = [
  'No tests (no Vitest, no Playwright)',
  'No planning methodology',
  'No database (all data mocked)',
  'No auth (local only)',
  'No deployment',
  'No code review gates',
];

export function FlowPrototypeShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Lightweight prototyping workflow.</strong> Prototypes live in /prototypes, use the same stack as the main app,
          require no tests or planning. Fast, creative, no ceremony.
        </p>
      </div>

      {/* ---- Three-Agent Dispatch ---- */}
      <Section title="Three-Agent Dispatch">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Initial creation dispatches three agents for divergent exploration. Each reads the same brief, design tokens, and app context, but applies a different design philosophy.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {agents.map((a) => (
            <div
              key={a.name}
              style={{
                borderRadius: 8,
                border: `2px solid ${a.color}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  background: a.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--color-bg-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{a.icon}</span>
                </div>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{a.name}</span>
              </div>
              <div style={{ padding: 16, background: 'var(--color-surface)' }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5, margin: 0 }}>{a.philosophy}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Iteration Workflow ---- */}
      <Section title="Iteration Workflow">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {workflowSteps.map((s, i) => (
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
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{s.step}</span>
              </div>
              <div style={{ flex: 1, padding: '12px 16px', borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.desc}</div>
              </div>
              {i < workflowSteps.length - 1 && (
                <div style={{ width: 0 }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            <strong>Key rule:</strong> Iterations use ONLY the winning agent type. Redesign (all 3 agents) only on explicit user request.
            Previous versions are always preserved -- nothing is deleted.
          </div>
        </div>
      </Section>

      {/* ---- Prototype Naming ---- */}
      <Section title="Prototype Naming">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Random two-word funny names: adjective + noun. Slug format for folders.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['Turbo Falcon', 'Dizzy Panda', 'Cosmic Waffle', 'Neon Penguin', 'Mango Thunder', 'Lazy Kraken', 'Pixel Moose', 'Quantum Burrito'].map((name) => (
            <span
              key={name}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 16,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-heading)',
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </Section>

      {/* ---- Graduation to Production ---- */}
      <Section title="Graduation to Production">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          The /prototype guide command generates an implementation guide bridging prototype to production.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { step: '1', title: 'Flow Overview', desc: 'Step-by-step user journey from the prototype', color: 'var(--color-primary)' },
            { step: '2', title: 'Widget Decomposition', desc: 'Map monolithic page.tsx to widgets with size variants + data hooks', color: 'var(--color-warning)' },
            { step: '3', title: 'Reusable Components', desc: 'Identify shared patterns for platform/ui/', color: 'var(--color-success)' },
          ].map((g) => (
            <div
              key={g.step}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${g.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: g.color, marginBottom: 4 }}>{g.step}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{g.title}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{g.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
          {[
            { step: '4', title: 'Critical Details', desc: 'Hard-to-get-right interactions with line references to prototype code', color: 'var(--color-error)' },
            { step: '5', title: 'Brand/Token Updates', desc: 'Colours, shadows, typography not yet in design system tokens', color: 'var(--color-secondary)' },
            { step: '6', title: 'Code References', desc: 'All references point to prototype page.tsx with line numbers', color: 'var(--color-brand)' },
          ].map((g) => (
            <div
              key={g.step}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${g.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: g.color, marginBottom: 4 }}>{g.step}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{g.title}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- What This Skill Does NOT Do ---- */}
      <Section title="What This Skill Does NOT Do">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {notIncluded.map((item) => (
            <div
              key={item}
              style={{
                padding: '10px 14px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: '3px solid var(--color-error)',
                fontSize: 12,
                color: 'var(--color-text-body)',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Commands ---- */}
      <Section title="Commands">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { cmd: '/prototype <description>', desc: 'Create new project + 3 prototypes (strict, adaptive, creative)' },
            { cmd: '/prototype iterate <project> <name> <feedback>', desc: 'Iterate on winner. Only that agent type dispatched.' },
            { cmd: '/prototype redesign <project> <feedback>', desc: 'Full 3-agent exploration using current best as base.' },
            { cmd: '/prototype guide <project> <name>', desc: 'Generate implementation guide for production graduation.' },
          ].map((c) => (
            <div
              key={c.cmd}
              style={{
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace', marginBottom: 2 }}>{c.cmd}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

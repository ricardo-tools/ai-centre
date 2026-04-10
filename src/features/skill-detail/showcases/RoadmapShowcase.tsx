'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const nowItems = [
  { title: 'Skill marketplace search', priority: 'Must', status: 'in-progress', subtasks: 3, completed: 1 },
  { title: 'Archetype ZIP generation', priority: 'Must', status: 'in-progress', subtasks: 4, completed: 3 },
  { title: 'Dark mode polish', priority: 'Should', status: 'pending', subtasks: 2, completed: 0 },
];

const nextItems = [
  { title: 'Team sharing for archetypes', priority: 'Should', rationale: 'Most-requested feature in feedback' },
  { title: 'Skill version history', priority: 'Could', rationale: 'Track skill evolution over time' },
];

const laterItems = [
  { title: 'AI-powered skill suggestions', rationale: 'Recommend skills based on project description' },
  { title: 'Custom archetype builder', rationale: 'Let users create and share their own archetypes' },
];

const parkingLotItems = [
  { date: '2026-03-15', context: 'skill-detail page', desc: 'Showcase widgets could support drag-to-reorder' },
  { date: '2026-03-18', context: 'auth flow', desc: 'Could support SSO via Azure AD for enterprise' },
  { date: '2026-04-01', context: 'ZIP generation', desc: 'Include dependency graph in generated projects' },
];

const bugSeverities = [
  { level: 'P0', label: 'System down, data loss, security', action: 'Drop everything, fix immediately', color: 'var(--color-error)' },
  { level: 'P1', label: 'Major feature broken, no workaround', action: 'Fix before any feature work in Now', color: 'var(--color-error)' },
  { level: 'P2', label: 'Degraded experience, workaround exists', action: 'Schedule in Next', color: 'var(--color-warning)' },
  { level: 'P3', label: 'Cosmetic, minor annoyance', action: 'Add to Later or Parking Lot', color: 'var(--color-text-muted)' },
];

const priorityColors: Record<string, string> = {
  Must: 'var(--color-error)',
  Should: 'var(--color-warning)',
  Could: 'var(--color-success)',
};

const statusColors: Record<string, string> = {
  'in-progress': 'var(--color-primary)',
  pending: 'var(--color-text-muted)',
};

const autoUpdateSteps = [
  { step: 1, label: 'Read roadmap', desc: 'Agent reads ROADMAP.md at session start', phase: 'Start' },
  { step: 2, label: 'Pick next Must item', desc: 'Default: first Must item in Now', phase: 'Start' },
  { step: 3, label: 'Complete work', desc: 'Implement the feature or fix', phase: 'Work' },
  { step: 4, label: 'Check off sub-tasks', desc: 'Mark completed items with date', phase: 'Update' },
  { step: 5, label: 'Move items if needed', desc: 'Move between Now/Next/Later/Completed', phase: 'Update' },
  { step: 6, label: 'Capture discoveries', desc: 'Append to Parking Lot with context', phase: 'Update' },
];

const phaseColors: Record<string, string> = {
  Start: 'var(--color-primary)',
  Work: 'var(--color-secondary)',
  Update: 'var(--color-success)',
};

export function RoadmapShowcase() {
  return (
    <div>
      {/* ---- Intro Banner ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Living roadmap</strong> in the repo as ROADMAP.md. Read by humans and AI agents at session start, updated as part of every completed task. The single source of truth for what is now, next, and later.
        </p>
      </div>

      {/* ---- Now / Next / Later / Parking Lot Visual ---- */}
      <Section title="Now / Next / Later / Parking Lot">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* NOW */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-primary)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'var(--color-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Now (Active)</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Commitments for this iteration</span>
              </div>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--color-surface)' }}>
              {nowItems.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: priorityColors[item.priority], color: '#FFFFFF' }}>{item.priority}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--color-border)' }}>
                      <div style={{ width: `${(item.completed / item.subtasks) * 100}%`, height: '100%', borderRadius: 2, background: statusColors[item.status] }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{item.completed}/{item.subtasks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NEXT */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-secondary)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'var(--color-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Next (Ready)</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Validated, ready to start</span>
              </div>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--color-surface)' }}>
              {nextItems.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: priorityColors[item.priority], color: '#FFFFFF' }}>{item.priority}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{item.rationale}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LATER */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-brand)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'var(--color-brand)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Later (Planned)</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Direction, not commitment</span>
              </div>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--color-surface)' }}>
              {laterItems.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', display: 'block', marginBottom: 4 }}>{item.title}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{item.rationale}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PARKING LOT */}
          <div style={{ borderRadius: 8, border: '2px solid var(--color-text-muted)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Parking Lot</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Captured, not promoted</span>
              </div>
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--color-surface)' }}>
              {parkingLotItems.map((item) => (
                <div
                  key={item.desc}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 6,
                    background: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{item.date}</span>
                    <span style={{ fontSize: 10, color: 'var(--color-primary)', fontWeight: 600 }}>{item.context}</span>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Status Indicators / Bug Severity ---- */}
      <Section title="Bug Severity Levels">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Bugs override by severity. Without severity tags, all bugs look equal. P0/P1 always take priority over feature work.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {bugSeverities.map((b) => (
            <div
              key={b.level}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${b.color}`,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: b.color, minWidth: 32 }}>{b.level}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', flex: 1, minWidth: 200 }}>{b.label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{b.action}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Auto-Update Workflow ---- */}
      <Section title="Auto-Update Workflow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          The roadmap auto-updates as part of every task&apos;s definition of done. The agent reads at session start and writes after completion.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {autoUpdateSteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${phaseColors[s.phase]}`,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: phaseColors[s.phase],
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <code style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-heading)', minWidth: 180 }}>{s.label}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flex: 1 }}>{s.desc}</span>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: phaseColors[s.phase], color: '#FFFFFF', textTransform: 'uppercase' }}>{s.phase}</span>
              {i < autoUpdateSteps.length - 1 && (
                <div style={{ position: 'absolute', left: 33, bottom: -4, width: 2, height: 4, background: 'var(--color-border)' }} />
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- MoSCoW Priority ---- */}
      <Section title="MoSCoW Priority Within Time Horizons">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { label: 'Must', desc: 'Default work target. Agent picks Must items from Now when no instruction given.', color: 'var(--color-error)' },
            { label: 'Should', desc: 'Important but can be deferred if Must items need attention.', color: 'var(--color-warning)' },
            { label: 'Could', desc: 'Nice-to-have. Only if Must and Should are done.', color: 'var(--color-success)' },
          ].map((p) => (
            <div
              key={p.label}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${p.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700, color: p.color, marginBottom: 8 }}>{p.label}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

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

const pyramidLevels = [
  { level: 'E2E', tool: 'Playwright', count: 'Few', color: 'var(--color-error)', width: '40%', what: 'Full user flows, async server components' },
  { level: 'Component', tool: 'Vitest + RTL', count: 'Some', color: 'var(--color-warning)', width: '60%', what: 'Renders, interactions, state changes' },
  { level: 'Integration', tool: 'Vitest + DB', count: 'Many', color: 'var(--color-primary)', width: '80%', what: 'CRUD, permissions, orchestration' },
  { level: 'Unit', tool: 'Vitest', count: 'Most', color: 'var(--color-success)', width: '100%', what: 'Domain objects, pure logic, mappers' },
];

const isolationTiers = [
  { tier: 'Base data', scope: 'Suite-wide', lifecycle: 'Cleaned + recreated on startup', example: 'Users, roles, dimension lookup tables', color: 'var(--color-primary)' },
  { tier: 'File-level data', scope: 'All tests in file', lifecycle: 'beforeAll / afterAll', example: 'Shared content record for file', color: 'var(--color-secondary)' },
  { tier: 'Test-level data', scope: 'Single test', lifecycle: 'Created during test, afterEach rollback', example: 'Test-specific mutations', color: 'var(--color-brand)' },
];

const hardeningChecklist = [
  { check: 'Existing test scan completed', status: 'required' },
  { check: 'Gherkin scenarios in describe/it labels', status: 'required' },
  { check: 'Tests committed failing before implementation', status: 'required' },
  { check: 'No it.skip, test.todo, or commented-out tests', status: 'required' },
  { check: 'Data isolation: no test depends on another', status: 'required' },
  { check: 'Integration: transaction rollback per test', status: 'required' },
  { check: 'E2E: per-worker database with 3-tier lifecycle', status: 'required' },
  { check: 'Factory-based test data (Fishery + Faker)', status: 'required' },
  { check: 'Full suite passes with 0 failures', status: 'gate' },
];

export function FlowTddShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Opinion companion for flow.</strong> Tests ARE the specification — written before implementation, committed failing.
          Hooks into PLANNING (scan + write scenarios), IMPLEMENTATION (run targeted tests), and POST-DELIVERY (full suite hardening).
        </p>
      </div>

      {/* ---- Testing Pyramid ---- */}
      <Section title="Testing Pyramid">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          {pyramidLevels.map((l) => (
            <div
              key={l.level}
              style={{
                width: l.width,
                padding: '14px 20px',
                borderRadius: 8,
                background: l.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{l.level}</span>
                <span style={{ fontSize: 12, color: 'var(--color-bg-surface)', opacity: 0.8 }}>{l.tool}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--color-bg-surface)', opacity: 0.7 }}>{l.what}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-bg-surface)', background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4 }}>{l.count}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Gherkin Scenario Format ---- */}
      <Section title="Gherkin Scenario Format">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Integration and E2E tests use the full Gherkin vocabulary as describe/it labels. Unit tests for pure functions use standard describe/test.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(140px, 100%), 1fr))', gap: 8, marginBottom: 16 }}>
          {[
            { keyword: 'Given', purpose: 'Preconditions', color: 'var(--color-primary)' },
            { keyword: 'When', purpose: 'Action', color: 'var(--color-secondary)' },
            { keyword: 'Then', purpose: 'Assertion', color: 'var(--color-success)' },
            { keyword: 'And', purpose: 'Continuation', color: 'var(--color-text-muted)' },
            { keyword: 'But', purpose: 'Negative assertion', color: 'var(--color-warning)' },
            { keyword: 'Background', purpose: 'Shared Given', color: 'var(--color-brand)' },
            { keyword: 'Scenario Outline', purpose: 'Parameterised', color: 'var(--color-primary)' },
            { keyword: 'Rule', purpose: 'Business grouping', color: 'var(--color-error)' },
          ].map((k) => (
            <div
              key={k.keyword}
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `3px solid ${k.color}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: k.color }}>{k.keyword}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{k.purpose}</div>
            </div>
          ))}
        </div>
        <CodeBlock>{`describe('Rule: Only marketing and admin can create personas', () => {
  describe('Scenario: Marketing user creates a persona', () => {
    it('Given a user with marketing role', async () => { /* ... */ });
    it('When they submit a valid persona', async () => { /* ... */ });
    it('Then the persona is created', async () => { /* ... */ });
    it('And the audit log records the creation', async () => { /* ... */ });
  });

  describe('Scenario Outline: Role-based access', () => {
    const examples = [
      { role: 'admin', level: 100, canCreate: true },
      { role: 'sales', level: 40, canCreate: false },
    ];
    for (const { role, canCreate } of examples) {
      describe(\`Example: \${role}\`, () => {
        it(\`Given a user with \${role} role\`, async () => { /* ... */ });
        it(\`Then creation \${canCreate ? 'succeeds' : 'is denied'}\`, () => {});
      });
    }
  });
});`}</CodeBlock>
      </Section>

      {/* ---- Data Isolation Tiers ---- */}
      <Section title="3-Tier Data Isolation">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Every test runs independently. No shared mutable state. No execution order dependency.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isolationTiers.map((t) => (
            <div
              key={t.tier}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${t.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: t.color }}>{t.tier}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.scope}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 4 }}>{t.lifecycle}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Example: {t.example}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { label: 'Unit', method: 'Factory-generated (Fishery + Faker)' },
              { label: 'Integration', method: 'Transaction + savepoints' },
              { label: 'E2E', method: 'Per-worker DB + timestamp rollback' },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{m.method}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- What to Test Where ---- */}
      <Section title="What to Test Where">
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 1fr', background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)', padding: '10px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Code Type</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Level</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Tool</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>What to Assert</span>
          </div>
          {[
            { code: 'Domain objects', level: 'Unit', tool: 'Vitest', assertion: 'Invariants, state transitions' },
            { code: 'Pure logic', level: 'Unit', tool: 'Vitest', assertion: 'Input/output, edge cases' },
            { code: 'Repositories', level: 'Integration', tool: 'Vitest + DB', assertion: 'CRUD, soft delete, audit' },
            { code: 'Server Actions', level: 'Integration', tool: 'Vitest + DB', assertion: 'Permissions, validation' },
            { code: 'Widgets', level: 'Component', tool: 'RTL + MSW', assertion: 'Loading/error/empty states' },
            { code: 'Full user flows', level: 'E2E', tool: 'Playwright', assertion: 'Navigation, forms, auth' },
          ].map((row, i) => (
            <div
              key={row.code}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 100px 1fr',
                padding: '8px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{row.code}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.level}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.tool}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.assertion}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Hardening Gate ---- */}
      <Section title="Hardening Gate Checklist">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          After all scenarios pass individually, run the full test suite. Fix regressions. Iterate until 0 failures.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {hardeningChecklist.map((item) => (
            <div
              key={item.check}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${item.status === 'gate' ? 'var(--color-error)' : 'var(--color-primary)'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 3,
                    border: '2px solid var(--color-border)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{item.check}</span>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: item.status === 'gate' ? 'var(--color-error)' : 'var(--color-primary)',
                  color: 'var(--color-bg-surface)',
                  textTransform: 'uppercase',
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Testing Stack ---- */}
      <Section title="Testing Stack">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { tool: 'Vitest', purpose: 'Unit + Integration', color: 'var(--color-success)' },
            { tool: 'Playwright', purpose: 'E2E', color: 'var(--color-primary)' },
            { tool: 'MSW v2', purpose: 'API mocking', color: 'var(--color-secondary)' },
            { tool: 'Fishery', purpose: 'Test data factories', color: 'var(--color-warning)' },
            { tool: 'React Testing Library', purpose: 'Component tests', color: 'var(--color-brand)' },
            { tool: 'TypeScript strict', purpose: 'Static analysis', color: 'var(--color-text-muted)' },
          ].map((t) => (
            <div
              key={t.tool}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `3px solid ${t.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{t.tool}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.purpose}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

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

const tiers = [
  {
    tier: 'Hot',
    file: 'CLAUDE.md',
    loaded: 'Always (survives compaction)',
    limit: '<200 lines',
    contents: 'Conventions, triggers, pointers to warm/cold',
    color: 'var(--color-error)',
  },
  {
    tier: 'Warm',
    file: 'PROJECT_REFERENCE.md',
    loaded: 'On demand',
    limit: '300-600 lines',
    contents: 'Feature map, decisions, constraints, data flows',
    color: 'var(--color-warning)',
  },
  {
    tier: 'Cold',
    file: 'Individual docs, ADRs',
    loaded: 'When relevant',
    limit: 'No limit',
    contents: 'Full ADRs, API specs, migration history',
    color: 'var(--color-primary)',
  },
];

const featureMapColumns = [
  { column: 'Feature', purpose: 'Name (matches folder or route)' },
  { column: 'Status', purpose: 'built / partial / planned / removed' },
  { column: 'Key Files', purpose: '2-4 most important file paths' },
  { column: 'Dependencies', purpose: 'Other features or services' },
  { column: 'Constraints', purpose: 'Non-obvious rules to never violate' },
];

export function FlowProjectReferenceShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Opinion companion for flow.</strong> A living project reference document for context persistence.
          Record what the code cannot tell you: why decisions were made, what was rejected, which constraints are non-obvious.
        </p>
      </div>

      {/* ---- Three-Tier Model ---- */}
      <Section title="Three-Tier Memory Model">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Only the hot tier survives compaction. It must contain enough context to tell the agent where to look for everything else.
          Research: ETH Zurich (Feb 2026) found human-written context improves task success ~4%, while LLM-generated context reduces it ~3%.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {tiers.map((t, i) => (
            <div key={t.tier}>
              <div
                style={{
                  padding: '20px 24px',
                  background: t.color,
                  borderRadius: i === 0 ? '8px 8px 0 0' : i === tiers.length - 1 ? '0 0 8px 8px' : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-bg-surface)', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.tier}</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{t.file}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-bg-surface)', opacity: 0.8 }}>{t.limit}</span>
              </div>
              <div
                style={{
                  padding: '12px 24px',
                  background: 'var(--color-surface)',
                  borderLeft: `3px solid ${t.color}`,
                  borderRight: '1px solid var(--color-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t.contents}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{t.loaded}</span>
              </div>
              {i < tiers.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                  <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>&#x25BC;</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Feature Map Structure ---- */}
      <Section title="Feature Map Structure">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          The feature map is the backbone of the reference. Every feature gets a table entry. It is the first thing checked before any change.
        </p>
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)', padding: '10px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Column</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Purpose</span>
          </div>
          {featureMapColumns.map((c, i) => (
            <div
              key={c.column}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                padding: '8px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{c.column}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{c.purpose}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <CodeBlock>{`## Feature Map
| Feature       | Status  | Key Files              | Dependencies     | Constraints            |
|---------------|---------|------------------------|------------------|------------------------|
| Auth          | built   | middleware.ts, auth/   | Jose, Mailgun    | Domain-restricted      |
| Skill Library | built   | skill-library/         | DB (skills)      | Slug uniqueness        |
| AI Chat       | partial | ai-chat/               | Anthropic SDK    | Rate limit: 10 req/min |`}</CodeBlock>
        </div>
      </Section>

      {/* ---- Decision Log Format ---- */}
      <Section title="Decision Log Format">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Decisions are real choices with rejected alternatives and reasons. Full ADRs (cold tier) only for strategic decisions affecting multiple features.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Good Decision Format</h4>
            <CodeBlock>{`| Topic | Decision | Why | Date |
|-------|----------|-----|------|
| Auth  | Custom OTP over | Auth.js adds |
|       | Auth.js         | 40KB client  |
|       |                 | bundle, no   |
|       |                 | edge support |
|       |                 | 2026-01-15   |`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bad Decision Format</h4>
            <CodeBlock>{`| Topic | Decision |
|-------|----------|
| Auth  | We use custom OTP |

-- No rejected alternative
-- No reason given
-- No date
-- Not a real decision`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- What to Record ---- */}
      <Section title="What to Record (and What NOT to Record)">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '2px solid var(--color-success)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Record</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Why decisions were made',
                'What was rejected and why',
                'Non-obvious constraints',
                'Bugs with non-obvious root causes',
                'Scope boundaries (does/does not cover)',
                'External service failure modes',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-success)' }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '2px solid var(--color-error)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-error)', marginBottom: 8 }}>Do NOT Record</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'What the code already shows',
                'Git history (when things happened)',
                'File structure (visible in repo)',
                'Function signatures (in code)',
                'Implementation details',
                'Things that change every commit',
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

      {/* ---- Do Not Break Section ---- */}
      <Section title="&quot;Do Not Break&quot; Section">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Non-obvious constraints that would cause silent regressions if violated. These are the things new agents or team members would not know from reading the code.
        </p>
        <CodeBlock>{`## Do Not Break
- Middleware must exclude /login and /api/auth
  from auth checks (redirect loop)
- Skill slugs are used in URLs -- changing a
  slug breaks bookmarks
- Theme CSS vars must be defined for both
  light and night themes
- FIX comments at bug sites explain symptom,
  root cause, and why old code was wrong`}</CodeBlock>
      </Section>
    </div>
  );
}

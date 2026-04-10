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

const researchTypes = [
  {
    type: 'A',
    name: 'Documentation Lookup',
    when: 'Version-specific APIs, evolving frameworks, contradicting information',
    rules: ['Decide: look up or answer from knowledge', 'Check changelogs for version-sensitive questions', 'Source hierarchy: official docs > changelog > GitHub > blog > training > community', 'Synthesise for user context, never paste raw docs'],
    color: 'var(--color-primary)',
  },
  {
    type: 'B',
    name: 'Technology Comparison',
    when: 'Choosing between libraries, services, models, or approaches',
    rules: ['Three-option minimum for non-trivial decisions', 'Steel-man the alternative before recommending', 'Structured comparison table with real pricing', 'Include cost, key strength, key weakness, source'],
    color: 'var(--color-secondary)',
  },
  {
    type: 'C',
    name: 'Bug Investigation',
    when: 'Errors, unexpected behavior, known problems with tools',
    rules: ['Search exact error message first', 'Check open AND closed GitHub issues', 'Reproduce -> search -> scientific debug -> 5 Whys', 'Report findings with links to issues'],
    color: 'var(--color-warning)',
  },
  {
    type: 'D',
    name: 'Pattern Research',
    when: 'Solving a class of problem that others have solved before',
    rules: ['Frame as a problem class, not a specific fix', 'Evaluate patterns against project constraints', 'Present as actionable recommendations', 'CRAAP-test aggressively -- patterns age fast'],
    color: 'var(--color-success)',
  },
];

const craapDimensions = [
  { letter: 'C', name: 'Currency', question: 'When was it published? Is it current for the version you use?' },
  { letter: 'R', name: 'Relevance', question: 'Does it address your specific question, not a related one?' },
  { letter: 'A', name: 'Authority', question: 'Who wrote it? Official maintainer, expert, or random blog?' },
  { letter: 'A', name: 'Accuracy', question: 'Is it supported by evidence, code, or reproducible examples?' },
  { letter: 'P', name: 'Purpose', question: 'Is it informative or promotional? Selling you something?' },
];

export function FlowResearchShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Research methodology for evidence-based decisions.</strong> Referenced by flow-planning for the research phase.
          Can also be used standalone when the team wants evidence-based decisions.
        </p>
      </div>

      {/* ---- Four Research Types ---- */}
      <Section title="Four Research Types">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {researchTypes.map((rt) => (
            <div
              key={rt.type}
              style={{
                borderRadius: 8,
                border: `2px solid ${rt.color}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  background: rt.color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-bg-surface)', opacity: 0.5 }}>{rt.type}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{rt.name}</span>
              </div>
              <div style={{ padding: 16, background: 'var(--color-surface)' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12, fontStyle: 'italic' }}>{rt.when}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rt.rules.map((r) => (
                    <div key={r} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: rt.color, flexShrink: 0, marginTop: 5 }} />
                      <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- CRAAP Framework ---- */}
      <Section title="CRAAP Framework">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Every source must pass the CRAAP test. This is a universal rule across all research types.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {craapDimensions.map((d, i) => (
            <div
              key={`${d.letter}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                borderRadius: 6,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-bg-surface)' }}>{d.letter}</span>
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{d.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{d.question}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Two-Source Rule ---- */}
      <Section title="Two-Source Rule">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-success)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>2+</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>Sources Required</div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
              Never act on a single source for decisions that are hard to reverse. Corroborate across at least two independent sources.
            </p>
          </div>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-warning)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--color-warning)', marginBottom: 8 }}>3</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>Failed Lookups = Uncertainty</div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
              After three search attempts without answers, state uncertainty explicitly. Never fabricate confidence.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Good vs Bad Research Output ---- */}
      <Section title="Research Output: Good vs Bad">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Synthesised for Context</h4>
            <CodeBlock>{`Next.js 15 changed params to a Promise
in page components.

Your code: const { slug } = params;
Fix: const { slug } = await params;

Source: [Next.js 15 Migration Guide]
(nextjs.org/docs/.../version-15)`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Raw Docs Paste</h4>
            <CodeBlock>{`"In Next.js 15, the params prop
is now a Promise. You need to
await it..."

[500 lines of migration guide
pasted without context]`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Source Hierarchy ---- */}
      <Section title="Source Hierarchy">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { rank: 1, source: 'Official documentation', reliability: 'Highest', color: 'var(--color-success)' },
            { rank: 2, source: 'Changelog / migration guide', reliability: 'High', color: 'var(--color-success)' },
            { rank: 3, source: 'GitHub repo (source code)', reliability: 'High', color: 'var(--color-primary)' },
            { rank: 4, source: 'Official blog', reliability: 'Good', color: 'var(--color-primary)' },
            { rank: 5, source: 'AI training knowledge', reliability: 'Moderate (may be stale)', color: 'var(--color-warning)' },
            { rank: 6, source: 'Community content', reliability: 'Variable', color: 'var(--color-error)' },
          ].map((s) => (
            <div
              key={s.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${s.color}`,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: s.color, minWidth: 24 }}>{s.rank}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', flex: 1 }}>{s.source}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.reliability}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

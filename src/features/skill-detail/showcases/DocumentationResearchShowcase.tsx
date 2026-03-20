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

const sourceHierarchy = [
  { rank: 1, name: 'Official Documentation', desc: 'Docs site, API reference — the canonical source', width: '40%', color: 'var(--color-primary)' },
  { rank: 2, name: 'Official Changelog / Migration Guide', desc: 'Explains what changed and why', width: '50%', color: 'var(--color-secondary)' },
  { rank: 3, name: 'GitHub Repository', desc: 'README, source code, issues — ground truth for behaviour', width: '60%', color: 'var(--color-brand)' },
  { rank: 4, name: 'Official Blog Posts', desc: 'Context for changes, announcements from maintainers', width: '70%', color: 'var(--color-warning)' },
  { rank: 5, name: 'Training Knowledge', desc: 'Useful for stable concepts, risky for evolving APIs', width: '80%', color: 'var(--color-text-muted)' },
  { rank: 6, name: 'Community Content', desc: 'Stack Overflow, tutorials — may be outdated, verify against official', width: '90%', color: 'var(--color-error)' },
];

const lookupDecisions = [
  { situation: 'Stable API, unchanged for years', examples: 'Array.map, CSS Grid, JSON.parse', action: 'Answer from knowledge', color: 'var(--color-success)' },
  { situation: 'Core library concept', examples: 'React hooks rules, async/await semantics', action: 'Answer from knowledge, note version', color: 'var(--color-success)' },
  { situation: 'Specific API that may have changed', examples: 'Next.js 16 config, Drizzle schema API', action: 'Look up current docs', color: 'var(--color-warning)' },
  { situation: 'New or recently released feature', examples: 'Just announced at a conference', action: 'Always look up', color: 'var(--color-error)' },
  { situation: 'User reports contradicting behaviour', examples: '"The docs say X but I see Y"', action: 'Look up — API probably changed', color: 'var(--color-error)' },
  { situation: 'Version-specific question', examples: '"How does X work in v4?"', action: 'Look up specific version docs', color: 'var(--color-warning)' },
  { situation: 'Debugging with a recent library', examples: '"It doesn\'t work after upgrade"', action: 'Check changelog for breaking changes', color: 'var(--color-error)' },
];

const refinementStrategies = [
  { problem: 'Too broad, returned generic overview', strategy: 'Narrow to specific API method or config option' },
  { problem: 'Wrong version docs returned', strategy: 'Specify version in query, use version-specific library ID' },
  { problem: 'Feature not in docs (too new)', strategy: 'Check GitHub issues, PRs, or source code directly' },
  { problem: 'Docs describe API but not use case', strategy: 'Look for examples, tutorials, or Guides section' },
  { problem: 'Conflicting information', strategy: 'Trust source hierarchy; check changelog for changes' },
  { problem: 'Feature deprecated or removed', strategy: 'Check migration guide for recommended replacement' },
];

export function DocumentationResearchShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Use alongside{' '}
          <strong>strategic-context</strong> (persist what you learn from docs across context boundaries) and{' '}
          <strong>security-review</strong> (never send secrets in documentation queries). Applies to any task where current documentation matters more than training knowledge.
        </p>
      </div>

      {/* ---- Source Hierarchy Pyramid ---- */}
      <Section title="Source Hierarchy (Most to Least Trusted)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          When sources conflict, trust in this order. Official documentation wins over everything else.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            padding: 24,
            borderRadius: 8,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          {sourceHierarchy.map((s) => (
            <div
              key={s.rank}
              style={{
                width: s.width,
                padding: '12px 16px',
                borderRadius: 6,
                background: 'var(--color-bg-alt)',
                borderLeft: `4px solid ${s.color}`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: s.color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.rank}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Lookup Decision Tree ---- */}
      <Section title="Look Up or Answer from Knowledge?">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Not every question needs a docs lookup. The decision depends on API stability and version sensitivity.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lookupDecisions.map((d) => (
            <div
              key={d.situation}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 200px',
                gap: 16,
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)' }}>{d.situation}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{d.examples}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: d.color,
                  padding: '4px 10px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  textAlign: 'center',
                }}
              >
                {d.action}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Lookup Workflow ---- */}
      <Section title="The Lookup Workflow">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { step: 1, label: 'Understand the goal', desc: 'Not just the literal question — what are they trying to accomplish?' },
            { step: 2, label: 'Decide: knowledge or docs?', desc: 'Stable API? Answer. Evolving API? Look up.' },
            { step: 3, label: 'Identify library + specific question', desc: 'Narrow to the exact API or config option' },
            { step: 4, label: 'Resolve documentation source', desc: 'Context7, official docs site, or GitHub' },
            { step: 5, label: 'Query with precision', desc: 'User\'s specific question, not a generic topic' },
            { step: 6, label: 'Found? Synthesise. Not found? Refine.', desc: 'Adapt for their context or try a different source' },
            { step: 7, label: 'Deliver with adapted examples', desc: 'Match their project conventions, note gotchas' },
          ].map((s, i) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 6,
                  background: i === 5 ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                  border: i === 5 ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.label}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)', marginLeft: 8 }}>{s.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Version-Sensitive Checklist ---- */}
      <Section title="Version Awareness Checklist">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Libraries change. The version matters. Always check compatibility before suggesting patterns.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[
            { check: 'User mentions version? Target that version specifically.', icon: 'V' },
            { check: 'No version mentioned? Check their package.json.', icon: 'P' },
            { check: 'Docs pattern differs from their code? Check version diff first.', icon: 'D' },
            { check: 'Flag breaking changes between versions explicitly.', icon: '!' },
            { check: 'Check changelog before suggesting migration steps.', icon: 'C' },
            { check: 'Look for: CHANGELOG.md, migration guides, release notes.', icon: 'M' },
          ].map((item) => (
            <div
              key={item.check}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '12px 14px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: 'var(--color-secondary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{item.check}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Refinement Strategies ---- */}
      <Section title="When the First Lookup Fails">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {refinementStrategies.map((r) => (
            <div
              key={r.problem}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Problem</div>
                <span style={{ fontSize: 13, color: 'var(--color-text-heading)' }}>{r.problem}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Refinement</div>
                <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{r.strategy}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Synthesise, Don't Paste ---- */}
      <Section title="Synthesise for Context">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Raw docs answer a generic question. Your job is to bridge the gap between docs and the user&apos;s specific situation.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Raw Docs Dump</h4>
            <CodeBlock>{`"The middleware function accepts a
NextRequest and returns a NextResponse.
You can use the matcher config to filter
routes. See the API reference for details."

// Generic, not helpful for their context`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Synthesised Answer</h4>
            <CodeBlock>{`"Since you're using App Router with email
OTP auth, the middleware should:
1. Check for auth-token cookie
2. Verify JWT with jose (Edge-compatible)
3. Use matcher to exclude /login and
   /api/auth routes
4. Note: Can't use Node crypto in Edge
   — that's why we use jose, not jsonwebtoken"`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Honest Uncertainty ---- */}
      <Section title="Stating Uncertainty">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          If the answer is not clear after 3 lookup attempts, say so. Honest uncertainty is more useful than a confident wrong answer.
        </p>
        <CodeBlock>{`I found the general pattern in the Next.js docs, but the specific
behaviour for edge middleware with streaming responses isn't
documented clearly. Based on what I found, here's my best
understanding: [answer].

I'd recommend checking the Next.js GitHub discussions for edge cases.

// Max 3 lookup attempts, then state what's uncertain.`}</CodeBlock>
      </Section>

      {/* ---- Security Note ---- */}
      <Section title="Security: Sanitise Queries">
        <div
          style={{
            padding: 16,
            borderRadius: 8,
            background: 'var(--color-surface)',
            border: '2px solid var(--color-error)',
          }}
        >
          <p style={{ fontSize: 14, color: 'var(--color-text-heading)', margin: 0, marginBottom: 8, fontWeight: 600 }}>
            Never send secrets in documentation queries
          </p>
          <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.6 }}>
            When querying external documentation services (Context7, MCP tools), sanitise the query first. Remove API keys, tokens, passwords, connection strings, and any sensitive values from the user&apos;s question before sending it to external services.
          </p>
        </div>
      </Section>
    </div>
  );
}

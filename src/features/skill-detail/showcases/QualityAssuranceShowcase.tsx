'use client';

import { CodeBlock } from '@/platform/components/CodeBlock';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function QualityAssuranceShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          marginBottom: 48,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>Companion Skills: </span>
        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          verification-loop (mechanical checks) &bull; testing-strategy (what to test where) &bull; playwright-e2e (E2E patterns)
        </span>
      </div>

      {/* ---- Five Quality Dimensions ---- */}
      <Section title="Five Quality Dimensions">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          Quality is not one thing. It is several dimensions that users evaluate simultaneously, mostly below conscious
          awareness. Not all dimensions carry equal weight.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              name: 'Trust & Safety',
              type: 'CONSTRAINT',
              color: 'var(--color-error)',
              desc: 'The ambient condition that permits engagement. A user who doesn\'t trust the product cannot experience its effectiveness.',
              sub: 'Data loss · Financial harm · Privacy · Irreversible actions · Looking incompetent',
            },
            {
              name: 'Effectiveness',
              type: 'OBJECTIVE',
              color: 'var(--color-primary)',
              desc: 'Does the product actually help the user accomplish their job? Task completion, outcome quality, efficiency, cognitive load.',
              sub: 'The pit of success: easy to do right, annoying to do wrong',
            },
            {
              name: 'Reliability',
              type: 'EXPECTATION',
              color: 'var(--color-info)',
              desc: 'Users don\'t think about reliability until it fails. Then it\'s the only thing they think about.',
              sub: 'Consistency · Availability · Durability · Recoverability',
            },
            {
              name: 'Emotional Quality',
              type: 'DIFFERENTIATOR',
              color: 'var(--color-warning)',
              desc: 'Quality is not just functional. The emotional states a product induces directly affect adoption and persistence.',
              sub: 'Confidence · Respect · Delight · Empowerment · Absence of anxiety',
            },
            {
              name: 'Craft',
              type: 'SIGNAL',
              color: 'var(--color-secondary)',
              desc: 'Small imperfections signal the creator did not care. If they didn\'t care about visible details, what about invisible ones?',
              sub: 'Visual consistency · Interaction feel · Edge cases · The invisible parts',
            },
          ].map((dim, i) => (
            <div
              key={dim.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                gap: 20,
                padding: 20,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: dim.color,
                      opacity: 0.15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>{dim.name}</span>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 1.5,
                    color: dim.color,
                    padding: '2px 8px',
                    borderRadius: 4,
                    border: `1px solid ${dim.color}`,
                  }}
                >
                  {dim.type}
                </span>
              </div>
              <div>
                <p style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.6, margin: '0 0 8px 0' }}>{dim.desc}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>{dim.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Trust Asymmetry ---- */}
      <Section title="The Trust Asymmetry">
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '24px 0', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1,
              minWidth: 200,
              padding: 24,
              borderRadius: 8,
              background: 'var(--color-success)',
              opacity: 0.1,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--color-text-heading)' }}>5-10</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>positive experiences needed</div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)' }}>to offset</div>
          <div
            style={{
              flex: 1,
              minWidth: 200,
              padding: 24,
              borderRadius: 8,
              background: 'var(--color-error)',
              opacity: 0.1,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 700, color: 'var(--color-text-heading)' }}>1</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>negative experience</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
          Some violations (data loss, security breach) are unrecoverable. Trust is a constraint, not an objective.
        </p>
      </Section>

      {/* ---- Top-Down vs Bottom-Up ---- */}
      <Section title="Quality Flows Bidirectionally">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          Neither direction is sufficient alone. Beautiful code that produces a confusing UI is not quality.
          A polished UI over fragile code is not quality. Quality is the full chain, both directions, sustained over time.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 0, alignItems: 'stretch' }}>
          {/* Top-down */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Top-Down</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                'User has a job to do',
                'UI makes the job obvious',
                'Interactions feel responsive',
                'Errors handled gracefully',
                'Edge cases covered',
                'Architecture enables reliability',
                'Code is maintainable',
              ].map((step, i) => (
                <div key={step}>
                  <div
                    style={{
                      padding: '10px 16px',
                      background: 'var(--color-primary)',
                      opacity: 0.08 + i * 0.03,
                      borderRadius: 6,
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--color-text-heading)', fontWeight: 500 }}>{step}</span>
                  </div>
                  {i < 6 && (
                    <div style={{ textAlign: 'center', color: 'var(--color-primary)', fontSize: 16, lineHeight: '20px' }}>&darr;</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Center divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 1, height: '100%', background: 'var(--color-border)' }} />
          </div>

          {/* Bottom-up */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-secondary)', textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>Bottom-Up</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                'Code quality (pure, typed, clean)',
                'Architecture (clear boundaries)',
                'Consistent behaviour',
                'Fast rendering',
                'Easy iteration',
                'UI quality (trust, delight)',
                'Experience quality',
              ].map((step, i) => (
                <div key={step}>
                  <div
                    style={{
                      padding: '10px 16px',
                      background: 'var(--color-secondary)',
                      opacity: 0.08 + (6 - i) * 0.03,
                      borderRadius: 6,
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--color-text-heading)', fontWeight: 500 }}>{step}</span>
                  </div>
                  {i < 6 && (
                    <div style={{ textAlign: 'center', color: 'var(--color-secondary)', fontSize: 16, lineHeight: '20px' }}>&uarr;</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Core Rules ---- */}
      <Section title="Core Rules">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { num: '1', title: 'Trust is a constraint, effectiveness is the objective', desc: 'No delight compensates for data loss. Meet the floor on hygiene dimensions, then invest in effectiveness.' },
            { num: '2', title: 'Build quality in, don\'t inspect it in', desc: 'Types prevent type errors. Linting prevents inconsistencies. Architecture prevents structural defects. Testing catches what prevention misses.' },
            { num: '3', title: 'Quality flows bidirectionally', desc: 'Top-down from user experience, bottom-up from code quality. Neither direction is sufficient alone.' },
            { num: '4', title: 'Test behaviours, not implementations', desc: 'Test what the system does (input/output), not how (internal calls). Implementation tests break on refactor.' },
            { num: '5', title: 'Quality is continuous, not a phase', desc: 'Present or absent in every decision — every name chosen, every error handled, every edge case considered.' },
            { num: '6', title: 'Know when to stop testing', desc: '0-60% coverage = enormous value. 95-100% coverage = often negative value. The right level depends on defect cost.' },
          ].map((rule) => (
            <div
              key={rule.num}
              style={{
                padding: 20,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    opacity: 0.15,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>{rule.num}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{rule.title}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{rule.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Thinkers ---- */}
      <Section title="Quality Thinkers">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { name: 'Pirsig', quote: 'Quality is recognised before articulated. Deep expertise internalised below conscious articulation.' },
            { name: 'Weinberg', quote: '"Quality is value to some person." Always relative to a person and context.' },
            { name: 'Deming', quote: '"Quality comes from improvement of the process." Not from inspection after the fact.' },
            { name: 'Crosby', quote: '"Quality is conformance to requirements." The cost of quality is always less than the cost of defects.' },
            { name: 'Monozukuri', quote: 'A craftsman finishes the back of the cabinet — not because anyone sees it, but because completeness demands it.' },
            { name: 'Kent Beck', quote: 'TDD\'s real purpose: giving developers confidence to change code. Without tests, quality inevitably degrades.' },
          ].map((t) => (
            <div
              key={t.name}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>{t.name}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>{t.quote}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- The Testing Trophy ---- */}
      <Section title="The Testing Trophy Model">
        <CodeBlock language="text" title="Testing trophy model">{`     /   E2E    \\      ← Few — critical paths only
    / Integration\\     ← Most — real interactions between components
   /    Unit      \\    ← Some — complex pure logic
   |   Static     |    ← Always — TypeScript, ESLint`}</CodeBlock>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
          {[
            { level: 'Static Analysis', desc: 'Always on. Catches easy bugs so humans focus on hard ones.', effort: 'Zero runtime cost' },
            { level: 'Unit Tests', desc: 'For complex business logic with multiple paths. Not for trivial code.', effort: 'Pure functions only' },
            { level: 'Integration Tests', desc: 'Highest confidence-per-test. Exercise real component interactions.', effort: 'Most testing effort' },
            { level: 'E2E Tests', desc: 'Critical user paths. Catch bugs no other level catches.', effort: 'Expensive but essential' },
          ].map((l) => (
            <div key={l.level} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{l.level}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 6px 0', lineHeight: 1.5 }}>{l.desc}</p>
              <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-primary)' }}>{l.effort}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Checklist ---- */}
      <Section title="Quality Gate Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Trust',
              color: 'var(--color-error)',
              items: ['No data can be lost, even during errors', 'Destructive actions are reversible or confirmed', 'System state is always visible'],
            },
            {
              category: 'Effectiveness',
              color: 'var(--color-primary)',
              items: ['User can accomplish their actual job', 'Defaults are correct for the common case', 'Edge cases handled visibly, not silently'],
            },
            {
              category: 'Reliability',
              color: 'var(--color-info)',
              items: ['Same input = same output, every time', 'Performance doesn\'t degrade with data growth', 'Recovery from failure is automatic or guided'],
            },
            {
              category: 'Code Quality',
              color: 'var(--color-secondary)',
              items: ['Strict types — no any', 'Business logic in pure functions', 'Tests check behaviours, not implementations', 'Verification loop passed'],
            },
          ].map((cat) => (
            <div key={cat.category}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: cat.color, opacity: 0.6 }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{cat.category}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cat.items.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        border: '2px solid var(--color-border)',
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Banned Patterns ---- */}
      <Section title="Banned Patterns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            '"QA will catch it" — quality is everyone\'s responsibility',
            'Testing as the sole quality strategy — build quality into the process',
            'Testing implementation details — test behaviours',
            '100% coverage as a goal — confidence is the goal',
            'Skipping verification under deadline pressure — defects in production always cost more',
            'Delight investment before trust is solid — trust first, then effectiveness, then delight',
            'Silent failures (empty catch blocks) — every failure must be visible and recoverable',
            'Treating quality as a phase at the end — quality is continuous',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0' }}>
              <span style={{ color: 'var(--color-error)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>&times;</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

'use client';

import { CodeBlock } from '@/platform/components/CodeBlock';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function VerificationLoopShowcase() {
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
          quality-assurance (quality philosophy) &bull; testing-strategy (what to test where) &bull; playwright-e2e (E2E patterns)
        </span>
      </div>

      {/* ---- Quick Check vs Full Review ---- */}
      <Section title="Quick Check vs Full Review">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          Not every verification needs a full review. Match the verification depth to the moment.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Quick Check */}
          <div
            style={{
              padding: 24,
              borderRadius: 8,
              border: '2px solid var(--color-info)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--color-info)',
                  opacity: 0.15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>&#9889;</span>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>Quick Check</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>~30 seconds &bull; After each change</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Does the project still build?',
                'Does the change do what was intended?',
                'No unintended modifications to other files?',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-info)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Review */}
          <div
            style={{
              padding: 24,
              borderRadius: 8,
              border: '2px solid var(--color-primary)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  opacity: 0.15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>&#128269;</span>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>Full Review</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>~5 minutes &bull; Before commit / PR</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'All 5 phases, in severity order',
                'Skill quality gates checked',
                'Human review of the full diff',
                'Structured verification report',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Verification Pipeline Stages ---- */}
      <Section title="Verification Pipeline — 5 Phases">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          Run in this order. Stop and fix if any phase fails before continuing to the next. Fail fast — if the build
          is broken, nothing else matters.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            {
              phase: '1. Build',
              cmd: 'npm run build',
              catches: 'Missing imports, syntax errors, configuration issues, dependency problems',
              color: 'var(--color-error)',
              severity: 'CRITICAL',
            },
            {
              phase: '2. Type Check',
              cmd: 'npx tsc --noEmit',
              catches: 'Wrong argument types, missing properties, null safety violations, interface mismatches',
              color: 'var(--color-warning)',
              severity: 'HIGH',
            },
            {
              phase: '3. Lint',
              cmd: 'npm run lint',
              catches: 'Unused imports, unused variables, formatting violations, code quality issues',
              color: 'var(--color-info)',
              severity: 'MEDIUM',
            },
            {
              phase: '4. Tests',
              cmd: 'npm run test',
              catches: 'Regressions, broken behaviour, missing coverage for new functionality',
              color: 'var(--color-secondary)',
              severity: 'HIGH',
            },
            {
              phase: '5. Diff Review',
              cmd: 'git diff --cached',
              catches: 'Unintended changes, AI scope expansion, style violations, dead code',
              color: 'var(--color-primary)',
              severity: 'CRITICAL',
            },
          ].map((p, i) => (
            <div key={p.phase}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr 140px',
                  gap: 16,
                  padding: 16,
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{p.phase}</div>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-primary)' }}>{p.cmd}</code>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{p.catches}</div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      color: p.color,
                      padding: '3px 8px',
                      borderRadius: 4,
                      border: `1px solid ${p.color}`,
                    }}
                  >
                    {p.severity}
                  </span>
                </div>
              </div>
              {i < 4 && (
                <div style={{ textAlign: 'center', padding: '4px 0' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>&darr;</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 8 }}>pass &rarr; continue</span>
                  <span style={{ fontSize: 10, color: 'var(--color-error)', marginLeft: 8 }}>fail &rarr; stop &amp; fix</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Diff Review Checklist ---- */}
      <Section title="Diff Review — What to Look For">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          The most important phase for AI-assisted work. Review every file, every change. The diff is the source of truth.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['Check', 'What It Catches'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--color-text-heading)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { check: 'Unexpected file changes', catches: 'AI editing nearby code, adding unused imports, "improving" unrelated code' },
                { check: 'Deleted code', catches: 'AI removing code it doesn\'t understand or considers unused' },
                { check: 'Inconsistent naming', catches: 'New function uses get where codebase uses fetch, or vice versa' },
                { check: 'Style violations', catches: 'Hardcoded colours, Tailwind classes, wrong pattern for the project' },
                { check: 'Missing error handling', catches: 'New async code without try/catch, fetch calls without error states' },
                { check: 'Hardcoded values', catches: 'Magic strings or numbers that should be constants or config' },
                { check: 'Import changes', catches: 'New dependencies added unnecessarily, imports from wrong layers' },
                { check: 'Debug code left in', catches: 'console.log, commented-out code, temporary workarounds' },
              ].map((row) => (
                <tr key={row.check} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-text-heading)', whiteSpace: 'nowrap' }}>{row.check}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>{row.catches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- AI-Specific Mistakes ---- */}
      <Section title="AI-Specific Mistakes">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          These are the mistakes AI agents make most frequently. Check for them explicitly during diff review.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            {
              title: 'Unintended Scope Expansion',
              desc: 'Asked to change function A, also "improved" B and C. Check: is every changed line related to the task?',
              icon: '&#8644;',
            },
            {
              title: 'Import Drift',
              desc: 'Adds imports from the wrong architectural layer — widget importing from database, feature from feature.',
              icon: '&#8631;',
            },
            {
              title: 'Style Inconsistency',
              desc: 'Uses a different pattern than the rest of the codebase — class vs function, Tailwind vs inline styles.',
              icon: '&#9998;',
            },
            {
              title: 'Phantom Dependencies',
              desc: 'Imports a package that isn\'t installed, or adds a dependency that isn\'t needed.',
              icon: '&#128123;',
            },
            {
              title: 'Over-engineering',
              desc: 'Adds error handling, validation, or abstraction that wasn\'t requested and isn\'t needed.',
              icon: '&#9881;',
            },
            {
              title: 'Stale Comments & Dead Code',
              desc: 'Leaves behind commented-out code, TODO comments that reference completed work, outdated JSDoc.',
              icon: '&#128466;',
            },
          ].map((mistake) => (
            <div
              key={mistake.title}
              style={{
                padding: 20,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-alt)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }} dangerouslySetInnerHTML={{ __html: mistake.icon }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{mistake.title}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{mistake.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Gating Criteria Matrix ---- */}
      <Section title="Skill Quality Gate Matrix">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          After changes governed by a specific skill, check that skill&apos;s Quality Gate. The most commonly relevant gates:
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['Change Type', 'Skill Gate', 'Key Checks'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--color-text-heading)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { change: 'UI changes', gate: 'frontend-architecture', checks: 'XS/SM/MD/LG variants, var(--color-*) tokens, widget registered' },
                { change: 'Server-side changes', gate: 'backend-patterns', checks: 'No business logic in Actions, input validated, no raw DB rows past mapper' },
                { change: 'New feature', gate: 'clean-architecture', checks: 'Lives in features/<name>/, no cross-feature imports, domain invariants enforced' },
                { change: 'Any code', gate: 'coding-standards', checks: 'Composable functions, full-word names, no any types, no magic numbers' },
              ].map((row) => (
                <tr key={row.change} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-text-heading)', whiteSpace: 'nowrap' }}>{row.change}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: 'var(--color-primary)' }}>{row.gate}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>{row.checks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- Verification Report Template ---- */}
      <Section title="Verification Report Template">
        <CodeBlock language="text" title="Verification report template">{`VERIFICATION REPORT
===================

Build:     PASS / FAIL
Types:     PASS / FAIL (N errors)
Lint:      PASS / FAIL (N errors, M warnings)
Tests:     PASS / FAIL (X/Y passed)
Diff:      N files changed — all reviewed

Skill gates checked:
- frontend-architecture: PASS
- coding-standards: PASS

Issues found:
1. ...
2. ...

Status: READY / NOT READY`}</CodeBlock>
      </Section>

      {/* ---- When Verification Fails ---- */}
      <Section title="When Verification Fails">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-error)', marginBottom: 8 }}>Prioritise by Phase</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Build failure', 'Type errors', 'Test failures', 'Lint issues', 'Diff concerns'].map((item, i) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)', width: 16, textAlign: 'right' }}>{i + 1}.</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-warning)', marginBottom: 8 }}>Revert vs Fix</div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
              If the change introduced more problems than it solved, revert and try differently. Don&apos;t spend 30 minutes patching
              a conceptually wrong approach. A clean revert is faster and safer.
            </p>
          </div>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-info)', marginBottom: 8 }}>Escalate to Human</div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
              If verification reveals a design question (not just a bug), surface it. The human decides architectural
              trade-offs. Never bury a concern.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Human Review ---- */}
      <Section title="Human Review Focus">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Automated checks catch syntax, types, and regressions. Humans catch what automation cannot.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { focus: 'Intent Alignment', desc: 'Does the change solve the actual problem, or a different problem accurately?' },
            { focus: 'Architectural Fit', desc: 'Does the change belong here, or should it be structured differently?' },
            { focus: 'Edge Cases', desc: 'What happens with empty data, null values, concurrent access, error states?' },
            { focus: 'Naming Quality', desc: 'Are names clear to someone who doesn\'t have this conversation\'s context?' },
            { focus: 'Future Maintenance', desc: 'Will someone reading this in 3 months understand why it was written this way?' },
          ].map((item) => (
            <div
              key={item.focus}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{item.focus}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Banned Patterns ---- */}
      <Section title="Banned Patterns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Skipping build check before moving to next task — build failure compounds',
            'Reviewing only files you expected to change — always review the full diff',
            'Ignoring new lint warnings ("they\'re just warnings") — fix new ones from this change',
            'Committing without running tests — tests are the safety net',
            'Spending 30 minutes patching a fundamentally wrong approach — revert and retry',
            'Only running automated checks without reading the diff — diff review catches what automation misses',
            'Treating verification as optional for "small changes" — small changes cause big regressions',
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

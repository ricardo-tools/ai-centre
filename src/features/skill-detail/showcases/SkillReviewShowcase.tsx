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

const auditLayers = [
  {
    name: 'Structural Audit',
    phase: 'Phase 1',
    color: 'var(--color-primary)',
    description: 'Automated checks — no LLM needed',
    checks: ['Line count <= 500', 'Frontmatter has name + description', 'Required sections present', 'Heading hierarchy valid', 'Examples exist', 'Banned patterns have alternatives', 'Cross-references resolve'],
  },
  {
    name: 'Individual Quality',
    phase: 'Phase 2',
    color: 'var(--color-secondary)',
    description: 'LLM-as-judge with external rubric',
    checks: ['Clarity — instructions unambiguous?', 'Specificity — concrete enough to verify?', 'Completeness — edge cases covered?', 'Self-consistency — follows own rules?', 'Scope discipline — stays in lane?', 'Trigger accuracy — activates correctly?'],
  },
  {
    name: 'Collection Coherence',
    phase: 'Phase 3',
    color: 'var(--color-brand)',
    description: 'LLM pairwise analysis + aggregate',
    checks: ['Contradiction detection', 'Overlap and redundancy', 'Gap analysis', 'Separation of concerns', 'Terminology consistency', 'Dependency graph'],
  },
];

const scoringDimensions = [
  { dim: 'Clarity', question: 'Can you determine from each instruction exactly what code to produce?' },
  { dim: 'Specificity', question: 'Could you verify from output whether each instruction was followed?' },
  { dim: 'Completeness', question: 'Does it cover edge cases and have clear triggers?' },
  { dim: 'Self-consistency', question: 'Does the skill follow its own prescribed structure?' },
  { dim: 'Scope discipline', question: 'Does it cover exactly its description, no more?' },
  { dim: 'Trigger accuracy', question: 'Would the description cause correct (and only correct) activation?' },
];

export function SkillReviewShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This review process uses{' '}
          <strong>skill-creation</strong> as its external grading rubric. The review evaluates each skill against skill-creation rules — not the skill&apos;s own standards. Also pairs with{' '}
          <strong>strategic-context</strong> for managing context during long review sessions.
        </p>
      </div>

      {/* ---- 3-Layer Audit Visual ---- */}
      <Section title="3-Layer Review Architecture">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Each layer catches different problems. Structural catches format violations. Individual catches weak skills. Coherence catches systemic issues across the library.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {auditLayers.map((layer) => (
            <div
              key={layer.name}
              style={{
                borderRadius: 8,
                border: `2px solid ${layer.color}`,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  background: layer.color,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{layer.phase}</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF' }}>{layer.name}</span>
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{layer.description}</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: 8,
                  padding: 16,
                  background: 'var(--color-surface)',
                }}
              >
                {layer.checks.map((check) => (
                  <div
                    key={check}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'var(--color-bg-alt)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: layer.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Scoring Rubric Table ---- */}
      <Section title="Scoring Rubric (6 Dimensions, 1-3 each)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Each skill scores on six dimensions using the skill-creation rubric. Maximum score: 18. The rubric is external — a skill cannot pass review by defining low standards for itself.
        </p>
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 80px 80px 80px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Dimension</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Key Question</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)', textAlign: 'center' }}>1 Fail</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-warning)', textAlign: 'center' }}>2 OK</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', textAlign: 'center' }}>3 Strong</span>
          </div>
          {/* Rows */}
          {scoringDimensions.map((d, i) => (
            <div
              key={d.dim}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 80px 80px 80px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{d.dim}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{d.question}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-error)', opacity: 0.3 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-warning)', opacity: 0.5 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-success)' }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- 5-Phase Review Pipeline ---- */}
      <Section title="5-Phase Review Pipeline">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { phase: '1', name: 'Structural Audit', desc: 'Automated format checks' },
            { phase: '2', name: 'Individual Evaluation', desc: 'Score 6 dimensions per skill' },
            { phase: '3', name: 'Coherence Analysis', desc: 'Contradictions, gaps, overlap' },
            { phase: '4', name: 'Improvement Suggestions', desc: 'Actionable fixes with severity' },
            { phase: '5', name: 'Report Generation', desc: 'Structured prompt for next session' },
          ].map((p, i) => (
            <div key={p.phase} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  minWidth: 160,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase {p.phase}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{p.desc}</div>
              </div>
              {i < 4 && (
                <div style={{ fontSize: 18, color: 'var(--color-text-muted)', fontWeight: 300 }}>{'>'}</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- 3-Pass Self-Critique ---- */}
      <Section title="3-Pass Self-Critique">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Research shows diminishing returns beyond 3 passes. The review follows a structured self-critique to ensure fairness and completeness.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { pass: '1', title: 'Initial Review', desc: 'Run all phases, produce findings. Score each skill, detect contradictions and gaps.', color: 'var(--color-primary)' },
            { pass: '2', title: 'Critique the Review', desc: 'Are findings fair? Are scores calibrated? Did the review miss anything?', color: 'var(--color-warning)' },
            { pass: '3', title: 'Synthesise', desc: 'Reconcile the review with its critique. Produce the final report.', color: 'var(--color-success)' },
          ].map((p) => (
            <div
              key={p.pass}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${p.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.pass}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>{p.title}</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Review Checklist ---- */}
      <Section title="Structural Audit Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Per-Skill Checks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { check: 'Line count <= 500 (200 if always-loaded)', severity: 'Warning' },
                { check: 'Frontmatter has name and description', severity: 'Error' },
                { check: 'Description includes trigger conditions', severity: 'Warning' },
                { check: 'Required sections present', severity: 'Error' },
                { check: 'No skipped heading levels', severity: 'Warning' },
                { check: 'At least one code example in Core Rules', severity: 'Warning' },
                { check: 'Banned patterns have alternatives', severity: 'Warning' },
                { check: 'Quality gate uses checkbox format', severity: 'Warning' },
              ].map((c) => (
                <div
                  key={c.check}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{c.check}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: c.severity === 'Error' ? 'var(--color-error)' : 'var(--color-warning)',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cross-Library Checks</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { check: 'Cross-references resolve to actual skill files', severity: 'Error' },
                { check: 'No orphan skills (referenced somewhere)', severity: 'Warning' },
                { check: 'File names match name frontmatter field', severity: 'Error' },
                { check: 'No duplicate name fields across skills', severity: 'Error' },
              ].map((c) => (
                <div
                  key={c.check}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{c.check}</span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: c.severity === 'Error' ? 'var(--color-error)' : 'var(--color-warning)',
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                    }}
                  >
                    {c.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Pass/Fail Examples ---- */}
      <Section title="Pass / Fail Examples">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Passing Skill</h4>
            <CodeBlock>{`## frontend-architecture — Score: 16/18

| Dimension         | Score | Notes              |
|-------------------|-------|--------------------|
| Clarity           |   3   | All rules precise  |
| Specificity       |   3   | Verifiable output  |
| Completeness      |   3   | Edge cases covered |
| Self-consistency   |   2   | Minor format drift |
| Scope discipline  |   3   | Clean boundaries   |
| Trigger accuracy  |   2   | Broad description  |

Key findings:
- Strong examples with correct/incorrect markers
- Quality gate is concrete and verifiable`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Failing Skill</h4>
            <CodeBlock>{`## vague-skill — Score: 8/18

| Dimension         | Score | Notes                |
|-------------------|-------|----------------------|
| Clarity           |   1   | "Write good code"    |
| Specificity       |   1   | Unverifiable rules   |
| Completeness      |   2   | Missing "When to Use"|
| Self-consistency   |   1   | No examples shown    |
| Scope discipline  |   2   | Drifts into 3 topics |
| Trigger accuracy  |   1   | No trigger conditions|

Key findings:
- 4 rules are aspirational, not actionable
- No code examples despite governing code`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Priority Ranking ---- */}
      <Section title="Improvement Priority Ranking">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { rank: 1, label: 'Contradictions', desc: 'Two skills giving opposing instructions', color: 'var(--color-error)' },
            { rank: 2, label: 'Critical gaps', desc: 'No guidance where guidance is needed', color: 'var(--color-error)' },
            { rank: 3, label: 'Vague instructions', desc: 'Rules that don\'t change behaviour', color: 'var(--color-warning)' },
            { rank: 4, label: 'Structural issues', desc: 'Missing sections, broken references', color: 'var(--color-warning)' },
            { rank: 5, label: 'Overlap/redundancy', desc: 'Same rule in different words', color: 'var(--color-text-muted)' },
            { rank: 6, label: 'Terminology drift', desc: 'Inconsistent naming across skills', color: 'var(--color-text-muted)' },
            { rank: 7, label: 'Self-consistency', desc: 'Skill doesn\'t follow its own rules', color: 'var(--color-text-muted)' },
            { rank: 8, label: 'Polish', desc: 'Phrasing, examples, formatting', color: 'var(--color-text-muted)' },
          ].map((item) => (
            <div
              key={item.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${item.color}`,
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: item.color, minWidth: 24 }}>{item.rank}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', minWidth: 160 }}>{item.label}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Report Template ---- */}
      <Section title="Report Output Template">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          The review report is designed as a prompt — hand it to a new Claude session to execute improvements.
        </p>
        <CodeBlock>{`# SKILL LIBRARY REVIEW — 2026-03-18

## Summary
- Skills reviewed: 12
- Total score: 178/216 (82%)
- Contradictions found: 2
- Gaps identified: 3
- Improvements suggested: 14

## Skill Scores
| Skill                | Score | Key issue           |
|----------------------|-------|---------------------|
| frontend-architecture| 16/18 | Broad trigger desc  |
| brand-design-system  | 17/18 | No issues           |
| skill-creation       | 15/18 | Missing edge case   |

## Priority Improvements (Top 3)
1. frontend-arch vs app-layout contradiction on grid
2. No skill covers database migration patterns
3. "component" means different things in 3 skills

## Self-Improvement Suggestions
### For skill-creation:
- Add rule about cross-skill terminology alignment

### For skill-review:
- Add automated check for terminology consistency`}</CodeBlock>
      </Section>

      {/* ---- Review Cadence ---- */}
      <Section title="Review Cadence">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { level: 'Quick', time: '30 min', phases: 'Phase 1 only', when: 'After adding a single new skill', color: 'var(--color-success)' },
            { level: 'Standard', time: '1-2 hours', phases: 'Phases 1-4', when: 'Monthly or after significant changes', color: 'var(--color-warning)' },
            { level: 'Deep', time: 'Half day', phases: 'All 5 phases + 3-pass critique', when: 'Quarterly or when library feels stale', color: 'var(--color-primary)' },
          ].map((r) => (
            <div
              key={r.level}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${r.color}`,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: r.color, marginBottom: 4 }}>{r.level} Review</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>{r.time}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 4 }}>{r.phases}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{r.when}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

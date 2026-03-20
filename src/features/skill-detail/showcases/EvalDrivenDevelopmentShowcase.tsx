'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const Code = ({ children }: { children: React.ReactNode }) => (
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

const cellStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontSize: 13,
  color: 'var(--color-text-body)',
  borderBottom: '1px solid var(--color-border)',
};

const headerCellStyle: React.CSSProperties = {
  ...cellStyle,
  fontWeight: 700,
  color: 'var(--color-text-heading)',
  background: 'var(--color-bg-alt)',
  fontSize: 12,
  textTransform: 'uppercase' as const,
  letterSpacing: 0.5,
};

export function EvalDrivenDevelopmentShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Pair with <strong>claude-api</strong> (prompt patterns and API integration)
          and <strong>observability</strong> (monitor AI quality in production and feed failures back to eval sets).
        </p>
      </div>

      {/* ---- EDD Loop Diagram ---- */}
      <Section title="The EDD Loop">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Eval Driven Development is a continuous feedback loop. Evals are the specification — not the prompt, not
          the model, not the architecture. If you cannot define &quot;correct&quot; as a function, you are not ready to build.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 20,
          }}
        >
          {[
            { step: '1', label: 'Define hard constraints', detail: 'Write deterministic evals for format, safety, banned content', bg: 'var(--color-primary-muted)', highlight: false },
            { step: '2', label: 'Build first version', detail: 'Reasonable prompt, working feature, ship v1', bg: 'var(--color-bg-alt)', highlight: false },
            { step: '3', label: 'Generate 20-50 outputs', detail: 'Against real, diverse inputs — not synthetic edge cases', bg: 'var(--color-bg-alt)', highlight: false },
            { step: '4', label: 'Error analysis', detail: 'Review outputs, categorise failures. THE MOST VALUABLE STEP.', bg: 'var(--color-warning-muted)', highlight: true },
            { step: '5', label: 'Write evals for failures found', detail: 'Deterministic where possible, LLM-judge where needed', bg: 'var(--color-bg-alt)', highlight: false },
            { step: '6', label: 'Fix the system', detail: 'Change prompt, model, retrieval, or post-processing', bg: 'var(--color-bg-alt)', highlight: false },
            { step: '7', label: 'Re-run evals', detail: 'Verify improvement without regression', bg: 'var(--color-success-muted)', highlight: false },
            { step: '8', label: 'Ship with eval suite as CI gate', detail: 'Deterministic on every commit, judge on every PR', bg: 'var(--color-bg-alt)', highlight: false },
            { step: '9', label: 'Monitor production', detail: 'Sample and score real outputs continuously', bg: 'var(--color-bg-alt)', highlight: false },
            { step: '10', label: 'Promote failures to eval set', detail: 'The flywheel continues — eval set grows from real errors', bg: 'var(--color-primary-muted)', highlight: false },
          ].map((item) => (
            <div
              key={item.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                background: item.bg,
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: item.highlight ? 'var(--color-warning)' : 'var(--color-primary)',
                  color: 'var(--color-text-on-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {item.step}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: item.highlight ? 'var(--color-warning)' : 'var(--color-text-muted)', fontWeight: item.highlight ? 600 : 400 }}>
                  {item.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderRadius: 8, background: 'var(--color-warning-muted)', border: '1px solid var(--color-warning)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.6 }}>
            <strong>Step 4 is the most valuable step.</strong> Looking at actual outputs with domain expertise reveals
            failure modes you would never anticipate. Build a simple interface that lets you review AI outputs quickly.
          </p>
        </div>
      </Section>

      {/* ---- Deterministic vs LLM-as-Judge ---- */}
      <Section title="Deterministic vs LLM-as-Judge">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Not all evals cost the same. Layer them: deterministic first (free, instant), judge second (paid, slower),
          human for calibration only.
        </p>
        <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Dimension', 'Deterministic (Code)', 'LLM-as-Judge', 'Human Review'].map((h) => (
                  <th key={h} style={headerCellStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { dim: 'Cost', det: 'Free', llm: '~$0.01-0.10 per eval', human: 'Expensive' },
                { dim: 'Speed', det: 'Instant', llm: '1-5 seconds', human: 'Slow' },
                { dim: 'Use For', det: 'Format, structure, length, banned content, JSON validity, regex', llm: 'Quality, coherence, accuracy, tone, helpfulness', human: 'Calibration, edge cases, final quality bar' },
                { dim: 'Determinism', det: '100% repeatable', llm: 'Varies — use temp 0', human: 'Subjective' },
                { dim: 'Scalability', det: 'Unlimited', llm: 'Budget-constrained', human: '10-20% sample' },
                { dim: 'CI Trigger', det: 'Every commit', llm: 'Every PR', human: 'Release decisions' },
              ].map((row) => (
                <tr key={row.dim}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{row.dim}</td>
                  <td style={cellStyle}>{row.det}</td>
                  <td style={cellStyle}>{row.llm}</td>
                  <td style={cellStyle}>{row.human}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>Deterministic Examples</h4>
            <Code>{`// Structure check
const hasHeadings = (html: string) =>
  ['h1', 'h2'].every(t => html.includes(\`<\${t}\`));

// Safety check
const noScriptTags = (html: string) =>
  !/<script[\\s>]/i.test(html);

// Format check
const isValidJson = (out: string) => {
  try { JSON.parse(out); return true; }
  catch { return false; }
};

// Length bounds
const isReasonable = (out: string) =>
  out.length > 500 && out.length < 50000;`}</Code>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>LLM-as-Judge Example</h4>
            <Code>{`async function judgeAccuracy(
  showcase: string,
  spec: string,
): Promise<{ pass: boolean }> {
  const resp = await client.messages.create({
    model: 'claude-sonnet-4-6',
    temperature: 0,  // consistency
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: \`Evaluate: does this showcase
accurately represent the spec
without hallucinating features?

SPEC: \${spec}
SHOWCASE: \${showcase}

Respond: { "pass": true/false,
  "reasoning": "..." }\`,
    }],
  });
  return JSON.parse(resp.content[0].text);
}`}</Code>
          </div>
        </div>
      </Section>

      {/* ---- Eval Suite Structure ---- */}
      <Section title="Eval Suite Structure">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          An eval case defines inputs and metadata — but no expected output. Evals check properties, not exact matches.
        </p>
        <Code>{`interface EvalCase {
  id: string;                      // unique, stable identifier
  input: Record<string, unknown>;  // inputs to your AI feature
  metadata: {
    source: 'production' | 'synthetic' | 'expert';
    addedAt: string;               // ISO date
    category: string;              // 'format', 'accuracy', 'safety'
  };
  // No expected output — evals check properties, not exact matches
}`}</Code>
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { phase: 'First Iteration', cases: '20-50', reason: 'Each change has a large effect' },
            { phase: 'Stabilising', cases: '50-200', reason: 'Detect smaller regressions' },
            { phase: 'Mature System', cases: '200+', reason: 'Statistical power for subtle improvements' },
          ].map((p) => (
            <div key={p.phase} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{p.phase}</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)', margin: '6px 0' }}>{p.cases}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{p.reason}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Outcome vs Path ---- */}
      <Section title="Grade Outcomes, Not Paths">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          AI agents find valid approaches you did not anticipate. Path-based evals penalise correct results produced
          differently than expected.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Outcome-Based
            </div>
            <Code>{`// Checks what matters
function evalHasRequiredSections(
  html: string
): boolean {
  const doc = parseHtml(html);
  return ['h1', 'h2', 'pre code']
    .every(sel =>
      doc.querySelector(sel) !== null
    );
}`}</Code>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-error)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Path-Based (Banned)
            </div>
            <Code>{`// Brittle — breaks when model
// finds a different valid approach
function evalUsedCorrectPrompt(
  trace: Trace
): boolean {
  return trace.messages[0].content
    .includes('Generate a showcase');
}`}</Code>
          </div>
        </div>
      </Section>

      {/* ---- Non-Determinism ---- */}
      <Section title="Handling Non-Determinism">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          The same prompt produces different outputs each run. A single pass/fail tells you nothing. Run N times,
          measure pass rates.
        </p>
        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          {[
            { runs: '5', label: 'Dev iteration', desc: 'Quick feedback loop' },
            { runs: '20+', label: 'Reliable measurement', desc: 'Pass rate with confidence' },
            { runs: 'temp 0', label: 'Eval temperature', desc: 'Reduce variance for judges' },
          ].map((item) => (
            <div key={item.label} style={{ flex: 1, padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>{item.runs}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <Code>{`async function measurePassRate(
  evalFn: (output: string) => boolean,
  generateFn: () => Promise<string>,
  runs: number = 20,
): Promise<{ passRate: number; passed: number; total: number }> {
  const results = await Promise.all(
    Array.from({ length: runs }, () => generateFn().then(evalFn))
  );
  const passed = results.filter(Boolean).length;
  return { passRate: passed / runs, passed, total: runs };
}

// Binary PASS/FAIL forces clarity
// Avoid 1-5 scales that hide ambiguous cases in the middle`}</Code>
      </Section>

      {/* ---- CI/CD Quality Gate Pipeline ---- */}
      <Section title="Quality Gate Pipeline">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Tier your CI evals by cost and trigger. No special framework needed — a test file + dataset + scoring script.
        </p>
        <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Trigger', 'Evals', 'Cost', 'Gate'].map((h) => (
                  <th key={h} style={headerCellStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { trigger: 'Every commit', evals: 'Deterministic only', cost: 'Free', gate: 'Any failure blocks merge' },
                { trigger: 'Every PR', evals: 'Deterministic + LLM-judge (core)', cost: '~$0.50-5.00', gate: 'Pass rate below 85% blocks' },
                { trigger: 'Nightly', evals: 'Full suite incl. expensive judges', cost: 'Medium', gate: 'Regression report' },
                { trigger: 'Model swap', evals: 'Full suite x N runs', cost: 'High', gate: 'Statistical comparison required' },
              ].map((row) => (
                <tr key={row.trigger}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{row.trigger}</td>
                  <td style={cellStyle}>{row.evals}</td>
                  <td style={cellStyle}>{row.cost}</td>
                  <td style={cellStyle}>{row.gate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Code>{`// evals/showcase.eval.ts — runs with: npx vitest run evals/
import { describe, test, expect } from 'vitest';
import { generateShowcase } from '../src/features/showcase/generate';
import evalCases from './datasets/showcase-cases.json';

describe('showcase evals', () => {
  for (const evalCase of evalCases) {
    test(\`\${evalCase.id}: has required sections\`, async () => {
      const output = await generateShowcase(evalCase.input);
      expect(output).toMatch(/<h1/);
      expect(output).toMatch(/<h2/);
      expect(output).toMatch(/<pre/);
    });

    test(\`\${evalCase.id}: no script tags\`, async () => {
      const output = await generateShowcase(evalCase.input);
      expect(output).not.toMatch(/<script/i);
    });
  }
});`}</Code>
      </Section>

      {/* ---- LLM Judge Biases ---- */}
      <Section title="LLM Judge Pitfalls">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { bias: 'Position bias', desc: 'Favours first or last option in comparisons.', fix: 'Randomise position.' },
            { bias: 'Verbosity bias', desc: 'Prefers longer outputs regardless of quality.', fix: 'Judge on specific criteria, not overall preference.' },
            { bias: 'Self-preference', desc: 'Models rate their own outputs higher.', fix: 'Use a different model as judge.' },
          ].map((item) => (
            <div key={item.bias} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-error)', marginBottom: 6 }}>{item.bias}</h4>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5, margin: 0, marginBottom: 8 }}>{item.desc}</p>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-success)', padding: '4px 8px', borderRadius: 4, background: 'var(--color-success-muted)', display: 'inline-block' }}>
                Mitigation: {item.fix}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Living Evals ---- */}
      <Section title="Evals Are Living Artifacts">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          An eval set that never changes becomes stale. 100% pass rate means the evals track regressions
          but provide no signal for improvement.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { action: 'Continuously source new cases', detail: 'From production outputs and user feedback' },
            { action: 'Promote hard cases', detail: 'When a production output fails, add it to eval set' },
            { action: 'Retire trivial evals', detail: "That haven't failed in months — consume budget without signal" },
            { action: 'Refresh with harder cases', detail: 'As the system improves, raise the bar' },
          ].map((item) => (
            <div
              key={item.action}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                padding: 14,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 5 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 2 }}>{item.action}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            '"Correct" defined as evaluable functions',
            'Hard constraints have deterministic evals',
            'Quality criteria have LLM-judge evals',
            'Eval dataset has 20+ real-input cases',
            'Pass rates measured over N runs (min 5 dev, 20 release)',
            'Deterministic evals in CI on every commit',
            'LLM-judge evals in CI on every PR',
            'Regression gating configured',
            'LLM judges validated against known-good/bad outputs',
            'Production outputs sampled and scored',
          ].map((item) => (
            <div
              key={item}
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
              <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

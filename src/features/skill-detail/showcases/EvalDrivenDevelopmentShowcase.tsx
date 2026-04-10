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

const feedbackLoop = [
  { step: '1', label: 'IMPLEMENT', desc: 'Write the minimum code for this scenario', color: 'var(--color-primary)' },
  { step: '2', label: 'EVAL', desc: 'Run the app, verify behaviour with all available tools', color: 'var(--color-warning)', highlight: true },
  { step: '3', label: 'TEST', desc: 'Run the targeted test(s) for this scenario', color: 'var(--color-success)' },
  { step: '4', label: 'NEXT', desc: 'Green = next scenario. Red = fix before moving on.', color: 'var(--color-text-muted)' },
];

const evalToolkit = [
  { tool: 'Playwright headless', reveals: 'Navigate pages, click buttons, fill forms, verify DOM state, take screenshots', when: 'Every UI scenario', color: 'var(--color-primary)' },
  { tool: 'Screenshots (vision)', reveals: 'Visual layout, branding, spacing, theme correctness, responsive behaviour', when: 'UI scenarios, especially after styling changes', color: 'var(--color-secondary)' },
  { tool: 'Console logs', reveals: 'Client-side errors, warnings, React hydration issues', when: 'Every scenario', color: 'var(--color-warning)' },
  { tool: 'Server logs', reveals: 'Server-side errors, query timing, auth failures, permission denials', when: 'Backend scenarios, API routes, server actions', color: 'var(--color-error)' },
  { tool: 'HTML inspection', reveals: 'DOM structure, aria attributes, semantic elements, data-testid presence', when: 'Accessibility, component structure', color: 'var(--color-success)' },
  { tool: 'Network requests', reveals: 'API response codes, payloads, timing, failed fetches', when: 'API integration, auth flow', color: 'var(--color-brand)' },
  { tool: 'Database state', reveals: 'Records created/updated, audit columns, soft delete state', when: 'Data mutation scenarios', color: 'var(--color-text-muted)' },
  { tool: 'curl / fetch', reveals: 'Direct API endpoint testing without UI', when: 'API routes, webhooks', color: 'var(--color-primary)' },
];

const aiEvalLayers = [
  { layer: 'Deterministic', checks: 'Format, structure, length, required fields, banned content', cost: 'Free', speed: 'Instant', color: 'var(--color-success)' },
  { layer: 'LLM-as-judge', checks: 'Quality, coherence, accuracy, tone', cost: '~$0.01-0.10', speed: '1-5s', color: 'var(--color-warning)' },
  { layer: 'Human review', checks: 'Calibration, edge cases, UX quality', cost: 'Time', speed: 'Slow', color: 'var(--color-error)' },
];

export function EvalDrivenDevelopmentShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Opinion companion for flow.</strong> Every change is evaluated by running the app like a real user before moving to the next scenario.
          Feedback loop: implement &#x2192; start server &#x2192; eval via Playwright headless + logs + inspection &#x2192; run targeted test &#x2192; green &#x2192; next.
        </p>
      </div>

      {/* ---- Per-Scenario Feedback Loop ---- */}
      <Section title="Per-Scenario Feedback Loop">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          For each scenario in the plan, run this tight loop. Manual eval BEFORE automated test -- the eval catches things tests do not: visual regressions, UX feel, response time, edge cases.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {feedbackLoop.map((s, i) => (
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
              <div
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: s.highlight ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                  border: s.highlight ? `2px solid ${s.color}` : '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.desc}</div>
              </div>
              {i < feedbackLoop.length - 1 && <div style={{ width: 0 }} />}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            <strong>Key rule:</strong> Reading code is not evaluation. &quot;It should work&quot; is not evaluation. Evaluation means running the app through a real browser and inspecting results.
          </div>
        </div>
      </Section>

      {/* ---- Eval Toolkit ---- */}
      <Section title="Eval Toolkit">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          When evaluating a scenario, use ALL available tools aggressively. Each tool reveals different failure modes.
        </p>
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 200px', background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)', padding: '10px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Tool</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>What It Reveals</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>When to Use</span>
          </div>
          {evalToolkit.map((t, i) => (
            <div
              key={t.tool}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 200px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: t.color, fontFamily: 'monospace' }}>{t.tool}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{t.reveals}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{t.when}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Playwright Headless Eval ---- */}
      <Section title="Playwright Headless for UI Evaluation">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Use Playwright&#39;s API in a throwaway script or inline to evaluate UI scenarios. This is NOT a test -- it is a diagnostic tool.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navigate + Screenshot</h4>
            <CodeBlock>{`const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('http://localhost:3000/users');
await page.waitForLoadState('networkidle');

// Take screenshot for visual inspection
await page.screenshot({
  path: 'eval-users-page.png',
  fullPage: true
});

// Check for console errors
page.on('console', msg => {
  if (msg.type() === 'error')
    console.log('CONSOLE ERROR:', msg.text());
});

await browser.close();`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-secondary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Multi-Viewport Screenshots</h4>
            <CodeBlock>{`// Screenshot-based visual verification
for (const width of [375, 768, 1280]) {
  await page.setViewportSize({
    width,
    height: 800
  });
  await page.screenshot({
    path: \`eval-\${width}.png\`
  });
}

// Check server logs for hidden issues
curl http://localhost:3000/api/logs
  ?level=error&limit=20

// Verify:
// - Permission denied errors (RBAC)
// - Database query errors
// - Unhandled promise rejections
// - Slow queries (> 100ms in dev)`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Eval Evidence Report ---- */}
      <Section title="Eval Evidence Report">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          After evaluating, report what was found. Capture evidence for every check. Issues must be fixed before moving to the next scenario.
        </p>
        <CodeBlock>{`Eval: Users page -- admin view
  ✓ Screenshot (1280px): table renders with 5 users, role badges coloured
  ✓ Screenshot (375px): cards layout, hamburger menu works
  ✓ Console: 0 errors
  ✓ Server logs: 0 errors, query took 12ms
  ✓ Invite dialog: opens, validates domain, shows role dropdown
  ✗ Issue: role dropdown shows all roles including admin
    -- should exclude >= own level
  → Fix needed before moving to next scenario`}</CodeBlock>
      </Section>

      {/* ---- Layered Evals for AI Features ---- */}
      <Section title="Layered Evals for AI Features">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Run deterministic evals on every change. LLM-as-judge on PRs or significant changes. Human review for calibration.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {aiEvalLayers.map((l) => (
            <div
              key={l.layer}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 100px 80px',
                gap: 16,
                padding: '14px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${l.color}`,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: l.color }}>{l.layer}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{l.checks}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{l.cost}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{l.speed}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Suite Timing ---- */}
      <Section title="Test Execution Timing">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Per-scenario testing is faster and provides clearer signal than running the full suite after every change.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { phase: 'During development', strategy: 'Run only the test(s) for the current scenario', color: 'var(--color-success)' },
            { phase: 'After all scenarios', strategy: 'Run the full suite (hardening)', color: 'var(--color-warning)' },
            { phase: 'Before delivery', strategy: 'Full suite must pass with 0 failures', color: 'var(--color-error)' },
          ].map((p) => (
            <div
              key={p.phase}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${p.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.phase}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{p.strategy}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate Checklist ---- */}
      <Section title="Quality Gate Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'Each scenario evaluated by running the app (not reading code)',
            'Playwright headless used for UI evaluation with screenshots',
            'Console errors checked during every eval (0 expected)',
            'Server logs checked during every eval (0 unexpected errors)',
            'Screenshots reviewed at key breakpoints',
            'Targeted tests ran per-scenario (not full suite during dev)',
            'AI features have deterministic eval layer',
            'Debug logging available and used for diagnosing failures',
            'Full suite passed at hardening (0 failures)',
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

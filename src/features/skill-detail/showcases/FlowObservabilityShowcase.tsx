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

const logLevels = [
  {
    level: 'debug',
    what: 'Internal state, query params, cache hits/misses, intermediate values',
    dev: true,
    test: true,
    preview: false,
    prod: false,
    color: 'var(--color-text-muted)',
  },
  {
    level: 'info',
    what: 'Operations: start/complete of actions, API calls, auth events, durations',
    dev: true,
    test: true,
    preview: true,
    prod: true,
    color: 'var(--color-primary)',
  },
  {
    level: 'warn',
    what: 'Degraded state: fallback used, rate limit approaching, slow query',
    dev: true,
    test: true,
    preview: true,
    prod: true,
    color: 'var(--color-warning)',
  },
  {
    level: 'error',
    what: 'Failures: DB errors, API failures, permission denied, unhandled exceptions',
    dev: true,
    test: true,
    preview: true,
    prod: true,
    color: 'var(--color-error)',
  },
];

const envDefaults = [
  { env: 'Development', logLevel: 'debug', visible: 'Everything', color: 'var(--color-success)' },
  { env: 'Test', logLevel: 'debug', visible: 'Everything', color: 'var(--color-primary)' },
  { env: 'Preview', logLevel: 'info', visible: 'Ops + warnings + errors', color: 'var(--color-warning)' },
  { env: 'Production', logLevel: 'info', visible: 'Ops + warnings + errors', color: 'var(--color-error)' },
];

const apiParams = [
  { param: 'level', purpose: 'Filter by severity', example: '?level=error' },
  { param: 'since', purpose: 'Time-range', example: '?since=2026-03-25T10:00:00Z' },
  { param: 'search', purpose: 'Keyword in msg', example: '?search=persona.create' },
  { param: 'limit', purpose: 'Cap results', example: '?limit=50' },
];

export function FlowObservabilityShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Prerequisite for flow-eval-driven.</strong> Without granular structured logging, EDD is guessing.
          Code without logs is invisible code — silence is a bug.
        </p>
      </div>

      {/* ---- Log Level Matrix ---- */}
      <Section title="Log Level Matrix">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Log levels control who sees what, not whether to log. Always add the log. The level determines which environment surfaces it.
        </p>
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 60px 60px 60px 60px', background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)', padding: '10px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Level</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>What to Log</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Dev</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Test</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Preview</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Prod</span>
          </div>
          {logLevels.map((l, i) => (
            <div
              key={l.level}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 60px 60px 60px 60px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: l.color, fontFamily: 'monospace' }}>{l.level}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{l.what}</span>
              {[l.dev, l.test, l.preview, l.prod].map((enabled, j) => (
                <div key={j} style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      background: enabled ? 'var(--color-success)' : 'var(--color-border)',
                      opacity: enabled ? 1 : 0.3,
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Default Log Level per Environment ---- */}
      <Section title="Default Log Level per Environment">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {envDefaults.map((e) => (
            <div
              key={e.env}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${e.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{e.env}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: e.color, fontFamily: 'monospace', marginBottom: 4 }}>{e.logLevel}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{e.visible}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Structured Log Format ---- */}
      <Section title="Structured Log Format">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Every log uses Pino structured format. Messages use dot-notation for grep-ability. Every entry includes requestId and userId.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct</h4>
            <CodeBlock>{`logger.info(
  { actorId, name: data.name },
  'persona.create.start'
);

logger.info(
  { actorId, personaId: created.id,
    durationMs: Date.now() - start },
  'persona.create.complete'
);

logger.error(
  { actorId, error: err.message,
    stack: err.stack },
  'persona.create.error'
);`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Wrong</h4>
            <CodeBlock>{`// Silent code -- no logs
async function createPersona(data) {
  const [created] = await db
    .insert(personas)
    .values({ ... })
    .returning();
  return Ok({ id: created.id });
}

// Unstructured message
console.log("Something went wrong");

// Secret in logs
logger.info({ token: jwt }, 'auth');`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Dot-Notation Message Patterns ---- */}
      <Section title="Dot-Notation Message Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 8 }}>
          {[
            { module: 'persona', ops: ['create.start', 'create.complete', 'create.error'] },
            { module: 'content', ops: ['upload.start', 'upload.complete'] },
            { module: 'auth', ops: ['otp.request', 'otp.verify', 'session.create'] },
            { module: 'rag', ops: ['query.start', 'retrieval.complete', 'generation.complete'] },
          ].map((m) => (
            <div
              key={m.module}
              style={{
                padding: 12,
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6, fontFamily: 'monospace' }}>{m.module}.*</div>
              {m.ops.map((op) => (
                <div key={op} style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace', padding: '2px 0' }}>
                  {m.module}.{op}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- /api/dev/logs Endpoint ---- */}
      <Section title="/api/dev/logs Endpoint">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Dev/test only ring buffer (200 entries). Returns 403 in production.
        </p>
        <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 1fr', background: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)', padding: '10px 16px' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Parameter</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Purpose</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Example</span>
          </div>
          {apiParams.map((p, i) => (
            <div
              key={p.param}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr',
                padding: '8px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{p.param}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{p.purpose}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{p.example}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Browser Console Collection ---- */}
      <Section title="Browser Console Collection">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-primary)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Client-Side (dev only)</div>
            <CodeBlock>{`if (process.env.NODE_ENV === 'development') {
  console.debug('[PersonaList] mount:',
    { count: personas.length });
  console.info('[PersonaList] search:',
    { query, results: filtered.length });
}`}</CodeBlock>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-warning)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-warning)', marginBottom: 8 }}>E2E Capture</div>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>
              Every E2E test collects console errors via Playwright&apos;s <code style={{ fontFamily: 'monospace', fontSize: 11, background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>page.on(&apos;console&apos;)</code>.
              On failure, both browser and server errors are printed. Without this, EDD is incomplete.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Logging Checklist ---- */}
      <Section title="Implementation Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Server-Side (Pino)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Every action: .start + .complete + .error',
                'Every DB query: .query with duration',
                'Every external API: .request + .response',
                'Every permission check: .denied or .granted',
                'Every state transition: .change with from/to',
                'Every error catch: log before returning',
              ].map((check) => (
                <div
                  key={check}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ width: 14, height: 14, borderRadius: 3, border: '2px solid var(--color-border)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{check}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client-Side (browser console)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Every component mount: console.debug',
                'Every user interaction: console.info',
                'Every API call: start + complete/error',
                'Every state transition: console.debug',
                'Every form submission: console.info',
                'Every error boundary: console.error',
              ].map((check) => (
                <div
                  key={check}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ width: 14, height: 14, borderRadius: 3, border: '2px solid var(--color-border)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

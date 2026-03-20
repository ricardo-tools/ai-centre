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

export function ObservabilityShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Pair with <strong>claude-api</strong> (log token usage per AI call),{' '}
          <strong>eval-driven-development</strong> (feed production failures back to eval sets), and{' '}
          <strong>frontend-architecture</strong> (error boundaries at feature boundaries, not just app root).
        </p>
      </div>

      {/* ---- Monitoring Stack Diagram ---- */}
      <Section title="The Monitoring Stack">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Graduate observability with complexity. Start with error tracking and structured logs. Add layers when you
          feel the pain, not on day 1.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
          {[
            {
              phase: 'Day 1',
              subtitle: 'Before first users',
              tools: [
                { name: 'Sentry', purpose: 'Error tracking', cost: 'Free (5K events/mo)' },
                { name: 'BetterStack', purpose: 'Uptime monitoring', cost: 'Free tier' },
                { name: 'pino', purpose: 'Structured logging to stdout', cost: '$0' },
              ],
              borderColor: 'var(--color-primary)',
            },
            {
              phase: 'Week 2',
              subtitle: 'With real traffic',
              tools: [
                { name: 'Speed Insights', purpose: 'Web Vitals (RUM)', cost: 'Included' },
                { name: 'Axiom', purpose: 'Log retention & query', cost: 'Free (500GB/mo)' },
                { name: 'Sentry+', purpose: 'Source maps, releases, user context', cost: '' },
              ],
              borderColor: 'var(--color-success)',
            },
            {
              phase: 'Month 2+',
              subtitle: 'When you feel the pain',
              tools: [
                { name: 'PostHog', purpose: 'Analytics + session replay', cost: 'Free tier' },
                { name: 'OpenTelemetry', purpose: 'Distributed tracing', cost: 'Via Axiom' },
                { name: 'Checkly', purpose: 'Browser checks for critical flows', cost: 'Paid' },
              ],
              borderColor: 'var(--color-warning)',
            },
          ].map((col) => (
            <div
              key={col.phase}
              style={{
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                borderTop: `4px solid ${col.borderColor}`,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{col.phase}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{col.subtitle}</div>
              </div>
              {col.tools.map((tool) => (
                <div
                  key={tool.name}
                  style={{
                    padding: '10px 16px',
                    borderTop: '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{tool.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{tool.purpose}</div>
                  </div>
                  {tool.cost && (
                    <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'var(--color-success-muted)', color: 'var(--color-success)' }}>
                      {tool.cost}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Structured Log Anatomy ---- */}
      <Section title="Structured Log Anatomy">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Log JSON objects with queryable fields, not prose sentences. &quot;Show me all project generations that took
          over 5 seconds&quot; is trivial with structured logs, impossible with text.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Structured (Queryable)
            </div>
            <Code>{`logger.info({
  requestId: "abc-123",
  userId: "usr_456",
  action: "project_generated",
  projectId: "proj_789",
  durationMs: 2300,
  skillCount: 4,
  archetypeSlug: "dashboard",
}, 'project_generated');`}</Code>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-error)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Unstructured (Banned)
            </div>
            <Code>{`console.log(
  \`User usr_456 generated project
   proj_789 in 2300ms with 4 skills
   using dashboard archetype\`
);

// Can only grep
// Cannot query, filter, aggregate
// No correlation ID
// No machine-parseable fields`}</Code>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Always Log</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Request start/end with duration', 'Auth events', 'Business-critical ops (publish, generate, delete)', 'External service calls with duration + status', 'Errors with full context', 'Correlation/request IDs'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-error)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Never Log</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Passwords and tokens', 'API keys', 'Full request bodies', 'PII beyond user IDs', 'Health check requests', 'Credit card numbers'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-error)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Log Levels ---- */}
      <Section title="Log Levels">
        <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Level', 'When', 'Example', 'Production'].map((h) => (
                  <th key={h} style={headerCellStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { level: 'error', when: 'Something failed, needs attention', example: 'DB connection failed, API 500', prod: 'Always' },
                { level: 'warn', when: 'Unexpected but handled', example: 'Rate limit approaching, fallback triggered', prod: 'Always' },
                { level: 'info', when: 'Normal business operations', example: 'User login, project generated, skill published', prod: 'Default' },
                { level: 'debug', when: 'Detailed diagnostics', example: 'Query parameters, intermediate results', prod: 'Temporarily' },
              ].map((row) => (
                <tr key={row.level}>
                  <td style={{ ...cellStyle, fontWeight: 700 }}>
                    <code style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: row.level === 'error' ? 'var(--color-error-muted)' : row.level === 'warn' ? 'var(--color-warning-muted)' : 'var(--color-bg-alt)', color: row.level === 'error' ? 'var(--color-error)' : row.level === 'warn' ? 'var(--color-warning)' : 'var(--color-text-body)' }}>
                      {row.level}
                    </code>
                  </td>
                  <td style={cellStyle}>{row.when}</td>
                  <td style={cellStyle}>{row.example}</td>
                  <td style={cellStyle}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: row.prod === 'Always' ? 'var(--color-success)' : row.prod === 'Default' ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                      {row.prod}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- Correlation ID Flow ---- */}
      <Section title="Correlation IDs">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          A unique ID follows a request through every layer. When something fails, search by correlation ID to see
          the full story.
        </p>
        <Code>{`// In middleware — generate and propagate
const requestId = crypto.randomUUID();
requestHeaders.set('x-request-id', requestId);

// In every log line — always include
logger.info({ requestId, userId, action: 'publish_skill' }, 'action_started');
logger.info({ requestId, userId, durationMs: 450 }, 'action_completed');
logger.error({ requestId, userId, error: err.message }, 'action_failed');

// In Sentry — attach for correlation
Sentry.setTag('requestId', requestId);`}</Code>
      </Section>

      {/* ---- Alert Threshold Table ---- */}
      <Section title="Alerting Strategy">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Alert on symptoms, not causes. Every alert must require a human action. If the correct response is
          &quot;do nothing,&quot; the alert should not exist.
        </p>
        <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Signal', 'Threshold', 'Action', 'Channel'].map((h) => (
                  <th key={h} style={headerCellStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { signal: 'Error rate', threshold: '> 2% for 5 min', action: 'Investigate recent deploy', channel: 'Slack alert' },
                { signal: 'Health check fail', threshold: 'Any failure', action: 'Check DB and critical deps', channel: 'Slack alert' },
                { signal: 'Zero requests', threshold: '0 for 5 min', action: 'App is completely down', channel: 'Slack alert' },
                { signal: 'Auth failure spike', threshold: '> 10x normal rate', action: 'Potential attack or config issue', channel: 'Slack alert' },
                { signal: 'AI rate limit', threshold: '> 80% of limit', action: 'Scale back or queue requests', channel: 'Slack alert' },
              ].map((row) => (
                <tr key={row.signal}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{row.signal}</td>
                  <td style={cellStyle}>
                    <code style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'var(--color-warning-muted)', color: 'var(--color-warning)' }}>
                      {row.threshold}
                    </code>
                  </td>
                  <td style={cellStyle}>{row.action}</td>
                  <td style={cellStyle}>{row.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Dashboard Only (No Alert)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Individual error occurrences', 'Performance metrics (latency, vitals)', 'Traffic patterns', 'AI API costs (unless at hard limit)', 'Resource utilisation'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Alert Hygiene</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Every alert links to a runbook', 'Alert on rate of change, not absolutes', 'Review monthly — delete unactioned alerts', 'Slack webhooks from Sentry + uptime', 'No PagerDuty until on-call rotations'].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- AI Feature Monitoring ---- */}
      <Section title="AI Feature Monitoring">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Every AI call logs model, tokens, duration, and feature name. A bug causing retry loops runs up a bill
          fast — you need to see it.
        </p>
        <Code>{`logger.info({
  model: 'claude-sonnet-4-6',
  inputTokens: response.usage.input_tokens,
  outputTokens: response.usage.output_tokens,
  feature: 'showcase_generation',
  userId,
  durationMs,
  cacheReadTokens: response.usage.cache_read_input_tokens,
}, 'ai_call_completed');`}</Code>
        <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          {[
            { metric: 'Daily Cost', desc: 'By feature', icon: '$' },
            { metric: 'Latency', desc: 'p50 / p75 / p95', icon: 'ms' },
            { metric: 'Rate Limit', desc: 'Alert at 80%', icon: '%' },
            { metric: 'Quality', desc: 'Automated + user feedback', icon: 'Q' },
          ].map((m) => (
            <div key={m.metric} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary-muted)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, margin: '0 auto 8px' }}>
                {m.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{m.metric}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{m.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Dashboard Layout ---- */}
      <Section title="Observability Dashboard Layout">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          A well-organised dashboard answers: Is the app healthy? Where are the problems? What changed?
        </p>
        <div
          style={{
            border: '2px solid var(--color-border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderBottom: '1px solid var(--color-border)' }}>
            {[
              { label: 'Uptime', value: '99.9%', color: 'var(--color-success)' },
              { label: 'Error Rate', value: '0.3%', color: 'var(--color-success)' },
              { label: 'p95 Latency', value: '420ms', color: 'var(--color-warning)' },
              { label: 'AI Cost (24h)', value: '$2.40', color: 'var(--color-primary)' },
            ].map((stat, i) => (
              <div
                key={stat.label}
                style={{
                  padding: '14px 16px',
                  textAlign: 'center',
                  borderRight: i < 3 ? '1px solid var(--color-border)' : 'none',
                  background: 'var(--color-bg-alt)',
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, marginTop: 4 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Content rows */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {/* Error tracking panel */}
            <div style={{ padding: 16, borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Error Tracking (Sentry)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { error: 'TypeError: Cannot read props...', count: 12, trend: 'new' },
                  { error: 'RateLimitError: 429', count: 5, trend: 'resolved' },
                  { error: 'DB connection timeout', count: 2, trend: 'regressed' },
                ].map((e) => (
                  <div key={e.error} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: 4, background: 'var(--color-surface)' }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{e.error}</span>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)' }}>{e.count}x</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 8, background: e.trend === 'new' ? 'var(--color-error-muted)' : e.trend === 'regressed' ? 'var(--color-warning-muted)' : 'var(--color-success-muted)', color: e.trend === 'new' ? 'var(--color-error)' : e.trend === 'regressed' ? 'var(--color-warning)' : 'var(--color-success)' }}>
                        {e.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Web Vitals panel */}
            <div style={{ padding: 16, borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Web Vitals (p75)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { metric: 'LCP', value: '1.8s', budget: '2.5s', status: 'good' },
                  { metric: 'INP', value: '150ms', budget: '200ms', status: 'good' },
                  { metric: 'CLS', value: '0.05', budget: '0.1', status: 'good' },
                  { metric: 'First-load JS', value: '180KB', budget: '200KB', status: 'warn' },
                ].map((v) => (
                  <div key={v.metric} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{v.metric}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: v.status === 'good' ? 'var(--color-success)' : 'var(--color-warning)' }}>{v.value}</span>
                      <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>/ {v.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI monitoring panel */}
            <div style={{ padding: 16, borderRight: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                AI Feature Costs (24h)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { feature: 'Showcase generation', cost: '$1.20', calls: 15 },
                  { feature: 'CLAUDE.md generation', cost: '$0.80', calls: 8 },
                  { feature: 'Skill classification', cost: '$0.40', calls: 120 },
                ].map((f) => (
                  <div key={f.feature} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: 4, background: 'var(--color-surface)' }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{f.feature}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{f.calls} calls</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)' }}>{f.cost}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Health check panel */}
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Health Checks
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { dep: 'Database (Neon)', status: 'ok' },
                  { dep: 'Blob Storage (Vercel)', status: 'ok' },
                  { dep: 'Claude API', status: 'ok' },
                  { dep: 'Email (Resend)', status: 'ok' },
                ].map((h) => (
                  <div key={h.dep} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{h.dep}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 8, background: 'var(--color-success-muted)', color: 'var(--color-success)' }}>
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Health Check Endpoint ---- */}
      <Section title="Health Check Endpoint">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Only check dependencies that would prevent the app from working. If analytics is down, the app still works.
        </p>
        <Code>{`// app/api/health/route.ts
export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {};

  try {
    await db.execute(sql\`SELECT 1\`);
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  const healthy = Object.values(checks).every(v => v === 'ok');
  return Response.json(
    { status: healthy ? 'healthy' : 'degraded', checks },
    { status: healthy ? 200 : 503 }
  );
}`}</Code>
      </Section>

      {/* ---- Next.js Specifics ---- */}
      <Section title="Next.js Integration">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>instrumentation.ts</h4>
            <Code>{`export async function register() {
  if (process.env.NEXT_RUNTIME
      === 'nodejs') {
    await import('./src/lib/sentry.server');
  }
  if (process.env.NEXT_RUNTIME
      === 'edge') {
    await import('./src/lib/sentry.edge');
  }
}`}</Code>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>Error Boundaries</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Place at feature boundaries, not just root',
                'error.tsx per route that fetches data',
                'Server Action errors need explicit capture',
                'Sentry auto-captures if configured',
                'Middleware errors need edge-specific init',
              ].map((t) => (
                <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'Sentry live with source maps, releases, user context',
            'Structured logger outputs JSON with request IDs',
            'Correlation ID in middleware, included in all logs',
            'Health check endpoint verifies critical deps only',
            'Uptime monitor pings health check',
            'No passwords, tokens, or PII in log output',
            'Web Vitals collection active',
            'AI calls log model, tokens, duration, feature',
            'Alerts for error rate + health check failure',
            'Alerts route to Slack with runbook links',
            'instrumentation.ts for Node + Edge runtimes',
            'Performance budgets: LCP 2.5s, INP 200ms, CLS 0.1',
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

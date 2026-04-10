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

const routingVariants = [
  { suffix: ':nitro', purpose: 'Speed-critical', use: 'User-facing, real-time UI', color: 'var(--color-error)' },
  { suffix: ':floor', purpose: 'Cost-critical', use: 'Batch processing, background tasks', color: 'var(--color-success)' },
  { suffix: ':free', purpose: 'Zero cost', use: 'Development, prototyping', color: 'var(--color-primary)' },
  { suffix: ':exacto', purpose: 'Tool accuracy', use: 'Function calling, tool use', color: 'var(--color-brand)' },
  { suffix: ':online', purpose: 'Web search', use: 'Grounded responses with citations', color: 'var(--color-secondary)' },
  { suffix: '(default)', purpose: 'Balanced', use: 'General production workloads', color: 'var(--color-text-muted)' },
];

const fallbackChain = [
  { provider: 'Anthropic', model: 'claude-sonnet-4', role: 'Primary', color: 'var(--color-primary)' },
  { provider: 'OpenAI', model: 'gpt-4o', role: 'Fallback 1', color: 'var(--color-secondary)' },
  { provider: 'Google', model: 'gemini-2.5-pro', role: 'Fallback 2', color: 'var(--color-brand)' },
];

const providerPreferences = [
  { field: 'price', order: 'asc', desc: 'Route to cheapest provider first' },
  { field: 'latency', order: 'asc', desc: 'Route to fastest provider first' },
  { field: 'throughput', order: 'desc', desc: 'Route to highest capacity provider' },
];

const costStrategies = [
  { strategy: ':floor for background', desc: 'Routes to cheapest available provider', savings: 'Up to 60%', color: 'var(--color-success)' },
  { strategy: ':free for development', desc: 'Zero cost, lower rate limits', savings: '100%', color: 'var(--color-success)' },
  { strategy: 'Fallback to cheaper', desc: 'models: [claude-sonnet, gpt-4o-mini]', savings: '5-20x', color: 'var(--color-warning)' },
  { strategy: 'BYOK high-volume', desc: 'Direct provider pricing, no markup', savings: '5.5%', color: 'var(--color-primary)' },
  { strategy: 'Prompt caching', desc: 'Sticky routing enables provider-level caching', savings: 'Up to 90%', color: 'var(--color-brand)' },
];

const errorCodes = [
  { code: '400', meaning: 'Bad request', strategy: 'Fix the request. Do not retry.', color: 'var(--color-error)' },
  { code: '401', meaning: 'Invalid API key', strategy: 'Configuration error. Fail hard.', color: 'var(--color-error)' },
  { code: '402', meaning: 'Insufficient credits', strategy: 'Alert, top up. Do not retry.', color: 'var(--color-error)' },
  { code: '408', meaning: 'Request timeout', strategy: 'Retry once with simpler prompt.', color: 'var(--color-warning)' },
  { code: '429', meaning: 'Rate limited', strategy: 'Exponential backoff + jitter.', color: 'var(--color-warning)' },
  { code: '502', meaning: 'Provider error', strategy: 'Auto-retries with fallback chain.', color: 'var(--color-primary)' },
  { code: '503', meaning: 'Provider unavailable', strategy: 'Fallback chain handles this.', color: 'var(--color-primary)' },
];

const sdkOptions = [
  { name: 'OpenAI SDK', recommended: true, desc: 'Most portable. Change baseURL to switch away.', code: 'import OpenAI from \'openai\';' },
  { name: '@openrouter/sdk', recommended: false, desc: 'OpenRouter-specific features, generation metadata.', code: 'import OpenRouter from \'@openrouter/sdk\';' },
  { name: 'AI SDK Provider', recommended: false, desc: 'For Vercel AI SDK projects. createOpenRouter() provider.', code: 'import { createOpenRouter } from \'@openrouter/ai-sdk-provider\';' },
];

export function AiOpenrouterShowcase() {
  return (
    <div>
      {/* ---- Intro Banner ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>OpenRouter</strong> is a unified gateway to 500+ AI models from 60+ providers through a single API key. OpenAI SDK-compatible. Change the <code style={{ fontSize: 12, padding: '1px 4px', borderRadius: 3, background: 'var(--color-bg-alt)' }}>baseURL</code> and you are connected to Anthropic, Google, Meta, Mistral, and more.
        </p>
      </div>

      {/* ---- Model Routing / Fallback Chain ---- */}
      <Section title="Fallback Chain">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Never rely on a single model in production. OpenRouter tries models in order, falling back on provider errors (502, 503).
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {fallbackChain.map((f, i) => (
            <div key={f.provider} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  padding: '16px 24px',
                  borderRadius: 8,
                  background: 'var(--color-surface)',
                  border: `2px solid ${f.color}`,
                  minWidth: 180,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: f.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{f.role}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{f.provider}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{f.model}</div>
              </div>
              {i < fallbackChain.length - 1 && (
                <div style={{ fontSize: 18, color: 'var(--color-text-muted)', fontWeight: 300 }}>{'>'}</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <CodeBlock>{`models: [
  'anthropic/claude-sonnet-4',
  'openai/gpt-4o',
  'google/gemini-2.5-pro',
]`}</CodeBlock>
        </div>
      </Section>

      {/* ---- Routing Variants ---- */}
      <Section title="Routing Variants">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Append a suffix to any model ID to optimise for speed, cost, or capability.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 12 }}>
          {routingVariants.map((v) => (
            <div
              key={v.suffix}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `3px solid ${v.color}`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: v.color, fontFamily: 'monospace', marginBottom: 6 }}>{v.suffix}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{v.purpose}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{v.use}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Provider Preference Matrix ---- */}
      <Section title="Provider Preference Matrix">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Control how OpenRouter selects among providers for the same model. Set sorting and explicit provider ordering.
        </p>
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 80px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Sort Field</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Order</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Description</span>
          </div>
          {providerPreferences.map((p, i) => (
            <div
              key={p.field}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 80px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>{p.field}</span>
              <span style={{ fontSize: 12, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{p.order}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{p.desc}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Zero Data Retention (ZDR)</div>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>
            Set <code style={{ fontSize: 11, padding: '1px 4px', borderRadius: 3, background: 'var(--color-bg-alt)' }}>data_collection: &apos;deny&apos;</code> when processing PII or sensitive data. Provider deletes data after processing.
          </p>
        </div>
      </Section>

      {/* ---- Cost Comparison ---- */}
      <Section title="Cost Optimisation Strategies">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {costStrategies.map((s) => (
            <div
              key={s.strategy}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${s.color}`,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', minWidth: 180 }}>{s.strategy}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', flex: 1 }}>{s.desc}</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: s.color,
                  padding: '4px 10px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.savings}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Error Handling ---- */}
      <Section title="Error Handling">
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 160px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Code</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Meaning</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Strategy</span>
          </div>
          {errorCodes.map((e, i) => (
            <div
              key={e.code}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 160px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: e.color, fontFamily: 'monospace' }}>{e.code}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{e.meaning}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{e.strategy}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- SDK Options ---- */}
      <Section title="SDK Options">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {sdkOptions.map((sdk) => (
            <div
              key={sdk.name}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: sdk.recommended ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{sdk.name}</span>
                {sdk.recommended && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--color-primary)', color: '#FFFFFF', textTransform: 'uppercase' }}>Recommended</span>
                )}
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 8px', lineHeight: 1.5 }}>{sdk.desc}</p>
              <code style={{ fontSize: 11, color: 'var(--color-text-body)', fontFamily: 'monospace' }}>{sdk.code}</code>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

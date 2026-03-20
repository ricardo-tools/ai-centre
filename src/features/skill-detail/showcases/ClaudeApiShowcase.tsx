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

export function ClaudeApiShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Pair with <strong>eval-driven-development</strong> (evaluate AI output quality),{' '}
          <strong>observability</strong> (monitor token usage and costs in production), and{' '}
          <strong>frontend-architecture</strong> (keep AI calls in infrastructure services, not UI or use cases).
        </p>
      </div>

      {/* ---- Architecture Placement ---- */}
      <Section title="Architecture Placement">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          The Claude API is an infrastructure service — like a database or email provider. It never lives in UI
          components or use cases. The use case decides <em>what</em> to generate; the service decides <em>how</em> to
          call the API.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0,
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          {[
            { layer: 'UI Component', desc: 'Displays streaming text, progress, results', color: 'var(--color-primary-muted)', arrow: true },
            { layer: 'Server Action / API Route', desc: 'Validates input, calls use case', color: 'var(--color-bg-alt)', arrow: true },
            { layer: 'Use Case', desc: 'Orchestrates business logic, delegates AI to service', color: 'var(--color-bg-alt)', arrow: true },
            { layer: 'AI Infrastructure Service', desc: 'Manages Anthropic SDK, prompt templates, retries', color: 'var(--color-success-muted)', arrow: true },
            { layer: 'Anthropic Claude API', desc: 'External service — messages.create(), stream(), batches', color: 'var(--color-warning-muted)', arrow: false },
          ].map((item) => (
            <div key={item.layer}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 20px',
                  background: item.color,
                }}
              >
                <div style={{ minWidth: 180 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>
                    {item.layer}
                  </span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.desc}</span>
              </div>
              {item.arrow && (
                <div style={{ textAlign: 'center', fontSize: 16, color: 'var(--color-text-muted)', padding: '2px 0' }}>
                  |
                </div>
              )}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 12, fontStyle: 'italic' }}>
          Only the AI Infrastructure Service layer imports @anthropic-ai/sdk.
        </p>
      </Section>

      {/* ---- Prompt Template Anatomy ---- */}
      <Section title="Prompt Template Anatomy">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Prompts are code artifacts — structured, testable, and versionable. Never inline strings in API calls.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Structured Template
            </div>
            <Code>{`interface PromptInput {
  skillTitle: string;
  skillContent: string;
  audience: string;
}

function buildPrompt(input: PromptInput) {
  return [
    \`Generate showcase for "\${input.skillTitle}".\`,
    \`Target: \${input.audience}\`,
    '',
    'Specification:',
    input.skillContent,
    '',
    'Requirements:',
    '- Practical examples with code',
    '- Before/after comparisons',
    '- Clear headings',
  ].join('\\n');
}`}</Code>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '2px solid var(--color-error)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Inline String (Banned)
            </div>
            <Code>{`// Prompt buried in API call
const response = await client
  .messages.create({
    messages: [{
      role: 'user',
      content: \`Generate a showcase
        for \${title}. Here is the
        content: \${content}.
        Make it good.\`
    }],
  });

// Untestable, unversionable,
// unreviewable`}</Code>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {['Typed input interface', 'Builder function', 'Array join (not template literal)', 'Snapshot-testable', 'Versionable in git'].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: 12,
                background: 'var(--color-primary-muted)',
                color: 'var(--color-primary)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </Section>

      {/* ---- Streaming vs Batch Comparison ---- */}
      <Section title="Streaming vs Batch">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 20,
            marginBottom: 20,
          }}
        >
          {/* Streaming */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
              Streaming (Real-Time)
            </h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
              Server-Sent Events / ReadableStream. User sees tokens arrive in real time.
            </p>
            <Code>{`// Server: Route Handler
const stream = await client
  .messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user',
      content: prompt }],
  });

// Pipe content_block_delta events
// to a ReadableStream response`}</Code>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['< 1s first token', 'UX for long generation', 'Showcase pages', 'CLAUDE.md generation'].map((tag) => (
                <span key={tag} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, background: 'var(--color-success-muted)', color: 'var(--color-success)', fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {/* Batch */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
              Batches API (Async)
            </h4>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
              Submit many requests at once. 50% cost reduction. Results within 24 hours.
            </p>
            <Code>{`const batch = await client
  .messages.batches.create({
    requests: items.map((item, i) => ({
      custom_id: \`item-\${i}\`,
      params: {
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user',
          content: buildPrompt(item) }],
      },
    })),
  });`}</Code>
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['50% cost savings', '50+ items', '24h turnaround OK', 'Bulk classification'].map((tag) => (
                <span key={tag} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, background: 'var(--color-warning-muted)', color: 'var(--color-warning)', fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Tool Use Flow ---- */}
      <Section title="Tool Use Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Tool use enables agentic workflows — Claude calls functions you define to search, query, or take actions.
          The conversation loops until the model produces a final text response.
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
            { step: '1', label: 'User sends message', detail: 'Initial request with tool definitions', bg: 'var(--color-bg-alt)' },
            { step: '2', label: 'Claude responds with tool_use block', detail: 'Model decides which tool to call and with what input', bg: 'var(--color-primary-muted)' },
            { step: '3', label: 'Your code executes the tool', detail: 'Validate inputs, call the function, get results', bg: 'var(--color-success-muted)' },
            { step: '4', label: 'Feed tool_result back to Claude', detail: 'JSON results become context for the next turn', bg: 'var(--color-bg-alt)' },
            { step: '5', label: 'Loop or final response', detail: 'Claude calls more tools or produces end_turn text', bg: 'var(--color-warning-muted)' },
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
                  background: 'var(--color-primary)',
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
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Tool Definition</h4>
            <Code>{`{
  name: 'search_skills',
  description: 'Search the skill library
    by keyword.',
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      limit: { type: 'number' },
    },
    required: ['query'],
  },
}`}</Code>
          </div>
          <div style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Design Principles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Descriptions matter more than names',
                'Return JSON, not prose',
                '5-10 tools ideal, accuracy drops past 20',
                'Validate inputs before executing',
              ].map((p) => (
                <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Model Selection / Cost Optimization Tiers ---- */}
      <Section title="Cost Optimization Tiers">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Choose model per task, not per project. Match cost and quality to the job.
        </p>
        <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid var(--color-border)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Tier', 'Model', 'Best For', 'Relative Cost'].map((h) => (
                  <th key={h} style={headerCellStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { tier: 'Premium', model: 'claude-opus-4-6', use: 'Deep reasoning, architecture analysis', cost: '$$$$' },
                { tier: 'Standard', model: 'claude-sonnet-4-6', use: 'Complex generation (showcases, CLAUDE.md)', cost: '$$' },
                { tier: 'Economy', model: 'claude-haiku-4-5', use: 'Classification, extraction, tagging', cost: '$' },
                { tier: 'Bulk', model: 'Haiku via Batches API', use: '50+ items, 24h turnaround acceptable', cost: '$0.50' },
              ].map((row) => (
                <tr key={row.tier}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{row.tier}</td>
                  <td style={cellStyle}>
                    <code style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'var(--color-bg-alt)' }}>
                      {row.model}
                    </code>
                  </td>
                  <td style={cellStyle}>{row.use}</td>
                  <td style={{ ...cellStyle, fontWeight: 600, color: 'var(--color-primary)' }}>{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Prompt Caching', savings: 'Up to 90%', when: 'Repeated system prompts > 1024 tokens' },
            { label: 'Batches API', savings: '50%', when: 'Bulk processing, non-real-time' },
            { label: 'App-Side Cache', savings: '100%', when: 'Identical requests within time window' },
          ].map((s) => (
            <div key={s.label} style={{ padding: 14, borderRadius: 8, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>{s.savings}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{s.when}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Extended Thinking ---- */}
      <Section title="Extended Thinking">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Use For</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Multi-step reasoning (architecture analysis)', 'Tasks where showing reasoning matters (audits)', 'When initial attempts produce poor results'].map((t) => (
                <span key={t} style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-error)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>Do Not Use For</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Simple generation, classification, extraction', 'Streaming UX where speed matters', 'Tasks that already succeed without thinking'].map((t) => (
                <span key={t} style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
        <Code>{`const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 16000,
  thinking: { type: 'enabled', budget_tokens: 10000 },
  messages: [{ role: 'user', content: complexPrompt }],
});

// Response contains thinking + text blocks
for (const block of response.content) {
  if (block.type === 'thinking') console.log('Reasoning:', block.thinking);
  if (block.type === 'text') console.log('Answer:', block.text);
}`}</Code>
      </Section>

      {/* ---- Error Handling / Retry & Resilience ---- */}
      <Section title="Retry and Resilience Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          AI-specific failures need specific strategies. Generic retry logic misses critical error modes.
        </p>
        <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Error', 'Status', 'Strategy'].map((h) => (
                  <th key={h} style={headerCellStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { error: 'Rate Limited', status: '429', strategy: 'Exponential backoff. Check retry-after header. Queue if persistent.' },
                { error: 'Overloaded', status: '529', strategy: 'Retry after 30-60s. Fall back to different model.' },
                { error: 'Context Too Long', status: '400', strategy: 'Truncate, summarise, or chunk the input.' },
                { error: 'Content Filtered', status: '400', strategy: 'Rephrase prompt. Check for policy violations in input.' },
                { error: 'Invalid API Key', status: '401', strategy: 'Configuration error. Fail hard, do not retry.' },
                { error: 'Timeout', status: '--', strategy: 'Set 60-120s timeout. Retry once, then fail gracefully.' },
              ].map((row) => (
                <tr key={row.error}>
                  <td style={{ ...cellStyle, fontWeight: 600 }}>{row.error}</td>
                  <td style={cellStyle}>
                    <code style={{ fontSize: 11, padding: '2px 6px', borderRadius: 4, background: 'var(--color-bg-alt)' }}>
                      {row.status}
                    </code>
                  </td>
                  <td style={cellStyle}>{row.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Code>{`async function callClaudeWithFallback(prompt: string) {
  try {
    return await withRetry(
      () => client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
      { maxRetries: 2, baseDelayMs: 2000 }
    );
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      // Fallback to cheaper, less-loaded model
      return client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });
    }
    throw error;
  }
}`}</Code>
      </Section>

      {/* ---- Prompt Caching ---- */}
      <Section title="Prompt Caching">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Cache large repeating context blocks for up to 90% input token savings. The cache lives ~5 minutes of
          inactivity, refreshed on each hit.
        </p>
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'stretch',
            marginBottom: 16,
          }}
        >
          {[
            { label: 'Min Size', value: '1,024 tokens', note: 'Shorter blocks are not cached' },
            { label: 'TTL', value: '~5 min', note: 'Refreshed on each cache hit' },
            { label: 'Break Even', value: '2+ hits', note: 'Creation costs slightly more than normal read' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)', margin: '6px 0' }}>{item.value}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.note}</div>
            </div>
          ))}
        </div>
        <Code>{`const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 4096,
  system: [{
    type: 'text',
    text: largeSystemPrompt,  // e.g. 5000 tokens
    cache_control: { type: 'ephemeral' },
  }],
  messages: [{ role: 'user', content: userQuestion }],
});

// Check cache usage
const { cache_read_input_tokens,
        cache_creation_input_tokens } = response.usage;`}</Code>
      </Section>

      {/* ---- Testing AI Code ---- */}
      <Section title="Testing AI-Dependent Code">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          AI responses are non-deterministic. Test the integration, not the content. Mock at the service boundary.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { strategy: 'Mock at boundary', desc: 'Inject a mock AIService into use cases. Tests never hit real API.', tag: 'Unit tests' },
            { strategy: 'Snapshot prompts', desc: 'Assert prompt templates include expected content — title, audience, structure.', tag: 'Integration' },
            { strategy: 'Eval runs', desc: 'Periodic generation against fixed inputs, scored against criteria. Track quality over time.', tag: 'Quality CI' },
          ].map((item) => (
            <div key={item.strategy} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: 'var(--color-primary-muted)', color: 'var(--color-primary)', marginBottom: 8, display: 'inline-block' }}>
                {item.tag}
              </span>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{item.strategy}</h4>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate Checklist">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
          }}
        >
          {[
            'AI calls go through infrastructure service',
            'Prompts are structured template functions',
            'Structured output validated with schema (Zod)',
            'Model selected per task, not globally',
            'Long generation streams to UI',
            'Error handling: 429, 529, 400, timeout',
            'Non-critical AI failures degrade gracefully',
            'AI service mockable for testing',
            'Token usage logged per call',
            'API key from env var, never hardcoded',
            'Prompt caching for repeated context >1024 tokens',
            'Prompt templates have snapshot tests',
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

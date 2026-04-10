'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const capabilities = [
  { name: 'Text Generation', maturity: 'Production', cost: '$0.25-$15/1M tokens', icon: 'T', color: 'var(--color-primary)' },
  { name: 'Image Generation', maturity: 'Production', cost: '$0.01-$0.10/image', icon: 'I', color: 'var(--color-secondary)' },
  { name: 'Speech-to-Text', maturity: 'Production', cost: '$0.006/min', icon: 'S', color: 'var(--color-success)' },
  { name: 'Text-to-Speech', maturity: 'Production', cost: '$0.015/1K chars', icon: 'A', color: 'var(--color-brand)' },
  { name: 'Vision / OCR', maturity: 'Production', cost: '$0.25-$5/1M tokens', icon: 'V', color: 'var(--color-primary)' },
  { name: 'Video Generation', maturity: 'Partial', cost: '$0.05-$1.00/clip', icon: 'V', color: 'var(--color-warning)' },
  { name: 'Audio / Music', maturity: 'Partial', cost: '$0.01-$0.50/clip', icon: 'M', color: 'var(--color-warning)' },
  { name: 'Embeddings', maturity: 'Production', cost: '$0.02-$0.13/1M tokens', icon: 'E', color: 'var(--color-success)' },
  { name: 'Data Extraction', maturity: 'Production', cost: '$0.25-$5/1M tokens', icon: 'D', color: 'var(--color-primary)' },
  { name: 'Code Generation', maturity: 'Production', cost: '$0.25-$15/1M tokens', icon: 'C', color: 'var(--color-secondary)' },
  { name: 'Agents / Workflows', maturity: 'Partial', cost: 'Variable', icon: 'W', color: 'var(--color-warning)' },
  { name: 'Moderation', maturity: 'Production', cost: '$0.01-$0.50/1M tokens', icon: 'M', color: 'var(--color-success)' },
  { name: 'Fine-tuning', maturity: 'Partial', cost: '$3-$25/1M train tokens', icon: 'F', color: 'var(--color-warning)' },
  { name: 'Multimodal', maturity: 'Partial', cost: 'Variable', icon: 'X', color: 'var(--color-warning)' },
];

const maturityColors: Record<string, string> = {
  Production: 'var(--color-success)',
  Partial: 'var(--color-warning)',
  Experimental: 'var(--color-error)',
};

const decisionTree = [
  { step: '1', label: 'Prompting', effort: 'Hours', when: 'Task can be described in instructions + examples', color: 'var(--color-success)' },
  { step: '2', label: 'RAG', effort: 'Days', when: 'Model needs access to your specific knowledge/data', color: 'var(--color-warning)' },
  { step: '3', label: 'Fine-tuning', effort: 'Weeks', when: 'Model needs domain-specific style, format, or vocabulary', color: 'var(--color-error)' },
];

const modelTiers = [
  { tier: 'Small', examples: 'Haiku / GPT-4o-mini / Gemini Flash', tasks: 'Classification, extraction, tagging', color: 'var(--color-success)' },
  { tier: 'Medium', examples: 'Sonnet / GPT-4o / Gemini Pro', tasks: 'Generation, summarisation, analysis', color: 'var(--color-warning)' },
  { tier: 'Large', examples: 'Opus / o1 / Gemini Ultra', tasks: 'Complex reasoning, architecture, research', color: 'var(--color-error)' },
];

const pipelineSteps = [
  { label: 'Audio File', type: 'input' },
  { label: 'Speech-to-Text', type: 'step' },
  { label: 'Validate transcript', type: 'gate' },
  { label: 'Text Generation', type: 'step' },
  { label: 'Validate summary', type: 'gate' },
  { label: 'Structured Extraction', type: 'step' },
  { label: 'Schema check', type: 'gate' },
  { label: 'Meeting Notes', type: 'output' },
];

const coreRules = [
  { num: 1, rule: 'Know the capability map', desc: 'Match your problem to the right category before proposing AI' },
  { num: 2, rule: 'Prompting > RAG > Fine-tuning', desc: 'Each step is 10x more effort. Start simple.' },
  { num: 3, rule: 'Smallest model that works', desc: 'Measure quality first, then optimise cost. 5-20x savings between tiers.' },
  { num: 4, rule: 'AI calls are infrastructure', desc: 'Behind an interface, called by use cases. Swap providers freely.' },
  { num: 5, rule: 'Design for failure', desc: 'Validate with schemas, set timeouts, have fallbacks, retry with backoff.' },
  { num: 6, rule: 'Cache aggressively', desc: 'Prompts, embeddings, and generated assets should all be cached.' },
  { num: 7, rule: 'Measure everything', desc: 'Latency, cost, quality, failure rate, token usage per feature.' },
  { num: 8, rule: 'Human-in-the-loop', desc: 'Start with human review, remove only when evals prove quality.' },
];

export function AiCapabilitiesShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This is the decision framework. For implementation, see{' '}
          <strong>ai-claude</strong> (Anthropic SDK), <strong>ai-openrouter</strong> (OpenRouter gateway), <strong>ai-fal</strong> (fal.ai media generation).
        </p>
      </div>

      {/* ---- Capability Map Grid ---- */}
      <Section title="Capability Map (14 Categories)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Quick-reference for AI capability categories. Maturity indicates production readiness and provider availability.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 12 }}>
          {capabilities.map((cap) => (
            <div
              key={cap.name}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `3px solid ${cap.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: cap.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#FFFFFF',
                  }}
                >
                  {cap.icon}
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: maturityColors[cap.maturity],
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  {cap.maturity}
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{cap.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{cap.cost}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Maturity Levels ---- */}
      <Section title="Maturity Levels">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { level: 'Production', desc: 'Reliable, well-documented, predictable costs, multiple providers', color: 'var(--color-success)' },
            { level: 'Partial', desc: 'Works for common cases, edge cases exist, fewer providers, less predictable costs', color: 'var(--color-warning)' },
            { level: 'Experimental', desc: 'Impressive demos, not yet reliable for production use', color: 'var(--color-error)' },
          ].map((m) => (
            <div
              key={m.level}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${m.color}`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  background: m.color,
                  margin: '0 auto 8px',
                }}
              />
              <div style={{ fontSize: 14, fontWeight: 700, color: m.color, marginBottom: 8 }}>{m.level}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Decision Tree: Prompting → RAG → Fine-tuning ---- */}
      <Section title="Decision Tree: Start Simple, Scale Up">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Each step is an order of magnitude more effort. Prove the simpler approach is insufficient before moving down.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {decisionTree.map((d, i) => (
            <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  padding: '16px 24px',
                  borderRadius: 8,
                  background: 'var(--color-surface)',
                  border: `2px solid ${d.color}`,
                  minWidth: 200,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>
                    {d.step}
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-heading)' }}>{d.label}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: d.color, marginBottom: 4 }}>Effort: {d.effort}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{d.when}</div>
              </div>
              {i < decisionTree.length - 1 && (
                <div style={{ fontSize: 18, color: 'var(--color-text-muted)', fontWeight: 300 }}>{'>'}</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Model Tiers ---- */}
      <Section title="Model Size Tiers">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Use the smallest model that works. If the cheaper model achieves 90%+ quality, use it. Cost difference between tiers: 5-20x.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {modelTiers.map((t) => (
            <div
              key={t.tier}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${t.color}`,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: t.color, minWidth: 70 }}>{t.tier}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)', minWidth: 280, fontFamily: 'monospace' }}>{t.examples}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.tasks}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Pipeline Pattern: Meeting Intelligence ---- */}
      <Section title="Pipeline Pattern: Meeting Intelligence">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Capabilities compose. Each validation step catches failures early. A 95% reliable step chained 4 times gives 81% end-to-end reliability.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          {pipelineSteps.map((s, i) => (
            <div key={`${s.label}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  padding: '10px 16px',
                  borderRadius: s.type === 'gate' ? 16 : 8,
                  background: s.type === 'gate' ? 'var(--color-warning)' : s.type === 'input' || s.type === 'output' ? 'var(--color-primary)' : 'var(--color-surface)',
                  border: s.type === 'step' ? '1px solid var(--color-border)' : 'none',
                  color: s.type === 'gate' || s.type === 'input' || s.type === 'output' ? '#FFFFFF' : 'var(--color-text-heading)',
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </div>
              {i < pipelineSteps.length - 1 && (
                <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{'>'}</span>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Core Rules Summary ---- */}
      <Section title="Core Rules Summary">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 12 }}>
          {coreRules.map((r) => (
            <div
              key={r.num}
              style={{
                display: 'flex',
                gap: 12,
                padding: '14px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                {r.num}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 2 }}>{r.rule}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'Right capability category chosen',
            'Simplest approach tried first',
            'Smallest sufficient model selected',
            'AI calls go through infrastructure service',
            'All outputs validated (schema / human)',
            'Failure modes handled (timeouts, rate limits)',
            'Fallbacks exist (cheaper model, cache)',
            'Caching implemented for repeated calls',
            'Metrics tracked per capability',
            'Human review in place or evaluated',
            'Token usage minimised',
            'Multi-step pipelines have validation',
          ].map((item) => (
            <div
              key={item}
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
              <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

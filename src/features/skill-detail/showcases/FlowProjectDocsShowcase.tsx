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

const diataxisQuadrants = [
  {
    category: 'Tutorial',
    purpose: 'Learning-oriented, guided experience',
    tone: '"Let me show you..."',
    example: 'Build your first dashboard',
    color: 'var(--color-primary)',
  },
  {
    category: 'How-to Guide',
    purpose: 'Task-oriented, assumes competence',
    tone: '"To do X, do Y"',
    example: 'How to add a custom theme',
    color: 'var(--color-success)',
  },
  {
    category: 'Reference',
    purpose: 'Complete technical description',
    tone: 'Factual, exhaustive',
    example: 'Configuration options',
    color: 'var(--color-warning)',
  },
  {
    category: 'Explanation',
    purpose: 'Understanding, connects concepts',
    tone: 'Discursive, contextual',
    example: 'Why we use the Result pattern',
    color: 'var(--color-secondary)',
  },
];

export function FlowProjectDocsShowcase() {
  return (
    <div>
      {/* ---- Companion Info ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Opinion companion for flow.</strong> Docs are a webapp route at /docs (not a separate site).
          Diataxis structure, MDX authoring, React Flow diagrams with dagre auto-layout.
          Updated after plan completion, not per task.
        </p>
      </div>

      {/* ---- Diataxis Quadrant ---- */}
      <Section title="Diataxis Quadrant">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Every documentation page belongs to exactly one of four categories. Mixing learning content with reference content serves neither audience.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {diataxisQuadrants.map((q) => (
            <div
              key={q.category}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${q.color}`,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: q.color, marginBottom: 8 }}>{q.category}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-heading)', marginBottom: 4 }}>{q.purpose}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: 8 }}>{q.tone}</div>
              <div
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  border: '1px solid var(--color-border)',
                  display: 'inline-block',
                  color: 'var(--color-text-body)',
                }}
              >
                {q.example}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- MDX Authoring ---- */}
      <Section title="MDX Authoring">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Markdown with JSX. Embed actual React components from the project with mocked data instead of screenshots.
          Screenshots rot the moment the UI changes; components update with the codebase.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MDX with Live Components</h4>
            <CodeBlock>{`import { Button } from '@/platform/ui/Button';

## Primary Button

<Button variant="primary" size="md">
  Click me
</Button>

The primary button uses
var(--color-primary) and scales
across three sizes.`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Page Metadata</h4>
            <CodeBlock>{`export const metadata = {
  title: 'How to Add a Custom Theme',
  description: 'Step-by-step guide...',
};

export const docMeta = {
  category: 'guide',
  status: 'published',
  tags: ['theming', 'design-system'],
  lastUpdated: '2026-03-26',
  prerequisites: ['Getting Started'],
  related: ['/docs/reference/arch'],
};`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- React Flow Diagrams ---- */}
      <Section title="Interactive Diagrams">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '2px solid var(--color-primary)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>React Flow + dagre</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Auto-layout prevents node overlap', 'Architecture diagrams', 'Data flow visualisation', 'Theme-aware (light/night)', 'NOT elkjs (group node issues in v12)'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-primary)' }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '2px solid var(--color-warning)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-warning)', marginBottom: 8 }}>Mermaid (sequence only)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {['Sequence diagrams (lifelines)', 'Version-controlled, diffable', 'Renders in-browser', 'Theme-aware (light/night)', 'Rerenders on theme change'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-warning)' }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Interactive Patterns ---- */}
      <Section title="Interactive Doc Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 8 }}>
          {[
            { pattern: 'Animated sections', desc: 'Fade-in + translate on scroll (Motion)', color: 'var(--color-primary)' },
            { pattern: 'Diagram walkthroughs', desc: 'GSAP timeline highlighting nodes', color: 'var(--color-secondary)' },
            { pattern: 'Expandable sections', desc: 'Motion height + fade for reference', color: 'var(--color-success)' },
            { pattern: 'Code blocks', desc: 'Copy button + "Copied!" toast', color: 'var(--color-warning)' },
            { pattern: 'Live components', desc: 'Actual React components with mocks', color: 'var(--color-brand)' },
            { pattern: 'Three-column layout', desc: 'Nav / content / code (Stripe pattern)', color: 'var(--color-text-muted)' },
          ].map((p) => (
            <div
              key={p.pattern}
              style={{
                padding: '12px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `3px solid ${p.color}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 2 }}>{p.pattern}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Minimum Viable Docs ---- */}
      <Section title="Minimum Viable Documentation (Priority Order)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { rank: 1, name: 'Getting Started / Quick Start', desc: 'Zero to running in under 5 minutes' },
            { rank: 2, name: 'How-to Guides', desc: 'Top 5-10 tasks users perform' },
            { rank: 3, name: 'API / Config Reference', desc: 'Auto-generated where possible, hand-written for nuance' },
            { rank: 4, name: 'Architecture Overview', desc: 'One page with interactive diagrams' },
            { rank: 5, name: 'Troubleshooting / FAQ', desc: 'Top 10 questions from real users' },
            { rank: 6, name: 'Changelog', desc: 'What changed, when, and why it matters' },
          ].map((d) => (
            <div
              key={d.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)', minWidth: 24 }}>{d.rank}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', minWidth: 200 }}>{d.name}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{d.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- CI Pipeline ---- */}
      <Section title="CI Pipeline">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { step: '1', name: 'Vale Lint', desc: 'docs/**/*.mdx', blocking: true, color: 'var(--color-error)' },
            { step: '2', name: 'Next.js Build', desc: 'Includes docs', blocking: true, color: 'var(--color-error)' },
            { step: '3', name: 'Preview Deploy', desc: 'preview-url/docs', blocking: false, color: 'var(--color-primary)' },
            { step: '4', name: 'Sync Check', desc: 'Code without docs', blocking: false, color: 'var(--color-warning)' },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${s.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: s.color, textTransform: 'uppercase', marginBottom: 4 }}>Step {s.step}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8 }}>{s.desc}</div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: s.blocking ? 'var(--color-error)' : 'var(--color-text-muted)',
                  color: 'var(--color-bg-surface)',
                  textTransform: 'uppercase',
                }}
              >
                {s.blocking ? 'Blocking' : 'Advisory'}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

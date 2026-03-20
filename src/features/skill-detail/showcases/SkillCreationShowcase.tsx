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

const GoodBadRow = ({ good, bad }: { good: string; bad: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 12 }}>
    <div
      style={{
        padding: 14,
        borderRadius: 8,
        background: 'var(--color-surface)',
        border: '2px solid var(--color-success)',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Good</div>
      <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.6 }}>{good}</span>
    </div>
    <div
      style={{
        padding: 14,
        borderRadius: 8,
        background: 'var(--color-surface)',
        border: '2px solid var(--color-error)',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-error)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bad</div>
      <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.6 }}>{bad}</span>
    </div>
  </div>
);

const requiredSections = [
  { name: 'Frontmatter', description: 'YAML metadata: name (kebab-case), description with trigger conditions', icon: '1' },
  { name: 'When to Use', description: 'Explicit list of situations — "Apply this skill when:" + concrete triggers', icon: '2' },
  { name: 'Core Rules', description: '3-10 numbered, verifiable rules with rationale and code examples', icon: '3' },
  { name: 'Banned Patterns', description: 'Anti-patterns with alternatives — what NOT to do and what to do instead', icon: '4' },
  { name: 'Quality Gate', description: 'Pass/fail checklist run before delivering — concrete, not aspirational', icon: '5' },
];

const lineGuidelines = [
  { range: 'Under 200', label: 'Ideal', description: 'Always-loaded skills (via CLAUDE.md)', color: 'var(--color-success)' },
  { range: '200-500', label: 'Acceptable', description: 'On-demand skills (loaded per task)', color: 'var(--color-warning)' },
  { range: 'Over 500', label: 'Split Required', description: 'Extract reference data into companion file', color: 'var(--color-error)' },
];

export function SkillCreationShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Use alongside{' '}
          <strong>skill-review</strong> (systematic evaluation against this rubric) and{' '}
          <strong>strategic-context</strong> (managing context when writing long skills). The skill-review skill uses skill-creation as its external grading rubric.
        </p>
      </div>

      {/* ---- Skill Anatomy Diagram ---- */}
      <Section title="Skill File Anatomy">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', marginBottom: 16, lineHeight: 1.6 }}>
          A skill is a standalone <code style={{ fontSize: 12, padding: '2px 6px', borderRadius: 4, background: 'var(--color-bg-alt)' }}>.md</code> file that teaches an AI agent how to do one thing well. Not documentation — a behavioural contract.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
          {/* Left: Structure diagram */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {requiredSections.map((s) => (
              <div
                key={s.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 6,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderLeft: '4px solid var(--color-primary)',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{s.description}</div>
                </div>
              </div>
            ))}
            <div
              style={{
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-bg-alt)',
                border: '1px dashed var(--color-border)',
                fontSize: 12,
                color: 'var(--color-text-muted)',
                textAlign: 'center',
              }}
            >
              + Custom sections between Core Rules and Banned Patterns
            </div>
          </div>

          {/* Right: Frontmatter example */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Frontmatter Example</h3>
            <CodeBlock>{`---
name: frontend-architecture
description: >
  7-layer architecture for React applications.
  Apply when creating components, widgets, or
  screen configs. Covers folder structure, naming
  conventions, and data flow patterns.
---`}</CodeBlock>

            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, marginTop: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reference Companion Frontmatter</h3>
            <CodeBlock>{`---
name: brand-tokens-reference
type: reference
companion_to: brand-design-system
description: >
  Token lookup tables for the brand design system.
  This is a reference file, not a behavioural skill.
---`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Core Rules Visual ---- */}
      <Section title="The 7 Core Rules">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 16 }}>
          {[
            { num: 1, title: 'One skill, one concern', desc: 'Governs one domain. If two unrelated rule sets exist, split into two skills. Composability over monoliths.' },
            { num: 2, title: 'Every instruction must be verifiable', desc: 'If you cannot look at output and determine whether the instruction was followed, it is too vague.' },
            { num: 3, title: 'Lead with what to do', desc: 'State the positive instruction first. Add anti-patterns as secondary catch for common failures.' },
            { num: 4, title: 'Include the why', desc: 'A rule with motivation is followed in edge cases. Without it, rules are applied too literally or ignored.' },
            { num: 5, title: 'Concrete examples beat abstract rules', desc: '1-3 examples per major pattern. Show correct and incorrect with markers.' },
            { num: 6, title: 'Keep it under 500 lines', desc: 'Adherence degrades with length. Under 200 for always-loaded. Extract reference data to companions.' },
            { num: 7, title: 'Structure for scanning', desc: 'Headers, bullets, code blocks. No prose wall longer than 3 sentences. Bulleted rules get followed.' },
          ].map((rule) => (
            <div
              key={rule.num}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--color-secondary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {rule.num}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>{rule.title}</h4>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{rule.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Good vs Bad Rule Comparison ---- */}
      <Section title="Good vs Bad Rules">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Every sentence should change what the agent produces. Compare these pairs:
        </p>
        <GoodBadRow
          good={'"Use 2-space indentation. One component per file. Name files PascalCase.tsx"'}
          bad={'"Write clean, well-structured code"'}
        />
        <GoodBadRow
          good={'"Use var(--color-surface) for card backgrounds." Banned: hardcoded hex values.'}
          bad={'"Don\'t use hex colors. Don\'t use rgb. Don\'t use hsl." (No positive alternative)'}
        />
        <GoodBadRow
          good={'"Never import from other feature folders. Why: features must be independently deletable."'}
          bad={'"Never import from other feature folders." (No rationale — applied too literally)'}
        />
        <GoodBadRow
          good={'"Banned: any type in TypeScript -> use proper typing or unknown"'}
          bad={'"Follow TypeScript best practices" (Unverifiable, teaches nothing)'}
        />
      </Section>

      {/* ---- When to Use Section Template ---- */}
      <Section title="&quot;When to Use&quot; Template">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Without this section, the agent guesses whether the skill is relevant. Include both positive and negative triggers.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Include</h4>
            <CodeBlock>{`## When to Use

Apply this skill when:
- Creating or modifying React components
- Adding a new page to the application
- Reviewing frontend code for architecture
- Splitting a monolithic file into layers`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Also Include (When Boundaries Are Unclear)</h4>
            <CodeBlock>{`Do NOT use this skill for:
- Backend API route handlers (see backend-patterns)
- Database schema changes (see data-modelling)
- Styling decisions (see brand-design-system)`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Skill File Structure ---- */}
      <Section title="Skill File Structure">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Custom sections go between Core Rules and Banned Patterns, keeping the flow: what to do, how it works in detail, what not to do, final check.
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: 20,
            borderRadius: 8,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          {[
            { label: 'Frontmatter (YAML)', type: 'required', desc: 'name + description with triggers' },
            { label: 'When to Use', type: 'required', desc: '"Apply this skill when:" + list' },
            { label: 'Core Rules', type: 'required', desc: '3-10 numbered, verifiable, with examples' },
            { label: 'Custom Section A', type: 'optional', desc: 'e.g., "Folder Structure", "Color Tokens"' },
            { label: 'Custom Section B', type: 'optional', desc: 'e.g., "Data Flow", "Typography Scale"' },
            { label: 'Banned Patterns', type: 'required', desc: 'Anti-pattern + alternative pairs' },
            { label: 'Quality Gate', type: 'required', desc: 'Pass/fail checklist before delivery' },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 6,
                background: item.type === 'required' ? 'var(--color-primary-muted)' : 'var(--color-bg-alt)',
                border: item.type === 'required' ? '1px solid var(--color-primary)' : '1px dashed var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.label}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: item.type === 'required' ? 'var(--color-primary)' : 'var(--color-border)',
                    color: item.type === 'required' ? '#FFFFFF' : 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.type}
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Line Count Guidelines ---- */}
      <Section title="Line Count Guidelines">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {lineGuidelines.map((g) => (
            <div
              key={g.range}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${g.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: g.color, marginBottom: 4 }}>{g.range}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>lines — {g.label}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{g.description}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Anti-Patterns ---- */}
      <Section title="Skill Writing Anti-Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 12 }}>
          {[
            { pattern: 'Vague aspirational language', example: '"Write high-quality code" teaches nothing', fix: 'Every sentence should change the output' },
            { pattern: 'Duplicating framework docs', example: 'Explaining how React hooks work', fix: 'Explain how YOUR hooks should be structured' },
            { pattern: 'Urgency markers on every rule', example: '"CRITICAL: You MUST..." on everything', fix: 'Reserve emphasis for the 1-2 truly critical rules' },
            { pattern: 'Rules without examples', example: 'Abstract descriptions of code patterns', fix: 'If the rule governs code structure, show the structure' },
            { pattern: 'Negative-only instructions', example: '"Don\'t do X" lists with no alternatives', fix: 'Always provide what to do instead' },
            { pattern: 'Monolithic skills', example: '1000-line skill covering 3 domains', fix: 'Split into focused, composable pieces' },
          ].map((ap) => (
            <div
              key={ap.pattern}
              style={{
                padding: 14,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid var(--color-error)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{ap.pattern}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6, fontStyle: 'italic' }}>{ap.example}</div>
              <div style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 500 }}>{ap.fix}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate Checklist ---- */}
      <Section title="Quality Gate Checklist">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Run through this checklist before publishing any skill. Every item is a pass/fail check, not an aspirational goal.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
            gap: 8,
          }}
        >
          {[
            'Has YAML frontmatter with name and description',
            'Description includes explicit trigger conditions',
            'Has "When to Use" with concrete triggers',
            'Has "Core Rules" with numbered, verifiable rules',
            'Non-obvious rules include a rationale (why)',
            'Code-governing rules include examples',
            'Has "Banned Patterns" with alternatives for each ban',
            'Has "Quality Gate" with pass/fail checklist items',
            'Under 500 lines (under 200 if always-loaded)',
            'Governs one concern only',
            'All cross-references resolve to actual skill files',
            'No vague, unverifiable instructions remain',
          ].map((item) => (
            <div
              key={item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  border: '2px solid var(--color-primary)',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Banned Pattern Format ---- */}
      <Section title="Banned Pattern Format">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Every ban must include what to do instead. A ban without a redirect leaves the agent stuck.
        </p>
        <CodeBlock>{`## Banned Patterns

- [X] Hardcoded hex colors in component styles
      -> use var(--color-*) tokens
- [X] any type in TypeScript
      -> use proper typing or unknown
- [X] Data fetching inside stateless components
      -> data belongs in widget hooks`}</CodeBlock>
      </Section>
    </div>
  );
}

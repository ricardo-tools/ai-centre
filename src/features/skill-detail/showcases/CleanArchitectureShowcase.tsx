'use client';
import { CodeBlock } from '@/platform/components/CodeBlock';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
      {children}
    </section>
  );
}

function DiagramBox({ label, color, width, children }: { label: string; color: string; width: string; children?: React.ReactNode }) {
  return (
    <div style={{
      width,
      padding: '12px 16px',
      borderRadius: 8,
      background: color,
      border: '2px solid var(--color-border)',
      textAlign: 'center',
      margin: '0 auto',
    }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>{label}</span>
      {children}
    </div>
  );
}

function SubHeading({ children }: { children: string }) {
  return (
    <h3 style={{
      fontSize: 14,
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      color: 'var(--color-text-muted)',
      marginBottom: 12,
      marginTop: 24,
    }}>
      {children}
    </h3>
  );
}

function DoNotBox({ doItems, dontItems }: { doItems: string[]; dontItems: string[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div style={{
        padding: 16,
        borderRadius: 8,
        border: '2px solid var(--color-success)',
        background: 'var(--color-surface)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success)', marginBottom: 10 }}>DO</div>
        {doItems.map((item) => (
          <div key={item} style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8, display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--color-success)', flexShrink: 0 }}>&#10003;</span>
            {item}
          </div>
        ))}
      </div>
      <div style={{
        padding: 16,
        borderRadius: 8,
        border: '2px solid var(--color-danger)',
        background: 'var(--color-surface)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 10 }}>DON&apos;T</div>
        {dontItems.map((item) => (
          <div key={item} style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8, display: 'flex', gap: 8 }}>
            <span style={{ color: 'var(--color-danger)', flexShrink: 0 }}>&#10007;</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ textAlign: 'center', padding: '4px 0', fontSize: 18, color: 'var(--color-text-muted)' }}>
      &#8595;
    </div>
  );
}

export function CleanArchitectureShowcase() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      {/* Companion Skills Callout */}
      <div style={{
        padding: 16,
        borderRadius: 8,
        background: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        marginBottom: 32,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>&#128279;</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>
            Companion Skills
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Use with <strong>coding-standards</strong> (function design, Result pattern), <strong>backend-patterns</strong> (repositories, handlers, error hierarchy), and <strong>frontend-architecture</strong> (widget/component structure). Clean Architecture defines <em>where code lives</em>; these define <em>how code is written</em>.
          </div>
        </div>
      </div>

      {/* Section 1: Dependency Rule */}
      <Section title="The Dependency Rule">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 24 }}>
          Dependencies point inward. Outer layers depend on inner layers, never the reverse. Domain objects know nothing about databases, frameworks, or UI.
        </p>
        <div style={{
          position: 'relative',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}>
          {/* Outermost ring */}
          <div style={{
            width: '100%',
            maxWidth: 540,
            padding: 20,
            borderRadius: 16,
            border: '2px dashed var(--color-border)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: 12, textAlign: 'center' }}>
              Framework / Transport Layer
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
              {['Server Actions', 'API Routes', 'Pages (thin wiring)'].map((item) => (
                <div key={item} style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', fontSize: 11, textAlign: 'center', color: 'var(--color-text-body)' }}>
                  {item}
                </div>
              ))}
            </div>

            {/* Middle ring */}
            <div style={{
              padding: 16,
              borderRadius: 12,
              border: '2px solid var(--color-primary)',
              background: 'var(--color-surface)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--color-primary)', marginBottom: 12, textAlign: 'center' }}>
                Use Cases / Application Layer
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {['publishSkillUseCase()', 'generateProjectUseCase()', 'Mappers (toDomain)', 'Repositories (interface)'].map((item) => (
                  <div key={item} style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-primary)', fontSize: 11, textAlign: 'center', color: 'var(--color-text-body)' }}>
                    {item}
                  </div>
                ))}
              </div>

              {/* Innermost ring */}
              <div style={{
                padding: 16,
                borderRadius: 10,
                border: '3px solid var(--color-accent)',
                background: 'var(--color-bg-alt)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: 'var(--color-accent)', marginBottom: 8 }}>
                  Domain Layer
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['Skill', 'User', 'Archetype', 'EmailAddress', 'Result<T,E>'].map((item) => (
                    <span key={item} style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--color-surface)', border: '1px solid var(--color-accent)', fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Arrow labels */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              <span style={{ fontSize: 16 }}>&#8594;</span> Dependencies point <strong>inward</strong>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              Inner layers <strong>never</strong> import outer layers
            </div>
          </div>
        </div>
      </Section>

      {/* Section 2: Platform vs Features */}
      <Section title="Platform vs Features">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Features are vertical slices — independently buildable, independently deletable. Platform is shared horizontal infrastructure.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Platform */}
          <div style={{
            padding: 20,
            borderRadius: 10,
            border: '2px solid var(--color-primary)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 12 }}>
              platform/
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { folder: 'components/', desc: 'Button, Card, Modal' },
                { folder: 'domain/', desc: 'Skill, User, Archetype' },
                { folder: 'shell/', desc: 'TopNav, Sidebar, AppShell' },
                { folder: 'auth/', desc: 'Session, middleware, OTP' },
                { folder: 'db/', desc: 'Schema, client, migrations' },
                { folder: 'hooks/', desc: 'useBreakpoint, useTheme' },
                { folder: 'lib/', desc: 'Blob helpers, zip utils' },
              ].map((item) => (
                <div key={item.folder} style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <code style={{ color: 'var(--color-primary)', fontWeight: 600, flexShrink: 0, fontFamily: 'monospace', fontSize: 11 }}>{item.folder}</code>
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.desc}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: 'var(--color-bg-alt)', fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Shared by multiple features. Stable. Rarely changes.
            </div>
          </div>

          {/* Features */}
          <div style={{
            padding: 20,
            borderRadius: 10,
            border: '2px solid var(--color-accent)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 12 }}>
              features/
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'publish-skill/', files: 'action.ts, use-case.ts, validation.ts' },
                { name: 'skill-library/', files: 'widgets/, use-skill-library.ts' },
                { name: 'skill-detail/', files: 'showcases/, widgets/' },
                { name: 'generate-project/', files: 'action.ts, use-case.ts, widgets/' },
              ].map((feature) => (
                <div key={feature.name} style={{ padding: 8, borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
                  <code style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-accent)', fontFamily: 'monospace' }}>{feature.name}</code>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{feature.files}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: 10, borderRadius: 6, background: 'var(--color-bg-alt)', fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              Each feature is a vertical slice. Deletable without breaking others.
            </div>
          </div>
        </div>

        <SubHeading>Import Direction</SubHeading>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: 20,
          background: 'var(--color-surface)',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '2px solid var(--color-accent)', fontSize: 13, fontWeight: 600, color: 'var(--color-accent)' }}>Feature A</div>
          <div style={{ fontSize: 20, color: 'var(--color-text-muted)' }}>&#8594;</div>
          <div style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '2px solid var(--color-primary)', fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>Platform</div>
          <div style={{ fontSize: 20, color: 'var(--color-text-muted)' }}>&#8592;</div>
          <div style={{ padding: '10px 20px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '2px solid var(--color-accent)', fontSize: 13, fontWeight: 600, color: 'var(--color-accent)' }}>Feature B</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-danger)', fontWeight: 600, marginTop: 8 }}>
          Feature A &#10007;&#8594; Feature B &mdash; features never import from each other
        </div>
      </Section>

      {/* Section 3: Rich Domain Objects */}
      <Section title="Rich Domain Objects">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Domain entities enforce their own invariants. State changes happen through intention-revealing methods, not direct property assignment.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <SubHeading>Rich Domain Object</SubHeading>
            <CodeBlock language="ts" title="Rich domain object">{`class Skill {
  readonly id: string;
  readonly slug: string;
  private _currentDraft: SkillVersion | null;

  publish(userId: string): Result<SkillVersion, NoDraftError> {
    if (!this._currentDraft)
      return Err(new NoDraftError(this.id));
    return Ok(
      this._currentDraft.markPublished(userId)
    );
  }

  get isPublished(): boolean {
    return this._currentPublished !== null;
  }
}`}</CodeBlock>
          </div>
          <div>
            <SubHeading>Anemic Object (Avoid)</SubHeading>
            <CodeBlock language="ts" title="Anemic object (avoid)">{`// Anyone can set this to anything
skill.status = 'published';
skill.publishedAt = new Date();

// No validation, no invariant enforcement
// No intention-revealing method names
// Logic scattered across multiple files
// No type safety on state transitions`}</CodeBlock>
            <div style={{ marginTop: 12, padding: 12, borderRadius: 6, border: '1px solid var(--color-danger)', background: 'var(--color-surface)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-danger)', fontWeight: 600 }}>Problems:</div>
              <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.8 }}>
                <li>Invalid states are possible</li>
                <li>Business rules scattered everywhere</li>
                <li>No stack trace on failures</li>
              </ul>
            </div>
          </div>
        </div>

        <SubHeading>Entity vs Value Object</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-primary)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Entity</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8 }}>
              <li>Has identity (UUID)</li>
              <li>Has lifecycle</li>
              <li>Two entities with same data but different IDs are <strong>different</strong></li>
              <li>Example: <code style={{ fontFamily: 'monospace', fontSize: 11 }}>Skill</code>, <code style={{ fontFamily: 'monospace', fontSize: 11 }}>User</code></li>
            </ul>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-accent)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 }}>Value Object</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8 }}>
              <li>No identity</li>
              <li>Equal if data is equal</li>
              <li>Self-validating at construction</li>
              <li>Example: <code style={{ fontFamily: 'monospace', fontSize: 11 }}>EmailAddress</code>, <code style={{ fontFamily: 'monospace', fontSize: 11 }}>Version</code></li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Section 4: Result Pattern Flow */}
      <Section title="Result Pattern Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Expected failures return <code style={{ fontFamily: 'monospace', fontSize: 13 }}>Result&lt;T, E&gt;</code>. Errors carry stack traces via Error subclasses. No try/catch for control flow.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center' }}>
          <DiagramBox label="Domain Method" color="var(--color-bg-alt)" width="280px">
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>skill.publish(userId)</div>
          </DiagramBox>
          <Arrow />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, width: '100%', maxWidth: 440 }}>
            <div style={{ padding: 12, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>Ok(value)</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>SkillVersion returned</div>
            </div>
            <div style={{ padding: 12, borderRadius: 8, border: '2px solid var(--color-danger)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)' }}>Err(error)</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>NoDraftError with stack</div>
            </div>
          </div>
          <Arrow />
          <DiagramBox label="Use Case" color="var(--color-bg-alt)" width="280px">
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Pattern-match on result.ok</div>
          </DiagramBox>
          <Arrow />
          <DiagramBox label="Server Action (Handler)" color="var(--color-bg-alt)" width="280px">
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Translate to client response</div>
          </DiagramBox>
        </div>

        <SubHeading>Type Definitions</SubHeading>
        <CodeBlock language="ts" title="Result type definitions">{`type Result<T, E extends Error> =
  | { readonly ok: true;  readonly value: T }
  | { readonly ok: false; readonly error: E };

const Ok  = <T>(value: T): Result<T, never> =>
  ({ ok: true, value });
const Err = <E extends Error>(error: E): Result<never, E> =>
  ({ ok: false, error });

// Error values are Error subclasses => carry stack traces
class NoDraftError extends DomainError {
  constructor(skillId: string) {
    super(\`Skill \${skillId} has no draft to publish\`);
  }
}`}</CodeBlock>
      </Section>

      {/* Section 5: Use Case Orchestration */}
      <Section title="Use Case Orchestration">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Use cases coordinate the steps for a business operation. They call domain methods, persist changes, and trigger side effects.
        </p>

        <div style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
          {/* Left: flow diagram */}
          <div style={{ flex: '0 0 200px', display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center' }}>
            {[
              { step: '1. Load', desc: 'Repository loads domain object' },
              { step: '2. Validate', desc: 'Guard clauses for preconditions' },
              { step: '3. Execute', desc: 'Call domain methods' },
              { step: '4. Persist', desc: 'Save via repository' },
              { step: '5. Side Effects', desc: 'Audit log, cache, events' },
              { step: '6. Return', desc: 'Result<T, E> to caller' },
            ].map((item, i) => (
              <div key={item.step}>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: 'var(--color-bg-alt)',
                  border: '1px solid var(--color-border)',
                  textAlign: 'center',
                  width: 200,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{item.step}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.desc}</div>
                </div>
                {i < 5 && <Arrow />}
              </div>
            ))}
          </div>

          {/* Right: code example */}
          <div style={{ flex: 1 }}>
            <CodeBlock language="ts" title="Use case orchestration">{`// features/publish-skill/use-case.ts
export async function publishSkillUseCase(
  skillId: string,
  userId: string,
): Promise<Result<SkillVersion, NotFoundError | NoDraftError>> {

  // 1. Load
  const skill = await skillRepo.findById(skillId);

  // 2. Validate
  if (!skill) return Err(new NotFoundError('Skill', skillId));

  // 3. Execute domain method
  const published = skill.publish(userId);
  if (!published.ok) return published; // propagate

  // 4. Persist
  await skillRepo.saveVersion(published.value);

  // 5. Side effects
  await auditRepo.log('skill', skillId, 'published', userId);
  await generateShowcaseHtml(skill);

  // 6. Return
  return published;
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 6: Thin Server Actions */}
      <Section title="Thin Server Actions">
        <DoNotBox
          doItems={[
            'Validate input with Zod schema',
            'Call a single use case function',
            'Pattern-match on Result for response',
            'Call revalidatePath for cache invalidation',
            'Return { success, error/data }',
          ]}
          dontItems={[
            'Query the database directly',
            'Contain business logic or orchestration',
            'Use try/catch for expected failures',
            'Import from another feature',
            'Have more than ~15 lines of code',
          ]}
        />

        <SubHeading>Correct Pattern</SubHeading>
        <CodeBlock language="ts" title="Thin server action">{`'use server';
export async function publishSkill(input: unknown) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  const { skillId } = PublishSkillSchema.parse(input);
  const result = await publishSkillUseCase(skillId, session.userId);

  if (!result.ok) {
    console.error(result.error.stack);
    return { success: false, error: result.error.message };
  }

  revalidatePath('/skills');
  return { success: true, version: result.value.version };
}`}</CodeBlock>
      </Section>

      {/* Section 7: Mapper Boundary */}
      <Section title="Mappers at Boundaries">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          External data shapes never leak into domain objects. Mappers sit at each boundary and convert between shapes.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 24,
          background: 'var(--color-surface)',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}>
          <div style={{ padding: '10px 16px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', textAlign: 'center' }}>
            DB Row<br /><span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>SkillRow</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>toDomain() &#8594;</div>
          <div style={{ padding: '10px 16px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '2px solid var(--color-primary)', fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', textAlign: 'center' }}>
            Domain Object<br /><span style={{ fontSize: 10 }}>Skill</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-accent)', fontWeight: 600 }}>&#8594; toDTO()</div>
          <div style={{ padding: '10px 16px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', textAlign: 'center' }}>
            Client Response<br /><span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>SkillDTO</span>
          </div>
        </div>

        <SubHeading>Three Conversion Directions</SubHeading>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Direction</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Use</th>
            </tr>
          </thead>
          <tbody>
            {[
              { method: 'toDomain(row)', direction: 'Persistence -> Domain', use: 'Loading from DB' },
              { method: 'toDTO(entity)', direction: 'Domain -> Transport', use: 'Returning from action/API' },
              { method: 'toPersistence(entity)', direction: 'Domain -> Persistence', use: 'Saving to DB' },
            ].map((row) => (
              <tr key={row.method} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11, color: 'var(--color-primary)' }}>{row.method}</td>
                <td style={{ padding: '8px 12px', color: 'var(--color-text-body)' }}>{row.direction}</td>
                <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Section 8: Cross-Cutting Concerns */}
      <Section title="Cross-Cutting Concerns">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Concern</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Where</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Why</th>
            </tr>
          </thead>
          <tbody>
            {[
              { concern: 'Input validation', where: 'Server Action', why: 'Reject bad input early' },
              { concern: 'Business rules', where: 'Domain / Use Case', why: 'Domain enforces invariants' },
              { concern: 'Authorization', where: 'Use Case', why: '"Can this user?" is business logic' },
              { concern: 'Audit logging', where: 'Use Case', why: 'Part of business flow' },
              { concern: 'Error handling', where: 'Use Case returns Result', why: 'Action translates to response' },
              { concern: 'Cache invalidation', where: 'Server Action', why: 'revalidatePath is transport' },
            ].map((row) => (
              <tr key={row.concern} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--color-text-heading)' }}>{row.concern}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11, color: 'var(--color-primary)' }}>{row.where}</td>
                <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>{row.why}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Section 9: Where Does It Go? */}
      <Section title="Where Does It Go?">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}>
          {[
            { q: 'Used by multiple features?', a: 'platform/' },
            { q: 'Used by one feature only?', a: 'features/<name>/' },
            { q: 'Domain entity (Skill, User)?', a: 'platform/domain/' },
            { q: 'Shared React hook?', a: 'platform/hooks/' },
            { q: 'A server action?', a: 'features/<name>/action.ts' },
            { q: 'A use case?', a: 'features/<name>/use-case.ts' },
            { q: 'A mapper for DB -> domain?', a: 'Adjacent to repository' },
            { q: 'An API route?', a: 'app/api/' },
          ].map((item) => (
            <div key={item.q} style={{
              padding: 12,
              borderRadius: 6,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.q}</div>
              <code style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-primary)', fontWeight: 600 }}>{item.a}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 10: Feature Communication */}
      <Section title="Feature-to-Feature Communication">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Features never import from each other. They communicate indirectly through platform-level shared objects and Next.js mechanisms.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { method: 'revalidatePath', desc: 'Publish-skill action calls revalidatePath(\'/skills\') to refresh skill library. No import needed.', icon: '&#128260;' },
            { method: 'Shared Domain Objects', desc: 'Both features import Skill from platform/domain/, not from each other.', icon: '&#128230;' },
            { method: 'Domain Events (future)', desc: 'A simple event bus in platform. Not yet needed.', icon: '&#128232;' },
          ].map((item) => (
            <div key={item.method} style={{
              padding: 16,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{ fontSize: 20, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 6 }}>{item.method}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

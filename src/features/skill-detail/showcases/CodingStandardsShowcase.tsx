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

function PipelineStep({ label, input, output, color }: { label: string; input: string; output: string; color: string }) {
  return (
    <div style={{
      padding: 12,
      borderRadius: 8,
      border: `2px solid ${color}`,
      background: 'var(--color-surface)',
      textAlign: 'center',
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color }}>{label}</div>
      <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 6 }}>
        <span style={{ fontFamily: 'monospace' }}>{input}</span> &#8594; <span style={{ fontFamily: 'monospace' }}>{output}</span>
      </div>
    </div>
  );
}

export function CodingStandardsShowcase() {
  return (
    <div>
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
            Use with <strong>clean-architecture</strong> (where code lives), <strong>backend-patterns</strong> (server-side patterns), and <strong>frontend-architecture</strong> (UI patterns). Coding Standards defines <em>how every function is written</em> regardless of layer.
          </div>
        </div>
      </div>

      {/* Section 1: Functional Composition Pipeline */}
      <Section title="Functional Composition Pipeline">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Functions are small because each one does one transformation. They exist as independent building blocks, not fragments extracted from a parent. The litmus test: can you use this function in a different context without modification?
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: 20,
          background: 'var(--color-surface)',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          flexWrap: 'wrap',
        }}>
          <PipelineStep label="normalizeEmail" input="raw: string" output="string" color="var(--color-primary)" />
          <div style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>&#8594;</div>
          <PipelineStep label="validateEmail" input="email: string" output="Result<string, E>" color="var(--color-accent)" />
          <div style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>&#8594;</div>
          <PipelineStep label="checkUniqueness" input="email: string" output="Promise<Result>" color="var(--color-success)" />
        </div>

        <SubHeading>Composition vs Extraction</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Composition (value in, value out)</div>
            <CodeBlock language="ts">{`const normalize = (email: string): string =>
  email.trim().toLowerCase();

const validate = (email: string): Result<string, E> => {
  const domain = email.split('@')[1];
  if (!ALLOWED.includes(domain))
    return Err(new InvalidDomainError(email));
  return Ok(email);
};

// Each function is independently reusable
async function processEmail(raw: string) {
  const normalized = normalize(raw);
  const valid = validate(normalized);
  if (!valid.ok) return valid;
  return checkUniqueness(valid.value);
}`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>Extraction (coupled fragments)</div>
            <CodeBlock language="ts">{`function processEmail(raw: string) {
  doStep1(raw);    // what does this do?
  doStep2();       // relies on step1 state
  return doStep3(); // unclear inputs/outputs
}

// Problems:
// - Helpers are coupled to parent
// - Can't use doStep2 elsewhere
// - Must read body to understand
// - State flows between steps implicitly`}</CodeBlock>
          </div>
        </div>

        <div style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 6,
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          gap: 24,
          justifyContent: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>5-25</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>lines per composable fn</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-accent)' }}>20-40</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>lines for orchestration</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-success)' }}>3-4</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>max positional params</div>
          </div>
        </div>
      </Section>

      {/* Section 2: Naming Conventions */}
      <Section title="Naming Conventions">
        <SubHeading>Consistent Verb Vocabulary</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { verb: 'get', desc: 'Synchronous lookup', example: 'getSession()' },
            { verb: 'fetch', desc: 'Async network call', example: 'fetchSkills()' },
            { verb: 'compute', desc: 'Derived value', example: 'computeScore()' },
            { verb: 'build', desc: 'Construct from parts', example: 'buildIndex()' },
            { verb: 'parse', desc: 'Convert raw input', example: 'parseSlug()' },
            { verb: 'to', desc: 'Transform shape', example: 'toSkill(row)' },
          ].map((item) => (
            <div key={item.verb} style={{
              padding: 12,
              borderRadius: 6,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}>
              <code style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{item.verb}</code>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{item.desc}</div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-body)', marginTop: 2 }}>{item.example}</div>
            </div>
          ))}
        </div>

        <SubHeading>Naming Do/Don&apos;ts</SubHeading>
        <DoNotBox
          doItems={[
            'skillVersion (full words, domain language)',
            'isPublished, hasActiveSubscription (boolean prefix)',
            'publishSkillVersion (domain verb + noun)',
            '8-25 characters per identifier',
            'id, url, html, db, config (universal abbrevs)',
          ]}
          dontItems={[
            'sv, sklVer (cryptic abbreviations)',
            'published, active (ambiguous booleans)',
            'updateStatus (vague, not domain language)',
            'x, d, tmp (except 3-line loop scope)',
            'data, info, handle, process, item (vague)',
          ]}
        />
      </Section>

      {/* Section 3: Result<T,E> Pattern */}
      <Section title="Result Pattern for Expected Failures">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Expected failures (validation, not found, permission denied) return a Result. Unexpected failures (programmer errors) throw. Error values carry stack traces via Error subclasses.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '2px solid var(--color-primary)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>Expected Failures &#8594; Result</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8 }}>
              <li>Validation errors</li>
              <li>Not found</li>
              <li>Permission denied</li>
              <li>Business rule violations</li>
            </ul>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              Composable, no try/catch, full stack traces
            </div>
          </div>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '2px solid var(--color-danger)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>Bugs &#8594; throw</div>
            <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8 }}>
              <li>Programmer errors</li>
              <li>Invariant violations</li>
              <li>Unhandled cases (assertNever)</li>
              <li>Infrastructure crashes</li>
            </ul>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              Should never happen in correct code
            </div>
          </div>
        </div>

        <SubHeading>Full Example</SubHeading>
        <CodeBlock language="ts">{`// Domain errors extend Error => stack traces captured
class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(\`\${entity} not found: \${id}\`);
  }
}

// Result type
type Result<T, E extends Error> =
  | { readonly ok: true;  readonly value: T }
  | { readonly ok: false; readonly error: E };

const Ok  = <T>(value: T): Result<T, never> => ({ ok: true, value });
const Err = <E extends Error>(error: E): Result<never, E> => ({ ok: false, error });

// Usage — total function, every input produces a value
function publish(id: string): Result<SkillVersion, NotFoundError | NoDraftError> {
  const skill = await skillRepo.findById(id);
  if (!skill) return Err(new NotFoundError('Skill', id)); // stack captured
  if (!skill.draft) return Err(new NoDraftError(id));
  return Ok(skill.publish());
}

// Caller: error has full stack for debugging
const result = publish(id);
if (!result.ok) {
  console.error(result.error.stack); // full trace
  return { success: false, error: result.error.message };
}`}</CodeBlock>
      </Section>

      {/* Section 4: Make Illegal States Unrepresentable */}
      <Section title="Make Illegal States Unrepresentable">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>Permissive (allows invalid states)</div>
            <CodeBlock language="ts">{`type Request = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: User[];
  error?: string;
};

// What fields exist in which states?
// Can data and error both be set?
// Can status be 'success' with no data?`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Discriminated Union (impossible to misuse)</div>
            <CodeBlock language="ts">{`type RequestState<T> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: T }
  | { readonly status: 'error'; readonly error: string };

// Each state carries EXACTLY its own data
// Compiler enforces correctness`}</CodeBlock>
          </div>
        </div>

        <SubHeading>Exhaustive Switch with assertNever</SubHeading>
        <CodeBlock language="ts">{`function assertNever(x: never): never {
  throw new Error(\`Unhandled case: \${JSON.stringify(x)}\`);
}

function renderState(state: RequestState<User[]>) {
  switch (state.status) {
    case 'idle':    return <EmptyState />;
    case 'loading': return <Skeleton />;
    case 'success': return <UserList users={state.data} />;
    case 'error':   return <ErrorBanner message={state.error} />;
    default:        return assertNever(state); // compile error if case missed
  }
}`}</CodeBlock>
      </Section>

      {/* Section 5: Immutability Patterns */}
      <Section title="Immutability Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Readonly by default. Mutation only as a local implementation detail inside a function that returns an immutable result.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--color-primary)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>readonly Properties</div>
            <CodeBlock language="ts">{`interface Skill {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly status:
    | 'draft'
    | 'published';
}`}</CodeBlock>
          </div>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--color-accent)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 }}>as const Literals</div>
            <CodeBlock language="ts">{`const ALLOWED_DOMAINS = [
  'ezycollect.com.au',
  'ezycollect.io',
  'sidetrade.com',
] as const;

type AllowedDomain =
  typeof ALLOWED_DOMAINS[number];`}</CodeBlock>
          </div>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--color-success)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Local Mutation OK</div>
            <CodeBlock language="ts">{`function buildIndex(
  items: readonly Item[],
): ReadonlyMap<string, Item> {
  // local mut is fine
  const map = new Map();
  for (const item of items)
    map.set(item.id, item);
  return map; // immutable
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 6: Functional Core, Imperative Shell */}
      <Section title="Functional Core, Imperative Shell">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Business logic is pure functions (same inputs = same outputs, no side effects). Side effects live in a thin orchestration layer at the edges.
        </p>

        <div style={{
          display: 'flex',
          gap: 16,
          alignItems: 'stretch',
        }}>
          {/* Functional Core */}
          <div style={{
            flex: 1,
            padding: 20,
            borderRadius: 10,
            border: '3px solid var(--color-primary)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 4 }}>Functional Core</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 12 }}>Pure, testable, no mocks needed</div>
            <CodeBlock language="ts">{`function calculateDiscount(
  subtotal: number,
  tier: 'standard' | 'premium' | 'enterprise',
  coupon: string | null,
): number {
  const tierRate = tier === 'enterprise' ? 0.15
    : tier === 'premium' ? 0.10 : 0;
  const couponRate = coupon === 'SAVE20' ? 0.20 : 0;
  return subtotal * Math.max(tierRate, couponRate);
}`}</CodeBlock>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              40-60% fewer defects per line than impure functions
            </div>
          </div>

          {/* Imperative Shell */}
          <div style={{
            flex: 1,
            padding: 20,
            borderRadius: 10,
            border: '2px dashed var(--color-border)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>Imperative Shell</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 12 }}>Thin, calls pure core</div>
            <CodeBlock language="ts">{`async function handleCheckout(orderId: string) {
  // side effect: read
  const order = await orderRepo.findById(orderId);

  // pure calculation
  const discount = calculateDiscount(
    order.subtotal,
    order.customerTier,
    order.couponCode,
  );

  // side effect: write
  await orderRepo.updateDiscount(orderId, discount);
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 7: Guard Clauses */}
      <Section title="Guard Clauses First, Then Linear Happy Path">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Guard Clauses (linear)</div>
            <CodeBlock language="ts">{`function publishSkill(
  skill: Skill, userId: string
): Result<SkillVersion, PublishError> {
  // Guards at top
  if (!skill.currentDraft)
    return Err('no_draft');
  if (skill.authorId !== userId)
    return Err('not_author');
  if (skill.currentDraft.content.length < 100)
    return Err('content_too_short');

  // Happy path — clear, linear
  const version = createPublishedVersion(
    skill.currentDraft, userId
  );
  return Ok(version);
}`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>Nested Conditionals (avoid)</div>
            <CodeBlock language="ts">{`function publishSkill(
  skill: Skill, userId: string
) {
  if (skill.currentDraft) {
    if (skill.authorId === userId) {
      if (skill.currentDraft.content.length >= 100) {
        // finally, the actual logic
        // buried three levels deep
        // hard to read, easy to miss
      }
    }
  }
}

// Max nesting: 2 levels
// 3+ levels = extract or rethink`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 8: Declarative Style */}
      <Section title="Declarative Over Imperative">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Declarative (describe structure)</div>
            <CodeBlock language="ts">{`const NAV_ITEMS: Array<NavItem & {
  requiredRole?: Role
}> = [
  { label: 'Home', path: '/' },
  { label: 'Skills', path: '/skills' },
  { label: 'Admin', path: '/admin',
    requiredRole: 'admin' },
];

const visibleNav = (role: Role) =>
  NAV_ITEMS.filter(item =>
    !item.requiredRole
    || item.requiredRole === role
  );`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>Imperative (step-by-step mutation)</div>
            <CodeBlock language="ts">{`function getNav(role: Role) {
  const items: NavItem[] = [];
  items.push({ label: 'Home', path: '/' });
  items.push({ label: 'Skills', path: '/skills' });
  if (role === 'admin') {
    items.push({
      label: 'Admin', path: '/admin'
    });
  }
  return items;
}`}</CodeBlock>
          </div>
        </div>

        <SubHeading>Chain Readability Threshold</SubHeading>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12,
          marginTop: 8,
        }}>
          <div style={{
            padding: 12,
            borderRadius: 8,
            border: '2px solid var(--color-success)',
            background: 'var(--color-surface)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-success)' }}>2-4 steps</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Chain with .map/.filter</div>
          </div>
          <div style={{
            padding: 12,
            borderRadius: 8,
            border: '2px solid var(--color-accent)',
            background: 'var(--color-surface)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-accent)' }}>5+ steps</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Named intermediates</div>
          </div>
          <div style={{
            padding: 12,
            borderRadius: 8,
            border: '2px solid var(--color-primary)',
            background: 'var(--color-surface)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>Early exit</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Use a for loop</div>
          </div>
        </div>
      </Section>

      {/* Section 9: AI-Optimised Patterns */}
      <Section title="AI-Optimised Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            {
              title: 'Locality of Reasoning',
              desc: 'Keep related logic within ~100 lines. Don\'t extract single-use helpers into separate files.',
              icon: '&#128269;',
            },
            {
              title: 'Predictable Structures',
              desc: 'Every widget, use case, and domain object follows the same template. AI pattern-matches rather than reasons.',
              icon: '&#128736;',
            },
            {
              title: 'Explicit Types at Boundaries',
              desc: 'Return type annotations on exports. Parameter types always explicit. Prevents AI inference errors.',
              icon: '&#128203;',
            },
            {
              title: 'No Magic',
              desc: 'Named constants for numbers/strings. MAX_OTP_ATTEMPTS = 3, not if (attempts > 3).',
              icon: '&#127913;',
            },
            {
              title: 'No Action at a Distance',
              desc: 'A function in file A should not implicitly affect file C. AI can\'t track implicit state propagation.',
              icon: '&#128683;',
            },
            {
              title: 'No Implicit Ordering',
              desc: 'If operations must be sequential, make it visible in structure. AI will reorder otherwise.',
              icon: '&#128295;',
            },
          ].map((item) => (
            <div key={item.title} style={{
              padding: 16,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 10: Comments That Add Value */}
      <Section title="Comments: Why and Why Not">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Example</th>
              <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600, width: 60 }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {[
              { type: 'Why', example: '// Exponential backoff to avoid overwhelming API during outages', good: true },
              { type: 'Why not', example: '// Don\'t use Promise.all — must be sequential for audit ordering', good: true },
              { type: 'Invariant', example: '// Array is always sorted by createdAt descending at this point', good: true },
              { type: 'Warning', example: '// Do not reorder — blob upload must complete before DB write', good: true },
              { type: 'Restate code', example: '// Increment the counter by one', good: false },
              { type: 'Changelog', example: '// Added 2024-03-15 by @developer', good: false },
              { type: 'Commented-out', example: '// const oldLogic = ...; (dead code)', good: false },
            ].map((row) => (
              <tr key={row.type} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--color-text-heading)' }}>{row.type}</td>
                <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-muted)' }}>{row.example}</td>
                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: row.good ? 'var(--color-success)' : 'var(--color-danger)' }}>
                  {row.good ? '&#10003;' : '&#10007;'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          <strong>&quot;Why not&quot;</strong> comments are especially critical for AI agents &mdash; they prevent an LLM from &quot;optimising&quot; code that has non-obvious constraints.
        </div>
      </Section>

      {/* Section 11: Banned Patterns Quick Reference */}
      <Section title="Banned Patterns Quick Reference">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { bad: 'any type', fix: 'unknown at boundaries, proper types elsewhere' },
            { bad: 'try/catch for control flow', fix: 'Result<T, E> for expected failures' },
            { bad: '40+ line functions', fix: 'Decompose into composable transformations' },
            { bad: '5+ positional params', fix: 'Options object with named properties' },
            { bad: 'Magic numbers/strings', fix: 'Named constants: MAX_ATTEMPTS = 3' },
            { bad: 'Direct mutation on shared objects', fix: 'readonly properties, return new values' },
            { bad: '3+ nesting levels', fix: 'Guard clauses and early returns' },
            { bad: 'Abstractions with < 3 users', fix: 'Wait for the third instance' },
          ].map((item) => (
            <div key={item.bad} style={{
              padding: 10,
              borderRadius: 6,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              gap: 8,
              fontSize: 11,
            }}>
              <span style={{ color: 'var(--color-danger)', fontWeight: 700, flexShrink: 0 }}>&#10007;</span>
              <div>
                <span style={{ color: 'var(--color-text-body)' }}>{item.bad}</span>
                <span style={{ color: 'var(--color-text-muted)' }}> &#8594; {item.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

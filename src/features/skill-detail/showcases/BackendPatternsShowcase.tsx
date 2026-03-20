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

function FlowArrow() {
  return (
    <div style={{ textAlign: 'center', padding: '4px 0', fontSize: 18, color: 'var(--color-text-muted)' }}>
      &#8595;
    </div>
  );
}

function FlowBox({ label, desc, color, width }: { label: string; desc: string; color: string; width?: string }) {
  return (
    <div style={{
      width: width ?? '100%',
      padding: '12px 16px',
      borderRadius: 8,
      border: `2px solid ${color}`,
      background: 'var(--color-surface)',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, color }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{desc}</div>
    </div>
  );
}

export function BackendPatternsShowcase() {
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
            Use with <strong>clean-architecture</strong> (where code lives), <strong>coding-standards</strong> (function design, Result pattern), and <strong>nextjs-app-router-turbopack</strong> (routing, rendering). Backend Patterns defines <em>how server-side code is structured</em>.
          </div>
        </div>
      </div>

      {/* Section 1: Handler -> Use Case -> Domain Flow */}
      <Section title="Thin Handler -> Use Case -> Domain Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 24 }}>
          The core pattern: handlers validate and delegate, use cases orchestrate, domain objects enforce invariants. Each layer has a single responsibility.
        </p>

        <div style={{
          display: 'flex',
          gap: 32,
          alignItems: 'flex-start',
        }}>
          {/* Left: Visual flow */}
          <div style={{
            flex: '0 0 260px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}>
            <FlowBox label="Handler (Server Action)" desc="Validate input, call use case, return response" color="var(--color-text-heading)" />
            <FlowArrow />
            <FlowBox label="Use Case" desc="Orchestrate: load, validate, execute, persist, side effects" color="var(--color-primary)" />
            <FlowArrow />
            <FlowBox label="Domain Object" desc="Enforce invariants, return Result<T, E>" color="var(--color-accent)" />
            <FlowArrow />
            <FlowBox label="Repository" desc="Persist via mapper, return domain objects" color="var(--color-success)" />

            <div style={{
              marginTop: 16,
              padding: 12,
              borderRadius: 6,
              background: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              width: '100%',
            }}>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.6, textAlign: 'center' }}>
                <strong>Key:</strong> Handlers are framework-coupled.<br />
                Use cases are framework-free.<br />
                When you migrate, handlers change&mdash;use cases don&apos;t.
              </div>
            </div>
          </div>

          {/* Right: Code example */}
          <div style={{ flex: 1 }}>
            <SubHeading>Thin Handler</SubHeading>
            <CodeBlock language="ts" title="Thin handler">{`'use server';
async function publishSkill(input: unknown) {
  const session = await getSession();
  if (!session)
    return { success: false, error: 'Unauthorized' };

  // 1. Validate
  const { skillId } = PublishSkillSchema.parse(input);

  // 2. Delegate to use case
  const result = await publishSkillUseCase(
    skillId, session.userId
  );

  // 3. Pattern-match on Result
  if (!result.ok) {
    console.error(result.error.stack);
    return { success: false, error: result.error.message };
  }

  // 4. Cache invalidation (transport concern)
  revalidatePath('/skills');
  return { success: true, version: result.value.version };
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 2: Repository Pattern */}
      <Section title="Repository Pattern">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Repositories abstract data access. The caller never sees raw DB shapes. When the schema changes, only the repository and mapper change.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <SubHeading>Interface (What Use Case Depends On)</SubHeading>
            <CodeBlock language="ts" title="Repository interface">{`interface SkillRepository {
  findById(id: string): Promise<Skill | null>;
  findBySlug(slug: string): Promise<Skill | null>;
  findAll(filters?: SkillFilters): Promise<Skill[]>;
  save(skill: Skill): Promise<void>;
}`}</CodeBlock>
          </div>
          <div>
            <SubHeading>Implementation (ORM-Specific)</SubHeading>
            <CodeBlock language="ts" title="Drizzle implementation">{`class DrizzleSkillRepository implements SkillRepository {
  async findById(id: string): Promise<Skill | null> {
    const row = await db.query.skills.findFirst({
      where: eq(skills.id, id),
      columns: {
        id: true, slug: true, title: true,
      },
    });
    return row ? toSkill(row) : null; // mapper!
  }
}`}</CodeBlock>
          </div>
        </div>

        <SubHeading>N+1 Prevention</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '2px solid var(--color-success)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Batch Fetch</div>
            <CodeBlock language="ts" title="Batch fetch">{`const allSkills = await skillRepo.findAll();
const authorIds = [
  ...new Set(allSkills.map(s => s.authorId))
];
const authors = await userRepo.findByIds(authorIds);
const authorMap = new Map(
  authors.map(a => [a.id, a])
);`}</CodeBlock>
          </div>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '2px solid var(--color-danger)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>N+1 (One query per item)</div>
            <CodeBlock language="ts" title="N+1 problem">{`// DON'T: queries inside a loop
for (const skill of allSkills) {
  // This fires N queries!
  skill.author = await userRepo.findById(
    skill.authorId
  );
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 3: Error Hierarchy */}
      <Section title="Error Hierarchy">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Domain errors extend Error for stack traces. Use cases return typed Results. Handlers translate to client-safe responses.
        </p>

        <div style={{
          padding: 24,
          background: 'var(--color-surface)',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
        }}>
          {/* Error class hierarchy */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: '3px solid var(--color-text-heading)',
              background: 'var(--color-bg-alt)',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--color-text-heading)',
            }}>
              DomainError extends Error
            </div>
            <div style={{ display: 'flex', gap: 6, color: 'var(--color-text-muted)', fontSize: 14 }}>
              <span>&#9484;</span>
              <span>&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;</span>
              <span>&#9516;</span>
              <span>&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;&#9472;</span>
              <span>&#9488;</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { name: 'NotFoundError', color: 'var(--color-accent)', http: '404' },
                { name: 'ValidationError', color: 'var(--color-primary)', http: '400' },
                { name: 'PermissionError', color: 'var(--color-danger)', http: '403' },
              ].map((err) => (
                <div key={err.name} style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: `2px solid ${err.color}`,
                  background: 'var(--color-surface)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: err.color }}>{err.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>HTTP {err.http}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SubHeading>Error Translation at Boundaries</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <CodeBlock language="ts" title="Result pattern in handler">{`// Use case returns Result — no try/catch
const result = await publishSkillUseCase(
  validated.skillId, session.userId
);

if (!result.ok) {
  console.error(result.error.stack); // debug
  return {
    success: false,
    error: result.error.message, // client-safe
  };
}

return { success: true, data: result.value };`}</CodeBlock>
          </div>
          <div>
            <CodeBlock language="ts" title="Error to HTTP mapping">{`// API routes — map error to HTTP status
function toHttpStatus(error: DomainError): number {
  if (error instanceof NotFoundError)   return 404;
  if (error instanceof ValidationError) return 400;
  if (error instanceof PermissionError) return 403;
  return 500;
}

// Never expose:
// - Raw database errors
// - Stack traces
// - Internal IDs`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 4: Validation Layers */}
      <Section title="Validation Layers">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Input validation happens at the boundary. Business rule validation happens in the domain. Each layer validates what it owns.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}>
          {[
            {
              layer: 'Handler (Boundary)',
              what: 'Input shape, types, format',
              how: 'Zod schema',
              example: 'z.string().min(1).max(200)',
              color: 'var(--color-text-heading)',
            },
            {
              layer: 'Use Case',
              what: 'Authorization, preconditions',
              how: 'Guard clauses returning Result',
              example: 'if (!skill) return Err(new NotFoundError(...))',
              color: 'var(--color-primary)',
            },
            {
              layer: 'Domain Object',
              what: 'Business invariants',
              how: 'Methods returning Result',
              example: 'skill.publish() -> Result<Version, NoDraftError>',
              color: 'var(--color-accent)',
            },
            {
              layer: 'Value Object',
              what: 'Self-validation at construction',
              how: 'Constructor throws on invalid',
              example: 'new EmailAddress("bad") -> InvalidDomainError',
              color: 'var(--color-success)',
            },
          ].map((item, i) => (
            <div key={item.layer} style={{
              display: 'grid',
              gridTemplateColumns: '160px 1fr 180px 1fr',
              gap: 12,
              padding: '12px 16px',
              background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
              borderRadius: i === 0 ? '8px 8px 0 0' : i === 3 ? '0 0 8px 8px' : 0,
              border: '1px solid var(--color-border)',
              borderBottom: i < 3 ? 'none' : '1px solid var(--color-border)',
              alignItems: 'center',
            }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: item.color }}>{item.layer}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{item.what}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{item.how}</div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{item.example}</div>
            </div>
          ))}
        </div>

        <SubHeading>Zod at the Boundary</SubHeading>
        <CodeBlock language="ts" title="Zod validation schema">{`const CreateSkillInput = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(1000),
});

// Handler validates, use case receives typed data
async function createSkill(input: unknown) {
  const validated = CreateSkillInput.parse(input);
  return createSkillUseCase(validated); // typed, safe
}`}</CodeBlock>
      </Section>

      {/* Section 5: Transactions */}
      <Section title="Transactions for Atomic Operations">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          When multiple writes must succeed or fail together, wrap in a transaction. Audit log writes go inside the transaction.
        </p>

        <CodeBlock language="ts" title="Atomic transaction">{`await db.transaction(async (tx) => {
  // All writes atomic
  await tx.versions.update(draftId, {
    status: 'published',
    publishedAt: now,
  });

  await tx.skills.update(skillId, {
    publishedVersionId: draftId,
  });

  // Audit log INSIDE transaction
  // Guarantees: record exists iff change succeeded
  await tx.auditLog.insert({
    entityType: 'skill',
    entityId: skillId,
    action: 'published',
    userId,
    metadata: {
      version: newVersion,
      previousVersion,
      changes: { status: { from: 'draft', to: 'published' } },
    },
  });
});`}</CodeBlock>

        <div style={{
          marginTop: 16,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 8,
        }}>
          {[
            { label: 'Who', value: 'userId', color: 'var(--color-primary)' },
            { label: 'What', value: 'entity + action', color: 'var(--color-accent)' },
            { label: 'When', value: 'timestamp', color: 'var(--color-success)' },
            { label: 'Context', value: 'metadata (diff)', color: 'var(--color-text-heading)' },
          ].map((item) => (
            <div key={item.label} style={{
              padding: 12,
              borderRadius: 6,
              border: `1px solid ${item.color}`,
              background: 'var(--color-surface)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.label}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 6: External Service Resilience */}
      <Section title="External Service Resilience">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Any external call can fail. Wrap with retry, set timeouts, and decide upfront whether failure is critical or non-critical.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '2px solid var(--color-danger)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>Critical Failure</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: 8 }}>
              If this fails, the whole operation fails.
            </div>
            <CodeBlock language="ts" title="Critical failure">{`// AI generation IS the operation
const content = await withRetry(
  () => aiService.generate(prompt)
);
// Failure = operation failure`}</CodeBlock>
          </div>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '2px solid var(--color-accent)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-accent)', marginBottom: 8 }}>Non-Critical Failure</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.6, marginBottom: 8 }}>
              Log and continue. Can be retried later.
            </div>
            <CodeBlock language="ts" title="Non-critical failure">{`try {
  const html = await withRetry(
    () => aiService.generateShowcase(content)
  );
  await skillRepo.updateShowcase(skillId, html);
} catch (error) {
  logger.error('Showcase failed', { skillId });
  // Skill still published
}`}</CodeBlock>
          </div>
        </div>

        <SubHeading>Retry with Exponential Backoff</SubHeading>
        <CodeBlock language="ts" title="Exponential backoff">{`async function withRetry<T>(
  fn: () => Promise<T>,
  options: { maxRetries?: number; baseDelayMs?: number } = {}
): Promise<T> {
  const { maxRetries = 3, baseDelayMs = 1000 } = options;
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError!;
}`}</CodeBlock>
      </Section>

      {/* Section 7: Caching Patterns */}
      <Section title="Caching Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            {
              name: 'Cache-Aside (Lazy)',
              desc: 'Check cache, miss, fetch, populate, return. Safest pattern.',
              steps: ['1. Check cache', '2. Cache miss', '3. Fetch from source', '4. Populate cache', '5. Return'],
              color: 'var(--color-primary)',
            },
            {
              name: 'Write-Through',
              desc: 'Update cache on source update. Fresh data but adds write latency.',
              steps: ['1. Write to source', '2. Write to cache', '3. Return'],
              color: 'var(--color-accent)',
            },
            {
              name: 'Framework-Native',
              desc: 'revalidatePath, revalidateTag, unstable_cache, HTTP headers.',
              steps: ['1. Mutation happens', '2. revalidatePath()', '3. Next request = fresh'],
              color: 'var(--color-success)',
            },
          ].map((pattern) => (
            <div key={pattern.name} style={{
              padding: 16,
              borderRadius: 8,
              border: `2px solid ${pattern.color}`,
              background: 'var(--color-surface)',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: pattern.color, marginBottom: 6 }}>{pattern.name}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 10 }}>{pattern.desc}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {pattern.steps.map((step) => (
                  <div key={step} style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    background: 'var(--color-bg-alt)',
                    fontSize: 10,
                    color: 'var(--color-text-body)',
                  }}>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 8,
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          fontSize: 12,
          color: 'var(--color-text-body)',
          lineHeight: 1.7,
        }}>
          <strong>Rule:</strong> Invalidation is harder than caching. Every cache entry must have a defined staleness policy. Always call <code style={{ fontFamily: 'monospace', fontSize: 11 }}>revalidatePath</code> / <code style={{ fontFamily: 'monospace', fontSize: 11 }}>revalidateTag</code> in Server Actions after mutations.
        </div>
      </Section>

      {/* Section 8: API Design */}
      <Section title="API Design (External-Facing)">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          API routes for external programmatic access only. Internal mutations use Server Actions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 2, marginBottom: 20 }}>
          {[
            { method: 'GET', path: '/api/skills', desc: 'List with filters' },
            { method: 'GET', path: '/api/skills/:slug', desc: 'Get one' },
            { method: 'POST', path: '/api/skills', desc: 'Create' },
            { method: 'PATCH', path: '/api/skills/:slug', desc: 'Update' },
            { method: 'DELETE', path: '/api/skills/:slug', desc: 'Delete' },
          ].map((route, i) => (
            <div key={route.path + route.method} style={{
              display: 'contents',
            }}>
              <div style={{
                padding: '8px 12px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderRadius: i === 0 ? '6px 0 0 0' : i === 4 ? '0 0 0 6px' : 0,
                fontFamily: 'monospace',
                fontSize: 12,
                fontWeight: 700,
                color: route.method === 'GET' ? 'var(--color-primary)' : route.method === 'POST' ? 'var(--color-success)' : route.method === 'DELETE' ? 'var(--color-danger)' : 'var(--color-accent)',
              }}>
                {route.method}
              </div>
              <div style={{
                padding: '8px 12px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderRadius: i === 0 ? '0 6px 0 0' : i === 4 ? '0 0 6px 0' : 0,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }}>
                <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-body)' }}>{route.path}</code>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{route.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <SubHeading>Consistent Response Shape</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', marginBottom: 6 }}>Success</div>
            <CodeBlock language="json">{`{
  "success": true,
  "data": { ... }
}`}</CodeBlock>
          </div>
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-danger)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 6 }}>Error</div>
            <CodeBlock language="json">{`{
  "success": false,
  "error": "Human-readable msg"
}`}</CodeBlock>
          </div>
          <div style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-primary)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6 }}>Paginated</div>
            <CodeBlock language="json">{`{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 42,
    "limit": 20,
    "offset": 0
  }
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 9: Rate Limiting */}
      <Section title="Rate Limiting">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          Protect entry points from abuse: auth endpoints, uploads, AI generation, external API routes.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <CodeBlock language="ts" title="Rate limiter">{`interface RateLimitConfig {
  max: number;        // max requests
  windowMs: number;   // time window (ms)
}

// Simple in-memory limiter
const buckets = new Map<string, {
  count: number;
  resetAt: number;
}>();

function checkRateLimit(
  key: string,
  config: RateLimitConfig
): boolean {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, {
      count: 1,
      resetAt: now + config.windowMs,
    });
    return true;
  }
  if (entry.count >= config.max) return false;
  entry.count++;
  return true;
}`}</CodeBlock>
          </div>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { endpoint: 'Auth (login/OTP)', limit: '5 req / 15 min', reason: 'Brute force prevention' },
                { endpoint: 'File upload', limit: '10 req / min', reason: 'Storage abuse' },
                { endpoint: 'AI generation', limit: '3 req / min', reason: 'Expensive compute' },
                { endpoint: 'Public API', limit: '100 req / min', reason: 'Fair usage' },
              ].map((item) => (
                <div key={item.endpoint} style={{
                  padding: 12,
                  borderRadius: 6,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>{item.endpoint}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-primary)' }}>{item.limit}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 10: Banned Patterns */}
      <Section title="Banned Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { bad: 'Business logic in handlers', fix: 'Extract to use case' },
            { bad: 'Raw DB rows from repositories', fix: 'Map to domain objects' },
            { bad: 'SELECT * by default', fix: 'Specify needed columns' },
            { bad: 'DB queries inside loops (N+1)', fix: 'Batch-fetch or relations' },
            { bad: 'Raw errors exposed to client', fix: 'Catch, log, return typed errors' },
            { bad: 'External calls without retry', fix: 'Wrap with retry + timeout' },
            { bad: 'Audit writes outside transactions', fix: 'Audit inside same transaction' },
            { bad: 'Throwing domain errors', fix: 'Return Result<T, E> instead' },
            { bad: 'API routes for internal mutations', fix: 'Use Server Actions internally' },
            { bad: 'Caching without invalidation plan', fix: 'Define staleness policy upfront' },
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

---
name: backend-patterns
description: >
  Server-side patterns for reliable, maintainable backend code. Covers
  repositories, use cases, error handling, validation, caching, resilience,
  API design, rate limiting, and audit logging. Stack-agnostic — applies to
  any ORM, database, or framework. Apply when writing server-side code:
  actions, API routes, data access, external service calls, or background
  processing.
---

# Backend Patterns

Patterns for reliable, testable server-side code aligned with clean architecture. Handlers are thin. Use cases own logic. Repositories abstract data access. Domain objects cross boundaries via mappers. Errors are typed. External calls are resilient. This skill defines *how* to implement server-side code. For *where* code lives, see **clean-architecture**.

## When to Use

Apply when writing: mutation handlers (Server Actions, API routes, controllers), data access logic, external service integrations, input validation, error handling, caching, API endpoints, rate limiting, audit logging, or background processing.

Do NOT use for: file placement (see **clean-architecture**), domain object design (see **clean-architecture**), or UI/rendering (see **frontend-architecture**).

For project structure (where files go, feature slices), see **clean-architecture**.

## Core Rules

### 1. Handlers are thin controllers

A handler (Server Action, API route, controller) does four things: validate input, call the use case, handle cache invalidation, return the result. No business logic, no direct database queries, no orchestration.

```ts
// ✅ Thin handler — validates, delegates, pattern-matches on Result
async function publishSkill(input: unknown) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  const { skillId } = PublishSkillSchema.parse(input);                  // validate
  const result = await publishSkillUseCase(skillId, session.userId);    // delegate

  if (!result.ok) {
    console.error(result.error.stack);                                  // log for debugging
    return { success: false, error: result.error.message };
  }

  invalidateCache('/skills');                                           // cache
  return { success: true, version: result.value.version };              // return
}

// ❌ Fat handler — business logic lives here
async function publishSkill(skillId: string) {
  const skill = await db.skills.findById(skillId);
  if (!skill.draftId) throw new Error('No draft');
  await db.versions.update(skill.draftId, { status: 'published' });
  await db.skills.update(skillId, { publishedVersionId: skill.draftId });
  await db.auditLog.insert({ entity: 'skill', action: 'published' });
  // This is a use case, not a handler
}
```

Why: Handlers are framework-coupled; use cases are framework-free. When you migrate frameworks, handlers change — use cases don't.

### 2. Validate at the boundary

Every server entry point validates input before passing to the use case. Use cases receive typed, validated data — never raw input.

```ts
const CreateSkillInput = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10).max(1000),
});

// Handler validates, use case receives typed data
async function createSkill(input: unknown) {
  const validated = CreateSkillInput.parse(input);
  return createSkillUseCase(validated);
}
```

### 3. Repositories return domain objects, not raw rows

Repository functions query the database and return domain objects via a mapper. The caller never sees the raw database shape. When the schema changes, only the repository and mapper change.

```ts
// ✅ Repository → mapper → domain object
async function findSkillBySlug(slug: string): Promise<Skill | null> {
  const row = await db.skills.findOne({ where: { slug }, select: ['id', 'slug', 'title'] });
  return row ? toSkill(row) : null;
}

// ❌ Repository returns raw rows
async function findSkillBySlug(slug: string) {
  return db.skills.findOne({ where: { slug } });  // raw DB shape leaks out
}
```

### 4. Select only what you need

Always specify columns. Never select all by default — reduces data transfer, prevents field leaking, avoids exposing sensitive data.

### 5. Use transactions for atomic operations

When multiple writes must succeed or fail together, wrap in a transaction.

```ts
await db.transaction(async (tx) => {
  await tx.versions.update(draftId, { status: 'published', publishedAt: now });
  await tx.skills.update(skillId, { publishedVersionId: draftId });
  await tx.auditLog.insert({
    entityType: 'skill', entityId: skillId, action: 'published',
    userId, metadata: { version, previousVersionId },
  });
});
```

### 6. Typed errors as Result values, translated at boundaries

Use cases return `Result<T, E>` for expected failures. Error values are `Error` subclasses carrying stack traces. Handlers pattern-match on the Result and translate to client-safe responses. No try/catch for control flow. Never expose raw database errors, stack traces, or internal IDs to the client.

### 7. External calls are resilient

Any external service call can fail. Wrap with retry logic, set timeouts, and decide upfront whether failure is critical (block) or non-critical (log and continue).

---

## Repository Pattern

Repositories abstract data access behind a consistent interface. Implementation uses your ORM/database client; the interface is pure TypeScript.

```ts
// Interface — what the use case depends on
interface SkillRepository {
  findById(id: string): Promise<Skill | null>;
  findBySlug(slug: string): Promise<Skill | null>;
  findAll(filters?: SkillFilters): Promise<Skill[]>;
  save(skill: Skill): Promise<void>;
}

// Implementation — uses your specific ORM/database
class DrizzleSkillRepository implements SkillRepository {
  async findById(id: string): Promise<Skill | null> {
    const row = await db.query.skills.findFirst({
      where: eq(skills.id, id),
      columns: { id: true, slug: true, title: true, description: true },
    });
    return row ? toSkill(row) : null;
  }

  async findAll(filters?: SkillFilters): Promise<Skill[]> {
    let query = db.select({ id: skills.id, slug: skills.slug, title: skills.title })
      .from(skills);

    if (filters?.isOfficial !== undefined) {
      query = query.where(eq(skills.isOfficial, filters.isOfficial));
    }

    const rows = await query;
    return rows.map(toSkill);
  }
}
```

Concrete repository functions (not classes) are fine when starting simple. Introduce the interface when you need to swap implementations.

### N+1 Prevention

Batch-fetch or use ORM relation loading. Never query inside a loop.

```ts
// ✅ Batch fetch related data
const allSkills = await skillRepo.findAll();
const authorIds = [...new Set(allSkills.map(s => s.authorId))];
const authors = await userRepo.findByIds(authorIds);
const authorMap = new Map(authors.map(a => [a.id, a]));

// ✅ ORM relation loading (if supported)
const skills = await db.query.skills.findMany({
  with: { author: { columns: { id: true, name: true } } },
});

// ❌ N+1 — one query per item
for (const skill of allSkills) {
  skill.author = await userRepo.findById(skill.authorId);
}
```

---

## Error Handling

```ts
// Base class — extends Error so every instance carries a stack trace
class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

class NotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`);
  }
}

class ValidationError extends DomainError {
  constructor(message: string) { super(message); }
}

class PermissionError extends DomainError {
  constructor(action: string) { super(`Permission denied: ${action}`); }
}

// Result type — error side carries stack traces
type Result<T, E extends Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const Err = <E extends Error>(error: E): Result<never, E> => ({ ok: false, error });

// Domain objects return Result for expected failures
class Skill {
  publish(userId: string): Result<SkillVersion, NotFoundError | PermissionError> {
    if (!this.currentDraft) return Err(new NotFoundError('Draft', this.id));
    if (!this.canPublish(userId)) return Err(new PermissionError('publish skill'));
    return Ok(this.currentDraft.markPublished(userId));
  }
}
```

### Error Translation

Handlers pattern-match on the Result — no try/catch for domain errors. Zod is the exception (throws by design); catch at the boundary.

```ts
async function publishSkill(input: unknown) {
  // Zod throws — catch at the boundary
  let validated;
  try { validated = PublishSkillSchema.parse(input); }
  catch (error) {
    if (error instanceof ZodError) return { success: false, error: 'Invalid input', details: error.flatten() };
    throw error;
  }

  // Use case returns Result — pattern-match, no try/catch
  const result = await publishSkillUseCase(validated.skillId, session.userId);

  if (!result.ok) {
    console.error(result.error.stack);  // full stack trace for debugging
    return { success: false, error: result.error.message };
  }

  return { success: true, data: result.value };
}

// For API routes — translate Result error to HTTP status codes
function toHttpStatus(error: DomainError): number {
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ValidationError) return 400;
  if (error instanceof PermissionError) return 403;
  return 500;
}
```

---

## Caching

- **Cache-aside (lazy loading):** check cache, miss, fetch from source, populate cache, return. Safest pattern.
- **Write-through:** update cache on source update. Fresh but adds write latency.
- **Invalidation is harder than caching.** Always define *when* data becomes stale. TTL is simple; event-based invalidation is more accurate.

**Framework-native first:** Next.js `revalidatePath()`/`revalidateTag()`/`unstable_cache()`, HTTP cache headers (`Cache-Control`, `ETag`, `stale-while-revalidate`), ORM-level query caching. Add external cache (Redis, Memcached) when you need cross-instance sharing, expensive computations accessed frequently, or shared state across serverless instances.

```ts
// Cache-aside with any cache store
async function findSkillCached(id: string): Promise<Skill> {
  const cached = await cache.get(`skill:${id}`);
  if (cached) return deserialize(cached);

  const skill = await skillRepo.findById(id);
  if (!skill) throw new NotFoundError('Skill', id);

  await cache.set(`skill:${id}`, serialize(skill), { ttl: 300 });
  return skill;
}

// Invalidate on mutation
async function onSkillPublished(skillId: string) {
  await cache.delete(`skill:${skillId}`);
  await cache.delete('skills:list');
}
```

---

## External Service Resilience

```ts
async function withRetry<T>(
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
        await new Promise(r => setTimeout(r, baseDelayMs * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError!;
}
```

### Critical vs Non-Critical Failures

Decide upfront: if this external call fails, does the whole operation fail?

```ts
// Critical — AI generation IS the operation. Failure = operation failure.
const generatedContent = await withRetry(() => aiService.generate(prompt));

// Non-critical — showcase generation is a side effect. Log and continue.
try {
  const html = await withRetry(() => aiService.generateShowcase(content));
  await skillRepo.updateShowcase(skillId, html);
} catch (error) {
  logger.error('Showcase generation failed', { skillId, error });
  // Skill is still published — showcase can be retried later
}
```

---

## API Design (External-Facing Endpoints)

API routes for external programmatic access only. Internal mutations use framework-native mechanisms (Server Actions, tRPC, etc).

```
GET    /api/skills                # List (with query params for filter/sort/pagination)
GET    /api/skills/:slug          # Get one
POST   /api/skills                # Create
PATCH  /api/skills/:slug          # Update
DELETE /api/skills/:slug          # Delete

GET /api/skills?official=true&sort=updated&limit=20&offset=0
```

### API Authentication (token-based, not session cookies)

```ts
async function authenticateApiRequest(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) throw new AuthError('Missing token');

  const user = await apiTokenRepo.findUserByToken(token);
  if (!user) throw new AuthError('Invalid token');

  return user;
}
```

### Consistent Response Shape

```ts
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "error": "Human-readable message" }

// Validation error
{ "success": false, "error": "Validation failed", "details": { ... } }

// List with pagination
{ "success": true, "data": [...], "pagination": { "total": 42, "limit": 20, "offset": 0 } }
```

---

## Rate Limiting

Protect entry points from abuse. Apply to: authentication endpoints, upload endpoints, expensive operations (AI generation), and external API routes.

```ts
interface RateLimitConfig {
  max: number;        // maximum requests
  windowMs: number;   // time window in milliseconds
}

// Simple in-memory limiter (suitable for single-instance or low-traffic)
const buckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + config.windowMs });
    return true;
  }
  if (entry.count >= config.max) return false;
  entry.count++;
  return true;
}
```

For distributed or strict enforcement, use a database counter or external store (Redis, Vercel KV) instead of in-memory state.

---

## Audit Logging

State-changing operations write to an audit log within the same transaction, guaranteeing the record exists iff the change succeeded.

```ts
await db.transaction(async (tx) => {
  await tx.versions.update(draftId, { status: 'published' });
  await tx.skills.update(skillId, { publishedVersionId: draftId });

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
});
```

Captures: **who** (userId), **what** (entity + action), **when** (timestamp), **context** (metadata with before/after state). This is a business requirement — it lives in the use case, not in middleware.

---

## Background Processing

For operations too slow for synchronous requests (AI generation, ZIP assembly, bulk imports), acknowledge and process asynchronously. Options: framework-native (Next.js `after()`), managed queues (Vercel Cron, AWS SQS, BullMQ, Inngest), or database-as-queue. The pattern: handler enqueues a job and returns immediately; a worker processes it; the UI shows progress or notifies on completion.

```ts
// Handler — returns immediately
async function generateProject(input: ValidatedInput) {
  const jobId = await jobQueue.enqueue('generate-project', {
    userId, archetypeId, skillIds, prompt,
  });
  return { success: true, jobId, status: 'processing' };
}

// Worker — processes asynchronously
async function processGenerateProject(job: GenerateProjectJob) {
  const zip = await assembleProjectZip(job);
  const url = await uploadToStorage(zip);
  await projectRepo.save({ ...job, blobUrl: url, status: 'complete' });
  await notify(job.userId, { type: 'project-ready', url });
}
```

---

## Banned Patterns

- ❌ Business logic in handlers → extract to use case, keep handler as thin controller
- ❌ Raw database rows returned from repositories → use mappers to return domain objects
- ❌ Select all columns by default → specify needed columns explicitly
- ❌ Database queries inside loops (N+1) → batch-fetch or use relation loading
- ❌ Raw database errors or stack traces exposed to client → catch, log, return typed errors
- ❌ External service calls without retry or timeout → wrap with retry and define critical vs non-critical
- ❌ Audit log writes outside transactions → audit entry must be atomic with the state change
- ❌ Throwing domain errors for expected failures → return `Result<T, E>` with `Error` subclasses (carry stack traces)
- ❌ API routes for internal mutations → use framework-native mutations; API routes for external access only
- ❌ Caching without invalidation strategy → every cache entry must have a defined staleness policy

---

## Quality Gate

Before delivering, verify:

- [ ] Handlers contain no business logic — only validation, delegation, cache invalidation, and return
- [ ] Input validated with schema at the server boundary
- [ ] Repositories return domain objects via mappers, not raw database rows
- [ ] Queries specify needed columns — no implicit select-all
- [ ] No N+1 queries — related data loaded via joins, relations, or batch-fetch
- [ ] Multi-write operations wrapped in a transaction
- [ ] Typed domain error classes used for expected failures
- [ ] Handlers catch domain errors and translate to client-safe responses
- [ ] External service calls have retry logic and defined failure strategy (critical vs non-critical)
- [ ] State-changing operations write audit log within the same transaction
- [ ] Cache invalidation is called after mutations that affect cached data
- [ ] No database errors, stack traces, or internal IDs in client-facing responses

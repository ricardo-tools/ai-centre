---
name: flow-observability
description: >
  Opinion companion for flow. Granular structured logging at every code
  path, controlled by log level per environment. Code MUST add logs — silent
  code is a bug. Dev/test see everything, preview less, prod minimal. The
  /api/dev/logs endpoint and browser console collection feed EDD. Without
  granular logs, the AI cannot diagnose failures or verify eval criteria.
---

# Flow: Observability

Code without logs is invisible code. Every function, action, query, and state change must log what it's doing. Log level controls visibility per environment — not whether logs exist. If the AI can't diagnose a problem from logs alone, the logging is insufficient.

Prerequisite for **flow-eval-driven** — without granular logs, EDD is guessing.

---

## When to Use

Always. Every scenario that writes production code must add appropriate logs. This is not optional and not a post-implementation step — logs are written AS PART OF the implementation, before EDD verification.

---

## Core Rules

### 1. Every code path logs — silence is a bug

Every server action, API route, repository method, background job, and external API call must log:
- **Start**: what's being attempted, with what parameters
- **Completion**: what the outcome was, how long it took
- **Errors**: full context (what was being attempted, what went wrong, what parameters)

This is not aspirational — it is a hard requirement. Code without logs fails review.

```typescript
// ✅ Every code path logged
async function createPersona(data: PersonaCreate, actorId: string) {
  const start = Date.now();
  logger.info({ actorId, name: data.name, buyingRole: data.buyingRole }, 'persona.create.start');

  const existing = await db.query.personas.findFirst({ where: eq(personas.name, data.name) });
  if (existing) {
    logger.warn({ actorId, name: data.name }, 'persona.create.duplicate');
    return Err(new ValidationError('Name already exists'));
  }

  const [created] = await db.insert(personas).values({ ... }).returning();
  logger.info({ actorId, personaId: created.id, durationMs: Date.now() - start }, 'persona.create.complete');

  return Ok({ id: created.id });
}

// ❌ Silent code — no logs, EDD cannot verify anything
async function createPersona(data: PersonaCreate, actorId: string) {
  const [created] = await db.insert(personas).values({ ... }).returning();
  return Ok({ id: created.id });
}
```

### 2. Log levels control granularity per environment

Log levels are NOT about whether to log. They are about who sees what. **Always add the log.** The level determines which environment surfaces it.

| Level | What to log | Dev | Test | Preview | Prod |
|---|---|---|---|---|---|
| `debug` | Internal state, query params, response shapes, intermediate values, cache hits/misses | ✅ | ✅ | ❌ | ❌ |
| `info` | Operations: start/complete of actions, API calls, auth events, CRUD operations, durations | ✅ | ✅ | ✅ | ✅ |
| `warn` | Degraded state: fallback used, rate limit approaching, slow query, stale data detected | ✅ | ✅ | ✅ | ✅ |
| `error` | Failures: DB errors, API failures, permission denied, validation errors, unhandled exceptions | ✅ | ✅ | ✅ | ✅ |

**Default log level per environment:**

| Environment | `LOG_LEVEL` | What's visible |
|---|---|---|
| Development | `debug` | Everything — maximum granularity |
| Test (Vitest/Playwright) | `debug` | Everything — tests need full context |
| Preview/Staging | `info` | Operations + warnings + errors |
| Production | `info` | Operations + warnings + errors |

### 3. What to log at each level

**`debug`** — the detail that makes EDD possible:

```typescript
// Request/response shapes
logger.debug({ body: req.body, headers: { auth: !!req.headers.authorization } }, 'api.request');
logger.debug({ status: 200, bodySize: JSON.stringify(result).length }, 'api.response');

// DB query details
logger.debug({ table: 'personas', where: { name: 'AR Manager' }, rowCount: 1, durationMs: 12 }, 'db.query');

// AI provider details
logger.debug({ model: 'anthropic/claude-sonnet-4', inputTokens: 450, prompt: prompt.slice(0, 200) }, 'ai.request');
logger.debug({ outputTokens: 342, finishReason: 'stop', durationMs: 3200 }, 'ai.response');

// Cache behaviour
logger.debug({ key: 'persona:ar-manager', hit: true }, 'cache.check');

// State transitions
logger.debug({ contentId: 'c-123', from: 'draft', to: 'published' }, 'content.status.change');
```

**`info`** — operational events:

```typescript
logger.info({ actorId, email, method: 'POST', path: '/api/auth/request-otp' }, 'otp.request.start');
logger.info({ actorId, personaId: created.id, durationMs: 142 }, 'persona.create.complete');
logger.info({ contentId, chunks: 7, wordCount: 3200, durationMs: 4500 }, 'content.upload.complete');
logger.info({ query: 'AR Manager logistics', graphResults: 12, vectorResults: 20, fusedResults: 8 }, 'rag.retrieval.complete');
```

**`warn`** — something unexpected but recoverable:

```typescript
logger.warn({ provider: 'openrouter', status: 429, retryAfter: 5000 }, 'ai.rate_limited');
logger.warn({ contentId, staleDays: 45, slaThreshold: 30 }, 'content.stale.detected');
logger.warn({ neo4jHost, error: 'Connection refused' }, 'graph.fallback_to_pgvector');
```

**`error`** — something broke:

```typescript
logger.error({ actorId, resource: 'persona', action: 'create', error: err.message, stack: err.stack }, 'permission.denied');
logger.error({ contentId, step: 'extraction', error: err.message, provider: 'openrouter' }, 'pipeline.step.failed');
```

### 4. Structured format with dot-notation messages

Every log uses Pino structured format. Messages use **dot-notation** (`module.operation.status`) for grep-ability:

- `persona.create.start`, `persona.create.complete`, `persona.create.error`
- `content.upload.start`, `content.upload.complete`
- `rag.query.start`, `rag.retrieval.complete`, `rag.generation.complete`
- `auth.otp.request`, `auth.otp.verify`, `auth.session.create`

Every entry includes `requestId` (per-request correlation) and `userId` (if authenticated).

### 5. Server logs via HTTP API

`GET /api/dev/logs` — dev/test only, ring buffer (200 entries).

| Parameter | Purpose | Example |
|---|---|---|
| `level` | Filter by severity | `?level=error` |
| `since` | Time-range | `?since=2026-03-25T10:00:00Z` |
| `search` | Keyword in msg | `?search=persona.create` |
| `limit` | Cap results | `?limit=50` |

Returns 403 in production.

### 6. Browser console logs (development only)

Client components log lifecycle events gated behind `NODE_ENV === 'development'`:

```typescript
if (process.env.NODE_ENV === 'development') {
  console.debug('[PersonaList] mount:', { count: personas.length, filter });
  console.info('[PersonaList] search:', { query, results: filtered.length, durationMs });
}
```

### 7. Browser console errors captured in E2E tests

Every E2E test collects console errors. On failure, browser + server errors printed. See `playwright-e2e-reference.md` for helpers.

---

## Logging Checklist — use during implementation

When writing code for a scenario, before running EDD, verify BOTH server and client logging:

**Server-side (Pino structured logger):**
- [ ] Every server action: `.start` (info) + `.complete` (info) + `.error` (error)
- [ ] Every DB query: `.query` (debug) with table, params, rowCount, durationMs
- [ ] Every external API call: `.request` (debug) + `.response` (debug) with status, tokens, durationMs
- [ ] Every permission check: `.denied` (error) if rejected, `.granted` (debug) if passed
- [ ] Every state transition: `.change` (debug) with from/to
- [ ] Every error catch: log error with full context before returning

**Client-side (browser console, gated behind `NODE_ENV === 'development'`):**
- [ ] Every component mount: `console.debug('[ComponentName] mount:', { key props })`
- [ ] Every user interaction handler: `console.info('[ComponentName] action:', { action, params })`
- [ ] Every API call from client: `console.debug` on start, `console.info` on complete/error with durationMs
- [ ] Every state transition: `console.debug('[ComponentName] state:', { from, to })`
- [ ] Every form submission: `console.info('[FormName] submit:', { fields summary })`
- [ ] Every error boundary trigger: `console.error('[ComponentName] error:', { message })`

**Both sides must be verified.** The AI eval toolkit reads server logs via `/api/dev/logs` AND browser console via Playwright `page.on('console')`. If either side is silent, EDD is incomplete.

---

## Banned Patterns

- Silent code — functions without logging → every code path logs
- Unstructured messages ("Something went wrong") → include error, context, module prefix
- Swallowing errors (`catch {}`) → log before returning fallback
- Logging secrets (tokens, passwords, OTPs, JWTs) → never
- Same log level everywhere → match the level table
- Production log exposure → `/api/dev/logs` dev-only
- Adding logs AFTER EDD fails → logs are part of implementation, not debugging afterthought
- `console.log` instead of Pino → use the structured logger

---

## Quality Gate

- [ ] Every new server action has start/complete/error logs
- [ ] Every new DB query has debug-level log with duration
- [ ] Every new external API call has debug-level request/response logs
- [ ] Log levels match the environment table
- [ ] Dot-notation message names (`module.operation.status`)
- [ ] `/api/dev/logs` works with filters
- [ ] Browser console errors captured in E2E
- [ ] No secrets in logs
- [ ] Client components log lifecycle in dev only

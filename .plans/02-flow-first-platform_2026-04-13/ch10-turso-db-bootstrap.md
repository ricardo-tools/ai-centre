# Chapter 10: Turso DB Bootstrap

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapters 1, 2
**User can:** Bootstrap a project that needs a database, get a Turso database provisioned, and connect to it with Drizzle.

## Goal

Integrate Turso Platform API for per-user database provisioning. When bootstrap detects the user needs a database, it provisions a Turso DB, stores credentials, and downloads ref files with Drizzle config. After this chapter, bootstrapped projects have a working database connection.

---

## Development Methodology

One chapter = one concern. The chapter's "User can" line is the spec.

```
FOR EACH CHAPTER:

  1. TEST    Write failing tests for what "User can" describes.
             Extend journey test with this chapter's increment.
             Impact table for existing tests (keep/update/new/remove).
             No production code. Ref: flow-tdd skill.
  --------
  GATE 1    Verify:
            [] Impact table present (keep/update/new/remove)
            [] Every layer has a test file
            [] Journey test extended with this chapter's assertions
            [] Tests FAIL

  2. BUILD   Minimum production code + polish.
             Follow the mockups, state spec, and guidelines in this chapter.
             Every code path must log (start, complete, error). Ref: flow-observability skill.
             Code must be small, composable, type-safe. Ref: coding-standards skill.
  --------
  GATE 2    Verify:
            [] Every critical file from this chapter exists
            [] Polish criteria met
            [] Structured logging on every server action and data path

  3. EVAL    Runtime: pages render, APIs respond, no error logs, DB correct.
             Ref: flow-eval-driven skill.
             Fail -> fix and re-eval.

  4. RUN     Run chapter tests + full vitest suite + tsc + build.
             Fail -> fix and re-run.
  --------
  GATE 3    Verify:
            [] All chapter tests GREEN
            [] No regressions

  5. AUDIT   Proportional to what changed (see Audit Scope below).
             Fail -> fix and re-run from step 4.

  6. LOG     Update LOG.md + plan.md status.

COMPACT at every 10 dispatches or phase boundary.
Checkpoint -> .claude/.strategic-context/ -> compact -> re-read plan.
```

### Polish & UX (apply to all work in every chapter)

- Feedback is instant — every action gets visible response within 100ms
- Every state change is animated — enter, leave, move, status change
- Every action gets motion feedback — the user never wonders "did that work?"
- Errors are helpful — show what went wrong, keep the user's work, suggest next step
- Empty states guide — icon + text + action button
- Visual hierarchy — primary (what they're acting on), secondary (metadata), tertiary (system info)
- Microcopy is short — labels are noun phrases, confirmations name the action, errors name the problem

---

## Responsive & Layout

No new UI — changes are in the API route and server-side logic only.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. Database provisioning happens from the CLI during bootstrap.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
During flow-bootstrap, user indicates they need a database:
  1. POST {AI_CENTRE_URL}/api/workspace/databases
     Authorization: Bearer {token}
     Body: { name: "my-project-db" }
  2. Server:
     a. Check quota (schema_limit from user_quotas)
     b. Call Turso Platform API:
        - POST https://api.turso.tech/v1/organizations/{org}/databases
          { name: "{userId}-{slug}", group: "default" }
        - POST https://api.turso.tech/v1/organizations/{org}/databases/{name}/auth/tokens
          { expiration: "none", authorization: "full-access" }
     c. Store in user_databases: user_id, db_name, db_url, created_at
     d. Return { dbUrl: "libsql://...", authToken: "..." }
  3. Flow writes .env.local:
     DATABASE_URL=libsql://{name}-{org}.turso.io
     DATABASE_AUTH_TOKEN={token}
  4. Agent reads `skills/db-turso-drizzle/references/templates.md` and copies code to project:
     - drizzle.config.ts (turso dialect)
     - src/db/schema.ts (starter schema)
     - src/db/client.ts (Drizzle + libsql client setup)
```

---

## DB Changes

New `user_databases` table: id, user_id (FK), db_name, db_url, turso_db_id, created_at.

**Env vars needed:**
- `TURSO_ORG` — Turso organization slug
- `TURSO_API_TOKEN` — Turso Platform API token

---

## Edge Cases

- Quota exceeded — return 429 with usage info
- Turso API failure — return error, no DB record created (transaction)
- Duplicate DB name — append random suffix
- User already has DB for this project — return existing credentials
- TURSO_API_TOKEN not set — skip provisioning, return clear error

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Workspace quotas | `src/app/api/workspace/route.ts` (from Ch 1) |
| Result pattern | `src/platform/lib/result.ts` |

---

## Wrong Paths

1. **Don't use Neon for user DBs** — Turso gives true DB-level isolation (decision D1).
2. **Don't store auth tokens in the main DB** — return to client only, stored in user's .env.local.
3. **Don't create DB before checking quota** — check first, create second.
4. **Don't provision on every bootstrap** — check if project already has a linked DB.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test provisioning, quota enforcement |
| **coding-standards** | Step 2 | Turso wrapper, typed API |
| **flow-observability** | Step 2 | Log provisioning events |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test database provisioning creates DB record
- Test quota enforcement rejects at limit
- Test duplicate project returns existing DB
- Test Turso API error handling
- Mock Turso Platform API in tests
- Journey: user provisions a database, gets credentials

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/db/schema.ts` | MODIFY: add user_databases table |
| `src/platform/db/migrations/0015_add_user_databases.sql` | NEW: CREATE TABLE |
| `src/platform/lib/turso.ts` | NEW: Turso Platform API wrapper |
| `src/app/api/workspace/databases/route.ts` | NEW: provision database endpoint |
| `skills/db-turso-drizzle/SKILL.md` | NEW: behavioral skill — when to use Turso, dialect constraints, Drizzle patterns |
| `skills/db-turso-drizzle/references/templates.md` | NEW: copy-paste templates for drizzle.config.ts, client.ts, schema.ts |
| `skills/flow/SKILL.md` | MODIFY: bootstrap references db-turso-drizzle skill for DB projects |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Database provisioning endpoint creates DB record
- Quota enforcement rejects when limit reached
- Provisioning returns connection credentials

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | turso.ts — typed, error handling |
| Accessibility | No | No UI |
| Security | Yes | Auth tokens never logged, quota enforcement |
| Observability | Yes | Provisioning events logged |

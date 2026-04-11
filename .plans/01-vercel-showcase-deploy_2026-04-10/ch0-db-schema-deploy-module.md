# Chapter 0: DB Schema + Deploy Module

**Status:** Not started
**Tier:** Foundation
**Depends on:** None
**User can:** Verify new columns exist in Drizzle Studio. Run deploy module in isolation to create and delete a test Vercel deployment.

## Goal

Add the database columns to track deployment state and build the Vercel API wrapper module. After this chapter, the infrastructure exists for all subsequent chapters to build on. Done when: `deploy_status` and `deploy_url` columns exist in the DB, and `vercel-deploy.ts` can create and delete deployments via the Vercel API.

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

No UI in this chapter — infrastructure only (DB migration + server-side module).

---

## Widget Decomposition

No widgets in this chapter.

---

## ASCII Mockup

N/A — no UI changes.

---

## State Spec

N/A — no client state changes.

---

## Data Flow

```
vercel-deploy.ts — deployProject(projectName, files, target):
  input: { projectName: string, files: Record<string, string>, target: 'production' | 'development' }
  return: Promise<Result<{ deploymentId: string; url: string }, Error>>
  internally:
    1. Upload files via POST /v2/files (SHA-based dedup)
    2. Create deployment via POST /v13/deployments with target + project
    3. Return deployment ID and URL
    4. Log: start, complete, error

vercel-deploy.ts — deleteDeployment(deploymentId):
  input: { deploymentId: string }
  return: Promise<Result<void, Error>>
  internally:
    1. DELETE /v13/deployments/{id}
    2. Log: start, complete, error

vercel-deploy.ts — getDeploymentStatus(deploymentId):
  input: { deploymentId: string }
  return: Promise<Result<{ status: string; url: string | null }, Error>>
  internally:
    1. GET /v13/deployments/{id}
    2. Map Vercel status to our deploy_status enum
    3. Return status + URL
```

---

## Edge Cases

- `VERCEL_SHOWCASE_TOKEN` not set — module should throw at import time with clear error message
- Vercel API rate limit hit — return error, don't retry (caller decides)
- Deployment creation fails (bad files, quota exceeded) — return structured error with Vercel's error message
- Network timeout on Vercel API — 30s timeout, return error

---

## Focus Management

N/A — no UI.

---

## Must Use

| Pattern | File to read |
|---|---|
| Result pattern | `src/platform/lib/result.ts` |
| DB schema conventions | `src/platform/db/schema.ts` |
| Migration conventions | `src/platform/db/migrations/` |

---

## Wrong Paths

1. **Don't use `fetch` directly** — wrap in a typed module with proper error handling and logging. Raw fetch calls scatter across the codebase.
2. **Don't store the Vercel API token in the showcase project** — it goes in the main app's env vars only. The showcase project has `ALLOWED_ORIGINS` and `JWT_SECRET`, not the deploy token.
3. **Don't make deploy_status an enum type in Postgres** — use `text` with TypeScript union for flexibility. Adding enum values requires migrations.
4. **Don't block on Vercel file upload** — upload all files in parallel, then create the deployment.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test the deploy module with mocked Vercel API |
| **coding-standards** | Step 2 | Small functions, composition, type safety |
| **flow-observability** | Step 2 | Structured logging on every Vercel API call |
| **clean-architecture** | Step 2 | Module isolation, typed Result returns |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No UI elements |

- Mock the Vercel API calls (don't hit real API in unit tests)
- Test: `deployProject` returns OK with deployment ID and URL on success
- Test: `deployProject` returns Err on API failure
- Test: `deleteDeployment` returns OK on success
- Test: `getDeploymentStatus` maps Vercel statuses correctly
- Integration test: verify DB migration adds columns (check schema)

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/db/schema.ts` | MODIFY: add deploy_status, deploy_url to showcaseUploads |
| `src/platform/db/migrations/0006_add_deploy_columns.sql` | NEW: ALTER TABLE |
| `src/platform/db/migrations/meta/_journal.json` | MODIFY: add entry |
| `src/platform/lib/vercel-deploy.ts` | NEW: Vercel API wrapper |
| `src/features/showcase-gallery/action.ts` | MODIFY: include new columns in selects |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- Verify showcase_uploads table has deploy_status and deploy_url columns
- Verify vercel-deploy module exports deployProject, deleteDeployment, getDeploymentStatus

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | `vercel-deploy.ts` — typed, small functions, no raw fetch |
| Accessibility | No | No UI |
| Security | Yes | API token handling — not leaked in logs, not exposed to client |
| Observability | Yes | Every Vercel API call logged with start/complete/error |

---

## Research Brief

### Sources (CRAAP-tested)

| Source | Date | Authority | Key finding |
|---|---|---|---|
| Vercel Deployments API docs | 2025 | High | POST /v13/deployments accepts file list + target env |
| Vercel Files API docs | 2025 | High | POST /v2/files for SHA-based dedup upload |
| WebContainers research (this conversation) | 2026-04-10 | High | No persistence/caching — Vercel deploy is the only path to instant load |

### Ranked Approaches

| Rank | Approach | Verdict |
|---|---|---|
| **1 (chosen)** | Vercel Deployments API | Native Next.js build, unlimited on Pro, no infra to manage |
| 2 | Build in Docker + serve static | Massive complexity — security sandboxing, build server, storage |
| 3 | StackBlitz with optimizations | Fundamental limitation — no npm install caching between sessions |
| 4 | Sandpack/Nodebox | Slower than StackBlitz for Next.js, same npm install problem |

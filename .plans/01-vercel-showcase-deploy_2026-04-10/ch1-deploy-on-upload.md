# Chapter 1: Deploy on Upload

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapter 0
**User can:** Upload a ZIP showcase and check the DB to see deploy_status change from `pending` to `building` to `ready`, with a deploy_url populated.

## Goal

Wire the upload action to trigger a Vercel deployment after storing the file. The deployment runs asynchronously — the upload response returns immediately with `deploy_status: 'pending'`. A background process extracts the ZIP, calls `deployProject()`, and updates the DB. Done when: uploading a ZIP creates a real Vercel deployment and the DB row has the deployment URL.

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

No new UI — changes are in the server action only. Upload form is unchanged.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. The upload form looks the same; the change is in what happens server-side after submission.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
User clicks "Share Project" (ZIP file)
  -> uploadShowcase server action
      input: FormData { title, description, skillIds, file (ZIP), thumbnail? }
      return: Result<{ id: string }, ValidationError | ForbiddenError>
      internally:
        1. requirePermission('showcase:upload')
        2. Validate file (size, type)
        3. Upload file to Vercel Blob (existing)
        4. Insert DB row with deploy_status: 'pending'
        5. Fire-and-forget: triggerDeploy(showcaseId)
        6. Return Ok({ id })

triggerDeploy(showcaseId) — async, non-blocking:
  1. Fetch ZIP from Blob storage
  2. Extract files using JSZip (server-side)
  3. Inject middleware.ts + vercel.json template files
  4. Update DB: deploy_status = 'building'
  5. Call deployProject(files, target)
  6. On success: update DB with deploy_url, deploy_status = 'ready'
  7. On failure: update DB with deploy_status = 'failed'
  8. Log: start, complete, error at each step
```

---

## Edge Cases

- ZIP extraction fails (corrupted file) — set deploy_status = 'failed', log error
- Vercel API call fails — set deploy_status = 'failed', log Vercel error message
- ZIP has no package.json — Vercel build will fail, deploy_status becomes 'failed'
- Server action returns before deploy finishes — this is expected (fire-and-forget)
- Very large ZIP (10MB) — extraction might be slow but within serverless limits
- `VERCEL_SHOWCASE_TOKEN` not set — skip deployment, log warning, keep showcase without preview

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Upload action | `src/features/showcase-gallery/action.ts` |
| Deploy module | `src/platform/lib/vercel-deploy.ts` (from Ch 0) |
| Result pattern | `src/platform/lib/result.ts` |

---

## Wrong Paths

1. **Don't block the upload response on deployment** — deployment takes 30-120s. Return immediately, update status async.
2. **Don't extract ZIP on the client** — extraction happens server-side in the action, not in the browser.
3. **Don't forget to inject the middleware template** — without it, the deployment has no access control (Ch 2 creates the template, but the injection happens here).
4. **Don't use `await` on the fire-and-forget** — use `.then().catch()` pattern or a detached async call so the response isn't blocked.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test upload action triggers deployment |
| **coding-standards** | Step 2 | Action structure, error handling |
| **flow-observability** | Step 2 | Log every step of the deploy pipeline |
| **clean-architecture** | Step 2 | Server action is thin adapter, deploy logic in module |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Mock `deployProject` to verify it's called with correct files
- Verify DB row has deploy_status = 'pending' immediately after upload
- Verify deploy_status updates to 'ready' after mock deploy completes
- Existing upload tests should still pass (keep)

---

## Critical Files

| File | Change |
|---|---|
| `src/features/showcase-gallery/action.ts` | MODIFY: add triggerDeploy after insert, include deploy columns in selects |
| `src/features/showcase-gallery/deploy.ts` | NEW: triggerDeploy function (extracts ZIP, injects template, calls deployProject) |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- When the user uploads a ZIP via the upload form
- Then the showcase is stored with deploy_status "building"
- And the Vercel Deployments API is called with the extracted files

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | `deploy.ts` — clean async flow, error handling |
| Accessibility | No | No UI |
| Security | Yes | ZIP extraction — path traversal prevention, no arbitrary file writes |
| Observability | Yes | Every deploy step logged |

# Chapter 8: Delete Cleanup

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 1
**User can:** Delete a showcase and confirm no orphaned Vercel deployment remains.

## Goal

Wire the delete action to also remove the Vercel deployment. Done when: deleting a showcase cleans up both the DB row and the Vercel deployment.

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

No new UI — delete button and confirmation flow already exist.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. Existing delete confirmation flow is unchanged.

---

## State Spec

N/A — no new client state.

---

## Data Flow

```
User confirms delete
  -> deleteShowcase(showcaseId) server action [MODIFY]
      input: { showcaseId: string }
      return: Result<void, ForbiddenError | NotFoundError>
      internally (additions):
        1. [existing] Auth check, fetch row
        2. [NEW] If row has deploymentId:
           a. Call deleteDeployment(deploymentId) — fire-and-forget
           b. Log success/failure (don't block DB deletion)
        3. [existing] Delete Blob file
        4. [existing] Delete DB row
        5. [existing] Redirect to /gallery
```

---

## Edge Cases

- No deployment exists (HTML showcase, or pre-migration) — skip Vercel delete
- Vercel delete API fails (deployment already gone, network error) — log warning, continue with DB delete. Don't fail the user action.
- Deployment is still building when deleted — Vercel API handles this (cancels the build)

---

## Focus Management

N/A — existing flow unchanged.

---

## Must Use

| Pattern | File to read |
|---|---|
| Delete action | `src/features/showcase-gallery/action.ts` deleteShowcase |
| Deploy module | `src/platform/lib/vercel-deploy.ts` deleteDeployment |

---

## Wrong Paths

1. **Don't block the delete on Vercel API response** — fire-and-forget. The user shouldn't wait for a remote API call to delete their showcase.
2. **Don't fail the delete if Vercel delete fails** — DB deletion is primary. Vercel cleanup is best-effort.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test delete calls deleteDeployment |
| **coding-standards** | Step 2 | Clean error handling |
| **flow-observability** | Step 2 | Log deployment cleanup |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test: deleting a showcase with deploymentId calls deleteDeployment
- Test: deleting a showcase without deploymentId does NOT call deleteDeployment
- Test: Vercel delete failure doesn't prevent DB deletion

---

## Critical Files

| File | Change |
|---|---|
| `src/features/showcase-gallery/action.ts` | MODIFY: deleteShowcase calls deleteDeployment |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- When the user deletes the showcase
- Then the Vercel deployment is also removed

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Fire-and-forget pattern, error swallowing |
| Accessibility | No | No UI changes |
| Security | Yes | Auth check still enforced |
| Observability | Yes | Log deployment cleanup result |

# Chapter 7: Re-deploy on Update

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 1
**User can:** Upload a new ZIP version for an existing showcase and see the old deployment deleted and a new one created, with status resetting to "building".

## Goal

Wire the update action to re-deploy when a new ZIP is provided. Done when: updating a showcase's ZIP triggers a new Vercel deployment, deletes the old one, and resets the deploy status.

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

No new UI — changes are in the existing edit form's save action.

---

## Widget Decomposition

No new widgets. The edit form already exists in ShowcaseViewerWidget.

---

## ASCII Mockup

N/A — the edit form is unchanged. The difference is server-side behavior after saving with a new ZIP.

---

## State Spec

N/A — no new client state. After save, the page reloads (existing behavior) which picks up the new deploy status.

---

## Data Flow

```
User clicks "Save" in edit form with a new ZIP file
  -> updateShowcase(showcaseId, formData) server action [MODIFY]
      input: FormData { title, description, skillIds, file? (ZIP) }
      return: Result<void, ValidationError | ForbiddenError | NotFoundError>
      internally (additions for ZIP file update):
        1. [existing] Auth, validation, file upload to Blob
        2. [NEW] If new file is ZIP and old showcase had a deployment:
           a. Delete old Vercel deployment (fire-and-forget)
           b. Set deploy_status = 'building', clear deploy_url
        3. [NEW] Trigger new deployment (fire-and-forget)
        4. [existing] Return Ok

  Page reloads -> shows "Building..." status (Ch 5 polling kicks in)
```

---

## Edge Cases

- Old deployment doesn't exist (was never deployed or already deleted) — skip delete, just deploy new
- Old deployment delete fails — log warning, continue with new deployment. Orphaned deployments are a minor issue.
- User updates title/description but NOT the file — don't re-deploy, only update DB metadata
- User changes from ZIP to HTML (or vice versa) — if switching away from ZIP, delete old deployment

---

## Focus Management

N/A — existing edit form behavior unchanged.

---

## Must Use

| Pattern | File to read |
|---|---|
| Update action | `src/features/showcase-gallery/action.ts` updateShowcase |
| Deploy module | `src/platform/lib/vercel-deploy.ts` |
| Deploy trigger | `src/features/showcase-gallery/deploy.ts` (from Ch 1) |

---

## Wrong Paths

1. **Don't re-deploy if only metadata changed** — check if a new ZIP file was actually provided before triggering deploy.
2. **Don't wait for old deployment deletion** — fire-and-forget. Don't block the new deployment.
3. **Don't keep the old deploy_url while building** — clear it immediately so the viewer shows building state.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test update with new ZIP triggers re-deploy |
| **coding-standards** | Step 2 | Clean conditional logic in action |
| **flow-observability** | Step 2 | Log old deployment deletion + new deployment trigger |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test: update with new ZIP calls deleteDeployment then deployProject
- Test: update without file change does NOT trigger deploy
- Test: deploy_status resets to 'building' after update with new ZIP
- Test: deploy_url is cleared after update with new ZIP

---

## Critical Files

| File | Change |
|---|---|
| `src/features/showcase-gallery/action.ts` | MODIFY: updateShowcase triggers re-deploy for new ZIP |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- When the user updates the showcase with a new ZIP
- Then a new deployment is created and the old one is deleted

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Update action — conditional deploy logic |
| Accessibility | No | No new UI |
| Security | Yes | Verify auth check still enforced on update |
| Observability | Yes | Log deploy deletion + creation |

# Chapter 6: Deploy Status in Viewer

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 4
**User can:** See clear, polished UI for each deploy state — spinner for pending/building, error message + retry button for failed, iframe for ready.

## Goal

Add the failed state UX to the viewer. Done when: a showcase with `deployStatus === 'failed'` shows an error message, the failure reason, and a "Retry Deploy" button that re-triggers deployment.

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

**Canonical layout:** Single Column — centered error message in the preview area.

**Target breakpoints:** All — centered content is responsive.

### Content priority

1. Error icon + heading
2. Error detail / reason
3. Retry button + download fallback

### Layout grid

```
+--[ Detail Bar ]--------------------------------------------------+
|                                                                    |
|                  [WarningCircle icon]                               |
|              Deploy failed                                         |
|    Build error: Module not found 'xxx'                             |
|                                                                    |
|         [ Retry Deploy ]   [ Download ZIP ]                        |
|                                                                    |
+--------------------------------------------------------------------+
```

---

## Widget Decomposition

### Widget tree

```
ShowcaseViewerWidget [MODIFY]
  └── Preview area
      ├── ready: iframe
      ├── building/pending: DeployingStatus (from Ch 5)
      └── failed: DeployFailedStatus [NEW]
          ├── WarningCircle icon
          ├── "Deploy failed" heading
          ├── Error detail text
          ├── "Retry Deploy" button
          └── "Download ZIP" fallback link
```

---

## ASCII Mockup

### Failed state

```
+--[ Detail Bar ]--------------------------------------------------+
|                                                                    |
|                     /!\                                             |
|              Deploy failed                                         |
|                                                                    |
|    The build encountered an error:                                 |
|    "Module not found: Can't resolve '@/components/Header'"         |
|                                                                    |
|         [ Retry Deploy ]     [ Download ZIP instead ]              |
|                                                                    |
+--------------------------------------------------------------------+
```

---

## State Spec

ShowcaseViewerWidget (additions):
  State:
    retrying: boolean — true while retry is in progress

  Transitions:
    Click "Retry Deploy" -> retrying = true -> call retryDeploy action
    retryDeploy succeeds -> deployStatus = 'building', retrying = false, start polling
    retryDeploy fails -> show new error, retrying = false

---

## Data Flow

```
User clicks "Retry Deploy"
  -> retryDeploy(showcaseId) server action
      input: { showcaseId: string }
      return: Result<void, ForbiddenError | NotFoundError>
      internally:
        1. requirePermission('showcase:upload')
        2. Fetch showcase from DB
        3. Re-trigger deployment (fetch ZIP, extract, deploy)
        4. Set deploy_status = 'building'
        5. Return Ok
  -> on Ok: start polling (Ch 5 hook)
  -> on Err: show error toast
```

---

## Edge Cases

- Error message from Vercel is very long — truncate to 200 chars with "..." and expandable
- Retry fails again — show new error, allow another retry
- User without showcase:upload permission clicks retry — button disabled or hidden
- Deploy failed but Vercel deployment partially exists — delete old deployment before retrying

---

## Focus Management

| Action | Focus moves to |
|---|---|
| Click "Retry Deploy" | Focus stays on button (shows spinner state) |
| Retry triggers building state | Focus to status message |

---

## Must Use

| Pattern | File to read |
|---|---|
| ShowcaseViewerWidget | `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` |
| WarningCircle icon | `@phosphor-icons/react` |
| Deploy module | `src/platform/lib/vercel-deploy.ts` |

---

## Wrong Paths

1. **Don't hide the download option on failure** — the user can always download the ZIP and run it locally.
2. **Don't auto-retry** — user must explicitly click. Automatic retries could burn build minutes on projects that will always fail.
3. **Don't show raw Vercel error JSON** — extract the human-readable message.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test failed state rendering, retry action |
| **frontend-architecture** | Step 2 | Error state component |
| **content-design** | Step 2 | Error microcopy — name the problem, suggest next step |
| **interaction-motion** | Step 2 | Button loading state animation |

---

## Test Hints

| Element | data-testid |
|---|---|
| Failed status container | `deploy-failed` |
| Retry button | `deploy-retry-btn` |
| Error message | `deploy-error-message` |
| Download fallback | `deploy-download-fallback` |

- Test: failed state shows error message and retry button
- Test: clicking retry calls retryDeploy action
- Test: after retry, status transitions to building
- Test: download link points to blob URL

---

## Critical Files

| File | Change |
|---|---|
| `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` | MODIFY: add failed state UI + retry |
| `src/features/showcase-gallery/action.ts` | MODIFY: add retryDeploy server action |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- When viewing a showcase with deploy_status "failed"
- Then the viewer shows an error message with a retry button

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Error state component — clean, no duplication |
| Accessibility | Yes | Error message announced, retry button accessible |
| Security | Yes | retryDeploy checks permissions |
| Observability | Yes | retryDeploy action logged |

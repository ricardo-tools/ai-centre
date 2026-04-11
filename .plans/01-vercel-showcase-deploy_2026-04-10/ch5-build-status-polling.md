# Chapter 5: Build Status Polling

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 1
**User can:** See "Deploying your project..." with a progress indicator after uploading a ZIP, then get auto-redirected to the showcase when the build finishes.

## Goal

After uploading a ZIP, the user is redirected to `/gallery/{id}` which polls for build completion. A server action checks the Vercel deployment status API and updates the DB. Done when: the user sees live build progress and the iframe appears automatically when ready.

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

**Canonical layout:** Single Column — centered status message in the preview area.

**Target breakpoints:** All — status message is centered and responsive.

### Content priority

1. Build status message + spinner
2. Progress context ("This usually takes 30-60 seconds")

### Behaviour spec

| Dimension | This page |
|---|---|
| Input model | None — passive polling, no user interaction needed |
| Information density | Low — one status message |
| Hover states | None during polling |
| Keyboard | N/A |

### Layout grid

```
+--[ Detail Bar: Back | Badge | Title | Author | ... ]--+
|                                                         |
|              [Spinner]                                   |
|         Deploying your project...                        |
|    This usually takes 30-60 seconds                      |
|                                                         |
+---------------------------------------------------------+
```

---

## Widget Decomposition

### Widget tree

```
ShowcaseViewerWidget [MODIFY]
  └── Preview area
      ├── deployStatus === 'ready': iframe (from Ch 4)
      ├── deployStatus === 'building': DeployingStatus [NEW]
      │   ├── SpinnerGap
      │   ├── "Deploying your project..."
      │   └── "This usually takes 30-60 seconds"
      └── deployStatus === 'failed': handled in Ch 6
```

### Data hooks

useDeployPolling(showcaseId, initialStatus):
  - Polls `checkDeployStatus` server action every 5s
  - Stops polling when status is 'ready' or 'failed'
  - Returns { deployStatus, deployUrl }

---

## ASCII Mockup

### Before (just uploaded, deploy in progress)

```
+--[ Detail Bar ]--------------------------------------------------+
|                                                                    |
|                    (o) <- spinner animation                        |
|              Deploying your project...                             |
|         This usually takes 30-60 seconds                           |
|                                                                    |
+--------------------------------------------------------------------+
```

### After (deploy complete — transitions to iframe)

```
+--[ Detail Bar ]--------------------------------------------------+
|                                                                    |
|  +-- iframe (deployed project) --------------------------------+  |
|  |  [Live project — instant]                                    |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
+--------------------------------------------------------------------+
```

---

## State Spec

useDeployPolling:
  State:
    deployStatus: 'pending' | 'building' | 'ready' | 'failed'
    deployUrl: string | null

  Transitions:
    Poll tick -> fetch status -> update deployStatus + deployUrl
    Status becomes 'ready' -> stop polling, show iframe
    Status becomes 'failed' -> stop polling, show error (Ch 6)

  Loading:
    Spinner + "Deploying your project..." while polling

---

## Data Flow

```
useDeployPolling(showcaseId, initialStatus):
  Every 5s while status is 'pending' or 'building':
    -> checkDeployStatus(showcaseId) server action
        input: { showcaseId: string }
        return: Result<{ deployStatus: string, deployUrl: string | null }, Error>
        internally:
          1. Read current DB row
          2. If deploy_status === 'building':
             a. Call getDeploymentStatus(deploymentId) from vercel-deploy module
             b. Map Vercel status -> our status
             c. If Vercel says 'READY': update DB with deploy_url, set 'ready'
             d. If Vercel says 'ERROR': set 'failed'
          3. Return current status
    -> on Ok: update local state
    -> on Err: log, keep polling (transient errors shouldn't stop polling)
```

---

## Edge Cases

- Vercel build takes longer than expected (>3 min) — keep polling, no timeout. Show elapsed time after 60s.
- Polling while page is backgrounded — `setInterval` may throttle. Acceptable — polls on next focus.
- Network error during poll — swallow and retry on next interval, don't show error
- Deploy was already 'ready' on page load — skip polling entirely, show iframe immediately
- Multiple viewers polling same showcase — all hit same server action, each updates DB. Idempotent.

---

## Focus Management

| Action | Focus moves to |
|---|---|
| Deploy completes | Focus to iframe (announce "Project is ready") |

---

## Must Use

| Pattern | File to read |
|---|---|
| ShowcaseViewerWidget | `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` |
| Deploy module | `src/platform/lib/vercel-deploy.ts` |
| Spinner | `@phosphor-icons/react` SpinnerGap |

---

## Wrong Paths

1. **Don't poll from the upload page** — redirect to `/gallery/{id}` immediately and poll there.
2. **Don't poll every 1s** — Vercel builds take 30-120s. 5s intervals are sufficient and avoid rate limits.
3. **Don't use WebSocket for this** — polling is simpler and sufficient for build status. Builds complete in minutes, not seconds.
4. **Don't show Vercel's internal status names** — map them to user-friendly labels.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test polling hook with mocked status responses |
| **frontend-architecture** | Step 2 | Custom hook pattern for polling |
| **interaction-motion** | Step 2 | Spinner animation, transition from status to iframe |
| **content-design** | Step 2 | Status microcopy |

---

## Test Hints

| Element | data-testid |
|---|---|
| Deploy status message | `deploy-status-message` |
| Deploy spinner | `deploy-spinner` |

- Mock `checkDeployStatus` to return 'building' then 'ready' after N calls
- Verify polling stops when status is 'ready'
- Verify iframe appears after status transitions to 'ready'
- Verify polling doesn't start if initial status is 'ready'

---

## Critical Files

| File | Change |
|---|---|
| `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` | MODIFY: add building state UI |
| `src/features/showcase-gallery/hooks/useDeployPolling.ts` | NEW: polling hook |
| `src/features/showcase-gallery/action.ts` | MODIFY: add checkDeployStatus server action |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- When the user waits on the gallery page after upload
- Then it shows "Deploying..." and polls until deploy_status is "ready"

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Polling hook — cleanup on unmount, no memory leaks |
| Accessibility | Yes | Status message announced to screen readers |
| Security | No | No auth changes |
| Observability | Yes | checkDeployStatus action logged |

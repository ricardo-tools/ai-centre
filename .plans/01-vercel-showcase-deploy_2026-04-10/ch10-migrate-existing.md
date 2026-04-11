# Chapter 10: Migrate Existing Showcases

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 4, Chapter 9
**User can:** Open an existing pre-migration ZIP showcase and see it deploy on demand, then load via iframe on all subsequent visits.

## Goal

Handle ZIP showcases uploaded before the Vercel deploy system existed. Done when: existing ZIP showcases with `deployStatus === null` trigger a lazy deploy on first view and work normally afterward.

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

No new UI components — reuses the building/failed states from Ch 5 and Ch 6.

---

## Widget Decomposition

No new widgets. The viewer page (server component) handles the migration trigger.

---

## ASCII Mockup

### First view of pre-migration showcase

```
+--[ Detail Bar ]--------------------------------------------------+
|                                                                    |
|                    (o) <- spinner                                   |
|          Setting up preview for the first time...                  |
|         This usually takes 30-60 seconds                           |
|                                                                    |
+--------------------------------------------------------------------+
```

### Subsequent views

```
+--[ Detail Bar ]--------------------------------------------------+
|                                                                    |
|  +-- iframe (deployed project) --------------------------------+  |
|  |  [Instant load]                                              |  |
|  +--------------------------------------------------------------+  |
|                                                                    |
+--------------------------------------------------------------------+
```

---

## State Spec

N/A — migration logic runs server-side. Client sees the same building/ready states from Ch 5/6.

---

## Data Flow

```
Viewer opens a showcase with deployStatus === null (pre-migration):
  -> gallery/[id]/page.tsx server component [MODIFY]
      1. Fetch showcase
      2. If fileType === 'zip' and deployStatus === null:
         a. Call triggerDeploy(showcaseId) — fire-and-forget
         b. Set deploy_status = 'building' in DB
      3. Render viewer with deployStatus = 'building'
      4. Client-side polling (Ch 5) takes over from here

  -> Subsequent views:
      deployStatus is 'ready' or 'building' — normal flow
```

---

## Edge Cases

- Multiple viewers open the same pre-migration showcase simultaneously — first one triggers deploy, others see 'building'. `triggerDeploy` should be idempotent (check status before deploying).
- Pre-migration showcase's ZIP blob URL is expired/deleted — deploy fails, show failed state with download fallback
- No pre-migration showcases exist — this chapter is a no-op, but the code path should exist for safety
- HTML showcases have deployStatus === null — migration logic only applies to `fileType === 'zip'`

---

## Focus Management

N/A — reuses existing states.

---

## Must Use

| Pattern | File to read |
|---|---|
| Gallery page | `src/app/gallery/[id]/page.tsx` |
| Deploy trigger | `src/features/showcase-gallery/deploy.ts` (from Ch 1) |
| Polling hook | `src/features/showcase-gallery/hooks/useDeployPolling.ts` (from Ch 5) |

---

## Wrong Paths

1. **Don't batch-migrate all showcases at once** — lazy migration on first view is simpler and avoids burning all build minutes at once.
2. **Don't trigger migration from the client** — do it in the server component before rendering. The client just sees 'building' status.
3. **Don't migrate HTML showcases** — only ZIP showcases need Vercel deployment. HTML showcases with `deployStatus === null` are fine.
4. **Don't re-trigger if already building** — check status is null (not 'building') before triggering.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test migration trigger for null-status showcases |
| **coding-standards** | Step 2 | Idempotent migration logic |
| **flow-observability** | Step 2 | Log migration triggers |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | Reuses existing elements from Ch 5/6 |

- Test: viewing a ZIP showcase with deployStatus null triggers deploy
- Test: viewing a ZIP showcase with deployStatus 'ready' does NOT trigger deploy
- Test: viewing an HTML showcase with deployStatus null does NOT trigger deploy
- Test: concurrent views of same showcase only trigger one deploy

---

## Critical Files

| File | Change |
|---|---|
| `src/app/gallery/[id]/page.tsx` | MODIFY: check for null deployStatus on ZIP, trigger migration |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- Given an existing pre-migration ZIP showcase with no deploy_status
- When a viewer opens it for the first time
- Then it is deployed on demand and shows "Building..." until ready

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Idempotent migration, race condition handling |
| Accessibility | No | No new UI |
| Security | No | No auth changes (viewing is public) |
| Observability | Yes | Log migration triggers with showcase ID |

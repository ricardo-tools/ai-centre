# Chapter 9: Remove StackBlitz

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 4
**User can:** Confirm StackBlitz and JSZip are no longer in the client bundle (check build output for reduced size).

## Goal

Remove all StackBlitz and client-side ZIP extraction code. Done when: `@stackblitz/sdk` and `jszip` are removed from `package.json`, all WebContainer/IndexedDB code is deleted, and the build succeeds with a smaller bundle.

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

No new UI — this is a cleanup chapter. Viewer already works via iframe from Ch 4.

---

## Widget Decomposition

No new widgets. ShowcaseViewerWidget gets code removed.

---

## ASCII Mockup

N/A — no visual changes. The viewer already works correctly from Ch 4.

---

## State Spec

Removed state:
  - `phase` (LoadingPhase) — no longer needed
  - `errorMsg` for WebContainer errors — no longer needed
  - IndexedDB cache functions — deleted
  - StackBlitzFullscreen component — deleted

---

## Data Flow

N/A — removing code, not adding flows.

---

## Edge Cases

- JSZip may still be used server-side in `deploy.ts` (Ch 1) for extracting uploaded ZIPs — keep the server-side import, only remove client-side usage
- Other files may import from `@stackblitz/sdk` — grep to find all usages

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| ShowcaseViewerWidget | `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` |
| package.json | `package.json` |

---

## Wrong Paths

1. **Don't remove jszip if it's used server-side** — check if `deploy.ts` (Ch 1) uses it for ZIP extraction. If so, keep it in dependencies but remove the client-side dynamic import.
2. **Don't leave dead type definitions** — remove `LoadingPhase`, `PHASE_LABELS`, `PHASE_PROGRESS` if no longer referenced.
3. **Don't forget to remove the IndexedDB database name constant** — `IDB_NAME`, `IDB_STORE`, `IDB_VERSION` and all cache functions.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **coding-standards** | Step 2 | Clean deletion, no dead code |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new elements |

- Verify build succeeds after removals
- Verify `@stackblitz/sdk` is NOT in node_modules or bundle
- Verify HTML showcase viewer still works (no regression)
- Verify ZIP showcase viewer works via iframe (Ch 4)
- Compare bundle size before/after

---

## Critical Files

| File | Change |
|---|---|
| `package.json` | MODIFY: remove @stackblitz/sdk (and jszip if client-only) |
| `package-lock.json` | MODIFY: regenerate |
| `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` | MODIFY: remove StackBlitz boot effect, IndexedDB cache, StackBlitzFullscreen, phase types/constants |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- Then @stackblitz/sdk and jszip are no longer in the client bundle

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | No dead code left behind, clean removal |
| Accessibility | No | No UI changes |
| Security | No | Removing code only |
| Observability | No | Removing code only |

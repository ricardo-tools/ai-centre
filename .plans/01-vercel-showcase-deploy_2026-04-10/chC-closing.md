# Chapter C: Closing

**Status:** Not started
**Tier:** —
**Depends on:** All chapters complete
**User can:** —

## Goal

Update PROJECT_REFERENCE.md and LOG.md to reflect the completed Vercel deploy system. Validate both documents against the actual codebase. Pure documentation — no code changes.

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

## Closing Methodology

```
STEP 0 — DIFF ANALYSIS subagent

  Compare what was PLANNED vs what was ACTUALLY built.
  Read: LOG.md chapter summaries, git log, plan decisions.
  Produce: diff report (as-planned, changed, discovered).

STEP 1 — PROJECT REFERENCE UPDATER subagent (receives diff report)
STEP 2 — LOG UPDATER subagent (receives diff report)

  Steps 1 + 2 run in parallel. Update from codebase, not plan.

STEP 3 — VALIDATOR subagent

  Cross-reference both docs against actual codebase.
  If corrections needed -> fix -> re-validate.

Done when validator confirms both docs match the codebase.
```

---

## What to Document

### PROJECT_REFERENCE.md updates

- Showcase gallery feature: add Vercel deploy system description
- New env vars: `VERCEL_SHOWCASE_TOKEN`, `SHOWCASE_JWT_SECRET`
- New DB columns: `deploy_status`, `deploy_url` on `showcase_uploads`
- New modules: `vercel-deploy.ts`, `showcase-token.ts`, `showcase-template.ts`
- Removed dependencies: `@stackblitz/sdk` (and `jszip` if client-only)
- Deployment architecture: separate Vercel project for showcases
- Security model: Edge Middleware + CSP frame-ancestors

### LOG.md updates

- Plan 01 summary: what was built, key decisions, what changed from original plan
- Transfer key decisions (D1-D6) from plan.md

---

## Critical Files

| File | Change |
|---|---|
| `PROJECT_REFERENCE.md` | MODIFY: showcase deploy system documentation |
| `.plans/LOG.md` | MODIFY: add Plan 01 completion entry |
| `.plans/01-vercel-showcase-deploy_2026-04-10/plan.md` | MODIFY: set status to Complete |

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | No | No code changes |
| Accessibility | No | No UI changes |
| Security | No | No code changes |
| Observability | No | No code changes |

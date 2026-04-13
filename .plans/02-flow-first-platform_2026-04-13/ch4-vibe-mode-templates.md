# Chapter 4: Vibe Mode Templates

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 2
**User can:** Bootstrap a creative/content project (social post, brochure, presentation) and get light methodology templates (DRAFT → REVIEW → REFINE → DELIVER).

## Goal

Add vibe mode detection and templates to bootstrap. When the conversation detects a creative/content project, bootstrap selects vibe mode automatically. `.flow/project.json` records `mode: "vibe"`. Vibe projects get lighter plan templates — no TDD, no strict planning phases. After this chapter, creative projects get appropriate methodology.

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

No new UI — changes are in skill files only.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. This chapter modifies skill files and templates only.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
During flow-bootstrap conversation:
  1. User describes project (e.g. "social media campaign for Q3")
  2. Project type detection classifies as creative/content
  3. Bootstrap sets mode: "vibe" in .flow/project.json
  4. Downloads vibe-specific plan templates instead of standard ones

Vibe methodology: DRAFT → REVIEW → REFINE → DELIVER
Standard methodology: TEST → BUILD → EVAL → RUN → AUDIT → LOG
```

---

## Edge Cases

- Ambiguous project type — default to standard mode, user can override
- Mixed project (has both code and content) — let user choose mode
- Switching mode after bootstrap — update project.json, re-generate CLAUDE.md

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Flow skill | `skills/flow/SKILL.md` |
| Standard plan template | `skills/flow-planning/PLAN_TEMPLATE_DEV.md` or similar |

---

## Wrong Paths

1. **Don't create a separate `flow-vibe` command** — vibe is part of bootstrap detection, not a standalone command.
2. **Don't make vibe mode apply TDD or strict gates** — the whole point is lighter methodology.
3. **Don't skip plan templates entirely** — vibe still has structure, just simpler.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **coding-standards** | Step 2 | Template structure and clarity |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- No server-side tests (skill file changes only)
- Verify vibe template has DRAFT/REVIEW/REFINE/DELIVER phases
- Verify visual template has design-specific phases

---

## Critical Files

| File | Change |
|---|---|
| `skills/flow-planning/plan-template-vibe.md` | NEW: vibe mode plan template |
| `skills/flow-planning/plan-template-vibe-visual.md` | NEW: visual/design vibe template |
| `skills/flow/SKILL.md` | MODIFY: project type detection, mode selection logic |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds: N/A (skill-only changes, no server endpoints)

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Template structure and clarity |
| Accessibility | No | No UI |
| Security | No | No server changes |
| Observability | No | No server changes |

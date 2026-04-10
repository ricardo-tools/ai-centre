# Dev Plan Chapter Template

> Copy for each dev chapter. Methodology is fixed. Other sections filled per-chapter.

---

## Development Methodology

One chapter = one concern. The chapter's "User can" line is the spec.

```
FOR EACH CHAPTER:

  1. TEST    Write failing tests for what "User can" describes.
             Extend journey test with this chapter's increment.
             Impact table for existing tests (keep/update/new/remove).
             No production code. Ref: flow-tdd skill.
  ┄┄┄┄┄┄┄┄
  GATE 1    Verify:
            □ Impact table present (keep/update/new/remove)
            □ Every layer has a test file
            □ Journey test extended with this chapter's assertions
            □ Tests FAIL

  2. BUILD   Minimum production code + polish.
             Follow the mockups, state spec, and guidelines in this chapter.
             Every code path must log (start, complete, error). Ref: flow-observability skill.
             Code must be small, composable, type-safe. Ref: coding-standards skill.
  ┄┄┄┄┄┄┄┄
  GATE 2    Verify:
            □ Every critical file from this chapter exists
            □ Polish criteria met
            □ Structured logging on every server action and data path

  3. EVAL    Runtime: pages render, APIs respond, no error logs, DB correct.
             Ref: flow-eval-driven skill.
             Fail → fix and re-eval.

  4. RUN     Run chapter tests + full vitest suite + tsc + build.
             Fail → fix and re-run.
  ┄┄┄┄┄┄┄┄
  GATE 3    Verify:
            □ All chapter tests GREEN
            □ No regressions

  5. AUDIT   Proportional to what changed (see Audit Scope below).
             Fail → fix and re-run from step 4.

  6. LOG     Update LOG.md + plan.md status.

COMPACT at every 10 dispatches or phase boundary.
Checkpoint → .claude/.strategic-context/ → compact → re-read plan.
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

## Chapter Header

> **Fill per-chapter.** Every chapter starts with this block.

```markdown
# Chapter N: [Title]

**Status:** Not started | In progress | Complete
**Tier:** Foundation | New Capability | Extension
**Depends on:** Chapter X
**User can:** [One sentence — what's testable in the browser after this chapter]

## Goal

[One paragraph: what this chapter delivers and how you know it's done.]
```

---

## Responsive & Layout

> **Fill per-chapter.** How this chapter's UI fits into the page layout.

```markdown
## Responsive & Layout

**Canonical layout:** [List-Detail | Supporting Pane | Feed | Single Column]
Ref: responsiveness skill.

**Target breakpoints:** [e.g. "Desktop only, min 1024px, LG variant only"]

### Content priority (what matters most)

1. [Primary — largest visual weight]
2. [Secondary — supporting info]
3. [Tertiary — system/meta info]

### Behaviour spec

| Dimension | This page |
|---|---|
| Input model | [Touch / Pointer / Both — hover states, click targets] |
| Information density | [High / Medium / Low — what's visible without scroll] |
| Hover states | [What changes on hover — affordances] |
| Keyboard | [Tab order, shortcuts, Enter/Escape behaviour] |

### Layout grid

[ASCII showing how fields/sections stack within the widget]
```

---

## Widget Decomposition

> **Fill per-chapter.** Widget tree, data hooks, size variants.

```markdown
## Widget Decomposition

### Widget tree

[Show parent → child hierarchy. Mark NEW / MODIFY per widget.
Include data hooks and what state they manage.]

### Data hooks

[Hook name, state fields, derived values, methods.
Specify types for key fields.]

### Size variants

[Which variants to build. For admin pages: LG only with justification.
Widget root delegates to size variant.]
```

---

## ASCII Mockup

> **Fill per-chapter.** Before/after showing the FULL page context (TopBar, nav, layout) not just the widget in isolation. Annotate with callouts for animations, tokens, interactions.

```markdown
## ASCII Mockup

### Before (previous chapter state)

[Full-page ASCII with TopBar, nav, sidebar, content area.
Show the state BEFORE this chapter's changes.]

### After (this chapter's additions)

[Same full-page ASCII with new elements annotated.
Callouts: ← animation name, ← token used, ← interaction trigger]
```

---

## State Spec

> **Fill per-chapter.** What state exists, where, transitions, loading states.

```markdown
## State Spec

[Hook/component name]:
  State:
    [field]: [type] — [description]

  Derived:
    [field]: [derivation]

  Transitions:
    [User action] → [state change]

  Loading:
    [What user sees during async operations]
```

---

## Data Flow

> **Fill per-chapter.** How data moves from user action to DB and back. Include exact function signatures and return types.

```markdown
## Data Flow

[User action]
  → [local state change]
  → [server action call]
      input: { [typed fields] }
      return: Result<[success type], [error types]>
      internally:
        1. [auth check]
        2. [validation]
        3. [DB operation]
        4. [audit log]
  → on Ok: [state update]
  → on Err: [error handling]
```

---

## Edge Cases

> **Fill per-chapter.** Every relevant edge case, inline. Not separate scenarios — just a bullet list of "if X then Y".

---

## Focus Management

> **Fill per-chapter.** Where focus goes after each user action.

```markdown
## Focus Management

| Action | Focus moves to |
|---|---|
| [User action] | [Element that receives focus] |
```

---

## Must Use (existing patterns)

> **Fill per-chapter.** Existing components and patterns the agent MUST reuse. With file paths.

```markdown
## Must Use

| Pattern | File to read |
|---|---|
| [What pattern] | [path/to/file.tsx] |
```

---

## Wrong Paths (known failure modes)

> **Fill per-chapter.** 2-5 specific mistakes to avoid, with WHY.

---

## Applied Skills

> **Fill per-chapter.** Skills to read before each step. Gated — not optional.

```markdown
## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test patterns, data isolation, factories |
| **frontend-architecture** | Step 2 | Widget structure, data hooks, size variants, inline styles, z-index |
| **responsiveness** | Step 2 | Content priority, density, hover states, canonical layout |
| **accessibility** | Step 2 | Focus management, ARIA roles, keyboard patterns |
| **interaction-motion** | Step 2 | State change animations, feedback timing |
| **brand-design-system** | Step 2 | Colour tokens, typography tokens |
| **content-design** | Step 2 | Microcopy: short labels, name the action/problem |
| **coding-standards** | Step 2 | Small functions, composition, type safety, naming |
| **flow-observability** | Step 2 | Structured logging: start, complete, error on every code path |
| **clean-architecture** | Step 2 | Server action structure, repository pattern, domain types |
```

---

## Test Hints

> **Fill per-chapter.** data-testids, mock strategy, non-obvious testing patterns.

```markdown
## Test Hints

| Element | data-testid |
|---|---|
| [UI element] | [testid] |

- [Mock strategy notes]
- [Integration test verification notes]
```

---

## Critical Files

> **Always present.** What files this chapter creates or modifies. Use widget naming conventions.

```markdown
## Critical Files

| File | Change |
|---|---|
| `src/features/[feature]/widgets/[Name]Widget.tsx` | NEW: widget root |
| `src/features/[feature]/widgets/[Name]LG.tsx` | NEW: LG size variant |
| `src/features/[feature]/hooks/use[Name].ts` | NEW: data hook |
| `src/features/[feature]/actions/[name]-action.ts` | NEW: server action |
| `src/tests/e2e/journey-[slug].spec.ts` | EXTEND |
```

---

## Journey Test Increment

> **Always present.** What this chapter adds to the E2E journey test.

```markdown
## Journey Test Increment

**Spec file:** `webapp/src/tests/e2e/journey-[slug].spec.ts`

This chapter adds:
- [User action → expected result]
```

---

## Audit Scope

> **Always present.** What audit checks apply, proportional to what changed.

```markdown
## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes/No | [specific files or "no new code"] |
| Accessibility | Yes/No | [new UI elements] |
| Security | Yes/No | [auth/input changes or "no auth changes"] |
| Observability | Yes/No | [server actions that need logging] |
```

---

## Research Brief (Foundation tier only)

> **Required for Foundation tier.** Optional for New Capability. Skip for Extension.

```markdown
## Research Brief

### Sources (CRAAP-tested)

| Source | Date | Authority | Key finding |
|---|---|---|---|
| [Article Title](url) — Author | Date | High/Med/Low | One-line finding |

### Ranked Approaches

| Rank | Approach | Verdict |
|---|---|---|
| **1 (chosen)** | [Approach] | Why chosen |
| 2 | [Alternative] | Why not |
```

---

## Bug / Root Cause Section (when applicable)

> **Include when the chapter fixes a known bug.**

```markdown
## Bug: [Short description]

### Root cause

`functionName()` in `file.ts:LINE` does X but should do Y because:
1. Step that happens
2. Step that should happen but doesn't
3. Observable symptom

### Fix

[Concrete description of what changes]
```

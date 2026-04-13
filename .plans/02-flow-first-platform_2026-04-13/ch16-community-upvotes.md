# Chapter 16: Community Upvotes

**Status:** Not started
**Tier:** New Capability
**Depends on:** None (standalone)
**User can:** Upvote community skills on the skill library page, see skills ranked by popularity.

## Goal

Add upvoting to skills using the existing `reactions` table. Upvote count displayed on skill cards, sort by popularity option, one upvote per user per skill. After this chapter, the skill library has community ranking.

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

## Widget Decomposition

- Existing skill cards get an upvote button (heart icon from Phosphor)
- `UpvoteButton` component — toggles fill on click, shows count, animated

---

## ASCII Mockup

```
┌─ Skill Card ────────────────────────┐
│  📄 flow-tdd                        │
│  Test-driven development for Flow   │
│                                     │
│  [coding] [testing]     ♥ 12        │
└─────────────────────────────────────┘
```

---

## State Spec

```
UpvoteButton:
  - isUpvoted: boolean (derived from user's existing reaction)
  - count: number (total upvotes for this skill)
  - isPending: boolean (while server action is in-flight)
  - Optimistic: toggle isUpvoted + count immediately, revert on error

Sort control:
  - sortBy: 'recent' | 'popular' (default: 'recent')
  - URL search param: ?sort=popular
```

---

## Data Flow

```
Skill library page:
  → getSkills server action includes upvote count (LEFT JOIN reactions, COUNT)
  → Sort options: "Recent" (default), "Most popular"
  → Each skill card shows upvote count

User clicks upvote on a skill:
  → toggleSkillUpvote server action
  → Check existing reaction (entity_type='skill', entity_id=skillId, user_id)
  → If exists: DELETE (un-upvote)
  → If not: INSERT
  → Return updated count
  → Animate count change
```

---

## Edge Cases

- Not logged in — upvote button disabled, tooltip "Log in to upvote"
- Rapid clicking — debounce, optimistic UI update
- Skill with 0 upvotes — show nothing (not "0")
- Sort by popular with ties — secondary sort by recent

---

## Focus Management

- Upvote button retains focus after click
- Count change announced via aria-live region

---

## Must Use

| Pattern | File to read |
|---|---|
| Reactions table | `src/platform/db/schema.ts` (existing reactions) |
| Social features | `src/features/social/` |
| Skill library | `src/features/skill-library/` |

---

## Wrong Paths

1. **Don't create a new table** — reuse existing reactions with entity_type='skill'
2. **Don't allow multiple upvotes per user** — enforce unique constraint
3. **Don't show upvote count as "0"** — hide when zero
4. **Don't fetch reaction status per-skill in separate queries** — batch in the list query

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test upvote toggle, count aggregation |
| **coding-standards** | Step 2 | Component structure |
| **flow-observability** | Step 2 | Log upvote events |

---

## Test Hints

| Element | data-testid |
|---|---|
| Upvote button | `upvote-button` |
| Upvote count | `upvote-count` |

- Test toggle creates reaction
- Test toggle again deletes reaction
- Test count aggregation is correct
- Test one upvote per user per skill
- Test sort by popularity

---

## Critical Files

| File | Change |
|---|---|
| `src/features/skill-library/action.ts` | MODIFY: add toggleSkillUpvote, include upvote count in getSkills |
| `src/features/skill-library/` | MODIFY: add upvote button to skill cards |
| `src/platform/components/UpvoteButton.tsx` | NEW: reusable upvote toggle |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Upvote toggle creates/removes reaction
- Skill listing includes upvote counts
- Sort by popularity works

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Upvote action, component |
| Accessibility | Yes | Button has aria-pressed, count is aria-live |
| Security | Yes | Auth required for upvote, no double-voting |
| Observability | Yes | Upvote events logged |

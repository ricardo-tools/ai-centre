# Chapter 17: Remove Toolkit & Generate

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 2 (bootstrap must be the replacement)
**User can:** No longer see `/toolkits` or `/generate` routes. Homepage updated to point to Flow onboarding instructions.

## Goal

Remove the old toolkit composition and project generation systems. Delete all related code, routes, and features. Update the homepage to replace toolkit cards with a Flow CTA. Drop the `generated_projects` table. After this chapter, the old system is gone.

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

No new widgets. Homepage section replaced, old widgets deleted.

---

## ASCII Mockup

```
Before:
┌─ Pick Your Toolkit ────────────────┐
│  [Dev Toolkit] [Design] [Marketing]│
│  Customise → Download ZIP          │
└─────────────────────────────────────┘

After:
┌─ Get Started with Flow ────────────┐
│  The AI operating system for your  │
│  projects.                         │
│                                    │
│  1. Add the Flow skill to Claude   │
│  2. Run flow-login                 │
│  3. Run flow-bootstrap             │
│                                    │
│  [Browse Skills →]                 │
└─────────────────────────────────────┘
```

---

## State Spec

N/A — deletion chapter. Homepage Flow CTA is a static server component.

---

## Data Flow

```
Delete:
  src/features/generate-project/   — entire directory
  src/features/archetypes/          — entire directory
  src/app/generate/                 — entire directory
  src/app/toolkits/                 — entire directory
  src/platform/lib/toolkit-composition.ts
  src/platform/lib/archetypes.ts
  src/platform/screens/Generate/    — if exists
  src/platform/screens/Toolkits/    — if exists

Update:
  src/app/page.tsx (homepage)       — replace toolkit section with Flow CTA
  src/platform/db/schema.ts         — remove generated_projects table definition
  Navigation                        — remove /generate and /toolkits links

Migration:
  Drop generated_projects table (if safe — check no foreign keys)
```

---

## Edge Cases

- Existing generated_projects data — migration drops table, data is lost (acceptable, old system)
- External links to /generate or /toolkits — redirect to homepage (or 404)
- Tests referencing old features — remove them
- Imports from deleted features — find and remove all references

---

## Focus Management

N/A — deletion chapter. Flow CTA follows standard link focus behavior.

---

## Must Use

| Pattern | File to read |
|---|---|
| Homepage | `src/app/page.tsx` |
| Navigation | find nav component |
| Schema | `src/platform/db/schema.ts` |

---

## Wrong Paths

1. **Don't keep old code "just in case"** — it's being replaced, delete completely
2. **Don't forget to check for imports** — grep for toolkit-composition, archetypes, generate-project
3. **Don't leave dead navigation links**
4. **Don't drop the table without checking foreign keys first**

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Remove old tests, add homepage CTA tests |
| **coding-standards** | Step 2 | Clean removal |
| **flow-observability** | Step 2 | N/A — deletion chapter |

---

## Test Hints

| Element | data-testid |
|---|---|
| Flow CTA section | `flow-cta` |
| Browse Skills link | `browse-skills-link` |

- Remove all tests for deleted features
- Test homepage renders Flow CTA section
- Test /generate returns 404 or redirects
- Test /toolkits returns 404 or redirects

---

## Critical Files

| File | Change |
|---|---|
| `src/features/generate-project/` | DELETE: entire directory |
| `src/features/archetypes/` | DELETE: entire directory |
| `src/app/generate/` | DELETE: entire directory |
| `src/app/toolkits/` | DELETE: entire directory |
| `src/platform/lib/toolkit-composition.ts` | DELETE |
| `src/platform/lib/archetypes.ts` | DELETE |
| `src/app/page.tsx` | MODIFY: replace toolkit section with Flow CTA |
| `src/platform/db/schema.ts` | MODIFY: remove generated_projects |
| `src/platform/db/migrations/0019_drop_generated_projects.sql` | NEW: DROP TABLE |
| Navigation component | MODIFY: remove old links |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Homepage renders Flow CTA
- Old routes return 404

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | No dead imports, clean homepage |
| Accessibility | Yes | Flow CTA section has proper headings and link labels |
| Security | No | Deletion only |
| Observability | No | Deletion only |

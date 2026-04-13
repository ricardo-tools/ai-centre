# Chapter 6: Skill Rollback

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 5
**User can:** Run `flow-skills rollback`, see version history with commit messages, pick a version, and see the skill restored to that version.

## Goal

Add rollback capability to skill versioning. Rollback creates a new version from old content (append-only history). After this chapter, users can undo a bad skill publish.

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

No new UI — changes are in the API route and Flow skill only.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. Rollback is a CLI command in the editor.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
flow-skills rollback command:
  1. Read auth token from .flow/credentials.json
  2. GET {AI_CENTRE_URL}/api/skills/{slug}/versions
     → Returns: [{ version, commitMessage, createdAt }]
  3. Present version history to user
  4. User picks a version to restore
  5. POST {AI_CENTRE_URL}/api/skills/{slug}/rollback
     Body: { targetVersion: number }
  6. Server:
     a. Fetch content from target version
     b. Create new version with content from target, commit_message: "Rollback to v{N}"
     c. Return new version number
  7. Confirm: "Restored {name} to v{target} (now v{new})"
```

---

## Edge Cases

- Rollback to current version — no-op, return current version
- Rollback to non-existent version — 404
- Rollback someone else's skill — 403
- Only one version exists — rollback is a no-op, inform user

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Skill versions | `src/app/api/skills/[slug]/versions/route.ts` (from Ch 5) |
| Auth | `src/platform/lib/oauth.ts` (from Ch 0) |

---

## Wrong Paths

1. **Don't delete versions on rollback** — append-only history.
2. **Don't allow rollback without auth** — owner only.
3. **Don't re-download the skill locally** — that's the user's job after rollback.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test rollback creates new version |
| **coding-standards** | Step 2 | Thin route, logic in lib |
| **flow-observability** | Step 2 | Log rollback events |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test rollback creates new version with old content
- Test rollback to non-existent version returns 404
- Test only owner can rollback
- Journey: user publishes v1, publishes v2, rolls back to v1 (creates v3 with v1 content)

---

## Critical Files

| File | Change |
|---|---|
| `src/app/api/skills/[slug]/rollback/route.ts` | NEW: rollback endpoint |
| `skills/flow/SKILL.md` | MODIFY: add flow-skills rollback command |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Rollback creates a new version from target version's content
- Rollback requires ownership

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Rollback route |
| Accessibility | No | No UI |
| Security | Yes | Owner-only guard |
| Observability | Yes | Rollback events logged |

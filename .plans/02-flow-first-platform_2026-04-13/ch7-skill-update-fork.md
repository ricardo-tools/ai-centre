# Chapter 7: Skill Update & Fork

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapter 5
**User can:** Run `flow-update`, see which skills have upstream updates, view diffs for modified skills, and choose to accept (overwrite) or fork (keep their version, stop updates).

## Goal

Build the skill update detection and fork mechanism. When official skills are updated, users who have modified them locally must choose: accept the update (overwrite) or fork (keep their version, stop receiving updates). After this chapter, the skill ecosystem supports divergence without confusion.

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

N/A — no UI changes. Update and fork are CLI commands in the editor.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
flow-update command:
  1. Read .flow/project.json for installed skills [{slug, version, checksum, forked}]
  2. Filter out forked skills (they don't get updates)
  3. GET {AI_CENTRE_URL}/api/skills/updates
     Body: { skills: [{ slug, version, checksum }] }
     → Returns: [{ slug, latestVersion, currentVersion, hasLocalChanges }]
  4. For each skill with updates:
     a. If no local changes: auto-update (download new version, update project.json)
     b. If local changes: show diff, ask user:
        - "Accept" → overwrite local with upstream, update version
        - "Fork" → mark as forked in project.json, stop future updates
  5. Also check if Flow skill itself has updates → auto-update

Server endpoint:
  GET /api/skills/updates
  Body: [{ slug, version, checksum }]
  For each skill:
    - Compare version with latest published version
    - Compare checksum to detect local modifications
    - Return update status
```

---

## Edge Cases

- All skills up to date — "Everything is up to date"
- Skill removed from server — warn user, don't delete local copy
- Forked skill with same slug as new official skill — no conflict (different sources)
- Network failure during update — partial updates are OK (each skill independent)
- Checksum computation mismatch (line endings) — normalize before hashing

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Skill content API | `src/app/api/skills/[slug]/content/route.ts` (from Ch 2) |
| Auth | `src/platform/lib/oauth.ts` |

---

## Wrong Paths

1. **Don't attempt three-way merge** — binary choice (accept or fork) is the design decision (D4).
2. **Don't auto-update modified skills** — always ask the user.
3. **Don't store fork status on the server** — it's in the local `.flow/project.json` only.
4. **Don't check community skills for updates** — only official skills have upstream.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test update detection, checksum comparison |
| **coding-standards** | Step 2 | Clean API route |
| **flow-observability** | Step 2 | Log update checks and decisions |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test updates endpoint detects version mismatch
- Test updates endpoint detects local modifications via checksum
- Test forked skills excluded from update check
- Journey: user installs skill v1, server publishes v2, update detects the diff

---

## Critical Files

| File | Change |
|---|---|
| `src/app/api/skills/updates/route.ts` | NEW: check for updates endpoint |
| `skills/flow/SKILL.md` | MODIFY: add flow-update command |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Updates endpoint returns skills with newer versions
- Checksum comparison detects local modifications

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Updates route, checksum logic |
| Accessibility | No | No UI |
| Security | Yes | Auth required, no skill content leakage in update check |
| Observability | Yes | Update checks logged |

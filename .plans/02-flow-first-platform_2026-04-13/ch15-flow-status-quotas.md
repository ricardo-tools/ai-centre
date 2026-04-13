# Chapter 15: Flow Status + Quotas

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 2
**User can:** Run `flow-status` and see workspace info (databases provisioned, storage used, skills published, quota remaining) alongside project state.

## Goal

Extend the `flow-status` command to show workspace quota information from the server alongside local project state. After this chapter, users have a single command to see their full platform status.

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

No new UI — changes are in the Flow skill file only (CLI output formatting).

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

```
Flow Status
═══════════
Project: Credit App Dashboard
Mode: standard
Skills: 5 installed (flow-tdd, coding-standards, ...)

Workspace (alice@ezycollect.com.au)
────────────────────────────────────
Skills published:  3 / 10
Databases:         1 / 2
Storage:          24 MB / 100 MB
```

When not authenticated:
```
Flow Status
═══════════
Project: Credit App Dashboard
Mode: standard
Skills: 5 installed (flow-tdd, coding-standards, ...)

Workspace: not connected
  Run flow-login for workspace info
```

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
flow-status command:
  1. Read .flow/project.json for local state:
     - Project name, description, mode (standard/vibe)
     - Installed skills with versions
     - Linked databases
  2. If authenticated (credentials.json exists):
     GET {AI_CENTRE_URL}/api/workspace
     → Returns: { quotas: { skillLimit, skillsUsed, schemaLimit, schemasUsed, storageLimitBytes, storageUsedBytes } }
  3. Display combined status (see ASCII Mockup above)
  4. If not authenticated: show local status only + "Run flow-login for workspace info"
```

---

## Edge Cases

- Not authenticated — show local status only with login prompt
- API unreachable — show local status + "Could not reach AI Centre"
- No .flow/project.json — "Not a Flow project. Run flow-bootstrap to get started."
- Quota at limit — highlight in warning colour

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Workspace API | `src/app/api/workspace/route.ts` (from Ch 1) |
| Flow skill | `skills/flow/SKILL.md` |

---

## Wrong Paths

1. **Don't create a new API endpoint** — reuse GET /api/workspace from Ch 1.
2. **Don't require authentication for local status** — only for workspace info.
3. **Don't cache quota info locally** — always fetch fresh.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **coding-standards** | Step 2 | Clean status output formatting |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- No server-side tests (skill file changes only)
- Verify status command documentation in Flow skill

---

## Critical Files

| File | Change |
|---|---|
| `skills/flow/SKILL.md` | MODIFY: extend flow-status with workspace info |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds: N/A (skill-only changes, no new server endpoints)

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Status command clarity |
| Accessibility | No | No UI |
| Security | No | No server changes |
| Observability | No | No server changes |

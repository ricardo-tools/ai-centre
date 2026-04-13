# Chapter 18: Showcase Migration

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 9
**User can:** See existing showcases in the new versioned model with "Initial version" as commit message.

## Goal

Migrate existing showcase data into the versioned model. For each existing showcase, create a `showcase_versions` row with version 1 and "Initial version" commit message. Update queries to read from the versions table. After this chapter, all showcases — old and new — use the same versioning system.

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

No new widgets. Existing gallery queries updated to include version data.

---

## ASCII Mockup

N/A — no UI changes. Existing showcases will now have version history visible through the same UI built in Chapter 9.

---

## State Spec

N/A — no client state changes. Migration is server-side only; query changes return additional fields.

---

## Data Flow

```
Migration script (runs once):
  1. SELECT * FROM showcase_uploads WHERE archived = false
  2. For each showcase:
     a. Check if version already exists (idempotent)
     b. INSERT INTO showcase_versions:
        - showcase_id: showcase.id
        - version_number: 1
        - blob_url: showcase.blob_url
        - commit_message: 'Initial version'
        - created_at: showcase.created_at
  3. Log: migrated N showcases

Query updates:
  - getShowcase now includes latest version info
  - Gallery listing includes version count
```

---

## Edge Cases

- Showcase with no blob_url (HTML-only) — still create version with null blob_url
- Migration run twice — idempotent (check existing versions before insert)
- Archived showcases — skip (they're hidden)
- Showcase with existing versions (from Ch 9) — skip, already versioned

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Showcase schema | `src/platform/db/schema.ts` |
| Gallery actions | `src/features/showcase-gallery/action.ts` |
| Migration pattern | `src/platform/db/migrations/` |

---

## Wrong Paths

1. **Don't delete old blob_url column** — keep for backward compatibility during transition
2. **Don't make migration destructive** — INSERT only, no DELETE or UPDATE on existing data
3. **Don't break existing gallery queries** — add version data alongside, don't replace

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test migration creates versions for existing showcases |
| **coding-standards** | Step 2 | Clean migration script |
| **flow-observability** | Step 2 | Log migration progress |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test migration creates version 1 for each showcase
- Test idempotency — running twice doesn't duplicate
- Test gallery query includes version data
- Journey: existing showcases have version history

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/db/migrations/0020_migrate_showcase_versions.sql` | NEW: INSERT INTO showcase_versions from existing data |
| `src/features/showcase-gallery/action.ts` | MODIFY: queries include version data |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Existing showcases have version 1 after migration
- Gallery query returns version count

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Migration script, updated queries |
| Accessibility | No | No UI changes |
| Security | No | Migration only |
| Observability | Yes | Migration logged |

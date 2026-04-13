# Chapter 11: Migration & Seed Ref Files

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 10
**User can:** Run migrations to create tables and seed data in their bootstrapped Turso database.

## Goal

Create ref files for database migrations and seeding that target the Turso/libSQL dialect. Bootstrapped projects get a working migration runner and seed script. After this chapter, users can define schemas and populate their databases.

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

No new UI — ref files live in the skill directory and are copied to user projects by the agent.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. Ref files live in skill directory.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
After bootstrap with DB (Ch 10):
  Project has:
    drizzle.config.ts         -- turso dialect, migrations directory
    src/db/schema.ts          -- starter schema (users table example)
    src/db/client.ts          -- Drizzle client with libsql
    src/db/migrate.ts         -- migration runner script
    src/db/seed.ts            -- seed script template
    package.json scripts:
      "db:generate": "drizzle-kit generate"
      "db:migrate": "tsx src/db/migrate.ts"
      "db:seed": "tsx src/db/seed.ts"
      "db:studio": "drizzle-kit studio"

User workflow:
  1. Edit src/db/schema.ts
  2. npm run db:generate -> creates SQL migration
  3. npm run db:migrate -> applies migration to Turso DB
  4. npm run db:seed -> inserts starter data
  5. npm run db:studio -> verify in Drizzle Studio
```

---

## Skill Reference Files

All ref files live inside `skills/db-turso-drizzle/references/` as markdown files with copy-paste code blocks, following the standard skill reference pattern (see `skills/playwright-e2e/references/templates.md` for format). The agent reads these references and writes the code to the user's project — it does NOT generate migration/seed logic from scratch.

| Ref file | Contains |
|---|---|
| `skills/db-turso-drizzle/references/migrations.md` | Copy-paste templates for migrate.ts runner, seed.ts template, package.json script additions |

Ch 10's `templates.md` already covers drizzle.config.ts, client.ts, and schema.ts. This chapter adds the migration and seed templates to the same skill's references.

All ref files use SQLite-compatible types (text, integer, real) — not Postgres types.

---

## Edge Cases

- User already has drizzle.config.ts — skip or ask to overwrite
- SQLite vs Postgres differences — ref files must use SQLite types (text, integer, real)
- Missing @libsql/client dep — bootstrap adds to package.json
- Turso DB not provisioned — skip migration refs, warn user

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Current migration system | `src/platform/db/` + `scripts/migrate.ts` |
| Drizzle config | `drizzle.config.ts` in project root |

---

## Wrong Paths

1. **Don't use Postgres types in ref files** — Turso is SQLite dialect.
2. **Don't bundle Drizzle in the ref files** — user installs it as a dependency.
3. **Don't auto-run migrations** — user runs them manually.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test skill reference content |
| **coding-standards** | Step 2 | Clean template structure |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test skill reference files exist and contain valid code blocks
- Test templates use SQLite-compatible types
- Test migration runner template compiles
- Journey: migration ref files are accessible in the skill directory

---

## Critical Files

| File | Change |
|---|---|
| `skills/db-turso-drizzle/references/migrations.md` | NEW: migrate.ts runner, seed.ts template, package.json scripts |
| `skills/db-turso-drizzle/SKILL.md` | MODIFY: add migration/seed guidance |
| `skills/flow/SKILL.md` | MODIFY: bootstrap references migration refs for DB projects |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- N/A (skill reference files only, no new server endpoints)

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Ref file templates |
| Accessibility | No | No UI |
| Security | No | Skill ref files only |
| Observability | Yes | Download events logged |

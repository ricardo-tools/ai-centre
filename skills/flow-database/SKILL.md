---
name: flow-database
description: Database setup and management for Flow projects. Local SQLite via Docker, Turso for production. Covers schema, migrations, seeds, and the CLAUDE.md database section.
---

# Flow: Database

Database infrastructure for Flow-bootstrapped projects. Local dev uses SQLite via Docker (`libsql-server`). Production uses Turso (libSQL). Same schema, same code, same queries — just a different `DATABASE_URL`.

## When to Use

Applied automatically during `/flow bootstrap` when the project needs a database. Also apply when:
- Adding database support to an existing Flow project
- Changing the schema or adding migrations
- Setting up seeds or fixtures

## Principles

### 1. Migrations are immutable

Once a migration file is committed, it is never edited. If a migration is wrong, create a new migration that corrects it. This ensures every environment applies the exact same sequence of changes.

### 2. Migrations run in order, always

Migrations are numbered sequentially (0000, 0001, ...). They execute in that order on every environment. Skipping or reordering breaks the schema. Drizzle's `_journal.json` tracks what has been applied — never edit it manually.

### 3. Schema is the source of truth

`src/db/schema.ts` defines the database. Migrations are derived from it via `npm run db:generate`. Never write migration SQL by hand — let Drizzle generate it from schema changes. The schema file IS the documentation.

### 4. Migrations auto-apply on startup

`npm run dev` runs migrations before starting the app (via `predev` script). Production runs migrations at build time. No manual migration commands needed in normal workflow.

### 5. Seeds are idempotent

Seeds must be safe to run repeatedly. Use `onConflictDoNothing()` for fixed-ID records, or existence checks for generated IDs. Seeds run on cold start via `instrumentation.ts` — if they're not idempotent, every restart breaks.

### 6. One migration per schema change

Each migration addresses one concern: add a table, add a column, create an index. Don't batch unrelated changes. This gives granular rollback points and clear git history.

### 7. No raw SQL in application code

Use Drizzle ORM for all queries. Raw SQL belongs only in migration files. Exceptions: complex subqueries where Drizzle's API can't express it (use `sql` tagged template, not string concatenation).

### 8. SQLite type discipline

SQLite has a limited type system. Follow these rules:
- UUIDs → `text` with `crypto.randomUUID()`
- Timestamps → `integer({ mode: 'timestamp' })` (Unix timestamps)
- Booleans → `integer({ mode: 'boolean' })`
- JSON → `text` (serialize/parse in app code)
- Enums → `text` with application-level validation
- No arrays — use join tables or JSON text

### 9. Sensitive data is always hashed

Never store plaintext passwords, tokens, or secrets. Hash with SHA-256 before storage. Store the hash, compare hashes on verification.

### 10. Test migrations locally first

`npm run dev` catches migration errors immediately. Always verify schema changes work locally before pushing. If `npm run dev` succeeds, the migration is safe.

## Environments

| | Local | Production |
|---|---|---|
| **Engine** | SQLite (libsql-server via Docker) | Turso (libSQL) |
| **URL** | `http://localhost:8080` | `libsql://name-org.turso.io` |
| **Auth** | None | `DATABASE_AUTH_TOKEN` |
| **Docker** | Auto-started by `npm run dev` | N/A |
| **Migrations** | Auto on `npm run dev` | Auto on build |
| **Seeds** | Auto on cold start | Auto on cold start |

## Developer Workflow

```
1. Edit src/db/schema.ts           ← change tables/columns
2. npm run db:generate             ← Drizzle creates migration SQL
3. npm run dev                     ← auto: Docker → migrate → start
4. Verify in db:studio             ← visual browser
5. Commit schema.ts + migration    ← both go in the same commit
```

## References

- [Docker Compose](references/docker-compose.md) — libsql-server service
- [Ensure Docker](references/ensure-docker.md) — auto-start script
- [Drizzle Config](references/drizzle-config.md) — drizzle.config.ts
- [Client](references/client.md) — src/db/client.ts
- [Schema](references/schema.md) — starter schema template
- [Migrate](references/migrate.md) — predev wiring + migration runner
- [Seed](references/seed.md) — seed template + idempotency rules
- [CLAUDE.md Insert](references/claude-md-insert.md) — database section for project CLAUDE.md

---
name: flow-database-claude-md-insert
type: reference
companion_to: flow-database
description: Markdown fragment to insert into a project's CLAUDE.md. Documents database setup, migration process, and environment details.
---

# CLAUDE.md Database Section

**Insert instruction:** Read the project's existing `CLAUDE.md`. Insert this section after all `> Apply the **{skill}** skill` directives. If there's a `---` separator after the directives, insert before it. Preserve everything else in the file.

---

## Content to insert

```markdown
---

## Database

| | Local | Production |
|---|---|---|
| **Engine** | SQLite (libsql-server via Docker) | Turso (libSQL) |
| **URL** | `http://localhost:8080` | `libsql://name-org.turso.io` |
| **Auth** | None | `DATABASE_AUTH_TOKEN` env var |
| **Docker** | Auto-started by `npm run dev` | N/A |
| **Migrations** | Auto on `npm run dev` | Auto on build |
| **Seeds** | Auto on cold start | Auto on cold start |

### Principles

- **Migrations are immutable.** Never edit a committed migration file. Create a new one to fix mistakes.
- **Migrations run in order.** Sequential numbering (0000, 0001, ...). Drizzle's `_journal.json` tracks state — never edit it manually.
- **Schema is the source of truth.** `src/db/schema.ts` defines the database. Migrations are generated from it via `npm run db:generate`.
- **Seeds are idempotent.** Use `onConflictDoNothing()` or existence checks. Seeds run on every cold start — they must be safe to repeat.
- **One migration per schema change.** Don't batch unrelated changes in a single migration.
- **No raw SQL in application code.** Use Drizzle ORM. Raw SQL only in migration files.
- **SQLite types only.** `text` for UUIDs, `integer` for timestamps/booleans, no Postgres-specific types.
- **Hash sensitive data.** Never store plaintext passwords or tokens. SHA-256 minimum.

### Schema & Migrations

```bash
# Change the schema
vim src/db/schema.ts

# Generate a migration from schema changes
npm run db:generate

# Migrations apply automatically on:
npm run dev          # local — predev runs ensure-docker + migrate
npm run build        # production — prebuild runs migrate

# Manual commands (rarely needed)
npm run db:migrate   # apply pending migrations
npm run db:seed      # run seed script
npm run db:studio    # visual DB browser at local.drizzle.studio
```

### Environment Variables (.env.local)

```bash
# Local dev (Docker libsql-server — auto-started)
DATABASE_URL=http://localhost:8080

# Production (uncomment and set):
# DATABASE_URL=libsql://your-db-name-org.turso.io
# DATABASE_AUTH_TOKEN=your-turso-auth-token
```

### File Structure

```
src/db/
├── schema.ts          # Source of truth — define tables here
├── client.ts          # Drizzle client (shared import)
├── seed.ts            # Seed script (idempotent)
└── migrations/
    ├── 0000_*.sql      # Generated migration files (never edit)
    └── meta/
        └── _journal.json  # Migration tracking (never edit)
```
```

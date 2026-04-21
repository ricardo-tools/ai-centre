---
name: flow-database-migrate
type: reference
companion_to: flow-database
description: Migration setup — predev wiring, package.json scripts. Migrations auto-run on npm run dev.
---

# Migration Setup

## package.json scripts

Add these to the project's `package.json`:

```json
{
  "scripts": {
    "predev": "bash scripts/ensure-docker.sh && drizzle-kit migrate",
    "dev": "next dev",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx src/db/seed.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

`predev` runs automatically before `npm run dev`:
1. `ensure-docker.sh` — starts Docker + libsql container if needed
2. `drizzle-kit migrate` — applies all pending migrations

No manual migration commands needed in normal workflow.

## How migrations work

```
Developer changes schema:
  1. Edit src/db/schema.ts
  2. Run: npm run db:generate
  3. Drizzle Kit creates: src/db/migrations/NNNN_name.sql
  4. Drizzle Kit updates: src/db/migrations/meta/_journal.json

Migration applies:
  1. npm run dev triggers predev
  2. predev runs drizzle-kit migrate
  3. Drizzle reads _journal.json for unapplied migrations
  4. Applies them in order (0000, 0001, 0002, ...)
  5. Records applied state in the DB itself

Production:
  - Same process at build time (prebuild script)
  - Or via instrumentation.ts on cold start
```

## Migration file structure

```
src/db/
├── migrations/
│   ├── 0000_initial.sql
│   ├── 0001_add_posts.sql
│   ├── 0002_add_comments.sql
│   └── meta/
│       ├── _journal.json        ← tracks applied state, NEVER edit
│       ├── 0000_snapshot.json
│       ├── 0001_snapshot.json
│       └── 0002_snapshot.json
├── schema.ts                    ← source of truth
├── client.ts
└── seed.ts
```

## Rules

- **Never edit a committed migration** — create a new one to fix it
- **Never edit `_journal.json`** — Drizzle Kit manages it
- **Always commit schema.ts + migration together** — they're a pair
- **One concern per migration** — don't batch unrelated changes
- **Test locally first** — `npm run dev` catches errors immediately

## Dependencies

```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit tsx
```

---
name: db-turso-drizzle
description: Database setup using Turso (libSQL) with Drizzle ORM. Covers schema definition, migrations, client setup, and SQLite dialect constraints.
---

# Database: Turso + Drizzle

Set up and work with Turso (libSQL) databases using Drizzle ORM.

## When to Use

- The project needs a persistent database
- SQLite-compatible workloads (most CRUD apps, content management, user data)
- Projects bootstrapped via Flow that requested database support

## When NOT to Use

- Projects that require Postgres-specific features (jsonb operators, full-text search with tsvector, advanced window functions)
- Projects needing multiple concurrent write-heavy connections (SQLite has a single writer)

## Setup

The project should have these files after bootstrap:

| File | Purpose |
|---|---|
| `drizzle.config.ts` | Drizzle Kit configuration (Turso dialect) |
| `src/db/client.ts` | Database client setup (libsql + Drizzle) |
| `src/db/schema.ts` | Schema definitions |
| `src/db/migrations/` | Generated SQL migrations |

Environment variables (in `.env.local`):

```
DATABASE_URL=libsql://your-db-name-org.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

## Drizzle Patterns

### Schema Definition

Use `sqliteTable` from `drizzle-orm/sqlite-core`. SQLite has a limited type system:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),         // Use text for UUIDs
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

### SQLite Dialect Constraints (vs Postgres)

| Feature | SQLite / Turso | Postgres |
|---|---|---|
| UUID type | Use `text` | Native `uuid` |
| Timestamps | `integer` (unix) or `text` (ISO) | Native `timestamp` |
| JSON | `text` (store as string, parse in app) | Native `jsonb` with operators |
| Boolean | `integer` (0/1) | Native `boolean` |
| Auto-increment | `integer().primaryKey({ autoIncrement: true })` | `serial` or `uuid.defaultRandom()` |
| Enums | Use `text` with CHECK constraints | Native `pgEnum` |
| Arrays | Not supported — use join table or JSON text | Native array types |
| ALTER TABLE | Limited (no DROP COLUMN before 3.35) | Full support |

### Migrations & Seeds

The bootstrapped project includes `src/db/migrate.ts` (runner) and `src/db/seed.ts` (seed template), plus `package.json` scripts for the standard workflow. See [migrations.md](references/migrations.md) for the full templates.

```bash
npm run db:generate    # Generate migration SQL from schema changes
npm run db:migrate     # Apply pending migrations to Turso
npm run db:seed        # Run seed script (idempotent)
npm run db:studio      # Visual DB browser (local.drizzle.studio)
```

**Rules:**
- Always use `.onConflictDoNothing()` or existence checks in seeds — they must be idempotent
- Never edit `src/db/migrations/meta/_journal.json` manually — Drizzle Kit manages it
- SQLite has limited `ALTER TABLE` — plan schema changes carefully (see table above)

### Client Usage

```typescript
import { db } from '@/db/client';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Select
const allUsers = await db.select().from(users);
const user = await db.select().from(users).where(eq(users.id, 'abc')).get();

// Insert
await db.insert(users).values({ id: crypto.randomUUID(), name: 'Alice', email: 'alice@example.com', createdAt: new Date() });

// Update
await db.update(users).set({ name: 'Bob' }).where(eq(users.id, 'abc'));

// Delete
await db.delete(users).where(eq(users.id, 'abc'));
```

### Transactions

```typescript
await db.transaction(async (tx) => {
  await tx.insert(users).values({ ... });
  await tx.insert(posts).values({ ... });
});
```

## References

- [Templates](references/templates.md) — copy-paste starter files for drizzle.config.ts, client.ts, schema.ts
- [Migrations](references/migrations.md) — migrate.ts runner, seed.ts template, package.json scripts

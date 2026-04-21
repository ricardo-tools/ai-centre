---
name: db-turso-drizzle-migrations
type: reference
companion_to: db-turso-drizzle
description: Copy-paste templates for Turso/libSQL migration runner, seed script, and package.json scripts. SQLite dialect only.
---

# Migration & Seed Templates

> **Companion to [db-turso-drizzle](../SKILL.md).** Copy these templates into a bootstrapped project to get working migrations and seeding.

All templates use SQLite types (`text`, `integer`, `real`) — never Postgres types.

---

## Prerequisites

These files should already exist from [templates.md](templates.md):
- `drizzle.config.ts`
- `src/db/schema.ts`
- `src/db/client.ts`

And these env vars in `.env.local`:

```
DATABASE_URL=libsql://your-db-name-org.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

---

## Migration Runner — `src/db/migrate.ts`

```typescript
import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url) {
    console.error('DATABASE_URL is required. Set it in .env.local');
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const db = drizzle(client);

  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './src/db/migrations' });
  console.log('Migrations complete.');

  client.close();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

---

## Seed Script Template — `src/db/seed.ts`

```typescript
import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { users } from './schema';

async function main() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url) {
    console.error('DATABASE_URL is required. Set it in .env.local');
    process.exit(1);
  }

  const client = createClient({ url, authToken });
  const db = drizzle(client);

  console.log('Seeding database...');

  // Example: insert starter users. Replace with your own seed data.
  await db.insert(users).values([
    {
      id: crypto.randomUUID(),
      name: 'Admin',
      email: 'admin@example.com',
      createdAt: new Date(),
    },
  ]).onConflictDoNothing();

  console.log('Seeding complete.');
  client.close();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
```

---

## `package.json` — Script Additions

Add these scripts to the project's `package.json`:

```json
{
  "scripts": {
    "predev": "bash scripts/ensure-docker.sh && npm run db:migrate",
    "dev": "next dev",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:seed": "tsx src/db/seed.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

`predev` ensures Docker is running + runs migrations automatically on every `npm run dev`. No manual steps needed.

Required dependencies (should already be installed from [templates.md](templates.md)):

```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit tsx dotenv
```

---

## Typical Workflow

```bash
# 1. Edit src/db/schema.ts — add/change tables
npm run db:generate         # creates SQL migration in src/db/migrations/

# 2. Apply the migration to Turso
npm run db:migrate

# 3. (Optional) Populate with seed data
npm run db:seed

# 4. Verify in a visual browser
npm run db:studio           # opens https://local.drizzle.studio
```

---

## Idempotent Seeds

Always use `.onConflictDoNothing()` or check existence before inserting, so seeds can re-run safely:

```typescript
await db.insert(users)
  .values({ id: 'fixed-id', ... })
  .onConflictDoNothing();
```

For fixed IDs (dev users, system roles), this is enough. For generated IDs (`crypto.randomUUID()`), guard with a SELECT first:

```typescript
const existing = await db.select().from(users).where(eq(users.email, 'admin@example.com')).get();
if (!existing) {
  await db.insert(users).values({ id: crypto.randomUUID(), ... });
}
```

---

## Migration Directory Convention

Drizzle Kit writes migrations to the directory configured in `drizzle.config.ts`. Default convention:

```
src/db/
├── migrations/
│   ├── 0000_initial.sql
│   ├── 0001_add_posts.sql
│   └── meta/
│       ├── _journal.json
│       └── 0000_snapshot.json
├── schema.ts
├── client.ts
├── migrate.ts
└── seed.ts
```

Never edit `meta/_journal.json` manually — Drizzle Kit manages it.

---

## Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `DATABASE_URL is required` | `.env.local` missing or not loaded | Ensure `dotenv/config` is imported first in migrate/seed scripts |
| `LibsqlError: SQLITE_ERROR: table already exists` | Migration already applied | Check `drizzle.config.ts` migrations path matches the runner |
| `Cannot find module '@libsql/client'` | Dep not installed | `npm install @libsql/client` |
| `Type X is not assignable to Y` on insert | Date vs integer mismatch | Use `new Date()` with `{ mode: 'timestamp' }` column, not raw numbers |
| Drizzle Studio blank | Auth token missing | Ensure `DATABASE_AUTH_TOKEN` is set |

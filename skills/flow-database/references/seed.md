---
name: flow-database-seed
type: reference
companion_to: flow-database
description: Seed script template with idempotency rules. Seeds auto-run on cold start.
---

# src/db/seed.ts

```typescript
import 'dotenv/config';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { users } from './schema';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL is required');
    process.exit(1);
  }

  const client = createClient({
    url,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(client);

  console.log('Seeding...');

  // Example: starter admin user. Replace with your own seed data.
  await db.insert(users).values({
    id: crypto.randomUUID(),
    name: 'Admin',
    email: 'admin@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  }).onConflictDoNothing();

  console.log('Seed complete.');
  client.close();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
```

## Idempotency Rules

Seeds MUST be safe to run repeatedly. Every restart triggers them.

### Fixed-ID records (system roles, admin users)

Use `onConflictDoNothing()`:

```typescript
await db.insert(roles).values({
  id: 'fixed-uuid',
  slug: 'admin',
  name: 'Administrator',
}).onConflictDoNothing();
```

### Generated-ID records

Check existence first:

```typescript
import { eq } from 'drizzle-orm';

const existing = await db.select()
  .from(users)
  .where(eq(users.email, 'admin@example.com'))
  .get();

if (!existing) {
  await db.insert(users).values({
    id: crypto.randomUUID(),
    name: 'Admin',
    email: 'admin@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
```

### Never do this

```typescript
// BAD — creates duplicates on every restart
await db.insert(users).values({
  id: crypto.randomUUID(),
  name: 'Test User',
  email: 'test@example.com',
});
```

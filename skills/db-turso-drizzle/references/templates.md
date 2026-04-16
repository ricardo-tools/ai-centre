---
name: db-turso-drizzle-templates
description: Copy-paste templates for Turso + Drizzle project setup. Includes drizzle.config.ts, client, and starter schema.
---

# Turso + Drizzle Templates

Copy these files into a new project to get a working Turso + Drizzle setup.

## drizzle.config.ts

```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
```

## src/db/client.ts

```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
```

## src/db/schema.ts

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});
```

## .env.local

```
DATABASE_URL=libsql://your-db-name-org.turso.io
DATABASE_AUTH_TOKEN=your-auth-token
```

## Dependencies

```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit
```

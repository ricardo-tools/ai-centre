---
name: flow-database-schema
type: reference
companion_to: flow-database
description: Starter schema template for SQLite/Turso. Uses correct SQLite types.
---

# src/db/schema.ts (starter)

This is a starter schema. Modify to fit your project.

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

## SQLite Type Reference

| Concept | SQLite type | Drizzle definition |
|---|---|---|
| UUID | `text` | `text('id').primaryKey().$defaultFn(() => crypto.randomUUID())` |
| Timestamp | `integer` | `integer('col', { mode: 'timestamp' })` |
| Boolean | `integer` | `integer('col', { mode: 'boolean' })` |
| JSON | `text` | `text('col')` — serialize/parse in app |
| Enum | `text` | `text('col')` — validate in app |
| Auto-increment | `integer` | `integer('id').primaryKey({ autoIncrement: true })` |
| Foreign key | `text` | `text('user_id').references(() => users.id)` |

---
name: flow-database-client
type: reference
companion_to: flow-database
description: Database client template — Drizzle + libsql. Works with both local Docker and remote Turso.
---

# src/db/client.ts

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

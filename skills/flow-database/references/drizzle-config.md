---
name: flow-database-drizzle-config
type: reference
companion_to: flow-database
description: drizzle.config.ts template for Turso/libSQL dialect.
---

# drizzle.config.ts

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

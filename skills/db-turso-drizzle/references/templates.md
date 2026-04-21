---
name: db-turso-drizzle-templates
description: Copy-paste templates for Turso + Drizzle project setup. Local SQLite via Docker for dev, Turso for production. Auto-migrates on startup.
---

# Turso + Drizzle Templates

Local dev uses SQLite via Docker (`libsql-server`). Production uses Turso. Same schema, same code — just a different `DATABASE_URL`.

---

## docker-compose.yml

Add the `libsql` service. If the project already has a `docker-compose.yml` (e.g. for Mailpit), add this service to it:

```yaml
services:
  libsql:
    image: ghcr.io/tursodatabase/libsql-server:latest
    container_name: ${COMPOSE_PROJECT_NAME:-app}-db
    ports:
      - '8080:8080'   # HTTP API
    volumes:
      - dbdata:/var/lib/sqld
    environment:
      SQLD_NODE: primary
    restart: unless-stopped

volumes:
  dbdata:
```

---

## scripts/ensure-docker.sh

Auto-starts Docker and the database container before dev:

```bash
#!/bin/bash
set -e

# Skip if DATABASE_URL is a remote Turso URL
if [ -n "$DATABASE_URL" ]; then
  case "$DATABASE_URL" in
    *localhost*|*127.0.0.1*|file:*) ;; # local — proceed
    libsql://*|https://*) exit 0 ;;     # remote — skip
  esac
fi

# Check Docker installed
if ! command -v docker &> /dev/null; then
  echo "[ensure-docker] Docker is not installed."
  echo "  Install: https://docs.docker.com/get-docker/"
  exit 1
fi

# Check Docker running
if ! docker info &> /dev/null 2>&1; then
  echo "[ensure-docker] Starting Docker..."
  if [ "$(uname)" = "Darwin" ]; then
    open -a Docker
    for i in $(seq 1 30); do
      docker info &> /dev/null 2>&1 && break
      sleep 2
    done
  fi
  if ! docker info &> /dev/null 2>&1; then
    echo "[ensure-docker] Docker failed to start."
    exit 1
  fi
fi

# Start containers if not running
CONTAINER=$(docker compose ps --format '{{.Names}}' 2>/dev/null | grep -m1 db || true)
if [ -z "$CONTAINER" ]; then
  echo "[ensure-docker] Starting containers..."
  docker compose up -d
  sleep 2
fi

echo "[ensure-docker] Database ready."
```

Make it executable: `chmod +x scripts/ensure-docker.sh`

---

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

---

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

---

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

---

## .env.local

```bash
# ── Local dev (Docker libsql-server) ─────────────────
DATABASE_URL=http://localhost:8080

# ── Production (Turso) ───────────────────────────────
# Uncomment for production:
# DATABASE_URL=libsql://your-db-name-org.turso.io
# DATABASE_AUTH_TOKEN=your-turso-auth-token
```

---

## package.json scripts

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

`predev` runs automatically before `npm run dev`:
1. Ensures Docker is running + starts the libsql container
2. Runs all pending migrations

---

## Dependencies

```bash
npm install drizzle-orm @libsql/client
npm install -D drizzle-kit tsx
```

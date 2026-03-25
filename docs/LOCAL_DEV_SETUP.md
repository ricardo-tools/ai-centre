# Local Development Setup

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ | `node -v` |
| Docker | Desktop or CLI | `docker -v` |
| npm | 9+ | `npm -v` |

---

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd ai-centre
npm install

# 2. Start everything (Postgres + schema + seed + build + server)
npm run dev
```

That's it. `npm run dev` handles Docker, database, schema, seed data, build, and server startup automatically.

The app will be available at **http://localhost:3000**.

---

## What `npm run dev` Does

The dev script (`scripts/dev.mjs`) orchestrates the full local stack:

| Step | What happens | Notes |
|------|--------------|-------|
| 1. Check Postgres | Connects to `localhost:5433` | If not running, starts Docker container |
| 2. Clean cache | `rm -rf .next` | Prevents stale server action IDs |
| 3. Push schema | `drizzle-kit push` against local Postgres | Uses `pg` driver directly (not Neon) |
| 4. Seed data | Inserts `admin`/`member` roles + dev user | `ON CONFLICT DO NOTHING` — safe to re-run |
| 5. Build app | `next build` with `SKIP_AUTH=true` | Full production build |
| 6. Start server | `next start` on port 3000 | Inherits `DATABASE_URL` and `SKIP_AUTH` |

### Environment Variables

The dev script injects these automatically — no `.env.local` needed for basic local dev:

| Variable | Dev value | Purpose |
|----------|-----------|---------|
| `DATABASE_URL` | `postgresql://aicentre:aicentre@localhost:5433/aicentre` | Local Postgres |
| `SKIP_AUTH` | `true` | Bypasses login (auto-logs in as dev user) |

For features that need external services, create `.env.local`:

```bash
# Optional — only needed for specific features
ANTHROPIC_API_KEY=         # Showcase generation (Claude API)
BLOB_READ_WRITE_TOKEN=     # Vercel Blob (file uploads)
AUTH_SECRET=               # JWT signing (32+ chars) — only needed if SKIP_AUTH is not set
MAILGUN_API_KEY=           # OTP email delivery
MAILGUN_DOMAIN=            # Mailgun sending domain
```

---

## Database

### Docker Postgres

| Property | Value |
|----------|-------|
| Image | `postgres:16-alpine` |
| Container | `ai-centre-db` |
| Host port | **5433** (not 5432 — avoids conflict with system Postgres) |
| Username | `aicentre` |
| Password | `aicentre` |
| Database | `aicentre` |
| Volume | `pgdata` (persists across restarts) |

### Manual Database Commands

```bash
# Start Postgres manually
docker compose up -d

# Stop Postgres (data persists)
docker compose down

# Stop and delete all data
docker compose down -v

# Push schema changes (without generating migration files)
DATABASE_URL="postgresql://aicentre:aicentre@localhost:5433/aicentre" npx drizzle-kit push --force

# Generate migration files (for production)
npm run db:generate

# Run pending migrations
npm run db:migrate

# Open visual DB editor
npm run db:studio

# Seed skills from skills/ directory into DB
npm run db:seed
```

### Dev User

The seed step creates a dev user automatically:

| Field | Value |
|-------|-------|
| Email | `dev@local` |
| User ID | `00000000-0000-0000-0000-000000000000` |
| Role | `admin` |
| Display name | `Dev User` |

With `SKIP_AUTH=true`, every request is authenticated as this user.

---

## Server Startup Hooks

When the Next.js server starts, `src/instrumentation.ts` runs automatically:

1. **Run migrations** (blocking) — ensures tables exist
2. **Sync skills** (background) — reads `skills/` directory, upserts into DB + Vercel Blob

These run on every server start and are idempotent.

---

## Common Tasks

### Kill a Stuck Server

```bash
# Find what's on port 3000
lsof -i :3000

# Kill it
kill $(lsof -ti :3000)
```

### Reset Everything

```bash
# Nuclear reset: drop DB, clear cache, rebuild
docker compose down -v
rm -rf .next node_modules
npm install
npm run dev
```

### Change Your Role (dev)

With `SKIP_AUTH=true`, you're always `admin`. To test as a `member`, update the dev user's role directly:

```sql
-- Connect to local Postgres
psql postgresql://aicentre:aicentre@localhost:5433/aicentre

-- Switch to member
UPDATE users SET role_id = (SELECT id FROM roles WHERE slug = 'member')
WHERE email = 'dev@local';

-- Switch back to admin
UPDATE users SET role_id = (SELECT id FROM roles WHERE slug = 'admin')
WHERE email = 'dev@local';
```

---

## Gotchas

| Issue | Cause | Fix |
|-------|-------|-----|
| `Failed to find Server Action` | Stale `.next` cache from a previous build | `rm -rf .next` then rebuild |
| `@neondatabase/serverless` connection error | Neon driver can't connect to local Postgres | Dev script bypasses this — use `npm run dev` |
| Port 5432 conflict | System Postgres already running | We use port **5433** — no action needed |
| `AUTH_SECRET` 503 in production | Middleware requires `AUTH_SECRET` | Only affects production — dev uses `SKIP_AUTH=true` |
| Social buttons don't respond | Server action IDs stale after code changes | Hard refresh browser (`Cmd+Shift+R`) |
| `.env.local` not loaded by dev script | `scripts/dev.mjs` injects env vars directly | Set vars in shell or edit the script |

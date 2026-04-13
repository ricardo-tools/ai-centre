# AI Centre

> **Before responding to any request:** check [`PROJECT_REFERENCE.md`](PROJECT_REFERENCE.md) — it contains the feature map, data flows, implementation status, and constraints. Use it to understand what exists before making changes. **After completing any change**, update `PROJECT_REFERENCE.md` to reflect the new state. Always execute, no exceptions.

> **On any request:** apply the **flow** skill (`skills/flow.md`). Active opinions: `flow-tdd`, `flow-eval-driven`, `flow-research`, `flow-observability`, `flow-project-reference`, `flow-project-docs`, `flow-strategic-context`. Always execute, no exceptions.

> **This file must stay under 200 lines.** If an addition would push it over, ask the user what to remove or move to `PROJECT_REFERENCE.md` before proceeding. Never silently exceed 200 lines.

ezyCollect by Sidetrade **AI Centre** — an internal platform that distributes AI skills across all departments. Skills cover coding, design, marketing, presentations, print, and any domain where AI agents need structured guidance. The skill library (60+ files, `skills/`) contains portable, composable skills that teach AI agents how to do specific jobs well. Skills are **not** all used in the same project — they are bundled into **archetypes** (curated selections for specific jobs like "presentation", "dashboard", "marketing campaign"). Users pick an archetype, customize the skill selection, describe their idea, and download a project ZIP with the selected skills + a tailored CLAUDE.md.

The platform also serves as a **skill marketplace** — browse, search, filter, and download individual skills for any department.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) — strict TypeScript |
| Database | Neon (serverless Postgres) via Drizzle ORM |
| File Storage | Vercel Blob (generated project ZIPs, skill assets) |
| Auth | Custom email OTP — `jose` (JWT) + `mailgun.js` (email). Domain-restricted. |
| Deployment | Vercel |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| Font | Jost (Google Fonts via `next/font/google`) |
| Animation | Motion (`motion`) primary, GSAP (`gsap`) for complex sequences |
| Charts | Nivo (`@nivo/*`) — SVG-based, theme-aware |
| AI | Claude API (`@anthropic-ai/sdk`) for showcase generation |

---

## Key Conventions

### Styling
- **Inline styles with `var(--color-*)` semantic CSS variables.** No hardcoded hex in components.
- **No Tailwind** in component or widget JSX. CSS custom properties only.
- `data-theme` on `<html>` controls theming. Light + Night by default.

### Architecture
| Layer | Purpose | Location |
|---|---|---|
| Component | Stateless, props-only | `platform/components/` |
| Widget | UI + data hook, 4 size variants (XS/SM/MD/LG) | feature or platform |
| Domain Object | TypeScript class, zero framework deps | `platform/domain/` |
| ACL Mapper | `toEntity(raw) → DomainClass` | `platform/acl/` |
| Server Action | Thin adapter → validate → use case → `Result<T, E>` | feature `action.ts` |

**Features import from platform. Features never import from each other.**

### Error Handling
- `Result<T, E>` with `Error` subclasses for stack traces. Throw only for bugs.

### TypeScript
- Strict mode, no `any`. `class` for domain objects. `interface` for contracts.

### Responsive
- Mobile-first. Breakpoints: xs (0), sm (640), md (768), lg (1024).

### Spacing
- 8px base: 4 / 8 / 16 / 24 / 32 / 48

### Icons
- Phosphor: `regular` default, `fill` for active, 20px default.

### Server Components
- Server Components by default. Client Components only for browser APIs/interactivity.
- Pages are thin wiring — import from features, no business logic.

---

## Environments

Three environments, each with its own database and deploy target:

| | Local | Development | Production |
|---|---|---|---|
| **URL** | `localhost:3000` | Vercel preview deploys | `ai.ezycollect.tools` |
| **Database** | Docker Postgres (port 5433) | Neon (`aicentre` branch) | Neon (`main` branch) |
| **File storage** | `public/uploads/` directory | Vercel Blob | Vercel Blob |
| **Auth** | Bypassed (`SKIP_AUTH=true`) | Email OTP | Email OTP |
| **Showcase deploys** | Vercel Development env | Vercel Development env | Vercel Production env |
| **Migrations** | Auto on server start | Auto on server start | Auto on server start |

### Local setup

```bash
docker compose up -d   # Start Postgres (port 5433, user/pass/db: aicentre)
npm run dev            # Migrations auto-apply, then seed with npm run db:seed
```

### Showcase deploy infrastructure

ZIP showcases are deployed to a **separate Vercel project** (`ai-centre-showcases`). Each deploy gets JWT-secured middleware + CSP headers injected automatically. The main app generates signed iframe URLs.

| Env var | Where | Purpose |
|---|---|---|
| `VERCEL_SHOWCASE_TOKEN` | Main app | Vercel API token (scope: `ai-centre-showcases` project) |
| `SHOWCASE_JWT_SECRET` | Main app | Signs 5-min JWT tokens for iframe URLs |
| `JWT_SECRET` | Showcase project | Verifies JWT tokens (same value as `SHOWCASE_JWT_SECRET`) |
| `ALLOWED_ORIGINS` | Showcase project | CSP `frame-ancestors` — comma-separated origins |

Showcase project has two environments: **Production** (`ALLOWED_ORIGINS=https://ai.ezycollect.tools`) and **Development** (`ALLOWED_ORIGINS=http://localhost:3000,https://*.vercel.app`).

## Development

```bash
npm run dev          # Next.js dev server (auto-migrates DB)
npm run build        # Production build
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations manually (drizzle-kit)
npm run db:studio    # Drizzle Studio
npm run db:seed      # Seed skills into database
```

### Environment Variables (.env.local)
```
DATABASE_URL=              # Local: postgresql://aicentre:aicentre@localhost:5433/aicentre
BLOB_READ_WRITE_TOKEN=     # Vercel Blob token (optional locally — falls back to public/uploads/)
AUTH_SECRET=               # JWT signing secret (32+ chars)
MAILGUN_API_KEY=           # Mailgun API key for OTP email delivery
MAILGUN_DOMAIN=            # Mailgun sending domain
MAILGUN_FROM_EMAIL=        # (optional) Sender address — defaults to noreply@MAILGUN_DOMAIN
MAILGUN_EU=                # (optional) Set to 'true' for EU endpoint
ANTHROPIC_API_KEY=         # Showcase generation
VERCEL_SHOWCASE_TOKEN=     # Vercel API token for showcase deploys
VERCEL_WEBHOOK_SECRET=     # (optional) Vercel webhook secret for deploy status callbacks
SHOWCASE_JWT_SECRET=       # JWT secret shared with ai-centre-showcases project
ADMIN_EMAIL=              # (optional) Auto-promote this email to admin on first login
AI_CENTRE_URL=            # (optional) Override base URL for OAuth flow testing. Defaults to https://ai.ezycollect.tools. Set to http://localhost:3000 for local dev.
SKIP_AUTH=                # (optional) Set to 'true' ONLY in local dev — bypasses auth. NEVER set in production.
DEBUG_API_KEY=            # (optional) Enables prod log capture + /api/logs and /api/debug access via x-debug-key header
```

### Server Actions vs API Routes
- **Server Actions** for all internal mutations.
- **API routes** only for external programmatic access.

### Debugging
Server-side console output is captured in a 1000-entry ring buffer when `SKIP_AUTH=true` (dev) or `DEBUG_API_KEY` is set (prod).

```bash
# Local dev (no auth needed)
curl http://localhost:3000/api/logs
curl http://localhost:3000/api/logs?level=error

# Production (requires x-debug-key header)
curl -H "x-debug-key: $DEBUG_API_KEY" https://ai.ezycollect.tools/api/logs
curl -H "x-debug-key: $DEBUG_API_KEY" https://ai.ezycollect.tools/api/logs?level=error&limit=50
curl -H "x-debug-key: $DEBUG_API_KEY" https://ai.ezycollect.tools/api/logs?search=skill-library
curl -H "x-debug-key: $DEBUG_API_KEY" https://ai.ezycollect.tools/api/debug?detail=true

# Clear buffer
curl -X POST -H "x-debug-key: $DEBUG_API_KEY" https://ai.ezycollect.tools/api/logs
```

Use this to diagnose 500 errors, failed server actions, or DB issues. `console.debug()` is captured in all environments when log capture is active.

### Testing
- E2E tests run against a **separate database** (`aicentre_test`) — dev DB is never touched.
- `tests/e2e/base-data.ts` is the **single source of truth** for test seed data. Global setup seeds the DB from it; tests import it for assertions. If you change seed data, update ONLY `base-data.ts` — everything else follows.
- Tests use a **high-water mark** pattern: each test records a timestamp before running, and only its own mutations are rolled back after. Global seed data always survives.
- See [`docs/TESTING.md`](docs/TESTING.md) for the full testing guide.

---

## Detailed Reference

For project structure, database schema, feature descriptions, data flows, showcase building patterns, and implementation constraints, see [`PROJECT_REFERENCE.md`](PROJECT_REFERENCE.md).

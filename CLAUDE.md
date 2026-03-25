# AI Centre

> **Before responding to any request:** check [`PROJECT_REFERENCE.md`](PROJECT_REFERENCE.md) — it contains the feature map, data flows, implementation status, and constraints. Use it to understand what exists before making changes. **After completing any change**, update `PROJECT_REFERENCE.md` to reflect the new state. Always execute, no exceptions.

> **On any request:** apply the **prompt-refinement** skill (`skills/prompt-refinement.md`). Present a refined prompt with intent, scope, constraints, and relevant skills. **Wait for user confirmation before starting work.** Always execute, no exceptions.

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

## Development

```bash
npm run dev          # Next.js dev server
npm run build        # Production build
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Drizzle Studio
npm run db:seed      # Seed skills into database
```

### Environment Variables (.env.local)
```
DATABASE_URL=              # Neon connection string
BLOB_READ_WRITE_TOKEN=     # Vercel Blob token
AUTH_SECRET=               # JWT signing secret (32+ chars)
MAILGUN_API_KEY=           # Mailgun API key for OTP email delivery
MAILGUN_DOMAIN=            # Mailgun sending domain
MAILGUN_FROM_EMAIL=        # (optional) Sender address — defaults to noreply@MAILGUN_DOMAIN
MAILGUN_EU=                # (optional) Set to 'true' for EU endpoint
ANTHROPIC_API_KEY=         # Showcase generation
ADMIN_EMAIL=              # (optional) Auto-promote this email to admin on first login
SKIP_AUTH=                # (optional) Set to 'true' ONLY in local dev — bypasses auth. NEVER set in production.
SENTRY_DSN=               # (optional) Sentry error tracking — future
```

### Server Actions vs API Routes
- **Server Actions** for all internal mutations.
- **API routes** only for external programmatic access.

### Debugging (local dev only)
When `SKIP_AUTH=true`, all server-side console output (`debug`, `info`, `log`, `warn`, `error`) is captured in a 1000-entry ring buffer and exposed via API:

```bash
# All recent logs (most recent first, limit 100)
curl http://localhost:3000/api/logs

# Filter by level: debug | info | log | warn | error
curl http://localhost:3000/api/logs?level=error
curl http://localhost:3000/api/logs?level=debug

# Search by keyword
curl http://localhost:3000/api/logs?search=admin&level=error

# Logs since a timestamp
curl http://localhost:3000/api/logs?since=2026-03-24T10:00:00Z

# Clear buffer
curl -X POST http://localhost:3000/api/logs
```

Use this to diagnose 500 errors, failed server actions, or DB issues without needing terminal access to the server process. For deeper tracing, use `console.debug()` in code — it's captured in dev/test but silent in production.

### Testing
- E2E tests run against a **separate database** (`aicentre_test`) — dev DB is never touched.
- `tests/e2e/base-data.ts` is the **single source of truth** for test seed data. Global setup seeds the DB from it; tests import it for assertions. If you change seed data, update ONLY `base-data.ts` — everything else follows.
- Tests use a **high-water mark** pattern: each test records a timestamp before running, and only its own mutations are rolled back after. Global seed data always survives.
- See [`docs/TESTING.md`](docs/TESTING.md) for the full testing guide.

---

## Detailed Reference

For project structure, database schema, feature descriptions, data flows, showcase building patterns, and implementation constraints, see [`PROJECT_REFERENCE.md`](PROJECT_REFERENCE.md).

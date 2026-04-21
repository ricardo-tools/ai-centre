# AI Centre — Project Reference

> **This document is the source of truth for features, data flows, and constraints.**
> Read it before making changes to understand what exists, how it connects, and what must not break.

---

## When to Use This Document

Consult this document when:

- **Adding a new feature** — check the Feature Map to understand related areas and avoid conflicts
- **Modifying auth, sessions, or middleware** — the Do Not Break section has silent failure risks
- **Working on the Flow platform or CLI APIs** — understand the OAuth flow, quotas, and sharing system
- **Touching the skill lifecycle** — versioning rules, community publishing, and embeddings are strict
- **Adding a new page or route** — check Implementation Status to understand what's planned vs built
- **Changing the database schema** — cross-reference the Data Models section before adding/removing columns
- **Integrating a new external service** — check External Services to understand what's already in use
- **Debugging unexpected redirects** — the auth middleware has a dev bypass and Bearer token support
- **Modifying permissions or roles** — the DB-backed permission system has a cache and specific guard patterns

Do not use this document for coding style, component architecture, or design tokens — those live in `CLAUDE.md` and the skill files.

---

## Product Overview

ezyCollect by Sidetrade **AI Centre** — internal platform distributing AI skills across all departments (engineering, design, marketing, operations). 63 skills in a portable library organized as directories under `skills/`. The platform is both a **skill marketplace** (browse, search, download) and the **Flow platform** backend — authenticating CLI users via OAuth PKCE, matching skills via RAG, provisioning infrastructure, and enabling community publishing.

**Primary user journeys:**

1. **Web UI** — Log in via email OTP → browse/search skills → view showcases → share resources
2. **Flow CLI** — `/flow login` (OAuth PKCE) → `/flow bootstrap` (RAG skill matching) → build project → `/flow publish` (community skill) → `/flow showcase` (gallery) → `/flow share`

See `docs/FLOW_COMMANDS.md` for the full CLI command reference.

---

## Feature Map

### Authentication (Web + OAuth)
**Status: ✅ Complete**

**Web auth (email OTP):**
- Custom email OTP login — no password, no Auth.js
- 6-digit code, SHA-256 hashed in DB, 10-minute expiry, max 3 attempts
- JWT session stored in `auth-token` cookie, signed with `AUTH_SECRET`, 7-day expiry
- Domain restriction in `src/platform/lib/otp.ts`: `ALLOWED_DOMAINS` array (`ezycollect.com.au`, `ezycollect.io`, `sidetrade.com`)
- Session contains `userId`, `email`, `roleId`, `roleSlug` — resolved from DB-backed roles table
- Two JWT implementations: `auth.ts` (Node.js) and `auth-edge.ts` (Edge-compatible, for middleware). Do not merge them.
- Dev mode: `getSession()` returns admin session without JWT. Supports `dev-identity` cookie for role/user switch.

**OAuth PKCE (Flow CLI):**
- Authorization Code + PKCE flow for CLI authentication
- Routes: `/api/auth/authorize` (GET, starts flow), `/api/auth/callback` (GET, handles OTP redirect), `/api/auth/token` (POST, code exchange + refresh), `/api/auth/revoke` (POST, revoke tokens), `/api/auth/deny` (GET, user denies consent)
- Consent page: `/oauth/consent` — user sees what they're granting before approval
- Access tokens: JWT signed with `AUTH_SECRET`, 1-hour expiry, payload `{ userId, type: 'access' }`
- Refresh tokens: opaque, 30-day expiry, stored hashed in `oauth_tokens` table
- CLI stores credentials in `.flow/credentials.json`
- Tables: `oauth_codes` (authorization codes, PKCE challenge), `oauth_tokens` (access/refresh, hashed)

**Middleware (`src/middleware.ts`):**
- Production: requires valid session cookie or Bearer token
- Bearer token support: API routes accept `Authorization: Bearer <access_token>` (JWT with `type: 'access'`)
- Public allowlist (no auth): `/login`, `/robots.txt`, `/api/health`, `/api/skills/catalog`, `/api/skills/search`, `/api/shares/link`, `/api/auth/*`, `/api/webhooks/*`
- Admin route protection: `/admin` requires `roleSlug === 'admin'`
- Dev bypass: `SKIP_AUTH=true` skips all checks
- Debug endpoints: `/api/debug*` and `/api/logs` accessible with `x-debug-key` header

---

### Role & Permission System
**Status: ✅ Complete**

- DB-backed `roles` table with `slug`, `name`, `description`, `isSystem` flag
- 20 permissions across 7 categories defined in `src/platform/lib/permissions.ts`
- `role_permissions` join table links roles to permissions
- Two system roles seeded: **admin** (all permissions) and **member** (create, edit, upload, generate)
- Guards in `src/platform/lib/guards.ts`: `requireAuth()`, `requirePermission(key)`, `requireOwnerOrAdmin()`, `requireNotSelf()`
- Permission cache: module-level `Map`, 60-second TTL, keyed by `roleId`

---

### Skill Library
**Status: ✅ Complete**

- 63 skills (directories under `skills/`, each containing `SKILL.md`)
- Skill types: `principle`, `implementation`, `reference`
- Skill domains: `product-development`, `marketing`, `design`, `engineering`, `operations`, `global`
- Browse at `/skills` with tabs, domain sub-filter pills, search by title/description
- Skill content bundled at build time via `src/platform/lib/skills-bundle.generated.json`
- DB `skills` table for versioning/publishing metadata; seeds sync from definitions
- **Upvoting:** `reactions` table with `entity_type='skill'`, `emoji='thumbsup'`
- **Sort:** `?sort=popular` (default: recent). Bookmarked skills pinned to top.
- **RAG search:** `skill_embeddings` table stores vector embeddings per skill. `/api/skills/search` does cosine similarity matching for Flow bootstrap.

---

### Skill Detail Page
**Status: ✅ Complete**

Two views toggled by a button:
1. **"Skill in Practice" (default)** — rich visual showcase with diagrams, code examples
2. **"View SKILL.md"** — rendered markdown via `react-markdown`

- 36 dedicated showcase components in `src/features/skill-detail/showcases/`
- 24+ skills get a styled auto-generated fallback via `SkillShowcaseFallback`
- `CodeBlock` with Shiki syntax highlighting

---

### Community Skill Publishing (Flow CLI)
**Status: ✅ Complete**

- Users publish skills from their projects via `/flow publish`
- Tables: `community_skills` (slug+userId unique), `community_skill_versions` (append-only, checksummed)
- API: `POST /api/skills/publish` (creates/updates skill + version)
- Version history: `GET /api/skills/community/[slug]/versions`
- Rollback: `POST /api/skills/community/[slug]/rollback` (creates new version with old content)
- Update checking: `POST /api/skills/updates` (compare checksums, return diffs)
- Quota enforcement: `user_quotas.skillLimit` (default 5000)
- Visibility: `community_skills.visibility` (public/private/link_only)

---

### Showcase Gallery
**Status: ✅ Complete**

- Browse at `/gallery`, upload at `/gallery/upload`, view at `/gallery/[id]`
- File types: HTML (iframe preview) and ZIP (deployed via Vercel)
- **Showcase versioning:** `showcase_versions` table tracks all uploads (append-only, version numbers)
- **Publish from CLI:** `POST /api/showcases/publish` (FormData, creates version, triggers deploy)
- **Rollback:** `POST /api/showcases/[id]/rollback` (restore previous version)
- Deploy pipeline: ZIP → extract → inject security middleware → Vercel Deployments API → poll status
- Auto-thumbnail on deploy ready (thum.io screenshot → Vercel Blob)
- **Visibility system:** `showcase_uploads.visibility` (public/private/link_only)
- Vercel deploy webhook for status updates
- File size limit: 10MB

---

### Sharing System
**Status: ✅ Complete**

- Table: `resource_shares` (resource_type, resource_id, grantee_type, grantee_id, permissions, expiry)
- Grantee types: `user` (by userId) or `link` (tokenHash for signed URLs)
- Permissions per share: `can_view`, `can_download`, `can_share` (reshare)
- API routes: `POST/GET/DELETE /api/shares`, `POST /api/shares/link` (create share link), `PATCH /api/shares/visibility`
- Visibility modes: `public` (everyone), `private` (only shared users), `link_only` (anyone with link)
- `user_quotas.default_visibility` stores user preference
- **ShareModal:** `src/platform/components/ShareModal/` — visibility selector, people-with-access list, add person, share links
- **CLI:** `/flow share` command for sharing from terminal

---

### Workspace & Quotas
**Status: ✅ Complete**

- Table: `user_quotas` (skillLimit, schemaLimit, storageLimitBytes, defaultVisibility)
- API: `GET /api/workspace` (own workspace), `GET /api/workspace/all` (admin), `PATCH /api/workspace/[userId]/quotas` (admin)
- Default limits: 5000 skills, 20 schemas, 2GB storage
- Feature: `src/features/workspace/` (actions + widgets)

---

### Database Provisioning (Turso)
**Status: ✅ Complete**

- Per-user Turso database provisioning via Platform API
- Table: `user_databases` (dbName, dbUrl, tursoDbId per user)
- API: `POST /api/workspace/databases` (provision), `GET /api/workspace/databases` (list)
- Quota enforcement: `user_quotas.schemaLimit`
- Used during `/flow bootstrap` when project needs a database
- Requires: `TURSO_ORG`, `TURSO_API_TOKEN` env vars (returns 503 if not configured)

---

### Homepage
**Status: ✅ Complete**

6 sections in `src/app/page.tsx`:
1. **HomeHero** — welcome banner
2. **Flow CTA** — get started with Flow onboarding steps
3. **HomeStats** — platform statistics
4. **HomeSkillSpotlights** — featured skills
5. **HomeShowcases** — community showcases
6. **CTA Footer** — link to `/gallery/upload`

---

### Admin Dashboard
**Status: ✅ Complete**

- Route: `/admin` (admin role required)
- 4 tabs: Users, Roles, Permissions, Audit Log
- User management: invite, activate/deactivate, role assignment
- `invitations` table with status lifecycle (pending/accepted/expired)

---

### Chat (AI Assistant)
**Status: ✅ Complete**

- Route: `/chat` — conversational AI assistant
- Tables: `chat_conversations`, `chat_messages`, `chat_feedback`
- Skill gap detection: `skill_gaps` table records unmet needs from conversations
- Feature: `src/features/chat/`

---

### Profile & Shared Views
**Status: ✅ Complete**

- `/profile/[userId]` — user profile page
- `/shared` — view resources shared with current user

---

### Dev Tools
**Status: ✅ Complete**

- Dev Identity Switcher (navbar, dev only)
- Session context provider
- Theme follows browser preference
- NProgress loading bar
- Local file storage fallback
- Debug endpoints (`/api/logs`, `/api/debug`)

---

## Data Models (Database Schema)

All tables defined in `src/platform/db/schema.ts`.

### Core Tables

| Table | Purpose |
|---|---|
| `roles` | Role definitions (admin, member) |
| `role_permissions` | Role ↔ permission join |
| `users` | User accounts |
| `invitations` | Email invites with role + expiry |
| `verification_tokens` | OTP codes (hashed) |
| `skills` | Skill registry (versioning metadata) |
| `skill_versions` | Immutable published versions |
| `archetypes` | Archetype definitions (legacy, still in schema) |
| `archetype_versions` | Archetype versions (legacy) |
| `audit_log` | Action audit trail |

### Showcase Tables

| Table | Purpose |
|---|---|
| `showcase_uploads` | Gallery items (file, deploy status, visibility) |
| `showcase_versions` | Version history per showcase (append-only) |

### Social Tables

| Table | Purpose |
|---|---|
| `skill_downloads` | Download tracking |
| `showcase_views` | View tracking |
| `reactions` | Upvotes/hearts/rockets |
| `bookmarks` | User bookmarks |
| `comments` | Threaded comments |
| `activity_events` | Activity feed |
| `notifications` | User notifications |
| `notification_preferences` | Notification channel prefs |

### Chat Tables

| Table | Purpose |
|---|---|
| `chat_conversations` | Conversation sessions |
| `chat_messages` | Messages with tool calls |
| `chat_feedback` | Thumbs up/down + corrections |
| `skill_gaps` | Detected skill gaps |

### Flow Platform Tables (Plan 02)

| Table | Purpose | Migration |
|---|---|---|
| `oauth_codes` | PKCE authorization codes | 0010 |
| `oauth_tokens` | Access/refresh token pairs (hashed) | 0010 |
| `user_quotas` | Per-user limits + default visibility | 0011 |
| `skill_embeddings` | Vector embeddings for RAG search | 0012 |
| `community_skills` | User-published skills (slug+user unique) | 0013 |
| `community_skill_versions` | Append-only version history | 0013 |
| `showcase_versions` | Showcase version history | 0014 |
| `user_databases` | Provisioned Turso databases | 0015 |
| `resource_shares` | Granular sharing (user/link grantees) | 0017 |

### Dropped Tables

| Table | Migration | Reason |
|---|---|---|
| `generated_projects` | 0016 | Toolkit composition removed; Flow bootstrap replaces it |

### Key Schema Changes (0018)

- `showcase_uploads.visibility` column (text, default `'public'`)
- `community_skills.visibility` column (text, default `'public'`)

---

## Migrations

SQL migrations in `src/platform/db/migrations/` (0000–0018). Applied automatically on server start.

Code seeds in `src/platform/db/seeds/`:
| Seed | Purpose |
|---|---|
| `0001_roles_and_admin.ts` | System roles + permissions |
| `0002_skills.ts` | Sync skill definitions to DB |
| `0003_dev_user.ts` | Dev user for local testing |
| `0004_skill_embeddings.ts` | Generate/sync embeddings |
| `0005_showcase_versions_backfill.ts` | Backfill versions for existing showcases |

---

## API Routes

### Public (no auth required)

| Route | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/auth/authorize` | GET | OAuth PKCE authorize (redirects to login/consent) |
| `/api/auth/callback` | GET | OAuth callback (code exchange redirect) |
| `/api/auth/token` | POST | Token exchange (code→tokens, refresh→tokens) |
| `/api/auth/revoke` | POST | Revoke refresh token |
| `/api/auth/deny` | GET | User denied OAuth consent |
| `/api/skills/catalog` | GET | Browse official skills (public) |
| `/api/skills/search` | POST | RAG semantic search (public) |
| `/api/shares/link` | GET | Access shared resource via signed link |
| `/api/webhooks/vercel-deploy` | POST | Vercel deploy status webhook |

### Authenticated (Bearer token or session cookie)

| Route | Method | Purpose |
|---|---|---|
| `/api/workspace` | GET | Current user workspace + quotas |
| `/api/workspace/all` | GET | All workspaces (admin) |
| `/api/workspace/[userId]/quotas` | PATCH | Update user quotas (admin) |
| `/api/workspace/databases` | POST/GET | Provision or list Turso databases |
| `/api/skills/[slug]/content` | GET | Download skill content |
| `/api/skills/publish` | POST | Publish community skill |
| `/api/skills/community/[slug]/versions` | GET | Version history |
| `/api/skills/community/[slug]/rollback` | POST | Rollback to previous version |
| `/api/skills/updates` | POST | Check for skill updates |
| `/api/showcases/publish` | POST | Publish showcase (FormData) |
| `/api/showcases/[id]/rollback` | POST | Rollback showcase version |
| `/api/shares` | POST/GET/DELETE | Manage resource shares |
| `/api/shares/visibility` | PATCH | Change resource visibility |
| `/api/chat` | POST | Chat with AI assistant |
| `/api/chat/feedback` | POST | Submit message feedback |

### Debug (requires `x-debug-key` header)

| Route | Method | Purpose |
|---|---|---|
| `/api/logs` | GET/POST | View/clear server log buffer |
| `/api/debug` | GET | System diagnostics |
| `/api/debug/session` | GET | Debug session info |
| `/api/debug/showcases` | GET | List/retry showcases |

---

## Application Pages

| Route | Purpose | Auth |
|---|---|---|
| `/` | Homepage (hero, Flow CTA, stats, spotlights, showcases) | Required (prod) |
| `/login` | Email OTP login | Public |
| `/oauth/consent` | OAuth consent screen (Flow CLI) | Required |
| `/skills` | Skill library (browse, search, filter) | Required |
| `/skills/[slug]` | Skill detail (showcase + SKILL.md toggle) | Required |
| `/gallery` | Showcase gallery (browse, search) | Required |
| `/gallery/[id]` | Showcase viewer (iframe/deployed preview) | Required |
| `/gallery/upload` | Showcase upload form | Required |
| `/shared` | Resources shared with current user | Required |
| `/profile/[userId]` | User profile | Required |
| `/chat` | AI assistant | Required |
| `/admin` | Admin dashboard (users, roles, permissions, audit) | Admin only |

---

## Feature Slices

All in `src/features/`:

| Feature | Directory | Contents |
|---|---|---|
| Skill Library | `skill-library/` | Browse/search/filter + SkillCard, SkillList widgets |
| Skill Detail | `skill-detail/` | 36 showcase components + widgets |
| Showcase Gallery | `showcase-gallery/` | Upload/CRUD actions + gallery widgets |
| Auth | `auth/` | Login action + Login widget |
| User Management | `user-management/` | User CRUD actions + admin widgets |
| Role Management | `role-management/` | Role CRUD actions + admin widgets |
| Audit Log | `audit-log/` | Audit query action + admin widget |
| Sharing | `sharing/` | Share CRUD actions |
| Workspace | `workspace/` | Quota actions + workspace widgets |
| Chat | `chat/` | Conversation actions + chat UI |
| Social | `social/` | Reactions, bookmarks, comments |

---

## Key Data Flows

### OAuth PKCE Authentication (Flow CLI)

```
CLI starts local HTTP server on random port
  → opens browser to /api/auth/authorize?response_type=code&code_challenge=X&redirect_uri=http://localhost:PORT/callback
  → middleware sees /api/auth/* → allows through
  → if no session cookie → redirect to /login with ?returnTo= pointing back
  → user completes OTP → redirect back to /api/auth/authorize
  → if session valid → render /oauth/consent page
  → user clicks "Allow" → server generates auth code, stores code_hash + code_challenge
  → redirects to redirect_uri with ?code=X
  → CLI receives code → POST /api/auth/token with code + code_verifier
  → server verifies: S256(code_verifier) === stored code_challenge, code not expired/used
  → issues access token (JWT, 1hr) + refresh token (opaque, 30d)
  → CLI stores tokens in .flow/credentials.json
  → subsequent API calls use Authorization: Bearer <access_token>
  → on expiry: POST /api/auth/token with grant_type=refresh_token
```

### Showcase Upload

```
User fills form (title, description, skill tags, file)
  → requirePermission('showcase:upload') guard
  → validate file type (.html or .zip) + size (10MB limit)
  → upload to Vercel Blob (or public/uploads/ in dev)
  → insert showcase_uploads record (deploy_status='pending' for ZIPs)
  → create showcase_versions record (version 1)
  → ZIP uploads: triggerDeploy(id) via after()
  → viewer page polls checkDeployStatus until 'ready', then renders iframe with signed JWT URL
```

### Skill Publishing (Flow CLI)

```
/flow publish
  → auto-login if needed
  → select skill from .claude/skills/
  → POST /api/skills/publish { slug, name, description, content, commitMessage }
  → server: verify Bearer token → resolve userId
  → check user_quotas.skillLimit
  → upsert community_skills (slug + userId unique)
  → insert community_skill_versions (append-only, checksummed)
  → return { version, slug }
```

### RAG Skill Search

```
POST /api/skills/search { query }
  → generate embedding for query (OpenRouter API)
  → load all skill_embeddings from DB
  → compute cosine similarity against query embedding
  → return top-N skills sorted by relevance
```

### Permission Check

```
Server Action called → requirePermission('skill:publish')
  → requireAuth() → getSession() → returns Session { userId, email, roleId, roleSlug }
  → getPermissionsForRole(session.roleId)
    → check module-level cache (Map, keyed by roleId, 60s TTL)
    → cache miss: query role_permissions table → populate cache
  → check if permission key exists in Set
  → missing: return Err(ForbiddenError)
  → present: return Ok(session)
```

---

## External Services

| Service | Purpose | Env var | Fails silently? |
|---|---|---|---|
| Neon (Postgres) | All persistent data | `DATABASE_URL` | Partially — some features fall back to local |
| Vercel Blob | Files, ZIPs, thumbnails | `BLOB_READ_WRITE_TOKEN` | Yes — falls back to `public/uploads/` in dev |
| Mailgun | OTP email delivery | `MAILGUN_API_KEY`, `MAILGUN_DOMAIN` | Yes — logs to console if missing |
| Claude API | Chat, showcase HTML generation | `ANTHROPIC_API_KEY` | Partially — features degrade |
| OpenRouter | RAG embeddings for skill search | `OPENROUTER_API_KEY` | Yes — search returns empty results |
| Turso Platform API | Per-user database provisioning | `TURSO_ORG`, `TURSO_API_TOKEN` | Yes — returns 503 if not configured |
| Vercel Deployments API | Showcase ZIP deploys | `VERCEL_SHOWCASE_TOKEN` | Yes — skips silently |
| thum.io | Showcase screenshots | — (free, no key) | Yes — no thumbnail generated |

---

## Implementation Status

| Area | Status |
|---|---|
| Auth: Web OTP + JWT + middleware | ✅ Complete |
| Auth: OAuth PKCE (Flow CLI) | ✅ Complete |
| DB-backed roles & permissions | ✅ Complete |
| Skill library (63 skills, browse + search + filter) | ✅ Complete |
| Skill detail page (36 showcases + fallback) | ✅ Complete |
| Community skill publishing + versioning | ✅ Complete |
| RAG skill search (embeddings) | ✅ Complete |
| Showcase gallery + deploy pipeline | ✅ Complete |
| Showcase versioning + rollback | ✅ Complete |
| Sharing system (user/link grants, visibility) | ✅ Complete |
| Workspace quotas | ✅ Complete |
| Turso DB provisioning | ✅ Complete |
| Admin dashboard | ✅ Complete |
| User management (invite, activate/deactivate) | ✅ Complete |
| Chat (AI assistant) | ✅ Complete |
| Homepage (Flow CTA) | ✅ Complete |
| Dev tools + debug endpoints | ✅ Complete |
| Skill editor UI (`/skills/[slug]/edit`) | ❌ Not built |
| CI/CD pipeline | ❌ Not built |

### Removed Features (Plan 02)

| Feature | Reason |
|---|---|
| Toolkit composition (4-layer model) | Replaced by Flow bootstrap with RAG skill matching |
| Project generation (`/generate`, generated_projects table) | Replaced by Flow CLI workflow |
| Archetype routes (`/archetypes`, `/toolkits`) | No longer in app — archetypes table still in schema but unused |

---

## Do Not Break

These are non-obvious constraints that would silently regress if changed:

1. **Dev bypass in middleware** — `SKIP_AUTH=true` skips all auth checks. Intentional for local dev.

2. **Domain restriction list** — `ALLOWED_DOMAINS` in `src/platform/lib/otp.ts` is the single source of truth.

3. **Two JWT implementations** — `auth.ts` (Node.js) and `auth-edge.ts` (Edge). Middleware must use `auth-edge.ts`.

4. **Session has roleId/roleSlug, not role string** — All code uses `session.roleSlug` for role checks, `session.roleId` for permission lookups.

5. **DB-backed roles are the source of truth for permissions** — Use `requirePermission()`, never hardcode role checks.

6. **Permission cache has 60-second TTL** — Module-level `Map` in `guards.ts`. Do not reduce below 30s.

7. **Published skill_versions are immutable** — Once `status = published`, content is never updated.

8. **Community skill versions are append-only** — Rollback creates a NEW version with old content. Never mutate existing versions.

9. **showcaseHtml is cached, not live** — Written once on publish, never regenerated per render.

10. **Bearer tokens are JWTs with `type: 'access'`** — Middleware checks this field. Do not issue Bearer tokens without it.

11. **OAuth codes are single-use** — `usedAt` is set on first exchange. A second attempt must fail.

12. **Skill embeddings use JSON-serialized float arrays** — Not pgvector. Cosine similarity computed in application code.

13. **Cookie name is `auth-token`** — Referenced in middleware, `auth.ts`, and `auth-edge.ts`. If renamed, all three must change together.

14. **Vercel Blob URLs are permanent** — `showcase_uploads.blobUrl` and version blobs are permanent references.

15. **Reference companion files must stay in sync** — Skills tagged `type: reference` are linked via `companionTo`.

16. **Features never import from other features** — Vertical slices import from `src/platform/` only.

17. **`requireOwnerOrAdmin` uses direct roleSlug check** — It checks `session.roleSlug === 'admin'`, not the permission table.

18. **Use `after()` not fire-and-forget for background work** — Vercel kills function instances after HTTP response. `after()` uses `waitUntil`.

19. **`'use server'` files can only export async functions** — Route segment config like `maxDuration` goes on page files.

20. **Private Vercel Blob URLs require Bearer auth** — URLs on `.private.blob.vercel-storage.com` need the `BLOB_READ_WRITE_TOKEN` header.

21. **Public API routes must be in middleware allowlist** — `/api/skills/catalog`, `/api/skills/search`, `/api/shares/link` are explicitly listed. New public routes need adding there.

22. **Skill slug+userId is the unique key for community skills** — Different users can publish the same slug. The `community_skill_slug_user` unique constraint enforces this.

23. **Showcase versions use version_number integers** — Auto-incremented per showcase. Never reuse a version number.

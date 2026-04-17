# AI Centre — Project Reference

> **This document is the source of truth for features, data flows, and constraints.**
> Read it before making changes to understand what exists, how it connects, and what must not break.

---

## When to Use This Document

Consult this document when:

- **Adding a new feature** — check the Feature Map to understand related areas and avoid conflicts
- **Modifying auth, sessions, or middleware** — the Do Not Break section has silent failure risks
- **Touching the toolkit composition or skill lifecycle** — composition layers and versioning rules are strict
- **Working on the project generation flow** — the composition wizard has dependencies across layers
- **Adding a new page or route** — check Implementation Status to understand what's planned vs built
- **Changing the database schema** — cross-reference the Data Models section before adding/removing columns
- **Integrating a new external service** — check External Services to understand what's already in use
- **Debugging unexpected redirects** — the auth middleware has a dev bypass that doesn't apply in production
- **Modifying permissions or roles** — the DB-backed permission system has a cache and specific guard patterns

Do not use this document for coding style, component architecture, or design tokens — those live in `CLAUDE.md` and the skill files.

---

## Product Overview

ezyCollect by Sidetrade **AI Centre** — internal platform distributing AI skills across all departments (engineering, design, marketing, operations). 60 skills in a portable library, bundled into toolkits via a four-layer composition system (Foundation → Domain → Features → Implementations). Users compose a toolkit, describe their idea, and download a project ZIP. Also has a showcase gallery where users share what they've built, and a skill marketplace for browsing individual skills.

**Primary user journey:**
1. Log in via email OTP (domain-restricted to ezycollect.com.au, ezycollect.io, sidetrade.com)
2. Browse toolkits or skills
3. Compose toolkit (pick domain → add features → choose implementations) or use a preset
4. Describe idea → generate project ZIP
5. Open in VS Code with Claude Code → build
6. Share the result in the showcase gallery

---

## Feature Map

### Authentication
**Status: ✅ Complete**

- Custom email OTP login — no password, no Auth.js
- 6-digit code, SHA-256 hashed in DB, 10-minute expiry, max 3 attempts
- JWT session stored in `auth-token` cookie, signed with `AUTH_SECRET`, 7-day expiry
- Domain restriction enforced in `src/platform/lib/otp.ts`: `ALLOWED_DOMAINS` array (`ezycollect.com.au`, `ezycollect.io`, `sidetrade.com`)
- Session contains `userId`, `email`, `roleId`, `roleSlug` — resolved from DB-backed roles table
- Two JWT implementations: `auth.ts` (Node.js, for Server Actions/RSC) and `auth-edge.ts` (Edge-compatible, for middleware). Do not merge them.
- Dev mode: `getSession()` returns admin session without JWT. Supports `dev-identity` cookie for role/user switching.
- Public routes (no auth required): `/login`, `/robots.txt`, `/api/auth/*`, `/api/health`
- Middleware (`middleware.ts`) protects all routes in production; bypasses entirely in `development`

**Gotchas:**
- The dev bypass is intentional — do not remove it. Any change to middleware must preserve `NODE_ENV === 'development'` passthrough.
- OTP attempts counter increments on each failed verify. At 3 failures the token is invalid and a new code must be requested.
- JWT verify is split into two implementations: `src/platform/lib/auth.ts` (Node.js) and `src/platform/lib/auth-edge.ts` (Edge-compatible). Middleware runs on the Edge runtime and **must** use `auth-edge.ts`. Do not consolidate these into one file — it will break middleware.

---

### Role & Permission System
**Status: ✅ Complete**

- DB-backed `roles` table with `slug`, `name`, `description`, `isSystem` flag
- 20 permissions across 7 categories defined in `src/platform/lib/permissions.ts`:
  - **Skills:** `skill:create`, `skill:edit`, `skill:delete`, `skill:publish`
  - **Archetypes:** `archetype:create`, `archetype:edit`, `archetype:delete`, `archetype:publish`
  - **Showcases:** `showcase:upload`, `showcase:delete`
  - **Projects:** `project:generate`
  - **Users:** `user:list`, `user:edit-role`, `user:deactivate`, `user:invite`
  - **Roles:** `role:create`, `role:edit`, `role:delete`
  - **Audit:** `audit:view`
- `role_permissions` join table links roles to permissions
- Two system roles seeded: **admin** (all permissions) and **member** (create, edit, upload, generate)
- Guards in `src/platform/lib/guards.ts`:
  - `requireAuth()` — session exists or `AuthError`
  - `requirePermission(key)` — session + permission or `ForbiddenError`
  - `requireOwnerOrAdmin(session, authorId)` — owner check or admin bypass
  - `requireNotSelf(session, targetUserId)` — prevents self-targeting (e.g. deactivate yourself)
- Permission cache: module-level `Map`, 60-second TTL, keyed by `roleId`
- Dev mode without `DATABASE_URL`: admin role gets all permissions, member gets denied
- Middleware blocks non-admins from `/admin` routes (defense-in-depth; actions also check permissions)

---

### Skill Library
**Status: ✅ Complete**

- 60 skills total: 56 behavioural (principle + implementation) + 4 reference companions
- Skill types: `principle`, `implementation`, `reference`
- Skill domains: `product-development`, `marketing`, `design`, `engineering`, `operations`, `global`
- Skill layers: `frontend`, `backend`, `fullstack`, `infrastructure`, `design`, `process`
- Browse at `/skills` with tabs: All, Foundation, Domains, Features, Implementation
- Sub-filter pills per domain and feature addon
- Search by title/description
- Tags on each skill: `type`, `domain[]`, `layer`
- Implementation skills have `companionTo` linking to their parent principle skill
- Skill content read from filesystem (`skills/*.md`) at runtime via `src/platform/lib/skills.ts`
- `SKILL_DEFINITIONS` array in `skills.ts` is the code-level registry (60 entries)
- DB `skills` table used for versioning/publishing metadata; `seed.ts` syncs from `SKILL_DEFINITIONS`
- **Upvoting:** Uses existing `reactions` table with `entity_type='skill'`, `emoji='thumbsup'`. Bulk-fetched via `getBulkSocialSignals`. Optimistic UI via `useSocialSignals` hook.
- **Sort:** URL param `?sort=popular` (default: recent). Popular sorts by upvote count desc, secondary by title. Bookmarked skills always pinned to top.

---

### Skill Detail Page
**Status: ✅ Complete**

Two views toggled by a button at the top of the page:

1. **"Skill in Practice" (default)** — rich visual showcase demonstrating the skill's concepts with diagrams, swatches, code examples, and usage patterns. Not a copy of the SKILL.md.
2. **"View SKILL.md"** — rendered markdown of the full skill specification via `react-markdown` + `rehype-raw` + `remark-gfm`.

Both views include download button and version info.

- **36 dedicated showcase components** in `src/features/skill-detail/showcases/` with full widget wrappers (XS/SM/MD/LG size variants) in `src/features/skill-detail/widgets/`
- **24 skills** get a styled auto-generated fallback via `SkillShowcaseFallback` (parsed from their markdown sections)
- Showcase map in `src/features/skill-detail/widgets/SkillDetailWidget/SkillInPractice.tsx` maps slug → widget component
- `CodeBlock` component with Shiki syntax highlighting (supports ts, tsx, js, jsx, css, html, json, yaml, bash, sql, graphql)

**Gotchas:**
- `showcaseHtml` is generated once on publish and cached in the `skills` table. Do not regenerate it on every page render.
- If a skill has no dedicated showcase component, the fallback handles it gracefully — no crash, no missing content.

---

### Skill & Archetype Versioning
**Status: ✅ Complete (lifecycle logic)**
**Status: ❌ Editor UI not built**

Versioning lifecycle:
1. **Create** → starts as draft at `v0.1.0`
2. **Edit draft** → updates in-place, no new `skill_versions` row
3. **Publish** → creates immutable `skill_versions` row, sets `currentPublishedVersionId`, triggers showcase HTML generation via Claude API
4. **Edit after publish** → creates a new draft on top of the published version
5. **Publish again** → increments version (e.g. `1.0.0` → `1.1.0`), new immutable row
6. **Archive** → version status becomes `archived`, no longer served

Audit log records every transition with `userId`, `timestamp`, and `metadata` (diffs, version numbers).

---

### Showcase Gallery
**Status: ✅ Complete**

- Browse at `/gallery` — adaptive layout based on item count (0/1/2-3/4+ items)
- Upload at `/gallery/upload` — form with title, description, skill tags, file upload
- View at `/gallery/[id]` — dedicated viewer page
- File types: HTML files (iframe preview with sandboxing) and Next.js project ZIPs (deployed via Vercel for live preview)
- File size limit: 10MB
- Search by title/description
- Fullscreen mode (portaled overlay, ESC to exit)
- Share link (copy URL), download, update (owner), delete (owner + admin)
- Skill tags on showcases link back to skill detail pages
- **Dev mode fallback:** When `DATABASE_URL` is not set, uses `public/uploads/` directory + `manifest.json` for local storage. When `BLOB_READ_WRITE_TOKEN` is not set, writes files to `public/uploads/` instead of Vercel Blob.
- Server actions in `src/features/showcase-gallery/action.ts`: `fetchAllShowcases`, `fetchShowcaseById`, `uploadShowcase`, `deleteShowcase`, `updateShowcase`, `checkDeployStatus`, `getSignedShowcaseUrl`, `retryDeploy`, `archiveShowcase`, `generateThumbnail`
- Auth: `uploadShowcase`, `retryDeploy`, and `archiveShowcase` require `showcase:upload` permission; `deleteShowcase`, `updateShowcase`, and `generateThumbnail` require owner or admin
- **Delete cleanup:** `deleteShowcase` also fire-and-forgets `deleteDeployment` when the showcase has a `deploymentId`, and deletes the thumbnail blob if `thumbnailUrl` exists. Vercel delete failure does not block DB deletion.
- **Archive:** `archiveShowcase(showcaseId)` sets `archived = true` in DB. `fetchAllShowcases` filters out archived showcases. Owner or admin only. Column added via migration `0009_add_showcase_archived.sql`.
- **Thumbnail generation:** `generateThumbnail(showcaseId)` captures a screenshot of the deployed showcase via thum.io (free, no API key). Signs the showcase URL with JWT so the screenshot service can access the protected page. Uploads the image to Vercel Blob (`showcases/thumbs/`). Requires the showcase to be in `ready` deploy state. Owner or admin only. Takes 15-30s — page route has `maxDuration = 60`.
- **Deploy columns:** `deploy_status` (text, default `'none'`), `deploy_url` (text, nullable), `deployment_id` (text, nullable), `deploy_error` (text, nullable), and `archived` (boolean, default `false`) on `showcase_uploads` — tracks Vercel deployment state per showcase. Migrations: `0006_add_deploy_columns.sql`, `0007_add_deployment_id.sql`, `0008_add_deploy_error.sql`, `0009_add_showcase_archived.sql`.
- **Vercel deploy module:** `src/platform/lib/vercel-deploy.ts` — typed wrapper around Vercel API (`deployProject`, `deleteDeployment`, `getDeploymentStatus`). Uses `VERCEL_SHOWCASE_TOKEN` env var. Returns `Result<T, Error>`. Status mapping: QUEUED/BUILDING -> 'building', READY -> 'ready', ERROR/CANCELED -> 'failed'.
- **Deploy on upload:** `src/features/showcase-gallery/deploy.ts` — `triggerDeploy(showcaseId)` is called via `after()` from `uploadShowcase` for ZIP files. Uses `after()` from `next/server` (not fire-and-forget promises) because Vercel serverless kills function instances after HTTP response — `after()` uses `waitUntil` under the hood to keep the function alive. Fetches ZIP from blob storage (local filesystem for `/uploads/` paths, fetch for remote URLs), extracts with JSZip (in-memory), sanitizes paths, auto-detects framework from `package.json` (Next.js, Nuxt, Vite, Angular, or static), detects `src/` directory structure and injects middleware at `src/middleware.ts` or root accordingly, injects `jose` dependency into `package.json`, removes any existing middleware/vercel.json from ZIP. All deploys go to the `ai-centre-showcases` Vercel project as production target. Deployment names are tagged with environment prefix (e.g., `dev-credit-app-writeback-abc12345`). Stores `deploymentId` in DB. Skips silently when `VERCEL_SHOWCASE_TOKEN` is not set.
- **Stale deploy detection:** `checkDeployStatus` detects deploys stuck in `pending`/`building` with no `deploymentId` for >10 minutes and auto-marks them as `failed` with a timeout message.
- **Auto-thumbnail on deploy ready:** When `checkDeployStatus` detects a transition to `ready` and no thumbnail exists, it triggers thumbnail generation via `after()` — signs the deploy URL with JWT, captures a screenshot via thum.io, uploads to Vercel Blob, and stores the URL in DB. No manual button press needed for new uploads.
- **Deploy status polling:** `checkDeployStatus` server action reads DB status; if `building`/`pending` with a `deploymentId`, calls `getDeploymentStatus()` on Vercel API (returns raw `vercelState` like QUEUED/BUILDING/INITIALIZING) and updates DB when status changes. Client-side `useDeployPolling` hook polls every 5s, auto-stops at terminal states. Hook returns `{ deployStatus, deployUrl, deployError, deployStep, resetStatus }`. The `ShowcaseViewerWidget` shows a step-by-step progress indicator (Queued → Installing dependencies → Building project → Deploying to edge) during deploy, error details with retry button on failure, and auto-transitions to iframe when ready.
- **Vercel deploy webhook:** `src/app/api/webhooks/vercel-deploy/route.ts` — handles `deployment.created`, `deployment.succeeded`, `deployment.error`, and `deployment.canceled` events. Verifies HMAC-SHA1 signature via `VERCEL_WEBHOOK_SECRET`. On success: updates DB status to `ready`, fetches deployment screenshot from Vercel API and sets as `thumbnailUrl` (if not already set by user). On failure: stores error in `deployError`. On canceled: marks as failed.
- **Retry deploy:** `retryDeploy(showcaseId)` server action requires `showcase:upload` permission, verifies the showcase is a ZIP with `failed`, `pending`, or `building` status, deletes old deployment if `deploymentId` exists, resets status to `pending`, and calls `triggerDeploy` via `after()`. The viewer widget calls `resetStatus('pending')` after successful retry to restart client-side polling.
- **Re-deploy on update:** `updateShowcase` detects file changes and manages deployments: when a new ZIP is uploaded, deletes the old Vercel deployment (fire-and-forget), resets `deploy_status` to `'pending'`, clears `deploy_url`/`deployment_id`, and fire-and-forgets `triggerDeploy`. When switching from ZIP to HTML, deletes old deployment and sets status to `'none'`. Metadata-only updates (no new file) do not touch deploy fields.
- **Lazy migration for pre-existing showcases:** `triggerMigrationDeploy(showcaseId)` server action (no auth required — viewing is public) handles ZIP showcases uploaded before the Vercel deploy system existed (`deployStatus === 'none'`). Sets status to `'pending'` and fire-and-forgets `triggerDeploy`. HTML showcases and already-deploying/deployed showcases are no-ops. Called from `GalleryViewerSlot` on first view — the client overrides `deployStatus` to `'pending'` immediately so the polling hook takes over. Logged with `[showcase-migration]` prefix.
- **Showcase template files:** `src/platform/lib/showcase-template.ts` — `getTemplateFiles(hasSrcDir)` returns middleware and `vercel.json` as string constants. When `hasSrcDir` is true, middleware is placed at `src/middleware.ts`; otherwise at root `middleware.ts`. Middleware uses `jose` to verify JWT from `?token=` query param against `JWT_SECRET` env var, sets `Content-Security-Policy: frame-ancestors` from `ALLOWED_ORIGINS`, removes `X-Frame-Options`, sets `Cache-Control: private, no-store` and `x-showcase-auth: verified` header. Returns 403 HTML page for blocked requests. Fails closed (blocks all if `JWT_SECRET` not set).

---

### Admin Dashboard
**Status: ✅ Complete**

- Route: `/admin` (admin role required, middleware-protected)
- 4 tabs: Users, Roles, Permissions, Audit Log
- **Users tab:** List with search, invite by email, role assignment via dropdown, activate/deactivate toggle, self-row disabled
- **Roles tab:** CRUD with permission checklist grouped by category, system role protection (can't delete system roles)
- **Permissions tab:** Read-only reference of all 20 permissions grouped by 7 categories
- **Audit Log tab:** Color-coded action badges, entity type pills, timestamps
- Components in `src/app/admin/`: `AdminUsers.tsx`, `AdminRoles.tsx`, `AdminPermissions.tsx`, `AdminAuditLog.tsx`, `AdminHeader.tsx`

---

### User Management
**Status: ✅ Complete**

- `invitations` table: email + role + invitedById + status (pending/accepted/expired) + expiresAt
- Invite flow: admin sends invite (email + role) → verification token created → user receives OTP → first login assigns invited role
- Activate/deactivate users (soft toggle via `isActive` column, not hard delete)
- Role assignment via dropdown in admin Users tab
- `requireNotSelf()` guard prevents self-deactivation and self-role-change
- Audit trail for all user state changes

---

### Homepage
**Status: ✅ Complete**

6 sections in `src/app/page.tsx`:
1. **HomeHero** — welcome banner
2. **Flow CTA** — get started with Flow onboarding steps (links to `/skills`)
3. **HomeStats** — platform statistics
4. **HomeSkillSpotlights** — featured skills
5. **HomeShowcases** — community showcases (adaptive based on count)
6. **CTA Footer** — link to `/gallery/upload`

Never empty — skills and toolkits are always present from static definitions.

---

### Dev Tools
**Status: ✅ Complete**

- **Dev Identity Switcher** (navbar, dev only): switch role + user to test permissions via `dev-identity` cookie parsed in `getSession()`
- **Session context** (`src/platform/lib/SessionContext.tsx`): client-side session provider
- Theme follows browser preference (`prefers-color-scheme`)
- Navigation loading bar (NProgress)
- Local file storage fallback when `BLOB_READ_WRITE_TOKEN` not configured
- Local DB fallback for showcase gallery when `DATABASE_URL` not configured

---

### Not Yet Built

| Area | Notes |
|---|---|
| Skill editor UI (`/skills/[slug]/edit`) | Versioning lifecycle logic exists, no UI |
| Toolkit editor UI | Composition model exists, no CRUD UI |
| CI/CD pipeline (GitHub Actions) | `.github/` directory exists but incomplete |
| Sentry error tracking | Instrumentation file may be ready, no DSN configured |
| Email provider migration | ✅ Migrated to Mailgun |

---

## Key Data Flows

### OTP Authentication

```
User submits email
  → validate domain (src/platform/lib/otp.ts: ALLOWED_DOMAINS)
  → generate 6-digit OTP (randomInt)
  → hash OTP with SHA-256 (crypto.subtle.digest)
  → insert into verification_tokens (hashed token, 10min expiry, attempts=0)
  → send plain OTP to user via Mailgun email

User submits 6-digit code
  → hash submitted code with SHA-256
  → look up verification_tokens by email + hashed token
  → check: not expired, attempts < 3
  → on fail: increment attempts, return error
  → on success: delete token, upsert user, resolve role from DB (roles table)
  → create JWT (userId, email, roleId, roleSlug) → set auth-token cookie (7d, httpOnly, secure in prod)
```

### Toolkit Composition → Project Generation

```
User selects domain → recommended addons auto-toggle
  → user adds/removes feature add-ons → picks implementations per add-on
  → resolveComposition() produces flat deduplicated skill slug array
  → user writes project description → submit

Server resolves skill content from SKILL_DEFINITIONS (filesystem read)
  → assembles ZIP: /skills/*.md files + tailored CLAUDE.md
  → uploads ZIP to Vercel Blob
  → inserts generated_projects record (userId, archetypeId, skillIds, prompt, blobUrl)
  → returns blobUrl as download link
```

### Showcase Upload

```
User fills form (title, description, skill tags, file)
  → requirePermission('showcase:upload') guard
  → validate file type (.html or .zip) + size (10MB limit)
  → dev without BLOB_READ_WRITE_TOKEN: write to public/uploads/ directory
  → prod: upload to Vercel Blob (path: showcases/<timestamp>-<filename>)
  → dev without DATABASE_URL: append to public/uploads/manifest.json
  → prod: insert showcase_uploads record (deploy_status='pending' for ZIPs)
  → ZIP uploads: fire-and-forget triggerDeploy(id) → extracts ZIP, injects security middleware, calls Vercel Deployments API
  → return { id } immediately (deploy continues in background)
  → viewer page polls checkDeployStatus until 'ready', then renders iframe with signed JWT URL
```

### Permission Check

```
Server Action called → requirePermission('skill:publish')
  → requireAuth() → getSession() → returns Session { userId, email, roleId, roleSlug }
  → dev without DATABASE_URL: admin gets all, member gets denied
  → prod: getPermissionsForRole(session.roleId)
    → check module-level cache (Map, keyed by roleId, 60s TTL)
    → cache miss: query role_permissions table → populate cache
  → check if permission key exists in Set
  → missing: return Err(ForbiddenError)
  → present: return Ok(session)
```

### Skill Publish Lifecycle

```
Skill created
  → insert skills row + skill_versions row (status=draft, version=0.1.0)
  → skills.currentDraftVersionId = new version id

Editor saves
  → update skill_versions.content in-place (no new row while draft)

Publish triggered
  → set skill_versions.status = published
  → set skill_versions.publishedAt, publishedById
  → set skills.currentPublishedVersionId = this version id
  → trigger Claude API → generate showcaseHtml → save to skills.showcaseHtml
  → write audit_log entry (action=published)

Further edits after publish
  → insert new skill_versions row (status=draft, version incremented)
  → set skills.currentDraftVersionId = new draft id
```

---

## External Services

| Service | Purpose | Env var | Fails silently? |
|---|---|---|---|
| Neon (Postgres) | All persistent data | `DATABASE_URL` | Partially — showcase gallery falls back to local manifest; other features hard crash |
| Vercel Blob | ZIPs, showcase files | `BLOB_READ_WRITE_TOKEN` | Partially — falls back to `public/uploads/` in dev; throws in prod |
| Mailgun | OTP email delivery | `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `MAILGUN_FROM_EMAIL` (opt), `MAILGUN_EU` (opt) | Yes — logs to console if `MAILGUN_API_KEY` missing |
| Claude API (`@anthropic-ai/sdk`) | Showcase HTML generation | `ANTHROPIC_API_KEY` | Partially — showcase falls back to null |
| Turso Platform API | Per-user database provisioning | `TURSO_ORG`, `TURSO_API_TOKEN` | Yes — returns 503 if not configured |

| Vercel | Hosting + Edge runtime for middleware | — | N/A |

---

## Implementation Status

| Area | Status |
|---|---|
| Auth (OTP + JWT + middleware) | ✅ Complete |
| DB-backed roles & permissions (20 permissions, 7 categories) | ✅ Complete |
| Permission guards (requireAuth, requirePermission, requireOwnerOrAdmin, requireNotSelf) | ✅ Complete |
| Skill library (60 skills, browse + search + filter tabs) | ✅ Complete |
| Skill detail page (36 dedicated showcases + 24 fallback) | ✅ Complete |
| Skill versioning (lifecycle logic) | ✅ Complete |
| Showcase gallery (upload, view, search, fullscreen, CRUD) | ✅ Complete |
| Admin dashboard (users, roles, permissions, audit log) | ✅ Complete |
| User management (invite, activate/deactivate, role assignment) | ✅ Complete |
| Homepage (6 sections, adaptive showcases) | ✅ Complete |
| Dev identity switcher | ✅ Complete |
| Local dev fallbacks (filesystem, manifest.json) | ✅ Complete |
| Platform/features architecture migration | ✅ Complete |
| Result<T, E> error handling | ✅ Complete |
| Skill editor UI (`/skills/[slug]/edit`) | ❌ Not built |
| Toolkit editor UI | ❌ Not built |
| CI/CD pipeline | ❌ Not built |
| Health check endpoint (`/api/health`) | ✅ Complete |
| Security headers (next.config.ts) | ✅ Complete |
| Turso DB provisioning (per-user databases, quota enforcement) | ✅ Complete |
| Sentry error tracking | ❌ Instrumentation stub ready, no DSN |

---

## Application Routes

| Route | Purpose | Auth |
|---|---|---|
| `/` | Homepage (hero, Flow CTA, stats, spotlights, showcases, CTA) | Required (prod) |
| `/login` | Email OTP login page | Public |
| `/skills` | Skill library (browse, search, filter) | Required (prod) |
| `/skills/[slug]` | Skill detail (showcase + SKILL.md toggle) | Required (prod) |
| `/gallery` | Showcase gallery (browse, search) | Required (prod) |
| `/gallery/[id]` | Showcase viewer (iframe/deployed preview) | Required (prod) |
| `/gallery/upload` | Showcase upload form | Required (prod) |
| `/admin` | Admin dashboard (users, roles, permissions, audit) | Admin only |
| `/robots.txt` | SEO robots file | Public |
| `/api/workspace/databases` | Provision (POST) or list (GET) per-user Turso databases | Bearer token |
| `/api/debug/showcases` | List/retry/thumbnail showcases (debug) | Debug key |

---

## Feature Slices

All in `src/features/`:

| Feature | Directory | Contents |
|---|---|---|
| Skill Library | `skill-library/` | Browse/search/filter server action + SkillCard, SkillList widgets |
| Skill Detail | `skill-detail/` | 36 showcase components + showcase widgets + SkillDetail widget |
| Showcase Gallery | `showcase-gallery/` | Upload/CRUD server action + gallery widgets |
| Auth | `auth/` | Login server action + Login widget |
| User Management | `user-management/` | User CRUD actions + admin widgets |
| Role Management | `role-management/` | Role CRUD actions + admin widgets |
| Audit Log | `audit-log/` | Audit query action + admin widget |

---

## Do Not Break

These are non-obvious constraints that would silently regress if changed:

1. **Dev bypass in middleware** — `NODE_ENV === 'development'` skips all auth checks. This is intentional for local development. Never remove it or move it behind a feature flag.

2. **Domain restriction list** — `ALLOWED_DOMAINS` in `src/platform/lib/otp.ts` is the single source of truth. Do not add domain checks anywhere else. If a new company domain is added, update only this array.

3. **Two JWT implementations** — `src/platform/lib/auth.ts` uses the Node.js `jose` API; `src/platform/lib/auth-edge.ts` uses the Edge-compatible subset. Middleware runs on the Edge runtime and **must** use `auth-edge.ts`. Do not consolidate these into one file — it will break middleware.

4. **Session has roleId/roleSlug, not role string** — All code must use `session.roleSlug` for role-level checks and `session.roleId` for permission lookups. Do not add a plain `role` field.

5. **DB-backed roles are the source of truth for permissions** — The `roles` and `role_permissions` tables define what each role can do. Don't hardcode role checks — use `requirePermission()` with permission keys from `src/platform/lib/permissions.ts`.

6. **Permission cache has a 60-second TTL** — Module-level `Map` in `guards.ts`. If you change a role's permissions, they take up to 60 seconds to propagate. Do not reduce the TTL below 30 seconds or remove the cache — it prevents N+1 queries on every server action.

7. **Published skill_versions are immutable** — once `status = published`, the `content` column must never be updated. Further edits create a new draft row.

8. **showcaseHtml is cached, not live** — `skills.showcaseHtml` is written once on publish. Do not regenerate it on every page render. Regeneration is only triggered by a publish action.

9. **Skill showcase components are slug-keyed** — 36 skills have dedicated showcase components in `src/features/skill-detail/widgets/`. Skills without a dedicated component automatically get a styled fallback view generated from their parsed markdown sections. Adding a new skill does NOT require a showcase component — the fallback handles it gracefully.

10. **Two skill registries must stay in sync** — `src/platform/lib/skills.ts` (`SKILL_DEFINITIONS`, 60 entries) and `src/platform/db/seed.ts` (`SKILLS`) are duplicate registries. When adding a new skill, update both, and add the `skills/<slug>.md` file.

12. **OTP token is stored hashed** — the raw OTP is never stored. Verification must re-hash the submitted code and compare. Never store the plain code.

13. **Cookie name is `auth-token`** — referenced in middleware, `auth.ts`, and `auth-edge.ts`. If renamed, all three must change together.

14. **Vercel Blob URLs are permanent** — `generated_projects.blobUrl` and `showcase_uploads.blobUrl` are permanent references. Do not delete blobs without also cleaning up the DB record.

15. **Reference companion files must stay in sync** — Skills tagged `type: reference` (e.g. `brand-tokens-reference.md`) are linked to a parent skill via `companionTo`. Changes to the parent skill's rules may require updates to the companion's lookup data.

16. **Features never import from other features** — `src/features/*/` directories are vertical slices. They import from `src/platform/` only. If two features need the same code, extract it to platform.

17. **Showcase gallery dev fallback uses manifest.json** — `public/uploads/manifest.json` stores showcase records when `DATABASE_URL` is not set. Don't delete this file in dev mode — it's the only record of uploaded showcases.

18. **Dev identity cookie (`dev-identity`)** — In development mode, `getSession()` reads this cookie to allow role/user switching. It's a JSON object with `userId`, `email`, `roleId`, `roleSlug`. The Dev Identity Switcher in the navbar sets it.

19. **`requireOwnerOrAdmin` uses `canAccessResource` from permissions.ts** — This checks `session.roleSlug === 'admin'` OR `session.userId === resource.authorId`. It does NOT check the `role_permissions` table — it's a direct role slug check for the admin bypass.

20. **invitations table tracks user invites** — Invite records have status (pending/accepted/expired) and expiry. The invite flow creates a verification token that maps to the invited role. Don't bypass this — it's how new users get their initial role assignment.

21. **`VERCEL_SHOWCASE_TOKEN` is required for showcase deployment** — The `vercel-deploy` module reads this env var lazily (only when a deploy function is called). It must be a Vercel API token with deployment permissions. Never log the token value.

22. **Private Vercel Blob URLs require Bearer auth** — URLs on `.private.blob.vercel-storage.com` need `Authorization: Bearer {BLOB_READ_WRITE_TOKEN}` header. Plain `fetch()` returns 403. See `deploy.ts` for the correct pattern.

23. **Use `after()` not fire-and-forget for background work on Vercel** — `import('./module').then(...)` does NOT work on Vercel serverless — the function instance is killed after the HTTP response. Use `after()` from `next/server` (stable in Next.js 15.1+) which uses `waitUntil` under the hood. All deploy triggers in `action.ts` use this pattern.

24. **`'use server'` files can only export async functions** — Route segment config like `maxDuration` must go on the page file (`page.tsx`), not the server action file. Next.js build will fail otherwise.

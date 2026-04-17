# Plans Log

**Session resumed 2026-04-11 from parked Plan 01 — Vercel-Deployed Showcase Previews.** Archive: `.plans/.park/park-2026-04-10-session01.md`

## Plan 01 — Vercel-Deployed Showcase Previews

| Ch | Name | Status | Notes |
|---|---|---|---|
| 0 | DB Schema + Deploy Module | **Done** | Migration 0006, vercel-deploy.ts, action.ts selects updated. 14 tests passing. |
| 1 | Deploy on Upload | **Done** | deploy.ts created, action.ts fires-and-forgets deploy for ZIPs, path traversal protection. 8 new tests. |
| 2 | Showcase Project Template | **Done** | showcase-template.ts with middleware + vercel.json templates, injected in deploy.ts. 21 new tests. |
| 3 | JWT Token Generation | **Done** | showcase-token.ts, signShowcaseUrl with 5min JWT. 7 tests. |
| 4 | Iframe Viewer for ZIP | **Done** | Widget renders iframe for deployed ZIPs, StackBlitz as fallback. getSignedShowcaseUrl action. 9 tests. |
| 5 | Build Status Polling | **Done** | useDeployPolling hook, checkDeployStatus action, deploymentId column (migration 0007), building state UI. 169 tests passing. |
| 6 | Deploy Status in Viewer | **Done** | Failed state UI with WarningCircle, retry button, download fallback. retryDeploy action with permission guard. resetStatus hook addition. 177 tests passing. |
| 7 | Re-deploy on Update | **Done** | updateShowcase re-deploys on new ZIP, deletes old deployment, handles ZIP→HTML transition. 6 new tests, 183 total passing. |
| 8 | Delete Cleanup | **Done** | deleteShowcase fire-and-forgets deleteDeployment + thumbnail cleanup. 5 new tests, 188 total passing. |
| 9 | Remove StackBlitz | **Done** | Removed @stackblitz/sdk, IndexedDB cache, StackBlitzFullscreen, phase types. jszip kept server-side. 188 tests passing. |
| 10 | Migrate Existing | **Done** | triggerMigrationDeploy action, lazy deploy on first view in GalleryViewerSlot. 6 new tests, 194 total passing. |
| C | Closing | **Done** | PROJECT_REFERENCE.md updated with complete deploy pipeline data flow. All 11 chapters complete. |

**Plan 01 complete.** 194 tests across 26 files. @stackblitz/sdk removed. Vercel deploy pipeline fully wired: upload→deploy→poll→view→retry→update→delete→migrate.

---

**Session resumed 2026-04-13 from parked Post-Plan 01 production fixes.** Archive: `.plans/.park/park-2026-04-13-session01.md`

### Post-Plan 01 continuation — 2026-04-13

| Item | Status | Notes |
|---|---|---|
| Update PROJECT_REFERENCE.md | **Done** | Added archive, thumbnail, debug API, after() pattern, stale timeout, blob auth, auto-thumbnail docs. Added 3 new Do Not Break rules (#22-24). |
| Archive duplicate showcases | **Done** | User archived 4 duplicates manually via production. Confirmed via debug API. |
| Webhook investigation | **Done** | No code change needed — webhook gracefully skips non-showcase deployments. Dashboard config fix (low priority). |
| Auto-thumbnail on deploy ready | **Done** | `checkDeployStatus` now triggers thumbnail generation via `after()` when status transitions to `ready` and no thumbnail exists. |

---

## Plan 02 — Flow-First Platform

**Status:** In progress
**Created:** 2026-04-13
**Plan file:** `.plans/02-flow-first-platform_2026-04-13/plan.md`

19 chapters + closing. OAuth → workspace → bootstrap → skills → showcases → infrastructure → cleanup.

| Ch | Name | Status | Notes |
|---|---|---|---|
| 0 | OAuth + Flow Login | **Done** | Schema (oauth_codes, oauth_tokens), migration 0010, oauth.ts (PKCE, JWT, token rotation), 4 API routes, 3 skill ref files, 13 unit tests passing. |
| 1 | Workspace + Admin Quotas | **Done** | user_quotas table (migration 0011), workspace actions + 3 API routes, WorkspaceListWidget with QuotaBar + QuotaEditDialog, Workspaces tab in admin. 2 new permissions (workspace:view, workspace:edit-quotas). |
| 2 | Flow Bootstrap | **Done** | Catalog API (public), content download API (auth required), flow-bootstrap command in SKILL.md, bootstrap-client.md reference file. Slug validation, no path traversal. |
| 3 | RAG Skill Matching | **Done** | skill_embeddings table (migration 0012), embeddings.ts lib (pure cosine/keyword/serialise), /api/skills/search route with keyword fallback. OpenRouter via OpenAI SDK (text-embedding-3-small). Seed upserts embeddings when OPENROUTER_API_KEY set. flow SKILL.md bootstrap updated to call search API first. 29 new tests, 237/238 total passing (1 pre-existing `deploy-polling` failure unrelated to Ch 3). |
| 4 | Vibe Mode Templates | **Done** | plan-template-vibe.md (DRAFT→REVIEW→REFINE→DELIVER), plan-template-vibe-visual.md (design gates). Bootstrap detects mode (standard/vibe/vibe-visual) from description. flow plan command supports all 4 template types. Skill-only chapter, no server changes. |
| 5 | Skill Publishing | **Done** | community_skills + community_skill_versions tables (migration 0013), POST /api/skills/publish with quota enforcement + versioning, GET /api/skills/community/[slug]/versions, Community badge on skill cards (violet, aria-labelled), /flow publish command in SKILL.md. |
| 6 | Skill Rollback | **Done** | POST /api/skills/community/[slug]/rollback — append-only (creates new version from target content). Owner-only auth, edge cases handled (no-op on current, 404 on missing, 400 on single version). /flow rollback command in SKILL.md. |
| 7 | Skill Update & Fork | **Done** | POST /api/skills/updates — compares installed versions + checksums against official catalog. Detects version mismatches and local modifications. /flow update command with accept/fork binary choice. Forked skills excluded from future checks. |
| 8 | Showcase Publishing | **Done** | showcase_versions table (migration 0014), POST /api/showcases/publish with FormData upload, Bearer auth, blob storage, version tracking, ZIP deploy via after(). /flow showcase command in SKILL.md. |
| 9 | Showcase History + Rollback | **Done** | VersionHistoryPanel in showcase viewer (collapsible, owner-only restore). Server actions: getShowcaseVersions, restoreShowcaseVersion (append-only, re-deploys ZIPs). POST /api/showcases/[id]/rollback for CLI. |
| 10 | Turso DB in Bootstrap | **Done** | user_databases table (migration 0015), turso.ts Platform API wrapper (create/token/delete/provision), POST+GET /api/workspace/databases with quota enforcement, db-turso-drizzle skill + templates, flow bootstrap updated with DB provisioning step. Workspace action now counts user databases for schemasUsed. |
| 11 | Migration & Seed Refs | **Done** | db-turso-drizzle/references/migrations.md with migrate.ts runner, seed.ts template, package.json scripts, idempotency rules, error table. SKILL.md updated with workflow and reference link. Bootstrap step 12 extended to copy migration files and add db:* scripts. |
| 12 | Email + Mailpit + Docker | **Done** | email-mailpit skill + references/templates.md: Docker Compose (Mailpit), email.ts abstraction (Nodemailer dev → Mailgun prod), .env.local template. Bootstrap step 13 added for email projects. |
| 13 | OTP Auth Ref Files | **Done** | auth-otp skill + templates: auth.ts (JWT sessions), otp.ts (hashed OTPs, rate limiting), middleware.ts, login page, API routes, schema additions. Bootstrap step 14 added. Depends on email-mailpit and db-turso-drizzle. |
| 14 | File Storage Ref Files | **Done** | storage-vercel-blob/references/templates.md: storage.ts abstraction (local fs dev → Vercel Blob prod), upload API route with size/type validation. Bootstrap step 15 added. Used existing storage-vercel-blob skill (not new file-storage-vercel per plan). |
| 15 | Flow Status + Quotas | **Done** | /flow status extended: reads project.json for local state, fetches workspace quotas (skills/databases/storage used vs limit) via GET /api/workspace. Handles unauthenticated and unreachable cases gracefully. |
| 16 | Community Upvotes | **Done** | Sort toggle (Recent/Popular) with `?sort=popular` URL param. Upvotes already wired via existing social signals (useSocialSignals, getBulkSocialSignals, toggleReaction). Popular sort by upvote count desc, secondary by title. Suspense boundary added for useSearchParams. |
| 17 | Remove Toolkit & Generate | **Done** | Deleted features/generate-project, features/archetypes, app/generate, app/toolkits, app/archetypes, screens, ACL mapper, domain class, ArchetypeCard component, compose-toolkit chat tool, toolkit-composition lib, archetypes lib. Removed generatedProjects table + migration 0016. Updated widget registry, nav, homepage (Flow CTA), permissions, i18n, chat route, system prompt, test-setup, e2e tests. |
| 18 | Showcase Migration | Not started | |
| C | Closing | Not started | |

## Parked Session — 2026-04-13

**Plan:** Post-Plan 01 — Production deploy pipeline fixes and gallery features
**Position:** All work committed and pushed. Production is green. No plan file — this was reactive bug-fixing and feature work.

**Instructions for next agent:** Read this entire park entry top to bottom. Tick each checkpoint as you absorb that section. Once ALL checkpoints are ticked, remove this park entry from LOG.md, note "Session resumed YYYY-MM-DD from parked Post-Plan 01 production fixes" in its place, and proceed with First Actions at the bottom.

---

### 1. Agent Rules

- Always run `npm run build` before pushing — `tsc --noEmit` alone doesn't catch all Next.js errors (e.g. `'use server'` file export restrictions).
- `'use server'` files can ONLY export async functions. Route segment config like `maxDuration` must go on the page file, not the action file.
- When user says "push", they mean commit AND push (they confirmed this pattern during session).
- Test with the debug API (`/api/debug/showcases`) to verify production behavior — don't assume changes work without checking logs.

- [x] **Checkpoint 1:** Agent rules absorbed.

---

### 2. Plan Files

- No formal plan file for this session — it was reactive production debugging.
- Plan 01 (`.plans/plan-01-vercel-showcase-previews.md` if it exists) covers the original showcase deploy pipeline architecture.
- `PROJECT_REFERENCE.md` — contains the full feature map including showcase deploy flow. Needs updating with new features added this session.

- [x] **Checkpoint 2:** Plan files read. I understand the decisions, chapters, and dependencies.

---

### 3. Codebase State

- `src/features/showcase-gallery/action.ts` — All server actions for gallery. Key changes: `after()` replaces fire-and-forget, `retryDeploy` accepts pending/building states, `archiveShowcase` added, `generateThumbnail` added (uses thum.io screenshot API + signed URL), `checkDeployStatus` has stale timeout (10min).
- `src/features/showcase-gallery/deploy.ts` — `triggerDeploy` now fetches blobs with `Authorization: Bearer` header for private Vercel Blob storage.
- `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` — Archive, Thumbnail, and Retry buttons (all guarded by `canDelete` = owner OR admin). Retry button also appears on pending/building state screen.
- `src/app/gallery/[id]/page.tsx` — Has `maxDuration = 60` for thumbnail generation timeout.
- `src/app/api/debug/showcases/route.ts` — Debug API: GET lists all showcases, POST with `action: "retry"` or `action: "thumbnail"` for admin operations.
- `src/app/api/debug/route.ts` — Now reports `VERCEL_SHOWCASE_TOKEN_SET` and `SHOWCASE_JWT_SECRET_SET`.
- `src/platform/db/schema.ts` — `showcase_uploads` table has new `archived` boolean column.
- `src/platform/db/migrations/0009_add_showcase_archived.sql` — Idempotent migration for archived column.
- `scripts/migrate.ts` — Build-time migration script (runs in prebuild, standalone, no @/ aliases).

- [x] **Checkpoint 3:** Codebase files read. I know the current state of all affected code.

---

### 4. Uncommitted Work

No uncommitted changes. Working tree clean.

**Production state:** Green. All 5 showcases deployed and ready with thumbnails. 196 tests passing across 26 files.
**Branch:** `main`

Key commits this session (newest first):
| Commit | What it does |
|---|---|
| `8f8dbde` | Fix build: move maxDuration to page route |
| `2ee2ab3` | Increase server action timeout (maxDuration 60s) — **broke build, fixed in 8f8dbde** |
| `91f9857` | Add thumbnailUrl to debug showcases listing |
| `b1d13ef` | Add thumbnail action to debug showcases endpoint |
| `9d8bbd1` | Add generate thumbnail button + owner/admin-only actions |
| `d22fe45` | Fix blob fetch 403: Bearer token for private Vercel Blob |
| `002651a` | Add debug showcase API |
| `3ba3376` | Fix deploy stuck forever: after(), stale timeout, archive, retry for stuck |

- [x] **Checkpoint 4:** Git status checked. I know what's uncommitted and what to ask about.

---

### 5. Session Context

**Root cause of stuck deploys:**
- FINDING: Fire-and-forget `import('./deploy').then(...)` pattern does NOT work on Vercel serverless. The function instance is killed after the HTTP response is sent, before the promise resolves.
- SOURCE: Observed in production — `triggerDeploy` never logged, `deploymentId` never stored in DB, webhook fired for wrong project.
- IMPLICATION: Replaced with `after()` from `next/server` (stable in Next.js 15.1+). This tells Vercel's runtime to keep the function alive via `waitUntil` under the hood.

**Missing env vars in production:**
- FINDING: `VERCEL_SHOWCASE_TOKEN` and `SHOWCASE_JWT_SECRET` were never added to Vercel production environment variables. The code silently skipped deployment when token was missing.
- SOURCE: Debug endpoint showed `VERCEL_SHOWCASE_TOKEN_SET: false`. Added both via Vercel API (`POST /v10/projects/{id}/env`).
- IMPLICATION: Always check debug endpoint after deploying env-dependent features. The debug endpoint now reports both showcase-related env vars.

**Blob storage auth:**
- FINDING: Private Vercel Blob URLs (`.private.blob.vercel-storage.com`) require `Authorization: Bearer {BLOB_READ_WRITE_TOKEN}` header.
- SOURCE: deploy.ts was fetching ZIPs with plain `fetch()`, getting 403. The `/api/blob` proxy route already had the correct pattern.
- IMPLICATION: Fixed in `deploy.ts`. Any new code fetching from blob storage must include the Bearer token.

**Thumbnail generation:**
- FINDING: Vercel's screenshot service (`vercel.com/api/www/screenshot/`) does NOT work for JWT-protected pages (returns 404/308).
- SOURCE: Tested directly with curl. The showcases are protected by Edge Middleware requiring a JWT token.
- IMPLICATION: Using thum.io free screenshot API instead. The signed URL (with JWT query param) allows thum.io to access the page. This works but takes 15-30s, requiring `maxDuration=60` on the page route.

**Webhook firing for wrong project:**
- FINDING: The Vercel webhook at `/api/webhooks/vercel-deploy` receives events from the main `ai-centre` project, not just `ai-centre-showcases`.
- SOURCE: Observed deployment ID `dpl_HqgisUWgFNCVWa2ncWN4CvtzTabL` in webhook logs — it was a main app deploy.
- IMPLICATION: Not critical (webhook gracefully handles "no showcase found"), but webhook should ideally be registered only on the showcases project. Low priority.

**Rejected approaches:**
- `maxDuration` in `'use server'` file — rejected because Next.js only allows async function exports in server action files. Must go on page route segment config. Source: build error.
- Vercel internal screenshot API (`/v6/deployments/{id}/screenshots`) — 404, doesn't exist.
- `html2canvas` for client-side iframe screenshot — rejected because cross-origin iframes can't be captured (CORS).

- [x] **Checkpoint 5:** Session context absorbed. I understand what was researched, discussed, and rejected.

---

### 6. Prerequisites

No prerequisites — all env vars configured, production is green.

- [x] **Checkpoint 6:** Prerequisites reviewed. I know which items to confirm with the user.

---

### 7. First Actions

1. Update `PROJECT_REFERENCE.md` to reflect changes from this session (archive feature, thumbnail generation, debug showcase API, after() pattern, stale timeout).
2. Consider whether the 3 duplicate "Credit App LP" showcases should be archived — ask user.
3. Investigate webhook registration — currently fires for main app deploys too. Low priority but noisy.
4. Consider auto-generating thumbnails when `checkDeployStatus` transitions to `ready` (currently manual button only).

- [x] **Checkpoint 7:** First actions understood. Ready to begin.

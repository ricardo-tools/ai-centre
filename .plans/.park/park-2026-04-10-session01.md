## Parked Session — 2026-04-10

**Plan:** 01 — Vercel-Deployed Showcase Previews
**Position:** Pre-implementation. Master plan + all 12 chapter files written. Awaiting user approval to begin Ch 0.

**Instructions for next agent:** Read this entire park entry top to bottom. Tick each checkpoint as you absorb that section. Once ALL checkpoints are ticked, remove this park entry from LOG.md, note "Session resumed YYYY-MM-DD from parked Plan 01" in its place, and proceed with First Actions at the bottom.

---

### 1. Agent Rules

These emerged from user corrections during the session. They govern HOW you work.

- Research before implementing. Never guess at API behavior — web search or read docs first.
- Small, self-contained chapters. Each must be independently completable and testable.
- Don't go in circles. If an approach isn't working after one attempt, stop and tell the user.
- Never push to remote without explicit user command.
- Local testability is required. Every feature must work from localhost, not just production.
- When the user says "research", they mean web search — not guessing from training data.
- The user wants thorough plans reviewed before implementation. Don't rush to code.

- [x] **Checkpoint 1:** Agent rules absorbed. I will follow these throughout implementation.

---

### 2. Plan Files

Read these to understand what we're building and why.

- `.plans/01-vercel-showcase-deploy_2026-04-10/plan.md` — master plan with 6 decisions (D1-D6), 11 chapters + closing, dependency graph. This is the primary reference for the entire initiative.
- `.plans/01-vercel-showcase-deploy_2026-04-10/ch0-db-schema-deploy-module.md` — first chapter to implement. DB migration + Vercel API wrapper module.
- Skim remaining chapter files (ch1 through ch10, chC) for overall shape. Don't deep-read yet — each chapter is read when you reach it.

- [x] **Checkpoint 2:** Plan files read. I understand the 6 decisions, 11 chapters, and dependency graph.

---

### 3. Codebase State

Read these files to understand what exists now and what changes.

- `src/features/showcase-gallery/action.ts` — current upload/fetch/delete/update actions. New deploy columns must be added to all selects.
- `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` — current viewer. Has StackBlitz boot logic, IndexedDB cache, loading phases. ALL of this gets replaced by simple iframes (Ch 4) and removed (Ch 9).
- `src/platform/db/schema.ts` — current schema. `showcase_uploads` table needs `deploy_status` and `deploy_url` columns (Ch 0).
- `src/platform/db/migrations/meta/_journal.json` — last migration is `0005_add_showcase_thumbnail`. Next is `0006`.
- `src/platform/lib/auth.ts` — existing `jose` JWT patterns. Reuse for `showcase-token.ts` (Ch 3).
- `src/platform/lib/result.ts` — `Result<T, E>` pattern used by all server actions.
- `CLAUDE.md` — project conventions, tech stack, styling rules.
- `PROJECT_REFERENCE.md` — feature map and implementation status.

- [x] **Checkpoint 3:** Codebase files read. I know the current schema, action patterns, and viewer widget structure.

---

### 4. Uncommitted Work

Run `git status` to verify. The mass `skills/` deletions in git status are UNRELATED to this plan — ignore them.

| File | Status | What it is | Action needed |
|---|---|---|---|
| `ShowcaseViewerWidget.tsx` | Modified | StackBlitz loader improvements — removed fake loading phases, added iframe polling for fullscreen. **Potentially obsolete** since Ch 9 removes all StackBlitz code. | Ask user: commit as-is or revert? |
| `.plans/` | New (untracked) | Plan files created this session. Gitignored by convention. | Keep. No action. |
| `debug-skill-detail.ts` | New (untracked) | Leftover from earlier debugging. Not part of any plan. | Ask user: delete? |

**Production state:** Prod is deployed at `ai.ezycollect.tools`, running, no known critical issues. Debug API available via `x-debug-key` header (see CLAUDE.md for endpoints and key).

**Branch:** `main`

- [x] **Checkpoint 4:** Git status checked. I know what's uncommitted and what to ask the user about.

---

### 5. Research Findings

These came from web research and user discussion. They are NOT in the plan files. Each finding shaped a decision in the master plan.

**Why StackBlitz can't be fixed:**
- `sdk.embedProject()` creates a fresh, non-persisted WebContainer every call. No npm install caching between sessions exists — not in the SDK, not in WebContainers API, not via IndexedDB. (Source: StackBlitz SDK docs, WebContainers API docs, GitHub issues)
- IndexedDB caching only saves file extraction (~5s). The bottleneck is npm install (~25s), which reruns every time.

**Why alternatives don't work:**
- Sandpack 2.0 with Nodebox is SLOWER than StackBlitz for Next.js. CDN-cached dep resolution only helps simple React demos using the in-browser bundler, not Nodebox. (Source: Sandpack docs, CodeSandbox blog)
- `@webcontainer/api` direct: same no-persistence problem, plus requires commercial license for non-open-source use. (Source: StackBlitz pricing, npm license)
- Pre-building to static HTML on server: requires sandboxed containers (Docker/Firecracker) because `npm install` runs arbitrary postinstall scripts. Vercel serverless has read-only filesystem and timeout limits. Essentially building a PaaS. (Source: Vercel docs, OWASP)

**How Vercel Deployments API works:**
- `POST /v13/deployments` accepts `files` array and `target` field. Auth: `Authorization: Bearer <token>`.
- Files uploaded via `POST /v2/files` with SHA-based deduplication.
- Each deployment gets a unique `.vercel.app` URL.
- `target: "production"` or `target: "preview"` controls environment.
- Pro plan: unlimited deployments, 1TB bandwidth/month, 6K build minutes/month. No per-deployment cost.
- Deployments deleted via `DELETE /v13/deployments/{id}`.
- **Note:** Exact request body shapes need to be researched from current Vercel API docs when implementing Ch 0. Don't rely on training data for API contracts.

**How security works:**
- `Content-Security-Policy: frame-ancestors` is browser-enforced only. curl ignores it. Direct browser visits show blank. (Source: MDN)
- Edge Middleware does NOT run on `_next/static/*`, `_next/image/*`, `favicon.ico` unless explicitly matched. Static assets served from CDN edge directly. Acceptable — JS/CSS chunks are useless without the HTML shell. (Source: Vercel Middleware docs)
- JWT in URL query params leaks in browser history, server logs, Referer headers. Mitigate with short expiry (5 min). (Source: OWASP)
- Combined approach (middleware JWT + CSP frame-ancestors) is sufficient for internal tool security.

**How Vercel environments work:**
- 3 built-in: Production, Preview, Development.
- Each gets separate env vars in the dashboard.
- Decision D6: single showcase project, two envs. Production for prod uploads, Development for local dev. Per-env `ALLOWED_ORIGINS` and `JWT_SECRET`.

- [x] **Checkpoint 5:** Research findings absorbed. I understand why StackBlitz/Sandpack/WebContainers were rejected and how the Vercel API and security model work. I will research exact API request shapes fresh from docs when implementing.

---

### 6. Prerequisites (User Must Complete)

These are manual steps the user needs to do. The agent cannot do them. Ask the user which are done before starting implementation.

- [x] Create Vercel project `ai-centre-showcases` under the team's Vercel account
- [x] Generate API token (full account scope, Pro plan)
- [x] Set env vars on the showcase project:
  - Production: `ALLOWED_ORIGINS=https://ai.ezycollect.tools`, `JWT_SECRET=<set>`
  - Development: `ALLOWED_ORIGINS=http://localhost:3000`, `JWT_SECRET=<set>`
- [x] Set env vars on the main app (`.env.local` for dev, Vercel dashboard for prod):
  - `VERCEL_SHOWCASE_TOKEN=<set>`
  - `SHOWCASE_JWT_SECRET=<set>`
- [x] Confirm team has Vercel Pro plan (unlimited deployments)

- [x] **Checkpoint 6:** Prerequisites reviewed. I know which items to ask the user about.

---

### 7. First Actions

After all checkpoints are ticked and the park entry is replaced:

1. Ask user about uncommitted `ShowcaseViewerWidget.tsx` — commit as-is or revert?
2. Ask user about `debug-skill-detail.ts` — delete?
3. Confirm prerequisites checklist with user — which items are done?
4. Begin Ch 0: DB migration + Vercel deploy module

- [x] **Checkpoint 7:** First actions understood. Ready to begin.

# Plan 02: Flow-First Platform

**Status:** Complete
**Created:** 2026-04-13
**Completed:** 2026-04-17
**Depends on:** Plan 01 (Vercel Showcase Previews) — complete

---

## Scope

Transform AI Centre from a "download a ZIP" platform into a Flow-powered operating system for AI-assisted development. Users authenticate via OAuth, bootstrap projects through conversational skill matching, publish skills and showcases from their editor, and get shared infrastructure (Turso DB, file storage, email) for their projects. The web app becomes a gallery, marketplace, and admin panel.

## Context

**What exists now:** 60 skills in a filesystem library, toolkit composition system (4 layers, presets), project generation wizard that produces static ZIPs, showcase gallery with Vercel deploy pipeline, OTP auth, admin dashboard.

**What's being replaced:** Toolkit composition (`toolkit-composition.ts`, `archetypes.ts`), project generation wizard (`/generate`, `/toolkits`), static ZIP download model.

**What's being kept:** Skill library (`/skills`), showcase gallery (`/gallery`), admin dashboard, OTP auth (for web), deploy pipeline, all social features.

**End state:** Users download the Flow skill, run `flow-login`, run `flow-bootstrap` (conversational project setup with RAG skill matching), develop with Flow methodology, publish skills via `flow-skills publish`, publish showcases via `flow-showcase publish`. Server manages user workspaces with per-user Turso databases, blob storage, and email. Admin controls quotas.

---

## Decisions

### D1: Turso for user project databases

**Decision:** Use Turso (libSQL) for per-user project databases instead of Neon schemas.
**Rationale:** True DB-level isolation (each user gets their own database), generous free tier (500 DBs), Drizzle has first-class libSQL adapter, edge-compatible. SQLite dialect is sufficient for user showcase projects.
**Consequence:** Need Turso Platform API integration for database provisioning. Ref files must target SQLite dialect, not Postgres. Main app stays on Neon.

### D2: OAuth for CLI authentication

**Decision:** Browser-based OAuth with PKCE flow for CLI auth.
**Rationale:** Standard pattern used by Vercel CLI, GitHub CLI. Better UX than copy-pasting API keys. Secure — no secrets in .env files.
**Consequence:** Need OAuth endpoints on the server, a local callback server in the Flow skill, and token storage in `.flow/credentials.json` (gitignored).

### D3: In-memory embeddings for skill matching

**Decision:** Precompute embeddings for all skills at seed/publish time using Claude API, store in `skill_embeddings` DB table, load into memory at query time for cosine similarity search. No pgvector, no external vector DB.
**Rationale:** 60 skills is too small for pgvector overhead. In-memory cosine similarity over 60 vectors takes microseconds. Embeddings generated from skill metadata (name, description, when-to-use, when-not-to-use, purpose summary). Semantic matching needed because users describe projects in natural language during bootstrap.
**Consequence:** New `skill_embeddings` table with serialised float arrays. API endpoint loads all embeddings, computes similarity, returns ranked matches. Embeddings regenerated on skill publish/seed.

### D4: No merge on skill updates

**Decision:** When an official skill is updated and the user has local modifications, they choose: accept (overwrite) or reject (fork as unofficial user version, no more updates).
**Rationale:** Three-way merge is complex and error-prone for markdown files. Binary choice is clearer.
**Consequence:** Need to track per-user skill versions and "forked" status. Simpler implementation.

### D5: .flow/ directory for all Flow state

**Decision:** All Flow state lives under `.flow/` in the project root.
**Rationale:** Clean separation from project files. Single directory to gitignore credentials. Consistent across all projects.
**Consequence:** Move planning/log/park from `.plans/` to `.flow/plans/` for new projects. Existing `.plans/` in AI Centre itself stays (it's the platform's own plans, not a user project).

### D6: Vibe mode integrated into bootstrap

**Decision:** `flow-bootstrap` detects project type and automatically selects methodology (standard or vibe).
**Rationale:** No separate command needed. The conversation already determines what the user is building.
**Consequence:** Need vibe-mode plan templates. `.flow/project.json` records the mode. All flow commands adapt behaviour based on mode.

### D7: Mailpit for local email

**Decision:** Use Mailpit in Docker for local email simulation.
**Rationale:** Lightweight, active maintenance (unlike Mailhog), web UI for inspection, standard SMTP interface.
**Consequence:** Add Mailpit to docker-compose ref file. Ref files configure SMTP to localhost:1025.

### D8: Skill publishing limit

**Decision:** Default 10 community skills per user, admin-adjustable.
**Rationale:** Prevents spam, encourages quality. Admin can raise for active contributors.
**Consequence:** Need per-user quota tracking and enforcement on the server.

### D9: Schema limit

**Decision:** Default 2 Turso databases per user, admin-adjustable.
**Rationale:** Sufficient for most users (main project + side project). Admin can raise.
**Consequence:** Need per-user database tracking and provisioning limits.

---

## Chapters

This plan is structured as a phased rollout. Each chapter delivers a usable increment — either a working flow command, an API endpoint, or a UI feature. No backend-only chapters.

| Ch | Name | Tier | User can | Status |
|---|---|---|---|---|
| 0 | OAuth + Flow Login | Foundation | Run `flow-login`, browser opens, authenticate, token stored in `.flow/credentials.json` | Not started |
| 1 | User Workspace + Admin Quotas | New Capability | See per-user workspace quotas in admin dashboard, adjust limits | Not started |
| 2 | Flow Bootstrap | New Capability | Run `flow-bootstrap`, describe project, manually select skills, get `.flow/` + CLAUDE.md | Not started |
| 3 | RAG Skill Matching | Extension | Run `flow-bootstrap` and get AI-recommended skills based on project description | Done |
| 4 | Vibe Mode Templates | Extension | Bootstrap a creative project and get light methodology (DRAFT→REVIEW→REFINE→DELIVER) | **Done** |
| 5 | Skill Publishing | New Capability | Run `flow-skills publish`, see the skill appear in the web library | **Done** |
| 6 | Skill Rollback | Extension | Run `flow-skills rollback`, pick a previous version, see it restored | **Done** |
| 7 | Skill Update & Fork | New Capability | Run `flow-update`, see diffs for modified skills, accept or fork | **Done** |
| 8 | Showcase Publishing | New Capability | Run `flow-showcase publish`, see showcase in gallery with auto-detected skills | **Done** |
| 9 | Showcase Version History + Rollback | Extension | See version history on showcase page, rollback to a previous version | **Done** |
| 10 | Turso DB in Bootstrap | New Capability | Bootstrap a project needing a DB, get a working Turso connection via Drizzle | **Done** |
| 11 | Migration & Seed Ref Files | Extension | Run migrations and seeds in a bootstrapped project | **Done** |
| 12 | Email + Mailpit + Docker | New Capability | Bootstrap with email, run `docker compose up`, send test email via Mailpit | **Done** |
| 13 | OTP Auth Ref Files | Extension | Bootstrap with auth, log in via OTP locally | **Done** |
| 14 | File Storage Ref Files | Extension | Bootstrap with file storage, upload a file locally and to Vercel Blob | **Done** |
| 15 | Flow Status + Quotas | Extension | Run `flow-status` and see workspace info, quotas, project state | **Done** |
| 16 | Community Upvotes | New Capability | Upvote community skills, see skills ranked by popularity | **Done** |
| 17 | Remove Toolkit & Generate | Extension | No longer see `/toolkits` or `/generate` — homepage points to Flow | Not started |
| 18 | Showcase Migration | Extension | See existing showcases in the new versioned model | **Done** |
| C | Closing | — | — | **Done** |

### Chapter 0: OAuth + Flow Login
> [ch0-oauth-flow-login.md](ch0-oauth-flow-login.md)

**Tier:** Foundation
**User can:** Run `flow-login` in Claude Code, a browser opens to the authorize page, they approve, and a token is saved to `.flow/credentials.json`. `flow-logout` clears it.

Server-side OAuth endpoints: `/api/auth/authorize` (initiate), `/api/auth/callback` (exchange code for token), `/api/auth/token` (refresh). PKCE flow with code verifier/challenge. Tokens stored in `oauth_tokens` table. Works alongside existing OTP auth (same user/session model). Flow skill updated with `flow-login` (starts local HTTP server, opens browser, receives code, exchanges for token, stores in `.flow/credentials.json`) and `flow-logout` (clears token).

### Chapter 1: User Workspace + Admin Quotas
> [ch1-workspace-admin-quotas.md](ch1-workspace-admin-quotas.md)

**Tier:** New Capability
**User can:** Open the admin dashboard "Workspaces" tab, see per-user quota usage (skills published, databases, storage), and adjust limits.

Workspace quota columns on `users` table (or new `user_quotas` table): `skill_limit`, `schema_limit`, `storage_limit_bytes`, `email_limit_daily`. New `user_databases` table for Turso DB tracking. Workspace API endpoint `GET /api/workspace` returns usage vs limits. Admin tab "Workspaces" with editable limits per user. Uses existing admin layout pattern.

### Chapter 2: Flow Bootstrap
> [ch2-flow-bootstrap.md](ch2-flow-bootstrap.md)

**Tier:** New Capability
**User can:** Run `flow-bootstrap` in a new or existing directory. Flow asks what they're building, presents skills to choose from, downloads selected skills, creates `.flow/project.json` and `CLAUDE.md`.

Core Flow skill rewrite. Bootstrap conversation → detect new vs existing project → detect platform (Claude Code vs Chat) → for Chat: give skill recommendations as text → for Code: present skill list → user picks skills → download from API → create `.flow/` structure → create CLAUDE.md → detect methodology (standard vs vibe based on project type). Manual skill selection only — RAG added in Ch 3.

### Chapter 3: RAG Skill Matching
> [ch3-rag-skill-matching.md](ch3-rag-skill-matching.md)

**Tier:** Extension
**User can:** Run `flow-bootstrap`, describe their project in natural language, and get AI-recommended skills ranked by relevance.

New `skill_embeddings` table with serialised float arrays. Embedding generation at seed/publish time using Claude API (name, description, when-to-use, when-not-to-use, purpose summary → embed). Search endpoint `POST /api/skills/search` loads all embeddings into memory, embeds the query, computes cosine similarity, returns top-N matches. Bootstrap updated to call search API and present ranked recommendations instead of a flat list.

### Chapter 4: Vibe Mode Templates
> [ch4-vibe-mode-templates.md](ch4-vibe-mode-templates.md)

**Tier:** Extension
**User can:** Bootstrap a creative/content project (social post, brochure, presentation) and get light methodology templates (DRAFT → REVIEW → REFINE → DELIVER).

New plan templates: `plan-template-vibe.md`, `plan-template-vibe-visual.md`. Bootstrap conversation detects creative/content projects and selects vibe mode. `.flow/project.json` records `mode: "vibe"`. Flow commands adapt (no TDD, no strict planning).

### Chapter 5: Skill Publishing
> [ch5-skill-publishing.md](ch5-skill-publishing.md)

**Tier:** New Capability
**User can:** Run `flow-skills publish` in their editor, provide a commit message, and see the skill appear in the AI Centre web library under their name.

Extend `skill_versions` table with `commit_message`. Community skills concept — skills published by users (separate from official). 10-skill-per-user limit (from workspace quotas). API endpoints: `POST /api/skills/publish` (creates version), `GET /api/skills/:slug/versions` (version history). Flow skill `flow-skills publish` command: reads skill file, prompts for commit message, calls API, confirms success.

### Chapter 6: Skill Rollback
> [ch6-skill-rollback.md](ch6-skill-rollback.md)

**Tier:** Extension
**User can:** Run `flow-skills rollback`, see version history with commit messages, pick a version, and see the skill restored to that version.

API endpoint: `POST /api/skills/:slug/rollback` (creates new version from old content). Flow skill `flow-skills rollback` command: fetches version history, presents to user, user picks version, calls rollback API. Rollback creates a new version (append-only history).

### Chapter 7: Skill Update & Fork
> [ch7-skill-update-fork.md](ch7-skill-update-fork.md)

**Tier:** New Capability
**User can:** Run `flow-update`, see which skills have upstream updates, view diffs for modified skills, and choose to accept (overwrite) or fork (keep their version, stop updates).

API endpoint: `GET /api/skills/updates` returns skills with newer versions. Flow skill `flow-update` command: compares local checksums with server, shows diffs for modified skills, accept = overwrite local, reject = mark as forked in `.flow/project.json`. Forked skills excluded from future update checks. Also updates the Flow skill itself.

### Chapter 8: Showcase Publishing
> [ch8-showcase-publishing.md](ch8-showcase-publishing.md)

**Tier:** New Capability
**User can:** Run `flow-showcase publish`, provide a commit message, and see the showcase appear in the gallery with auto-detected skills.

New `showcase_versions` table: `showcase_id`, `version_number`, `blob_url`, `commit_message`, `created_at`. API endpoint: `POST /api/showcases/publish` (uploads HTML/ZIP, creates version, triggers deploy for ZIPs). Flow skill `flow-showcase publish` command: reads project output (HTML or zips project), prompts for commit message, auto-detects skills from `.flow/project.json`, calls API. Creates new showcase or new version if showcase already exists (matched by project identity).

### Chapter 9: Showcase Version History + Rollback
> [ch9-showcase-version-history.md](ch9-showcase-version-history.md)

**Tier:** Extension
**User can:** See version history with commit messages on the showcase viewer page, and rollback to a previous version.

Version history panel on showcase viewer: list of versions with commit messages, timestamps, "restore" button. Restore calls `POST /api/showcases/:id/rollback` which creates a new version from old blob URL and re-triggers deploy. `flow-showcase rollback` command: same flow from CLI.

### Chapter 10: Turso DB in Bootstrap
> [ch10-turso-db-bootstrap.md](ch10-turso-db-bootstrap.md)

**Tier:** New Capability
**User can:** Bootstrap a project that needs a database, get a Turso database provisioned, and connect to it with Drizzle.

Turso Platform API integration in `src/platform/lib/turso.ts`: create database, create auth token, delete database. API endpoint: `POST /api/workspace/databases` provisions DB, stores in `user_databases`, returns credentials. Quota enforcement (2 DBs default). Ref files: `db-turso-drizzle/references/` with drizzle.config.ts template and basic schema template. Bootstrap updated: if user needs a DB → provision via API → download ref files → write `.env.local` with Turso credentials.

### Chapter 11: Migration & Seed Ref Files
> [ch11-migration-seed-ref-files.md](ch11-migration-seed-ref-files.md)

**Tier:** Extension
**User can:** Run migrations to create tables and seed data in their bootstrapped Turso database.

Ref files for migration runner (adapted from current AI Centre pattern, targeting libSQL dialect), seed template with example data, and drizzle-kit config for `turso` dialect. Adds `npm run db:migrate` and `npm run db:seed` scripts to bootstrapped projects. User can run them and verify tables exist via Drizzle Studio.

### Chapter 12: Email + Mailpit + Docker
> [ch12-email-mailpit-docker.md](ch12-email-mailpit-docker.md)

**Tier:** New Capability
**User can:** Bootstrap a project with email, run `docker compose up` to start Mailpit, send a test email, and see it in the Mailpit web UI at localhost:8025.

Docker compose ref file with Mailpit service (SMTP on 1025, Web UI on 8025). Email abstraction layer ref file: Nodemailer → Mailpit in dev, Mailgun API in prod. `.env.local` template with Mailpit SMTP config. Bootstrap updated: if user needs email → download ref files → add to docker-compose.

### Chapter 13: OTP Auth Ref Files
> [ch13-otp-auth-ref-files.md](ch13-otp-auth-ref-files.md)

**Tier:** Extension
**User can:** Bootstrap a project with authentication, log in via OTP email locally (code appears in Mailpit).

Ref files adapted from current AI Centre auth: OTP generation/verification, JWT session management, auth middleware, login page template. Depends on email (Ch 12) for OTP delivery. Bootstrap updated: if user needs auth → download auth ref files.

### Chapter 14: File Storage Ref Files
> [ch14-file-storage-ref-files.md](ch14-file-storage-ref-files.md)

**Tier:** Extension
**User can:** Bootstrap a project with file storage, upload a file locally (to `public/uploads/`) and to Vercel Blob in prod.

Ref files for Vercel Blob integration, local filesystem fallback (same pattern as current AI Centre), upload API route template. Bootstrap updated: if user needs file storage → download ref files.

### Chapter 15: Flow Status + Quotas
> [ch15-flow-status-quotas.md](ch15-flow-status-quotas.md)

**Tier:** Extension
**User can:** Run `flow-status` and see workspace info (databases provisioned, storage used, skills published, quota remaining) alongside project state.

Extends `flow-status` command to call workspace API and display quota information. Shows project identity from `.flow/project.json`, linked databases, skills in use, mode (standard/vibe).

### Chapter 16: Community Upvotes
> [ch16-community-upvotes.md](ch16-community-upvotes.md)

**Tier:** New Capability
**User can:** Upvote community skills on the skill library page, see skills ranked by popularity.

Reuse existing `reactions` table (`entity_type = 'skill'`). Add upvote count to skill cards. Sort option: "Most popular". Upvote button on skill detail page. One upvote per user per skill.

### Chapter 17: Remove Toolkit & Generate
> [ch17-remove-toolkit-generate.md](ch17-remove-toolkit-generate.md)

**Tier:** Extension
**User can:** No longer see `/toolkits` or `/generate` routes. Homepage updated to point to Flow onboarding instructions.

Delete: `src/features/generate-project/`, `src/app/generate/`, `src/app/toolkits/`, `src/platform/lib/toolkit-composition.ts`, `src/platform/lib/archetypes.ts`, `src/platform/screens/Generate/`, `src/platform/screens/Toolkits/`, `src/features/archetypes/`. Update homepage to replace toolkit cards with Flow CTA. Drop `generated_projects` table (migration).

### Chapter 18: Showcase Migration
> [ch18-showcase-migration.md](ch18-showcase-migration.md)

**Tier:** Extension
**User can:** See existing showcases in the new versioned model with "Initial version" as commit message.

Migration script: for each existing showcase, create a `showcase_versions` row with `version_number: 1`, `commit_message: 'Initial version'`, existing `blob_url`. Update showcase queries to read from versions table.

### Closing
> [chC-closing.md](chC-closing.md)

Update PROJECT_REFERENCE.md, update LOG.md, validate both against the codebase. Pure documentation — no code changes.

---

## Dependency Graph

```
Ch 0 (OAuth + Login) [F]
  ├──→ Ch 1 (Workspace + Admin) [NC]
  │      └──→ Ch 10 (Turso DB) [NC] ──→ Ch 11 (Migration Refs) [E]
  │
  ├──→ Ch 2 (Bootstrap) [NC]
  │      ├──→ Ch 3 (RAG Matching) [E]
  │      ├──→ Ch 4 (Vibe Templates) [E]
  │      ├──→ Ch 10 (Turso DB) [NC]
  │      ├──→ Ch 12 (Email + Mailpit) [NC] ──→ Ch 13 (OTP Auth) [E]
  │      ├──→ Ch 14 (File Storage) [E]
  │      └──→ Ch 15 (Flow Status) [E]
  │
  ├──→ Ch 5 (Skill Publish) [NC]
  │      ├──→ Ch 6 (Skill Rollback) [E]
  │      └──→ Ch 7 (Update & Fork) [NC]
  │
  └──→ Ch 8 (Showcase Publish) [NC]
         └──→ Ch 9 (Version History + Rollback) [E]
                └──→ Ch 18 (Showcase Migration) [E]

Ch 16 (Upvotes) [NC] — standalone
Ch 17 (Remove Toolkit) [E] — depends on Ch 2 being proven
```

[F] = Foundation  [NC] = New Capability  [E] = Extension

---

## E2E Journey

```gherkin
Rule: Users can authenticate, bootstrap projects, publish skills and showcases

  Background:
    Given a user with an ezyCollect email account
    And the AI Centre is running

  Scenario: Full Flow lifecycle
    # ── Ch 0: Authentication ──
    When the user runs flow-login
    Then a browser opens to the OAuth authorize page
    And after approving, a token is stored in .flow/credentials.json

    # ── Ch 2: Bootstrap ──
    When the user runs flow-bootstrap in a new directory
    And describes "I want to build a credit application dashboard"
    Then Flow presents skills to choose from
    And selected skills are downloaded to the project
    And .flow/project.json is created with project identity
    And CLAUDE.md is generated with the selected skills

    # ── Ch 3: RAG enhancement ──
    When the user runs flow-bootstrap in another directory
    And describes their project
    Then Flow recommends relevant skills ranked by relevance
    And the user confirms the selection

    # ── Ch 5: Skill publish ──
    When the user creates a new skill and runs flow-skills publish
    Then the skill is published to AI Centre under their name
    And the version has a commit message

    # ── Ch 6: Skill rollback ──
    When the user runs flow-skills rollback
    Then they see version history and can restore a previous version

    # ── Ch 7: Skill update ──
    When an official skill is updated and the user has modified it locally
    And the user runs flow-update
    Then they see the diff and choose to accept or fork

    # ── Ch 8: Showcase publish ──
    When the user runs flow-showcase publish
    Then the showcase is published with auto-detected skills
    And it appears in the gallery

    # ── Ch 15: Status ──
    When the user runs flow-status
    Then they see their workspace quotas and project state
```

---

## Not in Scope

- **Billing/payments** — internal tool, company covers costs
- **Skill review/approval workflow** — community skills publish immediately, official skills managed by admins
- **Multi-user collaboration** — each project is single-user
- **Real-time sync** — skills and showcases are versioned, not live-synced
- **Mobile app** — web + CLI only
- **Teardown command** — users move on, resources stay until admin cleanup
- **Chat integration** — Claude Chat gets read-only skill recommendations only, no commands

---

## Closing Methodology

```
STEP 0 — DIFF ANALYSIS subagent

  Compare what was PLANNED vs what was ACTUALLY built.
  Read: LOG.md chapter summaries, git log, plan decisions.
  Produce: diff report (as-planned, changed, discovered).

STEP 1 — PROJECT REFERENCE UPDATER subagent (receives diff report)
STEP 2 — LOG UPDATER subagent (receives diff report)

  Steps 1 + 2 run in parallel. Update from codebase, not plan.

STEP 3 — VALIDATOR subagent

  Cross-reference both docs against actual codebase.
  If corrections needed -> fix -> re-validate.

Done when validator confirms both docs match the codebase.
```

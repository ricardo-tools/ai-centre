---
name: flow
description: Core workflow router for human-AI paired work. Defines phases (PLANNING, IMPLEMENTATION, POST-DELIVERY), safety guardrails, and session commands. Does not define HOW to implement — plan templates define methodology.
---

# Flow

Workflow router. Defines phases, hooks, and safety guardrails. Plan templates define methodology. Opinion skills define specifics.

## Tone

Be conversational but purposeful. You're a collaborator, not a command executor — talk like a teammate who's invested in the outcome.

- **Match the user's energy.** If they're joking around, play along briefly, then steer back. If they're heads-down, be direct.
- **Be helpful, not obedient.** Sometimes helpful means doing exactly what was asked. Sometimes it means pushing back — "that'll work, but here's why X might bite you later." Read the context. A bad idea delivered compliantly is not helpful.
- **Challenge when it matters.** If a decision has real consequences (architecture, security, data loss, tech debt), say so plainly. Don't bury concerns in caveats. Don't challenge for sport — only when you'd genuinely advise a colleague differently.
- **Keep it brief.** One good sentence beats three okay ones. Don't narrate your process unless the user asks.
- **Stay grounded.** Always come back to: what are we building today?

## Workflow Phases

```
PLANNING
  └─ flow-plan (create plan under .plans/, pick template, structure chapters)
  └─ flow-plan-log (READ .plans/LOG.md — understand where we are)
  └─ flow-project-reference (READ — understand what exists)

IMPLEMENTATION
  └─ Follow the active plan template (e.g. PLAN_TEMPLATE_DEV.md)
  └─ The template defines the methodology (testing, EDD, design gates)
  └─ flow does NOT prescribe implementation steps — the template does

POST-DELIVERY — after each chapter:
  └─ flow-plan-log (UPDATE: mark chapter complete, update infrastructure state)

POST-DELIVERY — after all chapters in a plan:
  └─ flow-plan-log (WRITE: full plan outcomes, decisions, capabilities)
  └─ flow-project-reference (WRITE: update feature map and status)
  └─ flow-project-docs (WRITE: update docs if applicable)
  └─ flow-strategic-context (checkpoint decisions for future sessions)
```

Principle: **read during planning, write after delivery.** Never update docs mid-implementation.

---

## When to Use

Apply on every task that changes code, configuration, or documentation.

Do NOT use for:
- Pure conversation or questions with no deliverable
- Tasks the user explicitly says "just do it, no planning needed"

---

## Safety Guardrails

Always active regardless of template or opinions.

### 1. Plan before acting

Enter plan mode before writing code. Explore the codebase, design the approach, present for user approval. Never start implementation without an approved plan.

Exception: trivially small tasks where the user says "just do it."

### 2. Never take destructive or visible actions without authorisation

Ask before: `git commit`, `git push`, deleting files or branches, modifying production config, deploying, running destructive database operations.

No exceptions. No assumptions from prior approvals — each action needs fresh consent.

### 3. Proportional to request size

- One-line fix → one-line answer, no plan needed
- Bug with clear cause → minimal research, fix + test
- New feature → full plan with chapters, research, test scenarios
- Architecture decision → deep research, comparison tables, trade-off analysis

---

## Available Opinions

Activated per project in CLAUDE.md.

| Opinion | Purpose |
|---|---|
| **flow-plan** | Plan structure under `.plans/`, template selection, mandatory pre-plan research |
| **flow-plan-log** | Maintain `.plans/LOG.md` execution log |
| **flow-tdd** | Testing: Gherkin scenarios, data isolation, what to test where, hardening |
| **flow-eval-driven** | EDD: run the app via Playwright headless, screenshots, logs, vision |
| **flow-research** | Structured research with CRAAP-tested sources |
| **flow-planning** | Full planning cycle: triage, research, debate, plan review |
| **flow-observability** | Server log API, structured logging, diagnostics |
| **flow-project-reference** | Maintain PROJECT_REFERENCE.md |
| **flow-project-docs** | Maintain docs route in webapp |
| **flow-strategic-context** | Checkpoint decisions for future sessions |

---

## Commands

Usage: `/flow <action>` — where action is one of: `continue`, `plan`, `status`, `research`, `audit`, `park`, `execute-plan`, `bootstrap`, `login`, `logout`, `publish`, `rollback`, `update`, `showcase`, `share`.

If no action is given, list the available actions with a one-line description of each.

---

### `/flow continue`

**Trigger:** Start of session, or user types `/flow continue`.

**Flow:**

1. Read `.plans/LOG.md`.
2. Check for a `## Parked Session` block. If present:
   a. Read the ENTIRE park entry top to bottom — all 7 sections.
   b. For each section, absorb the content into your working context and **tick its checkpoint** in LOG.md immediately. Do not defer — tick each checkbox as you finish reading that section.
   c. After all 7 checkpoints are ticked, output a **status report** to the user:
      ```
      ## Session Resumed
      **Plan:** [plan name]
      **Position:** [where we're picking up]
      **Context loaded:**
      - [x] Agent rules (N rules)
      - [x] Plan files ([which ones read])
      - [x] Codebase state ([which files read])
      - [x] Uncommitted work ([summary])
      - [x] Session context ([N findings, N rejected approaches])
      - [x] Prerequisites ([N done, N pending])
      - [x] First actions ([what we'll do first])

      **Questions for you before I start:**
      - [Any items marked "ask user" in the park]
      - [Any unchecked prerequisites]

      **Ready to begin:** [first action after questions are resolved]
      ```
   d. Wait for user confirmation before proceeding.
   e. **Archive the park entry:** copy the entire `## Parked Session` block to `.plans/.park/park-YYYY-MM-DD-HHMMSS.md` as a backup.
   f. **Replace the park entry in LOG.md** with a single line:
      `**Session resumed YYYY-MM-DD from parked [plan name].** Archive: .plans/.park/park-YYYY-MM-DD-HHMMSS.md`
   g. Proceed with first actions.
3. If no park entry:
   - Read the next chapter's plan file (referenced in LOG.md).
   - Extract the methodology from the chapter.
   - Output a status report: current state, next chapter, what you will do.
   - Begin execution.

**Important:** ALWAYS output a status report before doing any work. The user must see what context was loaded and confirm before implementation begins.

**References:** `flow-plan-log`, `flow-planning/references/park-template.md`

**Done when:** The agent has oriented, reported status to the user, received confirmation, and begun executing.

---

### `/flow plan <topic>`

**Trigger:** User types `/flow plan <topic>` or asks to plan work.

**Flow:**

1. Determine plan type and select the appropriate template:
   - **Dev** (`plan-template-dev.md`) — changes affecting the production application (features, schema, UI, API endpoints, auth). Full methodology: TEST → BUILD → EVAL → RUN → AUDIT → LOG.
   - **Tooling** (`plan-template-tooling.md`) — changes to development infrastructure (CI, testing setup, skills, process, developer tooling).
   - **Vibe** (`plan-template-vibe.md`) — creative/content projects (copy, messaging, email sequences, blog posts, content strategy). Light methodology: DRAFT → REVIEW → REFINE → DELIVER.
   - **Vibe Visual** (`plan-template-vibe-visual.md`) — design-forward projects (presentations, brochures, posters, brand assets, pitch decks, social graphics). Adds design gates to vibe methodology.
   If ambiguous, ask the user. If the project is creative with no code, default to vibe or vibe-visual based on whether the deliverable is primarily text or visual.
2. Execute the `flow-planning` methodology:
   - Triage topics into complexity tiers.
   - Dispatch research agents per `flow-research`.
   - Run debate rounds between research agents.
   - Produce a plan through the 3-cycle plan review.
3. Write the plan file to `.plans/`. Plan file naming follows existing convention: `.plans/NN-slug_YYYY-MM-DD/chN.N-slug.md`. The coordinator determines the next plan/chapter number from LOG.md.
4. Report to user: plan summary, chapter count, scenario count, ready for execution.

**References:** `flow-planning`, `flow-research`

**Done when:** A plan file exists under `.plans/`, the user has reviewed and approved it, and execution can begin with `/flow continue`.

---

### `/flow status`

**Trigger:** User types `/flow status` mid-session.

**Flow:**

1. Read `.flow/project.json` for local state: project name, mode (standard/vibe/vibe-visual), installed skills.
2. Read `.plans/LOG.md`.
3. Check for a `## Parked Session` block. If present:
   - Report the parked state: plan, position, what was done, what's pending.
   - Note which checkpoints have been ticked (if resumption is in progress).
   - Report any unchecked prerequisites.
4. If no park entry:
   - Check current todo list for in-progress items. If no todos exist, report based on LOG.md and session memory.
5. Report a human-optimised summary:
   - Project name, mode, installed skill count.
   - Current plan, chapter, and step in the methodology pipeline.
   - What has been completed this session.
   - What is next.
   - Test counts from the most recent test runner output this session, or from LOG.md if no tests have run this session.
   - Any blockers or pending prerequisites.
6. **Workspace info** (if `.flow/credentials.json` exists):
   - GET `https://ai.ezycollect.tools/api/workspace` with Bearer token.
   - Report: skills published (used/limit), databases (used/limit), storage (used/limit).
   - If quota is at limit, highlight it.
   - If not authenticated: show "Workspace: not connected — run `/flow login` for workspace info."
   - If API unreachable: show "Could not reach AI Centre."

**References:** `flow-plan-log`

**Done when:** A concise, human-readable summary has been reported to the user. No side effects — this is read-only.

---

### `/flow research <topic>`

**Trigger:** User types `/flow research <topic>` or asks to research something outside a planning cycle.

**Flow:**

1. Triage complexity (Simple / Moderate / Complex) using the triage rules from `flow-planning`. The coordinator triages directly for standalone research (no triage subagent — the overhead is not warranted for a single topic).
2. Execute the `flow-research` methodology at the appropriate intensity:
   - **Simple:** 1 research agent, return findings directly.
   - **Moderate:** 2 research agents (split by knowledge base), 1 debate round.
   - **Complex:** 2 research agents, 2+ debate rounds.
3. Report findings to user with sources and confidence levels. Confidence: High (multiple corroborating sources, well-established pattern), Medium (fewer sources or minor conflicts, but viable), Low (limited sources, speculative).

**References:** `flow-research`, `flow-planning` (triage and debate rules)

**Done when:** Findings have been reported to the user with sources. No plan file is created — this is standalone research.

---

### `/flow audit [scope]`

**Trigger:** User types `/flow audit` or asks to audit current work.

**Flow:**

1. Determine scope: current chapter (default), specific files, or full project. Current chapter scope = all files listed in the chapter's Critical Files tables. If unavailable, all files changed since the chapter started (via `git diff`).
2. Dispatch parallel audit subagents, one per gate:
   - Observability (`flow-observability`)
   - Security
   - Accessibility
   - Code Quality
   - UX (if UI work is in scope)
   - Design and Brand (if UI work is in scope)
   - Performance (if applicable)
3. Collect findings and report to user.
4. User decides whether to fix now or defer. The command does not auto-fix.

**References:** `flow-observability`, `flow-eval-driven`, `flow-tdd`. For gate-specific checklists beyond Observability, see the audit gates in `plan-template-dev.md` Step 6.

**Done when:** All applicable audit gates have reported findings. The user has been presented with results and has decided on next steps.

---

### `/flow park`

**Trigger:** User types `/flow park` or says they're ending the session.

**Flow:**

1. Run `git status` to inventory all uncommitted changes.
2. Read `flow-planning/references/park-template.md` for the park entry structure.
3. Write the park entry to `.plans/LOG.md` using ALL 7 sections from the template:
   - **1. Agent Rules** — behavioral corrections from user during this session (not things already in CLAUDE.md)
   - **2. Plan Files** — pointers with one-line descriptions and read/skim guidance
   - **3. Codebase State** — files the next agent must read, with context on what's changing
   - **4. Uncommitted Work** — every uncommitted file with what it is and action needed (commit/revert/ask)
   - **5. Session Context** — research findings (FINDING/SOURCE/IMPLICATION), discussion outcomes, rejected approaches with evidence. This is the most important section — it captures knowledge from conversations that doesn't exist in any file.
   - **6. Prerequisites** — manual steps the user must complete before implementation (omit if none)
   - **7. First Actions** — ordered steps for the next agent
4. Include a checkpoint (`- [ ] **Checkpoint N:**`) at the end of each section.
5. Print a summary to the user:
   - What was done this session
   - Where work will resume
   - Any warnings (uncommitted changes, pending prerequisites)
   - Reminder of items the user needs to complete before next session

**References:** `flow-planning/references/park-template.md`, `flow-plan-log`, `flow-strategic-context`

**Done when:** The park entry is written to LOG.md with all 7 sections and checkpoints, and the user has seen the summary. The next session's `/flow continue` will consume this entry.

---

### `/flow execute-plan [plan-ref] [instructions]`

**Trigger:** User types `/flow execute-plan` or says "implement all chapters" / "execute the plan".

**Flow:**

1. Determine scope:
   - If `plan-ref` is a specific plan (e.g. `01`, `plan.md` path): execute that plan.
   - If `plan-ref` is `all`: execute all plans with status "Not started" or partially complete, in dependency order.
   - If omitted: execute the current active plan from LOG.md.
2. Read the plan's master file and LOG.md to determine which chapters are pending.
3. For each pending chapter, in dependency order:
   a. Read the chapter file.
   b. **Dispatch one subagent** to implement the chapter. Always one subagent per chapter — no exceptions. The subagent receives the full chapter file, relevant codebase context, and follows whatever methodology the chapter defines.
   c. When the subagent completes, verify the output (types, tests, build).
   d. Update LOG.md: mark chapter done, record notes.
   e. Update `plan.md`: mark chapter status.
   f. Proceed to the next chapter.
4. If `instructions` are provided (e.g. "skip tests", "only chapters 0-3"), apply them. Instructions override default behaviour but not safety guardrails.
5. After all chapters complete, execute the closing chapter if one exists.

**Important:** "Execute all" does NOT mean rush or skip process. It means iterate one by one, following whatever methodology each chapter defines. The plan IS the process — just execute it.

**References:** `flow-plan-log`

**Done when:** All targeted chapters are complete, LOG.md is updated, and plan status reflects the new state.

---

### `/flow bootstrap`

**Trigger:** User types `/flow bootstrap` or asks to set up a new project with Flow.

**Flow:**

1. Check if `.flow/credentials.json` exists. If not, silently run the `/flow login` flow first (set up auth files, open browser, wait for tokens). Do not ask — just do it. Once authenticated, continue.
2. Check if `.flow/project.json` exists — if yes, ask "Update existing project?"
3. Ask: "What are you building? Describe your project in a sentence or two."
4. Detect project mode from the user's description:
   - **standard** — code, features, APIs, infrastructure, anything that ships as software
   - **vibe** — content, copy, messaging, email, blog, content strategy
   - **vibe-visual** — presentations, brochures, design assets, graphics, pitch decks
   Record `mode` in `.flow/project.json`. If ambiguous, ask the user.
5. Call the skill search endpoint with the user's description:
   `POST https://ai.ezycollect.tools/api/skills/search` with body `{ "query": "<user description>" }`.
   Present the ranked recommendations (slug, name, description, score) as the primary selection list. Pre-select the top 3–5. Offer "Show all" which then falls back to `GET https://ai.ezycollect.tools/api/skills/catalog` for the full flat list.
6. User selects which skills to include (from ranked recs or the full catalog).
7. For each selected skill, download content: `GET https://ai.ezycollect.tools/api/skills/{slug}/content`.
8. Create `.flow/` directory structure:
   - `.flow/project.json` — project metadata + selected skills + `mode` (standard/vibe/vibe-visual) with versions and checksums
   - `.flow/plans/` — empty directory for future plans
9. Write each skill's content to `.claude/skills/{slug}/SKILL.md`, plus any references to `.claude/skills/{slug}/references/`.
10. Generate `CLAUDE.md` from selected skills — each skill gets an `> Apply the **{name}** skill` directive.
11. Add `.flow/credentials.json` to `.gitignore` if not already present.
12. **Database provisioning:** If the user's project needs a database (they mention "database", "data storage", "persistence", "users table", "CRUD", or `db-turso-drizzle` is among selected skills):
    a. Call `POST https://ai.ezycollect.tools/api/workspace/databases` with Bearer token and body `{ "name": "<project-slug>" }`.
    b. If successful, write the returned `dbUrl` and `authToken` to the project's `.env.local`:
       ```
       DATABASE_URL=<dbUrl>
       DATABASE_AUTH_TOKEN=<authToken>
       ```
    c. Ensure `db-turso-drizzle` is in the selected skills (add it if not already).
    d. Read `skills/db-turso-drizzle/references/templates.md` and copy the template files (`drizzle.config.ts`, `src/db/client.ts`, `src/db/schema.ts`) into the project.
    e. Read `skills/db-turso-drizzle/references/migrations.md` and copy the migration runner (`src/db/migrate.ts`) and seed template (`src/db/seed.ts`) into the project.
    f. Add `@libsql/client` and `drizzle-orm` to dependencies, `drizzle-kit`, `tsx`, and `dotenv` to devDependencies.
    g. Add the `db:generate`, `db:migrate`, `db:seed`, `db:studio` scripts to the project's `package.json` (see `migrations.md`).
    h. If provisioning returns 503 (not configured), inform the user that database provisioning is not yet available and they can set up Turso manually using the `db-turso-drizzle` skill templates.
    i. If provisioning returns 429 (quota exceeded), inform the user of their limit and suggest contacting admin.

**Do not** ask the user about environment URLs, auth prerequisites, or implementation details. Just execute the flow — handle errors as they come. **Never** suggest localhost, local dev, or alternative URLs. The production URL `https://ai.ezycollect.tools` is the only endpoint — there is no local option. If login is denied, tell the user that authorization is required to access the workspace and skill library, and offer to retry. Do not suggest workarounds.

13. **Email setup:** If the user's project needs email (they mention "email", "notifications", "OTP", "transactional email", or `email-mailpit` is among selected skills):
    a. Ensure `email-mailpit` is in the selected skills (add it if not already).
    b. Read `skills/email-mailpit/references/templates.md` and copy: `docker-compose.yml` (or add Mailpit service to existing one), `src/lib/email.ts`, `.env.local` email vars.
    c. Add `nodemailer` to dependencies, `@types/nodemailer` to devDependencies.

14. **Auth setup:** If the user's project needs authentication (they mention "login", "auth", "users", "sign in", or `auth-otp` is among selected skills):
    a. Ensure `auth-otp` is in the selected skills (add it if not already). Also ensure `email-mailpit` and `db-turso-drizzle` are included (auth depends on both).
    b. Read `skills/auth-otp/references/templates.md` and copy: `src/lib/auth.ts`, `src/lib/otp.ts`, `src/middleware.ts`, `src/app/login/page.tsx`, API routes, schema additions.
    c. Add `jose` to dependencies.
    d. Add `AUTH_SECRET` to `.env.local`.
    e. Remind user to run `npm run db:generate && npm run db:migrate` to create the auth tables.

**Do not** ask the user about environment URLs, auth prerequisites, or implementation details. Just execute the flow — handle errors as they come. **Never** suggest localhost, local dev, or alternative URLs. The production URL `https://ai.ezycollect.tools` is the only endpoint — there is no local option. If login is denied, tell the user that authorization is required to access the workspace and skill library, and offer to retry. Do not suggest workarounds.

15. **File storage setup:** If the user's project needs file uploads (they mention "upload", "files", "images", "storage", or `storage-vercel-blob` is among selected skills):
    a. Ensure `storage-vercel-blob` is in the selected skills (add it if not already).
    b. Read `skills/storage-vercel-blob/references/templates.md` and copy: `src/lib/storage.ts`, `src/app/api/upload/route.ts`.
    c. Add `@vercel/blob` to dependencies.
    d. Add `public/uploads/` to `.gitignore`.

**References:** `skills/flow/references/auth-client.md`, `skills/db-turso-drizzle/references/templates.md`, `skills/db-turso-drizzle/references/migrations.md`, `skills/email-mailpit/references/templates.md`, `skills/auth-otp/references/templates.md`, `skills/storage-vercel-blob/references/templates.md`

**Done when:** `.flow/project.json` exists, selected skills are downloaded, `CLAUDE.md` is generated, infrastructure provisioned/configured as needed (DB, email, auth, storage), and the user sees a summary of what was created.

---

### `/flow login`

**Trigger:** User types `/flow login` or asks to authenticate with AI Centre.

**Flow:**

1. Read `skills/flow/references/login-client.md` — this contains the complete PKCE login implementation.
2. Copy the code to `.flow/lib/login.ts` in the user's project.
3. Also ensure `.flow/lib/auth.ts` exists (from `skills/flow/references/auth-client.md`) — the login module depends on it.
4. Run the login flow: opens browser → user completes OTP → tokens saved to `.flow/credentials.json`.

**References:** `skills/flow/references/login-client.md`, `skills/flow/references/auth-client.md`

**Done when:** `.flow/credentials.json` exists with valid tokens and the user sees "Successfully authenticated!"

---

### `/flow logout`

**Trigger:** User types `/flow logout` or asks to log out of AI Centre.

**Flow:**

1. Read `skills/flow/references/logout-client.md` — this contains the complete logout implementation.
2. Copy the code to `.flow/lib/logout.ts` in the user's project.
3. Run the logout flow: revokes refresh token on server, deletes `.flow/credentials.json`.

**References:** `skills/flow/references/logout-client.md`, `skills/flow/references/auth-client.md`

**Done when:** `.flow/credentials.json` is deleted and the server token is revoked.

---

### `/flow publish`

**Trigger:** User types `/flow publish` or asks to publish a skill to AI Centre.

**Flow:**

1. Check if `.flow/credentials.json` exists. If not, run `/flow login` first.
2. Ask: "Which skill do you want to publish?" List skills found in `.claude/skills/` (excluding `flow` itself).
3. Read the skill's `SKILL.md` file and parse frontmatter (name, description).
4. Ask for a commit message: "What changed in this version?"
5. POST `https://ai.ezycollect.tools/api/skills/publish` with Bearer token and body:
   ```json
   { "slug": "<dir-name>", "name": "<from frontmatter>", "description": "<from frontmatter>", "content": "<full file content>", "commitMessage": "<user input>" }
   ```
6. On success: report "Published {name} v{version}".
7. On 429 (quota exceeded): report the quota message from the server.
8. On 401: token may be expired — run `/flow login` and retry once.

**Do not** publish the `flow` skill itself or any `flow-*` skills — those are platform skills, not user content.

**Done when:** The server confirms the skill was published and the user sees the version number.

---

### `/flow rollback`

**Trigger:** User types `/flow rollback` or asks to roll back a published skill.

**Flow:**

1. Check if `.flow/credentials.json` exists. If not, run `/flow login` first.
2. Ask: "Which skill do you want to roll back?" List the user's published skills.
3. GET `https://ai.ezycollect.tools/api/skills/community/{slug}/versions?userId={userId}` with Bearer token.
4. Present version history with commit messages and dates.
5. User picks a version to restore.
6. POST `https://ai.ezycollect.tools/api/skills/community/{slug}/rollback` with Bearer token and body: `{ "targetVersion": <number> }`.
7. On success: report "Restored {name} to v{target} (now v{new})".
8. On 404: version doesn't exist or skill not found.
9. On 400 (only one version): inform user there's nothing to roll back to.

Rollback is **append-only** — it creates a new version with the old content. No history is deleted.

**Done when:** The server confirms the rollback and the user sees the new version number.

---

### `/flow update`

**Trigger:** User types `/flow update` or asks to check for skill updates.

**Flow:**

1. Check if `.flow/credentials.json` exists. If not, run `/flow login` first.
2. Read `.flow/project.json` for installed skills (slug, version, checksum, forked flag).
3. Filter out forked skills — they don't receive updates.
4. POST `https://ai.ezycollect.tools/api/skills/updates` with Bearer token and body:
   `{ "skills": [{ "slug": "...", "version": "...", "checksum": "..." }] }`
5. For each skill with updates:
   - **No local changes**: auto-update — download new content via `/api/skills/{slug}/content`, overwrite `.claude/skills/{slug}/SKILL.md` + references, update `project.json`.
   - **Local changes detected** (checksum mismatch): show the user what changed and ask:
     - **Accept** → overwrite local with upstream, update version + checksum
     - **Fork** → mark `forked: true` in `project.json`, stop future updates for this skill
6. If all skills are current: "Everything is up to date."
7. If a skill was removed from the catalog: warn the user but don't delete local files.

**Do not** attempt three-way merge. Binary choice: accept or fork.

**Done when:** All non-forked skills are at latest version, or user has made accept/fork decisions.

---

### `/flow showcase`

**Trigger:** User types `/flow showcase` or asks to publish a showcase.

**Flow:**

1. Check if `.flow/credentials.json` exists. If not, run `/flow login` first.
2. Detect output type:
   - Single `.html` file → read it directly.
   - Project directory with built output → ZIP it.
3. Read `.flow/project.json` for skill associations (if present).
4. Ask for a title (first time only) and commit message.
5. POST `https://ai.ezycollect.tools/api/showcases/publish` as FormData with Bearer token:
   - `file`: the HTML or ZIP file
   - `title`: showcase title
   - `description`: optional
   - `commitMessage`: what changed
   - `skillSlugs`: JSON array from project.json (optional)
   - `projectId`: from project.json (optional, for re-publish detection)
6. On success: report "Published {title} v{version}".
7. ZIPs are auto-deployed to the Vercel showcase project. HTML showcases are viewable immediately.

**Done when:** The server confirms the showcase was published and the user sees the version number.

---

### `/flow share`

**Trigger:** User types `/flow share` or asks to share a showcase or skill.

**Flow:**

1. Check if `.flow/credentials.json` exists. If not, run `/flow login` first.
2. Ask: "What do you want to share?" Identify the resource:
   - A showcase by title or ID
   - A published community skill by slug
3. Ask: "How do you want to share it?"
   - **With a specific person** → ask for their email/userId, then choose permissions:
     - Can view (default: yes)
     - Can download (default: no)
     - Can reshare (default: no)
   - **With a link** → choose permissions + optional expiry (default: 7 days)
4. For named user sharing:
   POST `https://ai.ezycollect.tools/api/shares` with Bearer token and body:
   `{ "resourceType": "showcase"|"skill", "resourceId": "...", "granteeUserId": "...", "canView": true, "canDownload": false, "canShare": false }`
5. For link sharing:
   POST `https://ai.ezycollect.tools/api/shares/link` with Bearer token and body:
   `{ "resourceType": "...", "resourceId": "...", "canView": true, "canDownload": false, "canShare": false, "expiresInHours": 168 }`
   → Returns a signed token. Build the share URL: `https://ai.ezycollect.tools/shared?token={token}`
6. Report: "Shared with {user}" or "Share link created (expires in 7 days): {url}"

To **revoke** access: DELETE `/api/shares` (named user) or DELETE `/api/shares/link` (link).

To **list** who has access: GET `/api/shares?resourceType=...&resourceId=...`

**Done when:** The share is confirmed and the user has the link or confirmation of the named share.

---

## Banned Patterns

- Starting implementation without a plan → plan first
- Committing or pushing without asking → always request authorisation
- Over-planning one-liners → proportional response
- Updating docs mid-implementation → write after delivery
- Prescribing implementation methodology in this skill → that belongs in the plan template
- Writing a park entry without the full template structure → use all 7 sections
- Skipping the status report on `/flow continue` → always report before acting

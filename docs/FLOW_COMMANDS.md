# Flow Commands Reference

All commands are invoked via `/flow <action>` in Claude Code.

---

## Session & Planning

### `/flow continue`

Resume work from where you left off. Reads `.plans/LOG.md` for parked sessions or active plans.

**What happens:**
1. Checks for a parked session → restores all 7 context sections
2. No park → reads next chapter plan, reports status
3. Always shows a status report before doing anything

**When to use:** Start of any session, or after a break.

---

### `/flow plan <topic>`

Create a structured plan for upcoming work.

**Templates auto-selected by project type:**
- **Dev** → TEST → BUILD → EVAL → RUN → AUDIT → LOG
- **Tooling** → infrastructure/CI changes
- **Vibe** → DRAFT → REVIEW → REFINE → DELIVER (content/copy)
- **Vibe Visual** → design gates + visual hierarchy (presentations, graphics)

**What happens:**
1. Triages complexity (simple/moderate/complex)
2. Dispatches research agents
3. Runs debate rounds
4. Produces chapter plan under `.plans/`

**When to use:** Before any non-trivial work.

---

### `/flow status`

See where you are — project state + workspace quotas.

**Shows:**
- Project name, mode, installed skills
- Current plan/chapter/step
- What's done this session, what's next
- Workspace: skills published (used/limit), databases (used/limit), storage (used/limit)
- If not authenticated: "Run /flow login for workspace info"

---

### `/flow park`

End a session cleanly. Saves full context for the next session.

**Saves 7 sections:**
1. Agent rules (behavioral corrections this session)
2. Plan files (pointers + descriptions)
3. Codebase state (files to read next time)
4. Uncommitted work (every file + action needed)
5. Session context (findings, rejected approaches)
6. Prerequisites (manual steps for user)
7. First actions (ordered steps for next agent)

---

### `/flow execute-plan [plan-ref] [instructions]`

Implement an entire plan chapter by chapter.

**Options:**
- No args → execute current active plan
- `01` → execute plan 01
- `all` → execute all pending plans
- `"only chapters 0-3"` → partial execution

Each chapter dispatched to a subagent following its methodology.

---

## Research & Quality

### `/flow research <topic>`

Standalone research outside a planning cycle.

**Intensity scales to complexity:**
- Simple → 1 agent, direct findings
- Moderate → 2 agents, 1 debate round
- Complex → 2+ agents, 2+ debate rounds

Returns findings with sources and confidence levels (High/Medium/Low).

---

### `/flow audit [scope]`

Audit current work against quality gates.

**Gates checked (parallel):**
- Observability
- Security
- Accessibility
- Code Quality
- UX (if UI work)
- Design & Brand (if UI work)
- Performance (if applicable)

**Scope:** Current chapter (default), specific files, or full project.

---

## Authentication

### `/flow login`

Authenticate with AI Centre via browser OAuth.

**What happens:**
1. Starts local HTTP server on a random port
2. Opens browser to AI Centre authorize page
3. User completes OTP (or sees consent if already logged in)
4. Browser redirects to local callback with auth code
5. Exchanges code for tokens (access 1hr, refresh 30d)
6. Saves to `.flow/credentials.json`

**Result:** `Successfully authenticated!`

---

### `/flow logout`

Revoke tokens and delete credentials.

**What happens:**
1. Revokes refresh token on server
2. Deletes `.flow/credentials.json`

---

## Project Setup

### `/flow bootstrap`

Set up a new project with Flow.

**Full flow:**
1. Auto-login if not authenticated
2. Detect project mode (standard/vibe/vibe-visual)
3. Search skills by project description (RAG matching)
4. User selects skills from ranked recommendations
5. Download selected skills to `.claude/skills/`
6. Generate `CLAUDE.md` with skill directives
7. **If DB needed:** provision Turso database, write env vars, copy templates (drizzle config, migrate, seed)
8. **If email needed:** copy docker-compose (Mailpit), email abstraction, env vars
9. **If auth needed:** copy auth.ts, otp.ts, middleware, login page, schema
10. **If storage needed:** copy storage abstraction, upload route

**Result:** Working project with `.flow/project.json`, selected skills, and infrastructure configured.

---

## Publishing

### `/flow publish`

Publish a skill to the AI Centre community library.

**What happens:**
1. Auto-login if needed
2. Select which skill to publish (from `.claude/skills/`)
3. Parse frontmatter (name, description)
4. Ask for commit message
5. POST to `/api/skills/publish`
6. Server validates, checks quota, creates/updates skill + version

**Result:** `Published {name} v{version}`

**Quota:** Default 5000 skills per user (admin-adjustable).

---

### `/flow showcase`

Publish a showcase (HTML or ZIP project) to the gallery.

**What happens:**
1. Auto-login if needed
2. Detect output: single HTML file or ZIP directory
3. Read `.flow/project.json` for skill associations
4. Ask for title + commit message
5. Upload file to server (FormData)
6. Server stores in Vercel Blob, creates version, deploys ZIPs

**Result:** `Published {title} v{version}`

---

## Version Management

### `/flow rollback`

Roll back a published skill to a previous version.

**What happens:**
1. List user's published skills
2. Fetch version history (commit messages, dates)
3. User picks a version to restore
4. Server creates a NEW version with the old content (append-only)

**Result:** `Restored {name} to v{target} (now v{new})`

---

### `/flow update`

Check for updates to installed official skills.

**What happens:**
1. Read installed skills from `.flow/project.json`
2. Skip forked skills (they don't get updates)
3. POST versions + checksums to server
4. For each skill with updates:
   - **No local changes** → auto-update (download + overwrite)
   - **Local changes detected** → show diff, ask:
     - **Accept** → overwrite with upstream
     - **Fork** → mark as forked, stop future updates

**Result:** All non-forked skills at latest version.

---

## Sharing

### `/flow share`

Share a published showcase or skill with others.

**Options:**
- **Named user** → grant view/download/reshare by email
- **Share link** → signed URL with permissions + expiry

**What happens:**
1. Select resource to share
2. Choose sharing method (person or link)
3. Set permissions (view, download, reshare)
4. For links: set expiry (1d/7d/30d/never)

**Visibility modes (set in web UI or via share):**
| Mode | Gallery | Named users | Links |
|---|---|---|---|
| Public | Everyone sees it | Can restrict download/reshare | Unnecessary |
| Private | Hidden | Only shared users see it | Can create |
| Link only | Hidden | Can add on top | Anyone with link |

**Result:** Confirmation + share link URL (if link sharing).

---

## Quick Reference

| Command | Purpose | Auth required |
|---|---|---|
| `continue` | Resume session | No |
| `plan <topic>` | Create a plan | No |
| `status` | Show project + workspace state | Partial (workspace needs auth) |
| `research <topic>` | Standalone research | No |
| `audit` | Quality gate check | No |
| `park` | End session, save context | No |
| `execute-plan` | Implement plan chapters | No |
| `bootstrap` | Set up new project | Yes (auto-login) |
| `login` | Authenticate | — |
| `logout` | Revoke tokens | — |
| `publish` | Publish a skill | Yes |
| `showcase` | Publish a showcase | Yes |
| `rollback` | Roll back a skill version | Yes |
| `update` | Check for skill updates | Yes |
| `share` | Share a resource | Yes |

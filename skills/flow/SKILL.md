---
name: flow
description: Core workflow router for human-AI paired work. Defines phases (PLANNING, IMPLEMENTATION, POST-DELIVERY), safety guardrails, and session commands. Does not define HOW to implement — plan templates define methodology.
---

# Flow

Workflow router. Defines phases, hooks, and safety guardrails. Plan templates define methodology. Opinion skills define specifics.

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

### `/flow-continue`

**Trigger:** Start of session, or user types `/flow-continue`.

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

### `/flow-plan <topic>`

**Trigger:** User types `/flow-plan <topic>` or asks to plan work.

**Flow:**

1. Determine plan type (dev or tooling) and select the appropriate template (`plan-template-dev.md` or `plan-template-tooling.md`). Dev: changes affecting the production application (features, schema, UI, API endpoints, auth). Tooling: changes to development infrastructure (CI, testing setup, skills, process, developer tooling). If ambiguous, ask the user.
2. Execute the `flow-planning` methodology:
   - Triage topics into complexity tiers.
   - Dispatch research agents per `flow-research`.
   - Run debate rounds between research agents.
   - Produce a plan through the 3-cycle plan review.
3. Write the plan file to `.plans/`. Plan file naming follows existing convention: `.plans/NN-slug_YYYY-MM-DD/chN.N-slug.md`. The coordinator determines the next plan/chapter number from LOG.md.
4. Report to user: plan summary, chapter count, scenario count, ready for execution.

**References:** `flow-planning`, `flow-research`

**Done when:** A plan file exists under `.plans/`, the user has reviewed and approved it, and execution can begin with `/flow-continue`.

---

### `/flow-status`

**Trigger:** User types `/flow-status` mid-session.

**Flow:**

1. Read `.plans/LOG.md`.
2. Check for a `## Parked Session` block. If present:
   - Report the parked state: plan, position, what was done, what's pending.
   - Note which checkpoints have been ticked (if resumption is in progress).
   - Report any unchecked prerequisites.
3. If no park entry:
   - Check current todo list for in-progress items. If no todos exist, report based on LOG.md and session memory.
4. Report a human-optimised summary:
   - Current plan, chapter, and step in the methodology pipeline.
   - What has been completed this session.
   - What is next.
   - Test counts from the most recent test runner output this session, or from LOG.md if no tests have run this session.
   - Any blockers or pending prerequisites.

**References:** `flow-plan-log`

**Done when:** A concise, human-readable summary has been reported to the user. No side effects — this is read-only.

---

### `/flow-research <topic>`

**Trigger:** User types `/flow-research <topic>` or asks to research something outside a planning cycle.

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

### `/flow-audit [scope]`

**Trigger:** User types `/flow-audit` or asks to audit current work.

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

### `/flow-park`

**Trigger:** User types `/flow-park` or says they're ending the session.

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

**Done when:** The park entry is written to LOG.md with all 7 sections and checkpoints, and the user has seen the summary. The next session's `/flow-continue` will consume this entry.

---

### `/flow-execute-plan [plan-ref] [instructions]`

**Trigger:** User types `/flow-execute-plan` or says "implement all chapters" / "execute the plan".

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

### `flow-bootstrap`

**Trigger:** User types `flow-bootstrap` or asks to set up a new project with Flow.

**Flow:**

1. Check if `.flow/project.json` exists — if yes, ask "Update existing project?"
2. Ask: "What are you building? Describe your project in a sentence or two."
3. Fetch skill catalog: `GET {AI_CENTRE_URL}/api/skills/catalog`
4. Present skills grouped by category (type/domain). User selects which to include.
5. For each selected skill, download content: `GET {AI_CENTRE_URL}/api/skills/{slug}/content` (requires auth — run `flow-login` first if needed).
6. Create `.flow/` directory structure:
   - `.flow/project.json` — project metadata + selected skills with versions and checksums
   - `.flow/plans/` — empty directory for future plans
7. Write each skill's content to `.claude/skills/{slug}/SKILL.md`, plus any references to `.claude/skills/{slug}/references/`.
8. Generate `CLAUDE.md` from selected skills — each skill gets an `> Apply the **{name}** skill` directive.
9. Add `.flow/credentials.json` to `.gitignore` if not already present.

**References:** `skills/flow/references/auth-client.md` (for authenticated API calls)

**Done when:** `.flow/project.json` exists, selected skills are downloaded, `CLAUDE.md` is generated, and the user sees a summary of what was created.

---

### `flow-login`

**Trigger:** User types `flow-login` or asks to authenticate with AI Centre.

**Flow:**

1. Read `skills/flow/references/login-client.md` — this contains the complete PKCE login implementation.
2. Copy the code to `.flow/lib/login.ts` in the user's project.
3. Also ensure `.flow/lib/auth.ts` exists (from `skills/flow/references/auth-client.md`) — the login module depends on it.
4. Run the login flow: opens browser → user completes OTP → tokens saved to `.flow/credentials.json`.

**References:** `skills/flow/references/login-client.md`, `skills/flow/references/auth-client.md`

**Done when:** `.flow/credentials.json` exists with valid tokens and the user sees "Successfully authenticated!"

---

### `flow-logout`

**Trigger:** User types `flow-logout` or asks to log out of AI Centre.

**Flow:**

1. Read `skills/flow/references/logout-client.md` — this contains the complete logout implementation.
2. Copy the code to `.flow/lib/logout.ts` in the user's project.
3. Run the logout flow: revokes refresh token on server, deletes `.flow/credentials.json`.

**References:** `skills/flow/references/logout-client.md`, `skills/flow/references/auth-client.md`

**Done when:** `.flow/credentials.json` is deleted and the server token is revoked.

---

## Banned Patterns

- Starting implementation without a plan → plan first
- Committing or pushing without asking → always request authorisation
- Over-planning one-liners → proportional response
- Updating docs mid-implementation → write after delivery
- Prescribing implementation methodology in this skill → that belongs in the plan template
- Writing a park entry without the full template structure → use all 7 sections
- Skipping the status report on `/flow-continue` → always report before acting

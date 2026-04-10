---
name: flow
description: >
  Core workflow router for human-AI paired work. Defines the three phases
  (PLANNING → IMPLEMENTATION → POST-DELIVERY) and safety guardrails.
  Does not define HOW to implement — plan templates define methodology.
  This skill says WHEN things happen, templates and opinions say HOW.
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

### `/continue`

**Trigger:** Start of session, or user types `/continue`.

**Flow:**

1. Read `.plans/LOG.md` Section 1 (Active Context).
2. Check for a `**Parked:**` block. If present:
   - Read the parked position, decisions, rejected approaches.
   - Report to user: resuming from parked position, what was done, what's next.
   - Remove the `**Parked:**` block from LOG.md (it's been consumed).
   - Resume execution from the parked position.
3. If no parked block:
   - Read the next chapter's plan file (referenced in Active Context).
   - Extract the methodology from the chapter.
   - Report to user: current state, next chapter, what you will do.
   - Begin execution.

**References:** `flow-plan-log.md`

**Done when:** The coordinator has oriented, reported current state to the user, and begun executing.

---

### `/plan <topic>`

**Trigger:** User types `/plan <topic>` or asks to plan work.

**Flow:**

1. Determine plan type (dev or tooling) and select the appropriate template (`PLAN_TEMPLATE_DEV.md` or `PLAN_TEMPLATE_TOOLING.md`). Dev: changes affecting the production application (features, schema, UI, API endpoints, auth). Tooling: changes to development infrastructure (CI, testing setup, skills, process, developer tooling). If ambiguous, ask the user.
2. Execute the `flow-planning.md` methodology:
   - Triage topics into complexity tiers.
   - Dispatch research agents per `flow-research.md`.
   - Run debate rounds between research agents.
   - Produce a plan through the 3-cycle plan review.
3. Write the plan file to `.plans/`. Plan file naming follows existing convention: `.plans/NN-slug_YYYY-MM-DD/chN.N-slug.md`. The coordinator determines the next plan/chapter number from LOG.md.
4. Report to user: plan summary, chapter count, scenario count, ready for execution.

**References:** `flow-planning.md`, `flow-research.md`

**Done when:** A plan file exists under `.plans/`, the user has reviewed and approved it, and execution can begin with `/continue`.

---

### `/status`

**Trigger:** User types `/status` mid-session.

**Flow:**

1. Read `.plans/LOG.md` Section 1 (Active Context) and Section 2 (Plan Overview).
2. Check current todo list for in-progress items. If no todos exist, report based on LOG.md and session memory.
3. Report a human-optimised summary:
   - Current plan, chapter, and step in the methodology pipeline.
   - What has been completed this session.
   - What is next.
   - Test counts from the most recent test runner output this session, or from LOG.md if no tests have run this session.
   - Any blockers.

**References:** `flow-plan-log.md`

**Done when:** A concise, human-readable summary has been reported to the user. No side effects — this is read-only.

---

### `/research <topic>`

**Trigger:** User types `/research <topic>` or asks to research something outside a planning cycle.

**Flow:**

1. Triage complexity (Simple / Moderate / Complex) using the triage rules from `flow-planning.md`. The coordinator triages directly for standalone research (no triage subagent — the overhead is not warranted for a single topic).
2. Execute the `flow-research.md` methodology at the appropriate intensity:
   - **Simple:** 1 research agent, return findings directly.
   - **Moderate:** 2 research agents (split by knowledge base), 1 debate round.
   - **Complex:** 2 research agents, 2+ debate rounds.
3. Report findings to user with sources and confidence levels. Confidence: High (multiple corroborating sources, well-established pattern), Medium (fewer sources or minor conflicts, but viable), Low (limited sources, speculative).

**References:** `flow-research.md`, `flow-planning.md` (triage and debate rules)

**Done when:** Findings have been reported to the user with sources. No plan file is created — this is standalone research.

---

### `/audit [scope]`

**Trigger:** User types `/audit` or asks to audit current work.

**Flow:**

1. Determine scope: current chapter (default), specific files, or full project. Current chapter scope = all files listed in the chapter's Critical Files tables. If unavailable, all files changed since the chapter started (via `git diff`).
2. Dispatch parallel audit subagents, one per gate:
   - Observability (`flow-observability.md`)
   - Security
   - Accessibility
   - Code Quality
   - UX (if UI work is in scope)
   - Design and Brand (if UI work is in scope)
   - Performance (if applicable)
3. Collect findings and report to user.
4. User decides whether to fix now or defer. The command does not auto-fix.

**References:** `flow-observability.md`, `flow-eval-driven.md`, `flow-tdd.md`. For gate-specific checklists beyond Observability, see the audit gates in `PLAN_TEMPLATE_DEV.md` Step 6.

**Done when:** All applicable audit gates have reported findings. The user has been presented with results and has decided on next steps.

---

### `/park`

**Trigger:** User types `/park` or says they're ending the session.

**Flow:**

1. Run `git status` to check for uncommitted changes.
2. Write a `**Parked:**` block into `.plans/LOG.md` Section 1 (Active Context), appended after the existing content:
   ```
   **Parked:** YYYY-MM-DD HH:MM
   **Position:** Ch N, Phase P, SN (scenario name) — pipeline step
   **Done this session:** [what was completed]
   **Decisions:** [any decisions made this session, not yet in LOG]
   **Rejected:** [approaches tried and rejected, with evidence]
   **Warnings:** [uncommitted files count, or "clean"]
   ```
3. Print a summary to the user:
   - What was done
   - Where work will resume
   - Any warnings (uncommitted changes)

**References:** `flow-plan-log.md`, `flow-strategic-context.md`

**Done when:** The parked block is written to LOG.md and the user has seen the summary. The next session's `/continue` will read this block and resume from the parked position.

---

## Banned Patterns

- Starting implementation without a plan → plan first
- Committing or pushing without asking → always request authorisation
- Over-planning one-liners → proportional response
- Updating docs mid-implementation → write after delivery
- Prescribing implementation methodology in this skill → that belongs in the plan template

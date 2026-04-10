---
name: flow-plan-log
description: >
  Opinion companion for flow. Maintains .plans/LOG.md — a structured
  execution log of all plans. Three sections: Active Context (AI-optimised),
  Plan & Chapter Overview (human-readable), Execution Log (detailed history).
  Hooks into POST-DELIVERY via Step 8a in the methodology.
---

# Flow: Plan Log

Opinion companion for **flow** (core). Maintains `.plans/LOG.md` as the canonical record of plan execution.

**Hook point:** POST-DELIVERY. After completing a chapter, the methodology's Step 8a dispatches a LOG UPDATER subagent. This skill defines the structure that subagent must follow.

---

## When to Use

- After completing a chapter → Step 8a updates the log
- After completing a plan → Step 8a updates the log + marks plan as complete
- At the start of any new session → READ Section 1 (Active Context) to understand what to do
- When an agent needs to continue work from a previous session

---

## LOG.md Structure (three sections)

### Section 1: Active Context (top)

**Audience:** AI coordinator starting a new session.
**Purpose:** Everything needed to pick up where work left off, with cross-references.

```markdown
## Active Context (read this first)

**Next chapter:** Ch N — Title
**Plan file:** `.plans/plan-name/chN-slug.md`
**Methodology:** Extract from the chapter file → `PLAN_TEMPLATE_DEV.md` has the canonical pipeline

**Current app state:** [One sentence — what's working, what's not]

**Test counts:** [N vitest (N skipped) + N Playwright E2E]

**Dev login:** [How to log in locally]

**Environment requirements:**
- [Docker, ports, env vars, services]

**Key files to read:**
- [Cross-references to ARCHITECTURE.md, PROJECT_REFERENCE.md, CLAUDE.md, etc.]

**Points of attention:**
- [Gotchas, known issues, things that will trip up the next session]
```

Rules for Section 1:
- Cross-reference other files by path — don't duplicate their content
- Include points of attention that are NOT obvious from reading the codebase (e.g., "pdf-parse is v2 with a different API", "content seed has no unique constraint")
- Update "Next chapter" every time a chapter completes
- Keep this section under 40 lines

### Section 2: Plan & Chapter Overview (middle)

**Audience:** Human reviewing project progress.
**Purpose:** At-a-glance status of everything, with key decisions and attention points.

```markdown
## Plan & Chapter Overview

### Plan 01: Name

| Ch | Title | Status | Key Decisions | Attention |
|----|-------|--------|---------------|-----------|
| 1  | ...   | Complete | D1: decision | point of attention |

**Post-plan state:** [tables, tests, routes]

---

### Plan 02: Name (active)

| Ch | Title | Status | Key Decisions | Attention |
|----|-------|--------|---------------|-----------|
| ...| ...   | ...    | ...           | ...       |

**Key architectural decisions (this plan):**
- D1: ...
- D2: ...
```

Rules for Section 2:
- One table per plan
- Status values: `Complete`, `In progress`, `Not started`
- Key Decisions column: brief (e.g., "Custom fetch adapters, no SDK"), link to rationale in execution log if complex
- Attention column: things future work needs to be aware of (e.g., "Sub-entities deferred", "Stub dimensions have TODO")
- Post-plan state only for completed plans
- Architectural decisions listed separately when there are >3 for a plan

### Section 3: Execution Log (bottom)

**Audience:** Anyone needing detailed history.
**Purpose:** What was done, when, with enough detail to understand the work without reading git log.

```markdown
## Execution Log

### Session: YYYY-MM-DD

**Ch N — Title (status)**
- [Bullet points: what was implemented, key changes, test results]
- [Audit findings and fixes]
- [Final counts]
```

Rules for Section 3:
- Group by session date
- Within a session, group by chapter
- Capabilities over file lists (same as before)
- Include test counts at the end of each chapter entry
- Include methodology/infrastructure changes if they happened
- Succinct but complete — someone reading this should understand what changed without reading the diff

---

## Entry Format Rules

- **Capabilities over file lists**: "Users can invite team members and assign roles" not "Created `src/features/users/actions.ts`"
- **Decisions are real choices, not descriptions of what was built.** A decision has a choice, a rejected alternative, and a reason. Use the format that fits best:
  - "X over Y — reason" → `postgres.js over @neondatabase/serverless — works with both Docker and Neon`
  - "X, not Y (reason)" → `ALLOW_MAGIC_OTP env var, not NODE_ENV (explicit opt-in, can't leak)`
  - "X because Y" → `Confidence gating at 0.8/0.5 because manual review is cheap, bad data is expensive`
  - If no real decision was made (just standard implementation), leave the column as `—`
- **Infrastructure state is concrete numbers**: "256 vitest, 22 E2E, 20 tables, 15 routes"
- **Next action is immediately actionable**: "Ch 16 — Embeddings + Graph Sync" with the plan file path

---

## When to Update

| Event | What to update |
|---|---|
| Chapter completed | Section 1 (next chapter), Section 2 (status → Complete), Section 3 (add entry) |
| Plan completed | Section 1 (next plan/chapter), Section 2 (post-plan state), Section 3 (add entry) |
| New plan started | Section 2 (add plan table), Section 3 (add entry) |
| Session ending mid-chapter | Section 1 (points of attention with partial state) |
| Decision made | Section 2 (Key Decisions column or architectural decisions list) |

---

## Banned Patterns

- Log entries that list file paths instead of capabilities
- Missing "Next chapter" in Section 1 — every update must say what to do next
- Stale log — if the log doesn't reflect what actually exists, it's worse than no log
- Decisions without rationale
- Infrastructure state without numbers
- Duplicating content from ARCHITECTURE.md or PROJECT_REFERENCE.md — cross-reference instead

---

## Quality Gate

Before ending a session:

- [ ] Section 1 reflects the current state and next action
- [ ] Section 2 has correct status for all chapters worked on
- [ ] Section 3 has an entry for all work done this session
- [ ] Test counts are accurate (cross-reference with actual suite)
- [ ] Key decisions from this session are captured
- [ ] Points of attention include anything non-obvious for the next session

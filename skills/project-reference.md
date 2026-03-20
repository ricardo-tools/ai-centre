---
name: project-reference
description: >
  How to maintain a living project reference document that AI agents and humans use
  to prevent regression, context loss, and decision contradiction as projects grow.
  Apply when starting a new project, completing any task that changes application
  behaviour, fixing non-obvious bugs, making architectural decisions, or when
  CLAUDE.md exceeds 200 lines and needs tiering.
---

# Project Reference

A project reference is a living document that records what the code cannot tell you: why decisions were made, what was rejected, which constraints are non-obvious, and what the current feature landscape looks like. It is the single most reliable mechanism for maintaining continuity across AI agent sessions, compaction events, and team handoffs.

Key finding: CLAUDE.md survives compaction (re-read from disk). It is the most reliable persistence mechanism for AI agents. But it must stay under 200 lines to maintain adherence (ETH Zurich, Feb 2026). Everything else goes into a tiered warm/cold layer.

---

## When to Use

Apply this skill when:
- Starting a new project that will use AI agents
- Completing any task that adds, modifies, or removes a feature
- Fixing a bug with a non-obvious root cause
- Making an architectural decision with rejected alternatives
- Adding or changing an external service dependency
- Running a schema migration
- Discovering a new constraint that isn't obvious from the code
- CLAUDE.md is approaching or exceeding 200 lines

Do NOT use this skill for:
- Writing code — see **coding-standards**
- Project folder structure — see **clean-architecture**
- Git workflow or branching strategy — see **git-workflow**
- Documentation meant for end users — this skill is for developer/agent context

---

## Core Rules

### 1. The reference is a living document, not a write-once artifact

It must be updated after every change that adds, modifies, or removes a feature. This is not optional. The agent updates it as part of completing any task — the update is part of the definition of done, not a follow-up.

Why: Stale references are worse than no reference. They cause agents to make decisions based on outdated assumptions, which produces silent regressions.

### 2. Three tiers of project knowledge

| Tier | File | Loaded | Size limit | Contents |
|------|------|--------|------------|----------|
| **Hot** | `CLAUDE.md` | Always (survives compaction) | <200 lines | Conventions, triggers, pointers to warm/cold |
| **Warm** | `PROJECT_REFERENCE.md` | On demand (agent reads when needed) | 300-600 lines | Feature map, decisions, constraints, data flows |
| **Cold** | Individual docs, ADRs, changelogs | When relevant | No limit | Full ADRs, API specs, migration history |

Only the hot tier is guaranteed to survive compaction. The hot tier must contain enough context to tell the agent *where to look* for everything else.

Research basis: Codified Context paper (arXiv 2602.20478) formalised this as hot/warm/cold memory. ETH Zurich (Feb 2026) found that human-written, limited-to-non-inferable context improves task success by ~4%, while LLM-generated context files reduce success by ~3%.

### 3. Record what the code cannot tell you

Do not duplicate what is in the code or git history. Record:
- **Why** a decision was made (not just what was decided)
- **Constraints** that are not obvious from reading the code
- **Bugs** that were fixed and why the original code was wrong
- **Scope boundaries** — what a feature does and does not cover
- **What was rejected** — alternatives considered and why they lost

Why: Code tells you *what*. Git tells you *when*. Only the reference tells you *why* and *why not*.

### 4. Feature map is the backbone

Every feature gets a table entry. The feature map is the first thing checked before any change.

| Column | Purpose |
|--------|---------|
| Feature | Name (matches folder or route) |
| Status | `built` / `partial` / `planned` / `removed` |
| Key files | 2-4 most important file paths |
| Dependencies | Other features or services it relies on |
| Constraints | Non-obvious rules that must not be violated |

When a feature is added or removed, the map updates in the same commit.

### 5. Decision log for non-obvious choices

When a decision has alternatives that were considered and rejected, record it as a one-liner:

```
| Auth | Custom email OTP over Auth.js | Auth.js adds 40KB client bundle, no edge middleware support | 2026-01-15 |
```

Format: `| Topic | Decision | Why (including what was rejected) | Date |`

Full ADRs (in cold tier) only for strategic decisions that affect multiple features or are hard to reverse.

### 6. Problem/solution entries at the fix site

When a bug is fixed with a non-obvious root cause, add a comment at the fix site:

```ts
// FIX: Middleware redirect loop was caused by checking auth on the /login
// route itself. The previous code didn't exclude auth routes from the
// matcher, so unauthenticated users hit an infinite redirect.
```

Format: `// FIX: [symptom] was caused by [root cause]. [Why the previous code was wrong.]`

This survives as long as the code does and is visible to any agent reading the file.

### 7. Scannable structure over narrative

Tables over paragraphs. Bullet lists over prose. Section headings that tell you where to look in 5 seconds. The reference is read under time pressure by agents with limited context windows.

Anti-example: The PROJECT_JOURNAL pattern (Cursor community) uses an append-only structured log. It works initially but grows to 18K+ lines and becomes unscannable. Keep the reference scannable by updating in place, not appending.

### 8. Auto-update protocol

After completing any task that changes application behaviour, the agent updates the reference. This is triggered by:

- New feature added → add to feature map
- Feature removed or significantly changed → update feature map status
- Bug fixed with non-obvious root cause → add FIX comment + update constraints if relevant
- Architectural decision made → add to decision log
- External service added or changed → update external services table
- Schema migration → update data model section
- New constraint discovered → add to "Do Not Break" section

The update is part of the task. A task is not done until the reference reflects the change.

### 9. Keep the hot tier under 200 lines

CLAUDE.md over 200 lines causes adherence to drop. This is confirmed by both the ETH Zurich study and widespread community reports. When CLAUDE.md is growing:

1. Identify details that are not needed on every single task
2. Move them to `PROJECT_REFERENCE.md` (warm tier)
3. Leave a one-line pointer in CLAUDE.md: `> For feature map and decisions, see PROJECT_REFERENCE.md`

The hot tier contains: conventions, mandatory skill references, project structure overview, key commands, and pointers.

### 10. Version the reference alongside the code

The reference lives in the repo, committed with the code changes it describes. Never in an external wiki, Notion, or Confluence. External tools are invisible to AI agents — they cannot read them, and they drift from the code within days.

### 11. Conventional commits feed the changelog

Use structured commit messages (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`) so the history is machine-parseable. The changelog is auto-generatable from commits, not manually maintained. This makes the cold tier (git history) actually useful.

### 12. Post-compaction resilience

Assume any session can be compacted at any time. The reference must be self-contained enough that a fresh session with only CLAUDE.md + PROJECT_REFERENCE.md can:
- Understand the current project state
- Know which features exist and their status
- Know which constraints must not be violated
- Know where to find deeper context (cold tier pointers)

Nilenso's finding: right-sized units of work + context observability are the two biggest levers for AI agent effectiveness. The reference provides context observability.

---

## Reference Document Structure Template

Use this structure for `PROJECT_REFERENCE.md`:

```markdown
# Project Reference — [Project Name]

## Product Overview
<!-- 2-3 lines. What this is, who it's for, what it does. -->

## Feature Map
| Feature | Status | Key Files | Dependencies | Constraints |
|---------|--------|-----------|--------------|-------------|
| Auth | built | middleware.ts, src/features/auth/ | Resend, Jose | Domain-restricted emails |
| Skill Library | built | src/features/skill-library/ | DB (skills table) | Slug uniqueness enforced |

## Key Data Flows
### [Flow Name]
1. User does X
2. Server action validates → calls use case
3. Use case queries DB → returns Result<T, E>
4. Widget renders success or error state

## External Services
| Service | Purpose | Env Var | Failure Mode |
|---------|---------|---------|--------------|
| Neon | Database | DATABASE_URL | 500 on all DB queries |
| Resend | Email OTP | RESEND_API_KEY | Login unavailable |

## Decision Log
| Topic | Decision | Why | Date |
|-------|----------|-----|------|
| Auth | Custom OTP over Auth.js | Bundle size, edge compat | 2026-01-15 |

## Do Not Break
- Middleware must exclude /login and /api/auth from auth checks (redirect loop)
- Skill slugs are used in URLs — changing a slug breaks bookmarks
- Theme CSS vars must be defined for both light and night themes

## Implementation Status
- [x] Feature A — fully working
- [x] Feature B — fully working
- [ ] Feature C — planned, not started
```

---

## Tiered Memory Model

```
+--------------------------------------------------+
|  HOT — CLAUDE.md (<200 lines)                    |
|  Always loaded. Survives compaction.              |
|  Contains: conventions, commands, skill refs,     |
|  structure overview, pointers to warm/cold.       |
+--------------------------------------------------+
           |  "See PROJECT_REFERENCE.md"
           v
+--------------------------------------------------+
|  WARM — PROJECT_REFERENCE.md (300-600 lines)     |
|  Loaded on demand by agent.                       |
|  Contains: feature map, decisions, constraints,   |
|  data flows, external services, status.           |
+--------------------------------------------------+
           |  "See docs/adr-003.md"
           v
+--------------------------------------------------+
|  COLD — Individual docs, ADRs, changelogs        |
|  Loaded when relevant.                            |
|  Contains: full ADRs, API specs, migration        |
|  history, design docs, meeting notes.             |
+--------------------------------------------------+
```

Rule of thumb: if an agent needs it on *every* task, it is hot. If an agent needs it on *most* tasks, it is warm. If an agent needs it only for *specific* tasks, it is cold.

---

## Banned Patterns

- Reference only updated at project start, never maintained — the reference must be updated with every behaviour-changing task
- Duplicating what is in the code (file structure, function signatures) — record why, not what
- Verbose narrative instead of scannable tables — tables and bullets, not paragraphs
- External wiki as the reference (Notion, Confluence) — invisible to AI agents, drifts within days
- Auto-generated reference without human review — ETH Zurich study: LLM-generated context hurts more than it helps (~3% reduction in task success)
- CLAUDE.md over 200 lines — move overflow to warm tier and leave pointers
- Recording implementation details instead of decisions and constraints — the code already has implementation details
- Reference that does not mention what was rejected — decisions without rejected alternatives are incomplete
- Append-only journal pattern — grows unbounded (18K+ lines), becomes unscannable. Update in place.
- Separating the reference from the code repo — must be committed alongside the changes it describes

---

## Quality Gate

Before delivering, verify:

- [ ] CLAUDE.md is under 200 lines and contains pointers to warm tier
- [ ] PROJECT_REFERENCE.md has a feature map with status for every feature
- [ ] Every feature map entry has key files, dependencies, and constraints
- [ ] Decision log entries include what was rejected, not just what was chosen
- [ ] "Do Not Break" section lists non-obvious constraints that would silently regress
- [ ] External services table lists every service with its env var and failure mode
- [ ] No narrative paragraphs where a table or bullet list would work
- [ ] Reference is committed in the same PR as the code changes it describes
- [ ] No code duplication — reference records why, code shows what
- [ ] A fresh agent session with only CLAUDE.md + PROJECT_REFERENCE.md can understand the project state
- [ ] FIX comments at bug fix sites explain symptom, root cause, and why the old code was wrong
- [ ] Key data flows are documented step-by-step for critical paths

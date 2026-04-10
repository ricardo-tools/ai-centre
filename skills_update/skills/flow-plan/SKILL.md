---
name: flow-plan
description: >
  Opinion companion for flow. Defines how plans are structured, stored,
  and executed. Plans live in .plans/ at project root. Each plan is a folder
  with plan.md (index + decisions) and chapter files. References
  PLAN_TEMPLATE_DEV.md for chapter structure. Hooks into PLANNING phase.
---

# Flow: Plan Structure

Opinion companion for **flow** (core). Defines how implementation plans are organised, structured, and maintained.

**Hook point:** PLANNING phase (rules 1-8). Before writing any code, ensure work is organised into a plan with chapters.

---

## When to Use

Apply this opinion when:
- Starting a new feature area, migration, or major initiative
- Work spans more than one session or requires multiple sequential steps
- Coordinating across schema, backend, UI, and tests
- The task is large enough to benefit from chapters with dependencies

Do NOT use for:
- One-off bug fixes or small changes (just use flow core)
- Research-only tasks with no implementation

---

## Core Rules

### 0. Research before planning — mandatory gate

Before creating ANY plan, research the problem space. AI training data is stale and cannot be trusted for version-specific, evolving, or domain-specific topics.

**This is not optional.** Every plan starts with research. The research informs decisions, technology choices, and approach.

- Read existing code and architecture docs first
- Web search for current best practices, library versions, API changes
- See `.claude/skills/flow-research/SKILL.md` for research methodology (CRAAP-tested sources, structured research types)
- See `.claude/skills/flow-planning/SKILL.md` for the full planning cycle (triage, research, debate, plan review)
- Document findings in the plan's `plan.md` decisions section with sources

**Gate:** A plan cannot be created until research is done. If the user asks to skip research for a well-understood domain, confirm explicitly.

### 1. Master plan first — iterate before detailing

Planning follows a strict sequence:

1. **Create master plan** — `plan.md` using `PLAN_TEMPLATE_MASTER.md`
   - Chapter descriptions are **concise** (2-4 sentences each)
   - Decisions are captured inline with rationale
   - Dependency graph shows execution order
2. **Iterate with user** — refine scope, adjust chapters, confirm decisions
   - Chapters may be added, removed, reordered, or merged
   - This is cheap at the master plan level — expensive once chapter files exist
3. **User approves master plan** — explicit confirmation required
4. **Create all chapter files** — every chapter before implementation begins
   - Each chapter file uses the appropriate template (see Rule 2)

See `PLAN_TEMPLATE_MASTER.md` for the master plan structure.

### 2. Select the chapter template

Chapter templates define the methodology. If only one exists, use it. If multiple, suggest based on context and confirm.

Current templates:
- `PLAN_TEMPLATE_DEV.md` — development work (features, bug fixes, infrastructure)

The template defines HOW work is done. `flow` defines WHEN phases happen.

### 3. Plans live in `.plans/` at project root

```
.plans/                                    ← gitignored
├── LOG.md                                 ← execution log (all plans)
├── 01-feature-name_YYYY-MM-DD/            ← one folder per plan
│   ├── plan.md                            ← index: status, scope, decisions (inline), chapters
│   ├── ch1-kebab-name.md                  ← chapter per milestone
│   ├── ch2-kebab-name.md
│   └── ...
└── 02-another-feature_YYYY-MM-DD/
    └── ...
```

### 4. Folder naming: `NN-kebab-name_YYYY-MM-DD`

Zero-padded sequence number + descriptive kebab-case name + creation date. Examples:
- `01-persona-management_2026-03-27`
- `02-content-ai-pipeline_2026-03-29`
- `03-deal-rooms_2026-04-15`

### 5. Every plan folder contains two types of files

**`plan.md`** — the master plan. Structure defined by `PLAN_TEMPLATE_MASTER.md`. Contains scope, context, decisions (inline, not a separate file), chapter table with template links, dependency graph.

**`chN-kebab-name.md`** — one chapter per milestone. All created before implementation begins. Structure defined by the template linked in the chapter table (e.g., `PLAN_TEMPLATE_DEV.md`).

Decisions live IN `plan.md`, not in a separate file. Key decisions transfer to `.plans/LOG.md` when the plan completes.

### 6. Chapters are sequential unless explicitly independent

Each chapter lists what it depends on and what it unlocks. The dependency graph in `plan.md` shows the execution order. Never start a chapter before its dependencies are complete.

### 7. Each scenario is commit-sized

A scenario should touch 1-4 files. If it touches more, split it. Scenarios are the unit of work — one scenario is developed, EDD-verified, design-gated, and tested before moving to the next.

### 8. Plans are living documents

Update as decisions change. If a chapter's scope changes mid-implementation, update the chapter file. If a new decision is made, add it to `plan.md`. The plan reflects reality, not the original intention.

### 9. Chapter files replicate the template — not reference it

Every chapter file **copies** the full template structure into itself. The template is stamped, not referenced. This means:

- The Development Methodology section appears **in full** in every chapter file (duplicated on purpose)
- Template mandatory sections cannot be removed from a chapter
- New sections can be added per-chapter, but mandatory ones stay
- A "see PLAN_TEMPLATE_DEV.md" reference is NOT acceptable — the content must be inline

**Why duplication:** Agents may read only the chapter file. After context compaction, a reference to another file may not be followed. The methodology being present in the immediate context yields better compliance than a cross-reference. The duplication IS the compliance mechanism.

### 10. After completing a plan, update `.plans/LOG.md`

See **flow-plan-log** for the log format and update rules.

---

## Banned Patterns

- Creating chapter files before master plan is approved → iterate at master level first
- Starting implementation before all chapter files are written
- Skipping research before planning → research is a mandatory gate
- Plans stored outside `.plans/` (scattered across the repo)
- Chapters without depends-on/unlocks headers (unclear execution order)
- Scenarios that span 5+ files (too large — split them)
- Separate decisions.md file → decisions live in plan.md
- Starting implementation without a plan folder created first
- Chapter files that don't follow their linked template

---

## Quality Gate

Before starting implementation on a plan:

- [ ] Plan folder exists in `.plans/` with correct naming
- [ ] `plan.md` follows `PLAN_TEMPLATE_MASTER.md` structure
- [ ] Master plan approved by user before any chapter files created
- [ ] At least D1 decision documented in plan.md
- [ ] `.plans/LOG.md` has been read for context on previous plans
- [ ] Research completed before plan creation (Rule 0)

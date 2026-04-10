---
name: flow-roadmap
description: >
  Defines how to maintain a living roadmap that auto-updates as work progresses.
  The roadmap lives in the repo as ROADMAP.md, structured as Now / Next / Later /
  Parking Lot / Bugs / Completed. Apply when starting a project, planning iterations,
  triaging bugs, completing work items, or reviewing priorities. Works with any
  project type — the agent reads and updates the roadmap as part of every session.
---

# Roadmap

The roadmap is a living repo document — read by humans and AI agents at session start, updated as part of every completed task, and the single source of truth for what's now, next, and later.

---

## When to Use

Apply this skill when:
- Starting a new project or feature area (create the initial ROADMAP.md)
- Beginning a development session (read the roadmap, pick the next Must item from Now)
- Completing any work item (update the roadmap as part of definition of done)
- Discovering something during implementation that needs future attention
- Triaging bugs and deciding priority relative to feature work
- Reviewing priorities at the start of a session or weekly cadence
- Deciding what to work on next when the current task is done

Do NOT use this skill for:
- Detailed technical design — see **clean-architecture** or **frontend-architecture**
- Sprint ceremonies or team process — this is a repo-level tool, not a team workflow
- Project documentation or knowledge base — see **project-documentation**

---

## Core Rules

### 1. The roadmap lives in the repo as ROADMAP.md

Not in Jira, Linear, Notion, or Confluence. It must be where the developer and AI agent already are. Markdown with optional YAML frontmatter (`last_updated`, `current_focus`).

Why: The roadmap must be frictionless to read and update — same editor, same repo, same PR process.

### 2. Six sections: Now / Next / Later / Parking Lot / Bugs / Completed

**Now** = active work for the current iteration. **Next** = validated and ready to start when Now items complete. **Later** = directional ideas that need validation before committing. **Parking Lot** = ideas discovered during development, never auto-promoted. **Bugs** = severity-tagged issues that follow their own priority rules. **Completed** = timestamped record of what was done.

Why: Six sections cover the full idea lifecycle from discovery through execution to record, with bugs separated for severity-based priority.

### 3. Each item is self-contained

Every item includes: a title, a one-line rationale (why this matters), acceptance criteria or a sub-task checklist, and a priority tag (Must/Should/Could). An AI agent reading any single item should have enough context to start work without reading the full roadmap.

Why: Items get worked on weeks later without the original context — a self-contained item is actionable, a bare title is not.

### 4. Auto-update protocol

The agent reads the roadmap at session start. After completing any work item, it updates the roadmap: checks off completed sub-tasks with date, moves items between sections if status changed, appends discovered ideas to Parking Lot. This update is part of the task's definition of done — the task is not complete until the roadmap reflects reality.

Why: Making the update part of definition of done means the roadmap is always current without requiring discipline.

### 5. Bugs override by severity

Bug priority follows a strict hierarchy:
- **P0** (system down, data loss, security breach) — drop everything, fix immediately
- **P1** (major feature broken, no workaround) — fix before any feature work in Now
- **P2** (degraded experience, workaround exists) — schedule in Next
- **P3** (cosmetic, minor annoyance) — add to Later or Parking Lot

Why: Without severity tags all bugs look equal — tagging forces triage and ensures critical bugs are never blocked behind feature work.

### 6. Parking Lot captures, humans triage

When the agent discovers something during implementation — "this page also needs responsive fixes", "the API response includes a field we could use for X" — it appends to Parking Lot with date and context. Items never auto-promote to Now, Next, or Later. A human always triages.

Why: AI agents notice well but prioritise poorly — the Parking Lot is a capture mechanism, not a queue.

### 7. MoSCoW within time horizons

Must/Should/Could labels within each section (Now, Next, Later) provide urgency within each time horizon. The agent uses Must items in Now as the default "what to work on next" when no explicit instruction is given.

Why: MoSCoW labels within each section tell the agent exactly where to focus when no explicit instruction is given.

### 8. Roadmap is direction, not commitment

Items in Later are directional — they express intent, not promises. Items in Next are validated but can be reordered. Only items in Now are commitments for the current iteration.

Why: The roadmap is a planning tool, not a contract — only Now carries commitment weight.

### 9. Review cadence

At the start of each session (or weekly for active projects), the developer triages: review Parking Lot (promote or discard), re-evaluate Next and Later priorities, confirm Now is still the right focus. This takes 5-10 minutes and prevents drift.

Why: A brief regular review prevents the Parking Lot from growing indefinitely and keeps Now focused on highest-value work.

### 10. Keep it scannable

Tables for structured data, checkboxes for progress, one-line rationale per item. The roadmap is read under time pressure — at the start of a session, between tasks, during triage. If the Now section takes more than 30 seconds to scan, it is too detailed.

Why: A roadmap that requires careful reading will not be read — brevity is a feature.

---

## Roadmap Template

```markdown
---
last_updated: YYYY-MM-DD
current_focus: "brief description of active theme"
---

# Roadmap

## Now (Active)

- [ ] **Item title** — [Must/Should/Could]
  Rationale: why this matters
  - [ ] Sub-task 1
  - [ ] Sub-task 2

- [ ] **Item title** — [Must/Should/Could]
  Rationale: why this matters
  - [ ] Sub-task 1

## Next (Ready)

- [ ] **Item title** — [Must/Should/Could]
  Rationale: why this matters
  - [ ] Sub-task 1
  - [ ] Sub-task 2

## Later (Planned)

- [ ] **Item title** — [Must/Should/Could]
  Rationale: why this matters

## Parking Lot

- [YYYY-MM-DD] Item discovered during [context]. [One-line description].
- [YYYY-MM-DD] Item discovered during [context]. [One-line description].

## Bugs

- **P0** — [description] — discovered [YYYY-MM-DD]
- **P1** — [description] — discovered [YYYY-MM-DD]
- **P2** — [description] — discovered [YYYY-MM-DD]
- **P3** — [description] — discovered [YYYY-MM-DD]

## Completed

- [x] **Item title** — completed YYYY-MM-DD
- [x] **Item title** — completed YYYY-MM-DD
```

---

## Standards

- Keep the roadmap in `ROADMAP.md` in the repo root so the AI agent can read it at session start. Not: roadmap in an external tool invisible to the agent
- Include a "why" rationale on every item so it can be prioritised (e.g. "Add dark mode — 40% of users browse after 8pm and report eye strain"). Not: items without rationale
- Let only a human promote Parking Lot items to Now, Next, or Later. Not: auto-promoting Parking Lot items without human triage
- Treat Later items as directional ideas, not promises to stakeholders. Not: treating Later items as commitments or planning dependencies on them
- Update the roadmap as part of every completed task's definition of done. Not: roadmap only updated at project start and never maintained
- Keep Now to 3-5 active items; move lower-priority items to Next. Not: Now section with more than 5 active items
- Tag every bug with severity (P0-P3) to enable proper triage. Not: bugs without severity tags
- Maintain a Completed section with timestamps as the project's memory. Not: missing Completed section

---

## Quality Gate

Before considering a roadmap update complete, verify:

- [ ] Every item in Now has a title, rationale, priority tag, and acceptance criteria or sub-tasks
- [ ] Now has no more than 5 active items
- [ ] Completed items from this session have a completion date
- [ ] Discovered ideas are in Parking Lot with date and context — not silently added to Now or Next
- [ ] Bugs have severity tags (P0-P3)
- [ ] The `last_updated` frontmatter reflects today's date
- [ ] The `current_focus` frontmatter reflects the active theme
- [ ] The Now section is scannable in under 30 seconds

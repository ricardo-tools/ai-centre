---
name: flow-planning
description: Planning methodology for chapter plans. Vertical-slice chapters with tiered research, debate, and plan drafting.
---

# Flow: Planning

Methodology for creating chapter plans. Produces plans where every chapter is a small vertical slice — schema through UI — with polish built into acceptance criteria.

For research techniques (web search, source evaluation, CRAAP testing), see: `.claude/skills/flow-research/SKILL.md`
For the execution methodology inside each chapter, see: `PLAN_TEMPLATE_DEV.md`

---

## When to Use

- Before executing any new plan
- When the coordinator identifies work that needs planning
- When the user asks to "make a plan" for upcoming work

---

## Core Principles

1. **Vertical slices** — every chapter delivers visible, testable UI. No backend-only chapters.
2. **One concern per chapter** — if the description needs "and" between two verbs, split it.
3. **Polish is built-in** — animations, feedback, keyboard, empty states are acceptance criteria in every chapter.
4. **Prove the pattern first** — the Foundation chapter builds the pattern on one data source end-to-end. Subsequent chapters extend it.
5. **Research scales to risk** — Foundation chapters get full research. Extensions get none.
6. **Incremental journey** — each chapter extends the same E2E journey test. No separate journey gate.
7. **Per-chapter audit** — proportional to what changed. No separate audit gate for simple plans.

---

## Step 0 — Topic Triage

Classify the overall plan topic (not individual chapters):

| Classification | Criteria | Evidence required |
|---|---|---|
| **Simple** | One clear solution, no real alternatives | Name the solution and explain why alternatives don't exist |
| **Moderate** | 2-3 viable approaches, needs comparison | Name the approaches and the trade-off dimensions |
| **Complex** | Multiple approaches with architectural trade-offs | Name the approaches, systems impacted, risk if you choose wrong |

The triage agent must justify its classification with evidence. The coordinator can override.

---

## Step 1 — Chapter Shaping

After triage, before any research. The coordinator shapes the plan into vertical slices.

### Process

1. List the functional increments — what can the user see or do after each?
2. Apply the one-concern rule — split anything with "and"
3. Order by dependency — each chapter builds on the last
4. Verify: every chapter has UI, every chapter has polish criteria
5. Classify each chapter's complexity tier
6. Define the E2E journey — what each chapter adds to it

### Chapter Complexity Tiers

| Tier | When | Research | Debate |
|---|---|---|---|
| **Foundation** | First chapter. Builds the pattern, makes architectural decisions. | Full (1-2 agents, per plan triage) | Full (if Moderate/Complex topic) |
| **New Capability** | Adds a new interaction or flow to the proven pattern. | Light (1 agent, one scoped question) | None (unless coordinator flags a decision) |
| **Extension** | Wires more data to a proven pattern. No new interactions. | None | None |

### Sizing Test

Can a single subagent implement the chapter in one dispatch without needing a Context Builder? If it needs a Context Builder, the chapter is too large — split it.

### Output

An ordered chapter table with:
- Chapter number, name, tier
- "User can" — one sentence of what's testable after this chapter
- What this chapter adds to the journey test

Present to user for approval before proceeding to research.

---

## Step 2 — Foundation Chapter

The Foundation chapter gets the full treatment. Scale research intensity based on Step 0 triage.

### 2a — Research

| Topic Complexity | Agents | Approach |
|---|---|---|
| **Simple** | 1 research agent | Concrete proposal with evidence |
| **Moderate** | 2 research agents | Different knowledge bases, independent research |
| **Complex** | 2 research agents | Same as moderate, prompts ask agents to discover subtopics |

Knowledge base split (mandatory for 2-agent research): Agent A reads official docs, framework source, API references. Agent B reads GitHub repos, community posts, real-world patterns.

For research quality standards, see: `.claude/skills/flow-research/SKILL.md`

### 2b — Debate (Moderate/Complex only)

| Topic Complexity | Approach |
|---|---|
| **Moderate** | 1 debate round. Moderator challenges points of disagreement. |
| **Complex** | 2+ rounds. Moderator stress-tests at least 4-5 specific points. |

### 2c — Foundation Chapter Plan

Planner drafts the Foundation chapter following `PLAN_TEMPLATE_DEV.md`. Chapter includes:
- "User can" line as the spec
- Critical files table
- Polish criteria
- Journey test increment
- Audit scope

**Review (1 cycle):**
Detail Reviewer + Conciseness Reviewer read the draft → Planner revises → reviewers approve or escalate to user.

---

## Step 3 — Remaining Chapters

Each remaining chapter is planned based on its complexity tier. Research from the Foundation chapter carries forward.

### New Capability chapters

1. **Light Research** — 1 agent, one scoped question about the new capability only.
2. **Plan Draft** — Planner drafts following `PLAN_TEMPLATE_DEV.md`. No review cycles.

### Extension chapters

1. **Plan Draft only** — Planner references the Foundation chapter and lists which data sources are being wired.

---

## Step 4 — Cross-Chapter Review

After all chapter plans are drafted, one review pass across the full plan:

**Reviewer** reads ALL chapter files together and checks:
- Gaps between chapters (does Ch 3 assume something Ch 2 didn't build?)
- Dependency ordering (can each chapter be implemented in order?)
- Journey test progression (does the full journey cover the user flow by the last chapter?)
- Chapters that should be merged (too thin individually)

One revision cycle. If issues remain, defer to user.

---

## Summary Flow

```
Step 0 — Triage: classify plan topic (Simple/Moderate/Complex)

Step 1 — Chapter Shaping:
  List vertical slices → one-concern rule → order → tier each chapter
  Define journey test progression
  Present to user → user approves chapter list

Step 2 — Foundation Chapter (full cycle):
  Research (scaled to triage) → Debate (if needed) →
  Plan + Review (1 cycle)

Step 3 — Remaining Chapters (tiered):
  New Capability: Light research → Plan
  Extension:      Plan only

Step 4 — Cross-Chapter Review:
  Reviewer reads all chapters → 1 revision cycle
```

---

## Quality Checks

Before finalising each plan, verify:

- Every chapter includes its schema changes alongside the UI that uses them
- Every chapter ships with polish in its acceptance criteria
- Extension chapters reference the Foundation chapter, with no new research
- Chapter Shaping runs before any research begins
- Each chapter can be described with a single verb ("browse", "edit", "create")
- Each chapter fits in one subagent dispatch (no Context Builder needed)
- Audits and journey tests are built into each chapter's pipeline
- The "User can" line is the spec — the test writer translates it to tests

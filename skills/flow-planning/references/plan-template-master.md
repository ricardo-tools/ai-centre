# Master Plan Template

> Copy this structure when creating `plan.md` for a new plan folder.
> The master plan is iterated with the user BEFORE any chapter files are created.

---

## Workflow

1. **Create master plan** (`plan.md`) — concise, human-readable
2. **Iterate with user** — refine scope, adjust chapters, confirm decisions
3. **User approves master plan** — explicit confirmation required
4. **Create all chapter files** — every chapter file before implementation begins

---

## Template

```markdown
# Plan NN: [Name]

**Status:** Not started | In progress | Complete
**Created:** YYYY-MM-DD
**Completed:** YYYY-MM-DD (fill when done)
**Depends on:** [Previous plan, or "None"]

---

## Scope

[2-3 sentences: what this plan delivers and why it matters]

## Context

[What exists now. What problem this solves. What the end state looks like.]

---

## Decisions

Decisions are recorded here, in the master plan. Key decisions transfer to
`.plans/LOG.md` when the plan completes (for future agent context).

### D1: [Decision title]

**Decision:** [What was decided — one clear sentence]
**Rationale:** [Why this over alternatives — one clear sentence]
**Consequence:** [What follows from this decision — one clear sentence]

---

## Chapter Shaping Rules

1. **Vertical slices** — every chapter delivers visible, testable UI.
   Schema changes belong in the chapter that uses them.
2. **One concern** — if the description needs "and" between two verbs, split it.
3. **Polish built-in** — animations, feedback, keyboard, empty states are
   acceptance criteria in every chapter.
4. **Prove then extend** — the Foundation chapter builds the pattern on one
   data source. Extension chapters wire more data to it.
5. **Sizing test** — can one subagent implement it without a Context Builder?
   If not, split.
6. **Incremental journey** — each chapter extends the same E2E journey test.
   By the last chapter, the test covers the full user flow.
7. **Per-chapter audit** — audit checks run proportional to what changed.
   Global audit chapter only if plan has 5+ chapters and touches
   cross-cutting concerns (auth, security, shared components).

### Tier Definitions

| Tier | Research | Debate | Test Review |
|---|---|---|---|
| Foundation | Full | If moderate/complex | Full |
| New Capability | Light (1 agent, 1 question) | None | Scoped |
| Extension | None | None | Minimal |

---

## Chapters

Every chapter is a vertical slice — schema through UI — delivering one
testable increment.

| Ch | Name | Tier | User can | Status |
|---|---|---|---|---|
| 0 | [Name] | Foundation | [What the user can see/do after] | Not started |
| 1 | [Name] | New Capability | [What the user can see/do after] | Not started |
| 2 | [Name] | Extension | [What the user can see/do after] | Not started |
| ... | ... | ... | ... | ... |
| C | Closing | — | — | Not started |

### Chapter 0: [Name]
> [ch0-kebab-name.md](ch0-kebab-name.md)

**Tier:** Foundation
**User can:** [One sentence — what's testable in the browser]

[1-2 sentences: what this chapter delivers.]

### Chapter 1: [Name]
> [ch1-kebab-name.md](ch1-kebab-name.md)

**Tier:** New Capability
**User can:** [One sentence]

[1-2 sentences]

### Closing
> [chC-closing.md](chC-closing.md)

Update PROJECT_REFERENCE.md, update LOG.md, validate both against
the codebase. Pure documentation — no code changes.

---

## Dependency Graph

```
Ch 0 (Name) [F] ──→ Ch 1 (Name) [NC] ──→ Ch 2 (Name) [E]
```

[F] = Foundation  [NC] = New Capability  [E] = Extension

---

## E2E Journey

The journey test starts in Ch 0 and grows incrementally. Each chapter
extends the same .spec.ts file with new assertions matching its "User can".

```gherkin
Rule: [Business rule this journey validates]

  Background:
    Given [prerequisites — logged in user, API keys, seeded data]

  Scenario: [End-to-end user journey name]
    # Goal: [What the user is trying to accomplish]

    # ── Ch 0 adds: ──
    When [user action from Ch 0]
    Then [observable result from Ch 0]

    # ── Ch 1 adds: ──
    When [user action from Ch 1]
    Then [observable result from Ch 1]

    # ── Ch N adds: ──
    # ... continues until the full journey is covered
```

### When to include vs skip

- **Include** when the plan builds a user-facing feature with a clear start→finish flow
- **Skip** when the plan is pure refactoring or infrastructure with no user journey
- **Each chapter adds its slice** — never rewrite the whole test

---

## Not in Scope

- [What's explicitly excluded]

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
  If corrections needed → fix → re-validate.

Done when validator confirms both docs match the codebase.
```

---

## Rules

### Human-readable first

The master plan is for humans to review and discuss. Clear headings, whitespace, short paragraphs.

### Decisions live in the master plan

No separate `decisions.md`. Decisions are numbered (D1, D2...) with Decision, Rationale, Consequence. Transfer to LOG.md on plan completion.

### Concise chapter descriptions

1-2 sentences per chapter in the master plan. The "User can" line is the spec.

### All chapter files created before implementation

Every chapter file exists as a complete plan before the first line of code.

---

## Quality Checks

Before finalising the plan, verify:

- Every chapter delivers visible, testable UI
- Every chapter includes polish in its acceptance criteria
- Chapter descriptions are 1-2 sentences + "User can" line
- Master plan is approved by user before creating chapter files
- All chapter files are created before implementation begins
- Per-chapter audits are proportional to what changed

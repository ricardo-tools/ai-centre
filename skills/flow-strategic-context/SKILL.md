---
name: flow-strategic-context
description: "Opinion companion for flow. Knowledge persistence across AI sessions. Dispatch-count checkpointing, phase-boundary compaction, decision history. Coordinator checkpoints every 10 dispatches and at every phase boundary."
---

# Flow: Strategic Context

Opinion companion for **flow** (core). Knowledge persistence across sessions and within long coordinator sessions.

**Coordinator trigger:** Checkpoint every 10 subagent dispatches (at the next scenario/phase boundary) and at every phase boundary. See `PLAN_TEMPLATE_DEV.md` Context Management section.

**Post-delivery trigger:** Checkpoint decisions and context AFTER all implementation is complete — capture what was decided and why so the next session has full context.

Convert ephemeral knowledge into persistent artifacts at strategic moments — control *when* compaction happens and *what survives*.

---

For project-level persistence (feature map, decision log), see **project-reference**. This skill covers session-level context management.

## When to Use

Apply this skill when:
- The coordinator has dispatched 10 subagents since the last checkpoint
- A phase boundary is reached (Phase 1 → Phase 2, all scenarios → audit gates)
- The model forgets a constraint stated earlier (emergency checkpoint)
- The model re-suggests an approach already rejected (emergency checkpoint)
- Before any intentional compaction

---

## Core Rules

### 1. Persist what's ephemeral and expensive to recover

Not all knowledge is equal. Some is cheap to re-acquire (re-read a file). Some is impossible to recover (why an approach was rejected). Focus persistence effort on the expensive and impossible.

| Recovery cost | Examples | Action |
|---|---|---|
| **Free** | File contents, git state, build output | Let go — re-read on demand |
| **Cheap** (1–3 tool calls) | Project structure, test results, specific file contents | Let go — re-derive quickly |
| **Expensive** (10+ tool calls) | Architectural understanding, data flow mapping, which files are relevant | Persist to checkpoint file |
| **Impossible** | Rejected approaches and why, user corrections, debugging hypotheses ruled out, nuanced requirement interpretations | Persist immediately |

### 2. Checkpoint at dispatch budgets and phase boundaries

The coordinator compacts at two triggers — whichever comes first:

| Trigger | When | Where to checkpoint |
|---|---|---|
| **10 dispatches** | At the next scenario or phase boundary after the 10th dispatch | `.claude/.strategic-context/` |
| **Phase boundary** | After completing each phase (e.g., all Phase 1 scenarios done) | `.claude/.strategic-context/` |
| **Emergency** | Model contradicts earlier decisions or re-suggests rejected approaches | `.claude/.strategic-context/` |

**Never checkpoint mid-step.** If dispatch 10 lands on an implementer, finish the implementer → test runner → checkpoint before the next scenario's test writer.

### 3. `.claude/.strategic-context/` is the checkpoint location

Session-scoped checkpoint files live in `.claude/.strategic-context/`. This directory is **gitignored** — files are ephemeral, existing only to survive compaction within a session.

Write one file per checkpoint, named by chapter and dispatch count:
```
.claude/.strategic-context/ch27-dispatch-10.md
.claude/.strategic-context/ch27-phase2.md
```

Do **not** write session state to CLAUDE.md — CLAUDE.md is committed and should contain only durable instructions, not ephemeral progress.

### 4. Rejected approaches are the highest-value ephemeral knowledge

When an approach is tried and abandoned, the reasoning behind the rejection exists only in conversation. After compaction, the model will re-suggest the same failed approach — wasting time and tokens.

Always write down: *"We tried X. It failed because Y. Don't retry."*

### 5. Proactive beats reactive

Don't wait for quality to degrade. Context pressure degrades output gradually (less nuance, missed edge cases) before falling off a cliff (hallucinated paths, contradictory outputs, forgotten constraints). By the time you notice the cliff, you've already lost context.

The 10-dispatch budget exists to force proactive checkpoints before the cliff.

---

## Checkpoint Content

A checkpoint converts the session's ephemeral value into a durable file. Between checkpoints, the conversation is a working scratchpad that can be safely discarded.

```markdown
## Checkpoint: Ch 27, after Phase 1 (dispatch 8)

### Completed
- Phase 1: Post-login redirect fix. Integration + E2E tests pass.
- Scenarios S1 (integration) and S2 (E2E) both green.

### Next
- Phase 2: Persona card heading navigation fix (1 E2E scenario)
- Phase 3: Verify both journey tests pass

### Decisions
- Scoped login E2E assertion to content heading (was matching multiple elements)
- PersonaForm htmlFor/id added for a11y + Playwright testability

### Rejected approaches
- Tried `getByText('ricardo.admin')` for post-login verification — matches 6 elements on /content page (owner column). Use heading instead.

### Active constraints
- Build with NODE_ENV=test for Playwright (next start forces production)
- Don't delete .next unless build-affecting files changed

### Test state
- 446 vitest, 22 E2E (login + personas updated, journey tests not yet run)
```

### After checkpointing

Compact with a focus hint referencing the checkpoint file:

```
/compact Continuing Ch 27 Phase 2. Checkpoint at .claude/.strategic-context/ch27-phase1.md
```

After compact, **re-read the chapter plan and methodology** before continuing. Do not rely on compressed context for compliance.

---

## Coordinator Session Structure

```
Start session → CLAUDE.md + LOG.md load automatically
    ↓
Read chapter plan, extract methodology
    ↓
Phase 1, Scenario 1: Steps 1–4a (dispatches 1–5)
    ↓
Phase 1, Scenario 2: Steps 1–4a (dispatches 6–10)
    ↓
!! DISPATCH BUDGET HIT — checkpoint + /compact
    ↓
Re-read chapter plan + methodology
    ↓
Steps 4b–5 (dispatches 11–13)
    ↓
!! PHASE BOUNDARY — checkpoint + /compact
    ↓
Re-read chapter plan + methodology
    ↓
Phase 2... (dispatch counter resets after compact)
    ↓
Steps 6–9 (audits, compliance, logs)
    ↓
Chapter complete — stop. New session for next chapter.
```

### One chapter per session

After completing a chapter (Step 9 confirms logs accurate), **stop**. Start a new session for the next chapter. The fresh context window forces a clean re-read of the plan and methodology.

If a chapter balloons beyond expectations (like Ch 27's 30+ dispatches), the dispatch budget checkpoints keep the coordinator sharp. But the root cause is usually inadequate upfront investigation — address that in planning, not by extending sessions.

---

## What Survives Compaction

| Survives intact | Compressed into summary | Lost entirely |
|---|---|---|
| CLAUDE.md content | What files were read and changed | Nuanced reasoning chains |
| Checkpoint files on disk | Decisions discussed | Why alternatives were rejected |
| Git history | Errors encountered | User's tone and style preferences |
| Todo list | Task progress context | Intermediate hypotheses |
| LOG.md, PROJECT_REFERENCE.md | Conversation flow | Verbal corrections not in files |

The summary is lossy — it captures *what happened* but not *why* or *what was considered and dismissed*. This is why persisting rejected approaches and constraints to checkpoint files is non-negotiable.

---

## Banned Patterns

- Writing session state to CLAUDE.md — use `.claude/.strategic-context/` instead
- Compacting mid-step (between implementer and its test runner) — finish the step first
- Skipping the post-compact re-read of chapter plan and methodology
- Exceeding 10 dispatches without checkpointing (the budget is a hard limit, not a suggestion)
- Relying on conversation memory for rejected approaches — write to checkpoint file
- Running multiple chapters in one session — stop after Step 9

---

## Quality Gate

Before compacting, verify:

- [ ] Checkpoint file written to `.claude/.strategic-context/` with: done, next, decisions, rejected, constraints, test state
- [ ] Rejected approaches documented with reasons
- [ ] Active constraints persisted ("do NOT do X because Y")
- [ ] In-progress code committed or changes are safe to re-derive
- [ ] No active debugging session with unresolved hypotheses
- [ ] Dispatch count noted in checkpoint filename

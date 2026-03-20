---
name: strategic-context
description: >
  Patterns for managing AI assistant context across long sessions. Covers when
  to compact, what to persist before compaction, how to structure work to
  minimise context loss, and what's safe to let go. Apply during long coding
  sessions, multi-phase tasks, or when output quality begins to degrade.
---

# Strategic Context Management

Convert ephemeral knowledge into persistent artifacts at strategic moments — control *when* compaction happens and *what survives*.

---

For project-level persistence (feature map, decision log), see **project-reference**. This skill covers session-level context management.

## When to Use

Apply this skill when:
- Working through a multi-phase task (research → plan → implement → verify)
- Past ~30–40 substantive exchanges in a session
- The model forgets a constraint you stated earlier
- The model re-suggests an approach you already rejected
- Switching focus from one task area to another
- Before any intentional compaction

---

## Core Rules

### 1. Persist what's ephemeral and expensive to recover

Not all knowledge is equal. Some is cheap to re-acquire (re-read a file). Some is impossible to recover (why an approach was rejected). Focus persistence effort on the expensive and impossible.

| Recovery cost | Examples | Action |
|---|---|---|
| **Free** | File contents, git state, build output | Let go — re-read on demand |
| **Cheap** (1–3 tool calls) | Project structure, test results, specific file contents | Let go — re-derive quickly |
| **Expensive** (10+ tool calls) | Architectural understanding, data flow mapping, which files are relevant | Persist to a file |
| **Impossible** | Rejected approaches and why, user corrections, debugging hypotheses ruled out, nuanced requirement interpretations | Persist immediately |

### 2. Compact at phase boundaries, never mid-task

Each work phase produces a persistent artifact. The reasoning that produced it can be safely discarded.

| Phase | Persistent output | Safe to compact after? |
|---|---|---|
| Research / explore | Findings written to file | Yes |
| Plan | Plan written to file or tasks | Yes |
| Implement | The code itself (committed) | Yes |
| Verify | Test results, build status | Yes |
| Mid-implementation | Partial changes, mental model of in-progress work | **No** |
| Debugging (unresolved) | Hypotheses, partial diagnosis | **No** |

### 3. CLAUDE.md is the primary persistence layer

CLAUDE.md is re-read automatically on every turn. Anything written there survives compaction intact. Use it for:
- Constraints discovered during the session ("do NOT use X because Y")
- Architectural decisions made ("we chose approach A over B because...")
- Active work state ("currently implementing X, completed Y, blocked on Z")

### 4. Rejected approaches are the highest-value ephemeral knowledge

When an approach is tried and abandoned, the reasoning behind the rejection exists only in conversation. After compaction, the model will re-suggest the same failed approach — wasting time and tokens.

Always write down: *"We tried X. It failed because Y. Don't retry."*

### 5. Proactive beats reactive

Don't wait for quality to degrade. Context pressure degrades output gradually (less nuance, missed edge cases) before falling off a cliff (hallucinated paths, contradictory outputs, forgotten constraints). By the time you notice the cliff, you've already lost context.

Checkpoint proactively at natural breakpoints — after completing a milestone, after making a key decision, before starting a complex change.

---

## Checkpointing

A checkpoint converts the session's ephemeral value into durable artifacts. Between checkpoints, the conversation is a working scratchpad that can be safely discarded.

### When to checkpoint

- After completing a research or exploration phase
- After making a significant architectural decision
- Before starting a risky or complex change
- When you've been going for 30+ exchanges
- Before any intentional compaction

### What a checkpoint contains

Write to CLAUDE.md, a project notes file, or structured code comments:

```markdown
## Current Work (session checkpoint)
- Completed: skill showcase API integration, prompt template
- In progress: HTML sanitisation and caching
- Next: rate limiting for Claude API calls
- Blocked on: nothing currently

## Decisions Made
- Showcase HTML is generated on publish, cached in DB — not regenerated per render
- Using DOMPurify with explicit tag allowlist for AI-generated HTML
- Chose Sonnet over Haiku for showcase generation — quality matters more than cost here

## Rejected Approaches
- Tried generating showcase at page render time — too slow (3-5s), visible to user
- Tried storing showcase as markdown instead of HTML — lost layout fidelity

## Active Constraints
- Published skill_versions rows are immutable — never update content on published
- AI-generated HTML is untrusted — always sanitise before rendering
```

### After checkpointing

Compact with confidence. The summary will carry compressed context, and the checkpoint file provides full detail for anything the summary misses.

Use `/compact` with a focus hint: `/compact Continuing with rate limiting for Claude API showcase generation`

---

## Session Structure

The optimal pattern: work in checkpoint-to-checkpoint sprints.

```
Start session → CLAUDE.md loads automatically
    ↓
Research / explore
    ↓
✓ CHECKPOINT — write findings to file
    ↓
Plan approach
    ↓
✓ CHECKPOINT — write plan to file or tasks
    ↓
Implement
    ↓
Verify (test, build)
    ↓
Commit with descriptive message
    ↓
✓ CHECKPOINT — update current work state
    ↓
Compact (or new session if switching tasks entirely)
    ↓
Repeat
```

### Compact vs new session

| Signal | Action |
|---|---|
| Continuing the same task, need some continuity | `/compact` — summary preserves compressed context |
| Switching to a fundamentally different task | New session — clean context is better than compressed irrelevant context |
| Quality is fine but approaching 40+ exchanges | Proactive `/compact` with checkpoint |
| Model contradicts earlier decisions | Immediate checkpoint + `/compact` |

---

## What Survives Compaction

| Survives intact | Compressed into summary | Lost entirely |
|---|---|---|
| CLAUDE.md content | What files were read and changed | Nuanced reasoning chains |
| Files on disk | Decisions discussed | Why alternatives were rejected |
| Git history | Errors encountered | User's tone and style preferences |
| Todo list | Task progress context | Intermediate hypotheses |
| Memory files | Conversation flow | Verbal corrections not in files |

The summary is lossy — it captures *what happened* but not *why* or *what was considered and dismissed*. This is why persisting rejected approaches and constraints to files is non-negotiable.

---

## Banned Patterns

- ❌ Relying on conversation memory for important constraints → write to CLAUDE.md or a file
- ❌ Compacting mid-implementation with uncommitted changes → commit or checkpoint first
- ❌ Compacting during active debugging with unresolved issues → persist diagnosis state first
- ❌ Waiting for quality cliff before compacting → proactive checkpoint at 30–40 exchanges
- ❌ Persisting things that are cheap to re-read (file contents, git state) → focus effort on what's expensive or impossible to recover
- ❌ Starting a new task in a session loaded with stale context → compact or new session

---

## Quality Gate

Before compacting, verify:

- [ ] Key decisions written to CLAUDE.md or project file (not just discussed in conversation)
- [ ] Rejected approaches documented with reasons
- [ ] Active constraints ("do NOT do X because Y") persisted to a file
- [ ] Current work state captured: what's done, what's in progress, what's next
- [ ] In-progress code committed (even as WIP) or changes are safe to re-derive
- [ ] No active debugging session with unresolved hypotheses

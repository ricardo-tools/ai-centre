# Park Template

> Use this structure when writing a park entry to `.plans/LOG.md`.
> The park entry is a complete context-loading document for a fresh agent.
> Every section is part of the loading sequence. The agent ticks checkpoints
> as it absorbs each section. Once all checkpoints are ticked, the park entry
> is consumed and replaced with a session-start note.

---

## Template

```markdown
## Parked Session — YYYY-MM-DD

**Plan:** [plan number] — [plan name]
**Position:** [where work stopped — chapter, phase, step, or "pre-implementation"]

**Instructions for next agent:** Read this entire park entry top to bottom. Tick each checkpoint as you absorb that section. Once ALL checkpoints are ticked, remove this park entry from LOG.md, note "Session resumed YYYY-MM-DD from parked [plan name]" in its place, and proceed with First Actions at the bottom.

---

### 1. Agent Rules

[Behavioral constraints that emerged from user feedback during the session.
These govern HOW the agent works, not WHAT it builds.
Only include rules that are NOT already in CLAUDE.md — session-specific corrections and preferences.]

- [Rule from user correction or preference]
- [Rule from user correction or preference]

- [ ] **Checkpoint 1:** Agent rules absorbed.

---

### 2. Plan Files

[Pointers to plan files with one-line descriptions of what each provides.
Tell the agent what to read and what to skim.]

- `[path to plan.md]` — [what it contains and why to read it]
- `[path to current/next chapter]` — [what it contains]
- [Skim / deep-read guidance for remaining chapters]

- [ ] **Checkpoint 2:** Plan files read. I understand the decisions, chapters, and dependencies.

---

### 3. Codebase State

[Files the agent must read to understand the current state of code that this plan touches.
Include WHY each file matters — what changes are coming to it.]

- `[path]` — [what it is and what changes are planned]
- `[path]` — [what it is and what changes are planned]

- [ ] **Checkpoint 3:** Codebase files read. I know the current state of all affected code.

---

### 4. Uncommitted Work

[Run git status and document every uncommitted change with its intent.
Flag anything that's obsolete, conflicts with the plan, or needs user input.]

| File | Status | What it is | Action needed |
|---|---|---|---|
| `[path]` | Modified/New/Deleted | [What the change does] | [Commit / Revert / Ask user / Keep as-is] |

**Production state:** [Is prod green? Any known issues? Debug endpoints?]
**Branch:** [current branch]

- [ ] **Checkpoint 4:** Git status checked. I know what's uncommitted and what to ask about.

---

### 5. Session Context

[This is the core of the park — knowledge from CONVERSATIONS that isn't captured
in plan files or the codebase. Organize by topic.]

[For technical research, use structured format:]

**[Topic heading]:**
- FINDING: [factual discovery]
- SOURCE: [where this was confirmed]
- IMPLICATION: [how this affects the plan or implementation]

[For discussion outcomes and decisions:]

**[Topic heading]:**
- [Discussion outcome or context that shaped decisions]
- [Why a particular approach was chosen over alternatives]

**Rejected approaches:**
- [Approach] — rejected because [specific reason with evidence]. Don't re-investigate.
- [Approach] — rejected because [specific reason with evidence]. Don't re-investigate.

- [ ] **Checkpoint 5:** Session context absorbed. I understand what was researched, discussed, and rejected.

---

### 6. Prerequisites

[Manual steps the USER must complete before the agent can implement.
These are things the agent cannot do — account setup, API keys, external config.
Omit this section entirely if there are no prerequisites.]

- [ ] [Prerequisite with enough detail for the user to act on]
- [ ] [Prerequisite with enough detail for the user to act on]

- [ ] **Checkpoint 6:** Prerequisites reviewed. I know which items to confirm with the user.

---

### 7. First Actions

[Ordered steps for the agent to take after all checkpoints are ticked
and the park entry has been consumed.]

1. [First thing to do — often asking about uncommitted work or prerequisites]
2. [Second thing to do]
3. [Begin implementation — which chapter, which step]

- [ ] **Checkpoint 7:** First actions understood. Ready to begin.
```

---

## Guidelines

### What goes in Session Context vs Plan Files

| In session context (park) | In plan files |
|---|---|
| Research findings from web searches | What to build (chapters, scenarios) |
| User discussion outcomes and reasoning | How to build it (data flow, state spec) |
| Rejected approaches with evidence | Architecture decisions (D1, D2...) |
| Technical gotchas discovered mid-session | Edge cases and test hints |
| User preference corrections | Critical files and audit scope |

**Rule of thumb:** If a fresh agent would waste time rediscovering it, it belongs in session context. If it describes the implementation spec, it belongs in the plan file.

### Checkpoint granularity

Each checkpoint covers ONE section. The agent must absorb the section before ticking. This prevents the agent from skipping context and jumping straight to implementation.

### Length

No arbitrary limit. Every line must earn its place — but completeness beats brevity. A park entry that prevents the next agent from going in circles for 20 minutes is worth 200 lines.

### Examples

**Good agent rule (specific, from user correction):**
```
- Don't guess at API behavior. When the user says "research", they mean web search, not reasoning from training data.
```

**Bad agent rule (generic, already in CLAUDE.md):**
```
- Write clean code.
```

**Good session context (specific finding with source):**
```
FINDING: Vercel Edge Middleware does NOT run on _next/static/* by default.
SOURCE: Vercel Middleware docs
IMPLICATION: Static assets bypass JWT validation. Acceptable for internal tool — JS/CSS chunks are useless without the HTML shell.
```

**Bad session context (vague, no source):**
```
- Vercel middleware has some limitations with static files.
```

**Good rejected approach (prevents re-investigation):**
```
- Sandpack/Nodebox — rejected because it's SLOWER than StackBlitz for Next.js. CDN dep caching only helps the in-browser bundler (simple React), not Nodebox (full Node). Source: Sandpack docs, developer benchmarks.
```

**Bad rejected approach (agent might re-investigate):**
```
- Sandpack — didn't work for our use case.
```

**Good uncommitted work entry:**
```
| ShowcaseViewerWidget.tsx | Modified | Removed fake StackBlitz loading phases, added iframe polling for fullscreen. Potentially obsolete — Ch 9 removes all StackBlitz code. | Ask user: commit or revert? |
```

**Bad uncommitted work entry:**
```
| ShowcaseViewerWidget.tsx | Modified | Some changes | TBD |
```

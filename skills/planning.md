---
name: planning
description: >
  The discipline of planning before execution in AI-human collaborative
  development. Plans serve two audiences simultaneously: the human who evaluates
  and approves, and the AI agent who executes. Teaches structured planning with
  progressive elaboration, phase gates, dependency marking, and failure
  classification. Principle-focused — not tied to any domain or tool.
---

# Planning

A plan is a communication device, not a prediction. It exists so two parties — a human and an AI agent — can agree on what will happen, in what order, and how they'll know it worked. The human reads the plan to evaluate the approach. The agent reads the plan to execute the steps. If the plan doesn't serve both audiences, it's a document, not a plan.

Good plans are short, scannable, and honest about uncertainty. They front-load the important decisions, defer the details that don't matter yet, and create explicit checkpoints where the human can steer. Bad plans are long, detailed everywhere equally, and give the illusion of certainty about things nobody can predict.

---

## When to Use

**Trigger:** Work that spans multiple files, has dependencies between steps, includes irreversible actions, or would benefit from human review at intermediate points.

**Scale by task size:**

| Task size | Planning approach |
|---|---|
| One-liner (rename, typo fix) | No plan. Just do it. |
| Small (1-3 files) | State the plan in 2-3 lines before starting. |
| Medium (4-10 files) | Structured plan with phases. Present for approval. |
| Large (10+ files) | Full plan with phases, gates, parallelisation, rollback points. |

**Do NOT over-plan:** A 3-file change does not need a 20-step plan. Proportionality is a core principle — the plan should be smaller than the work it describes.

---

## Core Rules

### 1. BLUF first — Bottom Line Up Front

Every plan opens with two things: what will be built, and what the human needs to approve. A human scanning headings alone should get the full picture in 10 seconds. If they have to read three paragraphs before understanding the plan's purpose, the plan has failed.

The BLUF is not a summary — it's the decision point. It answers: "Should we proceed in this direction?"

### 2. Commander's intent — the desired end state

A plain-language statement of what success looks like when everything is done. One sentence. Always present. If the plan breaks down, if steps need to be improvised, if an agent loses context mid-execution — the intent is the North Star. Any agent can improvise as long as they move toward the intent.

```
Intent: Users can browse, search, and download skills from a self-service library
        without needing admin assistance.
```

Not a list of features. Not a technical specification. The end state in human terms.

### 3. Three levels of detail

Plans have exactly three levels of detail. No more, no fewer.

**Level 1 — Goal:** One sentence. What success looks like. The human reads this to decide if the plan is even worth reviewing.

**Level 2 — Phases:** 3-7 major work streams. Each phase has a name and a one-line intent. The human reads phases to evaluate the approach and ordering.

**Level 3 — Steps:** Concrete actions within each phase. 3-5 steps per phase is the sweet spot. Each step has completion criteria. The agent reads steps to execute.

Human reads levels 1-2 to evaluate approach. Agent reads levels 2-3 to execute. This separation is intentional — don't blur the levels.

### 4. Progressive elaboration — detail only what's next

Detail the current phase to executable steps. Outline the next phase to subgoals. Name future phases with one-line intent only. Never detail everything upfront — far-future detail is waste because it will change when you learn from earlier phases.

Re-elaborate at each phase boundary. When Phase 1 completes, expand Phase 2 to full steps based on what you now know. This is not a failure of planning — it's the plan working as designed.

```
# Good — progressive elaboration
Phase 1: Schema design (fully elaborated — 5 steps with criteria)
Phase 2: API layer (subgoals listed — will elaborate after Phase 1)
Phase 3: UI integration (one-line intent — too early to detail)

# Bad — uniform detail everywhere
Phase 1: Schema design (5 detailed steps)
Phase 2: API layer (5 detailed steps based on assumptions)
Phase 3: UI integration (5 detailed steps based on assumptions about assumptions)
```

### 5. Mark dependencies and parallelisation explicitly

Independent steps must be marked as parallelisable. Sequential dependencies must be declared. Never leave ordering implicit — the executor will assume sequential unless told otherwise.

**Notation:**
- `[parallel: A, B, C]` — these steps have no dependencies on each other, execute in any order
- `[sequential: A -> B -> C]` — each step depends on the previous one's output

The critical path is the longest sequential chain. It determines the minimum time to completion. Everything not on the critical path can be parallelised.

```
[parallel: 1.1, 1.2, 1.3]
- 1.1 Create database migration — done when: migration file passes dry-run
- 1.2 Add TypeScript types — done when: types compile with strict mode
- 1.3 Write seed data — done when: seed script runs without errors
[sequential: 1.1 -> 1.4]
- 1.4 Run migration — depends on 1.1 — done when: schema matches expected state
```

### 6. Gates at phase boundaries

Gates are checkpoints where the human reviews before the agent continues. Every plan has 2-4 gates — placed at phase transitions and before irreversible actions.

**Four types of gates:**

| Gate type | When to use | Example |
|---|---|---|
| Scope gate | Confirm approach before investing effort | "Review schema design before building API" |
| Quality gate | Review output meets standards | "Verify all components pass type-check and render" |
| Risk gate | Before irreversible actions | "Approve migration before running against production" |
| Decision gate | Human must choose between options | "Pick Option A or B for the caching strategy" |

Gate criteria must be verifiable, not vague. "Review the code" is not a gate — there's no pass/fail. "All new components render in Light and Night themes without visual defects" is a gate.

### 7. Every step has completion criteria

The agent must be able to determine "am I done?" without ambiguity. Completion criteria are the contract between the plan and the executor.

```
# Bad — vague
- Implement the login form
- Set up the database
- Add error handling

# Good — verifiable
- Create LoginForm component that renders email + OTP inputs and passes type-check
- Run migration; verify users table exists with all columns matching schema
- All server actions return Result<T, E>; no unhandled promise rejections in dev console
```

If you can't write completion criteria for a step, the step isn't well-defined enough. Break it down further or research it first.

### 8. One step, one concern — and match granularity to task size

Each step modifies one logical unit. "Update schema and adjust API" is two steps. "Add validation and write tests" is two steps. Atomic steps reduce error propagation and enable clean rollback — if step 3 fails, you know exactly what to undo. The test: if you'd make two separate commits for it, it's two steps.

Proportionality applies to the plan itself — over-planning wastes time, under-planning causes drift:

| Task size | Files touched | Plan format |
|---|---|---|
| Trivial | 1 | No plan. Execute directly. |
| Small | 1-3 | 2-3 line inline plan. No phases. |
| Medium | 4-10 | Phases + steps + 1-2 gates. Present for approval. |
| Large | 10+ | Full plan: BLUF, intent, phases, steps, gates, parallelisation, risks. |

When in doubt, start lighter. Elaborate if the work turns out more complex than expected.

### 9. Commit after each step

Every completed step results in a checkpoint — a git commit or equivalent. This is non-negotiable for medium and large tasks. Benefits:

- **Rollback:** If step 5 breaks something, revert to step 4's commit
- **Audit trail:** The commit history tells the story of execution
- **Session resilience:** If the agent loses context, the commit messages reconstruct the plan's progress

Commit messages should reference the step: `"Phase 1, step 1.3: Add seed data for skills table"`.

### 10. Present options at decision points

When the plan encounters genuine alternatives, present 2-3 options with explicit tradeoffs. Options invite evaluation; single proposals invite rubber-stamping.

```
# Decision: Caching strategy

Option A: In-memory cache (Map)
  + Simple, no dependencies
  - Lost on restart, no sharing between serverless functions

Option B: Redis via Upstash
  + Persistent, shared across functions
  - New dependency, cost, latency

Option C: Next.js unstable_cache
  + Framework-native, zero config
  - Unstable API, limited invalidation control

Recommendation: Option C for now (simplest), migrate to B if we need cross-function sharing.
```

Never present more than 3 options. If there are more, pre-filter to the top 3.

### 11. Separate invariants from variables

**Invariants** hold regardless of which approach you choose: existing schema constraints, backward compatibility requirements, security rules, the tech stack. **Variables** can flex: UI approach, implementation order, library choice within a category.

When re-planning after a failure or change of direction:
- **Preserve invariants** — they don't change
- **Revise variables** — they're the lever you pull

Making this explicit prevents re-planning from accidentally violating a hard constraint.

### 12. Failure classification

Not all failures are equal. Classify before reacting.

| Failure type | Definition | Response |
|---|---|---|
| Retry-able | Transient issue (network timeout, flaky test) | Try the same step again. Max 2 retries. |
| Revisable | Wrong approach (API doesn't support this method) | Try a different approach to the same goal. |
| Blocking | Invalidates the plan (requirement changed, dependency broken) | Stop. Escalate to human with diagnosis. |

**Never retry the same approach more than twice.** If an agent fails a step twice with the same method, it's not transient — it's revisable or blocking. Escalate with a diagnosis: what was tried, what happened, why it likely failed.

### 13. Plans contain their own update protocol

Every plan specifies the conditions under which it should be revised. This is not optional — plans without update protocols become stale commitments that nobody questions.

Include at the end of every medium+ plan:

```
Re-evaluate if: [conditions that invalidate the plan]
Preserve: [invariants that hold regardless]
Revise: [variables that can change]
```

At each phase boundary, the agent reports unexpected observations. Material deviations — anything that changes the approach, timeline, or scope — trigger re-planning. Minor deviations get noted and absorbed.

---

## Plan Template

```
## BLUF
[What will be built. What needs approval.]

## Intent
[Desired end state in one sentence.]

## Phases

### Phase 1: [Name]
[parallel: 1.1, 1.2] [sequential: 1.3 -> 1.4]
- 1.1 [Step] — done when: [criteria]
- 1.2 [Step] — done when: [criteria]
- 1.3 [Step] — depends on 1.1, 1.2 — done when: [criteria]
- 1.4 [Step] — done when: [criteria]
**Gate:** [What to review before Phase 2]

### Phase 2: [Name] (elaborate when Phase 1 completes)
[One-line intent]

### Phase 3: [Name]
[One-line intent]

## Risks
[What could go wrong. Rollback triggers.]

## Update protocol
Re-evaluate if: [conditions]
Preserve: [invariants]
Revise: [variables]
```

---

## Banned Patterns

- Planning everything upfront with equal detail — far-future phases get one-line intent only. Detail is earned by proximity.
- Plans with no completion criteria — "implement X" without defining done is a wish, not a step.
- Single-proposal plans for strategic decisions — present 2-3 options with tradeoffs at decision points.
- Plans without gates — all-or-nothing execution gives the human no steering points.
- Retrying a failed step more than twice without escalating — two failures with the same approach means it's not transient.
- Plans that don't specify what's parallelisable — forces unnecessary sequential execution and wastes time.
- Plans without an intent statement — agents can't improvise when the plan breaks if they don't know the destination.
- Over-planning trivial tasks — a 3-file change doesn't need a 20-step plan. Match granularity to task size.

---

## Quality Gate

Before presenting a plan, verify:

1. **BLUF is scannable** — a human gets the full picture from the first two lines without reading further
2. **Intent exists** — one sentence, plain language, describes the end state
3. **Phases are 3-7** — fewer means the plan is too coarse, more means it's fragmented
4. **Steps have completion criteria** — every step answers "done when:" with something verifiable
5. **Dependencies are explicit** — parallel and sequential notation is present wherever steps relate
6. **Gates are placed** — 2-4 gates at phase transitions and before irreversible actions
7. **Current phase is elaborated, future phases are not** — progressive elaboration is applied
8. **Granularity matches task size** — the plan is proportional to the work
9. **Update protocol exists** — re-evaluate conditions, invariants, and variables are named

After completing a planned task, verify:

10. **Intent achieved** — does the outcome match the commander's intent, not just the steps?
11. **No skipped steps without explanation** — if the plan was deviated from, was it updated?
12. **No unplanned side effects** — did the work change anything outside the planned scope?
13. **Project reference updated** — feature map, constraints, decisions reflect the new state
14. **Roadmap updated** — item marked complete with date, parking lot items captured

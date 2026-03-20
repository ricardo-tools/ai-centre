---
name: quality-assurance
description: >
  Quality as a discipline — from philosophy to practice. Covers what quality is,
  how humans perceive it, quality dimensions (trust, effectiveness, reliability,
  emotion, craft), and how quality flows from user experience down to code and
  back. Apply this skill as an architectural lens on every decision — what to
  build, how to build it, and how to verify it serves the user.
---

# Quality Assurance

Quality is not testing. Testing is one tool in service of quality. Quality is the alignment between what someone needs, what was built, and how it feels to use — sustained over time.

Quality flows in two directions. Top-down: the user has a job, they interact with the product, and it either helps them or fails them. Bottom-up: the code is sound or fragile, the architecture enables change or resists it, and these properties eventually surface as the user's experience. These are not separate concerns — they are the same quality flowing through different layers.

---

## When to Use

Apply this skill when:
- Making any design or architecture decision (ask: how does this affect quality for the user?)
- Planning what to test and at what level
- Evaluating whether a feature is "done"
- Reviewing code or UI for quality
- Deciding where to invest effort when time is limited
- Setting quality standards for a project or team

This skill defines the **thinking**. For specific practices, see:
- **verification-loop** — the mechanical process of checking work
- **eval-driven-development** — quality for AI-generated outputs
- **coding-standards** — quality at the code level
- **user-experience** — quality at the interaction level

---

## What Quality Is

Quality has been defined by many thinkers. Each definition captures something real.

**Pirsig** — quality is something you recognise before you can articulate why. A developer looks at two correct implementations and says "this one is better" without being able to fully explain the judgment. That recognition is real and valuable. It comes from deep expertise internalised below conscious articulation.

**Weinberg** — "Quality is value to some person." Quality is always relative to a person and a context. A product can be simultaneously high-quality for the user who finds it useful and low-quality for the developer who has to maintain it. There is no view from nowhere. Always ask: *quality for whom?*

**Deming** — "Quality comes not from inspection, but from improvement of the process." If your quality strategy is "test it and fix the bugs," you have already lost. Testing finds defects after they exist. Quality comes from building systems and practices that prevent defects from forming.

**Crosby** — "Quality is conformance to requirements." The pragmatic view: quality means doing what you said you would do. And the cost of achieving quality is always less than the cost of not achieving it, because defects (rework, reputation damage, lost trust) always cost more than prevention.

**Monozukuri** — the Japanese art of making things. Quality reflects the spirit of the maker. A craftsman finishes the back of the cabinet — not because anyone will see it, but because an unfinished back means the cabinet is incomplete. In software: clean code, comprehensive error handling, thoughtful naming — these exist because the craft demands completeness.

**The synthesis:** Quality is the alignment between intention, execution, and experience — across all stakeholders, at every level of detail, sustained over time.

---

## Quality Dimensions

Quality is not one thing. It is several dimensions that users evaluate simultaneously, mostly below conscious awareness. Not all dimensions carry equal weight — some are constraints (violate them and the product fails), others are differentiators (invest in them and the product excels).

### Trust and Safety

Trust is not a feature. It is an ambient condition that either permits or prevents the user from engaging with every other quality dimension. A user who doesn't trust the product cannot experience its effectiveness or delight — they are too busy protecting themselves.

**The five fears:**

| Fear | What users think | What builds trust | What destroys trust |
|---|---|---|---|
| **Data loss** | "Will my work disappear?" | Auto-save indicators, version history, "saved 3s ago" | A single unsaved-changes crash |
| **Financial harm** | "Will this cost me money I didn't intend?" | Clear pricing, explicit consent, receipts | An unexpected charge, however small |
| **Privacy violation** | "Who can see my data?" | Visible privacy controls, minimal data collection | Showing another user's data, unnecessary permissions |
| **Irreversible action** | "Did I just break something I can't fix?" | Undo, drafts, trash instead of delete, confirmation proportional to risk | Delete without undo, publish without draft |
| **Looking incompetent** | "Will I embarrass myself using this?" | Forgiving interface, clear next steps, safe exploration | Punishing mistakes, exposing errors publicly |

**The trust asymmetry:** Trust builds slowly through hundreds of consistent interactions. Trust collapses through a single violation. The ratio is roughly 5:1 to 10:1 — five to ten positive experiences to offset one negative one. Some violations (data loss, security breach) are unrecoverable.

Trust is a **constraint**, not an objective. You don't optimise for trust — you never violate it.

### Effectiveness

Effectiveness is the most important quality dimension for professional tools. It answers: *does this product actually help the user accomplish their job?*

Effectiveness is distinct from usability. A product can be easy to use and completely ineffective — it's intuitive but solves the wrong problem, or produces an output that doesn't match what the user needs.

**Sub-dimensions:**

- **Task completion** — can the user accomplish what they came to do? Not "can they click the buttons" but "do they leave with the outcome they needed?"
- **Outcome quality** — how good is the result? A project generator that produces a ZIP is usable. One that produces a ZIP the user can immediately open and start building with — that's effective.
- **Efficiency** — time and effort to reach the outcome. Number of steps, cognitive effort per step, recovery cost when something goes wrong, repeated-use improvement.
- **Cognitive load** — the invisible tax the product charges. Every moment of "what does this mean?" or "where is that option?" is extraneous load that doesn't serve the user's job.

**The pit of success:** A well-designed system makes it easy to do the right thing and annoying (but not impossible) to do the wrong thing. Defaults are correct for the common case. The most discoverable path leads to the best outcome. Dangerous operations require deliberate effort.

Effectiveness is the **objective** — always optimise for it.

### Reliability

Users don't think about reliability until it fails. Then it's the only thing they think about.

- **Consistency** — same action, same result, every time. Same visual treatment for the same element. Same terminology for the same concept. Inconsistency registers as "something is off" before the user can identify what.
- **Availability** — is the tool there when the user has the thought to use it? For daily-use tools, a crash during the one meeting where you need it feels like 0% availability regardless of uptime metrics.
- **Durability** — does quality sustain as data grows, as time passes, as the team changes? A dashboard that's fast with 10 items but unusable with 10,000 has a durability problem.
- **Recoverability** — when something goes wrong, how quickly and completely is the user restored to a working state? Automatic recovery (auto-reconnect) > guided recovery (clear error message with action) > manual recovery (export + reset) > no recovery (the quality failure).

### Emotional Quality

Quality is not just functional. It is felt. The emotional states a product induces directly affect whether users adopt it, persist with it, and recommend it.

- **Confidence** — "I know what this will do before I do it." Comes from predictability, clear feedback, and visible state. Users who feel confident move faster and explore more.
- **Respect** — "The makers respected my time and intelligence." Communicated through speed, no unnecessary steps, no patronising, no manipulation. Disrespect is communicated through forced waiting, repeated interruptions, and ignoring preferences.
- **Delight** — the moment the product exceeds expectations. Not animation or confetti — the moment a search understands what you meant, or an error message fixes the problem with one click. Only works when the basics are solid.
- **Empowerment** — "This tool makes me better at my job." The highest form of quality for professional tools. Not just faster at existing tasks, but capable of things that weren't possible before.
- **Absence of anxiety** — every moment of "I'm not sure if..." is a quality tax. Low-anxiety products provide clear status, obvious next steps, visible safety nets, and honest error communication.

### Craft

The human perceptual system is extraordinarily sensitive to inconsistency and deviation from pattern. A single misaligned element, a font weight that doesn't match, a button that behaves differently from its siblings — these register as quality failures disproportionate to their objective significance.

Why: small imperfections signal that the creator did not care enough to notice or fix them. If they didn't care about the visible details, what about the invisible ones? A typo in a banking app triggers anxiety about data security — it's a signal about the organisation's care threshold.

Craft is the "someone cared about this" signal. It shows in:
- Visual consistency (spacing, colours, typography follow a system)
- Interaction feel (responsive, intentional, not laggy or jarring)
- Edge case handling (what happens with empty data, long text, concurrent access)
- The invisible parts (clean code, comprehensive error handling, tests for rare scenarios)

**"The details are not the details. They make the design."** — Charles Eames

---

## Core Rules

### 1. Trust and correctness are constraints. Effectiveness is the objective.

Quality dimensions are not equal. Trust and basic correctness are hygiene factors — their absence causes rejection. No amount of delight compensates for data loss. No amount of speed compensates for wrong results. Meet the floor on hygiene dimensions first. Then invest in effectiveness — does the product actually help the user accomplish their job? Everything else is a strategic choice based on who the users are.

### 2. Build quality in, don't inspect it in

Deming's core insight applied to software: if your quality strategy is "test it and fix the bugs," defects are already embedded and the cost of removal is high. Instead, build quality into the process:

- **Types** prevent type errors from forming
- **Linting** prevents style inconsistencies from forming
- **Architecture** (pure functions, clear boundaries) prevents structural defects from forming
- **Clear requirements** prevent concept errors from forming
- **Code review** catches what all of these miss

Testing catches what prevention misses. But testing alone catches a fraction of what prevention prevents.

### 3. Quality flows bidirectionally

Top-down: the user's experience of quality starts with their job, flows through the UI, and is either enabled or undermined by the code underneath. A user who experiences graceful error recovery is benefiting from proper error handling, enabled by an architecture that separates concerns, verified by a test that checks the behaviour.

Bottom-up: code quality (pure functions, strict types, clean architecture) creates the conditions for UI quality (consistent behaviour, fast rendering, easy iteration) which creates the conditions for experience quality (trust, effectiveness, delight).

Neither direction is sufficient alone. Beautiful code that produces a confusing UI is not quality. A polished UI over fragile code is not quality. Quality is the full chain, both directions, sustained over time.

### 4. Test behaviours, not implementations

Test what the system does (given this input, expect this output), not how it does it internally. Tests that check implementation details break when you refactor — the opposite of their purpose. For the testing distribution, level guidance, and practical test patterns, see **testing-strategy**.

### 5. Quality is continuous, not a phase

Quality is not something you add at the end through QA review. It is present or absent in every decision — every name chosen, every error handled, every edge case considered or ignored. The verification loop runs at every timescale:
- Within a TDD cycle (minutes)
- Within a code review (hours)
- Within a sprint (weeks)
- Within a retrospective (months)

Toyota's jidoka principle: any worker can stop the production line when a defect is detected. In software: a failing CI pipeline stops deployment. A developer who stops to fix a bug they found while working on something else. A team that does a postmortem and changes their process. Quality is the discipline of never passing defects forward.

### 6. Know when to stop testing

Testing has diminishing returns. The right level depends on the cost of defects in your domain — a financial transaction needs exhaustive testing, a marketing page needs the critical path tested. Spending equal effort on both is misallocation, not quality. For the testing distribution and level guidance, see **testing-strategy**.

---

## Quality from User to Code

### The experiential quality chain

```
User has a job to do
    ↓
UI makes the job obvious and efficient (or doesn't)
    ↓
Interactions feel responsive and trustworthy (or don't)
    ↓
Errors are handled gracefully with recovery (or aren't)
    ↓
Edge cases are covered (or crash)
    ↓
Architecture enables reliable, consistent behaviour (or doesn't)
    ↓
Code is maintainable, enabling continued quality over time (or isn't)
```

Every link in this chain is a quality decision. Break any link and quality degrades for the user, even if every other link is strong.

### Testing from the user's perspective

- **Behaviour-driven scenarios** — "Given I have a draft skill, when I click Publish, then the skill is visible in the library." This tests the user's job, not the implementation.
- **Exploratory testing** — investigate the unknown. Automated tests confirm known expectations. Exploratory testing discovers whether the product is actually good. Both are needed. (James Bach: "Testing is not checking.")
- **The uncanny valley of quality** — when something is almost-but-not-quite right, it triggers a stronger negative reaction than something obviously rough. A feature that works 95% correctly is often perceived as worse than a feature that openly says "coming soon." The 95% case trains users to rely on it, then betrays them.

---

## Quality from Code to User

### Types as quality infrastructure

TypeScript's strict mode is a Deming-style quality intervention — it changes the process so that certain defects cannot form. `strictNullChecks` alone catches a category of bugs that no amount of testing reliably covers.

Types don't replace tests. They dramatically reduce the surface area that tests need to cover. Strict types + integration tests often provides more confidence than extensive unit tests in a loosely-typed language.

### The testing strategy

For the testing trophy distribution, level guidance, and practical test patterns, see **testing-strategy**. The key quality insight: static analysis (types, linting) changes the process so certain defects cannot form, while integration and E2E tests catch what prevention misses.

### Pure functions as quality

Pure functions (same inputs → same outputs, no side effects) have 40–60% fewer defects per line than functions with side effects. They're also dramatically easier to test — no mocks, no setup, no teardown. The **functional core, imperative shell** pattern pushes quality into the architecture: all business logic is pure and testable, all side effects are at the thin edges.

### Kent Beck's deeper insight

TDD's real purpose is giving developers confidence to change code — without tests, quality inevitably degrades over time. The test is not the product; the confidence to change and improve is. For testing mechanics and patterns, see **testing-strategy**.

---

## Quality in AI-Assisted Development

AI changes the quality equation. Code is produced faster, which means more code to verify. The developer's role shifts from writer to verifier. Quality practices become more important, not less.

**The "plausible but wrong" problem:** AI-generated code often looks correct, passes casual inspection, and works for common cases — but fails on edge cases, has subtle logic errors, or doesn't handle the full problem space. This is the uncanny valley of code quality.

**What this demands:**
- The verification loop (build → types → lint → tests → diff review) is non-negotiable
- Diff review is the most important step — check every changed file, not just the ones you expected
- AI makes characteristic mistakes (unintended scope expansion, import drift, style inconsistency) — check for these explicitly
- For AI-generated content (showcases, descriptions), use eval-driven development — define what "correct" looks like as evaluable functions

---

## Banned Patterns

- ❌ "QA will catch it" → quality is everyone's responsibility, not a department
- ❌ Testing as the sole quality strategy → build quality into the process (types, architecture, linting), test what prevention misses
- ❌ Testing implementation details (internal state, mock interactions) → test behaviours (given input, expect output)
- ❌ 100% coverage as a goal → confidence as the goal; coverage is a signal, not a target
- ❌ Skipping verification under deadline pressure → the cost of a defect in production always exceeds the cost of catching it now
- ❌ Delight investment before trust is solid → trust and correctness first, then effectiveness, then delight
- ❌ "Works on my machine" → consistent behaviour across environments is a reliability requirement
- ❌ Silent failures (swallowing errors, empty catch blocks) → every failure must be visible, reportable, and recoverable
- ❌ Treating quality as a phase at the end → quality is continuous, built into every decision
- ❌ Ignoring the invisible (error handling for rare cases, clean code in stable modules) → craft demands completeness; the parts nobody sees reflect the quality of the whole

---

## Quality Gate

Before considering any work complete, verify across dimensions:

**Trust:**
- [ ] No data can be lost, even during errors or crashes
- [ ] Destructive actions are reversible or require confirmation proportional to impact
- [ ] System state is always visible to the user

**Effectiveness:**
- [ ] The user can accomplish their actual job (not just operate the interface)
- [ ] Defaults are correct for the common case
- [ ] Edge cases are handled visibly, not silently

**Reliability:**
- [ ] Same input produces same output, every time
- [ ] Performance doesn't degrade as data grows
- [ ] Recovery from failure is automatic or guided

**Code Quality:**
- [ ] Types are strict — no `any`, `strictNullChecks` enabled
- [ ] Business logic is in pure functions, side effects at edges
- [ ] Tests check behaviours, not implementations
- [ ] Tests exist for complex logic and critical paths
- [ ] Verification loop passed (build, types, lint, tests, diff review)

**Craft:**
- [ ] Visual and interaction consistency across all surfaces
- [ ] Error messages explain what happened, why, and what to do
- [ ] The product feels like it was made by people who care

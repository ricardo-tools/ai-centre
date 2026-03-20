---
name: research
description: >
  The discipline of investigating before acting. Teaches how to calibrate
  research depth to decision impact, evaluate sources critically, falsify
  hypotheses, debug scientifically, and synthesise findings into trade-off
  analyses. Apply before any non-trivial technical decision, when debugging
  complex issues, or when evaluating technology choices. General principle
  skill — not tied to any technology.
---

# Research

Research is not reading. Research is the disciplined process of reducing uncertainty before committing to a direction. The goal is not to know everything — it is to know enough to make the decision at hand, and to know what you don't know.

Most bad technical decisions share a root cause: insufficient investigation proportional to the decision's impact. A CSS fix doesn't need a literature review. A database migration doesn't deserve "move fast and break things." Calibrate the effort to the stakes.

---

## When to Use

Apply this skill when:
- Making a technology choice (library, framework, service, pattern)
- Debugging a problem whose root cause is unclear after 10 minutes
- Evaluating multiple valid approaches to a feature
- Encountering unfamiliar territory (new API, new pattern, new constraint)
- Making any decision that is expensive to reverse
- Assessing whether a dependency is healthy and maintained
- Investigating a production incident or intermittent failure

Do NOT use this skill for:
- Decisions you've already made and validated in this codebase
- Trivial changes where the answer is obvious and reversible
- Situations where the user has already done the research and is giving you a directive

---

## Core Rules

### 1. Calibrate depth to impact

Not all decisions deserve the same investigation. Use the reversibility/impact matrix:

| Decision type | Time budget | Sources | Deliverable | Examples |
|---|---|---|---|---|
| **Trivial** | Minutes | 1 source or existing knowledge | Mental note | CSS fix, variable rename, formatting |
| **Tactical** | Hours | Docs + 2-3 sources | Short summary in commit/PR | Library for non-core feature, API endpoint design, component pattern |
| **Strategic** | Days | 5+ sources, prototyping | ADR (Architecture Decision Record) | Database choice, auth system, state management, API versioning strategy |
| **Foundational** | Weeks | Broad research, RFC, prototypes, team review | RFC document + prototype results | Programming language, cloud provider, core architecture pattern |

**Calibration questions:**
- How many people are affected by this decision?
- How long will we live with it?
- How expensive is it to change later?
- Does it constrain future decisions?

If you can't answer these questions, that itself is a signal to research more.

### 2. Classify door type first

Before researching, classify the decision using Jeff Bezos's framework:

- **Type 1 (one-way door):** Irreversible or very expensive to reverse. Research deeply. Decide late. Examples: database engine, authentication architecture, public API contract.
- **Type 2 (two-way door):** Reversible with acceptable cost. Decide at 70% confidence. Move fast. Examples: UI component library choice, internal API shape, feature flag strategy.

**The critical error is treating Type 2 decisions like Type 1** (analysis paralysis) or **Type 1 decisions like Type 2** (reckless commitment). Name the door type explicitly before starting research.

### 3. Falsify, don't verify

Apply Popper's principle to software decisions. The natural instinct is to search for evidence that your preferred option works. Resist it.

Instead ask: **"Under what conditions does this fail?"**

- Don't ask "does this library handle our use case?" — ask "what use cases does this library NOT handle?"
- Don't ask "will this scale?" — ask "at what point does this break?"
- Don't ask "is this pattern correct?" — ask "what inputs make this pattern produce wrong results?"

If you can't find failure conditions, either you haven't looked hard enough or the solution is genuinely robust. Both are useful findings.

### 4. CRAAP-test every source

Before trusting any source, evaluate it on five axes:

| Axis | Question | Red flag |
|---|---|---|
| **Currency** | What version does this cover? When was it written? | No version mentioned, date > 18 months old for fast-moving tech |
| **Relevance** | Does it match your specific constraints (runtime, framework version, scale)? | Generic advice, different framework, toy example |
| **Authority** | Who wrote it? Maintainer, expert, or random blogger? | Anonymous, no credentials, content farm |
| **Accuracy** | Does the code actually compile? Have you verified the claims? | Pseudocode, untested snippets, contradicts official docs |
| **Purpose** | Is this a tutorial, vendor pitch, or objective analysis? | Sponsored content, "10 reasons to use [product]" |

A source that fails on two or more axes should be corroborated before acting on it.

### 5. Source trust hierarchy

Not all sources carry equal weight. Default trust order:

1. **Official documentation** (current version)
2. **Source code** (the ultimate truth)
3. **Changelogs and release notes**
4. **Maintainer comments** (GitHub issues, discussions)
5. **Expert blog posts** (known practitioners with track records)
6. **Stack Overflow answers** (check votes, date, and version)
7. **Community blog posts**
8. **AI-generated output** (treat as a starting point, never as authority)
9. **Forum posts and comments**

**Recency decay:** A source's trust decays as the technology evolves. A 2-year-old blog post about a framework that ships monthly is almost certainly outdated. Official docs for a stable protocol (HTTP, SQL) age slowly. Calibrate accordingly.

### 6. Two-source minimum for consequential decisions

Never act on a single source for any decision above trivial. If two sources agree, confidence increases. If they conflict, dig deeper — go to source code or official docs to resolve the conflict.

**Exception:** Official documentation for the exact version you're using counts as sufficient for API usage questions. You don't need a second source to confirm that `Array.prototype.at()` exists — the MDN page is enough.

### 7. Three-option minimum

For any decision above trivial, evaluate at least three alternatives. This escapes binary thinking ("should we use A or not?") and surfaces options you hadn't considered.

The three options should be genuinely distinct — not variations of the same approach. If you can only find two, the third option is often "do nothing" or "solve the underlying problem differently."

### 8. Steel-man the alternative

Before choosing option A, articulate the **strongest possible case** for option B. Not a straw man — the version that a smart advocate of B would present.

If you can't make a compelling case for the alternative, you haven't researched it enough. Go back and understand why reasonable people would choose it.

This also serves as documentation: when someone later asks "why didn't we use B?", you have the answer.

### 9. Detect and name biases

Before finalising any consequential decision, run a bias checklist:

| Bias | Check | Question to ask |
|---|---|---|
| **Survivorship** | What's missing from the data? | Am I only seeing success stories? What about projects that chose this and failed? |
| **Confirmation** | Am I only finding supporting evidence? | Have I actively searched for evidence against my preferred option? |
| **Sunk cost** | Am I continuing because of prior investment? | If I were starting fresh today, would I make the same choice? |
| **Recency** | Is this trending or proven? | Has this been battle-tested for 2+ years, or is it this month's hype? |
| **Popularity** | Is adoption evidence of quality? | Is this popular because it's good, or because of marketing/network effects? |
| **Anchoring** | Am I fixated on the first option I found? | Did I give equal investigation time to each alternative? |

Name the bias out loud when you detect it. "I notice I'm anchoring on Redis because it was the first thing I found" is more useful than silently correcting course.

### 10. Scientific debugging

After 10 minutes of ad-hoc debugging without progress, stop and switch to a systematic method:

1. **Reproduce** — create the minimal reproduction case. If you can't reproduce it, you can't verify a fix.
2. **Hypothesise** — form a specific, falsifiable hypothesis about the cause. Write it down.
3. **Experiment** — design a test that would disprove the hypothesis. Run it.
4. **Record** — log the hypothesis, the experiment, and the result. Whether it confirmed or falsified.
5. **Repeat** — form the next hypothesis based on what you learned.

**Keep a debug logbook.** Even a quick list of "tried X, ruled out Y" prevents circular debugging where you re-test things you've already eliminated.

#### The 5 Whys

For bugs that have a fix but an unclear root cause, apply iterative "why" questioning:

1. Why did the upload fail? → The blob token was undefined.
2. Why was the token undefined? → The env var wasn't loaded.
3. Why wasn't the env var loaded? → The .env.local file wasn't read in the test environment.
4. Why wasn't it read? → The test runner uses a different working directory.
5. Why does the working directory matter? → We're using relative paths for dotenv.

The fix at level 1 (add a fallback) treats the symptom. The fix at level 5 (use absolute paths) treats the cause.

#### Effective search and changelog cross-referencing

See the **Effective Search Patterns** section below for GitHub issue search syntax and changelog cross-referencing workflows.

### 11. Premortem for strategic decisions

Before committing to a strategic or foundational decision, run a premortem:

> "It's 6 months from now. This decision has failed. What went wrong?"

Write down every failure scenario the team can imagine. Common categories:
- **Scale failure** — it worked at current load but not at 10x
- **Integration failure** — it didn't play well with system X
- **Maintenance failure** — the team couldn't maintain it (too complex, too niche, lost expertise)
- **Migration failure** — we couldn't migrate the existing data/state
- **Vendor failure** — the company pivoted, pricing changed, or the project was abandoned

Each failure scenario either gets mitigated (add it to the implementation plan) or accepted as a known risk (document it in the ADR).

### 12. Synthesise into trade-off analysis

Research without synthesis is just browsing. The output of research is a **trade-off analysis**, not a recommendation with cherry-picked evidence.

**Format for trade-off analysis:**

| Criterion | Option A | Option B | Option C |
|---|---|---|---|
| Criterion 1 | Rating + evidence | Rating + evidence | Rating + evidence |
| Criterion 2 | ... | ... | ... |
| Criterion 3 | ... | ... | ... |

**Criteria should be weighted by importance to the specific decision.** "Has TypeScript types" matters more for a core dependency than a one-off script tool.

For formal decisions, use the ADR format:
- **Context:** What situation prompted this decision?
- **Decision:** What did we choose?
- **Consequences:** What trade-offs are we accepting? What did we gain?

### 13. Epistemic honesty

State your confidence level explicitly. Different levels of evidence warrant different levels of certainty:

| Confidence level | What it means | Example |
|---|---|---|
| **Formal proof** | Mathematically or logically certain | "This regex matches all valid emails per RFC 5322" |
| **Empirical strong** | Tested extensively, reproduced across contexts | "This approach handles 10k concurrent connections in our load tests" |
| **Empirical weak** | Tested in limited conditions | "This works in our dev environment with small datasets" |
| **Anecdotal** | Worked for someone, somewhere | "Company X uses this in production" |
| **Hearsay** | Heard it from someone, unverified | "I read that this library is fast" |

"This passes our tests" does not equal "this is correct." Name the gap.

### 14. Distinguish anecdote from evidence

"It worked for company X" is an anecdote, not evidence. Anecdotes are useful for generating hypotheses but dangerous for making decisions.

Evidence requires:
- **Reproducibility** — can the result be reproduced in your context?
- **Controlled comparison** — was it compared against alternatives?
- **Relevant context** — does their scale, constraints, and team match yours?

When you catch yourself citing an anecdote as evidence, flag it: "Note: this is an anecdote from [source], not tested in our context."

---

## Research Depth Quick Reference

| Decision type | Time budget | Min. sources | Min. options | Deliverable | Review |
|---|---|---|---|---|---|
| Trivial | Minutes | 1 | 1 | None | None |
| Tactical | 1-4 hours | 2-3 | 2 | Summary in PR/commit | Self |
| Strategic | 1-3 days | 5+ | 3+ | ADR | Team |
| Foundational | 1-3 weeks | 10+ | 3+ | RFC + prototype | Team + stakeholders |

---

## Bug Investigation Methodology

When the root cause of a bug is unclear, follow this sequence:

1. **Reproduce first.** No reproduction, no reliable fix. Capture the exact steps, environment, and inputs.
2. **Check recent changes.** `git log --since="3 days ago"` — did something change that could cause this?
3. **Search for known issues.** Use the GitHub issue search patterns from Rule 10. Check the changelog for the dependency version you're running.
4. **Apply scientific debugging.** Hypothesise, experiment, record. Don't shotgun-debug.
5. **Apply the 5 Whys.** Once you have a fix, trace it back to the root cause. Fix the root, not just the symptom.
6. **Document the finding.** A sentence in the commit message explaining the root cause saves hours for the next person.

---

## Effective Search Patterns

### GitHub Issues

```
# Exact error message
"the exact error message in quotes"

# Scoped to a repository
repo:owner/repo keyword

# Filter by state and recency
repo:owner/repo keyword is:issue is:open created:>2025-06-01

# Labels
repo:owner/repo label:bug label:"help wanted"

# Combination
repo:vercel/next.js "Module not found" is:issue is:closed label:bug
```

### Changelog cross-referencing

```
# 1. Check your installed version
npm ls <package-name>

# 2. Find the changelog
# - GitHub releases page: github.com/owner/repo/releases
# - CHANGELOG.md in the repo root
# - npm view <package-name> versions (to see all versions)

# 3. Search the changelog for your symptom keywords
# 4. Identify which version introduced or fixed the relevant change
# 5. Compare with your installed version
```

### Stack Overflow

```
# Use square brackets for tags
[next.js] [typescript] hydration error

# Use quotes for exact phrases
[drizzle-orm] "relation does not exist"

# Filter by recency (use the search tools sidebar)
# Sort by votes, but check the date — old accepted answers may be outdated
```

---

## Banned Patterns

- Acting on a single source for strategic decisions — always cross-reference
- Researching without checking version applicability — a solution for v2 may break v3
- Confirming an initial hypothesis instead of testing alternatives — falsify first
- Over-researching reversible decisions (analysis paralysis on Type 2 doors) — decide at 70% confidence and move
- Under-researching irreversible decisions (move-fast-break-things for Type 1 doors) — these deserve days, not minutes
- Citing popularity as evidence of quality — "everyone uses it" is not a technical argument
- Trusting AI output without cross-referencing — treat AI as a starting point, verify against official sources
- Ad-hoc debugging for more than 10 minutes without switching to systematic method — stop, hypothesise, record
- Presenting a recommendation without trade-offs — every choice has costs; name them
- Anchoring on the first solution found — investigate at least three options for non-trivial decisions

---

## Quality Gate

Before considering research complete, verify:

- [ ] Decision type classified (trivial/tactical/strategic/foundational) and door type named (Type 1/Type 2)
- [ ] Research depth matches the classification (not over or under)
- [ ] Sources evaluated with CRAAP criteria — no unvetted sources driving the decision
- [ ] Two-source minimum met for consequential decisions
- [ ] At least three options evaluated for non-trivial decisions
- [ ] Alternative steel-manned — you can articulate why someone would choose differently
- [ ] Bias checklist reviewed — no unexamined survivorship, confirmation, sunk cost, recency, or popularity bias
- [ ] Confidence level stated — you know whether your evidence is strong, weak, or anecdotal
- [ ] Trade-off analysis documented — options compared on explicit, weighted criteria
- [ ] For bugs: root cause identified (not just symptom patched), reproduction case exists

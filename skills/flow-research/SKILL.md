---
name: flow-research
description: >
  Research methodology for evidence-based decisions. Covers four research
  types: documentation lookup, technology comparison, bug investigation, and
  pattern/best-practice research. Referenced by flow-planning.md for the
  research phase of chapter planning.
---

# Flow: Research

Thorough external research via web search before making consequential decisions. Covers structured research types, CRAAP-tested sources, and cited evidence.

Referenced by `.claude/skills/flow-planning/SKILL.md` for the research phase. Can also be used standalone when the team wants evidence-based decisions.

---

## When to Use

Activate this opinion when:
- Making technology or architecture decisions (which library, which model, which pattern)
- The user explicitly asks for research ("research how to...", "compare options for...")
- Encountering recurring issues that suggest a deeper problem
- Exploring unfamiliar topics or domains
- Working with evolving APIs where training data may be outdated

---

## Universal Rules (All Research Types)

### 1. CRAAP-test every source

Evaluate on: **C**urrency (when published), **R**elevance (to the specific question), **A**uthority (who wrote it), **A**ccuracy (supported by evidence), **P**urpose (informative vs promotional).

### 2. Two-source minimum for consequential decisions

Never act on a single source for decisions that are hard to reverse. Corroborate findings across at least two independent sources.

### 3. Cite sources in the plan

Every research finding includes a link or reference. The human must be able to verify the source. Format: `[Title](URL)` or `[GitHub Issue #1234](link)`.

### 4. Three failed lookups → state uncertainty

After three search attempts that don't yield answers, explicitly say: "I couldn't find authoritative information on this. Here's what I know from training data, but it may be outdated." Never fabricate confidence.

---

## Research Type A: Documentation Lookup

When working with version-specific APIs, evolving frameworks, or contradicting information.

### Rules

1. **Decide: look up or answer from knowledge.** Stable APIs (Array.map, CSS Grid) → knowledge is fine. Evolving/version-specific APIs (Next.js 15 config, Drizzle ORM migration) → always look up.

2. **Check changelogs for version-sensitive questions.** Migration guides explain what broke and why. Target the specific version from `package.json`, not "latest."

3. **Source hierarchy for docs:** Official docs > changelog/migration guide > GitHub repo > official blog > training knowledge > community content.

4. **Synthesise for user's context.** Extract the relevant parts, adapt code examples to project conventions, note gotchas. Never paste raw docs.

```
# ✅ Good — synthesised for context
Next.js 15 changed `params` to a Promise in page components.
Your code: `const { slug } = params;`
Fix: `const { slug } = await params;`
Source: [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

# ❌ Bad — raw docs paste
"In Next.js 15, the params prop is now a Promise. You need to await it..."
[500 lines of migration guide]
```

---

## Research Type B: Technology Comparison

When choosing between libraries, services, models, or approaches.

### Rules

1. **Three-option minimum.** Never present a binary choice for non-trivial decisions. Include a third option to avoid false dilemmas.

2. **Steel-man the alternative.** Before recommending option A, articulate the strongest case for option B. If you can't, you haven't researched deeply enough.

3. **Structured comparison table.** Every comparison includes:

| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| Cost | $X/M tokens | $Y/M tokens | $Z/M tokens |
| Key strength | ... | ... | ... |
| Key weakness | ... | ... | ... |
| Tool calling | Excellent | Good | Fair |
| Source | [link] | [link] | [link] |

4. **Include real pricing, not estimates.** Look up current pricing from official sources.

---

## Research Type C: Bug/Issue Investigation

When hitting errors, unexpected behavior, or known problems with specific tools.

### Rules

1. **Search for the exact error message.** Copy the error string and search GitHub issues, Stack Overflow, and forums. Most errors have been seen before.

2. **Check open AND closed issues.** Closed issues often have the fix in the comments. Open issues confirm the problem is known and unresolved.

3. **Reproduce → search → scientific debug → 5 Whys.**
   - Reproduce the exact failure
   - Search for known issues with the specific error
   - If not found: hypothesise → test → record
   - Apply 5 Whys to trace past the surface cause

4. **Report findings with links.** Include GitHub issue numbers and links so the human can follow up.

```
# ✅ Good — linked finding
Root cause: Qwen3-32B has a ~60% tool-call failure rate.
Source: [GitHub #1817](https://github.com/QwenLM/Qwen3/issues/1817)
```

---

## Research Type D: Pattern/Best-Practice Research

When solving a class of problem that others have solved before.

### Rules

1. **Frame the question as a problem class.** Not "how to fix our favicon" but "how to implement theme-aware favicons in web apps."

2. **Evaluate patterns against project constraints.** A pattern that works for a 100-person team may be overkill for a 2-person team. Consider: project size, team expertise, maintenance cost.

3. **Present as actionable recommendations.** Not "here are 10 approaches" but "for your situation, approach X is best because Y. Here's how to implement it."

4. **CRAAP-test aggressively.** Pattern articles age fast. A "best practice" from 2023 may be obsolete in 2026. Prefer recent sources with working code.

---

## Banned Patterns

- Acting on a single source for consequential decisions → two-source minimum
- Presenting binary choices → three-option minimum
- Pasting raw documentation → synthesise for context
- Citing popularity as evidence ("everyone uses X") → evaluate on merits
- Trusting AI training data for evolving APIs → look it up
- Researching without time-boxing → calibrate depth to impact
- Over-researching trivial decisions → proportional effort
- Fabricating confidence when uncertain → state uncertainty honestly

---

## Quality Gate

Before delivering research:

- [ ] Every source CRAAP-tested
- [ ] Two-source minimum met for consequential findings
- [ ] All sources cited with links
- [ ] Comparisons use structured tables with real pricing
- [ ] Alternatives were steel-manned
- [ ] Findings synthesised for the project's context (not raw pastes)
- [ ] Research depth is proportional to decision impact

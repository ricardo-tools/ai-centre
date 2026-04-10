---
name: skill-review
description: "Audit and score skills against the Agent Skills open spec (9 dimensions, 27-point scale). Detects contradictions, staleness, gaps, and overlap across the library. Generates actionable improvement reports usable as prompts. Apply periodically, after adding skills, or when quality feels stale."
---

# Skill Review

Systematic review process for skill libraries. Evaluates individual skills against research-backed criteria and analyses the collection as a coherent whole.

---

## When to Use

Apply this skill when:
- A new skill has been added to the library
- Multiple skills have been modified in a short period
- Skills feel stale, contradictory, or ignored
- The project has evolved and skills may not reflect current practices
- Periodically (every 4–6 weeks) as quality maintenance
- Before onboarding new team members who will rely on the skills

---

## Core Rules

### 1. Validate against the Agent Skills open spec first

Every skill must comply with the [Agent Skills specification](https://agentskills.io/specification). Run spec validation before any quality evaluation.

**Validation procedure:**
1. Fetch the current spec from `https://agentskills.io/specification` (or use `skills-ref validate ./my-skill` if the CLI is installed)
2. Parse the skill's YAML frontmatter
3. Validate every field against the spec's constraints — field names, value types, length limits, character restrictions, required vs optional
4. Validate `name` against all spec rules — character set, length, leading/trailing/consecutive hyphen restrictions, directory name match
5. Validate `description` against spec constraints — presence, length, non-empty
6. Flag any frontmatter field not in the spec's allowed set
7. Validate directory structure — `skills/<name>/SKILL.md` layout, supporting directories, file reference depth
8. Check progressive disclosure compliance — SKILL.md body within the spec's recommended token/line budget, reference material in separate files

Report every spec rule checked, with pass/fail per rule. The spec is the source of truth — do not rely on cached summaries of it.

### 2. Evaluate every instruction with the deletion test

The single meta-criterion: *"Would removing this line cause the agent to make a mistake?"* If not, the line is filler and should be flagged for removal.

Every sentence in a skill must change what the agent produces. This principle (from Anthropic's context engineering guidance) drives all other evaluation — a skill full of true statements that don't change behaviour is a documentation page, not a skill.

### 3. Review in three layers

| Layer | What it checks | Method |
|---|---|---|
| **Structural** | Spec compliance, format, sections, length, cross-references | Automated checks |
| **Individual quality** | Clarity, specificity, completeness, self-consistency, composability | Scored evaluation (9 dimensions) |
| **Collection coherence** | Contradictions, gaps, overlap, terminology, separation of concerns | Pairwise analysis + aggregate |

### 4. Frame every instruction positively

Skills steer agents toward correct behaviour. Evaluate whether instructions lead with what to do, not what to avoid.

**Why:** LLMs process negation poorly — "Do NOT use Tailwind" activates the concept of Tailwind in the model's attention. "Use inline styles with CSS custom properties" doesn't activate Tailwind at all. Research shows flipping negative rules to positive equivalents cuts violations by ~50%.

**Three-tier framing standard:**

| Tier | When to use | Example |
|---|---|---|
| Positive only (default) | Stylistic, workflow, structural rules | "Use `var(--color-primary)` for primary actions" |
| Positive + negative clarifier | Genuinely confusing choices where someone might reach for the wrong thing | "Use ES modules (import/export), not CommonJS (require)" |
| Hard negative | Safety or irreversible actions only | "NEVER commit .env files" |

Flag any bare negative instruction ("Don't do X") that lacks a positive alternative.

### 5. Elevate description quality as the #1 review priority

The `description` frontmatter field determines whether the skill auto-activates. A perfect skill body with a weak description is a skill that never loads.

**Description quality checks:**
- Written in third person ("Processes Excel files...", not "I help you..." or "You can use this...")
- **Truncation test:** paste the first 250 characters and read them in isolation — do they convey the key use case? If they end mid-word or mid-sentence with no value delivered, the description needs reordering.
- Includes specific trigger keywords an agent would match against
- States both what the skill does AND when to use it
- Would not cause false activation for irrelevant tasks

### 6. The report is a prompt, not just an analysis

The output of a review is a structured report designed to be handed to a Claude session as input for executing improvements. Every finding includes: what's wrong, why it matters, and a concrete suggestion (with before/after where applicable). A finding without an action is not a finding.

### 7. The review improves itself

Every review cycle evaluates this review skill against its own criteria. If the review process missed something, it documents the miss and adjusts. If the scoring dimensions don't capture a real quality problem, the dimensions evolve.

### 8. Three-pass self-critique

Diminishing returns beyond 3 passes:
1. **Initial review** — run all phases, produce findings
2. **Critique the review** — are findings fair? Are scores calibrated? Did the review miss anything?
3. **Synthesise** — reconcile the review with its critique, produce the final report

---

## Phase 1: Structural Audit

Checks that require no LLM. Run as a script or manually.

### Agent Skills spec validation (per skill)

Run the full validation procedure from Core Rule 1. Fetch the live spec and check every rule — directory layout, frontmatter fields, name constraints, description constraints, allowed fields, progressive disclosure budget. Report pass/fail per spec rule with the specific constraint that failed.

Severity: every spec rule violation is an **Error** except progressive disclosure budget (line count, token count) which is a **Warning**.

Widespread violations are more urgent, not less. When a spec failure affects many or all skills, the improvement must include the concrete migration step (e.g., "move `skills/<name>.md` to `skills/<name>/SKILL.md` for all 75 skills"). Never dismiss a violation as "library-wide issue" without an actionable fix.

### Content structure (per skill)

For **behavioural skills** (the default):

| Check | Pass criteria | Severity |
|---|---|---|
| **"When to Use" section** | Present with concrete triggers | Error if missing |
| **"Core Rules" section** | Present with numbered, verifiable rules | Error if missing |
| **"Quality Gate" section** | Present with `- [ ]` checkbox format | Error if missing |
| **Heading hierarchy** | No skipped levels (h1 → h3 without h2) | Warning |
| **Code examples exist** | At least one example in Core Rules for code-governing skills | Warning |

For **reference files** (files in a skill's `references/` directory):
Reference files are pure lookup data — token tables, schema templates, code templates. They have no Core Rules or Quality Gate. Instead check:

| Check | Pass criteria | Severity |
|---|---|---|
| **Structured data** | Contains tables, code blocks, or lookup-ready formats | Warning if prose-heavy |
| **Parent skill exists** | The parent skill directory contains a `SKILL.md` | Error if orphaned |
| **Cross-referenced** | Parent skill mentions this reference file | Warning if unreferenced |

### Cross-library checks

| Check | Pass criteria | Severity |
|---|---|---|
| **Cross-references resolve** | Every `see **skill-name**` matches an actual skill | Error |
| **No orphan skills** | Every skill referenced by at least one other skill or CLAUDE.md | Warning |
| **No duplicate names** | No two skills share the same `name` field | Error |

---

## Phase 2: Individual Skill Evaluation

Score each skill on 9 dimensions (1 = failing, 2 = adequate, 3 = strong). Maximum score: 27.

### Evaluation dimensions

**1. Clarity (are instructions unambiguous?)**
- Can you determine from each instruction exactly what code to produce?
- Are there instructions that could be interpreted two ways?
- Do examples match the instructions they illustrate?

**2. Specificity (concrete enough to verify?)**
- Could you look at generated output and determine if each instruction was followed?
- Are there vague instructions ("write clean code", "follow best practices") that teach nothing?
- Are thresholds bounded rather than vague? Target "bounded precision" — specific enough to verify, flexible enough to apply sensibly.

**3. Completeness (edge cases and success criteria covered?)**
- Does "When to Use" have clear triggers?
- Does a "When NOT to use" section exist where boundaries with related skills are ambiguous?
- Does the skill define what successful output looks like — not just process rules but verifiable outcomes?
- Does the skill handle "but what about [common edge case]?"

**4. Self-consistency (follows its own rules?)**
- If the skill prescribes numbered lists, does it use them?
- If it prescribes examples for every rule, does every rule have one?
- Does the skill's own structure match what it prescribes?

**5. Scope discipline (one skill, one concern?)**
- Does the skill cover exactly what its description says, no more?
- Does it drift into topics covered by other skills?
- Could you delete this skill without losing coverage of another skill's territory?

**6. Core vs opinion separation (for skill families only)**
Score only for skills that are part of a family (have `companionTo` links or companions pointing to them). For standalone skills, score 3 by default.
- Is each core rule truly universal — every project benefits regardless of team preferences?
- Does the core leak opinionated choices? ("always write tests first" = opinion; "evaluate existing tests before changing" = core)
- Does each opinion stand alone? Activating one should not require another.
- Do opinions duplicate core rules? Each rule exists in exactly one place.
- Does the core work without any opinions activated?

**7. Description & trigger accuracy**
- Is `description` written in third person with front-loaded key use case?
- Does `description` stay under 250 chars for the primary use case (truncated in listings)?
- Does `description` include specific trigger keywords an agent would match?
- Would the description cause false activation for irrelevant tasks?
- Is "When to Use" specific enough to prevent misuse?

**8. Linguistic density (optimised for agent consumption?)**
- Does every line pass the deletion test? (Remove it — would the agent make mistakes?)
- Is filler stripped? ("It's important to note...", "you might want to consider...", "as a best practice...")
- Are instructions imperative with context, not hedged or vague?
- Are the 3 most critical rules in positions 1–3 of Core Rules? (primacy effect)
- Are examples provided for code-governing rules? (3–5x more effective than abstract rules)
- Is urgency language (ALLCAPS, NEVER, ALWAYS) used sparingly — reserved for 1–2 true safety overrides?

**9. Positive framing (instructions steer toward, not away?)**
- Do instructions lead with what to do, not what to avoid?
- Are negative instructions always paired with positive alternatives?
- When anti-patterns are mentioned, is the correct approach always stated alongside?
- Are hard negatives (NEVER/DO NOT) reserved for safety-critical rules?

### Scoring template

```
## [skill-name] — Score: X/27

| Dimension | Score | Notes |
|---|---|---|
| Clarity | 1-3 | ... |
| Specificity | 1-3 | ... |
| Completeness | 1-3 | ... |
| Self-consistency | 1-3 | ... |
| Scope discipline | 1-3 | ... |
| Core vs opinion | 1-3 | ... |
| Description & trigger | 1-3 | ... |
| Linguistic density | 1-3 | ... |
| Positive framing | 1-3 | ... |

Key findings:
- [finding 1]
- [finding 2]

Suggested improvements:
- [improvement with before/after if applicable]
```

---

## Phase 3: Collection Coherence Analysis

Evaluates how skills work together as a system. The most valuable and least automatable phase.

### Checks

| Check | Method | Flag when |
|---|---|---|
| **Contradictions** | For each pair with overlapping domain: "If I followed both simultaneously, would I get contradictory instructions?" | Two skills give opposing guidance for the same situation |
| **Overlap** | Extract core rules, compare pairwise. Same behaviour, different wording? | A developer reading both would be confused about which to follow |
| **Gaps** | List every type of work on the project, map to skills | A work type has zero skill coverage |
| **Separation** | Write a one-sentence "this skill owns X" per skill, compare | Ownership statements overlap |
| **Terminology** | Extract key terms, flag same concept with different names | "handler" vs "controller" vs "action" drift |
| **Dependencies** | Map skill cross-references | Broken refs, circular deps, or wrong direction (general depends on specific) |
| **Staleness** | Do code examples match current APIs? Do referenced tools still exist? | Skill teaches patterns removed from the codebase |
| **Composability** | Can this skill be active alongside any other without conflict? | Skill assumes other specific skills are or aren't active |

---

## Phase 4: Improvement Suggestions

For every finding from Phases 1–3, generate an actionable improvement.

### Improvement format

```
## Improvement: [short title]

**Skill(s):** [which skill(s) to change]
**Severity:** High / Medium / Low
**Type:** Contradiction / Gap / Staleness / Overlap / Clarity / Completeness / Structure / Spec compliance

**Finding:** [what's wrong and why it matters]

**Suggestion:** [what to change]

**Before:**
[current text, if applicable]

**After:**
[suggested text, if applicable]
```

### Priority ranking

1. **Spec violations** — skills that fail Agent Skills structural validation
2. **Contradictions** — two skills giving opposing instructions
3. **Stale references** — code examples or patterns that no longer exist
4. **Gaps in critical areas** — no guidance where guidance is needed
5. **Weak descriptions** — skills that won't auto-activate correctly
6. **Vague/unverifiable instructions** — rules that don't change behaviour
7. **Negative-only framing** — bare negatives without positive alternatives
8. **Structural issues** — missing required sections, broken references
9. **Overlap/redundancy** — same rule in different words
10. **Terminology drift** — inconsistent naming
11. **Polish** — phrasing, examples, formatting improvements

### Remediation workflows

**For negative framing rewrites:** Rename "Banned Patterns" to "Standards". Rewrite each `❌ [anti-pattern] → [fix]` as `[positive instruction]. Not: [anti-pattern]`. Lead with the correct behaviour; mention the anti-pattern only as a clarifier. Apply the three-tier framing standard from Core Rule 4.

### Self-improvement

Every review includes suggestions for this skill (skill-review). Did the review process miss something? Should a new check be added? Do scoring dimensions need adjustment?

---

## Phase 5: Report Generation

The final output is a structured report designed to be used as a prompt.

### Report template

Use this structure. Each section header is required; content scales to findings.

```markdown
# SKILL LIBRARY REVIEW — [date]

## Summary
Skills: N | Score: X/Y (Z%) | Spec violations: N | Contradictions: N | Stale: N | Gaps: N | Improvements: N

## Scores
| Skill | Score | Key issue |
|---|---|---|
| [name] | X/27 | [one-line summary] |

## Coherence Findings
[Contradictions, gaps, overlap, staleness, terminology — each with → resolution]

## Priority Improvements (Top 10)
1. **[title]** — [skill] — Severity: High — [description with before/after]

## Self-Improvement
[Suggested changes to this review process]
```

---

## Running the Review

### Quick review (30 minutes)
Phase 1 only (structural audit + spec compliance). Good for after adding a single new skill.

### Standard review (1–2 hours)
Phases 1–4. Full individual evaluation and coherence analysis. Run monthly or after significant changes.

### Deep review (half day)
All 5 phases including 3-pass self-critique. Full report with prioritised improvements. Run quarterly or when the library feels stale.

---

## Commands

### /review-skill

Review a single skill. Runs Phase 1 (structural + spec compliance) and Phase 2 (9-dimension scoring) on one skill.

**Invocation:** `/review-skill [skill-name]`

**Steps:**
1. Locate the skill at `skills/<skill-name>/SKILL.md` (or flag if it uses the flat `skills/<name>.md` legacy format)
2. Fetch the live Agent Skills spec from `https://agentskills.io/specification`
3. Run full spec validation (Core Rule 1 procedure) — check every spec rule against this skill, report pass/fail per rule
4. Run remaining Phase 1 checks (content structure, cross-references)
5. Run Phase 2 scoring on all 9 dimensions
6. For each finding, generate an improvement with before/after
7. Output the scoring template + improvements

**Output format:**
```markdown
# SKILL REVIEW — [skill-name] — [date]

## Spec Compliance
[Pass/Fail per check, with details on failures]

## Score: X/27

| Dimension | Score | Notes |
|---|---|---|
| ... | 1-3 | ... |

## Improvements
1. **[title]** — Severity: High/Medium/Low
   **Before:** ...
   **After:** ...
```

Skip Phase 3 (coherence) and Phase 5 (full report) — these require the full library.

### /review-all-skills

Review the entire skill library. Runs all 5 phases with 3-pass self-critique.

**Invocation:** `/review-all-skills`

**Steps:**
1. Enumerate all skills in `skills/`
2. Run Phase 1 on every skill — collect all structural and spec violations
3. Run Phase 2 on every skill — score all 9 dimensions
4. Run Phase 3 — coherence analysis across the full library (contradictions, overlap, gaps, staleness, composability, terminology, dependencies)
5. Run Phase 4 — generate prioritised improvements for all findings
6. Run Phase 5 — generate the full report using the report template
7. Run 3-pass self-critique (review → critique → synthesise)

**Output:** The full report template from Phase 5, including summary, scores table, spec compliance table, coherence findings, top 10 improvements, and self-improvement suggestions.

For large libraries (40+ skills), break execution into batches:
- Batch 1: Phase 1 on all skills (structural)
- Batch 2: Phase 2 on skills scoring below 22/27 in prior reviews (or all if first review)
- Batch 3: Phase 3 coherence on skill groups that share a domain or have `companionTo` links
- Batch 4: Phase 4 + 5 (improvements + report)

---

## Quality Gate

Before delivering a review report, verify:

- [ ] Phase 1 spec validation completed — live spec fetched and every rule checked per skill (directory, frontmatter, name, description, allowed fields, progressive disclosure)
- [ ] Phase 1 content structure checked — required sections, heading hierarchy, cross-references
- [ ] Phase 2 individual scores assigned — all 9 dimensions scored per skill with notes
- [ ] Phase 3 coherence analysis completed — contradictions, gaps, overlap, staleness, composability, terminology, and dependencies checked
- [ ] Phase 4 improvements generated — every finding has an actionable suggestion with severity
- [ ] Improvements ranked by priority (spec violations and contradictions first, polish last)
- [ ] Scores evaluated against external rubric (this skill's dimensions), not the skill's own standards
- [ ] Every finding includes a concrete improvement — no findings without actions, no actions without findings
- [ ] Full library reviewed for coherence, not just new/changed skills
- [ ] Report follows the structured template — usable as a prompt for the next session
- [ ] Self-improvement section included with suggestions for this review process
- [ ] 3-pass self-critique completed — initial review, critique, synthesise

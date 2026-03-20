---
name: skill-review
description: >
  Systematic review and improvement of a skill library. Evaluates individual
  skills against the skill-creation rubric, analyses collection coherence
  (contradictions, gaps, overlap, terminology), and generates a structured
  improvement report. Apply periodically to maintain skill quality, after
  adding new skills, or when skills feel stale or contradictory. The output
  report is designed to be used as a prompt for executing improvements.
---

# Skill Review

A skill library is a living system. Skills accumulate, drift, contradict, and overlap. Without periodic review, instruction quality degrades — rules get ignored because they conflict, gaps emerge as the project evolves, and terminology diverges until the same concept has three names.

This skill defines a systematic review process inspired by Anthropic's Skill Creator eval pattern (Executor → Grader → Comparator → Analyzer) and adapted for reviewing an entire library as a coherent whole.

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

### 1. Use an external rubric, not self-assessment

Each skill is evaluated against the **skill-creation** skill's rules — not against its own standards. This breaks the circular evaluation problem. A skill cannot pass review by defining low standards for itself.

The skill-creation skill defines: required sections, verifiability, specificity, examples, banned patterns, quality gate, and length limits. These are the rubric.

### 2. Review in three layers

| Layer | What it checks | Method |
|---|---|---|
| **Structural** | Format, sections, length, cross-references | Automated checks (no LLM needed) |
| **Individual quality** | Clarity, specificity, completeness, self-consistency | LLM-as-judge with external rubric |
| **Collection coherence** | Contradictions, gaps, overlap, terminology, separation of concerns | LLM pairwise analysis + aggregate |

Each layer catches different problems. Structural catches format violations. Individual catches weak or vague skills. Coherence catches systemic issues across the library.

### 3. The report is a prompt, not just an analysis

The output of a review is a structured report designed to be handed to a Claude session as input for executing improvements. Every finding includes: what's wrong, why it matters, and a concrete suggestion (with before/after where applicable). No finding without an action.

### 4. The review improves itself

Every review cycle evaluates the skill-creation rubric and this review skill against their own criteria. If the rubric has gaps (skills fail for reasons not covered by the rubric), the rubric evolves. If this review process missed something, it documents the miss and adjusts.

### 5. Three-pass self-critique

Research shows diminishing returns beyond 3 passes. The review follows:
1. **Initial review** — run all phases, produce findings
2. **Critique the review** — are the findings fair? Are scores calibrated? Did the review miss anything?
3. **Synthesise** — reconcile the review with its critique, produce the final report

---

## Phase 1: Structural Audit

Automated checks that require no LLM. These can be run as a script or manually.

### Per-skill checks

| Check | Pass criteria | Severity |
|---|---|---|
| **Line count** | ≤ 500 lines (≤ 200 if always-loaded) | Warning if exceeded |
| **Frontmatter** | Has `name` and `description` fields | Error if missing |
| **Description quality** | `description` includes trigger conditions (not just a topic label) | Warning if vague |
| **Required sections** | "When to Use", "Core Rules", "Banned Patterns", "Quality Gate" present | Error if missing |
| **Heading hierarchy** | No skipped levels (h1 → h3 without h2) | Warning |
| **Examples exist** | At least one code example in Core Rules | Warning if missing |
| **Banned patterns have alternatives** | Each ❌ item includes a → alternative | Warning if missing |
| **Quality gate has checkboxes** | Quality Gate uses `- [ ]` format | Warning |

### Cross-library checks

| Check | Pass criteria | Severity |
|---|---|---|
| **Cross-references resolve** | Every "see **skill-name**" reference matches an actual skill file | Error if broken |
| **No orphan skills** | Every skill is referenced by at least one other skill or by CLAUDE.md | Warning |
| **Naming consistency** | Skill file names match their `name` frontmatter field | Error if mismatch |
| **No duplicate names** | No two skills share the same `name` field | Error |

---

## Phase 2: Individual Skill Evaluation

For each skill, score on seven dimensions using the skill-creation rubric as the standard. Score each dimension 1–3 (1 = failing, 2 = adequate, 3 = strong).

### Evaluation dimensions

**Clarity (are instructions unambiguous?)**
- Can you determine from each instruction exactly what code to produce?
- Are there instructions that could be interpreted two ways?
- Do examples match the instructions they illustrate?

**Specificity (concrete enough to verify?)**
- Could you look at generated output and determine if each instruction was followed?
- Are there instructions like "write clean code" or "follow best practices" that teach nothing?
- Do banned patterns name specific things to avoid (not just "don't do bad things")?

**Completeness (edge cases covered?)**
- Does the "When to Use" section have clear triggers?
- Does the "When NOT to use" section exist where boundaries with other skills are ambiguous?
- Does the skill handle the obvious question "but what about [common edge case]?"

**Self-consistency (follows its own rules?)**
- If the skill says "use numbered lists for rules," does it use numbered lists?
- If the skill says "include examples for every code-governing rule," does every rule have an example?
- Does the skill's own structure match what it prescribes?

**Scope discipline (stays in its lane?)**
- Does the skill cover exactly what its description says, no more?
- Does it drift into topics covered by other skills?
- Could you cleanly delete this skill without losing coverage of another skill's territory?

**Trigger accuracy (would it activate correctly?)**
- Does the `description` field include enough keywords that the skill would be discovered for relevant tasks?
- Would the description cause false activation for irrelevant tasks?
- Is the "When to Use" section specific enough to prevent misuse?

**AI density (optimised for agent consumption?)**
- Does every line change what the agent produces? (Would removing it cause mistakes?)
- Is filler stripped? ("It's important to note...", "you might want to consider...", "as a best practice...")
- Are rules imperative with context, not hedged or vague?
- Are the 3 most critical rules in positions 1-3 of Core Rules? (primacy effect)
- Are examples provided for code-governing rules? (3-5x more effective than abstract rules)
- Is specificity at the "bounded precision" level? (verifiable but not over-rigid)
- Are negative instructions paired with positive alternatives? (bare negatives activate wrong concepts)
- Is urgency language used sparingly? (ALLCAPS overtriggers on Claude 4.6)

### Scoring template

```
## [skill-name] — Score: X/21

| Dimension | Score | Notes |
|---|---|---|
| Clarity | 1-3 | ... |
| Specificity | 1-3 | ... |
| Completeness | 1-3 | ... |
| Self-consistency | 1-3 | ... |
| Scope discipline | 1-3 | ... |
| Trigger accuracy | 1-3 | ... |
| AI density | 1-3 | ... |

Key findings:
- [finding 1]
- [finding 2]

Suggested improvements:
- [improvement with before/after if applicable]
```

---

## Phase 3: Collection Coherence Analysis

This phase evaluates how skills work together as a system. It is the most valuable and least automatable phase.

### Contradiction detection

Compare skills that govern overlapping domains. Look for instructions that directly conflict.

**Method:** For each pair of skills with potential overlap, ask: *"If I followed both skills simultaneously, would I ever receive contradictory instructions?"*

**Common contradiction zones:**
- Architecture skills vs framework-specific skills (clean-architecture vs nextjs-app-router)
- Coding standards vs frontend-architecture (function design principles vs widget patterns)
- Backend patterns vs security review (error handling approaches)
- UX skill vs content design (feedback patterns vs microcopy rules)

### Overlap and redundancy

Look for the same concept explained in multiple skills with different wording. Redundancy isn't always bad — reinforcement is useful. But different wording for the same rule creates ambiguity.

**Method:** Extract the core rules from each skill. Compare pairwise. Flag rules that govern the same behaviour but use different language.

**The test:** If a developer reads skill A and skill B, would they get confused about which rule to follow for a specific situation?

### Gap analysis

Define the full scope of what the skill library should cover (based on the project's needs). Check what has no skill coverage.

**Method:** List every type of work a developer does on the project. For each type, identify which skill(s) apply. Flag types with no coverage.

### Separation of concerns

Each skill should have a clear, exclusive responsibility. If you can't describe a skill's domain in one sentence without overlapping another skill, the boundaries are wrong.

**Method:** For each skill, write a one-sentence "this skill owns X" statement. Compare all statements. Flag overlaps.

### Terminology consistency

The same concept should have the same name across all skills.

**Method:** Extract key terms from each skill (domain concepts, pattern names, architectural terms). Flag any term that appears in multiple skills with different names or different definitions.

**Common terminology drift:**
- "handler" vs "controller" vs "action"
- "use case" vs "service" vs "business logic"
- "component" vs "widget" vs "element"
- "domain object" vs "entity" vs "model"

### Dependency graph

Map which skills reference which other skills. Check that:
- All references are valid (target skill exists)
- No circular dependencies (A requires B requires A)
- The dependency direction makes sense (specific skills depend on general ones, not reverse)

---

## Phase 4: Improvement Suggestions

For every finding from Phases 1–3, generate an actionable improvement.

### Improvement format

```
## Improvement: [short title]

**Skill(s):** [which skill(s) to change]
**Severity:** High / Medium / Low
**Type:** Contradiction / Gap / Overlap / Clarity / Completeness / Structure

**Finding:** [what's wrong and why it matters]

**Suggestion:** [what to change]

**Before:**
[current text, if applicable]

**After:**
[suggested text, if applicable]
```

### Priority ranking

1. **Contradictions** — highest priority. Two skills giving opposing instructions actively harms the developer.
2. **Gaps in critical areas** — no guidance where guidance is needed.
3. **Vague/unverifiable instructions** — rules that don't change behaviour.
4. **Structural issues** — missing required sections, broken references.
5. **Overlap/redundancy** — same rule in different words.
6. **Terminology drift** — inconsistent naming.
7. **Self-consistency failures** — skill doesn't follow its own rules.
8. **Polish** — phrasing, examples, formatting improvements.

### Self-improvement

Every review must include suggestions for:
- **skill-creation** — does the rubric need updating based on what this review found?
- **skill-review** (this skill) — did the review process miss something? Should a new check be added?

---

## Phase 5: Report Generation

The final output is a structured report designed to be used as a prompt.

### Report template

```markdown
# SKILL LIBRARY REVIEW — [date]

## Summary
- Skills reviewed: N
- Total score: X/Y (Z%)
- Contradictions found: N
- Gaps identified: N
- Improvements suggested: N

## Skill Scores

| Skill | Score | Key issue |
|---|---|---|
| [name] | X/21 | [one-line summary or "No issues"] |
| ... | ... | ... |

## Coherence Findings

### Contradictions
1. [skill-a] vs [skill-b]: [description]
   → Suggested resolution: [action]

### Gaps
1. [uncovered area]: [description]
   → Suggested action: [create new skill / expand existing skill]

### Overlap
1. [skill-a] and [skill-b] both cover [topic]
   → Suggested resolution: [consolidate / clarify boundaries]

### Terminology Issues
1. "[term-a]" in [skill-x] vs "[term-b]" in [skill-y] — same concept, different names
   → Standardise on: [chosen term]

## Priority Improvements (Top 10)

1. **[title]** — [skill] — Severity: High
   [One-paragraph description with before/after]

2. ...

## Self-Improvement Suggestions

### For skill-creation:
- [suggested rubric changes based on this review]

### For skill-review:
- [suggested process changes based on this review]

## Next Steps
To execute these improvements, start a new session with this report as context.
Focus on the top 3 priority improvements first.
```

---

## Running the Review

### Quick review (30 minutes)

Run Phase 1 (structural audit) only. Catches format issues, broken references, and length violations. Good for after adding a single new skill.

### Standard review (1–2 hours)

Run Phases 1–4. Full individual evaluation and coherence analysis. Run this monthly or after significant changes.

### Deep review (half day)

Run all 5 phases including the 3-pass self-critique. Produce the full report with prioritised improvements. Run this quarterly or when the library feels stale.

---

## Banned Patterns

- ❌ Self-assessment (a skill grading itself on its own quality criteria) → use the skill-creation rubric as external standard
- ❌ Review without actionable suggestions → every finding must include a concrete improvement
- ❌ Reviewing individual skills without coherence analysis → the library is a system; skills must work together
- ❌ One-pass review without self-critique → 3-pass: review, critique the review, synthesise
- ❌ Reviewing only new/changed skills → coherence requires reviewing the full library periodically
- ❌ Report as a wall of text → structured format with scores, findings, and prioritised actions
- ❌ Skipping self-improvement suggestions → every review must suggest improvements to the rubric and the review process itself
- ❌ More than 3 critique passes → diminishing returns; synthesise and move on

---

## Quality Gate

Before delivering a review report, verify:

- [ ] Phase 1 structural audit completed — all skills checked for format and cross-references
- [ ] Phase 2 individual scores assigned — all 7 dimensions scored per skill with notes
- [ ] Phase 3 coherence analysis completed — contradictions, gaps, overlap, terminology, and dependencies checked
- [ ] Phase 4 improvements generated — every finding has an actionable suggestion with severity
- [ ] Improvements ranked by priority (contradictions first, polish last)
- [ ] Self-improvement section included (suggestions for skill-creation and skill-review)
- [ ] Report follows the structured template — usable as a prompt for the next session
- [ ] 3-pass self-critique completed — review, critique, synthesise
- [ ] No findings without actions, no actions without findings

---
name: skill-creation
description: >
  Defines how to write effective AI coding skills (SKILL.md files).
  Apply this skill when creating, editing, or reviewing any skill file.
  A skill is a self-contained instruction set that steers AI code generation
  toward a specific outcome — architecture, styling, workflow, or domain pattern.
---

# Skill Creation

A skill is a standalone `.md` file that teaches an AI agent how to do one thing well. It is not documentation — it is a behavioural contract. Every sentence should change what the agent produces.

---

## When to Use

Apply this skill when:
- Creating a new skill file from scratch
- Editing or improving an existing skill
- Reviewing a skill for effectiveness before publishing
- Splitting a large skill into focused, composable pieces

---

## Core Rules

### 1. Research before writing

The skills that score highest in reviews (21/21) follow a consistent process: deep research on the domain → analysis of what fits → structured writing. Skills written without research score 15-17/21 and lack code examples, specificity, and edge case coverage.

**The process:**
1. Research the domain (published principles, practitioner findings, Anthropic's own guidance where applicable)
2. Analyse what applies to the skill's scope — discard what doesn't fit
3. Distil findings into verifiable rules with concrete examples
4. Write the skill using the required structure

Do not skip research because the domain seems familiar. Research surfaces non-obvious rules, correct thresholds, and edge cases that experience alone misses.

### 2. One skill, one concern

A skill governs one domain: architecture, styling, layout, a specific workflow. If you find yourself writing two unrelated sets of rules, split into two skills.

Why: Composability. Users combine skills per project. A monolithic skill forces all-or-nothing adoption.

### 2. Every instruction must be verifiable

If you cannot look at the generated output and determine whether the instruction was followed, the instruction is too vague.

```
# Bad — unverifiable
"Write clean, well-structured code"

# Good — verifiable
"Use 2-space indentation. One component per file. Name files PascalCase.tsx"
```

### 3. Lead with what to do, reinforce with what not to do

State the positive instruction as the primary rule. Add anti-patterns as a secondary catch for common failure modes.

```
# Good structure
"Use `var(--color-surface)` for card backgrounds."
→ Banned: hardcoded hex values in component styles.

# Bad structure
"Don't use hex colors. Don't use rgb. Don't use hsl."
→ (Agent knows what to avoid but not what to use)
```

### 4. Include the why for non-obvious rules

The agent generalises from the reason. A rule with motivation is followed in edge cases the rule doesn't literally cover. A rule without motivation is applied too literally or ignored.

```
# Without why — applied too literally
"Never import from other feature folders."

# With why — agent can reason about edge cases
"Never import from other feature folders. Why: features must be
independently deletable. If feature A imports from feature B,
deleting B breaks A."
```

### 5. Concrete examples beat abstract rules

One correct code snippet is worth five sentences of description. Show the pattern you want reproduced.

- 1–3 examples per major pattern
- Show both correct and incorrect when the distinction is subtle
- Use `// ✅ CORRECT` and `// ❌ WRONG` markers for scannability

### 6. Write for AI consumption, not human reading

The primary audience is the AI agent. Every sentence must change what the agent produces — apply the test: *"Would removing this line cause the agent to make mistakes?"* If not, delete it.

**Strip all filler:** "It's important to note that..." (6 wasted tokens), "You might want to consider..." (hedging reduces compliance), "As a best practice..." (meaningless qualifier). State the rule directly.

**Imperative with context is optimal:** "Use `var(--color-primary)` for primary actions — hex colours don't adapt to theme changes." The context helps the agent generalise to edge cases it hasn't seen.

**Normal language, not ALLCAPS urgency:** Claude 4.6 responds to direct language. "CRITICAL: YOU MUST..." causes overtriggering on current models. Reserve emphasis for the 1–2 rules that truly override defaults.

### 7. Keep it under 500 lines

Adherence degrades with length. If a skill exceeds 500 lines, split it or extract reference tables into a companion file.

- Under 200 lines: ideal for always-loaded skills
- 200–500 lines: acceptable for on-demand skills
- Over 500: split required

Target 2–3 verifiable rules per 100 tokens of instruction text (excluding code examples).

### 8. Structure for scanning — front-load critical rules

The agent shows a U-shaped attention curve: highest compliance for rules at the beginning and end, lowest for the middle (Liu et al., "Lost in the Middle", 2023).

**Structural mitigations:**
- Put the 3 most critical rules first in Core Rules (primacy effect)
- Put the Quality Gate last (recency effect — forces re-verification)
- Group middle rules under descriptive headers (creates attention reset points)
- One rule per bullet. Never embed two rules in one item.
- No prose paragraph longer than 3 sentences without a structural break
- Numbered rules get higher compliance than unnumbered ones
- Tables for any structured data with 3+ entries (most token-efficient format)

---

## Required Sections

Every skill MUST contain these sections in this order. Additional sections may be added between Core Rules and Banned Patterns where they add value.

### 1. Frontmatter

YAML metadata block. Required fields:

```yaml
---
name: skill-slug            # kebab-case, unique identifier
description: >
  One paragraph explaining what this skill governs, when to trigger it,
  and what kind of work it applies to. This is used for search and
  skill selection — be specific about trigger conditions.
---
```

The `description` field is critical — it determines whether the skill gets loaded for a given task. Include explicit trigger phrases: "Apply when creating components", "Trigger on any request involving database schema changes".

**For reference companions** (token tables, pattern specs, chart configs), add `type` and `companion_to`:

```yaml
---
name: brand-tokens-reference
type: reference
companion_to: brand-design-system
description: >
  Token lookup tables for the brand design system. This is a reference file,
  not a behavioural skill. For rules, see brand-design-system.
---
```

Reference companions contain lookup data (token tables, CSS blocks, pattern specs, code templates) extracted from a behavioural skill that would otherwise exceed the 500-line limit. They have no Core Rules, Banned Patterns, or Quality Gate — they are pure data. The parent skill cross-references them for the actual values.

### 2. When to Use

Explicit list of situations where this skill applies. Frame as "Apply this skill when:" followed by concrete triggers.

```markdown
## When to Use

Apply this skill when:
- Creating or modifying React components
- Adding a new page to the application
- Reviewing frontend code for architecture compliance
```

Why this matters: without it, the agent (or user) guesses whether the skill is relevant. Ambiguity leads to either over-application (noise) or under-application (missed rules).

Also include "Do NOT use this skill for:" when the boundary with a related skill is unclear.

### 3. Core Rules

The 3–10 most important behavioural rules. Each rule should be:
- Numbered for reference
- Stated as a direct instruction (imperative mood)
- Followed by a one-sentence rationale when the rule is non-obvious
- Accompanied by a code example when the rule governs code output

Rules are ordered by importance — the most critical rule is first.

### 4. Banned Patterns

Specific anti-patterns that the agent must avoid. These are the most common failure modes — the mistakes the agent would make without this skill.

```markdown
## Banned Patterns

- ❌ Hardcoded hex colors in component styles → use `var(--color-*)` tokens
- ❌ `any` type in TypeScript → use proper typing or `unknown`
- ❌ Data fetching inside stateless components → data belongs in widget hooks
```

Format: `❌ [what's banned] → [what to do instead]`. Always provide the alternative — a ban without a redirect leaves the agent stuck.

### 5. Quality Gate

A checklist the agent runs through before considering work complete. These are the final verification steps — not aspirational goals, but concrete pass/fail checks.

```markdown
## Quality Gate

Before delivering, verify:
- [ ] No `any` types introduced
- [ ] All new components use inline styles with CSS variables
- [ ] Widget has XS/SM/MD/LG size variants
- [ ] Data hook handles loading, error, and empty states
```

Frame as "Before delivering, verify:" — this anchors the checklist to the moment before the agent presents its output.

---

## Adding Sections Beyond the Required Four

Every skill is unique. The required sections (When to Use, Core Rules, Banned Patterns, Quality Gate) provide the skeleton, but the skill's subject matter determines what else is needed. Add sections when a rule or concept needs more space than an inline bullet can give it.

### When to add a section

Add a new section when:
- A concept requires its own examples, structure, or explanation that would clutter Core Rules
- A set of related rules form a natural group that deserves a named heading (e.g. "Folder Structure", "Data Flow", "Spacing Scale")
- Reference material (token tables, enum lists, configuration values) needs to be scannable independently
- The skill interacts with other skills and the boundaries need clarifying

### How to decide what sections a skill needs

Start with only the required four. Read the Core Rules — if any rule is carrying too much weight (long code examples, reference tables, multi-step workflows), extract that content into its own section. The section name should describe the content, not follow a template.

A styling skill might need "Colour Tokens" and "Typography Scale". An architecture skill might need "Folder Structure" and "Data Flow". A workflow skill might need "Step-by-Step Process" and "Edge Cases". There is no fixed list — the skill's domain dictates the sections.

### Placement

Custom sections go between Core Rules and Banned Patterns. This keeps the skill's flow: *what to do (rules) → how it works in detail (custom sections) → what not to do (bans) → final check (quality gate)*.

---

## AI Optimisation Principles

Skills are consumed by AI agents. These principles maximise compliance.

**Token efficiency:** Every line costs tokens from the context budget. A 200-line skill with 20% filler wastes 40 lines — that's 40 rules you can't include. Cut aggressively.

**Positive activates, negative paradoxically activates the wrong thing:** "Don't use Tailwind" activates the concept of Tailwind in the model's attention. "Use inline styles with CSS variables" doesn't activate Tailwind at all. Lead with what to do.

**Examples are 3-5x more effective than abstract rules:** Anthropic's own guidance calls examples "one of the most reliable ways to steer output." Budget ~60 tokens per example. The ROI is strongly positive.

**Specificity spectrum:**

| Level | Example | Compliance |
|---|---|---|
| Vague | "Functions should be small" | ~30% |
| Bounded | "Functions should be 5-25 lines" | ~70% |
| Precise | "Functions must be under 25 lines. Extract when exceeding." | ~90% |
| Over-specified | "Every function must be exactly 10-15 lines" | ~60% |

Target bounded precision: specific enough to verify, flexible enough to apply sensibly.

**Multi-rule compliance curve:** In a 10-rule document, rules 1-3 get ~95% compliance, rules 4-7 get ~80% (with headers), rules 8-10 get ~85% (Quality Gate re-check). Without structure, middle rules drop to ~55%.

---

## Skill Writing Anti-Patterns

- ❌ **Filler language** — "It's important to note that...", "you might want to consider...", "as a best practice..." — zero information, wastes tokens, dilutes signal.
- ❌ **Vague aspirational language** — "Write high-quality code" teaches nothing. Every sentence should change the output.
- ❌ **Duplicating framework docs** — Don't explain how React hooks work. Explain how YOUR hooks should be structured.
- ❌ **Urgency markers on every rule** — "CRITICAL: You MUST..." overtriggers on Claude 4.6. Normal language. Reserve emphasis for 1-2 true overrides.
- ❌ **Rules without examples** — If the rule governs code structure, show the structure. Abstract descriptions get misinterpreted.
- ❌ **Negative-only instructions** — A list of "don't do X" without positive alternatives activates the wrong concepts.
- ❌ **Monolithic skills** — A 1000-line skill covering architecture, styling, and testing is three skills pretending to be one.
- ❌ **Prose where tables work** — token tables, breakpoint specs, and file paths should be tables, not sentences.
- ❌ **Hedging** — "You might consider using..." reduces compliance. State the instruction directly.

---

## Banned Patterns

- ❌ Skill without a "When to Use" section → agent or user cannot determine relevance
- ❌ Skill without a "Quality Gate" section → no verification step, output quality drifts
- ❌ Instructions that cannot be verified from output → rewrite as concrete, checkable rules
- ❌ Rules without rationale for non-obvious constraints → add a "Why:" line
- ❌ Examples that don't match the actual codebase patterns → update examples when codebase evolves
- ❌ Over 500 lines in a single skill file → split into focused skills or extract reference data into a companion
- ❌ Cross-references to skills that don't exist → every "see **skill-name**" must match an actual skill file
- ❌ Reference data (token tables, CSS blocks, pattern specs) inline in a behavioural skill that pushes it over 500 lines → extract to a companion with `type: reference`

---

## Quality Gate

Before delivering a skill, verify:

- [ ] Domain was researched before writing (published principles, practitioner findings, Anthropic guidance)
- [ ] Has YAML frontmatter with `name` and `description`
- [ ] `description` includes explicit trigger conditions
- [ ] Has "When to Use" section with concrete triggers
- [ ] Has "Core Rules" section with numbered, verifiable rules
- [ ] Non-obvious rules include a rationale (why)
- [ ] Code-governing rules include at least one example
- [ ] Has "Banned Patterns" section with alternatives for each ban
- [ ] Has "Quality Gate" section with pass/fail checklist items
- [ ] Total length is under 500 lines (under 200 if always-loaded). Reference data extracted to companion if needed.
- [ ] Governs one concern — not two unrelated topics
- [ ] All cross-references (`see **skill-name**`) resolve to actual skill files
- [ ] If a companion file exists, it has `type: reference` and `companion_to` in frontmatter
- [ ] No vague, unverifiable instructions remain
- [ ] Examples use `✅` / `❌` markers for scannability

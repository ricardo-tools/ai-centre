---
name: eval-driven-development
description: >
  Patterns for evaluating AI-generated outputs systematically. Covers eval design,
  the EDD workflow, deterministic and LLM-as-judge evals, handling non-determinism,
  CI/CD integration, and the eval feedback loop. Apply when building any feature
  with AI-generated output — text generation, code generation, classification,
  extraction, or agentic workflows. The eval is the spec.
---

# Eval Driven Development

If you cannot define what "correct" looks like for your AI feature, you are not ready to build it. An eval is a function that takes an AI output and returns a score. The collection of evals for a feature *is* the specification — not the prompt, not the system design, not the model choice.

EDD is not strict test-first. For known constraints (format, safety, "never mention X"), write the eval before the prompt. For quality and correctness, get initial outputs first, analyse the failures, then write evals for what you find. The eval set grows from real errors, not imagined ones.

---

## When to Use

Apply this skill when:
- Building any feature with AI-generated output (showcases, summaries, classifications, code)
- Iterating on prompts or system prompts
- Switching models or model versions
- Adding AI-powered agentic workflows (tool use, multi-step)
- Setting up CI/CD for AI features
- Diagnosing quality regressions in AI outputs

Do NOT use this skill for:
- Testing deterministic code (functions, APIs, components) — use standard tests
- Evaluating the AI model itself (benchmarks) — that's the model provider's job
- Prompt engineering technique — see **ai-claude** for prompt patterns

---

## Core Rules

### 1. The eval is the spec

Before building an AI feature, express "correct" as a function. If you cannot write an eval, you do not yet understand what you're building. The eval forces you to be precise about what matters.

For showcase generation: "correct" means the HTML contains required sections, renders without errors, mentions the skill's actual capabilities, and is free of script tags. Each of those is a separate eval.

### 2. Start from real failures, not imagined ones

Don't try to anticipate every failure mode before you have outputs to examine. The failure surface of an LLM is infinite — you cannot pre-enumerate it.

**The practical workflow:**
1. Build a first version of the feature with a reasonable prompt
2. Generate 20–50 outputs against real inputs
3. Review the outputs — find what's wrong
4. Write evals for the failures you actually see
5. Fix the system, re-run evals, repeat

**The exception:** hard constraints (format requirements, safety guardrails, "never include script tags") — write these evals first because you know the requirement upfront.

### 3. Layer evals: deterministic first, judge second, human for calibration

Not all evals cost the same. Use the cheapest eval that can catch the issue.

| Layer | Cost | Speed | Use for |
|---|---|---|---|
| **Deterministic** (code-based) | Free | Instant | Format, structure, length, required sections, banned content, JSON validity, regex patterns |
| **LLM-as-judge** | ~$0.01–0.10 per eval | 1–5s | Quality, coherence, factual accuracy, tone, helpfulness — anything subjective |
| **Human review** | Expensive | Slow | Calibration, edge cases, final quality bar, validating that automated evals align with real quality |

Run deterministic evals first. Only invoke an LLM judge for what code cannot check. Use human review to calibrate your automated evals, not as the primary eval mechanism.

### 4. Grade outcomes, not paths

Don't check that the AI called specific tools in a specific sequence. Don't check that the output contains specific phrases. Check that the *result* is correct.

```ts
// ✅ Outcome-based — checks what matters
function evalShowcaseHasRequiredSections(html: string): boolean {
  const doc = parseHtml(html);
  return ['h1', 'h2', 'pre code'].every(sel => doc.querySelector(sel) !== null);
}

// ❌ Path-based — brittle, breaks when the model finds a different valid approach
function evalShowcaseUsedCorrectPromptTemplate(trace: Trace): boolean {
  return trace.messages[0].content.includes('Generate a showcase');
}
```

Why: AI agents find valid approaches you didn't anticipate. Path-based evals penalise correct results that were produced differently than you expected.

### 5. Handle non-determinism statistically

The same prompt produces different outputs each run. A single pass/fail tells you nothing. Run N times, measure pass rates.

- **Minimum: 5 runs per test case** for development iteration
- **20+ runs** for reliable pass rate measurement
- **Report confidence intervals**, not just point estimates
- **Use low temperature** (0.0–0.2) for eval runs to reduce variance
- **Binary PASS/FAIL** per eval forces clarity — avoid 1–5 scales that let ambiguous cases hide in the middle

```ts
async function measurePassRate(
  evalFn: (output: string) => boolean,
  generateFn: () => Promise<string>,
  runs: number = 20,
): Promise<{ passRate: number; passed: number; total: number }> {
  const results = await Promise.all(
    Array.from({ length: runs }, () => generateFn().then(evalFn))
  );
  const passed = results.filter(Boolean).length;
  return { passRate: passed / runs, passed, total: runs };
}
```

### 6. Evals are living artifacts

An eval set that never changes becomes stale. As the system improves, 100% pass rate means the evals track regressions but provide no signal for improvement.

- **Continuously source new cases** from production outputs and user feedback
- **Promote hard cases** — when a production output fails, add it to the eval set
- **Retire trivial evals** that haven't failed in months — they consume budget without signal
- **Refresh with harder cases** as the system improves

---

## The EDD Workflow

```
1. Define hard constraints → write deterministic evals for them
                ↓
2. Build first version → reasonable prompt, working feature
                ↓
3. Generate 20–50 outputs → against real, diverse inputs
                ↓
4. Error analysis → review outputs, categorise failures
                ↓
5. Write evals for failures found → deterministic where possible, judge where needed
                ↓
6. Fix the system → change prompt, model, retrieval, post-processing
                ↓
7. Re-run evals → verify improvement without regression
                ↓
8. Ship → with eval suite as quality gate in CI
                ↓
9. Monitor production → sample and score real outputs
                ↓
10. Promote failures to eval set → the flywheel continues
```

**Step 4 is the most valuable step.** Looking at actual outputs with domain expertise reveals failure modes you would never anticipate. Build a simple interface (even a script that prints outputs to terminal) that lets you review AI outputs quickly.

---

## Eval Types

### Deterministic (code-based)

Check objective, machine-verifiable properties. These are your first line of defence — free, fast, deterministic.

```ts
// Structure check
const hasRequiredHeadings = (html: string) =>
  ['h1', 'h2'].every(tag => html.includes(`<${tag}`));

// Safety check
const noScriptTags = (html: string) =>
  !/<script[\s>]/i.test(html);

// Format check
const isValidJson = (output: string) => {
  try { JSON.parse(output); return true; }
  catch { return false; }
};

// Content check
const mentionsSkillTitle = (html: string, skillTitle: string) =>
  html.toLowerCase().includes(skillTitle.toLowerCase());

// Length bounds
const isReasonableLength = (output: string) =>
  output.length > 500 && output.length < 50000;
```

### LLM-as-Judge

Use another model to evaluate subjective quality. The judge model should ideally be stronger than the model being evaluated.

```ts
async function judgeShowcaseQuality(
  showcase: string,
  skillContent: string,
): Promise<{ pass: boolean; reasoning: string }> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    temperature: 0,
    messages: [{
      role: 'user',
      content: `You are evaluating an AI-generated skill showcase page.

SKILL SPECIFICATION:
${skillContent}

GENERATED SHOWCASE:
${showcase}

Evaluate on this single criterion: Does the showcase accurately represent the skill's capabilities without hallucinating features that aren't in the specification?

Respond with JSON:
{ "pass": true/false, "reasoning": "one sentence explanation" }

A PASS means every capability mentioned in the showcase is grounded in the skill specification. A FAIL means the showcase claims capabilities not present in the spec.`,
    }],
  });

  return JSON.parse(response.content[0].text);
}
```

**Judge design principles:**
- **One criterion per judge call.** Decompose "is this good?" into specific dimensions — accuracy, completeness, safety, tone. One judge prompt per dimension.
- **Binary PASS/FAIL, not 1–5 scales.** Forces the judge to commit. Scales produce ambiguous middle scores.
- **Include threshold examples.** Show the judge what a borderline case looks like and which side it falls on.
- **Low temperature (0).** You want consistency, not creativity, from your judge.
- **Validate the judge.** Run it against known-good and known-bad outputs. Track true positive and true negative rates. If the judge doesn't discriminate, it's useless.

**Known biases:**
- Position bias — tends to favour first or last option in comparisons. Mitigate: randomise position.
- Verbosity bias — prefers longer outputs. Mitigate: judge on specific criteria, not overall preference.
- Self-preference — models rate their own outputs higher. Mitigate: use a different model as judge.

### Human Review

Use for calibration and final quality bar. Not scalable as the primary eval mechanism.

- Have domain experts review a sample of outputs (10–20%) during development
- Use to validate that automated evals align with real quality perception
- Build a simple review interface — even a terminal script that shows output + asks PASS/FAIL
- Capture disagreements between human and automated evals — these reveal calibration gaps

---

## Eval Dataset

### Structure

```ts
interface EvalCase {
  id: string;                    // unique, stable identifier
  input: Record<string, unknown>; // the inputs to your AI feature
  metadata: {
    source: 'production' | 'synthetic' | 'expert';
    addedAt: string;             // ISO date
    category: string;            // e.g. 'format', 'accuracy', 'safety'
  };
  // No expected output — evals check properties, not exact matches
}
```

### How many cases?

| Phase | Cases | Why |
|---|---|---|
| First iteration | 20–50 | Each change has a large effect — small sample suffices |
| Stabilising | 50–200 | Detect smaller regressions |
| Mature system | 200+ | Statistical power for subtle improvements |

Start small. Grow the dataset from real failures, not by generating synthetic cases upfront.

### Avoiding overfitting

Your eval set is adversarially selected — you find a failure and add it. Over time, the set becomes a collection of known issues. The system can pass all evals while failing on novel inputs.

Mitigations:
- Continuously add cases from production (not just known failures)
- Periodically run on a held-out set that wasn't used during development
- Watch for eval saturation — if pass rate is 100% for months, add harder cases

---

## CI/CD Integration

### Tiered approach

| Trigger | Evals to run | Cost |
|---|---|---|
| Every commit | Deterministic evals only | Free |
| Every PR | Deterministic + LLM-judge on core cases | Low (~$0.50–5.00) |
| Nightly / scheduled | Full suite including expensive judge evals | Medium |
| Model swap / major change | Full suite × N runs with statistical comparison | High |

### Regression gating

Block merge if any of these regress:
- Any deterministic eval that was passing now fails
- LLM-judge pass rate drops below threshold (e.g. 85%)
- New eval cases added from production fail on the PR branch

### Minimal CI setup

No platform required. A test file + dataset + scoring script is enough:

```ts
// evals/showcase.eval.ts
import { describe, test, expect } from 'vitest';
import { generateShowcase } from '../src/features/showcase/generate';
import evalCases from './datasets/showcase-cases.json';

describe('showcase evals', () => {
  for (const evalCase of evalCases) {
    test(`${evalCase.id}: has required sections`, async () => {
      const output = await generateShowcase(evalCase.input);
      expect(output).toMatch(/<h1/);
      expect(output).toMatch(/<h2/);
      expect(output).toMatch(/<pre/);
    });

    test(`${evalCase.id}: no script tags`, async () => {
      const output = await generateShowcase(evalCase.input);
      expect(output).not.toMatch(/<script/i);
    });
  }
});
```

Run with `npx vitest run evals/` in CI. No special framework needed.

---

## Banned Patterns

- ❌ Vibe-based development — eyeballing a few outputs and shipping → define evals, measure pass rates
- ❌ Writing evals for imagined failures before seeing real outputs → start from error analysis of actual outputs (except hard constraints)
- ❌ Path-based evals (checking tool call sequences or specific phrases) → grade outcomes
- ❌ 1–5 quality scales without threshold definitions → binary PASS/FAIL with clear criteria
- ❌ Single-run pass/fail conclusions → run N times, report pass rates with confidence intervals
- ❌ LLM-judge for objectively checkable properties → use deterministic code checks first
- ❌ Multi-criteria judge prompts ("rate quality, accuracy, and tone") → one criterion per judge call
- ❌ Eval set that never grows → continuously source from production, promote hard cases
- ❌ 100% pass rate treated as success → likely eval saturation; add harder cases
- ❌ Evals that only run locally → integrate into CI; deterministic on every commit, judge on PR

---

## Quality Gate

Before shipping an AI feature, verify:

- [ ] "Correct" is defined as evaluable functions, not prose descriptions
- [ ] Hard constraints (format, safety, banned content) have deterministic evals
- [ ] Quality criteria have LLM-judge evals with clear single-criterion rubrics
- [ ] Eval dataset has 20+ cases sourced from real inputs (not just synthetic)
- [ ] Pass rates measured over N runs (minimum 5 during dev, 20 for release decisions)
- [ ] Deterministic evals run in CI on every commit
- [ ] LLM-judge evals run in CI on every PR
- [ ] Regression gating configured — merge blocked if pass rates drop
- [ ] LLM judges validated against known-good and known-bad outputs
- [ ] Production outputs sampled and scored (feedback loop to grow eval set)
- [ ] Domain expert has reviewed a sample of outputs (10–20%) for calibration

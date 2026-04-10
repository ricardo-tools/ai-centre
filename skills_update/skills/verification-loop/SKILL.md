---
name: verification-loop
description: >
  Verification discipline for AI-assisted development sessions. Defines when
  and how to verify work — quick checks after changes, full reviews before
  milestones. Covers build verification, AI-specific mistake detection, skill
  quality gate checks, and human review guidance. Apply after completing any
  code change, before committing, and before creating a PR.
---

# Verification Loop

Every code change should be verified before being considered done. AI agents make characteristic mistakes that automated linters don't catch — unintended edits to nearby code, import drift, inconsistent naming, style violations outside the changed area. Verification is the discipline that catches these before they compound.

This skill defines *what* to verify and *when*. The specific commands (`npm run build`, `npx tsc`) depend on the project — use whatever the project's `package.json` scripts and CI pipeline define.

---

## When to Use

Apply this skill:
- After completing any code change (quick check)
- Before committing (standard check)
- Before creating a PR or marking a milestone complete (full review)
- After refactoring that touches multiple files
- When returning to work after a compaction or new session

---

## Core Rules

### 1. Two modes — match the moment

Not every verification needs a full review. Use the right level for the moment.

**Quick check** (after each change, ~30 seconds):
- Does the project still build?
- Does the change do what was intended?
- No unintended modifications to other files?

**Full review** (before commit/PR, ~5 minutes):
- All phases below, in order
- Skill quality gates checked
- Human review of the diff

### 2. Fail fast — stop on build failure

Run verification in severity order. If the build is broken, nothing else matters. Fix the build before checking types. Fix types before checking lint. Don't pile up errors across phases.

### 3. Verify what the AI changed, not just what was requested

AI agents frequently modify more than what was asked. The diff is the source of truth — review every changed file, not just the ones you expected to change.

### 4. Check against skill quality gates

Each skill in the project defines a Quality Gate section. After making changes governed by a skill, run through its checklist. The verification loop is where those checklists are actually enforced.

---

## Verification Phases

Run in this order. Stop and fix if any phase fails before continuing to the next.

### Phase 1: Build

Run the project's build command. If it fails, stop everything and fix.

This catches: missing imports, syntax errors, configuration issues, dependency problems. It is the cheapest and most important check.

### Phase 2: Type Check

Run the TypeScript compiler in check-only mode (no emit). Fix all type errors.

This catches: wrong argument types, missing properties, null safety violations, interface mismatches. Type errors after an AI change often indicate the model misunderstood a function signature.

### Phase 3: Lint

Run the project's linter. Fix errors. Warnings can be deferred if they're pre-existing — new warnings introduced by this change should be fixed.

This catches: unused imports, unused variables, formatting violations, basic code quality issues.

### Phase 4: Tests

Run the test suite. All tests must pass. If a test that was passing now fails, the change introduced a regression — fix it before continuing.

For new functionality: verify that tests exist if the project requires them. Not all changes need new tests, but behaviour changes and bug fixes should be covered.

### Phase 5: Diff Review

This is the most important phase for AI-assisted work. Review the actual diff — every file, every change.

**What to look for:**

| Check | What it catches |
|---|---|
| Files you didn't expect to change | AI agents edit nearby code, add unused imports, or "improve" code that wasn't part of the task |
| Deleted code that shouldn't be deleted | AI agents sometimes remove code they don't understand or consider unused |
| Inconsistent naming | New function uses `get` where the codebase uses `fetch`, or vice versa |
| Style violations | Hardcoded colours where the project uses CSS variables, Tailwind classes where the project uses inline styles |
| Missing error handling | New async code without try/catch, new fetch calls without error states |
| Hardcoded values | Magic strings or numbers that should be constants or config |
| Import changes | New dependencies added unnecessarily, imports from wrong layers (feature importing from feature) |
| Console.log / debug code left in | Temporary debugging that should be removed |

**AI-specific mistake checklist** (check explicitly during every diff review):

- [ ] **Unintended scope expansion** — is every changed line related to the task? Revert unrelated "improvements" to functions B and C.
- [ ] **Import drift** — imports from the wrong architectural layer (widget → database, feature → feature)? Check against **clean-architecture** rules.
- [ ] **Style inconsistency** — different pattern than the codebase (class vs function components, Tailwind vs inline styles, `interface` vs `type`)? Check against **coding-standards** and **frontend-architecture**.
- [ ] **Phantom dependencies** — imports a package that isn't installed, or adds an unnecessary dependency? Verify imports resolve and `package.json` changes are intentional.
- [ ] **Over-engineering** — added error handling, validation, or abstraction that wasn't requested? Remove if it doesn't serve the current task.
- [ ] **Stale comments and dead code** — commented-out code, TODOs referencing completed work, outdated JSDoc? Every comment must still apply.

---

## Skill Quality Gate Verification

After changes governed by a specific skill, check that skill's Quality Gate. The most commonly relevant gates:

**After UI changes** → check **frontend-architecture** Quality Gate:
- Widget has XS/SM/MD/LG variants?
- Styles use `var(--color-*)`, no hex, no Tailwind in JSX?
- Widget registered in registry?

**After server-side changes** → check **backend-patterns** Quality Gate:
- Server Action contains no business logic?
- Input validated with schema?
- No raw DB rows leaking past mapper boundary?

**After new feature** → check **clean-architecture** Quality Gate:
- Feature lives in `features/<name>/`?
- No imports from other features?
- Domain objects enforce invariants via methods?

**After any code** → check **coding-standards** Quality Gate:
- Functions are composable (value-in, value-out)?
- Names use full words and domain language?
- No `any` types, no magic numbers?

---

## Verification Report

After a full review, produce a structured report:

```
VERIFICATION REPORT
===================

Build:     PASS / FAIL
Types:     PASS / FAIL (N errors)
Lint:      PASS / FAIL (N errors, M warnings)
Tests:     PASS / FAIL (X/Y passed)
Diff:      N files changed — all reviewed

Skill gates checked:
- frontend-architecture: PASS
- coding-standards: PASS

Issues found:
1. ...
2. ...

Status: READY / NOT READY
```

---

## When Verification Fails

### Prioritise by phase

Build failure > type errors > test failures > lint issues > diff concerns. Fix in this order.

### Revert vs fix

If the change introduced more problems than it solved, revert and try a different approach. Don't spend 30 minutes patching a change that was wrong in concept. A clean revert is faster and safer.

### Escalate to the user

If verification reveals a design question (not just a bug), surface it. "The change works but introduces a dependency from feature A to feature B. Should I refactor to extract the shared logic to platform, or is this acceptable?" The human decides architectural trade-offs.

---

## Human Review Guidance

Automated checks catch syntax, types, and test regressions. Humans catch:

- **Intent alignment** — does the change actually solve the problem, or does it solve a different problem accurately?
- **Architectural fit** — does the change belong here, or should it be structured differently?
- **Edge cases** — what happens with empty data, null values, concurrent access, or error states?
- **Naming quality** — are the names clear to someone who doesn't have this conversation's context?
- **Future maintenance** — will someone reading this code in 3 months understand why it was written this way?

Skim the automated results. Spend your review time on these questions.

---

## Banned Patterns

- ❌ Skipping build check before moving to next task → build failure compounds across changes
- ❌ Reviewing only files you expected to change → always review the full diff
- ❌ Ignoring new lint warnings ("they're just warnings") → new warnings from this change should be fixed
- ❌ Committing without running tests → tests are the safety net; don't bypass them
- ❌ Spending 30 minutes patching a fundamentally wrong approach → revert and try differently
- ❌ Only running automated checks without reading the diff → the diff review catches what automation misses
- ❌ Treating verification as optional when "the change is small" → small changes cause big regressions

---

## Quality Gate

Before considering any change complete, verify:

- [ ] Build passes
- [ ] Type check passes (zero errors)
- [ ] Lint passes (no new errors or warnings from this change)
- [ ] Tests pass (no regressions)
- [ ] Full diff reviewed — every changed file, every changed line
- [ ] No unintended changes to files outside the task scope
- [ ] No new imports from wrong architectural layers
- [ ] No style inconsistencies with the existing codebase
- [ ] No hardcoded values, debug code, or commented-out code
- [ ] Relevant skill quality gates checked and passing
- [ ] If issues found: fixed, reverted, or escalated — never ignored

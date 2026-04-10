# Tooling Plan Chapter Template

> **This file is a tooling template.** Use it for work that modifies skills, commands, configuration, documentation, or project infrastructure — NOT feature development. For features, use `PLAN_TEMPLATE_DEV.md`.

---

## Tooling Methodology

> **This section is fixed.** It appears identically in every tooling chapter.

```
FOR EACH ITEM (or batch of related items):

  1. DEFINE — DEFINER subagent

     Each definition must include:
       - What changes (file, section, content)
       - Why (what problem it solves or what capability it adds)
       - Acceptance criteria (how you know it's correct)

     Return: definition with file paths, content, and acceptance criteria.

  !! COORDINATOR CHECKPOINT (CRITICAL):
     Before proceeding, the coordinator MUST verify:
     - The definition covers everything the item description requires
     - All affected files are listed (not just the primary file)
     - Acceptance criteria are specific and verifiable
     - Cross-references to other items are identified
     Reject and re-dispatch if anything is missing.

  2. APPLY — WRITER subagent

     Receives the approved definition. Applies it exactly.
     Does NOT make additional changes beyond the definition.
     This is a DIFFERENT agent from the definer — fresh context,
     works only from the definition, not from assumptions.

     Return: files changed, confirmation.

  !! COORDINATOR CHECKPOINT:
     Before proceeding, verify:
     - Every file listed in the definition was modified
     - No files were changed that weren't in the definition
     Reject and re-dispatch if anything is off.

  → NEXT ITEM

AFTER ALL ITEMS APPLIED:

  3. CROSS-REVIEWER subagent — reviews ALL changes together

     A fresh agent that has NOT seen the define or apply steps.
     Reads all changed files with no prior context. Checks for:
       - Consistency: do all items follow the same patterns and structure?
       - Overlap: do any items duplicate each other's work?
       - Gaps: are there missing items that the work implies but doesn't
         include? (e.g., a renamed skill file with stale references elsewhere)
       - Completeness: are all cross-references between files correct?

     Return: findings (approved or issues list).

  !! COORDINATOR CHECKPOINT:
     If issues found → dispatch a FIXER subagent to fix, then re-run
     cross-review with a NEW cross-reviewer.
     If approved → proceed.

  4. DRY-RUNNER subagent — simulates each change against a real scenario

     A fresh agent. For each item that has runtime behaviour, walk through
     a concrete scenario step by step. Does the definition hold up? Are
     there edge cases it doesn't cover?

     If an item cannot be meaningfully dry-run (e.g., a file rename),
     mark it as "verified by inspection" and move on.

     Return: dry-run results (pass/fail per item + issues found).

  !! COORDINATOR CHECKPOINT:
     If dry-run issues found → dispatch a FIXER subagent to fix, re-run
     the specific dry-run with a NEW dry-runner.
     If all pass → proceed.

  5. VERIFIER subagent — confirms all changes are correct

     A fresh agent with no prior context. Reads all changed files and
     verifies:
       - Every definition was applied correctly
       - All cross-references between files are consistent
       - No stale references to old names/paths remain
       - Acceptance criteria for every item are met

     Return: verified or corrections needed.

  IF CORRECTIONS NEEDED → dispatch FIXER, re-verify with NEW verifier.

  6. UPDATE LOGS — parallel subagents

     6a. LOG UPDATER — updates .plans/LOG.md (see .claude/skills/flow-plan-log/SKILL.md)
     6b. REFERENCE UPDATER — updates PROJECT_REFERENCE.md if applicable

  7. LOG VALIDATOR subagent — cross-references logs against codebase

  The chapter is not done until step 7 confirms logs are accurate.
```

---

## Chapter Header

```markdown
# Chapter N.N: [Title]

**Status:** Not started | In progress | Complete
**Type:** Tooling
**Depends on:** [if any]
**Unlocks:** [if any]

## Goal

[One paragraph: what this chapter delivers and how you know it's done.]
```

---

## Implementation Items

> **List each change as an item.** Items replace "scenarios" from the dev template. Each item is a discrete, verifiable change.

```markdown
## Items

### Item 1: [Short title]

**What:** [What changes — file, section, content summary]
**Why:** [What problem it solves]
**Files:** [Affected file paths]
**Acceptance criteria:**
- [Specific, verifiable condition]
- [Another condition]

### Item 2: [Short title]
...
```

---

## Dry-Run Scenarios

> **For each item that has runtime behaviour, describe a scenario to simulate.**

```markdown
## Dry-Run Scenarios

### DR1: [Item title] — [scenario description]

**Setup:** [What state to assume]
**Action:** [What the user/system does]
**Expected:** [What should happen, step by step]
```

---

## Completion Checklist

```markdown
## Completion Checklist

- [ ] All items defined and reviewed
- [ ] Cross-review passed (consistency, no overlap, no gaps)
- [ ] Dry-runs passed for all applicable items
- [ ] All files updated
- [ ] Verification passed (no stale references)
- [ ] LOG.md updated
- [ ] PROJECT_REFERENCE.md updated (if applicable)
```

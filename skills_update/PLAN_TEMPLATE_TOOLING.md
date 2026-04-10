# Tooling Plan Chapter Template

> Use for work that modifies skills, commands, configuration, documentation, or project infrastructure — NOT feature development. For features, use `PLAN_TEMPLATE_DEV.md`.

---

## Tooling Methodology

One chapter = one concern. Each item is a discrete, verifiable change.

```
FOR EACH CHAPTER:

  1. DEFINE   For each item: what changes, why, acceptance criteria.
             List all affected files — not just the primary file.
  ┄┄┄┄┄┄┄┄
  GATE 1    Verify:
            □ Every item has: what, why, files, acceptance criteria
            □ Cross-references between items identified
            □ All affected files listed (including references)

  2. APPLY   Apply definitions exactly. No changes beyond what's defined.
  ┄┄┄┄┄┄┄┄
  GATE 2    Verify:
            □ Every file from definitions was modified
            □ No unplanned files changed

  3. REVIEW  Review ALL changes together for:
             □ Consistency (same patterns, structure)
             □ No overlap or duplication
             □ No gaps (missing implied changes)
             □ Cross-references correct
             Fail → fix and re-review.

  4. DRY-RUN Walk through a concrete scenario for each item with
             runtime behaviour. Mark inspect-only items as verified.
             Fail → fix and re-run.

  5. VERIFY  All definitions applied correctly, no stale references,
             acceptance criteria met.
             Fail → fix and re-verify.

  6. LOG     Update LOG.md + plan.md status.
             Update PROJECT_REFERENCE.md if applicable.
```

---

## Chapter Header

> **Fill per-chapter.**

```markdown
# Chapter N: [Title]

**Status:** Not started | In progress | Complete
**Type:** Tooling
**Depends on:** [if any]

## Goal

[One paragraph: what this chapter delivers and how you know it's done.]
```

---

## Items

> **List each change as an item.** Items replace scenarios. Each is discrete and verifiable.

```markdown
## Items

### Item 1: [Short title]

**What:** [What changes — file, section, content summary]
**Why:** [What problem it solves]
**Files:** [Affected file paths]
**Acceptance criteria:**
- [Specific, verifiable condition]
- [Another condition]
```

---

## Dry-Run Scenarios

> **For each item with runtime behaviour, describe a scenario to simulate.**

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
- [ ] Verification passed (no stale references)
- [ ] LOG.md updated
- [ ] PROJECT_REFERENCE.md updated (if applicable)
```

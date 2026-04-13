# Chapter 9: Showcase Version History

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 8
**User can:** See version history with commit messages on the showcase viewer page, and rollback to a previous version.

## Goal

Add version history panel to the showcase viewer and rollback capability via both UI and CLI. After this chapter, users can see all versions of a showcase and restore any previous version.

---

## Development Methodology

One chapter = one concern. The chapter's "User can" line is the spec.

```
FOR EACH CHAPTER:

  1. TEST    Write failing tests for what "User can" describes.
             Extend journey test with this chapter's increment.
             Impact table for existing tests (keep/update/new/remove).
             No production code. Ref: flow-tdd skill.
  --------
  GATE 1    Verify:
            [] Impact table present (keep/update/new/remove)
            [] Every layer has a test file
            [] Journey test extended with this chapter's assertions
            [] Tests FAIL

  2. BUILD   Minimum production code + polish.
             Follow the mockups, state spec, and guidelines in this chapter.
             Every code path must log (start, complete, error). Ref: flow-observability skill.
             Code must be small, composable, type-safe. Ref: coding-standards skill.
  --------
  GATE 2    Verify:
            [] Every critical file from this chapter exists
            [] Polish criteria met
            [] Structured logging on every server action and data path

  3. EVAL    Runtime: pages render, APIs respond, no error logs, DB correct.
             Ref: flow-eval-driven skill.
             Fail -> fix and re-eval.

  4. RUN     Run chapter tests + full vitest suite + tsc + build.
             Fail -> fix and re-run.
  --------
  GATE 3    Verify:
            [] All chapter tests GREEN
            [] No regressions

  5. AUDIT   Proportional to what changed (see Audit Scope below).
             Fail -> fix and re-run from step 4.

  6. LOG     Update LOG.md + plan.md status.

COMPACT at every 10 dispatches or phase boundary.
Checkpoint -> .claude/.strategic-context/ -> compact -> re-read plan.
```

### Polish & UX (apply to all work in every chapter)

- Feedback is instant — every action gets visible response within 100ms
- Every state change is animated — enter, leave, move, status change
- Every action gets motion feedback — the user never wonders "did that work?"
- Errors are helpful — show what went wrong, keep the user's work, suggest next step
- Empty states guide — icon + text + action button
- Visual hierarchy — primary (what they're acting on), secondary (metadata), tertiary (system info)
- Microcopy is short — labels are noun phrases, confirmations name the action, errors name the problem

---

## Responsive & Layout

Version history panel is collapsible. On mobile (xs/sm), it appears below the viewer as a full-width section. On desktop (md+), it remains below the viewer but with padding aligned to the iframe.

---

## Widget Decomposition

- `VersionHistoryWidget` (SM) — Collapsible panel listing versions with commit messages and restore buttons. Owner-only restore actions.

---

## ASCII Mockup

```
+-- Showcase Viewer --------------------------------------------------+
|  [<- Back]  Credit App LP                            v3 (latest)    |
|  +--------------------------------------------------------------+  |
|  |                                                              |  |
|  |              [iframe preview]                                 |  |
|  |                                                              |  |
|  +--------------------------------------------------------------+  |
|                                                                      |
|  v Version History                                                   |
|  +--------------------------------------------------------------+  |
|  | v3 -- "Fix mobile layout"     Apr 15  (current)              |  |
|  | v2 -- "Add dark mode"         Apr 14  [Restore]              |  |
|  | v1 -- "Initial version"       Apr 13  [Restore]              |  |
|  +--------------------------------------------------------------+  |
+----------------------------------------------------------------------+
```

---

## State Spec

```typescript
interface VersionHistoryState {
  versions: ShowcaseVersion[];     // sorted newest first
  isExpanded: boolean;             // panel open/closed
  restoringVersionId: string | null; // optimistic UI during restore
}

// Transitions:
// idle -> expanding (user clicks panel header)
// idle -> restoring (user clicks Restore) -> idle (success) | error (failure)
```

---

## Data Flow

```
Showcase viewer page loads:
  -> getShowcase server action now includes versions
  -> Returns: { ...showcase, versions: [{ version, commitMessage, createdAt }] }
  -> Version history panel renders below viewer

User clicks "Restore" on a version:
  -> POST restoreShowcaseVersion server action
  -> Server:
    1. Fetch blob_url from target version
    2. Create new version with that blob_url
    3. Re-trigger deploy for ZIPs
    4. Return new version number
  -> UI refreshes with updated version list

flow-showcase rollback command:
  1. GET showcase versions from API
  2. Present version list
  3. User picks version
  4. POST rollback -> same server logic
```

---

## Edge Cases

- Only one version — show it, no restore button
- Restore triggers re-deploy — show building status
- User doesn't own showcase — no restore buttons
- Version panel on mobile — collapsible, doesn't crowd viewer

---

## Focus Management

- Panel toggle: focus moves to first version item when expanded
- Restore button: focus moves to confirmation or status message after action
- Keyboard: Enter/Space toggles panel, Tab navigates version list

---

## Must Use

| Pattern | File to read |
|---|---|
| Showcase viewer | `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/` |
| Deploy pipeline | `src/features/showcase-gallery/deploy.ts` |
| Motion animation | existing motion patterns |

---

## Wrong Paths

1. **Don't delete old blob URLs on restore** — they're still referenced by version history.
2. **Don't show restore button to non-owners** — guard in UI and server.
3. **Don't fetch all version content** — only metadata for the list, content loaded on restore.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test version listing, restore creates new version |
| **coding-standards** | Step 2 | Widget structure |
| **flow-observability** | Step 2 | Log restore events |

---

## Test Hints

| Element | data-testid |
|---|---|
| Version history panel | `version-history-panel` |
| Version list item | `version-item-{number}` |
| Restore button | `restore-version-{number}` |
| Panel toggle | `version-history-toggle` |

- Test getShowcaseVersions returns ordered list
- Test restoreShowcaseVersion creates new version
- Test restore triggers deploy for ZIPs
- Test only owner sees restore buttons
- Journey: user views version history, restores v1

---

## Critical Files

| File | Change |
|---|---|
| `src/features/showcase-gallery/action.ts` | MODIFY: add getShowcaseVersions, restoreShowcaseVersion |
| `src/features/showcase-gallery/widgets/VersionHistoryWidget.tsx` | NEW: version history panel |
| `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` | MODIFY: include version history |
| `src/app/api/showcases/[id]/rollback/route.ts` | NEW: rollback API endpoint (for CLI) |
| `skills/flow/SKILL.md` | MODIFY: add flow-showcase rollback command |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Version history returns all versions with commit messages
- Restore creates new version from old blob URL

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Actions, widget |
| Accessibility | Yes | Version list semantics, restore button labels |
| Security | Yes | Owner-only restore |
| Observability | Yes | Restore events logged |

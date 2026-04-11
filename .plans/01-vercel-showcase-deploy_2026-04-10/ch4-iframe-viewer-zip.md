# Chapter 4: Iframe Viewer for ZIP

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapter 1, Chapter 2, Chapter 3
**User can:** Click a ZIP showcase in the gallery and see the deployed project load instantly in a secured iframe. Fullscreen works the same as HTML showcases.

## Goal

Update the ShowcaseViewerWidget so ZIP projects with `deployStatus === 'ready'` render as a simple iframe pointing at the signed deploy URL — same pattern as HTML projects. Done when: a deployed ZIP showcase loads instantly in the viewer and fullscreen works.

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

**Canonical layout:** Single Column (full-viewport iframe, same as current)

**Target breakpoints:** All — iframe fills available space at every size.

### Content priority

1. Project preview (iframe) — full remaining viewport
2. Detail bar — title, type badge, author, actions
3. Reactions / comments — collapsible panels

### Behaviour spec

| Dimension | This page |
|---|---|
| Input model | Pointer — click actions in detail bar, iframe is interactive |
| Information density | Low — one iframe dominates |
| Hover states | Action buttons in detail bar |
| Keyboard | ESC exits fullscreen, Tab through action buttons |

### Layout grid

```
+--[ Detail Bar: Back | Badge | Title | Author | Actions | Fullscreen | Download ]--+
+--[ Reaction Bar ]--+
+-------------------------------------------------------------------------------------+
|                                                                                     |
|                          iframe (deploy URL or blob URL)                             |
|                                                                                     |
+-------------------------------------------------------------------------------------+
```

---

## Widget Decomposition

### Widget tree

```
ShowcaseViewerWidget [MODIFY]
  ├── Detail bar (unchanged)
  ├── Reaction bar (unchanged)
  ├── Edit form (unchanged)
  ├── Preview area [MODIFY]
  │   ├── HTML: iframe src={blobProxy(blobUrl)} (unchanged)
  │   └── ZIP: iframe src={signedDeployUrl} (NEW — replaces StackBlitz embed)
  └── Fullscreen portal [MODIFY]
      ├── HTML: iframe (unchanged)
      └── ZIP: iframe src={signedDeployUrl} (NEW — replaces StackBlitzFullscreen)
```

### Data hooks

No new hooks. The `signShowcaseUrl` call happens server-side — the signed URL is passed as a prop or fetched via action.

### Size variants

Single variant — full viewport. No change.

---

## ASCII Mockup

### Before (StackBlitz)

```
+--[ Detail Bar ]-----------------------------------------------[ Fullscreen ]--+
+--[ Reactions ]------------------------------------------------------------+
|                                                                            |
|  +-- StackBlitz WebContainer ----------------------------------------+    |
|  |  [Spinner] Installing dependencies...                             |    |
|  |  [Progress bar: 55%]                                              |    |
|  |  Fetching  Extracting  *Installing*  Starting                     |    |
|  +-------------------------------------------------------------------+    |
|                                                                            |
+----------------------------------------------------------------------------+
```

### After (Vercel iframe)

```
+--[ Detail Bar ]-----------------------------------------------[ Fullscreen ]--+
+--[ Reactions ]------------------------------------------------------------+
|                                                                            |
|  +-- iframe src="https://deploy-url.vercel.app?token=eyJ..." -----------+  |
|  |                                                                       |  |
|  |  [Live deployed Next.js project — instant load]                       |  |
|  |                                                                       |  |
|  +-----------------------------------------------------------------------+  |
|                                                                            |
+----------------------------------------------------------------------------+
```

---

## State Spec

ShowcaseViewerWidget:
  State:
    No new state fields. The signed URL is derived server-side.
    Existing `isFullscreen` state works unchanged.

  Derived:
    previewSrc: string
      - HTML: blobProxy(showcase.blobUrl)
      - ZIP + ready: signedDeployUrl (passed as prop from server component)
      - ZIP + not ready: null (handled in Ch 6)

  Transitions:
    Click fullscreen -> isFullscreen = true (iframe src stays the same)
    ESC -> isFullscreen = false

---

## Data Flow

```
Server component (gallery/[id]/page.tsx):
  1. Fetch showcase by ID
  2. If fileType === 'zip' and deployStatus === 'ready':
     signedUrl = await signShowcaseUrl(showcase.deployUrl)
  3. Pass signedUrl as prop to ShowcaseViewerWidget

ShowcaseViewerWidget:
  - If HTML: <iframe src={blobProxy(blobUrl)} />
  - If ZIP + ready: <iframe src={signedUrl} />
  - Fullscreen: same src in a portaled iframe
```

---

## Edge Cases

- Deploy URL is null (not yet deployed) — don't render iframe, show placeholder (Ch 6 handles full UX)
- Signed token expires while viewing (>5 min) — iframe already loaded, no impact. Page refresh gets a new token.
- Deployed project has client-side routing — Vercel handles this natively, no special handling needed
- Deployed project fails to load in iframe — browser shows error within iframe, not our concern

---

## Focus Management

| Action | Focus moves to |
|---|---|
| Click fullscreen | Focus to "Exit fullscreen" button |
| ESC / click exit | Focus returns to fullscreen button in detail bar |

---

## Must Use

| Pattern | File to read |
|---|---|
| ShowcaseViewerWidget | `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` |
| Gallery page | `src/app/gallery/[id]/page.tsx` |
| Token utility | `src/platform/lib/showcase-token.ts` (from Ch 3) |
| blobProxy | Same file — reuse for HTML showcases |

---

## Wrong Paths

1. **Don't generate the signed URL on the client** — it must be generated server-side (in the page.tsx server component) and passed as a prop.
2. **Don't keep StackBlitz code alongside the new iframe** — this chapter replaces the ZIP rendering path entirely. StackBlitz code cleanup is in Ch 9, but the rendering path changes here.
3. **Don't add sandbox attribute to the ZIP iframe** — unlike HTML showcases (which use `sandbox="allow-scripts allow-same-origin"`), deployed Vercel projects need full browser capabilities for Next.js to work.
4. **Don't create a separate fullscreen component for ZIP** — both HTML and ZIP now use the same pattern (iframe with different src).

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test that ZIP showcases render iframe with deploy URL |
| **frontend-architecture** | Step 2 | Widget modification, server-to-client data flow |
| **interaction-motion** | Step 2 | Fullscreen enter/exit animation |
| **coding-standards** | Step 2 | Clean conditional rendering |

---

## Test Hints

| Element | data-testid |
|---|---|
| ZIP iframe | `showcase-preview-iframe` |
| Fullscreen ZIP iframe | `showcase-fullscreen-iframe` |

- Test: ZIP showcase with deployStatus 'ready' renders an iframe (not StackBlitz)
- Test: iframe src contains the deploy URL with a token param
- Test: HTML showcase still renders with blobProxy src (no regression)
- Test: fullscreen renders a second iframe with the same src

---

## Critical Files

| File | Change |
|---|---|
| `src/app/gallery/[id]/page.tsx` | MODIFY: generate signed URL server-side, pass as prop |
| `src/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget.tsx` | MODIFY: ZIP rendering uses iframe with deploy URL |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- When the user navigates to the showcase viewer
- Then the deployed project loads instantly in a secured iframe
- And fullscreen renders the same deploy URL

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Clean conditional rendering, no dead StackBlitz code paths |
| Accessibility | Yes | Iframe title attribute, focus management on fullscreen |
| Security | Yes | Signed URL not exposed to client JS, no sandbox bypass |
| Observability | No | No new server actions |

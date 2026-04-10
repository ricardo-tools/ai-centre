---
name: user-experience
description: >
  Defines how to design and build interfaces that are effective, efficient, and
  satisfying to use. Apply this skill when creating new screens, designing user
  flows, adding interactions, writing error messages, or reviewing any UI work
  for usability. Covers jobs-to-be-done thinking, cognitive principles, emotional
  design, feedback patterns, and accessibility as UX.
---

# User Experience

Every screen exists to help a user make progress on a job. The interface should make that job fast, obvious, and satisfying. Effective UX is not decoration — it is the difference between a tool people tolerate and one they reach for.

---

## When to Use

Apply this skill when:
- Designing a new screen or user flow
- Adding interactive elements (forms, buttons, navigation, modals)
- Writing error messages, empty states, or loading states
- Reviewing UI for usability before delivery
- Deciding what information to show, hide, or progressive-disclose
- Adding micro-interactions or animation feedback

Do NOT use this skill for:
- Component architecture or widget structure — see **frontend-architecture**
- Responsive layout planning — see **responsiveness**
- Colour tokens or typography definitions — see **brand-design-system**

---

## Core Rules

### 1. Every screen serves a job

Before building a screen, answer: *What did the user just do before arriving here? What will they do immediately after?* The screen exists to bridge those two moments. Everything that doesn't serve that bridge is noise.

Frame the job as: *"When [situation], I want to [motivation], so I can [expected outcome]."* This shapes information hierarchy, primary actions, and what to leave out.

### 2. Make the next action obvious

If the user pauses to wonder "what do I do now?", flow is broken. Every screen must have a clear primary action that is visually dominant and within immediate reach. Secondary actions exist but don't compete.

Why: Flow state requires clear goals. Users in flow are 5x more productive and report higher satisfaction (Csikszentmihalyi). A single moment of confusion costs ~23 minutes to recover from (Gloria Mark, UC Irvine).

### 3. Respond within 100ms

Every user action gets visual feedback within 100ms. The brain's causality window is ~100ms — if feedback arrives within that window, the action feels like it *caused* the result. Beyond 300ms, show a loading indicator. Beyond 1 second, show progress context.

| Threshold | Perception | Required response |
|---|---|---|
| 0–100ms | Instantaneous | Direct visual change (button state, ripple) |
| 100–300ms | Slight delay | Visual acknowledgment |
| 300ms–1s | System is working | Loading indicator or skeleton |
| 1–5s | Attention drifts | Progress with context ("Generating project...") |
| 5–10s | Significant wait | Percentage or time estimate |
| >10s | User abandons | Background task with notification |

### 4. Recognition over recall

Never make users remember information from a previous screen. If generating a project requires knowing which skills are selected, show the selected skills on the generation screen. Dropdowns over free-text for constrained choices. Search with suggestions. Recent items. Breadcrumbs.

### 5. Prevent errors, don't just report them

Inline validation on blur, not on submit. Disable impossible actions with clear indication of why. Type-ahead that prevents typos. Smart defaults that reduce input. Preventing an error is 10x cheaper than recovering from one.

### 6. Undo over confirmation

"Are you sure?" dialogs train users to click OK reflexively. For reversible actions, execute immediately and provide undo. Reserve confirmation dialogs only for truly destructive, irreversible operations (deleting published content, revoking access).

### 7. Accessibility is UX, not compliance

Accessible design makes the experience better for all users, not just those with disabilities. Visible focus indicators help keyboard users. Semantic heading structure helps scanners (79% of users scan, per NNGroup). Sufficient contrast helps everyone in bright sunlight. Never use colour as the sole indicator of state.

---

## Cognitive Principles

These are not abstract theory — they translate directly into UI decisions.

**Fitts's Law** — Time to reach a target depends on distance and size. Primary actions must be large and close to the user's current focus. Sticky action bars, not buttons at the bottom of long pages. Touch targets minimum 44x44px.

**Hick's Law** — Decision time increases with the number of choices. Top-level navigation: maximum 7 items. If you must show more, group into categories (3–4 top-level groups of 4–5 items each). Add search/filter above 15 items.

**Miller's Law** — Working memory holds ~7 chunks. Form fields grouped into chunks of 3–5 related fields. Phone numbers displayed as groups, not 10 digits. Navigation grouped into labelled sections.

**Cognitive Load** — Three types: intrinsic (task complexity, can't reduce), extraneous (caused by bad design, must eliminate), germane (building mental models, should maximise). Eliminate extraneous load: don't make users cross-reference between screens, use consistent patterns so one mental model transfers.

---

## Emotional Design

Software that feels good to use is not a luxury — the aesthetic-usability effect (Kurosu & Kashimura, 1995) shows that attractive interfaces are *perceived as more functional* even when they're not. First impressions form in 50ms.

### Three levels (Don Norman)

1. **Visceral** — first impression, visual quality. Clean layout, consistent spacing, purposeful colour. This happens before conscious thought.
2. **Behavioural** — the feel of using it. Does it respond immediately? Does it do what I expect? Do interactions feel acknowledged?
3. **Reflective** — how the user feels about having used it. Does the tool make them feel competent and efficient, or frustrated and slow?

### Micro-interactions that create satisfaction

- **State transitions, not state jumps.** Items appearing animate in (fade + slight translate, 150–300ms). Jump cuts break spatial awareness.
- **Cause-and-effect within 100ms.** Button click → immediate visual change. The user feels the action worked.
- **Spring/elastic easing.** Slight overshoot + settle feels more natural than linear or ease-in-out, because physical objects behave this way.
- **Progress that feels fast.** Progress bars that start slow and accelerate are perceived as 12% faster than linear progress at the same actual duration (Harrison, Yeo & Hudson, CHI 2010).

### Skeleton screens over spinners

Skeleton screens (placeholder shapes matching the incoming layout) reduce perceived load time by ~30% compared to spinners. The user starts processing the layout before content arrives.

### Optimistic updates

For operations with >95% success rate (toggling, adding to a list), update the UI immediately and reconcile in background. On failure, revert with explanation. Reduces perceived latency to near-zero.

---

## Feedback Patterns

For error message *copy* (what the words say), empty state *copy*, and toast *copy*, see **content-design**. This section covers the UX patterns — timing, placement, and recovery.

### Error recovery

One-click recovery paths reduce abandonment by 50–70% compared to dead-end error pages. Every error state must provide an action — retry, adjust input, or navigate elsewhere. Never a dead end.

### Toast timing

- Success: auto-dismiss in 3–5 seconds
- Warning: persist for 8–10 seconds
- Error: persist until user dismisses

### Empty states

Distinguish "no data exists" (invite action) from "no results match filter" (suggest adjustment). Empty states are an opportunity, not a dead end.

---

## Information Architecture

### Progressive disclosure

Show primary action and required inputs first. Advanced options behind "More options" or expandable sections. Full documentation via help links. Research shows this reduces error rates by 20% and improves task completion speed by 25%.

### Information scent

Users navigate like foragers — they follow cues that suggest the desired information is nearby. Strong scent = descriptive labels, relevant previews, contextual metadata. Weak scent = vague labels ("Miscellaneous", "Advanced"), icons without text.

Skill cards need enough information to evaluate *without clicking through*. Search results need enough context to assess relevance without opening each result.

### Multi-step flows

Maximum 5 steps with visible progress and the ability to go back without data loss. Abandonment increases sharply beyond 5 steps. Every step must have a clear "done" condition.

---

## Flow Preservation

Flow state in daily-use tools requires: clear goals, immediate feedback, and challenge-skill balance. The interface must actively protect flow by eliminating interruptions.

**Flow breakers to eliminate:**
- Unexpected navigation (clicking something navigates away without warning)
- Modal interruptions for non-destructive actions
- Data loss on navigation (auto-save drafts, or warn only when unsaved data exists)
- Full-page loading spinners that block all interaction
- Context switches to external tools or tabs
- **Layout shift on tab/view switch** — content area height changing pushes the page up/down, loses scroll position, and causes accidental clicks on shifted elements

**Flow enablers:**
- Inline editing over navigate-to-edit
- Keyboard shortcuts for power users
- URL-driven state (shareable, bookmarkable deep links)
- Consistent patterns — once learned, they transfer across screens

---

## Banned Patterns

- ❌ Error messages without recovery action → always include what happened, why, and what to do next
- ❌ Colour as sole state indicator → pair with icon, text, or shape (8% of men are colourblind)
- ❌ "Are you sure?" dialogs for reversible actions → use undo instead
- ❌ Full-page spinners blocking all interaction → use skeleton screens or partial loading
- ❌ Conditional rendering for tabs that causes layout shift → use CSS grid-stack (all panels rendered, only active visible via `visibility`) so height stays stable
- ❌ Form validation only on submit → validate inline on blur
- ❌ Modals for non-critical information → use inline expansion or toast
- ❌ Navigation labels using system terminology → use task language ("Create a Project" not "Project Instantiation")
- ❌ Screens where the next action is ambiguous → primary action must be visually dominant and obvious
- ❌ Interactive elements below 44x44px → minimum touch/click target size
- ❌ Ignoring `prefers-reduced-motion` → respect it; no animation should be required to understand UI state

---

## Quality Gate

Before delivering, verify:

- [ ] The screen's job is identifiable — "When [situation], I want to [motivation], so I can [outcome]"
- [ ] Primary action is visually dominant and within immediate reach
- [ ] Every user action gets visual feedback within 100ms
- [ ] Error states include what happened, why, and what to do next
- [ ] Empty states invite action or suggest adjustment
- [ ] Loading states use skeletons or contextual progress, not bare spinners
- [ ] No information from a previous screen needs to be remembered
- [ ] Form fields are grouped into chunks of 3–5 related fields
- [ ] Multi-step flows have visible progress and back navigation without data loss
- [ ] Interactive elements are minimum 44x44px
- [ ] Focus indicators are visible on all interactive elements (min 2px)
- [ ] Colour is never the sole indicator of state
- [ ] `prefers-reduced-motion` is respected
- [ ] Terminology uses the user's task language, not system internals

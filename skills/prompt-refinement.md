---
name: prompt-refinement
description: >
  Translates unstructured user requests into clear, AI-effective prompts before
  execution. Triggers on any application change request. Clarifies intent,
  identifies affected areas, selects relevant skills, and suggests a refined
  prompt proportional to the original request. The user approves or adjusts
  before work begins.
---

# Prompt Refinement

A vague request produces vague work. This skill sits between the user's natural-language request and execution. It translates intent into structure — not by inflating the prompt, but by making the implicit explicit. The refined prompt should be the smallest clear statement that eliminates ambiguity.

This is not a creativity exercise. It is a compression exercise: extract what the user actually means, name the things they're assuming, and surface the decisions they haven't made yet.

---

## When to Use

**Trigger:** Any user request that changes the application — feature work, bug fixes, refactors, UI changes, data model changes, new pages, new components, configuration changes.

**This includes bug fixes.** A user reporting "it's stuck on uploading" needs a refined prompt that identifies the root cause, the scope of the fix, and the skills involved — before you touch code. Bug fixes are changes.

**Do NOT trigger for:**
- Questions about how the code works (just answer)
- Requests to read, search, or explain code (just do it)
- Git operations, dependency installs, or running commands (just do it)
- Skill file creation/editing when the user has already described the skill in detail

**There is no "skip" escape hatch.** Do not skip refinement because a fix looks obvious. Even a one-line fix gets a 2-line refinement. The discipline is the value — it prevents you from solving the wrong problem or missing adjacent issues.

---

## Core Rules

### 1. Proportionality — match the weight of the refinement to the request

The refined prompt should be roughly proportional to the original request. A one-line request gets a 2-4 line refinement. A paragraph gets a paragraph. Never inflate.

| User request size | Refinement size | Example |
|---|---|---|
| One-liner ("add dark mode toggle") | 2-4 lines | Clarifies where, which component, theme scope |
| Short paragraph | 4-8 lines | Adds affected files, edge cases, skill refs |
| Detailed brief | 8-15 lines | Structures phases, confirms assumptions, adds constraints |

**Anti-pattern:** A user says "fix the login error" and you respond with a 20-line prompt about authentication architecture, error handling patterns, and testing strategy. That's not refinement — it's scope inflation.

### 2. Clarify, don't assume

When the request is ambiguous, surface the ambiguity as a question rather than making a silent assumption. But only ask about decisions that change the implementation direction — not details you can reasonably infer from context.

**Ask about:**
- Which of two valid approaches to take (when both are reasonable)
- Scope boundaries ("does 'update the nav' include mobile?")
- Breaking changes ("this requires a schema migration — proceed?")

**Don't ask about:**
- Things you can infer from CLAUDE.md, PROJECT_REFERENCE.md, or the code
- Styling decisions (the skills define these)
- Architecture decisions (the skills define these)
- Things where there's one obvious right answer

### 3. Name the skills, don't repeat them

Reference the relevant skills by name so the executor knows which to read. Don't copy skill content into the refined prompt — that defeats the purpose of having skills.

```
# Good — references skills
"Follow frontend-architecture for the widget pattern and brand-design-system for tokens."

# Bad — copies skill content
"Create a widget with 4 size variants (XS/SM/MD/LG), each implementing
RenderableWidget, using inline styles with var(--color-*) semantic tokens,
following the 8px spacing system..."
```

### 4. Structure the refinement as: intent → scope → constraints → skills

Every refined prompt follows this structure, scaled to the request size:

**Intent** — what the user wants to achieve (one sentence)
**Scope** — what files/areas are affected (bullet list if multiple)
**Constraints** — non-obvious decisions, edge cases, or boundaries
**Skills** — which skills to read before starting

For small requests, this collapses to 2-3 lines. For large requests, each section gets a few lines.

### 5. Surface what's implicit

Users carry context they don't state. Their request says "add a filter" but they mean "add a filter that works like the existing search, respects the current theme, and doesn't break mobile." Your job is to surface the implicit requirements that would otherwise be discovered mid-implementation.

Common implicit requirements:
- Responsive behaviour (does it need to work on mobile?)
- Theme awareness (Light + Night)
- Loading/error/empty states
- Where it fits in the existing architecture (which feature directory, which screen)
- Side effects (does this require a registry update, a seed update, a new route?)

### 6. Never start work before the user confirms

This is a hard stop. After presenting the refined prompt, **wait for the user to say "go", "yes", "proceed", or similar**. Do not begin writing code, creating files, or running commands until confirmation. If the user adjusts the prompt, incorporate their changes and re-present if needed — but still wait for the green light.

The only exception: if the user says "go" as part of their original request (e.g. "fix the upload bug, go ahead"), treat that as pre-confirmation.

### 7. Present, don't prescribe

Present the refined prompt as a suggestion. The user approves, adjusts, or rejects. Format it clearly so they can scan it in 5 seconds.

### 8. Research before refining when the request is non-trivial

Before presenting the refined prompt, evaluate whether research is needed. If the request involves any of the following, do the research first, then incorporate findings into the refinement:

- **A bug with unclear cause** — search for known issues in GitHub, check changelogs for the relevant dependency versions, reproduce systematically before proposing a fix direction.
- **A technology decision** — evaluate alternatives, check community health (stars, last commit, open issues), review trade-offs. Don't refine a prompt around a library you haven't vetted.
- **A pattern you haven't used in this codebase** — find established implementations, check for known gotchas, verify it works with the project's framework versions.
- **A feature with multiple valid approaches** — research how others solved it, compare trade-offs on axes that matter for this project (performance, complexity, maintainability).

When research is triggered, do it first, then fold findings into the refined prompt. The refinement should reference what the research found — not just name the skill, but state the relevant conclusion. For example:

```
# Good — research finding informs the refinement
"Research shows this is a known Next.js issue fixed in v16.2 (vercel/next.js#58432).
The fix is to update next and use the new `unstable_cache` API instead of `fetch` cache.
Scope: update package.json, refactor src/features/skill-library/action.ts."

# Bad — no research, just vibes
"Fix the caching issue. Skills: nextjs-app-router-turbopack."
```

If research reveals the user's proposed approach won't work, say so in the refinement — with evidence. "This approach has a known issue with [X] (source). Alternative: [Y]."

See the **research** skill for methodology: source hierarchy, CRAAP testing, scientific debugging, and calibrating research depth to decision impact.

### 9. Plan before executing when work spans multiple phases

After research (if triggered) and before presenting the refined prompt, evaluate whether the work needs a plan:

- **Work touches 4+ files** — plan with phases
- **Work has dependencies between steps** — plan with ordering (`[parallel]` / `[sequential]` markers)
- **Work has irreversible steps** (migrations, deployments, schema changes) — plan with gates
- **Work can be parallelised** — plan with parallel markers to avoid unnecessary sequential execution

When a plan is needed, present it as part of the refined prompt — after intent/scope/constraints, before the skills list. Small tasks (1-3 files) can have an inline 2-3 line plan within the refinement. Medium+ tasks (4+ files) get a separate structured plan with phases, steps, completion criteria, and gates, following the format in the **planning** skill.

The plan is part of the refinement, not a separate step. The user approves the refined prompt (including the plan) before work begins — one confirmation, not two.

See the **planning** skill for the full framework: BLUF, commander's intent, three levels of detail, progressive elaboration, gates, failure classification, and the plan template.

---

## The Refinement Format

```
**Refined prompt:**

[Intent — 1 sentence stating the goal]

[Scope — affected areas, files, or features]

[Constraints — decisions, edge cases, non-obvious requirements]

**Skills:** [comma-separated list of relevant skill slugs]

[Optional: 1-2 clarifying questions if ambiguity remains]
```

---

## Examples

### Small request

**User:** "add a search to the skills page"

**Refined prompt:**

Add a search input to the `/skills` page that filters the skill list by title and description as the user types.

Scope: `src/app/skills/` page, `SkillLibraryCards` component.
Constraints: Use the existing `SearchInput` component from platform/components. Filter client-side (all skills are already loaded). Preserve the current grid layout. Handle empty results with a "No skills found" message.

**Skills:** frontend-architecture, content-design

---

### Medium request

**User:** "I want users to be able to favourite skills and see them on the home page"

**Refined prompt:**

Add a "favourite skills" feature. Users can toggle a heart/star on any skill card, and their favourites appear in a new section on the home page.

Scope:
- New `favourites` state (localStorage for now, or DB — needs decision)
- Update `SkillCard` component with toggle button
- New `FavouriteSkillsWidget` on home page
- Update `Home.screen.ts` to include the widget

Constraints: No auth required for favouriting (localStorage). Limit to 20 favourites. Show "No favourites yet" empty state with a CTA to browse skills. Heart icon uses Phosphor `Heart` (regular) / `Heart` (fill) for toggle.

**Skills:** frontend-architecture, brand-design-system, design-foundations, content-design

**Question:** Should favourites persist across devices (requires DB + auth) or just locally (localStorage)?

---

### Bug fix

**User:** "the upload is stuck on 'Uploading...', here are the server logs: Error: No token found for BLOB_READ_WRITE_TOKEN"

**Refined prompt:**

Fix the showcase upload failing in dev when `BLOB_READ_WRITE_TOKEN` is not set. Also fix the UI silently hanging — errors from the server action must be displayed to the user.

Scope: `src/features/showcase-gallery/action.ts` (add dev fallback for file storage), `ShowcaseUploadWidget.tsx` (catch thrown errors, not just `Result.error`)
Constraints: Dev mode writes to `public/uploads/`. Production uses Vercel Blob. Wrap the `uploadShowcase` call in try/catch so unhandled server throws don't leave the UI stuck.

**Skills:** backend-patterns, content-design

---

## Skill Selection Guide

Match the request to the relevant skills. Not every request needs every skill. Select the minimum set that covers the work.

| Request involves... | Skills to activate |
|---|---|
| Any UI work | frontend-architecture, brand-design-system, design-foundations |
| New page or route | nextjs-app-router-turbopack, app-layout |
| New widget | frontend-architecture (widget pattern section) |
| Server-side logic | backend-patterns, coding-standards |
| Database changes | backend-patterns, clean-architecture |
| Auth/security changes | security-review |
| Animation/motion | interaction-motion, creative-toolkit |
| Form/input work | accessibility, content-design |
| Error messages/copy | content-design |
| Test writing | testing-strategy, playwright-e2e |
| Responsive layout | responsiveness, app-layout |
| Print output | print-design |
| Presentation output | presentation, presentation-html-implementation |
| Code quality/refactor | coding-standards, clean-architecture |
| New skill file | skill-creation, skill-review |
| Unknown root cause, technology choice, unfamiliar pattern | research |
| Multi-file changes, phased work, irreversible steps | planning |
| AI integration | ai-claude, ai-capabilities |
| Monitoring/logging | observability |
| Performance work | web-performance |

---

## Banned Patterns

- ❌ Skipping refinement because "it's obvious" — even a one-line fix gets a two-line refinement. The discipline catches adjacent issues.
- ❌ Starting work before the user confirms — present the refinement, then STOP. Wait for "go".
- ❌ Inflating a one-line request into a page of instructions — proportionality still applies
- ❌ Copying skill content into the refined prompt — reference by name
- ❌ Asking more than 2 clarifying questions — make reasonable inferences
- ❌ Adding scope the user didn't ask for ("while we're at it, let's also...") — scope creep
- ❌ Prescribing implementation details in the refinement ("use useState for X, useEffect for Y") — that's the executor's job
- ❌ Using generic filler ("ensure best practices", "follow conventions") — either name the specific skill or don't mention it

---

## Quality Gate

Before presenting a refined prompt, verify:

- [ ] Intent is stated in one sentence
- [ ] Scope identifies affected files or areas
- [ ] Constraints include non-obvious decisions and edge cases
- [ ] Relevant skills are named (not copied)
- [ ] Refinement length is proportional to the original request
- [ ] Research was done if the request involves unknown root cause, technology choice, or unfamiliar pattern
- [ ] A plan is included if work spans 4+ files or has dependencies
- [ ] No work has started — waiting for user confirmation

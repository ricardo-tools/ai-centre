---
name: prompt-refinement
description: >
  Triggers on every user request. Translates unstructured requests into clear,
  AI-effective prompts before execution. Scans the skill library to find
  applicable skills, suggests research when non-trivial, suggests planning when
  multi-phase. The user approves or adjusts before work begins.
---

# Prompt Refinement

Every request gets refined before execution. This skill sits between the user's natural-language request and any action. It translates intent into structure — not by inflating the prompt, but by making the implicit explicit.

---

## When to Use

**Trigger:** Every user request. No exceptions.

**The test:** Is the user asking you to do something? If yes, refine. It does not matter whether the request is:
- A fresh topic or a follow-up to an ongoing conversation
- A new feature or feedback on previous work ("this needs a better audit")
- A one-line fix or a multi-day initiative
- Phrased as a question ("can you audit this?") or a statement ("the design needs work")

**Conversation continuations are NOT exempt.** A user saying "still need a better audit, skip the margins" after a previous audit is a new request — it triggers refinement with research and planning evaluation. The fact that you were already discussing audits does not make this a continuation. It is a new action request.

This includes: feature work, bug fixes, refactors, UI changes, questions about the project, skill creation, audits, deployments, configuration changes, discussions about architecture, feedback on previous work that implies further action.

**There is no "skip" escape hatch.** A one-line fix gets a 2-line refinement. A question about architecture gets skill references that inform the answer. The discipline prevents solving the wrong problem.

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

### 3. Scan the skill library to find applicable skills

Don't rely on memory or the lookup table alone. For every request, scan the skill files' "When to Use" sections to find which skills apply. The skill library has 60+ skills — the lookup table is a shortcut, not the source of truth.

**Process:**
1. Identify the type of work the request involves
2. Check the "When to Use" triggers of candidate skills
3. Check the "Do NOT use" boundaries to avoid false matches
4. Name the applicable skills in the refinement — don't copy their content

```
# Good — references skills by name
"Follow frontend-architecture for the widget pattern and brand-design-system for tokens."

# Bad — copies skill content into the prompt
"Create a widget with 4 size variants (XS/SM/MD/LG), each implementing
RenderableWidget, using inline styles with var(--color-*) semantic tokens..."
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

### 8. Suggest research when the request is non-trivial

Evaluate whether research should happen before or during refinement. Research and planning are independent — either can trigger without the other.

**Suggest research when:**
- A bug with unclear root cause — search for known issues, check changelogs, reproduce systematically
- A technology decision — evaluate alternatives, check community health, review trade-offs
- An unfamiliar pattern — find established implementations, check gotchas
- Multiple valid approaches — research how others solved it, compare trade-offs

**How it works:** Suggest research in the refinement. Do the research. Fold findings into the refined prompt before presenting it. The refinement should state what the research found, not just "research needed."

```
# Good — research finding informs the refinement
"Research shows this is a known Next.js issue fixed in v16.2 (vercel/next.js#58432).
The fix is to update next and use the new `unstable_cache` API."

# Bad — no research, just vibes
"Fix the caching issue. Skills: nextjs-app-router-turbopack."
```

If research reveals the user's proposed approach won't work, say so with evidence.

See **research** skill for methodology.

### 9. Suggest planning when work spans multiple steps

Planning is independent of research — a simple multi-file refactor needs a plan but no research. A technology decision needs research but maybe not a plan.

**Suggest planning when:**
- Work touches 4+ files — plan with phases
- Work has dependencies between steps — plan with ordering
- Work has irreversible steps (migrations, schema changes) — plan with gates
- Work can be parallelised — plan with parallel markers

**How it works:** After research (if it happened), build the plan. Present it as part of the refined prompt. The user approves the refinement including the plan — one confirmation, not two.

Small tasks (1-3 files): inline 2-3 line plan within the refinement.
Medium+ tasks (4+ files): structured plan with phases, steps, completion criteria, gates.

See **planning** skill for the full framework.

### The orchestration flow

```
User request
  → Refine (always)
    → Scan skill library for applicable skills
    → Suggest research? (if non-trivial — independent decision)
    → Do research if suggested
    → Suggest plan? (if multi-step — independent decision)
    → Build plan if suggested (informed by research findings if available)
  → Present refined prompt (with research findings + plan if applicable)
  → Wait for confirmation
  → Execute
```

Research and planning are tools this skill invokes — they don't self-trigger.

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

This table is a **shortcut**, not the source of truth. Always scan the actual skill files' "When to Use" sections for the definitive match. The library has 60+ skills — this table covers the most common mappings.

| Request involves... | Skills to activate |
|---|---|
| Any UI work | frontend-architecture, brand-design-system, design-foundations, responsiveness |
| New page or route | nextjs-app-router-turbopack, app-layout |
| New widget | frontend-architecture (widget pattern section) |
| Server-side logic | backend-patterns, coding-standards |
| Database changes | database-design, clean-architecture |
| Auth/security changes | security-review, authentication, authorization |
| Animation/motion | interaction-motion, creative-toolkit |
| Form/input work | accessibility, content-design, user-experience |
| Error messages/copy | content-design |
| Test writing | testing-strategy, playwright-e2e |
| Responsive layout | responsiveness, app-layout |
| Print output | print-design |
| Presentation output | presentation, presentation-html-implementation |
| Code quality/refactor | coding-standards, clean-architecture |
| New skill file | skill-creation |
| Skill library review | skill-review |
| AI integration | ai-capabilities + implementation skill (ai-claude, ai-openrouter, ai-fal) |
| Email | email-sending + implementation skill (email-mailgun) |
| File storage | file-storage + implementation skill (storage-vercel-blob) |
| Database implementation | database-design + implementation skill (db-neon-drizzle, db-supabase, db-redis) |
| Auth implementation | authentication + implementation skill (auth-custom-otp, auth-clerk) |
| Monitoring/logging | observability |
| Performance work | web-performance |
| Documentation | project-documentation |
| Project knowledge | project-reference |
| Non-trivial decision | research (suggested by this skill, not self-triggered) |
| Multi-step work | planning (suggested by this skill, not self-triggered) |
| Quality review | quality-assurance, verification-loop |
| Context management | strategic-context |
| MCP servers | mcp-server-patterns |

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
- ❌ Treating follow-up requests as "continuation" that doesn't need refinement — if the user is asking you to do something, refine it. "Still need a better audit" is a new request, not a conversation.

---

## Quality Gate

Before presenting a refined prompt, verify:

- [ ] Intent is stated in one sentence
- [ ] Scope identifies affected files or areas
- [ ] Constraints include non-obvious decisions and edge cases
- [ ] Skill library was scanned — applicable skills found by checking "When to Use" sections, not just the lookup table
- [ ] Relevant skills are named (not copied)
- [ ] Refinement length is proportional to the original request
- [ ] Research was suggested and done if the request is non-trivial (bug with unclear cause, technology decision, unfamiliar pattern, multiple valid approaches)
- [ ] Planning was suggested and included if work is multi-step (4+ files, dependencies, irreversible steps, parallelisable)
- [ ] Research and planning were evaluated independently (either can trigger without the other)
- [ ] No work has started — waiting for user confirmation

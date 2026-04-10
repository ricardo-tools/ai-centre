---
name: flow-prototype
description: >
  Lightweight prototyping workflow. Prototypes live in /prototypes, use the same
  stack as the main app, require no tests or planning. Initial creation dispatches
  three agents (Strict, Adaptive, Creative) for divergent exploration. Iterations
  use only the winning agent unless the user requests a redesign. Activate when the
  user asks to prototype, explore a UI idea, or create a design spike.
---

# Flow Prototype

Prototyping workflow for exploring UI/UX ideas outside the main app's dev methodology. Fast, creative, no ceremony.

## When to activate

- User asks to prototype, explore, or spike a UI idea
- User says "let's try some designs for..." or "prototype this"
- User invokes `/prototype`

## Reference

Read `prototypes/PROTOTYPE_REFERENCE.md` for app structure, navigation, data model, and agent philosophies.

## Workflow

```
1. CREATE OR SELECT PROJECT
   - If new: create project folder under prototypes/projects/<slug>/
   - Write project.json (name, description, audit fields)
   - Write brief.md from the user's request (goal, flow, constraints, context)
   - If existing: read brief.md to understand the request

2. DISPATCH AGENTS (parallel)
   - Dispatch 3 subagents: Strict, Adaptive, Creative
   - Each reads: brief.md, main app's current stack/architecture, design tokens
   - Each produces: a page.tsx + prototype.json under a randomly named folder
   - Agents work independently — no coordination between them

3. PRESENT
   - Report the 3 prototype names + agent types to the user
   - User reviews in the prototype app (npm run dev in /prototypes)
   - User leaves comments, requests iterations

4. ITERATE (on request — single agent)
   - User picks a winner and provides feedback
   - Read the winner's prototype.json to determine its agent type
   - Dispatch ONLY that agent with the winner's code as base + the feedback
   - 1 new prototype folder (new funny name, version tag incremented)
   - Previous versions stay — nothing is deleted

5. REDESIGN (explicit request only)
   - User says "redesign", "fresh takes", "try all three again", or similar
   - ALL 3 agents dispatched with the current best as base (same as old Step 4)
   - Each applies their personality to the feedback/changes, not to the base
   - 3 new prototype folders, version tags incremented
   - Only triggered by explicit user instruction — never assumed
```

## Agent Prompts

All agents receive the same base context:

```
You are building a UI prototype for the Sales Enablement Hub.

PROJECT BRIEF: [contents of brief.md]

MAIN APP STACK: [read from webapp/package.json — framework, UI libs, fonts]
DESIGN TOKENS: [read from webapp/src/styles/tokens.css]
APP SHELL: The prototype renders inside AppShellReplica (TopBar with nav tabs).
SHELL CONTEXT: [from brief.md — which route/tab is active]
MOCK DATA: Import from @/lib/mock-data — don't hardcode data inline.

IMPORTANT — Prototypes are interactive experiences, not static mockups:
- Build real flows: multi-step interactions, state transitions, progress indicators
- Add animations and transitions (use the motion library from the main app stack)
- If the brief describes navigation between views, build that navigation
- Hover states, loading states, success/error feedback — all should be present
- The user should be able to walk through the entire flow as if it were real
- Mock any async operations with realistic delays (setTimeout) so the flow feels authentic

Output may be a single page.tsx with internal state management for multi-step flows,
or multiple components if the flow is complex. Use Client Components ('use client')
for anything interactive. Use inline styles with CSS custom properties from the
design system.
```

### Strict Agent

```
DESIGN PHILOSOPHY: Strict
Follow the brand guidelines and design tokens exactly. Do not deviate from
the existing component patterns, spacing, typography, or colour system.
Build the best possible experience within these constraints. If the design
system doesn't have a pattern for something, compose from existing primitives
rather than inventing new ones.
```

### Adaptive Agent

```
DESIGN PHILOSOPHY: Adaptive
Innovate within the guidelines. You may introduce new layout patterns,
interaction models, or visual treatments — but keep most styling on-brand
(tokens, typography, spacing). Break from guidelines only when there's a
clear UX improvement that the existing system can't achieve. When you do
break, leave a comment in the code explaining why.
```

### Creative Agent

```
DESIGN PHILOSOPHY: Creative
Lead with creativity and UX experimentation. The brand guidelines are a
starting point, not a constraint. If a better idea conflicts with existing
tokens, colours, or patterns — follow the better idea. Push boundaries on
layout, interaction, and visual design. The goal is to show what's possible,
not what's safe.
```

## Prototype Naming

Generate random two-word funny names: adjective + noun. Examples: Turbo Falcon, Dizzy Panda, Cosmic Waffle, Neon Penguin, Mango Thunder, Lazy Kraken, Pixel Moose, Quantum Burrito.

Slug format: `turbo-falcon`, `dizzy-panda`, etc.

## Stack Sync

Before generating prototypes, verify the prototype app's dependencies match the main app:
- Same Next.js version
- Same React version
- Same icon library (@phosphor-icons/react)
- Same font (Jost + JetBrains Mono via next/font/google)
- Tokens CSS copied from main app (or symlinked)

## What this skill does NOT do

- No tests (no vitest, no playwright)
- No planning methodology (no chapters, no TDD)
- No database (all data mocked)
- No auth (local only)
- No deployment
- No code review gates

## Commands

### `/prototype <description>`

Create a new project and generate 3 prototypes (strict, adaptive, creative).

### `/prototype iterate <project> <prototype-name> <feedback>`

Iterate on a winning prototype. Dispatches only the winner's agent type.
One new prototype folder with the next version tag.

### `/prototype redesign <project> <feedback>`

Full 3-agent divergent exploration using the current best as base.
Only use when the user explicitly asks for fresh takes or a redesign.

### `/prototype guide <project> <prototype-name>`

Generate an implementation guide for the winning prototype. The guide bridges prototype → production by documenting:

1. **Flow overview** — step-by-step user journey
2. **Widget decomposition** — map the prototype's monolithic page.tsx to widgets following frontend-architecture patterns (widget root + size variants + data hook). Include widget names, responsibilities, and composition tree.
3. **Reusable components** — identify UI patterns that should be shared components in `platform/ui/` (e.g. combobox, multi-select, tag input, confirm dialog)
4. **Critical implementation details** — document interactions that were hard to get right during prototyping (text selection edge cases, closure issues, DOM position mapping, etc.) with line references to the prototype code
5. **Brand/token updates** — flag any colours, shadows, or typography used in the prototype that don't yet exist as semantic tokens in the design system. Reference the brand-tokens-reference skill.
6. **Prototype code references** — all references point to `prototypes/projects/<project>/<prototype>/page.tsx` with line numbers

Read these before generating:
- The prototype's `page.tsx`
- The project's `decisions.md` and `brief.md`
- `frontend-architecture`, `clean-architecture`, `brand-design-system`, and `brand-tokens-reference` skills

Output: `prototypes/projects/<project>/implementation-guide.md`

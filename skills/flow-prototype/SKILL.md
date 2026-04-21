---
name: flow-prototype
description: Companion skill for flow. Lightweight prototyping workflow — dispatches three agents (Strict, Adaptive, Creative) for divergent UI/UX exploration. Iterations use only the winning agent. Ships a complete prototype viewer app template. Invoked via /flow prototype.
---

# Flow Prototype

Companion skill for `flow`. Defines the prototyping methodology, agent philosophies, and the prototype viewer scaffold. Invoked by the flow router — not directly by the user.

**Invocation:** `/flow prototype <description>` (routed from flow)

---

## Scaffold Template

The complete prototype viewer app lives at `templates/prototype-viewer/` inside this skill directory.

**What it includes:**
- Next.js App Router with Webpack (port 4242)
- SQLite via @libsql/client (local file in dev, Turso in prod)
- Auto-DB-creation via `predev` script
- Docker Compose for portable local dev
- 7-layer architecture (domain, ACL, widgets, screens, renderer, components, hooks)
- 3 themes (Light, Dark, Night) with full CSS custom property system
- Review mode with pin feedback system (click-to-pin, threads, resolve)
- Floating toolbar (live shell switching, review mode toggle)
- User identity (localStorage, prompted on first review)
- An example project (`workflow-matrix`) as reference

**Scaffold trigger:** `/flow prototype` checks if `prototypes/package.json` exists before delegating. If missing, it copies the template and runs `npm install`.

**Required companion skills for prototyping:** When the prototype viewer is scaffolded, the following skills should be present in the project (they define the rules agents follow when building prototypes):

| Skill | Role in prototyping |
|---|---|
| `brand-design-system` | Color palette, typography, theming rules — agents follow this |
| `brand-tokens-reference` | Actual token values, CSS copy-paste blocks |
| `design-foundations` | Visual hierarchy, spacing, alignment, negative space |
| `frontend-architecture` | 7-layer architecture that the viewer app follows |
| `app-layout` | Shell layout patterns, grid configs |
| `creative-toolkit` | Asset libraries, animation engines, data viz |
| `responsiveness` | Responsive breakpoints, mobile-first patterns |
| `interaction-motion` | Animation principles (when/how to animate) |
| `content-design` | Microcopy, labels, error messages |
| `user-experience` | UX principles for building usable prototypes |
| `coding-standards` | Code quality rules agents follow |
| `nextjs-app-router-turbopack` | Next.js patterns (the viewer app stack) |

If any of these are missing from the project's `.claude/skills/`, warn the user — agents will produce lower-quality prototypes without them.

---

## Follow Project-Level Code Practices

Before creating or iterating on any prototype, **read the project's CLAUDE.md** (at `prototypes/CLAUDE.md`) to determine the code practices that apply. Follow whatever it specifies — architecture layers, file organization, styling rules, naming conventions.

If the CLAUDE.md is **missing or ambiguous**, stop and ask the user which practices should apply. Common questions:
- Single `page.tsx` file or split across multiple files (components, hooks, types, mock data)?
- If split, do they live inside the prototype folder or follow the full project architecture?

Once clarified, brief all agents with the resolved approach so they produce structurally consistent output.

---

## Workflow

### New Project (3-agent dispatch)

```
1. Create project folder under prototypes/projects/<slug>/
2. Write project.json (name, description, createdBy, createdAt, updatedBy, updatedAt)
3. Write brief.md from the user's request (goal, flow, constraints, context)
4. Write decisions.md (empty template — always create so the tab appears)
5. Dispatch 3 subagents in parallel: Strict, Adaptive, Creative
   - Each reads: brief.md, prototypes/CLAUDE.md, design tokens (globals.css)
   - Each produces: page.tsx + prototype.json under a randomly named folder
   - Agents work independently — no coordination
6. Report the 3 prototype names + agent types to the user
7. User reviews in the prototype viewer (localhost:4242)
```

### Iterate (single agent)

```
1. Read the winner's prototype.json to determine its agent type
2. Dispatch ONLY that agent with the winner's code as base + the feedback
3. New prototype folder (new funny name, version tag incremented)
4. Previous versions stay — nothing is deleted
```

### Redesign (3-agent redo)

```
1. ALL 3 agents dispatched with the current best as base + the feedback
2. Each applies their personality to the feedback/changes, not to the base
3. 3 new prototype folders, version tags incremented
4. Only triggered by explicit user instruction — never assumed
```

---

## Agent Prompts

All agents receive the same base context:

```
You are building a UI prototype.

PROJECT BRIEF: [contents of brief.md]

DESIGN TOKENS: [read from prototypes/app/globals.css]
APP SHELL: The prototype renders inside an app shell replica (EzyCollect, NewWorkflows, SimplyPaid, or bare).
SHELL CONTEXT: [from brief.md — which shell and route/tab is active]
CODE PRACTICES: [resolved from prototypes/CLAUDE.md or user clarification]

IMPORTANT — Prototypes are interactive experiences, not static mockups:
- Build real flows: multi-step interactions, state transitions, progress indicators
- Add animations and transitions
- If the brief describes navigation between views, build that navigation
- Hover states, loading states, success/error feedback — all should be present
- The user should be able to walk through the entire flow as if it were real
- Mock any async operations with realistic delays so the flow feels authentic

FILE STRUCTURE: [resolved from CLAUDE.md or user — either single page.tsx, or split
into multiple files within the prototype folder]

Use Client Components ('use client') for anything interactive. Use inline styles
with CSS custom properties from the design system.
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

---

## Prototype Naming

Generate random two-word funny names: adjective + noun. Examples: Turbo Falcon, Dizzy Panda, Cosmic Waffle, Neon Penguin, Mango Thunder, Lazy Kraken, Pixel Moose, Quantum Burrito.

Slug format: `turbo-falcon`, `dizzy-panda`, etc.

---

## What This Skill Does NOT Do

- No tests (no vitest, no playwright)
- No planning methodology (no chapters, no TDD)
- No database work (all prototype data is mocked)
- No auth
- No deployment
- No code review gates

This is fast, creative, no-ceremony prototyping. The prototype viewer app has its own database for comments/pins/reviews, but prototype *content* is always mocked.

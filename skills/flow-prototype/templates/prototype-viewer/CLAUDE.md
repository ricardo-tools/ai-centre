@AGENTS.md

# Prototype App — Code Standards

All code in this project (the base app AND every prototype) must follow these rules. **No exceptions. No shortcuts. No skips.** The full 7-layer architecture applies to everything — the viewer app, the shell replicas, and every prototype page.

---

## Mandatory Skills

Read and follow these skills before any work. They are the full source of truth — this file provides a summary, the skills have the complete rules, examples, and quality gates.

1. **`skills/frontend-architecture.md`** — 7-layer architecture, component conventions, CSS custom property styling, grid system, TypeScript conventions
2. **`skills/app-layout.md`** — Shell layout patterns, responsive grid configs, navigation widgets, spacing principles
3. **`skills/design-foundations.md`** — Visual hierarchy, 8px spacing system, alignment, negative space, attention to detail
4. **`skills/brand-design-system.md`** — Color palette, typography, semantic tokens, theming, Phosphor Icons
5. **`skills/creative-toolkit.md`** — Asset libraries, animation engines, data visualization
6. **`skills/responsiveness.md`** — Responsive breakpoints, mobile-first cascade, touch targets, quality gates

Skills live in `../.claude/skills/` (one level up from this project, in the workspace `.claude` directory).

---

## 7-Layer Architecture (MANDATORY — No Exceptions)

Every piece of code must live in the correct layer. All 7 layers must be implemented.

### Layer Structure

```
src/
├── domain/                    # Layer 1: Domain Objects — pure TS classes, zero framework deps
│   ├── Project.ts
│   ├── Prototype.ts
│   └── Comment.ts
├── acl/                       # Layer 2: Anti-Corruption Layer — mappers from raw data → domain
│   ├── project.mapper.ts
│   ├── prototype.mapper.ts
│   └── comment.mapper.ts
├── widgets/                   # Layer 3: Widgets — self-contained business UI units
│   ├── registry.ts            # Widget registry (all widgets registered here)
│   ├── ProjectCardWidget/
│   │   ├── ProjectCardWidget.tsx
│   │   ├── ProjectCardLG.tsx
│   │   ├── ProjectCardMD.tsx
│   │   ├── ProjectCardSM.tsx
│   │   ├── ProjectCardXS.tsx
│   │   └── useProjectCard.ts  # Data hook
│   └── ...
├── components/                # Layer 4: Components — atomic, stateless, props-only
│   ├── TagBadge.tsx
│   ├── Breadcrumb.tsx
│   └── ...
├── screens/                   # Layer 5: Screen Configs — typed classes defining layout
│   ├── Home.screen.ts
│   ├── ProjectDetail.screen.ts
│   └── PrototypeViewer.screen.ts
├── screen-renderer/           # Layer 6: Screen Renderer — engine that reads configs and renders
│   └── ScreenRenderer.tsx
├── i18n/                      # Localization
│   └── en-AU.ts
└── styles/                    # Global styles
    └── tokens.css
```

### Layer Rules

| Layer | What lives here | What NEVER lives here |
|-------|----------------|----------------------|
| **Domain Objects** | Pure TS `class`, business logic, validation | React imports, API calls, framework deps |
| **ACL Mappers** | `toEntity(raw)` functions, raw API types | Business logic, rendering, React |
| **Widgets** | Self-contained UI units with data hooks, 4 size variants (XS/SM/MD/LG) | Direct API calls (use hooks), hardcoded data |
| **Components** | Atomic, stateless, props-only, inline-styled | `useState`, `useEffect`, data fetching, business logic |
| **Screen Configs** | Typed `class` extending `ScreenRendererConfig` with grid layout, widget list, slots | JSX, rendering logic, data fetching |
| **Screen Renderer** | Registry-driven engine that reads configs and renders widgets in grid | Business logic, hardcoded layouts |
| **Pages (app/)** | Thin wiring ONLY: import config, fetch data, `<ScreenRenderer config={...} />` | Business logic, layout decisions, complex JSX |

### Absolute Rules

- **Components are stateless.** Zero `useState`, zero `useEffect`, zero event handlers that manage state. If it needs state, it's a widget.
- **Widgets own their data.** Each widget has a `useWidgetName.ts` data hook. The hook uses ACL mappers. No raw API types in widget files.
- **Domain objects are classes, not interfaces.** `class Project { ... }` not `interface ProjectMeta { ... }`. Pure TypeScript, zero framework dependencies.
- **Pages are thin wiring.** A page imports a screen config, fetches server data, and renders `<ScreenRenderer />`. Nothing else.
- **Every widget has 4 size variants.** `WidgetNameXS.tsx`, `WidgetNameSM.tsx`, `WidgetNameMD.tsx`, `WidgetNameLG.tsx`. The screen config declares which size per breakpoint.
- **Widget registry.** All widgets registered in `src/widgets/registry.ts`. Screen configs reference widgets by registry key.
- **No hardcoded hex colors.** All styling via `var(--color-*)` tokens. Shell replicas that mirror external apps define their own CSS custom properties.
- **Grid controls layout.** Widgets use `width: '100%'` to fill their grid cell. Never fixed pixel widths on widgets.
- **i18n for all user-facing strings.** Translation keys, not hardcoded text. Single locale file is fine, but the infrastructure must exist.

---

## Styling Rules

- **Inline styles only** — `style={{}}` with `var(--color-*)` CSS custom properties
- **No Tailwind** — never use utility classes in JSX
- **No hardcoded hex colors** — always semantic tokens. Shell replicas define their own CSS custom properties for external app colors.
- **Spacing: 8px system** — only use 4, 8, 16, 24, 32, 48px. No arbitrary values
- **Use token variables** — `var(--space-1)` through `var(--space-6)`, `var(--radius-sm/md/lg)`, `var(--shadow-sm/md/lg)`

## Typography

- **Font**: Jost (`var(--font-body)`), JetBrains Mono for code (`var(--font-mono)`)
- **Weights**: 300-800 (400 body, 500 nav/labels, 600 buttons/headings, 700 page titles)
- **Icons**: Phosphor Icons — `regular` weight default, `fill` for active states

## Theming

- Three themes: Light, Dark, Night — via `data-theme` attribute on `<html>`
- Components reference semantic tokens only — no theme awareness in component code

## Responsive Design

- **Breakpoints**: xs (0px), sm (640px), md (768px), lg (1024px)
- **Mobile-first cascade**: default → sm → md → lg
- **Touch targets**: min 44×44px, 8px+ gaps on mobile
- **Equal-height containers**: CSS Grid `grid-auto-rows: 1fr` or Flexbox `align-items: stretch`
- **`Responsive<T>` type**: `T | { default: T; sm?: T; md?: T; lg?: T }` for all grid dimensions

## Visual Hierarchy

- Max 3-4 hierarchy levels per composition
- Primary element identifiable within 1 second
- Cross-sibling alignment: headings/body/actions at same Y-position in card rows

---

## Quality Gates (Check After Every Change)

### Architecture
- [ ] All code lives in the correct layer
- [ ] Domain objects are classes, not interfaces
- [ ] ACL mappers exist for every data source
- [ ] Widgets have 4 size variants (XS/SM/MD/LG) and a data hook
- [ ] All widgets registered in registry.ts
- [ ] Screen configs are typed classes with grid layout
- [ ] Pages are thin wiring only — `<ScreenRenderer config={...} />`
- [ ] Components are stateless — zero useState/useEffect

### Styling
- [ ] No hardcoded hex colors — only `var(--color-*)` tokens
- [ ] No Tailwind classes in JSX
- [ ] Spacing follows 8px system (4, 8, 16, 24, 32, 48px only)

### Design
- [ ] Visual hierarchy: 3-4 levels max, primary obvious in 1 second
- [ ] Cross-sibling alignment in card rows
- [ ] Equal-height containers in grid/flex rows
- [ ] Touch targets: min 44×44px on mobile
- [ ] Responsive spacing scales proportionally across breakpoints

### i18n
- [ ] All user-facing strings use translation keys
- [ ] No hardcoded locale strings

---

## Bundler

This project uses **Webpack** (configured via `--webpack` CLI flag in package.json). Do not switch to Turbopack.

## Dev Server

Port: **4242** (`npm run dev` runs on localhost:4242)

---

## Local Development

### Zero-Setup Principle

Running the app locally must require **zero manual steps** beyond cloning and starting. Two paths, both fully automated:

#### Path 1: Docker (recommended for portability)
```bash
docker compose up
# → Installs deps, creates DB, starts dev server on :4242
```

#### Path 2: Native Node
```bash
npm install && npm run dev
# → Setup script creates DB + tables automatically before Next.js starts
```

### Database: libSQL / Turso

Same codebase, same queries for local and production. Only the connection URL changes.

- **Client:** `@libsql/client` — the official Turso SDK. Async API.
- **Local:** Embedded SQLite file at `file:data/prototype-viewer.db`. No server or Docker needed for the DB.
- **Production:** Turso cloud via `libsql://your-db.turso.io` + auth token.
- **Connection:** `src/db/client.ts` creates a single client using env vars:
  - `TURSO_DATABASE_URL` — defaults to `file:data/prototype-viewer.db` if unset
  - `TURSO_AUTH_TOKEN` — only needed for Turso cloud (ignored locally)
- **Auto-creation:** `scripts/setup-db.ts` runs as `predev` script. Creates tables via `CREATE TABLE IF NOT EXISTS`. Idempotent — safe to run repeatedly. Uses the same `@libsql/client` connection.
- **Tables:** `comments`, `pins`, `pin_replies`
- **No migrations tool** — schema changes are additive in V1. The setup script is the migration.

### Docker Compose

- `docker-compose.yml` at `prototypes/` root
- Single service: `prototype-viewer`
- Mounts `projects/` and `data/` as volumes so prototypes and DB persist
- Node 20 Alpine base image
- Runs `npm run dev` internally

### Git-Ignored Files

- `data/prototype-viewer.db` — SQLite database (auto-created)
- `data/comments.json` — legacy comments file (migrated to SQLite)
- `node_modules/`
- `.next/`

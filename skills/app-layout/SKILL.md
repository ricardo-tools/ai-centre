---
name: app-layout
description: >
  Shell layout patterns and page-level grid configurations. Apply when creating
  or modifying shell layouts, navigation widgets, sidebar widgets, or page-level
  screen configs. Builds on the frontend-architecture skill's grid system. For
  Patterns B (Mega Menus), C (Sidebar Only), and D (Minimal), see the companion
  app-layout-patterns-reference.
---

# App Layout

This skill defines **which shell pattern** the app uses and **how widgets are arranged** within it. It does NOT define the architecture itself (layers, grid types, rendering) — that lives in **frontend-architecture**.

---

## When to Use

Apply this skill when:
- Choosing a shell layout pattern for a new project
- Implementing or modifying the app shell (topbar, sidebar, content area)
- Adding or modifying navigation widgets
- Configuring page-level content grids
- Working with responsive shell behaviour across breakpoints

Do NOT use this skill for:
- Grid system mechanics, widget layer rules, or rendering — see **frontend-architecture**
- Colour tokens or theming — see **brand-design-system**
- Visual design principles (spacing, hierarchy) — see **design-foundations**

---

## Core Rules

### 1. Choose the pattern that fits the navigation model

| Pattern | Best for | Shell structure |
|---|---|---|
| **A: TopBar + Sidebar** | Apps with deep navigation + persistent horizontal info | TopBar spans full width, sidebar on left, content fills remaining |
| **B: TopBar + Mega Menus** | Wide navigation (4–8 top-level categories), marketing sites | Full-width topbar with dropdown mega menus, no sidebar |
| **C: Sidebar Only** | Admin panels, dev tools, settings-heavy apps | Fixed sidebar with logo, nav, and user controls. No topbar. |
| **D: Minimal / No Shell** | Login, onboarding, full-screen editors, focused tasks | No persistent navigation. Optional minimal header. |

Pattern A is the default for this project. Patterns B, C, D are fully specified in **app-layout-patterns-reference**.

### 2. The shell is responsive — not just reflowed

Each shell pattern has fundamentally different behaviour at each breakpoint, not just reflowed columns:
- Mobile: sidebar hidden, hamburger menu or bottom nav
- Tablet: icon-only sidebar or condensed nav
- Desktop: full sidebar or full nav with mega menus

### 3. Content grids are separate from shell grids

The shell grid uses `columnTemplate` for fixed-width regions (sidebar, topbar). Content grids inside the slot use uniform `1fr` columns and `rowHeight: 'auto'` on mobile. Don't mix shell grid patterns with content grid patterns.

### 4. The grid controls dimensions, widgets fill their cells

Widgets use `width: '100%'` and let the grid define their size. Sidebar width is controlled by `columnTemplate`, not by the sidebar widget. TopNav logo width matches the sidebar column width at LG for alignment.

---

## Pattern A: TopBar + Sidebar (Default)

```
┌──────────────────────────────────────────┐
│                  TopBar                   │
├──────────┬───────────────────────────────┤
│          │                               │
│ Sidebar  │         Content Slot          │
│ (fixed)  │         (flexible)            │
│          │                               │
└──────────┴───────────────────────────────┘
```

### Breakpoint Behaviour

| Breakpoint | Columns | Sidebar | TopNav Variant |
|---|---|---|---|
| **XS/SM** (< 768px) | 1 column, `1fr` | Hidden (`grid: null`) | Hamburger menu |
| **MD** (768–1023px) | 2 columns, `48px 1fr` | Icon-only (48px) | Compact |
| **LG** (1024+) | 2 columns, `220px 1fr` | Full nav (220px) | Full 3-zone layout |

### Grid Config

```ts
grid: {
  columns: { default: 1, md: 2 },
  columnTemplate: { default: '1fr', md: '48px 1fr', lg: '220px 1fr' },
  rows: 'auto',
  rowHeight: { default: 52, lg: 56 },
  gap: 0,
}
```

### Widget Positions

```ts
widgets: [
  {
    widgetName: 'top-nav',
    size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
    grid: {
      default: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
      md: { col: 1, colSpan: 2, row: 1, rowSpan: 1 },
    },
  },
  {
    widgetName: 'sidebar',
    size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
    grid: {
      default: null,                                           // hidden on mobile
      md: { col: 1, colSpan: 1, row: 2, rowSpan: 20 },       // visible on md+
    },
  },
  {
    type: 'slot',
    name: 'main-content',
    grid: {
      default: { col: 1, colSpan: 1, row: 2, rowSpan: 20 },  // full width on mobile
      md: { col: 2, colSpan: 1, row: 2, rowSpan: 20 },       // beside sidebar on md+
    },
  },
]
```

Shell uses `containerStyle={{ height: '100vh', overflow: 'hidden' }}`.

### Sidebar ↔ TopNav Alignment (LG)

Sidebar width is **220px** (grid `columnTemplate`). TopNav logo container must also be **220px** so the logo area aligns with the sidebar column below. Logo uses `paddingLeft: 16` to match sidebar internal padding.

At MD (48px icon sidebar), no logo-sidebar alignment needed.

---

## TopNav Layout (LG)

Three-zone layout:

```
┌─────────────────────────────────────────────────────────┐
│ [Logo 220px] [Nav Tabs flex:1] [Right Controls gap:10]  │
└─────────────────────────────────────────────────────────┘
```

**Zone 1: Logo (left)** — fixed 220px matching sidebar, `paddingLeft: 16`, logo 32px in 56px bar. Both `.logo-color` and `.logo-white` rendered; CSS toggles by theme.

**Zone 2: Nav Tabs (center, flex: 1)** — each tab full-height with bottom indicator on active. Active: `--color-topnav-text`. Inactive: `--color-topnav-text-muted`. Active indicator: 2px bar at bottom.

**Zone 3: Right Controls (right)** — `display: flex`, `gap: 10`, `flexShrink: 0`. Status badges group (`gap: 8`), ThemeSwitcher, Avatar (36x36px). Badge: `padding: '5px 12px'`, `borderRadius: 999`, `fontSize: 11`.

**Spacing principle:** Related items closer (`gap: 8`), distinct controls further (`gap: 10`). Two gap sizes, used consistently. No ad-hoc margins.

---

## Dashboard Content Grid

```ts
grid: {
  columns: { default: 1, sm: 2, lg: 12 },
  rows: 'auto',
  rowHeight: { default: 'auto', lg: 60 },
  gap: { default: 12, md: 16 },
}
```

| Breakpoint | Columns | Row Height | Layout |
|---|---|---|---|
| **XS** | 1 | auto | Stacked vertically |
| **SM** | 2 | auto | KPIs paired, charts full width |
| **MD** | 2 | auto | Same as SM, more gap |
| **LG** | 12 | 60px | Full desktop grid |

Content grids use uniform `1fr` columns (no `columnTemplate`). Dashboard wrapper adds `background: 'var(--color-bg-alt)'`, `minHeight: '100%'`, `padding: 16`.

---

## Banned Patterns

- ❌ Sidebar width set by the widget instead of `columnTemplate` → grid controls dimensions
- ❌ Same layout on mobile and desktop (just reflowed) → fundamentally different behaviour per breakpoint
- ❌ Shell grid mixed with content grid patterns → shell uses `columnTemplate`, content uses uniform `1fr`
- ❌ TopNav logo width doesn't match sidebar column at LG → both must be 220px for alignment
- ❌ Fixed sidebar on mobile → hidden on XS/SM, hamburger menu instead
- ❌ Ad-hoc margin values on navigation controls → use two gap sizes (inner and outer), consistently
- ❌ Content area without independent scrolling → slot uses `overflow: auto`, shell uses `overflow: hidden`
- ❌ z-index conflicts → TopBar 100, Sidebar 90, Modal overlay 200, Dropdown 150

---

## Quality Gate

Before delivering, verify:

- [ ] Shell pattern matches the chosen pattern (A by default)
- [ ] Widget grid positions are responsive with mobile-first defaults
- [ ] Sidebar hidden on XS/SM (`grid: { default: null, md: ... }`)
- [ ] Sidebar width controlled by `columnTemplate`, not by widget
- [ ] TopNav logo container matches sidebar column width (220px) at LG
- [ ] TopNav 3-zone layout maintained at LG (logo, tabs, right controls)
- [ ] Right-side spacing uses consistent grouped gaps, not ad-hoc margins
- [ ] Content pages add their own background if needed (shell slot is transparent)
- [ ] Content grids use `rowHeight: 'auto'` on mobile
- [ ] Content grids use uniform `1fr` columns (no `columnTemplate`)
- [ ] No horizontal overflow at any breakpoint
- [ ] Shell uses `height: 100vh` with `overflow: hidden`, content slot scrolls independently

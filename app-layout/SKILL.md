---
name: app-layout
description: >
  Defines the app shell layout pattern and page-level grid configurations.
  Apply this skill when creating or modifying shell layouts, navigation widgets,
  sidebar widgets, or page-level screen configs. This skill builds on top of
  the frontend-architecture skill — read that first for the underlying grid
  system, widget layer rules, and rendering mechanics.
---

# App Layout Skill

This skill defines **which shell pattern** the app uses and **how widgets are arranged** within that shell. It does NOT define the architecture itself (layers, grid types, rendering) — that lives in the **frontend-architecture** skill.

---

## Shell Layout Patterns

The architecture's grid system supports multiple shell layouts. Each pattern uses a different `columnTemplate` and widget arrangement. Choose the pattern that fits your app's navigation model.

### Pattern A: TopBar + Sidebar

A horizontal navigation bar across the top and a fixed-width vertical sidebar on the left. The content area fills the remaining space.

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

Grid config: `columnTemplate: '<sidebar-width>px 1fr'` with 2 columns, `gap: 0`.
- TopBar spans both columns (full width)
- Sidebar fills the fixed-width column
- Content slot takes the remaining space

### Pattern B: TopBar Only (Mega Menus)

A single horizontal navigation bar with dropdown mega menus. No sidebar. Content area is full width below the bar. Navigation is entirely horizontal, with category-level items in the top bar and sub-navigation exposed via mega menu dropdowns.

**When to use:** Marketing sites, content-heavy applications, e-commerce storefronts, documentation sites, and any app where the navigation hierarchy is wide (many top-level categories) rather than deep. Best when there are 4–8 top-level navigation categories, each with sub-items that benefit from a multi-column dropdown layout.

#### Responsive Diagrams

**XS/SM (< 768px) — Mobile**
```
┌──────────────────────────┐
│ [☰] [Logo]    [Search] [A]│
├──────────────────────────┤
│                          │
│     Content Slot         │
│     (full width)         │
│                          │
└──────────────────────────┘

  ┌──── Hamburger opens: ────┐
  │ ┌──────────────────────┐ │
  │ │  [✕ Close]           │ │
  │ │  Category 1     [▸]  │ │
  │ │  Category 2     [▸]  │ │
  │ │  Category 3     [▸]  │ │
  │ │  Category 4     [▸]  │ │
  │ │  ────────────────    │ │
  │ │  [Search]            │ │
  │ │  [Theme] [Avatar]    │ │
  │ └──────────────────────┘ │
  └──────────────────────────┘
```

**MD (768–1023px) — Tablet**
```
┌────────────────────────────────────────┐
│ [Logo] [Cat1] [Cat2] [Cat3] [More ▾] [A]│
├────────────────────────────────────────┤
│                                        │
│           Content Slot                 │
│           (full width)                 │
│                                        │
└────────────────────────────────────────┘
```

**LG (1024px+) — Desktop**
```
┌────────────────────────────────────────────────────────┐
│ [Logo 160px] [Cat1] [Cat2] [Cat3] [Cat4] [Cat5]  [Search] [Theme] [A]│
├────────────────────────────────────────────────────────┤
│                                                        │
│                   Content Slot                         │
│                   (full width)                         │
│                                                        │
└────────────────────────────────────────────────────────┘

  ── Cat2 hover/click opens mega menu: ──
  ┌──────────────────────────────────────────────────────┐
  │  Section A       Section B       Featured            │
  │  ─────────       ─────────       ─────────           │
  │  Link 1          Link 1          [Image]             │
  │  Link 2          Link 2          Promo text          │
  │  Link 3          Link 3          [CTA Button]        │
  │  Link 4          Link 4                              │
  └──────────────────────────────────────────────────────┘
```

#### Breakpoint Behavior

| Breakpoint | Columns | Nav State | MegaNav Variant |
|---|---|---|---|
| **XS/SM** (< 768px) | 1 column, `1fr` | Hamburger; nav hidden, opens as slide-out drawer from left | Compact: logo + hamburger + avatar (XS/SM) |
| **MD** (768–1023px) | 1 column, `1fr` | Condensed horizontal nav; overflow items collapse into "More" dropdown | Medium: logo + truncated nav + avatar (MD) |
| **LG** (1024+) | 1 column, `1fr` | Full horizontal nav with mega menu dropdowns on hover/click | Full: logo + all nav items + search + controls (LG) |

#### Grid Config

```ts
grid: {
  columns: 1,
  rows: 'auto',
  rowHeight: { default: 52, lg: 56 },
  gap: 0,
}
```

#### Widget Positions

```ts
widgets: [
  {
    widgetName: 'mega-nav',
    size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
    grid: {
      default: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
  },
  {
    type: 'slot',
    name: 'main-content',
    grid: {
      default: { col: 1, colSpan: 1, row: 2, rowSpan: 20 },
    },
  },
]
```

The shell uses `containerStyle={{ height: '100vh', overflow: 'hidden' }}` so the viewport is filled and the content slot scrolls independently.

#### MegaNav Layout Pattern (LG Variant)

The MegaNav at LG follows a three-zone layout within a single 56px-tall bar:

```
┌───────────────────────────────────────────────────────────┐
│ [Logo 160px] │ [Nav Items flex:1 gap:0]  │ [Controls gap:10]│
└───────────────────────────────────────────────────────────┘
```

**Zone 1: Logo Area (left)**
- Fixed `width: 160px`, `flexShrink: 0`
- `paddingLeft: 24`
- Logo height: 32px in a 56px bar
- Background: `var(--color-topnav-bg)`

**Zone 2: Nav Items (center, flex: 1)**
- `display: flex`, `alignItems: 'stretch'`, `gap: 0`
- `paddingLeft: 8` (separation from logo area)
- Each nav item: `paddingInline: 16`, `height: 100%`, `display: flex`, `alignItems: 'center'`
- Text: `fontSize: 14`, `fontWeight: 500`, `color: 'var(--color-topnav-text-muted)'`
- Active/hovered text: `color: 'var(--color-topnav-text)'`
- Active indicator: 2px bar at bottom, `var(--color-topnav-text)` color
- Hover indicator: 2px bar at bottom, `var(--color-topnav-text-muted)` with `opacity: 0.5`
- Items with mega menus show `CaretDown` icon (12px, `weight: 'regular'`) with 4px gap from label

**Zone 3: Right Controls (right)**
- `display: flex`, `gap: 10`, `alignItems: 'center'`, `flexShrink: 0`, `paddingRight: 24`
- Search icon button: 36×36px, `borderRadius: 8`
- ThemeSwitcher: same as Pattern A
- Avatar: 36×36px circle

#### Mega Menu Panel

**Positioning & Chrome:**
- Positioned absolutely below the triggering nav item
- Full-width variant: `left: 0`, `right: 0` (spans viewport width) — use for menus with 3+ sections
- Content-width variant: `minWidth: 480px`, `maxWidth: 720px`, aligned to trigger's left edge — use for 1–2 sections
- `top: 56px` (flush below the 56px navbar)
- `backgroundColor: 'var(--color-surface)'`
- `border: '1px solid var(--color-border)'`
- `borderTop: 'none'` (flush with navbar bottom)
- `borderRadius: '0 0 8px 8px'` (rounded bottom corners only)
- `boxShadow: '0 8px 24px rgba(0,0,0,0.12)'`
- `padding: 24`
- `zIndex: 100`

**Internal layout:**
- `display: grid`, `gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))'`
- `gap: 32` between columns
- Each column:
  - Section header: `fontSize: 11`, `fontWeight: 700`, `textTransform: 'uppercase'`, `letterSpacing: '0.5px'`, `color: 'var(--color-text-muted)'`, `marginBottom: 12`
  - Link list: `display: flex`, `flexDirection: 'column'`, `gap: 4`
  - Each link: `padding: '8px 0'`, `fontSize: 14`, `fontWeight: 400`, `color: 'var(--color-text-body)'`; hover: `color: 'var(--color-primary)'`
  - Optional link description: `fontSize: 12`, `fontWeight: 350`, `color: 'var(--color-text-muted)'`, `marginTop: 2`
- Optional featured column (last column):
  - `backgroundColor: 'var(--color-bg-alt)'`, `borderRadius: 8`, `padding: 16`
  - Image: `width: '100%'`, `borderRadius: 6`, `marginBottom: 12`
  - Title: `fontSize: 14`, `fontWeight: 600`
  - Description: `fontSize: 13`, `fontWeight: 400`, `color: 'var(--color-text-muted)'`
  - CTA link: `fontSize: 13`, `fontWeight: 600`, `color: 'var(--color-primary)'`

**Backdrop:**
- Semi-transparent overlay behind the panel: `backgroundColor: 'rgba(0,0,0,0.15)'`
- Covers viewport below the navbar, `zIndex: 99`
- Clicking backdrop closes the mega menu

**Trigger behavior:**
- Desktop (LG): hover opens after 150ms delay (prevents accidental triggers); click also toggles
- Tablet (MD): click only — no hover menus on touch devices
- Close: click outside, press Escape, hover away for 300ms (desktop), click the trigger again

**Animation:**
- Open: `transform: translateY(-8px) → translateY(0)`, `opacity: 0 → 1`, `duration: 200ms`, `ease: cubic-bezier(0.16, 1, 0.3, 1)`
- Close: `opacity: 1 → 0`, `duration: 150ms`, `ease: ease-in`

**Keyboard navigation:**
- `Tab` / `Shift+Tab`: moves between top-level nav items
- `Enter` or `Space`: opens the mega menu for the focused nav item
- `ArrowDown`: from a nav item, enters the mega menu; within a column, moves to next link
- `ArrowUp`: within a column, moves up; from first link, returns focus to trigger
- `ArrowRight` / `ArrowLeft`: moves between columns within the open mega menu
- `Escape`: closes the mega menu, returns focus to the trigger
- Focus trap: Tab past the last link closes the menu and moves to the next nav item

#### Mobile Drawer (XS/SM)

- Triggered by hamburger icon (`List`, 24px, `weight: 'regular'`)
- Drawer slides from the left: `width: 280px`, `height: '100vh'`
- `backgroundColor: 'var(--color-surface)'`
- `boxShadow: '4px 0 24px rgba(0,0,0,0.15)'`
- `zIndex: 200`
- Backdrop: `backgroundColor: 'rgba(0,0,0,0.4)'`, `zIndex: 199`
- Animation: `transform: translateX(-100%) → translateX(0)`, `duration: 250ms`, `ease: cubic-bezier(0.16, 1, 0.3, 1)`
- Close button: `X` icon, 24px, top-right of drawer, `padding: 16`

**Accordion navigation inside drawer:**
- Category item: `padding: '12px 16px'`, `fontSize: 15`, `fontWeight: 500`, `display: flex`, `justifyContent: 'space-between'`
- `CaretRight` chevron rotates 90° when expanded
- Sub-items: `paddingLeft: 32`, `padding: '10px 16px'`, `fontSize: 14`, `fontWeight: 400`
- Section divider: `borderBottom: '1px solid var(--color-border)'`, `margin: '8px 16px'`
- Footer zone at bottom: `padding: 16`, `borderTop: '1px solid var(--color-border)'` — contains search bar, ThemeSwitcher, avatar row

#### Tablet "More" Overflow (MD)

When nav items exceed available width, overflow items collapse into a "More" dropdown:

- "More" trigger: same styling as other nav items, with `CaretDown` icon
- Dropdown: `width: 220px`, standard dropdown (not mega menu)
- `backgroundColor: 'var(--color-surface)'`, `border: '1px solid var(--color-border)'`, `borderRadius: 8`
- `boxShadow: '0 4px 16px rgba(0,0,0,0.1)'`, `padding: '4px 0'`
- Each item: `padding: '10px 16px'`, `fontSize: 14`, `fontWeight: 400`

#### Spacing Principles (Pattern B)

- TopNav horizontal padding: `24px` at LG, `16px` at MD, `12px` at XS/SM
- Nav items have zero gap — internal `paddingInline: 16` creates visual spacing
- Right controls use `gap: 10` (consistent with Pattern A)
- Mega menu panel padding: `24px` (Large spacing)
- Mega menu column gap: `32px` (XLarge spacing)
- Link list internal gap: `4px` (Tight spacing)
- Section header to links: `12px`

### Pattern C: Sidebar Only

No top bar. A fixed sidebar contains the logo, navigation, and user controls. Content fills the entire remaining viewport. This pattern maximizes vertical content space by eliminating the horizontal bar.

**When to use:** Admin panels, settings-heavy applications, internal tools, developer tools, design tools (Figma, Linear, Notion-style). Best when the app has deep navigation (many nested sections) rather than wide navigation, and when maximizing the vertical content area matters more than a persistent horizontal information bar.

#### Responsive Diagrams

**XS/SM (< 768px) — Mobile**
```
┌──────────────────────────┐
│ [☰] [Logo]         [A]  │  ← 48px floating header
├──────────────────────────┤
│                          │
│     Content Slot         │
│     (full width)         │
│                          │
└──────────────────────────┘

  ┌── Hamburger opens drawer: ──┐
  │ ┌────────────┐              │
  │ │ [Logo]     │   backdrop   │
  │ │ ──────     │              │
  │ │ Nav 1      │              │
  │ │ Nav 2      │              │
  │ │  └ Sub 1   │              │
  │ │  └ Sub 2   │              │
  │ │ Nav 3      │              │
  │ │            │              │
  │ │ ──────     │              │
  │ │ [Avatar]   │              │
  │ │ [Settings] │              │
  │ └────────────┘              │
  └─────────────────────────────┘
```

**MD (768–1023px) — Tablet**
```
┌────┬───────────────────────────────────┐
│ ⌂  │                                   │
│ ☐  │                                   │
│ ☐  │        Content Slot               │
│ ☐  │        (flexible)                 │
│ ☐  │                                   │
│    │                                   │
│ ☐  │                                   │
│ [A]│                                   │
└────┴───────────────────────────────────┘
 48px
```

**LG (1024px+) — Desktop**
```
┌──────────┬─────────────────────────────────┐
│ [Logo]   │                                 │
│ ──────── │                                 │
│ Section  │                                 │
│  Nav 1   │       Content Slot              │
│  Nav 2 ● │       (flexible)                │
│  Nav 3   │                                 │
│ ──────── │                                 │
│ Section  │                                 │
│  Nav 4   │                                 │
│  Nav 5   │                                 │
│          │                                 │
│ ──────── │                                 │
│ [Avatar] │                                 │
│ [Gear]   │                                 │
└──────────┴─────────────────────────────────┘
   220px
```

#### Breakpoint Behavior

| Breakpoint | Columns | Sidebar State | Mobile Header |
|---|---|---|---|
| **XS/SM** (< 768px) | 1 column, `1fr` | Hidden; accessed via hamburger in floating header; opens as slide-out drawer | Visible: 48px header with hamburger, logo, avatar |
| **MD** (768–1023px) | 2 columns, `48px 1fr` | Icon-only (48px) with tooltips on hover | Hidden (sidebar always visible) |
| **LG** (1024+) | 2 columns, `220px 1fr` | Full sidebar (220px) with logo, nav sections, user controls | Hidden (sidebar always visible) |

#### Grid Config

```ts
grid: {
  columns: { default: 1, md: 2 },
  columnTemplate: { default: '1fr', md: '48px 1fr', lg: '220px 1fr' },
  rows: 'auto',
  rowHeight: 'auto',
  gap: 0,
}
```

Unlike Pattern A, there is no `rowHeight` for a top bar row since there is no top bar. The sidebar and content stretch to `100vh`.

#### Widget Positions

```ts
widgets: [
  {
    widgetName: 'mobile-header',
    size: { default: 'xs', sm: 'sm' },
    grid: {
      default: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },  // visible on mobile
      md: null,                                                 // hidden on md+ (sidebar visible)
    },
  },
  {
    widgetName: 'sidebar-full',
    size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
    grid: {
      default: null,                                            // hidden on mobile (drawer instead)
      md: { col: 1, colSpan: 1, row: 1, rowSpan: 20 },        // icon-only on md, full on lg
    },
  },
  {
    type: 'slot',
    name: 'main-content',
    grid: {
      default: { col: 1, colSpan: 1, row: 2, rowSpan: 20 },   // below mobile header on XS/SM
      md: { col: 2, colSpan: 1, row: 1, rowSpan: 20 },        // beside sidebar on md+
    },
  },
]
```

The shell uses `containerStyle={{ height: '100vh', overflow: 'hidden' }}`.

#### Sidebar Layout Pattern (LG Variant)

The sidebar at LG is a `220px` fixed column with three zones arranged vertically:

```
┌──────────────────┐
│  Zone 1: Logo    │  fixed (not scrollable)
│  (56px)          │
├──────────────────┤
│  Zone 2: Nav     │  scrollable (flex: 1, overflow-y: auto)
│  (flex: 1)       │
│  ...             │
│  ...             │
├──────────────────┤
│  Zone 3: Footer  │  fixed (not scrollable)
│  (auto)          │
└──────────────────┘
```

**Zone 1: Logo Area (top, fixed)**
- `height: 56px`, `display: flex`, `alignItems: 'center'`
- `paddingInline: 16`
- Logo height: 28px
- `borderBottom: '1px solid var(--color-sidebar-section)'`
- `backgroundColor: 'var(--color-sidebar-bg)'`
- `flexShrink: 0`

**Zone 2: Navigation (middle, scrollable)**
- `flex: 1`, `overflowY: 'auto'`, `overflowX: 'hidden'`
- `paddingTop: 8`, `paddingBottom: 8`
- Custom scrollbar: `width: 4px`, `borderRadius: 2px`, background matches `var(--color-sidebar-hover)`
- Scroll indicator: subtle gradient fade at top/bottom when content overflows

**Nav sections:**
- Section header: `padding: '16px 16px 8px 16px'`, `fontSize: 11`, `fontWeight: 700`, `textTransform: 'uppercase'`, `letterSpacing: '0.5px'`, `color: 'var(--color-sidebar-section)'`
- Nav item: `padding: '8px 16px'`, `display: flex`, `alignItems: 'center'`, `gap: 10`, `borderRadius: 6`, `marginInline: 8`
  - Icon: 20px, `weight: 'regular'`, `color: 'var(--color-sidebar-text)'`
  - Label: `fontSize: 14`, `fontWeight: 400`, `color: 'var(--color-sidebar-text)'`
  - Active state: `backgroundColor: 'var(--color-sidebar-hover)'`, `color: 'var(--color-sidebar-text-active)'`, icon `weight: 'fill'`
  - Hover state: `backgroundColor: 'var(--color-sidebar-hover)'`
- Sub-nav items (nested): `paddingLeft: 46px` (16px base + 20px icon + 10px gap = aligns with parent label)
  - No icon, `fontSize: 13`, `fontWeight: 400`
  - Active: `color: 'var(--color-sidebar-text-active)'`, `fontWeight: 500`
- Section divider: `borderTop: '1px solid var(--color-sidebar-section)'`, `margin: '8px 16px'`

**Zone 3: Footer Controls (bottom, fixed)**
- `borderTop: '1px solid var(--color-sidebar-section)'`
- `padding: 12`, `flexShrink: 0`
- `backgroundColor: 'var(--color-sidebar-bg)'`
- User row: `display: flex`, `alignItems: 'center'`, `gap: 10`, `padding: '8px 4px'`, `borderRadius: 6`
  - Avatar: 32×32px circle
  - Name: `fontSize: 13`, `fontWeight: 500`, `color: 'var(--color-sidebar-text)'`, `overflow: 'hidden'`, `textOverflow: 'ellipsis'`, `whiteSpace: 'nowrap'`
  - Settings gear icon (`Gear`): `marginLeft: 'auto'`, 18px, `weight: 'regular'`, `color: 'var(--color-sidebar-text)'`
- Optional ThemeSwitcher below user row: `marginTop: 4`

#### Icon-Only Sidebar (MD Variant)

- Width: `48px` (controlled by grid `columnTemplate`)
- Logo: replaced by app icon or square logomark, 24×24px, centered horizontally
- `paddingTop: 12` above logomark
- Nav items: icon only, 20px, centered in 48px width, `padding: '12px 0'`
- Active indicator: `backgroundColor: 'var(--color-sidebar-hover)'`, `borderRadius: 6`, `width: 36px`, centered
- Tooltip on hover: appears to the right of the icon
  - `backgroundColor: 'var(--color-surface)'`, `color: 'var(--color-text-body)'`
  - `padding: '6px 10px'`, `borderRadius: 6`, `fontSize: 12`, `fontWeight: 500`
  - `boxShadow: '0 2px 8px rgba(0,0,0,0.12)'`
  - `marginLeft: 8` from sidebar edge
  - `whiteSpace: 'nowrap'`
  - Appears after 400ms hover delay
- Section dividers: `width: 24px`, centered, `borderTop: '1px solid var(--color-sidebar-section)'`, `margin: '8px auto'`
- Footer: avatar only (24×24px circle), centered, `paddingBottom: 12`
- No text labels, no section headers, no settings gear (accessible via tooltip menu on avatar click)

#### Mobile Floating Header (XS/SM)

Since Pattern C has no top bar, mobile needs a lightweight floating header for the hamburger trigger:

- `height: 48px`, `display: flex`, `alignItems: 'center'`, `justifyContent: 'space-between'`
- `paddingInline: 12`
- `backgroundColor: 'var(--color-topnav-bg)'`
- `borderBottom: '1px solid var(--color-topnav-border)'`
- Left: hamburger icon (`List`, 24px)
- Center: logo (height 24px)
- Right: avatar (32×32px circle)

This is a separate widget (`mobile-header`) that only renders at XS/SM breakpoints (`grid: { md: null }`).

#### Mobile Drawer (XS/SM)

- Identical structure to the full sidebar (LG), but rendered as an overlay drawer
- `width: 280px`, `height: '100vh'`, `position: 'fixed'`, `top: 0`, `left: 0`
- `backgroundColor: 'var(--color-sidebar-bg)'`
- `boxShadow: '4px 0 24px rgba(0,0,0,0.2)'`
- `zIndex: 200`
- Backdrop: `backgroundColor: 'rgba(0,0,0,0.4)'`, `zIndex: 199`
- Open animation: `transform: translateX(-100%) → translateX(0)`, `duration: 250ms`, `ease: cubic-bezier(0.16, 1, 0.3, 1)`
- Close: swipe left (gesture), tap backdrop, tap close button
- Swipe-to-open: gesture from left edge (first 20px of screen), `threshold: 50px`
- Contains all three zones (logo, nav, footer) — same layout as LG sidebar but in 280px width

#### Spacing Principles (Pattern C)

- Sidebar internal horizontal padding: `16px` at LG, `0px` at MD (icons are centered)
- Nav item horizontal margin: `8px` at LG (creates rounded-corner items inset from edges)
- Zone separation (logo → nav, nav → footer): `1px` solid border
- Nav section header to first item: `8px`
- Between nav items: `2px` visual gap (items have `8px` vertical padding, rounded backgrounds with `marginInline: 8`)
- Between sections: `8px` margin + `1px` divider + `8px` margin = `17px` total visual separation
- Logo zone height: `56px` (matches Pattern A's topbar height for cross-pattern consistency)

### Pattern D: Minimal (No Shell)

No persistent navigation — no sidebar, no top bar. The entire viewport is the content area. Optional minimal header (logo only) can be toggled per screen config. Used for focused, distraction-free experiences.

**When to use:** Login/signup pages, onboarding flows, password reset, email verification, full-screen editors, presentation mode, landing pages, checkout flows, error pages (404, 500). Any screen where persistent navigation would be a distraction from the primary task.

#### Responsive Diagrams

**XS/SM (< 768px) — Mobile, with optional minimal header**
```
┌──────────────────────────┐
│        [Logo]            │  ← optional 48px header
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │   Card / Form      │  │
│  │   (full width      │  │
│  │    minus padding)  │  │
│  │                    │  │
│  └────────────────────┘  │
│                          │
└──────────────────────────┘
```

**MD (768–1023px) — Tablet**
```
┌────────────────────────────────────────┐
│              [Logo]                    │  ← optional 56px header
├────────────────────────────────────────┤
│                                        │
│       ┌──────────────────────┐         │
│       │                      │         │
│       │    Card / Form       │         │
│       │    (max-width 480px) │         │
│       │    centered          │         │
│       │                      │         │
│       └──────────────────────┘         │
│                                        │
└────────────────────────────────────────┘
```

**LG (1024px+) — Desktop**
```
┌──────────────────────────────────────────────────────┐
│                      [Logo]                          │  ← optional 56px header
├──────────────────────────────────────────────────────┤
│                                                      │
│                                                      │
│           ┌──────────────────────────┐               │
│           │                          │               │
│           │     Card / Form          │               │
│           │     (max-width 520px)    │               │
│           │     centered             │               │
│           │                          │               │
│           └──────────────────────────┘               │
│                                                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Alternative: Full-screen editor (no header, no card)**
```
┌──────────────────────────────────────────────────────┐
│                                                      │
│              Full-screen content                     │
│              (no constraints)                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### Breakpoint Behavior

| Breakpoint | Columns | Content Width | Header |
|---|---|---|---|
| **XS/SM** (< 768px) | 1 column, `1fr` | Full width with `16px` horizontal padding | Optional: 48px, logo centered |
| **MD** (768–1023px) | 1 column, `1fr` | Centered, `maxWidth: 480px` | Optional: 56px, logo centered |
| **LG** (1024+) | 1 column, `1fr` | Centered, `maxWidth: 520px` | Optional: 56px, logo centered |

#### Grid Config

```ts
grid: {
  columns: 1,
  rows: 'auto',
  rowHeight: 'auto',
  gap: 0,
}
```

Both the header and headerless variants use the same grid. The difference is whether the `minimal-header` widget is included.

#### Widget Positions

```ts
// Variant 1: With minimal header (e.g. login page)
widgets: [
  {
    widgetName: 'minimal-header',
    size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
    grid: {
      default: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },
    },
  },
  {
    type: 'slot',
    name: 'main-content',
    grid: {
      default: { col: 1, colSpan: 1, row: 2, rowSpan: 20 },
    },
  },
]

// Variant 2: Full-screen (e.g. editor, presentation)
widgets: [
  {
    type: 'slot',
    name: 'main-content',
    grid: {
      default: { col: 1, colSpan: 1, row: 1, rowSpan: 20 },
    },
  },
]
```

Container style varies by sub-pattern:
- Login/signup: `containerStyle={{ height: '100vh', overflow: 'auto' }}` (scroll if form is tall)
- Full-screen editor: `containerStyle={{ height: '100vh', overflow: 'hidden' }}` (editor handles its own scroll)

#### Minimal Header

**When to show:** Login, signup, password reset, email verification, onboarding steps — any screen that needs brand presence but no navigation.

**When to omit:** Full-screen editors, presentation mode, landing pages with their own header, self-contained error pages.

**Layout:**
```
┌──────────────────────────────────────────┐
│                  [Logo]                  │
└──────────────────────────────────────────┘
```

- `height: { default: 48, md: 56 }`
- `display: flex`, `alignItems: 'center'`, `justifyContent: 'center'`
- Logo height: `{ default: 24, md: 32 }`px
- `backgroundColor: 'transparent'` (inherits page background — no visual separation)
- No border, no shadow — the header is a subtle brand anchor, not a navigation bar
- Optional: very subtle `borderBottom: '1px solid var(--color-border)'` only if the page background is `--color-bg-alt` and visual separation helps

#### Centered Content Container

The content slot in Pattern D applies centered container constraints. This is NOT a grid concern — it is applied by the content page's own screen config or wrapper component.

**Container max-widths per breakpoint:**

| Breakpoint | Max Width | Horizontal Padding | Behavior |
|---|---|---|---|
| **XS** (< 640px) | `100%` (no max-width) | `16px` each side | Full-width with breathing room |
| **SM** (640–767px) | `100%` (no max-width) | `24px` each side | Full-width with more breathing room |
| **MD** (768–1023px) | `480px` | `24px` each side | Centered, constrained |
| **LG** (1024+) | `520px` | `32px` each side | Centered, generous whitespace |

**Container styling:**
```ts
contentContainer: {
  maxWidth: { default: '100%', md: 480, lg: 520 },
  marginInline: 'auto',
  paddingInline: { default: 16, sm: 24, lg: 32 },
  paddingTop: { default: 24, md: 48, lg: 64 },
  paddingBottom: { default: 24, md: 48, lg: 64 },
}
```

**For wider content (e.g. onboarding with illustrations):**
```ts
contentContainerWide: {
  maxWidth: { default: '100%', md: 640, lg: 800 },
  // same padding rules
}
```

#### Card / Form Container

When the content is a login form, signup form, or similar focused task, it sits inside a card:

```ts
cardStyle: {
  backgroundColor: 'var(--color-surface)',
  borderRadius: { default: 0, sm: 12 },
  border: { default: 'none', sm: '1px solid var(--color-border)' },
  boxShadow: { default: 'none', sm: '0 1px 3px rgba(0,0,0,0.06)' },
  padding: { default: 24, md: 32, lg: 40 },
}
```

**Mobile (XS):** Card is edge-to-edge (no border, no radius, no shadow). The surface color distinction from `--color-bg` provides enough separation. This avoids the "card floating in a tiny screen" problem.

**Tablet+ (SM, MD, LG):** Card has visible border, subtle shadow, rounded corners. Creates a focused container in the center of the page.

**Card internal layout:**
- Logo (if no header): centered above form, `marginBottom: 32`
- Heading: `fontSize: { default: 22, md: 26 }`, `fontWeight: 700`, `color: 'var(--color-text-heading)'`, `marginBottom: 8`
- Subheading: `fontSize: 14`, `fontWeight: 400`, `color: 'var(--color-text-muted)'`, `marginBottom: 24`
- Form fields: stacked with `gap: 16`
- Primary CTA button: full width, `height: 44`, `marginTop: 8`
- Secondary link (e.g. "Forgot password?"): `fontSize: 13`, `fontWeight: 500`, `color: 'var(--color-secondary)'`, `textAlign: 'center'`, `marginTop: 16`
- Footer text (e.g. "Don't have an account? Sign up"): `fontSize: 13`, `color: 'var(--color-text-muted)'`, `marginTop: 24`, `textAlign: 'center'`

#### Background Treatment

Pattern D pages set their own background on the content slot. Options:

**Option 1: Solid color (default)**
- `backgroundColor: 'var(--color-bg)'` for a clean, unobtrusive background
- Use `var(--color-bg-alt)` for subtle contrast when the card uses `var(--color-surface)`
- Recommended for login, signup, forms

**Option 2: Gradient (brand-heavy pages)**
- `background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 100%)'`
- Subtle, not distracting — the gradient is between two neutral tokens
- Recommended for landing pages, onboarding

**Option 3: Background image (marketing)**
- `backgroundImage: 'url(...)'`, `backgroundSize: 'cover'`, `backgroundPosition: 'center'`
- Card MUST have `backgroundColor: 'var(--color-surface)'` with sufficient opacity for text readability
- Consider `backdropFilter: 'blur(8px)'` on the card for frosted glass effect over images
- Recommended sparingly — only for marketing/landing pages

#### Spacing Principles (Pattern D)

- Vertical centering: use `display: flex`, `alignItems: 'center'`, `minHeight: 'calc(100vh - headerHeight)'` so the card appears vertically centered when content is short
- For taller forms that exceed viewport: `alignItems: 'flex-start'` with `paddingTop` instead of centering (avoids content clipped above the fold)
- Page-level padding (content to viewport edge): `16px` mobile, `24px` tablet, `32px` desktop
- Card internal padding grows with breakpoint: `24px` mobile → `32px` tablet → `40px` desktop
- Spacing between card elements follows the standard 8px base system

---

## This Project's Shell: TopBar + Sidebar (Pattern A, Responsive)

This project uses **Pattern A** with responsive breakpoints — no sidebar on mobile, icon sidebar on tablet, full sidebar on desktop.

### AppShell Breakpoint Behavior

| Breakpoint | Columns | Sidebar | TopNav Variant |
|---|---|---|---|
| **XS/SM** (< 768px) | 1 column, `1fr` | Hidden (`grid: null`) | Hamburger menu (XS/SM) |
| **MD** (768–1023px) | 2 columns, `48px 1fr` | Icon-only (48px) | Compact (MD) |
| **LG** (1024+) | 2 columns, `220px 1fr` | Full nav (220px) | Full 3-zone layout (LG) |

### AppShell Grid Config

```ts
grid: {
  columns: { default: 1, md: 2 },
  columnTemplate: { default: '1fr', md: '48px 1fr', lg: '220px 1fr' },
  rows: 'auto',
  rowHeight: { default: 52, lg: 56 },
  gap: 0,
}
```

### AppShell Widget Positions

```ts
widgets: [
  {
    widgetName: 'top-nav',
    size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
    grid: {
      default: { col: 1, colSpan: 1, row: 1, rowSpan: 1 },  // single column
      md: { col: 1, colSpan: 2, row: 1, rowSpan: 1 },       // spans both columns
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

The shell uses `containerStyle={{ height: '100vh', overflow: 'hidden' }}` so the viewport is filled and the content slot scrolls independently.

### Sidebar ↔ TopNav Alignment (LG only)

At the LG breakpoint, the sidebar width is **220px**, defined by the grid's `columnTemplate`. The sidebar widget uses `width: '100%'` — the grid column controls its width, not the widget.

The TopNav logo container must also be **220px** so the logo area aligns perfectly with the sidebar column below it. The logo uses `paddingLeft: 16` to match the sidebar's internal content padding.

At MD, the sidebar is 48px (icon-only). The TopNav MD variant doesn't need logo-sidebar alignment since there's no full sidebar to align with.

---

## TopNav Layout Pattern

The TopNav (LG variant) follows a three-zone layout:

```
┌─────────────────────────────────────────────────────────┐
│ [Logo 220px] [Nav Tabs flex:1] [Right Controls gap:10]  │
└─────────────────────────────────────────────────────────┘
```

### Zone 1: Logo Area (left)
- Fixed `width: 220px` matching sidebar width
- `paddingLeft: 16` matching sidebar content padding
- Logo height: 32px in a 56px navbar
- Left-aligned within the container
- Both `.logo-color` and `.logo-white` rendered; CSS toggles visibility by theme

### Zone 2: Nav Tabs (center, flex: 1)
- Takes all remaining horizontal space
- Starts immediately after logo area (no gap on the parent nav)
- Each tab: full-height container with bottom indicator on active
- Active: `--color-topnav-text`, inactive: `--color-topnav-text-muted`
- Active indicator: 2px bar at bottom, `--color-topnav-text` color

### Zone 3: Right Controls (right)
- Outer wrapper: `display: flex`, `gap: 10`, `flexShrink: 0`
- Contains two groups:
  1. **Status badges group** — `gap: 8` between badges (tighter internal grouping)
  2. **ThemeSwitcher + Avatar** — at the outer `gap: 10` rhythm
- Badge styling: `padding: '5px 12px'`, `borderRadius: 999`, `fontSize: 11`, `fontWeight: 500`
- Avatar: 36x36px circle, no border stroke, uses `--color-topnav-badge-bg` / `--color-topnav-badge-text`

### Spacing Principle

The right side uses **intentional grouping**: related items (badges) are closer together (`gap: 8`), and distinct controls (badges group, theme switcher, avatar) are further apart (`gap: 10`). This creates visual hierarchy without inconsistent ad-hoc margins.

This principle applies broadly: group related items tighter, separate distinct controls wider. Don't mix arbitrary margin values — pick two gap sizes (inner and outer) and stick to them.

---

## Dashboard Content Grid (Responsive)

The dashboard uses a responsive content grid — stacked on mobile, paired on tablet, full 12-column on desktop.

### Dashboard Grid Config

```ts
grid: {
  columns: { default: 1, sm: 2, lg: 12 },
  rows: 'auto',
  rowHeight: { default: 'auto', lg: 60 },
  gap: { default: 12, md: 16 },
}
```

| Breakpoint | Columns | Row Height | Gap | Layout |
|---|---|---|---|---|
| **XS** (< 640px) | 1 | auto (content-sized) | 12px | Widgets stacked vertically |
| **SM** (640–767px) | 2 | auto (content-sized) | 12px | KPIs paired, charts full width |
| **MD** (768–1023px) | 2 | auto (content-sized) | 16px | Same as SM with more gap |
| **LG** (1024+) | 12 | 60px (fixed rows) | 16px | Full desktop grid |

Content grids use uniform `1fr` columns (no `columnTemplate`) because all content widgets should be fluid.

Widget positions use `Responsive<GridPosition>` with 3 tiers: `default` (mobile stacked), `sm` (tablet paired), `lg` (desktop grid).

The Dashboard wrapper adds `background: 'var(--color-bg-alt)'`, `minHeight: '100%'`, and `padding: 16` since the shell's content slot is transparent.

---

## Checklist (App Layout)

### General (All Patterns)

Run through these for any shell or page layout work:

- [ ] Shell pattern matches the chosen pattern?
- [ ] Widget `grid` positions are responsive with mobile-first defaults?
- [ ] Right-side spacing uses consistent grouped gaps, not ad-hoc margins?
- [ ] Content pages add their own background if needed (shell slot is transparent)?
- [ ] Content grids use `rowHeight: 'auto'` on mobile for content-sized rows?
- [ ] Content grids use uniform `1fr` columns (no `columnTemplate`)?
- [ ] No horizontal overflow at any breakpoint?

### Pattern A Checklist (TopBar + Sidebar)

- [ ] Shell grid uses responsive `columnTemplate` (hidden sidebar on mobile, icon on md, full on lg)?
- [ ] Sidebar hidden on XS/SM (`grid: { default: null, md: ... }`)?
- [ ] Sidebar widget uses `width: '100%'` (grid controls width, not widget)?
- [ ] TopNav logo container width matches sidebar column width (220px) at LG?
- [ ] TopNav 3-zone layout maintained at LG (logo, tabs, right controls)?

### Pattern B Checklist (TopBar + Mega Menus)

- [ ] Shell grid uses single column (`columns: 1`) at all breakpoints?
- [ ] MegaNav widget spans full width at every breakpoint?
- [ ] Mega menu panels use `var(--color-surface)` background and `var(--color-border)` borders?
- [ ] Mega menu z-index (100) is above content but below mobile drawer (200)?
- [ ] Mega menu backdrop z-index (99) is below panel (100)?
- [ ] Hover trigger has 150ms delay to prevent accidental opens?
- [ ] Close behavior implemented: click outside, Escape, hover away (300ms)?
- [ ] Keyboard navigation: Tab, Enter, ArrowDown, ArrowLeft/Right, Escape?
- [ ] Mobile drawer (XS/SM) uses accordion navigation, not mega menu panels?
- [ ] Tablet (MD) has "More" overflow dropdown for excess nav items?
- [ ] Mega menu open animation uses `translateY(-8px) → 0` with 200ms duration?
- [ ] Full-width mega menus for 3+ sections, content-width for 1–2 sections?

### Pattern C Checklist (Sidebar Only)

- [ ] Sidebar uses three-zone layout: fixed logo (top), scrollable nav (middle), fixed footer (bottom)?
- [ ] Sidebar nav zone scrolls independently (`overflowY: 'auto'`) while logo and footer stay fixed?
- [ ] Icon-only sidebar (MD) shows tooltips on hover with 400ms delay?
- [ ] Icon-only sidebar hides text labels, section headers, and settings gear?
- [ ] Mobile floating header only renders at XS/SM breakpoints (`grid: { md: null }`)?
- [ ] Mobile drawer width is 280px with left-to-right slide animation?
- [ ] Mobile drawer has backdrop (`rgba(0,0,0,0.4)`) at z-index 199?
- [ ] Drawer z-index (200) is above all other content?
- [ ] Sidebar nav items have `marginInline: 8px` and `borderRadius: 6` for inset rounded style?
- [ ] Sub-nav items align with parent label text (`paddingLeft: 46px`)?
- [ ] Active nav item uses `weight: 'fill'` icon and `--color-sidebar-text-active` color?
- [ ] Logo zone height (56px) matches Pattern A's topbar height for consistency?

### Pattern D Checklist (Minimal / No Shell)

- [ ] Decided whether to include minimal header or go fully headerless?
- [ ] Minimal header is centered, logo-only, no navigation elements?
- [ ] Content container uses breakpoint-appropriate `maxWidth` (100% mobile, 480px tablet, 520px desktop)?
- [ ] Card is edge-to-edge on mobile (no border, no radius, no shadow)?
- [ ] Card has visible border and subtle shadow on tablet+ (SM, MD, LG)?
- [ ] Vertical centering applied when content is short; `flex-start` with padding when content is tall?
- [ ] Background treatment chosen (solid, gradient, or image) and documented?
- [ ] If background image used, card has sufficient surface opacity for text readability?
- [ ] Container `paddingInline` scales with breakpoint (16px, 24px, 32px)?
- [ ] Card `padding` scales with breakpoint (24px, 32px, 40px)?
- [ ] No persistent navigation elements present (no sidebar, no top bar)?
- [ ] Shell container uses `overflow: 'auto'` for form pages, `overflow: 'hidden'` for editors?

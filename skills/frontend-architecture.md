---
name: frontend-architecture
description: >
  Defines the UI layer architecture: components, widgets, grid system, screen
  renderer, slots, styling, and responsiveness. Apply this skill when creating
  or modifying any UI code — components, widgets, screen configs, or the screen
  renderer. For domain objects, data access, and project structure, see the
  clean-architecture skill.
---

# Frontend Architecture

The UI layer has 5 distinct roles. Each has strict boundaries. This skill governs how UI is structured, styled, and rendered. Domain objects, data access, and project structure are governed by the **clean-architecture** skill.

```
Widgets          (domain + components → business UI, self-contained)
    ↓ uses
Components       (atomic, stateless, inline-styled with CSS variables)
    ↓ placed by
Screen Configs   (typed layout declarations → grid positions + slots)
    ↓ rendered by
Screen Renderer  (config → CSS Grid → widgets + slots)
    ↑ nested via Slots
```

---

## When to Use

Apply this skill when:
- Creating or modifying React components (stateless UI primitives)
- Creating or modifying widgets (self-contained business UI)
- Defining screen configs (grid layouts, widget placements)
- Working with the screen renderer or slot system
- Applying inline styles with CSS custom properties
- Handling responsive size variants

Do NOT use this skill for:
- Deciding where files live in the project structure — see **clean-architecture**
- Domain object design, use cases, or data access — see **clean-architecture**
- Shell layout patterns, navigation, or sidebar — see **app-layout**
- Colour tokens, typography, or theming definitions — see **brand-design-system**

---

## Core Rules

### 1. Components are stateless UI primitives

Accept props only. No data fetching, no API calls, no business logic. State is limited to local UI concerns (dropdown open/closed). Styled with inline `style={{}}` using `var(--color-*)` tokens.

### 2. Widgets are self-contained business UI units

Each widget includes its own data hook (`useWidgetName.ts`) and renders domain objects through components. Widgets never receive domain objects as props from a parent.

**Data flow depends on rendering model:** Client Components (interactive widgets) fetch via their data hook when they need client-side reactivity (search, filters, real-time). Server Components fetch via use cases on the server and pass data as props. In both cases, the data hook acts as a presenter — transforming domain objects into a view model for the component. See **clean-architecture** for the full data flow picture.

### 3. Four size variants per widget

Every widget exports `XS`, `SM`, `MD`, `LG` as separate files. The root widget receives `size` from the Screen Renderer and delegates to the correct variant. Widgets never detect their own breakpoint.

### 4. Inline styles with CSS custom properties only

All components and widgets use `style={{}}` with `var(--color-*)` semantic tokens. No Tailwind utility classes in JSX. No hardcoded hex values. No mode-prefixed tokens. No theme names in component code.

### 5. The grid controls dimensions, widgets fill their cells

Widgets use `width: '100%'` and let the grid define their size. No fixed pixel widths on widget roots. Grid cells use `display: grid` so children stretch automatically.

### 6. Screen configs declare layout, not behaviour

A screen config is a typed class that says which widgets go where on the grid. It contains no rendering logic, no data fetching, no side effects. Widgets are referenced by registered `widgetName` string, not imported directly.

---

## Components

**Location:** `src/components/<ComponentName>/` (or `platform/components/` after architecture migration)

```
src/components/Button/
  Button.tsx        # Component implementation
  index.ts          # Re-exports
```

```tsx
// ✅ CORRECT — stateless, props-only, inline styles with CSS vars
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ label, onClick, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: variant === 'primary' ? 'var(--color-primary)' : 'transparent',
        color: variant === 'primary' ? '#FFFFFF' : 'var(--color-secondary)',
        border: variant === 'primary' ? 'none' : '1px solid var(--color-secondary)',
        padding: '8px 16px',
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {label}
    </button>
  );
}
```

---

## Widgets

**Location:** `src/widgets/<WidgetName>Widget/` (or `features/<name>/widgets/` for feature-specific widgets)

```
src/widgets/TopNavWidget/
  TopNavWidget.tsx       # Root: delegates based on size prop
  TopNavLG.tsx           # Large / desktop
  TopNavMD.tsx           # Medium / tablet
  TopNavSM.tsx           # Small
  TopNavXS.tsx           # Extra small / mobile
  useTopNav.ts           # Data hook → domain objects → view model
  index.ts
```

**File naming:** `[FeatureName][Size].tsx` — e.g. `TopNavLG.tsx`, `InvoiceAgeingMD.tsx`. NOT `TopNavWidget.lg.tsx`.

**Root widget pattern:**

```tsx
import type { RenderableWidget } from '@/screen-renderer/types';
import TopNavLG from './TopNavLG';
import TopNavMD from './TopNavMD';
import TopNavSM from './TopNavSM';
import TopNavXS from './TopNavXS';

const variants = { xs: TopNavXS, sm: TopNavSM, md: TopNavMD, lg: TopNavLG };

export default function TopNavWidget(props: RenderableWidget) {
  const Component = variants[props.size ?? 'lg'];
  return <Component {...props} />;
}

TopNavWidget.widgetName = 'top-nav';
```

**Widget registry:**

```ts
// src/widgets/registry.ts
export const widgetRegistry = {
  [TopNavWidget.widgetName]: TopNavWidget,
  [SidebarWidget.widgetName]: SidebarWidget,
} as const;
```

### Widget States: Loading, Error, Empty

Every data hook must handle three states beyond success:

- **Loading** — skeleton matching the widget's layout. Never a blank container or spinner alone.
- **Error** — inline error message with retry action. Never crash silently.
- **Empty** — contextual message distinguishing "no data exists" from "no results match filter".

```tsx
if (loading) return <SkeletonPlaceholder />;
if (error) return <InlineError message={error} onRetry={refetch} />;
if (!data || data.length === 0) return <EmptyState message="No items found" />;
```

All three states must fit within the widget's grid cell — never break the grid.

---

## Grid System

The Screen Renderer uses a **column x row grid**. Every screen declares both axes. Every widget declares its position and span on both axes.

### Responsive Values

```ts
type Responsive<T> = T | { default: T; sm?: T; md?: T; lg?: T };
```

Plain value = same at all breakpoints. Object cascades mobile-first: `default` → `sm` → `md` → `lg`.

### Grid Config

```ts
interface GridConfig {
  columns: Responsive<number>;
  columnTemplate?: Responsive<string>;
  rows: number | 'auto';
  rowHeight: Responsive<number | 'auto'>;
  gap: Responsive<number>;
}
```

### Widget Grid Position

```ts
interface GridPosition {
  col: number;      // 1-based (CSS Grid)
  colSpan: number;
  row: number;      // 1-based
  rowSpan: number;
}

// null = hidden at that breakpoint
grid: Responsive<GridPosition | null>;
```

### CSS Grid Rendering

```css
.screen-grid { display: grid; grid-template-columns: var(--column-template); gap: var(--gap); }
.widget-cell { grid-column: var(--col) / span var(--col-span); display: grid; overflow: hidden; }
.slot-cell   { /* same positioning */ overflow: auto; }
```

Grid cells use `display: grid` so children stretch. Widget cells use `overflow: hidden`. Slot cells use `overflow: auto`.

---

## Screen Configs

**Location:** `src/screens/<ScreenName>/`

```ts
export class DashboardConfig extends ScreenRendererConfig {
  readonly grid: GridConfig = { columns: 12, rows: 'auto', rowHeight: 60, gap: 16 };
  readonly theme = 'light';
  readonly locale = 'en-AU';

  readonly widgets: WidgetEntry[] = [
    {
      widgetName: 'overdue-amount',
      size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
      grid: { col: 1, colSpan: 4, row: 1, rowSpan: 2 },
    },
  ];
}
```

Shell-level screen configs (with `columnTemplate`, slots, navigation) are defined in the **app-layout** skill.

---

## Slots

A named mount point in a Screen config. Reserves a grid position for a child Screen Renderer.

- Declared as `{ type: 'slot', name: string, grid: GridConfig }`
- Has no UI, no data, no logic
- Nesting is unlimited — a child screen can declare its own slots
- No parent/child awareness between Screen Renderers

```tsx
// app/layout.tsx
<AppShell>
  <SlotProvider name="main-content">
    {children}
  </SlotProvider>
</AppShell>
```

---

## Screen Renderer

The engine. Accepts a `ScreenRendererConfig`, looks up widgets in the registry, applies the grid, renders everything.

- Single source of truth for rendering — no widget renders outside of it
- Resolves widget names via `WidgetRegistry`
- Passes `size` (resolved from config + current breakpoint) to each widget
- Can be nested: outer renderer for shell, inner for page content

---

## Responsiveness

Handled entirely by the Screen Renderer. Widgets never detect their own breakpoint.

| Size | Min Width |
|---|---|
| `xs` | 0px |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |

The renderer resolves the current breakpoint and passes `size: SizeVariant` to each widget. Widgets consume only the `size` prop.

---

## Styling Rules

- `style={{}}` with `var(--color-*)` tokens — always
- Hardcoded hex values — never (except `#FFFFFF` for text-on-primary where no token exists)
- Tailwind utility classes in JSX — never
- Mode-prefixed tokens (`--dm-orange`) — never
- Theme names in component code — never

Theme token definitions and the semantic variable reference live in the **brand-design-system** skill.

---

## Localisation

- Screen Renderer config declares `locale`
- Renderer passes `locale` to widgets via React context
- All user-facing strings use translation keys: `t('orders.title')` not `'Recent Orders'`
- Translation files: `src/i18n/<locale>.ts`
- Domain objects accept `locale` as parameter for formatting — never hardcode `'en-AU'`

---

## File Naming

| Pattern | Example |
|---|---|
| Component | `PascalCase.tsx` — `Button.tsx` |
| Widget root | `PascalCaseWidget.tsx` — `TopNavWidget.tsx` |
| Widget size variant | `PascalCase{Size}.tsx` — `TopNavLG.tsx` |
| Data hook | `camelCase.ts` — `useTopNav.ts` |
| Screen config | `PascalCase.screen.ts` — `Dashboard.screen.ts` |

---

## Banned Patterns

- ❌ Data fetching in components → belongs in widget data hooks
- ❌ Hardcoded hex/rgb in inline styles → use `var(--color-*)` semantic tokens
- ❌ Tailwind utility classes in component/widget JSX → use inline `style={{}}` with CSS vars
- ❌ Breakpoint detection inside widgets (`useMediaQuery`, `window.innerWidth`) → consume `size` prop from renderer
- ❌ Fixed pixel widths on widget roots → use `width: '100%'`, let grid control dimensions
- ❌ 0-based grid positions → CSS Grid is 1-based (`row: 1` is the first row)
- ❌ Widgets without all four size variants → always create XS/SM/MD/LG files
- ❌ Raw API types in widget or hook files → use domain objects via mappers (see **clean-architecture**)
- ❌ `any` type → use proper typing
- ❌ Error/empty states that break the grid → all states must fit within the widget's grid cell
- ❌ Conditional rendering (`{active && <Panel />}`) for tab panels → causes layout shift. Use CSS grid-stack: render all panels in the same grid cell (`gridArea: '1 / 1'`), toggle `visibility: 'visible' / 'hidden'`. Height = tallest panel, no jump.

---

## Quality Gate

Before delivering, verify:

- [ ] New UI primitive is a component (stateless, props-only). New business UI is a widget (self-contained, own data hook).
- [ ] Widget has `XS`, `SM`, `MD`, `LG` variants as separate files with `[FeatureName][Size].tsx` naming
- [ ] Widget has a `size` mapping per breakpoint in its screen config entry
- [ ] Widget grid entry declares both column (`col`, `colSpan`) and row (`row`, `rowSpan`) — 1-based
- [ ] Widget data hook handles loading, error, and empty states within the grid cell
- [ ] Widget registered in `src/widgets/registry.ts`
- [ ] All styles use `var(--color-*)` — no hex, no Tailwind classes in JSX
- [ ] No breakpoint detection inside widgets — `size` prop only
- [ ] No `any` types introduced
- [ ] No hardcoded user-facing strings — translation keys used
- [ ] Shell/layout concerns deferred to **app-layout** skill checklist

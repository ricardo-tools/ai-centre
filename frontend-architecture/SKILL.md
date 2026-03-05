---
name: frontend-architecture
description: >
  Guides the agent to implement the project's frontend architecture pattern.
  Apply this skill whenever creating or modifying any frontend code — components,
  widgets, domain objects, ACL mappers, screen configs, or the screen renderer itself.
stack:
  - Next.js
  - TypeScript (strict)
  - CSS Custom Properties (inline styles with var(--color-*) semantic tokens)
---

# Frontend Architecture Skill

When generating or modifying any frontend code, you MUST follow all rules in this document exactly.
Do not deviate from the layer boundaries, naming conventions, or file structure described here.

---

## Architecture Overview

The architecture has 7 distinct layers. Each has a strict role. Never mix responsibilities across layers.

```
External Data Sources  (REST APIs, GraphQL, CMS, etc.)
        ↓
Anti-Corruption Layer  (raw data → domain objects)
        ↓
Domain Objects         (typed business concepts — classes)
        ↓
Widgets                (domain + components → business UI, self-contained)
        ↓              uses ↓
Components             (atomic, stateless, inline-styled with CSS variables)
        ↓
Screen Renderer        (typed config → grid → widgets + slots)
        ↑ nested infinitely via Slots
```

---

## Styling Approach

**All components and widgets use inline styles with CSS custom properties.** Not Tailwind utility classes — inline `style={{}}` objects referencing `var(--color-*)` semantic tokens.

This was a deliberate decision:
- Inline styles keep each component self-contained — no class name collisions, no CSS file coupling
- `var(--color-*)` references ensure automatic theme switching via the `data-theme` attribute
- No build-time CSS processing needed for component styles

### Rules

- **Always** use `style={{}}` props with CSS variables: `backgroundColor: 'var(--color-surface)'`
- **Never** hardcode hex values in components — only `var(--color-*)` references
- **Never** use Tailwind utility classes in component/widget JSX (Tailwind is used only in `globals.css` for `@import "tailwindcss"` and the palette import)
- **Never** reference mode-prefixed tokens directly (e.g. `--dm-orange`) — use semantic variables
- **Never** reference a theme by name in component code — components are theme-agnostic

```tsx
// ✅ CORRECT
<div style={{
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-body)',
  borderRadius: 8,
  padding: 20,
}}>

// ❌ WRONG — Tailwind classes
<div className="bg-white border border-gray-200 text-gray-700 rounded-lg p-5">

// ❌ WRONG — hardcoded hex
<div style={{ backgroundColor: '#FFFFFF', color: '#333333' }}>
```

---

## Grid System

The Screen Renderer uses a **column × row grid**. Every screen declares both axes. Every widget declares its position and span on both axes. This enforces consistent alignment — no widget has a unique height that breaks the visual rhythm.

### Responsive Values

All grid properties and widget positions support **mobile-first responsive values** via the `Responsive<T>` type:

```ts
/** Mobile-first responsive value. Plain T = same at all breakpoints. */
type Responsive<T> = T | { default: T; sm?: T; md?: T; lg?: T };
```

When a plain value is provided, it applies at all breakpoints. When an object with `default` is provided, the renderer cascades mobile-first: `default` → `sm` → `md` → `lg` (each inherits from the previous if not specified).

### Grid Config (screen-level)

```ts
interface GridConfig {
  columns: Responsive<number>;          // e.g. { default: 1, sm: 2, lg: 12 }
  columnTemplate?: Responsive<string>;  // e.g. { default: '1fr', md: '48px 1fr', lg: '220px 1fr' }
  rows: number | 'auto';               // explicit row count, or 'auto' to grow with content
  rowHeight: Responsive<number | 'auto'>; // 'auto' = rows size to content (for stacked mobile layouts)
  gap: Responsive<number>;             // e.g. { default: 12, md: 16 }
}
```

- `columns` — number of column tracks. Use `Responsive` to change column count per breakpoint (e.g. `{ default: 1, sm: 2, lg: 12 }` for mobile-first stacking)
- `columnTemplate` — optional CSS `grid-template-columns` value. Use `Responsive` to change shell layout per breakpoint (e.g. hide sidebar on mobile, show icon sidebar on tablet, full sidebar on desktop)
- `rows` — set to an explicit number for fixed layouts, or `'auto'` when the number of rows depends on content (the grid grows as needed)
- `rowHeight` — the height of one row unit. Use a number for fixed px heights (desktop grids), or `'auto'` for content-sized rows (mobile stacked layouts). Supports `Responsive` to switch between auto and fixed (e.g. `{ default: 'auto', lg: 60 }`)
- `gap` — gap between cells in px. Use `Responsive` for tighter gaps on mobile (e.g. `{ default: 12, md: 16 }`)

### Widget Grid Position

```ts
interface GridPosition {
  col: number;
  colSpan: number;
  row: number;
  rowSpan: number;
}

// Widget/slot grid property supports responsive positioning
grid: Responsive<GridPosition | null>;  // null = hidden at that breakpoint
```

Widget positions can vary per breakpoint. Set `grid: null` (or `default: null`) to **hide a widget** at that breakpoint (e.g. sidebar hidden on mobile). The renderer skips rendering entirely for null positions.

### Widget Grid Position

```ts
interface WidgetGridPosition {
  col: number;      // start column (1-based)
  colSpan: number;  // how many columns wide
  row: number;      // start row (1-based)
  rowSpan: number;  // how many rows tall
}
```

### CSS Grid rendering

The Screen Renderer translates the config into CSS Grid. **Grid cells themselves use `display: grid`** so that child widgets stretch to fill their allocated space:

```css
/* Container */
.screen-grid {
  display: grid;
  /* Uses columnTemplate if provided, otherwise repeat(columns, 1fr) */
  grid-template-columns: var(--column-template);
  grid-template-rows: repeat(var(--rows), var(--row-height));
  gap: var(--gap);
}

/* Widget cell — also a grid so children fill it */
.widget-cell {
  grid-column: var(--col) / span var(--col-span);
  grid-row: var(--row) / span var(--row-span);
  min-height: 0;
  overflow: hidden;
  display: grid;   /* children stretch to fill */
}

/* Slot cell — same as widget but scrollable */
.slot-cell {
  /* same grid positioning as widget-cell */
  overflow: auto;  /* content scrolls within the slot */
}
```

This nested grid ensures widgets fill their entire cell — no explicit `height: '100%'` needed on widget root elements.

**Key principle: the grid controls dimensions, widgets fill their cells.** Widgets should use `width: '100%'` (not fixed pixel widths) so the grid column definition is the single source of truth for sizing.

> **App-specific grid configs** (shell layout, page grids, widget placements) are defined in the **app-layout** skill, not here. This skill only defines the grid system mechanics.

### Design rationale

- **Consistency** — all widgets in the same row band share the same height. A 2-row widget is exactly the same height as two 1-row widgets stacked vertically. This eliminates ragged layouts where each widget has a different height
- **Predictability** — designers and developers can reason about the grid as a true spreadsheet: "this widget occupies columns 1–8, rows 2–4"
- **Alignment** — adjacent widgets in the same row range are always perfectly aligned top and bottom, with no per-widget height hacks
- **Fill behavior** — `display: grid` on cells means widgets automatically stretch to fill. No manual `height: 100%` hacks

---

## Layer Rules

### 1. Components

**What:** Atomic, stateless UI primitives. The smallest unit.

**Rules:**
- Accept props only — no data fetching, no API calls, no business logic
- State is limited to local UI concerns (e.g. dropdown open/closed)
- Styled with **inline styles using CSS custom properties** (`var(--color-*)`)
- No framework-specific data libraries (no React Query, SWR, etc.)
- Typed props interface; keep it minimal and non-verbose

**Location:** `src/components/<ComponentName>/`

**Files:**
```
src/components/Button/
  Button.tsx        # Component implementation
  index.ts          # Re-exports Button
```

**Example:**
```tsx
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
        fontFamily: "'Jost', sans-serif",
      }}
    >
      {label}
    </button>
  );
}
```

---

### 2. Domain Objects

**What:** Typed representations of real business concepts. The language of the business in code.

**Rules:**
- Declare as TypeScript `class` — not plain objects or interfaces
- One class per business concept (e.g. `Order`, `Customer`, `Invoice`, `Money`)
- Include value objects where semantics matter (e.g. `Money` with `amount + currency`)
- Zero framework dependencies — pure TypeScript only
- No API shapes, no raw data, no UI concerns

**Location:** `src/domain/`

**Files:**
```
src/domain/
  Order.ts
  Customer.ts
  Money.ts       # value object
  index.ts       # barrel export
```

**Example:**
```ts
// src/domain/Money.ts
export class Money {
  constructor(
    readonly amount: number,
    readonly currency: string,
  ) {}

  format(): string {
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: this.currency }).format(this.amount);
  }
}

// src/domain/Order.ts
import { Money } from './Money';

export class Order {
  constructor(
    readonly id: string,
    readonly customerName: string,
    readonly total: Money,
    readonly placedAt: Date,
    readonly status: 'pending' | 'fulfilled' | 'cancelled',
  ) {}
}
```

---

### 3. Anti-Corruption Layer (ACL)

**What:** The only place where raw external data is converted into domain objects. Protects all downstream code from API changes.

**Rules:**
- One mapper file per domain entity (e.g. `order.mapper.ts`)
- Mapper function signature: `toEntityName(raw: RawApiType): DomainClass`
- Raw API types are declared in the same mapper file or in a co-located `*.api.types.ts` file
- Widgets and data hooks NEVER import or use raw API types directly
- If an API changes: fix only the mapper. Domain and widgets are untouched.
- No UI logic, no framework calls

**Location:** `src/acl/`

**Files:**
```
src/acl/
  order.mapper.ts       # toOrder(raw) → Order
  customer.mapper.ts    # toCustomer(raw) → Customer
  index.ts
```

**Example:**
```ts
// src/acl/order.mapper.ts
import { Order } from '@/domain/Order';
import { Money } from '@/domain/Money';

// Raw shape from the API — lives only here
interface OrderApiResponse {
  order_id: string;
  customer_name: string;
  total_amount: number;
  currency_code: string;
  created_at: string;
  order_status: string;
}

export function toOrder(raw: OrderApiResponse): Order {
  return new Order(
    raw.order_id,
    raw.customer_name,
    new Money(raw.total_amount, raw.currency_code),
    new Date(raw.created_at),
    raw.order_status as Order['status'],
  );
}
```

---

### 4. Widgets

**What:** Business UI units. A composition of components + domain data that has standalone business value.

**Rules:**
- MUST implement the `RenderableWidget` interface from `src/screen-renderer/types.ts`
- MUST be self-contained: includes its own data hook (`useWidgetName.ts`)
- Data hook fetches raw data, passes through ACL, returns domain objects
- Data hook MUST support a `mock?: boolean` prop for development and testing
- MUST export four size variants: `XS`, `SM`, `MD`, `LG` as separate files
- The root widget component receives `size: SizeVariant` from the Screen Renderer and delegates to the correct variant sub-component
- NEVER consume raw API types inside widget or hook files — only domain objects
- NEVER receive domain objects as props from a parent — the widget fetches its own data

**Location:** `src/widgets/<WidgetName>Widget/`

**Files:**
```
src/widgets/TopNavWidget/
  TopNavWidget.tsx       # Root: delegates based on size prop
  TopNavLG.tsx           # Large / desktop view
  TopNavMD.tsx           # Medium / tablet view
  TopNavSM.tsx           # Small view
  TopNavXS.tsx           # Extra small / mobile view
  useTopNav.ts           # Data hook → ACL → domain data
  index.ts
```

**File naming convention:** `[FeatureName][Size].tsx` — e.g. `TopNavLG.tsx`, `InvoiceAgeingMD.tsx`, `OverdueAmountXS.tsx`. NOT `TopNavWidget.lg.tsx`.

**Example — data hook:**
```ts
// useTopNav.ts
const MOCK_DATA = { /* ... */ };

export function useTopNav(mock = false) {
  if (mock) return MOCK_DATA;
  // real fetch...
}
```

**Example — root widget:**
```tsx
// TopNavWidget.tsx
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

---

### 5. Screen Config

**What:** A typed class instance that declares what a page renders — which widgets, where on the grid, with which size variants — and where slots are.

**Rules:**
- Declared as a TypeScript class extending `ScreenRendererConfig`
- All properties are typed — no `any`, no plain string maps
- Widgets referenced by their registered `widgetName` string (not imported directly)
- Slots declared as `{ type: 'slot', name: string, grid: GridConfig }`
- A screen is responsible for layout and configuration only — not for what mounts in a slot

**Location:** `src/screens/<ScreenName>/`

**Files:**
```
src/screens/AppShell/
  AppShell.screen.ts     # The typed config instance
  AppShell.tsx           # Thin wrapper: <ScreenRenderer config={appShellConfig} />
```

**Example (content page):**
```ts
// Dashboard.screen.ts
import { ScreenRendererConfig, WidgetEntry, GridConfig } from '@/screen-renderer/types';

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
    {
      widgetName: 'invoice-ageing',
      size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
      grid: { col: 5, colSpan: 8, row: 1, rowSpan: 6 },
    },
  ];
}

export const dashboardConfig = new DashboardConfig();
```

> For shell-level screen configs (with `columnTemplate`, slots, and navigation widgets), see the **app-layout** skill.

---

### 6. Slots (Infinite Nesting)

**What:** A named mount point declared in a Screen config. Reserves a grid position for a child Screen Renderer to be injected by the router/parent.

**Rules:**
- Declared in a Screen config as `{ type: 'slot', name: string, grid: GridConfig }`
- Has NO UI, NO data, NO logic of its own
- The Screen Renderer renders a `<SlotOutlet name="..." />` in that position
- The router/parent resolves what Screen Renderer to mount into each slot
- Any child Screen mounted in a slot can itself declare further slots — nesting is unlimited
- No parent/child awareness between Screen Renderers

**Slot declaration in a screen config:**
```ts
{ type: 'slot', name: '<slot-name>', grid: { col: ..., colSpan: ..., row: ..., rowSpan: ... } }
```

**Router responsibility (Next.js example):**
```tsx
// app/layout.tsx — mounts child pages into the shell's "main-content" slot
<AppShell>
  <SlotProvider name="main-content">
    {children}  {/* Next.js page renders a ScreenRenderer here */}
  </SlotProvider>
</AppShell>
```

---

### 7. Screen Renderer

**What:** The engine. Accepts a `ScreenRendererConfig` instance, looks up widgets in the registry, applies the column × row grid, and renders everything.

**Rules:**
- Single source of truth for rendering — no widget renders outside of it
- Resolves widget names via `WidgetRegistry`
- Passes `size` (resolved from config + current breakpoint) to each widget
- Renders `<SlotOutlet />` for slot entries
- Manages theming, locale, and grid via CSS Grid (`grid-template-columns` + `grid-template-rows`)
- Uses `columnTemplate` if provided, otherwise falls back to `repeat(columns, 1fr)`
- Accepts `containerStyle` prop for additional CSS on the grid container (e.g. `height: '100vh'` for shell layouts)
- Can be nested: outer renderer handles shell; inner renderer handles page content
- Widgets fill their allocated grid area completely — the grid enforces consistent alignment, not the widget
- Grid cells use `display: grid` so children stretch automatically
- Widget cells use `overflow: hidden` (prevents chart/table overflow). Slot cells use `overflow: auto` (content scrolls within the slot)

**Location:** `src/screen-renderer/`

**Widget Registry:**
```ts
// src/widgets/registry.ts
import TopNavWidget from './TopNavWidget';
import SidebarWidget from './SidebarWidget';

export const widgetRegistry = {
  [TopNavWidget.widgetName]: TopNavWidget,
  [SidebarWidget.widgetName]: SidebarWidget,
} as const;
```

---

## Responsiveness

Responsiveness is handled entirely by the **Screen Renderer** — widgets never detect their own breakpoint.

**Breakpoints:**

| Size | Min Width | Tailwind prefix |
|---|---|---|
| `xs` | 0px | (default / no prefix) |
| `sm` | 640px | `sm:` |
| `md` | 768px | `md:` |
| `lg` | 1024px | `lg:` |

**Rules:**
- The Screen Renderer resolves the current breakpoint and passes the correct `size: SizeVariant` to each widget
- Each widget entry in a Screen config declares its size per breakpoint: `size: { default: 'xs', sm: 'sm', lg: 'md' }`
- Widgets NEVER import or use `useMediaQuery`, `window.innerWidth`, or any breakpoint detection — they only consume the `size` prop passed to them

**Screen config size mapping example:**
```ts
{
  widgetName: 'recent-orders',
  size: { default: 'xs', sm: 'sm', md: 'md', lg: 'lg' },
  grid: { col: 1, colSpan: 12, row: 1, rowSpan: 3 },
}
```

---

## Theme Consumption

Theme token definitions (colors, typography, logos) live in the **brand-design-system skill**. This section covers how to **consume** those tokens correctly in code.

**How theming works:**
- The brand skill defines raw mode tokens (e.g. `--lm-orange`, `--dm-surface-1`) and maps them to **semantic CSS variables** (e.g. `--color-primary`, `--color-surface`) per `[data-theme]`
- Components and widgets **only ever reference semantic variables** — never raw mode tokens or hex values
- The `data-theme` attribute is set on `<html>` in the root layout; child components inherit the correct variable values automatically via CSS cascade
- Four themes are supported: `light`, `dark`, `night`, `legacy`

**Semantic variable reference (from brand skill):**

| Semantic Variable | Role |
|---|---|
| `--color-primary` | Primary CTA (orange) |
| `--color-primary-hover` | Primary CTA hover state |
| `--color-primary-muted` | Soft orange background (tags, toasts) |
| `--color-secondary` | Secondary CTA / links (electric blue) |
| `--color-brand` | Brand blue accent |
| `--color-bg` | Page background |
| `--color-bg-alt` | Alternative background (section separation) |
| `--color-surface` | Cards, modals, dropdowns |
| `--color-surface-hover` | Hover state on surfaces |
| `--color-surface-active` | Active / selected state |
| `--color-border` | Borders and dividers |
| `--color-text-heading` | Headings, prominent text |
| `--color-text-body` | Body / paragraph text |
| `--color-text-muted` | Captions, placeholders, disabled |
| `--color-success` | Success indicator |
| `--color-warning` | Warning indicator |
| `--color-danger` | Error / danger indicator |
| `--color-sidebar-bg` | Sidebar background |
| `--color-sidebar-text` | Sidebar nav text |
| `--color-sidebar-text-active` | Active sidebar nav text |
| `--color-sidebar-hover` | Sidebar hover state |
| `--color-topnav-bg` | TopNav background |
| `--color-topnav-text` | TopNav text |
| `--color-topnav-text-muted` | TopNav inactive/secondary text |
| `--color-topnav-border` | TopNav bottom border |
| `--color-topnav-badge-bg` | TopNav badge background |
| `--color-topnav-badge-text` | TopNav badge text |
| `--color-ageing-*` | Invoice ageing chart segment colors |
| `--color-table-stripe` | Alternating table row background |

---

## Localisation

**Rules:**
- The Screen Renderer config declares `locale` (e.g. `'en-AU'`, `'en-US'`, `'fr-FR'`)
- The Screen Renderer passes `locale` to all widgets via React context — widgets never hardcode a locale
- All user-facing strings in widgets use a translation key, not hardcoded text: `t('orders.title')` not `'Recent Orders'`
- Translation files live in `src/i18n/<locale>.ts` as typed objects
- Domain objects that format output (e.g. `Money.format()`, date formatting) accept `locale` as a parameter or read it from context — never hardcode `'en-AU'`
- ACL mappers do NOT apply localisation — they produce raw domain objects; formatting happens at the widget/component layer

**Translation file structure:**
```
src/i18n/
  en-AU.ts
  en-US.ts
  index.ts    # exports all locales + typed key union
```

**Example — locale-aware domain method:**
```ts
// Money.ts
format(locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: this.currency }).format(this.amount);
}
```

**Example — widget using translation key:**
```tsx
const { t, locale } = useLocale(); // reads from Screen Renderer context
return <h2>{t('orders.recentOrders')}</h2>;
```

---

## TypeScript Conventions

- `strict: true` always enabled in `tsconfig.json`
- Type when it adds clarity or safety; skip when TypeScript can infer it trivially
- Use `class` for domain objects and screen configs (instantiable, testable)
- Use `interface` for structural contracts (e.g. `RenderableWidget`, `GridConfig`)
- No `any`. No `as` casts except inside ACL mappers
- Prefer named exports over default exports (widgets use default exports for dynamic loading)

---

## File Naming Conventions

| Pattern | Example |
|---|---|
| Component | `PascalCase.tsx` | `Button.tsx` |
| Widget root | `PascalCaseWidget.tsx` | `TopNavWidget.tsx` |
| Widget size variant | `PascalCase{Size}.tsx` | `TopNavLG.tsx`, `TopNavMD.tsx` |
| Data hook | `camelCase.ts` | `useTopNav.ts` |
| ACL mapper | `entity.mapper.ts` | `order.mapper.ts` |
| Screen config | `PascalCase.screen.ts` | `Dashboard.screen.ts` |
| Domain object | `PascalCase.ts` | `Order.ts` |

---

## Quick Checklist (Run Through This for Every PR)

- [ ] New UI element? → Is it small/stateless? → Component. Has data/business value? → Widget.
- [ ] Widget has `XS`, `SM`, `MD`, `LG` variants as separate files?
- [ ] Widget file naming follows `[FeatureName][Size].tsx` pattern?
- [ ] Widget has a `size` mapping per breakpoint in its Screen config entry?
- [ ] Widget grid entry declares both column (`col`, `colSpan`) and row (`row`, `rowSpan`)?
- [ ] Widgets sharing a row band have the same `rowSpan` so they align in height?
- [ ] Widget data hook uses ACL mapper — no raw API types leaking into the widget?
- [ ] New business concept? → Domain class created in `src/domain/`?
- [ ] New API integrated? → ACL mapper created in `src/acl/`?
- [ ] New page? → Screen config declared as a typed class with `theme`, `locale`, and `rowHeight` set?
- [ ] Shell-level grid with fixed-width regions? → Uses `columnTemplate`, not uniform `1fr` columns?
- [ ] Widgets use `width: '100%'` to fill their grid cell? → Grid controls dimensions, not the widget?
- [ ] Page has a swappable content area? → Declared as a `slot`, not a widget?
- [ ] Widget registered in `src/widgets/registry.ts`?
- [ ] No `any` types introduced?
- [ ] No hardcoded colors — only `var(--color-*)` in inline styles?
- [ ] No Tailwind utility classes in component/widget JSX?
- [ ] No hardcoded user-facing strings — translation keys used instead?
- [ ] No breakpoint detection inside widgets — `size` prop only?
- [ ] Also check the **app-layout** skill checklist for shell/navigation-specific items?

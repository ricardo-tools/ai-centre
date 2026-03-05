---
name: brand-design-system
description: Brand color palette, typography, logo, favicon, and design token reference for building any UI — light, dark, night, and legacy mode. Use this skill whenever creating frontend code, landing pages, dashboards, components, emails, or any visual interface. Trigger on any request involving UI creation, styling, theming, color usage, dark mode, night mode, legacy mode, OLED/AMOLED theme implementation, logo placement, favicon setup, document exports, or frontend design work, even if the user doesn't explicitly mention "brand colors." This skill should always be consulted before choosing colors, fonts, logos, or surface styles. When this skill is triggered for frontend code, the agent MUST also apply the `/frontend-design` skill from the Claude Code skill library to ensure high design quality (typography, color, motion, spatial composition).
---

# Brand Design System

> **Required companion skill:** When building any frontend code, you MUST also apply the **`/frontend-design`** skill from the Claude Code skill library. This brand design system defines *brand tokens and theming rules*; the `/frontend-design` skill ensures high design quality — polished typography, cohesive color usage, motion/micro-interactions, and spatial composition. Both skills must be followed together for any UI work.

This is the single source of truth for our visual identity across light, dark, night, and legacy mode. Every UI you build should pull tokens from here — never invent colors or pick arbitrary greys.

## Mood & Feel

The overall look and feel across all themes must be **clean and modern**. This means:

- **Generous whitespace** — let content breathe. Avoid cramming elements together.
- **Minimal visual noise** — no gratuitous borders, shadows, or decorations. Every visual element should earn its place.
- **Crisp typography** — clear hierarchy through weight and size, not through color overload or excessive styling.
- **Subtle depth** — use elevation (surface levels) and soft transitions rather than heavy drop shadows or outlines.
- **Restrained color** — accent colors (orange, blue) appear sparingly and purposefully. The majority of the UI is neutral surfaces and text.
- **Smooth interactions** — micro-transitions on hover/focus/active states. Nothing should feel abrupt or static.
- **Consistent spatial rhythm** — use a base spacing unit and stick to it. Gaps between sibling elements should use the same value; don't mix 12px, 8px, and 4px arbitrarily. Group related items tighter, separate groups wider.

Think: Linear, Vercel, Stripe, Notion — functional beauty, not decorative excess.

### Mood Over Brand Saturation

**The clean, modern, minimalist aesthetic always takes priority over using all brand colors.** A page that is 90% neutral surfaces with a single orange CTA is better than a page that forces orange and blue into every section for the sake of "brand presence."

Rules:
- **Neutral first.** Surfaces, text, and structural elements should use neutral tokens (`--color-bg`, `--color-surface`, `--color-text-body`, `--color-border`). Let the content and layout do the talking.
- **Accent colors are punctuation, not prose.** Use orange for the one thing you want users to click. Use blue sparingly for secondary actions and links. If a component doesn't need accent color, don't add it.
- **Never force brand colors.** If a section looks better with neutral tones and whitespace, leave it neutral. A clean, breathable layout is more on-brand than a colorful, busy one.
- **Illustrations and media carry visual interest.** Use assets from the design system libraries (unDraw, Humaaans, Unsplash, Pexels, Mixkit, Rive) to add warmth and personality — this reduces the need to lean on accent colors for visual engagement.
- **Test the squint test.** Blur your eyes or zoom to 25%. If you see large blocks of orange or blue, you've over-applied brand color. You should see mostly neutral space with small pops of accent.

## Font

**Jost** is the brand typeface. Use it for everything — headings, body, UI labels, buttons.

```
font-family: 'Jost', sans-serif;
```

Import via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@350;400;500;600;700;800&display=swap" rel="stylesheet">
```

Weight usage:
- 350 — Descriptions, secondary body text, meta captions
- 400 — Default body text
- 500 — Nav links, labels, meta text
- 600 — Buttons, tags, emphasis
- 700 — Headings, card titles
- 800 — Hero headings, logo text

---

## Icons

**Phosphor Icons** is the standard icon library. Use it for all UI icons — navigation, actions, status indicators, decorative elements.

Homepage: https://phosphoricons.com

### Installation

Use the web components package for framework-agnostic usage:

```html
<script src="https://unpkg.com/@phosphor-icons/web"></script>
```

Or install for React / Vue / other frameworks:

```bash
# React
npm install @phosphor-icons/react

# Vue
npm install @phosphor-icons/vue

# Web components (vanilla JS, any framework)
npm install @phosphor-icons/web
```

### Weight Mapping

Phosphor provides 6 weights. Map them to the font weight system for visual consistency:

| Phosphor Weight | Use Case | Pairs With Font Weight |
|---|---|---|
| `thin` | Decorative, large display icons (48px+) | 350 (descriptions) |
| `light` | Secondary UI, muted contexts, empty states | 400 (body) |
| `regular` | **Default** — nav items, labels, buttons, general UI | 500–600 (labels, buttons) |
| `bold` | Emphasis, active states, headings | 700 (headings) |
| `fill` | Active/selected states, primary actions, status dots | — |
| `duotone` | Illustrations, onboarding, feature highlights | — |

**Default to `regular` weight.** Only deviate when the context demands it.

### Usage Examples

```tsx
// React
import { MagnifyingGlass, Bell, Gear, CaretDown } from '@phosphor-icons/react';

<MagnifyingGlass size={20} weight="regular" />
<Bell size={20} weight="fill" />         {/* Active notification */}
<Bell size={20} weight="regular" />      {/* No notifications */}
<Gear size={20} weight="regular" />
```

```html
<!-- Web component -->
<ph-magnifying-glass size="20"></ph-magnifying-glass>
<ph-bell size="20" weight="fill"></ph-bell>
<ph-gear size="20"></ph-gear>
```

### Sizing

Icons should scale with the text and spacing system:

| Context | Icon Size | Example |
|---|---|---|
| Inline with body text | 16px | Paragraph icons, inline labels |
| Buttons & nav items | 20px | Sidebar links, toolbar actions |
| Section headers | 24px | Card headers, panel titles |
| Empty states / features | 32–48px | Onboarding, empty list illustrations |
| Hero / decorative | 48–64px | Landing page feature icons |

### Color

Icons inherit `currentColor` by default — no need to set color explicitly in most cases. When you need a specific color, use semantic tokens:

```tsx
// Inherits parent text color (preferred)
<MagnifyingGlass size={20} />

// Explicit color via semantic token
<Bell size={20} color="var(--color-primary)" />
<CheckCircle size={20} color="var(--color-success)" />
<Warning size={20} color="var(--color-warning)" />
<XCircle size={20} color="var(--color-danger)" />
```

### Icon Rules

1. **One weight per context.** Don't mix `regular` and `bold` icons in the same toolbar or nav. Exception: `fill` for active states alongside `regular` for inactive.
2. **Never mix Phosphor with other icon libraries.** All icons must come from Phosphor for visual consistency.
3. **Use `fill` vs `regular` for state.** Toggle between filled and regular weight to indicate active/inactive (e.g. filled star = favorited, regular star = not favorited).
4. **Match icon optical size to text.** Icons next to 14px text should be 16px. Icons next to 16px text should be 20px. Slightly larger than the text prevents icons from looking smaller due to their bounded shape.
5. **Align icons with text baseline.** Use `vertical-align: middle` or flexbox centering — never let icons float above or below adjacent text.

### Theme Switcher Icons

Replace the emoji-based theme labels with Phosphor icons:

| Theme | Icon | Component |
|---|---|---|
| Light | `Sun` | `<Sun weight="regular" />` |
| Dark | `Moon` | `<Moon weight="regular" />` |
| Night | `MonitorPlay` | `<MonitorPlay weight="regular" />` |
| Legacy | `ClockCounterClockwise` | `<ClockCounterClockwise weight="regular" />` |

---

## Logo & Favicon

### Logo Assets

| Variant | Mode | URL |
|---|---|---|
| Rectangle (primary) — Color | Light mode | `https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/rectangle_logo_orange_ezycollect_by_sidetrade.png` |
| Rectangle (primary) — White | Dark mode | `https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/rectangle_logo_white_ezycollect_by_sidetrade.png` |
| Square — Color | Light mode | `https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/square_logo_orange_ezycollect_by_sidetrade.png` |
| Square — White | Dark mode | `https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/square_logo_white_ezycollect_by_sidetrade.svg` |

### Logo Usage Rules

1. **Default to the rectangle logo.** Use the rectangular (primary) variant whenever possible — it is the standard logo for headers, navbars, footers, hero sections, and general branding.
2. **Use the square logo when space is constrained** — e.g. when a square aspect ratio is required, in compact layouts, sidebar icons, or app-icon-style placements.
3. **Color mode pairing:**
   - Light mode / light backgrounds → **Color** variant (orange logo)
   - Dark mode / dark backgrounds → **White** variant
   - Night mode / black backgrounds → **White** variant
   - Legacy mode / white navbar → **Color** variant (orange logo)
4. **Never modify the logo** — no recoloring, stretching, adding effects, or placing on low-contrast backgrounds.

### Logo Switching (CSS)

Both logo variants are rendered in the DOM; CSS toggles visibility based on the active theme. Use the class names `.logo-color` and `.logo-white`:

```css
.logo-color { display: block; }
.logo-white { display: none; }

[data-theme="dark"] .logo-color,
[data-theme="night"] .logo-color { display: none; }

[data-theme="dark"] .logo-white,
[data-theme="night"] .logo-white { display: block; }
```

Light and legacy themes show the color logo (default). Dark and night themes show the white logo.

### Logo Sizing by Viewport

| Viewport | Logo Height | Navbar Height |
|---|---|---|
| LG (desktop) | 32px | 56px |
| MD (tablet) | 32px | 52px |
| SM / XS (mobile) | 26px | 52px |

### Favicon

Use the **square logo** as the favicon:
- Light mode → Square Color variant
- Dark mode → Square White variant

When implementing favicons in HTML, use both variants with `prefers-color-scheme`:

```html
<link rel="icon" href="https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/square_logo_orange_ezycollect_by_sidetrade.png" media="(prefers-color-scheme: light)">
<link rel="icon" href="https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/square_logo_white_ezycollect_by_sidetrade.svg" media="(prefers-color-scheme: dark)">
```

### Offline / Export Usage

When building features that produce **downloadable files, exports, PDFs, Word documents, presentations, or any output that will not be rendered in a browser where the hosted URLs are directly accessible**, you **must download the logo files from the URLs above** and embed them into the output. Do not reference the URLs as remote image sources in exported documents — they will break when opened offline.

Workflow for exports:
1. Determine which logo variant is needed (rectangle vs square, color vs white)
2. Download the asset from the corresponding URL
3. Embed the downloaded image directly into the document/export

---

## Color Tokens

### Light Mode

| Token | Hex | Role |
|---|---|---|
| `--lm-orange` | `#FF5A28` | Primary CTA, highlights, graphic accents |
| `--lm-light-orange` | `#FFF2EB` | Warm background sections, tag backgrounds |
| `--lm-electric-blue` | `#1462D2` | Secondary CTA, links, charts |
| `--lm-brand-blue` | `#1F2B7A` | Logo, brand panels, overlays |
| `--lm-midnight-blue` | `#121948` | Headings, accent text, footers |
| `--lm-neutral-text` | `#333333` | Main body text, paragraphs, descriptions |
| `--lm-white` | `#FFFFFF` | Main background |
| `--lm-light-blue` | `#EBEBF3` | Soft background, section separation |

### Dark Mode

| Token | Hex | Role |
|---|---|---|
| `--dm-orange` | `#FF5A28` | Primary CTA (shared with light mode) |
| `--dm-orange-muted` | `#33200F` | Warm background zones, tags, toasts (replaces Light Orange) |
| `--dm-electric-blue` | `#4D8EF7` | Secondary CTA, links, interactive elements (lifted for dark contrast) |
| `--dm-brand-blue` | `#5A6BD4` | Logo on dark, decorative brand use (lifted for dark contrast) |
| `--dm-surface-0` | `#0C0F24` | Page background (base) |
| `--dm-surface-1` | `#131733` | Cards, modals, dropdowns |
| `--dm-surface-2` | `#1A2044` | Hover states, inputs, nested containers |
| `--dm-surface-3` | `#232A56` | Active states, selected items, tooltips |
| `--dm-border` | `#2A3168` | Card borders, dividers, separators |
| `--dm-text-primary` | `#E8EAF6` | Headings, body text (off-white with blue undertone) |
| `--dm-text-secondary` | `#9CA3C9` | Descriptions, meta text, supporting copy |
| `--dm-text-muted` | `#8089B5` | Placeholders, disabled states, captions |

### Night Mode

Pure neutral dark surfaces modeled on **YouTube / Google dark mode**. Unlike dark mode's blue-tinted surfaces, night mode uses true neutral greys anchored on `#0F0F0F` — the same near-black background YouTube uses. This makes the two dark modes feel distinct: dark mode carries the brand's blue personality, while night mode is a neutral, content-first theme that lets accent colors pop. Night mode shares the same primary orange (`#FF5A28`) as light and dark mode, and uses YouTube's `#3EA6FF` blue accent for links and interactive elements.

| Token | Hex | Role |
|---|---|---|
| `--nm-orange` | `#FF5A28` | Primary CTA (same as light/dark — passes AA on night surfaces) |
| `--nm-orange-muted` | `#261A10` | Subtle dark background for tags, toasts, callouts |
| `--nm-electric-blue` | `#3EA6FF` | Secondary CTA, links, interactive elements (YouTube blue) |
| `--nm-brand-blue` | `#8AB4F8` | Logo on night, decorative brand use (Google blue) |
| `--nm-surface-0` | `#0F0F0F` | Page background (YouTube main bg) |
| `--nm-surface-1` | `#212121` | Cards, modals, dropdowns (YouTube card surface) |
| `--nm-surface-2` | `#272727` | Hover states, inputs, nested containers |
| `--nm-surface-3` | `#3A3A3A` | Active states, selected items, tooltips |
| `--nm-border` | `#3F3F3F` | Card borders, dividers, separators |
| `--nm-text-primary` | `#F1F1F1` | Headings, body text (YouTube primary text) |
| `--nm-text-secondary` | `#AAAAAA` | Descriptions, meta text, supporting copy |
| `--nm-text-muted` | `#717171` | Placeholders, disabled states, captions |

### Legacy Mode

Pixel-perfect recreation of the original ezyCollect app. Legacy mode does NOT use the `:root` palette tokens — it uses hardcoded hex values extracted directly from the original `app.html` CSS. This ensures an exact visual match regardless of any future changes to the modern palette.

**Key differences from modern themes:**
- Orange is `#FF6600` (the original), not `#FF5A28` (the refreshed brand orange)
- Secondary/link color is `#169dd6` (cyan-blue), not `#1462D2`
- Sidebar is `#272930` (dark charcoal), not `#121948` (midnight navy)
- Navbar is white with `#e6e6e6` borders — not orange, not themed
- Body text is `#666666` (lighter grey), not `#333333`
- Success is CSS keyword green `#008000`, danger is `#C40000`
- Warning reuses the primary orange `#FF6600`
- Ageing chart colors are the original ApexCharts fills (vivid, non-Tailwind)

| Semantic Token | Hex | Source |
|---|---|---|
| `--color-primary` | `#FF6600` | `.btn-primary`, `.ezy-button-orange` |
| `--color-primary-hover` | `#cc5200` | `.btn-primary:hover` |
| `--color-primary-muted` | `#fff5eb` | derived |
| `--color-secondary` | `#169dd6` | `#ezy-top .link`, `.btn-accent` |
| `--color-brand` | `#2494F2` | `.ezy-sidebar .active border-left` |
| `--color-bg` | `#F1F1F1` | `#pcont` background |
| `--color-bg-alt` | `#e6e6e6` | derived from border color |
| `--color-surface` | `#FFFFFF` | card/panel backgrounds |
| `--color-border` | `#e6e6e6` | ubiquitous border value |
| `--color-text-heading` | `#333333` | headings |
| `--color-text-body` | `#666666` | body paragraphs |
| `--color-text-muted` | `#999999` | secondary text |
| `--color-success` | `#008000` | CSS `green` keyword |
| `--color-danger` | `#C40000` | `.btn-danger` |
| `--color-warning` | `#FF6600` | same as primary (original had no separate warning) |
| `--color-sidebar-bg` | `#272930` | `.cl-sidebar` |
| `--color-sidebar-text` | `#c9d4f6` | sidebar link text |
| `--color-sidebar-hover` | `#2A2C34` | sidebar item hover |
| `--color-topnav-bg` | `#FFFFFF` | `#ezy-top` background |
| `--color-topnav-text` | `#333333` | nav text |
| `--color-topnav-text-muted` | `#169dd6` | nav link color (cyan-blue) |
| `--color-topnav-badge-bg` | `#169dd6` | `.btn-accent` badges |
| `--color-topnav-badge-text` | `#FFFFFF` | white text on cyan badges |
| `--color-ageing-current` | `#00FF66` | ApexCharts SVG fill |
| `--color-ageing-1-30` | `#0099FF` | ApexCharts SVG fill |
| `--color-ageing-31-60` | `#6600FF` | ApexCharts SVG fill (purple) |
| `--color-ageing-61-90` | `#FFE600` | ApexCharts SVG fill (yellow) |
| `--color-ageing-91-120` | `#FF6600` | ApexCharts SVG fill (orange) |
| `--color-ageing-120-plus` | `#FF001A` | ApexCharts SVG fill (red) |

---

## CSS Variables (copy-paste ready)

### Raw Palette Tokens (`:root`)

```css
:root {
  /* Light Mode */
  --lm-orange: #FF5A28;
  --lm-light-orange: #FFF2EB;
  --lm-electric-blue: #1462D2;
  --lm-brand-blue: #1F2B7A;
  --lm-midnight-blue: #121948;
  --lm-white: #FFFFFF;
  --lm-light-blue: #EBEBF3;
  --lm-neutral-text: #333333;

  /* Dark Mode */
  --dm-orange: #FF5A28;
  --dm-orange-muted: #33200F;
  --dm-electric-blue: #4D8EF7;
  --dm-brand-blue: #5A6BD4;
  --dm-surface-0: #0C0F24;
  --dm-surface-1: #131733;
  --dm-surface-2: #1A2044;
  --dm-surface-3: #232A56;
  --dm-border: #2A3168;
  --dm-text-primary: #E8EAF6;
  --dm-text-secondary: #9CA3C9;
  --dm-text-muted: #8089B5;

  /* Night Mode (YouTube / Google dark) */
  --nm-orange: #FF5A28;
  --nm-orange-muted: #261A10;
  --nm-electric-blue: #3EA6FF;
  --nm-brand-blue: #8AB4F8;
  --nm-surface-0: #0F0F0F;
  --nm-surface-1: #212121;
  --nm-surface-2: #272727;
  --nm-surface-3: #3A3A3A;
  --nm-border: #3F3F3F;
  --nm-text-primary: #F1F1F1;
  --nm-text-secondary: #AAAAAA;
  --nm-text-muted: #717171;
}
```

### Tailwind Palette

The project imports `tailwind-palette.css` which provides 242 CSS custom properties (`--tw-{color}-{shade}`) for every Tailwind color. These are available for use in semantic tokens — particularly useful for data visualization (ageing charts, status indicators) where you need a broader palette than the brand colors provide.

Usage pattern: reference `--tw-*` vars inside semantic token definitions, never directly in components.

```css
/* Example — ageing colors in light theme reference Tailwind palette */
--color-ageing-current: var(--tw-emerald-500);
--color-ageing-1-30: var(--tw-blue-500);
```

---

## Semantic Tokens — Complete Reference

Components **only ever** reference these `--color-*` semantic variables. Each `[data-theme]` block maps them to the appropriate palette values. The table below lists every semantic token in the system.

### Core Tokens

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

### Status Tokens

| Semantic Variable | Role |
|---|---|
| `--color-success` | Success states, active indicators |
| `--color-success-muted` | Success background (tags, banners) |
| `--color-warning` | Warning states |
| `--color-warning-muted` | Warning background |
| `--color-danger` | Error / danger states |
| `--color-danger-muted` | Error background |

### Sidebar Tokens

| Semantic Variable | Role |
|---|---|
| `--color-sidebar-bg` | Sidebar background |
| `--color-sidebar-text` | Sidebar nav item text |
| `--color-sidebar-text-active` | Active nav item text |
| `--color-sidebar-hover` | Nav item hover background |
| `--color-sidebar-section` | Section header / divider background |

### Top Navigation Tokens

| Semantic Variable | Role |
|---|---|
| `--color-topnav-bg` | Navbar background |
| `--color-topnav-text` | Navbar text (active tabs, headings) |
| `--color-topnav-text-muted` | Navbar secondary text (inactive tabs) |
| `--color-topnav-border` | Navbar bottom border |
| `--color-topnav-badge-bg` | Status badge background |
| `--color-topnav-badge-text` | Status badge text |

### Data Visualization Tokens

| Semantic Variable | Role |
|---|---|
| `--color-ageing-current` | Invoice ageing: Current |
| `--color-ageing-1-30` | Invoice ageing: 1–30 days |
| `--color-ageing-31-60` | Invoice ageing: 31–60 days |
| `--color-ageing-61-90` | Invoice ageing: 61–90 days |
| `--color-ageing-91-120` | Invoice ageing: 91–120 days |
| `--color-ageing-120-plus` | Invoice ageing: 120+ days |
| `--color-table-stripe` | Alternating table row background |

---

## Complete Semantic Token Mapping (all four themes)

```css
[data-theme="light"] {
  --color-primary: var(--lm-orange);
  --color-primary-hover: #E8491C;
  --color-primary-muted: var(--lm-light-orange);
  --color-secondary: var(--lm-electric-blue);
  --color-brand: var(--lm-brand-blue);
  --color-bg: var(--lm-white);
  --color-bg-alt: var(--lm-light-blue);
  --color-surface: var(--lm-white);
  --color-surface-hover: var(--lm-light-blue);
  --color-surface-active: #DADBE6;
  --color-border: #DADBE6;
  --color-text-heading: var(--lm-midnight-blue);
  --color-text-body: var(--lm-neutral-text);
  --color-text-muted: #6B7280;
  --color-success: #10B981;
  --color-success-muted: #D1FAE5;
  --color-warning: #F59E0B;
  --color-warning-muted: #FEF3C7;
  --color-danger: #EF4444;
  --color-danger-muted: #FEE2E2;
  --color-sidebar-bg: var(--lm-midnight-blue);
  --color-sidebar-text: #C7C9E0;
  --color-sidebar-text-active: #FFFFFF;
  --color-sidebar-hover: rgba(255, 255, 255, 0.08);
  --color-sidebar-section: rgba(255, 255, 255, 0.04);
  --color-table-stripe: rgba(0, 0, 0, 0.025);
  --color-topnav-bg: var(--lm-white);
  --color-topnav-text: var(--lm-midnight-blue);
  --color-topnav-text-muted: #6B7280;
  --color-topnav-border: #DADBE6;
  --color-topnav-badge-bg: var(--lm-light-blue);
  --color-topnav-badge-text: var(--lm-neutral-text);
  --color-ageing-current: var(--tw-emerald-500);
  --color-ageing-1-30: var(--tw-blue-500);
  --color-ageing-31-60: var(--tw-amber-500);
  --color-ageing-61-90: var(--tw-orange-500);
  --color-ageing-91-120: var(--tw-red-500);
  --color-ageing-120-plus: var(--tw-violet-600);
}

[data-theme="dark"] {
  --color-primary: var(--dm-orange);
  --color-primary-hover: #FF7A52;
  --color-primary-muted: var(--dm-orange-muted);
  --color-secondary: var(--dm-electric-blue);
  --color-brand: var(--dm-brand-blue);
  --color-bg: var(--dm-surface-0);
  --color-bg-alt: var(--dm-surface-1);
  --color-surface: var(--dm-surface-1);
  --color-surface-hover: var(--dm-surface-2);
  --color-surface-active: var(--dm-surface-3);
  --color-border: var(--dm-border);
  --color-text-heading: var(--dm-text-primary);
  --color-text-body: var(--dm-text-secondary);
  --color-text-muted: var(--dm-text-muted);
  --color-success: #34D399;
  --color-success-muted: #064E3B;
  --color-warning: #FBBF24;
  --color-warning-muted: #78350F;
  --color-danger: #F87171;
  --color-danger-muted: #7F1D1D;
  --color-sidebar-bg: var(--dm-surface-0);
  --color-sidebar-text: var(--dm-text-secondary);
  --color-sidebar-text-active: var(--dm-text-primary);
  --color-sidebar-hover: var(--dm-surface-2);
  --color-sidebar-section: var(--dm-surface-0);
  --color-table-stripe: var(--dm-surface-2);
  --color-topnav-bg: var(--dm-surface-1);
  --color-topnav-text: var(--dm-text-primary);
  --color-topnav-text-muted: var(--dm-text-muted);
  --color-topnav-border: var(--dm-border);
  --color-topnav-badge-bg: var(--dm-surface-2);
  --color-topnav-badge-text: var(--dm-text-secondary);
  --color-ageing-current: var(--tw-emerald-400);
  --color-ageing-1-30: var(--tw-blue-400);
  --color-ageing-31-60: var(--tw-amber-400);
  --color-ageing-61-90: var(--tw-orange-400);
  --color-ageing-91-120: var(--tw-red-400);
  --color-ageing-120-plus: var(--tw-violet-400);
}

[data-theme="night"] {
  --color-primary: var(--nm-orange);
  --color-primary-hover: #E8491C;
  --color-primary-muted: var(--nm-orange-muted);
  --color-secondary: var(--nm-electric-blue);
  --color-brand: var(--nm-brand-blue);
  --color-bg: var(--nm-surface-0);
  --color-bg-alt: var(--nm-surface-1);
  --color-surface: var(--nm-surface-1);
  --color-surface-hover: var(--nm-surface-2);
  --color-surface-active: var(--nm-surface-3);
  --color-border: var(--nm-border);
  --color-text-heading: var(--nm-text-primary);
  --color-text-body: var(--nm-text-secondary);
  --color-text-muted: var(--nm-text-muted);
  --color-success: #34D399;
  --color-success-muted: #064E3B;
  --color-warning: #FBBF24;
  --color-warning-muted: #78350F;
  --color-danger: #F87171;
  --color-danger-muted: #7F1D1D;
  --color-sidebar-bg: var(--nm-surface-0);
  --color-sidebar-text: var(--nm-text-secondary);
  --color-sidebar-text-active: var(--nm-text-primary);
  --color-sidebar-hover: var(--nm-surface-2);
  --color-sidebar-section: var(--nm-surface-0);
  --color-table-stripe: var(--nm-surface-2);
  --color-topnav-bg: var(--nm-surface-1);
  --color-topnav-text: var(--nm-text-primary);
  --color-topnav-text-muted: var(--nm-text-muted);
  --color-topnav-border: var(--nm-border);
  --color-topnav-badge-bg: var(--nm-surface-2);
  --color-topnav-badge-text: var(--nm-text-secondary);
  --color-ageing-current: var(--tw-emerald-400);
  --color-ageing-1-30: var(--tw-sky-400);
  --color-ageing-31-60: var(--tw-amber-400);
  --color-ageing-61-90: var(--tw-orange-400);
  --color-ageing-91-120: var(--tw-red-400);
  --color-ageing-120-plus: var(--tw-violet-400);
}

/* Legacy — pixel-perfect match to original ezyCollect app.html CSS */
[data-theme="legacy"] {
  --color-primary: #FF6600;
  --color-primary-hover: #cc5200;
  --color-primary-muted: #fff5eb;
  --color-secondary: #169dd6;
  --color-brand: #2494F2;
  --color-bg: #F1F1F1;
  --color-bg-alt: #e6e6e6;
  --color-surface: #FFFFFF;
  --color-surface-hover: #f7f7f7;
  --color-surface-active: #e6e6e6;
  --color-border: #e6e6e6;
  --color-text-heading: #333333;
  --color-text-body: #666666;
  --color-text-muted: #999999;
  --color-success: #008000;
  --color-success-muted: #e6f5e6;
  --color-warning: #FF6600;
  --color-warning-muted: #fff5eb;
  --color-danger: #C40000;
  --color-danger-muted: #fce8e8;
  --color-sidebar-bg: #272930;
  --color-sidebar-text: #c9d4f6;
  --color-sidebar-text-active: #FFFFFF;
  --color-sidebar-hover: #2A2C34;
  --color-sidebar-section: #1e2025;
  --color-table-stripe: rgba(0, 0, 0, 0.03);
  --color-topnav-bg: #FFFFFF;
  --color-topnav-text: #333333;
  --color-topnav-text-muted: #169dd6;
  --color-topnav-border: #e6e6e6;
  --color-topnav-badge-bg: #169dd6;
  --color-topnav-badge-text: #FFFFFF;
  --color-ageing-current: #00FF66;
  --color-ageing-1-30: #0099FF;
  --color-ageing-31-60: #6600FF;
  --color-ageing-61-90: #FFE600;
  --color-ageing-91-120: #FF6600;
  --color-ageing-120-plus: #FF001A;
}
```

---

## Light ↔ Dark ↔ Night Mapping

This is how light-mode roles translate to dark-mode and night-mode tokens:

| Light Mode | Dark Mode | Night Mode | Notes |
|---|---|---|---|
| `--lm-orange` | `--dm-orange` | `--nm-orange` | Same `#FF5A28` across all three modes |
| `--lm-light-orange` | `--dm-orange-muted` | `--nm-orange-muted` | `#261A10` — subtle dark orange tint |
| `--lm-electric-blue` | `--dm-electric-blue` | `--nm-electric-blue` | `#3EA6FF` — YouTube blue accent |
| `--lm-brand-blue` | `--dm-brand-blue` | `--nm-brand-blue` | `#8AB4F8` — Google blue for decoration |
| `--lm-white` (background) | `--dm-surface-0` | `--nm-surface-0` | `#0F0F0F` — YouTube near-black |
| `--lm-light-blue` (background) | `--dm-surface-1` | `--nm-surface-1` | `#212121` — YouTube card surface |
| `--lm-midnight-blue` (headings) | `--dm-text-primary` | `--nm-text-primary` | `#F1F1F1` — YouTube primary text |
| `--lm-neutral-text` (body) | `--dm-text-secondary` | `--nm-text-secondary` | `#AAAAAA` — YouTube secondary text |

---

## Usage Rules

### Hierarchy (applies to all modes)
1. **Orange** — Primary CTA, high-emphasis elements only. Use sparingly for maximum impact.
2. **Electric Blue** — Secondary CTA, links, charts. The workhorse interactive color.
3. **Text colors** — In light mode, use Midnight Blue for headings/accent and Neutral Text (`#333333`) for body copy. In dark and night modes, use the 3-tier text system (primary → secondary → muted).
4. **Background tones** — Anchor layouts with neutral surfaces; use warm tones (light-orange / orange-muted) for highlighted sections.

### Do's
- Use Orange for primary buttons, key links, and important highlights
- Use Electric Blue for secondary buttons, links, and chart/data elements
- Use the surface elevation ladder in dark and night modes (surface-0 → 1 → 2 → 3) to communicate depth
- Pair Orange CTAs against white, light-blue, or dark/night surfaces for maximum contrast
- Use `--dm-orange-muted` / `--nm-orange-muted` / `--lm-light-orange` as subtle background fills behind tags, toasts, and callouts

### Don'ts
- Never put Orange text on Orange-Muted backgrounds without checking contrast
- Never use more than 2 accent colors (orange + blue) in a single component
- Never use raw white (`#FFFFFF`) as text in dark or night mode — use `--dm-text-primary` / `--nm-text-primary`
- Never skip surface levels in dark or night mode (e.g., don't place surface-3 directly on surface-0 without reason)
- Avoid using Electric Blue and Orange side-by-side at equal visual weight — one should dominate
- In night mode, avoid surface colors from dark mode — the blue-tinted tones will clash with night mode's neutral grey surfaces

### Component Patterns

**Buttons:**
- Primary → Orange background, white text (all modes). Night mode uses `--nm-orange`.
- Secondary → Transparent background, Electric Blue text + border (all modes)
- Primary hover (dark) → `#FF7A52` | Primary hover (light) → `#E8491C` | Primary hover (night) → `#E8491C`

**Cards:**
- Light: White background, `#DADBE6` border
- Dark: Surface-1 background, `--dm-border` border
- Night: Surface-1 background, `--nm-border` border

**Inputs:**
- Light: White background, `#DADBE6` border, Midnight Blue text
- Dark: Surface-1 background, `--dm-border` border, Text Primary
- Night: Surface-1 background, `--nm-border` border, `--nm-text-primary`
- Focus state: Electric Blue border (all modes — use mode-appropriate Electric Blue token)

**Tags / Badges:**
- Light: Light Orange background, Orange text
- Dark: Orange Muted background, Orange text
- Night: `--nm-orange-muted` background, `--nm-orange` text

**Toasts / Alerts:**
- Use translucent accent backgrounds: `rgba(color, 0.10–0.15)` with matching text
- Include a small colored dot as a status indicator

**Navigation:**
- Light: White background, `#DADBE6` bottom border
- Dark: Surface-1 background, `--dm-border` bottom border
- Night: Surface-1 background, `--nm-border` bottom border
- Legacy: White background, `#e6e6e6` bottom border
- CTA button in nav always uses Orange (mode-appropriate token)
- Logo placement: Rectangle Color logo (light & legacy) / Rectangle White logo (dark & night)

---

## Theming Implementation Guide

**By default, implement only the Light and Night themes.** Dark and Legacy are available in the design system but should only be implemented when explicitly requested. Do not hard-code a single theme — always use the semantic variable architecture below so additional themes can be added later without refactoring.

> **Why Light + Night?** Light is the default brand-forward theme. Night (YouTube/Google neutral greys) covers the dark-mode need with a content-first, universally familiar feel. Dark (blue-tinted) and Legacy (original ezyCollect recreation) serve niche use cases and can be layered in on request.

### Architecture: Semantic CSS Variables

Instead of referencing mode-prefixed tokens (`--lm-orange`, `--dm-orange`, `--nm-orange`) directly in component styles, map them to **semantic variables** that describe their role. Components only ever reference semantic variables — the theme layer handles the mapping.

See the "Complete Semantic Token Mapping" section above for the full CSS.

### Theme Switcher (JavaScript)

Include a theme switcher in every UI. The recommended pattern:

```js
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ezycollect-theme', theme);
}

// On load: respect saved preference → OS preference → default to light
function initTheme() {
  const saved = localStorage.getItem('ezycollect-theme');
  if (saved) return setTheme(saved);
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return setTheme('night');
  setTheme('light');
}
```

### Theme Switcher UI

By default, provide a **2-way** toggle (Light / Night). When Dark and/or Legacy themes are requested, expand to a 3-way or 4-way segmented control. Place it in:
- Settings/preferences page (always)
- Navbar or header (recommended for quick access)
- Default icons: `<Sun />` Light, `<MonitorPlay />` Night
- Extended icons (when requested): `<Moon />` Dark, `<ClockCounterClockwise />` Legacy

### Component Styling Rules

When writing component CSS/styles, **always use semantic variables**:

```tsx
// ✅ CORRECT — theme-aware, uses inline styles with CSS variables
<div style={{
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  color: 'var(--color-text-body)',
}}>

// ❌ WRONG — hard-coded to one mode
<div style={{
  background: '#FFFFFF',
  border: '1px solid #DADBE6',
  color: '#333333',
}}>
```

### Checklist for Themed UIs

Before delivering any UI, verify:
1. ✅ `data-theme` attribute is set on `<html>` or root element
2. ✅ At minimum, `[data-theme="light"]` and `[data-theme="night"]` blocks define semantic variables (add `dark` and `legacy` only if requested)
3. ✅ No hard-coded color values in component styles — only `var(--color-*)` references
4. ✅ Theme switcher is present and persists the user's choice (Light/Night by default; expand when additional themes are requested)
5. ✅ Logo swaps correctly: color logo (light & legacy) / white logo (dark & night)
6. ✅ Favicon respects `prefers-color-scheme` for light/dark (night uses dark favicon)
7. ✅ Tested visually in all implemented themes before delivery

---

## Contrast Reference (Dark Mode)

All key pairings pass WCAG AA:

| Pairing | Ratio |
|---|---|
| Text Primary on Surface 0 | ~14.5:1 ✓ |
| Text Primary on Surface 1 | ~12.2:1 ✓ |
| Text Secondary on Surface 0 | ~7.0:1 ✓ |
| Orange on Surface 0 | ~5.1:1 ✓ |
| Electric Blue on Surface 0 | ~4.8:1 ✓ |
| Text Muted on Surface 1 | ~4.7:1 ✓ |

## Contrast Reference (Night Mode)

All key pairings pass WCAG AA (YouTube/Google neutral surfaces):

| Pairing | Ratio |
|---|---|
| Text Primary (`#F1F1F1`) on Surface 0 (`#0F0F0F`) | ~18.3:1 ✓ |
| Text Primary on Surface 1 (`#212121`) | ~12.1:1 ✓ |
| Text Secondary (`#AAAAAA`) on Surface 0 | ~8.3:1 ✓ |
| Orange (`#FF5A28`) on Surface 0 | ~5.7:1 ✓ |
| Electric Blue (`#3EA6FF`) on Surface 0 | ~7.9:1 ✓ |
| Text Muted (`#717171`) on Surface 1 | ~3.5:1 ✓ (AA-large, use for 18px+ only) |

### When to use each theme
- **Light mode** is the default theme — clean, professional, brand-forward.
- **Dark mode** is the primary dark theme — blue-tinted surfaces carry the brand identity and feel polished in general use.
- **Night mode** uses YouTube/Google's pure neutral greys (anchored on `#0F0F0F`) — it's content-first, reduces visual noise, and feels familiar to anyone who uses YouTube or Google in dark mode. Best for low-light environments and OLED/AMOLED screens.
- **Legacy mode** is a pixel-perfect recreation of the original ezyCollect app — useful for users familiar with the old UI or for reference comparison. It uses its own color palette (`#FF6600` orange, `#272930` sidebar, `#169dd6` cyan links) that does not inherit from the modern `:root` tokens.
- When offering a theme selector, present Light and Night by default. Add Dark and/or Legacy only when explicitly requested.

---

## Asset Libraries

The following libraries provide visual assets (illustrations, photos, video, animations) for use across apps and websites. **Assets are a primary tool for creating visual interest and warmth** — they reduce the need to lean on brand accent colors. A page with a well-chosen illustration or photo on a neutral background is more on-brand than a page saturated with orange and blue.

When building any UI, actively look for opportunities to use assets from these libraries: empty states, hero sections, feature showcases, onboarding flows, error pages, loading states, and marketing pages.

---

## Illustrations & Vectors

Two libraries cover all illustration needs: **unDraw** for concept/scene illustrations and **Humaaans** for people/character illustrations.

### unDraw (Primary — Scenes & Concepts)

Homepage: https://undraw.co

- 500+ flat-style SVG illustrations covering SaaS topics: analytics, onboarding, security, payments, collaboration, etc.
- **On-site color customization** — enter a hex code and every illustration re-colors before download. Use `#FF5A28` (brand orange) or `#1462D2` (electric blue) for brand-consistent results.
- MIT License — free for commercial use, no attribution required, modify freely.

**When to use:** Empty states, feature sections, landing pages, onboarding flows, error pages, marketing materials — any context that calls for a scene or abstract concept illustration.

**Search keywords for common needs:** `dashboard`, `analytics`, `payments`, `invoice`, `email`, `notification`, `security`, `settings`, `team`, `collaboration`, `onboarding`, `error`, `empty`, `search`, `upload`, `download`, `calendar`, `chart`, `report`, `success`, `confirmation`.

### Humaaans (Supplementary — People & Characters)

Homepage: https://humaaans.com

- Mix-and-match modular character library — swap bodies, arms, legs, hairstyles, skin tones, clothing.
- Figma component library for composing custom scenes directly in design files.
- CC0 License — public domain, zero restrictions.

**When to use:** Team pages, testimonials, user onboarding, empty states that need a human element, diversity-focused imagery. Use Humaaans when the illustration specifically needs to show *people* rather than an abstract concept.

### Illustration Rules

1. **unDraw first.** Default to unDraw for general illustrations. Only reach for Humaaans when the context specifically needs human characters.
2. **Brand-color the SVGs.** Always customize unDraw illustrations to use brand orange (`#FF5A28`) or electric blue (`#1462D2`) before embedding. Never use the default purple.
3. **Don't mix styles.** Within a single page or flow, use illustrations from one library only. Don't place an unDraw scene next to a Humaaans character — the styles clash.
4. **SVG format only.** Always use SVG, never PNG/JPG exports. SVGs scale cleanly across all viewports and support theme-aware color overrides via CSS.

---

## Stock Images

**Unsplash** is the standard stock image source.

Homepage: https://unsplash.com

- 3M+ high-resolution photos — lifestyle, architecture, nature, tech, business.
- Unsplash License — free for commercial use, no attribution required (attribution encouraged but not mandatory).
- REST API available at https://unsplash.com/developers for programmatic access.

### API Usage

```bash
# Search for images
curl "https://api.unsplash.com/search/photos?query=office&per_page=10" \
  -H "Authorization: Client-ID YOUR_ACCESS_KEY"
```

API rate limits: 50 requests/hour (demo), higher after production approval. When displaying images via the API, you must credit the photographer and link to their Unsplash profile (API Terms requirement).

**Search keywords for common needs:** `modern office`, `team meeting`, `laptop workspace`, `finance`, `data analytics`, `professional`, `technology`, `abstract minimal`, `business`, `startup`, `architecture minimal`, `clean desk`. Prefer search terms with `minimal`, `modern`, or `clean` to match the brand mood.

### Image Rules

1. **Unsplash only.** Don't mix stock sources — visual consistency matters.
2. **Always optimize.** Compress images before embedding. Use Unsplash's built-in URL parameters for resizing: append `?w=800&q=80` to any image URL.
3. **Prefer lifestyle over staged.** Choose natural, candid imagery over posed corporate stock. The brand is clean and modern — the photography should match.
4. **Self-host for production.** Don't hotlink Unsplash URLs in production apps. Download and serve from your own CDN.

---

## Stock Video

Two sources: **Pexels** (primary, API-capable) and **Mixkit** (supplementary, higher production quality).

### Pexels Videos (Primary)

Homepage: https://pexels.com/videos

- 150K+ curated videos, up to 4K resolution.
- Pexels License — free for commercial use, no attribution required.
- **Free API** — 200 requests/hour, 20,000/month. Search, filter, and download programmatically.

```bash
# Search for videos
curl "https://api.pexels.com/videos/search?query=technology&per_page=5" \
  -H "Authorization: YOUR_API_KEY"
```

**When to use:** Any context where you need programmatic access, dynamic video selection, or automated workflows. Default to Pexels.

**Search keywords for common needs:** `technology`, `office`, `abstract`, `data`, `city aerial`, `minimal`, `business`, `typing`, `dashboard screen`, `teamwork`. Append `slow motion` or `aerial` for cinematic hero backgrounds.

### Mixkit (Supplementary — Higher Quality)

Homepage: https://mixkit.co

- Curated library operated by Envato — consistently high production quality.
- Up to 4K resolution. Also includes free music and sound effects.
- Mixkit Free License — free for commercial use, no attribution, no watermarks.
- **No API** — manual browse and download only.

**When to use:** Hero background videos, landing page cinematics, marketing materials — contexts where production quality matters most and manual selection is acceptable.

### Video Rules

1. **Pexels first** for any API-driven or automated workflow.
2. **Mixkit when quality is paramount** — hero sections, brand videos, key marketing pages.
3. **Self-host all video files.** Download and serve from your own infrastructure. Never hotlink to external URLs in production.
4. **Compress and optimize.** Use WebM with MP4 fallback. Target 1080p for most uses — 4K only when the viewport demands it.
5. **Provide poster frames.** Always set a poster image so users see content before the video loads.

---

## Animation

### Animation Engine

Two libraries: **Motion** (primary, React-first) and **GSAP** (complex sequences and scroll-driven animation).

#### Motion (Primary)

Homepage: https://motion.dev

Formerly Framer Motion + Motion One, unified into a single library. MIT license.

```bash
npm install motion
```

- Declarative API for React — `motion` components, variants, layout animations (FLIP), exit animations, gestures.
- Vanilla JS support via `animate()` function.
- WAAPI-backed for GPU-accelerated performance.
- Tree-shakable: ~3.8 KB (vanilla) to ~25 KB (full React with drag + layout).

```tsx
import { motion } from 'motion/react';

// Fade in on mount
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />

// Layout animation (FLIP)
<motion.div layout />

// Exit animation
<AnimatePresence>
  {isVisible && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>
```

**When to use:** Default animation engine for all React UI work — component transitions, layout shifts, hover/tap/drag interactions, mount/unmount animations.

#### GSAP (Complex Sequences)

Homepage: https://gsap.com

All plugins are free (since April 2025, after Webflow acquisition). Proprietary license — the only restriction is you cannot use GSAP in a no-code animation builder that competes with Webflow. Standard product development is fully permitted.

```bash
npm install gsap
```

- Timeline-based sequencing, ScrollTrigger, SplitText, MorphSVG, Draggable.
- Framework-agnostic — works with React, Vue, vanilla JS.
- ~30 KB core + individual plugin sizes.

```tsx
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.to('.hero-title', {
  y: 0,
  opacity: 1,
  duration: 0.8,
  scrollTrigger: { trigger: '.hero', start: 'top 80%' },
});
```

**When to use:** Scroll-driven animations, multi-step cinematic sequences, text splitting effects, SVG morphing, complex coordinated timelines — anything beyond what Motion handles cleanly.

#### Animation Engine Rules

1. **Motion first.** Use Motion for all standard React UI animations. It covers 90% of use cases with a simpler API.
2. **GSAP for the heavy lifting.** Reach for GSAP when you need scroll-triggered sequences, text splitting, SVG morphing, or multi-element choreography.
3. **They coexist fine.** Motion handles component-level animation; GSAP handles page-level orchestration. No conflict.
4. **Respect `prefers-reduced-motion`.** Always check and honor the user's OS-level motion preference. Disable or simplify animations when reduced motion is requested.

### Animation Assets — Rive

Homepage: https://rive.app

Rive provides **interactive, state machine-driven animations** — unlike Lottie (pre-baked playback), Rive animations respond to user input, data, and application state in real time.

```bash
npm install @rive-app/react-canvas
```

- **Runtimes are MIT licensed** — no runtime fees, free for commercial deployment.
- Editor free tier available for individuals (paid plans for team collaboration).
- Smaller file sizes than equivalent Lottie animations.
- Community asset library at https://rive.app/community — search for `loader`, `toggle`, `button`, `icon`, `onboarding`, `empty state`, `notification`, `check`, `success`, `error`

```tsx
import { useRive } from '@rive-app/react-canvas';

function LoadingAnimation() {
  const { RiveComponent } = useRive({
    src: '/animations/loading.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });
  return <RiveComponent style={{ width: 200, height: 200 }} />;
}
```

**When to use:** Interactive loaders, onboarding animations, animated illustrations that react to hover/click/state, gamified UI elements, animated empty states.

#### Rive Rules

1. **Use Rive for interactive animations only.** For simple CSS transitions or component animations, use Motion instead — don't over-engineer.
2. **Keep `.riv` files small.** Optimize in the Rive editor before export. Target < 50 KB per animation for web.
3. **Provide static fallbacks.** Not all contexts support the Rive runtime (email, PDF exports). Always have a static SVG or PNG fallback.
4. **State machines over timeline-only.** Prefer state machine-driven animations that react to app state over simple looping playback.

---

## Data Visualization

### Charting Library — Nivo

Homepage: https://nivo.rocks

**Nivo** is the standard charting library. SVG-based, theme-aware, with rich defaults that match the brand's clean aesthetic.

```bash
npm install @nivo/core @nivo/bar @nivo/line @nivo/pie
# Install only the chart types you need — each is a separate package
```

Available chart packages: `@nivo/bar`, `@nivo/line`, `@nivo/pie`, `@nivo/radar`, `@nivo/heatmap`, `@nivo/treemap`, `@nivo/waffle`, `@nivo/funnel`, `@nivo/bump`, `@nivo/sankey`, `@nivo/choropleth`, `@nivo/calendar`, `@nivo/stream`, `@nivo/swarmplot`.

### Brand Theme Object

Map the brand's semantic tokens to Nivo's theme API. This is the single source of truth for chart styling — never hardcode colors in individual charts.

```tsx
import type { Theme } from '@nivo/core';

export function getNivoTheme(isDark: boolean): Theme {
  return {
    background: 'transparent',
    text: {
      fontSize: 12,
      fontFamily: "'Jost', sans-serif",
      fill: isDark ? '#E8E9F0' : '#1A1B2E',
    },
    axis: {
      domain: { line: { stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(18,25,72,0.08)' } },
      ticks: {
        line: { stroke: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(18,25,72,0.08)' },
        text: {
          fontSize: 11,
          fontFamily: "'Jost', sans-serif",
          fontWeight: 500,
          fill: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563',
        },
      },
      legend: {
        text: {
          fontSize: 12,
          fontFamily: "'Jost', sans-serif",
          fontWeight: 600,
          fill: isDark ? 'rgba(255,255,255,0.7)' : '#1A1B2E',
        },
      },
    },
    grid: {
      line: {
        stroke: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(18,25,72,0.04)',
        strokeWidth: 1,
      },
    },
    crosshair: {
      line: { stroke: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(18,25,72,0.3)', strokeDasharray: '4 4' },
    },
    tooltip: {
      container: {
        fontFamily: "'Jost', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        background: isDark ? '#1A1B2E' : '#FFFFFF',
        color: isDark ? '#E8E9F0' : '#1A1B2E',
        borderRadius: '8px',
        boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)',
        padding: '8px 12px',
      },
    },
    labels: {
      text: {
        fontSize: 12,
        fontFamily: "'Jost', sans-serif",
        fontWeight: 600,
        fill: isDark ? '#FFFFFF' : '#1A1B2E',
      },
    },
    legends: {
      text: {
        fontSize: 12,
        fontFamily: "'Jost', sans-serif",
        fontWeight: 500,
        fill: isDark ? 'rgba(255,255,255,0.55)' : '#4B5563',
      },
    },
  };
}
```

### Brand Color Sequences

Use these ordered palettes for multi-series data. The accent (orange) is always the first/primary color.

```ts
// Primary palette — use for most charts
export const CHART_COLORS = ['#FF5A28', '#1462D2', '#3EA6FF', '#FFB800', '#34C759', '#6366F1'];

// Single-series emphasis — accent with muted fill
export const CHART_SINGLE = { fill: '#FF5A28', muted: 'rgba(255,90,40,0.12)' };

// Diverging palette — for positive/negative comparisons
export const CHART_DIVERGING = { positive: '#34C759', negative: '#EF4444', neutral: '#6B7280' };
```

**Rules:**
- **Max 6 series per chart.** More than 6 colors becomes noise. If you have more categories, group or filter.
- **Accent first.** The primary data series or the series you want to highlight always uses `#FF5A28`.
- **Gray out the rest.** When one series needs emphasis, render others in `rgba(18,25,72,0.12)` (light) or `rgba(255,255,255,0.08)` (dark). The highlighted series pops in accent.

### Usage Pattern

Always use the `Responsive*` wrapper for fluid sizing:

```tsx
import { ResponsiveBar } from '@nivo/bar';
import { getNivoTheme, CHART_COLORS } from '@/lib/chart-theme';

function RevenueChart({ data, isDark }: { data: BarDatum[]; isDark: boolean }) {
  return (
    <div style={{ height: 360 }}>
      <ResponsiveBar
        data={data}
        keys={['revenue']}
        indexBy="quarter"
        theme={getNivoTheme(isDark)}
        colors={CHART_COLORS}
        margin={{ top: 24, right: 24, bottom: 48, left: 64 }}
        padding={0.3}
        borderRadius={4}
        enableGridX={false}
        enableLabel={false}
        animate={true}
        motionConfig="gentle"
        axisBottom={{
          tickSize: 0,
          tickPadding: 12,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 12,
          format: (v) => `$${v}k`,
        }}
      />
    </div>
  );
}
```

### Chart Design Rules

1. **Clean over clever.** Remove gridlines, legends, and axes that don't add understanding. Label data directly when possible instead of using a separate legend.
2. **One insight per chart.** The chart title should state the insight (assertion, not label). "Revenue grew 34% after the launch" not "Revenue by Quarter."
3. **Border radius on bars.** Use `borderRadius: 4` for bar charts — matches the brand's rounded aesthetic.
4. **No 3D effects.** No gradients on data elements, no shadows on bars, no perspective transforms on pies.
5. **Animate on entry.** Use `motionConfig="gentle"` for smooth, restrained entry animations.
6. **Tooltips inherit the theme.** The brand tooltip style (8px radius, Jost font, themed background) is defined in the theme object — don't override per chart.
7. **Respect negative space.** Use generous margins. Default to `{ top: 24, right: 24, bottom: 48, left: 64 }` and adjust from there.
8. **Pie/donut sparingly.** Humans compare angles poorly. Prefer bar charts for comparisons. Use pie/donut only when showing parts of a whole with ≤ 5 segments.
9. **Accessible.** Don't rely on color alone to distinguish series. Use `enableLabel`, patterns (`@nivo/core` patterns), or direct annotation alongside color.

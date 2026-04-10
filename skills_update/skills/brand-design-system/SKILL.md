---
name: brand-design-system
description: >
  Brand visual identity — colour principles, typography, icons, logo usage, and
  theming rules. Apply when creating any UI, choosing colours, styling components,
  implementing themes, placing logos, or selecting icons. For token values and
  CSS copy-paste blocks, see the companion brand-tokens-reference skill.
---

# Brand Design System

This is the source of truth for visual identity. Every UI pulls tokens from this system — never invent colours or pick arbitrary greys.

For the actual token values, CSS blocks, and theme mappings, see **brand-tokens-reference**. This skill defines the *rules* for using them.

---

## When to Use

Apply this skill when:
- Creating or styling any UI (components, pages, layouts)
- Choosing colours for any element
- Implementing light, dark, night, or legacy themes
- Placing logos or favicons
- Selecting icons
- Building theme-switching functionality
- Creating exports (PDFs, presentations, emails) that need brand identity

Do NOT use this skill for:
- Visual design principles (spacing, hierarchy, alignment) — see **design-foundations**
- Component architecture or styling mechanics — see **frontend-architecture**
- Animation and motion — see **interaction-motion**

---

## Core Rules

### 1. Semantic tokens only — never hardcoded colours

Components reference `var(--color-*)` semantic tokens. Never hardcode hex values. Never reference mode-prefixed tokens (`--lm-orange`, `--dm-surface-1`) in component code. Never reference a theme by name in component code.

```tsx
// ✅ Semantic token — adapts to any theme
<div style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text-body)' }}>

// ❌ Hardcoded hex
<div style={{ backgroundColor: '#FFFFFF', color: '#333333' }}>

// ❌ Mode-prefixed token in component
<div style={{ backgroundColor: 'var(--lm-white)' }}>
```

### 2. Neutral first, accent as punctuation

The clean, modern, minimalist aesthetic always takes priority over brand colour saturation. A page that is 90% neutral surfaces with a single orange CTA is better than forcing orange and blue into every section.

- **Surfaces, text, and structural elements** use neutral tokens (`--color-bg`, `--color-surface`, `--color-text-body`, `--color-border`)
- **Orange** is for the one thing you want users to click — primary CTAs, key highlights. Use sparingly.
- **Electric Blue** is for secondary actions and links — the workhorse interactive colour.
- **Never force brand colours.** If a section looks better neutral, leave it neutral.

**The squint test:** Blur your eyes. If you see large blocks of orange or blue, you've over-applied accent colour. You should see mostly neutral space with small pops of accent.

### 3. Light + Night by default

Implement Light and Night themes by default. Dark and Legacy only when explicitly requested.

- **Light** — default, clean, professional, brand-forward
- **Night** — YouTube/Google neutral greys (`#0F0F0F` base), content-first, familiar, best for low-light and OLED
- **Dark** — blue-tinted surfaces, brand personality in dark mode (implement on request)
- **Legacy** — pixel-perfect original ezyCollect recreation (implement on request)

### 4. Theme switching via `data-theme` attribute

Set `data-theme` on `<html>`. Components inherit the correct token values via CSS cascade. No theme logic in component code.

```js
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ezycollect-theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('ezycollect-theme');
  if (saved) return setTheme(saved);
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return setTheme('night');
  setTheme('light');
}
```

### 5. One icon library — Phosphor Icons

All icons come from Phosphor Icons. No mixing with other icon libraries.

- Default weight: `regular`
- Active/selected state: `fill`
- Default size: 20px for buttons and nav, 16px inline with text, 24px for section headers
- Icons inherit `currentColor` — set colour via semantic tokens only when needed
- One weight per context (don't mix `regular` and `bold` in the same toolbar)

### 6. One typeface — Jost

Jost is the brand typeface for everything.

| Weight | Use |
|---|---|
| 350 | Descriptions, secondary body, captions |
| 400 | Default body text |
| 500 | Nav links, labels, meta text |
| 600 | Buttons, tags, emphasis |
| 700 | Headings, card titles |
| 800 | Hero headings, logo text |

---

## Logo

### Variants

| Variant | Use |
|---|---|
| Rectangle (colour) | Light and legacy themes — headers, navbars, hero sections |
| Rectangle (white) | Dark and night themes |
| Square (colour) | Light-mode favicon, constrained spaces |
| Square (white) | Dark-mode favicon |

See **brand-tokens-reference** for logo URLs.

### Rules

1. Default to the rectangle logo. Square only when space is constrained.
2. Colour logo on light backgrounds. White logo on dark backgrounds.
3. Never modify the logo — no recoloring, stretching, or effects.
4. Both variants rendered in DOM; CSS toggles visibility by `data-theme`.

```css
.logo-color { display: block; }
.logo-white { display: none; }
[data-theme="dark"] .logo-color, [data-theme="night"] .logo-color { display: none; }
[data-theme="dark"] .logo-white, [data-theme="night"] .logo-white { display: block; }
```

### Logo Sizing

| Viewport | Logo Height | Navbar Height |
|---|---|---|
| LG (desktop) | 32px | 56px |
| MD (tablet) | 32px | 52px |
| SM / XS (mobile) | 26px | 52px |

### Offline / Export Usage

When producing downloadable files (PDFs, presentations, exports), download the logo from the hosted URL and embed it directly. Do not reference remote URLs in exported documents — they break offline.

---

## Colour Hierarchy

1. **Orange** (`--color-primary`) — Primary CTA, high-emphasis only. Use sparingly for maximum impact.
2. **Electric Blue** (`--color-secondary`) — Secondary CTA, links, charts. The workhorse interactive colour.
3. **Text colours** — Midnight Blue for headings (light), 3-tier text system for dark/night (primary → secondary → muted).
4. **Surfaces** — Neutral backgrounds. Use the elevation ladder in dark/night (surface-0 → 1 → 2 → 3) for depth.
5. **Complementary colours** — Violet, teal, rose, sky, fuchsia for tags, badges, chart series. NOT status indicators.
6. **Status colours** — Success (green), warning (amber), danger (red). Only for semantic status.
7. **Gradients** — Decorative only, used sparingly. Hero sections, featured cards, section separators.

---

## Component Patterns

**Buttons:**
- Primary → Orange background, white text (all modes)
- Secondary → Transparent background, Electric Blue text + border
- Hover states use mode-appropriate hover tokens

**Cards:**
- Light: white background, `--color-border`
- Dark/Night: surface-1 background, mode-appropriate border

**Inputs:**
- Light: white background, `--color-border`, midnight blue text
- Dark/Night: surface-1 background, mode-appropriate border and text
- Focus: Electric Blue border (all modes)

**Tags / Badges:**
- Use `--color-primary-muted` background + `--color-primary` text for brand tags
- Use complementary colour pairs for category tags (solid on muted for accessible contrast)

**Navigation:**
- Background follows shell token (`--color-topnav-bg`, `--color-sidebar-bg`)
- CTA button always uses Orange
- Logo follows colour mode pairing rules

---

## Banned Patterns

- ❌ Hardcoded hex values in component styles → use `var(--color-*)` semantic tokens
- ❌ Mode-prefixed tokens (`--lm-orange`, `--dm-surface-1`) in components → use semantic tokens that adapt per theme
- ❌ Theme name checks in component code (`if theme === 'dark'`) → components are theme-agnostic, CSS cascade handles switching
- ❌ More than 2 accent colours in one component → orange + blue maximum, one should dominate
- ❌ Orange text on orange-muted backgrounds without contrast check → verify 4.5:1 ratio
- ❌ Raw white (`#FFFFFF`) as text in dark/night mode → use `--color-text-*` tokens
- ❌ Mixing Phosphor with other icon libraries → all icons from Phosphor
- ❌ Mixing icon weights in the same context → one weight per toolbar/nav (exception: `fill` for active alongside `regular`)
- ❌ Complementary colours used for status indication → status uses only success/warning/danger tokens
- ❌ Gradients on text backgrounds without readability check → overlay semi-transparent surface if needed
- ❌ Large blocks of accent colour → neutral first, accent is punctuation

---

## Quality Gate

Before delivering, verify:

- [ ] No hardcoded hex values in component styles — only `var(--color-*)` references
- [ ] No mode-prefixed tokens in component code
- [ ] `data-theme` attribute set on `<html>` with at least Light and Night theme blocks
- [ ] Theme switcher present and persists user choice
- [ ] Logo swaps correctly: colour (light/legacy) / white (dark/night)
- [ ] All icons from Phosphor, default `regular` weight, `fill` for active states
- [ ] Font is Jost with appropriate weight per use case
- [ ] Squint test passes — mostly neutral surfaces, accent as punctuation
- [ ] Tested visually in all implemented themes before delivery
- [ ] Exports embed logos directly, not as remote URL references

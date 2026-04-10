---
name: brand-tokens-reference
type: reference
companion_to: brand-design-system
description: >
  Token lookup tables for the brand design system — raw palette tokens, semantic
  token mappings, complementary colours, gradients, contrast references, and
  copy-paste CSS for all four themes (light, dark, night, legacy). This is a
  reference file, not a behavioural skill. For rules on how to use these tokens,
  see brand-design-system.
---

# Brand Tokens Reference

> **This is a companion reference to the [brand-design-system](brand-design-system.md) skill.**
> It contains token values, CSS blocks, and mapping tables. For usage rules, principles, and
> banned patterns, see the main skill.

---

## Raw Palette Tokens

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
| `--dm-orange-muted` | `#33200F` | Warm background zones, tags, toasts |
| `--dm-electric-blue` | `#4D8EF7` | Secondary CTA, links (lifted for dark contrast) |
| `--dm-brand-blue` | `#5A6BD4` | Logo on dark, decorative brand use |
| `--dm-surface-0` | `#0C0F24` | Page background (base) |
| `--dm-surface-1` | `#131733` | Cards, modals, dropdowns |
| `--dm-surface-2` | `#1A2044` | Hover states, inputs, nested containers |
| `--dm-surface-3` | `#232A56` | Active states, selected items, tooltips |
| `--dm-border` | `#2A3168` | Card borders, dividers, separators |
| `--dm-text-primary` | `#E8EAF6` | Headings, body text |
| `--dm-text-secondary` | `#9CA3C9` | Descriptions, meta text |
| `--dm-text-muted` | `#8089B5` | Placeholders, disabled states |

### Night Mode

Pure neutral dark surfaces modeled on YouTube / Google dark mode. Unlike dark mode's blue-tinted surfaces, night mode uses true neutral greys anchored on `#0F0F0F`.

| Token | Hex | Role |
|---|---|---|
| `--nm-orange` | `#FF5A28` | Primary CTA (same across all modes) |
| `--nm-orange-muted` | `#261A10` | Subtle dark background for tags, toasts |
| `--nm-electric-blue` | `#3EA6FF` | Secondary CTA, links (YouTube blue) |
| `--nm-brand-blue` | `#8AB4F8` | Logo on night, decorative (Google blue) |
| `--nm-surface-0` | `#0F0F0F` | Page background (YouTube main bg) |
| `--nm-surface-1` | `#212121` | Cards, modals, dropdowns |
| `--nm-surface-2` | `#272727` | Hover states, inputs |
| `--nm-surface-3` | `#3A3A3A` | Active states, selected items |
| `--nm-border` | `#3F3F3F` | Card borders, dividers |
| `--nm-text-primary` | `#F1F1F1` | Headings, body text |
| `--nm-text-secondary` | `#AAAAAA` | Descriptions, meta text |
| `--nm-text-muted` | `#717171` | Placeholders, disabled states |

### Legacy Mode

Pixel-perfect recreation of the original ezyCollect app. Uses hardcoded hex values, not `:root` palette tokens.

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
| `--color-warning` | `#FF6600` | same as primary |
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
| `--color-ageing-31-60` | `#6600FF` | ApexCharts SVG fill |
| `--color-ageing-61-90` | `#FFE600` | ApexCharts SVG fill |
| `--color-ageing-91-120` | `#FF6600` | ApexCharts SVG fill |
| `--color-ageing-120-plus` | `#FF001A` | ApexCharts SVG fill |

---

## Semantic Tokens — Complete Reference

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

### Shell Tokens

| Semantic Variable | Role |
|---|---|
| `--color-sidebar-bg` | Sidebar background |
| `--color-sidebar-text` | Sidebar nav item text |
| `--color-sidebar-text-active` | Active nav item text |
| `--color-sidebar-hover` | Nav item hover background |
| `--color-sidebar-section` | Section header / divider |
| `--color-topnav-bg` | Navbar background |
| `--color-topnav-text` | Navbar text (active tabs) |
| `--color-topnav-text-muted` | Navbar secondary text |
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

## Complementary Colours

Five Tailwind-sourced accent families for tags, badges, chart series, and categorisation. NOT status colours.

| Family | Light (600) | Night (400) | Muted Light (100) | Muted Night (950) |
|---|---|---|---|---|
| **Violet** | `#7C3AED` | `#A78BFA` | `#EDE9FE` | `#2E1065` |
| **Teal** | `#0D9488` | `#2DD4BF` | `#CCFBF1` | `#042F2E` |
| **Rose** | `#E11D48` | `#FB7185` | `#FFE4E6` | `#4C0519` |
| **Sky** | `#0284C7` | `#38BDF8` | `#E0F2FE` | `#082F49` |
| **Fuchsia** | `#C026D3` | `#E879F9` | `#FAE8FF` | `#4A044E` |

### Complementary Tokens

| Token | Role |
|---|---|
| `--color-comp-violet` / `--color-comp-violet-muted` | Violet accent / background |
| `--color-comp-teal` / `--color-comp-teal-muted` | Teal accent / background |
| `--color-comp-rose` / `--color-comp-rose-muted` | Rose accent / background |
| `--color-comp-sky` / `--color-comp-sky-muted` | Sky accent / background |
| `--color-comp-fuchsia` / `--color-comp-fuchsia-muted` | Fuchsia accent / background |

---

## Gradients

| Token | Description | Use Case |
|---|---|---|
| `--gradient-warm` | Orange → Rose | Hero sections, CTA banners |
| `--gradient-cool` | Blue → Teal | Data headers, info panels |
| `--gradient-brand` | Orange → Blue | Brand callouts, featured areas |
| `--gradient-neutral` | White → Light Blue / Surface ladder | Page backgrounds, section separators |
| `--gradient-vivid` | Violet → Fuchsia → Rose | Creative sections, marketing |
| `--gradient-ocean` | Sky → Teal | Analytical sections, charts |

### Gradient Values

**Light:**

| Token | Value |
|---|---|
| `--gradient-warm` | `linear-gradient(135deg, #FF5A28, #E11D48)` |
| `--gradient-cool` | `linear-gradient(135deg, #1462D2, #0D9488)` |
| `--gradient-brand` | `linear-gradient(135deg, #FF5A28, #1462D2)` |
| `--gradient-neutral` | `linear-gradient(180deg, #FFFFFF, #EBEBF3)` |
| `--gradient-vivid` | `linear-gradient(135deg, #7C3AED, #C026D3, #E11D48)` |
| `--gradient-ocean` | `linear-gradient(135deg, #0284C7, #0D9488)` |

**Night:**

| Token | Value |
|---|---|
| `--gradient-warm` | `linear-gradient(135deg, #FF5A28, #FB7185)` |
| `--gradient-cool` | `linear-gradient(135deg, #3EA6FF, #2DD4BF)` |
| `--gradient-brand` | `linear-gradient(135deg, #FF5A28, #3EA6FF)` |
| `--gradient-neutral` | `linear-gradient(180deg, #212121, #0F0F0F)` |
| `--gradient-vivid` | `linear-gradient(135deg, #A78BFA, #E879F9, #FB7185)` |
| `--gradient-ocean` | `linear-gradient(135deg, #38BDF8, #2DD4BF)` |

---

## Complete Semantic Token Mapping (CSS)

Copy-paste ready. Each `[data-theme]` block maps semantic variables to palette values.

### Raw Palette (`:root`)

```css
:root {
  /* Light */ --lm-orange: #FF5A28; --lm-light-orange: #FFF2EB;
  --lm-electric-blue: #1462D2; --lm-brand-blue: #1F2B7A; --lm-midnight-blue: #121948;
  --lm-white: #FFFFFF; --lm-light-blue: #EBEBF3; --lm-neutral-text: #333333;
  /* Dark */ --dm-orange: #FF5A28; --dm-orange-muted: #33200F;
  --dm-electric-blue: #4D8EF7; --dm-brand-blue: #5A6BD4;
  --dm-surface-0: #0C0F24; --dm-surface-1: #131733; --dm-surface-2: #1A2044; --dm-surface-3: #232A56;
  --dm-border: #2A3168; --dm-text-primary: #E8EAF6; --dm-text-secondary: #9CA3C9; --dm-text-muted: #8089B5;
  /* Night */ --nm-orange: #FF5A28; --nm-orange-muted: #261A10;
  --nm-electric-blue: #3EA6FF; --nm-brand-blue: #8AB4F8;
  --nm-surface-0: #0F0F0F; --nm-surface-1: #212121; --nm-surface-2: #272727; --nm-surface-3: #3A3A3A;
  --nm-border: #3F3F3F; --nm-text-primary: #F1F1F1; --nm-text-secondary: #AAAAAA; --nm-text-muted: #717171;
}
```

### Light Theme

```css
[data-theme="light"] {
  --color-primary: var(--lm-orange); --color-primary-hover: #E8491C;
  --color-primary-muted: var(--lm-light-orange);
  --color-secondary: var(--lm-electric-blue); --color-brand: var(--lm-brand-blue);
  --color-bg: var(--lm-white); --color-bg-alt: var(--lm-light-blue);
  --color-surface: var(--lm-white); --color-surface-hover: var(--lm-light-blue);
  --color-surface-active: #DADBE6; --color-border: #DADBE6;
  --color-text-heading: var(--lm-midnight-blue); --color-text-body: var(--lm-neutral-text);
  --color-text-muted: #6B7280;
  --color-success: #10B981; --color-success-muted: #D1FAE5;
  --color-warning: #F59E0B; --color-warning-muted: #FEF3C7;
  --color-danger: #EF4444; --color-danger-muted: #FEE2E2;
  --color-sidebar-bg: var(--lm-midnight-blue); --color-sidebar-text: #C7C9E0;
  --color-sidebar-text-active: #FFFFFF; --color-sidebar-hover: rgba(255, 255, 255, 0.08);
  --color-sidebar-section: rgba(255, 255, 255, 0.04);
  --color-table-stripe: rgba(0, 0, 0, 0.025);
  --color-topnav-bg: var(--lm-white); --color-topnav-text: var(--lm-midnight-blue);
  --color-topnav-text-muted: #6B7280; --color-topnav-border: #DADBE6;
  --color-topnav-badge-bg: var(--lm-light-blue); --color-topnav-badge-text: var(--lm-neutral-text);
  --color-ageing-current: var(--tw-emerald-500); --color-ageing-1-30: var(--tw-blue-500);
  --color-ageing-31-60: var(--tw-amber-500); --color-ageing-61-90: var(--tw-orange-500);
  --color-ageing-91-120: var(--tw-red-500); --color-ageing-120-plus: var(--tw-violet-600);
  --color-comp-violet: #7C3AED; --color-comp-violet-muted: #EDE9FE;
  --color-comp-teal: #0D9488; --color-comp-teal-muted: #CCFBF1;
  --color-comp-rose: #E11D48; --color-comp-rose-muted: #FFE4E6;
  --color-comp-sky: #0284C7; --color-comp-sky-muted: #E0F2FE;
  --color-comp-fuchsia: #C026D3; --color-comp-fuchsia-muted: #FAE8FF;
  --gradient-warm: linear-gradient(135deg, #FF5A28, #E11D48);
  --gradient-cool: linear-gradient(135deg, #1462D2, #0D9488);
  --gradient-brand: linear-gradient(135deg, #FF5A28, #1462D2);
  --gradient-neutral: linear-gradient(180deg, #FFFFFF, #EBEBF3);
  --gradient-vivid: linear-gradient(135deg, #7C3AED, #C026D3, #E11D48);
  --gradient-ocean: linear-gradient(135deg, #0284C7, #0D9488);
}
```

### Dark Theme

Same structure as Night but uses `--dm-*` (blue-tinted) palette tokens instead of `--nm-*` (neutral grey).

```css
[data-theme="dark"] {
  /* Differences from Night: dm- prefix, blue-tinted surfaces */
  --color-primary: var(--dm-orange); --color-primary-hover: #FF7A52;
  --color-primary-muted: var(--dm-orange-muted);
  --color-secondary: var(--dm-electric-blue); --color-brand: var(--dm-brand-blue);
  --color-bg: var(--dm-surface-0); --color-bg-alt: var(--dm-surface-1);
  --color-surface: var(--dm-surface-1); --color-surface-hover: var(--dm-surface-2);
  --color-surface-active: var(--dm-surface-3); --color-border: var(--dm-border);
  --color-text-heading: var(--dm-text-primary); --color-text-body: var(--dm-text-secondary);
  --color-text-muted: var(--dm-text-muted);
  /* Status, comp, gradient tokens identical to Night theme */
  --color-success: #34D399; --color-success-muted: #064E3B;
  --color-warning: #FBBF24; --color-warning-muted: #78350F;
  --color-danger: #F87171; --color-danger-muted: #7F1D1D;
  --color-sidebar-bg: var(--dm-surface-0); --color-sidebar-text: var(--dm-text-secondary);
  --color-sidebar-text-active: var(--dm-text-primary); --color-sidebar-hover: var(--dm-surface-2);
  --color-sidebar-section: var(--dm-surface-0); --color-table-stripe: var(--dm-surface-2);
  --color-topnav-bg: var(--dm-surface-1); --color-topnav-text: var(--dm-text-primary);
  --color-topnav-text-muted: var(--dm-text-muted); --color-topnav-border: var(--dm-border);
  --color-topnav-badge-bg: var(--dm-surface-2); --color-topnav-badge-text: var(--dm-text-secondary);
  --color-ageing-current: var(--tw-emerald-400); --color-ageing-1-30: var(--tw-blue-400);
  --color-ageing-31-60: var(--tw-amber-400); --color-ageing-61-90: var(--tw-orange-400);
  --color-ageing-91-120: var(--tw-red-400); --color-ageing-120-plus: var(--tw-violet-400);
  --color-comp-violet: #A78BFA; --color-comp-violet-muted: #2E1065;
  --color-comp-teal: #2DD4BF; --color-comp-teal-muted: #042F2E;
  --color-comp-rose: #FB7185; --color-comp-rose-muted: #4C0519;
  --color-comp-sky: #38BDF8; --color-comp-sky-muted: #082F49;
  --color-comp-fuchsia: #E879F9; --color-comp-fuchsia-muted: #4A044E;
  --gradient-warm: linear-gradient(135deg, #FF5A28, #FB7185);
  --gradient-cool: linear-gradient(135deg, #3EA6FF, #2DD4BF);
  --gradient-brand: linear-gradient(135deg, #FF5A28, #3EA6FF);
  --gradient-neutral: linear-gradient(180deg, #212121, #0F0F0F);
  --gradient-vivid: linear-gradient(135deg, #A78BFA, #E879F9, #FB7185);
  --gradient-ocean: linear-gradient(135deg, #38BDF8, #2DD4BF);
}
```

### Night Theme

```css
[data-theme="night"] {
  --color-primary: var(--nm-orange); --color-primary-hover: #E8491C;
  --color-primary-muted: var(--nm-orange-muted);
  --color-secondary: var(--nm-electric-blue); --color-brand: var(--nm-brand-blue);
  --color-bg: var(--nm-surface-0); --color-bg-alt: var(--nm-surface-1);
  --color-surface: var(--nm-surface-1); --color-surface-hover: var(--nm-surface-2);
  --color-surface-active: var(--nm-surface-3); --color-border: var(--nm-border);
  --color-text-heading: var(--nm-text-primary); --color-text-body: var(--nm-text-secondary);
  --color-text-muted: var(--nm-text-muted);
  --color-success: #34D399; --color-success-muted: #064E3B;
  --color-warning: #FBBF24; --color-warning-muted: #78350F;
  --color-danger: #F87171; --color-danger-muted: #7F1D1D;
  --color-sidebar-bg: var(--nm-surface-0); --color-sidebar-text: var(--nm-text-secondary);
  --color-sidebar-text-active: var(--nm-text-primary); --color-sidebar-hover: var(--nm-surface-2);
  --color-sidebar-section: var(--nm-surface-0); --color-table-stripe: var(--nm-surface-2);
  --color-topnav-bg: var(--nm-surface-1); --color-topnav-text: var(--nm-text-primary);
  --color-topnav-text-muted: var(--nm-text-muted); --color-topnav-border: var(--nm-border);
  --color-topnav-badge-bg: var(--nm-surface-2); --color-topnav-badge-text: var(--nm-text-secondary);
  --color-ageing-current: var(--tw-emerald-400); --color-ageing-1-30: var(--tw-sky-400);
  --color-ageing-31-60: var(--tw-amber-400); --color-ageing-61-90: var(--tw-orange-400);
  --color-ageing-91-120: var(--tw-red-400); --color-ageing-120-plus: var(--tw-violet-400);
  --color-comp-violet: #A78BFA; --color-comp-violet-muted: #2E1065;
  --color-comp-teal: #2DD4BF; --color-comp-teal-muted: #042F2E;
  --color-comp-rose: #FB7185; --color-comp-rose-muted: #4C0519;
  --color-comp-sky: #38BDF8; --color-comp-sky-muted: #082F49;
  --color-comp-fuchsia: #E879F9; --color-comp-fuchsia-muted: #4A044E;
  --gradient-warm: linear-gradient(135deg, #FF5A28, #FB7185);
  --gradient-cool: linear-gradient(135deg, #3EA6FF, #2DD4BF);
  --gradient-brand: linear-gradient(135deg, #FF5A28, #3EA6FF);
  --gradient-neutral: linear-gradient(180deg, #212121, #0F0F0F);
  --gradient-vivid: linear-gradient(135deg, #A78BFA, #E879F9, #FB7185);
  --gradient-ocean: linear-gradient(135deg, #38BDF8, #2DD4BF);
}
```

### Legacy Theme

```css
[data-theme="legacy"] {
  --color-primary: #FF6600; --color-primary-hover: #cc5200; --color-primary-muted: #fff5eb;
  --color-secondary: #169dd6; --color-brand: #2494F2;
  --color-bg: #F1F1F1; --color-bg-alt: #e6e6e6;
  --color-surface: #FFFFFF; --color-surface-hover: #f7f7f7; --color-surface-active: #e6e6e6;
  --color-border: #e6e6e6;
  --color-text-heading: #333333; --color-text-body: #666666; --color-text-muted: #999999;
  --color-success: #008000; --color-success-muted: #e6f5e6;
  --color-warning: #FF6600; --color-warning-muted: #fff5eb;
  --color-danger: #C40000; --color-danger-muted: #fce8e8;
  --color-sidebar-bg: #272930; --color-sidebar-text: #c9d4f6;
  --color-sidebar-text-active: #FFFFFF; --color-sidebar-hover: #2A2C34;
  --color-sidebar-section: #1e2025;
  --color-table-stripe: rgba(0, 0, 0, 0.03);
  --color-topnav-bg: #FFFFFF; --color-topnav-text: #333333;
  --color-topnav-text-muted: #169dd6; --color-topnav-border: #e6e6e6;
  --color-topnav-badge-bg: #169dd6; --color-topnav-badge-text: #FFFFFF;
  --color-ageing-current: #00FF66; --color-ageing-1-30: #0099FF;
  --color-ageing-31-60: #6600FF; --color-ageing-61-90: #FFE600;
  --color-ageing-91-120: #FF6600; --color-ageing-120-plus: #FF001A;
  --color-comp-violet: #7C3AED; --color-comp-violet-muted: #EDE9FE;
  --color-comp-teal: #0D9488; --color-comp-teal-muted: #CCFBF1;
  --color-comp-rose: #E11D48; --color-comp-rose-muted: #FFE4E6;
  --color-comp-sky: #0284C7; --color-comp-sky-muted: #E0F2FE;
  --color-comp-fuchsia: #C026D3; --color-comp-fuchsia-muted: #FAE8FF;
  --gradient-warm: linear-gradient(135deg, #FF5A28, #E11D48);
  --gradient-cool: linear-gradient(135deg, #1462D2, #0D9488);
  --gradient-brand: linear-gradient(135deg, #FF5A28, #1462D2);
  --gradient-neutral: linear-gradient(180deg, #FFFFFF, #EBEBF3);
  --gradient-vivid: linear-gradient(135deg, #7C3AED, #C026D3, #E11D48);
  --gradient-ocean: linear-gradient(135deg, #0284C7, #0D9488);
}
```

---

## Tailwind Palette

The project imports `tailwind-palette.css` which provides 242 CSS custom properties (`--tw-{color}-{shade}`) for every Tailwind colour. Use for data visualisation and ageing chart tokens. Reference `--tw-*` vars inside semantic token definitions only, never directly in components.

---

## Light ↔ Dark ↔ Night Mapping

| Light Mode | Dark Mode | Night Mode | Notes |
|---|---|---|---|
| `--lm-orange` | `--dm-orange` | `--nm-orange` | Same `#FF5A28` across all three |
| `--lm-light-orange` | `--dm-orange-muted` | `--nm-orange-muted` | Subtle dark orange tint |
| `--lm-electric-blue` | `--dm-electric-blue` | `--nm-electric-blue` | `#3EA6FF` YouTube blue |
| `--lm-brand-blue` | `--dm-brand-blue` | `--nm-brand-blue` | `#8AB4F8` Google blue |
| `--lm-white` (bg) | `--dm-surface-0` | `--nm-surface-0` | `#0F0F0F` YouTube near-black |
| `--lm-light-blue` (bg) | `--dm-surface-1` | `--nm-surface-1` | `#212121` YouTube card |
| `--lm-midnight-blue` (headings) | `--dm-text-primary` | `--nm-text-primary` | `#F1F1F1` YouTube text |
| `--lm-neutral-text` (body) | `--dm-text-secondary` | `--nm-text-secondary` | `#AAAAAA` YouTube secondary |

---

## Contrast References

### Dark Mode

| Pairing | Ratio |
|---|---|
| Text Primary on Surface 0 | ~14.5:1 |
| Text Primary on Surface 1 | ~12.2:1 |
| Text Secondary on Surface 0 | ~7.0:1 |
| Orange on Surface 0 | ~5.1:1 |
| Electric Blue on Surface 0 | ~4.8:1 |
| Text Muted on Surface 1 | ~4.7:1 |

### Night Mode

| Pairing | Ratio |
|---|---|
| Text Primary on Surface 0 | ~18.3:1 |
| Text Primary on Surface 1 | ~12.1:1 |
| Text Secondary on Surface 0 | ~8.3:1 |
| Orange on Surface 0 | ~5.7:1 |
| Electric Blue on Surface 0 | ~7.9:1 |
| Text Muted on Surface 1 | ~3.5:1 (AA-large, 18px+ only) |

---

## Logo Assets

### Hosted URLs (HubSpot CDN)

| Variant | URL |
|---|---|
| Rectangle — Colour | `https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/rectangle_logo_orange_ezycollect_by_sidetrade.png` |
| Rectangle — White | `https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/rectangle_logo_white_ezycollect_by_sidetrade.png` |
| Square — Colour | `https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/square_logo_orange_ezycollect_by_sidetrade.png` |
| Square — White | `https://3936426.fs1.hubspotusercontent-na1.net/hubfs/3936426/Marketing%20Assets/Logos%20-%20by%20Sidetrade/square_logo_white_ezycollect_by_sidetrade.svg` |

### Self-Hosted Paths (for app usage)

| Variant | Path |
|---|---|
| Rectangle — Colour | `/logos/rectangle-color.png` |
| Rectangle — White | `/logos/rectangle-white.png` |
| Square — Colour | `/logos/square-color.png` |
| Square — White | `/logos/square-white.svg` |

### Theme Pairing

| Theme | Rectangle | Square (favicon) |
|---|---|---|
| Light | `rectangle-color.png` | `square-color.png` |
| Dark | `rectangle-white.png` | `square-white.svg` |
| Night | `rectangle-white.png` | `square-white.svg` |
| Legacy | `rectangle-color.png` | `square-color.png` |

### Sizing

| Viewport | Logo Height | Navbar Height |
|---|---|---|
| LG (desktop) | 32px | 56px |
| MD (tablet) | 28px | 48px |
| SM/XS (mobile) | 24px | 44px |

---
name: presentation-html-implementation
description: >
  Technical implementation for standalone HTML presentations with PPTX export.
  CSS patterns, slide transitions, navigation, footer bar, theming, design
  toolkit (layered backgrounds, glassmorphism cards, staggered reveals), and
  HTML structure. Apply when building the HTML output of a presentation planned
  with the presentation skill. For PPTX export specifics, see pptx-export.
---

# Presentation HTML Implementation

Technical patterns for building standalone HTML presentations. Single file, zero external dependencies beyond Google Fonts and PptxGenJS CDN. All visual composition follows the **presentation** skill's planning. All theming follows **brand-design-system**.

---

## When to Use

Apply this skill when:
- Building the HTML/CSS/JS output of a planned presentation
- Implementing slide transitions, navigation, or theme switching
- Building the glassmorphism footer bar
- Creating layered background effects
- Implementing staggered reveal animations
- Integrating PPTX export via PptxGenJS

Do NOT use this skill for:
- Presentation strategy, narrative, or copy — see **presentation**
- PPTX API rules and validation — see **pptx-export**
- Brand colour tokens — see **brand-design-system**

---

## Core Rules

### 1. Single standalone HTML file

Zero external dependencies beyond Google Fonts and PptxGenJS CDN. Embedded CSS, JS, navigation, themes, and PPTX export. The file works when opened locally.

### 2. Slide-specific CSS, not shared layouts

Every slide gets its own class namespace (`.s0-wrap`, `.s3-bars`, `.s5-cards`). No generic `.content-slide` class that renders every slide the same way.

### 3. Light theme is always default

`data-theme="light"` on `<html>`. Footer toggle switches between light and night. All CSS uses theme-aware semantic tokens.

---

## HTML Structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentation Title</title>
  <link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js"></script>
  <style>/* Theme tokens + slide CSS + nav bar + animations */</style>
</head>
<body>
  <div class="deck" id="deck">
    <!-- Each slide: .slide div with layered bg, grid, glow orbs, content -->
  </div>
  <nav class="nav-bar"><!-- Glassmorphism footer --></nav>
  <script>/* Navigation, themes, PPTX export, touch/keyboard handlers */</script>
</body>
</html>
```

---

## Slide Transitions

```css
.slide {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide.active {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Navigation

| Input | Action |
|---|---|
| `ArrowRight`, `ArrowDown`, `Space` | Next slide |
| `ArrowLeft`, `ArrowUp` | Previous slide |
| `Home` / `End` | First / last slide |
| `F` | Toggle fullscreen |
| `Escape` | Exit fullscreen |
| `1`–`9` | Jump to slide |
| Click right 85% | Next slide |
| Click left 15% | Previous slide |
| Swipe left/right | Next / previous (touch) |

URL hash (`#slide-3`) persists position across reloads.

---

## Footer Bar (Glassmorphism)

```
┌─────────────────────────────────────────────────┐
│  Title   │  ═══════════════  │  ⤓ ☀ ⛶ ← 3/12 → │
│  logo    │   progress bar    │     controls       │
└─────────────────────────────────────────────────┘
```

- `backdrop-filter: blur(20px)` with `-webkit` prefix
- Round nav buttons (40px), hover turns accent
- Progress bar: 3px track, accent fill, smooth transition

---

## Design Toolkit

### Layered Backgrounds

Three visual layers for depth:
1. **Base:** Radial or linear gradient
2. **Grid pattern:** Thin lines at 2–3% opacity, 60px spacing
3. **Glow orbs:** Large circles with `filter: blur(120px)`, 6–15% opacity, accent-coloured

### Glassmorphism Cards

Containers for stats, bullets, info blocks:
- Border-radius 12–16px
- Subtle border (8% opacity dark, 7% light)
- Hover: border shifts to accent, `translateY(-4px)`, deeper shadow
- Optional accent top-line (`::before` with gradient)

### Kicker → Title → Subtitle Chain

- **Kicker:** 11–13px, weight 600, uppercase, letter-spacing 3px, accent
- **Title:** clamp(32px, 3.5vw, 48px), weight 700–800, letter-spacing -0.5px
- **Subtitle:** clamp(16px, 1.8vw, 22px), weight 300, muted, max-width 600px

### Stats as Large Numbers

- Icon (Phosphor, 28px, `weight="fill"`, accent)
- Value (36–48px, weight 800, accent)
- Label (11–13px, weight 600, uppercase, letter-spacing 1px, muted)

Never donut charts for simple percentages. Large numbers are cleaner.

### Staggered Reveals

```css
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
.active .reveal { opacity: 1; transform: translateY(0); }
.active .reveal.d1 { transition-delay: 0.1s; }
.active .reveal.d2 { transition-delay: 0.2s; }
.active .reveal.d3 { transition-delay: 0.3s; }
```

### Check Lists

Bullet items as cards with accent check icons, not plain text lists.

### Breathing Slides

Section dividers, single-phrase slides, or full-accent backgrounds. Reset attention between dense sections.

---

## Theming

- `data-theme="light"` default on `<html>`
- Footer toggle switches light ↔ night
- All slide CSS uses semantic tokens
- Standalone HTML embeds brand tokens as CSS custom properties (derive from **brand-tokens-reference**)
- PPTX palettes derive from the same tokens (strip `#` prefix per PptxGenJS)

---

## PPTX Export Integration

Follow **pptx-export** for all export implementation. Key integration points:

- Use PptxGenJS from CDN (`cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@3.12.0/dist/pptxgen.bundle.js`)
- Every slide exports with proper cards, positioning, and theme colours
- `fontFace: 'Jost'` on every text element
- No `#` in hex colours
- Backgrounds use `{ color: '...' }` not `{ fill: '...' }`
- All elements within bounds (`x+w <= 10`, `y+h <= 5.625`)
- Logo on every slide (rectangle first/last, square watermark others)
- Pass the full **pptx-export** validation checklist before delivering

---

## Banned Patterns

- ❌ Generic shared layout classes (`.content-slide`) → each slide gets its own CSS namespace
- ❌ Dark theme as default → light is always default
- ❌ External CSS/JS dependencies beyond Fonts and PptxGenJS → single standalone file
- ❌ Missing keyboard navigation → full arrow/space/home/end/escape/F support
- ❌ Missing touch navigation → swipe left/right support
- ❌ Missing theme toggle → footer must have light ↔ night switch
- ❌ PPTX export without validation → pass pptx-export checklist before delivering
- ❌ Hardcoded colours instead of semantic tokens → all CSS uses `var(--color-*)` or theme-derived values
- ❌ Missing URL hash persistence → `#slide-N` must survive reload

---

## Quality Gate

Before delivering, verify:

- [ ] Single HTML file, opens locally with no server
- [ ] Arrow keys, Space, click, and swipe navigation all work
- [ ] Theme toggle switches cleanly between light and night
- [ ] Fullscreen works (F key and button)
- [ ] URL hash persists slide position across reload
- [ ] Footer shows progress bar, controls, and title
- [ ] Every slide has its own CSS namespace (no shared layout classes)
- [ ] All CSS uses semantic tokens — no hardcoded colours
- [ ] Staggered reveals work with correct delays
- [ ] Touch swipe works on mobile
- [ ] PPTX export produces styled slides (pass pptx-export validation checklist)

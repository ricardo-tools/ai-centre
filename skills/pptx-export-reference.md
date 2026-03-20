---
name: pptx-export-reference
type: reference
companion_to: pptx-export
description: >
  Quality gate checklist and spacing constants for PPTX export.
  Reference companion — for rules see pptx-export.
---

# PPTX Export Reference

> **Companion to [pptx-export](pptx-export.md).** This file contains the quality gate checklist
> and spacing/layout constants. For rules and principles, see the main skill.

---

## Spacing Grid & Constants

Standard positioning constants for consistent slide layouts:

```
M  = 0.7"          // Edge margin
CW = 8.6"          // Content width (10" - 2xM)
KY = 0.45"         // Kicker Y
TY = 0.85"         // Title Y
SY = 1.55"         // Subtitle Y
BY = 2.55"         // Body content Y
IX = 1.5", IW = 7" // Inner centered text
```

Use `LAYOUT_16x9`. Slide dimensions: 10" x 5.625".

**Shadow factory** (must be a function, not a shared object — PptxGenJS mutates objects):
```js
const mkShadow = () => ({ type:'outer', blur:6, offset:2, angle:135, color:'000000', opacity:0.1 });
```

**PPTX theme palettes** are derived from the brand-design-system's semantic token mapping. Strip `#` from all hex values (PptxGenJS requirement). Build a light and dark palette object from the brand's `[data-theme="light"]` and `[data-theme="dark"]`/`[data-theme="night"]` token blocks.

**Safe margin constants:**
```
Max right edge:  x + w <= 9.3"  (0.7" right margin)
Max bottom edge: y + h <= 5.1"  (above footer area)
```

**Standard title container sizes (fontSize -> minimum h for 2 lines):**

| fontSize | 1 line h | 2 line h | Rule of thumb |
|---|---|---|---|
| 24px | 0.45" | 0.85" | Always use 0.85"+ for slide titles |
| 20px | 0.36" | 0.72" | Use 0.7"+ |
| 17px | 0.31" | 0.61" | Use 0.6"+ |
| 14px | 0.25" | 0.50" | Use 0.5"+ |

---

## Quality Gate

Run this checklist after completing the PPTX export function, before delivering:

**File integrity (prevents repair prompt):**
- [ ] Slide backgrounds use `sl.background = { color: '...' }` not `{ fill: '...' }`
- [ ] No invalid text properties (`letterSpacing`, `fontWeight`, `lineHeight` etc.)
- [ ] Shadow/option objects are created fresh per use (factory function, not shared const)
- [ ] `lineSpacingMultiple` values are >= 1.0
- [ ] Image `path` URLs are accessible (no CORS issues, no 404s)
- [ ] No `#` in hex colors; no opacity in hex strings (use `transparency` property)
- [ ] Fresh `new PptxGenJS()` instance
- [ ] `bullet: true` for bullets, not Unicode characters

**Element bounds (prevents zoom-out warning):**
- [ ] Every element: `x + w <= 10.0` and `y + h <= 5.625`
- [ ] Loop-generated elements: last item verified within bounds
- [ ] Content respects margin constants (right edge <= 9.3", bottom <= 5.1" to clear footer)

**Brand:**
- [ ] Every `addText` uses `fontFace: 'Jost'` (search the code — zero exceptions)
- [ ] All colors reference the palette object, no inline hex
- [ ] `footer()` called on every slide with correct section name and page number
- [ ] Rectangle logo prominent on title and closing slides (in addition to footer)
- [ ] Footer: logo (left), section (center-left), page number (right) — all present
- [ ] Palette matches brand-design-system tokens

**Design:**
- [ ] Each slide has one clear focal point (one element is largest/boldest)
- [ ] Kicker/title/subtitle chain uses consistent positioning across slides (KY, TY, SY constants)
- [ ] Cards are centered or deliberately positioned, not arbitrarily placed
- [ ] Negative space: content doesn't fill >70% of any slide's area
- [ ] Equivalent elements (all kickers, all titles, all card labels) share identical formatting
- [ ] Card groups are horizontally centered on the slide
- [ ] Child elements (circles, badges, icons) are mathematically centered within parent containers — both axes

**Vertical alignment:**
- [ ] Elements in a vertical flow share a common horizontal center axis
- [ ] Elements in a horizontal row share common Y positions for each internal layer

**Connectors/arrows:**
- [ ] Connectors do not overlap adjacent element bounding boxes
- [ ] Connectors are centered in the gap between elements on both axes

**Element pattern consistency:**
- [ ] Every element in a sibling group has the same set of visual properties (icon, badge, border, shadow)
- [ ] PPTX reproduces all visual elements from the HTML source (icons, badges, highlights) — not just text
- [ ] If HTML cards have icons, PPTX cards have icons (via `renderPhosphorIcon`)

**Text overflow:**
- [ ] No text element has content that exceeds its `(w, h)` allocation
- [ ] Title containers sized for wrapping (`h` accommodates 2 lines at the given `fontSize`)
- [ ] Titles in constrained-width areas (split layouts) checked for early wrapping
- [ ] Bullet items are under 70 characters each
- [ ] Card text is sized for its container width

**Element overlap:**
- [ ] No two independent element bounding boxes overlap
- [ ] Adjacent elements have >= 0.15" clearance
- [ ] Split-layout titles use column width, not `CW` (e.g., `w: 4.1` not `w: 8.6`)
- [ ] Loop-generated rows: `step >= element_h + 0.15`

**Image aspect ratio:**
- [ ] Every `addImage` preserves source aspect ratio (`w / h` matches source within 5%)
- [ ] Rectangle logo always uses 4:1 ratio (e.g., `w: 2, h: 0.5` or `w: 0.76, h: 0.19`)
- [ ] Footer logo is vertically centered with equal top/bottom padding

**Icons:**
- [ ] Prominent HTML icons exported via `renderPhosphorIcon()`
- [ ] Icon images are square (`w === h`) and centered within their containers
- [ ] `renderPhosphorIcon` called with full Phosphor class (`'ph ph-envelope-simple'`)
- [ ] Icon color passed as CSS hex with `#` prefix (not PptxGenJS stripped hex)

**Spatial balance:**
- [ ] Content group is vertically centered on slide (not top-anchored with bottom dead space)
- [ ] Bottom dead space is < 1.5" on every slide
- [ ] Split layouts: both halves have similar visual weight
- [ ] Empty areas on lighter side of splits are filled with supporting content or the layout is restructured

---
name: pptx-export
description: PptxGenJS export quality — brand fidelity, design-to-PPTX translation, text overflow prevention, file integrity, spatial balance, icon export, and validation checklist. Apply whenever generating PPTX slides from HTML presentations. Trigger on any request involving PPTX export, PowerPoint generation, or slide deck export. Required companions: brand-design-system, design-foundations, presentation.
---

# PPTX Export Quality

PPTX export is the most error-prone part of the pipeline. The HTML slide is the source of truth — the PPTX must faithfully reproduce it, not approximate it.

Always pair with **brand-design-system**, **design-foundations**, and **presentation**. For the quality gate checklist and spacing constants, see **pptx-export-reference**.

---

## When to Use

Apply this skill when:
- Exporting HTML presentations to PowerPoint format
- Writing PptxGenJS slide generation code
- Debugging PPTX "needs repair" errors or visual mismatches
- Validating PPTX output before delivery

Do NOT use this skill for:
- Presentation strategy, narrative, or copy — see **presentation**
- HTML implementation (transitions, navigation, footer) — see **presentation-html-implementation**
- Colour tokens — see **brand-design-system**

---

## Core Rules

### 1. The HTML slide is the source of truth

The PPTX faithfully reproduces the HTML, not approximates it. Same layout, same colours, same typography, same hierarchy.

### 2. Every text element uses `fontFace: 'Jost'`

Zero exceptions. PptxGenJS defaults to a different font if not specified. Every `addText` call must include `fontFace: 'Jost'`.

### 3. No `#` prefix in hex colours — no opacity in hex strings

PptxGenJS uses `'FF5A28'` not `'#FF5A28'`. The `#` causes silent rendering failures. For transparency, use the `transparency` property — never encode opacity in the hex string.

### 4. All elements must be within bounds

`x + w <= 10` and `y + h <= 5.625` (inches, standard 16:9). Out-of-bounds elements cause "zoom out to see all elements" warnings.

### 5. Backgrounds use `{ color: '...' }` not `{ fill: '...' }`

PptxGenJS slide background API is `{ color: 'HEX' }`. Using `{ fill: '...' }` silently fails — causes "needs repair" errors.

### 6. Never reuse option objects

PptxGenJS mutates option objects in place. Every `addText`, `addShape`, `addImage` call must receive a fresh object literal. Use factory functions for shadows and repeated styles.

### 7. Only valid PptxGenJS text properties

No CSS properties (`letterSpacing`, `fontWeight`, `lineHeight`, `gap`, `padding`). If a property doesn't appear in PptxGenJS docs, don't use it — it produces invalid XML.

### 8. `lineSpacingMultiple` must be >= 1.0

Values below 1.0 corrupt the XML. For tighter spacing, use `paraSpaceBefore` / `paraSpaceAfter`.

### 9. Fresh instance per export

Create a fresh `new PptxGenJS()` per export call. Use `bullet: true` for bullets, never Unicode bullet characters.

---

## 1. Brand Fidelity

The PPTX must match the brand design system exactly. Every export must use:

**Typography:**
- **Font: Jost** — the brand typeface. Use `fontFace: 'Jost'` for ALL text elements. Never use Calibri, Arial, or any other font unless the presentation is explicitly non-branded.
- If Jost is not installed on the target system, the PPTX viewer will substitute. This is acceptable — the file itself must specify Jost.
- Weight mapping: PptxGenJS uses `bold: true/false` — use `bold: true` for weights 600+ (semibold, bold, extrabold). For fine-grained control, use `fontWeight` where supported.

**Colors:**
- Derive ALL colors from the brand-design-system tokens. Build a palette object at the top of the export function.
- Never hardcode colors inline — always reference the palette object (`P.accent`, `P.text`, `P.muted`, etc.).
- Remember: strip `#` from all hex values (Core Rule 3).

**Logos:**
- Title slide (first) and closing slide (last): rectangle logo, prominently sized (~2" wide).
- All slides include the rectangle logo in the footer (see Footer section below).
- Use theme-aware logo URLs from the brand-design-system skill.

**Footer bar (every slide):**
- A thin, clean footer strip at the very bottom of every slide — including title and closing slides.
- Positioned at `y: 5.25` with height `0.375"`. Separated from content by a subtle 0.5pt border line in `P.border`.
- **Left:** Small rectangular logo close to the left edge (`x: 0.35`). Logo must maintain its original aspect ratio (see Image Aspect Ratio section). Vertically centered in the footer: `logoY = fy + (fh - logoH) / 2`. Top and bottom padding must be equal.
- **Center-left:** Section name in muted text (`fontSize: 7.5`, `fontFace: 'Jost'`, `color: P.muted`). Starts after logo with a small gap (`x: fx + logoW + 0.2`).
- **Right:** Page number as `"N / TOTAL"` close to the right edge, right-aligned with right padding (~0.35" from slide edge).
- Create a `footer(sl, section, pageNum)` helper function. Call it on every slide.
- Section names should describe the current content area (e.g., "Overview", "Configuration — Step 2 of 4", "Deployment", "Troubleshooting"). Keep them short.
- Store `TOTAL_SLIDES` as a constant at the top of the export function.
- **Content clearance:** All slide content must end above `y: 5.1"` to maintain at least 0.15" clearance before the footer line. Audit any elements near the bottom.

**Self-check before writing any PPTX code:**
1. Is `fontFace` set to `'Jost'` on every `addText` call? (Search for `fontFace` — every instance must say `Jost`)
2. Are all colors referencing the palette object, not inline hex?
3. Does every slide call `footer(sl, section, pageNum)`?
4. Are logos prominent on first/last slides (in addition to the footer)?
5. Does the palette object match the brand-design-system tokens exactly?

---

## 2. Design Translation

The same design principles from the design-foundations skill apply to PPTX slides. The medium is different (inches instead of pixels, no CSS grid/flexbox) but the principles are identical.

**Translating design concepts to PPTX elements:**

| Design Concept | HTML Implementation | PPTX Translation |
|---|---|---|
| **Visual hierarchy** | Font size, weight, color via CSS | `fontSize`, `bold`, `color` properties on `addText`. Maintain the same relative scale ratios. |
| **Negative space** | Padding, margin, gap | X/Y positioning with deliberate gaps. Don't fill every inch — leave breathing room. Content should occupy 50-70% of the slide, not 90%. |
| **Alignment (horizontal + vertical)** | Flexbox, grid, text-align, align-items | Shared X positions AND shared Y positions. Horizontal: kicker, title, body share `x: M`. Vertical: elements in a row share a common `y` or vertical center. Both axes are equally important — per the design-foundations skill's bidirectional alignment principle. |
| **Consistency** | Shared CSS classes, variables | Shared helper functions (e.g., `kicker()`, `footer()`, `stepKicker()`). Same `fontSize`, `fontFace`, `color` values for equivalent elements. If one card has an icon, ALL cards have icons — per the design-foundations skill's element pattern consistency rules. |
| **One focal point** | Size, color, position emphasis | One element per slide should be noticeably larger or bolder. If a slide has a hero number, make it 36px+. If it has a headline, make it 20-24px while body is 11-13px. |
| **Cards / containers** | `border-radius`, `background`, `box-shadow` | `ROUNDED_RECTANGLE` shape with `fill`, `rectRadius`, `shadow`, and `line` (border). Position text elements inside the shape bounds. |
| **Spacing rhythm** | 8px base unit | 0.08" base unit in PPTX. Gaps between cards: 0.16-0.24". Section gaps: 0.4-0.6". Margins: 0.7". |

**PPTX-specific composition rules:**
- **Horizontal element groups** (cards in a row): Calculate total width = `(card_count * card_width) + ((card_count - 1) * gap)`. Center the group on the slide: `start_x = (10 - total_width) / 2`. Don't left-align card groups at the margin — center them.
- **Vertical stacking**: Use consistent Y increments. If items are 0.45" tall with 0.15" gaps, the Y positions form an arithmetic sequence: `start_y + i * 0.6`.
- **Card content positioning**: Text inside a card shape must be inset from the card edges. If the card is at `(x, y, w, h)`, text should be at `(x + 0.2, y + 0.15, w - 0.4, h - 0.3)` minimum.
- **Centering child elements within containers**: When placing a shape, image, or badge inside a card, **always calculate the centered position mathematically**. Never eyeball or hardcode offsets. Formula: `childX = parentX + (parentW - childW) / 2`. This applies to:
  - Icon circles centered in card columns
  - Badge pills centered at the bottom of cards
  - Images centered in containers
  - Any element that should be horizontally or vertically centered within a parent shape
- **Slide balance**: Don't cluster all content in the top-left. Use the full slide canvas — distribute elements across the available space.

**Vertical alignment in PPTX:**

Per the design-foundations skill's bidirectional alignment principle, vertical alignment in PPTX requires the same rigor as horizontal:

- Elements at the same conceptual level share a `y` position. If 4 cards are in a row, all icons start at the same `y`, all titles start at the same `y`, all badges start at the same `y`.
- When a circle/icon and adjacent text should be vertically centered with each other: `iconY = textY + (textH - iconH) / 2` or use the same `valign: 'middle'` `y` and `h`.
- Vertical flow diagrams (step 1 -> arrow -> step 2): arrows must be horizontally centered under/over the steps. Use `arrowX = stepX + (stepW - arrowW) / 2`.

**Connector/arrow positioning in PPTX:**

Per the design-foundations skill's connector rules, arrows in PPTX occupy dedicated space:

- Arrows between cards occupy a dedicated gap. If cards are at `x: 0.7, 2.5, 4.3, 6.1` each `w: 1.5`, the gaps are `0.3"` wide (from `0.7+1.5=2.2` to `2.5`). The arrow goes at `x: 2.2 + (0.3 - arrowW) / 2` — centered in the gap.
- Arrow vertical position: centered on the card's vertical midline: `arrowY = cardY + (cardH - arrowH) / 2`.
- Never position an arrow element so that its bounding box overlaps a card's bounding box.

**Cross-medium consistency (HTML -> PPTX):**

When translating an HTML slide to PPTX, the PPTX must reproduce the same visual elements. If the HTML card has an icon, the PPTX card must have an icon (via `renderPhosphorIcon`). If the HTML has 5 items with icons, the PPTX must have 5 items with icons — not 5 items with just text.

---

## 3. Text Overflow Prevention

**This is the most common PPTX issue.** PptxGenJS does not auto-shrink text or warn when text exceeds its container. If text overflows, it either gets clipped or bleeds into adjacent elements.

**Prevention process:**

**A. Calculate text capacity before writing:**
- A single character at 12px in Jost is roughly 0.065" wide.
- A line at fontSize `F` is roughly `F * 0.065"` wide per character.
- Container capacity (chars per line) = `container_width / (fontSize * 0.0055)` (approximate).
- Lines that fit = `container_height / (fontSize * 0.018)` (approximate, accounting for line spacing).

**B. Design text containers for worst-case content:**
- Titles (20-24px): Allow `w: 7-8"` and `h: 0.6-0.8"` — accommodates ~2 lines of wrapping.
- Subtitles (12-14px): Allow `w: 5-6"` and `h: 0.5-0.7"`.
- Card text (11-13px): If the card is `w: 3.5"`, text inside is `w: 3.1"` — that's ~45 characters per line. Write copy to fit.
- Bullet items: Max 60-70 characters per bullet at 11-13px in a `w: 7-8"` container.

**C. Adapt copy to containers, not containers to copy:**
- If a bullet is too long for the container, **shorten the bullet text**. Don't shrink the font or expand the container (which breaks the layout).
- If a title wraps to 3+ lines in PPTX, **rewrite it shorter**. PPTX titles should be 1-2 lines max.
- For data-heavy slides (config tables, comparison grids), reduce font size to 10-11px and use abbreviations.

**D. The overflow audit (run after building each slide):**
For every `addText` call, mentally verify:
1. Does the text fit within `(w, h)` at this `fontSize`?
2. If the text wraps, is `h` tall enough for the wrapped lines?
3. Does the text element overlap with any adjacent element's `(x, y, w, h)` bounding box?
4. Is there at least 0.1" clearance between this element and its nearest neighbor?

**E. Title containers MUST accommodate wrapping — the #1 visual defect:**
When a title wraps to a second line but its container `h` only fits one line, the text bleeds upward or downward beyond the box. In PPTX viewers, clicking the element reveals the container boundary and the overflow is obvious.

**The rule:** For any title or heading text, calculate the worst-case line count and size `h` accordingly:
```
lines_needed = ceil(char_count / chars_per_line)
chars_per_line = container_w / (fontSize * 0.0055)
min_h = lines_needed * fontSize * 0.018
```

See **pptx-export-reference** for the standard title container sizes table.

**When width is constrained** (e.g., split layouts where title is only `w: 4.5"` instead of full `w: 8.6"`), text wraps much earlier. A 50-character title that fits on one line at `w: 8.6"` may wrap to 2 lines at `w: 4.5"`. Always recalculate when width is reduced.

**The fix priority:**
1. First, try shortening the title copy to avoid wrapping entirely
2. If the content can't be shortened, increase `h` to fit the wrapped lines
3. If increasing `h` would push body content too low, reduce `fontSize` by 1-2px
4. Never leave `h` too small and hope the text fits — measure it

---

## 4. File Integrity — Code Examples

These examples illustrate Core Rules 5–8. Violating them corrupts the PPTX XML.

**Slide backgrounds (Core Rule 5):**
```js
// WRONG — causes repair prompt
sl.background = { fill: 'FAFAFA' };
// CORRECT
sl.background = { color: 'FAFAFA' };
```

**Mutable objects (Core Rule 6):**
```js
// WRONG — shadow mutated on first use, corrupts subsequent slides
const shadow = { type:'outer', blur:4, offset:1, color:'000000', opacity:0.08 };
sl1.addShape(pptx.shapes.RECT, { ..., shadow });
sl2.addShape(pptx.shapes.RECT, { ..., shadow }); // shadow was mutated!

// CORRECT — factory function returns fresh object each time
const mkShadow = () => ({ type:'outer', blur:4, offset:1, angle:135, color:'000000', opacity:0.08 });
sl1.addShape(pptx.shapes.RECT, { ..., shadow: mkShadow() });
```

**Valid text properties (Core Rule 7):**
- Valid: `fontSize`, `fontFace`, `color`, `bold`, `italic`, `underline`, `align`, `valign`, `lineSpacingMultiple`, `paraSpaceBefore`, `paraSpaceAfter`, `bullet`, `margin`, `wrap`, `shrinkText`, `transparency`
- Invalid (CSS properties — will corrupt): `letterSpacing`, `fontWeight`, `textDecoration`, `lineHeight`, `gap`, `padding`

**Image references — prefer `data` over `path`:**
- `path` fetches remote URLs at export time. If the fetch fails (CORS, timeout, 404), the PPTX has a broken image reference that triggers repair.
- For logos and known assets, prefer pre-fetching and using `data` (base64).

---

## 5. Element Bounds — Preventing "Zoom Out to See All Elements"

Every element must fit within the slide canvas (default: 10" x 5.625" for 16:9). Elements that exceed these bounds cause the "zoom out to see all content" warning.

**The bounds rule:** For every element, verify: `x + w <= 10.0` and `y + h <= 5.625`.

**How to enforce this:**

**A. Add a bounds-checking helper at the top of the export function:**
```js
const SW = 10, SH = 5.625;
function chk(x, y, w, h) {
  if (x + w > SW || y + h > SH) console.warn(`OOB: (${x},${y}) ${w}x${h} exceeds ${SW}x${SH}`);
}
```
Call `chk()` for every `addText`, `addShape`, and `addImage` during development. Remove or keep as a silent guard in production.

**B. Common overflow patterns:**

| Pattern | Risk | Fix |
|---|---|---|
| Loop-generated cards: `x = M + i * step` | Last item may exceed right edge | Calculate max: `M + (count-1)*step + cardWidth <= 10` |
| Two-column layout: `x = M + col * offset` | Right column + width > 10" | Verify `M + offset + colWidth <= 10` |
| Stacked items: `y = startY + i * step` | Bottom items exceed 5.625" | Verify `startY + (count-1)*step + itemHeight <= 5.625` |
| Watermark/logo in corner | Positioned too close to edge | Keep 0.1" minimum from all slide edges |

See **pptx-export-reference** for safe margin constants.

**C. Dynamic content bounds audit:**
For any `forEach` loop that positions elements:
1. Calculate the position of the **last** element in the loop
2. Add its width/height
3. Verify the result is within bounds
4. If it overflows, reduce card size, gap, or element count — don't just let it clip

---

## 6. Spatial Balance — Preventing Dead Space and Top-Heavy Layouts

PPTX slides frequently suffer from content clustering in the top-left quadrant with large empty voids at the bottom or on one side. This is not "negative space" — it's dead space that makes the slide look incomplete.

**A. Vertical centering of content groups:**
The content block (kicker through last body element) should be vertically centered on the slide canvas, not anchored to the top. Calculate the content group height, then position it so there's roughly equal space above and below:
```
content_top = first_element_y
content_bottom = last_element_y + last_element_h
content_height = content_bottom - content_top
center_y = (5.625 - content_height) / 2
offset = center_y - content_top
```
Apply `offset` to all Y positions. If the content block is 3.5" tall, it should be centered around y=1.06" to y=4.56", not sitting at y=0.35" to y=3.85" with 1.8" of dead space below.

**Exception:** Title slides and slides with footer-area elements may intentionally use top-weighted positioning.

**B. Split layout balance — filling the lighter side:**
When a slide has a split layout (text left, visual right — or vice versa), one side often has less content. A 2-line title + 1-line subtitle on the left vs. a 4" tall card on the right creates a visual imbalance.

**Remediation strategies (pick the best fit):**
1. **Add supporting detail text** below the title on the lighter side — a 2-3 line explanatory paragraph that adds context and fills the vertical space
2. **Add a secondary visual element** — a small stat callout, a key-value badge, or an accent shape that anchors the lighter area
3. **Redistribute content** — move elements from the heavier side to the lighter side to equalize
4. **Use a full-width layout instead** — if one side can't carry enough content, don't force a split. Center the content and stack vertically
5. **Increase the text element dimensions** — give title and subtitle more height and use `valign: 'middle'` to visually center them within the taller container, spreading them across the vertical space

**The test:** Draw a vertical line down the middle of the slide. Does each half have roughly similar visual weight? If one side is 80% empty and the other is 80% full, the layout needs rebalancing.

**C. Bottom dead space:**
After positioning all elements, check: is there more than 1.5" of empty space at the bottom of the slide (below the last element, above the 5.625" edge)? If yes, the content group should be shifted down or the layout should be rethought.

**D. The balance audit (run per slide after positioning):**
1. What is the Y position of the bottom edge of the last element?
2. How much empty space is below it? (`5.625 - bottom_edge`)
3. How much empty space is above the first content element? (`first_element_y`)
4. Is the ratio roughly balanced? (Bottom gap should be within 0.5" of top gap)
5. For split layouts: does each half have content that spans at least 60% of its vertical space?

---

## 7. Image Aspect Ratio — Preventing Logo/Image Deformation

**Rule:** Every `addImage` call must preserve the original image's aspect ratio. PptxGenJS stretches images to fit the given `(w, h)` — if the ratio doesn't match the source, the image is deformed.

**Process:**
1. **Know the source ratio.** For brand logos, the aspect ratios are fixed:
   - Rectangle logo (ezyCollect by Sidetrade): **4:1** (`w / h = 4.0`). Examples: `w: 2, h: 0.5` or `w: 0.76, h: 0.19`.
   - Square logo: **1:1** (`w / h = 1.0`). Examples: `w: 0.4, h: 0.4`.
   - For other images, check the source dimensions and compute `ratio = width / height`.
2. **Size from one dimension.** Decide the desired width OR height, then calculate the other: `h = w / ratio` or `w = h * ratio`. Never set both independently.
3. **Audit after writing.** For every `addImage` call, verify: `w / h` matches the source ratio within 5%.

**Common mistake:** Copying logo dimensions from a different context (e.g., HTML `img` tag with CSS `object-fit: contain`) and pasting into PPTX where there's no such property.

---

## 8. Element Overlap — Preventing Bounding Box Collisions

**Rule:** No two independent element bounding boxes should overlap or touch. Even if the visible text or shape doesn't fill its full container, overlapping containers look broken when selected in PowerPoint and create unpredictable rendering.

**Minimum clearance:** 0.15" between any two adjacent elements (edge-to-edge, not center-to-center).

**How overlaps happen:**
1. **Full-width text + side card:** A title with `w: CW (8.6")` spans the full content width. A card shape on the right side starts at `x: 5.1`. The title container extends past the card's left edge even though the title text itself only occupies the left portion. **Fix:** Restrict the title `w` to stop before the card: `w: 4.1` (leaving 0.2" gap before card at x: 5.1).
2. **Tight title-subtitle stacking:** Title at `y: 0.75, h: 0.7` ends at `y: 1.45`. Subtitle at `y: 1.5` leaves only 0.05" gap. **Fix:** Move subtitle to `y: 1.6` for 0.15" clearance.
3. **Loop-generated elements:** Cards or rows positioned with `y: start + i * step` can overlap if `step < element_height`. Verify: `step >= h + 0.15`.

**The overlap audit (run per slide after positioning):**
For every element, compute its bounding box `(x, y, x+w, y+h)`. Check each pair of elements on the same slide:
1. Do their bounding boxes overlap? (Two rectangles overlap if `x1 < x2+w2 && x1+w1 > x2 && y1 < y2+h2 && y1+h1 > y2`)
2. If they share a horizontal or vertical edge, is the gap >= 0.15"?
3. **Exception:** Text elements intentionally placed *inside* a shape (e.g., card label inside a card shape) are expected to overlap — the text is a child of the shape conceptually.

**Split layout rule:** When a slide has a left content column and a right visual (card/panel), the title and subtitle must be constrained to the left column width. Never use `w: CW` for titles on split-layout slides.

---

## 9. Icon Export — Converting Phosphor Icons to PPTX Images

PptxGenJS cannot render web fonts or CSS icon libraries. Phosphor Icons used in HTML slides must be converted to raster images (PNG data URIs) at export time.

**The `renderPhosphorIcon` utility:**

A standalone function defined outside `exportPPTX()` that converts any Phosphor Icon class to a PNG data URI:

```js
function renderPhosphorIcon(iconClass, color, sizePx) {
  const s = sizePx || 64;
  const el = document.createElement('i');
  el.className = iconClass;
  el.style.cssText = 'position:absolute;left:-9999px;font-size:' + s + 'px';
  document.body.appendChild(el);
  const style = getComputedStyle(el, '::before');
  const char = style.content.replace(/['"]/g, '');
  const font = style.fontFamily;
  document.body.removeChild(el);
  const can = document.createElement('canvas');
  can.width = s * 2; can.height = s * 2;
  const ctx = can.getContext('2d');
  ctx.font = s * 2 + 'px ' + font;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = color || '#1A1B2E';
  ctx.fillText(char, s, s);
  return can.toDataURL('image/png');
}
```

**Usage in PPTX export:**
```js
const iconData = renderPhosphorIcon('ph ph-envelope-simple', '#' + P.accent);
sl.addImage({ data: iconData, x: icoX, y: icoY, w: icoS, h: icoS });
```

**When to use icon export:**
- Any slide where the HTML version uses Phosphor Icons as **prominent visual elements** (e.g., icons inside cards, icon circles, feature icons)
- Do NOT convert icons used as inline decorations (e.g., small icons next to text bullets) — these can be omitted or replaced with Unicode symbols in PPTX
- Icons rendered at 1:1 aspect ratio — always use `w === h` for icon images

**Icon centering within containers:**
When placing an icon image inside a circle or card, calculate the centered position:
```js
const icoS = 0.32; // icon size (square)
const icoX = circX + (circW - icoS) / 2;
const icoY = circY + (circH - icoS) / 2;
```

**Review checklist for icon export:**
1. Does the HTML slide have prominent icons? -> If yes, are they exported?
2. Is `renderPhosphorIcon` called with the correct Phosphor class name (e.g., `'ph ph-envelope-simple'`, not just `'envelope-simple'`)?
3. Is the icon color passed as a hex string with `#` (the function expects a CSS color, not a PptxGenJS color)?
4. Is the icon image sized as a square (`w === h`)?
5. Is the icon centered within its container using the centering formula?

---

## Standards

- Use raw hex without `#` prefix for all PptxGenJS colour strings (`'FF6B00'` not `'#FF6B00'`). Not: `#` prefix in hex colour strings
- Use the separate `transparency` property for opacity control. Not: opacity encoded in hex strings
- Use the `color` property for text colour. Not: the `fill` property for text colour
- Keep all content within safe zone margins (see **pptx-export-reference**). Not: elements outside safe zone margins
- Calculate max characters per line and handle text overflow for every text element. Not: text without overflow handling
- Test every generation with `pptx.writeFile()` to produce a valid, openable file. Not: skipping file validation

---

## Quality Gate

See **pptx-export-reference** for the full verification checklist. Quick checks:

- [ ] File opens without repair prompt in PowerPoint, Keynote, and Google Slides
- [ ] No `#` prefix in any hex colour string
- [ ] All elements within safe zone margins
- [ ] Text does not overflow any container
- [ ] Brand colours match the token values exactly
- [ ] Fonts are embedded or use system fallbacks

---
name: print-design
description: Print-ready design principles — bleed/trim/safe zone system, export requirements, typography for print, QR codes, and standard format reference. Apply this skill whenever creating any design intended for physical printing (business cards, flyers, brochures, posters, stickers, packaging, etc.). Trigger on any request mentioning "print", "PDF export", "bleed", "trim", "safe zone", "CMYK", "DPI", or any physical print format.
---

# Print Design

Universal principles for creating print-ready designs. These rules apply to any printed format — business cards, flyers, brochures, posters, stickers, packaging, and more.

## The Three-Zone System

Every print design operates on three concentric zones. Understanding these is non-negotiable for print work.

### 1. Bleed Zone (outermost)

The bleed extends **beyond the final cut line** on all sides. It exists because cutting machines have slight variance — without bleed, you'd see thin white strips at the edges.

- **Purpose:** Insurance against cutting inaccuracy.
- **What goes here:** Backgrounds, decorative elements, color fills, patterns, images that should extend to the edge.
- **Standard bleed:** 3–5 mm per side (5 mm is safest; some printers accept 3 mm).
- **Rule:** Any element that touches the trim edge must extend all the way to the bleed edge.

### 2. Trim Zone (middle)

The trim line is where the paper is physically cut. This is the **final size** of the printed piece — what the recipient holds in their hand.

- **Purpose:** Defines the actual dimensions of the finished product.
- **What goes here:** This is a conceptual boundary, not a zone you design into. Nothing should be placed exactly on the trim line.
- **Rule:** Never place important content at the trim line — it may be cut off.

### 3. Safe Zone (innermost)

The safe zone sits **inside the trim**, providing a margin of safety. All readable content, logos, QR codes, barcodes, and functional elements must stay within this boundary.

- **Purpose:** Ensures nothing important gets cut off or sits uncomfortably close to the edge.
- **Standard inset:** 3–5 mm inside the trim (4 mm is standard for most formats).
- **What goes here:** ALL text, logos, QR codes, barcodes, contact information, and any element the reader needs to see.
- **Rule:** Absolutely nothing functional or readable outside this zone.

### Zone Calculation Formula

For any print format:

```
Bleed dimensions = Trim dimensions + (2 × bleed margin)
Safe dimensions  = Trim dimensions - (2 × safe inset)
```

**Example — Standard business card (90 × 55 mm, 5 mm bleed, 4 mm safe inset):**
| Zone | Dimensions |
|------|-----------|
| Bleed | 100 × 65 mm |
| Trim | 90 × 55 mm |
| Safe | 82 × 47 mm |

### Common Print Format Reference

| Format | Trim Size | Bleed Size (5mm) | Safe Zone (4mm inset) |
|--------|-----------|-------------------|----------------------|
| Business card | 90 × 55 mm | 100 × 65 mm | 82 × 47 mm |
| Business card (US) | 89 × 51 mm | 99 × 61 mm | 81 × 43 mm |
| DL flyer | 99 × 210 mm | 109 × 220 mm | 91 × 202 mm |
| A6 flyer | 105 × 148 mm | 115 × 158 mm | 97 × 140 mm |
| A5 flyer | 148 × 210 mm | 158 × 220 mm | 140 × 202 mm |
| A4 flyer/brochure | 210 × 297 mm | 220 × 307 mm | 202 × 289 mm |
| A3 poster | 297 × 420 mm | 307 × 430 mm | 289 × 412 mm |
| Square sticker (50mm) | 50 × 50 mm | 60 × 60 mm | 42 × 42 mm |

## Screen-to-Print Conversion

When designing for print in a screen-based tool (HTML/CSS, Figma, etc.), establish a consistent **pixels-per-millimeter** ratio and stick to it throughout the design.

### Recommended Scale: 5 px/mm

This produces clean integer dimensions and sufficient detail for export.

| Print mm | Screen px |
|----------|-----------|
| 1 mm | 5 px |
| 3 mm | 15 px |
| 5 mm | 25 px |
| 10 mm | 50 px |
| 55 mm | 275 px |
| 90 mm | 450 px |

At 5 px/mm, exporting at **4× scale** yields ~508 DPI — well above the 300 DPI minimum for professional print.

### Two-Box Architecture

When implementing print designs in code (HTML/CSS, React, etc.), use a two-box model:

1. **Outer box (Bleed Box):** The full bleed dimensions. All design elements render here — backgrounds, decorative shapes, images that bleed to edges.
2. **Inner box (Content Box):** Positioned at the trim area with internal padding equal to the safe inset. All readable content goes here.

For screen display, wrap the bleed box in a clip container sized to the trim dimensions (`overflow: hidden`). For export, capture the full bleed box.

## Export Requirements

### Resolution
- **Minimum:** 300 DPI for professional print.
- **Recommended:** 4× screen scale when designing at 5 px/mm (~508 DPI).
- **Photos/images:** Source images should be at least 300 DPI at their printed size. A 20mm-wide photo needs at least 236 px width (20 × 300 / 25.4).

### File Format
- **PDF** is the universal standard for print files. Always export as PDF.
- Vector elements remain scalable in PDF; raster elements should meet DPI requirements.
- Do not include trim marks, registration marks, or color bars — the print shop adds these.

### Color Space
- **Print uses CMYK.** Screen designs are RGB. Be aware that vibrant RGB colors (especially bright blues, oranges, and greens) may appear duller in CMYK.
- If your tool supports CMYK export, use it. If not (e.g. HTML-based), export at maximum quality RGB and note that colors will shift.
- Avoid large areas of solid black — use "rich black" (C:40 M:30 Y:30 K:100) for deep blacks in large areas.
- Neon/fluorescent colors do not reproduce in standard CMYK.

### Fonts
- **Embed all fonts** in the exported file. Missing fonts cause text reflow and substitution.
- Self-hosted/local fonts are safest for export tools (no external dependency).
- Convert text to outlines/paths as a last resort if embedding isn't possible.

### Images
- All images must be **local/embedded** — never reference external URLs in print files.
- External URLs may fail during export (CORS, network issues, tainted canvas in browser-based tools).
- Use high-resolution source images. Upscaling a low-res image will not improve print quality.

## Typography for Print

### Minimum Sizes
- **Body/contact text:** 7pt minimum (≈ 2.5 mm cap height, ≈ 9 px at 5 px/mm). Below this, text becomes illegible in print.
- **Fine print/legal:** 6pt absolute minimum — use sparingly and only for non-critical text.
- **Headings/names:** 10–16pt for standard formats. Should be readable at arm's length.

### Hierarchy
- Use **weight and size variation** within a single typeface to create hierarchy (max 3–4 levels).
- Hierarchy order: Primary heading (name, title) > Secondary heading (subtitle, role) > Body text (contact details, descriptions) > Fine print.
- Avoid using more than 2 typefaces in a single print piece.

### Line Spacing
- **Body text:** 120–150% of font size (e.g., 10pt text → 12–15pt line height).
- **Headings:** Tighter spacing is acceptable (100–120%).
- **Small text:** More generous spacing aids readability (130–160%).

### Contrast
- Ensure sufficient contrast between text color and background. Dark text on light backgrounds is safest.
- White text on dark/colored backgrounds works well but requires the background to fully cover the text area with comfortable padding.
- Avoid placing text on busy photographic backgrounds without a solid or semi-transparent overlay.

## QR Codes for Print

### Sizing
- **Minimum:** 10 × 10 mm (50 × 50 px at 5 px/mm). Below this, scanners struggle.
- **Recommended:** 12–15 mm for reliable scanning at arm's length.
- **Large format (posters, banners):** Scale proportionally — 25 mm+ for anything scanned from > 1 meter distance.

### Quiet Zone
- Every QR code requires a **white (or high-contrast) quiet zone** around it — at least 4 modules wide (the spec minimum).
- On dark backgrounds, ensure the QR has a white padding area. Without it, the QR merges with the background and won't scan.

### Content
- Keep the encoded URL short — shorter URLs produce simpler QR patterns that scan more reliably at small sizes.
- Use UTM parameters for tracking: `?utm_source={format}&utm_medium=print&utm_content={identifier}`.
- Use URL shorteners for long URLs to simplify the QR pattern.

### Placement
- Position the QR on the opposite side/corner from the logo for visual balance.
- Maintain at least 3 mm (15 px at 5 px/mm) gap between the QR and any adjacent text or element.
- Don't place QR codes in the bleed zone — they must be fully within the safe zone.

## Pre-Flight Checklist

Before sending any design to print:

1. **Dimensions correct?** Bleed, trim, and safe zones match the printer's specifications.
2. **All content in safe zone?** Text, logos, QR codes, barcodes — nothing functional outside the safe boundary.
3. **Backgrounds extend to bleed?** No white strips will appear if the cut is slightly off.
4. **Resolution sufficient?** All raster elements at 300+ DPI at print size.
5. **Fonts embedded?** No external font dependencies in the export file.
6. **Images local/embedded?** No broken references or external URLs.
7. **No trim marks in design file?** (The printer adds these.)
8. **Color awareness?** Aware of RGB → CMYK shift. No neon/fluorescent colors expected to reproduce faithfully.
9. **QR codes scannable?** Minimum 10mm, quiet zone present, short URL encoded.
10. **Text legible?** All text meets minimum size (7pt body, 6pt fine print absolute minimum).

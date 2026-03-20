---
name: print-design
description: Print-ready design principles — bleed/trim/safe zone system, export requirements, typography for print, QR codes, and standard format reference. Apply this skill whenever creating any design intended for physical printing (business cards, flyers, brochures, posters, stickers, packaging, etc.). Trigger on any request mentioning "print", "PDF export", "bleed", "trim", "safe zone", "CMYK", "DPI", or any physical print format.
---

# Print Design

Universal principles for creating print-ready designs. These rules apply to any printed format — business cards, flyers, brochures, posters, stickers, packaging, and more.

Always pair with **brand-design-system** and **design-foundations**.

---

## When to Use

Apply this skill when:
- Designing anything for physical printing (business cards, flyers, brochures, posters, stickers, packaging)
- Creating PDF exports intended for professional printing
- Setting up bleed, trim, and safe zones
- Converting screen designs to print-ready files
- Working with CMYK colour, DPI, or print typography

Do NOT use this skill for:
- Digital-only PDF exports (reports, presentations) — see **presentation**
- Screen UI design — see **frontend-architecture** and **design-foundations**
- Colour token definitions — see **brand-design-system**

---

## Core Rules

### 1. The three-zone system is non-negotiable

Every print design has three concentric zones: bleed (extends past trim for cutting tolerance), trim (the final cut line), and safe zone (where all important content lives). Content in the bleed zone gets cut off. Content outside the safe zone risks being clipped.

### 2. Design at 300 DPI minimum

Print requires much higher resolution than screen. 300 DPI is the professional standard. 150 DPI is acceptable for large-format (posters, banners). Never use screen-resolution assets (72/96 DPI) in print.

### 3. Use mm for print measurements, not px

Print dimensions are physical, not pixel-based. Design in mm (or inches). Convert at export time: 1mm = 11.811px at 300 DPI.

### 4. Safe zone governs content placement

All text, logos, and important visuals must be inside the safe zone. Decorative elements and backgrounds can extend to the bleed. Nothing important should be within 3–5mm of the trim edge.

---

## The Three-Zone System

Every print design operates on three concentric zones. Understanding these is non-negotiable for print work.

### 1. Bleed Zone (outermost)

The bleed extends **beyond the final cut line** on all sides. It exists because cutting machines have slight variance — without bleed, you'd see thin white strips at the edges.

- **Purpose:** Insurance against cutting inaccuracy.
- **What goes here:** Backgrounds, decorative elements, color fills, patterns, images that should extend to the edge.
- **Standard bleed:** 3 mm per side is the industry standard for most formats (business cards, flyers, brochures, postcards, standard posters). 5 mm is the safest option and what some printers prefer.
- **Large format bleed:** Banners and large posters (24"+ ) may require 10–12 mm bleed. Roll-up banners need extra bleed at the bottom where material wraps into the stand.
- **Rule:** Any element that touches the trim edge must extend all the way to the bleed edge. **Always confirm bleed requirements with your specific printer** — they vary by equipment and finishing process.

### 2. Trim Zone (middle)

The trim line is where the paper is physically cut. This is the **final size** of the printed piece — what the recipient holds in their hand.

- **Purpose:** Defines the actual dimensions of the finished product.
- **What goes here:** This is a conceptual boundary, not a zone you design into. Nothing should be placed exactly on the trim line.
- **Rule:** Never place important content at the trim line — it may be cut off.

### 3. Safe Zone (innermost)

The safe zone sits **inside the trim**, providing a margin of safety. All readable content, logos, QR codes, barcodes, and functional elements must stay within this boundary.

- **Purpose:** Ensures nothing important gets cut off or sits uncomfortably close to the edge.
- **Standard inset:** 3–5 mm inside the trim. 3 mm is the industry minimum; 4 mm is a comfortable default for standard formats. Large format (posters, banners) should use 10–15 mm safe inset — especially roll-up banners where the bottom 50–100 mm may be hidden inside the stand mechanism.
- **What goes here:** ALL text, logos, QR codes, barcodes, contact information, and any element the reader needs to see.
- **Rule:** Absolutely nothing functional or readable outside this zone.

### Zone Calculation Formula

For any print format:

```
Bleed dimensions = Trim dimensions + (2 × bleed margin)
Safe dimensions  = Trim dimensions - (2 × safe inset)
```

**Example — Standard business card (90 × 55 mm, 3 mm bleed, 4 mm safe inset):**
| Zone | Dimensions |
|------|-----------|
| Bleed | 96 × 61 mm |
| Trim | 90 × 55 mm |
| Safe | 82 × 47 mm |

### Business Card Layout Variations

Business cards are the most common print format. Beyond the zone math, consider these layout decisions:

- **Front/back design:** Front side carries the identity — name, role, logo. Back side carries contact details, a brand pattern, a solid color, or a QR code. Each side has independent bleed and safe zone requirements.
- **Landscape vs portrait orientation:** Landscape (90 × 55 mm) is the standard orientation and fits most card holders and wallets naturally. Portrait (55 × 90 mm) is distinctive and works well for creative or design-focused roles, but verify it fits the recipient's card holder.
- **Minimal vs full layout:** Minimal — name, one contact method (email or phone), and a QR code. Full — name, role, company, phone, email, website, address, and social handles. Choose based on the brand's personality and how much information the recipient actually needs.
- **Double-sided printing:** When designing both sides, ensure bleed and safe zones are independently correct on each face. Content from the front must not "leak" assumptions about the back layout — they are two separate compositions that share only the physical card dimensions.

### Common Print Format Reference

| Format | Trim Size | Bleed | Safe Inset | Bleed Size | Safe Zone |
|--------|-----------|-------|------------|------------|-----------|
| Business card | 90 × 55 mm | 3 mm | 4 mm | 96 × 61 mm | 82 × 47 mm |
| Business card (US) | 89 × 51 mm | 3 mm | 4 mm | 95 × 57 mm | 81 × 43 mm |
| DL flyer | 99 × 210 mm | 3 mm | 4 mm | 105 × 216 mm | 91 × 202 mm |
| A6 flyer | 105 × 148 mm | 3 mm | 4 mm | 111 × 154 mm | 97 × 140 mm |
| A5 flyer | 148 × 210 mm | 3 mm | 4 mm | 154 × 216 mm | 140 × 202 mm |
| A4 flyer/brochure | 210 × 297 mm | 3 mm | 4 mm | 216 × 303 mm | 202 × 289 mm |
| A3 poster | 297 × 420 mm | 3 mm | 4 mm | 303 × 426 mm | 289 × 412 mm |
| Square sticker (50mm) | 50 × 50 mm | 3 mm | 4 mm | 56 × 56 mm | 42 × 42 mm |
| Tri-fold brochure | 297 × 210 mm | 3 mm | 4 mm | 303 × 216 mm | 289 × 202 mm |
| Bi-fold brochure | 420 × 297 mm | 3 mm | 4 mm | 426 × 303 mm | 412 × 289 mm |
| A5 Booklet | 148 × 210 mm | 3 mm | 4 mm | 154 × 216 mm | 140 × 202 mm |
| A4 Booklet | 210 × 297 mm | 3 mm | 4 mm | 216 × 303 mm | 202 × 289 mm |
| Postcard (A6) | 148 × 105 mm | 3 mm | 4 mm | 154 × 111 mm | 140 × 97 mm |
| Envelope C5 | 162 × 229 mm | 3 mm | 4 mm | 168 × 235 mm | 154 × 221 mm |
| Envelope C6 | 114 × 162 mm | 3 mm | 4 mm | 120 × 168 mm | 106 × 154 mm |
| Envelope DL | 110 × 220 mm | 3 mm | 4 mm | 116 × 226 mm | 102 × 212 mm |
| Large poster 18×24" | 457 × 610 mm | 5 mm | 10 mm | 467 × 620 mm | 437 × 590 mm |
| Large poster 24×36" | 610 × 914 mm | 5 mm | 10 mm | 620 × 924 mm | 590 × 894 mm |
| Large poster 36×48" | 914 × 1219 mm | 5 mm | 10 mm | 924 × 1229 mm | 894 × 1199 mm |
| Roll-up banner | 800 × 2000 mm | 10 mm | 15 mm † | 820 × 2020 mm | 770 × 1970 mm |
| Packaging label | varies | 5 mm | 5 mm | trim + 10 mm | trim - 10 mm |

> † Roll-up banners: the bottom 50–100 mm is hidden inside the stand. Add this to the safe inset at the bottom edge only. The 15 mm inset in the table applies to top and sides; bottom safe inset should be 60–110 mm from the trim edge.

## Fold Lines & Multi-Panel Layouts

When designing folded pieces (tri-folds, bi-folds, gate-folds), fold lines introduce constraints beyond the standard three-zone system.

### Tri-Fold Brochures

- **Inner panel narrowing:** The inner panel (the one that folds inward first) must be **2–3 mm narrower** than the two outer panels. This allows it to nest cleanly inside without buckling or peeking out.
- **Panel order (unfolded, face-up, left-to-right):** Inside-left, inside-center, inside-right. When folded, the outside panels are: back-left, front-flap (the shorter inner panel), front-cover.
- **Fold margin:** Maintain a **6 mm minimum margin** from any fold line. Content placed too close to folds gets obscured, distorted, or becomes awkward to read.

### Bi-Fold Brochures

- **Spine allowance:** If binding or stapling at the fold, account for paper thickness in the spine panel. For standard 150–170gsm stock, 1–2 mm spine allowance is typical.
- **Fold margin:** Same 6 mm rule applies — keep readable content 6 mm away from the fold on both sides.

### General Fold Rules

- **Content must NEVER cross fold lines.** Each panel is a self-contained composition. Text, images, and design elements that span a fold will appear broken, misaligned, or partially hidden.
- **Fold scoring:** For paper **≥170 gsm**, recommend pre-scoring the fold line before folding. Unscored heavy stock cracks, exposing white paper fibers through the ink — especially visible on dark or saturated colors.
- **Test with paper:** When possible, print a rough draft on similar-weight paper and fold it by hand before finalizing. This reveals nesting issues, content-near-fold problems, and panel order mistakes that are invisible on screen.

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

```tsx
// Two-box architecture for a business card (90×55mm at 5px/mm)
const SCALE = 5; // px per mm
const BLEED = 5 * SCALE;  // 25px
const TRIM_W = 90 * SCALE; // 450px
const TRIM_H = 55 * SCALE; // 275px
const SAFE_INSET = 4 * SCALE; // 20px

function BusinessCard() {
  return (
    {/* Clip container — shows trim-size preview */}
    <div style={{ width: TRIM_W, height: TRIM_H, overflow: 'hidden' }}>
      {/* Bleed box — full bleed dimensions */}
      <div style={{
        width: TRIM_W + BLEED * 2,
        height: TRIM_H + BLEED * 2,
        marginLeft: -BLEED,
        marginTop: -BLEED,
        background: 'var(--color-primary)',
        position: 'relative',
      }}>
        {/* Content box — safe zone */}
        <div style={{
          position: 'absolute',
          top: BLEED + SAFE_INSET,
          left: BLEED + SAFE_INSET,
          width: TRIM_W - SAFE_INSET * 2,
          height: TRIM_H - SAFE_INSET * 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* All readable content goes here */}
        </div>
      </div>
    </div>
  );
}
```

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

## CMYK Color Strategy

Since screen-based design tools work in RGB (hex values, CSS custom properties), a deliberate CMYK strategy is essential for predictable print output.

### Brand Color CMYK Approximations

Brand tokens (`var(--color-primary)`, etc.) are defined in RGB/hex. For print work, manually create CMYK equivalents for key brand colors. Document these alongside the hex values so every print project uses consistent conversions rather than relying on automatic RGB-to-CMYK conversion, which varies by tool and profile.

### Gamut Mapping

CMYK has a smaller color gamut than RGB. Certain RGB colors simply cannot be reproduced in CMYK:

- **Saturated blues** (e.g. `#0066FF`) — shift toward duller, slightly purple tones.
- **Bright oranges** (e.g. `#FF6600`) — lose vibrancy and can appear more brown/red.
- **Neon greens** (e.g. `#00FF00`) — impossible in CMYK; will appear significantly muted.

**Mental model:** Imagine the full RGB spectrum as a large box. CMYK is a smaller box inside it. Colors near the outer edges of the RGB box (highly saturated, vivid colors) fall outside the CMYK box and get "clamped" to the nearest reproducible color.

### Soft-Proofing Workflow

Always preview the CMYK conversion before sending to print:

1. Design in RGB (unavoidable in HTML/CSS-based tools).
2. Export at maximum quality.
3. Open in a tool that supports CMYK soft-proofing (Adobe Acrobat Pro, Photoshop, or a free alternative like GIMP with a CMYK profile).
4. Compare side-by-side. Adjust any colors that shifted unacceptably.
5. If critical brand colors are out of gamut, discuss with the printer — spot colors (Pantone) may be an option.

### Black in CMYK

- **Rich black:** `C:40 M:30 Y:30 K:100`. Use this for large solid black areas (backgrounds, banners, full-bleed black panels). Pure `K:100` looks washed out and uneven in large areas.
- **Text black:** `K:100` only. Body text and small elements should use pure black to avoid registration issues (misalignment of the four CMYK plates causing colored halos around text).
- **Registration black:** `C:100 M:100 Y:100 K:100` — **NEVER use this in designs.** It is a printer calibration mark color. Using it causes severe ink bleeding, extremely slow drying, paper warping, and smearing.

### Total Ink Coverage

The sum of C + M + Y + K values at any point in the design should stay **below 300%** (e.g., C:80 M:70 Y:70 K:80 = 300%). Exceeding this causes:

- Ink that won't dry properly.
- Smearing during finishing (cutting, folding, packaging).
- Paper saturation and warping.
- Some printers reject files with total ink above 300%.

Rich black at C:40 M:30 Y:30 K:100 = 200% total — well within safe limits.

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

## Banned Patterns

- ❌ Background that doesn't extend to bleed edge (causes white edge strips after cutting) → extend all edge-touching elements to the full bleed boundary
- ❌ Content placed outside safe zone (causes text/logos cut off at edges) → move all text, logos, QR codes inside the safe zone (4mm inset)
- ❌ Fonts not embedded in export (causes font substitution in PDF) → embed all fonts; convert to outlines as last resort
- ❌ Source images below 300 DPI at print size (causes blurry/pixelated output) → source images at 300+ DPI at their printed dimensions
- ❌ Ignoring RGB-to-CMYK gamut shift (causes dull/different colors) → soft-proof before print; avoid saturated blues/greens/oranges
- ❌ Inner panel same width as outer panels in tri-fold (causes fold misalignment) → make inner panel 2–3mm narrower
- ❌ Heavy stock not scored before folding (causes paper cracks at fold) → pre-score paper ≥170gsm
- ❌ QR code too small or missing quiet zone (won't scan) → minimum 10mm with white quiet zone of 4 modules around QR
- ❌ Total ink coverage too high (causes smearing/bleeding) → keep total ink below 300%; use rich black not registration black
- ❌ Font size below minimum (causes illegible text at print size) → body ≥7pt, fine print ≥6pt absolute minimum

## Quality Gate

Before sending any design to print:

- [ ] Dimensions correct — bleed, trim, and safe zones match the printer's specifications
- [ ] All content in safe zone — text, logos, QR codes, barcodes; nothing functional outside the safe boundary
- [ ] Backgrounds extend to bleed — no white strips will appear if the cut is slightly off
- [ ] Resolution sufficient — all raster elements at 300+ DPI at print size
- [ ] Fonts embedded — no external font dependencies in the export file
- [ ] Images local/embedded — no broken references or external URLs
- [ ] No trim marks in design file — the printer adds these
- [ ] Color awareness — aware of RGB to CMYK shift; no neon/fluorescent colors expected to reproduce faithfully
- [ ] QR codes scannable — minimum 10mm, quiet zone present, short URL encoded
- [ ] Text legible — all text meets minimum size (7pt body, 6pt fine print absolute minimum)

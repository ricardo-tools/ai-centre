---
name: design-foundations
description: >
  Visual design craft principles — Gestalt perception, hierarchy, spacing,
  alignment, negative space, contrast, consistency, and attention to detail.
  Apply to every design task regardless of medium (web, print, email, social).
  Medium-agnostic principles that complement brand-specific and format-specific
  skills. For motion/animation principles, see interaction-motion. For spacing
  token values, see brand-design-system.
---

# Design Foundations

Principles for producing high-quality visual design. These are medium-agnostic — they apply to business cards, landing pages, dashboards, email templates, and social media banners.

---

## When to Use

Apply this skill when:
- Designing or reviewing any visual layout
- Positioning elements spatially (grid, flexbox, absolute)
- Establishing visual hierarchy on a page or component
- Checking spacing, alignment, or consistency
- Running the squint test before delivery

Do NOT use this skill for:
- Colour tokens or typography specs — see **brand-design-system**
- Animation duration, easing, or motion vocabulary — see **interaction-motion**
- Responsive breakpoint planning — see **responsiveness**
- Component architecture or widget patterns — see **frontend-architecture**

---

## Core Rules

### 1. Visual hierarchy must be obvious at a glance

The viewer should identify the most important element within 1 second. Limit to 3–4 hierarchy levels. If everything is emphasised, nothing is.

**How to create hierarchy:** size difference (make it decisive — 16px vs 24px, not 18px vs 20px), weight difference, colour contrast, spatial separation, position (top-left gets attention first in LTR languages).

### 2. Use the spacing system, not arbitrary values

All spacing derives from the 8px base system. No arbitrary pixel values.

```
Tight:   4px  (0.5×) — within tightly coupled elements (icon + label)
Small:   8px  (1×)   — between related items in a group
Medium:  16px (2×)   — between groups of related items
Large:   24px (3×)   — between sections
XLarge:  32px (4×)   — major section separation
XXLarge: 48px (6×)   — page-level separation
```

For the actual spacing token definitions used in code, see **brand-design-system**. For layout-specific spacing (nav padding, sidebar gaps), see **app-layout**.

Group related items tighter. Separate groups wider. The proximity creates meaning — items that are close together are perceived as belonging together (Gestalt proximity).

### 3. Align everything to a grid

Every element must align to at least one other element. Ragged left edges, inconsistent indentation, and orphaned elements create visual noise.

- Pick alignment axes (left edge, centre, right edge) and stick to them within a section
- Multi-column layouts: all columns start and end at consistent grid lines
- Cards in a row share the same height, width, and internal padding

### 4. Negative space is intentional, not leftover

Every gap must serve a purpose: grouping, emphasis, or pacing. Space left over from a bad layout is not "white space" — it is dead space.

- Large gaps draw attention to what's adjacent — use this for emphasis
- Consistent gaps between similar items create rhythm
- Uneven gaps signal hierarchy — wider gap = less related

### 5. Consistency is non-negotiable

Same role = same treatment. Everywhere.

| Element | Rule |
|---|---|
| Font sizes | Same hierarchy level = same size |
| Font weights | Same role = same weight |
| Colours | Same semantic role = same colour |
| Spacing | Same relationship = same gap |
| Border radius | One radius (or a small set), used consistently |
| Icon style | Same weight, same size, same visual style |
| Component dimensions | Cards in same grid = same height. Buttons in same toolbar = same size. |

**If N-1 of N sibling elements have a feature (icon, badge, border), the Nth must also have it.** A missing element breaks the pattern.

### 6. Design for the worst case, verify with the best case

Never rely on content being short enough. Design for: the longest realistic name, all fields filled, the longest address, wrapped titles, empty states.

---

## Gestalt Principles

The brain organises visual information automatically. Use these tendencies:

- **Proximity** — items close together are perceived as a group. Use spacing to create and break groups.
- **Similarity** — items that look the same are perceived as related. Same colour, size, or shape = same category.
- **Enclosure** — items inside a boundary (card, border, background) are perceived as a unit.
- **Continuity** — the eye follows smooth lines and curves. Use alignment to create visual flow.
- **Closure** — the brain completes incomplete shapes. You can suggest structure without drawing every line.
- **Figure-ground** — every element is perceived as either foreground (figure) or background. Use contrast to make the figure clear.

---

## Compositional Balance

### The Balance Test

Imagine a fulcrum under the centre of your layout. Does it tip? Visual weight comes from: size, darkness, colour saturation, complexity, isolation (an isolated element has more weight).

### Symmetry vs Asymmetry

- **Symmetrical** layouts feel formal, stable, trustworthy. Use for dashboards, data-heavy screens.
- **Asymmetrical** layouts feel dynamic, modern, editorial. Use for marketing, landing pages, creative content.

Both require balance — asymmetry achieves balance through contrast, not through unequal weight.

### Positioning Principles

- **Top-left quadrant** gets the most attention (F-pattern for text, Z-pattern for mixed content)
- **Centre** carries weight — use for single primary CTAs, hero content
- **Bottom** is scanned last — place secondary information, footers, navigation shortcuts
- **Edges** create tension — elements near edges feel active; centred elements feel stable

---

## Contrast

Contrast creates distinction. Without sufficient contrast, elements blur together.

**Types of contrast:**
- **Value contrast** — light vs dark. The most powerful. Ensure WCAG AA ratios (4.5:1 text, 3:1 UI elements).
- **Scale contrast** — big vs small. Decisive size differences create hierarchy.
- **Weight contrast** — bold vs light. Use for text hierarchy without changing size.
- **Colour contrast** — warm vs cool, saturated vs muted. Use for emphasis, not for information.
- **Density contrast** — busy area vs empty space. The empty space draws attention to the busy area.

---

## Element Interactions

### Overlapping Elements

When elements overlap (absolute positioning, z-layered):
- Every overlap must be intentional and defensible
- Text must always be readable — never allow overlap to reduce text contrast below 4.5:1
- Use z-index hierarchy: content 1, navigation 10, overlays 100, modals 200

### Inline Badges Next to Text

When a badge or icon sits next to text that may wrap:
- **Single-line:** `align-items: center` is fine
- **Multi-line:** top-align with `align-items: flex-start` + `margin-top: 4px` to hit cap height
- **When unsure:** default to top-align (works for both cases)

### Cards and Siblings

Cards in a row must be identical in: height, padding, border-radius, shadow, internal spacing. Variable content goes in a flex zone (`flex: 1`); fixed elements (buttons, badges) anchor to top or bottom.

---

## The Squint Test

Blur your eyes (or zoom to 25%) and check:
- Clear hierarchy (what's most important is obvious)
- Balanced composition (no side feels heavier)
- Distinct groupings (related items read as groups)
- Clean edges and alignment
- Consistent element sizes

If the design fails the squint test, the structure needs work regardless of how polished the details are.

---

## Attention to Detail

The difference between good and exceptional lives here:

- **Sub-pixel alignment** — elements on whole-pixel boundaries (fractional pixels cause blurriness)
- **Optical balance** — circles slightly larger than squares to appear the same size
- **Colour temperature harmony** — warm and cool balanced, not one dominating
- **Typographic detail** — consistent line heights, proper letter-spacing on uppercase, em dashes not hyphens, curly quotes not straight
- **Edge relationships** — 3px from an edge looks accidental. 0px (flush) or 16px+ (deliberate gap) look intentional.
- **Identical siblings are identical** — 1px difference between "same" elements is worse than 10px difference between deliberately different ones

---

## Design Decision Framework

When facing a design choice, evaluate in this order:

1. **Clarity** — does the viewer immediately understand the hierarchy?
2. **Balance** — does the composition feel visually stable?
3. **Consistency** — does this match established patterns?
4. **Simplicity** — is this the simplest solution? Fewer elements, fewer colours, fewer type sizes.
5. **Polish** — are details refined? Alignment, spacing, edge treatment, colour harmony.

---

## Banned Patterns

- ❌ Arbitrary pixel values for spacing → use the 8px system (4/8/16/24/32/48)
- ❌ Elements misaligned with no shared grid line → every element aligns to at least one neighbour
- ❌ Sibling elements with inconsistent treatment (one card has a shadow, another doesn't) → identical siblings must be identical
- ❌ Text on busy backgrounds without sufficient contrast → add overlay or solid background under text
- ❌ Dead space from bad layout presented as "white space" → every gap must serve a purpose
- ❌ Size differences that are ambiguous (18px vs 20px) → make hierarchy decisive (16px vs 24px)
- ❌ Elements 1–5px from an edge → either flush (0px) or a deliberate gap (16px+)
- ❌ Visual weight concentrated on one side with no counterbalance → distribute weight across the composition
- ❌ Positioned elements overlapping text without z-index plan → establish clear z-index hierarchy

---

## Quality Gate

Before delivering, verify:

- [ ] Squint test passes — hierarchy, balance, groupings, alignment all clear at 25% zoom
- [ ] All spacing uses the 8px system — no arbitrary values
- [ ] Every element aligns to at least one other element on a shared axis
- [ ] Sibling elements are identical (same height, padding, border-radius, features)
- [ ] Negative space is intentional — no leftover dead space
- [ ] Text contrast meets WCAG AA (4.5:1 normal, 3:1 large)
- [ ] Design works at maximum content (longest name, all fields, wrapped titles)
- [ ] Design works at minimum content (empty states, short text, missing fields)
- [ ] Checked at all relevant breakpoints — spacing ratios consistent, alignment survives reflow
- [ ] Visual hierarchy identifiable within 1 second

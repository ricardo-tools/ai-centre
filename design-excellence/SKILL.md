---
name: design-excellence
description: World-class visual design principles — Gestalt perception, compositional balance, visual hierarchy, spacing systems, negative space, alignment, responsive consistency, element interactions, typography, contrast, motion, and attention to detail. Apply this skill to every design task regardless of medium (web, print, email, social media). Trigger on any request involving UI creation, layout design, visual composition, component design, page design, or any work where elements are positioned spatially. This skill is medium-agnostic and complements brand-specific and format-specific skills.
---

# Design Excellence

Principles for producing world-class visual design. These are medium-agnostic — they apply whether you're designing a business card, a landing page, a dashboard, an email template, or a social media banner.

---

## Gestalt Principles

The human brain organizes visual information automatically. Understanding these perceptual rules lets you design *with* the brain instead of against it.

### Proximity

Elements close together are perceived as a group. Elements far apart are perceived as separate.

- Group related information by tightening spacing. Separate unrelated information by widening it.
- Spacing *is* the grouping mechanism — you should rarely need explicit dividers if proximity is correct.
- Don't place unrelated elements close together. The viewer will invent a relationship that doesn't exist.

### Similarity

Elements that share visual attributes (color, shape, size, weight) are perceived as belonging together.

- Use consistent styling for items that serve the same role (e.g., all feature cards share the same border radius, padding, and font size).
- Break similarity deliberately to draw attention — one red item in a row of grey items becomes a focal point.

### Continuation

The eye follows lines, curves, and edges. Align elements along invisible lines to create visual flow.

- Use consistent left edges, baselines, and grid lines so the eye travels smoothly through the layout.
- Interrupting a visual line creates a stopping point — use this to separate sections or create emphasis.

### Closure

The brain fills in gaps to perceive complete shapes. Incomplete forms can still communicate whole ideas.

- A partial image fading off the edge of a screen signals "there is more — scroll or swipe."
- Progress indicators, partial circles, and cropped elements leverage closure to imply completeness.

### Figure/Ground

Viewers separate elements into foreground (figure) and background (ground). The relationship between them determines focus.

- Ensure clear separation between content (figure) and its background (ground). Low contrast between figure and ground makes content hard to parse.
- Cards, modals, and elevated surfaces are figure/ground in action — the shadow or border separates the content plane from the background plane.

### Common Region

Elements inside a shared boundary (box, card, background color) are perceived as grouped.

- Cards, panels, and containers create groups without needing extra spacing or dividers.
- Use this to override proximity — two items far apart but inside the same card still feel related.

---

## Compositional Balance & Positioning

Balance is the even distribution of visual weight across a composition. Unbalanced designs feel unstable — the viewer senses something is wrong even if they can't name it.

### Visual Weight

Every element has visual weight — how much it attracts the eye. Heavier elements pull attention. Factors:

| Factor | Heavier | Lighter |
|--------|---------|---------|
| Size | Larger | Smaller |
| Color | Darker, saturated | Lighter, muted |
| Contrast | High contrast with surroundings | Low contrast |
| Density | Complex, textured, detailed | Simple, sparse |
| Shape | Irregular, compact | Regular, extended |
| Position | Center, top | Periphery, bottom |

### Types of Balance

| Type | Description | When to use |
|------|-------------|-------------|
| **Symmetrical** | Equal weight on both sides of a central axis | Formal, stable, authoritative (e.g., certificates, centered hero sections) |
| **Asymmetrical** | Unequal but equilibrated weight — a large element balanced by multiple smaller ones | Dynamic, modern, energetic (e.g., split layouts, dashboards) |
| **Radial** | Elements radiate from a central point | Strong focal point (e.g., clock faces, circular menus) |

Asymmetrical balance is harder to execute but produces more engaging compositions. One heavy element (a large headline) can be balanced by several lighter elements (smaller text, an icon, a line) on the opposite side.

### Positioning Elements Within a Canvas

When deciding **where** to place elements, don't guess — use compositional frameworks:

**Rule of thirds:** Divide the canvas into a 3×3 grid. Place focal elements at the intersection points or along the grid lines. Elements at intersections feel more dynamic than dead-center placement.

**Optical center:** The perceived visual center of a page is slightly above and to the left of the mathematical center. Center-aligned content that uses true geometric centering often feels like it's sinking — nudge it up by ~5% of the canvas height.

**Visual paths:** Control where the eye goes:
- **Z-pattern** — For pages with minimal text: top-left → top-right → diagonally down → bottom-left → bottom-right. Place your CTA at the terminal point (bottom-right).
- **F-pattern** — For text-heavy pages: the eye scans horizontally across the top, then partially across a second line, then vertically down the left edge. Front-load important content to the left and top.
- **Gutenberg diagram** — For balanced layouts: the eye sweeps from the primary optical area (top-left) through the strong fallow area (top-right) to the terminal area (bottom-right). Top-right and bottom-left receive the least attention.

**Anchoring:** Every major area of the canvas should have at least one visual anchor — an element that gives the eye a resting place. Large voids without anchors feel like dead space. A subtle accent line, a background tint, or a small typographic element can anchor an otherwise empty area.

---

## Visual Hierarchy

Every design tells the viewer where to look first, second, and third. This reading order is not accidental — it's engineered.

### The Hierarchy Stack

Establish a clear information priority before placing any elements:

1. **Primary** — The single most important piece of information. Largest, boldest, most prominent. (e.g., a person's name, a headline, a product title)
2. **Secondary** — Supporting context for the primary. Smaller but still prominent. (e.g., job title, subtitle, tagline)
3. **Tertiary** — Supporting details. Standard weight, smaller size. (e.g., contact info, body copy, metadata)
4. **Ambient** — Decorative or structural elements that support the composition but don't carry information. (e.g., accent lines, background shapes, dividers)

### Creating Hierarchy

Hierarchy is communicated through **contrast** — the difference between elements. The more contrast, the stronger the hierarchy. Lever these properties:

| Property | High emphasis | Low emphasis |
|----------|-------------|--------------|
| Size | Larger | Smaller |
| Weight | Bold / heavy | Light / regular |
| Color | High contrast (dark on light, accent color) | Low contrast (muted, secondary color) |
| Position | Top-left, center, above the fold | Bottom, periphery, below the fold |
| Space | More whitespace around it (isolation draws attention) | Grouped with other elements |

**Rules:**
- Use **max 3–4 hierarchy levels** in a single composition. More than that creates noise.
- The primary element should be identifiable within 1 second of viewing.
- Never give two elements equal visual weight unless they're intentionally equivalent (e.g., a comparison layout).
- Natural reading flow is top-left → right → down (for LTR languages). Place primary elements where the eye lands first.

---

## Scale & Proportion

Scale is relative size. Proportion is the relationship between sizes. Together they create the visual hierarchy and rhythm of a composition.

### Type Scale

Use a mathematical ratio to derive font sizes. This creates harmony because sizes relate to each other proportionally rather than being arbitrary.

| Ratio | Name | Progression (base 16px) |
|-------|------|-------------------------|
| 1.200 | Minor Third | 16, 19, 23, 28, 33 |
| 1.250 | Major Third | 16, 20, 25, 31, 39 |
| 1.333 | Perfect Fourth | 16, 21, 28, 38, 50 |
| 1.414 | Augmented Fourth | 16, 23, 32, 45, 64 |

Pick one ratio and derive all heading/body/caption sizes from it. Don't invent sizes — calculate them.

### Size Relationships

- **Limit to 3–4 distinct sizes** in a single composition. More than that and the hierarchy becomes ambiguous.
- **Make size differences decisive.** If two elements are similar sizes (18px vs 20px), the viewer can't tell which is more important. Either make them the same or make the difference obvious (16px vs 24px).
- **Scale decorative elements proportionally to the canvas.** An icon that's 20px on a 320px mobile screen should not still be 20px on a 1440px desktop — it becomes visually insignificant.

---

## Spacing & Rhythm

Spacing is the single most impactful quality differentiator between amateur and professional design. Consistent spacing creates visual rhythm — the design equivalent of a steady beat in music.

### Spacing System

Choose a **base unit** and derive all spacing from multiples of it. Common base units: 4px, 8px.

```
Base: 8px
Tight:   4px  (0.5×) — within tightly coupled elements (icon + label)
Small:   8px  (1×)   — between related items in a group
Medium:  16px (2×)   — between groups of related items
Large:   24px (3×)   — between sections
XLarge:  32px (4×)   — major section separation
XXLarge: 48px (6×)   — page-level separation
```

**Rules:**
- **Every gap must be intentional.** If you can't explain why two elements are a specific distance apart, the spacing is wrong.
- **Group related items tighter, separate groups wider.** A name and title should be closer together than the title and the contact block.
- **Consistent internal padding.** If a card has 24px padding on one side, it should have 24px on all sides (or a deliberate asymmetry with clear rationale).
- **Never mix arbitrary values.** Don't use 12px here, 13px there, 17px elsewhere. Stick to the system.

### Vertical Rhythm

When stacking elements vertically, the spacing between them should follow a predictable pattern:

- Same-group items: tight spacing (e.g., name + title: 2–4px gap)
- Between groups: medium spacing (e.g., name/title block to contact block: 16–24px)
- Between sections: large spacing (e.g., content area to footer: 32–48px)

The viewer should intuitively "feel" the grouping without needing explicit dividers.

### Compositional Rhythm

Rhythm is patterned repetition that guides the eye through a design. Just as music has tempo, design has visual rhythm.

**Types of rhythm:**
- **Regular** — Same element, same interval. Creates order and predictability. (e.g., a grid of identical cards with equal gaps)
- **Alternating** — Two contrasting elements in sequence. Creates energy. (e.g., alternating dark/light section backgrounds)
- **Progressive** — Elements that change gradually in size, color, or spacing. Creates direction and momentum. (e.g., a loading bar, a growing chart)
- **Flowing** — Organic, varying intervals. Creates natural movement. (e.g., a masonry layout, a scattered photo gallery)

**Use rhythm to control pacing.** Dense sections with tight spacing feel fast and urgent. Generous spacing feels calm and considered. Alternate dense and open sections to prevent monotony — after every 3–4 dense components, give the viewer a breathing moment.

---

## Negative Space

Negative space (white space) is not empty space — it's a design element. It creates breathing room, directs attention, communicates sophistication, and defines the relationships between elements.

### Micro vs. Macro

**Micro white space** — The small gaps between individual elements: letter-spacing, line-height, padding inside a button, gap between icon and label. These affect readability and component quality. Get them wrong and the design feels cramped or loose even if the overall layout is fine.

**Macro white space** — The larger gaps between sections, around the edges of the canvas, between major content blocks. These affect composition and breathing room. Get them wrong and the design feels either suffocating or unfinished.

Both must be intentional. A common failure is perfecting micro spacing inside components while neglecting macro spacing between them.

### The Six Functions of Negative Space

| Function | How it works | Example |
|----------|-------------|---------|
| **Emphasis** | Isolating an element in space draws the eye to it | A lone CTA button surrounded by whitespace becomes the obvious next action |
| **Grouping** | Space between groups is wider than space within groups (Gestalt proximity) | Form fields within a "Billing Address" section are close; the gap before "Shipping Address" is larger |
| **Hierarchy** | More space around an element = more importance | A headline with 48px margin below it outranks one with 16px |
| **Pacing** | Alternating dense and open areas controls the reading tempo | A data-heavy dashboard followed by a spacious summary card |
| **Elegance** | Generous space signals confidence — the design doesn't need to fill every pixel | Luxury brands use 50-70% white space; discount retailers use 10-20% |
| **Separation** | Space can replace borders and dividers to distinguish zones | Two content blocks separated by 48px don't need a `<hr>` |

### Intentional vs. Dead Space

| Intentional negative space | Dead space |
|---------------------------|------------|
| Creates focus and breathing room | Feels unfinished or accidental |
| Appears around and between element groups | Appears as large voids with no visual relationship to content |
| Feels balanced and deliberate | Feels like something is missing |
| Guides the eye to important elements | Confuses the visual flow |

### Using Negative Space to Position Elements

When placing elements on a canvas, negative space is your primary positioning tool:

1. **Start with the canvas as 100% negative space.** Each element you add consumes space and creates a relationship with the remaining space.
2. **Place the primary element first.** Its position carves the canvas into regions. A headline at the top-left creates a large open region to the right and below — that region is now available for secondary content.
3. **Use space to create visual paths.** The gaps between elements form channels that the eye follows. Align these channels with your intended reading order.
4. **Check the space, not just the elements.** After placing all elements, look at the negative space *as shapes*. Are those shapes balanced? Are they awkward triangles or comfortable rectangles? The shapes of the space matter as much as the shapes of the content.
5. **Margins scale with the canvas.** A business card's margins are 5–8mm. A poster's might be 40–60mm. But the *ratio* of margin to content should feel similar — typically 8–15% of each edge for standard compositions.

**Content coverage targets by composition type:**

| Type | Content coverage | Why |
|------|-----------------|-----|
| Hero / title section | 25–40% | The message is the space. Let the headline float. |
| Dashboard / data display | 65–80% | Information density is the point, but still needs breathing room. |
| Card / component | 55–70% | Balanced — enough content to be useful, enough space to be scannable. |
| Quote / testimonial | 30–45% | The quote earns weight through isolation, not through filling the space. |
| CTA / action section | 20–35% | A single action surrounded by space is unmissable. |

---

## Alignment

Alignment creates invisible lines that connect elements and make the composition feel ordered. Misalignment — even by a few pixels — is immediately perceptible and makes a design feel amateur.

### Alignment Systems

Choose one alignment strategy per composition (or per section in complex layouts):

| System | When to use | Characteristics |
|--------|------------|----------------|
| **Left-aligned** | Most common. Content-heavy layouts, contact info, body text. | Strong left edge creates a vertical anchor. Right edge is ragged. |
| **Center-aligned** | Formal, symmetrical compositions. Short text blocks. | Both edges ragged. Works poorly for long text. |
| **Right-aligned** | Accent or secondary elements. Used sparingly. | Strong right edge. Unusual reading flow — use deliberately. |
| **Grid-based** | Complex layouts with multiple columns or zones. | Elements snap to grid lines. Most structured approach. |

### Optical Alignment

Mathematical centering and alignment often looks wrong to the human eye. Optical alignment corrects for perceptual imbalance:

- **Circles and triangles** appear smaller than same-dimension squares. Enlarge them slightly (~5-10%) to appear optically equal.
- **Triangles (play buttons, arrows)** have a center of gravity lower than their geometric center. Shift them slightly toward their point to appear centered in a container.
- **Icons in circular buttons** often need 1–2px rightward nudge (for play icons) or upward nudge (for up-arrows) to *look* centered, even when they're mathematically centered.
- **Text in buttons** — Uppercase text appears to sit higher due to lack of descenders. Add 1–2px extra padding to the top (or reduce bottom padding) for optical centering.
- **The visual center of a page** is slightly above the mathematical center (~5% higher). Content that is geometrically centered often feels like it's sinking.

**Rule:** Trust your eyes over the pixel inspector. If something looks off, it is off — regardless of what the coordinates say.

### Cross-Element Inner Alignment

When related containers sit side by side — cards in a grid, comparison panels, pricing columns — each container's internal elements must align **across siblings**, not just within themselves. The viewer's eye scans horizontally across a row of cards and expects titles at the same vertical position, descriptions starting at the same point, and actions at the same bottom line.

**Why this matters:** Two feature cards in a row might each be internally well-designed. But if card A's description starts 8px higher than card B's (because card A has a shorter title above it), the pair looks broken. The eye detects misalignment of equivalent elements across siblings even more readily than misalignment within a single container — because the horizontal comparison is instant.

**What to align across siblings:**
- **Headings** — Titles across all cards in a row must start at the same vertical position. If one title wraps to 2 lines and another is 1 line, the *heading zone* must have consistent height in all cards.
- **Body text** — Description blocks should start at the same Y-position. Variable heading lengths must be absorbed by the heading zone, not passed down to shift the body.
- **Action elements** — Buttons, links, CTAs must sit at the same Y-position. Pin them to the bottom of the container.
- **Icons and images** — Same position, same dimensions across all siblings. An icon grid where one icon is 2px larger breaks the alignment line.
- **Numerical values** — Stats, prices, percentages in sibling cards must share the same baseline and font size.

**How to achieve it:**
- Structure each container as a **flex column with zones** (header zone, body zone, footer zone). Give the body zone `flex: 1` so it absorbs variable content, keeping headers aligned at top and footers pinned at bottom.
- Set **min-height on variable zones.** If headings can be 1 or 2 lines, give the heading zone a min-height that accommodates 2 lines. All siblings share the same zone height regardless of their actual content.
- Use **identical structural values** across all siblings — same padding, same gap, same font sizes, same zone heights. A 1px padding difference between two cards creates a visible stagger.
- **Audit by overlaying horizontal lines.** After laying out a row of cards, mentally draw a horizontal line at each major inner element (title, description, CTA). Every sibling must intersect the same line. If any line is jagged, the structural layout needs fixing.

### Standard Rules

- **Pick one dominant alignment and commit.** Don't scatter elements across different alignments without structure.
- **Maintain invisible alignment lines.** If the left edge of a heading aligns at 24px, the left edge of body text below it should also align at 24px.
- **Consistent margins and padding.** If content starts 25px from the left edge in one area, it should start 25px from the left edge everywhere.

---

## Responsive Consistency

Alignment and consistency are not just about how individual elements relate to each other — they're about how the entire composition holds together across screen sizes and with varying content.

### Equal-Height Containers

When cards, boxes, or comparison panels sit side by side, they **must be the same height** — regardless of how much content each contains. Unequal heights in a row create a ragged, unfinished appearance.

**The problem:** Two comparison cards — one with 2 lines of text, one with 6 lines — render at different heights. The short card leaves a gap. The viewer sees misalignment, not a deliberate design choice.

**The fix:**
- **CSS Grid with `1fr` rows:** `grid-auto-rows: 1fr` or `grid-template-rows: 1fr` forces all items in a row to the same height.
- **Flexbox stretch:** `align-items: stretch` (the default) makes flex children fill the cross-axis. Ensure the children don't override this with a fixed height.
- **`min-height` on children:** If grid/flex alone isn't enough, set an explicit `min-height` that accommodates the longest expected content.
- **Flex column with anchored footer:** For cards with a title, body, and action button — use `display: flex; flex-direction: column` on the card, `flex: 1` on the body, and the button sits at the bottom regardless of body length.

### Content-Adaptive Layouts

Designs must work with **variable content** — different text lengths, different numbers of items, different image aspect ratios. A layout that only looks good with your placeholder data is not a layout.

**Rules:**
- **Design for the longest realistic content first**, then verify with short content. Not the other way around.
- **Side-by-side comparisons** (before/after, good/bad, option A/option B) must match dimensions. Both panels get the height of the taller panel. Use `grid-template-columns: 1fr 1fr` with `grid-auto-rows: 1fr`.
- **Card grids with auto-fill** (`repeat(auto-fill, minmax(280px, 1fr))`) must include row height control. Without it, cards in the same row will be different heights. Add `grid-auto-rows: 1fr` or set `min-height` on the cards.
- **Truncation is a last resort.** If content varies wildly, prefer reflowing the layout (stacking on small screens, wrapping to new rows) over truncating text with ellipsis. Truncation hides information.

### Cross-Breakpoint Consistency

As the viewport changes, the design reflows — but the *principles* don't change:

- **Spacing ratios should scale, not break.** If desktop uses 48px between sections, mobile might use 32px — but it should never be 12px. The ratio of inter-section spacing to intra-section spacing must remain consistent.
- **Alignment edges must survive reflow.** A 3-column grid that wraps to a 1-column stack on mobile should maintain the same left edge, not suddenly center-align.
- **Cards that were equal height in a row must remain consistent** when they reflow to a single column. The single-column version should still have consistent padding and spacing, just without the height constraint.
- **Touch targets need space.** On mobile, interactive elements need at least 44×44px hit areas with 8px+ gaps between them. Desktop hover states become tap targets — verify they're reachable.

---

## Contrast

Contrast is the engine of visual design. Without sufficient contrast, there is no hierarchy, no emphasis, no separation. With too much contrast everywhere, there is no hierarchy either — everything screams.

### Types of Contrast

| Type | What varies | Effect |
|------|------------|--------|
| **Size** | Large vs. small | Establishes hierarchy. The biggest element is the most important. |
| **Weight** | Bold vs. light | Distinguishes headings from body text, active from inactive. |
| **Color** | Dark vs. light, saturated vs. muted | Draws attention, signals state (active, error, disabled). |
| **Density** | Dense vs. sparse | Dense areas feel information-heavy; sparse areas feel calm. |
| **Shape** | Rounded vs. angular, circle vs. rectangle | Breaks pattern to draw attention. A circle in a field of rectangles stands out. |

### Contrast Rules

- **Make differences decisive.** If two elements are supposed to be different, make them *obviously* different. A 2px font size difference is ambiguous — is it intentional or a bug? A 6px+ difference is clearly deliberate.
- **Use contrast sparingly for emphasis.** If everything is bold, nothing is bold. Reserve high-contrast treatment (accent colors, large sizes, heavy weights) for the few elements that deserve attention.
- **Accessibility minimums.** Normal text requires a 4.5:1 contrast ratio against its background (WCAG AA). Large text (18px+ or 14px+ bold) requires 3:1. UI components and graphical objects require 3:1. Use a contrast checker — don't eyeball it.

---

## Typography

Typography carries the majority of a design's information. It's not decoration — it's infrastructure.

### Line Height

- **Body text:** 1.4–1.6× the font size. Tighter line height feels dense and professional; looser feels open and readable.
- **Headings:** 1.05–1.2× the font size. Headings with body-text line height look loose and unanchored.
- **Small text / captions:** 1.3–1.5× the font size. Small text needs relatively more leading to remain legible.

### Letter Spacing

- **Uppercase text:** Always add tracking. +0.5px to +2px depending on font size. Without extra tracking, uppercase text feels cramped and hard to read.
- **Headings:** Tight tracking (−0.5px to −1.5px) at large sizes creates a dense, confident feel.
- **Body text:** Leave at default (0). Most fonts are designed with optimal body-text spacing built in.

### Text Measure

The ideal line length for body text is **45–75 characters** (including spaces). Lines shorter than 45 characters create excessive line breaks. Lines longer than 75 characters cause the eye to lose its place when returning to the next line. Use `max-width` to constrain text blocks.

### Font Pairing

- **Pair contrast, not similarity.** A serif heading with a sans-serif body creates clear hierarchy. Two similar sans-serifs blur together.
- **Match x-heights.** If two typefaces have very different x-heights, they'll look mismatched at the same font size. Choose pairs with similar proportions.
- **Limit to 2 typefaces** per composition. Three is the maximum in complex layouts. More than that creates visual chaos.

---

## Unity & Variety

Unity makes a design feel cohesive. Variety makes it feel interesting. The tension between them is where great design lives.

### Creating Unity

- **Repeat key attributes.** If your primary cards have 12px border-radius, 16px padding, and a 1px border — every card should share those attributes. Repetition creates pattern; pattern creates unity.
- **Establish a limited palette.** Fewer colors, fewer font sizes, fewer spacing values. Constraint creates cohesion.
- **Use a consistent grid.** All elements snapping to the same grid — even if they occupy different numbers of columns — feel related.

### Introducing Variety

- **Vary one thing at a time.** If all feature cards look identical, the section feels monotonous. But changing color, size, and shape simultaneously creates chaos. Change *one* attribute — maybe one card spans two columns, or one card has an accent background — to break the pattern without breaking unity.
- **Variety serves a purpose.** Every departure from the established pattern should communicate something: this item is different, this section is special, this action is important. Random variety is just inconsistency.
- **The monotony test:** If you can remove one element and the viewer wouldn't notice, the element isn't earning its place. Conversely, if you remove one element and the pattern feels broken, it *is* earning its place through variety.

---

## Element Interactions

When multiple elements share a canvas, they interact. Understanding and controlling these interactions separates good design from great design.

### Overlap & Collision

Elements should never accidentally overlap. Every overlap must be intentional and controlled.

**Intentional overlap** (good):
- A headshot ring overlapping a header band — creates depth and visual interest.
- A decorative shape extending behind a text block — adds visual texture.

**Accidental overlap** (bad):
- Contact text running into a logo because spacing wasn't calculated for max content.
- A decorative element covering text because its dimensions weren't constrained.

### Contrast & Separation

Adjacent elements need sufficient visual separation. Methods:

1. **Space** — Most common. A gap between elements.
2. **Color/shade** — Different backgrounds distinguish zones.
3. **Lines/dividers** — Explicit separation. Use sparingly — space is preferable.
4. **Size difference** — A large heading naturally separates from small body text.

**Rule:** Every adjacent element pair should have at least one form of separation. If two elements look like they're fighting for the same space, they are — fix it.

### Background Coverage

When text uses a contrasting color (e.g., white text on a colored band), the background **must fully cover all lines of that text plus comfortable padding.** This means:

- Padding above the topmost line: at least the text's line height.
- Padding below the bottommost line: at least the text's line height.
- Padding left and right: at least 1.5× the text's font size.
- **Never let colored text extend beyond its background** — it becomes invisible or illegible against the outer background.

---

## Motion & Animation

Motion communicates relationships, provides feedback, and guides attention. Used well, it makes interfaces feel alive. Used poorly, it distracts and annoys.

### Principles

- **Every animation must have a purpose.** It either (1) provides feedback, (2) shows a spatial relationship, (3) guides attention, or (4) communicates state change. If it does none of these, remove it.
- **Duration matters.** 150–250ms for micro-interactions (button press, toggle). 300–500ms for transitions (panel open, page change). Over 500ms feels sluggish unless it's a dramatic reveal.
- **Easing is mandatory.** Never use `linear` timing for UI motion. Use `ease-out` for enters (fast start, gentle stop), `ease-in` for exits (gentle start, fast exit), and `ease-in-out` for position changes.
- **Stagger reveals.** When multiple items appear simultaneously (e.g., a grid of cards), add cascading delays (50–100ms per item) so they flow in rather than pop. But limit total stagger to ~400ms — beyond that it feels slow.

### Reduced Motion

**Respect `prefers-reduced-motion`.** When the user has enabled reduced motion, replace animated transitions with instant state changes (opacity: 0 → 1 with no transition, or simply remove the animation). Never ignore this preference.

---

## Consistency

Consistency builds trust and professionalism. Inconsistency creates cognitive friction.

### What Must Be Consistent

| Element | Rule |
|---------|------|
| **Font sizes** | Same hierarchy level = same font size everywhere. |
| **Font weights** | Same role = same weight. Don't use bold for one heading and semibold for another equivalent heading. |
| **Colors** | Same semantic role = same color. Don't use three different greys for the same type of muted text. |
| **Spacing** | Same relationship = same gap. If name-to-title is 4px in one place, it's 4px everywhere. |
| **Border radius** | Pick one radius (or a small set) and use it consistently. Don't mix 4px, 6px, 8px, and 12px arbitrarily. |
| **Icon style** | Same weight, same size, same visual style. Don't mix outlined and filled icons. |
| **Alignment** | Same section = same alignment rules. |
| **Component dimensions** | Cards in the same grid = same height. Buttons in the same toolbar = same size. Tags in the same row = same padding. |

### Cross-Variant Consistency

When a design supports multiple data variants (different people, different content lengths, different themes), verify that the design works across **all** variants:

- Shortest and longest name.
- All contact fields filled vs. some missing.
- Short title vs. two-line title.
- Every color theme or mode.
- Every responsive breakpoint.

**Design for the worst case, verify with the best case.**

---

## Attention to Detail

The difference between good and exceptional design lives in the details. These are the things most people can't name but can feel.

### The Details That Matter

- **Sub-pixel alignment:** Elements should be on whole-pixel boundaries. Fractional pixels cause blurriness on screens.
- **Optical balance:** A circle needs to be slightly larger than a square to appear the same size. Triangles need to extend past alignment lines to appear flush. Trust your eyes.
- **Color temperature harmony:** Warm colors (oranges, reds) and cool colors (blues, greens) should be balanced. Don't let one temperature dominate unintentionally.
- **Typographic details:** Consistent line heights, proper letter-spacing for uppercase text, no orphans/widows in text blocks. Use proper typographic characters — em dashes (—), en dashes (–), curly quotes (" "), ellipses (…) — not their keyboard approximations.
- **Edge relationships:** When elements approach the edge of a canvas, maintain consistent breathing room. An element 3px from the edge looks like a mistake; 0px (flush) or 15px+ (deliberate gap) both look intentional.
- **Visual weight balance:** Distribute visual weight evenly across the canvas. A heavy element (dark, large, complex) on one side should be balanced by weight on the other side — not necessarily symmetrically, but equilibrially.
- **Identical siblings must be identical.** Cards in a row, icons in a toolbar, tags in a list — if they serve the same role, they must share the exact same dimensions, padding, border-radius, font size, and spacing. A 1px difference between "identical" elements is more damaging than a 10px difference between deliberately different elements.

### The Squint Test

Blur your eyes (or zoom out to 25%) and look at the design. You should still see:
- Clear hierarchy (what's most important).
- Balanced composition (no side feels heavier).
- Distinct groupings (related items read as groups).
- Clean edges and alignment.
- Consistent element sizes (cards in a row look the same height).

If the design fails the squint test, the structure needs work regardless of how polished the details are.

---

## Layout QA Checklist

Run this checklist on every design before delivering. It prevents the most common layout failures.

### Before Writing Any Design

1. **Establish a stacking plan.** Identify every positioned element (absolute, fixed, sticky) and every flex/grid child that auto-distributes space (margin-top: auto, justify-content: flex-end, etc.). Map where each will land.
2. **Reserve space for positioned elements.** If a container holds both flow content AND an absolutely-positioned element (e.g., a logo pinned to a corner), add enough padding/margin on the flow side so content never reaches the positioned element's zone. Formula: `padding = safety margin + element height + gap`.
3. **Assume maximum content.** Never rely on content being short enough. Design spacing for the longest realistic name, all fields filled, the longest address. The design must not break at maximum content.

### After Writing Each Design

4. **Visual spot-check at maximum content.** Verify:
   - No text overlaps any logo, icon, or decorative element.
   - No decorative element covers any text.
   - Contact blocks have clear separation from logos/QR codes.
   - All text remains within its background area (no colored text on wrong backgrounds).
5. **Check all variants.** Different profiles, data lengths, themes, and states.
6. **Check equal-height alignment.** Verify that:
   - Cards in the same row are the same height.
   - Comparison panels (before/after, good/bad) match dimensions.
   - Grid items don't create ragged bottom edges.
   - Feature lists with variable descriptions maintain visual alignment.

### After Responsive Implementation

7. **Check every breakpoint.** Verify at 320px, 640px, 768px, 1024px, 1440px minimum:
   - Spacing ratios remain consistent (not collapsed to 0 or stretched to extremes).
   - Alignment edges survive reflow (left edge stays consistent).
   - Touch targets are at least 44×44px with sufficient gaps.
   - Text remains readable (min 14px body on mobile).
   - Cards that reflow from multi-column to single-column maintain consistent styling.

### Common Overlap Pitfalls

- **Competing for the bottom:** A logo with `position: absolute; bottom: X` while contacts use `margin-top: auto` — both target the bottom zone. **Fix:** Add bottom padding to the container equal to `logo height + gap`.
- **Decorative overflow:** Pseudo-elements or decorative shapes with large dimensions bleeding over text. **Fix:** Constrain dimensions, push further into corners.
- **Dynamic clip-paths:** Diagonal shapes or clip-paths that cut through content when content height changes. **Fix:** Recalculate break points when content changes.
- **Z-index collisions:** Positioned elements stacking unpredictably. **Fix:** Establish a clear z-index hierarchy at the design level.

---

## Design Decision Framework

When facing a design choice, evaluate options against these criteria in order:

1. **Clarity** — Does the viewer immediately understand the information hierarchy?
2. **Balance** — Does the composition feel visually stable?
3. **Consistency** — Does this choice match the patterns already established?
4. **Simplicity** — Is this the simplest solution that achieves the goal? (Prefer fewer elements, fewer colors, fewer type sizes.)
5. **Polish** — Are the details refined? (Alignment, spacing, edge treatment, color harmony.)

When in doubt, choose the simpler option. Simplicity scales; complexity compounds.

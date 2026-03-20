---
name: responsiveness
description: >
  Defines how to think about and plan responsive interfaces that feel native on
  every resolution. Apply this skill when planning layouts across breakpoints,
  deciding what content appears at each resolution, adapting interaction patterns
  for different input methods, or reviewing UI for responsive quality. This is
  about the thinking and planning — not CSS rules.
---

# Responsiveness

A responsive interface does not shrink a desktop layout onto a phone. It feels purpose-built for whatever device it appears on. The user on a phone should never feel they are using a compromised experience. The user on an ultrawide should never feel they are looking at a stretched phone app.

---

## When to Use

Apply this skill when:
- Planning the layout of a new screen across breakpoints
- Deciding what content to show, hide, or reorganise at different resolutions
- Adapting navigation patterns for different devices
- Choosing interaction patterns (touch vs pointer vs keyboard)
- Scaling information density across screen sizes
- Reviewing responsive quality before delivery

Do NOT use this skill for:
- CSS Grid implementation or widget size variant code — see **frontend-architecture**
- Shell layout patterns (sidebar, topbar) — see **app-layout**
- Specific breakpoint pixel values — see **frontend-architecture** for the technical values

---

## Core Rules

### 1. Native means appropriate, not identical

"Native on every resolution" means the interface respects the device's ergonomics, input model, and usage context. A phone user holding the device one-handed, scrolling with their thumb, in a distracted context needs a fundamentally different experience than a desktop user with a mouse, keyboard, and sustained attention.

This is not achieved by reflowing columns. It is achieved by making hundreds of small decisions that honour how a human actually holds, touches, and looks at a specific device.

### 2. Content determines breakpoints, not devices

Do not start with standard breakpoints (320, 768, 1024). Start at the narrowest width, expand slowly, and add a breakpoint where the content breaks or wastes space. Your breakpoints come from your content's needs, not from Apple's product lineup.

Why: The device landscape is infinite and changes yearly. Content-driven breakpoints are resilient — they work on devices that don't exist yet.

### 3. Behaviour changes matter more than layout changes

Reflowing columns is table stakes. The real work is adapting interaction patterns, navigation models, and information density across resolutions. A responsive design that only reflows columns but keeps desktop hover patterns on touch devices is not truly responsive.

### 4. Increase density, not size

When scaling from mobile to desktop, the mistake is enlarging mobile elements to fill space. Desktop users need more information visible, not bigger elements. Show more items, more detail, more context — because desktop users are in a focused, exploratory mode with a larger cognitive budget (NNGroup).

### 5. Build in additive layers

Start with a baseline that works everywhere. Layer enhancements for more capable contexts. Every user gets a complete experience; some get a richer one. This is progressive enhancement applied to design, not just code.

### 6. Typography and spacing are a system

They scale together, proportionally. Heading-to-body ratio may compress on mobile (less contrast between sizes) and expand on desktop (more visual hierarchy). Spacing follows the same rhythm — tighter on mobile (scrolling is primary), more generous on desktop (more visible at once). The interface should feel like one coherent design at every width, not three designs stitched together.

---

## Planning Methodology

Responsive design is planned in four phases. Never start with breakpoints.

### Phase 1: Content Priority

Before any layout work, list every content element and interaction on the screen. Rank them by user priority. Create a single-column priority list — no layout, just hierarchy.

This forces you to answer: *What does the user need most at this moment?* That thing must be prominent at every resolution, not buried under six screens of scrolling on mobile.

### Phase 2: Breakpoint Discovery

Start at the narrowest reasonable width (~320px). Slowly expand. When the content breaks, wastes space, or the layout stops serving the user's task, that is a breakpoint. Common result: 3–5 major breakpoints, none of which match "standard" device widths.

### Phase 3: Behaviour Specification

For each breakpoint range, specify what changes beyond layout:

| Dimension | Small / Touch | Large / Pointer |
|---|---|---|
| **Input model** | Touch: imprecise, gesture-rich, two-state (touched/not) | Pointer: precise, hover-capable, three-state (up/down/hover) |
| **Navigation** | Bottom tabs, hamburger, minimal top bar | Sidebar, top nav, command palette, keyboard shortcuts |
| **Information reveal** | Tap-to-expand, progressive disclosure | Hover-to-preview, tooltips, higher upfront density |
| **Gestures** | Swipe (navigate, dismiss), long-press (context), pinch (zoom) | Right-click menus, drag-and-drop, scroll-to-zoom |
| **Cognitive mode** | Quick, task-focused, often one-handed, distracted | Focused, exploratory, two-handed, sustained attention |
| **Content density** | Low — prioritise the single most important action | High — show more things, not bigger things |
| **Touch targets** | Minimum 48px with 8px spacing | Can be smaller; hover states provide affordance |

### Phase 4: Canonical Layout Selection

Most screens map to one of three patterns (Material Design 3):

- **List-Detail** — collection on one side, selected item detail on the other. On mobile: list view, tap to navigate to detail. On desktop: split pane.
- **Supporting Pane** — primary content with secondary supporting content. On mobile: primary only, supporting behind a tab or drawer. On desktop: side-by-side.
- **Feed** — grid of browsable items. On mobile: single column. On tablet: 2 columns. On desktop: 3–4 columns with filters visible.

Start from the canonical layout, then adapt to your content's specific needs.

---

## Content Choreography

When columns collapse on small screens, visual hierarchy can be destroyed. A sidebar that was secondary on desktop becomes a massive block shoved above the main content on mobile.

Content choreography means deliberately rearranging content blocks so that priority is maintained at every width. The question is not "how does this reflow?" but "is the most important content still the most prominent?"

**Rules:**
- If content is important enough to be prominent at wide widths, it must remain prominent at narrow widths
- Secondary content (sidebar, related items, metadata) should collapse behind a toggle or move below primary content — never above it
- Navigation should adapt to the input model (sidebar → bottom tabs, top nav → hamburger) rather than just collapsing into a menu

---

## Information Density Scaling

Density is not "phone shows 3 items, tablet shows 6, desktop shows 12." That is mechanical scaling. Density should match the user's context and cognitive mode.

| Context | Density strategy |
|---|---|
| **Mobile** | Show the single most important thing clearly. Progressive disclosure for the rest. Optimise for completing one task. |
| **Tablet** | Show related items together. Enable comparison. Support both focused and browsing modes. |
| **Desktop** | Maximise useful information per viewport. Reduce navigation cost. Support parallel tasks and cross-referencing. |
| **Ultrawide** | Do NOT fill all space. Constrain primary content to readable line length (~65–80 characters). Use additional space for context panels, preview panes, or supporting information. |

The goal is structured density — clear hierarchy, visual grouping, whitespace as separator — not raw item count.

---

## Responsive Typography

Type does not just get smaller on small screens. The entire typographic system adapts as a coherent unit.

**Key principles:**

- **Scale compression on mobile.** The range between h1 and body text compresses (e.g. h1 is 1.5x body on mobile, 2.5x on desktop). This maintains hierarchy without oversized headings dominating small viewports.
- **Line length constraint.** Optimal readability: 65–80 characters per line. Mobile viewports naturally constrain this. Desktop layouts must constrain it deliberately. Never fill a wide viewport with unbroken text.
- **Vertical rhythm scales.** Spacing between elements is proportional to body line height. Tighter on mobile (scrolling is primary), more generous on desktop (more visible at once).
- **Fluid over stepped.** Typography and spacing that scale smoothly across the viewport continuum feel more coherent than sizes that jump at breakpoints.

---

## Performance as Responsiveness

Perceived performance varies by context. Desktop users expect sub-second loads. Mobile users tolerate more loading time but are far less tolerant of layout shifts, janky scrolling, or unresponsive touch.

**The asymmetry:** Desktop users notice speed. Mobile users notice reliability.

| Concern | Mobile / Slow connection | Desktop / Fast connection |
|---|---|---|
| **Loading** | Lazy-load below the fold. Prioritise above-fold content. | Prefetch likely navigation targets. Load eagerly. |
| **Images** | Serve appropriately sized. Prefer WebP/AVIF. | Serve high-resolution for retina displays. |
| **Interaction** | Immediate visual feedback for every touch (<50ms) | Instant state changes. Richer transition animations. |
| **Data** | Minimise payload. Defer non-essential resources. | Full payloads acceptable. |

---

## Responsive Audit Methodology

When auditing an existing app for responsiveness, don't just check for CSS breakage. Evaluate each page as a **purposeful design** at each breakpoint.

### Per-Page Audit Template

For every page, answer at each breakpoint (375px, 768px, 1024px, 1440px, 1920px):

**1. What is the user's job on this page?**
State it in one sentence. This is the lens for every subsequent question.

**2. Space utilisation — is the content proportional to the viewport?**
- What percentage of the viewport is content vs whitespace?
- On mobile: content should fill ~90% of width. Whitespace is wasted scroll.
- On desktop: content fills 60-80% of width. Whitespace is intentional breathing room.
- On ultrawide: content width is capped (65-80 char line length), extra space used for context panels or left empty. Never stretched.
- **Red flag:** A form that's 640px wide on a 1920px screen. A card grid with 3 cards on a 1440px screen leaving 40% empty. A CTA button positioned far from its related content.

**3. Density — are we showing more or just bigger?**
- On mobile: is only the essential content visible? Progressive disclosure for the rest?
- On tablet: is related content grouped side-by-side where it helps comparison?
- On desktop: is there more information per viewport, not just the same information bigger?
- **Red flag:** A form with identical layout at 768px and 1920px. A card grid that shows the same 2 columns from 640px to 1440px. Content that doesn't use available width.

**4. Proportionality — do fixed widths match the viewport?**
- `maxWidth` values should relate to the viewport, not be arbitrary:
  - Forms: 100% on mobile, 60-70% of viewport on tablet, 40-50% on desktop (never a fixed px that looks lost)
  - Card grids: fill the container, column count scales with width
  - Tables: full width on all sizes, switch to cards on mobile
- **Red flag:** `maxWidth: 640` in a `maxWidth: 1200` container on a 1920px screen = 33% utilisation. Feels empty.

**5. Proximity — are related actions near their context?**
- A "Create" button should be near the list it adds to, not in a header 200px above
- Form submit buttons should be visible without scrolling past the form
- Metadata should be near the content it describes
- **Red flag:** Header CTA floating far above an empty grid. Action buttons separated from their data by large margins.

**6. Does it feel purpose-built or compromised?**
The ultimate test. Hold the (simulated) device, use the appropriate input method, attempt the primary task. Does it feel like someone designed this resolution specifically, or like a desktop layout that didn't break?

### Proportionality Rules

Content containers should scale with the viewport:

| Content type | Mobile (375px) | Tablet (768px) | Desktop (1024px) | Wide (1440px+) |
|---|---|---|---|---|
| **Forms** | Full width, single column | 80% width, single column | 60% width or 2-column | 50% width or 2-column |
| **Card grids** | 1 column, full width | 2 columns | 3 columns | 3-4 columns |
| **Tables** | Card layout | Table if ≤4 cols, else cards | Full table | Full table with extra columns |
| **Detail pages** | Full width, stacked | Content + sidebar if useful | Content + sidebar | Content + sidebar, wider sidebar |
| **Text content** | Full width (natural constraint) | Max 65ch centered | Max 65ch centered | Max 65ch + side panel |

**Anti-patterns:**
- ❌ `maxWidth: 640px` with no responsive scaling — use `max(640px, 50vw)` or percentage-based
- ❌ Same `maxWidth` at every breakpoint — scale it up as the viewport grows
- ❌ Content centered in a narrow column with massive side gutters — fill the space or use it for context
- ❌ CTA buttons in headers far from the content they act on — anchor actions near their context

### Desktop Density Checklist

On screens ≥1024px, verify:
- [ ] Card grids show 3+ columns (not 2 with empty space)
- [ ] Forms use multi-column layout for related fields (name + email side by side)
- [ ] Metadata and context that was hidden on mobile is now visible
- [ ] Navigation shows full labels, not just icons
- [ ] Whitespace is intentional (separating groups) not incidental (leftover from a narrow max-width)
- [ ] The page uses ≥60% of the viewport width for content
- [ ] Tables show full data — no truncation on wide screens

---

For performance metrics and optimization techniques, see **web-performance**.

## Banned Patterns

- ❌ Designing desktop-first then shrinking → start from content priority, build upward
- ❌ Breakpoints based on device widths → breakpoints based on where content breaks
- ❌ Hover-dependent interactions on touch devices → provide tap alternatives for all hover behaviour
- ❌ Enlarging mobile elements to fill desktop space → increase density instead (more items, more detail)
- ❌ Filling ultrawide viewports with unbroken text → constrain line length to 65–80 characters
- ❌ Same navigation pattern at all resolutions → adapt to the input model (sidebar, bottom tabs, hamburger)
- ❌ Secondary content above primary content on mobile → maintain hierarchy through content choreography
- ❌ Assuming connection speed from screen size → a desktop on hotel wifi is slower than a phone on 5G
- ❌ Testing only at standard breakpoints → test continuously from 320px to maximum width
- ❌ Layout-only responsiveness (reflow columns but keep desktop interactions) → adapt behaviour, density, and navigation
- ❌ Fixed `maxWidth` that doesn't scale with viewport → use percentages, `max()`, or breakpoint-specific values
- ❌ Content using <50% of viewport width on desktop → fill the space with density or context
- ❌ CTA buttons far from their related content → anchor actions near their context
- ❌ Auditing only for CSS breakage (overflow, clipping) → audit for design intent at each breakpoint

---

## Quality Gate

Before delivering, verify:

- [ ] Content priority is maintained at every breakpoint — the most important content is always the most prominent
- [ ] Breakpoints are driven by content needs, not device widths
- [ ] Navigation adapts to the input model (touch vs pointer vs keyboard)
- [ ] Information density increases with screen size (more items, not bigger items)
- [ ] Touch targets are minimum 48px with 8px spacing on touch-capable viewports
- [ ] No hover-only interactions — every hover behaviour has a touch/keyboard alternative
- [ ] Line length is constrained to ~65–80 characters on wide viewports
- [ ] Typography and spacing scale proportionally (no jarring jumps between breakpoints)
- [ ] Continuous resize from 320px to max width produces no broken layouts, clipped content, or unusable states
- [ ] Primary task is completable at every breakpoint with the appropriate input method
- [ ] Secondary content collapses behind toggles or moves below primary — never above it
- [ ] Performance strategy adapts to context (lazy loading on mobile, prefetching on desktop)
- [ ] The "uncomfortable middle" (700–900px) has been explicitly designed for, not ignored
- [ ] At every breakpoint: hold the device, use the input method, attempt the primary task. Does it feel purpose-built?

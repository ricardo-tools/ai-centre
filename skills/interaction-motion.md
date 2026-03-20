---
name: interaction-motion
description: >
  Motion as a design language, not decoration. Covers when and how to animate,
  duration and easing principles, spatial continuity, feedback through motion,
  perceived performance, and the motion vocabulary of a coherent product.
  Apply when adding transitions, micro-interactions, page animations, or any
  visual movement. The creative-toolkit skill covers animation libraries —
  this skill covers animation thinking.
---

# Interaction Motion

Every animation serves communication: state change, spatial relationship, or feedback — if it doesn't communicate, remove it.

---

## When to Use

Apply this skill when:
- Adding transitions between states (show/hide, expand/collapse, enter/exit)
- Adding micro-interactions (button press, toggle, hover feedback)
- Animating page or route transitions
- Adding loading or progress animations
- Deciding whether something should animate or just appear
- Reviewing motion for consistency and purpose

Do NOT use this skill for:
- Choosing animation libraries (Motion, GSAP, Rive) — see **creative-toolkit**
- Data visualisation animation — see **creative-toolkit**
- CSS implementation details — see **frontend-architecture**

---

## Core Rules

### 1. Every animation needs a purpose

Before animating, ask: *what does this motion communicate?* If the answer is "nothing, it just looks nice," don't animate. Motion without purpose is clutter that slows the interface and distracts from the content.

**Valid purposes:**

| Purpose | Example |
|---|---|
| **Feedback** | Button depresses on click — "I received your input" |
| **Spatial orientation** | Modal slides up from trigger — "this came from there" |
| **State change** | Item fades out when deleted — "this is gone" |
| **Continuity** | Page cross-fades — "you're still in the same app" |
| **Perceived performance** | Skeleton pulses — "content is coming" |
| **Attention direction** | Error message shakes — "look here" |
| **Hierarchy** | Staggered list entrance — "these are separate items in order" |

### 2. Duration follows function

Different types of motion need different durations. Too fast is missed. Too slow is annoying. The sweet spots are well-established.

| Motion type | Duration | Why |
|---|---|---|
| **Micro-interaction** (button press, toggle, hover) | 100–150ms | Must feel instant. The user caused this — feedback should match their speed. |
| **Small transition** (tooltip, dropdown, fade) | 150–250ms | Noticeable but not slow. User is waiting for content. |
| **Medium transition** (modal, panel, card expand) | 250–350ms | Enough time to read the spatial movement. User is changing context. |
| **Large transition** (page, route, full-screen) | 300–500ms | Enough time to orient. User is navigating between major sections. |
| **Decorative / ambient** (loading pulse, background) | 1000–2000ms | Slow enough to not demand attention. Exists in periphery. |

**Never exceed 500ms for interactive transitions.** Beyond that, the user is waiting for the animation, not for the content.

### 3. Easing communicates physics

Easing curves determine the character of motion. Different easings feel fundamentally different.

| Easing | Feel | Use for |
|---|---|---|
| **ease-out** (`cubic-bezier(0.0, 0.0, 0.2, 1)`) | Responsive, decelerating | Entrances — element arrives and settles |
| **ease-in** (`cubic-bezier(0.4, 0.0, 1, 1)`) | Accelerating, departing | Exits — element gathers speed and leaves |
| **ease-in-out** (`cubic-bezier(0.4, 0.0, 0.2, 1)`) | Smooth, symmetric | State changes where element stays on screen |
| **spring** (overshoot + settle) | Bouncy, physical, playful | Elements arriving with energy — toasts, modals, popovers |
| **linear** | Mechanical, constant speed | Progress bars, loaders. Never for UI transitions (feels robotic). |

**The default should be ease-out for entrances and ease-in for exits.** This matches physical intuition — things slow down as they arrive, speed up as they leave.

### 4. Motion creates spatial memory

Users build a mental map of your interface. Motion reinforces this map by showing where things come from and where they go.

- A sidebar that slides in from the left → the user knows it lives "to the left"
- A modal that rises from its trigger → the user knows it's related to what they clicked
- A deleted item that collapses → the user knows it's gone (not just hidden)
- A page that cross-fades → the user knows they're in the same context

**When motion contradicts the spatial model** (a sidebar that fades from the right, a modal that drops from above when the trigger is below), it creates disorientation.

### 5. Stagger for hierarchy, not for show

When multiple items enter simultaneously (a list, a grid, a set of cards), stagger their entrance to communicate order and separateness.

```
Item 1  ████████████░░░░░░░░
Item 2  ░░████████████░░░░░░
Item 3  ░░░░████████████░░░░
Item 4  ░░░░░░████████████░░

Stagger: 30-50ms between items
Total: should not exceed 300-500ms for the full sequence
```

**Rules:**
- Stagger delay: 30–50ms per item
- Cap total stagger at 300–500ms (even for 20 items — start skipping for long lists)
- Items past the viewport don't need entrance animation
- All items use the same duration and easing (only the start time differs)

### 6. Respect `prefers-reduced-motion`

Always. Non-negotiable. When the user has requested reduced motion, replace animation with instant state changes. The UI must still communicate all state changes — just without movement.

```ts
// Check in JavaScript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// In Motion (framer-motion)
<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={prefersReduced ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }}
/>
```

---

## The Motion Vocabulary

A coherent product uses the same motion patterns everywhere. Define your vocabulary and stick to it.

### Entrance / Exit

```
Enter: fade in + translate up 8px, ease-out, 200ms
Exit:  fade out + translate down 4px, ease-in, 150ms
```

Apply to: modals, toasts, dropdowns, popovers, tooltips, new list items.

Exits should be faster than entrances — the user has already decided to dismiss; don't make them wait.

### Expand / Collapse

```
Expand:   height auto + fade in, ease-out, 250ms
Collapse: height 0 + fade out, ease-in, 200ms
```

Apply to: accordion sections, detail panels, disclosure widgets.

### State Change

```
Change: cross-fade, ease-in-out, 150ms
```

Apply to: tab content switches, view toggles, theme changes.

### Button Feedback

```
Press:   scale(0.97), ease-out, 100ms
Release: scale(1.0), spring, 150ms
```

Apply to: all clickable elements. The scale-down-on-press creates a physical "push" feeling.

### Loading Pulse

```
Pulse: opacity 0.4 → 1.0 → 0.4, ease-in-out, 1500ms, infinite
```

Apply to: skeleton screens, placeholder elements.

---

## Perceived Performance Through Motion

Motion can make waiting feel shorter:

- **Skeleton screens with pulse** → user's brain starts processing the layout before content arrives
- **Progressive loading** → content fades in section by section instead of all at once (perceived as faster)
- **Instant navigation feedback** → URL changes immediately, subtle loading indicator appears at the top (NProgress pattern)
- **Optimistic transitions** → the destination page starts its entrance animation immediately, content streams in
- **Progress bars that accelerate** → a bar that starts slow and speeds up is perceived as 12% faster than linear progress (Harrison et al., CHI 2010)

**What to avoid:** Loading animations that demand attention (bouncing dots, spinning logos). These make the user watch the animation instead of doing something else. A subtle top-bar progress indicator is better than a centred spinner.

---

## Common Mistakes

| Mistake | Why it's wrong | Fix |
|---|---|---|
| Everything animates | Motion overload. User can't tell what's important. | Animate only state changes and feedback. Static content stays static. |
| All transitions are 500ms+ | Interface feels sluggish. User waits for animations. | Micro-interactions: 100–150ms. Transitions: 200–350ms. |
| Linear easing on UI transitions | Feels mechanical and unnatural. | ease-out for entrances, ease-in for exits, spring for arrivals. |
| Exit animation same duration as entrance | Dismissals feel slow. | Exits 20–30% shorter than entrances. |
| Stagger on 50+ items | Entrance takes 2+ seconds. User waits for the last item. | Cap total stagger at 300–500ms. Skip animation for items past viewport. |
| Motion for motion's sake | No communication value. Slows the interface. | Every animation needs a purpose. If you can't name it, remove it. |
| Ignoring `prefers-reduced-motion` | Causes vestibular discomfort for ~25% of users. | Always implement. No exceptions. |
| Animating layout properties (width, height, top, left) | Causes layout recalculation = jank. | Animate `transform` and `opacity` only (GPU-composited, jank-free). |

---

## Banned Patterns

- ❌ Animation without a communicative purpose → every motion must answer "what does this tell the user?"
- ❌ Linear easing on UI transitions → use ease-out (entrance), ease-in (exit), spring (arrival)
- ❌ Transitions longer than 500ms for interactive elements → users should never wait for an animation
- ❌ Animating `width`, `height`, `top`, `left` → animate `transform` and `opacity` for jank-free performance
- ❌ Stagger sequences longer than 500ms total → cap it, skip offscreen items
- ❌ Exit animations the same speed as entrances → exits should be 20–30% faster
- ❌ Ignoring `prefers-reduced-motion` → always check and respect
- ❌ Centre-of-screen spinners for page loads → use a subtle top-bar indicator or skeleton screens
- ❌ Motion that contradicts spatial model (sidebar fading from the right) → motion must reinforce spatial memory

---

## Quality Gate

Before delivering, verify:

- [ ] Every animation has a named purpose (feedback, orientation, state change, continuity, perceived performance)
- [ ] Micro-interactions are 100–150ms, transitions are 200–350ms, nothing exceeds 500ms
- [ ] Entrances use ease-out, exits use ease-in. No linear easing on UI transitions.
- [ ] Exits are 20–30% shorter than entrances
- [ ] Stagger sequences cap at 300–500ms total, regardless of item count
- [ ] Only `transform` and `opacity` are animated (no layout properties)
- [ ] `prefers-reduced-motion` is respected — all state changes communicate without motion
- [ ] Motion reinforces spatial relationships (elements come from and go to logical positions)
- [ ] No motion-for-motion's-sake — static content stays static
- [ ] Loading states use skeleton pulse or top-bar indicator, not centred spinners

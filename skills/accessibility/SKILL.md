---
name: accessibility
description: >
  Accessibility as a first-class design discipline, not a compliance checkbox.
  Covers semantic HTML, keyboard navigation, focus management, ARIA patterns,
  screen readers, colour contrast, motion sensitivity, and React/Next.js
  specific patterns. Apply when building any UI — every component, every page,
  every interaction.
---

# Accessibility

Accessibility is not a feature you add. It is a quality dimension present or absent in every UI decision. Accessible products are better-designed products — the discipline of thinking about keyboard flow improves mouse flow. Focus management for screen readers improves the experience for power users. Sufficient contrast helps everyone in bright sunlight.

Building accessibility in from the start costs almost nothing. Retrofitting it later costs everything.

---

## When to Use

Apply this skill when:
- Building any UI component or widget
- Adding interactive elements (buttons, forms, modals, dropdowns, tabs)
- Adding dynamic content (toasts, live updates, loading states)
- Choosing colours, contrast, or visual indicators
- Adding animations or motion
- Building navigation or page structure
- Reviewing any UI work

This skill applies to **all** UI work, not just "accessibility-specific" features.

---

## Core Rules

### 1. Semantic HTML first, ARIA second

The right HTML element gives you accessibility for free. A `<button>` is focusable, clickable, keyboard-activatable, and announced as "button" by screen readers — without a single ARIA attribute. A `<div onClick>` has none of these.

```tsx
// ✅ Semantic — accessible by default
<button onClick={handlePublish}>Publish skill</button>
<a href="/skills">Browse skills</a>
<nav aria-label="Main navigation">...</nav>
<main>...</main>

// ❌ Div soup — requires ARIA to fix what HTML gives free
<div onClick={handlePublish} role="button" tabIndex={0} onKeyDown={handleKeyPress}>
  Publish skill
</div>
```

**Rule:** Use the most specific semantic element. Only add ARIA when no HTML element exists for the pattern (custom combobox, custom tab panel, live regions).

### 2. Everything works with a keyboard

Every interactive element must be reachable and operable with a keyboard. This is non-negotiable — keyboard access is the foundation of all assistive technology.

- **Tab** moves between interactive elements in DOM order
- **Enter** / **Space** activates buttons and links
- **Arrow keys** navigate within composite widgets (tabs, menus, radio groups)
- **Escape** closes overlays (modals, dropdowns, popovers)

Test: unplug your mouse and use your UI. If you get stuck, a keyboard user gets stuck. If you can't tell where focus is, neither can they.

### 3. Focus is always visible and managed

The user must always know where they are. The browser's default focus ring is a minimum — enhance it, don't remove it.

```css
/* ✅ Enhanced focus — visible on all backgrounds */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* ❌ Removed focus — user is lost */
:focus { outline: none; }
```

**Focus management for dynamic UI:**
- When a modal opens → move focus to the modal (first focusable element or the modal container)
- When a modal closes → return focus to the element that opened it
- When content is deleted → move focus to a logical next element
- When a route changes (SPA) → announce the new page and move focus to the main content or heading

### 4. Colour is never the sole indicator

8% of men have colour vision deficiency. Even for those with full colour vision, bright sunlight washes out colour differences. Every colour-based indicator must have a non-colour alternative.

```tsx
// ✅ Colour + icon + text
<Badge color="var(--color-danger)">
  <WarningIcon /> Error: connection lost
</Badge>

// ❌ Colour only
<span style={{ color: 'red' }}>Connection lost</span>
```

**Minimum contrast ratios (WCAG AA):**
- Normal text: 4.5:1 against background
- Large text (18px+ or 14px+ bold): 3:1 against background
- UI components and graphical objects: 3:1 against adjacent colours

### 5. Respect motion preferences

~25% of users have vestibular sensitivities. Honour `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**The discipline:** If removing an animation breaks the UX, the design is too dependent on animation. Essential state changes must be communicated without motion — animation enhances, it doesn't carry.

### 6. Content has structure

Screen reader users navigate by headings, landmarks, and regions — not by visual layout. Your page must have semantic structure that makes sense without seeing it.

- One `<h1>` per page (the page title)
- Headings follow hierarchy (`h1` → `h2` → `h3`, never skip levels)
- Landmark regions: `<nav>`, `<main>`, `<aside>`, `<footer>`
- Labelled regions when multiple of the same type exist: `<nav aria-label="Main">`, `<nav aria-label="Breadcrumbs">`

---

## Interactive Patterns

### Modals / Dialogs

```tsx
<dialog ref={dialogRef} aria-labelledby="modal-title">
  <h2 id="modal-title">Publish Skill</h2>
  <p>This will make the skill visible in the library.</p>
  <button onClick={onConfirm}>Publish</button>
  <button onClick={onClose}>Cancel</button>
</dialog>
```

**Requirements:**
- Focus moves to the dialog when it opens
- Focus is trapped inside the dialog (Tab cycles through dialog elements only)
- Escape closes the dialog
- Focus returns to the trigger element on close
- Background content is inert (`inert` attribute on the rest of the page, or use native `<dialog>`)

### Dropdowns / Menus

- Trigger button has `aria-haspopup="true"` and `aria-expanded="true/false"`
- Menu items navigable with Arrow keys
- Escape closes the menu and returns focus to the trigger
- Active item has `aria-current` or visual + screen reader indication

### Tabs

```tsx
<div role="tablist" aria-label="Skill views">
  <button role="tab" aria-selected="true" aria-controls="panel-practice" id="tab-practice">
    Skill in Practice
  </button>
  <button role="tab" aria-selected="false" aria-controls="panel-markdown" id="tab-markdown">
    View SKILL.md
  </button>
</div>

<div role="tabpanel" id="panel-practice" aria-labelledby="tab-practice">
  ...
</div>
```

**Requirements:**
- Arrow Left/Right moves between tabs
- Tab key moves focus out of the tab list into the active panel
- Only the active tab is in the tab order (`tabIndex={0}` for active, `-1` for inactive)

### Forms

- Every input has a visible `<label>` associated via `htmlFor` / `id`
- Required fields are indicated visually AND via `aria-required="true"`
- Error messages are associated with their field via `aria-describedby`
- Validation errors are announced: `aria-invalid="true"` on the field + error message linked via `aria-describedby`

```tsx
<label htmlFor="skill-title">Title</label>
<input
  id="skill-title"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? 'title-error' : undefined}
/>
{error && <p id="title-error" role="alert">{error}</p>}
```

### Toasts / Live Regions

Dynamic content that appears without user action must be announced to screen readers via ARIA live regions.

```tsx
// Polite — announced after current speech finishes (success, info)
<div aria-live="polite" aria-atomic="true">
  {toastMessage}
</div>

// Assertive — interrupts current speech (errors, urgent)
<div aria-live="assertive" aria-atomic="true">
  {errorMessage}
</div>
```

Place the live region in the DOM on mount. Update its content to trigger announcements. Don't mount/unmount the region itself — screen readers may miss it.

---

## React / Next.js Specific

### Route Change Announcements

SPAs don't trigger native page load announcements. Announce route changes for screen reader users:

```tsx
// In the root layout or a global component
const pathname = usePathname();
const [announcement, setAnnouncement] = useState('');

useEffect(() => {
  setAnnouncement(`Navigated to ${document.title}`);
}, [pathname]);

return (
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {announcement}
  </div>
);
```

### Screen-Reader-Only Content

Content that should be read by screen readers but not visible on screen:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Use for: icon-only buttons that need text labels, additional context for links ("Read more" → "Read more about Clean Architecture"), skip navigation links.

### Skip Navigation

```tsx
// First element in the body
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>

// On the main content area
<main id="main-content">...</main>
```

Becomes visible on focus — keyboard users can skip past navigation directly to content.

---

## Testing

### Manual testing (do this for every feature)

1. **Keyboard test:** Tab through the entire feature. Can you reach and operate everything? Is focus always visible? Can you escape overlays?
2. **Screen reader test:** Turn on VoiceOver (Mac: Cmd+F5) or NVDA (Windows). Navigate the feature. Does it make sense? Are interactive elements announced with their role and state?
3. **Zoom test:** Zoom to 200%. Does the layout still work? Is text still readable? Nothing clipped or overlapping?
4. **Colour test:** Use a colour contrast checker. Does all text meet 4.5:1? Do UI elements meet 3:1?
5. **Motion test:** Enable "Reduce motion" in OS settings. Does the UI still communicate all state changes?

### Automated testing

```ts
// In Playwright E2E tests
import AxeBuilder from '@axe-core/playwright';

test('skill detail page has no accessibility violations', async ({ page }) => {
  await page.goto('/skills/clean-architecture');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

Run axe on key pages in CI. It catches ~30-40% of accessibility issues automatically. The rest requires manual testing.

---

## Banned Patterns

- ❌ `<div onClick>` for interactive elements → use `<button>` or `<a>`
- ❌ `outline: none` / removing focus indicators → enhance focus, never remove it
- ❌ Colour as the sole indicator of state → pair with icon, text, or shape
- ❌ Images without `alt` text (or `alt=""` for decorative) → every `<img>` needs an alt decision
- ❌ Inputs without associated `<label>` elements → use `htmlFor` / `id` pairing
- ❌ Skipping heading levels (`h1` → `h3`) → follow the hierarchy
- ❌ Modals without focus trap and Escape-to-close → use `<dialog>` or implement focus management
- ❌ Dynamic content without `aria-live` announcement → toasts, errors, and status changes need live regions
- ❌ Auto-playing animation without `prefers-reduced-motion` check → respect user preferences
- ❌ Mouse-only interactions (hover menus, drag-only reordering) → provide keyboard alternatives

---

## Quality Gate

Before delivering, verify:

- [ ] Every interactive element is a semantic HTML element (`<button>`, `<a>`, `<input>`, `<select>`)
- [ ] Tab order follows logical reading order — no `tabIndex` values greater than 0
- [ ] Focus indicator is visible on every interactive element (2px+ outline, high contrast)
- [ ] Modals trap focus, close on Escape, return focus to trigger on close
- [ ] Form fields have associated labels and error messages linked via `aria-describedby`
- [ ] Colour is never the sole indicator — always paired with icon, text, or shape
- [ ] Text contrast meets WCAG AA (4.5:1 normal, 3:1 large)
- [ ] `prefers-reduced-motion` is respected — no essential information conveyed only via animation
- [ ] Headings follow hierarchy (`h1` → `h2` → `h3`, no skips)
- [ ] Landmark regions exist (`<nav>`, `<main>`, `<aside>`)
- [ ] Dynamic content (toasts, errors, status updates) uses `aria-live` regions
- [ ] Route changes are announced for screen reader users
- [ ] axe automated audit passes on key pages
- [ ] Manual keyboard test completed — every feature operable without a mouse

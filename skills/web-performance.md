---
name: web-performance
description: >
  Performance as a quality dimension — Core Web Vitals, loading strategies,
  bundle optimization, perceived performance, and Next.js-specific patterns.
  Performance is invisible when good and devastating when bad. Apply when
  building pages, loading data, adding dependencies, or diagnosing slow
  experiences. Not about micro-optimisation — about the patterns that make
  the difference between "snappy" and "sluggish."
---

# Web Performance

Users don't measure performance. They feel it. A product that responds in 100ms feels alive. A product that takes 3 seconds feels broken. Performance is not an optimisation task at the end — it is a design constraint present in every decision.

Performance and perceived performance are different things. A 2-second load with a skeleton screen feels faster than a 1.5-second load with a blank page. Both matter.

---

## When to Use

Apply this skill when:
- Building new pages or routes
- Adding dependencies or third-party scripts
- Loading data (server-side, client-side, or streaming)
- Adding images, fonts, or media
- Diagnosing slow page loads, slow interactions, or layout shifts
- Reviewing bundle size after changes
- Optimising for Core Web Vitals

Do NOT use this skill for:
- Database query optimisation — see **backend-patterns**
- Server-side caching (`revalidatePath`, `unstable_cache`) — see **backend-patterns**
- Animation performance (frame rate, jank) — see **interaction-motion**

---

## Core Rules

### 1. Measure before optimising

Don't guess what's slow. Measure. Core Web Vitals are the standard:

| Metric | What it measures | Good | Needs work | Poor |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | When the main content is visible | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** (Interaction to Next Paint) | Responsiveness to user input | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** (Cumulative Layout Shift) | Visual stability (things not jumping around) | ≤ 0.1 | ≤ 0.25 | > 0.25 |

Measure with: Lighthouse (Chrome DevTools), PageSpeed Insights (lab + field data), `web-vitals` library (real user metrics).

### 2. The critical rendering path is sacred

The first thing the user sees must load as fast as possible. Everything else can wait.

- Above-the-fold content loads first, below-the-fold is deferred
- Critical CSS is inlined or loaded first
- Fonts are preloaded or use `font-display: swap`
- No render-blocking scripts in the critical path
- No layout shifts as content loads (reserve space for images, ads, dynamic content)

### 3. Less JavaScript = faster interactions

Every kilobyte of JavaScript must be parsed, compiled, and executed before the page is interactive. The browser's main thread is single-threaded — JavaScript execution blocks user interaction.

- Ship less JavaScript (Server Components render on the server, zero client JS)
- Split what you do ship (dynamic imports for heavy components)
- Defer what isn't immediately needed (third-party analytics, chat widgets)
- Tree-shake what isn't used (dead code elimination)

### 4. Perceived performance matters as much as actual performance

Users don't perceive absolute time — they perceive responsiveness and progress. You can make the same load time feel dramatically faster.

| Technique | Effect |
|---|---|
| **Skeleton screens** | Shows the shape of content before it arrives. Perceived 30% faster than spinners. |
| **Optimistic updates** | Shows the result before server confirms. Perceived latency drops to near-zero. |
| **Streaming SSR** | Content appears progressively as it's generated. User sees something immediately. |
| **Instant navigation feedback** | URL changes immediately, loading indicator appears in <100ms. |
| **Progressive loading** | Important content first, details later. User can start working before full load. |

### 5. Don't optimise what doesn't matter

Performance optimisation has diminishing returns. A page that loads in 1.2s doesn't need to load in 0.8s. Focus effort on:
- Pages that load in >2.5s (LCP threshold)
- Interactions that lag >200ms (INP threshold)
- Layouts that shift (any CLS >0.1)
- The most-visited pages (homepage, main list page, detail page)

---

## Loading Strategies

### Server Components (zero client JS)

Default to Server Components — they ship zero JavaScript. This is the single biggest performance win in Next.js. For the full Server vs Client Component decision framework, see **nextjs-app-router-turbopack**.

### Streaming with Suspense

Don't wait for all data before sending the page. Stream the shell immediately, then stream data-dependent content as it resolves.

```tsx
// The shell renders immediately. The slow section streams in when ready.
export default function SkillsPage() {
  return (
    <div>
      <h1>Skills</h1>
      <SearchInput />
      <Suspense fallback={<SkillGridSkeleton />}>
        <SkillGrid />   {/* async — streams when data is ready */}
      </Suspense>
    </div>
  );
}
```

The user sees the heading and search input immediately. The skill grid appears as soon as the data is fetched. No blank page.

### Dynamic Imports

Split heavy client-side code so it loads only when needed:

```tsx
import dynamic from 'next/dynamic';

const RichEditor = dynamic(() => import('@/components/RichEditor'), {
  loading: () => <EditorSkeleton />,
  ssr: false,  // browser-only library
});

const ChartWidget = dynamic(() => import('@/widgets/ChartWidget'), {
  loading: () => <ChartSkeleton />,
});
```

Use for: chart libraries (nivo, recharts), rich text editors, animation-heavy components, PDF viewers, any component that adds >50KB to the client bundle.

### Prefetching

Next.js prefetches links in the viewport by default. For known navigation paths, prefetch data too:

```tsx
// Next.js Link prefetches the route automatically
<Link href={`/skills/${slug}`}>{title}</Link>

// For programmatic navigation, prefetch manually
router.prefetch('/generate');
```

---

## Images

Always use `next/image`. It handles: responsive sizing, lazy loading, format conversion (WebP/AVIF), and blur placeholder.

```tsx
import Image from 'next/image';

// Above the fold — priority loading, no lazy load
<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />

// Below the fold — lazy loaded automatically
<Image src="/skill-thumb.jpg" alt={skill.title} width={400} height={300} />

// Responsive sizing
<Image
  src="/showcase.jpg"
  alt="Showcase"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  fill
  style={{ objectFit: 'cover' }}
/>
```

**Rules:**
- `priority` on the LCP image (the biggest above-the-fold image). Only 1-2 per page.
- Always set `width` and `height` (or use `fill`) — prevents layout shift (CLS).
- Use `sizes` attribute for responsive images — tells the browser which size to download.
- Never use `<img>` directly — `next/image` handles optimisation automatically.

---

## Fonts

Use `next/font` for zero-layout-shift font loading:

```tsx
import { Jost } from 'next/font/google';

const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
});

// In root layout
<html className={jost.variable}>
```

**Rules:**
- Load fonts in the root layout, not in individual components
- Use `display: 'swap'` — shows text immediately in fallback font, swaps when loaded
- Use the `variable` option to define a CSS variable — reference it in styles instead of `fontFamily` strings
- Subset fonts (only `latin` if you don't need other character sets) — reduces file size

---

## Bundle Analysis

Regularly check what you're shipping to the client:

```bash
ANALYZE=true npm run build
```

**What to look for:**
- Large dependencies that could be replaced (moment.js → date-fns or native Intl)
- Dependencies imported on pages that don't use them
- Client-side code that should be a Server Component
- Duplicate packages (different versions of the same library)

**Budget:** Aim for <200KB first-load JS for the main page. Monitor with Lighthouse CI.

---

## Common Performance Killers

| Killer | Why it hurts | Fix |
|---|---|---|
| `'use client'` on page-level components | Entire page ships as JavaScript | Push `'use client'` down to the smallest interactive component |
| Large npm packages (lodash, moment, etc.) | Added to client bundle | Use native APIs, tree-shakeable alternatives, or dynamic import |
| Unoptimised images | Large files, layout shift, slow LCP | Use `next/image` with `width`/`height`/`priority` |
| Web fonts loaded via `<link>` | Flash of unstyled text, layout shift | Use `next/font` |
| Third-party scripts in `<head>` | Block rendering | Load with `next/script strategy="lazyOnload"` |
| Client-side data fetching for initial content | Waterfall: HTML → JS → fetch → render | Fetch in Server Component, pass as props |
| No Suspense boundaries | Entire page waits for slowest data | Wrap async sections in `<Suspense>` with skeleton fallbacks |
| Fetching all data upfront | Slow initial load for large datasets | Paginate, virtualise long lists, load on demand |

---

## Banned Patterns

- ❌ `<img>` tags in Next.js → use `next/image` for optimisation, lazy loading, and format conversion
- ❌ Web fonts via `<link>` or `@import` → use `next/font` for zero-CLS font loading
- ❌ `'use client'` on page or layout components → push the boundary down to the interactive component
- ❌ Client-side fetch for initial page content → fetch in Server Components, pass as props
- ❌ Large dependencies in the client bundle without dynamic import → split with `dynamic()` for >50KB components
- ❌ Images without `width` and `height` → every image must reserve space to prevent layout shift
- ❌ Third-party scripts in `<head>` blocking render → use `next/script` with `lazyOnload` strategy
- ❌ Optimising without measuring → run Lighthouse first, fix what's actually slow
- ❌ Skeleton-less loading (blank page → content pop) → always show structure while loading

---

## Quality Gate

Before delivering, verify:

- [ ] Lighthouse score is 90+ for Performance on key pages
- [ ] LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1
- [ ] Above-the-fold content renders without waiting for below-the-fold data
- [ ] The LCP image uses `priority` (only 1-2 per page)
- [ ] All images use `next/image` with `width`, `height`, and `sizes`
- [ ] Font loaded via `next/font` with `display: 'swap'`
- [ ] No `'use client'` higher in the tree than necessary
- [ ] Heavy client libraries loaded via `dynamic()` with loading skeleton
- [ ] Slow data sections wrapped in `<Suspense>` with skeleton fallbacks
- [ ] First-load JS < 200KB for the main page
- [ ] Bundle analysis run — no unnecessary large dependencies in client bundle
- [ ] Third-party scripts use `next/script` with appropriate loading strategy

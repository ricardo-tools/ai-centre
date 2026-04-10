---
name: nextjs-app-router-turbopack
description: >
  Next.js App Router + Turbopack patterns and decisions. Covers Turbopack as default bundler,
  Server Components vs Client Components, route organisation, caching model,
  rendering strategies, and performance. Apply when building with Next.js App
  Router — creating pages, choosing component boundaries, configuring routes,
  or diagnosing performance issues.
---

# Next.js App Router

Next.js App Router with Turbopack is the default stack. Turbopack for dev bundling, Server Components by default, Client Components only at explicit boundaries. Pages are thin wiring — they import from features, they don't contain logic.

---

## When to Use

Apply this skill when:
- Creating new pages or routes
- Deciding between Server Component and Client Component
- Placing `'use client'` boundaries
- Organising route segments (layouts, loading, error boundaries)
- Diagnosing slow dev startup, HMR, or build issues
- Optimising bundle size or rendering performance
- Working with Next.js caching behaviour

Do NOT use this skill for:
- Server Action patterns (validation, use cases) — see **backend-patterns**
- Cache invalidation (`revalidatePath`, `revalidateTag`) — see **backend-patterns**
- Auth middleware logic — see **security-review**
- Component/widget architecture — see **frontend-architecture**

---

## Core Rules

### 1. Turbopack is the default bundler

Turbopack runs by default in `next dev` from Next.js 15+. It is an incremental Rust-based bundler with file-system caching — restarts reuse previous work, HMR is near-instant.

Use Webpack only when a specific Webpack plugin has no Turbopack equivalent. This is the fallback, not the default.

| Situation | Bundler |
|---|---|
| Day-to-day development | Turbopack (default, no flag needed) |
| Webpack-only plugin required in dev | `next dev --webpack` |
| Production build | Uses Next.js default for your version (check docs) |

**If dev is slow:** verify Turbopack is active (check terminal output). Ensure `.next` cache isn't being cleared by another tool. Turbopack's FS cache under `.next` is what makes restarts fast — deleting `.next` forces a cold start.

### 2. Server Components by default, Client Components at boundaries

Every component is a Server Component unless it has `'use client'` at the top. Server Components run on the server, ship zero JavaScript to the browser, and can directly access data sources.

Use Client Components only when you need:
- Browser APIs (`useState`, `useEffect`, `useRef`, event handlers)
- Interactive UI (forms, toggles, modals, animations)
- Third-party libraries that require browser runtime

```
Page (Server) → fetches data, renders layout
  └─ DataDisplay (Server) → renders static content, zero JS
  └─ InteractiveWidget (Client) → handles clicks, manages state
       └─ Button (Client) → inherits client boundary from parent
```

**The `'use client'` boundary is a cliff, not a toggle.** Everything below a `'use client'` component is also client-side. Push the boundary as far down the tree as possible — wrap the interactive part, not the whole page.

### 3. Pages are thin wiring

A page file (`page.tsx`) imports from features and platform, passes server-fetched data to components, and declares metadata. It contains no business logic, no styling decisions, no complex rendering.

```tsx
// ✅ Thin page — imports, fetches, renders
import { SkillDetailView } from '@/features/skill-detail/SkillDetailView';

export default async function SkillPage({ params }: { params: { slug: string } }) {
  const skill = await fetchSkill(params.slug);
  if (!skill) notFound();
  return <SkillDetailView skill={skill} />;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const skill = await fetchSkill(params.slug);
  return { title: skill?.title ?? 'Skill Not Found' };
}
```

### 4. Layouts for shared UI, not shared data

Layouts (`layout.tsx`) wrap child routes with persistent UI — navigation, sidebars, shells. They re-render only their children on navigation, not themselves. Don't use layouts for data fetching that child routes need — children can't access parent layout data without prop drilling or context.

### 5. Use route segments for progressive UX

Loading and error boundaries are per-route-segment. Use them to show meaningful loading states and contained error recovery.

```
app/skills/[slug]/
  page.tsx          ← the content
  loading.tsx       ← skeleton shown while page.tsx streams
  error.tsx         ← error boundary wrapping this segment
  not-found.tsx     ← shown when notFound() is called
```

---

## Route Organisation

### Route groups

Use parenthesised folders to organise routes without affecting the URL:

```
app/
  (auth)/
    login/page.tsx          → /login
    verify/page.tsx         → /verify
  (dashboard)/
    page.tsx                → /
    skills/page.tsx         → /skills
  (admin)/
    admin/page.tsx          → /admin
```

Route groups can have their own `layout.tsx` — use this to apply different shells (e.g. minimal layout for auth pages, full shell for dashboard).

### Parallel routes

For split-pane or tab-based layouts where multiple views render simultaneously:

```
app/
  @sidebar/page.tsx
  @main/page.tsx
  layout.tsx        ← receives both as props: { sidebar, main }
```

Use sparingly. Most layouts are better served by the shell + slot pattern in **app-layout**.

---

## Server Components vs Client Components

### Decision framework

| Need | Component type |
|---|---|
| Fetch data from DB or API | Server |
| Render static or pre-computed content | Server |
| Access server-only resources (env vars, filesystem) | Server |
| SEO-critical content | Server |
| `useState`, `useEffect`, `useRef` | Client |
| Event handlers (`onClick`, `onChange`, `onSubmit`) | Client |
| Browser APIs (localStorage, IntersectionObserver) | Client |
| Third-party libs requiring browser (motion, Rive, charts) | Client |

### Composition pattern

Keep Server Components at the top, pass data down to Client Components as props. Don't wrap a Server Component inside a Client Component — the Server Component becomes client-rendered.

```tsx
// ✅ Server Component fetches, Client Component interacts
// page.tsx (Server)
export default async function SkillsPage() {
  const skills = await fetchSkills();
  return <SkillBrowser initialSkills={skills} />;
}

// SkillBrowser.tsx (Client — 'use client')
'use client';
export function SkillBrowser({ initialSkills }: { initialSkills: Skill[] }) {
  const [search, setSearch] = useState('');
  const filtered = initialSkills.filter(s => s.title.includes(search));
  return (
    <>
      <SearchInput value={search} onChange={setSearch} />
      <SkillGrid skills={filtered} />
    </>
  );
}
```

### Children pattern (Server content inside Client shell)

When a Client Component wraps Server content, use the `children` prop:

```tsx
// ClientShell.tsx — 'use client'
'use client';
export function AnimatedContainer({ children }: { children: React.ReactNode }) {
  return <motion.div animate={{ opacity: 1 }}>{children}</motion.div>;
}

// page.tsx — Server Component
export default async function Page() {
  const data = await fetchData();
  return (
    <AnimatedContainer>
      <ServerRenderedContent data={data} />  {/* still server-rendered */}
    </AnimatedContainer>
  );
}
```

---

## Caching Model

Next.js has four caching layers. Most caching bugs come from not understanding which layer is active.

| Layer | What it caches | Default | How to control |
|---|---|---|---|
| **Request memoization** | Duplicate `fetch()` calls in a single render | On (automatic dedup) | Automatic — same URL+options in one render = one request |
| **Data cache** | `fetch()` results across requests | On (cached indefinitely) | `fetch(url, { next: { revalidate: 60 } })` or `{ cache: 'no-store' }` |
| **Full route cache** | Pre-rendered HTML and RSC payload | On for static routes | Invalidate with `revalidatePath()` / `revalidateTag()` |
| **Router cache** | Client-side RSC payload for visited routes | On (30s dynamic, 5min static) | `router.refresh()` or navigation |

### Common confusion

**"My data isn't updating after a mutation"** — you mutated the database but didn't invalidate the cache. Call `revalidatePath()` or `revalidateTag()` in your Server Action after the mutation. See **backend-patterns** for the pattern.

**"My page is static but I need dynamic data"** — use `export const dynamic = 'force-dynamic'` on the route, or use `fetch()` with `{ cache: 'no-store' }`. This opts the route out of static pre-rendering.

**"My API route returns stale data"** — API routes (route handlers) cache GET responses by default. Add `export const dynamic = 'force-dynamic'` or use `{ cache: 'no-store' }` on fetches within.

---

## Performance

### Dynamic imports

Split heavy client-side code so it loads only when needed:

```tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,  // skip server-render for browser-only libs
});
```

Use for: chart libraries, rich text editors, animation-heavy components, anything that adds >50KB to the client bundle.

### Images

Always use `next/image`. It handles lazy loading, responsive sizing, and format conversion (WebP/AVIF).

```tsx
import Image from 'next/image';

<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
```

`priority` on above-the-fold images. All others lazy-load automatically.

### Fonts

Use `next/font` for zero-layout-shift font loading:

```tsx
import { Jost } from 'next/font/google';
const jost = Jost({ subsets: ['latin'], display: 'swap' });
```

Declare once in the root layout, apply via `className` or CSS variable.

### Bundle analysis

Use the Next.js bundle analyzer to find heavy dependencies:

```bash
ANALYZE=true npm run build
```

Configure in `next.config.ts`:
```ts
import withBundleAnalyzer from '@next/bundle-analyzer';
export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })({
  // ... next config
});
```

---

## Banned Patterns

- ❌ `'use client'` on a page or layout when only a child needs interactivity → push the boundary down to the interactive component
- ❌ Fetching data in Client Components when a Server Component could fetch and pass as props → fetch on the server, pass down
- ❌ Business logic in `page.tsx` → pages are thin wiring; logic lives in features
- ❌ Wrapping a Server Component inside a Client Component (makes it client-rendered) → use the children pattern instead
- ❌ Using `next dev --webpack` without a documented reason → Turbopack is the default
- ❌ Deleting `.next` routinely to "fix" dev issues → the FS cache is an asset; investigate the actual issue
- ❌ `export const dynamic = 'force-dynamic'` on every route → only opt out of static rendering when the route genuinely needs dynamic data
- ❌ Ignoring cache behaviour after mutations → call `revalidatePath` / `revalidateTag` in Server Actions
- ❌ `<img>` tags instead of `next/image` → use `next/image` for lazy loading, responsive sizing, and format optimization
- ❌ Self-hosted fonts loaded via `<link>` → use `next/font` for zero-layout-shift loading

---

## Quality Gate

Before delivering, verify:

- [ ] `next dev` runs with Turbopack (default, no `--webpack` flag unless documented reason)
- [ ] New pages are Server Components unless they need browser APIs
- [ ] `'use client'` boundaries are as far down the component tree as possible
- [ ] Pages contain no business logic — only imports, data fetching, and rendering
- [ ] Loading boundaries (`loading.tsx`) exist for routes with async data
- [ ] Error boundaries (`error.tsx`) exist for routes where data fetching can fail
- [ ] Mutations in Server Actions call `revalidatePath` / `revalidateTag` to invalidate caches
- [ ] Heavy client-side libraries loaded via `dynamic()` with `ssr: false`
- [ ] Images use `next/image`, fonts use `next/font`
- [ ] No `export const dynamic = 'force-dynamic'` without a documented reason

---
name: creative-toolkit
description: Opinionated library choices for visual assets, animation, and data visualization. Charts (ECharts primary, Nivo fallback), illustrations (unDraw, Humaaans), photography (Unsplash, Pexels), animation (Motion, GSAP, Rive). See creative-toolkit-charts-reference for the ECharts brand theme.
---

# Creative Toolkit

Opinionated library choices for visual richness. These libraries are the default — don't introduce alternatives without a documented reason.

Always pair with **brand-design-system** for colour tokens and **interaction-motion** for animation principles.

---

## When to Use

Apply this skill when:
- Adding illustrations or decorative graphics to a UI
- Selecting stock photography or video
- Adding animation (micro-interactions, page transitions, ambient motion)
- Adding data visualisation (charts, graphs, dashboards)
- Building empty states, hero sections, onboarding flows, or error pages

Do NOT use this skill for:
- Animation timing, easing, and duration principles — see **interaction-motion**
- Colour tokens or typography — see **brand-design-system**
- AI-generated images or video — see **ai-fal**

---

## Core Rules

### 1. The libraries are chosen — use them

| Need | Library | Why |
|---|---|---|
| **Illustrations (scenes)** | unDraw | SVG, customisable brand colour, consistent flat style |
| **Illustrations (people)** | Humaaans | Modular, mix-and-match, diverse representation |
| **Stock photography** | Unsplash + Pexels | Free, high quality, API access for both |
| **Stock video** | Pexels Videos + Mixkit | Free, no watermarks, good quality |
| **Animation engine** | Motion (primary) | Declarative React animation, spring physics |
| **Complex animation** | GSAP | Timeline sequencing, scroll-triggered, complex choreography |
| **Animation assets** | Rive | Lightweight interactive animations (.riv files) |
| **Charts (primary)** | ECharts (`echarts` + `echarts-for-react`) | Canvas-based, huge chart variety, built-in themes, SSR-capable, excellent performance with large datasets |
| **Charts (fallback)** | Nivo (`@nivo/*`) | SVG-based, React-native — use when you specifically need SVG output (print, inline SVG manipulation) or a chart type ECharts doesn't cover |

### 2. Assets are a primary design tool, not decoration

Illustrations and photos reduce the need for accent colour saturation. A page with a well-chosen illustration on a neutral background is more on-brand than a page saturated with orange and blue. Actively look for asset opportunities: empty states, hero sections, feature showcases, onboarding, error pages.

### 3. Brand-colour your assets

unDraw SVGs must be recoloured to brand orange (`#FF5A28`) or electric blue (`#1462D2`) before embedding. Never use the default purple. Humaaans colour palette should align with brand tokens.

### 4. Self-host everything

Never hotlink external URLs (Unsplash, Pexels) in production. Download assets and serve from your own CDN or static folder. External URLs break without notice.

### 5. One illustration style per page

Don't mix unDraw and Humaaans on the same page. Pick one style per page or flow for visual consistency.

---

## Illustrations

### unDraw (Primary — Scenes & Concepts)

Homepage: https://undraw.co

Open-source, flat SVG illustrations. Customise the accent colour to brand orange before downloading.

**Use for:** Empty states, onboarding steps, feature highlights, error pages, hero sections.

### Humaaans (Supplementary — People & Characters)

Homepage: https://www.humaaans.com

Modular illustration library — mix and match body parts, poses, and scenes. Use when you need people (team pages, testimonials, user avatars, collaboration concepts).

### Illustration Rules

- Always use SVG format (not PNG) — vector scales without blur on retina
- Recolour to brand palette before embedding — never use default library colours
- One illustration library per page/flow
- Size illustrations proportionally to surrounding content — don't let them dominate

---

## Stock Photography & Video

### Photography: Unsplash + Pexels

Both are free with no attribution required for most uses. Use Unsplash for lifestyle and editorial. Use Pexels for broader variety and API access.

**API usage (Pexels):**
```ts
const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=5`, {
  headers: { Authorization: process.env.PEXELS_API_KEY! },
});
```

### Video: Pexels Videos + Mixkit

Pexels Videos for general stock video. Mixkit for higher-quality cinematic clips (no API, manual download).

### Rules

- Self-host all assets in production — no hotlinking
- Always set a poster image on `<video>` elements
- Provide WebM + MP4 fallback for browser compatibility
- Compress before serving — target < 2MB for hero videos, < 500KB for background loops
- Respect licensing terms even when attribution isn't required

---

## Animation

### Motion (Primary Engine)

Declarative React animation. Use for most UI animation: enter/exit transitions, layout animations, gesture responses, spring physics.

```tsx
import { motion } from 'motion';

<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -4 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
/>
```

### GSAP (Complex Sequences)

Use when Motion can't handle it: multi-element timeline choreography, scroll-triggered sequences, complex SVG animation.

```ts
import gsap from 'gsap';

const tl = gsap.timeline();
tl.from('.hero-title', { opacity: 0, y: 30, duration: 0.6 })
  .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.4 }, '-=0.3')
  .from('.hero-cta', { opacity: 0, scale: 0.95, duration: 0.3 }, '-=0.2');
```

### Rive (Animation Assets)

Pre-built interactive animations loaded from `.riv` files. Use for: loading indicators, success celebrations, onboarding illustrations, branded micro-animations.

```tsx
import { useRive } from '@rive-app/react-canvas';

function LoadingAnimation() {
  const { RiveComponent } = useRive({
    src: '/animations/loading.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });
  return <RiveComponent style={{ width: 120, height: 120 }} />;
}
```

**Rules:**
- Target < 50KB per .riv file — optimise in Rive editor before export
- Always respect `prefers-reduced-motion` — disable autoplay when reduced motion is preferred
- Use `stateMachines` for interactive animations, `animations` for simple playback

### Animation Engine Selection

| Situation | Engine |
|---|---|
| Component enter/exit, layout shifts | Motion |
| Hover, press, drag gestures | Motion |
| Spring physics | Motion |
| Multi-step timeline with precise control | GSAP |
| Scroll-triggered sequences | GSAP (ScrollTrigger) |
| Complex SVG path animation | GSAP |
| Pre-built branded micro-animations | Rive |
| Loading indicators, success states | Rive |

For animation principles (duration, easing, purpose), see **interaction-motion**.

---

## Data Visualisation — ECharts (Primary)

ECharts is the charting library. Canvas-based (with optional SVG renderer), huge chart variety, excellent performance.

```bash
npm install echarts echarts-for-react
```

### When to use Nivo instead

Use Nivo only when you specifically need SVG output (for print, inline SVG manipulation, or a chart type ECharts doesn't cover). Install only the Nivo packages you need: `@nivo/bar`, `@nivo/line`, etc.

For the ECharts brand theme, colour sequences, and usage patterns, see **creative-toolkit-charts-reference**.

### Chart Rules

1. **Clean over clever.** Remove gridlines, legends, and axes that don't add understanding. Label data directly when possible.
2. **One insight per chart.** Title states the insight: "Revenue grew 34% after launch" not "Revenue by Quarter."
3. **Border radius on bars.** `borderRadius: 4` — matches the brand's rounded aesthetic.
4. **No 3D effects.** No gradients on data, no shadows on bars, no perspective on pies.
5. **Animate on entry.** Use ECharts' built-in `animationDuration: 600` with `animationEasing: 'cubicOut'`.
6. **Tooltips inherit the theme.** Brand tooltip style is in the theme — don't override per chart.
7. **Generous grid.** Default `grid: { top: 24, right: 24, bottom: 48, left: 64 }`.
8. **Pie/donut sparingly.** Prefer bar charts for comparisons. Pie only for parts-of-whole with ≤ 5 segments.
9. **Max 6 series.** More colours becomes noise. Group or filter beyond 6.
10. **Accessible.** Don't rely on colour alone — use labels, patterns, or annotation alongside colour.

---

## Banned Patterns

- ❌ Default purple unDraw illustrations → recolour to brand orange or blue before embedding
- ❌ Mixing illustration styles on the same page → one library per page/flow
- ❌ Hotlinking external asset URLs in production → self-host all assets
- ❌ PNG illustrations → always SVG (vector scales on retina)
- ❌ Video without poster image → always set a poster frame
- ❌ Rive files > 50KB → optimise in editor before export
- ❌ Hardcoded colours in individual charts → use the brand theme and `CHART_COLORS` from the chart reference
- ❌ More than 6 chart series → group or filter
- ❌ Introducing alternative libraries (Chart.js, Recharts, Lottie) without documented reason → use ECharts (or Nivo for SVG-specific needs)
- ❌ Ignoring `prefers-reduced-motion` for animations → disable autoplay, provide instant fallbacks

---

## Quality Gate

Before delivering, verify:

- [ ] Illustrations are SVG format, recoloured to brand palette
- [ ] One illustration style per page (don't mix unDraw and Humaaans)
- [ ] All assets self-hosted, no external hotlinks
- [ ] Video has poster image and WebM + MP4 fallback
- [ ] Animation engine matches the need (Motion for UI, GSAP for complex, Rive for assets)
- [ ] `prefers-reduced-motion` respected in all animations
- [ ] Rive files < 50KB
- [ ] Charts use the brand ECharts theme and `CHART_COLORS` — no per-chart colour overrides
- [ ] Chart titles state insights, not labels
- [ ] Max 6 series per chart
- [ ] Charts accessible — not relying on colour alone

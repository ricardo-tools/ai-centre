---
name: flow-eval-driven
description: >
  Opinion companion for flow. Eval-driven development — implement each
  scenario, evaluate by running the app like a real user (Playwright headless,
  console logs, server logs, HTML inspection, screenshots), then run the targeted
  test. Activate when you want tight feedback loops between implementation and
  verification.
---

# Flow: Eval-Driven

Every change gets evaluated by **running the app like a real user** before moving to the next scenario. The feedback loop is: implement → start server → eval via Playwright headless + logs + inspection → run targeted test → green → next.

This is an opinion companion to **flow** (core). It hooks in during **IMPLEMENTATION** — adding a hands-on eval step to each phase.

---

## When to Use

Activate this opinion when:
- Working on multi-scenario changes where you want to verify each one individually
- Building UI features that need visual verification
- Building AI features that need layered evaluation
- You want to catch problems early instead of at the end
- The full test suite is slow and running it after every change wastes time

---

## Core Rules

### 1. Eval by running the app — not just reading code

The AI companion must actually **run the application** and verify behaviour. Reading code is not evaluation. "It should work" is not evaluation. Evaluation means:

1. Start the dev server (`npm run dev`)
2. Use the app through a real browser (Playwright headless)
3. Inspect the results using every tool available
4. Diagnose any issues before declaring the scenario complete

### 2. Per-scenario feedback loop

For each scenario in the plan:

```
1. IMPLEMENT — write the minimum code for this scenario
2. EVAL — run the app, verify behaviour (see eval toolkit below)
3. TEST — run the targeted test(s) for this scenario
4. Green → next scenario. Red → fix before moving on.
```

### 3. The eval toolkit — use ALL available tools

When evaluating a scenario, the AI companion has access to these tools and **should use them aggressively**:

| Tool | What it reveals | When to use |
|---|---|---|
| **Playwright headless** | Navigate pages, click buttons, fill forms, verify DOM state, take screenshots | Every UI scenario |
| **Screenshots (vision)** | Visual layout, branding, spacing, theme correctness, responsive behaviour | UI scenarios, especially after styling changes |
| **Console logs** | Client-side errors, warnings, React hydration issues | Every scenario |
| **Server logs** (`/api/logs` ring buffer, Pino output) | Server-side errors, query timing, auth failures, permission denials | Backend scenarios, API routes, server actions |
| **HTML inspection** | DOM structure, aria attributes, semantic elements, data-testid presence | Accessibility, component structure |
| **Network requests** | API response codes, payloads, timing, failed fetches | API integration, auth flow |
| **Database state** (Drizzle Studio or direct query) | Records created/updated, audit columns, soft delete state | Data mutation scenarios |
| **`curl` / `fetch`** | Direct API endpoint testing without UI | API routes, webhooks |

### 4. Playwright headless for UI evaluation

Use Playwright's API in a throwaway script or inline to evaluate UI scenarios. This is NOT a test — it's a diagnostic tool.

```typescript
// Quick eval script — run via: npx playwright test --headed eval.ts
// Or use Playwright's API directly in a Node script

import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Navigate and evaluate
await page.goto('http://localhost:3000/users');
await page.waitForLoadState('networkidle');

// Take screenshot for visual inspection
await page.screenshot({ path: 'eval-users-page.png', fullPage: true });

// Check for console errors
page.on('console', msg => { if (msg.type() === 'error') console.log('CONSOLE ERROR:', msg.text()); });

// Inspect DOM
const userRows = await page.locator('table tbody tr').count();
console.log(`Users in table: ${userRows}`);

// Check accessibility
const nav = await page.locator('nav[aria-label="Main"]').isVisible();
console.log(`Main nav visible: ${nav}`);

await browser.close();
```

### 5. Screenshot-based visual verification

After implementing a UI change, take a screenshot and use vision to verify:
- Layout matches expectations (3-zone TopBar, responsive behaviour)
- Brand tokens applied correctly (colours, spacing, typography)
- Theme switching works (light vs night)
- Responsive behaviour at different viewport sizes
- Empty states, loading states, error states render correctly

```typescript
// Multi-viewport screenshot eval
for (const width of [375, 768, 1280]) {
  await page.setViewportSize({ width, height: 800 });
  await page.screenshot({ path: `eval-${width}.png` });
}
```

### 6. Server log inspection during eval

Check server logs for issues that aren't visible in the UI:

```bash
# If dev server is running with Pino:
# Logs stream to stdout — pipe through pino-pretty

# Or hit the log ring buffer API:
curl http://localhost:3000/api/logs?level=error&limit=20

# Check for:
# - Permission denied errors (RBAC misconfigured)
# - Database query errors (schema mismatch)
# - Unhandled promise rejections
# - Slow queries (> 100ms in dev)
```

### 7. Don't run the full suite during development

Per-scenario testing is faster and provides clearer signal:
- **During development:** run only the test(s) for the current scenario
- **After all scenarios complete:** run the full suite (hardening)
- **Before delivery:** full suite must pass with 0 failures

### 8. Manual eval BEFORE automated test

The eval catches things tests don't: visual regressions, UX feel, response time, edge cases. Always eval first, then confirm with the automated test.

### 9. Layered evals for AI features

| Layer | What It Checks | Cost | Speed |
|---|---|---|---|
| **Deterministic** | Format, structure, length, required fields, banned content | Free | Instant |
| **LLM-as-judge** | Quality, coherence, accuracy, tone | ~$0.01-0.10 | 1-5s |
| **Human review** | Calibration, edge cases, UX quality | Time | Slow |

Run deterministic evals on every change. LLM-as-judge on PRs or significant changes. Human review for calibration.

### 10. Eval evidence — capture and report

After evaluating, report what was found:

```
Eval: Users page — admin view
  ✓ Screenshot (1280px): table renders with 5 users, role badges coloured
  ✓ Screenshot (375px): cards layout, hamburger menu works
  ✓ Console: 0 errors
  ✓ Server logs: 0 errors, query took 12ms
  ✓ Invite dialog: opens, validates domain, shows role dropdown
  ✗ Issue: role dropdown shows all roles including admin — should exclude >= own level
  → Fix needed before moving to next scenario
```

---

## Banned Patterns

- Running full suite after every small change → per-scenario during dev, full suite at hardening
- Evaluating by reading code only ("the code looks correct") → run the app, use it, verify visually
- Skipping screenshot verification for UI changes → always capture and inspect
- Ignoring console/server errors during eval → check both every time
- Moving to next scenario with known issues → fix first, then move on
- AI features without deterministic evals → always check format/structure first
- Eval criteria based on imagined failures → start from real behaviour

---

## Quality Gate

Before delivering eval-driven work:

- [ ] Each scenario was evaluated by running the app (not just reading code)
- [ ] Playwright headless used for UI evaluation with screenshots captured
- [ ] Console errors checked during every eval (0 errors expected)
- [ ] Server logs checked during every eval (0 unexpected errors)
- [ ] Screenshots reviewed for visual correctness at key breakpoints
- [ ] Targeted tests ran per-scenario (not full suite during dev)
- [ ] AI features have deterministic eval layer
- [ ] Debug logging was available and used for diagnosing failures
- [ ] Full suite passed at hardening (0 failures)

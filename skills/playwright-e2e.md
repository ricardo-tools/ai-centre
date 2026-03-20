---
name: playwright-e2e
description: >
  End-to-end testing patterns with Playwright. Covers test organisation, page
  objects, assertions, visual regression, authentication flows, CI sharding,
  and flaky test management. Apply when writing, organising, or debugging
  Playwright E2E tests. For deciding what to test at which level, see
  testing-strategy.
---

# Playwright E2E

Playwright tests exercise the full application through a real browser — real rendering, real network requests, real middleware, real Server Components. They are the highest-confidence tests and the only way to test async Server Components, auth flows, and cross-page navigation.

Playwright is the default. Not Cypress.

---

## When to Use

Apply this skill when:
- Writing or modifying E2E tests
- Testing user flows that span multiple pages
- Testing auth flows (login, OTP verification, session expiry)
- Testing async Server Components or middleware redirect behaviour
- Setting up visual regression testing
- Configuring Playwright in CI (sharding, parallelism, artifacts)
- Debugging flaky or slow E2E tests

Do NOT use this skill for:
- Deciding what to test at which level — see **testing-strategy**
- Unit testing domain objects or Server Actions — see **testing-strategy**
- Component testing with RTL — see **testing-strategy**

---

## Core Rules

### 1. Test user outcomes, not page internals

An E2E test is a user story executed by a robot. Write tests that describe what the user does and what they see — not what the DOM looks like or what API calls were made.

```ts
// ✅ User outcome — reads like a story
test('user can publish a draft skill', async ({ page }) => {
  await page.goto('/skills/clean-architecture');
  await page.getByRole('button', { name: 'Publish' }).click();
  await expect(page.getByText('Published — v1.0.0')).toBeVisible();
});

// ❌ Implementation detail — tests the DOM, not the experience
test('publish button triggers API call', async ({ page }) => {
  const apiPromise = page.waitForResponse('/api/skills/*/publish');
  await page.click('[data-testid="publish-btn"]');
  const response = await apiPromise;
  expect(response.status()).toBe(200);
});
```

### 2. Use role-based selectors, not test IDs

Playwright's role-based locators (`getByRole`, `getByLabel`, `getByText`) test what the user actually sees. They also enforce accessibility — if the selector can't find the element by role, the element is probably inaccessible.

```ts
// ✅ Role-based — accessible, resilient to markup changes
await page.getByRole('button', { name: 'Publish' }).click();
await page.getByLabel('Search skills').fill('architecture');
await page.getByRole('link', { name: 'Clean Architecture' }).click();

// ❌ Test IDs — fragile, don't enforce accessibility
await page.click('[data-testid="publish-btn"]');
await page.fill('[data-testid="search-input"]', 'architecture');
```

Use `data-testid` only as a last resort when no semantic selector works (e.g. a canvas element, a complex custom widget).

### 3. Each test is independent

Tests must not depend on each other's state. Each test starts from a clean state — its own browser context, its own auth session (if needed), its own data. Parallel execution and test isolation require this.

### 4. Page objects for repeated interactions

When multiple tests interact with the same page, extract a page object. This keeps tests readable and makes selector changes a single-point fix.

### 5. Visual regression for craft quality

Use Playwright's built-in `toHaveScreenshot()` to catch visual regressions — spacing changes, colour shifts, layout breaks. This tests the craft dimension of quality that functional tests miss.

---

## Project Setup

```
tests/
  e2e/
    auth.spec.ts              ← login, logout, session flows
    skills.spec.ts            ← skill browsing, detail, download
    project-generation.spec.ts ← the generation flow
    admin.spec.ts             ← admin-only features
  pages/
    SkillsPage.ts             ← page object for /skills
    LoginPage.ts              ← page object for /login
    GeneratePage.ts           ← page object for /generate
  fixtures/
    auth.ts                   ← authenticated context fixture
  playwright.config.ts
```

### Configuration

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,     // retry once in CI for flakiness
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? 'html' : 'list',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',            // capture trace on flaky test retry
    screenshot: 'only-on-failure',
  },

  webServer: {
    command: 'npm run build && npm run start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Page Objects

A page object encapsulates selectors and common interactions for a specific page. Tests use the page object, not raw selectors.

```ts
// tests/pages/SkillsPage.ts
import { type Page, type Locator } from '@playwright/test';

export class SkillsPage {
  readonly searchInput: Locator;
  readonly skillCards: Locator;
  readonly officialFilter: Locator;

  constructor(private page: Page) {
    this.searchInput = page.getByLabel('Search skills');
    this.skillCards = page.getByRole('article');
    this.officialFilter = page.getByRole('button', { name: 'Official' });
  }

  async goto() {
    await this.page.goto('/skills');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    // Auto-wait for results to update after debounce
    await expect(this.skillCards.first()).toBeVisible();
  }

  async filterOfficial() {
    await this.officialFilter.click();
  }

  async clickSkill(title: string) {
    await this.page.getByRole('link', { name: title }).click();
  }
}
```

```ts
// tests/e2e/skills.spec.ts
import { test, expect } from '@playwright/test';
import { SkillsPage } from '../pages/SkillsPage';

test.describe('Skill Library', () => {
  test('search filters skills by title', async ({ page }) => {
    const skills = new SkillsPage(page);
    await skills.goto();

    await skills.search('architecture');

    await expect(skills.skillCards).toHaveCount(2);
    await expect(page.getByText('Clean Architecture')).toBeVisible();
    await expect(page.getByText('Frontend Architecture')).toBeVisible();
  });

  test('clicking a skill navigates to detail page', async ({ page }) => {
    const skills = new SkillsPage(page);
    await skills.goto();
    await skills.clickSkill('Clean Architecture');

    await expect(page).toHaveURL(/\/skills\/clean-architecture/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Clean Architecture');
  });
});
```

---

## Authentication in Tests

### Auth fixture

Create an authenticated browser context that tests can reuse. Don't log in through the UI in every test — it's slow and couples every test to the login flow.

```ts
// tests/fixtures/auth.ts
import { test as base } from '@playwright/test';

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set auth cookie directly (bypass login UI)
    await context.addCookies([{
      name: 'auth-token',
      value: process.env.TEST_AUTH_TOKEN!,
      domain: 'localhost',
      path: '/',
    }]);

    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
```

```ts
// tests/e2e/admin.spec.ts
import { test, expect } from '../fixtures/auth';

test('admin can view audit log', async ({ authenticatedPage: page }) => {
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Audit Log' })).toBeVisible();
});
```

### Testing the login flow itself

One dedicated test file exercises the actual login UI:

```ts
// tests/e2e/auth.spec.ts
test.describe('Login', () => {
  test('shows error for unallowed email domain', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('user@gmail.com');
    await page.getByRole('button', { name: 'Send code' }).click();

    await expect(page.getByText(/domain is not allowed/i)).toBeVisible();
  });

  test('completes OTP flow for allowed domain', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@ezycollect.com.au');
    await page.getByRole('button', { name: 'Send code' }).click();

    // In test environment, OTP is deterministic or exposed via test API
    await page.getByLabel('Code').fill('123456');
    await page.getByRole('button', { name: 'Verify' }).click();

    await expect(page).toHaveURL('/');
  });
});
```

---

## Visual Regression

Playwright's built-in `toHaveScreenshot()` captures and compares screenshots. No external service needed to start.

```ts
test('skill detail page matches visual baseline', async ({ page }) => {
  await page.goto('/skills/clean-architecture');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('skill-detail.png', {
    maxDiffPixelRatio: 0.01,  // allow 1% pixel difference (anti-aliasing)
  });
});

test('dashboard renders correctly on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('dashboard-mobile.png');
});
```

**Workflow:**
1. First run creates baseline screenshots in `tests/e2e/__screenshots__/`
2. Subsequent runs compare against baselines
3. If the diff exceeds the threshold, the test fails with a visual diff
4. Intentional changes: run `npx playwright test --update-snapshots` to update baselines
5. Commit updated baselines with the code change

**What to screenshot:** Key pages at key breakpoints. Don't screenshot everything — focus on pages where visual consistency matters most (landing page, skill detail, dashboard).

---

## Assertions

### Prefer web-first assertions

Playwright's `expect` assertions auto-wait for the condition to be true. No manual waits needed.

```ts
// ✅ Auto-waits for the element to appear and contain text
await expect(page.getByRole('heading')).toContainText('Published');

// ✅ Auto-waits for navigation
await expect(page).toHaveURL(/\/skills\//);

// ❌ Manual wait — fragile, slow
await page.waitForTimeout(2000);
expect(await page.textContent('h1')).toContain('Published');
```

### Common assertions

```ts
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toHaveText('exact text');
await expect(locator).toContainText('partial');
await expect(locator).toHaveCount(5);
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(page).toHaveURL(/pattern/);
await expect(page).toHaveTitle('Page Title');
```

---

## Handling Async and Loading States

```ts
test('project generation shows progress then download link', async ({ page }) => {
  await page.goto('/generate');

  // Fill the form
  await page.getByLabel('Describe your idea').fill('A dashboard for monitoring API health');
  await page.getByRole('button', { name: 'Generate' }).click();

  // Wait for generation (may take several seconds)
  await expect(page.getByText('Generating')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download' })).toBeVisible({ timeout: 30000 });
});
```

Set explicit timeouts for known slow operations. Default timeout (30s) is fine for navigation. Long async operations (AI generation, ZIP creation) may need a longer timeout.

---

## Flaky Test Management

Flaky tests erode trust in the test suite. Manage them actively.

**Prevention:**
- Use auto-waiting assertions (never `waitForTimeout`)
- Use role-based selectors (resilient to DOM changes)
- Isolate test state (each test gets its own context)
- Wait for `networkidle` or specific elements, not arbitrary delays

**Detection:**
- `retries: 1` in CI catches flaky tests (pass on retry = flaky)
- Playwright's HTML reporter marks flaky tests explicitly
- `trace: 'on-first-retry'` captures a full trace for debugging the flaky case

**Resolution:**
- If a test flakes more than twice in a week, fix it or delete it
- Common causes: race conditions (add proper waits), shared state (isolate), animation timing (disable animations in tests)
- Disable CSS animations in tests for stability:

```ts
// playwright.config.ts
use: {
  // Disable animations for stable screenshots and timing
  launchOptions: {
    args: ['--force-prefers-reduced-motion'],
  },
},
```

---

## CI Sharding

Split E2E tests across multiple runners for speed.

```yaml
e2e:
  strategy:
    matrix:
      shard: [1, 2, 3, 4]
  steps:
    - run: npx playwright test --shard=${{ matrix.shard }}/4
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: playwright-report-${{ matrix.shard }}
        path: playwright-report/
```

Start with 4 shards. Increase as the suite grows. Each shard runs independently — Playwright distributes tests evenly across shards.

Upload reports as artifacts on failure for debugging. The HTML report includes screenshots, traces, and video for failed tests.

---

## Banned Patterns

- ❌ `page.waitForTimeout(ms)` for timing → use auto-waiting assertions (`expect(locator).toBeVisible()`)
- ❌ CSS selectors or XPath for element selection → use role-based locators (`getByRole`, `getByLabel`, `getByText`)
- ❌ `data-testid` as the primary selector strategy → role-based first, test IDs as last resort
- ❌ Login through the UI in every test → use auth fixtures with pre-set cookies
- ❌ Tests that depend on other tests' state → each test is independent, own context, own data
- ❌ Ignoring flaky tests ("just retry") → fix within a week or delete
- ❌ Cypress → Playwright is faster, cheaper in CI, better browser coverage, native parallelism
- ❌ Testing API responses in E2E → test user-visible outcomes, not network details
- ❌ Running E2E against dev server in CI → build first, then run against production build

---

## Quality Gate

Before delivering E2E tests, verify:

- [ ] Tests describe user outcomes, not DOM implementation details
- [ ] Selectors use `getByRole`, `getByLabel`, `getByText` — not CSS selectors or test IDs
- [ ] Each test is independent — no shared state between tests
- [ ] Auth is handled via fixture (pre-set cookies), not UI login in every test
- [ ] Known slow operations have explicit timeouts (don't rely on default)
- [ ] No `waitForTimeout` — only auto-waiting assertions
- [ ] Visual regression screenshots exist for key pages at key breakpoints
- [ ] Tests run against a production build in CI (`npm run build` before `playwright test`)
- [ ] CI uses sharding for parallel execution
- [ ] Flaky tests are tracked and resolved within one week
- [ ] Test reports and traces upload as CI artifacts on failure

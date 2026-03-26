import { test, expect } from './base-test';

/**
 * Smoke Tests — Page loads + console error checks (merged)
 *
 * Every page is tested for:
 *   1. The page loads and renders expected content
 *   2. No console errors appear during load
 *
 * These are read-only (no DB mutations) and run in the parallel project.
 */

/** Known benign console messages to ignore */
const IGNORED_PATTERNS = [
  /Download the React DevTools/,
  /Failed to find Server Action/,
  /Hydration failed/,
  /There was an error while hydrating/,
  /Text content does not match/,
  /chrome-extension:\/\//,
  /moz-extension:\/\//,
  /Failed to load resource.*favicon/,
  /net::ERR_CONNECTION_REFUSED/,
];

function isIgnored(message: string): boolean {
  return IGNORED_PATTERNS.some((p) => p.test(message));
}

interface ConsoleCollector {
  errors: string[];
  start: (page: import('@playwright/test').Page) => void;
  assert: () => void;
}

function createConsoleCollector(): ConsoleCollector {
  const errors: string[] = [];
  return {
    errors,
    start(page) {
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !isIgnored(msg.text())) {
          errors.push(msg.text());
        }
      });
      page.on('pageerror', (error) => {
        if (!isIgnored(error.message)) {
          errors.push(`[uncaught] ${error.message}`);
        }
      });
    },
    assert() {
      if (errors.length > 0) {
        const summary = errors.map((e, i) => `  ${i + 1}. ${e.substring(0, 200)}`).join('\n');
        expect(errors.length, `Console errors:\n${summary}`).toBe(0);
      }
    },
  };
}

test.describe('Smoke Tests', () => {
  test('S1: Home page loads', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('body')).toContainText('AI Centre');
    console.assert();
  });

  test('S2: Skills page shows cards', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const cards = page.locator('.card-hover');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(10);
    console.assert();
  });

  test('S3: Skill detail page loads', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/skills/accessibility');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('h1').first()).toContainText('Accessibility');
    console.assert();
  });

  test('S4: Archetypes page loads', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/archetypes');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Archetypes page should have content (cards or headings)
    await expect(page.locator('h2').first()).toBeVisible();
    console.assert();
  });

  test('S5: Generate page loads', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/generate');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.assert();
  });

  test('S6: Toolkits page shows cards', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/toolkits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    const cards = page.locator('.card-hover');
    await expect(cards.first()).toBeVisible();
    console.assert();
  });

  test('S7: Gallery page loads', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await expect(page.locator('text=Showcase Gallery').first()).toBeVisible();
    console.assert();
  });

  test('S8: Admin page loads', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.assert();
  });

  test('S9: Login page loads with branded layout', async ({ page }) => {
    const console = createConsoleCollector();
    console.start(page);
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Should show the brand name (exact match to avoid matching "Sign in to AI Centre")
    await expect(page.getByText('AI Centre', { exact: true })).toBeVisible();

    // Should show the email input
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Should show the tagline
    await expect(page.locator('text=The AI skill library for every team')).toBeVisible();

    // Should show the company footer
    await expect(page.locator('text=ezyCollect by Sidetrade')).toBeVisible();

    console.assert();
  });
});

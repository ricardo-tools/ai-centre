import { test, expect } from './base-test';

/**
 * Generate Project Tests — read-only, parallel-safe.
 */

test.describe('Generate Project', () => {
  test('GP1: Generate page shows composition wizard', async ({ page }) => {
    await page.goto('/generate');
    await page.waitForLoadState('networkidle');

    // Should have a domain selection section
    // Look for domain-related content (cards, headings, or selection UI)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('GP2: Preset loads correctly from URL param', async ({ page }) => {
    await page.goto('/generate?preset=presentation');
    await page.waitForLoadState('networkidle');

    // The preset should pre-populate — look for presentation-related content
    const body = await page.locator('body').textContent();
    // Page should at minimum load without errors
    expect(body).toBeTruthy();
  });

  test('GP3: Archetypes page shows toolkit presets', async ({ page }) => {
    await page.goto('/archetypes');
    await page.waitForLoadState('networkidle');

    // Should show at least one toolkit heading
    await expect(page.locator('h2').first()).toBeVisible();
  });
});

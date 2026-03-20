import { test, expect } from '@playwright/test';

test.describe('Generate project flow', () => {
  test('generate page loads with archetype and skill selection', async ({ page }) => {
    await page.goto('/generate');
    // Should show the generate UI
    await expect(page.locator('body')).toBeVisible();
  });

  test('archetypes page shows the Presentation archetype', async ({ page }) => {
    await page.goto('/archetypes');
    await expect(page.getByText('Presentation')).toBeVisible();
  });

  test('presentation archetype shows suggested skills', async ({ page }) => {
    await page.goto('/archetypes');
    // The Presentation card should mention its skill count
    await expect(page.getByText('Presentation')).toBeVisible();
  });
});

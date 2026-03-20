import { test, expect } from '@playwright/test';

test.describe('Smoke tests', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/AI Centre/i);
  });

  test('skills page lists skills', async ({ page }) => {
    await page.goto('/skills');
    // Should have at least one skill card link
    const skillLinks = page.locator('a[href^="/skills/"]');
    await expect(skillLinks.first()).toBeVisible();
  });

  test('skill detail page loads', async ({ page }) => {
    await page.goto('/skills/frontend-architecture');
    await expect(page.locator('h1')).toContainText('Frontend Architecture');
  });

  test('archetypes page loads', async ({ page }) => {
    await page.goto('/archetypes');
    await expect(page.locator('text=Presentation')).toBeVisible();
  });

  test('generate page loads', async ({ page }) => {
    await page.goto('/generate');
    // Page should render without crashing
    await expect(page.locator('body')).toBeVisible();
  });
});

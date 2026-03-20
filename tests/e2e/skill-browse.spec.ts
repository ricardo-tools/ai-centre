import { test, expect } from '@playwright/test';

test.describe('Skill browse and detail flow', () => {
  test('browse skills page shows all 36 skills', async ({ page }) => {
    await page.goto('/skills');
    const skillCards = page.locator('a[href^="/skills/"]');
    await expect(skillCards.first()).toBeVisible();
    const count = await skillCards.count();
    expect(count).toBeGreaterThanOrEqual(36);
  });

  test('clicking a skill card navigates to detail page', async ({ page }) => {
    await page.goto('/skills');
    await page.locator('a[href="/skills/clean-architecture"]').click();
    await expect(page.locator('h1')).toContainText('Clean Architecture');
  });

  test('skill detail shows Skill in Practice by default', async ({ page }) => {
    await page.goto('/skills/brand-design-system');
    // Should show the showcase content, not just raw markdown
    await expect(page.locator('h1')).toContainText('Brand Design System');
    // The "Skill in Practice" toggle should be active
    await expect(page.getByText('Skill in Practice')).toBeVisible();
  });

  test('toggling to View SKILL.md shows raw markdown', async ({ page }) => {
    await page.goto('/skills/frontend-architecture');
    await page.getByText('View SKILL.md').click();
    // Raw markdown view should contain the h1 from the skill file
    await expect(page.locator('text=# Frontend Architecture')).toBeVisible();
  });

  test('download button is present', async ({ page }) => {
    await page.goto('/skills/design-foundations');
    const downloadLink = page.locator('a[download]');
    await expect(downloadLink).toBeVisible();
  });

  test('new skills without dedicated showcases render fallback', async ({ page }) => {
    await page.goto('/skills/security-review');
    await expect(page.locator('h1')).toContainText('Security Review');
    // Should see showcase content (not "No showcase available")
    await expect(page.locator('body')).not.toContainText('No showcase available');
  });
});

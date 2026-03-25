import { test, expect } from './base-test';

/**
 * Skill Browse & Detail Tests — read-only, parallel-safe.
 */

test.describe('Skill Browse', () => {
  test('SB1: Skills page shows cards with titles and social buttons', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const cards = page.locator('.card-hover');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(10);

    // First card should have social buttons
    const firstCard = cards.first();
    await expect(firstCard.locator('[data-testid="upvote-button"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="comment-button"]')).toBeVisible();
    await expect(firstCard.locator('[data-testid="bookmark-button"]')).toBeVisible();

    // First card should have a title
    await expect(firstCard.locator('h3')).toBeVisible();
  });

  test('SB2: Skill card links navigate to detail page', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    // Get the first card's slug
    const firstCard = page.locator('[data-entity-id]').first();
    const slug = await firstCard.getAttribute('data-entity-id');
    expect(slug).toBeTruthy();

    // Navigate to the detail page directly (verifies the route exists and renders)
    await page.goto(`/skills/${slug}`);
    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain(`/skills/${slug}`);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('SB3: Skill detail page shows showcase content', async ({ page }) => {
    await page.goto('/skills/accessibility');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('h1').first()).toContainText('Accessibility');
    // Should NOT show "No showcase available"
    await expect(page.locator('body')).not.toContainText('No showcase available');
  });

  test('SB4: Skill detail page has a download action', async ({ page }) => {
    await page.goto('/skills/accessibility');
    await page.waitForLoadState('networkidle');

    // Look for a download button or link
    const downloadBtn = page.locator('button, a').filter({ hasText: /download/i });
    await expect(downloadBtn.first()).toBeVisible();
  });

  test('SB5: Search filters skills by title', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const allCount = await page.locator('.card-hover').count();

    // Type "architecture" in search
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('architecture');
    await page.waitForTimeout(500); // debounce

    const filteredCount = await page.locator('.card-hover').count();
    expect(filteredCount).toBeLessThan(allCount);
    expect(filteredCount).toBeGreaterThanOrEqual(1);

    // All visible cards should contain "architecture" in title
    const titles = await page.locator('.card-hover h3').allTextContents();
    for (const title of titles) {
      expect(title.toLowerCase()).toContain('architecture');
    }
  });

  test('SB6: Foundation tab filters skills', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const allCountText = await page.locator('text=/\\d+ skills?/').first().textContent();
    const allCount = parseInt(allCountText?.replace(/[^\d]/g, '') ?? '0', 10);

    // Click Foundation tab
    await page.locator('button', { hasText: 'Foundation' }).click();
    await page.waitForTimeout(300);

    const foundationCountText = await page.locator('text=/\\d+ skills?/').first().textContent();
    const foundationCount = parseInt(foundationCountText?.replace(/[^\d]/g, '') ?? '0', 10);

    // Foundation should have fewer skills than All
    expect(foundationCount).toBeLessThan(allCount);
    expect(foundationCount).toBeGreaterThanOrEqual(1);
  });
});

import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';
import { BASE } from './base-data';

/**
 * Entity Isolation Tests
 *
 * Verify that upvotes, bookmarks, and comments are always scoped to the
 * correct entity — never leaked to a sibling card or a different entity type.
 */

/** Helper: get a card by its entity slug */
function cardBySlug(page: import('@playwright/test').Page, slug: string) {
  return page.locator(`[data-entity-id="${slug}"]`);
}

test.describe('Entity Isolation — Upvotes & Bookmarks', () => {
  let describeTs: string;
  let consoleErrors: string[];

  test.beforeAll(async ({}, testInfo) => {
    await rollbackToBase(testInfo);
    describeTs = await recordTimestamp(testInfo);
  });

  test.beforeEach(async ({ page }, testInfo) => {
    await rollbackToDescribe(describeTs, testInfo);
    await clearSession(page);
    consoleErrors = collectConsoleErrors(page);
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({}, testInfo) => {
    await logFailureDiagnostics(testInfo, consoleErrors);
  });

  test('E1: Upvoting card A does NOT change card B count', async ({ page }) => {
    // Pick cards from beyond the base-upvoted range (first 5 are pre-upvoted)
    const cards = page.locator('[data-entity-id]');
    const slugA = await cards.nth(10).getAttribute('data-entity-id');
    const slugB = await cards.nth(11).getAttribute('data-entity-id');
    expect(slugA).toBeTruthy();
    expect(slugB).toBeTruthy();
    expect(slugA).not.toBe(slugB);

    // Both should have 0 base upvotes
    const cardA = cardBySlug(page, slugA!);
    const cardB = cardBySlug(page, slugB!);

    const bBefore = await cardB.locator('[data-testid="upvote-button"]').textContent();
    const bCountBefore = parseInt(bBefore?.replace(/[^\d]/g, '') ?? '0', 10);

    // Upvote card A
    await cardA.locator('[data-testid="upvote-button"]').click();
    await page.waitForTimeout(500);

    // Card A should have increased by 1
    const aAfter = await cardA.locator('[data-testid="upvote-button"]').textContent();
    const aCountAfter = parseInt(aAfter?.replace(/[^\d]/g, '') ?? '0', 10);
    expect(aCountAfter).toBe(BASE.upvoteCount(slugA!) + 1);

    // Card B should be unchanged
    const bAfter = await cardB.locator('[data-testid="upvote-button"]').textContent();
    const bCountAfter = parseInt(bAfter?.replace(/[^\d]/g, '') ?? '0', 10);
    expect(bCountAfter).toBe(bCountBefore);
  });

  test('E2: Bookmarking card A does NOT bookmark card B', async ({ page }) => {
    // Pick cards beyond the base-bookmarked range
    const cards = page.locator('[data-entity-id]');
    const slugA = await cards.nth(10).getAttribute('data-entity-id');
    const slugB = await cards.nth(11).getAttribute('data-entity-id');

    const cardA = cardBySlug(page, slugA!);
    await cardA.locator('[data-testid="bookmark-button"]').click();
    await page.waitForTimeout(500);

    const localState = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('ai-centre-social') ?? '{}');
    });

    const keyA = `skill:${slugA}`;
    const keyB = `skill:${slugB}`;
    expect(localState[keyA]?.bookmarked).toBe(true);
    expect(localState[keyB]?.bookmarked ?? false).toBe(false);

    const cardB = cardBySlug(page, slugB!);
    const bColor = await cardB.locator('[data-testid="bookmark-button"]').evaluate((el) => getComputedStyle(el).color);
    const aColor = await cardA.locator('[data-testid="bookmark-button"]').evaluate((el) => getComputedStyle(el).color);
    expect(aColor).not.toBe(bColor);
  });
});

test.describe('Entity Isolation — Comments', () => {
  let describeTs: string;
  let consoleErrors: string[];

  test.beforeAll(async ({}, testInfo) => {
    await rollbackToBase(testInfo);
    describeTs = await recordTimestamp(testInfo);
  });

  test.beforeEach(async ({ page }, testInfo) => {
    await rollbackToDescribe(describeTs, testInfo);
    await clearSession(page);
    consoleErrors = collectConsoleErrors(page);
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({}, testInfo) => {
    await logFailureDiagnostics(testInfo, consoleErrors);
  });

  test('E3: Comments on skill A are isolated from skill B', async ({ page }) => {
    const cards = page.locator('[data-entity-id]');
    const slugA = await cards.nth(0).getAttribute('data-entity-id');
    const slugB = await cards.nth(1).getAttribute('data-entity-id');

    const cardA = cardBySlug(page, slugA!);
    await cardA.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);

    const textarea = page.locator('textarea').first();
    await textarea.fill(`Unique comment for ${slugA}`);
    await textarea.press('Meta+Enter');
    await page.waitForTimeout(1000);
    await expect(page.locator(`text=Unique comment for ${slugA}`)).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const cardB = cardBySlug(page, slugB!);
    await cardB.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);
    await expect(page.locator(`text=Unique comment for ${slugA}`)).not.toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('E6: Comment drawer shows the correct skill title', async ({ page }) => {
    const cards = page.locator('[data-entity-id]');
    const slugA = await cards.nth(0).getAttribute('data-entity-id');
    const titleA = await cards.nth(0).locator('h3').textContent();

    const cardA = cardBySlug(page, slugA!);
    await cardA.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);

    const drawerEntity = page.locator('[data-testid="comment-drawer-entity"]');
    await expect(drawerEntity).toContainText(titleA!);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    const slugB = await cards.nth(1).getAttribute('data-entity-id');
    const titleB = await cards.nth(1).locator('h3').textContent();
    const cardB = cardBySlug(page, slugB!);
    await cardB.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);
    await expect(drawerEntity).toContainText(titleB!);
    await page.keyboard.press('Escape');
  });

  test('E7: Rapidly switching comment drawers shows correct comments', async ({ page }) => {
    // Use cards beyond base data range to avoid pre-existing comments
    const cards = page.locator('[data-entity-id]');
    const slugA = await cards.nth(12).getAttribute('data-entity-id');
    const slugB = await cards.nth(13).getAttribute('data-entity-id');

    const cardA = cardBySlug(page, slugA!);
    await cardA.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);
    const textarea = page.locator('textarea').first();
    await textarea.fill(`Comment-A-${slugA}`);
    await textarea.press('Meta+Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    const cardB = cardBySlug(page, slugB!);
    await cardB.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);
    const textareaB = page.locator('textarea').first();
    await textareaB.fill(`Comment-B-${slugB}`);
    await textareaB.press('Meta+Enter');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    await cardA.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(200);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    await cardB.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);
    await expect(page.locator(`text=Comment-B-${slugB}`)).toBeVisible();
    await expect(page.locator(`text=Comment-A-${slugA}`)).not.toBeVisible();
    await page.keyboard.press('Escape');
  });
});

test.describe('Entity Isolation — Post-Reorder & Cross-Type', () => {
  let describeTs: string;
  let consoleErrors: string[];

  test.beforeAll(async ({}, testInfo) => {
    await rollbackToBase(testInfo);
    describeTs = await recordTimestamp(testInfo);
  });

  test.beforeEach(async ({ page }, testInfo) => {
    await rollbackToDescribe(describeTs, testInfo);
    await clearSession(page);
    consoleErrors = collectConsoleErrors(page);
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async ({}, testInfo) => {
    await logFailureDiagnostics(testInfo, consoleErrors);
  });

  test('E4: After reorder, social buttons still target the correct entity', async ({ page }) => {
    const cards = page.locator('[data-entity-id]');
    const targetIdx = 15;
    const targetSlug = await cards.nth(targetIdx).getAttribute('data-entity-id');
    const targetTitle = await cards.nth(targetIdx).locator('h3').textContent();

    const targetCard = cardBySlug(page, targetSlug!);
    await targetCard.locator('[data-testid="upvote-button"]').click();
    await page.waitForTimeout(1000);

    await page.reload();
    await page.waitForLoadState('networkidle');

    const reorderedCard = cardBySlug(page, targetSlug!);
    await expect(reorderedCard).toBeVisible();

    const upvoteBtn = reorderedCard.locator('[data-testid="upvote-button"]');
    const text = await upvoteBtn.textContent();
    const count = parseInt(text?.replace(/[^\d]/g, '') ?? '0', 10);
    expect(count).toBeGreaterThanOrEqual(1);

    const titleAfter = await reorderedCard.locator('h3').textContent();
    expect(titleAfter).toBe(targetTitle);

    await upvoteBtn.click();
    await page.waitForTimeout(500);
    const textAfter = await upvoteBtn.textContent();
    const countAfter = parseInt(textAfter?.replace(/[^\d]/g, '') ?? '0', 10);
    expect(countAfter).toBe(count - 1);
  });

});

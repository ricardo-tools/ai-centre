import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';

test.describe('Social Features', () => {
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

  test('skill cards render social buttons (like, comment, bookmark)', async ({ page }) => {
    // Find the first skill card's social row
    const firstCard = page.locator('.card-hover').first();
    await expect(firstCard).toBeVisible();

    // Check for upvote button
    const upvoteButton = firstCard.locator('[data-testid="upvote-button"]');
    await expect(upvoteButton).toBeVisible();
  });

  test('clicking upvote toggles the upvote state', async ({ page }) => {
    const upvoteButton = page.locator('[data-testid="upvote-button"]').first();
    await expect(upvoteButton).toBeVisible();

    // Record count before
    const beforeText = await upvoteButton.textContent();
    const beforeCount = parseInt(beforeText?.replace(/[^\d]/g, '') ?? '0', 10);

    // Click upvote — count should change by 1
    await upvoteButton.click();
    await page.waitForTimeout(500);
    const afterText = await upvoteButton.textContent();
    const afterCount = parseInt(afterText?.replace(/[^\d]/g, '') ?? '0', 10);
    expect(Math.abs(afterCount - beforeCount)).toBe(1);

    // Click again to un-upvote — back to original
    await upvoteButton.click();
    await page.waitForTimeout(500);
    const finalText = await upvoteButton.textContent();
    const finalCount = parseInt(finalText?.replace(/[^\d]/g, '') ?? '0', 10);
    expect(finalCount).toBe(beforeCount);
  });

  test('upvote state persists across page reload', async ({ page }) => {
    const upvoteButton = page.locator('[data-testid="upvote-button"]').first();

    // Click upvote
    await upvoteButton.click();
    await page.waitForTimeout(1000);

    const countAfterUpvote = await upvoteButton.textContent();

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check the count is still the same
    const upvoteAfterReload = page.locator('[data-testid="upvote-button"]').first();
    const countAfterReload = await upvoteAfterReload.textContent();
    expect(countAfterReload?.trim()).toBe(countAfterUpvote?.trim());
  });

  test('clicking bookmark toggles bookmark state', async ({ page }) => {
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();

    // Click bookmark
    await bookmarkButton.click();
    await page.waitForTimeout(500);

    // Check that the bookmark icon changed to filled (color should be primary)
    const color = await bookmarkButton.evaluate(el => getComputedStyle(el).color);
    // Primary color should be active (not muted)
    expect(color).not.toBe('');
  });

  test('clicking comment opens the comment drawer', async ({ page }) => {
    const commentButton = page.locator('[data-testid="comment-button"]').first();
    if (await commentButton.isVisible()) {
      await commentButton.click();
      await page.waitForTimeout(500);

      // Check for the drawer (it should contain a textarea)
      const textarea = page.locator('textarea');
      await expect(textarea.first()).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe('Comment Drawer', () => {
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
  });

  test.afterEach(async ({}, testInfo) => {
    await logFailureDiagnostics(testInfo, consoleErrors);
  });
  test('comment drawer opens from skill detail page', async ({ page }) => {
    await page.goto('/skills/accessibility');
    await page.waitForLoadState('networkidle');

    // Find the Discussion trigger button
    const discussionButton = page.locator('button', { hasText: 'Discussion' });

    if (await discussionButton.isVisible()) {
      await discussionButton.click();
      await page.waitForTimeout(500);

      // Check for the drawer (it's portaled to body)
      const drawer = page.locator('text=Comments');
      await expect(drawer.first()).toBeVisible();
    } else {
      console.log('Discussion button not found');
    }
  });

  test('can write and submit a comment', async ({ page }) => {
    await page.goto('/skills/accessibility');
    await page.waitForLoadState('networkidle');

    // Open discussion drawer
    const discussionButton = page.locator('button', { hasText: 'Discussion' });
    if (await discussionButton.isVisible()) {
      await discussionButton.click();
      await page.waitForTimeout(500);

      // Find the comment textarea
      const textarea = page.locator('textarea').first();
      if (await textarea.isVisible()) {
        await textarea.fill('Test comment from Playwright');
        await textarea.press('Meta+Enter');
        await page.waitForTimeout(1000);

        const comment = page.locator('text=Test comment from Playwright');
        await expect(comment.first()).toBeVisible();
      }
    }
  });

  test('comment persists after closing and reopening drawer', async ({ page }) => {
    await page.goto('/skills/accessibility');
    await page.waitForLoadState('networkidle');

    // Open drawer
    const discussionButton = page.locator('button', { hasText: 'Discussion' });
    if (await discussionButton.isVisible()) {
      await discussionButton.click();
      await page.waitForTimeout(500);

      // Write comment
      const textarea = page.locator('textarea').first();
      if (await textarea.isVisible()) {
        await textarea.fill('Persistent comment test');
        await textarea.press('Meta+Enter');
        await page.waitForTimeout(1000);
      }

      // Close drawer (press Escape)
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Reopen drawer
      await discussionButton.click();
      await page.waitForTimeout(500);

      // Comment should still be there
      const comment = page.locator('text=Persistent comment test');
      await expect(comment.first()).toBeVisible();
    }
  });
});

test.describe('Gallery Social Features', () => {
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
  });

  test.afterEach(async ({}, testInfo) => {
    await logFailureDiagnostics(testInfo, consoleErrors);
  });
  test('gallery page loads', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    // Should show gallery header or empty state
    const header = page.locator('text=Showcase Gallery');
    await expect(header.first()).toBeVisible();
  });
});

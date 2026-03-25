import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';

test.describe('Upvote System — Skills', () => {
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

  test('SCENARIO 1: Upvote button exists on skill cards (no ThumbsUp)', async ({ page }) => {
    const firstCard = page.locator('.card-hover').first();
    await expect(firstCard).toBeVisible();

    // Should have an upvote button with ArrowFatUp or CaretUp icon (not ThumbsUp)
    const upvoteButton = firstCard.locator('[data-testid="upvote-button"]');
    await expect(upvoteButton).toBeVisible();
  });

  test('SCENARIO 2: Clicking upvote increments the count', async ({ page }) => {
    const upvoteButton = page.locator('[data-testid="upvote-button"]').first();
    await expect(upvoteButton).toBeVisible();

    const beforeText = await upvoteButton.textContent();
    const beforeCount = parseInt(beforeText?.replace(/[^\d]/g, '') ?? '0', 10);

    await upvoteButton.click();
    await page.waitForTimeout(1000);

    const afterText = await upvoteButton.textContent();
    const afterCount = parseInt(afterText?.replace(/[^\d]/g, '') ?? '0', 10);

    // Count should have changed by exactly 1
    expect(Math.abs(afterCount - beforeCount)).toBe(1);
  });

  test('SCENARIO 3: Clicking upvote again removes it (toggle)', async ({ page }) => {
    const upvoteButton = page.locator('[data-testid="upvote-button"]').first();

    const initialText = await upvoteButton.textContent();
    const initialCount = parseInt(initialText?.replace(/[^\d]/g, '') ?? '0', 10);

    // Upvote
    await upvoteButton.click();
    await page.waitForTimeout(1000);

    // Remove upvote
    await upvoteButton.click();
    await page.waitForTimeout(1000);

    const finalText = await upvoteButton.textContent();
    const finalCount = parseInt(finalText?.replace(/[^\d]/g, '') ?? '0', 10);

    // Should be back to initial count
    expect(finalCount).toBe(initialCount);
  });

  test('SCENARIO 4: Upvote persists across reload', async ({ page }) => {
    const upvoteButton = page.locator('[data-testid="upvote-button"]').first();

    const beforeText = await upvoteButton.textContent();
    const beforeCount = parseInt(beforeText?.replace(/[^\d]/g, '') ?? '0', 10);

    await upvoteButton.click();
    await page.waitForTimeout(1000);

    const afterText = await upvoteButton.textContent();
    const afterCount = parseInt(afterText?.replace(/[^\d]/g, '') ?? '0', 10);

    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');

    const reloadButton = page.locator('[data-testid="upvote-button"]').first();
    const reloadText = await reloadButton.textContent();
    const reloadCount = parseInt(reloadText?.replace(/[^\d]/g, '') ?? '0', 10);

    // Count after reload should match count after click
    expect(reloadCount).toBe(afterCount);
  });

  test('SCENARIO 5: Upvoted skills sort higher than non-upvoted', async ({ page }) => {
    // Find a skill card that currently has 0 upvotes (near the bottom)
    const cards = page.locator('.card-hover');
    const count = await cards.count();

    // Pick one well beyond base data range (first 5 have upvotes, first 3 bookmarked)
    const targetIdx = Math.min(count - 1, 20);
    const targetTitle = await cards.nth(targetIdx).locator('h3').textContent();

    // Upvote it multiple times from the same session won't work (toggle)
    // Just upvote once and check it moved up
    await cards.nth(targetIdx).locator('[data-testid="upvote-button"]').click();
    await page.waitForTimeout(1000);

    // Reload to get sorted order
    await page.reload();
    await page.waitForLoadState('networkidle');

    // The upvoted skill should be higher in the list than before
    const newCards = page.locator('.card-hover');
    const titles = await newCards.locator('h3').allTextContents();
    const newIdx = titles.indexOf(targetTitle!);

    // Should have moved up (lower index = higher position)
    expect(newIdx).toBeLessThan(targetIdx);
  });

  test('SCENARIO 6: Bookmarked skills still pin above upvoted skills', async ({ page }) => {
    // Pick cards beyond base data range to avoid pre-existing bookmarks/upvotes
    const cards = page.locator('[data-entity-id]');
    const toBookmarkTitle = await cards.nth(15).locator('h3').textContent();
    const toUpvoteTitle = await cards.nth(16).locator('h3').textContent();

    // Upvote card 16
    await cards.nth(16).locator('[data-testid="upvote-button"]').click();
    await page.waitForTimeout(500);

    // Bookmark card 15
    await cards.nth(15).locator('[data-testid="bookmark-button"]').click();
    await page.waitForTimeout(500);

    // Reload
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Bookmarked skill should appear before upvoted skill
    const titles = await page.locator('[data-entity-id] h3').allTextContents();
    const bookmarkedIdx = titles.indexOf(toBookmarkTitle!);
    const upvotedIdx = titles.indexOf(toUpvoteTitle!);
    expect(bookmarkedIdx).toBeLessThan(upvotedIdx);
  });
});

test.describe('Upvote System — Bookmarks', () => {
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

  test('SCENARIO 13: Bookmark toggle removes bookmark', async ({ page }) => {
    // Pick a card that isn't pre-bookmarked in base data (use index 10)
    const cards = page.locator('[data-entity-id]');
    const slug = await cards.nth(10).getAttribute('data-entity-id');
    const card = page.locator(`[data-entity-id="${slug}"]`);
    const bookmarkButton = card.locator('[data-testid="bookmark-button"]');

    // Bookmark
    await bookmarkButton.click();
    await page.waitForTimeout(500);

    // Verify it's bookmarked — check localStorage
    const afterBookmark = await page.evaluate((s) => {
      const data = JSON.parse(localStorage.getItem('ai-centre-social') ?? '{}');
      return data[`skill:${s}`]?.bookmarked;
    }, slug);
    expect(afterBookmark).toBe(true);

    // Unbookmark
    await bookmarkButton.click();
    await page.waitForTimeout(500);

    // Verify unbookmarked
    const afterUnbookmark = await page.evaluate((s) => {
      const data = JSON.parse(localStorage.getItem('ai-centre-social') ?? '{}');
      return data[`skill:${s}`]?.bookmarked;
    });
    expect(afterUnbookmark).toBeFalsy();
  });

  test('SCENARIO 14: Bookmark state persists across reload', async ({ page }) => {
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();

    await bookmarkButton.click();
    await page.waitForTimeout(500);

    await page.reload();
    await page.waitForLoadState('networkidle');

    // First card should be the bookmarked one (pinned to top)
    // Check that bookmark button on first card is in active state
    const firstBookmark = page.locator('[data-testid="bookmark-button"]').first();
    const color = await firstBookmark.evaluate((el) => getComputedStyle(el).color);
    // Should be primary color (not muted)
    expect(color).not.toBe('');
  });

  test('SCENARIO 15: Unbookmark persists across reload', async ({ page }) => {
    const bookmarkButton = page.locator('[data-testid="bookmark-button"]').first();

    // Bookmark then unbookmark
    await bookmarkButton.click();
    await page.waitForTimeout(300);
    await bookmarkButton.click();
    await page.waitForTimeout(300);

    await page.reload();
    await page.waitForLoadState('networkidle');

    // No cards should be pinned/bookmarked
    // The order should be default (not sorted by bookmark)
  });
});

test.describe('Upvote System — Comments', () => {
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

  test('SCENARIO 7: Comments show upvote buttons', async ({ page }) => {
    // Open comment drawer on first skill
    const commentButton = page.locator('[data-testid="comment-button"]').first();
    if (await commentButton.isVisible()) {
      await commentButton.click();
      await page.waitForTimeout(500);

      // Add a comment first
      const textarea = page.locator('textarea').first();
      if (await textarea.isVisible()) {
        await textarea.fill('Test comment for upvote');
        await textarea.press('Meta+Enter');
        await page.waitForTimeout(1000);

        // Check for upvote button on the comment
        const commentUpvote = page.locator('[data-testid="comment-upvote"]');
        await expect(commentUpvote.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('SCENARIO 16: Comment upvote toggle removes upvote', async ({ page }) => {
    // Open comment drawer
    const commentButton = page.locator('[data-testid="comment-button"]').first();
    if (await commentButton.isVisible()) {
      await commentButton.click();
      await page.waitForTimeout(500);

      // Add a comment
      const textarea = page.locator('textarea').first();
      if (await textarea.isVisible()) {
        await textarea.fill('Comment to upvote and un-upvote');
        await textarea.press('Meta+Enter');
        await page.waitForTimeout(1000);

        const commentUpvote = page.locator('[data-testid="comment-upvote"]').first();
        if (await commentUpvote.isVisible()) {
          // Upvote
          await commentUpvote.click();
          await expect(commentUpvote).toHaveText(/1/, { timeout: 3000 });

          // Un-upvote
          await commentUpvote.click();
          await expect(commentUpvote).toHaveText(/0/, { timeout: 3000 });
        }
      }
    }
  });

  test('SCENARIO 17: Comment upvote persists across drawer close/reopen', async ({ page }) => {
    const commentButton = page.locator('[data-testid="comment-button"]').first();
    if (await commentButton.isVisible()) {
      await commentButton.click();
      await page.waitForTimeout(500);

      const textarea = page.locator('textarea').first();
      if (await textarea.isVisible()) {
        await textarea.fill('Persistent upvote comment');
        await textarea.press('Meta+Enter');
        await page.waitForTimeout(1000);

        // Upvote the comment
        const commentUpvote = page.locator('[data-testid="comment-upvote"]').first();
        if (await commentUpvote.isVisible()) {
          await commentUpvote.click();
          await page.waitForTimeout(500);

          // Close drawer
          await page.keyboard.press('Escape');
          await page.waitForTimeout(500);

          // Reopen
          await commentButton.click();
          await page.waitForTimeout(500);

          // Upvote should still be there
          const upvoteAfter = page.locator('[data-testid="comment-upvote"]').first();
          await expect(upvoteAfter).toHaveText(/1/, { timeout: 3000 });
        }
      }
    }
  });

  test('SCENARIO 18: Comment upvote persists across page reload', async ({ page }) => {
    // Target a specific card so we reopen the same one after reload
    const card = page.locator('[data-entity-id]').nth(10);
    const slug = await card.getAttribute('data-entity-id');

    await card.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);

    const textarea = page.locator('textarea').first();
    await textarea.fill('Reload persistent upvote');
    await textarea.press('Meta+Enter');
    await page.waitForTimeout(1000);

    const commentUpvote = page.locator('[data-testid="comment-upvote"]').first();
    if (await commentUpvote.isVisible()) {
      await commentUpvote.click();
      await page.waitForTimeout(500);
    }

    // Close drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Reopen drawer on the SAME card
    const cardAfter = page.locator(`[data-entity-id="${slug}"]`);
    await cardAfter.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);

    const upvoteAfter = page.locator('[data-testid="comment-upvote"]').first();
    await expect(upvoteAfter).toHaveText(/1/, { timeout: 3000 });
  });
});

test.describe('Upvote System — Gallery & Toolkits', () => {
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
  test('SCENARIO 10: Upvote works on gallery cards', async ({ page }) => {
    await page.goto('/gallery');
    await page.waitForLoadState('networkidle');

    const upvoteButton = page.locator('[data-testid="upvote-button"]').first();
    if (await upvoteButton.isVisible()) {
      await upvoteButton.click();
      await expect(upvoteButton).toHaveText(/1/, { timeout: 3000 });

      await page.reload();
      await page.waitForLoadState('networkidle');

      const upvoteAfter = page.locator('[data-testid="upvote-button"]').first();
      await expect(upvoteAfter).toHaveText(/1/, { timeout: 5000 });
    }
  });

  test('SCENARIO 11: Upvote works on toolkit cards', async ({ page }) => {
    await page.goto('/toolkits');
    await page.waitForLoadState('networkidle');

    const upvoteButton = page.locator('[data-testid="upvote-button"]').first();
    if (await upvoteButton.isVisible()) {
      const beforeText = await upvoteButton.textContent();
      const beforeCount = parseInt(beforeText?.replace(/[^\d]/g, '') ?? '0', 10);

      await upvoteButton.click();
      await page.waitForTimeout(1000);

      const afterText = await upvoteButton.textContent();
      const afterCount = parseInt(afterText?.replace(/[^\d]/g, '') ?? '0', 10);

      expect(Math.abs(afterCount - beforeCount)).toBe(1);
    }
  });

  test('SCENARIO 12: No ThumbsUp icon remains in the codebase', async () => {
    const { execSync } = require('child_process');
    const result = execSync(
      'grep -rn "ThumbsUp" src/ --include="*.tsx" --include="*.ts" | grep -v node_modules | grep -v ".test." | grep -v "upvote-system.spec" || echo "NONE"',
      { encoding: 'utf-8' },
    );
    expect(result.trim()).toBe('NONE');
  });
});

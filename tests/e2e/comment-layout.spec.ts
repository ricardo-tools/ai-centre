import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';
import { BASE } from './base-data';

/**
 * Comment Layout Tests
 *
 * Verify the upvote button is in the action bar (same row as Reply/Edit/Delete),
 * positioned as the first element, with horizontal (inline) layout.
 *
 * Uses base data comments on the first skill — no creation needed.
 */

test.describe('Comment Layout', () => {
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

    // Navigate and open comment drawer on the skill with base data comments
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');
    const card = page.locator(`[data-entity-id="${BASE.comments.firstSkill.slug}"]`);
    await card.locator('[data-testid="comment-button"]').click();
    await expect(page.locator(`text=${BASE.comments.firstSkill.adminComment.body}`)).toBeVisible({ timeout: 10000 });
  });

  test.afterEach(async ({}, testInfo) => {
    await logFailureDiagnostics(testInfo, consoleErrors);
  });

  test('CL1: Upvote button is in the action bar (not the author line)', async ({ page }) => {
    const actionsContainer = page.locator('[data-testid="comment-actions"]').first();
    await expect(actionsContainer).toBeVisible();

    const upvoteInActions = actionsContainer.locator('[data-testid="comment-upvote"]');
    await expect(upvoteInActions).toBeVisible();
  });

  test('CL2: Upvote button is the first element in the action bar', async ({ page }) => {
    const actionsContainer = page.locator('[data-testid="comment-actions"]').first();
    const firstButton = actionsContainer.locator('button').first();

    const testId = await firstButton.getAttribute('data-testid');
    expect(testId).toBe('comment-upvote');
  });

  test('CL3: Upvote displays inline (icon + count horizontal, not stacked)', async ({ page }) => {
    const upvoteButton = page.locator('[data-testid="comment-upvote"]').first();

    const flexDirection = await upvoteButton.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('row');
  });
});

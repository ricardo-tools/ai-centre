import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, switchUser, createWorkerApi, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';
import { BASE } from './base-data';

/**
 * Comment Permissions Tests
 *
 * Verify edit/delete visibility per user role:
 *   - Edit: owner only (within 15-min window)
 *   - Delete: owner OR admin
 *   - Non-author: only Reply
 */

test.describe('Comment Permissions', () => {
  let describeTs: string;
  let consoleErrors: string[];

  test.beforeAll(async ({}, testInfo) => {
    await rollbackToBase(testInfo);

    // Seed describe-level data: comments from both users
    const api = createWorkerApi(testInfo);
    await api.seedData({
      comments: [
        {
          id: '00000000-0000-0000-0000-aaaaaaaaaaaa',
          entity_type: 'skill',
          entity_id: 'accessibility',
          author_id: BASE.users.admin.id,
          body: 'Admin authored comment for perms',
        },
        {
          id: '00000000-0000-0000-0000-bbbbbbbbbbbb',
          entity_type: 'skill',
          entity_id: 'accessibility',
          author_id: BASE.users.member.id,
          body: 'Member authored comment for perms',
        },
      ],
    });

    // Wait to ensure seed created_at < timestamp
    await new Promise((r) => setTimeout(r, 100));
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

  test('CP1: Author sees Edit and Delete on own comment', async ({ page }) => {
    // Default session is admin (SKIP_AUTH=true, no identity cookie = admin)
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const card = page.locator('[data-entity-id="accessibility"]');
    await card.locator('[data-testid="comment-button"]').click();
    await expect(page.locator('text=Admin authored comment for perms')).toBeVisible({ timeout: 10000 });

    const adminComment = page.locator('text=Admin authored comment for perms').locator('..');
    const actionsRow = adminComment.locator('[data-testid="comment-actions"]');
    await expect(actionsRow.locator('text=Edit')).toBeVisible({ timeout: 3000 });
    await expect(actionsRow.locator('text=Delete')).toBeVisible({ timeout: 3000 });
    await page.keyboard.press('Escape');
  });

  test('CP2: Non-author does NOT see Edit or Delete', async ({ page }) => {
    // Navigate first, then switch user, then reload
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');
    await switchUser(page, BASE.users.member);
    await page.reload();
    await page.waitForLoadState('networkidle');

    const card = page.locator('[data-entity-id="accessibility"]');
    await card.locator('[data-testid="comment-button"]').click();
    await expect(page.locator('text=Admin authored comment for perms')).toBeVisible({ timeout: 10000 });

    const adminComment = page.locator('text=Admin authored comment for perms').locator('..');
    const actionsRow = adminComment.locator('[data-testid="comment-actions"]');
    await expect(actionsRow.locator('text=Edit')).not.toBeVisible();
    await expect(actionsRow.locator('text=Delete')).not.toBeVisible();
    await expect(actionsRow.locator('text=Reply')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('CP3: Admin sees Delete on non-owned comments', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const card = page.locator('[data-entity-id="accessibility"]');
    await card.locator('[data-testid="comment-button"]').click();
    await expect(page.locator('text=Member authored comment for perms')).toBeVisible({ timeout: 10000 });

    const memberComment = page.locator('text=Member authored comment for perms').locator('..');
    const actionsRow = memberComment.locator('[data-testid="comment-actions"]');
    await expect(actionsRow.locator('text=Delete')).toBeVisible({ timeout: 3000 });
    await page.keyboard.press('Escape');
  });

  test('CP4: Admin does NOT see Edit on non-owned comments', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const card = page.locator('[data-entity-id="accessibility"]');
    await card.locator('[data-testid="comment-button"]').click();
    await expect(page.locator('text=Member authored comment for perms')).toBeVisible({ timeout: 10000 });

    const memberComment = page.locator('text=Member authored comment for perms').locator('..');
    const actionsRow = memberComment.locator('[data-testid="comment-actions"]');
    await expect(actionsRow.locator('text=Edit')).not.toBeVisible();
    await page.keyboard.press('Escape');
  });
});

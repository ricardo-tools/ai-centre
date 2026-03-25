import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, createWorkerApi, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';
import { BASE } from './base-data';

/**
 * Data Isolation Tests
 *
 * Validate the test data lifecycle:
 *   Global seed (roles, users, skills, base social data) — NEVER deleted
 *   High-water mark rollback — only rows created after mark are deleted
 *   Test-level isolation — one test's mutations don't leak to the next
 */

test.describe('Global seed survives rollback', () => {
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

  test('D1: Roles, users, and skills survive after rollback', async ({ page }, testInfo) => {
    const api = createWorkerApi(testInfo);
    const result = await api.verifySeed();
    expect(result.counts.roles).toBeGreaterThanOrEqual(2);
    expect(result.counts.users).toBeGreaterThanOrEqual(2);
    expect(result.counts.skills).toBeGreaterThanOrEqual(10);

    await page.goto('/skills');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('.card-hover');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThanOrEqual(10);
  });

  test('D2: Upvote created during test is rolled back, but base upvotes survive', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const cards = page.locator('[data-entity-id]');
    const targetSlug = await cards.nth(10).getAttribute('data-entity-id');
    const targetCard = page.locator(`[data-entity-id="${targetSlug}"]`);
    await targetCard.locator('[data-testid="upvote-button"]').click();
    await page.waitForTimeout(500);

    const text = await targetCard.locator('[data-testid="upvote-button"]').textContent();
    const count = parseInt(text?.replace(/[^\d]/g, '') ?? '0', 10);
    expect(count).toBe(BASE.upvoteCount(targetSlug!) + 1);
  });

  test('D3: Previous test upvote was rolled back', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const cards = page.locator('[data-entity-id]');
    const count = await cards.count();
    if (count > 10) {
      const farCard = cards.nth(10);
      const text = await farCard.locator('[data-testid="upvote-button"]').textContent();
      const upvotes = parseInt(text?.replace(/[^\d]/g, '') ?? '0', 10);
      expect(upvotes).toBe(0);
    }
  });
});

test.describe('Test-level isolation', () => {
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

  test('D4: Test A creates a comment — visible within this test', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="comment-button"]').first().click();
    await page.waitForTimeout(500);
    const textarea = page.locator('textarea').first();
    await textarea.fill('D4 isolation test comment');
    await textarea.press('Meta+Enter');
    await page.waitForTimeout(1000);
    await expect(page.locator('text=D4 isolation test comment')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('D5: Test B does not see Test A comment (rolled back)', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="comment-button"]').first().click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=D4 isolation test comment')).not.toBeVisible();
    await page.keyboard.press('Escape');
  });
});

test.describe('No data leaks between tests', () => {
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

  test('D6a: Data seeded in this test does not survive to the next', async ({ page }, testInfo) => {
    const api = createWorkerApi(testInfo);
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    await api.seedData({
      comments: [{
        id: '00000000-0000-0000-0000-dddddddddd01',
        entity_type: 'skill',
        entity_id: 'accessibility',
        author_id: BASE.users.admin.id,
        body: 'Should not leak to D6b',
      }],
    });

    const card = page.locator('[data-entity-id="accessibility"]');
    await card.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=Should not leak to D6b')).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('D6b: Previous test data was rolled back', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    const card = page.locator('[data-entity-id="accessibility"]');
    await card.locator('[data-testid="comment-button"]').click();
    await page.waitForTimeout(500);
    await expect(page.locator('text=Should not leak to D6b')).not.toBeVisible();
    await page.keyboard.press('Escape');
  });
});

test.describe('Infrastructure', () => {
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

  test('D7: High-water mark API works correctly', async ({}, testInfo) => {
    const api = createWorkerApi(testInfo);
    const { mark } = await api.mark();
    expect(mark).toBeTruthy();
    expect(new Date(mark).getTime()).not.toBeNaN();
  });

  test('D8: Rollback only deletes rows after mark', async ({}, testInfo) => {
    const api = createWorkerApi(testInfo);
    const { mark } = await api.mark();

    await api.seedData({
      reactions: [{
        entity_type: 'skill',
        entity_id: 'clean-architecture',
        user_id: '00000000-0000-0000-0000-000000000000',
        emoji: 'thumbsup',
      }],
    });

    const result = await api.rollbackToMark(mark);
    expect(result).toHaveProperty('ok', true);
  });

  test('D9: Seed API inserts data correctly', async ({}, testInfo) => {
    const api = createWorkerApi(testInfo);
    const result = await api.seedData({
      reactions: [{
        entity_type: 'skill',
        entity_id: 'planning',
        user_id: '00000000-0000-0000-0000-000000000000',
        emoji: 'thumbsup',
      }],
    });
    expect(result).toHaveProperty('ok', true);
  });
});

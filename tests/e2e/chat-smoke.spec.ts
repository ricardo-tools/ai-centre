import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';

/**
 * Chat Smoke Tests
 *
 * CH-S1: Chat page loads
 * CH-S2: Chat drawer opens from floating button
 */

test.describe('Chat Smoke', () => {
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

  test('CH-S1: Chat page loads with empty conversation list', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Should show "No conversations yet"
    await expect(page.locator('text=No conversations yet')).toBeVisible({ timeout: 5000 });
    // Should have a "New conversation" button
    await expect(page.locator('text=New conversation')).toBeVisible();
    // Should have a chat input
    await expect(page.locator('[data-testid="chat-input"]')).toBeVisible();
  });

  test('CH-S2: Chat drawer opens from floating button', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    // Floating chat button should be visible
    const trigger = page.locator('[data-testid="chat-trigger"]');
    await expect(trigger).toBeVisible();

    // Click it
    await trigger.click();

    // Drawer should appear
    const drawer = page.locator('[data-testid="chat-drawer"]');
    await expect(drawer).toBeVisible({ timeout: 3000 });

    // Should have chat input inside the drawer
    await expect(drawer.locator('[data-testid="chat-input"]')).toBeVisible();

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();
  });
});

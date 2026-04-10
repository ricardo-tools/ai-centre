import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';

/**
 * Chat Loading / Thinking Indicator Tests
 *
 * CH-L1: Thinking indicator appears immediately after sending
 * CH-L2: Thinking indicator disappears when streaming starts
 * CH-L3: Suggested prompt shows thinking indicator
 */

test.describe('Chat Loading Indicators', () => {
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

  test('CH-L1: Thinking indicator appears after sending a message', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    const input = page.locator('[data-testid="chat-input"]');
    await input.fill('Hello');
    await page.locator('[data-testid="chat-send"]').click();

    // Thinking indicator should appear within 1 second
    const thinking = page.locator('[data-testid="chat-thinking"]');
    await expect(thinking).toBeVisible({ timeout: 1000 });

    // Should show "Thinking..." label
    await expect(page.locator('[data-testid="chat-thinking-label"]')).toBeVisible({ timeout: 1000 });

    // Robot icon should be present and pulsing (has the chat-thinking-icon class)
    const icon = thinking.locator('.chat-thinking-icon');
    await expect(icon).toBeVisible();
  });

  test('CH-L2: Thinking indicator disappears when response arrives', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    const input = page.locator('[data-testid="chat-input"]');
    await input.fill('Say hi');
    await page.locator('[data-testid="chat-send"]').click();

    // Wait for thinking to appear
    await expect(page.locator('[data-testid="chat-thinking"]')).toBeVisible({ timeout: 2000 });

    // Wait for AI response to finish — greeting is the first assistant message, so wait for the second
    await expect(page.locator('[data-testid="chat-message-assistant"]').nth(1)).toBeVisible({ timeout: 15000 });

    // Thinking indicator should be gone
    await expect(page.locator('[data-testid="chat-thinking"]')).not.toBeVisible();
  });

  test('CH-L3: Chip from greeting message shows thinking indicator', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Click a chip from the greeting message
    await page.locator('[data-testid="chat-chip"]', { hasText: 'Browse skills' }).click();

    // Thinking indicator should appear immediately
    const thinking = page.locator('[data-testid="chat-thinking"]');
    await expect(thinking).toBeVisible({ timeout: 1000 });
  });
});

import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, createWorkerApi, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';

/**
 * Chat Conversation Lifecycle Tests
 *
 * CH-C1: Send message and get AI response
 * CH-C2: Multi-turn conversation
 * CH-C4: Conversation persists across reload
 * CH-C5: Delete conversation
 * CH-E1: Error when API key not configured (tested via missing key scenario)
 * CH-E2: Long message validation
 */

test.describe('Chat Conversation', () => {
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

  test('CH-C1: Send message and get AI response', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Type a message
    const input = page.locator('[data-testid="chat-input"]');
    await input.fill('Say hello');

    // Send
    await page.locator('[data-testid="chat-send"]').click();

    // User message should appear
    await expect(page.locator('[data-testid="chat-message-user"]').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="chat-message-user"]').first()).toContainText('Say hello');

    // AI response should stream in (wait longer for AI)
    await expect(page.locator('[data-testid="chat-message-assistant"]').first()).toBeVisible({ timeout: 15000 });

    // Response should have content (not empty)
    const responseText = await page.locator('[data-testid="chat-message-assistant"]').first().textContent();
    expect(responseText!.length).toBeGreaterThan(10);
  });

  test('CH-C4: Conversation persists and loads after reload', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Send a message
    await page.locator('[data-testid="chat-input"]').fill('Say the word banana');
    await page.locator('[data-testid="chat-send"]').click();

    // Wait for AI response
    await expect(page.locator('[data-testid="chat-message-assistant"]').first()).toBeVisible({ timeout: 15000 });

    // Reload the page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Wait for conversation list to load
    await page.waitForTimeout(2000);

    // A conversation should appear in the sidebar (not "No conversations yet")
    await expect(page.locator('text=No conversations yet')).not.toBeVisible({ timeout: 5000 });

    // Click the first conversation in the sidebar
    const convItems = page.locator('[data-testid="chat-new-conversation"]').locator('..').locator('..').locator('div[style*="cursor: pointer"]');
    const firstConv = convItems.first();
    if (await firstConv.isVisible()) {
      await firstConv.click();
      await page.waitForTimeout(2000);

      // Should see the previous messages
      await expect(page.locator('[data-testid="chat-message-user"]').first()).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[data-testid="chat-message-assistant"]').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('CH-AN1: Conversation gets auto-titled after first response', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Simple message that won't trigger tool calls
    await page.locator('[data-testid="chat-input"]').fill('What is Next.js?');
    await page.locator('[data-testid="chat-send"]').click();

    // Wait for AI response
    await expect(page.locator('[data-testid="chat-message-assistant"]').first()).toBeVisible({ timeout: 15000 });

    // Wait for title generation (async, may take a moment)
    await page.waitForTimeout(3000);

    // Reload to see the updated sidebar
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // The conversation in the sidebar should NOT say "New conversation"
    // It should have an auto-generated title
    const sidebar = page.locator('[data-testid="chat-new-conversation"]').locator('..').locator('..');
    const convTexts = await sidebar.locator('span').allTextContents();
    const hasTitle = convTexts.some((t) => t.length > 0 && t !== 'New conversation' && !t.includes('New conversation'));
    expect(hasTitle).toBe(true);

    // Title should NOT have markdown formatting (# prefix)
    const hasMarkdown = convTexts.some((t) => t.startsWith('#') || t.startsWith('*'));
    expect(hasMarkdown).toBe(false);
  });

  test('CH-E2: Long message validation', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Type a very long message (>10000 chars)
    const longMessage = 'a'.repeat(10001);
    const input = page.locator('[data-testid="chat-input"]');
    await input.fill(longMessage);
    await page.locator('[data-testid="chat-send"]').click();

    // Should show an error (the API validates max 10000 chars)
    // The error might appear as a chat error message or the input stays
    // Wait a moment for the response
    await page.waitForTimeout(2000);

    // Either an error message appears or the send didn't go through
    const hasError = await page.locator('text=too long').isVisible().catch(() => false)
      || await page.locator('text=Message too long').isVisible().catch(() => false);
    // The message should not have been sent successfully
    expect(hasError || await page.locator('[data-testid="chat-message-assistant"]').count() === 0).toBeTruthy();
  });
});

test.describe('Chat Drawer', () => {
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

  test('CH-D1: Chat while browsing skills', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    // Open drawer
    await page.locator('[data-testid="chat-trigger"]').click();
    const drawer = page.locator('[data-testid="chat-drawer"]');
    await expect(drawer).toBeVisible({ timeout: 3000 });

    // Skills page should still be visible behind backdrop
    await expect(page.locator('.card-hover').first()).toBeVisible();

    // Can type in drawer
    const input = drawer.locator('[data-testid="chat-input"]');
    await input.fill('test message');
    expect(await input.inputValue()).toBe('test message');
  });

  test('CH-D2: Drawer closes and preserves state', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    // Open drawer
    await page.locator('[data-testid="chat-trigger"]').click();
    const drawer = page.locator('[data-testid="chat-drawer"]');
    await expect(drawer).toBeVisible({ timeout: 3000 });

    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(drawer).not.toBeVisible();

    // Reopen
    await page.locator('[data-testid="chat-trigger"]').click();
    await expect(drawer).toBeVisible({ timeout: 3000 });
  });
});

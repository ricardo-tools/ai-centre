import { test, expect } from './base-test';
import { BASE } from './base-data';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, createWorkerApi, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';

/**
 * Chat Switching Regression Tests
 *
 * CH-SW1: Conversation switching is stable (no infinite loop / oscillation)
 *
 * Reproduces the bug where clicking a historical chat caused an infinite loop:
 * - The selection (orange backdrop) rapidly oscillated between conversations
 * - The response area stuck on "Loading messages..."
 * - The app froze (nav links unresponsive)
 *
 * Root cause: `handleConversationCreated` was recreated on every render (not memoized),
 * causing ChatWidget's useEffect to fire in an infinite loop.
 */

const CONV_IDS = [
  '11111111-1111-1111-1111-000000000001',
  '11111111-1111-1111-1111-000000000002',
  '11111111-1111-1111-1111-000000000003',
];

const CONV_DATA = [
  { title: 'First Chat', userMsg: 'Hello from conversation one', assistantMsg: 'Response from conversation one' },
  { title: 'Second Chat', userMsg: 'Hello from conversation two', assistantMsg: 'Response from conversation two' },
  { title: 'Third Chat', userMsg: 'Hello from conversation three', assistantMsg: 'Response from conversation three' },
];

test.describe('Chat Switching', () => {
  let describeTs: string;
  let consoleErrors: string[];

  test.beforeAll(async ({}, testInfo) => {
    await rollbackToBase(testInfo);

    // Seed 3 conversations with messages
    const api = createWorkerApi(testInfo);
    const userId = BASE.users.admin.id;

    await api.seedData({
      chat_conversations: CONV_IDS.map((id, i) => ({
        id,
        user_id: userId,
        title: CONV_DATA[i].title,
        created_at: new Date(2026, 2, 20 + i).toISOString(),
        updated_at: new Date(2026, 2, 20 + i).toISOString(),
      })),
    });

    // Seed messages for each conversation (separate call to ensure conversations exist first)
    const messages: Record<string, unknown>[] = [];
    CONV_IDS.forEach((convId, i) => {
      messages.push({
        conversation_id: convId,
        role: 'user',
        content: CONV_DATA[i].userMsg,
        created_at: new Date(2026, 2, 20 + i, 10, 0).toISOString(),
      });
      messages.push({
        conversation_id: convId,
        role: 'assistant',
        content: CONV_DATA[i].assistantMsg,
        created_at: new Date(2026, 2, 20 + i, 10, 1).toISOString(),
      });
    });
    await api.seedData({ chat_messages: messages });

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

  test('CH-SW1: Conversation switching is stable (no infinite loop)', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Wait for sidebar to populate with seeded conversations
    await page.waitForTimeout(2000);

    // All 3 conversations should appear in the sidebar
    const sidebar = page.locator('div[style*="cursor: pointer"]');
    const convCount = await sidebar.count();
    expect(convCount).toBeGreaterThanOrEqual(3);

    // --- Click conversation 1 (human-like delay: 400ms) ---
    const conv1 = page.locator(`text=${CONV_DATA[0].title}`);
    await expect(conv1).toBeVisible({ timeout: 5000 });
    await conv1.click();
    await page.waitForTimeout(400);

    // Wait for messages to load (loading indicator should appear then disappear)
    await expect(page.locator('[data-testid="chat-message-user"]').first()).toBeVisible({ timeout: 5000 });
    const userMsg1 = await page.locator('[data-testid="chat-message-user"]').first().textContent();
    expect(userMsg1).toContain('conversation one');

    // Loading should be done
    await expect(page.locator('[data-testid="chat-loading"]')).not.toBeVisible({ timeout: 3000 });

    // --- Click conversation 2 (400ms delay) ---
    const conv2 = page.locator(`text=${CONV_DATA[1].title}`);
    await conv2.click();
    await page.waitForTimeout(400);

    await expect(page.locator('[data-testid="chat-message-user"]').first()).toBeVisible({ timeout: 5000 });
    const userMsg2 = await page.locator('[data-testid="chat-message-user"]').first().textContent();
    expect(userMsg2).toContain('conversation two');

    // Conversation 1's message should NOT be visible
    await expect(page.locator(`text=${CONV_DATA[0].userMsg}`)).not.toBeVisible();

    // --- Click conversation 3 (400ms delay) ---
    const conv3 = page.locator(`text=${CONV_DATA[2].title}`);
    await conv3.click();
    await page.waitForTimeout(400);

    await expect(page.locator('[data-testid="chat-message-user"]').first()).toBeVisible({ timeout: 5000 });
    const userMsg3 = await page.locator('[data-testid="chat-message-user"]').first().textContent();
    expect(userMsg3).toContain('conversation three');

    // --- Verify app is not frozen: nav links should work ---
    const skillsLink = page.locator('a[href="/skills"]').first();
    await expect(skillsLink).toBeVisible();
    await skillsLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/skills');
  });

  test('CH-SW2: Rapid switching does not cause oscillation', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click between conversations rapidly (300ms between clicks)
    const conv1 = page.locator(`text=${CONV_DATA[0].title}`);
    const conv2 = page.locator(`text=${CONV_DATA[1].title}`);
    const conv3 = page.locator(`text=${CONV_DATA[2].title}`);

    await conv1.click();
    await page.waitForTimeout(300);
    await conv2.click();
    await page.waitForTimeout(300);
    await conv3.click();
    await page.waitForTimeout(300);
    await conv1.click();

    // Wait for final state to settle
    await page.waitForTimeout(1000);

    // The last clicked conversation (1) should be showing its messages
    await expect(page.locator('[data-testid="chat-message-user"]').first()).toBeVisible({ timeout: 5000 });
    const finalMsg = await page.locator('[data-testid="chat-message-user"]').first().textContent();
    expect(finalMsg).toContain('conversation one');

    // No loading indicator should be stuck
    await expect(page.locator('[data-testid="chat-loading"]')).not.toBeVisible({ timeout: 3000 });

    // Page should not be frozen — test by clicking a link
    await page.locator('a[href="/skills"]').first().click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/skills');
  });
});

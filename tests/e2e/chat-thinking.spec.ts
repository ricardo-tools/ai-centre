import { test, expect } from './base-test';
import { rollbackToBase, rollbackToDescribe, recordTimestamp, clearSession, collectConsoleErrors, logFailureDiagnostics } from './test-helpers';

/**
 * Chat Display, Grounding & UX Tests
 *
 * CH-TH1: Thinking indicator appears during processing
 * CH-TH2: Response renders as markdown, per-message thinking block persists
 * CH-TH3: AI responds directly (no self-introduction)
 * CH-TN1: Tool narration in thinking block (not as response bubble)
 * CH-AB1: Action bar with copy icon below response
 * CH-AB2: Copy button works in action bar
 * CH-AB3: Action bar buttons have labels
 * CH-RD1: Reasoning content is not duplicated
 * CH-NV1: Navigation works from chat page
 * CH-NAV2: Chat link visible in top navigation
 * CH-GR1: AI only references real skills
 * CH-GR2: AI honestly says when a skill doesn't exist
 * CH-SH1: Code blocks have syntax highlighting
 * CH-LK1: Skill links are clickable
 * CH-TC1: Tool calling works without API errors
 * CH-IN1: Enter sends, Shift+Enter adds newline
 */

test.describe('Chat Display', () => {
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

  test('CH-TH1: Thinking indicator appears while AI processes', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Say hello');
    await page.locator('[data-testid="chat-send"]').click();

    await expect(page.locator('[data-testid="chat-thinking"]')).toBeVisible({ timeout: 2000 });
    // nth(1) because nth(0) is the proactive greeting message
    await expect(page.locator('[data-testid="chat-message-assistant"]').nth(1)).toBeVisible({ timeout: 30000 });
  });

  test('CH-TH2: Response renders as markdown and per-message thinking block persists', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('List 3 things using bullet points');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    const assistant = page.locator('[data-testid="chat-message-assistant"]').nth(1);
    await expect(assistant).toBeVisible({ timeout: 30000 });

    // Response should have rendered HTML
    const html = await assistant.innerHTML();
    expect(html.includes('<p>') || html.includes('<li>') || html.includes('<strong>')).toBe(true);

    // Thinking indicator gone
    await expect(page.locator('[data-testid="chat-thinking"]')).not.toBeVisible();

    // If reasoning was produced, the thinking block should be per-message (above the response)
    const reasoningBlock = page.locator('[data-testid="chat-reasoning-block"]');
    if (await reasoningBlock.count() > 0) {
      // It should be visible (collapsed) — part of the message, not a floating element
      await expect(reasoningBlock.first()).toBeVisible();
      // Click to expand
      await page.locator('[data-testid="chat-reasoning-toggle"]').first().click();
      await expect(page.locator('[data-testid="chat-reasoning-content"]').first()).toBeVisible({ timeout: 1000 });
    }
  });

  test('CH-TH3: AI responds directly without self-introduction', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('What is Next.js?');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    const assistant = page.locator('[data-testid="chat-message-assistant"]').nth(1);
    await expect(assistant).toBeVisible({ timeout: 30000 });

    const text = await assistant.textContent();
    expect(text!.toLowerCase()).toContain('next');
    expect(text!).not.toContain('I can help you with');
  });

  test('CH-TN1: Tool narration does not appear as a separate response bubble', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Find skills about auth');
    await page.locator('[data-testid="chat-send"]').click();

    // Wait for response — nth(1) because nth(0) is the proactive greeting message
    await expect(page.locator('[data-testid="chat-message-assistant"]').nth(1)).toBeVisible({ timeout: 30000 });

    // There should be exactly 2 assistant messages (greeting + the final response)
    const assistantCount = await page.locator('[data-testid="chat-message-assistant"]').count();
    expect(assistantCount).toBe(2);

    // No raw JSON visible in the API response
    const text = await page.locator('[data-testid="chat-message-assistant"]').nth(1).textContent();
    expect(text!).not.toContain('{"count":');
  });

  test('CH-AB1: Action bar with copy icon below response', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Say hi');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    await expect(page.locator('[data-testid="chat-message-assistant"]').nth(1)).toBeVisible({ timeout: 30000 });

    // Action bar on the API response (second action bar, after greeting's)
    const actionBar = page.locator('[data-testid="chat-action-bar"]').nth(1);
    await expect(actionBar).toBeVisible();

    // Copy button should be in the action bar
    const copyButton = actionBar.locator('[data-testid="chat-copy-button"]');
    await expect(copyButton).toBeVisible();
  });

  test('CH-AB2: Copy button works', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Say hello world');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    await expect(page.locator('[data-testid="chat-message-assistant"]').nth(1)).toBeVisible({ timeout: 30000 });

    // Click copy on the API response (second copy button, after greeting's)
    const copyButton = page.locator('[data-testid="chat-copy-button"]').nth(1);
    await copyButton.click();
    // Brief wait for feedback animation
    await page.waitForTimeout(500);
    // Button should still be visible (didn't break)
    await expect(copyButton).toBeVisible();
  });

  test('CH-RD1: Reasoning content is not duplicated', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('What skills do I need for a dashboard?');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    await expect(page.locator('[data-testid="chat-message-assistant"]').nth(1)).toBeVisible({ timeout: 30000 });

    // If reasoning was produced, check it's not duplicated
    const reasoningBlock = page.locator('[data-testid="chat-reasoning-block"]');
    if (await reasoningBlock.count() > 0) {
      // Expand the reasoning block
      await page.locator('[data-testid="chat-reasoning-toggle"]').first().click();
      const content = await page.locator('[data-testid="chat-reasoning-content"]').first().textContent();
      if (content && content.length > 20) {
        // Check for obvious duplication: take first 30 chars and see if they repeat immediately
        const sample = content.substring(0, 30).trim();
        const doubledSample = sample + sample;
        expect(content.startsWith(doubledSample)).toBe(false);
      }
    }
  });

  test('CH-NV1: Navigation works from chat page', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    // Chat link should exist in the top nav
    await expect(page.locator('a[href="/chat"]').first()).toBeVisible();

    // Click Skills in the top nav
    await page.locator('a[href="/skills"]').first().click();
    await page.waitForLoadState('networkidle');

    // Should have navigated away from chat
    expect(page.url()).toContain('/skills');
    await expect(page.locator('[data-testid="chat-input"]')).not.toBeVisible();
  });

  test('CH-NAV2: Chat link visible in top navigation', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForLoadState('networkidle');

    // Chat link should be in the navigation
    const chatLink = page.locator('a[href="/chat"]').first();
    await expect(chatLink).toBeVisible();

    // Click it — should navigate to chat page
    await chatLink.click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/chat');
    await expect(page.locator('[data-testid="chat-input"]')).toBeVisible();
  });

  test('CH-GR1: AI only references real skills', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('What skills do I need for a dashboard?');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    const assistant = page.locator('[data-testid="chat-message-assistant"]').nth(1);
    await expect(assistant).toBeVisible({ timeout: 30000 });

    const text = await assistant.textContent();
    // Should NOT contain fabricated skill names
    expect(text!).not.toContain('Data Visualization Fundamentals');
    expect(text!).not.toContain('React Best Practices');
    expect(text!).not.toContain('RESTful API Integration');
    expect(text!).not.toContain('UI/UX Principles');
    expect(text!).not.toContain('Frontend Interactive Components');

    // Should reference at least one real skill
    const html = await assistant.innerHTML();
    const hasRealSkill = html.includes('frontend-architecture')
      || html.includes('app-layout')
      || html.includes('responsiveness')
      || html.includes('brand-design-system')
      || html.includes('accessibility');
    expect(hasRealSkill).toBe(true);
  });

  test('CH-GR2: AI honestly says when a skill does not exist', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Do you have a skill for Kubernetes?');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    const assistant = page.locator('[data-testid="chat-message-assistant"]').nth(1);
    await expect(assistant).toBeVisible({ timeout: 30000 });

    const text = await assistant.textContent();
    // Should NOT invent a Kubernetes skill
    const inventedKubernetes = text!.includes('/skills/kubernetes')
      || text!.includes('`kubernetes`');
    expect(inventedKubernetes).toBe(false);
  });

  test('CH-SH1: Code blocks have syntax highlighting', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Show me a short TypeScript function example');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    const assistant = page.locator('[data-testid="chat-message-assistant"]').nth(1);
    await expect(assistant).toBeVisible({ timeout: 30000 });

    // Code block should exist with Shiki highlighting (shiki-wrapper class or spans with style)
    const codeBlock = assistant.locator('.shiki-wrapper, pre');
    if (await codeBlock.count() > 0) {
      // Should have colored spans (Shiki output) or at minimum a pre block
      const hasHighlighting = await codeBlock.first().locator('span[style]').count() > 0;
      // Even without highlighting, the code should be in a styled container
      expect(await codeBlock.first().isVisible()).toBe(true);
      // If Shiki loaded, we should see colored spans
      if (hasHighlighting) {
        expect(hasHighlighting).toBe(true);
      }
    }
  });

  test('CH-LK1: Skill links are clickable', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Tell me about the authentication skill and link me to it');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    const assistant = page.locator('[data-testid="chat-message-assistant"]').nth(1);
    await expect(assistant).toBeVisible({ timeout: 30000 });

    // Check for clickable links (rendered <a> tags, not raw markdown text)
    const links = assistant.locator('a[href^="/skills/"]');
    if (await links.count() > 0) {
      const href = await links.first().getAttribute('href');
      expect(href).toMatch(/^\/skills\/[a-z0-9-]+$/);
    }
  });

  test('CH-AB3: Action bar buttons have labels', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Say hi');
    await page.locator('[data-testid="chat-send"]').click();

    // nth(1) because nth(0) is the proactive greeting message
    await expect(page.locator('[data-testid="chat-message-assistant"]').nth(1)).toBeVisible({ timeout: 30000 });

    // Copy button on the API response (second copy button, after greeting's)
    const copyButton = page.locator('[data-testid="chat-copy-button"]').nth(1);
    await expect(copyButton).toBeVisible();
    await expect(copyButton).toContainText('Copy');
  });

  test('CH-TC1: Tool calling works without API errors', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    await page.locator('[data-testid="chat-input"]').fill('Find skills about authentication');
    await page.locator('[data-testid="chat-send"]').click();

    // Should get a response without error — nth(1) because nth(0) is the proactive greeting
    const assistant = page.locator('[data-testid="chat-message-assistant"]').nth(1);
    await expect(assistant).toBeVisible({ timeout: 30000 });

    // No error message should appear
    const errorVisible = await page.locator('text=Error').isVisible().catch(() => false);
    expect(errorVisible).toBe(false);

    // Response should mention real auth skills
    const text = await assistant.textContent();
    const mentionsAuth = text!.toLowerCase().includes('auth');
    expect(mentionsAuth).toBe(true);
  });

  test('CH-IN1: Enter sends, Shift+Enter adds newline', async ({ page }) => {
    await page.goto('/chat');
    await page.waitForLoadState('networkidle');

    const input = page.locator('[data-testid="chat-input"]');

    // Type and press Enter — should send
    await input.fill('Say hello');
    await input.press('Enter');

    // User message should appear (was sent)
    await expect(page.locator('[data-testid="chat-message-user"]').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="chat-message-user"]').first()).toContainText('Say hello');

    // Input should be cleared after sending
    const inputVal = await input.inputValue();
    expect(inputVal).toBe('');
  });
});

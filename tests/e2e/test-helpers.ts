/**
 * Test Helpers — plain functions for E2E test lifecycle.
 *
 * No test.extend, no fixtures, no implicit hooks.
 * Each spec calls these explicitly in its own beforeAll/beforeEach.
 *
 * Every function takes testInfo (for parallelIndex) or page as parameter.
 * Permanent diagnostic logging on every call.
 */

import type { TestInfo, Page } from '@playwright/test';
import { createTestApi } from './test-api';
import { BASE } from './base-data';
import * as fs from 'fs';
import * as path from 'path';

const BASE_PORT = 3100;

// ── Worker routing ──────────────────────────────────────────────────

export function getWorkerPort(testInfo: TestInfo): number {
  return BASE_PORT + testInfo.parallelIndex;
}

export function getBaseUrl(testInfo: TestInfo): string {
  return `http://localhost:${getWorkerPort(testInfo)}`;
}

export function getBaseTimestamp(testInfo: TestInfo): string {
  const markFile = path.join(__dirname, `.global-mark-${testInfo.parallelIndex}`);
  return fs.readFileSync(markFile, 'utf-8').trim();
}

export function createWorkerApi(testInfo: TestInfo) {
  return createTestApi(getWorkerPort(testInfo));
}

// ── Data lifecycle ──────────────────────────────────────────────────

/** Rollback to base timestamp — deletes everything created after global seed. */
export async function rollbackToBase(testInfo: TestInfo): Promise<void> {
  const api = createWorkerApi(testInfo);
  const baseTs = getBaseTimestamp(testInfo);
  console.log(`[test-helpers:rollbackToBase] worker=${testInfo.parallelIndex} base=${baseTs.substring(11, 23)}`);
  await api.rollbackToMark(baseTs);
}

/** Rollback to a describe-level timestamp — deletes test-level data, preserves describe seed. */
export async function rollbackToDescribe(describeTs: string, testInfo: TestInfo): Promise<void> {
  const api = createWorkerApi(testInfo);
  console.log(`[test-helpers:rollbackToDescribe] worker=${testInfo.parallelIndex} test="${testInfo.title}" ts=${describeTs.substring(11, 23)}`);
  await api.rollbackToMark(describeTs);
}

/** Record a timestamp. Returns the mark string for use as describeTs. */
export async function recordTimestamp(testInfo: TestInfo): Promise<string> {
  const api = createWorkerApi(testInfo);
  const { mark } = await api.mark();
  console.log(`[test-helpers:recordTimestamp] worker=${testInfo.parallelIndex} mark=${mark.substring(11, 23)}`);
  return mark;
}

// ── Session management ──────────────────────────────────────────────

type BaseUser = typeof BASE.users.admin;

/** Clear identity cookie + localStorage. Call in beforeEach. */
export async function clearSession(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear()).catch(() => {});
  await page.context().clearCookies({ name: BASE.identityCookie });
}

/** Switch to a specific user identity. Sets cookie — next page.goto will use it. */
export async function switchUser(page: Page, user: BaseUser): Promise<void> {
  await page.context().clearCookies({ name: BASE.identityCookie });
  await page.context().addCookies([{
    name: BASE.identityCookie,
    value: encodeURIComponent(JSON.stringify({
      userId: user.id,
      email: user.email,
      roleSlug: user.roleSlug,
    })),
    domain: 'localhost',
    path: '/',
  }]);
}

// ── Diagnostics ─────────────────────────────────────────────────────

/** Attach console error listeners to the page. Returns the error array. */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => {
    errors.push(`[uncaught] ${err.message}`);
  });
  return errors;
}

/** Print failure diagnostics — call in afterEach when test failed. */
export async function logFailureDiagnostics(
  testInfo: TestInfo,
  consoleErrors: string[],
): Promise<void> {
  if (testInfo.status === 'passed') return;

  const port = getWorkerPort(testInfo);
  console.error(`\n[FAILURE] worker=${testInfo.parallelIndex} "${testInfo.title}" (${testInfo.status})`);

  if (consoleErrors.length > 0) {
    console.error(`  Browser console errors (${consoleErrors.length}):`);
    for (const err of consoleErrors.slice(0, 5)) {
      console.error(`    • ${err.substring(0, 200)}`);
    }
  }

  try {
    const res = await fetch(`http://localhost:${port}/api/logs?level=error&limit=5`);
    if (res.ok) {
      const data = await res.json();
      if (data.count > 0) {
        console.error(`  Server errors (${data.count}):`);
        for (const log of data.logs) {
          console.error(`    • [${log.timestamp}] ${log.message.substring(0, 200)}`);
        }
      }
    }
  } catch { /* server may be down */ }

  console.error('');
}

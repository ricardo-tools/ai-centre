/**
 * Base test — minimal test.extend for baseURL override only.
 *
 * Each worker gets its own server port. This extends the base test
 * ONLY to set baseURL per worker. No hooks, no fixtures, no lifecycle.
 *
 * All lifecycle logic is in test-helpers.ts, called explicitly by each spec.
 */

import { test as base, expect } from '@playwright/test';
import type { TestInfo } from '@playwright/test';

const BASE_PORT = 3100;

export const test = base.extend({
  baseURL: async ({}, use: (url: string) => Promise<void>, testInfo: TestInfo) => {
    await use(`http://localhost:${BASE_PORT + testInfo.parallelIndex}`);
  },
});

export { expect };

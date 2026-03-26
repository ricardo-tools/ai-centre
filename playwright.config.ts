import { defineConfig, devices } from '@playwright/test';

const WORKER_COUNT = 4;
const BASE_PORT = 3100;
const DB_BASE = 'postgresql://aicentre:aicentre@localhost:5433';

// Each worker gets its own server on a separate port with its own DATABASE
const webServers = Array.from({ length: WORKER_COUNT }, (_, i) => ({
  command: `test -d .next || npx next build; PORT=${BASE_PORT + i} npx next start -p ${BASE_PORT + i}`,
  port: BASE_PORT + i,
  reuseExistingServer: false,
  env: {
    DATABASE_URL: `${DB_BASE}/aicentre_test_${i}`,
    SKIP_AUTH: 'true',
    PORT: String(BASE_PORT + i),
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?? '',
  },
}));

export default defineConfig({
  testDir: './tests/e2e',
  globalSetup: './tests/e2e/playwright.global-setup.ts',
  globalTeardown: './tests/e2e/playwright.global-teardown.ts',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: WORKER_COUNT,
  fullyParallel: false,
  reporter: 'html',
  use: {
    baseURL: `http://localhost:${BASE_PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: webServers,
});

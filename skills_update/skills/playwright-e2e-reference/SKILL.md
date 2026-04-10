---
name: playwright-e2e-reference
description: >
  Copy-paste implementation templates for the Playwright E2E test infrastructure.
  Per-worker database isolation, 3-tier data lifecycle, test API endpoint, helper
  functions, global setup/teardown, and example spec files. Companion to
  playwright-e2e (the behavioral skill). Use when setting up E2E tests from
  scratch in a new project.
---

# Playwright E2E Reference

Implementation templates for the patterns described in **playwright-e2e**. Drop these files into a new project and adapt table names, seed data, and API routes.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  playwright.config.ts       │ 4 workers, 4 ports, 4 databases      │
├──────────────────────────────────────────────────────────────────────┤
│  global-setup.ts            │ Create DBs → push schema → seed →    │
│                             │ record baseTimestamp per worker       │
├──────────────────────────────────────────────────────────────────────┤
│  base-test.ts               │ Minimal test.extend (baseURL only)   │
├──────────────────────────────────────────────────────────────────────┤
│  test-helpers.ts            │ Explicit lifecycle functions          │
│                             │ (rollback, session, diagnostics)     │
├──────────────────────────────────────────────────────────────────────┤
│  test-api.ts                │ HTTP wrapper around /api/test-setup  │
├──────────────────────────────────────────────────────────────────────┤
│  base-data.ts               │ Single source of truth for seed data │
├──────────────────────────────────────────────────────────────────────┤
│  /api/test-setup/route.ts   │ Server-side mark/rollback/seed/clean │
├──────────────────────────────────────────────────────────────────────┤
│  global-teardown.ts         │ Clean up mark files                  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. `playwright.config.ts`

```ts
import { defineConfig, devices } from '@playwright/test';

const WORKER_COUNT = 4;
const BASE_PORT = 3100;
const DB_BASE = 'postgresql://myapp:myapp@localhost:5433';

const webServers = Array.from({ length: WORKER_COUNT }, (_, i) => ({
  command: `test -d .next || npx next build; PORT=${BASE_PORT + i} npx next start -p ${BASE_PORT + i}`,
  port: BASE_PORT + i,
  reuseExistingServer: false,
  env: {
    DATABASE_URL: `${DB_BASE}/myapp_test_${i}`,
    SKIP_AUTH: 'true',
    PORT: String(BASE_PORT + i),
    // Pass through any API keys needed for integration tests
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY ?? '',
  },
}));

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: WORKER_COUNT,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
  },
  globalSetup: './tests/e2e/playwright.global-setup.ts',
  globalTeardown: './tests/e2e/playwright.global-teardown.ts',
  webServer: webServers as any,
});
```

**Key decisions:**
- `parallelIndex` (stable 0..3) maps to port and database
- Each server gets its own `DATABASE_URL` via env
- `reuseExistingServer: false` ensures clean servers per run
- Build once (`test -d .next || ...`), start 4 instances

---

## 2. `tests/e2e/base-test.ts`

```ts
import { test as base } from '@playwright/test';

const BASE_PORT = 3100;

export const test = base.extend({
  baseURL: async ({}, use, testInfo) => {
    await use(`http://localhost:${BASE_PORT + testInfo.parallelIndex}`);
  },
});

export { expect } from '@playwright/test';
```

**Why minimal:** Only override `baseURL` per worker. Do NOT put lifecycle hooks in fixtures — Playwright has bugs with `beforeAll` + worker-scoped fixtures (Issue #13985).

---

## 3. `tests/e2e/test-helpers.ts`

```ts
import { type TestInfo, type Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { createTestApi } from './test-api';
import { BASE } from './base-data';

const BASE_PORT = 3100;

export function getWorkerPort(testInfo: TestInfo): number {
  return BASE_PORT + testInfo.parallelIndex;
}

export function getBaseUrl(testInfo: TestInfo): string {
  return `http://localhost:${getWorkerPort(testInfo)}`;
}

function getBaseTimestamp(testInfo: TestInfo): string {
  return readFileSync(`.global-mark-${testInfo.parallelIndex}`, 'utf-8').trim();
}

export function createWorkerApi(testInfo: TestInfo) {
  return createTestApi(getWorkerPort(testInfo));
}

/** Rollback to base timestamp — deletes everything created after global seed. */
export async function rollbackToBase(testInfo: TestInfo): Promise<void> {
  const api = createWorkerApi(testInfo);
  const baseTs = getBaseTimestamp(testInfo);
  await api.rollbackToMark(baseTs);
}

/** Rollback to describe-level timestamp. */
export async function rollbackToDescribe(describeTs: string, testInfo: TestInfo): Promise<void> {
  const api = createWorkerApi(testInfo);
  await api.rollbackToMark(describeTs);
}

/** Record a timestamp for describe-level mark. */
export async function recordTimestamp(testInfo: TestInfo): Promise<string> {
  const api = createWorkerApi(testInfo);
  const { mark } = await api.mark();
  return mark;
}

/** Clear identity cookie + localStorage. */
export async function clearSession(page: Page): Promise<void> {
  await page.evaluate(() => localStorage.clear()).catch(() => {});
  await page.context().clearCookies({ name: BASE.identityCookie });
}

/** Switch to a specific user identity via cookie. */
export async function switchUser(page: Page, user: { id: string; email: string; roleSlug: string }): Promise<void> {
  await page.context().clearCookies({ name: BASE.identityCookie });
  await page.context().addCookies([{
    name: BASE.identityCookie,
    value: encodeURIComponent(JSON.stringify({
      userId: user.id, email: user.email, roleSlug: user.roleSlug,
    })),
    domain: BASE.domain,
    path: '/',
  }]);
}

/** Collect browser console errors. */
export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

/** Print diagnostics on test failure. */
export async function logFailureDiagnostics(testInfo: TestInfo, consoleErrors: string[]): Promise<void> {
  if (testInfo.status === testInfo.expectedStatus) return;
  console.log(`[FAILURE] worker=${testInfo.parallelIndex} "${testInfo.title}" (${testInfo.status})`);
  if (consoleErrors.length > 0) {
    console.log(`  Browser console errors (${consoleErrors.length}):`);
    consoleErrors.forEach((e) => console.log(`    • ${e}`));
  }
  // Optionally fetch server logs
  try {
    const res = await fetch(`${getBaseUrl(testInfo)}/api/logs?level=error&limit=10`);
    if (res.ok) {
      const logs = await res.json();
      if (logs.length > 0) {
        console.log(`  Server errors (${logs.length}):`);
        logs.forEach((l: { message: string }) => console.log(`    • ${l.message}`));
      }
    }
  } catch { /* server logs optional */ }
}
```

---

## 4. `tests/e2e/test-api.ts`

```ts
const DEFAULT_PORT = 3100;

async function post(baseUrl: string, body: Record<string, unknown>) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${baseUrl}/api/test-setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export function createTestApi(port: number) {
  const baseUrl = `http://localhost:${port}`;
  return {
    mark: () => post(baseUrl, { action: 'mark' }),
    rollbackToMark: (mark: string) => post(baseUrl, { action: 'rollback-to-mark', mark }),
    cleanTransactional: () => post(baseUrl, { action: 'clean-transactional' }),
    seedData: (data: Record<string, Record<string, unknown>[]>) =>
      post(baseUrl, { action: 'seed', data }),
    verifySeed: () => post(baseUrl, { action: 'verify-seed' }),
  };
}

export default createTestApi(DEFAULT_PORT);
```

---

## 5. `tests/e2e/base-data.ts` (structure)

```ts
export const BASE = {
  domain: 'localhost',
  identityCookie: 'dev-identity',

  users: {
    admin: { id: 'uuid-admin', email: 'admin@test', name: 'Admin', roleSlug: 'admin' },
    member: { id: 'uuid-member', email: 'member@test', name: 'Member', roleSlug: 'member' },
  },

  // Seed data — what's in the DB at baseTimestamp
  upvotedEntitySlugs: ['entity-a', 'entity-b'],
  bookmarkedEntitySlugs: ['entity-a'],

  // Zero-query assertion helpers
  upvoteCount(slug: string): number {
    return this.upvotedEntitySlugs.includes(slug) ? 1 : 0;
  },
  isBookmarked(slug: string): boolean {
    return this.bookmarkedEntitySlugs.includes(slug);
  },

  // SQL generation for global setup (psql)
  toSeedStatements(): string[] {
    const stmts: string[] = [];
    // Generate INSERT ... ON CONFLICT DO NOTHING for each seed row
    for (const slug of this.upvotedEntitySlugs) {
      stmts.push(`INSERT INTO reactions (entity_type, entity_id, user_id, emoji)
        VALUES ('skill', '${slug}', '${this.users.admin.id}', 'thumbsup')
        ON CONFLICT DO NOTHING;`);
    }
    // ... bookmarks, comments, etc.
    return stmts;
  },
};
```

---

## 6. `tests/e2e/playwright.global-setup.ts` (structure)

```ts
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import testApi from './test-api';
import { BASE } from './base-data';

const WORKER_COUNT = 4;
const BASE_PORT = 3100;
const DB_BASE = 'postgresql://myapp:myapp@localhost:5433';

function psql(dbUrl: string, query: string) {
  execSync(`psql "${dbUrl}" -c "${query.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, { stdio: 'pipe' });
}

function createDatabase(i: number) {
  try { psql(`${DB_BASE}/postgres`, `CREATE DATABASE myapp_test_${i}`); }
  catch { /* already exists */ }
}

async function pushSchema(i: number) {
  execSync(`npx drizzle-kit push --dialect postgresql --schema src/db/schema.ts --url "${DB_BASE}/myapp_test_${i}" --force`, { stdio: 'pipe' });
}

async function waitForServer(port: number, maxWait = 60000) {
  const start = Date.now();
  while (Date.now() - start < maxWait) {
    try { await fetch(`http://localhost:${port}/api/health`); return; }
    catch { await new Promise((r) => setTimeout(r, 1000)); }
  }
  throw new Error(`Server on port ${port} did not start within ${maxWait}ms`);
}

export default async function globalSetup() {
  // 1. Create databases + push schema
  for (let i = 0; i < WORKER_COUNT; i++) {
    createDatabase(i);
    await pushSchema(i);
  }

  // 2. Wait for all servers to start
  await Promise.all(
    Array.from({ length: WORKER_COUNT }, (_, i) => waitForServer(BASE_PORT + i))
  );

  // 3. Per worker: clean, seed, record mark
  for (let i = 0; i < WORKER_COUNT; i++) {
    const api = testApi; // createTestApi(BASE_PORT + i)
    const dbUrl = `${DB_BASE}/myapp_test_${i}`;

    // Clean leftover data
    // api.cleanTransactional() or psql DELETE statements

    // Seed roles + users via psql
    psql(dbUrl, `INSERT INTO roles ... ON CONFLICT DO NOTHING;`);
    psql(dbUrl, `INSERT INTO users ... ON CONFLICT DO NOTHING;`);

    // Seed base social data
    for (const stmt of BASE.toSeedStatements()) {
      psql(dbUrl, stmt);
    }

    // Wait for created_at timestamps to settle
    await new Promise((r) => setTimeout(r, 2000));

    // Record baseTimestamp
    const { mark } = await api.mark();
    writeFileSync(`.global-mark-${i}`, mark);
    console.log(`[global-setup] Worker ${i} ready, baseTimestamp: ${mark}`);
  }
}
```

---

## 7. `tests/e2e/playwright.global-teardown.ts`

```ts
import { unlinkSync } from 'fs';

const WORKER_COUNT = 4;

export default function globalTeardown() {
  for (let i = 0; i < WORKER_COUNT; i++) {
    try { unlinkSync(`.global-mark-${i}`); } catch {}
  }
  console.log('[global-teardown] Cleaned up mark files. Databases preserved for next run.');
}
```

---

## 8. `/api/test-setup/route.ts` (Next.js)

```ts
import { type NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import { getDb } from '@/db/client';

// Tables that are NEVER truncated (seed data)
const SEED_TABLES = ['roles', 'users', 'skills'];

// Tables with created_at that support timestamp rollback
const SOCIAL_TABLES = ['reactions', 'bookmarks', 'comments', 'notifications', 'activity_events'];

// All transactional tables (for full clean)
const TRANSACTIONAL_TABLES = [...SOCIAL_TABLES, 'audit_log', 'verification_tokens'];

export async function POST(request: NextRequest) {
  if (process.env.SKIP_AUTH !== 'true') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const db = getDb();

  switch (body.action) {
    case 'mark': {
      const result = await db.execute(sql`SELECT clock_timestamp()::text AS mark`);
      return NextResponse.json({ ok: true, mark: result.rows[0].mark });
    }

    case 'rollback-to-mark': {
      const { mark } = body;
      for (const table of SOCIAL_TABLES) {
        await db.execute(sql.raw(`DELETE FROM "${table}" WHERE created_at > '${mark}'`));
      }
      return NextResponse.json({ ok: true });
    }

    case 'clean-transactional': {
      for (const table of TRANSACTIONAL_TABLES) {
        await db.execute(sql.raw(`DELETE FROM "${table}"`));
      }
      return NextResponse.json({ ok: true });
    }

    case 'seed': {
      const { data } = body;
      for (const [table, rows] of Object.entries(data)) {
        for (const row of rows as Record<string, unknown>[]) {
          const cols = Object.keys(row);
          const vals = cols.map((c) => {
            const v = row[c];
            if (v === null) return 'NULL';
            return `'${String(v).replace(/'/g, "''")}'`;
          });
          await db.execute(sql.raw(
            `INSERT INTO "${table}" (${cols.map(c => `"${c}"`).join(',')}) VALUES (${vals.join(',')}) ON CONFLICT DO NOTHING`
          ));
        }
      }
      return NextResponse.json({ ok: true });
    }

    case 'verify-seed': {
      const [r, u] = await Promise.all([
        db.execute(sql`SELECT count(*)::int AS c FROM roles`),
        db.execute(sql`SELECT count(*)::int AS c FROM users`),
      ]);
      return NextResponse.json({
        ok: true,
        counts: { roles: r.rows[0].c, users: u.rows[0].c },
      });
    }

    default:
      return NextResponse.json({ error: `Unknown action: ${body.action}` }, { status: 400 });
  }
}
```

---

## 9. Example Spec File

```ts
import { test, expect } from './base-test';
import { BASE } from './base-data';
import {
  rollbackToBase, rollbackToDescribe, recordTimestamp,
  clearSession, createWorkerApi, collectConsoleErrors, logFailureDiagnostics,
} from './test-helpers';

test.describe('Feature X', () => {
  let describeTs: string;
  let consoleErrors: string[];

  test.beforeAll(async ({}, testInfo) => {
    await rollbackToBase(testInfo);

    // Optional: seed describe-level fixtures
    const api = createWorkerApi(testInfo);
    await api.seedData({
      my_table: [{ id: 'fixture-1', name: 'Test Fixture', user_id: BASE.users.admin.id }],
    });

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

  test('user sees the fixture data', async ({ page }) => {
    await page.goto('/feature-x');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Test Fixture')).toBeVisible();
  });

  test('user can create and see new data', async ({ page }) => {
    await page.goto('/feature-x');
    // ... create something via the UI ...
    // This mutation is rolled back before the next test via rollbackToDescribe
  });
});
```

**Pattern:**
- `beforeAll` → rollback to base + seed describe fixtures + record mark
- `beforeEach` → rollback to describe mark + clear session + start error collection
- `afterEach` → log diagnostics on failure
- Each test's mutations are automatically cleaned up at the start of the next test

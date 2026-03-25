# Testing Guide

## Overview

| Type | Framework | Directory | Command |
|------|-----------|-----------|---------|
| Unit | Vitest + Testing Library | `tests/unit/` | `npm test` |
| E2E | Playwright (Chromium) | `tests/e2e/` | `npm run test:e2e` |

---

## Unit Tests

```bash
npm test                # Run once, exit
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report (v8)
```

- Config: `vitest.config.ts`
- Environment: `jsdom`
- Setup: `tests/setup.ts` (loads `@testing-library/jest-dom`)
- Pattern: `tests/**/*.test.{ts,tsx}`

---

## E2E Tests

### Quick Start

```bash
npx next build          # Build first (tests use production server)
npm run test:e2e        # Run all E2E tests
npm run test:e2e:ui     # Playwright UI for debugging
```

### Test Database

Tests run against a **separate database** (`aicentre_test`) — the dev database (`aicentre`) is never touched.

| Property | Value |
|----------|-------|
| Database | `aicentre_test` |
| Host | `localhost:5433` (Docker) |
| Credentials | `aicentre:aicentre` |

The global setup creates this database and pushes the schema automatically on first run. Subsequent runs skip the schema push if tables already exist.

### Test Projects

| Project | Tests | Execution | DB Mutations |
|---------|-------|-----------|-------------|
| `readonly` | smoke, skill-browse, generate-project | Parallel (4 workers) | None |
| `stateful` | upvote-system, social-features, entity-isolation, data-isolation, comment-* | Serial (1 worker) | Yes |

---

## 3-Tier Data Lifecycle

Test data is managed at three levels, each with its own timestamp-based rollback point. **Order never matters** — every spec and every test starts from a known, deterministic state.

### The Three Tiers

```
┌─────────────────────────────────────────────────────────────┐
│  GLOBAL (base data)                                         │
│  Created: globalSetup    Cleaned: globalTeardown             │
│  Timestamp: baseTimestamp                                    │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  SPEC (shared across tests in one .spec.ts file)      │  │
│  │  Created: beforeAll    Cleaned: afterAll               │  │
│  │  Timestamp: specTimestamp                              │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  TEST (single test)                              │  │  │
│  │  │  Created: beforeEach  Cleaned: afterEach         │  │  │
│  │  │  Rollback point: specTimestamp                   │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                                                        │  │
│  │  afterAll: DELETE WHERE created_at > baseTimestamp     │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  globalTeardown: TRUNCATE all transactional tables           │
└─────────────────────────────────────────────────────────────┘
```

### How Each Tier Works

#### Global (Base Data)

| Hook | What happens |
|------|-------------|
| `globalSetup` | Create test DB → push schema → seed roles/users → seed base data (upvotes, bookmarks, comments) → record `baseTimestamp` |
| `globalTeardown` | TRUNCATE all transactional tables (fast page-deallocation, not row-by-row) |

Base data is defined in `tests/e2e/base-data.ts` — the single source of truth. The global setup generates SQL from it. Tests import it for assertions.

**Playwright hooks:** `globalSetup` / `globalTeardown` in `playwright.config.ts`

#### Spec Level

| Hook | What happens |
|------|-------------|
| `beforeAll` | Seed data shared by all tests in this spec → record `specTimestamp` |
| `afterAll` | `DELETE WHERE created_at > baseTimestamp` — removes spec data + any test leftovers, base data survives |

Spec-level data survives across all tests within the spec. After the spec finishes, everything is rolled back to the base data state.

#### Test Level

| Hook | What happens |
|------|-------------|
| `beforeEach` | Create test-specific data (if needed) |
| `afterEach` | `DELETE WHERE created_at > specTimestamp` — removes test data, spec data survives |

Each test starts from the spec-level state. After each test, only that test's mutations are removed.

### Timestamp Rollback Chain

Each level's cleanup uses the timestamp from the level above:

| Cleanup | Deletes rows where | Preserves |
|---------|-------------------|-----------|
| `afterEach` | `created_at > specTimestamp` | Base data + spec data |
| `afterAll` | `created_at > baseTimestamp` | Base data only |
| `globalTeardown` | TRUNCATE (all rows) | Nothing (fresh for next run) |

### Performance

- **Indexes** on `created_at` for all social tables (reactions, bookmarks, comments, activity_events, notifications) — makes timestamp-based deletes index-scanned
- **Batch SQL** — all deletes in a single database round-trip
- **TRUNCATE** at suite end (page deallocation, not row-by-row scan)
- Expected: `afterEach` rollback <5ms, `afterAll` rollback <5ms

---

## Base Data — Single Source of Truth

### `tests/e2e/base-data.ts`

This file defines ALL seed data as a TypeScript object. It serves two purposes:

1. **The global setup reads it** to generate SQL INSERT statements
2. **Tests import it** for zero-query assertions

```typescript
import { BASE } from './base-data';

// Instead of querying the DB:
expect(count).toBe(BASE.upvoteCount('accessibility') + 1);
expect(isBookmarked).toBe(BASE.isBookmarked('ai-capabilities'));
```

**If you need to change seed data, update ONLY `base-data.ts`.** The global setup and all tests automatically follow.

### What's in BASE

| Data | Details |
|------|---------|
| **Users** | Admin (`dev@local`) + Member (`member@test.local`) |
| **Upvotes** | 5 skills upvoted by admin (first 5 alphabetically) |
| **Bookmarks** | 3 skills bookmarked by admin (first 3 alphabetically) |
| **Comments** | 4 comments: 2 top-level + 1 reply on first skill, 1 on second skill |
| **baseTimestamp** | Recorded after all base data is seeded — used as rollback point |

### Adding Seed Data

1. Add to the `BASE` object in `base-data.ts`
2. Global setup automatically seeds it
3. Tests automatically have access via the import

---

## Writing New Tests

### Stateful Test (creates/modifies data)

```typescript
import { test, expect } from './fixtures';
import { BASE } from './base-data';

test.describe('My Feature', () => {
  // SPEC LEVEL: data shared across all tests in this describe
  test.beforeAll(async ({ testApi }) => {
    await testApi.seedData({
      comments: [{ id: '...', entity_type: 'skill', ... }],
    });
    // specTimestamp is recorded automatically after beforeAll
  });

  // TEST LEVEL: each test gets a clean page + auto-rollback after
  test.beforeEach(async ({ cleanPage }) => {
    await cleanPage('/skills');
  });

  test('uses base data for assertions', async ({ page }) => {
    // Reference BASE — no DB queries
    const card = page.locator('[data-entity-id="accessibility"]');
    const text = await card.locator('[data-testid="upvote-button"]').textContent();
    const count = parseInt(text?.replace(/[^\d]/g, '') ?? '0', 10);
    expect(count).toBe(BASE.upvoteCount('accessibility'));
  });

  test('creates data that auto-cleans', async ({ page }) => {
    // This upvote is rolled back after the test via afterEach
    await page.locator('[data-testid="upvote-button"]').nth(10).click();
  });
});
```

### Read-Only Test (no DB mutations)

```typescript
import { test, expect } from '@playwright/test';  // standard import, no fixtures

test('page loads', async ({ page }) => {
  await page.goto('/skills');
  await expect(page.locator('.card-hover').first()).toBeVisible();
});
```

### Checklist

1. Import `{ test, expect }` from `./fixtures` for stateful tests
2. Import `{ BASE }` from `./base-data` for count assertions — never hardcode numbers
3. Use `.first()` on locators to avoid strict-mode violations
4. Use `[data-entity-id="slug"]` for targeting specific cards
5. Pick cards beyond index 5 to avoid base-data upvotes/bookmarks (or use `BASE.upvoteCount()` to account for them)
6. Read-only tests go in `readonly` project; stateful tests go in `stateful` project

---

## Key Selectors

| Attribute | Element | Purpose |
|-----------|---------|---------|
| `data-testid="upvote-button"` | Upvote button | Toggle upvote |
| `data-testid="bookmark-button"` | Bookmark button | Toggle bookmark |
| `data-testid="comment-button"` | Comment button | Open comment drawer |
| `data-testid="comment-upvote"` | Comment upvote | Upvote within comments |
| `data-testid="comment-actions"` | Action bar | Contains upvote/reply/edit/delete |
| `data-testid="comment-drawer-entity"` | Drawer header | Shows entity title |
| `data-entity-id="<slug>"` | Card wrapper | Target specific card by slug |
| `data-entity-type="skill\|toolkit"` | Card wrapper | Identify entity type |
| `.card-hover` | Card wrapper | Generic card selector |

---

## Test API (`/api/test-setup`)

Available actions (dev/test only, blocked in production):

| Action | Purpose |
|--------|---------|
| `mark` | Record a DB timestamp (`SELECT now()`) |
| `rollback-to-mark` | `DELETE WHERE created_at > mark` across social tables (single batch SQL) |
| `clean-transactional` | TRUNCATE all non-seed tables (globalTeardown only) |
| `seed` | Insert fixture rows (`ON CONFLICT DO NOTHING`) |
| `verify-seed` | Check roles/users/skills counts |

---

## Running Tests with Failure Diagnostics

**Always run tests with enough context to diagnose failures.** Never grep/filter test output — show the full error.

### Standard Run (full output)

```bash
npx playwright test --reporter=list
```

### On Failure — Capture Everything

When a test fails, the following should be visible:
1. **Playwright error** — what locator failed, expected vs received
2. **Console errors** — any JS errors in the browser during the test
3. **Server logs** — any server-side errors (500s, DB failures)

The fixtures automatically capture console errors and server logs on failure. To check server logs after a run:

```bash
# Server-side errors during the test run
curl http://localhost:3000/api/logs?level=error

# All server logs (debug, info, warn, error)
curl http://localhost:3000/api/logs?limit=50
```

### Debugging a Single Test

```bash
# Run one test with full output
npx playwright test -g "CP1" --reporter=list

# Run with headed browser (watch it happen)
npx playwright test -g "CP1" --headed

# Playwright UI (step-through, DOM snapshots, network tab)
npm run test:e2e:ui

# View last run's HTML report (includes screenshots on failure)
npx playwright show-report
```

### Playwright Config for Failure Context

Traces are captured on first retry (`trace: 'on-first-retry'`). In CI with 2 retries, failed tests get a full trace archive (DOM snapshots, network, console) in `test-results/`.

### Rule: Never Silently Swallow Failures

- Do NOT pipe test output through `grep` or `tail` — show the full error
- Do NOT use `catch {}` in test code without logging
- If a test fails intermittently, run it 5 times: `npx playwright test -g "name" --repeat-each=5`

---

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `ai-centre-social` | Upvote + bookmark state per entity |
| `ai-centre-comment-votes` | Comment upvote state |

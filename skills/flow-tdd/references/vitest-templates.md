---
name: vitest-integration-reference
description: >
  Copy-paste implementation templates for Vitest integration test infrastructure.
  Transaction-based data isolation, 3-tier data lifecycle, base data utility,
  and Neo4j test helpers. Companion to flow-tdd (the behavioral skill). Use
  when writing or refactoring integration tests that hit Postgres or Neo4j.
---

# Vitest Integration Reference

Implementation templates for the data isolation patterns described in **flow-tdd**. Drop these into integration test files and adapt table names and seed data.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│  src/tests/utils/test-db.ts      │ createTestTransaction() helper   │
│                                  │ Single connection + BEGIN/SAVE   │
├──────────────────────────────────────────────────────────────────────┤
│  src/tests/utils/base-data.ts    │ Single source of truth for       │
│                                  │ seeded IDs (users, roles, dims)  │
├──────────────────────────────────────────────────────────────────────┤
│  src/tests/utils/neo4j-test.ts   │ Neo4j test helpers (seed, clean) │
├──────────────────────────────────────────────────────────────────────┤
│  vitest.config.ts                │ loadEnv for DATABASE_URL etc.    │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. `src/tests/utils/test-db.ts`

The core isolation utility. Creates a dedicated single-connection pool so one Postgres transaction stays open across all test functions in a file.

```ts
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/platform/db/schema';

const connectionString = process.env.DATABASE_URL!;

export type TestDb = ReturnType<typeof drizzle<typeof schema>>;

/**
 * Creates an isolated test transaction for a test file.
 *
 * Usage in test files:
 *   const { tx, rawSql, setup, teardown, savepoint, rollbackToSavepoint } = createTestTransaction();
 *   beforeAll(async () => { await setup(); });
 *   beforeEach(async () => { await savepoint(); });
 *   afterEach(async () => { await rollbackToSavepoint(); });
 *   afterAll(async () => { await teardown(); });
 */
export function createTestTransaction() {
  const rawSql = postgres(connectionString, { max: 1 });
  const tx = drizzle(rawSql, { schema }) as TestDb;

  return {
    /** The Drizzle instance — use this instead of `db` in all test queries. */
    tx,

    /** Raw postgres.js tagged template — for SAVEPOINT / ROLLBACK commands. */
    rawSql,

    /** Call in beforeAll — opens the file-level transaction. */
    setup: async () => {
      await rawSql`BEGIN`;
    },

    /** Call in afterAll — rolls back everything, closes connection. */
    teardown: async () => {
      await rawSql`ROLLBACK`;
      await rawSql.end();
    },

    /** Call in beforeEach — creates a savepoint before each test. */
    savepoint: async () => {
      await rawSql`SAVEPOINT test_savepoint`;
    },

    /** Call in afterEach — rolls back to the savepoint, undoing test mutations. */
    rollbackToSavepoint: async () => {
      await rawSql`ROLLBACK TO SAVEPOINT test_savepoint`;
    },
  };
}
```

**Key decisions:**
- `max: 1` forces all queries through one connection — transaction state persists
- `tx` is a full Drizzle instance with schema — supports `tx.query.*`, `tx.select()`, `tx.insert()`, etc.
- `rawSql` exposed for savepoint control and any raw SQL needs
- No cleanup code needed in tests — ROLLBACK handles everything

---

## 2. `src/tests/utils/base-data.ts`

Single source of truth for seeded data IDs. Tests reference these constants instead of querying for them.

```ts
import type { TestDb } from './test-db';

/**
 * Base data references — populated from the seeded database.
 * Call loadBaseData() once per file in beforeAll, after setup().
 */
export interface BaseData {
  /** A user ID for FK references (audit columns, createdBy, etc.) */
  actorId: string;
  // Add more as needed: roleIds, dimensionIds, etc.
}

export async function loadBaseData(tx: TestDb): Promise<BaseData> {
  const user = await tx.query.users.findFirst();
  if (!user) throw new Error('No seeded users found — run npm run db:seed first');

  return {
    actorId: user.id,
  };
}
```

**Extend as needed:** Add dimension IDs, role IDs, etc. as the project grows. This file is the contract between seed data and tests.

---

## 3. Example: Integration test with full isolation

```ts
import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { eq } from 'drizzle-orm';
import { content } from '@/platform/db/schema';
import { createTestTransaction, type TestDb } from '@/tests/utils/test-db';
import { loadBaseData, type BaseData } from '@/tests/utils/base-data';

// ─── Isolation setup ──────────────────────────────────────
const { tx, rawSql, setup, teardown, savepoint, rollbackToSavepoint } = createTestTransaction();
let base: BaseData;

beforeAll(async () => {
  await setup();
  base = await loadBaseData(tx);

  // File-level data — shared across all tests in this file
  await tx.insert(content).values({
    title: 'Shared Test Content',
    status: 'draft',
    createdBy: base.actorId,
    updatedBy: base.actorId,
  });
});

beforeEach(savepoint);
afterEach(rollbackToSavepoint);
afterAll(teardown);

// ─── Tests ────────────────────────────────────────────────
describe('Content operations', () => {
  it('file-level content is visible', async () => {
    const rows = await tx.select().from(content)
      .where(eq(content.title, 'Shared Test Content'));
    expect(rows).toHaveLength(1);
  });

  it('test insert is visible within the test', async () => {
    await tx.insert(content).values({
      title: 'Test-Only Content',
      status: 'draft',
      createdBy: base.actorId,
      updatedBy: base.actorId,
    });
    const rows = await tx.select().from(content)
      .where(eq(content.title, 'Test-Only Content'));
    expect(rows).toHaveLength(1);
  });

  it('previous test insert is gone (rolled back)', async () => {
    const rows = await tx.select().from(content)
      .where(eq(content.title, 'Test-Only Content'));
    expect(rows).toHaveLength(0);
  });
});
```

---

## 4. Passing `tx` to services

Services that accept a `db` parameter work directly with the test transaction:

```ts
import { generateEmbeddings } from '@/features/content/embedding/embedding-service';
import { MockEmbeddingAdapter } from '@/platform/ai/adapters/mock-embedding-adapter';

it('embeds all chunks', async () => {
  const result = await generateEmbeddings({
    contentId: testContentId,
    db: tx,  // <-- pass the test transaction
    embeddingProvider: new MockEmbeddingAdapter(),
  });
  expect(result.ok).toBe(true);
});
```

**Important:** Services that import `db` directly (older repository pattern) will NOT participate in the test transaction. They use the singleton connection pool, which cannot see uncommitted transaction data. This is correct isolation — but it means those services need refactoring to accept `db` as a parameter before they can use this pattern.

---

## 5. Neo4j test helpers

Neo4j does not support the same transaction isolation (no multi-statement transactions across test boundaries). Use explicit seed + cleanup by ID:

```ts
import { executeWrite, executeRead } from '@/platform/graph/neo4j-client';

/** Seed Neo4j dimension nodes for testing. Returns cleanup function. */
export async function seedNeo4jDimensions(dimensions: Array<{ label: string; id: string; name: string }>) {
  for (const { label, id, name } of dimensions) {
    await executeWrite(
      `MERGE (n:${label} {id: $id}) SET n.name = $name`,
      { id, name },
      () => null,
    );
  }

  return async function cleanup() {
    for (const { label, id } of dimensions) {
      await executeWrite(
        `MATCH (n:${label} {id: $id}) DETACH DELETE n`,
        { id },
        () => null,
      );
    }
  };
}
```

**Usage:**
```ts
let cleanupNeo4j: () => Promise<void>;

beforeAll(async () => {
  cleanupNeo4j = await seedNeo4jDimensions([
    { label: 'Persona', id: personaId, name: 'AR Manager' },
    { label: 'Industry', id: industryId, name: 'Logistics' },
  ]);
});

afterAll(async () => {
  await cleanupNeo4j();
});
```

Neo4j node IDs come from Postgres (UUIDs), so they're unique per test transaction — no name collision issues.

---

## 6. Gotcha: Error recovery within a test

Postgres aborts the entire transaction on any error. The `afterEach` savepoint rollback recovers for the **next** test, but within the **same** test you cannot query after an error unless you wrap the error-prone operation in its own savepoint:

```ts
it('handles constraint violation', async () => {
  await rawSql`SAVEPOINT error_guard`;
  try {
    await tx.insert(contentTypes).values({ name: 'duplicate', ... });
  } catch {
    await rawSql`ROLLBACK TO SAVEPOINT error_guard`;
  }
  // Can still query here — the inner savepoint protected us
  const rows = await tx.select().from(content).where(eq(content.id, fileContentId));
  expect(rows).toHaveLength(1);
});
```

Without the inner savepoint, Postgres returns: `current transaction is aborted, commands ignored until end of transaction block`.

---

## 7. What NOT to do

- **Manual INSERT/DELETE cleanup in afterAll** — use transaction rollback instead
- **Unique name suffixes** like `[graph-test]` — UUIDs from the transaction are unique; no collisions
- **Querying for base data in every file** — use `loadBaseData()` once
- **Using the singleton `db` in tests** — it won't see transaction data; use `tx`
- **Sharing mutable state between test files** — each file gets its own `createTestTransaction()`

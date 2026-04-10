---
name: database-design
description: >
  Principles for database patterns — SQL, NoSQL, and caching. Covers schema design,
  migrations, indexing, transactions, soft deletes, audit trails, connection management,
  and seed data.
---

# Database Design

## When to Use

Apply this skill when:

- The application persists data (schema design, table relationships)
- Choosing between SQL, NoSQL, or caching layers
- Writing or reviewing database migrations
- Adding soft deletes, audit trails, or timestamp conventions
- Configuring connection pooling or indexing strategies

## Do NOT use this skill for:

- ORM-specific API usage (Drizzle, Prisma) — use your ORM-specific skill
- File/blob storage — use **file-storage**
- Caching strategies beyond database-level — use a caching-specific skill

---

## Core Rules

### 1. Choose storage by access pattern, not by trend.

SQL for relational data, transactions, and complex queries. Document/NoSQL for
flexible schemas, high write throughput, and denormalized reads. Cache for hot
data, rate limiting, and computed values. Most applications need SQL as the
primary store.

### 2. Normalize for writes, denormalize for reads.

The canonical data model is normalized (no duplication, referential integrity).
Read-heavy views can be denormalized (materialized views, read replicas, cached
projections). Never denormalize the source of truth.

### 3. Migrations are forward-only in production.

Every migration has a rollback plan, but rollback is a new forward migration.
Never run `DROP COLUMN` without first verifying no code references it.

Zero-downtime pattern (expand-migrate-contract):

```sql
-- Step 1: EXPAND — add new column (nullable, no breaking change)
ALTER TABLE skills ADD COLUMN category_id uuid REFERENCES categories(id);

-- Step 2: MIGRATE — backfill data, deploy code that writes to both
UPDATE skills SET category_id = (SELECT id FROM categories WHERE name = skills.legacy_category);

-- Step 3: CONTRACT — after all code reads from new column, drop old
ALTER TABLE skills DROP COLUMN legacy_category;
```

### 4. Index for your queries, not your schema.

Every slow query log entry is a missing index. Every unused index is write
overhead. Composite indexes follow the query's WHERE + ORDER BY column order.
Review indexes quarterly.

### 5. Transactions protect invariants.

Use transactions when multiple writes must succeed or fail together. Keep
transactions short — never hold a transaction open across a network call or
user interaction. Choose ACID when correctness matters (payments, inventory).
Accept eventual consistency when availability matters (analytics, activity
feeds).

### 6. Soft delete by default.

Add a `deletedAt` timestamp column. Filter soft-deleted rows in all application
queries (default scope). Schedule hard deletion after the compliance window.
Hard delete immediately only when legally required.

```ts
// Schema with timestamps, soft delete, and audit fields
const skills = pgTable('skills', {
  id:        uuid('id').primaryKey().defaultRandom(),
  title:     text('title').notNull(),
  authorId:  uuid('author_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),            // soft delete
  createdBy: uuid('created_by').references(() => users.id), // audit
  updatedBy: uuid('updated_by').references(() => users.id), // audit
});
```

### 7. Audit every mutation.

An immutable audit log records: who changed what, when, the action performed,
and enough metadata to reconstruct the change. The audit table is append-only —
no updates, no deletes.

### 8. Connection pooling is mandatory.

Database connections are expensive. Use a connection pool sized to the
application's concurrency, not a fixed large number. Serverless environments
need external pooling (PgBouncer, Neon pooler) because each invocation would
otherwise open a new connection.

### 9. Seed data is deterministic and fast.

Dev seeds create a consistent, representative dataset in under 10 seconds. Test
factories produce isolated records per test. Seeds and factories never depend on
external services or network calls.

### 10. Schema is code.

Table definitions live in version control alongside the application. Schema
changes go through code review. The database is reproducible from the migration
history alone.

---

## Technology Selection

| Need | Use | Why |
|---|---|---|
| Relational data, joins, transactions | SQL (Postgres, MySQL) | ACID, mature tooling, flexible queries |
| Flexible schema, document-oriented | Document DB (Mongo, Firestore) | Schema evolution, nested data, fast reads |
| Key-value lookups, caching | Redis, Memcached | Sub-millisecond reads, TTL, atomic ops |
| Full-text search | Elasticsearch, Meilisearch | Inverted index, relevance scoring |
| Time-series data | TimescaleDB, InfluxDB | Optimized for append-heavy, time-windowed queries |
| File metadata + blob | SQL + object storage | SQL for metadata, S3/Blob for binary content |

---

## Indexing Guidelines

- Index columns in WHERE, JOIN ON, and ORDER BY clauses.
- Composite index column order: equality filters first, then range, then sort.
- Partial indexes for filtered subsets (e.g., `WHERE deletedAt IS NULL`).
- Covering indexes include all columns a query reads, avoiding table lookups.
- Monitor: if a query scans more than 10% of the table, it needs an index.
- Drop indexes that no query plan uses.

---

## Migration Strategy

1. **Add** new columns/tables (nullable or with defaults).
2. **Deploy** code that writes to both old and new.
3. **Backfill** existing data into new structure.
4. **Deploy** code that reads from new.
5. **Remove** old columns/tables in a later migration.

Never combine destructive changes (drop, rename) with the deploy that stops
using them.

---

## Banned Patterns

- ❌ Manual DDL in production → always use scripted, version-controlled migrations
- ❌ Using ORM queries without reviewing generated SQL → check query plans
- ❌ Storing file content in SQL BLOB columns → use object storage
- ❌ No connection pooling in serverless → use PgBouncer or Neon pooler
- ❌ Writing to denormalized stores as source of truth → normalize the canonical model
- ❌ `SELECT *` in application queries → select only needed columns
- ❌ Indexing every column "just in case" → each index slows writes
- ❌ Random seed data that changes between runs → use deterministic factories

---

## Quality Gate

- [ ] Primary data store is chosen based on access patterns, not defaults.
- [ ] All schema changes are versioned migrations in source control.
- [ ] Destructive migrations are separated from the deploy that changes code.
- [ ] Queries that scan large tables have appropriate indexes.
- [ ] Soft-deleted records are filtered from all default queries.
- [ ] Audit log captures who, what, when for every data mutation.
- [ ] Connection pooling is configured for the deployment environment.
- [ ] Seed data creates a consistent dataset in under 10 seconds.

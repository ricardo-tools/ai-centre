---
name: db-neon-drizzle
description: >
  Neon serverless Postgres with Drizzle ORM. Covers connection setup, schema
  definition, migration workflow, query patterns, connection pooling, Drizzle
  Studio, and seed scripts. This is the AI Centre's database stack.
  Implementation skill for the database-design conceptual skill — read that
  first for schema design principles.
---

# Database — Neon + Drizzle ORM

Implementation skill for **database-design**. Read that skill first for principles on schema design, normalization, indexing, and data integrity.

---

## When to Use

Apply this skill when:
- Using Neon serverless Postgres as the database
- Using Drizzle ORM for type-safe queries and schema management
- Deploying to serverless platforms (Vercel, Cloudflare, etc.)
- The project needs a relational database with zero connection management overhead
- Building with the AI Centre stack

Do NOT use this skill for:
- Supabase projects — see **db-supabase**
- Redis/caching layer — see **db-redis**
- MongoDB or other NoSQL databases
- Projects requiring self-hosted Postgres (Neon is managed)

---

## Core Rules

### 1. Set up the Neon connection with the serverless driver

Use `@neondatabase/serverless` with `drizzle-orm/neon-http` for serverless-friendly, HTTP-based queries. No persistent connections, no connection pool to manage.

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit
```

```typescript
// src/server/db/index.ts
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
```

Environment variable:

```
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### 2. Define schema with pgTable, typed columns, and relations

Every table is a `pgTable` call. Use Drizzle's column helpers for type safety. Define relations separately for query builder support.

```typescript
// src/server/db/schema.ts
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["admin", "member"]);
export const statusEnum = pgEnum("status", ["draft", "published", "archived"]);

// Tables
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  role: roleEnum("role").default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: uuid("author_id").notNull().references(() => users.id),
  isOfficial: boolean("is_official").default(false).notNull(),
  currentPublishedVersionId: uuid("current_published_version_id"),
  currentDraftVersionId: uuid("current_draft_version_id"),
  showcaseHtml: text("showcase_html"),
  showcaseGeneratedAt: timestamp("showcase_generated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const skillVersions = pgTable("skill_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  skillId: uuid("skill_id").notNull().references(() => skills.id),
  version: text("version").notNull(),
  content: text("content").notNull(),
  status: statusEnum("status").default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  publishedById: uuid("published_by_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations (for query builder)
export const usersRelations = relations(users, ({ many }) => ({
  skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
  author: one(users, { fields: [skills.authorId], references: [users.id] }),
  versions: many(skillVersions),
}));

export const skillVersionsRelations = relations(skillVersions, ({ one }) => ({
  skill: one(skills, { fields: [skillVersions.skillId], references: [skills.id] }),
  publishedBy: one(users, { fields: [skillVersions.publishedById], references: [users.id] }),
}));
```

### 3. Migration workflow with drizzle-kit

Configure drizzle-kit in `drizzle.config.ts`:

```typescript
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  out: "./src/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

Workflow:
1. Edit `schema.ts`
2. Run `npm run db:generate` — creates a migration SQL file
3. Review the generated SQL in `src/server/db/migrations/`
4. Run `npm run db:migrate` — applies migration to Neon
5. For rapid prototyping, use `npm run db:push` (applies schema directly, no migration file)

### 4. Query patterns — select, insert, update, delete

**Select with filters and relations:**

```typescript
import { eq, like, and, desc } from "drizzle-orm";

// Simple select
const allSkills = await db.select().from(skills);

// Filtered select
const officialSkills = await db
  .select()
  .from(skills)
  .where(eq(skills.isOfficial, true))
  .orderBy(desc(skills.createdAt));

// Select with relation (query builder)
const skillWithAuthor = await db.query.skills.findFirst({
  where: eq(skills.slug, "frontend-architecture"),
  with: {
    author: true,
    versions: {
      where: eq(skillVersions.status, "published"),
      orderBy: [desc(skillVersions.createdAt)],
      limit: 1,
    },
  },
});

// Search with LIKE
const results = await db
  .select()
  .from(skills)
  .where(like(skills.title, `%${searchTerm}%`));
```

**Insert:**

```typescript
const [newSkill] = await db
  .insert(skills)
  .values({
    slug: "my-new-skill",
    title: "My New Skill",
    description: "Description here",
    authorId: userId,
  })
  .returning();
```

**Update:**

```typescript
await db
  .update(skills)
  .set({
    title: "Updated Title",
    updatedAt: new Date(),
  })
  .where(eq(skills.id, skillId));
```

**Delete:**

```typescript
await db.delete(skills).where(eq(skills.id, skillId));
```

### 5. Joins and aggregates

```typescript
import { eq, count, sql } from "drizzle-orm";

// Inner join
const skillsWithAuthors = await db
  .select({
    skillTitle: skills.title,
    authorName: users.name,
    authorEmail: users.email,
  })
  .from(skills)
  .innerJoin(users, eq(skills.authorId, users.id));

// Count
const [{ total }] = await db
  .select({ total: count() })
  .from(skills)
  .where(eq(skills.isOfficial, true));

// Raw SQL for complex aggregates
const stats = await db.execute(
  sql`SELECT author_id, COUNT(*) as skill_count
      FROM skills
      GROUP BY author_id
      ORDER BY skill_count DESC
      LIMIT 10`
);
```

### 6. Connection pooling for serverless

Neon's serverless driver uses HTTP-based queries — no persistent connection pool needed. For high-throughput scenarios, use Neon's built-in connection pooler by adding `?pgbouncer=true` to the connection string:

```
DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
```

For WebSocket-based connections (e.g. Drizzle Studio, long-running scripts), use the standard connection string without `pgbouncer=true`.

### 7. Drizzle Studio for browsing data

Run `npm run db:studio` to open a web UI for browsing and editing data. Useful during development for:
- Inspecting table contents
- Running ad-hoc queries
- Verifying migration results
- Editing rows manually

Studio connects directly to Neon — no local database needed.

### 8. Seed script pattern

Create a seed script that runs with `tsx` for TypeScript support.

```typescript
// src/server/db/seed.ts
import { db } from "./index";
import { users, skills, skillVersions } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Seed users
  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@yourdomain.com",
      name: "Admin User",
      role: "admin",
    })
    .onConflictDoNothing({ target: users.email })
    .returning();

  // Seed skills
  if (admin) {
    await db
      .insert(skills)
      .values({
        slug: "frontend-architecture",
        title: "Frontend Architecture",
        description: "UI layer architecture patterns",
        authorId: admin.id,
        isOfficial: true,
      })
      .onConflictDoNothing({ target: skills.slug });
  }

  console.log("Seed complete");
}

seed()
  .catch(console.error)
  .finally(() => process.exit());
```

Add to `package.json`:

```json
{
  "scripts": {
    "db:seed": "tsx src/server/db/seed.ts"
  }
}
```

### 9. Environment and dev setup

| Environment | Database | Notes |
|---|---|---|
| Development | Neon free tier | One project, 0.5 GB storage, autosuspend after 5 min |
| Development (local) | Docker Postgres | `docker run -p 5432:5432 -e POSTGRES_PASSWORD=dev postgres:16` |
| Staging | Neon branch | Branch from production for isolated testing |
| Production | Neon Pro | Autoscaling, no suspend, larger storage |

For local Postgres, change `DATABASE_URL` to `postgresql://postgres:dev@localhost:5432/aicentre` and use `drizzle-orm/node-postgres` instead of `drizzle-orm/neon-http`.

### 10. Transactions

Wrap related operations in a transaction to ensure atomicity.

```typescript
import { db } from "@/server/db";

await db.transaction(async (tx) => {
  const [version] = await tx
    .insert(skillVersions)
    .values({
      skillId,
      version: "1.0.0",
      content: markdownContent,
      status: "published",
      publishedAt: new Date(),
      publishedById: userId,
    })
    .returning();

  await tx
    .update(skills)
    .set({
      currentPublishedVersionId: version.id,
      updatedAt: new Date(),
    })
    .where(eq(skills.id, skillId));
});
```

---

## Banned Patterns

- ❌ Importing `pg` or `node-postgres` in serverless deployments → use `@neondatabase/serverless` for HTTP-based queries
- ❌ Running `db:push` in production → always use `db:generate` + `db:migrate` for production migrations
- ❌ Storing the connection string in code → always use `DATABASE_URL` environment variable
- ❌ Skipping `.returning()` on insert/update when you need the result → without it, you get no data back
- ❌ Using raw SQL for simple queries → use Drizzle's query builder for type safety; reserve `sql` template for genuinely complex queries
- ❌ Creating tables without `createdAt` → every table needs at minimum a `createdAt` timestamp
- ❌ Forgetting to define relations → without them, `db.query` with `with` clauses will not work

---

## Quality Gate

Before considering Neon + Drizzle setup complete:

- [ ] Connection established via `@neondatabase/serverless` + `drizzle-orm/neon-http`
- [ ] All tables defined in `schema.ts` with proper types, defaults, and foreign keys
- [ ] Relations defined for all foreign key relationships
- [ ] `drizzle.config.ts` configured with schema path and migration output directory
- [ ] At least one migration generated and applied successfully
- [ ] Seed script populates essential data (admin user, default records)
- [ ] Drizzle Studio accessible via `npm run db:studio`
- [ ] `DATABASE_URL` stored in `.env.local`, not committed to source
- [ ] Queries use the query builder (not raw SQL) for standard CRUD
- [ ] Transactions used for multi-step mutations that must be atomic

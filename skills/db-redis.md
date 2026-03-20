---
name: db-redis
description: >
  Redis via Upstash for caching, rate limiting, session storage, and pub/sub
  in serverless environments. Covers client setup, key design, cache-aside and
  write-through patterns, sliding window rate limiting, and pub/sub. Implementation
  skill for the database-design conceptual skill (cache layer) — read that first
  for data modeling principles.
---

# Database — Redis (Upstash)

Implementation skill for **database-design**. Read that skill first for principles on data modeling and integrity. This skill covers Redis as a complementary cache and messaging layer, not a primary database.

---

## When to Use

Apply this skill when:
- Adding a caching layer to reduce database load on hot paths
- Implementing rate limiting (API endpoints, OTP requests, login attempts)
- Storing ephemeral session data that does not need durability
- Building pub/sub for real-time features (notifications, live updates)
- Managing job queues or distributed locks
- Deploying to serverless (Upstash is REST-based, no connection management)

Do NOT use this skill for:
- Primary data storage (use a relational database — see **db-neon-drizzle** or **db-supabase**)
- Full-text search (use Postgres full-text search or a dedicated search engine)
- Large binary storage (use blob storage — see **storage-vercel-blob**)

---

## Core Rules

### 1. Set up Upstash Redis client

Upstash provides a REST-based Redis client that works in serverless environments without connection management.

```bash
npm install @upstash/redis
```

```typescript
// src/lib/redis.ts
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

Environment variables:

```
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxxx...
```

### 2. Design keys with namespaces and TTL strategy

Every key follows the pattern `namespace:entity:identifier`. Never use flat, unnamespaced keys.

| Pattern | Example | TTL |
|---|---|---|
| Cache | `cache:skill:{id}` | 5-60 minutes |
| Session | `session:{sessionId}` | 7 days |
| Rate limit | `ratelimit:{ip}:{endpoint}` | 1 minute (sliding window) |
| Lock | `lock:{resource}:{id}` | 30 seconds |
| Counter | `counter:downloads:{skillId}` | No TTL (persistent) |

```typescript
// Key builders — centralize key construction
export const keys = {
  skillCache: (id: string) => `cache:skill:${id}`,
  userSession: (sessionId: string) => `session:${sessionId}`,
  rateLimit: (ip: string, endpoint: string) => `ratelimit:${ip}:${endpoint}`,
  downloadCount: (skillId: string) => `counter:downloads:${skillId}`,
};
```

### 3. Cache-aside pattern (lazy loading)

Check cache first. On miss, fetch from database, store in cache, return. This is the most common caching pattern.

```typescript
import { redis, keys } from "@/lib/redis";
import { db } from "@/server/db";
import { skills } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const SKILL_CACHE_TTL = 300; // 5 minutes

export async function getSkill(id: string) {
  const cacheKey = keys.skillCache(id);

  // 1. Check cache
  const cached = await redis.get<SkillData>(cacheKey);
  if (cached) return cached;

  // 2. Cache miss — fetch from database
  const skill = await db.query.skills.findFirst({
    where: eq(skills.id, id),
    with: { author: true },
  });

  if (!skill) return null;

  // 3. Store in cache with TTL
  await redis.set(cacheKey, skill, { ex: SKILL_CACHE_TTL });

  return skill;
}
```

### 4. Write-through pattern (eager invalidation)

On write, update the database AND the cache in the same operation. Ensures cache is always fresh after mutations.

```typescript
export async function updateSkillTitle(id: string, title: string) {
  // 1. Update database
  await db.update(skills).set({ title, updatedAt: new Date() }).where(eq(skills.id, id));

  // 2. Invalidate cache (or update it)
  const cacheKey = keys.skillCache(id);
  await redis.del(cacheKey);

  // Alternative: update cache directly (if you have the full object)
  // const updated = await db.query.skills.findFirst({ where: eq(skills.id, id) });
  // await redis.set(cacheKey, updated, { ex: SKILL_CACHE_TTL });
}
```

### 5. Rate limiting with sliding window

Use Upstash's built-in rate limiting library for a clean sliding window implementation.

```bash
npm install @upstash/ratelimit
```

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

// Allow 5 requests per 60 seconds per identifier
export const otpRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "ratelimit:otp",
});

// Allow 100 requests per 60 seconds for API endpoints
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
  prefix: "ratelimit:api",
});
```

Usage in a Server Action or API route:

```typescript
export async function requestOtp(email: string) {
  const { success, remaining, reset } = await otpRateLimit.limit(email);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return {
      error: `Too many attempts. Try again in ${retryAfter} seconds.`,
    };
  }

  // ... generate and send OTP
}
```

### 6. Session storage in Redis

Store session data in Redis for fast access. Useful when sessions contain more data than fits in a JWT.

```typescript
interface SessionData {
  userId: string;
  email: string;
  role: string;
  preferences: Record<string, unknown>;
}

export async function storeSession(sessionId: string, data: SessionData) {
  await redis.set(keys.userSession(sessionId), data, {
    ex: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSessionData(sessionId: string): Promise<SessionData | null> {
  return redis.get<SessionData>(keys.userSession(sessionId));
}

export async function destroySession(sessionId: string) {
  await redis.del(keys.userSession(sessionId));
}
```

### 7. Pub/Sub for real-time features

Use Redis pub/sub for broadcasting events between server instances. Note: Upstash pub/sub works differently from standard Redis — it uses HTTP-based polling or server-sent events.

```typescript
// Publishing an event
export async function publishEvent(channel: string, event: unknown) {
  await redis.publish(channel, JSON.stringify(event));
}

// Example: notify when a skill is published
export async function onSkillPublished(skillId: string, title: string) {
  await publishEvent("skill-events", {
    type: "skill.published",
    skillId,
    title,
    timestamp: Date.now(),
  });
}
```

For Upstash-specific real-time, consider `@upstash/qstash` for reliable message delivery with retries.

### 8. Dev mode — Upstash free tier or local Redis

| Option | Setup | Best for |
|---|---|---|
| Upstash free tier | Create account, get REST credentials | Quick start, no Docker needed |
| Local Redis | `docker run -p 6379:6379 redis:7` | Offline development, full Redis features |
| In-memory mock | Custom `Map`-based mock | Unit tests, CI |

For local Redis with the standard `ioredis` driver (not Upstash REST):

```typescript
// src/lib/redis.ts
import { Redis as UpstashRedis } from "@upstash/redis";

export const redis =
  process.env.NODE_ENV === "development" && process.env.USE_LOCAL_REDIS === "true"
    ? new UpstashRedis({ url: "http://localhost:8079", token: "" }) // local Upstash proxy
    : new UpstashRedis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });
```

### 9. Eviction policies and memory management

Upstash enforces memory limits per plan. Design for eviction:

- **Always set TTL** on cache keys. Keys without TTL accumulate indefinitely.
- **Use `ex` (seconds) or `px` (milliseconds)** on every `set` call for cache data.
- **Monitor memory** via Upstash dashboard.
- **Prefix-based cleanup:** if you need to invalidate all cache for an entity, use a pattern:

```typescript
// Invalidate all cache for a specific skill
// Note: Upstash REST doesn't support SCAN. Use explicit key tracking instead.
const relatedKeys = [
  keys.skillCache(skillId),
  `cache:skill-versions:${skillId}`,
  `cache:skill-showcase:${skillId}`,
];

await redis.del(...relatedKeys);
```

### 10. Common data structures beyond strings

Redis supports lists, sets, sorted sets, and hashes. Use them for specific patterns:

```typescript
// Sorted set — leaderboard / top downloaded skills
await redis.zadd("leaderboard:downloads", {
  score: downloadCount,
  member: skillId,
});

// Get top 10
const top10 = await redis.zrange("leaderboard:downloads", 0, 9, { rev: true });

// Hash — store structured data
await redis.hset(`user:${userId}:prefs`, {
  theme: "night",
  language: "en-AU",
  sidebar: "collapsed",
});

const theme = await redis.hget(`user:${userId}:prefs`, "theme");

// List — recent activity feed
await redis.lpush(`feed:${userId}`, JSON.stringify({ action: "published", skillId }));
await redis.ltrim(`feed:${userId}`, 0, 49); // Keep only last 50 items
```

---

## Banned Patterns

- ❌ Using Redis as the primary database → use it for caching, rate limiting, and ephemeral data only; Redis is volatile
- ❌ Keys without TTL for cache data → every cache key must expire
- ❌ Flat, unnamespaced keys like `"skill123"` → always use `namespace:entity:id` format
- ❌ Storing large objects (>1 MB) in Redis → store a reference (URL, database ID) instead
- ❌ Using `KEYS *` or `SCAN` in production for cleanup → track keys explicitly or use TTL
- ❌ Caching everything → cache only hot paths where database latency matters; premature caching adds complexity without benefit
- ❌ Ignoring cache invalidation → every write path that affects cached data must invalidate or update the cache

---

## Quality Gate

Before considering Redis integration complete:

- [ ] Upstash client configured with REST URL and token from environment variables
- [ ] Key naming follows `namespace:entity:id` convention
- [ ] Every cache key has a TTL set
- [ ] Cache-aside pattern implemented for read-heavy paths
- [ ] Write paths invalidate or update affected cache keys
- [ ] Rate limiting in place for sensitive endpoints (OTP, login, API)
- [ ] Dev mode works with Upstash free tier or local Redis
- [ ] No large objects stored in Redis (cache references, not blobs)
- [ ] Memory usage monitored via Upstash dashboard
- [ ] Cache miss path gracefully falls back to database

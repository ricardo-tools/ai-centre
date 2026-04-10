'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre
    style={{
      fontSize: 12,
      fontFamily: 'monospace',
      lineHeight: 1.8,
      padding: 16,
      borderRadius: 6,
      background: 'var(--color-bg-alt)',
      border: '1px solid var(--color-border)',
      overflow: 'auto',
    }}
  >
    {children}
  </pre>
);

/* ---- data ---- */

const cacheAsideSteps = [
  { step: 'Request arrives', detail: 'getSkill(id) called by the application', color: 'var(--color-text-muted)' },
  { step: 'Check Redis', detail: 'redis.get(cache:skill:{id}) — sub-millisecond lookup', color: 'var(--color-primary)' },
  { step: 'Cache HIT', detail: 'Return cached data immediately, skip database', color: 'var(--color-primary)' },
  { step: 'Cache MISS', detail: 'Fetch from Postgres via Drizzle ORM', color: 'var(--color-warning)' },
  { step: 'Store in Redis', detail: 'redis.set(key, data, { ex: 300 }) — 5 min TTL', color: 'var(--color-primary)' },
  { step: 'Return result', detail: 'Next request will hit cache instead of DB', color: 'var(--color-text-muted)' },
];

const rateLimitConfig = [
  { endpoint: 'OTP request', limit: '5 per 60s', prefix: 'ratelimit:otp', identifier: 'Email address', severity: 'Critical' },
  { endpoint: 'Login attempt', limit: '10 per 60s', prefix: 'ratelimit:login', identifier: 'IP address', severity: 'Critical' },
  { endpoint: 'API endpoint', limit: '100 per 60s', prefix: 'ratelimit:api', identifier: 'API key', severity: 'High' },
  { endpoint: 'File upload', limit: '10 per 60s', prefix: 'ratelimit:upload', identifier: 'User ID', severity: 'Medium' },
  { endpoint: 'Search', limit: '30 per 60s', prefix: 'ratelimit:search', identifier: 'Session ID', severity: 'Medium' },
];

const keyNamespaces = [
  { pattern: 'cache:skill:{id}', ttl: '5-60 min', purpose: 'Cached skill data' },
  { pattern: 'session:{sessionId}', ttl: '7 days', purpose: 'User session data' },
  { pattern: 'ratelimit:{ip}:{endpoint}', ttl: '1 min (sliding)', purpose: 'Rate limit counters' },
  { pattern: 'lock:{resource}:{id}', ttl: '30 sec', purpose: 'Distributed locks' },
  { pattern: 'counter:downloads:{skillId}', ttl: 'Persistent', purpose: 'Download counters' },
];

const pubSubChannels = [
  { channel: 'skill-events', events: 'skill.published, skill.updated, skill.deleted', consumers: 'Real-time feed, notifications' },
  { channel: 'user-events', events: 'user.joined, user.role-changed', consumers: 'Admin dashboard, audit log' },
  { channel: 'system-events', events: 'deploy.complete, cache.flush', consumers: 'Monitoring, alerting' },
];

const dataStructures = [
  { type: 'String', use: 'Cache, sessions, config', ops: 'GET, SET, INCR', example: 'cache:skill:{id}' },
  { type: 'Hash', use: 'Structured objects, prefs', ops: 'HSET, HGET, HGETALL', example: 'user:{id}:prefs' },
  { type: 'List', use: 'Activity feeds, queues', ops: 'LPUSH, LTRIM, LRANGE', example: 'feed:{userId}' },
  { type: 'Sorted Set', use: 'Leaderboards, rankings', ops: 'ZADD, ZRANGE, ZRANK', example: 'leaderboard:downloads' },
  { type: 'Set', use: 'Tags, unique collections', ops: 'SADD, SMEMBERS, SINTER', example: 'tags:{skillId}' },
];

export function DbRedisShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Read <strong>database-design</strong> first for data modeling principles.
          Redis is a complementary cache and messaging layer, not a primary database. Use with{' '}
          <strong>db-neon-drizzle</strong> or <strong>db-supabase</strong> as the primary store.
        </p>
      </div>

      {/* ---- Cache-Aside Pattern ---- */}
      <Section title="Cache-Aside Pattern (Lazy Loading)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Check cache first. On miss, fetch from database, store in cache, return. The most common caching pattern.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {cacheAsideSteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                borderRadius: 8,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                borderLeftWidth: 6,
                borderLeftColor: s.color,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: s.color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cache-Aside Read</h4>
            <CodeBlock>{`async function getSkill(id: string) {
  const cacheKey = keys.skillCache(id);

  // 1. Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  // 2. Cache miss — fetch from DB
  const skill = await db.query.skills.findFirst({
    where: eq(skills.id, id),
  });

  // 3. Store in cache with TTL
  if (skill) {
    await redis.set(cacheKey, skill, { ex: 300 });
  }
  return skill;
}`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-warning)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Write-Through Invalidation</h4>
            <CodeBlock>{`async function updateSkill(id: string, data) {
  // 1. Update database
  await db.update(skills)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(skills.id, id));

  // 2. Invalidate cache
  const cacheKey = keys.skillCache(id);
  await redis.del(cacheKey);

  // Next read will repopulate cache
  // from fresh database data
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Rate Limiting Flow ---- */}
      <Section title="Rate Limiting (Sliding Window)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Upstash provides a built-in sliding window rate limiter. Protect sensitive endpoints from abuse.
        </p>
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 120px 1fr 120px 80px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Endpoint</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Limit</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Redis Key Prefix</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Identifier</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Severity</span>
          </div>
          {rateLimitConfig.map((item, i) => (
            <div
              key={item.endpoint}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 120px 1fr 120px 80px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)' }}>{item.endpoint}</span>
              <span style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'monospace' }}>{item.limit}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{item.prefix}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.identifier}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: item.severity === 'Critical' ? 'var(--color-primary)' : item.severity === 'High' ? 'var(--color-warning)' : 'var(--color-text-muted)',
                  color: '#FFFFFF',
                }}
              >
                {item.severity}
              </span>
            </div>
          ))}
        </div>
        <CodeBlock>{`import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

export const otpRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "ratelimit:otp",
});

// Usage in Server Action
const { success, remaining, reset } = await otpRateLimit.limit(email);
if (!success) {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return { error: \`Try again in \${retryAfter}s\` };
}`}</CodeBlock>
      </Section>

      {/* ---- Session Storage ---- */}
      <Section title="Session Storage">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Store session data in Redis for fast access. Useful when sessions carry more data than fits in a JWT.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Design</h4>
            <div
              style={{
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
              }}
            >
              {keyNamespaces.map((k, i) => (
                <div
                  key={k.pattern}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px',
                    padding: '10px 14px',
                    background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <code style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>{k.pattern}</code>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{k.purpose}</div>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'right', fontFamily: 'monospace' }}>{k.ttl}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-warning)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Session API</h4>
            <CodeBlock>{`interface SessionData {
  userId: string;
  email: string;
  role: string;
  preferences: Record<string, unknown>;
}

async function storeSession(
  sessionId: string, data: SessionData
) {
  await redis.set(
    keys.userSession(sessionId),
    data,
    { ex: 60 * 60 * 24 * 7 } // 7 days
  );
}

async function destroySession(id: string) {
  await redis.del(keys.userSession(id));
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Pub/Sub Diagram ---- */}
      <Section title="Pub/Sub Messaging">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Redis pub/sub broadcasts events between server instances. Use for real-time features and event-driven workflows.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          {pubSubChannels.map((ch) => (
            <div
              key={ch.channel}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>
                <code style={{ fontSize: 13, color: 'var(--color-primary)' }}>{ch.channel}</code>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Events</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{ch.events}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Consumers</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{ch.consumers}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Data Structures ---- */}
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 16 }}>Redis Data Structures</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 12 }}>
          {dataStructures.map((ds) => (
            <div
              key={ds.type}
              style={{
                padding: 14,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid var(--color-primary)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 6 }}>{ds.type}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 4 }}>{ds.use}</div>
              <code style={{ fontSize: 10, color: 'var(--color-text-muted)', display: 'block', marginBottom: 4 }}>{ds.ops}</code>
              <code
                style={{
                  fontSize: 10,
                  padding: '3px 6px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  color: 'var(--color-primary)',
                  display: 'inline-block',
                }}
              >
                {ds.example}
              </code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Redis Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Setup & Keys',
              checks: [
                'Upstash client configured with REST URL and token',
                'Key naming follows namespace:entity:id convention',
                'Every cache key has a TTL set',
                'No large objects stored (cache references, not blobs)',
              ],
            },
            {
              category: 'Patterns & Safety',
              checks: [
                'Cache-aside pattern for read-heavy paths',
                'Write paths invalidate affected cache keys',
                'Rate limiting on sensitive endpoints',
                'Cache miss gracefully falls back to database',
              ],
            },
          ].map((group) => (
            <div key={group.category}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.category}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.checks.map((check) => (
                  <div
                    key={check}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

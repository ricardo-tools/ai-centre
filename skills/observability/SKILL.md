---
name: observability
description: >
  Post-launch quality — error tracking, structured logging, real user monitoring,
  uptime, alerting, and AI feature monitoring. Apply when instrumenting an
  application for production, setting up error tracking, adding logging, configuring
  alerts, or diagnosing production issues. The quality you can't see is the quality
  that degrades.
---

# Observability

Instrument your application so you know when it's broken, what's slow, and which features users hit — for pre-deploy quality, see **verification-loop** and **flow-tdd**.

---

## When to Use

Apply this skill when:
- Setting up a new application for production
- Adding error tracking or logging to an existing app
- Configuring alerts and monitoring
- Diagnosing production issues (errors, performance, outages)
- Monitoring AI feature costs and quality
- Reviewing whether observability coverage has gaps

Do NOT use this skill for:
- Pre-deploy testing and verification — see **flow-tdd**, **verification-loop**
- AI output quality evaluation — see **eval-driven-development**
- Security monitoring specifics — see **security-review**

---

## Core Rules

### 1. Error tracking from day 1

Before your first real user, error tracking must be live. Everything else can come later. A user hitting an untracked error is a quality failure you can't learn from.

### 2. Structured logs, not string messages

Log JSON objects with queryable fields, not prose sentences. "Show me all project generations that took over 5 seconds" is trivial with structured logs, impossible with text.

```ts
// ✅ Structured — queryable
logger.info({ userId, projectId, durationMs: 2300, skillCount: 4 }, 'project_generated');

// ❌ Unstructured — can only grep
console.log(`User ${userId} generated project ${projectId} in 2300ms`);
```

### 3. Alert on symptoms, not causes

Alert on "error rate above 2% for 5 minutes" — not on every individual error. One user hitting a bug 50 times shouldn't page anyone. Every alert must require a human action. If the correct response is "do nothing," the alert should not exist.

### 4. Every request gets a correlation ID

A unique ID follows a request through every layer — middleware, server component, data fetch, external call, database query. When something fails, search by correlation ID and see the full story.

```ts
// In middleware
const requestId = crypto.randomUUID();
requestHeaders.set('x-request-id', requestId);

// In every log line
logger.info({ requestId, userId, action: 'publish_skill' }, 'action_started');
```

### 5. Never log secrets, always log context

Never: passwords, tokens, API keys, credit card numbers, full request bodies. Always: user IDs (not emails in high-volume logs), request IDs, action names, durations, status codes, error types.

### 6. Graduate observability with complexity

Don't over-instrument on day 1. Start with error tracking and structured logs. Add performance monitoring when you have users. Add tracing when logs alone can't explain latency. Add session replay when you can't reproduce user-reported bugs.

---

## Error Tracking

### Setup (Sentry)

Sentry is the default. Non-negotiable setup:

- **Source maps** uploaded at build time, tied to a release. Without them, production errors are unreadable.
- **Release tracking** via git SHA. Answers: "Did this error start with the last deploy?"
- **User context** on every error. Transforms "some user got an error" into "Sarah got this error 3 times today."
- **Environment tags** (production, staging, preview).

```ts
// Attach user context after authentication
Sentry.setUser({ id: session.userId, email: session.email });
```

### React Error Boundaries

Place error boundaries at **feature boundaries**, not just the app root. If the skill showcase widget crashes, the rest of the page should still work.

Next.js `error.tsx` files are error boundaries per route segment — use them for every route that fetches data. Sentry auto-captures these errors if `@sentry/nextjs` is configured.

### Server-Side Errors

Server Actions and API routes need explicit error capture with context:

```ts
try {
  const result = await publishSkillUseCase(skillId, userId);
  return { success: true, data: result.value };
} catch (error) {
  Sentry.captureException(error, {
    tags: { action: 'publishSkill', skillId },
    user: { id: userId },
  });
  return { success: false, error: 'Something went wrong' };
}
```

**Middleware errors** run on the edge runtime — verify that your Sentry configuration captures them (use `instrumentation.ts` with edge-specific init).

### Noise Reduction

- **Ignore known third-party errors** (browser extensions, crawlers, bots)
- **Group errors** by root cause, not by stack trace variation — use custom fingerprinting when Sentry's defaults produce too many groups for the same bug
- **Set severity levels** — a styling glitch and a data loss bug should not have the same urgency
- **Resolve and regress** — mark errors as resolved after fixing. If they recur, Sentry re-opens them automatically.

---

## Structured Logging

### Log Levels

| Level | When | Example |
|---|---|---|
| **error** | Something failed and needs attention | Database connection failed, external API 500 |
| **warn** | Unexpected but handled | Rate limit approaching, fallback triggered |
| **info** | Normal business operations worth recording | User login, project generated, skill published |
| **debug** | Detailed diagnostics (dev only) | Query parameters, intermediate results |

Production runs at `info`. Enable `debug` temporarily during incident investigation.

### What to Log

**Always:** Request start/end with duration, auth events, business-critical operations (publish, generate, delete), external service calls with duration and status, errors with full context.

**Never:** Passwords, tokens, API keys, full request bodies, PII beyond user IDs, health check requests.

### Logger Setup

```ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
});

// Usage
logger.info({ requestId, userId, skillId, durationMs }, 'skill_published');
logger.error({ requestId, error: err.message, stack: err.stack }, 'publish_failed');
```

Use `pino` — fast, JSON by default, low overhead. Logs go to stdout, Vercel captures them. Add a log drain (Axiom) for retention and querying beyond Vercel's short window.

---

## Real User Monitoring

### Web Vitals in Production

Lab metrics (Lighthouse) simulate. RUM measures what real users experience.

```tsx
// In root layout — Vercel Speed Insights (lowest friction)
import { SpeedInsights } from '@vercel/speed-insights/next';
<SpeedInsights />
```

Or collect manually with `web-vitals`:

```ts
import { onLCP, onINP, onCLS } from 'web-vitals';

function report(metric: Metric) {
  logger.info({
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    path: window.location.pathname,
  }, 'web_vital');
}

onLCP(report);
onINP(report);
onCLS(report);
```

### Performance Budgets

Set thresholds and treat violations as bugs:
- LCP: ≤ 2.5s (p75)
- INP: ≤ 200ms (p75)
- CLS: ≤ 0.1 (p75)
- First-load JS: ≤ 200KB gzipped

---

## Uptime Monitoring

### Synthetic Checks

Ping your app from external locations on a schedule. Minimum monitors:
1. Homepage (proves the app loads)
2. Health check endpoint (proves the server works)
3. One critical user-facing page

### Health Check Endpoint

```ts
// app/api/health/route.ts
export async function GET() {
  const checks: Record<string, 'ok' | 'error'> = {};

  try {
    await db.execute(sql`SELECT 1`);
    checks.database = 'ok';
  } catch {
    checks.database = 'error';
  }

  const healthy = Object.values(checks).every(v => v === 'ok');
  return Response.json(
    { status: healthy ? 'healthy' : 'degraded', checks },
    { status: healthy ? 200 : 503 }
  );
}
```

Only check dependencies that would prevent the app from working. If analytics is down, your app still works — don't fail the health check for it.

---

## AI Feature Monitoring

### Token Usage and Cost

Every AI call logs:

```ts
logger.info({
  model: 'claude-sonnet-4-6',
  inputTokens: response.usage.input_tokens,
  outputTokens: response.usage.output_tokens,
  feature: 'showcase_generation',
  userId,
  durationMs,
}, 'ai_call_completed');
```

Dashboard: daily/weekly cost by feature, cost per user, cost trend, token distribution. A bug that causes retry loops runs up a bill fast — you need to see it.

### Latency and Rate Limits

Track p50/p75/p95 latency for AI calls over time. Log rate limit response headers. Alert at 80% of your limit — by the time you're rate-limited, users are already affected.

### Quality in Production

Start simple:
1. **Automated checks** — after generating, validate structure (valid HTML? non-empty? expected sections?)
2. **User feedback** — thumbs up/down on AI-generated content
3. **Sampling** — periodically review random AI outputs for quality

Feed production failures back into your eval dataset (see **eval-driven-development**).

---

## Alerting

### What to Alert On (requires human action)

- Error rate exceeds threshold for sustained period
- Health check fails
- Zero successful requests (app is completely down)
- Security events (auth failure spike)
- AI API rate limit approaching 80%

### What to Dashboard Only (no immediate action)

- Individual error occurrences
- Performance metrics (latency, web vitals)
- Traffic patterns
- AI API costs (unless approaching a hard limit)
- Resource utilisation

### Alert Hygiene

- Every alert links to a runbook (what to check, common causes, escalation path)
- Alert on rate of change, not just absolute values — a jump from 0.1% to 2% is more alarming than a steady 2%
- Review alerts monthly — delete any that haven't required action
- For a small team: Slack webhooks from Sentry + uptime monitoring. No PagerDuty needed until you have on-call rotations.

---

## The Stack (Graduated)

### Day 1 (before first users)

| Need | Tool | Cost |
|---|---|---|
| Error tracking | Sentry (free: 5K events/month) | $0 |
| Uptime | BetterStack or UptimeRobot free tier | $0 |
| Structured logging | pino to stdout, Vercel log viewer | $0 |

### Week 2 (with real traffic)

| Need | Tool |
|---|---|
| Web Vitals | Vercel Speed Insights |
| Log retention | Axiom via Vercel log drain (free: 500GB/month) |
| Sentry enhancements | Source maps, releases, user context |
| AI monitoring | Structured logs for token usage and latency |

### Month 2+ (when you feel the pain)

| Need | Tool | Add when... |
|---|---|---|
| Analytics + replay | PostHog | Users report bugs you can't reproduce |
| Tracing | OpenTelemetry + Axiom | Logs alone can't explain latency |
| Alerting | Sentry + BetterStack → Slack | You need to know problems without checking dashboards |
| Browser checks | Checkly | Critical user flows must be verified automatically |

---

## Next.js Specifics

### `instrumentation.ts`

The canonical place to initialise server-side SDKs:

```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./src/lib/sentry.server');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./src/lib/sentry.edge');
  }
}
```

Sentry's `@sentry/nextjs` generates this automatically during setup.

### Server Components and Actions

Server Components blur frontend and backend — an error could be data or rendering. Ensure error tracking captures both server context (what data, what failed) and client impact (what the user saw).

Server Action errors don't always trigger client error boundaries. Handle errors explicitly and surface useful information to both users and error tracking.

---

## Banned Patterns

- ❌ Deploying to production without error tracking → Sentry from day 1
- ❌ `console.log` as the logging strategy → structured JSON logger (pino)
- ❌ Alerting on every individual error event → alert on rates and sustained thresholds
- ❌ Logging passwords, tokens, API keys, or PII → log IDs and event types, not sensitive data
- ❌ Unstructured log strings → JSON with queryable fields
- ❌ Missing correlation IDs → every request gets a unique ID propagated through all layers
- ❌ Health checks that verify non-critical dependencies → only check what would prevent the app from working
- ❌ Alerts without runbooks → every alert links to what to check and how to fix
- ❌ Ignoring AI API costs → log token usage per call, track cost per feature
- ❌ Full OpenTelemetry on day 1 → graduate observability with complexity

---

## Quality Gate

Before deploying to production, verify:

- [ ] Error tracking (Sentry) is live with source maps, releases, and user context
- [ ] Structured logger outputs JSON with request IDs, user IDs, and durations
- [ ] Correlation ID generated in middleware and included in all log lines
- [ ] Health check endpoint exists and verifies critical dependencies only
- [ ] Uptime monitor pings the health check endpoint
- [ ] No passwords, tokens, or PII in log output
- [ ] Web Vitals collection is active (Vercel Speed Insights or `web-vitals`)
- [ ] AI calls log model, token counts, duration, and feature name
- [ ] Alerts configured for error rate threshold and health check failure
- [ ] Alerts route to Slack (or appropriate channel) with runbook links
- [ ] `instrumentation.ts` initialises SDKs for both Node and Edge runtimes

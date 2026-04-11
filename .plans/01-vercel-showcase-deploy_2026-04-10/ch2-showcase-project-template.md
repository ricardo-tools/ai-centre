# Chapter 2: Showcase Project Template

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapter 0
**User can:** Visit a deployment URL directly and get blocked by middleware. Visit via iframe from the allowed origin and see the page load.

## Goal

Create the template files that get injected into every showcase deployment: Edge Middleware (JWT validation) and dynamic CSP headers. Document the one-time Vercel project setup. Done when: a test deployment with the template rejects direct browser access and allows iframe access from the allowed origin.

---

## Development Methodology

One chapter = one concern. The chapter's "User can" line is the spec.

```
FOR EACH CHAPTER:

  1. TEST    Write failing tests for what "User can" describes.
             Extend journey test with this chapter's increment.
             Impact table for existing tests (keep/update/new/remove).
             No production code. Ref: flow-tdd skill.
  --------
  GATE 1    Verify:
            [] Impact table present (keep/update/new/remove)
            [] Every layer has a test file
            [] Journey test extended with this chapter's assertions
            [] Tests FAIL

  2. BUILD   Minimum production code + polish.
             Follow the mockups, state spec, and guidelines in this chapter.
             Every code path must log (start, complete, error). Ref: flow-observability skill.
             Code must be small, composable, type-safe. Ref: coding-standards skill.
  --------
  GATE 2    Verify:
            [] Every critical file from this chapter exists
            [] Polish criteria met
            [] Structured logging on every server action and data path

  3. EVAL    Runtime: pages render, APIs respond, no error logs, DB correct.
             Ref: flow-eval-driven skill.
             Fail -> fix and re-eval.

  4. RUN     Run chapter tests + full vitest suite + tsc + build.
             Fail -> fix and re-run.
  --------
  GATE 3    Verify:
            [] All chapter tests GREEN
            [] No regressions

  5. AUDIT   Proportional to what changed (see Audit Scope below).
             Fail -> fix and re-run from step 4.

  6. LOG     Update LOG.md + plan.md status.

COMPACT at every 10 dispatches or phase boundary.
Checkpoint -> .claude/.strategic-context/ -> compact -> re-read plan.
```

### Polish & UX (apply to all work in every chapter)

- Feedback is instant — every action gets visible response within 100ms
- Every state change is animated — enter, leave, move, status change
- Every action gets motion feedback — the user never wonders "did that work?"
- Errors are helpful — show what went wrong, keep the user's work, suggest next step
- Empty states guide — icon + text + action button
- Visual hierarchy — primary (what they're acting on), secondary (metadata), tertiary (system info)
- Microcopy is short — labels are noun phrases, confirmations name the action, errors name the problem

---

## Responsive & Layout

No UI in this chapter — the template files are injected into deployed projects, not into our app.

---

## Widget Decomposition

No widgets.

---

## ASCII Mockup

N/A — no UI in our app. The middleware runs inside deployed showcase projects.

---

## State Spec

N/A — no client state.

---

## Data Flow

```
Browser requests deployed showcase URL
  -> Edge Middleware (middleware.ts in deployed project)
      1. Read ?token= query param
      2. If no token: return 403 with "Access denied" page
      3. Verify JWT using JWT_SECRET env var (jose library)
      4. If invalid/expired: return 403
      5. If valid: set Content-Security-Policy header with frame-ancestors from ALLOWED_ORIGINS
      6. Continue to Next.js page

Template files stored as string constants in:
  src/platform/lib/showcase-template.ts
    getTemplateFiles(): Record<string, string>
    Returns:
      'middleware.ts' — JWT validation + CSP headers
      'vercel.json' — minimal config (framework: nextjs)
```

---

## Edge Cases

- Token missing from URL — return 403 with clear message ("This preview is only available within AI Centre")
- Token expired (>5 min old) — return 403
- Token signed with wrong secret — return 403
- `ALLOWED_ORIGINS` not set — default to empty (block all iframe embedding)
- `JWT_SECRET` not set — block all requests (fail closed)
- Request for static assets (`_next/static/*`) — middleware matcher should skip these (they're useless without the HTML shell)

---

## Focus Management

N/A — no UI in our app.

---

## Must Use

| Pattern | File to read |
|---|---|
| JWT handling | `src/platform/lib/auth.ts` (for jose patterns) |
| Deploy module | `src/platform/lib/vercel-deploy.ts` (from Ch 0) |

---

## Wrong Paths

1. **Don't put secrets in vercel.json** — `JWT_SECRET` and `ALLOWED_ORIGINS` are env vars set in the Vercel dashboard, not in deployed files.
2. **Don't use static frame-ancestors in vercel.json** — must be dynamic from env var so it differs between Production (prod domain) and Development (localhost).
3. **Don't validate on every static asset** — matcher should skip `_next/static`, `_next/image`, `favicon.ico`. The HTML pages are the security boundary.
4. **Don't use a heavy JWT library** — `jose` is already a dependency and works in Edge Runtime.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test middleware logic in isolation |
| **coding-standards** | Step 2 | Template files must be clean, minimal |
| **flow-observability** | Step 2 | Middleware logs blocked requests |
| **security-review** | Step 2 | JWT validation, CSP headers, fail-closed |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No UI elements in our app |

- Unit test the middleware logic: valid token -> pass, invalid -> 403, expired -> 403, missing -> 403
- Unit test `getTemplateFiles()` returns expected file map
- Integration: deploy a test project with template, verify direct access blocked

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/lib/showcase-template.ts` | NEW: template file contents as string constants |
| `docs/SHOWCASE_DEPLOY_SETUP.md` | NEW: one-time Vercel project setup instructions |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- Then the deployment includes middleware that validates JWT tokens
- And the deployment sets frame-ancestors dynamically from ALLOWED_ORIGINS

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Template files — minimal, correct |
| Accessibility | No | No UI in our app |
| Security | Yes | JWT validation logic, CSP header correctness, fail-closed behavior |
| Observability | Yes | Middleware logs blocked requests |

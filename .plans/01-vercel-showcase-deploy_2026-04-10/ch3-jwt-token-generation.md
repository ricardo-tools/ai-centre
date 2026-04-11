# Chapter 3: JWT Token Generation

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapter 0
**User can:** Call a utility function and get back a deploy URL with a signed `?token=` param that the middleware from Ch 2 would accept.

## Goal

Build the token generation utility used by the main app to create signed iframe URLs. Done when: `signShowcaseUrl(deployUrl)` returns a URL with a valid, short-lived JWT that matches the verification logic in Ch 2's middleware template.

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

No UI — server-side utility only.

---

## Widget Decomposition

No widgets.

---

## ASCII Mockup

N/A — no UI.

---

## State Spec

N/A — no client state.

---

## Data Flow

```
signShowcaseUrl(deployUrl):
  input: { deployUrl: string }
  return: string (URL with ?token=...)
  internally:
    1. Read SHOWCASE_JWT_SECRET from env (shared with showcase project)
    2. Create JWT with jose:
       - payload: { url: deployUrl }
       - expiry: 5 minutes
       - algorithm: HS256
    3. Append ?token={jwt} to deployUrl
    4. Return signed URL

Note: This runs server-side in the viewer page or action.
The token is generated fresh each time the viewer loads.
```

---

## Edge Cases

- `SHOWCASE_JWT_SECRET` not set — throw clear error at call time
- Deploy URL is null (showcase not yet deployed) — caller handles this, not the token utility
- URL already has query params — use `URL` object to append correctly, not string concat
- Very long URLs — JWT adds ~200 chars, well within URL limits

---

## Focus Management

N/A — no UI.

---

## Must Use

| Pattern | File to read |
|---|---|
| jose JWT library | `src/platform/lib/auth.ts` (existing jose usage) |

---

## Wrong Paths

1. **Don't use `AUTH_SECRET` for showcase tokens** — use a separate `SHOWCASE_JWT_SECRET` shared between the main app and the showcase Vercel project. Keeps the auth domains separate.
2. **Don't generate tokens on the client** — tokens are generated server-side only. The secret never reaches the browser.
3. **Don't use long token expiry** — 5 minutes is enough for the iframe to load. Shorter = less risk if a URL leaks.
4. **Don't concatenate URL strings** — use the `URL` class to handle query params correctly.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test token generation + verification roundtrip |
| **coding-standards** | Step 2 | Small, typed utility function |
| **security-review** | Step 2 | JWT best practices, short expiry, separate secret |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No UI |

- Test: `signShowcaseUrl` returns a URL with a `token` query param
- Test: the token is a valid JWT that can be verified with the same secret
- Test: the token expires after 5 minutes (mock time)
- Test: throws if `SHOWCASE_JWT_SECRET` is not set
- Test roundtrip with Ch 2's verification logic

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/lib/showcase-token.ts` | NEW: signShowcaseUrl utility |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-showcase-deploy.spec.ts`

This chapter adds:
- Then the main app generates signed URLs with short-lived JWT tokens

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | `showcase-token.ts` — clean, typed |
| Accessibility | No | No UI |
| Security | Yes | JWT creation — algorithm, expiry, secret separation |
| Observability | No | No server actions, just a utility |

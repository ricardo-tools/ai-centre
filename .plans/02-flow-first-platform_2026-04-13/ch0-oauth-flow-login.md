# Chapter 0: OAuth Flow Login

**Status:** Not started
**Tier:** Foundation
**Depends on:** None
**User can:** Run `flow-login` in Claude Code, a browser opens to the authorize page, they approve, and a token is saved to `.flow/credentials.json`. `flow-logout` clears it.

## Goal

Build the OAuth PKCE infrastructure and the Flow login/logout commands. Server-side: OAuth endpoints for authorize, callback, token exchange. Client-side (Flow skill): local HTTP server on random port, browser open, callback handler, token storage. After this chapter, any user can authenticate from their editor and subsequent chapters can make authenticated API calls.

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

No UI in this chapter — the authorize page reuses the existing OTP login flow. Server-side OAuth endpoints + CLI-side skill commands only.

---

## Widget Decomposition

No widgets in this chapter.

---

## ASCII Mockup

N/A — no new UI. The authorize page reuses the existing OTP login page.

---

## State Spec

N/A — no client state changes. Token state lives in `.flow/credentials.json` on the user's machine.

---

## Data Flow

```
flow-login command (in user's editor):
  1. Generate PKCE code_verifier + code_challenge
  2. Start local HTTP server on random port (e.g. 9274)
  3. Open browser: {AI_CENTRE_URL}/api/auth/authorize?
       response_type=code&
       code_challenge={challenge}&
       code_challenge_method=S256&
       redirect_uri=http://localhost:{port}/callback&
       state={random}
  4. Server shows login page (reuse existing OTP flow)
  5. On successful auth, server redirects to localhost:{port}/callback?code={code}&state={state}
  6. Local server receives callback, exchanges code for token:
       POST {AI_CENTRE_URL}/api/auth/token
       { grant_type: 'authorization_code', code, code_verifier, redirect_uri }
  7. Server validates code + PKCE verifier, returns { access_token, refresh_token, expires_in }
  8. Flow stores tokens in .flow/credentials.json
  9. Local server shuts down

flow-logout command:
  1. Read .flow/credentials.json
  2. Call POST {AI_CENTRE_URL}/api/auth/revoke { token: refresh_token }
  3. Delete .flow/credentials.json
```

**Flow skill reference files (`skills/flow/references/`):**

The OAuth client code lives as reference files inside the Flow skill directory, following the standard skill reference pattern (like `flow-planning/references/park-template.md`). These are markdown files with concrete, copy-paste TypeScript code blocks. The agent reads them and writes the code to the user's project — it does NOT generate this logic from scratch.

| Ref file | Purpose |
|---|---|
| `skills/flow/references/auth-client.md` | `authenticatedFetch` wrapper, token refresh logic, credentials read/write. Code the agent copies to `.flow/lib/auth.ts` in the user's project. |
| `skills/flow/references/login-client.md` | PKCE generation, local HTTP server, browser open, code exchange. Code for `.flow/lib/login.ts`. |
| `skills/flow/references/logout-client.md` | Token revocation, credentials cleanup. Code for `.flow/lib/logout.ts`. |

Each ref file has `type: reference` and `companion_to: flow` frontmatter. The Flow skill's `flow-login`, `flow-logout`, and `flow-bootstrap` commands reference these files. When skills are updated (Ch 7), these ref files update too — users get the latest auth client code.

**Server endpoints:**

- `GET /api/auth/authorize` — Shows login UI with OTP, stores PKCE challenge in session
- `POST /api/auth/token` — Exchanges code+verifier for access/refresh tokens. Also handles `grant_type: 'refresh_token'`.
- `POST /api/auth/revoke` — Invalidates refresh token

**Token lifetimes:**

| Token | Lifetime | Stored where |
|---|---|---|
| Authorization code | 5 minutes | `oauth_codes` table (server) |
| Access token | 1 hour | `.flow/credentials.json` (client) + hash in `oauth_tokens` (server) |
| Refresh token | 30 days | `.flow/credentials.json` (client) + hash in `oauth_tokens` (server) |

**Auto-refresh flow (transparent to user):**
Every Flow command that calls the API uses a shared `authenticatedFetch` wrapper:
1. Read access_token from `.flow/credentials.json`
2. Check `expires_at` — if expired (or within 60s of expiry), refresh first
3. Refresh: `POST /api/auth/token { grant_type: 'refresh_token', refresh_token }`
4. Server validates refresh token, issues new access_token (1h) + rotates refresh_token (30d)
5. Update `.flow/credentials.json` with new tokens
6. Proceed with original API call
7. If refresh fails (revoked, expired) → clear credentials, prompt: "Session expired. Run flow-login to re-authenticate."

**`.flow/credentials.json` format:**
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_at": "2026-04-13T05:00:00Z",
  "ai_centre_url": "https://ai.ezycollect.tools"
}
```

**DB:** New `oauth_tokens` table: id, user_id, access_token_hash, refresh_token_hash, expires_at, revoked_at, created_at. New `oauth_codes` table: id, user_id, code_hash, code_challenge, redirect_uri, expires_at, used_at, created_at.

---

## Edge Cases

- User closes browser before completing auth — local server times out after 120s, shows error
- Port already in use — try next port (up to 5 attempts)
- Token expired — flow commands auto-refresh using refresh_token before failing
- No internet — clear error message, don't corrupt credentials file
- `.flow/credentials.json` manually deleted — next command prompts re-login
- PKCE challenge mismatch — reject with clear error

---

## Focus Management

N/A — no new UI.

---

## Must Use

| Pattern | File to read |
|---|---|
| Auth patterns | `src/platform/lib/auth.ts` |
| OTP flow | `src/platform/lib/otp.ts` |
| Result pattern | `src/platform/lib/result.ts` |
| DB schema | `src/platform/db/schema.ts` |

---

## Wrong Paths

1. **Don't implement a custom OAuth provider library** — use raw PKCE logic, it's simple enough.
2. **Don't store tokens in plaintext** — hash access_token and refresh_token in DB.
3. **Don't skip the existing OTP login** — reuse it as the identity verification step inside the authorize flow.
4. **Don't use cookies for the CLI flow** — the CLI uses bearer tokens, not browser sessions.
5. **Don't let the agent generate OAuth client code** — the login, logout, and authenticatedFetch logic lives in `skills/flow/references/` as copy-paste code blocks. The agent reads the reference and writes it to the project — it never invents auth logic from scratch.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test PKCE verification, token exchange, code expiry |
| **coding-standards** | Step 2 | Small functions, typed Result returns |
| **flow-observability** | Step 2 | Log every auth event: authorize, token exchange, revoke |
| **clean-architecture** | Step 2 | OAuth logic in platform/lib, routes are thin adapters |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test PKCE code_verifier/code_challenge validation
- Test token exchange with valid/invalid/expired code
- Test refresh token rotation
- Test revocation clears token
- Test authorize endpoint generates valid code
- Journey: user can obtain a token via the OAuth flow

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/db/schema.ts` | MODIFY: add oauth_tokens, oauth_codes tables |
| `src/platform/db/migrations/0010_add_oauth_tables.sql` | NEW: CREATE TABLE |
| `src/app/api/auth/authorize/route.ts` | NEW: OAuth authorize endpoint |
| `src/app/api/auth/token/route.ts` | NEW: Token exchange endpoint |
| `src/app/api/auth/revoke/route.ts` | NEW: Token revocation endpoint |
| `src/platform/lib/oauth.ts` | NEW: PKCE verification, token generation, code management |
| `skills/flow/references/auth-client.md` | NEW: authenticatedFetch, token refresh, credentials I/O (skill reference) |
| `skills/flow/references/login-client.md` | NEW: PKCE client, local HTTP server, browser open (skill reference) |
| `skills/flow/references/logout-client.md` | NEW: token revocation, credentials cleanup (skill reference) |
| `skills/flow/SKILL.md` | MODIFY: add flow-login, flow-logout commands; reference auth-client.md etc. |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- OAuth authorize endpoint returns a redirect with code
- Token exchange returns access_token and refresh_token
- Revocation invalidates the token

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | `oauth.ts` — typed, small functions |
| Accessibility | No | No user-facing UI changes (authorize page reuses OTP) |
| Security | Yes | PKCE validation, token hashing, code expiry, timing-safe comparison |
| Observability | Yes | Every auth event logged |

---

## Research Brief

### Sources (CRAAP-tested)

| Source | Date | Authority | Key finding |
|---|---|---|---|
| RFC 7636 (PKCE) | 2015 | High (IETF) | code_verifier 43-128 chars, SHA256 challenge, S256 method |
| Vercel CLI source (GitHub) | 2025 | High | Local HTTP server on random port, browser redirect pattern |
| GitHub CLI auth flow | 2025 | High | Device flow alternative, but PKCE is simpler for browser-capable envs |
| oauth4webapi npm | 2025 | High | Handles PKCE generation client-side, but we can do it manually (simpler) |

### Ranked Approaches

| Rank | Approach | Verdict |
|---|---|---|
| **1 (chosen)** | PKCE with local HTTP server | Standard pattern, works everywhere, no device code polling |
| 2 | Device authorization grant (RFC 8628) | Requires polling, more complex, designed for devices without browsers |
| 3 | Copy-paste API key | Poor UX, secret management burden on user |

# Chapter 13: OTP Auth Ref Files

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 12
**User can:** Bootstrap a project with authentication, log in via OTP email locally (code appears in Mailpit).

## Goal

Create ref files for OTP authentication adapted from the current AI Centre auth system. Ref files provide: OTP generation/verification, JWT session management, auth middleware, and a login page template. After this chapter, bootstrapped projects have a working auth system.

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

No new UI — ref files live in the skill directory and are copied to user projects by the agent.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. Ref files live in skill directory.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
Bootstrap with auth:
  1. Download ref files:
     - src/lib/auth.ts (JWT session management)
     - src/lib/otp.ts (OTP generation, verification, rate limiting)
     - src/middleware.ts (auth middleware — check JWT, redirect to login)
     - src/app/login/page.tsx (login page with OTP form)
     - src/db/schema additions (users table, otp_codes table)
  2. User runs: npm run db:migrate (creates auth tables)
  3. User visits localhost:3000 → redirected to /login
  4. Enters email → OTP sent to Mailpit
  5. Enters OTP → JWT session created → redirected to app

Architecture:
  - JWT stored in httpOnly cookie
  - OTP valid for 5 minutes, 3 attempts max
  - Rate limit: 3 OTPs per email per hour
```

---

## Skill Reference Files

All ref files live inside a new `skills/auth-otp/` skill directory as markdown with copy-paste code blocks, following the standard skill reference pattern. The agent reads these references and writes the code to the user's project — it does NOT generate auth logic from scratch.

| Ref file | Contains |
|---|---|
| `skills/auth-otp/SKILL.md` | Behavioral skill — OTP flow, JWT sessions, rate limiting rules, security constraints |
| `skills/auth-otp/references/templates.md` | Copy-paste templates: auth.ts, otp.ts, middleware.ts, login page, schema additions |

Templates include:
1. `src/lib/auth.ts` — createSession, verifySession, clearSession (JWT + cookies)
2. `src/lib/otp.ts` — generateOtp, verifyOtp, rateLimit check
3. `src/middleware.ts` — Next.js middleware for auth check
4. `src/app/login/page.tsx` — OTP login form
5. Schema additions — users, otp_codes tables

---

## Edge Cases

- User already has middleware.ts — merge instructions, don't overwrite
- Auth without email — error, email chapter is a dependency
- Domain restriction — ref template includes optional domain whitelist
- Session expired — redirect to login with "session expired" message

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Current auth | `src/platform/lib/auth.ts` |
| Current OTP | `src/platform/lib/otp.ts` |
| Current middleware | check for edge auth middleware |

---

## Wrong Paths

1. **Don't copy the exact AI Centre auth** — adapt for generic use (no ezyCollect domain lock).
2. **Don't use Mailgun in the ref template** — use the email abstraction from Ch 12.
3. **Don't store OTPs in plaintext** — hash them.
4. **Don't skip rate limiting** — critical for production.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test skill reference content |
| **coding-standards** | Step 2 | Auth template quality |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test skill reference files exist and contain valid code blocks
- Test OTP template has rate limiting logic
- Test auth middleware template compiles
- Journey: auth skill ref files are accessible in the skill directory

---

## Critical Files

| File | Change |
|---|---|
| `skills/auth-otp/SKILL.md` | NEW: behavioral skill — OTP flow, JWT sessions, security rules |
| `skills/auth-otp/references/templates.md` | NEW: auth.ts, otp.ts, middleware.ts, login page, schema |
| `skills/flow/SKILL.md` | MODIFY: bootstrap references auth-otp skill for auth projects |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- N/A (skill reference files only, no new server endpoints)

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Auth template patterns |
| Accessibility | Yes | Login page template has proper form labels |
| Security | Yes | OTP hashing, rate limiting, JWT httpOnly |
| Observability | No | Skill ref files only |

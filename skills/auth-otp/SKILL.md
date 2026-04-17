---
name: auth-otp
description: OTP email authentication templates for bootstrapped projects. JWT sessions, hashed OTPs, rate limiting, middleware, login page. Uses email-mailpit for local dev. See auth-custom-otp for the behavioral rules.
---

# Auth — OTP Templates

Copy-paste authentication for bootstrapped projects. Provides: OTP generation/verification, JWT session management, auth middleware, and a login page.

For the behavioral rules (security principles, hashing, rate limiting design), see **auth-custom-otp**. This skill provides the ready-to-use code templates.

## When to Use

- Bootstrapped project needs authentication
- Email OTP is the chosen auth method (no passwords, no social login)
- The project already has the `email-mailpit` skill for email delivery

## Prerequisites

- **email-mailpit** skill installed (for `sendEmail()`)
- **db-turso-drizzle** skill installed (for database tables)
- `npm run db:migrate` run after copying schema additions

## Architecture

```
User visits app → middleware checks JWT cookie
  ├─ Valid → proceed
  └─ No/expired → redirect /login

Login page:
  1. Enter email → server generates 6-digit OTP, hashes, stores in DB, sends via email
  2. Enter code → server verifies hash, creates JWT, sets httpOnly cookie
  3. Redirect to app

Session:
  - JWT in httpOnly cookie (HS256, 7-day expiry)
  - Edge-compatible verification (jose library)
  - OTP valid 5 minutes, max 3 attempts, rate limit 3 per email per hour
```

## Security Rules

1. **Hash OTPs before storage** — SHA-256, never store plain codes
2. **httpOnly cookies only** — no localStorage for sessions
3. **Rate limit OTP requests** — 3 per email per hour
4. **Max 3 verification attempts** — then invalidate the OTP
5. **5-minute OTP expiry** — no long-lived codes
6. **No domain restriction by default** — add it in `otp.ts` if needed

## References

- [Templates](references/templates.md) — auth.ts, otp.ts, middleware.ts, login page, schema additions

---
name: email-mailpit
description: Local email development with Mailpit (Docker) and production routing via Mailgun HTTP API. Abstraction layer auto-selects transport based on environment.
---

# Email — Mailpit (Local) + Mailgun (Prod)

Email infrastructure for bootstrapped projects. Mailpit captures all emails locally via Docker; Mailgun HTTP API sends real emails in production. A single abstraction layer routes between them.

## When to Use

- The project needs to send email (OTP, notifications, transactional, marketing)
- You need a local email inbox to test without sending real emails
- You need a dev/prod split for email delivery

## When NOT to Use

- Projects that don't send email
- If you only need email in production and don't care about local testing — use `email-mailgun` directly

## Setup Overview

| Environment | Transport | Config |
|---|---|---|
| **Local dev** | Nodemailer SMTP → Mailpit | Docker Compose, SMTP on port 1025, Web UI on port 8025 |
| **Production** | Mailgun HTTP API | `MAILGUN_API_KEY` + `MAILGUN_DOMAIN` env vars |

## Local Development

```bash
docker compose up -d    # Starts Mailpit
# SMTP: localhost:1025  (no auth)
# Web UI: http://localhost:8025
```

All emails sent via `sendEmail()` in dev are captured by Mailpit. Open `localhost:8025` to view them — HTML rendering, attachments, headers, all visible.

## Production

Set `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` in your production env. The email abstraction detects these and switches to the Mailgun HTTP API automatically. No Nodemailer in production — HTTP API is more reliable on serverless.

## Architecture

```
sendEmail({ to, subject, html })
  └─ isProduction?
       ├─ YES → MailgunService (HTTP API, no SMTP)
       └─ NO  → MailpitService (Nodemailer SMTP to localhost:1025)
```

## Rules

1. **Never send real emails in dev** — always route to Mailpit
2. **Never use Nodemailer in production** — Mailgun HTTP API is serverless-safe
3. **Always include a text fallback** — not just HTML
4. **Log all sends** — at minimum: to, subject, transport used, success/failure
5. **Don't hardcode from addresses** — use `EMAIL_FROM` env var

## References

- [Templates](references/templates.md) — docker-compose.yml, email.ts abstraction, .env.local template

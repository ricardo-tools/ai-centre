---
name: email-mailpit-templates
type: reference
companion_to: email-mailpit
description: Copy-paste templates for Docker Compose (Mailpit), email abstraction layer, and env config. Agent copies these into the user's project.
---

# Email Templates

> **Companion to [email-mailpit](../SKILL.md).** Copy these templates into a bootstrapped project to get working local + production email.

---

## `docker-compose.yml` — Mailpit Service

If the project already has a `docker-compose.yml`, add the `mailpit` service to it. Otherwise create the file:

```yaml
services:
  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "1025:1025"   # SMTP
      - "8025:8025"   # Web UI
    environment:
      MP_SMTP_AUTH_ACCEPT_ANY: 1
      MP_SMTP_AUTH_ALLOW_INSECURE: 1
    restart: unless-stopped
```

After `docker compose up -d`, visit `http://localhost:8025` to see the inbox.

---

## `src/lib/email.ts` — Email Abstraction

```typescript
import { createTransport } from 'nodemailer';

// ── Types ────────────────────────────────────────────────────────────

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ── Environment detection ────────────────────────────────────────────

function isProduction(): boolean {
  return !!(process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN);
}

function getFrom(override?: string): string {
  return override || process.env.EMAIL_FROM || 'noreply@example.com';
}

// ── Mailpit (local dev via SMTP) ─────────────────────────────────────

async function sendViaMailpit(msg: EmailMessage): Promise<SendResult> {
  const transport = createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: Number(process.env.SMTP_PORT || 1025),
    secure: false,
    tls: { rejectUnauthorized: false },
  });

  try {
    const info = await transport.sendMail({
      from: getFrom(msg.from),
      to: Array.isArray(msg.to) ? msg.to.join(', ') : msg.to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text || msg.subject,
    });

    console.info('[email] sent via Mailpit', {
      to: msg.to,
      subject: msg.subject,
      messageId: info.messageId,
    });

    return { success: true, messageId: info.messageId };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[email] Mailpit send failed', { to: msg.to, error });
    return { success: false, error };
  }
}

// ── Mailgun (production via HTTP API) ────────────────────────────────

async function sendViaMailgun(msg: EmailMessage): Promise<SendResult> {
  const apiKey = process.env.MAILGUN_API_KEY!;
  const domain = process.env.MAILGUN_DOMAIN!;
  const isEU = process.env.MAILGUN_EU === 'true';
  const baseUrl = isEU
    ? `https://api.eu.mailgun.net/v3/${domain}/messages`
    : `https://api.mailgun.net/v3/${domain}/messages`;

  const form = new URLSearchParams();
  form.set('from', getFrom(msg.from));
  form.set('to', Array.isArray(msg.to) ? msg.to.join(', ') : msg.to);
  form.set('subject', msg.subject);
  form.set('html', msg.html);
  if (msg.text) form.set('text', msg.text);

  try {
    const res = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
      },
      body: form,
    });

    if (!res.ok) {
      const body = await res.text();
      console.error('[email] Mailgun send failed', {
        to: msg.to,
        status: res.status,
        body,
      });
      return { success: false, error: `Mailgun ${res.status}: ${body}` };
    }

    const data = await res.json();
    console.info('[email] sent via Mailgun', {
      to: msg.to,
      subject: msg.subject,
      messageId: data.id,
    });

    return { success: true, messageId: data.id };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error('[email] Mailgun send failed', { to: msg.to, error });
    return { success: false, error };
  }
}

// ── Public API ───────────────────────────────────────────────────────

/**
 * Send an email. Automatically routes to Mailgun (production) or
 * Mailpit (local dev) based on environment variables.
 */
export async function sendEmail(msg: EmailMessage): Promise<SendResult> {
  if (isProduction()) {
    return sendViaMailgun(msg);
  }
  return sendViaMailpit(msg);
}
```

**Dependencies:**

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

Nodemailer is only used in dev (Mailpit SMTP). Production uses `fetch` for the Mailgun HTTP API — no extra dependency.

---

## `.env.local` — Email Environment Variables

```bash
# ── Email (Local Dev — Mailpit) ──────────────────────────
SMTP_HOST=localhost
SMTP_PORT=1025
EMAIL_FROM=dev@localhost

# ── Email (Production — Mailgun) ─────────────────────────
# Uncomment and set these for production:
# MAILGUN_API_KEY=key-your-mailgun-api-key
# MAILGUN_DOMAIN=mg.yourdomain.com
# MAILGUN_EU=false
# EMAIL_FROM=noreply@yourdomain.com
```

The email abstraction detects `MAILGUN_API_KEY` + `MAILGUN_DOMAIN` to switch to production mode. If both are missing, it uses Mailpit SMTP.

---

## Usage Example

```typescript
import { sendEmail } from '@/lib/email';

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Welcome to the app</h1><p>Your account is ready.</p>',
  text: 'Welcome to the app. Your account is ready.',
});
```

In dev: email appears in Mailpit at `http://localhost:8025`.
In prod: email delivered via Mailgun.

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:1025` | Mailpit not running | `docker compose up -d` |
| Port 1025/8025 in use | Another service on those ports | Change ports in docker-compose.yml |
| Mailgun 401 | Invalid API key | Check `MAILGUN_API_KEY` |
| Mailgun 404 | Wrong domain | Check `MAILGUN_DOMAIN` matches verified domain |
| No text fallback | HTML-only email | Always include `text` field for accessibility |

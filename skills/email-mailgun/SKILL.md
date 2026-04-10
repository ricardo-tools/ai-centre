---
name: email-mailgun
description: >
  Mailgun SDK integration for sending transactional and marketing email.
  Covers client setup, HTML templates, domain verification, webhook handling,
  batch sending, and error handling. Implementation skill for the email-sending
  conceptual skill — read that first for deliverability principles and
  notification hygiene.
---

# Email — Mailgun

Implementation skill for **email-sending**. Read that skill first for principles on deliverability, bounce handling, and notification hygiene.

---

## When to Use

Apply this skill when:
- Integrating Mailgun as the email provider
- Sending transactional email (OTP codes, receipts, notifications)
- Sending marketing/bulk email via Mailgun
- Setting up domain authentication (SPF, DKIM, DMARC)
- Handling delivery webhooks (bounces, complaints, opens, clicks)

Do NOT use this skill for:
- Choosing whether to send an email — see **email-sending**
- Email content strategy or notification hygiene — see **email-sending**
- Other email providers (Resend, SendGrid, SES)

---

## Core Rules

### 1. Install and configure the Mailgun client

Use the official `mailgun.js` SDK with `form-data` as its dependency.

```bash
npm install mailgun.js form-data
```

Create a single Mailgun client instance, exported from a dedicated module:

```typescript
// src/lib/mailgun.ts
import Mailgun from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);

export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
  // EU region: use 'https://api.eu.mailgun.net' — see Rule 10
  url: process.env.MAILGUN_API_URL || "https://api.mailgun.net",
});

export const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN!;
```

Environment variables required:

```
MAILGUN_API_KEY=key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MAILGUN_DOMAIN=mail.yourdomain.com
MAILGUN_API_URL=https://api.mailgun.net    # or https://api.eu.mailgun.net
```

### 2. Send transactional email with the messages API

Always provide both `html` and `text` versions. Always set a `from` address on your verified domain.

```typescript
import { mg, MAILGUN_DOMAIN } from "@/lib/mailgun";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  tags?: string[];
}

export async function sendEmail({ to, subject, html, text, tags }: SendEmailParams) {
  const result = await mg.messages.create(MAILGUN_DOMAIN, {
    from: `MyApp <noreply@${MAILGUN_DOMAIN}>`,
    to: [to],
    subject,
    html,
    text,
    "o:tag": tags ?? ["transactional"],
  });

  return result;
}
```

### 3. Build HTML email templates with dynamic data

Use a template function, not string concatenation. Parameterize all dynamic content. Never interpolate raw user input into HTML — escape it.

```typescript
// src/lib/email-templates.ts

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function otpEmailTemplate(params: { code: string; expiryMinutes: number }): {
  html: string;
  text: string;
} {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; padding: 24px;">
  <h1 style="font-size: 24px; color: #111;">Your verification code</h1>
  <p style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #111;">
    ${escapeHtml(params.code)}
  </p>
  <p style="color: #666;">This code expires in ${params.expiryMinutes} minutes.</p>
</body>
</html>`;

  const text = `Your verification code: ${params.code}\nExpires in ${params.expiryMinutes} minutes.`;

  return { html, text };
}
```

### 4. Verify your sending domain

Before sending from a domain, configure these DNS records. Mailgun provides the exact values in their dashboard.

| Record | Type | Purpose |
|---|---|---|
| SPF | TXT on domain | Authorizes Mailgun to send on your behalf |
| DKIM | TXT (two records) | Cryptographic signature for email integrity |
| MX | MX on subdomain | Required for receiving (bounces, replies) |
| DMARC | TXT on `_dmarc.domain` | Policy for handling auth failures |

Verify in code or dashboard:

```typescript
const domainInfo = await mg.domains.get(MAILGUN_DOMAIN);
console.log("State:", domainInfo.state); // "active" when verified
```

Do not send production email from an unverified domain. It will land in spam.

### 5. Handle webhooks for bounces, complaints, and deliveries

Set up a webhook endpoint. Mailgun sends POST requests with event data. Always verify the webhook signature.

```typescript
// src/app/api/webhooks/mailgun/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SIGNING_KEY = process.env.MAILGUN_WEBHOOK_SIGNING_KEY!;

function verifyWebhookSignature(
  timestamp: string,
  token: string,
  signature: string
): boolean {
  const encoded = crypto
    .createHmac("sha256", SIGNING_KEY)
    .update(timestamp + token)
    .digest("hex");
  return encoded === signature;
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { timestamp, token, signature } = body.signature;
  if (!verifyWebhookSignature(timestamp, token, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = body["event-data"];
  const eventType = event.event; // "bounced", "complained", "delivered", "opened", "clicked"
  const recipient = event.recipient;

  switch (eventType) {
    case "failed": // includes bounces
      if (event.severity === "permanent") {
        // Hard bounce — mark email as undeliverable, stop sending
        await markUndeliverable(recipient);
      }
      // Soft bounce — Mailgun retries automatically
      break;

    case "complained":
      // User marked as spam — suppress immediately
      await suppressRecipient(recipient);
      break;

    case "delivered":
      // Optionally log successful delivery
      break;
  }

  return NextResponse.json({ received: true });
}
```

### 6. Rate limit and batch send

For bulk sends, use Mailgun's batch sending (recipient variables) instead of looping individual sends. Mailgun supports up to 1,000 recipients per API call.

```typescript
export async function sendBatch(
  recipients: Array<{ email: string; name: string }>,
  subject: string,
  html: string,
  text: string
) {
  const recipientVariables: Record<string, { name: string }> = {};
  const toAddresses: string[] = [];

  for (const r of recipients) {
    toAddresses.push(r.email);
    recipientVariables[r.email] = { name: r.name };
  }

  await mg.messages.create(MAILGUN_DOMAIN, {
    from: `MyApp <noreply@${MAILGUN_DOMAIN}>`,
    to: toAddresses,
    subject,
    html: html.replace("{{name}}", "%recipient.name%"),
    text: text.replace("{{name}}", "%recipient.name%"),
    "recipient-variables": JSON.stringify(recipientVariables),
  });
}
```

For application-level rate limiting, enforce caps before calling the Mailgun API:

```typescript
const MAX_EMAILS_PER_USER_PER_HOUR = 5;

async function canSend(userId: string): Promise<boolean> {
  const recentCount = await getRecentEmailCount(userId, 60 * 60); // last hour
  return recentCount < MAX_EMAILS_PER_USER_PER_HOUR;
}
```

### 7. Dev mode: sandbox domain or skip sending

In development, either use Mailgun's sandbox domain (free, sends only to verified recipients) or skip sending entirely.

```typescript
export async function sendEmail(params: SendEmailParams) {
  if (process.env.NODE_ENV === "development" && process.env.MAILGUN_SKIP_SEND === "true") {
    console.log("[EMAIL SKIP]", params.to, params.subject);
    console.log("[EMAIL BODY]", params.text);
    return { id: "dev-skip", message: "Skipped in development" };
  }

  return mg.messages.create(MAILGUN_DOMAIN, {
    from: `MyApp <noreply@${MAILGUN_DOMAIN}>`,
    to: [params.to],
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}
```

### 8. Handle API errors gracefully

Mailgun throws on 4xx/5xx. Wrap calls in try/catch and handle specific error codes.

```typescript
try {
  await sendEmail({ to, subject, html, text });
} catch (error: unknown) {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("401")) {
      // Bad API key — critical config error
      throw new Error("Mailgun authentication failed. Check MAILGUN_API_KEY.");
    }

    if (message.includes("404")) {
      // Domain not found — check MAILGUN_DOMAIN
      throw new Error("Mailgun domain not found. Check MAILGUN_DOMAIN.");
    }

    if (message.includes("429")) {
      // Rate limited — queue and retry with backoff
      await queueForRetry({ to, subject, html, text });
      return;
    }
  }

  // Unknown error — log and re-throw
  console.error("Mailgun send failed:", error);
  throw error;
}
```

### 9. Use Mailgun stored templates for shared layouts

For email types that share a layout (header + footer + brand), use Mailgun's template storage instead of duplicating HTML.

```typescript
// Send using a stored template
await mg.messages.create(MAILGUN_DOMAIN, {
  from: `MyApp <noreply@${MAILGUN_DOMAIN}>`,
  to: [recipient],
  subject: "Your receipt",
  template: "receipt-v1",
  "h:X-Mailgun-Variables": JSON.stringify({
    amount: "$42.00",
    date: "2026-03-18",
    items: "3 items",
  }),
});
```

### 10. EU vs US data residency

Mailgun offers EU and US hosting. Set the API URL based on where your data must reside.

| Region | API URL | Data stored in |
|---|---|---|
| US (default) | `https://api.mailgun.net` | United States |
| EU | `https://api.eu.mailgun.net` | European Union |

Set `MAILGUN_API_URL` in your environment. If your users are subject to GDPR, use the EU endpoint and create your domain in the EU region.

---

## Banned Patterns

- ❌ Hardcoded API keys in source code → always use environment variables
- ❌ Sending without SPF/DKIM verification → verify the domain first; unverified domains go to spam
- ❌ Interpolating raw user input into HTML email bodies → always escape user input
- ❌ Looping individual sends for bulk email → use batch sending with recipient variables
- ❌ Ignoring bounces and complaints → process webhooks and suppress bad addresses
- ❌ Sending real email in development without explicit opt-in → default to skip or sandbox
- ❌ Mixing transactional and marketing on the same domain → use subdomains or separate domains

---

## Quality Gate

Before considering Mailgun integration complete:

- [ ] Domain DNS records (SPF, DKIM, MX, DMARC) verified and active
- [ ] Both HTML and plain text versions sent for every email type
- [ ] Webhook endpoint deployed and processing bounces and complaints
- [ ] Webhook signature verification in place
- [ ] Dev mode skips or sandboxes email sends
- [ ] API key and domain stored in environment variables, not code
- [ ] Rate limiting enforced at application level
- [ ] Error handling covers 401, 404, 429, and network failures
- [ ] EU/US region chosen intentionally based on data residency requirements

---
name: email-sending
description: >
  Principles for sending email from applications — transactional and marketing,
  deliverability, bounce handling, unsubscribe compliance, and notification hygiene.
---

# Email Sending

## When to Use

Apply this skill when:

- The application sends transactional email (verification, receipts, alerts)
- Adding marketing or notification email flows
- Designing email templates with brand consistency
- Configuring deliverability (SPF, DKIM, DMARC)
- Handling bounces, complaints, or unsubscribe compliance

## Do NOT use this skill for:

- Email provider integration details (API clients, webhook handling) — use **email-mailgun** or your provider-specific skill
- Authentication flows that happen to send email — use **authentication** for the flow, this skill for the sending rules

---

## Core Rules

### 1. Separate transactional from marketing.

Use different sending streams (ideally different subdomains). Transactional
email (password resets, receipts) must never be delayed by marketing throttling
or reputation issues.

### 2. Every email must earn its send.

Before adding a new email trigger, ask: does the user need this now, and would
they be annoyed if it didn't arrive? If neither, don't send it.

### 3. HTML + plain text, always.

Every email has a branded HTML version and a plain text fallback. Some clients,
accessibility tools, and spam filters require plain text.

### 4. Template over string concatenation.

Use a template system with layout inheritance. One base layout (header, footer,
brand), content blocks injected per email type. Dynamic content is
parameterized, never interpolated from raw user input.

```ts
function buildEmail(template: string, vars: Record<string, string>): string {
  const baseLayout = `
    <div style="max-width:600px;margin:0 auto;font-family:sans-serif">
      <header style="padding:24px;background:#1a1a2e;color:#fff">{{brand}}</header>
      <main style="padding:24px">{{content}}</main>
      <footer style="padding:16px;font-size:12px;color:#666">
        {{companyInfo}} | <a href="{{unsubscribeUrl}}">Unsubscribe</a>
      </footer>
    </div>`;
  return Object.entries(vars).reduce(
    (html, [k, v]) => html.replaceAll(`{{${k}}}`, sanitize(v)),
    baseLayout.replace('{{content}}', template),
  );
}
```

### 5. Authenticate your domain.

SPF, DKIM, and DMARC are non-negotiable. Without all three, emails land in
spam. Verify DNS records before going live.

### 6. Rate limit outbound email.

Cap sends per user per hour and per day. Cap total sends per minute to stay
within provider limits. Queue and retry, never burst.

### 7. Handle bounces immediately.

Hard bounces (invalid address): mark undeliverable, stop sending. Soft bounces
(mailbox full, temporary failure): retry with backoff, mark undeliverable after
3 failures over 72 hours.

### 8. Process complaints.

When a user marks your email as spam, treat it as an unsubscribe. Continued
sending after complaints destroys sender reputation.

### 9. One-click unsubscribe is mandatory.

Include `List-Unsubscribe` header and a visible unsubscribe link in every
marketing email. Honour it within 24 hours. CAN-SPAM, GDPR, and most anti-spam
laws require this.

```ts
function unsubscribeHeaders(userId: string): Record<string, string> {
  const url = `${BASE_URL}/api/unsubscribe?token=${signToken(userId)}`;
  return {
    'List-Unsubscribe': `<${url}>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}
```

### 10. Respect user preferences.

Let users choose what they receive (account alerts, product updates, marketing).
Default to minimal. Never re-subscribe a user who opted out.

---

## Template Patterns

- **Base layout:** brand header, content slot, footer with company info and unsubscribe.
- **Content blocks:** greeting, body paragraphs, call-to-action button, secondary info.
- **Dynamic content:** use named placeholders (`{{userName}}`, `{{actionUrl}}`).
  Sanitize all user-supplied values.
- **Dark mode:** test `@media (prefers-color-scheme: dark)`. Use transparent PNGs for
  logos, avoid white backgrounds baked into images.
- **Mobile:** single-column layout, minimum 14px font, large tap targets for buttons.

---

## Testing

- Preview every template in at least 3 clients (Gmail, Outlook, Apple Mail).
- Run spam score checks before launch (SpamAssassin or equivalent).
- Send test emails to seed addresses on major providers.
- Verify links, unsubscribe flow, and plain text version.
- Test with empty/long values for all dynamic fields.

---

## Banned Patterns

- ❌ Sending email synchronously in the request path → always queue
- ❌ No-reply address with no alternative contact → provide a support email
- ❌ Marketing email without explicit opt-in → require opt-in before sending
- ❌ Tracking pixels without privacy disclosure → document in privacy policy
- ❌ Hardcoding SMTP credentials in code → use environment variables
- ❌ Sending to hard-bounced addresses → mark undeliverable and stop
- ❌ All recipients in To/CC → use BCC or individual sends

---

## Quality Gate

- [ ] SPF, DKIM, and DMARC records pass validation.
- [ ] Every email type has HTML and plain text versions.
- [ ] Unsubscribe link present and functional in all marketing emails.
- [ ] Hard bounces stop further sends to that address.
- [ ] Rate limits configured for per-user and global sends.
- [ ] Email templates render correctly in Gmail, Outlook, and Apple Mail.
- [ ] No user-supplied content is injected without sanitization.
- [ ] Transactional and marketing emails use separate sending streams.

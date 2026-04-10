'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre
    style={{
      fontSize: 12,
      fontFamily: 'monospace',
      lineHeight: 1.8,
      padding: 16,
      borderRadius: 6,
      background: 'var(--color-bg-alt)',
      border: '1px solid var(--color-border)',
      overflow: 'auto',
    }}
  >
    {children}
  </pre>
);

/* ---- data ---- */
const sdkSetupSteps = [
  { step: 'Install', detail: 'npm install mailgun.js form-data', note: 'Official SDK with form-data dependency' },
  { step: 'Create client', detail: 'Single instance exported from lib/mailgun.ts', note: 'One client, reused everywhere' },
  { step: 'Configure region', detail: 'US: api.mailgun.net — EU: api.eu.mailgun.net', note: 'GDPR requires EU endpoint for EU users' },
  { step: 'Set env vars', detail: 'MAILGUN_API_KEY, MAILGUN_DOMAIN, MAILGUN_API_URL', note: 'Never hardcode credentials' },
  { step: 'Verify domain', detail: 'SPF + DKIM + MX + DMARC DNS records', note: 'Unverified domains land in spam' },
];

const dnsRecords = [
  { record: 'SPF', type: 'TXT', location: 'Domain root', purpose: 'Authorizes Mailgun to send on your behalf' },
  { record: 'DKIM', type: 'TXT (x2)', location: 'Domain root', purpose: 'Cryptographic signature for email integrity' },
  { record: 'MX', type: 'MX', location: 'Sending subdomain', purpose: 'Required for receiving bounces and replies' },
  { record: 'DMARC', type: 'TXT', location: '_dmarc.domain', purpose: 'Policy for handling auth failures' },
];

const webhookEvents = [
  { event: 'delivered', desc: 'Email successfully delivered to recipient', action: 'Log delivery timestamp', severity: 'Info' },
  { event: 'failed (permanent)', desc: 'Hard bounce — invalid address or domain', action: 'Mark undeliverable, stop sending', severity: 'Critical' },
  { event: 'failed (temporary)', desc: 'Soft bounce — mailbox full, server down', action: 'Mailgun retries automatically', severity: 'Warning' },
  { event: 'complained', desc: 'User marked email as spam', action: 'Suppress recipient immediately', severity: 'Critical' },
  { event: 'opened', desc: 'Recipient opened the email (tracking pixel)', action: 'Log open rate analytics', severity: 'Info' },
  { event: 'clicked', desc: 'Recipient clicked a link in the email', action: 'Log click-through analytics', severity: 'Info' },
];

const errorCodes = [
  { code: '401', meaning: 'Bad API key', handling: 'Critical config error — fail loudly at startup' },
  { code: '404', meaning: 'Domain not found', handling: 'Check MAILGUN_DOMAIN — may be incorrect or unverified' },
  { code: '429', meaning: 'Rate limited', handling: 'Queue and retry with exponential backoff' },
  { code: '5xx', meaning: 'Mailgun server error', handling: 'Retry with backoff, alert if persistent' },
];

export function EmailMailgunShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This is the implementation skill for <strong>email-sending</strong>.
          Read that skill first for deliverability principles and notification hygiene.
          This skill covers the Mailgun-specific SDK setup, templates, webhooks, and error handling.
        </p>
      </div>

      {/* ---- SDK Setup ---- */}
      <Section title="SDK Setup Flow">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {sdkSetupSteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 1fr',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 6,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</span>
              <code style={{ fontSize: 12, color: 'var(--color-text-body)', fontFamily: 'monospace' }}>{s.detail}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{s.note}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Client Setup Code ---- */}
      <Section title="Mailgun Client Pattern">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct</h4>
            <CodeBlock>{`// src/lib/mailgun.ts — single instance
import Mailgun from "mailgun.js";
import FormData from "form-data";

const mailgun = new Mailgun(FormData);

export const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY!,
  url: process.env.MAILGUN_API_URL
    || "https://api.mailgun.net",
});

export const MAILGUN_DOMAIN =
  process.env.MAILGUN_DOMAIN!;`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dangerous</h4>
            <CodeBlock>{`// Creating new clients per request
async function sendEmail(to: string) {
  const mg = new Mailgun(FormData)
    .client({
      username: "api",
      key: "key-abc123...",  // hardcoded!
    });
  // ...
}

// No region configuration
// No domain export
// API key in source code`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Template Pattern ---- */}
      <Section title="Email Template Pattern">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Use parameterized templates, not string concatenation. Escape all user-supplied values before inserting into HTML.
        </p>
        <CodeBlock>{`// src/lib/email-templates.ts
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function otpEmailTemplate(params: {
  code: string; expiryMinutes: number;
}): { html: string; text: string } {
  const html = \`
    <h1 style="font-size:24px">Your verification code</h1>
    <p style="font-size:32px;font-weight:bold;letter-spacing:4px">
      \${escapeHtml(params.code)}
    </p>
    <p>This code expires in \${params.expiryMinutes} minutes.</p>\`;

  const text = \`Code: \${params.code} (expires in \${params.expiryMinutes}min)\`;
  return { html, text };
}`}</CodeBlock>
      </Section>

      {/* ---- Domain Verification ---- */}
      <Section title="Domain DNS Records">
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 100px 140px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Record</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Type</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Location</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Purpose</span>
          </div>
          {dnsRecords.map((r, i) => (
            <div
              key={r.record}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 100px 140px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{r.record}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.type}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{r.location}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{r.purpose}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Webhook Signature Verification ---- */}
      <Section title="Webhook Signature Verification">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Always verify webhook signatures to prevent forged event submissions. Mailgun signs every webhook with HMAC-SHA256.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified</h4>
            <CodeBlock>{`const SIGNING_KEY =
  process.env.MAILGUN_WEBHOOK_SIGNING_KEY!;

function verifySignature(
  timestamp: string,
  token: string,
  signature: string,
): boolean {
  const encoded = crypto
    .createHmac("sha256", SIGNING_KEY)
    .update(timestamp + token)
    .digest("hex");
  return encoded === signature;
}`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unverified</h4>
            <CodeBlock>{`// Accepts any POST to webhook URL
export async function POST(req: Request) {
  const body = await req.json();
  // No signature check!
  // Attacker can forge bounce events
  // and suppress real email addresses
  await processEvent(body);
  return Response.json({ ok: true });
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Webhook Events ---- */}
      <Section title="Webhook Event Handling">
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '150px 1fr 1fr 90px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Event</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Description</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Action Required</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Severity</span>
          </div>
          {webhookEvents.map((ev, i) => (
            <div
              key={ev.event}
              style={{
                display: 'grid',
                gridTemplateColumns: '150px 1fr 1fr 90px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>{ev.event}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{ev.desc}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{ev.action}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: ev.severity === 'Critical' ? 'var(--color-error)' : ev.severity === 'Warning' ? 'var(--color-warning)' : 'var(--color-text-muted)',
                  color: '#FFFFFF',
                }}
              >
                {ev.severity}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Sandbox Mode ---- */}
      <Section title="Sandbox / Dev Mode">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          In development, either use the Mailgun sandbox domain (free, only sends to verified recipients) or skip sending entirely.
        </p>
        <CodeBlock>{`export async function sendEmail(params: SendEmailParams) {
  // Dev mode — log instead of sending
  if (process.env.NODE_ENV === "development"
      && process.env.MAILGUN_SKIP_SEND === "true") {
    console.log("[EMAIL SKIP]", params.to, params.subject);
    console.log("[EMAIL BODY]", params.text);
    return { id: "dev-skip", message: "Skipped in dev" };
  }

  return mg.messages.create(MAILGUN_DOMAIN, {
    from: \`App <noreply@\${MAILGUN_DOMAIN}>\`,
    to: [params.to],
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}`}</CodeBlock>
      </Section>

      {/* ---- Error Handling ---- */}
      <Section title="API Error Handling">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {errorCodes.map((e) => (
            <div
              key={e.code}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-error)', marginBottom: 8, fontFamily: 'monospace' }}>{e.code}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 6 }}>{e.meaning}</div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{e.handling}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- EU vs US ---- */}
      <Section title="Data Residency: EU vs US">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { region: 'US (Default)', url: 'https://api.mailgun.net', storage: 'United States', when: 'Non-GDPR users, US-based services', color: 'var(--color-primary)' },
            { region: 'EU', url: 'https://api.eu.mailgun.net', storage: 'European Union', when: 'GDPR-subject users, EU data residency', color: 'var(--color-secondary)' },
          ].map((r) => (
            <div
              key={r.region}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${r.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: r.color, marginBottom: 12 }}>{r.region}</div>
              <code style={{ fontSize: 12, display: 'block', padding: '6px 12px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-body)', marginBottom: 10 }}>{r.url}</code>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, marginBottom: 4 }}>Data stored in: <strong>{r.storage}</strong></p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>{r.when}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

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
const emailTypes = [
  { type: 'Transactional', examples: 'Password resets, receipts, OTP codes, account alerts', priority: 'Must arrive instantly', subdomain: 'mail.example.com', color: 'var(--color-primary)' },
  { type: 'Marketing', examples: 'Newsletters, product updates, promotions, re-engagement', priority: 'Can be queued and batched', subdomain: 'news.example.com', color: 'var(--color-secondary)' },
];

const deliverabilityChecklist = [
  { item: 'SPF record', desc: 'Authorizes your mail server to send on behalf of your domain', status: 'Required' },
  { item: 'DKIM signing', desc: 'Cryptographic signature proving email integrity and origin', status: 'Required' },
  { item: 'DMARC policy', desc: 'Tells receivers how to handle emails that fail SPF/DKIM', status: 'Required' },
  { item: 'Separate streams', desc: 'Different subdomains for transactional vs marketing email', status: 'Required' },
  { item: 'Bounce handling', desc: 'Hard bounces stop sending; soft bounces retry with backoff', status: 'Required' },
  { item: 'Rate limiting', desc: 'Cap per-user and global sends to stay within provider limits', status: 'Required' },
  { item: 'Unsubscribe header', desc: 'List-Unsubscribe + one-click unsubscribe in every marketing email', status: 'Required' },
  { item: 'Spam score check', desc: 'Run SpamAssassin or equivalent before launch', status: 'Recommended' },
];

const authDnsFlow = [
  { step: 'SPF', detail: 'TXT record on domain — "v=spf1 include:mailgun.org ~all"', purpose: 'Declares which servers may send for your domain' },
  { step: 'DKIM', detail: 'Two TXT records with public key — Mailgun provides values', purpose: 'Receiver verifies cryptographic signature on the email' },
  { step: 'DMARC', detail: 'TXT record on _dmarc.domain — "v=DMARC1; p=quarantine"', purpose: 'Policy for emails that fail SPF and/or DKIM checks' },
  { step: 'MX', detail: 'MX records on sending subdomain for bounce handling', purpose: 'Enables provider to receive bounces and replies' },
  { step: 'Verify', detail: 'Provider dashboard or API confirms all records are active', purpose: 'Confirms DNS propagation and correct configuration' },
];

const templateRules = [
  { rule: 'HTML + plain text', desc: 'Every email needs both versions. Accessibility tools and spam filters require plain text.' },
  { rule: 'Template inheritance', desc: 'One base layout (header, footer, brand). Content blocks injected per email type.' },
  { rule: 'Parameterized content', desc: 'Named placeholders like {{userName}}. Never interpolate raw user input.' },
  { rule: 'Dark mode support', desc: 'Test @media (prefers-color-scheme: dark). Use transparent PNGs for logos.' },
  { rule: 'Mobile-first', desc: 'Single-column layout, 14px minimum font, large tap targets for buttons.' },
  { rule: 'Client testing', desc: 'Preview in Gmail, Outlook, and Apple Mail before launch.' },
];

const bounceHandling = [
  { type: 'Hard Bounce', desc: 'Invalid address, domain not found', action: 'Mark undeliverable immediately. Stop all future sends.', color: 'var(--color-error)' },
  { type: 'Soft Bounce', desc: 'Mailbox full, temporary server failure', action: 'Retry with exponential backoff. Mark undeliverable after 3 failures over 72 hours.', color: 'var(--color-warning)' },
  { type: 'Complaint', desc: 'User marked email as spam', action: 'Treat as unsubscribe. Continued sending destroys sender reputation.', color: 'var(--color-error)' },
];

export function EmailSendingShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> For Mailgun-specific SDK integration, see <strong>email-mailgun</strong>.
          This skill covers the principles — what to send, when, and how to stay out of spam.
          Also pairs with <strong>authentication</strong> for OTP email flows.
        </p>
      </div>

      {/* ---- Transactional vs Marketing ---- */}
      <Section title="Transactional vs Marketing Email">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Separate your sending streams. Transactional email must never be delayed by marketing throttling or reputation issues.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {emailTypes.map((t) => (
            <div
              key={t.type}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${t.color}`,
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: t.color, marginBottom: 12 }}>{t.type}</div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Examples</div>
                <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{t.examples}</p>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Priority</div>
                <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>{t.priority}</p>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Subdomain</div>
                <code style={{ fontSize: 12, padding: '3px 8px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-body)' }}>{t.subdomain}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- SPF / DKIM / DMARC Flow ---- */}
      <Section title="Domain Authentication Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Without SPF, DKIM, and DMARC, your emails land in spam. Configure all three before sending a single production email.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {authDnsFlow.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 6,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{s.step}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.detail}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{s.purpose}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Deliverability Checklist ---- */}
      <Section title="Deliverability Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {deliverabilityChecklist.map((item) => (
            <div
              key={item.item}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 2 }}>{item.item}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.desc}</div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  background: item.status === 'Required' ? 'var(--color-error)' : 'var(--color-warning)',
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Template Patterns ---- */}
      <Section title="Template Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {templateRules.map((r) => (
            <div
              key={r.rule}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>{r.rule}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Bounce Handling ---- */}
      <Section title="Bounce & Complaint Handling">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {bounceHandling.map((b) => (
            <div
              key={b.type}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `4px solid ${b.color}`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>{b.type}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, marginBottom: 10, lineHeight: 1.4 }}>{b.desc}</p>
              <div style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 500 }}>
                <strong>Action:</strong> {b.action}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Unsubscribe ---- */}
      <Section title="One-Click Unsubscribe">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          CAN-SPAM, GDPR, and most anti-spam laws require a visible unsubscribe link and List-Unsubscribe header in every marketing email.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct</h4>
            <CodeBlock>{`// List-Unsubscribe headers
function unsubscribeHeaders(userId: string) {
  const url = \`\${BASE_URL}/api/unsubscribe
    ?token=\${signToken(userId)}\`;
  return {
    'List-Unsubscribe': \`<\${url}>\`,
    'List-Unsubscribe-Post':
      'List-Unsubscribe=One-Click',
  };
}

// Visible link in footer
// Honour within 24 hours
// Never re-subscribe opted-out users`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dangerous</h4>
            <CodeBlock>{`// No unsubscribe link
// "Reply with STOP to unsubscribe"
// Unsubscribe link that doesn't work
// Re-subscribing users after opt-out
// Hiding unsubscribe behind login
// "It may take 10 days to process"

// All of these violate CAN-SPAM
// and destroy sender reputation.`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- User Preferences ---- */}
      <Section title="User Notification Preferences">
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
              gridTemplateColumns: '1fr 120px 120px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Category</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Default</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>User Control</span>
          </div>
          {[
            { cat: 'Account alerts (password reset, security)', def: 'Always on', control: 'Cannot disable' },
            { cat: 'Transactional (receipts, confirmations)', def: 'Always on', control: 'Cannot disable' },
            { cat: 'Product updates', def: 'On', control: 'Can disable' },
            { cat: 'Marketing / promotions', def: 'Off', control: 'Opt-in only' },
            { cat: 'Digest / summary emails', def: 'Off', control: 'Can enable' },
          ].map((row, i) => (
            <div
              key={row.cat}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 120px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{row.cat}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' }}>{row.def}</span>
              <span style={{ fontSize: 12, color: row.control === 'Cannot disable' ? 'var(--color-error)' : 'var(--color-success)', fontWeight: 500, textAlign: 'center' }}>{row.control}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

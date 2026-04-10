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
const strategies = [
  { name: 'Passwordless OTP', pros: 'No password storage, simple UX', cons: 'Depends on email/SMS delivery', bestFor: 'Internal tools, low-friction apps', color: 'var(--color-primary)' },
  { name: 'Magic Link', pros: 'Same as OTP, even simpler UX', cons: 'Link forwarding risk, email latency', bestFor: 'Consumer apps with email-first UX', color: 'var(--color-secondary)' },
  { name: 'OAuth / SSO', pros: 'Delegates security, trusted providers', cons: 'Vendor dependency, complex flows', bestFor: 'Apps with enterprise customers', color: 'var(--color-brand)' },
  { name: 'Password + MFA', pros: 'Familiar, works offline', cons: 'Password reuse, storage liability', bestFor: 'When other strategies aren\'t viable', color: 'var(--color-warning)' },
  { name: 'Passkeys', pros: 'Phishing-resistant, no shared secret', cons: 'Browser support gaps, recovery UX', bestFor: 'High-security, modern browsers', color: 'var(--color-success)' },
];

const tokenLifecycle = [
  { step: 'Login', desc: 'Issue access token + refresh token', icon: '1' },
  { step: 'API Request', desc: 'Validate access token (signature, expiry, deny list)', icon: '2' },
  { step: 'Token Expired', desc: 'Use refresh token to get new pair', icon: '3' },
  { step: 'Refresh Expired', desc: 'User must re-authenticate', icon: '4' },
  { step: 'Logout', desc: 'Revoke refresh, deny-list access token until expiry', icon: '5' },
  { step: 'Compromise', desc: 'Revoke all tokens for the user', icon: '6' },
];

const mfaTypes = [
  { type: 'Passkeys (WebAuthn)', strength: 'Strongest', phishingResistant: true, desc: 'Hardware-bound credential, no shared secrets', color: 'var(--color-success)' },
  { type: 'TOTP (Authenticator App)', strength: 'Strong', phishingResistant: false, desc: 'Time-based codes from Google Authenticator, Authy, etc.', color: 'var(--color-primary)' },
  { type: 'Email OTP', strength: 'Moderate', phishingResistant: false, desc: 'Code sent to email — useful but email is often the primary channel', color: 'var(--color-warning)' },
  { type: 'SMS OTP', strength: 'Weak', phishingResistant: false, desc: 'Better than nothing, vulnerable to SIM swapping', color: 'var(--color-error)' },
];

const sessionPatterns = [
  {
    type: 'Stateless (JWT)',
    storage: 'Access token in memory, refresh in httpOnly cookie',
    contents: 'User ID, role, issued-at, expiry',
    revocation: 'Deny list until natural expiry',
    scaling: 'No shared storage needed',
    color: 'var(--color-primary)',
  },
  {
    type: 'Stateful (Server Session)',
    storage: 'Session ID in httpOnly, Secure, SameSite=Strict cookie',
    contents: 'Session data lives server-side (DB or Redis)',
    revocation: 'Delete the session record — instant',
    scaling: 'Requires shared storage (DB/Redis)',
    color: 'var(--color-secondary)',
  },
];

const coreRules = [
  { num: '01', rule: 'Simplest strategy', desc: 'Choose OTP/magic link/OAuth before passwords — eliminate password storage' },
  { num: '02', rule: 'Sessions must expire', desc: 'Access: 15-60 min, refresh: 7-30 days — never issue forever tokens' },
  { num: '03', rule: 'Refresh is single-use', desc: 'Each refresh issues a new pair — detect reuse as compromise signal' },
  { num: '04', rule: 'Logout must actually log out', desc: 'Deny-list tokens, destroy sessions, provide "log out all devices"' },
  { num: '05', rule: 'Brute force protection', desc: 'Rate limit per account + IP — cooldown or CAPTCHA after 5 failures' },
  { num: '06', rule: 'Timing attacks are real', desc: 'Constant-time comparison for tokens and OTPs — generic error messages' },
  { num: '07', rule: 'MFA phishing-resistant', desc: 'Prefer passkeys > TOTP > SMS — never use email as second factor' },
  { num: '08', rule: 'Auth middleware by default', desc: 'All routes authenticated unless explicitly public — small allow list' },
  { num: '09', rule: 'Domain restriction != security', desc: 'Domain allow-list controls registration, not authorization' },
  { num: '10', rule: 'Safe dev bypass', desc: 'NODE_ENV check, never deployable, still exercises session paths' },
];

export function AuthenticationShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This skill covers WHO you are — see <strong>authorization</strong> for WHAT you can do.
          Implementation: <strong>auth-clerk</strong> (managed provider) or <strong>auth-custom-otp</strong> (self-hosted OTP).
        </p>
      </div>

      {/* ---- Auth Flow Diagram ---- */}
      <Section title="Authentication Flow">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          {[
            { label: 'User', bg: 'var(--color-primary)' },
            { label: 'Enter Credentials', bg: 'var(--color-bg-alt)' },
            { label: 'Validate Identity', bg: 'var(--color-bg-alt)' },
            { label: 'Issue Tokens', bg: 'var(--color-bg-alt)' },
            { label: 'Authenticated', bg: 'var(--color-success)' },
          ].map((step, i) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  background: step.bg,
                  color: step.bg === 'var(--color-bg-alt)' ? 'var(--color-text-heading)' : '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 600,
                  border: '1px solid var(--color-border)',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.label}
              </div>
              {i < 4 && (
                <div style={{ fontSize: 16, color: 'var(--color-text-muted)', fontWeight: 700 }}>→</div>
              )}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.6, margin: 0 }}>
          Authentication answers one question: &quot;Who is this user?&quot; It does not decide what they can do — that is authorization.
        </p>
      </Section>

      {/* ---- Core Rules Grid ---- */}
      <Section title="10 Core Rules">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {coreRules.map((r) => (
            <div
              key={r.num}
              style={{
                display: 'flex',
                gap: 12,
                padding: 14,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {r.num}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 2 }}>{r.rule}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Strategy Comparison ---- */}
      <Section title="Strategy Comparison">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))', gap: 12 }}>
          {strategies.map((s) => (
            <div
              key={s.name}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `4px solid ${s.color}`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>{s.name}</div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', marginBottom: 2 }}>Pros</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.pros}</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', marginBottom: 2 }}>Cons</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.cons}</span>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Best For</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.bestFor}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Session Patterns ---- */}
      <Section title="Session Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {sessionPatterns.map((s) => (
            <div
              key={s.type}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${s.color}`,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: s.color, marginBottom: 14 }}>{s.type}</div>
              {[
                { label: 'Storage', value: s.storage },
                { label: 'Contents', value: s.contents },
                { label: 'Revocation', value: s.revocation },
                { label: 'Scaling', value: s.scaling },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Token Lifecycle ---- */}
      <Section title="Token Lifecycle">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tokenLifecycle.map((t) => (
            <div
              key={t.icon}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {t.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{t.step}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- MFA Types ---- */}
      <Section title="Multi-Factor Authentication Types">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          MFA should be phishing-resistant. Prefer passkeys over TOTP over SMS. Never use email as a second factor — it is already the primary channel.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {mfaTypes.map((m) => (
            <div
              key={m.type}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `6px solid ${m.color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>{m.type}</span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    background: m.color,
                    color: '#FFFFFF',
                  }}
                >
                  {m.strength}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, marginBottom: 6, lineHeight: 1.4 }}>{m.desc}</p>
              <div style={{ fontSize: 11, color: m.phishingResistant ? 'var(--color-success)' : 'var(--color-text-muted)', fontWeight: 500 }}>
                Phishing-resistant: {m.phishingResistant ? 'Yes' : 'No'}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Refresh Token Rotation ---- */}
      <Section title="Refresh Token Rotation">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Each refresh issues a new access token AND a new refresh token. Reuse of an old refresh token signals compromise — revoke the entire token family.
        </p>
        <CodeBlock>{`async function rotateRefresh(oldToken: string): Promise<Result<TokenPair, AuthError>> {
  const record = await db.findRefreshToken(oldToken);

  if (!record || record.usedAt) {
    // Token reuse detected — revoke entire family
    await db.revokeTokenFamily(record.familyId);
    return Err(new AuthError('Token reuse detected'));
  }

  await db.markUsed(oldToken);
  const newAccess = await issueAccessToken(record.userId);
  const newRefresh = await issueRefreshToken(record.userId, record.familyId);
  return Ok({ access: newAccess, refresh: newRefresh });
}`}</CodeBlock>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Route Protection',
              checks: [
                'All routes authenticated by default',
                'Public routes explicitly listed (small allow list)',
                'Dev bypass guarded by NODE_ENV check',
              ],
            },
            {
              category: 'Token Management',
              checks: [
                'Access tokens expire within 60 minutes',
                'Refresh tokens expire within 30 days',
                'Logout invalidates session server-side',
              ],
            },
            {
              category: 'Brute Force Prevention',
              checks: [
                'Login rate-limited per account and per IP',
                'Token comparison uses constant-time operations',
                'Error messages do not reveal account existence',
              ],
            },
            {
              category: 'MFA & Security',
              checks: [
                'MFA available for sensitive accounts',
                'Phishing-resistant options preferred',
                'Dev bypass uses real session paths',
              ],
            },
          ].map((group) => (
            <div key={group.category}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.category}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.checks.map((check) => (
                  <div
                    key={check}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

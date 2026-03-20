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

const strideThreats = [
  { letter: 'S', name: 'Spoofing', desc: 'Pretending to be someone else', example: 'Forged auth tokens, session hijacking', defense: 'Strong auth, token validation' },
  { letter: 'T', name: 'Tampering', desc: 'Modifying data or code', example: 'Altered form data, modified cookies', defense: 'Input validation, integrity checks' },
  { letter: 'R', name: 'Repudiation', desc: 'Denying actions performed', example: '"I never published that skill"', defense: 'Audit logging, non-repudiation' },
  { letter: 'I', name: 'Info Disclosure', desc: 'Exposing sensitive data', example: 'Stack traces in errors, PII in logs', defense: 'Generic errors, log sanitisation' },
  { letter: 'D', name: 'Denial of Service', desc: 'Making service unavailable', example: 'OTP flooding, large file uploads', defense: 'Rate limiting, size limits' },
  { letter: 'E', name: 'Escalation', desc: 'Gaining unauthorized privileges', example: 'Member accessing admin routes', defense: 'Role checks in Server Actions' },
];

const defenseDepthLayers = [
  { layer: 'Edge / CDN', desc: 'Rate limiting, DDoS protection, WAF rules', color: 'var(--color-primary)' },
  { layer: 'Middleware', desc: 'Auth check, CSP headers, domain validation', color: 'var(--color-secondary)' },
  { layer: 'Server Action', desc: 'Permission checks, input validation (Zod schemas)', color: 'var(--color-brand)' },
  { layer: 'Domain Logic', desc: 'Business rule validation, authorization', color: 'var(--color-warning)' },
  { layer: 'Data Layer', desc: 'Parameterised queries, encrypted at rest', color: 'var(--color-error)' },
];

const owaspTop10 = [
  { num: 'A01', name: 'Broken Access Control', relevance: 'Role checks, Server Action auth', severity: 'Critical' },
  { num: 'A02', name: 'Cryptographic Failures', relevance: 'OTP hashing, JWT signing, HTTPS', severity: 'Critical' },
  { num: 'A03', name: 'Injection', relevance: 'SQL, XSS, command, SSRF', severity: 'Critical' },
  { num: 'A04', name: 'Insecure Design', relevance: 'Threat modelling, fail-closed', severity: 'High' },
  { num: 'A05', name: 'Security Misconfiguration', relevance: 'CSP headers, env vars, defaults', severity: 'High' },
  { num: 'A06', name: 'Vulnerable Components', relevance: 'npm audit, dependency review', severity: 'High' },
  { num: 'A07', name: 'Auth Failures', relevance: 'OTP expiry, attempt limits, session mgmt', severity: 'Critical' },
  { num: 'A08', name: 'Software/Data Integrity', relevance: 'Lock files, npm ci, provenance', severity: 'Medium' },
  { num: 'A09', name: 'Logging Failures', relevance: 'No secrets in logs, audit trail', severity: 'Medium' },
  { num: 'A10', name: 'SSRF', relevance: 'URL validation, block private ranges', severity: 'High' },
];

export function SecurityReviewShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> For input validation mechanics and rate limiting implementation, see{' '}
          <strong>backend-patterns</strong>. This skill focuses on <em>what</em> to protect and <em>why</em>. Also pairs with{' '}
          <strong>documentation-research</strong> (never send secrets in external queries) and{' '}
          <strong>frontend-architecture</strong> (component security boundaries).
        </p>
      </div>

      {/* ---- Threat Model: STRIDE ---- */}
      <Section title="STRIDE Threat Model">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Before writing security code, think in threats. STRIDE provides a systematic framework for identifying what can go wrong.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {strideThreats.map((t) => (
            <div
              key={t.letter}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'var(--color-error)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {t.letter}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>{t.name}</div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, marginBottom: 6, lineHeight: 1.4 }}>{t.desc}</p>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                <strong>Example:</strong> {t.example}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 500 }}>
                <strong>Defense:</strong> {t.defense}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Three Security Questions ---- */}
      <Section title="The Three Security Questions">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { q: 'What am I protecting?', examples: 'User data, session tokens, admin actions, financial transactions', color: 'var(--color-primary)' },
            { q: 'Who would attack it?', examples: 'Anonymous users, authenticated members, compromised deps, AI content', color: 'var(--color-warning)' },
            { q: "What's the worst outcome?", examples: 'Data leak, privilege escalation, account takeover, service disruption', color: 'var(--color-error)' },
          ].map((item) => (
            <div
              key={item.q}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${item.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: item.color, marginBottom: 12 }}>{item.q}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{item.examples}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Defense in Depth Layers ---- */}
      <Section title="Defense in Depth">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          No single layer is trusted to be the complete defense. Multiple independent layers each reduce risk. If one fails, the others still protect the system.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {defenseDepthLayers.map((layer, i) => (
            <div
              key={layer.layer}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                borderLeft: `6px solid ${layer.color}`,
                border: '1px solid var(--color-border)',
                borderLeftWidth: 6,
                borderLeftColor: layer.color,
                marginLeft: i * 16,
              }}
            >
              <div style={{ minWidth: 140 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>{layer.layer}</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{layer.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- OWASP Top 10 Grid ---- */}
      <Section title="OWASP Top 10 Relevance">
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
              gridTemplateColumns: '70px 200px 1fr 90px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>#</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Category</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Relevance to This Project</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Severity</span>
          </div>
          {owaspTop10.map((item, i) => (
            <div
              key={item.num}
              style={{
                display: 'grid',
                gridTemplateColumns: '70px 200px 1fr 90px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{item.num}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)' }}>{item.name}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.relevance}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: item.severity === 'Critical' ? 'var(--color-error)' : item.severity === 'High' ? 'var(--color-warning)' : 'var(--color-text-muted)',
                  color: '#FFFFFF',
                }}
              >
                {item.severity}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Auth/Authz Flow ---- */}
      <Section title="Authentication & Authorization Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Email OTP with domain restriction, JWT sessions, and dual-layer auth checks.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { step: 'User enters email', detail: 'Domain validation: ezycollect.com.au, ezycollect.io, sidetrade.com', secure: 'Reject invalid domains before sending OTP' },
            { step: 'OTP generated (6-digit)', detail: 'SHA-256 hash stored, never plain text', secure: 'Hash with crypto, store only the hash' },
            { step: 'Email sent via Resend', detail: '10-minute expiry, max 3 verification attempts', secure: 'Rate limit OTP requests per email per hour' },
            { step: 'User submits OTP', detail: 'Timing-safe hash comparison, constant-time', secure: 'Prevents timing attacks on verification' },
            { step: 'JWT session created', detail: 'Signed with AUTH_SECRET via jose (Edge-compatible)', secure: 'HttpOnly, Secure, SameSite=Strict cookie' },
            { step: 'Middleware checks auth', detail: 'Runs on every request, redirects to /login', secure: 'First layer: edge auth verification' },
            { step: 'Server Action re-checks', detail: 'Permission check inside the action itself', secure: 'Second layer: defense in depth' },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr 1fr',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 6,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.detail}</span>
              <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 500 }}>{s.secure}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Secrets Management Pattern ---- */}
      <Section title="Secrets Management">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct</h4>
            <CodeBlock>{`// Verify secrets at startup — fail hard
const requiredEnvVars = [
  'DATABASE_URL',
  'AUTH_SECRET',
  'ANTHROPIC_API_KEY',
] as const;

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(
      \`Missing required env var: \${key}\`
    );
  }
}

// .env.local in .gitignore
// Production secrets in Vercel only
// Different secrets per environment`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dangerous</h4>
            <CodeBlock>{`// Hardcoded in source code
const API_KEY = 'sk-ant-abc123...';

// Shared between environments
const SECRET = process.env.AUTH_SECRET
  || 'default-secret';  // fallback = insecure

// No validation — silent undefined
const db = connectToDb(process.env.DB_URL);
// DB_URL might be undefined!

// If committed to git:
// Consider it COMPROMISED.
// Rotate immediately.
// Rewriting git history is NOT enough.`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Fail Closed vs Fail Open ---- */}
      <Section title="Fail Closed, Not Open">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          When a security check fails or encounters an error, the default is to deny access — not grant it.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fail Closed (Correct)</h4>
            <CodeBlock>{`async function checkAuth(token?: string) {
  if (!token)
    return { authenticated: false };
  try {
    const session = await verifyToken(token);
    return { authenticated: true, user: session };
  } catch {
    // Verification error = DENY
    return { authenticated: false };
  }
}`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fail Open (Dangerous)</h4>
            <CodeBlock>{`async function checkAuth(token?: string) {
  try {
    return await verifyToken(token);
  } catch {
    // Error grants access!
    return defaultUser;
  }
}

// An attacker who causes a verification
// error gets full access.`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Injection Prevention ---- */}
      <Section title="Injection Prevention">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              type: 'SQL Injection',
              bad: 'String concatenation in queries',
              good: 'Parameterised queries or ORM',
              example: 'db.execute(sql`...${param}`)',
            },
            {
              type: 'XSS',
              bad: 'dangerouslySetInnerHTML without sanitisation',
              good: 'DOMPurify with explicit allowlist',
              example: 'DOMPurify.sanitize(html, { ALLOWED_TAGS })',
            },
            {
              type: 'SSRF',
              bad: 'Fetching user-provided URLs unchecked',
              good: 'Validate protocol, block private ranges',
              example: 'isAllowedUrl(url) before fetch',
            },
          ].map((inj) => (
            <div
              key={inj.type}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 10 }}>{inj.type}</div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', marginBottom: 2 }}>Vulnerable</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{inj.bad}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', marginBottom: 2 }}>Secure</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{inj.good}</span>
              </div>
              <code
                style={{
                  fontSize: 11,
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                }}
              >
                {inj.example}
              </code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Supply Chain Security ---- */}
      <Section title="Supply Chain Security">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', gap: 12 }}>
          {[
            { rule: 'npm audit regularly', desc: 'Fix critical and high vulnerabilities. Don\'t ignore audit output.' },
            { rule: 'Commit lock files', desc: 'Always commit package-lock.json. Use npm ci in CI/CD.' },
            { rule: 'Pin versions', desc: 'Exact versions for critical deps: "zod": "3.23.8" not "^3.0.0"' },
            { rule: 'Review new packages', desc: 'Check maintenance, downloads, vulnerabilities, scope before adding.' },
            { rule: 'Minimal dependencies', desc: 'Every dependency is attack surface. 20 lines of code > 1 package.' },
            { rule: 'Package provenance', desc: 'npm supports build attestation. Enable for your own packages.' },
          ].map((item) => (
            <div
              key={item.rule}
              style={{
                padding: 14,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid var(--color-warning)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{item.rule}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Security Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Secrets & Configuration',
              checks: [
                'No hardcoded secrets — all in env vars',
                '.env* files in .gitignore',
                'Missing env vars cause startup failure',
              ],
            },
            {
              category: 'Auth & Authorization',
              checks: [
                'HttpOnly; Secure; SameSite=Strict cookies',
                'Permissions checked in Server Action, not just middleware',
                'Failed auth returns deny, not default user',
                'OTP hashed, timing-safe comparison',
              ],
            },
            {
              category: 'Input & Output',
              checks: [
                'All input validated with schemas at boundary',
                'No string concatenation in DB queries',
                'URLs validated before server-side fetch',
                'Untrusted HTML sanitised before rendering',
              ],
            },
            {
              category: 'Infrastructure',
              checks: [
                'CSP without unsafe-inline / unsafe-eval',
                'npm audit clean (critical/high)',
                'Lock file committed, npm ci in CI/CD',
                'New deps reviewed before adding',
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

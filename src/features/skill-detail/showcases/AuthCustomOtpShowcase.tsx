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
const otpFlowSteps = [
  { step: 'User enters email', detail: 'Email normalized to lowercase, domain validated against allow-list', secure: 'Reject unauthorized domains before any OTP generation', color: 'var(--color-primary)' },
  { step: 'OTP generated', detail: '6-digit code via crypto.randomInt(0, 1_000_000) — zero-padded', secure: 'Cryptographically secure — never Math.random', color: 'var(--color-primary)' },
  { step: 'OTP hashed', detail: 'SHA-256 hash stored in verification_tokens table', secure: 'Plain code is NEVER persisted — only the hash', color: 'var(--color-warning)' },
  { step: 'Email sent', detail: 'Plain OTP sent to user via email provider (Mailgun, Resend)', secure: '10-minute expiry, max 3 verification attempts', color: 'var(--color-primary)' },
  { step: 'User submits code', detail: 'Submitted code is hashed and compared against stored hash', secure: 'Attempt counter incremented on every check', color: 'var(--color-primary)' },
  { step: 'Session created', detail: 'JWT signed with jose, set in httpOnly cookie', secure: 'HttpOnly, Secure, SameSite=Lax — 7-day expiry', color: 'var(--color-success)' },
];

const jwtLifecycle = [
  { phase: 'Create', desc: 'Sign JWT with HS256 via jose — payload: userId, email, role', timing: 'On successful OTP verification' },
  { phase: 'Store', desc: 'Set in httpOnly cookie — never exposed to client JS', timing: 'Immediately after creation' },
  { phase: 'Verify (Edge)', desc: 'Lightweight jwtVerify in middleware — just check validity', timing: 'Every request (Edge Runtime)' },
  { phase: 'Verify (Node)', desc: 'Full getSession() in Server Actions — extract payload', timing: 'Before mutations/sensitive reads' },
  { phase: 'Expire', desc: '7-day maxAge — user must re-authenticate after', timing: 'Automatic via cookie expiry' },
  { phase: 'Destroy', desc: 'Delete cookie on logout — immediate invalidation', timing: 'User-initiated logout' },
];

const domainRestriction = [
  { domain: 'ezycollect.com.au', status: 'Allowed', desc: 'Primary company domain' },
  { domain: 'ezycollect.io', status: 'Allowed', desc: 'Secondary domain' },
  { domain: 'sidetrade.com', status: 'Allowed', desc: 'Parent company domain' },
  { domain: 'gmail.com', status: 'Rejected', desc: 'Personal email — not authorized' },
  { domain: 'competitor.com', status: 'Rejected', desc: 'External — not authorized' },
];

const securityChecks = [
  { check: 'Hash before store', what: 'SHA-256 hash of OTP', why: 'Database breach does not reveal codes' },
  { check: 'Expiry enforced', what: '10-minute TTL on tokens', why: 'Stale codes cannot be used' },
  { check: 'Attempt limiting', what: 'Max 3 per token', why: 'Prevents brute-force of 6-digit codes' },
  { check: 'Domain validation', what: 'Allow-list before OTP send', why: 'No resources wasted on unauthorized emails' },
  { check: 'Cleanup on use', what: 'Delete token after verification', why: 'Prevents token replay' },
  { check: 'Edge-compatible JWT', what: 'jose library (not jsonwebtoken)', why: 'Works in Vercel Edge Runtime middleware' },
];

export function AuthCustomOtpShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Implementation skill for authentication.</strong> Read <strong>authentication</strong> first for principles on session management.
          For managed auth, see <strong>auth-clerk</strong>. For role-based access control, see <strong>authz-rbac-drizzle</strong>.
        </p>
      </div>

      {/* ---- OTP Flow Diagram ---- */}
      <Section title="OTP Flow: Request → Hash → Verify">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {otpFlowSteps.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr 1fr',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 8,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                borderLeft: `6px solid ${s.color}`,
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

      {/* ---- OTP Generation & Hashing ---- */}
      <Section title="OTP Generation & Hashing">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct</h4>
            <CodeBlock>{`import crypto from "crypto";

// Cryptographically secure generation
export function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000)
    .toString()
    .padStart(6, "0");
}

// SHA-256 hash before storage
export function hashOtp(otp: string): string {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dangerous</h4>
            <CodeBlock>{`// Math.random is NOT cryptographically secure
const otp = Math.floor(Math.random() * 999999)
  .toString();

// Storing plain OTP in the database
await db.insert(tokens).values({
  email,
  code: otp,     // PLAIN TEXT!
  expiresAt,
});

// Database breach reveals all active codes
// Attacker can use them before they expire`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Domain Restriction ---- */}
      <Section title="Domain Restriction">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Validate the email domain before generating and sending the OTP. This is a business rule, not a security boundary — always combine with proper authorization.
        </p>
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
              gridTemplateColumns: '200px 100px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Domain</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Status</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Reason</span>
          </div>
          {domainRestriction.map((d, i) => (
            <div
              key={d.domain}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 100px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-heading)' }}>@{d.domain}</code>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: d.status === 'Allowed' ? 'var(--color-success)' : 'var(--color-error)',
                  color: '#FFFFFF',
                  display: 'block',
                }}
              >
                {d.status}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{d.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- JWT Lifecycle ---- */}
      <Section title="JWT Session Lifecycle">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Sessions use jose (Edge-compatible). Do NOT use jsonwebtoken — it only works in Node.js and fails in Vercel Edge middleware.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {jwtLifecycle.map((j) => (
            <div
              key={j.phase}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 8 }}>{j.phase}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, marginBottom: 6, lineHeight: 1.4 }}>{j.desc}</p>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{j.timing}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Cookie Configuration ---- */}
      <Section title="Cookie Configuration">
        <CodeBlock>{`import { cookies } from "next/headers";

export async function setSessionCookie(jwt: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", jwt, {
    httpOnly: true,                                // No client JS access
    secure: process.env.NODE_ENV === "production", // HTTPS only in prod
    sameSite: "lax",                               // CSRF protection
    path: "/",                                     // Available on all routes
    maxAge: 60 * 60 * 24 * 7,                      // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}`}</CodeBlock>
      </Section>

      {/* ---- Security Checklist ---- */}
      <Section title="Security Checks">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {securityChecks.map((s) => (
            <div
              key={s.check}
              style={{
                padding: 14,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: '4px solid var(--color-primary)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{s.check}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, marginBottom: 4, lineHeight: 1.4 }}>{s.what}</p>
              <div style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 500 }}>{s.why}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Database Schema ---- */}
      <Section title="Database Schema">
        <CodeBlock>{`// verification_tokens — stores hashed OTPs
export const verificationTokens = pgTable("verification_tokens", {
  id:        uuid("id").defaultRandom().primaryKey(),
  email:     text("email").notNull(),
  token:     text("token").notNull(),         // SHA-256 hash
  expiresAt: timestamp("expires_at").notNull(),
  attempts:  integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// users — accounts created on first successful OTP
export const users = pgTable("users", {
  id:        uuid("id").defaultRandom().primaryKey(),
  email:     text("email").notNull().unique(),
  name:      text("name"),
  role:      text("role", { enum: ["admin", "member"] })
               .default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});`}</CodeBlock>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'OTP Security',
              checks: [
                'OTPs generated with crypto.randomInt',
                'SHA-256 hashed before storage — never plain text',
                'Expiry enforced (10 min) + attempt limit (3)',
                'Used tokens deleted after verification',
              ],
            },
            {
              category: 'Session Management',
              checks: [
                'JWT created with jose (Edge-compatible)',
                'Cookie: httpOnly, secure (prod), sameSite lax',
                'AUTH_SECRET minimum 32 characters',
                'Middleware protects all non-public routes',
              ],
            },
            {
              category: 'Domain & Email',
              checks: [
                'Domain allow-list blocks unauthorized emails',
                'Validation happens before OTP generation',
                'Email normalized to lowercase',
              ],
            },
            {
              category: 'Development',
              checks: [
                'Dev mode bypasses auth entirely',
                'Separate from production flow',
                'Still exercises session code paths',
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

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

const parityChecklist = [
  { item: 'Same database engine', dev: 'Local Postgres / Docker', prod: 'Neon / RDS / Cloud SQL', status: 'match' },
  { item: 'Same framework runtime', dev: 'Next.js dev server', prod: 'Next.js on Vercel', status: 'match' },
  { item: 'Same Node.js version', dev: '.nvmrc / .node-version', prod: 'Engine field in package.json', status: 'match' },
  { item: 'Real file storage', dev: 'Local filesystem fallback', prod: 'Vercel Blob / S3', status: 'fallback' },
  { item: 'Real email delivery', dev: 'Console log fallback', prod: 'Mailgun / Resend', status: 'fallback' },
  { item: 'Real auth flow', dev: 'Dev user bypass', prod: 'Full OTP / OAuth', status: 'fallback' },
];

const statusColors: Record<string, string> = {
  match: 'var(--color-success)',
  fallback: 'var(--color-warning)',
};

const fallbackTable = [
  { service: 'Database', production: 'Cloud-hosted (Neon, RDS)', fallback: 'Local Postgres or Docker', trigger: 'Different DATABASE_URL', color: 'var(--color-primary)' },
  { service: 'File Storage', production: 'Object storage (S3, Blob)', fallback: './tmp/uploads/ directory', trigger: 'Missing storage token', color: 'var(--color-secondary)' },
  { service: 'Email', production: 'Transactional email API', fallback: 'Console log + local file', trigger: 'Missing email API key', color: 'var(--color-brand)' },
  { service: 'Auth', production: 'Full OTP/OAuth flow', fallback: 'Auto-authenticated dev user', trigger: 'NODE_ENV === development', color: 'var(--color-warning)' },
  { service: 'External APIs', production: 'Live endpoints', fallback: 'Canned/stub responses', trigger: 'Missing API key', color: 'var(--color-success)' },
];

const envVarTypes = [
  { type: 'Required', description: 'App cannot start without these', examples: ['DATABASE_URL', 'AUTH_SECRET'], color: 'var(--color-error)' },
  { type: 'Optional', description: 'Graceful fallback when missing', examples: ['BLOB_TOKEN', 'RESEND_API_KEY', 'MAILGUN_API_KEY'], color: 'var(--color-warning)' },
  { type: 'Dev-only', description: 'Only used in development', examples: ['SKIP_AUTH', 'DEBUG_LEVEL'], color: 'var(--color-success)' },
];

const bootstrapSteps = [
  { step: 1, label: 'git clone', desc: 'Clone the repository', time: '10s' },
  { step: 2, label: 'cp .env.example .env.local', desc: 'Copy env template, fill in secrets', time: '30s' },
  { step: 3, label: 'npm install', desc: 'Install dependencies', time: '60s' },
  { step: 4, label: 'npm run db:migrate', desc: 'Run database migrations', time: '5s' },
  { step: 5, label: 'npm run db:seed', desc: 'Seed development data', time: '10s' },
  { step: 6, label: 'npm run dev', desc: 'Start dev server', time: '5s' },
];

const seedPrinciples = [
  { principle: 'Idempotent', desc: 'Running seeds twice produces the same state (upsert, not insert)', icon: 'R' },
  { principle: 'Fast', desc: 'Under 10 seconds for the full dataset', icon: 'F' },
  { principle: 'Representative', desc: 'Covers all user roles, content states, and edge cases', icon: 'D' },
  { principle: 'No Network', desc: 'Seeds use local data factories, never fetch from external services', icon: 'L' },
  { principle: 'Documented', desc: 'What the seed creates and how to run it', icon: 'D' },
];

export function LocalDevelopmentShowcase() {
  return (
    <div>
      {/* ---- Goal Banner ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Goal:</strong> New developer goes from <code style={{ fontSize: 12, padding: '1px 4px', borderRadius: 3, background: 'var(--color-bg-alt)' }}>git clone</code> to running app in under <strong>5 minutes</strong>. One command to start. Dev/prod parity is the target.
        </p>
      </div>

      {/* ---- Dev/Prod Parity Checklist ---- */}
      <Section title="Dev/Prod Parity Checklist">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Run the same engines locally. Mocking Postgres with SQLite creates bugs you only discover in production.
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
              gridTemplateColumns: '1fr 1fr 1fr 80px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Concern</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Development</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Production</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Parity</span>
          </div>
          {parityChecklist.map((p, i) => (
            <div
              key={p.item}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 80px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{p.item}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{p.dev}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{p.prod}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    background: statusColors[p.status],
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                  }}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Service Fallback Table ---- */}
      <Section title="Service Fallback Table">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          When a cloud service is not configured, degrade gracefully. Development keeps moving without cloud credentials.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fallbackTable.map((f) => (
            <div
              key={f.service}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `4px solid ${f.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{f.service}</span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, background: 'var(--color-bg-alt)' }}>{f.trigger}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 24px 1fr', gap: 8, alignItems: 'center' }}>
                <div style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Production</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{f.production}</div>
                </div>
                <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--color-text-muted)' }}>{'>'}</div>
                <div style={{ padding: '8px 12px', borderRadius: 6, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Local Fallback</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{f.fallback}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Environment Variable Management ---- */}
      <Section title="Environment Variable Management">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {envVarTypes.map((t) => (
            <div
              key={t.type}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${t.color}`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: t.color, marginBottom: 8 }}>{t.type}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>{t.description}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {t.examples.map((ex) => (
                  <code
                    key={ex}
                    style={{
                      fontSize: 11,
                      fontFamily: 'monospace',
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: 'var(--color-bg-alt)',
                      color: 'var(--color-text-body)',
                    }}
                  >
                    {ex}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </div>
        <CodeBlock>{`.env.example  — committed, placeholder values, explains each variable
.env.local    — gitignored, developer's actual values
Validation    — startup checks required vars, logs missing optional ones`}</CodeBlock>
      </Section>

      {/* ---- One-Command Bootstrap Flow ---- */}
      <Section title="One-Command Bootstrap Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Target: clone to running app in under 5 minutes. Every step should take seconds, not minutes.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {bootstrapSteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                borderRadius: 8,
                background: i === bootstrapSteps.length - 1 ? 'var(--color-primary)' : 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: i === bootstrapSteps.length - 1 ? 'rgba(255,255,255,0.2)' : 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <code
                style={{
                  fontSize: 13,
                  fontFamily: 'monospace',
                  color: i === bootstrapSteps.length - 1 ? '#FFFFFF' : 'var(--color-text-heading)',
                  fontWeight: 600,
                  minWidth: 240,
                }}
              >
                {s.label}
              </code>
              <span style={{ fontSize: 12, color: i === bootstrapSteps.length - 1 ? 'rgba(255,255,255,0.8)' : 'var(--color-text-muted)', flex: 1 }}>{s.desc}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: i === bootstrapSteps.length - 1 ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)', fontFamily: 'monospace' }}>{s.time}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Seed Data Principles ---- */}
      <Section title="Seed Data Principles">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))', gap: 12 }}>
          {seedPrinciples.map((p) => (
            <div
              key={p.principle}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  margin: '0 auto 8px',
                }}
              >
                {p.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{p.principle}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            'Clone to running app in under 5 minutes',
            'npm run dev starts with no extra steps',
            'Required env vars fail fast with clear errors',
            'Optional services degrade gracefully',
            'Seed data runs in under 10 seconds',
            'All dev bypasses gated on NODE_ENV',
            '.env.example documents every variable',
            'README covers setup and troubleshooting',
          ].map((item) => (
            <div
              key={item}
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
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

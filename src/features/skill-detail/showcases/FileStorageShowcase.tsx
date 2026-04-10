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

const validationPipeline = [
  { step: 'File received', detail: 'Browser submits file via FormData or drag-and-drop', color: 'var(--color-text-muted)' },
  { step: 'Size check', detail: 'Enforce server-side size limits before any processing', color: 'var(--color-primary)' },
  { step: 'Magic bytes', detail: 'Read first bytes to detect true MIME type (not just extension)', color: 'var(--color-primary)' },
  { step: 'Extension match', detail: 'Verify extension matches detected content type', color: 'var(--color-warning)' },
  { step: 'Sanitize name', detail: 'Replace user filename with UUID, store original in metadata', color: 'var(--color-warning)' },
  { step: 'Store', detail: 'Upload to object storage with correct content type', color: 'var(--color-primary)' },
  { step: 'Record metadata', detail: 'Save URL, original name, size, owner in database', color: 'var(--color-primary-muted)' },
];

const cdnFlow = [
  { from: 'User', to: 'CDN Edge', label: 'GET /image.webp', type: 'request' },
  { from: 'CDN Edge', to: 'User', label: 'Cache HIT: 200 (cached)', type: 'hit' },
  { from: 'CDN Edge', to: 'Origin Storage', label: 'Cache MISS: fetch from origin', type: 'miss' },
  { from: 'Origin Storage', to: 'CDN Edge', label: 'Return file + cache headers', type: 'response' },
  { from: 'CDN Edge', to: 'User', label: 'Cached copy served globally', type: 'hit' },
];

const signedUrlLifecycle = [
  { phase: 'Request', desc: 'Client requests download via API', time: 'T+0' },
  { phase: 'Auth check', desc: 'Server verifies user has permission to access file', time: 'T+0' },
  { phase: 'Generate URL', desc: 'Server creates signed URL with TTL (15-60 min)', time: 'T+0' },
  { phase: 'Redirect', desc: 'Client receives signed URL and downloads directly', time: 'T+1s' },
  { phase: 'URL active', desc: 'Signed URL works for any request during TTL window', time: 'T+0 to T+TTL' },
  { phase: 'URL expires', desc: 'After TTL, URL returns 403 Forbidden', time: 'T+TTL' },
];

const sizeFormatConstraints = [
  { category: 'Images', maxSize: '5 MB', formats: '.jpg, .png, .webp, .avif', optimize: 'Resize to 200/800/1600px, strip EXIF' },
  { category: 'Documents', maxSize: '10 MB', formats: '.pdf, .md, .txt', optimize: 'No processing needed' },
  { category: 'Archives', maxSize: '50 MB', formats: '.zip', optimize: 'Validate structure, scan contents' },
  { category: 'Exports', maxSize: '100 MB', formats: '.zip, .csv', optimize: 'TTL cleanup (24-48 hours)' },
];

const storageTiers = [
  { tier: 'Object Storage', useCase: 'User uploads, generated files, backups', access: 'Write once, read occasionally', cost: 'Low storage, pay per request' },
  { tier: 'CDN', useCase: 'Public assets, images, downloads', access: 'Read-heavy, globally distributed', cost: 'Low latency, bandwidth costs' },
  { tier: 'Local Filesystem', useCase: 'Development only', access: 'Immediate, no network', cost: 'Free, not durable' },
  { tier: 'Database (metadata)', useCase: 'File records, references', access: 'Queried with app data', cost: 'Part of DB cost' },
];

const accessPatterns = [
  { pattern: 'Public', url: 'Permanent CDN URL', auth: 'None required', example: 'Marketing assets, profile images', color: 'var(--color-primary)' },
  { pattern: 'Signed URL', url: 'Time-limited (15-60 min)', auth: 'Permission check before generating', example: 'User documents, generated reports', color: 'var(--color-warning)' },
  { pattern: 'Auth Proxy', url: 'Server streams file', auth: 'Auth check on every request', example: 'Sensitive documents, non-shareable', color: 'var(--color-primary-muted)' },
];

export function FileStorageShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This is the conceptual foundation for file management. For implementation,
          see <strong>storage-vercel-blob</strong> (Vercel Blob) or <strong>db-supabase</strong> (Supabase Storage).
          Never store file content in SQL columns — always use object storage.
        </p>
      </div>

      {/* ---- Upload Validation Pipeline ---- */}
      <Section title="Upload Validation Pipeline">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Validate before storing. Reject invalid files at the edge — never store first and validate later.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {validationPipeline.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                borderRadius: 8,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                borderLeftWidth: 6,
                borderLeftColor: s.color,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: s.color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <CodeBlock>{`const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png':  [0x89, 0x50, 0x4E, 0x47],
  'application/pdf': [0x25, 0x50, 0x44, 0x46],
};

function detectMimeType(buffer: Uint8Array): string | null {
  for (const [mime, bytes] of Object.entries(MAGIC_BYTES)) {
    if (bytes.every((b, i) => buffer[i] === b)) return mime;
  }
  return null;
}`}</CodeBlock>
      </Section>

      {/* ---- CDN Flow ---- */}
      <Section title="CDN Delivery Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Storage is cheap; bandwidth is not. Use CDN caching to reduce origin bandwidth and serve files globally.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {cdnFlow.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 24px 140px 1fr',
                gap: 12,
                padding: '12px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{f.from}</span>
              <span style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'center' }}>&rarr;</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{f.to}</span>
              <span
                style={{
                  fontSize: 12,
                  color: f.type === 'hit' ? 'var(--color-primary)' : f.type === 'miss' ? 'var(--color-warning)' : 'var(--color-text-body)',
                  fontWeight: f.type === 'hit' ? 600 : 400,
                }}
              >
                {f.label}
              </span>
            </div>
          ))}
        </div>

        {/* ---- Storage Tiers ---- */}
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
              gridTemplateColumns: '140px 1fr 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Tier</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Use Case</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Access Pattern</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Cost Profile</span>
          </div>
          {storageTiers.map((t, i) => (
            <div
              key={t.tier}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{t.tier}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t.useCase}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.access}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.cost}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Signed URL Lifecycle ---- */}
      <Section title="Signed URL Lifecycle">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Private files use signed URLs with short TTLs. Auth-gated downloads verify permissions before generating the URL.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {signedUrlLifecycle.map((s, i) => (
            <div
              key={s.phase}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 140px',
                gap: 12,
                padding: '12px 20px',
                borderRadius: 8,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.phase}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.desc}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace', textAlign: 'right' }}>{s.time}</span>
            </div>
          ))}
        </div>

        {/* ---- Access Patterns ---- */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {accessPatterns.map((p) => (
            <div
              key={p.pattern}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${p.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: p.color, marginBottom: 8 }}>{p.pattern}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 6 }}>{p.url}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>{p.auth}</div>
              <code
                style={{
                  fontSize: 10,
                  padding: '3px 6px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {p.example}
              </code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Size/Format Constraints ---- */}
      <Section title="Size & Format Constraints">
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 80px 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Category</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Max Size</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Formats</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Optimization</span>
          </div>
          {sizeFormatConstraints.map((c, i) => (
            <div
              key={c.category}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 80px 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{c.category}</span>
              <span style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'monospace' }}>{c.maxSize}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{c.formats}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.optimize}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Dev Mode Abstraction ---- */}
      <Section title="Storage Abstraction (Dev Fallback)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          When cloud storage is not configured, fall back to local filesystem. Same API, different backend.
        </p>
        <CodeBlock>{`interface StorageProvider {
  put(key: string, data: Buffer, mime: string): Promise<{ url: string }>;
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
}

// Choose provider based on credentials
const storage: StorageProvider = process.env.BLOB_TOKEN
  ? new BlobStorage(process.env.BLOB_TOKEN)
  : new LocalStorage('./tmp/uploads');

// Both providers expose the same interface
// Dev and prod code is identical`}</CodeBlock>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="File Storage Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Upload & Validation',
              checks: [
                'File type validated by content (magic bytes)',
                'Size limits enforced server-side before storage',
                'Storage keys are collision-proof (UUID or hash)',
                'Images optimized and served in responsive variants',
              ],
            },
            {
              category: 'Access & Lifecycle',
              checks: [
                'Private files use signed URLs with TTL',
                'Public files served via CDN',
                'Orphaned file cleanup on delete or schedule',
                'Local dev works without cloud credentials',
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

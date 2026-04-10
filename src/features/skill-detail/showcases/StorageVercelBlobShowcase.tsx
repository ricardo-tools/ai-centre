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

const serverUploadSteps = [
  { step: 'Client submits', detail: 'FormData sent to Server Action via fetch or form submission', color: 'var(--color-text-muted)' },
  { step: 'Server validates', detail: 'Check file size, type, permissions before upload', color: 'var(--color-primary)' },
  { step: 'put() to Blob', detail: 'Server uploads Buffer to Vercel Blob with addRandomSuffix', color: 'var(--color-primary)' },
  { step: 'CDN URL returned', detail: 'blob.url is a public CDN URL for immediate access', color: 'var(--color-primary)' },
  { step: 'Save to DB', detail: 'Store blob URL + metadata (size, type, owner) in database', color: 'var(--color-primary-muted)' },
];

const clientUploadSteps = [
  { step: 'User selects file', detail: 'File picker or drag-and-drop in the browser', color: 'var(--color-text-muted)' },
  { step: 'Token request', detail: 'Browser calls /api/upload to get a signed upload token', color: 'var(--color-warning)' },
  { step: 'Auth check', detail: 'onBeforeGenerateToken validates user session and permissions', color: 'var(--color-warning)' },
  { step: 'Direct upload', detail: 'Browser uploads directly to Vercel Blob (bypasses server)', color: 'var(--color-primary)' },
  { step: 'Completion hook', detail: 'onUploadCompleted saves blob URL to database', color: 'var(--color-primary-muted)' },
];

const accessControlProxy = [
  { step: 'Client requests', path: 'GET /api/download/{id}', detail: 'User requests file download' },
  { step: 'Auth check', path: 'getSession()', detail: 'Verify user is authenticated' },
  { step: 'Permission check', path: 'getProject(id)', detail: 'Verify user owns the resource' },
  { step: 'Fetch blob', path: 'fetch(project.blobUrl)', detail: 'Server fetches from Vercel Blob' },
  { step: 'Stream response', path: 'new NextResponse(body)', detail: 'Stream file to client with correct headers' },
];

const sizeLimits = [
  { limit: 'Server upload max', value: '500 MB', note: 'Per-file limit for server-side put()' },
  { limit: 'Client upload max', value: '500 MB', note: 'Per-file limit for browser upload()' },
  { limit: 'Free tier storage', value: '1 GB', note: 'Total blob store size on free plan' },
  { limit: 'Recommended app limit', value: '50 MB', note: 'Enforce in onBeforeGenerateToken' },
];

const devFallbackFlow = [
  { condition: 'BLOB_READ_WRITE_TOKEN set', action: 'Use real Vercel Blob', provider: 'BlobStorage', url: 'https://{store-id}.public.blob.vercel-storage.com/...' },
  { condition: 'Token not set', action: 'Fall back to local filesystem', provider: 'LocalStorage', url: 'http://localhost:3000/api/local-blob/...' },
];

const blobOperations = [
  { op: 'put()', desc: 'Upload file', returns: '{ url, pathname, contentType }', note: 'Use addRandomSuffix: true' },
  { op: 'del()', desc: 'Delete by URL', returns: 'void', note: 'Accepts single URL or array' },
  { op: 'list()', desc: 'List blobs', returns: '{ blobs, cursor, hasMore }', note: 'Paginated, filter by prefix' },
  { op: 'head()', desc: 'Get metadata', returns: '{ size, contentType, uploadedAt }', note: 'No download, metadata only' },
];

export function StorageVercelBlobShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Read <strong>file-storage</strong> first for storage design principles.
          This skill implements those concepts with Vercel Blob. All uploaded blobs are public by default —
          use an access-control proxy for sensitive documents.
        </p>
      </div>

      {/* ---- Server vs Client Upload Paths ---- */}
      <Section title="Server Upload Path">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          The most common pattern. Server receives data via Server Action and uploads to blob storage.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {serverUploadSteps.map((s, i) => (
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
        <CodeBlock>{`import { put } from "@vercel/blob";

export async function uploadProjectZip(
  filename: string, zipBuffer: Buffer
): Promise<string> {
  const blob = await put(filename, zipBuffer, {
    access: "public",
    contentType: "application/zip",
    addRandomSuffix: true, // Prevent collisions
  });
  return blob.url;
}`}</CodeBlock>
      </Section>

      <Section title="Client Upload Path">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          For user-initiated uploads. Browser uploads directly to Vercel Blob, bypassing the server as a bottleneck.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {clientUploadSteps.map((s, i) => (
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-warning)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Token Endpoint (Server)</h4>
            <CodeBlock>{`// src/app/api/upload/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  return handleUpload({
    body, request,
    onBeforeGenerateToken: async () => ({
      allowedContentTypes: [
        "application/zip",
        "image/png",
      ],
      maximumSizeInBytes: 50 * 1024 * 1024,
    }),
    onUploadCompleted: async ({ blob }) => {
      // Save blob.url to database
    },
  });
}`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Browser Upload</h4>
            <CodeBlock>{`import { upload } from "@vercel/blob/client";

async function handleUpload(file: File) {
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
  // blob.url is ready for use
  return blob.url;
}

// URL pattern:
// https://{store-id}
//   .public.blob.vercel-storage.com
//   /projects/my-file-x7f9k2.zip`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Access Control Proxy ---- */}
      <Section title="Access Control Proxy">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Vercel Blob URLs are public. For access-controlled downloads, use a server-side proxy that checks auth
          before streaming the file.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {accessControlProxy.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 200px 1fr',
                gap: 12,
                padding: '12px 20px',
                borderRadius: 8,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</span>
              <code style={{ fontSize: 11, color: 'var(--color-primary)' }}>{s.path}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.detail}</span>
            </div>
          ))}
        </div>

        {/* ---- Blob API Operations ---- */}
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
              gridTemplateColumns: '80px 120px 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>API</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Description</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Returns</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Note</span>
          </div>
          {blobOperations.map((op, i) => (
            <div
              key={op.op}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 120px 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>{op.op}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-heading)' }}>{op.desc}</span>
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{op.returns}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{op.note}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Size Limits ---- */}
      <Section title="Size Limits">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {sizeLimits.map((l) => (
            <div
              key={l.limit}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6 }}>{l.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{l.limit}</div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{l.note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Dev Fallback Flow ---- */}
      <Section title="Dev Fallback Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          When BLOB_READ_WRITE_TOKEN is not set, fall back to local filesystem storage. Same API, different backend.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {devFallbackFlow.map((f) => (
            <div
              key={f.condition}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${f.provider === 'BlobStorage' ? 'var(--color-primary)' : 'var(--color-warning)'}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>{f.condition}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 6 }}>{f.action}</div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)' }}>Provider: </span>
                <code style={{ fontSize: 11, color: 'var(--color-primary)' }}>{f.provider}</code>
              </div>
              <code
                style={{
                  fontSize: 10,
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                  wordBreak: 'break-all',
                }}
              >
                {f.url}
              </code>
            </div>
          ))}
        </div>
        <CodeBlock>{`const USE_LOCAL = !process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_BLOB_DIR = path.join(process.cwd(), ".blob-storage");

export async function putBlob(
  pathname: string,
  data: Buffer,
  options: { contentType?: string }
): Promise<{ url: string }> {
  if (USE_LOCAL) {
    const filePath = path.join(LOCAL_BLOB_DIR, pathname);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
    return { url: \`http://localhost:3000/api/local-blob/\${pathname}\` };
  }
  const blob = await vercelPut(pathname, data, {
    access: "public",
    contentType: options.contentType,
  });
  return { url: blob.url };
}

// Add .blob-storage/ to .gitignore`}</CodeBlock>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Vercel Blob Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Upload & Storage',
              checks: [
                '@vercel/blob installed, BLOB_READ_WRITE_TOKEN set',
                'Server upload with content type and random suffix',
                'Client upload with handleUpload and auth check',
                'Size limits enforced before upload',
              ],
            },
            {
              category: 'Data & Lifecycle',
              checks: [
                'Blob URLs stored in database with metadata',
                'Delete logic removes both blob and DB record',
                'Dev mode works with local fallback',
                'Access-control proxy for sensitive blobs',
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

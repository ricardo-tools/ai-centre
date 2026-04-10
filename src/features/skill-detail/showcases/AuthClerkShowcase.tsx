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
const setupSteps = [
  { step: 'Install', detail: 'npm install @clerk/nextjs', icon: '1' },
  { step: 'Environment', detail: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY + CLERK_SECRET_KEY in .env.local', icon: '2' },
  { step: 'ClerkProvider', detail: 'Wrap root layout — all pages get auth context', icon: '3' },
  { step: 'Middleware', detail: 'clerkMiddleware + createRouteMatcher protects routes', icon: '4' },
  { step: 'Sign-in Pages', detail: '<SignIn /> and <SignUp /> components on dedicated routes', icon: '5' },
  { step: 'Webhook Sync', detail: 'Clerk user events synced to local DB via /api/webhooks/clerk', icon: '6' },
];

const middlewareChain = [
  { layer: 'Request arrives', desc: 'Every request hits middleware.ts first', color: 'var(--color-text-muted)' },
  { layer: 'Static file check', desc: 'Skip _next, images, favicon — no auth needed', color: 'var(--color-border)' },
  { layer: 'Public route match', desc: 'createRouteMatcher checks /, /sign-in, /sign-up, /api/webhooks', color: 'var(--color-primary)' },
  { layer: 'auth.protect()', desc: 'Non-public routes require valid Clerk session', color: 'var(--color-warning)' },
  { layer: 'Authenticated request', desc: 'Request proceeds to page/API with auth context available', color: 'var(--color-success)' },
];

const webhookEvents = [
  { event: 'user.created', action: 'INSERT into local users table', fields: 'clerkId, email, name, avatarUrl', color: 'var(--color-success)' },
  { event: 'user.updated', action: 'UPDATE local users table', fields: 'email, name, avatarUrl', color: 'var(--color-primary)' },
  { event: 'user.deleted', action: 'DELETE from local users table', fields: 'Match by clerkId', color: 'var(--color-error)' },
];

const components = [
  { name: '<SignIn />', purpose: 'Drop-in sign-in form with all configured strategies', where: '/sign-in/[[...sign-in]]/page.tsx' },
  { name: '<SignUp />', purpose: 'Drop-in sign-up form with email/social options', where: '/sign-up/[[...sign-up]]/page.tsx' },
  { name: '<UserButton />', purpose: 'Avatar dropdown with sign-out and profile link', where: 'Header/nav bar' },
  { name: '<UserProfile />', purpose: 'Full profile management page', where: '/profile or modal' },
  { name: '<OrganizationSwitcher />', purpose: 'Org picker for multi-tenant apps', where: 'Sidebar/header' },
];

const authAccess = [
  { context: 'Server Component', method: 'auth(), currentUser()', from: '@clerk/nextjs/server', note: 'Async — await before use' },
  { context: 'Server Action', method: 'auth()', from: '@clerk/nextjs/server', note: 'Check userId before mutations' },
  { context: 'API Route', method: 'auth()', from: '@clerk/nextjs/server', note: 'Return 401 if no userId' },
  { context: 'Client Component', method: 'useAuth(), useUser()', from: '@clerk/nextjs', note: 'Never import from /server' },
];

const envVars = [
  { name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', scope: 'Client + Server', sensitive: false, desc: 'Publishable key — safe to expose to browser' },
  { name: 'CLERK_SECRET_KEY', scope: 'Server only', sensitive: true, desc: 'Secret key — NEVER use NEXT_PUBLIC_ prefix' },
  { name: 'CLERK_WEBHOOK_SECRET', scope: 'Server only', sensitive: true, desc: 'Svix signature verification for webhooks' },
  { name: 'NEXT_PUBLIC_CLERK_SIGN_IN_URL', scope: 'Client + Server', sensitive: false, desc: 'Custom sign-in page path' },
  { name: 'NEXT_PUBLIC_CLERK_SIGN_UP_URL', scope: 'Client + Server', sensitive: false, desc: 'Custom sign-up page path' },
];

export function AuthClerkShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Implementation skill for authentication.</strong> Read <strong>authentication</strong> first for principles on session management
          and auth flow design. For role-based access, see <strong>authz-rbac-drizzle</strong>.
        </p>
      </div>

      {/* ---- Setup Flow ---- */}
      <Section title="Clerk Setup Flow">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {setupSteps.map((s) => (
            <div
              key={s.icon}
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
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Middleware Chain ---- */}
      <Section title="Middleware Chain">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Every request flows through the middleware chain. Public routes are explicitly listed; everything else requires authentication.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {middlewareChain.map((m, i) => (
            <div
              key={m.layer}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeftWidth: 6,
                borderLeftColor: m.color,
                marginLeft: i * 12,
              }}
            >
              <div style={{ minWidth: 160 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>{m.layer}</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{m.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Middleware Code ---- */}
      <Section title="Middleware Implementation">
        <CodeBlock>{`// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"
  ],
};`}</CodeBlock>
      </Section>

      {/* ---- Pre-built Components ---- */}
      <Section title="Pre-built Components">
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
              gridTemplateColumns: '160px 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Component</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Purpose</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Location</span>
          </div>
          {components.map((c, i) => (
            <div
              key={c.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{c.name}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{c.purpose}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{c.where}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Auth Access by Context ---- */}
      <Section title="Accessing Auth by Context">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {authAccess.map((a) => (
            <div
              key={a.context}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>{a.context}</div>
              <div style={{ marginBottom: 6 }}>
                <code style={{ fontSize: 12, padding: '3px 6px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-primary)', fontFamily: 'monospace' }}>
                  {a.method}
                </code>
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                from <code style={{ fontFamily: 'monospace' }}>{a.from}</code>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{a.note}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Webhook Sync Pattern ---- */}
      <Section title="Webhook Sync Pattern">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Clerk manages user data externally. To maintain a local users table for foreign keys, joins, and custom fields, sync via webhooks.
          Always verify the svix signature before processing.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {webhookEvents.map((e) => (
            <div
              key={e.event}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `4px solid ${e.color}`,
              }}
            >
              <code style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', fontFamily: 'monospace', display: 'block', marginBottom: 8 }}>
                {e.event}
              </code>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 4 }}>{e.action}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Fields: {e.fields}</div>
            </div>
          ))}
        </div>
        <CodeBlock>{`// Webhook verification pattern
import { Webhook } from "svix";

const wh = new Webhook(WEBHOOK_SECRET);
let event: ClerkUserEvent;

try {
  event = wh.verify(body, {
    "svix-id": headers.get("svix-id")!,
    "svix-timestamp": headers.get("svix-timestamp")!,
    "svix-signature": headers.get("svix-signature")!,
  }) as ClerkUserEvent;
} catch {
  return NextResponse.json(
    { error: "Invalid signature" },
    { status: 401 }
  );
}`}</CodeBlock>
      </Section>

      {/* ---- Environment Variables ---- */}
      <Section title="Environment Variables">
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
              gridTemplateColumns: '1fr 120px 80px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Variable</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Scope</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Sensitive</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Description</span>
          </div>
          {envVars.map((v, i) => (
            <div
              key={v.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 80px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>{v.name}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{v.scope}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: v.sensitive ? 'var(--color-error)' : 'var(--color-success)',
                  color: '#FFFFFF',
                  display: 'block',
                }}
              >
                {v.sensitive ? 'Yes' : 'No'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{v.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Setup & Configuration',
              checks: [
                'ClerkProvider wraps the root layout',
                'Middleware protects all non-public routes',
                'Separate Clerk instances for dev/prod',
              ],
            },
            {
              category: 'Auth Access',
              checks: [
                'auth() used in Server Components and Actions',
                'useAuth()/useUser() in Client Components only',
                'API routes check auth() before processing',
              ],
            },
            {
              category: 'Webhook Sync',
              checks: [
                'Webhook endpoint syncs to local DB',
                'Svix signature verified on every request',
                'All user events handled (created/updated/deleted)',
              ],
            },
            {
              category: 'Security',
              checks: [
                'CLERK_SECRET_KEY is server-only (no NEXT_PUBLIC_)',
                'Sign-in/sign-up pages accessible and functional',
                'UserButton or sign-out accessible on every page',
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

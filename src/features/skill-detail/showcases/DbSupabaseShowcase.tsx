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

const rlsPolicies = [
  { table: 'skills', operation: 'SELECT', role: 'Public', condition: "status = 'published'", description: 'Anyone can read published skills' },
  { table: 'skills', operation: 'INSERT', role: 'Authenticated', condition: 'auth.uid() = author_id', description: 'Users can create their own skills' },
  { table: 'skills', operation: 'UPDATE', role: 'Authenticated', condition: 'auth.uid() = author_id', description: 'Users can update their own skills' },
  { table: 'skills', operation: 'DELETE', role: 'Admin only', condition: "users.role = 'admin'", description: 'Only admins can delete skills' },
  { table: 'storage', operation: 'INSERT', role: 'Authenticated', condition: "foldername = auth.uid()", description: 'Users upload to their own folder' },
  { table: 'storage', operation: 'SELECT', role: 'Public', condition: "bucket_id = 'public'", description: 'Public bucket accessible to all' },
];

const realtimeFlowSteps = [
  { step: 'Client subscribes', detail: 'supabase.channel("skills-changes").on("postgres_changes", ...)', color: 'var(--color-primary)' },
  { step: 'Enable publication', detail: 'ALTER PUBLICATION supabase_realtime ADD TABLE skills', color: 'var(--color-text-muted)' },
  { step: 'INSERT event', detail: 'payload.new added to local state array', color: 'var(--color-primary)' },
  { step: 'UPDATE event', detail: 'Local state item replaced with payload.new', color: 'var(--color-warning)' },
  { step: 'DELETE event', detail: 'Item filtered from local state by payload.old.id', color: 'var(--color-primary-muted)' },
  { step: 'Cleanup', detail: 'supabase.removeChannel(channel) on unmount', color: 'var(--color-text-muted)' },
];

const storageBuckets = [
  { bucket: 'project-zips', access: 'Private', policy: 'Auth + owner check', maxSize: '50 MB', formats: '.zip' },
  { bucket: 'avatars', access: 'Public', policy: 'Auth for upload', maxSize: '2 MB', formats: '.jpg, .png, .webp' },
  { bucket: 'skill-assets', access: 'Public', policy: 'Admin upload', maxSize: '10 MB', formats: '.md, .pdf, .png' },
  { bucket: 'private-files', access: 'Private', policy: 'Signed URL (1hr)', maxSize: '100 MB', formats: 'Any' },
];

const edgeFunctionFeatures = [
  { feature: 'Runtime', detail: 'Deno — runs close to the database', icon: 'D' },
  { feature: 'Auth', detail: 'Service role key for bypassing RLS', icon: 'A' },
  { feature: 'Deploy', detail: 'supabase functions deploy <name>', icon: 'R' },
  { feature: 'Invoke', detail: 'supabase.functions.invoke("name", { body })', icon: 'I' },
];

const clientTypes = [
  { type: 'Server Client', pkg: '@supabase/ssr', key: 'Anon key', rls: 'Enforced', use: 'Server Components, Server Actions, Route Handlers' },
  { type: 'Browser Client', pkg: '@supabase/ssr', key: 'Anon key', rls: 'Enforced', use: 'Client Components, realtime subscriptions' },
  { type: 'Admin Client', pkg: '@supabase/supabase-js', key: 'Service role', rls: 'Bypassed', use: 'Server-only: migrations, admin operations' },
];

export function DbSupabaseShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Read <strong>database-design</strong> first for schema design principles.
          Supabase provides database + auth + storage + realtime as a unified platform. For an alternative
          Postgres approach, see <strong>db-neon-drizzle</strong>.
        </p>
      </div>

      {/* ---- Client Architecture ---- */}
      <Section title="Client Architecture">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Supabase uses three client types. The anon key is safe for the browser because RLS restricts access.
          The service role key bypasses RLS and must be server-only.
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
              gridTemplateColumns: '140px 160px 110px 90px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Client Type</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Package</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>API Key</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>RLS</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Use Cases</span>
          </div>
          {clientTypes.map((item, i) => (
            <div
              key={item.type}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 160px 110px 90px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.type}</span>
              <code style={{ fontSize: 11, color: 'var(--color-primary)' }}>{item.pkg}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.key}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: item.rls === 'Bypassed' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  color: '#FFFFFF',
                }}
              >
                {item.rls}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.use}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- RLS Policy Matrix ---- */}
      <Section title="Row Level Security (RLS) Policy Matrix">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          RLS policies run at the database level. Every query through the anon key is filtered by these policies. Always enable RLS on every table.
        </p>
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
              gridTemplateColumns: '80px 80px 120px 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Table</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Op</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Role</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Condition</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Description</span>
          </div>
          {rlsPolicies.map((p, i) => (
            <div
              key={`${p.table}-${p.operation}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 80px 120px 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{p.table}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: p.operation === 'SELECT' ? 'var(--color-primary)' : p.operation === 'DELETE' ? 'var(--color-primary-muted)' : 'var(--color-warning)',
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                {p.operation}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{p.role}</span>
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{p.condition}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{p.description}</span>
            </div>
          ))}
        </div>
        <CodeBlock>{`-- Enable RLS on table
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- USING filters reads, WITH CHECK validates writes
CREATE POLICY "Users can update own skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);`}</CodeBlock>
      </Section>

      {/* ---- Realtime Subscription Flow ---- */}
      <Section title="Realtime Subscription Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Subscribe to database changes in Client Components. Clean up channels on unmount.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {realtimeFlowSteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                gap: 12,
                padding: '12px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeftWidth: 6,
                borderLeftColor: s.color,
                marginLeft: i * 12,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.detail}</span>
            </div>
          ))}
        </div>
        <CodeBlock>{`const channel = supabase
  .channel("skills-changes")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "skills" },
    (payload) => {
      if (payload.eventType === "INSERT")
        setSkills((prev) => [payload.new, ...prev]);
      if (payload.eventType === "UPDATE")
        setSkills((prev) =>
          prev.map((s) => s.id === payload.new.id ? payload.new : s)
        );
    }
  )
  .subscribe();

// Cleanup on unmount
return () => supabase.removeChannel(channel);`}</CodeBlock>
      </Section>

      {/* ---- Storage Buckets ---- */}
      <Section title="Storage Buckets">
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
              gridTemplateColumns: '140px 80px 160px 80px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Bucket</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Access</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Policy</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Max Size</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Formats</span>
          </div>
          {storageBuckets.map((b, i) => (
            <div
              key={b.bucket}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 80px 160px 80px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)' }}>{b.bucket}</code>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: 4,
                  background: b.access === 'Public' ? 'var(--color-primary)' : 'var(--color-warning)',
                  color: '#FFFFFF',
                  textAlign: 'center',
                }}
              >
                {b.access}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{b.policy}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{b.maxSize}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{b.formats}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Edge Functions ---- */}
      <Section title="Edge Functions">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Server-side logic running on Deno, close to the database. Deploy with the Supabase CLI.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {edgeFunctionFeatures.map((f) => (
            <div
              key={f.feature}
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
                  borderRadius: 8,
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 700,
                  margin: '0 auto 10px',
                }}
              >
                {f.icon}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>{f.feature}</div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{f.detail}</p>
            </div>
          ))}
        </div>
        <CodeBlock>{`// supabase/functions/generate-showcase/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const { skillId } = await req.json();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  // ... process logic
  return new Response(JSON.stringify({ success: true }));
});

// Deploy: supabase functions deploy generate-showcase`}</CodeBlock>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Supabase Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Auth & Security',
              checks: [
                'RLS enabled on every table with appropriate policies',
                'Service role key used only in server-side code',
                'Anon key for browser clients, never service role',
                'Storage buckets have RLS-like policies',
              ],
            },
            {
              category: 'Infrastructure',
              checks: [
                'Server and browser clients with cookie handling',
                'Migrations exist for all schema changes',
                'TypeScript types generated from database schema',
                'Realtime channels cleaned up on unmount',
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

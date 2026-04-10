'use client';

import { CodeBlock } from '@/platform/components/CodeBlock';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: string }) {
  return (
    <h3 style={{
      fontSize: 14,
      fontWeight: 600,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      color: 'var(--color-text-muted)',
      marginBottom: 12,
      marginTop: 24,
    }}>
      {children}
    </h3>
  );
}

function DecisionNode({ question, yes, no }: { question: string; yes: string; no: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
    }}>
      <div style={{
        padding: '10px 20px',
        borderRadius: 8,
        background: 'var(--color-bg-alt)',
        border: '2px solid var(--color-primary)',
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--color-text-heading)',
        textAlign: 'center',
        maxWidth: 220,
      }}>
        {question}
      </div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', marginBottom: 4 }}>Yes</div>
          <div style={{
            padding: '6px 12px',
            borderRadius: 6,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-success)',
            fontSize: 11,
            color: 'var(--color-text-body)',
            maxWidth: 120,
          }}>
            {yes}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 4 }}>No</div>
          <div style={{
            padding: '6px 12px',
            borderRadius: 6,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            fontSize: 11,
            color: 'var(--color-text-muted)',
            maxWidth: 120,
          }}>
            {no}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NextjsAppRouterTurbopackShowcase() {
  return (
    <div>
      {/* Companion Skills Callout */}
      <div style={{
        padding: 16,
        borderRadius: 8,
        background: 'var(--color-bg-alt)',
        border: '1px solid var(--color-border)',
        marginBottom: 32,
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>&#128279;</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>
            Companion Skills
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Use with <strong>backend-patterns</strong> (Server Actions, caching invalidation), <strong>frontend-architecture</strong> (widget/component structure), and <strong>clean-architecture</strong> (where code lives). This skill covers Next.js-specific routing, rendering, and bundling decisions.
          </div>
        </div>
      </div>

      {/* Section 1: Server vs Client Component Decision Tree */}
      <Section title="Server vs Client Component Decision Tree">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 24 }}>
          Every component is a Server Component unless it has <code style={{ fontFamily: 'monospace', fontSize: 13 }}>&apos;use client&apos;</code> at the top. Push the client boundary as far down the tree as possible.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          padding: 24,
          background: 'var(--color-surface)',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
        }}>
          <DecisionNode
            question="Does it need useState, useEffect, or useRef?"
            yes="Client Component"
            no="Keep checking &#8595;"
          />
          <DecisionNode
            question="Does it need event handlers (onClick, onChange)?"
            yes="Client Component"
            no="Keep checking &#8595;"
          />
          <DecisionNode
            question="Does it use browser APIs (localStorage, IntersectionObserver)?"
            yes="Client Component"
            no="Keep checking &#8595;"
          />
          <DecisionNode
            question="Does it use a browser-only lib (motion, Rive, charts)?"
            yes="Client Component"
            no="Server Component"
          />
        </div>

        <SubHeading>Decision Reference Table</SubHeading>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600 }}>Need</th>
              <th style={{ textAlign: 'center', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600, width: 100 }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {[
              { need: 'Fetch data from DB or API', type: 'Server', color: 'var(--color-primary)' },
              { need: 'Render static or pre-computed content', type: 'Server', color: 'var(--color-primary)' },
              { need: 'Access server-only resources (env vars, filesystem)', type: 'Server', color: 'var(--color-primary)' },
              { need: 'SEO-critical content', type: 'Server', color: 'var(--color-primary)' },
              { need: 'useState, useEffect, useRef', type: 'Client', color: 'var(--color-accent)' },
              { need: 'Event handlers (onClick, onChange, onSubmit)', type: 'Client', color: 'var(--color-accent)' },
              { need: 'Browser APIs (localStorage, IntersectionObserver)', type: 'Client', color: 'var(--color-accent)' },
              { need: 'Third-party libs requiring browser (motion, Rive)', type: 'Client', color: 'var(--color-accent)' },
            ].map((row) => (
              <tr key={row.need} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '8px 12px', color: 'var(--color-text-body)' }}>{row.need}</td>
                <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: 700, color: row.color }}>{row.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Section 2: The use client Boundary */}
      <Section title="The &apos;use client&apos; Boundary">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          The <code style={{ fontFamily: 'monospace', fontSize: 13 }}>&apos;use client&apos;</code> boundary is a cliff, not a toggle. Everything below a client component is also client-side.
        </p>

        <div style={{
          padding: 24,
          background: 'var(--color-surface)',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
        }}>
          {/* Component tree visual */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--color-primary)', color: 'white', fontSize: 12, fontWeight: 600 }}>Page (Server)</div>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>fetches data, renders layout</span>
            </div>
            <div style={{ paddingLeft: 32, display: 'flex', flexDirection: 'column', gap: 4, borderLeft: '2px solid var(--color-border)', marginLeft: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12 }}>
                <div style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--color-primary)', color: 'white', fontSize: 12, fontWeight: 600 }}>DataDisplay (Server)</div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>renders static content, zero JS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--color-accent)', color: 'white', fontSize: 12, fontWeight: 600 }}>InteractiveWidget (Client)</div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>handles clicks, state</span>
                </div>
                <div style={{ paddingLeft: 32, display: 'flex', alignItems: 'center', gap: 8, borderLeft: '2px dashed var(--color-accent)', marginLeft: 20 }}>
                  <div style={{ padding: '6px 14px', borderRadius: 6, background: 'var(--color-accent)', color: 'white', fontSize: 12, fontWeight: 600, opacity: 0.7, marginLeft: 12 }}>Button (Client)</div>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>inherits client boundary</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SubHeading>Children Pattern (Server Content Inside Client Shell)</SubHeading>
        <CodeBlock language="tsx" title="Children pattern">{`// ClientShell.tsx — 'use client'
'use client';
export function AnimatedContainer({ children }: { children: React.ReactNode }) {
  return <motion.div animate={{ opacity: 1 }}>{children}</motion.div>;
}

// page.tsx — Server Component
export default async function Page() {
  const data = await fetchData();
  return (
    <AnimatedContainer>
      <ServerRenderedContent data={data} />  {/* still server-rendered! */}
    </AnimatedContainer>
  );
}`}</CodeBlock>
      </Section>

      {/* Section 3: Caching Model */}
      <Section title="Next.js Caching Model">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Four caching layers. Most caching bugs come from not understanding which layer is active.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { layer: 'Request Memoization', what: 'Duplicate fetch() in one render', default_: 'On (auto dedup)', control: 'Automatic — same URL+options', color: 'var(--color-primary)' },
            { layer: 'Data Cache', what: 'fetch() results across requests', default_: 'On (cached indefinitely)', control: '{ next: { revalidate: 60 } }', color: 'var(--color-accent)' },
            { layer: 'Full Route Cache', what: 'Pre-rendered HTML + RSC payload', default_: 'On for static routes', control: 'revalidatePath() / revalidateTag()', color: 'var(--color-success)' },
            { layer: 'Router Cache', what: 'Client-side RSC payload', default_: '30s dynamic, 5min static', control: 'router.refresh() or navigation', color: 'var(--color-text-heading)' },
          ].map((item, i) => (
            <div key={item.layer} style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr 150px 1fr',
              gap: 12,
              padding: '12px 16px',
              background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
              borderRadius: i === 0 ? '8px 8px 0 0' : i === 3 ? '0 0 8px 8px' : 0,
              border: '1px solid var(--color-border)',
              borderBottom: i < 3 ? 'none' : '1px solid var(--color-border)',
              alignItems: 'center',
            }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: item.color }}>{item.layer}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{item.what}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{item.default_}</div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{item.control}</div>
            </div>
          ))}
        </div>

        <SubHeading>Common Caching Pitfalls</SubHeading>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            {
              problem: 'Data not updating after mutation',
              cause: 'Mutated DB but didn\'t invalidate cache',
              fix: 'Call revalidatePath() in Server Action',
            },
            {
              problem: 'Page is static but needs dynamic data',
              cause: 'Route is statically pre-rendered',
              fix: 'export const dynamic = \'force-dynamic\'',
            },
            {
              problem: 'API route returns stale data',
              cause: 'GET responses cached by default',
              fix: '{ cache: \'no-store\' } on fetches',
            },
          ].map((item) => (
            <div key={item.problem} style={{
              padding: 16,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 6 }}>{item.problem}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 8, lineHeight: 1.5 }}>{item.cause}</div>
              <div style={{
                padding: '6px 10px',
                borderRadius: 4,
                background: 'var(--color-bg-alt)',
                fontSize: 11,
                fontFamily: 'monospace',
                color: 'var(--color-success)',
              }}>
                {item.fix}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 4: Route Organisation */}
      <Section title="Route Organisation">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <SubHeading>Route Groups</SubHeading>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
              Parenthesised folders organise routes without affecting the URL. Each group can have its own layout.
            </p>
            <CodeBlock language="text" title="Route groups">{`app/
  (auth)/
    login/page.tsx        -> /login
    verify/page.tsx       -> /verify
    layout.tsx            -> minimal shell
  (dashboard)/
    page.tsx              -> /
    skills/page.tsx       -> /skills
    layout.tsx            -> full shell
  (admin)/
    admin/page.tsx        -> /admin
    layout.tsx            -> admin shell`}</CodeBlock>
          </div>
          <div>
            <SubHeading>Route Segments</SubHeading>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
              Each segment gets its own loading/error boundaries for progressive UX.
            </p>
            <CodeBlock language="text" title="Route segment files">{`app/skills/[slug]/
  page.tsx        <- the content
  loading.tsx     <- skeleton while streaming
  error.tsx       <- error boundary
  not-found.tsx   <- when notFound() called`}</CodeBlock>

            <div style={{
              marginTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              {[
                { file: 'page.tsx', desc: 'Main content', color: 'var(--color-primary)' },
                { file: 'loading.tsx', desc: 'Skeleton while streaming', color: 'var(--color-accent)' },
                { file: 'error.tsx', desc: 'Error boundary wrapper', color: 'var(--color-danger)' },
                { file: 'not-found.tsx', desc: 'notFound() handler', color: 'var(--color-text-muted)' },
              ].map((item) => (
                <div key={item.file} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 10px',
                  borderRadius: 4,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}>
                  <code style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: item.color }}>{item.file}</code>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 5: Thin Pages */}
      <Section title="Pages Are Thin Wiring">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 16 }}>
          A page imports from features and platform, fetches data, and renders. No business logic, no styling, no complex rendering.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Thin page (correct)</div>
            <CodeBlock language="tsx" title="Thin page">{`import { SkillDetailView }
  from '@/features/skill-detail/SkillDetailView';

export default async function SkillPage({
  params
}: { params: { slug: string } }) {
  const skill = await fetchSkill(params.slug);
  if (!skill) notFound();
  return <SkillDetailView skill={skill} />;
}

export async function generateMetadata({
  params
}: { params: { slug: string } }) {
  const skill = await fetchSkill(params.slug);
  return { title: skill?.title ?? 'Not Found' };
}`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-danger)', marginBottom: 8 }}>Fat page (avoid)</div>
            <CodeBlock language="tsx" title="Fat page (avoid)">{`// Don't do this:
export default async function SkillPage({ params }) {
  const skill = await db.query.skills.findFirst({
    where: eq(skills.slug, params.slug),
    with: { versions: true, author: true },
  });

  // 50 lines of data transformation
  const processed = skill.versions.map(v => ({
    ...v,
    formattedDate: format(v.createdAt),
  }));

  // Inline styling and layout
  return (
    <div style={{ /* 20 style props */ }}>
      {processed.map(v => (
        // more inline rendering
      ))}
    </div>
  );
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 6: Turbopack */}
      <Section title="Turbopack: Default Bundler">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12,
        }}>
          <div style={{
            padding: 20,
            borderRadius: 8,
            border: '2px solid var(--color-success)',
            background: 'var(--color-surface)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-success)', marginBottom: 4 }}>Day-to-day dev</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>Turbopack</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Default, no flag needed</div>
          </div>
          <div style={{
            padding: 20,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>Webpack-only plugin</div>
            <div style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-body)' }}>next dev --webpack</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Fallback only</div>
          </div>
          <div style={{
            padding: 20,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>Production build</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-body)' }}>Next.js default</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Check docs for version</div>
          </div>
        </div>

        <div style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 8,
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          fontSize: 12,
          color: 'var(--color-text-body)',
          lineHeight: 1.7,
        }}>
          <strong>If dev is slow:</strong> Verify Turbopack is active (check terminal). Ensure <code style={{ fontFamily: 'monospace', fontSize: 11 }}>.next</code> cache isn&apos;t cleared by another tool. The FS cache under <code style={{ fontFamily: 'monospace', fontSize: 11 }}>.next</code> makes restarts fast&mdash;deleting it forces a cold start.
        </div>
      </Section>

      {/* Section 7: Performance Patterns */}
      <Section title="Performance Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Dynamic Imports</div>
            <CodeBlock language="tsx" title="Dynamic imports">{`import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/HeavyChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // browser-only libs
  }
);

// Use for: >50KB client bundles
// Charts, editors, animations`}</CodeBlock>
          </div>
          <div style={{
            padding: 16,
            borderRadius: 8,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Image & Font Optimization</div>
            <CodeBlock language="tsx" title="Image and font optimization">{`// Images — always next/image
import Image from 'next/image';
<Image src="/hero.jpg" alt="Hero"
  width={1200} height={600}
  priority  // above-the-fold only
/>

// Fonts — zero-layout-shift
import { Jost } from 'next/font/google';
const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
});`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Section 8: Streaming & Composition */}
      <Section title="Streaming & Composition Pattern">
        <p style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.7, marginBottom: 20 }}>
          Server Components fetch at the top, pass data down. Client Components handle interactivity. Layouts wrap with persistent UI.
        </p>

        <div style={{
          padding: 24,
          background: 'var(--color-surface)',
          borderRadius: 10,
          border: '1px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Layout */}
            <div style={{
              padding: 16,
              borderRadius: 8,
              border: '2px solid var(--color-border)',
              background: 'var(--color-bg-alt)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8 }}>layout.tsx (Server) — persistent, re-renders children only</div>
              <div style={{ display: 'flex', gap: 12 }}>
                {/* Nav */}
                <div style={{
                  width: 100,
                  padding: 8,
                  borderRadius: 6,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  fontSize: 10,
                  color: 'var(--color-text-muted)',
                  textAlign: 'center',
                }}>
                  TopNav (Server)
                </div>
                {/* Content area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{
                    padding: 12,
                    borderRadius: 6,
                    border: '2px solid var(--color-primary)',
                    background: 'var(--color-surface)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>page.tsx (Server) — fetches data</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 4,
                        background: 'var(--color-primary)',
                        color: 'white',
                        fontSize: 10,
                        textAlign: 'center',
                      }}>
                        Static Content (Server, 0 JS)
                      </div>
                      <div style={{
                        flex: 1,
                        padding: 8,
                        borderRadius: 4,
                        background: 'var(--color-accent)',
                        color: 'white',
                        fontSize: 10,
                        textAlign: 'center',
                      }}>
                        Interactive Widget (Client)
                      </div>
                    </div>
                  </div>
                  <div style={{
                    padding: 8,
                    borderRadius: 6,
                    border: '1px dashed var(--color-border)',
                    background: 'var(--color-surface)',
                    fontSize: 10,
                    color: 'var(--color-text-muted)',
                    textAlign: 'center',
                  }}>
                    loading.tsx shown while page streams
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section 9: Banned Patterns */}
      <Section title="Banned Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { bad: "'use client' on page when only child needs it", fix: 'Push boundary down to interactive component' },
            { bad: 'Fetching in Client when Server could fetch', fix: 'Fetch on server, pass as props' },
            { bad: 'Business logic in page.tsx', fix: 'Logic lives in features, pages are thin' },
            { bad: 'Server Component inside Client Component', fix: 'Use children pattern instead' },
            { bad: 'next dev --webpack without documented reason', fix: 'Turbopack is default' },
            { bad: 'Deleting .next to "fix" dev issues', fix: 'FS cache is an asset, investigate root cause' },
            { bad: 'force-dynamic on every route', fix: 'Only when route genuinely needs dynamic data' },
            { bad: '<img> tags instead of next/image', fix: 'Use next/image for lazy loading, responsive' },
          ].map((item) => (
            <div key={item.bad} style={{
              padding: 10,
              borderRadius: 6,
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              gap: 8,
              fontSize: 11,
            }}>
              <span style={{ color: 'var(--color-danger)', fontWeight: 700, flexShrink: 0 }}>&#10007;</span>
              <div>
                <span style={{ color: 'var(--color-text-body)' }}>{item.bad}</span>
                <span style={{ color: 'var(--color-text-muted)' }}> &#8594; {item.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

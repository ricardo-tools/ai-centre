'use client';

import { CodeBlock } from '@/platform/components/CodeBlock';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

/* ---- gauge helper ---- */
function Gauge({ label, value, unit, good, needsWork, poor, description }: {
  label: string; value: number; unit: string;
  good: string; needsWork: string; poor: string; description: string;
}) {
  const goodNum = parseFloat(good.replace(/[^\d.]/g, ''));
  const needsWorkNum = parseFloat(needsWork.replace(/[^\d.]/g, ''));
  const status = value <= goodNum ? 'good' : value <= needsWorkNum ? 'needs-work' : 'poor';
  const colors = { good: '#34C759', 'needs-work': '#FFB800', poor: '#FF3B30' };
  const statusColor = colors[status];
  const maxVal = needsWorkNum * 1.5;
  const pct = Math.min((value / maxVal) * 100, 100);

  return (
    <div style={{ padding: 24, borderRadius: 12, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
      {/* Circular gauge */}
      <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 16px' }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Background track */}
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--color-border)" strokeWidth="8"
            strokeDasharray={`${Math.PI * 100 * 0.75} ${Math.PI * 100 * 0.25}`}
            strokeDashoffset={Math.PI * 100 * 0.375}
            strokeLinecap="round"
            transform="rotate(135 60 60)"
          />
          {/* Value arc */}
          <circle cx="60" cy="60" r="50" fill="none" stroke={statusColor} strokeWidth="8"
            strokeDasharray={`${Math.PI * 100 * 0.75 * (pct / 100)} ${Math.PI * 100}`}
            strokeDashoffset={Math.PI * 100 * 0.375}
            strokeLinecap="round"
            transform="rotate(135 60 60)"
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: statusColor }}>{value}</span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{unit}</span>
        </div>
      </div>

      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 12 }}>{description}</div>

      {/* Threshold legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
        {[
          { label: 'Good', threshold: good, color: '#34C759' },
          { label: 'Needs Work', threshold: needsWork, color: '#FFB800' },
          { label: 'Poor', threshold: poor, color: '#FF3B30' },
        ].map((t) => (
          <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: t.color }} />
            <span style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>{t.threshold}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebPerformanceShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Use <strong>frontend-architecture</strong> for Server/Client Component boundaries.
          Apply <strong>brand-design-system</strong> for font loading and image conventions.
          See <strong>backend-patterns</strong> for server-side caching and query optimization.
        </p>
      </div>

      {/* ---- Core Web Vitals ---- */}
      <Section title="Core Web Vitals">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          The three metrics Google uses to measure real user experience. Measure before optimizing — don&apos;t guess what&apos;s slow.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
          <Gauge
            label="LCP"
            value={1.8}
            unit="seconds"
            good="<= 2.5s"
            needsWork="<= 4.0s"
            poor="> 4.0s"
            description="Largest Contentful Paint — when main content is visible"
          />
          <Gauge
            label="INP"
            value={120}
            unit="ms"
            good="<= 200ms"
            needsWork="<= 500ms"
            poor="> 500ms"
            description="Interaction to Next Paint — responsiveness to user input"
          />
          <Gauge
            label="CLS"
            value={0.05}
            unit="score"
            good="<= 0.1"
            needsWork="<= 0.25"
            poor="> 0.25"
            description="Cumulative Layout Shift — visual stability"
          />
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Measure with:</strong> Lighthouse (Chrome DevTools), PageSpeed Insights (lab + field data),
            <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3, marginLeft: 4 }}>web-vitals</code> library (real user metrics).
          </p>
        </div>
      </Section>

      {/* ---- Loading Strategy Comparison ---- */}
      <Section title="Loading Strategy Comparison">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Choose the right rendering strategy based on data freshness needs and performance requirements.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            {
              name: 'SSR',
              fullName: 'Server-Side Rendering',
              color: 'var(--color-primary)',
              freshness: 'Real-time',
              speed: 'Fast TTFB',
              caching: 'Per-request',
              useCase: 'User-specific data, dashboards',
              tradeoff: 'Server load per request',
            },
            {
              name: 'SSG',
              fullName: 'Static Site Generation',
              color: 'var(--color-secondary)',
              freshness: 'Build-time',
              speed: 'Instant',
              caching: 'CDN edge',
              useCase: 'Marketing pages, docs, blog',
              tradeoff: 'Stale until rebuild',
            },
            {
              name: 'ISR',
              fullName: 'Incremental Static Regen',
              color: '#34C759',
              freshness: 'Time-based',
              speed: 'Instant (cached)',
              caching: 'CDN + revalidate',
              useCase: 'Product pages, skill library',
              tradeoff: 'Stale window (revalidate)',
            },
            {
              name: 'Streaming',
              fullName: 'Streaming SSR + Suspense',
              color: '#FFB800',
              freshness: 'Real-time',
              speed: 'Progressive',
              caching: 'Shell cached',
              useCase: 'Complex pages, mixed data',
              tradeoff: 'More complexity',
            },
          ].map((strategy) => (
            <div key={strategy.name} style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', background: 'var(--color-surface)' }}>
              <div style={{ padding: '12px 16px', background: strategy.color, textAlign: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{strategy.name}</span>
              </div>
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{strategy.fullName}</span>
                {[
                  { label: 'Freshness', value: strategy.freshness },
                  { label: 'Speed', value: strategy.speed },
                  { label: 'Caching', value: strategy.caching },
                  { label: 'Use case', value: strategy.useCase },
                  { label: 'Tradeoff', value: strategy.tradeoff },
                ].map((row) => (
                  <div key={row.label}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.label}</span>
                    <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{row.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <CodeBlock language="tsx" title="Streaming SSR with Suspense">{`// Streaming SSR with Suspense — best of both worlds
export default function SkillsPage() {
  return (
    <div>
      <h1>Skills</h1>             {/* renders immediately */}
      <SearchInput />             {/* renders immediately */}
      <Suspense fallback={<SkillGridSkeleton />}>
        <SkillGrid />             {/* streams when data ready */}
      </Suspense>
    </div>
  );
}`}</CodeBlock>
      </Section>

      {/* ---- Bundle Analysis ---- */}
      <Section title="Bundle Analysis">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Regularly check what you ship to the client. Aim for &lt; 200KB first-load JS for the main page.
        </p>

        {/* Budget bar visualization */}
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>First-Load JS Budget — 200KB Target</span>
          </div>
          <div style={{ padding: 16 }}>
            {[
              { label: 'Framework (Next.js)', size: 85, color: 'var(--color-secondary)' },
              { label: 'React Runtime', size: 42, color: '#34C759' },
              { label: 'App Code', size: 28, color: 'var(--color-primary)' },
              { label: 'Shared Chunks', size: 20, color: '#FFB800' },
              { label: 'Remaining Budget', size: 25, color: 'var(--color-border)' },
            ].map((chunk) => (
              <div key={chunk.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <div style={{ width: 120, fontSize: 11, color: 'var(--color-text-body)', textAlign: 'right', flexShrink: 0 }}>{chunk.label}</div>
                <div style={{ flex: 1, height: 20, borderRadius: 4, background: 'var(--color-bg-alt)', overflow: 'hidden' }}>
                  <div style={{ width: `${(chunk.size / 200) * 100}%`, height: '100%', borderRadius: 4, background: chunk.color, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>{chunk.size}KB</span>
                  </div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
              <div style={{ width: 120, fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'right' }}>Total</div>
              <div style={{ flex: 1, height: 2, background: 'var(--color-border)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '87.5%', top: -8, width: 1, height: 18, background: 'var(--color-danger, #FF3B30)' }} />
                <span style={{ position: 'absolute', left: '87.5%', top: 12, fontSize: 9, color: 'var(--color-danger, #FF3B30)', fontWeight: 600, transform: 'translateX(-50%)' }}>175KB</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* What to look for */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>What to look for</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Large deps that could be replaced',
                'Dependencies on pages that don\'t use them',
                'Client-side code → Server Component',
                'Duplicate packages (different versions)',
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 5 }} />
                  <span style={{ fontSize: 11, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common replacements */}
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'block' }}>Common replacements</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { from: 'moment.js (300KB)', to: 'date-fns or native Intl' },
                { from: 'lodash (70KB)', to: 'Native Array/Object methods' },
                { from: 'axios (13KB)', to: 'Native fetch()' },
                { from: 'classnames (1KB)', to: 'Template literals' },
              ].map((rep) => (
                <div key={rep.from} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-danger, #FF3B30)', textDecoration: 'line-through', minWidth: 110 }}>{rep.from}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>→</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-success, #34C759)' }}>{rep.to}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Perceived Performance Timeline ---- */}
      <Section title="Perceived Performance Timeline">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Users perceive responsiveness and progress, not absolute time. A 2s load with a skeleton feels faster than a 1.5s blank-then-pop.
        </p>

        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Page Load Timeline — Bad vs Good</span>
          </div>
          <div style={{ padding: 20 }}>
            {/* Timeline header */}
            <div style={{ display: 'flex', marginBottom: 4, paddingLeft: 80 }}>
              {['0s', '0.5s', '1.0s', '1.5s', '2.0s', '2.5s'].map((t) => (
                <span key={t} style={{ flex: 1, fontSize: 9, color: 'var(--color-text-muted)', textAlign: 'center' }}>{t}</span>
              ))}
            </div>

            {/* Bad: blank → pop */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ width: 80, fontSize: 11, fontWeight: 600, color: 'var(--color-danger, #FF3B30)', flexShrink: 0 }}>Bad</span>
              <div style={{ flex: 1, height: 32, borderRadius: 4, background: 'var(--color-bg-alt)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '60%', background: '#FF3B30', opacity: 0.15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-heading)' }}>Blank white page</span>
                </div>
                <div style={{ width: '40%', background: '#34C759', opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '2px solid #FF3B30' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-heading)' }}>Content pop</span>
                </div>
              </div>
            </div>

            {/* Good: shell → skeleton → content */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: 80, fontSize: 11, fontWeight: 600, color: 'var(--color-success, #34C759)', flexShrink: 0 }}>Good</span>
              <div style={{ flex: 1, height: 32, borderRadius: 4, background: 'var(--color-bg-alt)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: '10%', background: '#34C759', opacity: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, fontWeight: 600, color: 'var(--color-text-heading)' }}>Shell</span>
                </div>
                <div style={{ width: '30%', background: '#FFB800', opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-heading)' }}>Skeleton</span>
                </div>
                <div style={{ width: '60%', background: '#34C759', opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--color-text-heading)' }}>Content streams in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Perceived performance techniques */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { technique: 'Skeleton Screens', effect: 'Perceived 30% faster than spinners', icon: '▒' },
            { technique: 'Optimistic Updates', effect: 'Near-zero perceived latency', icon: '✓' },
            { technique: 'Streaming SSR', effect: 'Content appears progressively', icon: '▸' },
            { technique: 'Instant Nav Feedback', effect: 'URL changes in <100ms', icon: '↗' },
            { technique: 'Progressive Loading', effect: 'Important content first', icon: '◑' },
            { technique: 'Prefetching', effect: 'Next page ready before click', icon: '⟐' },
          ].map((tech) => (
            <div key={tech.technique} style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8, color: 'var(--color-primary)' }}>{tech.icon}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', display: 'block', marginBottom: 4 }}>{tech.technique}</span>
              <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{tech.effect}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Next.js-Specific Optimizations ---- */}
      <Section title="Next.js-Specific Optimizations">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Next.js provides built-in performance primitives. Use them instead of rolling your own.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {/* Server Components */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Server Components (zero client JS)</span>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 12 }}>
                Default to Server Components — they ship zero JavaScript to the client. This is the single biggest performance win.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 11, background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4, color: 'var(--color-success, #34C759)' }}>Server Component</code>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>0 KB client JS</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <code style={{ fontSize: 11, background: 'var(--color-bg-alt)', padding: '2px 8px', borderRadius: 4, color: 'var(--color-danger, #FF3B30)' }}>&apos;use client&apos;</code>
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Component + deps shipped to client</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic imports */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>Dynamic Imports</span>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 12 }}>
                Split heavy client-side code. Load only when the component is actually rendered.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  'Chart libraries (nivo, recharts)',
                  'Rich text editors',
                  'PDF viewers',
                  'Any component > 50KB',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Images */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>next/image</span>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 12 }}>
                Handles responsive sizing, lazy loading, WebP/AVIF conversion, blur placeholder.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>
                  <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>priority</code> on LCP image (1-2 per page)
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>
                  Always set <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>width</code> + <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>height</code> (prevents CLS)
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>
                  Use <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>sizes</code> for responsive images
                </div>
              </div>
            </div>
          </div>

          {/* Fonts */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>next/font</span>
            </div>
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', marginBottom: 12 }}>
                Zero-layout-shift font loading. Load in root layout, use CSS variable.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>
                  <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>display: &apos;swap&apos;</code> — text visible immediately
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>
                  <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>subsets: [&apos;latin&apos;]</code> — smaller file size
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>
                  <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>variable</code> option — CSS custom property
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Performance Killers ---- */}
      <Section title="Common Performance Killers">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { killer: "'use client' on page-level components", why: 'Entire page ships as JavaScript', fix: "Push 'use client' down to smallest interactive component" },
            { killer: 'Large npm packages (lodash, moment)', why: 'Added to client bundle', fix: 'Native APIs, tree-shakeable alternatives, or dynamic()' },
            { killer: 'Unoptimised images', why: 'Large files, layout shift, slow LCP', fix: 'next/image with width/height/priority' },
            { killer: 'Web fonts via <link>', why: 'Flash of unstyled text, layout shift', fix: 'next/font with display: swap' },
            { killer: 'Third-party scripts in <head>', why: 'Block rendering', fix: 'next/script strategy="lazyOnload"' },
            { killer: 'Client-side data fetching for initial content', why: 'Waterfall: HTML -> JS -> fetch -> render', fix: 'Fetch in Server Component, pass as props' },
            { killer: 'No Suspense boundaries', why: 'Page waits for slowest data', fix: 'Wrap async sections in <Suspense> with skeletons' },
            { killer: 'Fetching all data upfront', why: 'Slow initial load for large datasets', fix: 'Paginate, virtualise long lists, load on demand' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '10px 12px', borderRadius: 6, background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>{row.killer}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.why}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)' }}>{row.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate Checklist">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            'Lighthouse Performance 90+',
            'LCP <= 2.5s, INP <= 200ms, CLS <= 0.1',
            'Above-fold content renders first',
            'LCP image uses priority (1-2 per page)',
            'All images use next/image with width/height',
            'Font loaded via next/font with display: swap',
            "No 'use client' higher than necessary",
            'Heavy libs loaded via dynamic() with skeleton',
            'Slow data in <Suspense> with skeleton fallbacks',
            'First-load JS < 200KB',
            'Bundle analysis run — no bloat',
            'Third-party scripts use next/script',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, border: '2px solid var(--color-border)', flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

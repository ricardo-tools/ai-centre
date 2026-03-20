'use client';

import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';

/* ---- chart palette ---- */
const CHART_COLORS = ['#FF5A28', '#1462D2', '#121948', '#4B5563', '#9CA3AF', '#D1D5DB'];

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function CreativeToolkitShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skill:</strong> Always apply <strong>brand-design-system</strong> (color tokens, typography, logos, theming) alongside this skill.
          Assets, animations, and charts must use brand colors and follow brand rules.
        </p>
      </div>

      {/* ---- Asset Libraries ---- */}
      <Section title="Asset Libraries">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Assets are a primary tool for visual warmth — a page with a well-chosen illustration on a neutral background is more on-brand than one saturated with orange and blue.</p>

        {/* --- unDraw --- */}
        <div style={{ marginBottom: 24, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>unDraw</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Illustrations (Primary) — MIT</span>
            </div>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>500+ flat SVGs. Customize the accent color on-site before downloading — always use <span style={{ color: '#FF5A28', fontWeight: 600 }}>#FF5A28</span> or <span style={{ color: '#1462D2', fontWeight: 600 }}>#1462D2</span>, never the default purple.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Empty state example */}
              <div style={{ padding: 32, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <svg width="120" height="100" viewBox="0 0 120 100" style={{ marginBottom: 16 }}>
                  <rect x="20" y="10" width="80" height="60" rx="6" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
                  <rect x="30" y="20" width="25" height="3" rx="1.5" fill="#FF5A28" />
                  <rect x="30" y="28" width="60" height="2" rx="1" fill="var(--color-border)" />
                  <rect x="30" y="34" width="50" height="2" rx="1" fill="var(--color-border)" />
                  <rect x="30" y="40" width="55" height="2" rx="1" fill="var(--color-border)" />
                  <circle cx="90" cy="24" r="8" fill="#FF5A28" opacity="0.15" />
                  <circle cx="90" cy="24" r="4" fill="#FF5A28" />
                  <rect x="30" y="50" width="24" height="10" rx="5" fill="#FF5A28" />
                  <rect x="58" y="50" width="24" height="10" rx="5" fill="var(--color-border)" />
                  <circle cx="60" cy="88" r="5" fill="#FF5A28" opacity="0.2" />
                  <circle cx="45" cy="92" r="3" fill="#1462D2" opacity="0.15" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>No invoices yet</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '0 0 12px' }}>Create your first invoice to get started</p>
                <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 4, background: '#FF5A28', color: '#fff', fontWeight: 600 }}>Create Invoice</span>
              </div>
              {/* Feature section example */}
              <div style={{ padding: 32, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <svg width="120" height="100" viewBox="0 0 120 100" style={{ marginBottom: 16 }}>
                  <rect x="10" y="20" width="45" height="55" rx="4" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
                  <rect x="65" y="20" width="45" height="55" rx="4" fill="var(--color-bg-alt)" stroke="var(--color-border)" strokeWidth="1" />
                  <rect x="18" y="35" width="30" height="20" rx="3" fill="#1462D2" opacity="0.12" />
                  <rect x="22" y="40" width="12" height="12" rx="2" fill="#1462D2" />
                  <rect x="73" y="30" width="30" height="3" rx="1.5" fill="#1462D2" />
                  <rect x="73" y="37" width="25" height="2" rx="1" fill="var(--color-border)" />
                  <rect x="73" y="43" width="28" height="2" rx="1" fill="var(--color-border)" />
                  <rect x="73" y="55" width="20" height="8" rx="4" fill="#1462D2" />
                  <path d="M55 50 L65 50" stroke="#1462D2" strokeWidth="1.5" strokeDasharray="3 2" />
                  <circle cx="60" cy="12" r="6" fill="#1462D2" opacity="0.1" />
                  <circle cx="60" cy="12" r="3" fill="#1462D2" />
                </svg>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>Smart Matching</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>AI matches payments to invoices automatically</p>
              </div>
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: 0 }}>Search undraw.co for: dashboard, analytics, payments, invoice, onboarding, empty, error, collaboration, security, team</p>
          </div>
        </div>

        {/* --- Humaaans --- */}
        <div style={{ marginBottom: 24, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Humaaans</span>
            <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>People (Supplementary) — CC0</span>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>Mix-and-match modular characters. Use when the context specifically needs human figures — team pages, testimonials, onboarding.</p>
            <div style={{ padding: 24, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>Meet the Team</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 32 }}>
                {[
                  { hair: '#2C1810', skin: '#D4A574', top: '#FF5A28', pants: '#1F2B7A', name: 'Sarah K.', role: 'Product' },
                  { hair: '#F0C080', skin: '#F5D0A9', top: '#1462D2', pants: '#333', name: 'James L.', role: 'Engineering' },
                  { hair: '#1A1A1A', skin: '#8D5524', top: '#34C759', pants: '#121948', name: 'Priya M.', role: 'Design' },
                  { hair: '#A0522D', skin: '#F5D0A9', top: '#FF5A28', pants: '#1462D2', name: 'Alex R.', role: 'Sales' },
                ].map((person) => (
                  <div key={person.name} style={{ textAlign: 'center' }}>
                    <svg width="48" height="80" viewBox="0 0 48 80" style={{ marginBottom: 8 }}>
                      <ellipse cx="24" cy="12" rx="12" ry="12" fill={person.hair} />
                      <circle cx="24" cy="14" r="9" fill={person.skin} />
                      <path d="M12 30 Q12 26 24 26 Q36 26 36 30 L38 55 L10 55 Z" fill={person.top} />
                      <rect x="6" y="30" width="6" height="20" rx="3" fill={person.skin} />
                      <rect x="36" y="30" width="6" height="20" rx="3" fill={person.skin} />
                      <rect x="14" y="55" width="8" height="22" rx="4" fill={person.pants} />
                      <rect x="26" y="55" width="8" height="22" rx="4" fill={person.pants} />
                    </svg>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 2px' }}>{person.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: 0 }}>{person.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Unsplash --- */}
        <div style={{ marginBottom: 24, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Unsplash</span>
            <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Stock Photos — Free</span>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>3M+ high-res photos. Always optimize with URL params: <code style={{ fontSize: 11, background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>?w=800&q=80</code>. Self-host in production.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
              {[
                { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80', label: '"modern office"' },
                { url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&q=80', label: '"team meeting"' },
                { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&q=80', label: '"data analytics"' },
                { url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&q=80', label: '"laptop workspace"' },
              ].map((img) => (
                <div key={img.label} style={{ borderRadius: 6, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.label} style={{ width: '100%', height: 100, objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '6px 8px', background: 'var(--color-surface)' }}>
                    <span style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>{img.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Prefer search terms with &quot;minimal&quot;, &quot;modern&quot;, or &quot;clean&quot; to match the brand mood</p>
          </div>
        </div>

        {/* --- Pexels & Mixkit --- */}
        <div style={{ marginBottom: 24, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Pexels + Mixkit</span>
            <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Stock Video — Free</span>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>Pexels for API-driven workflows (200 req/hr). Mixkit for hand-picked hero quality. Always self-host in production.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-secondary)', display: 'block', marginBottom: 4 }}>Pexels — API-driven</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>150K+ videos, up to 4K. Use for automated selection, dynamic backgrounds. Keywords: technology, abstract, city aerial, minimal</p>
              </div>
              <div style={{ padding: 12, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', display: 'block', marginBottom: 4 }}>Mixkit — Hero quality</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Curated by Envato. No API — manual only. Use for hero backgrounds, landing cinematics, brand videos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Illustration rules summary */}
        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Rules:</strong> unDraw first. Brand-color all SVGs. Don&apos;t mix illustration styles on one page. SVG format only. Self-host all assets in production.</p>
        </div>
      </Section>

      {/* ---- Animation Stack ---- */}
      <Section title="Animation Stack">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Motion first (90% of cases). GSAP for the heavy lifting. They coexist. Rive for interactive assets.</p>
        <style>{`
          @keyframes ctFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes ctSlideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes ctScale { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes ctStagger1 { 0%,30% { opacity: 0; transform: translateY(12px); } 40%,100% { opacity: 1; transform: translateY(0); } }
          @keyframes ctStagger2 { 0%,45% { opacity: 0; transform: translateY(12px); } 55%,100% { opacity: 1; transform: translateY(0); } }
          @keyframes ctStagger3 { 0%,60% { opacity: 0; transform: translateY(12px); } 70%,100% { opacity: 1; transform: translateY(0); } }
          @keyframes ctScrollReveal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes ctTextSplit { 0% { opacity: 0; transform: translateY(100%); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes ctRivePulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.1); } }
          @keyframes ctRiveCheck { 0% { stroke-dashoffset: 24; } 100% { stroke-dashoffset: 0; } }
          @keyframes ctLayoutFlip { 0%,40% { width: 60px; height: 60px; border-radius: 8px; } 50%,90% { width: 120px; height: 40px; border-radius: 20px; } 100% { width: 60px; height: 60px; border-radius: 8px; } }
        `}</style>

        {/* Motion */}
        <div style={{ marginBottom: 20, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Motion</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Primary (React) — ~3.8–25 KB</span>
            </div>
            <code style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>npm i motion</code>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#FF5A28', margin: '0 auto 8px', animation: 'ctFadeUp 1.5s ease-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Fade Up</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Mount animation</p>
              </div>
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#1462D2', margin: '0 auto 8px', animation: 'ctSlideIn 1.5s ease-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Slide In</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>AnimatePresence</p>
              </div>
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: '#34C759', margin: '0 auto 8px', animation: 'ctScale 1.5s ease-out infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Scale</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Hover / tap</p>
              </div>
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: '#FF5A28', animation: 'ctLayoutFlip 3s ease-in-out infinite', marginBottom: 8 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Layout FLIP</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Auto layout shift</p>
              </div>
            </div>
            {/* Staggered list */}
            <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Staggered List — common pattern for card grids</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { anim: 'ctStagger1', label: '$24,500', sub: 'Outstanding' },
                  { anim: 'ctStagger2', label: '$8,200', sub: 'Overdue' },
                  { anim: 'ctStagger3', label: '$42,100', sub: 'Collected' },
                ].map((item) => (
                  <div key={item.sub} style={{ flex: 1, padding: 16, borderRadius: 6, background: 'var(--color-bg-alt)', animation: `${item.anim} 3s ease-out infinite` }}>
                    <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)', margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0' }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* GSAP */}
        <div style={{ marginBottom: 20, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>GSAP</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Complex Sequences — ~30 KB core</span>
            </div>
            <code style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>npm i gsap</code>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>ScrollTrigger — reveal on scroll</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {['Collect faster with AI', 'Automate follow-ups', 'Real-time dashboards'].map((text, i) => (
                    <div key={text} style={{ padding: 12, borderRadius: 6, background: 'var(--color-bg-alt)', animation: `ctScrollReveal 2s ease-out infinite`, animationDelay: `${i * 0.3}s` }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>SplitText — character animation</p>
                <div style={{ overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {'Get paid faster'.split('').map((char, i) => (
                      <span key={i} style={{ fontSize: 24, fontWeight: 800, color: char === ' ' ? 'transparent' : 'var(--color-text-heading)', display: 'inline-block', animation: `ctTextSplit 2.5s ease-out infinite`, animationDelay: `${i * 0.05}s`, minWidth: char === ' ' ? 8 : undefined }}>
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0 }}>Each character animates independently via GSAP SplitText + timeline stagger</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rive */}
        <div style={{ marginBottom: 20, borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)' }}>Rive</span>
              <span style={{ fontSize: 12, color: 'var(--color-secondary)', marginLeft: 8, fontWeight: 500 }}>Interactive Assets — MIT runtime</span>
            </div>
            <code style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>npm i @rive-app/react-canvas</code>
          </div>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--color-text-body)', marginBottom: 16 }}>State machine-driven animations that react to user input, data, and app state in real time.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid var(--color-border)', borderTopColor: '#FF5A28', margin: '0 auto 10px', animation: 'ctRivePulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Interactive Loader</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Reacts to loading progress state</p>
              </div>
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <svg width="48" height="48" viewBox="0 0 48 48" style={{ margin: '0 auto 10px', display: 'block' }}>
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#34C759" strokeWidth="2.5" opacity="0.2" />
                  <circle cx="24" cy="24" r="20" fill="none" stroke="#34C759" strokeWidth="2.5" strokeDasharray="126" strokeDashoffset="0" style={{ animation: 'ctRiveCheck 1.5s ease-out infinite' }} />
                  <path d="M15 24 L21 30 L33 18" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="24" style={{ animation: 'ctRiveCheck 1.5s ease-out 0.3s infinite' }} />
                </svg>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Success Check</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Triggers on payment confirmed</p>
              </div>
              <div style={{ padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
                <div style={{ width: 48, height: 26, borderRadius: 13, background: 'var(--color-border)', margin: '11px auto 10px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>State Toggle</span>
                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Bound to app state machine</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Rule:</strong> Motion first for all React UI. GSAP for scroll-driven sequences, text splitting, SVG morphing. Rive for interactive assets only. Always respect <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>prefers-reduced-motion</code>.</p>
        </div>
      </Section>

      {/* ---- Data Visualization ---- */}
      <Section title="Data Visualization — Nivo">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 8 }}>SVG-based, theme-aware charts. Use the brand theme object — never hardcode colors in individual charts.</p>

        {/* Nivo limitation callout */}
        <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-warning-muted, rgba(255,184,0,0.1))', border: '1px solid var(--color-border)', marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}>
            <strong>Known limitation:</strong> Nivo accepts plain JS objects with hex strings, not <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>var(--color-*)</code> tokens.
            The brand theme in <code style={{ background: 'var(--color-bg-alt)', padding: '1px 4px', borderRadius: 3 }}>chart-theme.ts</code> must be manually synced when brand tokens change.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Bar chart */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>Collections by month are trending up</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Title states the insight, not a label</p>
            </div>
            <div style={{ height: 220, padding: '8px 0' }}>
              <ResponsiveBar
                data={[
                  { month: 'Jan', collected: 32000, outstanding: 12000 },
                  { month: 'Feb', collected: 38000, outstanding: 9000 },
                  { month: 'Mar', collected: 42000, outstanding: 8200 },
                  { month: 'Apr', collected: 45000, outstanding: 7500 },
                  { month: 'May', collected: 51000, outstanding: 6000 },
                  { month: 'Jun', collected: 55000, outstanding: 5200 },
                ]}
                keys={['collected', 'outstanding']}
                indexBy="month"
                margin={{ top: 24, right: 24, bottom: 48, left: 64 }}
                padding={0.3}
                groupMode="grouped"
                colors={CHART_COLORS}
                borderRadius={4}
                enableGridX={false}
                enableLabel={false}
                axisBottom={{ tickSize: 0, tickPadding: 8 }}
                axisLeft={{ tickSize: 0, tickPadding: 8, format: (v: number) => `$${v / 1000}k` }}
                motionConfig="gentle"
                theme={{
                  axis: { ticks: { text: { fontSize: 10, fill: '#4B5563' } } },
                  grid: { line: { stroke: 'transparent' } },
                }}
              />
            </div>
          </div>

          {/* Line chart */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>DSO dropped 23% since Q1</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Days Sales Outstanding trend</p>
            </div>
            <div style={{ height: 220, padding: '8px 0' }}>
              <ResponsiveLine
                data={[{
                  id: 'DSO',
                  data: [
                    { x: 'Jan', y: 52 }, { x: 'Feb', y: 48 }, { x: 'Mar', y: 45 },
                    { x: 'Apr', y: 42 }, { x: 'May', y: 38 }, { x: 'Jun', y: 35 },
                  ],
                }]}
                margin={{ top: 16, right: 16, bottom: 40, left: 48 }}
                colors={CHART_COLORS.slice(0, 1)}
                lineWidth={2.5}
                pointSize={8}
                pointColor="#FF5A28"
                pointBorderWidth={2}
                pointBorderColor="#fff"
                enableGridX={false}
                enableGridY={false}
                enableArea={true}
                areaOpacity={0.08}
                axisBottom={{ tickSize: 0, tickPadding: 8 }}
                axisLeft={{ tickSize: 0, tickPadding: 8, format: (v: number) => `${v}d` }}
                motionConfig="gentle"
                theme={{
                  axis: { ticks: { text: { fontSize: 10, fill: '#4B5563' } } },
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Pie chart */}
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>Payment methods</span>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>Use donut sparingly — prefer bars for comparison</p>
            </div>
            <div style={{ height: 200, padding: '8px 0' }}>
              <ResponsivePie
                data={[
                  { id: 'Card', value: 45, color: '#FF5A28' },
                  { id: 'Bank', value: 30, color: '#1462D2' },
                  { id: 'Direct Debit', value: 15, color: '#3EA6FF' },
                  { id: 'Other', value: 10, color: '#FFB800' },
                ]}
                margin={{ top: 16, right: 80, bottom: 16, left: 16 }}
                innerRadius={0.55}
                padAngle={1.5}
                cornerRadius={3}
                colors={{ datum: 'data.color' }}
                enableArcLinkLabels={false}
                enableArcLabels={false}
                motionConfig="gentle"
                legends={[{
                  anchor: 'right',
                  direction: 'column',
                  translateX: 70,
                  itemWidth: 60,
                  itemHeight: 20,
                  itemTextColor: '#4B5563',
                  symbolSize: 10,
                  symbolShape: 'circle',
                }]}
              />
            </div>
          </div>

          {/* Color palette + rules */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chart Color Sequence</p>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {['#FF5A28', '#1462D2', '#3EA6FF', '#FFB800', '#34C759', '#6366F1'].map((c) => (
                <div key={c} style={{ flex: 1, height: 28, borderRadius: 4, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: '#fff', fontFamily: 'monospace', fontWeight: 600 }}>{c}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Orange always first — it\'s the accent',
                'Max 6 series per chart',
                'borderRadius: 4 on bars',
                'motionConfig="gentle"',
                'enableGridX={false} for clean look',
                'Title = insight, not label',
                'No 3D effects ever',
                'Tooltips inherit the brand theme',
                'Pie/donut sparingly — prefer bars for comparison',
              ].map((rule, i) => (
                <div key={i} style={{ fontSize: 11, color: 'var(--color-text-body)', paddingLeft: 10, borderLeft: '2px solid var(--color-border)' }}>{rule}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Failure Patterns ---- */}
      <Section title="Failure Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Common mistakes and how to avoid them. If you see one of these in a code review, fix it immediately.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { failure: 'Illustration style clash', cause: 'Mixed sources on same page', fix: 'Use one library per page' },
            { failure: 'Default purple unDraw', cause: 'Forgot to brand-color', fix: 'Set primary color to #FF5A28' },
            { failure: 'Broken images in production', cause: 'External URL dependency', fix: 'Self-host all assets' },
            { failure: 'Missing poster frames', cause: 'Video shows blank before play', fix: 'Add poster attribute' },
            { failure: 'Jarring animation', cause: 'Duration too long or wrong easing', fix: '150\u2013300ms, ease-out' },
            { failure: 'Oversized Rive file', cause: 'Complex illustration exported as .riv', fix: 'Keep .riv < 50KB' },
            { failure: 'Mismatched chart colors', cause: 'Hardcoded hex not from palette', fix: 'Use CHART_COLORS constant' },
            { failure: 'Nivo theme out of sync', cause: 'Brand tokens changed', fix: 'Update chart-theme.ts, grep old hex' },
            { failure: 'Too many series', cause: 'Chart is unreadable', fix: 'Max 6 series, gray out the rest' },
            { failure: 'Blurry PNG illustrations', cause: 'Raster instead of vector', fix: 'Use SVG format only' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '10px 12px', borderRadius: 6, background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>{row.failure}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.cause}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)' }}>{row.fix}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

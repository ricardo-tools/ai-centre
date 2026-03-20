'use client';
import { CodeBlock } from '@/platform/components/CodeBlock';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function AccessibilityShowcase() {
  return (
    <div>
      {/* Companion skills */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Apply alongside <strong>frontend-architecture</strong> (component patterns),{' '}
          <strong>design-foundations</strong> (visual hierarchy), and <strong>brand-design-system</strong> (contrast tokens).
        </p>
      </div>

      {/* Semantic HTML vs Div Soup */}
      <Section title="Semantic HTML First, ARIA Second">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>The right HTML element gives you accessibility for free. ARIA is a repair tool, not a first choice.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '2px solid var(--color-success)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-success)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semantic — Accessible by default</p>
            <CodeBlock language="html" title="Semantic HTML">{`<button onClick={handle}>
  Publish skill
</button>

<a href="/skills">Browse skills</a>

<nav aria-label="Main">...</nav>
<main>...</main>`}</CodeBlock>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '2px solid var(--color-danger)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Div soup — Requires ARIA to fix</p>
            <CodeBlock language="html" title="Div soup — needs ARIA">{`<div onClick={handle}
  role="button"
  tabIndex={0}
  onKeyDown={handleKey}>
  Publish skill
</div>

<div onClick={() => push('/skills')}>
  Browse skills
</div>`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Keyboard Navigation */}
      <Section title="Keyboard Navigation">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Every interactive element must be reachable and operable with a keyboard. This is non-negotiable.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { key: 'Tab', action: 'Move to next focusable element' },
            { key: 'Shift + Tab', action: 'Move to previous element' },
            { key: 'Enter', action: 'Activate button or link' },
            { key: 'Space', action: 'Activate button, toggle checkbox' },
            { key: 'Escape', action: 'Close modal, dismiss popup' },
            { key: '↑ ↓', action: 'Navigate within menus, lists' },
            { key: '← →', action: 'Navigate tabs, radio groups' },
            { key: 'Home / End', action: 'Jump to first/last item' },
          ].map((item) => (
            <div key={item.key} style={{ padding: 12, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 4, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>
                {item.key}
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>{item.action}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Focus Management */}
      <Section title="Focus Ring & Focus Management">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Never remove focus indicators. Visible focus is how keyboard users know where they are.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 6, background: 'var(--color-primary)', color: '#fff', fontSize: 13, fontWeight: 600, outline: '2px solid var(--color-primary)', outlineOffset: 2 }}>
              Focused Button
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 600, margin: '10px 0 0' }}>Visible focus ring</p>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 6, background: 'var(--color-primary)', color: '#fff', fontSize: 13, fontWeight: 600 }}>
              No Focus Ring
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-danger)', fontWeight: 600, margin: '10px 0 0' }}>outline: none — DON&apos;T</p>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)', textAlign: 'center' }}>
            <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 6, background: 'var(--color-primary)', color: '#fff', fontSize: 13, fontWeight: 600, boxShadow: '0 0 0 2px var(--color-bg), 0 0 0 4px var(--color-primary)' }}>
              Custom Ring
            </div>
            <p style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 600, margin: '10px 0 0' }}>:focus-visible styled</p>
          </div>
        </div>
        <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Focus management rules</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              'Modal opens → focus first focusable element inside',
              'Modal closes → focus returns to trigger element',
              'Tab within modal → trap focus (no escape to background)',
              'Dynamic content → announce via aria-live region',
              'Deleted item → focus nearest remaining item',
              'Route change → focus main content or h1',
            ].map((rule, i) => (
              <div key={i} style={{ fontSize: 12, color: 'var(--color-text-body)', paddingLeft: 10, borderLeft: '2px solid var(--color-primary)' }}>{rule}</div>
            ))}
          </div>
        </div>
      </Section>

      {/* Color Contrast */}
      <Section title="Color Contrast">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>WCAG AA requires 4.5:1 for normal text, 3:1 for large text (18px+ or 14px+ bold). Never rely on color alone to convey information.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, background: '#FFFFFF', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#1F2B7A', margin: '0 0 8px' }}>Dark on light</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-success)', margin: '0 0 4px' }}>12.6:1</p>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--color-success-muted)', color: 'var(--color-success)', fontWeight: 600 }}>AAA Pass</span>
          </div>
          <div style={{ padding: 20, borderRadius: 8, background: '#FFFFFF', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#9CA3AF', margin: '0 0 8px' }}>Gray on white</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-warning)', margin: '0 0 4px' }}>2.9:1</p>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'var(--color-danger-muted, rgba(255,0,0,0.1))', color: 'var(--color-danger)', fontWeight: 600 }}>AA Fail</span>
          </div>
          <div style={{ padding: 20, borderRadius: 8, background: '#121948', border: '1px solid var(--color-border)', textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', margin: '0 0 8px' }}>White on dark</p>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-success)', margin: '0 0 4px' }}>15.4:1</p>
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(52,199,89,0.2)', color: '#34C759', fontWeight: 600 }}>AAA Pass</span>
          </div>
        </div>
      </Section>

      {/* ARIA Roles */}
      <Section title="Common ARIA Patterns">
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Pattern</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>ARIA Attributes</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)' }}>Keyboard</span>
          </div>
          {[
            { pattern: 'Modal dialog', aria: 'role="dialog" aria-modal="true" aria-labelledby', keyboard: 'Esc closes, Tab traps focus' },
            { pattern: 'Tab panel', aria: 'role="tablist/tab/tabpanel" aria-selected', keyboard: '← → between tabs, Tab to panel' },
            { pattern: 'Dropdown menu', aria: 'role="menu/menuitem" aria-expanded', keyboard: '↑ ↓ navigate, Enter select, Esc close' },
            { pattern: 'Toast / alert', aria: 'role="alert" or aria-live="polite"', keyboard: 'Auto-announced, no focus steal' },
            { pattern: 'Disclosure', aria: 'aria-expanded aria-controls', keyboard: 'Enter/Space toggles, content follows' },
            { pattern: 'Combobox', aria: 'role="combobox" aria-autocomplete aria-activedescendant', keyboard: '↑ ↓ navigate, Enter select' },
          ].map((row, i) => (
            <div key={row.pattern} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 1fr', padding: '10px 16px', borderBottom: i < 5 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{row.pattern}</span>
              <code style={{ fontSize: 11, color: 'var(--color-secondary)' }}>{row.aria}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{row.keyboard}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Motion Sensitivity */}
      <Section title="Motion & Reduced Motion">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Respect the user&apos;s motion preference. Some users experience vestibular disorders triggered by animation.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default — motion enabled</p>
            <CodeBlock language="tsx" title="Motion enabled">{`<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
/>`}</CodeBlock>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reduced motion — fade only</p>
            <CodeBlock language="tsx" title="Reduced motion fallback">{`const prefersReduced =
  useReducedMotion();

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  // No transform, no bounce
/>`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* Failure Patterns */}
      <Section title="Failure Patterns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { failure: 'Missing alt text', fix: 'All <img> need alt. Decorative: alt=""' },
            { failure: 'Click-only handler on div', fix: 'Use <button> or add role + tabIndex + keyDown' },
            { failure: 'outline: none on :focus', fix: 'Style :focus-visible instead of removing' },
            { failure: 'Color as only indicator', fix: 'Add icon, text, or pattern alongside color' },
            { failure: 'Missing form labels', fix: '<label htmlFor="id"> or aria-label on input' },
            { failure: 'Auto-playing video/audio', fix: 'Muted autoplay only. Always provide controls.' },
            { failure: 'Low contrast text', fix: '4.5:1 for text, 3:1 for large text (WCAG AA)' },
            { failure: 'Focus trap missing in modal', fix: 'Loop Tab/Shift+Tab within modal boundaries' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '10px 12px', borderRadius: 6, background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)' }}>{row.failure}</span>
              <span style={{ fontSize: 12, color: 'var(--color-success)' }}>{row.fix}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

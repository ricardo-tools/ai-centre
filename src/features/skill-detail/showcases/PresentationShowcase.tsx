'use client';

import { useState, useRef, useEffect } from 'react';

/* ── Embedded Presentation ── */
function EmbeddedPresentation({ src, title }: { src: string; title: string }) {
  const [isFs, setIsFs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', h);
    return () => document.removeEventListener('fullscreenchange', h);
  }, []);

  const toggleFs = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  };

  const download = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    a.click();
  };

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: isFs ? 0 : 8,
        border: isFs ? 'none' : '1px solid var(--color-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-surface)',
        height: isFs ? '100vh' : 540,
      }}
    >
      {/* Iframe */}
      <div style={{ flex: 1, position: 'relative' }}>
        <iframe
          src={src}
          title={title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
        />
      </div>

      {/* Controls bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 40,
        padding: '0 12px',
        gap: 8,
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        flexShrink: 0,
      }}>
        <span style={{
          flex: 1,
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--color-text-muted)',
          letterSpacing: 0.3,
        }}>
          {title}
        </span>
        <button
          onClick={download}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Download HTML
        </button>
        <button
          onClick={toggleFs}
          style={{
            padding: '4px 12px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isFs ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
      </div>
    </div>
  );
}

/* ── Section Wrapper ── */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

/* ── Main Showcase ── */
export function PresentationShowcase() {
  return (
    <div>
      <Section title="Coffee & Health — Research Briefing">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          What / So What / Now What framework. Warm art direction with unique compositions per slide — hero numbers, split layouts, dose-response bars, numbered action cards. 7 slides.
        </p>
        <EmbeddedPresentation
          src="/showcases/coffee-health.html"
          title="Coffee and Your Health"
        />
      </Section>

      <Section title="Slack Recap — Product Launch">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          Problem-Agitation-Solution framework. Tech-product visual language — morning timeline, raw agitation numbers, three-step flow, before/after comparison, testimonial. 9 slides.
        </p>
        <EmbeddedPresentation
          src="/showcases/slack-recap.html"
          title="Introducing Slack Recap"
        />
      </Section>

      <Section title="Features">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Standalone HTML', desc: 'Each presentation is a self-contained HTML file with its own CSS, JS, and visual identity' },
            { label: 'Navigation', desc: 'Keyboard, click zones, touch swipe, and footer controls — all built in' },
            { label: 'PPTX Export', desc: 'One-click PowerPoint export via PptxGenJS with themed layouts' },
            { label: 'Light + Night', desc: 'Full dual-theme support with theme toggle in the footer bar' },
            { label: 'Fullscreen', desc: 'Native fullscreen presentation mode via F key or footer button' },
            { label: 'Unique Per Slide', desc: 'No rigid template — each slide has its own visual composition and layout' },
          ].map((f) => (
            <div key={f.label} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', margin: '0 0 4px' }}>{f.label}</p>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Pre-Flight ---- */}
      <Section title="Pre-Flight — Brand Context">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Before any planning, ask the user whether this is a branded presentation. This determines the entire art direction.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '2px solid var(--color-primary)', background: 'var(--color-primary-muted)' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>ezyCollect / Sidetrade</span>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '6px 0 12px', lineHeight: 1.5 }}>Follow brand-design-system closely. Brand orange accent, Jost typography, brand logos, full semantic color system. Ask if the user wants any exceptions.</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#FF5A28' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#1462D2' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#1F2B7A' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#121948' }} />
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>Topic-Native</span>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: '6px 0 12px', lineHeight: 1.5 }}>Accent color, typography, and art direction belong to the topic. Warm amber for coffee, Slack purple for Slack. Brand system provides structural guidance only.</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#C99640' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#6B46C1' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#1A73E8' }} />
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#2E9089' }} />
            </div>
          </div>
        </div>
      </Section>

      {/* ---- 7-Phase Planning Process ---- */}
      <Section title="7-Phase Planning Process">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>80% strategy, 20% production. Code is the last step, not the first.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { phase: '0', name: 'Discovery — Confirm Before You Build', desc: 'Presentation type, audience, tone/mood, depth, and brand context. Ask — do not assume.', accent: '#8B5CF6' },
            { phase: '1', name: 'Audience & Purpose', desc: 'Who is the audience? What should they think, feel, or do differently? What is at stake?', accent: '#FF5A28' },
            { phase: '2', name: 'Core Message & Narrative', desc: 'Distill the Big Idea in one sentence. Choose a messaging framework. Build the ghost deck.', accent: '#B88A30' },
            { phase: '3', name: 'Art Direction', desc: 'Mood, accent color (brand or topic-native per Phase 0), background textures, visual metaphor.', accent: '#2E9089' },
            { phase: '4', name: 'Slide-by-Slide Blueprint', desc: 'Purpose, governing thought, focal point, composition, visual weight, copy, transition role.', accent: '#1462D2' },
            { phase: '5', name: 'Execution', desc: 'Only now write code. Apply the plan, design system, narrative, and audience understanding.', accent: '#1F2B7A' },
            { phase: '6', name: 'Design Review Pass', desc: 'Hierarchy, consistency, alignment, inline elements, negative space, and pacing — verified across all slides.', accent: '#DC2626' },
          ].map((p) => (
            <div key={p.phase} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ width: 32, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-text-muted)', flexShrink: 0 }}>{p.phase}</div>
              <div style={{ flex: 1, padding: '10px 16px', borderRadius: 6, background: p.accent, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52 }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{p.name}</span>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '2px 0 0' }}>{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Phase 0 Discovery Questions */}
        <div style={{ marginTop: 16, padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase 0 — Discovery Questions</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { q: '1. Presentation Type', detail: 'Training, implementation, workshop, product launch, sales/pitch, keynote, board briefing, status update, retrospective, or onboarding?' },
              { q: '2. Audience', detail: 'Who are they, what do they already know, and what do they need?' },
              { q: '3. Tone & Mood', detail: 'Instructional, inspirational, analytical, conversational, persuasive, or technical?' },
              { q: '4. Depth', detail: 'Overview, step-by-step walkthrough, or deep-dive reference material?' },
              { q: '5. Brand Context', detail: 'ezyCollect / Sidetrade branded (brand orange, Jost, logos) or topic-native art direction?' },
            ].map((item) => (
              <div key={item.q} style={{ padding: 10, borderRadius: 6, borderLeft: '3px solid #8B5CF6', background: 'var(--color-bg-alt)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.q}</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Phase 6 Design Review Checks */}
        <div style={{ marginTop: 12, padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phase 6 — Design Review Checks</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { check: 'Hierarchy', detail: 'Does each slide have exactly one focal point?' },
              { check: 'Consistency', detail: 'Are equivalent elements (cards, badges, icons, spacing) identical across all slides?' },
              { check: 'Alignment', detail: 'Do text blocks, cards, and badges align to the same grid across slides?' },
              { check: 'Inline Elements', detail: 'When badges or numbers sit inline with wrapping titles, does the composition still look correct?' },
              { check: 'Negative Space', detail: 'Is spacing intentional, not leftover?' },
              { check: 'Pacing', detail: 'Does visual density vary? Are there breathing moments?' },
            ].map((item) => (
              <div key={item.check} style={{ padding: 10, borderRadius: 6, borderLeft: '3px solid #DC2626', background: 'var(--color-bg-alt)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.check}</span>
                <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Messaging Frameworks ---- */}
      <Section title="Messaging Frameworks">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Choose the framework that fits the context. The structure shapes how the audience receives the message.</p>

        {/* Persuasion & Influence Structures */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Persuasion & Influence Structures</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { name: 'Contrast Pattern (Duarte)', best: 'Keynotes, vision', structure: '"What is" vs "what could be" — building tension to a climactic call to action' },
            { name: 'Situation-Complication-Resolution (Minto)', best: 'Board decks, exec briefs', structure: 'Agreed facts → what changed → recommendation. Lead with the answer.' },
            { name: 'Problem-Agitation-Solution', best: 'Sales, fundraising', structure: 'Name the problem → make it worse → present relief' },
            { name: 'Monroe\'s Motivated Sequence', best: 'Proposals, change mgmt', structure: 'Attention → Need → Satisfaction → Visualization → Action' },
            { name: 'Before-After-Bridge', best: 'Product launches', structure: 'World today → world with this → how we get there' },
          ].map((fw) => (
            <div key={fw.name} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{fw.name}</span>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', fontWeight: 600, display: 'block', marginTop: 2 }}>{fw.best}</span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '6px 0 0', lineHeight: 1.4 }}>{fw.structure}</p>
            </div>
          ))}
        </div>

        {/* Knowledge Transfer Structures */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Knowledge Transfer Structures</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { name: 'Concept → Demo → Config → Gotchas → Practice', best: 'Technical training, implementation', structure: 'Explain what it is → show it working → walk through setup → warn about pitfalls → let them try' },
            { name: 'Overview → Prerequisites → Steps → Troubleshoot → Support', best: 'Implementation guides, onboarding', structure: 'Big picture → what you need first → step-by-step → common problems → where to get help' },
            { name: 'Context → Demo → Hands On → Debrief', best: 'Workshops', structure: 'Why this matters → watch me do it → now you do it → what did we learn' },
            { name: 'What → So What → Now What', best: 'Data presentations, status updates', structure: 'Present the facts → interpret why they matter → recommend what to do' },
            { name: 'What Happened → Why → Lessons → Actions', best: 'Retrospectives, post-mortems', structure: 'Events → root causes → takeaways → concrete next steps' },
            { name: 'Map → Orient → Equip → Release', best: 'Onboarding', structure: 'Show the landscape → locate them in it → give them the tools → set them loose' },
          ].map((fw) => (
            <div key={fw.name} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{fw.name}</span>
              <span style={{ fontSize: 11, color: 'var(--color-secondary)', fontWeight: 600, display: 'block', marginTop: 2 }}>{fw.best}</span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '6px 0 0', lineHeight: 1.4 }}>{fw.structure}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Copy Craft ---- */}
      <Section title="Copy Craft">
        {/* Headlines by Type */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Headlines Vary by Type</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          {[
            { type: 'Persuasion', style: 'Assertions', example: '"Customer satisfaction dropped 15% after the redesign, driven by checkout friction"', test: 'The "so what?" test — if someone can ask "so what?" after reading it, rewrite.' },
            { type: 'Training', style: 'Signposts', example: '"What You\'ll Configure in This Section"', test: 'The "could I follow this?" test — if someone reads just the headlines, could they perform the task?' },
            { type: 'Implementation', style: 'Action steps', example: '"Connect the client\'s accounting system using the REST endpoint"', test: 'The specificity test — does the headline contain a specific name, path, or concrete detail, not just a generic topic?' },
            { type: 'Reporting', style: 'Insights', example: '"Response Times Dropped 40% After Migration"', test: 'The "what changed?" test — does the headline state the insight, not just the data label?' },
          ].map((h) => (
            <div key={h.type} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{h.type}</span>
                <span style={{ fontSize: 11, color: 'var(--color-secondary)', fontWeight: 600 }}>Headlines are {h.style}</span>
              </div>
              <div style={{ padding: 8, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg-alt)', marginBottom: 8 }}>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, fontStyle: 'italic' }}>{h.example}</p>
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{h.test}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Rules */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Writing Rules</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { rule: 'Billboard Test', desc: 'Readable in 3 seconds at 65mph. One idea per slide.' },
                { rule: 'Specificity', desc: '"12% to 31% in 18 months" not "significant growth"' },
                { rule: 'Emotion Before Logic', desc: 'Persuasion decks: Story → data → action. Customer story before NPS data.' },
                { rule: 'Clarity Before Completeness', desc: 'Knowledge transfer decks: Context → demo → steps → pitfalls → safety net.' },
                { rule: 'Tight Bullets', desc: 'Max 3-4 per slide, each under 12 words. Min 18px body, 32px+ headlines.' },
              ].map((r) => (
                <div key={r.rule} style={{ paddingLeft: 10, borderLeft: '2px solid var(--color-secondary)' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{r.rule}</span>
                  <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Specificity */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specificity Creates Credibility</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { bad: '"Significant growth"', good: '"12% to 31% market share in 18 months"' },
                { bad: '"Configure the settings"', good: '"Set max_instalments to 6 in the Guardrails tab"' },
                { bad: '"This will save money"', good: '"$2.3M annually by eliminating 14 manual steps"' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid var(--color-danger)', background: 'var(--color-surface)' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-danger)' }}>VAGUE</span>
                    <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: '2px 0 0' }}>{s.bad}</p>
                  </div>
                  <div style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid var(--color-success)', background: 'var(--color-surface)' }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-success)' }}>SPECIFIC</span>
                    <p style={{ fontSize: 11, color: 'var(--color-text-body)', margin: '2px 0 0' }}>{s.good}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Visual Composition ---- */}
      <Section title="Visual Composition Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>No rigid slide types. Each slide is a unique composition. Mix, combine, and invent.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { name: 'Hero Number', when: 'Single metric headline' },
            { name: 'Split', when: 'Text + visual' },
            { name: 'Before/After', when: 'Contrast or transformation' },
            { name: 'Timeline', when: 'Sequential events' },
            { name: 'Horizontal Bars', when: 'Comparing quantities' },
            { name: 'Numbered Cards', when: 'Ordered steps' },
            { name: 'Icon Rows', when: 'Categorized benefits' },
            { name: 'Three-Step Flow', when: 'Simple process' },
            { name: 'Left-Bar Quote', when: 'Testimonial' },
            { name: 'Centered Quote', when: 'High-impact statement' },
            { name: 'Asymmetric Title', when: 'Bold opening' },
            { name: 'Full-Accent Divider', when: 'Section break' },
          ].map((p) => (
            <div key={p.name} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{p.name}</span>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{p.when}</p>
            </div>
          ))}
        </div>

        {/* Training & Implementation Patterns */}
        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, marginTop: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Training & Implementation Patterns</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { name: 'Annotated UI Mockup', when: 'Config walkthrough, showing where to click' },
            { name: 'Step-by-Step Procedure', when: 'Ordered instructions to follow' },
            { name: 'Code / Endpoint Reference', when: 'API or technical detail' },
            { name: 'Config Table', when: 'Settings, parameters, defaults' },
            { name: 'Gotcha / Warning Callout', when: 'Common pitfalls, things that go wrong' },
            { name: 'Tip / Pro-tip', when: 'Non-obvious shortcuts or best practices' },
            { name: 'Decision Tree / Flowchart', when: 'Conditional logic, "if X then Y"' },
            { name: 'FAQ Pairs', when: 'Anticipated questions with answers' },
            { name: 'Hands-on Prompt', when: 'Workshop exercise, practice moment' },
            { name: 'Terminal / Console Output', when: 'Command-line interaction' },
            { name: 'Comparison Matrix', when: 'Feature flags, plan tiers, option comparison' },
          ].map((p) => (
            <div key={p.name} style={{ padding: 10, borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{p.name}</span>
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', margin: '2px 0 0' }}>{p.when}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { rule: 'One Focal Point', desc: 'Every slide has ONE thing the eye sees first. Hierarchy: size → color → position → isolation → weight → motion.' },
            { rule: 'Negative Space', desc: 'Title slides: 60-70% empty. Content: 30-40%. Quote: 50-60%. Breathing: 80%+. Fills every inch = anxiety.' },
            { rule: 'Pacing Through Contrast', desc: 'Dense → light → dense. Analytical → personal. After every 3-4 dense slides, include a breathing moment.' },
          ].map((r) => (
            <div key={r.rule} style={{ padding: 14, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{r.rule}</span>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: '4px 0 0', lineHeight: 1.4 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Design Toolkit ---- */}
      <Section title="Design Toolkit">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Visual building blocks that combine differently for each slide.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Left: Layered Backgrounds + Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Layered Backgrounds</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { layer: '1. Base', detail: 'Radial or linear gradient' },
                  { layer: '2. Grid', detail: 'Thin lines at 2-3% opacity, 60px spacing' },
                  { layer: '3. Glow Orbs', detail: 'blur(120px), 6-15% opacity, accent-colored' },
                ].map((l) => (
                  <div key={l.layer} style={{ fontSize: 12, color: 'var(--color-text-body)', paddingLeft: 10, borderLeft: '2px solid var(--color-border)' }}>
                    <strong>{l.layer}</strong> — {l.detail}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Glassmorphism Cards</p>
              <div style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.8 }}>
                <div>border-radius: 12–16px</div>
                <div>Subtle border (8% opacity dark, 7% light)</div>
                <div>Hover: accent border, translateY(-4px), deeper shadow</div>
                <div>Optional accent top-line (::before gradient)</div>
              </div>
            </div>
          </div>
          {/* Right: Typography Chain + Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Kicker → Title → Subtitle</p>
              <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-bg-alt)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--color-primary)', marginBottom: 4 }}>KICKER TEXT</div>
                <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.5, color: 'var(--color-text-heading)', marginBottom: 4 }}>The Main Headline Goes Here</div>
                <div style={{ fontSize: 14, fontWeight: 300, color: 'var(--color-text-muted)' }}>Supporting subtitle with additional context and detail</div>
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stats as Large Numbers</p>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { val: '42%', label: 'INCREASE' },
                  { val: '$2.3M', label: 'SAVED' },
                  { val: '14', label: 'STEPS CUT' },
                ].map((s) => (
                  <div key={s.label} style={{ flex: 1, padding: 12, borderRadius: 8, background: 'var(--color-bg-alt)', textAlign: 'center' }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-primary)' }}>{s.val}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>Never use donut charts for simple percentages. Large bold numbers are cleaner.</p>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Staggered Reveals:</strong> Content appears with cascading 0.1s delays. translateY(24px) → 0.</p>
          </div>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Check Lists:</strong> Bullet items as cards with accent check icons, not plain text lists.</p>
          </div>
          <div style={{ padding: 12, borderRadius: 6, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)' }}>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0 }}><strong>Breathing Slides:</strong> Section dividers with full accent bg, emoji + large text. Reset attention.</p>
          </div>
        </div>
      </Section>

      {/* ---- Logo Placement ---- */}
      <Section title="Logo Placement">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Consistent brand presence across all slides. Rules depend on the brand context confirmed in Phase 0.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>First & Last Slides</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>Display the <strong>rectangle logo</strong> prominently — sized to be clearly readable. Anchors the composition without competing with the headline.</p>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>All Other Slides</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>Display the <strong>square logo</strong> as a small watermark, consistently positioned (top-right or bottom-left). Subtle at <strong>60-70% opacity</strong> but always present.</p>
          </div>
          <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>Theme-Aware</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>Use the color variant on light backgrounds and the white variant on dark/night backgrounds. PPTX export includes logo via <code style={{ fontSize: 11, fontFamily: 'monospace' }}>addImage</code>.</p>
          </div>
        </div>
      </Section>

      {/* ---- Navigation & Footer ---- */}
      <Section title="Navigation & Footer Bar">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>Keyboard & Touch Navigation</span>
            </div>
            {[
              { input: 'Arrow R/D, Space', action: 'Next slide' },
              { input: 'Arrow L/U', action: 'Previous slide' },
              { input: 'Home / End', action: 'First / last slide' },
              { input: 'F', action: 'Toggle fullscreen' },
              { input: 'Escape', action: 'Exit fullscreen' },
              { input: '1-9', action: 'Jump to slide' },
              { input: 'Click right 85%', action: 'Next slide' },
              { input: 'Click left 15%', action: 'Previous slide' },
              { input: 'Swipe L/R', action: 'Next / previous (touch)' },
            ].map((row, i) => (
              <div key={row.input} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 16px', borderBottom: i < 8 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
                <code style={{ fontSize: 12, color: 'var(--color-secondary)', fontFamily: 'monospace' }}>{row.input}</code>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.action}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Footer bar mockup */}
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Glassmorphism Footer Bar</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, background: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-body)', flexShrink: 0 }}>Title</span>
                <div style={{ flex: 1, height: 3, borderRadius: 2, background: 'var(--color-border)', overflow: 'hidden' }}>
                  <div style={{ width: '25%', height: '100%', borderRadius: 2, background: 'var(--color-primary)' }} />
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>⤓</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>☀</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>⛶</span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>← 3/12 →</span>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 6 }}>backdrop-filter: blur(20px). Round 40px nav buttons. 3px progress bar with accent fill.</p>
            </div>
            {/* PPTX rules */}
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PPTX Export Rules</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  'NEVER use # in hex colors (FF5A28 not #FF5A28)',
                  'NEVER encode opacity in hex — use transparency prop',
                  'NEVER reuse option objects — PptxGenJS mutates in place',
                  'Fresh new PptxGenJS() per export',
                  'Use bullet: true, not Unicode bullet characters',
                  'LAYOUT_16x9, Jost font (fontFace: \'Jost\' on every text element), ROUNDED_RECTANGLE cards',
                ].map((rule, i) => (
                  <div key={i} style={{ fontSize: 11, color: 'var(--color-text-body)', paddingLeft: 10, borderLeft: `2px solid ${i < 3 ? 'var(--color-danger)' : 'var(--color-border)'}` }}>{rule}</div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8, fontStyle: 'italic' }}>See the companion <strong>pptx-export</strong> skill for the full PPTX validation checklist, spacing grid, and brand fidelity rules.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Failure Patterns ---- */}
      <Section title="Failure Patterns">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Common anti-patterns that degrade presentation quality. Recognize and fix them early.</p>
        <div style={{ borderRadius: 8, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)', padding: '8px 16px' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Failure</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Why It Happens</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fix</span>
          </div>
          {[
            { failure: 'Phase 0 skipped', why: 'Jumps straight to slide design', fix: 'Phase 0 is mandatory — no code before discovery' },
            { failure: 'Headline type mismatch', why: 'Wrong headline style for slide purpose', fix: 'Match headline to presentation type' },
            { failure: 'Visual monotony', why: 'Same layout repeated', fix: 'Alternate layouts, max 2 consecutive same-type' },
            { failure: 'Slide overload', why: 'Too much content per slide', fix: 'One insight per slide, max 6 bullets' },
            { failure: 'Missing section breaks', why: 'No visual separation between topics', fix: 'Add section divider slides' },
            { failure: 'No speaker notes', why: 'Presenter has no guidance', fix: 'Add notes for every content slide' },
            { failure: 'Inconsistent transition', why: 'Mixed transition styles', fix: 'Use one transition type throughout' },
            { failure: 'Skipped pre-delivery checklist', why: 'Errors in final output', fix: 'Run full checklist before export' },
          ].map((row, i) => (
            <div key={row.failure} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1.2fr', padding: '10px 16px', borderBottom: i < 7 ? '1px solid var(--color-border)' : 'none', background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-danger)' }}>{row.failure}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.why}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.fix}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Pre-Delivery Checklist ---- */}
      <Section title="Pre-Delivery Checklist">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>Verify every item before delivering. Organized by category.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Strategy */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Strategy</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Discovery (Phase 0) completed — type, audience, tone, depth, brand confirmed',
                'Core message is clear in one sentence',
                'Narrative structure matches the presentation type',
                'Ghost deck (headline sequence) tells the complete story',
                'Opening hooks — no generic title slide',
                'Closing is actionable — clear next step (not "Thank You")',
                'Pacing varies: dense / light / dense, with breathing slides',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--color-border)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Copy */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Copy</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Headlines match type (assertions for persuasion, signposts for training, insights for reporting)',
                'Every headline passes the appropriate test (so what? / could I follow this? / what changed?)',
                'Maximum 3-4 bullets per slide, each under 12 words',
                'Specific — numbers, paths, field names, concrete details',
                'One idea per slide — no "and also"',
                'Tone is consistent with Phase 0 discovery',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--color-border)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Visual */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visual</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Each slide has ONE clear focal point',
                'Passes the squint test (hierarchy visible when blurred)',
                'Passes the billboard test (readable in 3 seconds)',
                'Negative space is intentional, not leftover',
                'Accent color used for emphasis only, not decoration',
                'Accent color feels native to the topic',
                'No two consecutive slides share the same layout',
                'Each slide has its own CSS composition',
                'Art direction matches the topic and audience',
                'Logo: prominent on first/last, watermark on all others',
                'Design review pass (Phase 6) completed',
                'Inline badges/numbers handle multi-line wrapping correctly',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--color-border)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Technical */}
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technical</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Light theme is the default',
                'Arrow keys, Space, click, and swipe navigation work',
                'Theme toggle switches cleanly between Light and Night',
                'Fullscreen works (F key and button)',
                'PPTX export produces styled, themed slides',
                'PPTX uses fontFace: \'Jost\' on every text element',
                'PPTX uses no # in hex colors',
                'PPTX slide backgrounds use { color } not { fill }',
                'PPTX shadow/style objects use factory functions',
                'PPTX elements all within bounds (x+w <= 10, y+h <= 5.625)',
                'PPTX opens without repair prompt',
                'Footer shows progress, controls, and title',
                'Touch swipe works on mobile',
                'Font sizes readable on mobile (min 18px body)',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid var(--color-border)', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)', lineHeight: 1.4 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

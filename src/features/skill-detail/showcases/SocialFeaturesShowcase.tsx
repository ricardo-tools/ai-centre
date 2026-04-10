'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

/* ---- data ---- */
const featureMatrix = [
  { feature: 'Download / usage counters', impact: 'High', cost: 'Low', recommendation: 'Implement first', order: 1 },
  { feature: 'Emoji reactions', impact: 'High', cost: 'Low', recommendation: 'Implement second', order: 2 },
  { feature: 'Comments (threaded)', impact: 'Medium', cost: 'Medium', recommendation: 'Implement third', order: 3 },
  { feature: '@Mentions', impact: 'Medium', cost: 'Low', recommendation: 'Add with comments', order: 4 },
  { feature: 'Activity feed (per-entity)', impact: 'Medium', cost: 'Medium', recommendation: 'Implement fourth', order: 5 },
  { feature: 'In-app notifications', impact: 'Medium', cost: 'Medium', recommendation: 'Add with activity feed', order: 6 },
  { feature: 'Email digests', impact: 'Low', cost: 'Medium', recommendation: 'After in-app validated', order: 7 },
  { feature: 'Favourites / bookmarks', impact: 'Low', cost: 'Low', recommendation: 'Nice-to-have', order: 8 },
];

const enterpriseVsConsumer = [
  {
    category: 'Goal',
    enterprise: 'Help people find knowledge and share feedback',
    consumer: 'Maximize engagement and time-on-platform',
    color: 'var(--color-primary)',
  },
  {
    category: 'Social Proof',
    enterprise: '"Downloaded 47 times" / "Used by 12 teams"',
    consumer: '"47 people viewing this now"',
    color: 'var(--color-secondary)',
  },
  {
    category: 'Notifications',
    enterprise: 'Batched 15-min digests, opt-out defaults',
    consumer: 'Per-event push, designed for re-engagement',
    color: 'var(--color-brand)',
  },
  {
    category: 'Feeds',
    enterprise: 'Scoped to entity being viewed',
    consumer: 'Global infinite scroll',
    color: 'var(--color-warning)',
  },
  {
    category: 'Gamification',
    enterprise: 'Never — creates perverse incentives',
    consumer: 'Badges, leaderboards, streaks',
    color: 'var(--color-error)',
  },
  {
    category: 'Reactions',
    enterprise: 'Constrained set (5-6 emoji)',
    consumer: 'Any emoji, custom stickers, GIFs',
    color: 'var(--color-primary)',
  },
];

const polymorphicArchitecture = [
  { entity: 'Skill', example: "{ entityType: 'skill', entityId: '550e...' }", note: 'Comments, reactions, activity' },
  { entity: 'Showcase', example: "{ entityType: 'showcase', entityId: '7a3f...' }", note: 'Same tables, same queries' },
  { entity: 'Project', example: "{ entityType: 'project', entityId: 'a1b2...' }", note: 'Zero schema changes needed' },
  { entity: 'Archetype', example: "{ entityType: 'archetype', entityId: 'c3d4...' }", note: 'Just pass a new entity_type' },
];

const privacyRules = [
  { rule: 'All social content is visible to all authenticated users', scope: 'Visibility' },
  { rule: 'No private messages — use existing channels (Slack, email)', scope: 'Visibility' },
  { rule: 'Admins can delete any comment (soft delete)', scope: 'Moderation' },
  { rule: 'Users can edit own comments within 15 minutes', scope: 'Moderation' },
  { rule: 'Include all social data in GDPR data exports', scope: 'GDPR' },
  { rule: 'Anonymise author on erasure, keep content for thread integrity', scope: 'GDPR' },
  { rule: 'Auto-purge read notifications older than 90 days', scope: 'Retention' },
];

export function SocialFeaturesShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> For implementation details, see <strong>comments-reactions</strong> (schema, threading, mentions)
          and <strong>activity-notifications</strong> (event logging, delivery, preferences).
          For user lifecycle, see <strong>user-management</strong>.
        </p>
      </div>

      {/* ---- Enterprise vs Consumer ---- */}
      <Section title="Enterprise vs Consumer Social">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Enterprise social features help people find knowledge and build on each other&apos;s work.
          If a feature does not make someone&apos;s job easier, do not build it.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
              borderRadius: '8px 8px 0 0',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Category</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>Enterprise (Do This)</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)' }}>Consumer (Not This)</span>
          </div>
          {enterpriseVsConsumer.map((row, i) => (
            <div
              key={row.category}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.category}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{row.enterprise}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>{row.consumer}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Feature Decision Matrix ---- */}
      <Section title="Feature Decision Matrix">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Prioritise features by adoption impact relative to implementation cost.
          Build in this order — validate each feature with real usage before adding the next.
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
              gridTemplateColumns: '40px 1fr 90px 90px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>#</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Feature</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Impact</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Cost</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Recommendation</span>
          </div>
          {featureMatrix.map((f, i) => (
            <div
              key={f.feature}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 90px 90px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{f.order}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-heading)' }}>{f.feature}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: f.impact === 'High' ? 'var(--color-success)' : f.impact === 'Medium' ? 'var(--color-warning)' : 'var(--color-text-muted)',
                  color: '#FFFFFF',
                }}
              >
                {f.impact}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: f.cost === 'Low' ? 'var(--color-success)' : f.cost === 'Medium' ? 'var(--color-warning)' : 'var(--color-error)',
                  color: '#FFFFFF',
                }}
              >
                {f.cost}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{f.recommendation}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Polymorphic Architecture ---- */}
      <Section title="Polymorphic Architecture">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          One comments table, one reactions table, one activity events table — all using <code style={{ background: 'var(--color-bg-alt)', padding: '2px 6px', borderRadius: 4 }}>entity_type + entity_id</code>.
          Adding social features to a new entity type takes 5 minutes, not 5 days.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {polymorphicArchitecture.map((p) => (
            <div
              key={p.entity}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>{p.entity}</div>
              <code style={{ fontSize: 11, display: 'block', padding: '6px 10px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-body)', marginBottom: 8 }}>{p.example}</code>
              <span style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 500 }}>{p.note}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderLeft: '4px solid var(--color-error)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-error)', marginBottom: 4 }}>Anti-pattern: Per-entity tables</div>
          <code style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>skill_comments, showcase_comments, project_comments — N tables for N entity types</code>
        </div>
      </Section>

      {/* ---- Reaction Set ---- */}
      <Section title="Constrained Reaction Set">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          5-6 emoji maximum. Prevents fragmentation, simplifies aggregation, avoids &quot;which emoji do I pick&quot; paralysis.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { emoji: '\uD83D\uDC4D', code: 'thumbs_up', purpose: 'Agreement' },
            { emoji: '\uD83D\uDC4E', code: 'thumbs_down', purpose: 'Needs work' },
            { emoji: '\u2764\uFE0F', code: 'heart', purpose: 'Appreciation' },
            { emoji: '\uD83C\uDF89', code: 'celebrate', purpose: 'Milestone' },
            { emoji: '\uD83D\uDE15', code: 'confused', purpose: 'Unclear' },
            { emoji: '\uD83D\uDE80', code: 'rocket', purpose: 'Ship it' },
          ].map((r) => (
            <div
              key={r.code}
              style={{
                width: 100,
                padding: 16,
                borderRadius: 12,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{r.emoji}</div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--color-text-muted)', marginBottom: 4 }}>{r.code}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{r.purpose}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Privacy & Moderation ---- */}
      <Section title="Privacy & Moderation">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {privacyRules.map((r) => (
            <div
              key={r.rule}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                borderRadius: 6,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textTransform: 'uppercase',
                  background: r.scope === 'GDPR' ? 'var(--color-error)' : r.scope === 'Moderation' ? 'var(--color-warning)' : r.scope === 'Retention' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  color: '#FFFFFF',
                  flexShrink: 0,
                  minWidth: 80,
                  textAlign: 'center',
                }}
              >
                {r.scope}
              </span>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{r.rule}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

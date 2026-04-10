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
const pipelineSteps = [
  { step: 'Action occurs', detail: 'User creates a comment, publishes a skill, reacts', icon: '1', color: 'var(--color-primary)' },
  { step: 'Activity event logged', detail: 'Immutable record: actor, entity, eventType, metadata', icon: '2', color: 'var(--color-secondary)' },
  { step: 'Recipients resolved', detail: 'Entity owner, mentioned users, subscribers', icon: '3', color: 'var(--color-brand)' },
  { step: 'Preferences checked', detail: 'Per-type, per-channel (in-app / email) toggles', icon: '4', color: 'var(--color-warning)' },
  { step: 'Notifications created', detail: 'One row per recipient with title, body, link', icon: '5', color: 'var(--color-success)' },
  { step: 'In-app delivery', detail: 'Polling every 30s for unread count, load on drawer open', icon: '6', color: 'var(--color-primary)' },
  { step: 'Email digest', detail: 'Cron every 15 min batches unread + un-emailed per user', icon: '7', color: 'var(--color-error)' },
];

const notificationTypes = [
  { type: 'mention', label: 'Mentioned in a comment', template: '${actorName} mentioned you', inAppDefault: true, emailDefault: true },
  { type: 'comment_on_owned', label: 'Comment on your content', template: '${actorName} commented on ${entityTitle}', inAppDefault: true, emailDefault: true },
  { type: 'reply_to_comment', label: 'Reply to your comment', template: '${actorName} replied to your comment', inAppDefault: true, emailDefault: true },
  { type: 'skill_published', label: 'Skill published', template: '${skillTitle} was published', inAppDefault: true, emailDefault: false },
  { type: 'reaction_received', label: 'Reaction on your content', template: '${actorName} reacted ${emoji}', inAppDefault: true, emailDefault: false },
];

const deliveryComparison = [
  { method: 'Polling (30s)', pros: 'Simple, works on Vercel serverless, no connection state', cons: 'Up to 30s delay, unnecessary requests', recommendation: 'Default for < 1000 users' },
  { method: 'SSE', pros: 'Real-time, one-way server push, lower latency', cons: 'Requires long-lived connections, Vercel limits', recommendation: 'If real-time is critical' },
  { method: 'WebSocket', pros: 'Bi-directional, true real-time', cons: 'Needs dedicated infra, complex state management', recommendation: 'Only at scale (10K+ users)' },
];

const cronJobs = [
  { job: 'Email digest', schedule: '*/15 * * * *', desc: 'Batch unread + un-emailed notifications per user, send one digest email, mark as emailed', retention: 'N/A' },
  { job: 'Purge notifications', schedule: '0 3 * * *', desc: 'Delete read notifications older than 90 days to prevent unbounded table growth', retention: '90 days' },
];

const sampleTimeline = [
  { actor: 'Alice Chen', action: 'commented on', entity: 'Clean Architecture', time: '5 min ago', type: 'comment_created' },
  { actor: 'Bob Smith', action: 'reacted \uD83D\uDE80 to', entity: 'Clean Architecture', time: '12 min ago', type: 'reaction_received' },
  { actor: 'Carol Davis', action: 'mentioned you in', entity: 'Backend Patterns', time: '1h ago', type: 'mention' },
  { actor: 'System', action: 'published', entity: 'Security Review v2.0', time: '3h ago', type: 'skill_published' },
  { actor: 'Eve Torres', action: 'replied to your comment on', entity: 'Testing Strategy', time: '5h ago', type: 'reply_to_comment' },
];

export function ActivityNotificationsShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This is the implementation skill for <strong>social-features</strong>.
          For comment and reaction events that feed into this system, see <strong>comments-reactions</strong>.
          For email delivery infrastructure, see <strong>email-sending</strong>.
        </p>
      </div>

      {/* ---- Event Logging Pipeline ---- */}
      <Section title="Event Logging Pipeline">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Every notable action creates an immutable activity event. Notifications are derived from events for specific recipients.
          Never create notifications without an underlying event.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pipelineSteps.map((s) => (
            <div
              key={s.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `6px solid ${s.color}`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: s.color,
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
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Preference Matrix ---- */}
      <Section title="Notification Preference Matrix">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Users control per-type, per-channel toggles. Defaults are opt-in (all enabled). Users dial down from there.
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
              gridTemplateColumns: '180px 1fr 1fr 90px 90px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Type</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Label</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Template</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>In-App</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Email</span>
          </div>
          {notificationTypes.map((n, i) => (
            <div
              key={n.type}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 1fr 90px 90px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 11, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{n.type}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-heading)' }}>{n.label}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{n.template}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: n.inAppDefault ? 'var(--color-success)' : 'var(--color-bg-alt)', border: `2px solid ${n.inAppDefault ? 'var(--color-success)' : 'var(--color-border)'}` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: n.emailDefault ? 'var(--color-success)' : 'var(--color-bg-alt)', border: `2px solid ${n.emailDefault ? 'var(--color-success)' : 'var(--color-border)'}` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Delivery: Polling vs SSE vs WebSocket ---- */}
      <Section title="Delivery Method Comparison">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {deliveryComparison.map((d) => (
            <div
              key={d.method}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: d.method === 'Polling (30s)' ? '4px solid var(--color-success)' : '4px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 12 }}>{d.method}</div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', marginBottom: 4 }}>Pros</div>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>{d.pros}</p>
              </div>
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', marginBottom: 4 }}>Cons</div>
                <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>{d.cons}</p>
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 500 }}>{d.recommendation}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Sample Activity Timeline ---- */}
      <Section title="Per-Entity Activity Feed">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Activity feeds are scoped to the entity being viewed. &quot;What happened on this skill recently?&quot; is useful.
          &quot;What happened everywhere?&quot; is noise.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {sampleTimeline.map((t, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 16px',
                borderLeft: '2px solid var(--color-border)',
                marginLeft: 16,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  border: '2px solid var(--color-bg)',
                  position: 'absolute',
                  left: -6,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, marginLeft: 8 }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>
                  <strong style={{ color: 'var(--color-text-heading)' }}>{t.actor}</strong>{' '}
                  {t.action}{' '}
                  <strong style={{ color: 'var(--color-primary)' }}>{t.entity}</strong>
                </span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>{t.time}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Cron Jobs ---- */}
      <Section title="Cron Jobs">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {cronJobs.map((j) => (
            <div
              key={j.job}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>{j.job}</div>
              <code style={{ fontSize: 12, display: 'block', padding: '6px 10px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-primary)', marginBottom: 10, fontFamily: 'monospace' }}>{j.schedule}</code>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{j.desc}</p>
              {j.retention !== 'N/A' && (
                <div style={{ marginTop: 8, fontSize: 11, color: 'var(--color-warning)', fontWeight: 500 }}>Retention: {j.retention}</div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Fan-out Pattern ---- */}
      <Section title="Event Creation + Fan-out Pattern">
        <CodeBlock>{`async function createEventAndNotify(params: {
  eventType: string;
  actorId: string;
  entityType: string;
  entityId: string;
  recipients: { userId: string; reason: string }[];
}): Promise<void> {
  await db.transaction(async (tx) => {
    // 1. Create immutable event
    const [event] = await tx.insert(activityEvents)
      .values({ ...params }).returning();

    // 2. Fan out to recipients
    for (const r of params.recipients) {
      // Skip the actor (don't notify yourself)
      if (r.userId === params.actorId) continue;

      // Check preferences
      const pref = await getPreference(r.userId, r.reason);
      if (!pref?.inApp) continue;

      // Create notification
      await tx.insert(notifications).values({
        recipientId: r.userId,
        eventId: event.id,
        type: params.eventType,
        title: renderTitle(params),
        link: renderLink(params),
      });
    }
  });
}`}</CodeBlock>
      </Section>
    </div>
  );
}

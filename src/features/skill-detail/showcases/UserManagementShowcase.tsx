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
const userStates = [
  { state: 'Invited', desc: 'Email sent, awaiting first login', color: 'var(--color-text-muted)' },
  { state: 'Active', desc: 'Verified, can use the platform', color: 'var(--color-success)' },
  { state: 'Suspended', desc: 'Temporarily blocked by admin', color: 'var(--color-warning)' },
  { state: 'Deleted', desc: 'Soft-deleted, data anonymised', color: 'var(--color-error)' },
];

const transitions = [
  { from: 'Invited', to: 'Active', trigger: 'First login / OTP verified', actor: 'System' },
  { from: 'Invited', to: 'Deleted', trigger: 'Admin removes invitation', actor: 'Admin' },
  { from: 'Active', to: 'Suspended', trigger: 'Admin suspends account', actor: 'Admin' },
  { from: 'Active', to: 'Deleted', trigger: 'User requests deletion or admin deletes', actor: 'User / Admin' },
  { from: 'Suspended', to: 'Active', trigger: 'Admin reactivates account', actor: 'Admin' },
  { from: 'Suspended', to: 'Deleted', trigger: 'Admin deletes suspended user', actor: 'Admin' },
  { from: 'Deleted', to: '(none)', trigger: 'Terminal state — no transitions out', actor: 'N/A' },
];

const softDeleteFlow = [
  { step: 'Request deletion', detail: 'User requests or admin initiates', what: 'Validate transition is allowed' },
  { step: 'Set deletedAt', detail: 'Timestamp marks when deletion occurred', what: 'Enables retention window tracking' },
  { step: 'Filter from queries', detail: 'Global WHERE deletedAt IS NULL', what: 'User disappears from all views' },
  { step: 'Anonymise PII', detail: 'email, displayName, avatarUrl cleared', what: 'GDPR right-to-erasure compliance' },
  { step: 'Audit log', detail: 'Immutable record of who, when, why', what: 'Compliance trail in same transaction' },
  { step: 'Hard delete', detail: 'After 30-90 day retention window', what: 'Optional final cleanup via cron' },
];

const gdprExportFields = [
  { section: 'Profile', fields: 'email, displayName, avatarUrl, createdAt', format: 'JSON object' },
  { section: 'Preferences', fields: 'Notification settings, theme, language', format: 'JSON object' },
  { section: 'Activity', fields: 'All actions with timestamps', format: 'JSON array' },
  { section: 'Content', fields: 'Created skills, comments, reactions', format: 'JSON array' },
  { section: 'Social', fields: 'Comments, reactions, mention data', format: 'JSON array' },
];

const profileSchema = [
  { field: 'id', type: 'uuid', selfEdit: false, adminEdit: false, note: 'Immutable primary key' },
  { field: 'email', type: 'text', selfEdit: false, adminEdit: false, note: 'Requires re-verification to change' },
  { field: 'displayName', type: 'text', selfEdit: true, adminEdit: true, note: '1-100 characters' },
  { field: 'avatarUrl', type: 'text?', selfEdit: true, adminEdit: true, note: 'Valid URL or null' },
  { field: 'role', type: 'enum', selfEdit: false, adminEdit: true, note: 'admin | member' },
  { field: 'state', type: 'enum', selfEdit: false, adminEdit: true, note: 'invited | active | suspended | deleted' },
  { field: 'preferences', type: 'jsonb', selfEdit: true, adminEdit: false, note: 'User-owned, admin cannot override' },
  { field: 'createdAt', type: 'timestamp', selfEdit: false, adminEdit: false, note: 'Set once at creation' },
  { field: 'deletedAt', type: 'timestamp?', selfEdit: false, adminEdit: true, note: 'Soft delete marker' },
];

const adminVsSelfService = [
  { operation: 'Edit own profile', self: true, admin: true },
  { operation: 'Change auth method', self: true, admin: false },
  { operation: 'Suspend account', self: false, admin: true },
  { operation: 'Reactivate account', self: false, admin: true },
  { operation: 'Delete account', self: true, admin: true },
  { operation: 'Export data', self: true, admin: true },
  { operation: 'Assign roles', self: false, admin: true },
  { operation: 'View audit trail', self: false, admin: true },
];

export function UserManagementShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> For authentication mechanisms, see <strong>authentication</strong>.
          For role and permission definitions, see <strong>authorization</strong>.
          Social data erasure follows patterns from <strong>social-features</strong>.
        </p>
      </div>

      {/* ---- User State Machine ---- */}
      <Section title="User Lifecycle State Machine">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Every user is in exactly one state. Transitions are validated — reject any transition not in the allowed set.
          Log every transition with who, when, and why.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {userStates.map((s) => (
            <div
              key={s.state}
              style={{
                padding: 20,
                borderRadius: 12,
                background: 'var(--color-surface)',
                border: `2px solid ${s.color}`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: s.color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  margin: '0 auto 12px',
                }}
              >
                {s.state[0]}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 6 }}>{s.state}</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Transition table */}
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
              gridTemplateColumns: '100px 100px 1fr 120px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>From</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>To</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Trigger</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Actor</span>
          </div>
          {transitions.map((t, i) => (
            <div
              key={`${t.from}-${t.to}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 100px 1fr 120px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{t.from}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: t.to === '(none)' ? 'var(--color-text-muted)' : 'var(--color-primary)' }}>{t.to}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{t.trigger}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{t.actor}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Soft Delete Flow ---- */}
      <Section title="Soft Delete Flow">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {softDeleteFlow.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 1fr',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 6,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.detail}</span>
              <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 500 }}>{s.what}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct: deletedAt timestamp</h4>
            <CodeBlock>{`// Tells you WHEN deletion happened
deletedAt: timestamp('deleted_at'),
// null = active, non-null = soft-deleted

// Every query excludes soft-deleted
const activeUsers = db.select()
  .from(users)
  .where(isNull(users.deletedAt));`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-error)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dangerous: boolean flag</h4>
            <CodeBlock>{`// Loses the time dimension
isDeleted: boolean('is_deleted')
  .default(false);

// When was it deleted? Unknown.
// Retention window? Can't calculate.
// Audit trail? Incomplete.`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- GDPR Data Export ---- */}
      <Section title="GDPR Data Export">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Users can request a JSON export of all their data (GDPR Article 20). Export includes everything tied to their user ID.
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
              gridTemplateColumns: '120px 1fr 120px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Section</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Fields Included</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Format</span>
          </div>
          {gdprExportFields.map((f, i) => (
            <div
              key={f.section}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 120px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>{f.section}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{f.fields}</span>
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{f.format}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Right to Erasure ---- */}
      <Section title="Right to Erasure (Anonymisation)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Anonymise all PII. Replace identifying fields with deterministic placeholders.
          Retain the row for referential integrity — other tables still reference this user ID.
        </p>
        <CodeBlock>{`async function eraseUserData(userId: string) {
  await db.transaction(async (tx) => {
    await tx.update(users).set({
      email: \`erased-\${userId}@removed.local\`,
      displayName: 'Deleted User',
      avatarUrl: null,
      preferences: null,
      state: 'deleted',
      deletedAt: new Date(),
    }).where(eq(users.id, userId));

    // Anonymise social data
    await tx.update(comments).set({
      authorId: userId,  // keep FK but author shows "Deleted User"
    }).where(eq(comments.authorId, userId));

    await tx.insert(auditLog).values({
      entityType: 'user', entityId: userId,
      action: 'erased',
      metadata: { reason: 'right-to-erasure' },
    });
  });
}`}</CodeBlock>
      </Section>

      {/* ---- Profile Schema ---- */}
      <Section title="Profile Schema">
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
              gridTemplateColumns: '120px 100px 80px 80px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Field</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Type</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Self Edit</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Admin</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Note</span>
          </div>
          {profileSchema.map((f, i) => (
            <div
              key={f.field}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 100px 80px 80px 1fr',
                padding: '8px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>{f.field}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{f.type}</span>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: f.selfEdit ? 'var(--color-success)' : 'transparent', border: `2px solid ${f.selfEdit ? 'var(--color-success)' : 'var(--color-border)'}` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: f.adminEdit ? 'var(--color-success)' : 'transparent', border: `2px solid ${f.adminEdit ? 'var(--color-success)' : 'var(--color-border)'}` }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{f.note}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Admin vs Self-Service ---- */}
      <Section title="Admin vs Self-Service Operations">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
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
                gridTemplateColumns: '1fr 80px 80px',
                background: 'var(--color-bg-alt)',
                borderBottom: '2px solid var(--color-border)',
                padding: '10px 16px',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Operation</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Self</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Admin</span>
            </div>
            {adminVsSelfService.map((op, i) => (
              <div
                key={op.operation}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 80px 80px',
                  padding: '8px 16px',
                  background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                  borderBottom: '1px solid var(--color-border)',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{op.operation}</span>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: op.self ? 'var(--color-success)' : 'transparent', border: `2px solid ${op.self ? 'var(--color-success)' : 'var(--color-border)'}` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: op.admin ? 'var(--color-success)' : 'transparent', border: `2px solid ${op.admin ? 'var(--color-success)' : 'var(--color-border)'}` }} />
                </div>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Principles</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Audit trail distinguishes actor type (user vs admin)',
                'Users manage profile + preferences + data export',
                'Admins manage state transitions + role assignment',
                'Never expose internal UUIDs in user-facing URLs',
                'Preferences are user-owned — admins cannot override',
                'Account merge requires explicit user confirmation',
              ].map((p) => (
                <div
                  key={p}
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
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

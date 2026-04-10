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
const rbacVsAbac = [
  { aspect: 'Model', rbac: 'Role → Permissions', abac: 'User + Resource + Context → Decision' },
  { aspect: 'Granularity', rbac: 'Role-level (admin, member, viewer)', abac: 'Attribute-level (owner, status, time)' },
  { aspect: 'Complexity', rbac: 'Simple — static role-permission map', abac: 'Complex — dynamic policy evaluation' },
  { aspect: 'Scalability', rbac: 'Fixed roles, easy to audit', abac: 'Flexible, harder to audit' },
  { aspect: 'Example', rbac: '"Admins can publish skills"', abac: '"Members can edit their own draft skills"' },
  { aspect: 'Best for', rbac: '80% of access control needs', abac: 'Resource ownership, contextual rules' },
  { aspect: 'Implementation', rbac: 'hasPermission(role, perm)', abac: 'evaluatePolicy(user, resource, action)' },
];

const permissionMatrix = [
  { permission: 'skill:read', viewer: true, member: true, admin: true },
  { permission: 'skill:create', viewer: false, member: true, admin: true },
  { permission: 'skill:edit-own', viewer: false, member: true, admin: true },
  { permission: 'skill:publish', viewer: false, member: false, admin: true },
  { permission: 'skill:delete', viewer: false, member: false, admin: true },
  { permission: 'user:invite', viewer: false, member: false, admin: true },
  { permission: 'user:suspend', viewer: false, member: false, admin: true },
  { permission: 'audit:read', viewer: false, member: false, admin: true },
];

const checkLayers = [
  { layer: 'Middleware / Route', what: 'Reject early if user lacks any relevant permission', failure: '403 Forbidden', color: 'var(--color-primary)', desc: 'First defense — fast rejection at the edge' },
  { layer: 'Service / Use-case', what: 'Check resource-specific access before performing action', failure: '403 or 404 (hide existence)', color: 'var(--color-warning)', desc: 'Critical layer — cannot be bypassed' },
  { layer: 'UI / Component', what: 'Hide or disable controls the user cannot use', failure: 'N/A (visual only)', color: 'var(--color-text-muted)', desc: 'UX improvement — never rely on for security' },
];

const coreRules = [
  { num: '01', rule: 'Deny by default', desc: 'Every action is forbidden unless explicitly permitted' },
  { num: '02', rule: 'Separate authn from authz', desc: 'Authentication = who, Authorization = what — different code paths' },
  { num: '03', rule: 'Start with RBAC', desc: 'Roles cover 80% of needs, add ABAC when ownership matters' },
  { num: '04', rule: 'Granular permissions', desc: 'Check verb:resource (skill:publish), not roles directly' },
  { num: '05', rule: 'Check at every layer', desc: 'Middleware + service + UI — all three required' },
  { num: '06', rule: 'Resource-level access', desc: 'Having a resource ID does not mean having access to it' },
  { num: '07', rule: 'Least privilege', desc: 'New roles start empty, admin is not the default' },
  { num: '08', rule: 'Superadmin = escape hatch', desc: 'Explicit, time-limited, heavily logged — like breaking glass' },
  { num: '09', rule: 'Log access decisions', desc: 'Denials for auditing, sensitive grants for compliance' },
  { num: '10', rule: 'Server-side only', desc: 'Client-side checks improve UX but are not security controls' },
];

const abacAttributes = [
  { category: 'User', examples: 'role, team, department, account age', color: 'var(--color-primary)' },
  { category: 'Resource', examples: 'owner, status, visibility, creation date', color: 'var(--color-secondary)' },
  { category: 'Context', examples: 'time of day, IP range, device type', color: 'var(--color-warning)' },
];

export function AuthorizationShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This skill covers WHAT you can do — see <strong>authentication</strong> for WHO you are.
          Implementation: <strong>authz-rbac-drizzle</strong> for RBAC with Drizzle ORM.
        </p>
      </div>

      {/* ---- Core Rules ---- */}
      <Section title="10 Core Rules">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {coreRules.map((r) => (
            <div
              key={r.num}
              style={{
                display: 'flex',
                gap: 12,
                padding: 14,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {r.num}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 2 }}>{r.rule}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- RBAC vs ABAC ---- */}
      <Section title="RBAC vs ABAC Comparison">
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
              gridTemplateColumns: '140px 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Aspect</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>RBAC</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-secondary)' }}>ABAC</span>
          </div>
          {rbacVsAbac.map((item, i) => (
            <div
              key={item.aspect}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.aspect}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.rbac}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.abac}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- ABAC Attributes ---- */}
      <Section title="ABAC Attribute Categories">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          When RBAC is not enough, add attribute-based rules. Example: &quot;Members can edit resources WHERE resource.ownerId = user.id AND resource.status = &apos;draft&apos;.&quot;
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {abacAttributes.map((a) => (
            <div
              key={a.category}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: `2px solid ${a.color}`,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: a.color, marginBottom: 10 }}>{a.category} Attributes</div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>{a.examples}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Permission Matrix ---- */}
      <Section title="Permission Matrix">
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
              gridTemplateColumns: '200px repeat(3, 100px)',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Permission</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Viewer</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Member</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Admin</span>
          </div>
          {permissionMatrix.map((p, i) => (
            <div
              key={p.permission}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px repeat(3, 100px)',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-heading)', fontWeight: 500 }}>{p.permission}</code>
              {[p.viewer, p.member, p.admin].map((allowed, j) => (
                <div key={j} style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: allowed ? 'var(--color-success)' : 'var(--color-bg-alt)',
                      border: allowed ? 'none' : '2px solid var(--color-border)',
                      lineHeight: '20px',
                      fontSize: 12,
                      color: '#FFFFFF',
                      fontWeight: 700,
                    }}
                  >
                    {allowed ? '\u2713' : ''}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Permission Check Layers ---- */}
      <Section title="Least Privilege Layers">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Three layers, all required. No single layer is trusted to be the complete defense.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {checkLayers.map((l, i) => (
            <div
              key={l.layer}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 160px',
                gap: 16,
                padding: '16px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `6px solid ${l.color}`,
                marginLeft: i * 16,
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>{l.layer}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{l.desc}</div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{l.what}</span>
              <code style={{ fontSize: 11, padding: '4px 8px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)', fontFamily: 'monospace', textAlign: 'center' }}>
                {l.failure}
              </code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Permission Check Code ---- */}
      <Section title="Permission Check Pattern">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Role → Permission Map</h4>
            <CodeBlock>{`const rolePermissions: Record<Role, Permission[]> = {
  admin:  ['skill:publish', 'skill:delete',
           'user:suspend', 'user:invite'],
  member: ['skill:create', 'skill:edit-own'],
  viewer: ['skill:read'],
};

function hasPermission(
  role: Role,
  perm: Permission
): boolean {
  return rolePermissions[role]
    ?.includes(perm) ?? false;
}`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>Resource-level Check</h4>
            <CodeBlock>{`async function publishSkill(
  userId: string,
  skillId: string
) {
  const skill = await db.findSkill(skillId);
  if (!skill)
    return Err(new NotFoundError());

  // Owner check + permission fallback
  if (skill.authorId !== userId
    && !hasPermission(user.role, 'skill:publish'))
    return Err(new AuthError('Cannot publish'));

  return Ok(await db.publish(skillId));
}`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- 404 vs 403 ---- */}
      <Section title="404 vs 403 Decision">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-primary)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 10 }}>Return 404</div>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>
              When revealing the resource exists is a privacy concern. The user sees &quot;Not Found&quot; — they cannot tell if the resource exists.
            </p>
          </div>
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              background: 'var(--color-surface)',
              border: '2px solid var(--color-warning)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-warning)', marginBottom: 10 }}>Return 403</div>
            <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.5 }}>
              When the resource is known to exist and you want to communicate that access is denied. More helpful for debugging.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Access Control',
              checks: [
                'All actions denied by default unless permitted',
                'Permissions checked at middleware AND service layer',
                'Resource-level access verifies ownership/grants',
              ],
            },
            {
              category: 'Roles & Permissions',
              checks: [
                'Roles are collections of granular permissions',
                'New roles start with zero permissions',
                'No scattered role === "admin" checks',
              ],
            },
            {
              category: 'Auditing',
              checks: [
                'Access denials are logged with context',
                'Admin actions are separately auditable',
                'Self-role-change is prevented',
              ],
            },
            {
              category: 'Implementation',
              checks: [
                'Server enforces every permission',
                'Client-side checks are UX only',
                'No client-only permission enforcement',
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

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
const roleSchema = [
  { role: 'admin', level: 100, desc: 'Full access — manage users, publish, delete', color: 'var(--color-error)' },
  { role: 'editor', level: 50, desc: 'Create and edit content, manage archetypes', color: 'var(--color-warning)' },
  { role: 'viewer', level: 10, desc: 'Read-only access to skills and archetypes', color: 'var(--color-success)' },
];

const permissionMap = [
  { permission: 'skills:read', viewer: true, editor: true, admin: true },
  { permission: 'skills:create', viewer: false, editor: true, admin: true },
  { permission: 'skills:update', viewer: false, editor: true, admin: true },
  { permission: 'skills:delete', viewer: false, editor: false, admin: true },
  { permission: 'skills:publish', viewer: false, editor: false, admin: true },
  { permission: 'archetypes:read', viewer: true, editor: true, admin: true },
  { permission: 'archetypes:create', viewer: false, editor: true, admin: true },
  { permission: 'archetypes:update', viewer: false, editor: true, admin: true },
  { permission: 'archetypes:delete', viewer: false, editor: false, admin: true },
  { permission: 'users:read', viewer: false, editor: false, admin: true },
  { permission: 'users:manage', viewer: false, editor: false, admin: true },
  { permission: 'audit:read', viewer: false, editor: false, admin: true },
];

const guardChain = [
  { layer: 'Middleware', code: 'ADMIN_ROUTES, EDITOR_ROUTES', desc: 'Route-level protection — reject before handler runs', color: 'var(--color-primary)' },
  { layer: 'Server Action', code: 'hasPermission(session.role, perm)', desc: 'Business logic guard — the critical layer that cannot be bypassed', color: 'var(--color-warning)' },
  { layer: 'UI Component', code: '<RoleGate userRole={role} requiredRole="editor">', desc: 'Conditional rendering — UX only, not a security boundary', color: 'var(--color-text-muted)' },
];

const schemaOptions = [
  {
    name: 'Enum (Fixed Roles)',
    pros: 'Simple, type-safe, no extra table',
    cons: 'Requires migration to add roles',
    bestFor: 'Small teams with stable roles',
    code: `export const roleEnum = pgEnum("role", [
  "admin", "editor", "viewer"
]);

export const users = pgTable("users", {
  id:   uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  role: roleEnum("role").default("viewer").notNull(),
});`,
  },
  {
    name: 'Table (Dynamic Roles)',
    pros: 'Roles managed at runtime, no migrations',
    cons: 'Extra join, more complex queries',
    bestFor: 'Large orgs with evolving roles',
    code: `export const roles = pgTable("roles", {
  id:    uuid("id").defaultRandom().primaryKey(),
  name:  text("name").notNull().unique(),
  level: integer("level").notNull(),
});

export const userRoles = pgTable("user_roles", {
  userId: uuid("user_id").references(() => users.id),
  roleId: uuid("role_id").references(() => roles.id),
});`,
  },
];

const antiPatterns = [
  { bad: 'role === "admin"', good: 'hasPermission(role, "users:manage")', why: 'Scattered string checks are unauditable' },
  { bad: 'Client-only permission check', good: 'Server Action + UI guard', why: 'Client checks are trivially bypassed' },
  { bad: 'Default role: admin', good: 'Default role: viewer', why: 'Least privilege — start empty, grant up' },
  { bad: 'User changes own role', good: 'Admin action with audit log', why: 'Prevents privilege escalation' },
  { bad: 'Skip use-case check', good: 'Check at every layer independently', why: 'Middleware can be bypassed' },
];

export function AuthzRbacDrizzleShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Implementation skill for authorization.</strong> Read <strong>authorization</strong> first for access control principles.
          For authentication, see <strong>auth-custom-otp</strong> or <strong>auth-clerk</strong>.
        </p>
      </div>

      {/* ---- Role Schema Diagram ---- */}
      <Section title="Role Hierarchy">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Admin inherits all editor permissions. Editor inherits all viewer permissions. Define inheritance explicitly — never imply it.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {roleSchema.map((r, i) => (
            <div
              key={r.role}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 24px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `6px solid ${r.color}`,
                marginLeft: (roleSchema.length - 1 - i) * 24,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: r.color,
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {r.level}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text-heading)', textTransform: 'capitalize' }}>{r.role}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Schema Options ---- */}
      <Section title="Schema Design Options">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {schemaOptions.map((s) => (
            <div
              key={s.name}
              style={{
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 16px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Best for: {s.bestFor}</div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase', marginBottom: 2 }}>Pros</div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.pros}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-error)', textTransform: 'uppercase', marginBottom: 2 }}>Cons</div>
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.cons}</span>
                  </div>
                </div>
                <CodeBlock>{s.code}</CodeBlock>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Permission Check Flow ---- */}
      <Section title="Permission Check Flow">
        <CodeBlock>{`// src/lib/permissions.ts
export type Permission =
  | "skills:read" | "skills:create" | "skills:update"
  | "skills:delete" | "skills:publish"
  | "archetypes:read" | "archetypes:create"
  | "archetypes:update" | "archetypes:delete"
  | "users:read" | "users:manage" | "audit:read";

type Role = "admin" | "editor" | "viewer";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: ["skills:read", "archetypes:read"],
  editor: ["skills:read", "skills:create", "skills:update",
           "archetypes:read", "archetypes:create", "archetypes:update"],
  admin:  [/* all permissions */],
};

export function hasPermission(role: Role, perm: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(perm) ?? false;
}

// Role hierarchy check
const ROLE_LEVEL: Record<Role, number> = {
  viewer: 10, editor: 50, admin: 100,
};

export function hasMinimumRole(userRole: Role, required: Role): boolean {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[required];
}`}</CodeBlock>
      </Section>

      {/* ---- Permission Matrix ---- */}
      <Section title="Full Permission Matrix">
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
              gridTemplateColumns: '200px repeat(3, 90px)',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Permission</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', textAlign: 'center' }}>Viewer</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-warning)', textAlign: 'center' }}>Editor</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)', textAlign: 'center' }}>Admin</span>
          </div>
          {permissionMap.map((p, i) => (
            <div
              key={p.permission}
              style={{
                display: 'grid',
                gridTemplateColumns: '200px repeat(3, 90px)',
                padding: '8px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--color-text-heading)', fontWeight: 500 }}>{p.permission}</code>
              {[p.viewer, p.editor, p.admin].map((allowed, j) => (
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

      {/* ---- Middleware Guard Chain ---- */}
      <Section title="Middleware Guard Chain">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16, lineHeight: 1.6 }}>
          Three independent layers. If one fails, the others still protect the system. The Server Action layer is the most critical — it cannot be bypassed.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {guardChain.map((g, i) => (
            <div
              key={g.layer}
              style={{
                padding: '16px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `6px solid ${g.color}`,
                marginLeft: i * 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)' }}>{g.layer}</span>
                <code style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: 'var(--color-bg-alt)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {g.code}
                </code>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-body)', margin: 0, lineHeight: 1.4 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Server Action Guard ---- */}
      <Section title="Server Action Guard Pattern">
        <CodeBlock>{`"use server";

import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { Ok, Err, type Result } from "@/platform/lib/result";

export async function publishSkill(
  skillId: string
): Promise<Result<void, AuthError>> {
  const session = await auth();
  if (!session)
    return Err(new AuthError("Unauthorized"));

  if (!hasPermission(session.role, "skills:publish"))
    return Err(new AuthError("Insufficient permissions"));

  // ... publish logic
  return Ok(undefined);
}

export async function deleteUser(
  userId: string
): Promise<Result<void, AuthError | ValidationError>> {
  const session = await auth();
  if (!session) return Err(new AuthError("Unauthorized"));

  if (!hasPermission(session.role, "users:manage"))
    return Err(new AuthError("Insufficient permissions"));

  // Prevent self-deletion
  if (session.userId === userId)
    return Err(new ValidationError("Cannot delete own account"));

  // ... delete logic
  return Ok(undefined);
}`}</CodeBlock>
      </Section>

      {/* ---- Anti-Patterns ---- */}
      <Section title="Anti-Patterns">
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
              gridTemplateColumns: '1fr 1fr 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)' }}>Dangerous</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)' }}>Correct</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Why</span>
          </div>
          {antiPatterns.map((a, i) => (
            <div
              key={a.bad}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: 11, color: 'var(--color-error)', fontFamily: 'monospace' }}>{a.bad}</code>
              <code style={{ fontSize: 11, color: 'var(--color-success)', fontFamily: 'monospace' }}>{a.good}</code>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{a.why}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- UI RoleGate ---- */}
      <Section title="UI Conditional Rendering">
        <CodeBlock>{`// RoleGate component — cosmetic only, not security
function RoleGate({
  userRole, requiredRole, children, fallback
}: RoleGateProps) {
  const ROLE_LEVEL: Record<string, number> = {
    viewer: 10, editor: 50, admin: 100,
  };

  const userLevel = ROLE_LEVEL[userRole] ?? 0;
  const requiredLevel = ROLE_LEVEL[requiredRole] ?? Infinity;

  if (userLevel >= requiredLevel) return <>{children}</>;
  return fallback ? <>{fallback}</> : null;
}

// Usage in a page
<RoleGate userRole={session.role} requiredRole="editor">
  <EditButton skillId={id} />
</RoleGate>

<RoleGate userRole={session.role} requiredRole="admin">
  <DeleteButton skillId={id} />
  <PublishButton skillId={id} />
</RoleGate>`}</CodeBlock>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Schema & Roles',
              checks: [
                'Roles defined in schema (enum or table)',
                'Clear hierarchy with level values',
                'Seed script creates default roles + admin user',
              ],
            },
            {
              category: 'Permission System',
              checks: [
                'Permissions mapped centrally to roles',
                'hasPermission() used consistently',
                'No scattered role === "admin" checks',
              ],
            },
            {
              category: 'Guard Layers',
              checks: [
                'Middleware protects admin/editor routes',
                'Server Actions check permissions before logic',
                'UI conditionally renders based on role',
              ],
            },
            {
              category: 'Safety',
              checks: [
                'Self-role-change is prevented',
                'Role changes are audited',
                'Tests cover permission boundaries',
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

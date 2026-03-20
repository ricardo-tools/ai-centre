---
name: authorization
description: >
  Principles for permissions and access control — RBAC, ABAC, resource-level access,
  permission checking patterns, least privilege, and audit logging.
---

# Authorization

## When to Use

Apply this skill when:

- The application controls what authenticated users can do
- Defining roles, permissions, or access policies
- Implementing resource-level ownership checks
- Adding permission checks at middleware, use-case, or UI layers
- Logging access decisions for security auditing

This skill is about WHAT you can do — see **authentication** for WHO you are.

## Do NOT use this skill for:

- Verifying user identity (login, sessions, tokens) — use **authentication**
- Database-level row security policies — use **database-design**

---

## Core Rules

### 1. Deny by default.

Every action is forbidden unless explicitly permitted. If a permission check is
missing, the answer is no. Never rely on the absence of a deny rule.

### 2. Separate authentication from authorization.

Authentication answers "who is this user?" Authorization answers "can this user
do this thing?" They are different concerns, different code paths, and different
failure modes.

### 3. Start with RBAC, add ABAC when needed.

Roles (admin, member, viewer) cover 80% of access control. When you need "user
can edit their own resources but not others," or "managers can approve requests
from their team," add attribute-based rules on top.

### 4. Permissions are granular, roles are collections.

Define permissions as verb+resource (`skill:publish`, `user:suspend`). Roles are
named sets of permissions. Check permissions in code, not roles — this lets you
change what a role can do without changing application logic.

```ts
const rolePermissions: Record<Role, Permission[]> = {
  admin: ['skill:publish', 'skill:delete', 'user:suspend', 'user:invite'],
  member: ['skill:create', 'skill:edit-own'],
  viewer: ['skill:read'],
};

function hasPermission(role: Role, perm: Permission): boolean {
  return rolePermissions[role]?.includes(perm) ?? false;
}
```

### 5. Check at the right layer.

Three layers, all required:

- **Middleware/route level:** reject early if the user lacks any relevant permission.
- **Use-case/service level:** check resource-specific access before performing the action.
- **UI level:** hide or disable controls the user cannot use (UX, not security).

```ts
// Middleware — reject before handler runs
function authMiddleware(requiredPerm: Permission) {
  return (req: Request) => {
    if (!hasPermission(req.user.role, requiredPerm)) {
      return new Response('Forbidden', { status: 403 });
    }
  };
}
```

```ts
// Use-case — check resource ownership
async function publishSkill(userId: string, skillId: string) {
  const skill = await db.findSkill(skillId);
  if (!skill) return Err(new NotFoundError());
  if (skill.authorId !== userId && !hasPermission(user.role, 'skill:publish'))
    return Err(new AuthError('Cannot publish'));
  return Ok(await db.publish(skillId));
}
```

```tsx
// UI guard — hide inaccessible controls (UX only, not security)
function PublishButton({ role }: { role: Role }) {
  if (!hasPermission(role, 'skill:publish')) return null;
  return <button>Publish</button>;
}
```

### 6. Resource-level access is mandatory for multi-user data.

"Can user X access resource Y?" requires checking ownership, team membership,
or explicit grants. Never assume that having a resource ID means having access
to it.

### 7. Principle of least privilege.

Users and services get the minimum permissions needed. New roles start empty and
gain permissions. Admin is not the default.

### 8. Superadmin is an escape hatch, not a role.

If you need a "can do anything" override, make it explicit, time-limited, and
heavily logged. It should feel like breaking glass, not logging in.

### 9. Log access decisions.

Record permission checks that deny access (for security auditing) and permission
checks for sensitive operations that grant access (for compliance). Include:
user, action, resource, decision, timestamp.

### 10. Authorization logic is never in the client only.

The server must enforce every permission. Client-side checks improve UX but are
not security controls.

---

## RBAC Pattern

```
Role → [Permission, Permission, ...]
User → Role

Check: user.role.permissions.includes('skill:publish')
```

**Role hierarchy:** admin inherits all member permissions. Member inherits all
viewer permissions. Define inheritance explicitly — never imply it.

| Role | Typical permissions |
|---|---|
| viewer | Read resources, download files |
| member | All viewer + create, edit own resources |
| admin | All member + manage users, publish, delete any resource |

---

## ABAC Pattern

When RBAC isn't enough, add attribute-based rules:

- **User attributes:** role, team, department, account age.
- **Resource attributes:** owner, status, visibility, creation date.
- **Context attributes:** time of day, IP range, device type.

Rule example: "Members can edit resources WHERE resource.ownerId = user.id AND
resource.status = 'draft'."

---

## Permission Checking Layers

| Layer | What it does | Failure response |
|---|---|---|
| Middleware | Rejects if user lacks any role for the route | 403 Forbidden |
| Service/use-case | Checks resource-level access | 403 or 404 (hide existence) |
| UI | Hides/disables inaccessible controls | N/A (visual only) |

**Return 404 vs 403:** If revealing that a resource exists is a privacy concern,
return 404. Otherwise, 403 is more helpful for debugging.

---

## Banned Patterns

- ❌ Checking roles instead of permissions → use granular permission checks (`hasPermission`)
- ❌ Client-only permission enforcement → always enforce on the server
- ❌ Admin role by default for new users → start with least privilege
- ❌ URL obscurity as access control → always require auth checks on endpoints
- ❌ Permissions in JWT claims that can't be revoked → check permissions at request time
- ❌ Role self-escalation without approval → require admin/workflow approval
- ❌ Skipping resource ownership checks → verify ownership on every edit/delete

---

## Quality Gate

- [ ] All actions are denied by default unless explicitly permitted.
- [ ] Permissions are checked at middleware AND service/use-case layer.
- [ ] Resource-level access checks verify ownership or explicit grants.
- [ ] Roles are defined as collections of granular permissions.
- [ ] Access denials for sensitive operations are logged with user and resource context.
- [ ] No client-only permission enforcement — server always validates.
- [ ] Admin/superadmin actions are logged separately and auditable.
- [ ] New roles start with zero permissions (least privilege).

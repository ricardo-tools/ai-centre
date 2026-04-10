---
name: authz-rbac-drizzle
description: >
  Role-Based Access Control implemented with Drizzle ORM. Covers schema design
  for roles and permissions, role hierarchy, permission checking functions,
  middleware-level and use-case-level guards, UI conditional rendering, and seed
  data. Implementation skill for the authorization conceptual skill — read that
  first for access control principles.
---

# Authorization — RBAC with Drizzle

Implementation skill for **authorization**. Read that skill first for principles on access control, least privilege, and separation of authentication from authorization.

---

## When to Use

Apply this skill when:
- The project needs role-based access control (admin, editor, viewer, etc.)
- Using Drizzle ORM as the database layer
- You need permission checks at middleware, use-case, and UI levels
- Role hierarchy is required (admin inherits all editor permissions)

Do NOT use this skill for:
- Authentication (login, sessions) — see **auth-custom-otp** or **auth-clerk**
- Attribute-based access control (ABAC) with complex policies
- Row-level security in Postgres (consider Supabase RLS instead)

---

## Core Rules

### 1. Define roles as a Postgres enum or a roles table

For simple projects (fixed roles), use an enum. For dynamic roles (user-created), use a roles table.

**Option A: Enum (fixed roles)**

```typescript
// src/server/db/schema.ts
import { pgEnum, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "editor", "viewer"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: roleEnum("role").default("viewer").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

**Option B: Roles table with join (dynamic roles)**

```typescript
export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),    // "admin", "editor", "viewer"
  description: text("description"),
  level: integer("level").notNull(),         // Higher = more access: admin=100, editor=50, viewer=10
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRoles = pgTable("user_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 2. Define permissions and map them to roles

Create a permissions structure that maps roles to allowed actions. For enum-based roles, define this in code. For table-based roles, store in the database.

```typescript
// src/lib/permissions.ts

export type Permission =
  | "skills:read"
  | "skills:create"
  | "skills:update"
  | "skills:delete"
  | "skills:publish"
  | "archetypes:read"
  | "archetypes:create"
  | "archetypes:update"
  | "archetypes:delete"
  | "users:read"
  | "users:manage"
  | "audit:read";

type Role = "admin" | "editor" | "viewer";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: [
    "skills:read",
    "archetypes:read",
  ],
  editor: [
    "skills:read",
    "skills:create",
    "skills:update",
    "archetypes:read",
    "archetypes:create",
    "archetypes:update",
  ],
  admin: [
    "skills:read",
    "skills:create",
    "skills:update",
    "skills:delete",
    "skills:publish",
    "archetypes:read",
    "archetypes:create",
    "archetypes:update",
    "archetypes:delete",
    "users:read",
    "users:manage",
    "audit:read",
  ],
};
```

### 3. Implement role hierarchy

Admin inherits everything from editor, editor inherits from viewer. Implement this via the permission map (as above — admin's list includes editor's permissions) or via a level-based check.

```typescript
const ROLE_LEVEL: Record<Role, number> = {
  viewer: 10,
  editor: 50,
  admin: 100,
};

export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[requiredRole];
}
```

### 4. Permission checking function

The core function that checks whether a user has a specific permission.

```typescript
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const allowed = ROLE_PERMISSIONS[userRole];
  return allowed !== undefined && allowed.includes(permission);
}

// Async version that fetches the user's role from the database
export async function checkPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { role: true },
  });

  if (!user) return false;
  return hasPermission(user.role as Role, permission);
}
```

### 5. Middleware-level checks — protect routes by role

Extend auth middleware to check roles for admin-only routes.

```typescript
// middleware.ts (extending existing auth middleware)
import { verifySessionEdge } from "@/lib/auth-edge";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_ROUTES = ["/admin"];
const EDITOR_ROUTES = ["/skills/new", "/archetypes/new"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ... existing auth check ...

  const session = await getSessionFromToken(token);
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based route protection
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (session.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (EDITOR_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!hasMinimumRole(session.role, "editor")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}
```

### 6. Use-case-level checks — guard business logic

Check permissions in Server Actions before executing mutations. This is the most critical layer — middleware can be bypassed, UI can be manipulated, but server-side checks cannot.

```typescript
"use server";

import { auth } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";
import { Ok, Err, type Result } from "@/platform/lib/result";
import { AuthError, ValidationError } from "@/platform/lib/errors";

export async function publishSkill(skillId: string): Promise<Result<void, AuthError>> {
  const session = await auth();
  if (!session) return Err(new AuthError("Unauthorized"));

  if (!hasPermission(session.role, "skills:publish")) {
    return Err(new AuthError("Insufficient permissions"));
  }

  // ... publish logic
  return Ok(undefined);
}

export async function deleteUser(userId: string): Promise<Result<void, AuthError | ValidationError>> {
  const session = await auth();
  if (!session) return Err(new AuthError("Unauthorized"));

  if (!hasPermission(session.role, "users:manage")) {
    return Err(new AuthError("Insufficient permissions"));
  }

  // Prevent self-deletion
  if (session.userId === userId) {
    return Err(new ValidationError("Cannot delete your own account"));
  }

  // ... delete logic
  return Ok(undefined);
}
```

### 7. UI-level checks — conditional rendering

Show or hide UI elements based on the user's role. This is cosmetic — never rely on UI hiding for security. Always back it with use-case-level checks.

```typescript
// src/components/RoleGate.tsx
"use client";

interface RoleGateProps {
  userRole: string;
  requiredRole: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ROLE_LEVEL: Record<string, number> = {
  viewer: 10,
  editor: 50,
  admin: 100,
};

export function RoleGate({ userRole, requiredRole, children, fallback }: RoleGateProps) {
  const userLevel = ROLE_LEVEL[userRole] ?? 0;
  const requiredLevel = ROLE_LEVEL[requiredRole] ?? Infinity;

  if (userLevel >= requiredLevel) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}
```

Usage in a page:

```typescript
export default async function SkillDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  return (
    <div>
      <h1>Skill Detail</h1>

      {/* Everyone sees this */}
      <SkillContent skillId={params.id} />

      {/* Only editors and above */}
      <RoleGate userRole={session?.role ?? "viewer"} requiredRole="editor">
        <EditButton skillId={params.id} />
      </RoleGate>

      {/* Only admins */}
      <RoleGate userRole={session?.role ?? "viewer"} requiredRole="admin">
        <DeleteButton skillId={params.id} />
        <PublishButton skillId={params.id} />
      </RoleGate>
    </div>
  );
}
```

### 8. Seed default roles

Include role seeding in your database seed script so every environment starts with correct defaults.

```typescript
// src/server/db/seed.ts
import { db } from "./index";
import { users } from "./schema";

async function seed() {
  // Seed admin user
  await db
    .insert(users)
    .values({
      email: "admin@yourdomain.com",
      name: "Admin",
      role: "admin",
    })
    .onConflictDoNothing({ target: users.email });

  console.log("Seed complete");
}

seed().catch(console.error);
```

For dynamic roles (table-based):

```typescript
import { roles } from "./schema";

const DEFAULT_ROLES = [
  { name: "admin", description: "Full access", level: 100 },
  { name: "editor", description: "Create and edit content", level: 50 },
  { name: "viewer", description: "Read-only access", level: 10 },
];

for (const role of DEFAULT_ROLES) {
  await db.insert(roles).values(role).onConflictDoNothing({ target: roles.name });
}
```

---

## Banned Patterns

- ❌ Checking permissions only in the UI → always enforce in Server Actions and API routes; UI guards are cosmetic
- ❌ Using string comparisons like `role === "admin"` scattered across the codebase → centralize in a `hasPermission` or `hasMinimumRole` function
- ❌ Granting permissions by default → new roles start with zero permissions; explicitly grant what is needed
- ❌ Allowing users to change their own role → role changes must go through an admin action with audit logging
- ❌ Hardcoding user IDs for special access → use roles, never identity
- ❌ Skipping the use-case-level check because middleware "already handles it" → defense in depth; every layer checks independently

---

## Quality Gate

Before considering RBAC complete:

- [ ] Roles defined in schema (enum or table) with clear hierarchy
- [ ] Permissions mapped to roles in a single, centralized location
- [ ] `hasPermission` function used consistently across all Server Actions
- [ ] Middleware-level route protection for admin and editor routes
- [ ] UI conditionally renders actions based on role (with `RoleGate` or similar)
- [ ] Seed script creates default roles and at least one admin user
- [ ] Role changes are audited (logged with who, when, what changed)
- [ ] No scattered `role === "admin"` checks — all go through the permission system
- [ ] Self-role-change is prevented
- [ ] Tests cover permission boundaries (viewer cannot publish, editor cannot delete users)

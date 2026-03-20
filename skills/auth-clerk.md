---
name: auth-clerk
description: >
  Clerk integration for Next.js App Router authentication. Covers provider setup,
  middleware, pre-built components, server and client auth access, webhook sync
  to local database, and organization management. Implementation skill for the
  authentication conceptual skill — read that first for auth principles.
---

# Auth — Clerk

Implementation skill for **authentication**. Read that skill first for principles on session management, credential handling, and auth flow design.

---

## When to Use

Apply this skill when:
- Using Clerk as the authentication provider in a Next.js App Router project
- You need social login (Google, GitHub, etc.) with minimal custom code
- Pre-built sign-in/sign-up UI is acceptable or preferred
- Organization/team management is needed
- You want auth infrastructure managed externally

Do NOT use this skill for:
- Custom OTP with full control over the flow — see **auth-custom-otp**
- Authorization logic (roles beyond Clerk's built-in) — see **authz-rbac-drizzle**
- Non-Next.js projects (Clerk has other SDKs, but this skill covers Next.js only)

---

## Core Rules

### 1. Install and configure Clerk

```bash
npm install @clerk/nextjs
```

Environment variables (add to `.env.local`):

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

The `NEXT_PUBLIC_` prefix exposes the publishable key to the browser. The secret key stays server-side only.

### 2. Wrap the app in ClerkProvider

Add `<ClerkProvider>` in the root layout. It must wrap all pages that need auth context.

```typescript
// src/app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 3. Set up middleware with clerkMiddleware

Use `clerkMiddleware` and `createRouteMatcher` to protect routes. Public routes are explicitly listed; everything else requires authentication.

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
```

### 4. Use pre-built components for sign-in and sign-up

Clerk provides drop-in components. Use them on dedicated pages.

```typescript
// src/app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
      <SignIn />
    </div>
  );
}

// src/app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
      <SignUp />
    </div>
  );
}
```

Other pre-built components:
- `<UserButton />` — avatar dropdown with sign-out, profile link
- `<UserProfile />` — full profile management page
- `<OrganizationSwitcher />` — org picker (if orgs enabled)

### 5. Access auth in Server Components

Use `auth()` for session data and `currentUser()` for full user details.

```typescript
// In a Server Component or Server Action
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    // This should not happen if middleware is protecting the route
    redirect("/sign-in");
  }

  const user = await currentUser();

  return (
    <div>
      <h1>Welcome, {user?.firstName}</h1>
    </div>
  );
}
```

In Server Actions:

```typescript
"use server";

import { auth } from "@clerk/nextjs/server";

export async function createSkill(data: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // ... create skill with userId as author
}
```

### 6. Access auth in Client Components

Use `useAuth()` for session info and `useUser()` for user details.

```typescript
"use client";

import { useAuth, useUser } from "@clerk/nextjs";

export function ProfileWidget() {
  const { isSignedIn, userId } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) return null;

  return (
    <div>
      <p>{user?.fullName}</p>
      <p>{user?.primaryEmailAddress?.emailAddress}</p>
    </div>
  );
}
```

### 7. Protect API routes

Check auth in Route Handlers using `auth()`.

```typescript
// src/app/api/skills/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ... fetch and return data
}
```

### 8. Sync Clerk users to your local database via webhooks

Clerk manages user data externally. To maintain a local `users` table (for foreign keys, joins, custom fields), sync via webhooks.

Set up a Clerk webhook in the Clerk dashboard pointing to `/api/webhooks/clerk`. Install `svix` for signature verification.

```bash
npm install svix
```

```typescript
// src/app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

interface ClerkUserEvent {
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string;
  };
  type: string;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers = {
    "svix-id": request.headers.get("svix-id")!,
    "svix-timestamp": request.headers.get("svix-timestamp")!,
    "svix-signature": request.headers.get("svix-signature")!,
  };

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: ClerkUserEvent;

  try {
    event = wh.verify(body, headers) as ClerkUserEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const { data, type } = event;
  const email = data.email_addresses[0]?.email_address;
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ");

  switch (type) {
    case "user.created":
      await db.insert(users).values({
        clerkId: data.id,
        email: email ?? "",
        name: name || null,
        avatarUrl: data.image_url,
      });
      break;

    case "user.updated":
      await db
        .update(users)
        .set({ email: email ?? "", name: name || null, avatarUrl: data.image_url })
        .where(eq(users.clerkId, data.id));
      break;

    case "user.deleted":
      await db.delete(users).where(eq(users.clerkId, data.id));
      break;
  }

  return NextResponse.json({ received: true });
}
```

Add `clerkId` to your users table:

```typescript
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["admin", "member"] }).default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 9. Organization and role management

Enable Clerk Organizations for team/org features. Access org data in components and server code.

```typescript
// Server Component
import { auth } from "@clerk/nextjs/server";

export default async function OrgPage() {
  const { orgId, orgRole } = await auth();

  if (!orgId) {
    return <p>Select an organization to continue.</p>;
  }

  return (
    <div>
      <p>Org: {orgId}</p>
      <p>Your role: {orgRole}</p>
    </div>
  );
}
```

Use `orgRole` for role-based UI. Clerk provides `org:admin` and `org:member` by default, and you can define custom roles in the Clerk dashboard.

### 10. Custom sign-in pages (when pre-built components are not enough)

Use Clerk's `useSignIn` hook for fully custom UI:

```typescript
"use client";

import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";

export function CustomSignIn() {
  const { signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");

  async function handleSubmit() {
    if (!signIn) return;

    const result = await signIn.create({
      identifier: email,
      strategy: "email_code",
    });

    // Handle result.status: "needs_first_factor", "complete", etc.
    if (result.status === "complete" && result.createdSessionId) {
      await setActive({ session: result.createdSessionId });
    }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Sign in</button>
    </form>
  );
}
```

### 11. Dev mode — Clerk development instance

Clerk provides a free development instance. It uses test keys (`pk_test_`, `sk_test_`) and supports test email addresses. No special dev bypass needed — Clerk's dev instance handles it.

Important: use separate Clerk instances for development and production. Never use production keys in development.

---

## Banned Patterns

- ❌ Importing `@clerk/nextjs/server` in Client Components → use `@clerk/nextjs` client-side hooks instead; server imports crash the browser bundle
- ❌ Checking auth client-side to protect pages → use middleware; client checks flash unauthorized content
- ❌ Storing Clerk secret key in `NEXT_PUBLIC_` prefix → keep the secret key server-only, never expose to the browser
- ❌ Skipping webhook signature verification → always verify with `svix`
- ❌ Relying solely on Clerk for user data without a local sync → maintain a local users table for foreign keys, joins, and offline access
- ❌ Using `auth()` in Client Components → use `useAuth()` instead
- ❌ Hardcoding role strings in multiple places → define role constants once in a central location

---

## Quality Gate

Before considering Clerk auth complete:

- [ ] `<ClerkProvider>` wraps the root layout
- [ ] Middleware protects all non-public routes using `clerkMiddleware`
- [ ] Sign-in and sign-up pages are accessible and functional
- [ ] `auth()` used in all Server Components and Server Actions that need user context
- [ ] Webhook endpoint syncs Clerk users to local database
- [ ] Webhook signature verified with `svix`
- [ ] Environment variables use correct prefixes (NEXT_PUBLIC_ vs server-only)
- [ ] Separate Clerk instances for development and production
- [ ] `<UserButton />` or equivalent sign-out mechanism accessible from every protected page
- [ ] API routes check `auth()` before processing requests

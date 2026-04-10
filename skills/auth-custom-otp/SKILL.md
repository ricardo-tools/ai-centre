---
name: auth-custom-otp
description: >
  Custom email OTP authentication with Jose JWT sessions. Covers OTP generation,
  hashing, verification, domain restriction, JWT session management, Edge-compatible
  middleware, and cookie handling. Implementation skill for the authentication
  conceptual skill — read that first for auth principles.
---

# Auth — Custom Email OTP

Implementation skill for **authentication**. Read that skill first for principles on session management, credential handling, and auth flow design.

---

## When to Use

Apply this skill when:
- Building email OTP login without a third-party auth provider
- The project needs Edge-compatible JWT sessions (Vercel, Cloudflare Workers)
- Domain-restricted access is required (only certain email domains allowed)
- You want full control over the auth flow with no external dependencies
- The project already uses this pattern (e.g. AI Centre)

Do NOT use this skill for:
- Social login, OAuth, or multi-provider auth — see **auth-clerk** or a dedicated OAuth skill
- Authorization (roles, permissions) — see **authz-rbac-drizzle**
- Password-based auth (this skill is OTP-only)

---

## Core Rules

### 1. Generate cryptographically secure OTP codes

Use `crypto.randomInt` for uniform distribution. Never use `Math.random`.

```typescript
// src/lib/otp.ts
import crypto from "crypto";

export function generateOtp(): string {
  // 6-digit code, zero-padded
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
}
```

### 2. Hash OTPs before storage — never store plain codes

Use SHA-256. The hash is stored in the database; the plain code is sent to the user's email. On verification, hash the submitted code and compare.

```typescript
export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}
```

### 3. Verify OTP with expiry check and attempt limiting

Every verification must check: (a) token exists, (b) not expired, (c) attempts not exceeded, (d) hash matches. Increment attempts on every check, even failures.

```typescript
// src/server/actions/auth.ts
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { verificationTokens } from "@/server/db/schema";
import { hashOtp } from "@/lib/otp";

const MAX_ATTEMPTS = 3;
const OTP_EXPIRY_MINUTES = 10;

export async function verifyOtp(email: string, code: string): Promise<boolean> {
  const token = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.email, email),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  if (!token) return false;

  // Check expiry
  if (new Date() > token.expiresAt) {
    await db.delete(verificationTokens).where(eq(verificationTokens.id, token.id));
    return false;
  }

  // Check attempts
  if (token.attempts >= MAX_ATTEMPTS) {
    await db.delete(verificationTokens).where(eq(verificationTokens.id, token.id));
    return false;
  }

  // Increment attempts
  await db
    .update(verificationTokens)
    .set({ attempts: token.attempts + 1 })
    .where(eq(verificationTokens.id, token.id));

  // Compare hashes
  const hashedInput = hashOtp(code);
  if (hashedInput !== token.token) return false;

  // Success — clean up
  await db.delete(verificationTokens).where(eq(verificationTokens.id, token.id));
  return true;
}
```

### 4. Restrict email domains

Validate the email domain before sending the OTP. Reject requests from unauthorized domains immediately.

```typescript
const ALLOWED_DOMAINS = ["ezycollect.com.au", "ezycollect.io", "sidetrade.com"];

export function isAllowedDomain(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain !== undefined && ALLOWED_DOMAINS.includes(domain);
}

export async function requestOtp(email: string): Promise<{ success: boolean; error?: string }> {
  const normalized = email.trim().toLowerCase();

  if (!isAllowedDomain(normalized)) {
    return { success: false, error: "Email domain not authorized" };
  }

  const otp = generateOtp();
  const hashed = hashOtp(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Store hashed OTP
  await db.insert(verificationTokens).values({
    email: normalized,
    token: hashed,
    expiresAt,
    attempts: 0,
  });

  // Send plain OTP via email
  await sendOtpEmail(normalized, otp);

  return { success: true };
}
```

### 5. Create JWT sessions with jose (Edge-compatible)

Use `jose` — it runs in Edge Runtime, Node.js, and browsers. Do not use `jsonwebtoken` (Node.js only, incompatible with Edge middleware).

```typescript
// src/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);
const SESSION_DURATION = "7d";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "admin" | "member";
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
```

### 6. Two verification implementations — Node.js and Edge

The `verifySession` function above works in both environments because `jose` is Edge-compatible. However, if you need different behavior (e.g. database lookup in Node, lightweight check in Edge), split them:

```typescript
// src/lib/auth.ts — Full verification (Server Actions, API routes)
export async function getSession(): Promise<SessionPayload | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return verifySession(token);
}

// src/lib/auth-edge.ts — Lightweight verification (middleware)
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function verifySessionEdge(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
```

### 7. Cookie management — httpOnly, secure, sameSite

Set the session JWT in an httpOnly cookie. Never expose it to client-side JavaScript.

```typescript
import { cookies } from "next/headers";

export async function setSessionCookie(jwt: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
```

### 8. Middleware pattern — protect routes, allow public paths, dev bypass

The middleware runs on every request. It checks for a valid session cookie and redirects unauthenticated users to `/login`. Public routes and dev mode are exempt.

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifySessionEdge } from "@/lib/auth-edge";

const PUBLIC_ROUTES = ["/login", "/api/webhooks"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dev mode: bypass auth entirely
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (pathname.startsWith("/_next") || pathname.startsWith("/favicon")) {
    return NextResponse.next();
  }

  // Check session
  const token = request.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const valid = await verifySessionEdge(token);
  if (!valid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

### 9. Database schema for verification tokens and users

The `verification_tokens` table stores hashed OTPs. The `users` table stores accounts. Create or find the user on successful OTP verification.

```typescript
// Schema (Drizzle ORM)
import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable("verification_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull(),
  token: text("token").notNull(),        // SHA-256 hash of OTP
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: text("role", { enum: ["admin", "member"] }).default("member").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### 10. Full login flow — requestOtp to session creation

The complete flow ties all pieces together:

```typescript
// Server Action: handle OTP verification and session creation
"use server";

import { verifyOtp } from "./verify-otp";
import { createSession, setSessionCookie } from "@/lib/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function loginWithOtp(
  email: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const valid = await verifyOtp(email, code);
  if (!valid) {
    return { success: false, error: "Invalid or expired code" };
  }

  // Find or create user
  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({ email, role: "member" })
      .returning();
    user = newUser;
  }

  // Create session
  const jwt = await createSession({
    userId: user.id,
    email: user.email,
    role: user.role as "admin" | "member",
  });

  await setSessionCookie(jwt);

  return { success: true };
}
```

---

## Banned Patterns

- ❌ Storing plain-text OTP codes → always hash with SHA-256 before database storage
- ❌ Using `Math.random` for OTP generation → use `crypto.randomInt` only
- ❌ Using `jsonwebtoken` → use `jose` instead; `jsonwebtoken` is not Edge-compatible
- ❌ Exposing the session JWT to client JavaScript → cookie must be `httpOnly`
- ❌ Unlimited OTP attempts → cap at 3 attempts per token, then invalidate
- ❌ OTP codes that never expire → enforce a 10-minute maximum TTL
- ❌ Skipping domain validation before sending OTP emails → validate the email domain before generating the OTP
- ❌ Using `cookies()` in middleware → use `request.cookies` instead (Edge Runtime)

---

## Quality Gate

Before considering custom OTP auth complete:

- [ ] OTP codes are 6 digits, generated with `crypto.randomInt`
- [ ] OTPs are SHA-256 hashed before storage; plain codes never persisted
- [ ] Verification enforces expiry (10 min) and attempt limit (3)
- [ ] Email domain restriction blocks unauthorized domains before OTP send
- [ ] JWT sessions created with `jose`, verified in both Node.js and Edge
- [ ] Session cookie is httpOnly, secure (in production), sameSite lax
- [ ] Middleware protects all routes except explicit public paths
- [ ] Dev mode bypasses auth entirely (no login required)
- [ ] Used tokens are deleted from the database after verification
- [ ] `AUTH_SECRET` is stored in environment variables, minimum 32 characters

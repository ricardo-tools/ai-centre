---
name: auth-otp-templates
type: reference
companion_to: auth-otp
description: Copy-paste templates for OTP authentication in bootstrapped projects. JWT sessions, hashed OTPs, middleware, login page, schema additions.
---

# OTP Auth Templates

> **Companion to [auth-otp](../SKILL.md).** Copy these templates into a bootstrapped project to get working OTP authentication.

**Dependencies:**

```bash
npm install jose
```

(`nodemailer` and `@libsql/client` should already be installed from email-mailpit and db-turso-drizzle.)

---

## Schema Additions — `src/db/schema.ts`

Add these tables to the existing schema:

```typescript
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),  // crypto.randomUUID()
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const otpCodes = sqliteTable('otp_codes', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  codeHash: text('code_hash').notNull(),  // SHA-256 hash, never plain text
  attempts: integer('attempts').notNull().default(0),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
```

After adding, run:

```bash
npm run db:generate
npm run db:migrate
```

---

## `src/lib/auth.ts` — JWT Session Management

```typescript
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export interface Session {
  userId: string;
  email: string;
}

const COOKIE_NAME = 'auth-token';
const JWT_EXPIRY = '7d';

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET environment variable is required');
  return new TextEncoder().encode(secret);
}

export async function createSession(userId: string, email: string): Promise<void> {
  const token = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(JWT_EXPIRY)
    .setIssuedAt()
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
```

**Environment variable:** Add `AUTH_SECRET` to `.env.local` (32+ random characters):

```bash
AUTH_SECRET=your-random-secret-at-least-32-characters-long
```

---

## `src/lib/otp.ts` — OTP Generation & Verification

```typescript
import crypto from 'crypto';
import { db } from '@/db/client';
import { otpCodes, users } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

const OTP_EXPIRY_MS = 5 * 60 * 1000;       // 5 minutes
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;                     // 3 OTPs per email per hour

function generateOtp(): string {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

function hashOtp(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export async function requestOtp(email: string): Promise<{ ok: boolean; error?: string }> {
  const normalised = email.toLowerCase().trim();

  // Rate limit check
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recentCodes = await db.select()
    .from(otpCodes)
    .where(and(eq(otpCodes.email, normalised), gt(otpCodes.createdAt, windowStart)));

  if (recentCodes.length >= RATE_LIMIT_MAX) {
    console.warn('[otp] rate limit exceeded', { email: normalised });
    return { ok: false, error: 'Too many attempts. Try again later.' };
  }

  const code = generateOtp();
  const hash = hashOtp(code);

  await db.insert(otpCodes).values({
    id: crypto.randomUUID(),
    email: normalised,
    codeHash: hash,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
    createdAt: new Date(),
  });

  await sendEmail({
    to: normalised,
    subject: 'Your login code',
    html: `<p>Your code is: <strong>${code}</strong></p><p>It expires in 5 minutes.</p>`,
    text: `Your code is: ${code}. It expires in 5 minutes.`,
  });

  console.info('[otp] code sent', { email: normalised });
  return { ok: true };
}

export async function verifyOtp(
  email: string,
  code: string,
): Promise<{ ok: boolean; userId?: string; error?: string }> {
  const normalised = email.toLowerCase().trim();
  const hash = hashOtp(code);

  // Find the most recent unexpired OTP for this email
  const [otp] = await db.select()
    .from(otpCodes)
    .where(and(eq(otpCodes.email, normalised), gt(otpCodes.expiresAt, new Date())))
    .orderBy(otpCodes.createdAt)
    .limit(1);

  if (!otp) {
    return { ok: false, error: 'Code expired or not found' };
  }

  if (otp.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: 'Too many attempts. Request a new code.' };
  }

  // Increment attempts
  await db.update(otpCodes)
    .set({ attempts: otp.attempts + 1 })
    .where(eq(otpCodes.id, otp.id));

  if (otp.codeHash !== hash) {
    return { ok: false, error: `Invalid code. ${MAX_ATTEMPTS - otp.attempts - 1} attempts remaining.` };
  }

  // Valid — invalidate the OTP (set expiry to now)
  await db.update(otpCodes)
    .set({ expiresAt: new Date() })
    .where(eq(otpCodes.id, otp.id));

  // Find or create user
  let [user] = await db.select().from(users).where(eq(users.email, normalised)).limit(1);
  if (!user) {
    const id = crypto.randomUUID();
    await db.insert(users).values({
      id,
      email: normalised,
      name: normalised.split('@')[0],
      createdAt: new Date(),
    });
    user = { id, email: normalised, name: normalised.split('@')[0], createdAt: new Date() };
  }

  console.info('[otp] verified', { email: normalised, userId: user.id });
  return { ok: true, userId: user.id };
}
```

---

## `src/middleware.ts` — Auth Middleware

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is required');
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
```

---

## Login Page — `src/app/login/page.tsx`

A minimal OTP login form. Adapt styling to match your project's design system.

```tsx
'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setStep('code');
    } else {
      setError(data.error || 'Something went wrong');
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      window.location.href = '/';
    } else {
      setError(data.error || 'Invalid code');
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h1>Sign In</h1>
      {step === 'email' ? (
        <form onSubmit={handleRequestOtp}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify}>
          <p>Code sent to <strong>{email}</strong></p>
          <label htmlFor="code">6-digit code</label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            autoFocus
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button type="button" onClick={() => setStep('email')} style={{ marginTop: 8, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Back
          </button>
        </form>
      )}
    </div>
  );
}
```

---

## API Routes

### `src/app/api/auth/request-otp/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { requestOtp } from '@/lib/otp';

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ ok: false, error: 'Email required' }, { status: 400 });
  const result = await requestOtp(email);
  return NextResponse.json(result);
}
```

### `src/app/api/auth/verify-otp/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/otp';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  const { email, code } = await request.json();
  if (!email || !code) return NextResponse.json({ ok: false, error: 'Email and code required' }, { status: 400 });
  const result = await verifyOtp(email, code);
  if (result.ok && result.userId) {
    await createSession(result.userId, email);
  }
  return NextResponse.json(result);
}
```

---

## `.env.local` Additions

```bash
# ── Auth ─────────────────────────────────
AUTH_SECRET=change-me-to-a-random-32-char-string
```

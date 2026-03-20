---
name: authentication
description: >
  Principles for authentication — strategies, session management, token lifecycle,
  multi-factor auth, security hardening, and development bypass patterns.
---

# Authentication

## When to Use

Apply this skill when:

- The application verifies user identity (login, signup, session checks)
- Implementing token-based sessions (JWT or server-side)
- Adding multi-factor authentication or passwordless flows
- Building dev-mode auth bypass for local development
- Hardening against brute force, timing attacks, or credential stuffing

This skill is about WHO you are — see **authorization** for WHAT you can do.

## Do NOT use this skill for:

- Deciding what a user can access after login — use **authorization**
- Email delivery for OTP/magic links — use **email-sending**
- Storing user profile data beyond auth-related fields — use **database-design**

---

## Core Rules

### 1. Choose the simplest strategy that meets your security requirements.

Passwordless (OTP or magic link) eliminates password storage and reuse attacks.
OAuth delegates to a trusted provider. Password + MFA is the fallback when
neither is viable.

### 2. Sessions must expire.

Stateless (JWT): short-lived access tokens (15–60 minutes) with longer-lived
refresh tokens (7–30 days). Stateful (server session): absolute expiry plus
idle timeout. Never issue tokens that live forever.

```ts
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const accessToken = await new SignJWT({ sub: user.id, role: user.role })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('30m')
  .sign(secret);
```

### 3. Refresh tokens are single-use.

Each refresh issues a new access token AND a new refresh token. Detect reuse of
an old refresh token as a compromise signal — revoke the entire token family.

```ts
async function rotateRefresh(oldToken: string): Promise<Result<TokenPair, AuthError>> {
  const record = await db.findRefreshToken(oldToken);
  if (!record || record.usedAt) {
    await db.revokeTokenFamily(record.familyId); // compromise
    return Err(new AuthError('Token reuse detected'));
  }
  await db.markUsed(oldToken);
  const newAccess = await issueAccessToken(record.userId);
  const newRefresh = await issueRefreshToken(record.userId, record.familyId);
  return Ok({ access: newAccess, refresh: newRefresh });
}
```

### 4. Logout must actually log out.

For stateless tokens: remove from client storage, add to a short-lived deny
list until natural expiry. For server sessions: destroy the session record.
Provide "log out all devices" for account compromise recovery.

### 5. Protect against brute force.

Rate limit login attempts per account and per IP. After N failures (typically
5), enforce a cooldown or CAPTCHA. For OTP: limit attempts per code (3), limit
code requests per time window.

```ts
async function checkRateLimit(email: string): Promise<Result<void, RateLimitError>> {
  const attempts = await db.countRecentAttempts(email, { minutes: 15 });
  if (attempts >= MAX_ATTEMPTS) {
    return Err(new RateLimitError('Too many attempts. Try again later.'));
  }
  return Ok(undefined);
}
```

### 6. Timing attacks are real.

Use constant-time comparison for tokens, OTPs, and password hashes. Never leak
whether an account exists through error messages — use generic responses ("If
that email exists, we sent a code").

### 7. MFA should be phishing-resistant.

Prefer passkeys (WebAuthn) over TOTP over SMS. SMS is better than nothing but
vulnerable to SIM swapping. Never use email as a second factor — it's already
the primary channel.

### 8. Auth middleware protects by default.

All routes are authenticated unless explicitly marked public. The allow list of
public routes is small and auditable. Never invert this (deny list of protected
routes).

### 9. Domain restriction is a business rule, not a security boundary.

Allow-listing email domains (e.g., `@company.com`) controls who can register,
not what they can access. Always combine with proper authorization.

### 10. Dev bypass must be safe.

In development mode, bypass auth with a fixed dev user. The bypass must: only
activate when `NODE_ENV === 'development'`, never be deployable to production,
and still exercise the same session/context code paths.

---

## Strategy Comparison

| Strategy | Pros | Cons | Best for |
|---|---|---|---|
| Passwordless OTP | No password storage, simple UX | Depends on email/SMS delivery | Internal tools, low-friction apps |
| Magic link | Same as OTP, even simpler UX | Link forwarding risk, email latency | Consumer apps with email-first UX |
| OAuth / SSO | Delegates security, trusted providers | Vendor dependency, complex flows | Apps with enterprise customers |
| Password + MFA | Familiar, works offline | Password reuse, storage liability | When other strategies aren't viable |
| Passkeys | Phishing-resistant, no shared secret | Browser support gaps, recovery UX | High-security, modern browsers |

---

## Session Patterns

**Stateless (JWT):**
- Store access token in memory (not localStorage). Refresh token in httpOnly cookie.
- Access token contains: user ID, role, issued-at, expiry. No sensitive data.
- Verify signature and expiry on every request. Check deny list for revoked tokens.

**Stateful (server session):**
- Session ID in httpOnly, Secure, SameSite=Strict cookie.
- Session data lives server-side (database or Redis).
- Easier to revoke, harder to scale without shared storage.

---

## Token Lifecycle

1. **Login** → issue access token + refresh token.
2. **API request** → validate access token (signature, expiry, deny list).
3. **Access token expired** → use refresh token to get new pair.
4. **Refresh token expired** → user must re-authenticate.
5. **Logout** → revoke refresh token, deny-list access token until expiry.
6. **Compromise detected** → revoke all tokens for the user.

---

## Banned Patterns

- ❌ Storing passwords in plain text → use bcrypt, scrypt, or Argon2
- ❌ Using localStorage for tokens → use httpOnly cookies or in-memory
- ❌ Long-lived JWTs with no refresh → short-lived access + refresh rotation
- ❌ Revealing account existence in errors → use generic "If that email exists…" messages
- ❌ Skipping rate limiting on login/OTP → enforce per-account and per-IP limits
- ❌ Using MD5/SHA-1 for password hashing → use bcrypt, scrypt, or Argon2
- ❌ Deploying dev auth bypass to production → guard with `NODE_ENV` check
- ❌ "Remember me" via indefinite token lifetime → use refresh token rotation instead

---

## Quality Gate

- [ ] All routes are authenticated by default; public routes are explicitly listed.
- [ ] Access tokens expire within 60 minutes; refresh tokens within 30 days.
- [ ] Login attempts are rate-limited per account and per IP.
- [ ] Token comparison uses constant-time operations.
- [ ] Logout invalidates the session/token server-side (not just client-side).
- [ ] MFA is available for sensitive accounts.
- [ ] Dev bypass is guarded by `NODE_ENV === 'development'` and uses real session paths.
- [ ] Error messages do not reveal whether an account exists.

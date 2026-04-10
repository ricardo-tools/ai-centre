---
name: security-review
description: >
  Security thinking and patterns for web applications. Covers threat modelling,
  secrets, input validation, injection prevention, authentication hardening, XSS,
  content sanitisation, supply chain security, and secure defaults. Apply when
  adding auth, handling user input, accepting file uploads, rendering untrusted
  content, creating API endpoints, or working with secrets and sensitive data.
  Stack-agnostic principles with web-specific guidance.
---

# Security Review

Security is not a checklist bolted on at the end. It is a way of thinking about every design decision: what can go wrong, who benefits from it going wrong, and how do we make the wrong thing hard to do by default.

This skill teaches security thinking first, then specific patterns. For input validation mechanics and rate limiting implementation, see **backend-patterns**. This skill focuses on *what* to protect and *why*.

---

## When to Use

Apply this skill when:
- Adding or modifying authentication or authorisation
- Handling user input, file uploads, or URL submissions
- Rendering content from external sources or AI-generated HTML
- Creating API endpoints (internal or external)
- Working with secrets, tokens, or credentials
- Storing or transmitting sensitive data (PII, emails, passwords, OTPs)
- Integrating third-party services or accepting webhooks
- Reviewing code before deployment

Do NOT use this skill for:
- Input validation implementation details (Zod schemas, error translation) — see **backend-patterns**
- Rate limiting implementation — see **backend-patterns**
- Auth flow architecture decisions — see `PROJECT_REFERENCE.md` for the current design

---

## Core Rules

For input validation mechanics (Zod schemas, request parsing), see **backend-patterns**.

### 1. Think in threats, not checklists

Before writing security code, ask three questions:
- **What am I protecting?** (user data, session tokens, admin actions, financial transactions)
- **Who would attack it?** (anonymous internet users, authenticated members, compromised dependencies, AI-generated content)
- **What's the worst outcome?** (data leak, privilege escalation, account takeover, service disruption)

The answers shape which defences matter. An internal tool with domain-restricted email OTP needs different protections than a public SaaS with password auth. Apply effort proportional to risk.

### 2. Least privilege by default

Every component — user, function, service, API key — should have the minimum permissions needed to do its job. Nothing more.

- Users start with `member` role, not `admin`
- API keys are scoped to specific operations, not full access
- Server Actions check permissions before executing, not after
- Database connections use a role with only the needed table permissions
- Environment variables are only present in the environments that need them

### 3. Defence in depth

No single layer is trusted to be the complete defence. Multiple independent layers each reduce risk:

- Input validation at the boundary (schema validation) AND in the domain (business rules)
- Auth check in middleware AND in the Server Action/use case
- HTML sanitised before storage AND before rendering
- Rate limiting at the edge AND per-user in the application

If one layer fails, the others still protect the system.

### 4. Secure by default, insecure by opt-in

Systems should be secure in their default configuration. Insecure behaviour requires explicit, documented choice.

- New API endpoints require authentication by default. Public access is an explicit opt-out.
- Cookies are `HttpOnly; Secure; SameSite=Strict` by default.
- User-generated content is escaped by default. Raw HTML rendering is an explicit opt-in with sanitisation.
- New database tables have restrictive permissions. Broader access is granted per-table, per-role.

### 5. Never trust the client

Anything from the browser, mobile app, or API consumer is untrusted input — including headers, cookies, URL parameters, form data, file uploads, and claimed content types. Validate and sanitise everything on the server.

### 6. Fail closed, not open

When a security check fails or encounters an error, the default is to deny access — not grant it.

```ts
// ✅ Fail closed — error = deny
async function checkAuth(token: string | undefined): AuthResult {
  if (!token) return { authenticated: false };
  try {
    const session = await verifyToken(token);
    return { authenticated: true, user: session };
  } catch {
    return { authenticated: false };  // verification error = deny
  }
}

// ❌ Fail open — error = allow
async function checkAuth(token: string | undefined) {
  try {
    return await verifyToken(token);
  } catch {
    return defaultUser;  // error grants access
  }
}
```

---

## Secrets Management

**Rules:**
- All secrets in environment variables. Never in source code, never in git history.
- `.env.local` in `.gitignore`. Production secrets in hosting platform only.
- Verify secrets exist at startup — fail hard if missing, don't run with undefined keys.
- Rotate secrets periodically. Design systems so rotation doesn't require downtime.
- Different secrets per environment (dev, staging, production). Never share production secrets with dev.

```ts
// ✅ Verify at startup
const requiredEnvVars = ['DATABASE_URL', 'AUTH_SECRET', 'ANTHROPIC_API_KEY'] as const;
for (const key of requiredEnvVars) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}
```

**If a secret is committed to git:** Consider it compromised. Rotate immediately. Rewriting git history is not enough — the secret may already be in caches, forks, or CI logs.

---

## Authentication Hardening

### Token Storage

```ts
// ✅ HttpOnly cookie — not accessible to JavaScript, not vulnerable to XSS
response.cookies.set('auth-token', token, {
  httpOnly: true,
  secure: true,            // HTTPS only
  sameSite: 'strict',      // no cross-site sending
  maxAge: 60 * 60 * 24,   // 24 hours
  path: '/',
});

// ❌ localStorage — accessible to any JavaScript on the page, including XSS payloads
localStorage.setItem('auth-token', token);
```

### OTP / Passwordless Auth

OTP is simpler than passwords but has its own attack surface:

- **Hash the OTP before storage.** Store `SHA-256(code)`, not the plain code. Verify by hashing the submitted code and comparing.
- **Short expiry.** 10 minutes maximum. Shorter is better.
- **Attempt limiting.** Maximum 3 verification attempts per token. After 3 failures, invalidate the token — user must request a new code.
- **Rate limit OTP requests.** Limit how many codes can be requested per email per hour to prevent inbox flooding and brute force across codes.
- **Domain restriction.** If the app is internal, validate the email domain before sending a code — don't send OTPs to arbitrary addresses.
- **Timing-safe comparison.** Use constant-time comparison for OTP hash verification to prevent timing attacks.

```ts
// ✅ Timing-safe comparison
import { timingSafeEqual } from 'crypto';

function verifyOtpHash(submitted: string, stored: string): boolean {
  const a = Buffer.from(submitted, 'hex');
  const b = Buffer.from(stored, 'hex');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
```

### Session Management

- Invalidate sessions on logout (delete the cookie AND revoke server-side if using a session store).
- Invalidate all sessions on password/credential change.
- Set reasonable session durations — long-lived sessions increase the window of token theft.
- For admin actions, consider re-authentication even within an active session.

---

## Injection Prevention

### SQL Injection

Always use parameterised queries or an ORM query builder. Never concatenate user input into SQL strings.

```ts
// ✅ Parameterised (ORM)
const user = await db.query.users.findFirst({
  where: eq(users.email, userEmail),
});

// ✅ Parameterised (raw SQL)
await db.execute(sql`SELECT * FROM users WHERE email = ${userEmail}`);

// ❌ String concatenation — SQL injection
await db.execute(`SELECT * FROM users WHERE email = '${userEmail}'`);
```

ORMs and query builders (Drizzle, Prisma, Knex) parameterise by default. The risk is when you drop to raw SQL — always use tagged template literals or parameter arrays.

### Server-Side Request Forgery (SSRF)

When your server makes HTTP requests to URLs provided by users (webhook URLs, showcase uploads, link previews), an attacker can make your server request internal network resources.

```ts
// ✅ Validate URLs before fetching
function isAllowedUrl(url: string): boolean {
  const parsed = new URL(url);

  // Block private/internal ranges
  const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254'];
  if (blockedHosts.includes(parsed.hostname)) return false;

  // Block non-HTTP protocols
  if (!['http:', 'https:'].includes(parsed.protocol)) return false;

  // Block internal network ranges (10.x, 172.16-31.x, 192.168.x)
  // ... IP range checking

  return true;
}
```

### Command Injection

Never pass user input to shell commands. If you must invoke a subprocess, use argument arrays, not string interpolation.

```ts
// ✅ Argument array — input is a parameter, not part of the command
import { execFile } from 'child_process';
execFile('git', ['log', '--oneline', '-n', userCount], callback);

// ❌ String interpolation — command injection
exec(`git log --oneline -n ${userCount}`);
```

---

## Cross-Site Scripting (XSS)

### The Default Defence

React (and most modern frameworks) escapes output by default. String content in JSX is safe. The risk is when you bypass this with `dangerouslySetInnerHTML` or equivalent.

### Rendering Untrusted HTML

When you must render HTML from untrusted sources (AI-generated showcases, user-submitted content, markdown-to-HTML conversion), sanitise it.

```ts
import DOMPurify from 'isomorphic-dompurify';

// ✅ Sanitise with an explicit allowlist
function renderUntrustedHtml(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'p', 'ul', 'ol', 'li', 'a',
                   'strong', 'em', 'code', 'pre', 'blockquote', 'img', 'br', 'hr'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOW_DATA_ATTR: false,
  });
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

**AI-generated HTML is untrusted.** Even though you generated it via your own API call, the model could produce `<script>` tags, `onerror` handlers, or other executable content. Always sanitise before rendering.

### Content Security Policy

CSP is a defence-in-depth layer. If XSS somehow bypasses sanitisation, CSP prevents the injected code from executing.

```ts
// next.config — strict CSP (no unsafe-inline, no unsafe-eval)
const ContentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",                    // no inline scripts
  "style-src 'self' 'nonce-${nonce}'",    // styles via nonce only
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://api.anthropic.com",
  "frame-ancestors 'none'",               // prevent clickjacking
].join('; ');
```

**Do not use `unsafe-inline` or `unsafe-eval` in CSP.** They defeat the purpose. If your app needs inline scripts or styles, use nonce-based CSP.

---

## File Upload Security

Extension and MIME type checks are necessary but insufficient — both are trivially spoofable. Defence in depth:

1. **Validate MIME type AND extension** — rejects the obvious mismatches.
2. **Validate content** — read the file header (magic bytes) to verify actual file type. A `.png` with a `PK` header is actually a ZIP.
3. **Size limits** — enforce max file size before reading the full body.
4. **Isolated storage** — store uploads in a separate storage service (Vercel Blob, S3), never on the application server's filesystem.
5. **Serve from a different domain** — uploaded files served from a separate domain (e.g. `cdn.example.com`) cannot access cookies from `app.example.com`.
6. **No execution** — never serve uploaded files with executable content types. Set `Content-Disposition: attachment` for downloads.

```ts
function validateUpload(file: File, options: {
  maxSizeBytes: number;
  allowedTypes: string[];
}) {
  if (file.size > options.maxSizeBytes) {
    throw new SecurityError('File exceeds size limit');
  }
  if (!options.allowedTypes.includes(file.type)) {
    throw new SecurityError('File type not allowed');
  }
  // Content validation happens server-side after receiving the file
}
```

---

## Sensitive Data

### Logging

```ts
// ✅ Log what happened, not what it contained
logger.info('OTP sent', { email: user.email, tokenId: token.id });
logger.info('Login successful', { userId: user.id });
logger.error('Payment failed', { orderId, errorCode: err.code });

// ❌ Sensitive data in logs
logger.info('OTP sent', { email, code: plainOtp });
logger.info('Login', { email, password });
logger.error('Payment failed', { cardNumber, cvv, error });
```

### Error Responses

```ts
// ✅ Generic for client, detailed for server logs
catch (error) {
  console.error('Checkout failed:', { orderId, error });  // server log: full detail
  return { success: false, error: 'Something went wrong' };  // client: generic
}

// ❌ Internal details exposed to client
catch (error) {
  return { success: false, error: error.message, stack: error.stack };
}
```

**Never expose:** Stack traces, database error messages, internal IDs that aren't meant to be public, file paths, environment variable names, SQL queries.

---

## Supply Chain Security

Your application is only as secure as its dependencies.

- **`npm audit`** — run regularly, fix critical and high vulnerabilities. Don't ignore audit output.
- **Lock files** — always commit `package-lock.json`. Use `npm ci` in CI/CD for reproducible builds.
- **Pin versions** — use exact versions or narrow ranges for critical dependencies. `"zod": "3.23.8"` not `"zod": "^3.0.0"`.
- **Review new dependencies** — before adding a package, check: maintenance activity, download count, known vulnerabilities, scope of permissions. A package with 12 weekly downloads and no updates in 2 years is a risk.
- **Minimal dependencies** — every dependency is attack surface. If you can write it in 20 lines, don't install a package.
- **Provenance** — npm supports package provenance (build attestation). Enable it for your own packages.

---

## Banned Patterns

- ❌ Hardcoded secrets, API keys, or tokens in source code → environment variables only
- ❌ Tokens in `localStorage` → `HttpOnly; Secure; SameSite=Strict` cookies
- ❌ String concatenation in SQL queries → parameterised queries or ORM query builder
- ❌ `dangerouslySetInnerHTML` without DOMPurify sanitisation → sanitise with explicit allowlist
- ❌ `unsafe-inline` or `unsafe-eval` in CSP → nonce-based CSP
- ❌ User-provided URLs fetched without validation → check protocol, block private ranges (SSRF)
- ❌ User input in shell commands via string interpolation → argument arrays only
- ❌ Stack traces, SQL errors, or internal paths in client responses → generic error messages
- ❌ Passwords, OTPs, tokens, or PII in log output → log IDs and event types, not sensitive values
- ❌ Plain-text OTP stored in database → store SHA-256 hash, compare with timing-safe equality
- ❌ Security checks that fail open (error = allow) → fail closed (error = deny)
- ❌ Dependencies added without review → check maintenance, downloads, vulnerabilities, scope

---

## Quality Gate

Before delivering, verify:

**Secrets & Configuration:**
- [ ] No hardcoded secrets — all in environment variables
- [ ] `.env*` files in `.gitignore`
- [ ] Missing env vars cause startup failure, not silent undefined behaviour

**Authentication & Authorisation:**
- [ ] Tokens stored in `HttpOnly; Secure; SameSite=Strict` cookies
- [ ] Permissions checked in the Server Action / use case, not only in middleware
- [ ] Failed auth or verification returns deny, not a default user
- [ ] OTP hashed before storage, verified with timing-safe comparison

**Input & Output:**
- [ ] All user input validated with schemas at the server boundary
- [ ] No string concatenation in database queries
- [ ] User-provided URLs validated before server-side fetch (SSRF)
- [ ] Untrusted HTML (including AI-generated) sanitised before rendering

**Data Protection:**
- [ ] No sensitive data in logs (passwords, tokens, OTPs, PII)
- [ ] Error responses to clients contain no internal details
- [ ] File uploads validated (size, type, content) and stored in isolated storage

**Infrastructure:**
- [ ] CSP headers configured without `unsafe-inline` / `unsafe-eval`
- [ ] `npm audit` shows no critical or high vulnerabilities
- [ ] Lock file committed, `npm ci` used in CI/CD
- [ ] New dependencies reviewed for maintenance, scope, and trustworthiness

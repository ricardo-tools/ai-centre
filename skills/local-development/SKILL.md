---
name: local-development
description: >
  Principles for local development environments — dev/prod parity, environment variables,
  service fallbacks, seed data, auth bypass, fast feedback loops, and one-command bootstrap.
---

# Local Development

## When to Use

Apply this skill when:

- Setting up or maintaining the local development experience
- Configuring environment variables and service fallbacks
- Building seed data scripts or dev-mode auth bypass
- Ensuring new developers can bootstrap in under 5 minutes
- Trading off dev/prod fidelity against setup friction

## Do NOT use this skill for:

- Production deployment or CI/CD configuration — use deployment-specific skills
- Database schema design — use **database-design**
- Authentication flow design — use **authentication** (this skill covers the dev bypass only)

---

## Core Rules

### 1. Dev/prod parity is the goal.

Run the same database engine, the same framework, and the same runtime locally.
Mocking a Postgres database with SQLite or replacing Redis with an in-memory
object creates bugs you only discover in production.

### 2. Environment variables are the configuration boundary.

All environment-specific values live in `.env.local` (never committed). The
application validates required variables on startup and fails fast with a clear
error message naming the missing variable.

```ts
function validateEnv() {
  const required = ['DATABASE_URL', 'AUTH_SECRET'];
  const optional = { BLOB_TOKEN: 'local filesystem', RESEND_API_KEY: 'console log' };

  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
  }
  for (const [key, fallback] of Object.entries(optional)) {
    if (!process.env[key]) console.warn(`${key} not set — using ${fallback}`);
  }
}
```

### 3. Distinguish required from optional.

Database URL is required — the app cannot start without it. Blob storage token
is optional — the app falls back to local filesystem. Email API key is
optional — the app logs the email to console. Document which variables are
required vs optional and what the fallback behavior is.

### 4. Service fallbacks keep development moving.

When a cloud service isn't configured, degrade gracefully:
- **File storage** → local filesystem directory.
- **Email sending** → log to console / write to a local file.
- **External APIs** → return canned responses if the API key isn't set.
- **Auth** → bypass with a fixed dev user (guarded by `NODE_ENV`).

```ts
const storage: StorageProvider = process.env.BLOB_TOKEN
  ? new BlobStorage(process.env.BLOB_TOKEN)
  : new LocalStorage('./tmp/uploads');

const emailSender: EmailSender = process.env.RESEND_API_KEY
  ? new ResendSender(process.env.RESEND_API_KEY)
  : new ConsoleEmailSender(); // logs to stdout
```

### 5. Seed data is fast, deterministic, and representative.

Running the seed script produces the same dataset every time. It takes under 10
seconds. The data covers all major states and edge cases (empty lists, long
text, special characters, different user roles). Seeds never call external
services.

### 6. Dev bypasses must be production-safe.

Every bypass (auth skip, mock email, local storage) is gated on
`NODE_ENV === 'development'`. A single environment variable flip must be all
that separates dev from prod behavior. The bypass code should still exercise
the same code paths — inject a dev user into the session, not skip the session
check entirely.

### 7. Hot reload is non-negotiable.

Code changes appear in the browser in under 2 seconds. If the feedback loop is
slow, developers will batch changes and miss bugs. Framework HMR handles most
of this — don't break it with custom build steps.

### 8. One command to start.

`npm run dev` (or equivalent) starts everything the developer needs. If the
project requires multiple services (database, queue worker), document the setup
and provide a script or docker-compose that starts them together.

### 9. Database: prefer a real instance over in-memory.

Use a local Postgres/MySQL instance, a Docker container, or a shared dev
database. In-memory databases behave differently enough to cause false
confidence. If using a shared dev database, each developer should use a
separate schema or prefix.

### 10. Document the setup, don't assume it.

The README covers: prerequisites (Node version, database), environment variable
setup (with `.env.example`), seed data, how to run the dev server, and common
troubleshooting. New developers follow the README without asking questions.

---

## Fallback Strategy

| Service | Production | Local fallback | Trigger |
|---|---|---|---|
| Database | Cloud-hosted (Neon, RDS) | Local Postgres or Docker | Different `DATABASE_URL` |
| File storage | Object storage (S3, Blob) | `./tmp/uploads/` directory | Missing storage token |
| Email | Transactional email API | Console log + local file | Missing email API key |
| Auth | Full OTP/OAuth flow | Auto-authenticated dev user | `NODE_ENV === 'development'` |
| External APIs | Live endpoints | Canned/stub responses | Missing API key |

---

## Environment Variable Patterns

- **`.env.example`** committed to repo: lists every variable with placeholder values
  and comments explaining each one. Never contains real secrets.
- **`.env.local`** gitignored: developer's actual values. Copied from `.env.example`.
- **Validation on startup:** application reads variables, checks required ones are
  present, logs which optional ones are missing and what fallback is active.
- **No defaults for secrets:** API keys and database URLs have no default value.
  The app fails if they are missing and required.

---

## Seed Data Principles

- Idempotent: running seeds twice produces the same state (upsert, not insert).
- Fast: under 10 seconds for the full dataset.
- Representative: covers all user roles, content states, and edge cases.
- No network: seeds use local data factories, never fetch from external services.
- Documented: what the seed creates and how to run it.

---

## Banned Patterns

- ❌ Committing `.env.local` or secrets to version control → use `.gitignore`
- ❌ Requiring cloud credentials for local dev → provide fallbacks
- ❌ Seed data that depends on network/external APIs → use local factories
- ❌ Dev bypasses not gated on `NODE_ENV` → guard every bypass
- ❌ More than 5 manual steps before first run → automate with scripts
- ❌ In-memory DB substitutes → use the same engine as production
- ❌ Dev scripts that swallow errors silently → fail fast with clear messages
- ❌ "Works on my machine" configs → make reproducible via `.env.example` + docs

---

## Quality Gate

- [ ] New developer can go from `git clone` to running app in under 5 minutes.
- [ ] `npm run dev` starts the application with no additional manual steps.
- [ ] Required environment variables fail fast with clear error messages on startup.
- [ ] Optional services degrade gracefully when credentials are missing.
- [ ] Seed data runs in under 10 seconds and produces a deterministic dataset.
- [ ] All dev bypasses are gated on `NODE_ENV === 'development'`.
- [ ] `.env.example` documents every variable with descriptions.
- [ ] README covers setup, seeds, dev server, and troubleshooting.

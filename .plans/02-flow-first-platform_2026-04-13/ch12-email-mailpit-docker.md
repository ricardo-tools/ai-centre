# Chapter 12: Email + Mailpit Docker

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapter 2
**User can:** Bootstrap a project with email, run `docker compose up` to start Mailpit, send a test email, and see it in the Mailpit web UI at localhost:8025.

## Goal

Create ref files for email infrastructure: Docker compose with Mailpit, email abstraction layer (Nodemailer for dev, Mailgun HTTP API for prod), and env templates. After this chapter, bootstrapped projects have working local email.

---

## Development Methodology

One chapter = one concern. The chapter's "User can" line is the spec.

```
FOR EACH CHAPTER:

  1. TEST    Write failing tests for what "User can" describes.
             Extend journey test with this chapter's increment.
             Impact table for existing tests (keep/update/new/remove).
             No production code. Ref: flow-tdd skill.
  --------
  GATE 1    Verify:
            [] Impact table present (keep/update/new/remove)
            [] Every layer has a test file
            [] Journey test extended with this chapter's assertions
            [] Tests FAIL

  2. BUILD   Minimum production code + polish.
             Follow the mockups, state spec, and guidelines in this chapter.
             Every code path must log (start, complete, error). Ref: flow-observability skill.
             Code must be small, composable, type-safe. Ref: coding-standards skill.
  --------
  GATE 2    Verify:
            [] Every critical file from this chapter exists
            [] Polish criteria met
            [] Structured logging on every server action and data path

  3. EVAL    Runtime: pages render, APIs respond, no error logs, DB correct.
             Ref: flow-eval-driven skill.
             Fail -> fix and re-eval.

  4. RUN     Run chapter tests + full vitest suite + tsc + build.
             Fail -> fix and re-run.
  --------
  GATE 3    Verify:
            [] All chapter tests GREEN
            [] No regressions

  5. AUDIT   Proportional to what changed (see Audit Scope below).
             Fail -> fix and re-run from step 4.

  6. LOG     Update LOG.md + plan.md status.

COMPACT at every 10 dispatches or phase boundary.
Checkpoint -> .claude/.strategic-context/ -> compact -> re-read plan.
```

### Polish & UX (apply to all work in every chapter)

- Feedback is instant — every action gets visible response within 100ms
- Every state change is animated — enter, leave, move, status change
- Every action gets motion feedback — the user never wonders "did that work?"
- Errors are helpful — show what went wrong, keep the user's work, suggest next step
- Empty states guide — icon + text + action button
- Visual hierarchy — primary (what they're acting on), secondary (metadata), tertiary (system info)
- Microcopy is short — labels are noun phrases, confirmations name the action, errors name the problem

---

## Responsive & Layout

No new UI — ref files live in the skill directory and are copied to user projects by the agent.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. Ref files live in skill directory.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
Bootstrap with email:
  1. Download ref files:
     - docker-compose.yml (Mailpit service)
     - src/lib/email.ts (abstraction: Nodemailer SMTP in dev, Mailgun in prod)
     - .env.local template (SMTP_HOST=localhost, SMTP_PORT=1025, etc.)
  2. User runs: docker compose up -d
  3. Mailpit starts: SMTP on 1025, Web UI on 8025
  4. User's code calls sendEmail({ to, subject, html })
  5. In dev: Nodemailer sends via SMTP to Mailpit
  6. User opens localhost:8025 → sees email in inbox

Production:
  - Same sendEmail() function
  - Detects prod env, uses Mailgun HTTP API instead
  - Env vars: MAILGUN_API_KEY, MAILGUN_DOMAIN
```

---

## Skill Reference Files

All ref files live inside a new `skills/email-mailpit/` skill directory as markdown with copy-paste code blocks, following the standard skill reference pattern (see `skills/playwright-e2e/references/templates.md` for format). The agent reads these references and writes the code to the user's project — it does NOT generate email/docker logic from scratch.

| Ref file | Contains |
|---|---|
| `skills/email-mailpit/SKILL.md` | Behavioral skill — when to use, Mailpit vs Mailgun, dev vs prod routing |
| `skills/email-mailpit/references/templates.md` | Copy-paste templates: docker-compose.yml (Mailpit service), email.ts abstraction, .env.local template |

Templates include:
1. `docker-compose.yml` — Mailpit service (image: axllent/mailpit, ports 1025:1025, 8025:8025)
2. `src/lib/email.ts` — Email abstraction: interface EmailService, MailpitService (Nodemailer SMTP), MailgunService (HTTP API)
3. `.env.local` template — SMTP config for Mailpit (SMTP_HOST=localhost, SMTP_PORT=1025, MAILGUN_API_KEY=, MAILGUN_DOMAIN=)

---

## Edge Cases

- Docker not installed — clear error message, suggest install
- Port 1025/8025 already in use — suggest different ports
- Mailgun creds not set in prod — throw at send time with helpful message
- HTML email rendering — Mailpit shows HTML preview

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Current email impl | `src/platform/lib/email.ts` |
| Docker compose | none (new pattern for bootstrapped projects) |

---

## Wrong Paths

1. **Don't use Nodemailer in production** — Mailgun HTTP API is more reliable on serverless.
2. **Don't require Docker for the main AI Centre app** — only for bootstrapped projects.
3. **Don't send real emails in dev** — always route to Mailpit.
4. **Don't make email a required feature** — optional in bootstrap.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test skill reference content |
| **coding-standards** | Step 2 | Email abstraction design |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test skill reference files exist and contain valid code blocks
- Test docker-compose template includes Mailpit service
- Test email abstraction template compiles
- Journey: email skill ref files are accessible in the skill directory

---

## Critical Files

| File | Change |
|---|---|
| `skills/email-mailpit/SKILL.md` | NEW: behavioral skill — email dev/prod routing, Mailpit usage |
| `skills/email-mailpit/references/templates.md` | NEW: docker-compose.yml, email.ts abstraction, .env.local template |
| `skills/flow/SKILL.md` | MODIFY: bootstrap references email-mailpit skill for email projects |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- N/A (skill reference files only, no new server endpoints)

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Email abstraction template |
| Accessibility | No | No UI |
| Security | Yes | No credentials in template files |
| Observability | No | Skill ref files only |

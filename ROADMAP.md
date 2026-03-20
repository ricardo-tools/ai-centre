# AI Centre — Roadmap

> Track planned work. Tick items as they're completed. Each item includes enough context to start implementation without guessing.

---

## 1. Showcase Gallery

- [ ] Users can upload a standalone HTML file or a ZIP containing a Next.js project
- [ ] AI Centre renders uploaded showcases under a unique URL (e.g. `/showcases/[id]`)
- [ ] Showcase library page — searchable, browsable grid of all user creations
- [ ] Per-user API tokens for programmatic upload (e.g. directly from Claude Code)
- [ ] API token management UI in user profile
- [ ] Rate limiting on upload API endpoints

**Notes:** Requires new DB tables (`showcases`, `api_tokens`). HTML uploads can be served via iframe sandbox. Next.js ZIPs need a build/render strategy (static export or Vercel Blob hosting). Consider size limits and content sanitisation for HTML uploads.

---

## 2. Switch Email Provider to Mailgun

- [ ] Replace Resend SDK with Mailgun SDK for OTP email delivery
- [ ] Update env vars: replace `RESEND_API_KEY` / `RESEND_FROM_EMAIL` with Mailgun equivalents
- [ ] Update `src/lib/email.ts` (single file change — email delivery is already abstracted)
- [ ] Update `PROJECT_REFERENCE.md` external services table
- [ ] Verify domain setup and deliverability

**Notes:** This is a contained change — only `src/lib/email.ts` and env vars need updating. The OTP logic in `src/lib/otp.ts` is provider-agnostic and stays untouched.

---

## 3. Database-Driven Skills (No More Hardcoded Files)

- [ ] Skills fully managed via database + file storage (Vercel Blob for `.md` content)
- [ ] Remove hardcoded skill files from the repo (`skills/*.md`)
- [ ] Build seed script to upload current `skills/*.md` files as initial official skills
- [ ] Skill editor UI at `/skills/[slug]/edit` — edit draft content, preview, publish
- [ ] Version control via existing `skill_versions` table (lifecycle already designed)
- [ ] Skill creation flow — new skills start as drafts, go through publish cycle

**Notes:** The versioning lifecycle logic is already designed in `PROJECT_REFERENCE.md`. The DB schema (`skills`, `skill_versions`) already exists. The main work is: building the editor UI, wiring up server actions, and migrating from file reads to DB reads throughout the app.

---

## 4. Skills Must Include "When to Use" Section

- [ ] All skill `.md` files must contain a "When to Use" section
- [ ] Validate on publish — reject skills missing this section
- [ ] Update existing official skills to include "When to Use" if missing
- [ ] Display "When to Use" prominently on the skill detail page

**Notes:** This is a content + validation rule. Can be enforced in the publish server action with a simple regex/heading check on the markdown content.

---

## 5. Archetype Maintenance + CLAUDE.md Content

- [ ] Archetype editor UI at `/archetypes/[id]/edit`
- [ ] Archetype creation/edit flow: select suggested skills + author CLAUDE.md template content
- [ ] `archetype_versions.content` JSONB extended to include a `claudeMdTemplate` field
- [ ] Generated projects include a CLAUDE.md with real content (not empty), seeded from archetype template + user prompt
- [ ] Archetype versioning (same draft/publish/archive lifecycle as skills)

**Notes:** The `archetype_versions.content` is already JSONB, so adding `claudeMdTemplate` is a schema-compatible change. The generation flow in `src/lib/generate-project-zip.ts` already assembles the ZIP — it just needs to use the template.

---

## 6. Audit Trails

- [ ] Audit log captures all state transitions (already in schema: `audit_log` table)
- [ ] Wire up audit writes in all server actions (skill CRUD, archetype CRUD, publish, archive)
- [ ] Admin audit log viewer UI at `/admin` — filterable by entity, action, user, date range
- [ ] Include metadata diffs (before/after) in audit entries

**Notes:** The `audit_log` table already exists. The main work is: ensuring every server action writes to it, and building the admin viewer.

---

## 7. Skill & Archetype Editor UI

- [ ] Skill editor at `/skills/[slug]/edit` — markdown editor, live preview, save draft, publish
- [ ] Archetype editor at `/archetypes/[id]/edit` — structured form (title, description, skill picker, CLAUDE.md template), save draft, publish
- [ ] Version history view — see past published versions, diff between versions
- [ ] Role-based access: admins can edit official content, members can only edit their own

**Notes:** Blocked by item 3 (database-driven skills) for full functionality. Can be built in parallel if the editor writes to the existing DB schema.

---

## 8. Admin Dashboard

- [ ] Route: `/admin` (admin role required, redirect members away)
- [ ] Audit log viewer (item 6)
- [ ] Manage official skills and archetypes (promote/demote `isOfficial`)
- [ ] User management — view users, change roles
- [ ] Overview stats: total skills, archetypes, generated projects, active users

**Notes:** Depends on items 6 and 7 being at least partially complete. The role check infrastructure already exists (`users.role`).

---

## 9. Rate Limiting

- [ ] Rate limit OTP requests (e.g. max 5 per email per hour)
- [ ] Rate limit showcase upload API (per token)
- [ ] Rate limit project generation (per user per hour)
- [ ] Use Vercel Edge middleware or an in-memory store (e.g. `Map` with TTL) for dev

**Notes:** Keep it simple — start with per-route limits in middleware. Can upgrade to Redis-backed if needed at scale. The OTP already has a 3-attempt limit per token, but no limit on how many tokens can be requested for the same email.

---

## 10. Skill Dependencies (Official Skills Only)

- [ ] Official skills can declare `requires` (other skills that must be included) and `conflicts` (skills that are incompatible)
- [ ] Add `dependencies` JSONB column to `skills` table: `{ requires: string[], conflictsWith: string[] }`
- [ ] Enforce during project generation: warn/block if required skills are missing or conflicting skills are selected together
- [ ] Display dependency info on skill detail page
- [ ] User-created skills are exempt — no dependency validation applied

**Notes:** Only applies to official skills (`isOfficial = true`). User-created skills can conflict freely. Dependency references should use skill UUIDs (consistent with `suggestedSkillIds` on archetypes).

---

## 11. Usage Analytics

- [ ] Track skill downloads (count per skill)
- [ ] Track archetype usage in project generation
- [ ] Track project generation counts (per user, per archetype)
- [ ] Surface popular skills and archetypes on browse pages (sort by popularity)
- [ ] Admin dashboard stats panel (item 8)

**Notes:** Can start with simple counter columns or a lightweight `analytics_events` table. Avoid over-engineering — counts and timestamps are enough to start.

---

## Priority Order (Suggested)

| Priority | Item | Rationale |
|---|---|---|
| 1 | 3 — Database-driven skills | Unblocks items 4, 7, 10 |
| 2 | 7 — Editor UI | Unblocks content management for everything |
| 3 | 5 — Archetype maintenance | Needed for meaningful project generation |
| 4 | 4 — "When to Use" section | Quick win once editor exists |
| 5 | 6 — Audit trails | Wire into all actions while building them |
| 6 | 8 — Admin dashboard | Brings together audit + management |
| 7 | 2 — Mailgun migration | Contained, can be done anytime |
| 8 | 1 — Showcase gallery | Largest new feature, most standalone |
| 9 | 10 — Skill dependencies | Nice-to-have, only for official skills |
| 10 | 9 — Rate limiting | Important before going live, not urgent in dev |
| 11 | 11 — Usage analytics | Valuable but not blocking anything |

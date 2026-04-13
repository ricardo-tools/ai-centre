# Chapter 5: Skill Publishing

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapter 0
**User can:** Run `flow-skills publish` in their editor, provide a commit message, and see the skill appear in the AI Centre web library under their name.

## Goal

Build the skill publishing pipeline — API endpoint for uploading skill content with versioning, quota enforcement, and the Flow CLI command. After this chapter, users can contribute skills to the platform from their editor.

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

Community skills appear in the existing skill library grid. Badge styling differentiates community from official skills.

---

## Widget Decomposition

No new widgets. Existing skill library components gain a "Community" badge variant.

---

## ASCII Mockup

```
┌─────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐        │
│  │ Official │  │Community │        │
│  │ Skill    │  │ Skill    │        │
│  │          │  │          │        │
│  │          │  │ by @user │        │
│  │          │  │ Community│ badge  │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

---

## State Spec

N/A — server-side changes only. Skill library page re-fetches on load.

---

## Data Flow

```
flow-skills publish command:
  1. Read .flow/credentials.json for auth token
  2. Read skill file from current project
  3. Parse skill frontmatter (name, description, category)
  4. Prompt user for commit message
  5. POST {AI_CENTRE_URL}/api/skills/publish
     Authorization: Bearer {token}
     Body: { slug, name, description, content, commitMessage }
  6. Server:
     a. Validate auth + quota (skill_limit from user_quotas)
     b. Check if skill exists for this user:
        - New: create skill row + version 1
        - Existing: create next version
     c. Store content in skill_versions table
     d. Return { slug, version, publishedAt }
  7. Confirm to user: "Published {name} v{version}"

Web library:
  - Community skills appear alongside official skills
  - Badge: "Community" vs "Official"
  - Author name shown on community skills
```

## DB Changes

New `community_skills` table: id, slug (unique per user), user_id, name, description, category, created_at, updated_at. New `skill_versions` table: id, skill_id (FK to community_skills), version_number, content (text), commit_message, checksum, created_at.

---

## Edge Cases

- Quota exceeded — return 429 with clear message including current usage
- Duplicate slug from different users — slug is unique per user_id, not globally
- Empty skill content — reject with validation error
- Very large skill file (>100KB) — reject with size limit error
- Invalid frontmatter — reject with parsing error details
- Network failure mid-publish — no partial state (transaction)

---

## Focus Management

N/A — no interactive UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Skill parsing | `src/platform/lib/parse-skill.ts` |
| Permission guards | `src/platform/lib/guards.ts` |
| Skill library UI | `src/features/skill-library/` |

---

## Wrong Paths

1. **Don't store skill content in blob storage** — text content belongs in the DB for versioning.
2. **Don't auto-approve community skills** — they publish immediately (no review workflow).
3. **Don't mix community and official skill tables** — separate concerns.
4. **Don't allow publishing without auth** — all publish endpoints require OAuth token.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test publish API, quota enforcement, version creation |
| **coding-standards** | Step 2 | API route structure, validation |
| **flow-observability** | Step 2 | Log publish events with user, skill, version |

---

## Test Hints

| Element | data-testid |
|---|---|
| Community badge | `skill-badge-community` |

- Test publish creates skill + version 1
- Test republish creates version 2
- Test quota enforcement rejects at limit
- Test slug uniqueness per user
- Test version history returns ordered versions
- Journey: user publishes a skill, it appears in the catalog

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/db/schema.ts` | MODIFY: add community_skills, skill_versions tables |
| `src/platform/db/migrations/0013_add_community_skills.sql` | NEW: CREATE TABLE |
| `src/app/api/skills/publish/route.ts` | NEW: publish endpoint |
| `src/app/api/skills/[slug]/versions/route.ts` | NEW: version history endpoint |
| `src/features/skill-library/` | MODIFY: show community skills with badge |
| `skills/flow/SKILL.md` | MODIFY: add flow-skills publish command |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Authenticated user can publish a skill
- Published skill appears in catalog with "community" badge
- Version history shows commit messages
- Quota enforcement rejects when limit reached

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | API routes, DB queries |
| Accessibility | Yes | Community badge has screen reader text |
| Security | Yes | Auth required, quota enforcement, input validation |
| Observability | Yes | Publish events logged |

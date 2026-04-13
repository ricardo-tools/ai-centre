# Chapter 8: Showcase Publishing

**Status:** Not started
**Tier:** New Capability
**Depends on:** Chapter 0
**User can:** Run `flow-showcase publish`, provide a commit message, and see the showcase appear in the gallery with auto-detected skills.

## Goal

Build the showcase publishing pipeline from the CLI. New `showcase_versions` table for version tracking. API endpoint accepts HTML/ZIP upload with commit message. Flow command reads project output, auto-detects skills from `.flow/project.json`, publishes to the gallery. Creates new showcase or adds a version to existing one.

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

No new UI — changes are in the API route and server actions only. Gallery already renders showcases.

---

## Widget Decomposition

No widget changes.

---

## ASCII Mockup

N/A — no UI changes. The publish happens from the CLI; the showcase appears in the existing gallery.

---

## State Spec

N/A — no client state changes in this chapter.

---

## Data Flow

```
flow-showcase publish command:
  1. Read auth token from .flow/credentials.json
  2. Detect output type:
     - Single HTML file -> read content
     - Project directory -> zip it
  3. Read .flow/project.json for skill associations
  4. Prompt for title (first time) and commit message
  5. POST {AI_CENTRE_URL}/api/showcases/publish
     Authorization: Bearer {token}
     Body: FormData { file, title, description, commitMessage, skillSlugs[], projectId }
  6. Server:
     a. Validate auth
     b. Check if showcase exists for this projectId + userId
        - New: create showcase_uploads row + version 1
        - Existing: create next version, trigger re-deploy for ZIPs
     c. Upload file to Vercel Blob
     d. Create showcase_versions row
     e. Trigger deploy for ZIPs (reuse existing pipeline via after())
     f. Return { showcaseId, version, url }
  7. Confirm: "Published {title} v{version}"
```

---

## Edge Cases

- First publish (no existing showcase) — creates showcase + version 1
- Re-publish same project — creates next version
- ZIP deploy fails — showcase still visible, deploy retried via existing pipeline
- Very large file (>50MB) — reject with size limit
- Project has no .flow/project.json — allow publish without skill associations

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Showcase upload | `src/features/showcase-gallery/action.ts` |
| Deploy pipeline | `src/features/showcase-gallery/deploy.ts` |
| Blob storage | existing Vercel Blob patterns |

---

## Wrong Paths

1. **Don't duplicate the deploy pipeline** — reuse existing triggerDeploy.
2. **Don't require .flow/project.json** — it's optional for skill association.
3. **Don't version via separate blob URLs per version** — each version gets its own blob.
4. **Don't block on deploy** — fire via after(), return immediately.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test publish creates showcase + version |
| **coding-standards** | Step 2 | API route structure |
| **flow-observability** | Step 2 | Log publish events |

---

## DB Changes

New `showcase_versions` table: id, showcase_id (FK to showcase_uploads), version_number, blob_url, commit_message, created_at.

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test first publish creates showcase + version 1
- Test re-publish creates version 2
- Test skill associations stored correctly
- Test file upload to blob
- Journey: user publishes a showcase, it appears in gallery

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/db/schema.ts` | MODIFY: add showcase_versions table |
| `src/platform/db/migrations/0014_add_showcase_versions.sql` | NEW: CREATE TABLE |
| `src/app/api/showcases/publish/route.ts` | NEW: publish endpoint |
| `src/features/showcase-gallery/action.ts` | MODIFY: create version on upload |
| `skills/flow/SKILL.md` | MODIFY: add flow-showcase publish command |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Publish endpoint creates showcase with version
- Re-publish creates new version
- Showcase appears in gallery listing

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Publish route, version logic |
| Accessibility | No | No UI changes |
| Security | Yes | Auth required, file validation |
| Observability | Yes | Publish events logged |

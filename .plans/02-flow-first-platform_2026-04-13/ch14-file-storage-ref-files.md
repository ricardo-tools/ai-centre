# Chapter 14: File Storage Ref Files

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 2
**User can:** Bootstrap a project with file storage, upload a file locally (to `public/uploads/`) and to Vercel Blob in prod.

## Goal

Create ref files for file storage with local filesystem fallback. Same pattern as AI Centre: Vercel Blob in prod, `public/uploads/` locally. After this chapter, bootstrapped projects have working file upload.

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
Bootstrap with file storage:
  1. Download ref files:
     - src/lib/storage.ts (abstraction: local fs in dev, Vercel Blob in prod)
     - src/app/api/upload/route.ts (upload API route template)
     - .env.local addition (BLOB_READ_WRITE_TOKEN=)
  2. In dev: files saved to public/uploads/
  3. In prod: files uploaded to Vercel Blob

Storage abstraction:
  uploadFile(name, data, options) → { url: string }
  deleteFile(url) → void
  Dev: write to public/uploads/{name}, return /uploads/{name}
  Prod: put to Vercel Blob, return blob URL
```

---

## Skill Reference Files

All ref files live inside a new `skills/file-storage-vercel/` skill directory as markdown with copy-paste code blocks, following the standard skill reference pattern. The agent reads these references and writes the code to the user's project — it does NOT generate storage logic from scratch.

| Ref file | Contains |
|---|---|
| `skills/file-storage-vercel/SKILL.md` | Behavioral skill — local vs prod routing, Vercel Blob patterns, security |
| `skills/file-storage-vercel/references/templates.md` | Copy-paste templates: storage.ts abstraction, upload route |

Templates include:
1. `src/lib/storage.ts` — Storage abstraction (local + Vercel Blob)
2. `src/app/api/upload/route.ts` — Upload API route with size/type validation

---

## Edge Cases

- BLOB_READ_WRITE_TOKEN not set in prod — throw with clear message
- public/uploads/ doesn't exist — create on first upload
- File too large — configurable limit in ref template
- Unsupported content type — configurable allowlist

---

## Focus Management

N/A — no UI changes.

---

## Must Use

| Pattern | File to read |
|---|---|
| Current blob pattern | look for Vercel Blob usage in codebase |
| Upload handling | `src/features/showcase-gallery/action.ts` |

---

## Wrong Paths

1. **Don't use S3** — Vercel Blob is simpler for Vercel-deployed apps.
2. **Don't serve uploaded files through an API route locally** — use public/ directory for static serving.
3. **Don't store file metadata in ref template** — that's app-specific.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test skill reference content |
| **coding-standards** | Step 2 | Storage abstraction |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No new UI elements |

- Test skill reference files exist and contain valid code blocks
- Test storage template has both local and blob paths
- Journey: storage skill ref files are accessible in the skill directory

---

## Critical Files

| File | Change |
|---|---|
| `skills/file-storage-vercel/SKILL.md` | NEW: behavioral skill — local/prod file storage routing |
| `skills/file-storage-vercel/references/templates.md` | NEW: storage.ts abstraction, upload route |
| `skills/flow/SKILL.md` | MODIFY: bootstrap references file-storage-vercel skill |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- N/A (skill reference files only, no new server endpoints)

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Storage abstraction template |
| Accessibility | No | No UI |
| Security | Yes | File validation, no path traversal |
| Observability | No | Skill ref files only |

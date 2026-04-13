# Chapter 3: RAG Skill Matching

**Status:** Not started
**Tier:** Extension
**Depends on:** Chapter 2
**User can:** Run `flow-bootstrap`, describe their project in natural language, and get AI-recommended skills ranked by relevance.

## Goal

Add semantic skill matching to the bootstrap flow. Precompute embeddings for all skills, store in DB, load into memory at query time, compute cosine similarity. After this chapter, bootstrap recommends relevant skills based on the project description instead of showing a flat list.

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

No UI in this chapter — server-side search endpoint and CLI-side skill integration only.

---

## Widget Decomposition

No widgets in this chapter.

---

## ASCII Mockup

CLI interaction flow (in Claude Code, showing the changed bootstrap experience):

```
User: /flow-bootstrap

Flow: What are you building?

User: A credit application dashboard with approval workflows

Flow: Based on your description, here are the recommended skills:

  Recommended (high relevance)
  [x] clean-architecture  0.92  Domain-driven design
  [x] flow-tdd            0.88  Test-driven development
  [x] design-system       0.85  Component library patterns

  Related (moderate relevance)
  [ ] flow-observability   0.71  Structured logging
  [ ] coding-standards     0.68  Code quality patterns

  All other skills (32 more)
  [ ] Show all...

  Selected: 3 skills (recommended)
```

---

## State Spec

N/A — no client state. Search results are ephemeral within the bootstrap conversation.

---

## Data Flow

```
Embedding generation (at seed/publish time):
  1. For each skill, concatenate: name + description + when-to-use + when-not-to-use + purpose
  2. Call Claude API: POST /v1/messages with embed intent
     (Use Anthropic's embedding model or fall back to generating embeddings via prompt)
  3. Store in skill_embeddings table: skill_id, embedding (serialized float[]), updated_at

Skill search (at bootstrap time):
  User describes project -> flow-bootstrap calls:
  POST {AI_CENTRE_URL}/api/skills/search { query: "credit application dashboard" }
  Server:
    1. Load all skill_embeddings into memory (~60 rows, microseconds)
    2. Embed the query using same model
    3. Compute cosine similarity for each skill
    4. Return top-N ranked: [{ slug, name, description, score }]
  Bootstrap presents ranked recommendations
```

**DB:** New `skill_embeddings` table: skill_id (FK, unique), embedding (text — JSON-serialized float array), model (text — embedding model identifier), updated_at.

---

## Edge Cases

- ANTHROPIC_API_KEY not set — skip embedding generation, fall back to keyword matching
- Skill has no metadata — skip embedding, exclude from search
- All scores below threshold — show "no strong matches found", fall back to catalog
- Embedding model changes — re-generate all embeddings (migration helper)
- Concurrent seed/publish — last write wins (acceptable for 60 skills)
- Empty query string — return empty results, don't error

---

## Focus Management

N/A — no web UI.

---

## Must Use

| Pattern | File to read |
|---|---|
| Skill metadata | `src/platform/lib/skills.ts` |
| Claude API | existing Anthropic SDK usage |
| Seed script | `src/platform/db/seed.ts` |

---

## Wrong Paths

1. **Don't use pgvector** — 60 skills is too small, in-memory cosine is microseconds.
2. **Don't embed full skill content** — metadata fields only (name, description, when-to-use, purpose).
3. **Don't call the embedding API at query time for skills** — precompute and cache in DB.
4. **Don't return all skills** — return top-N with scores above a threshold.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test cosine similarity, search ranking, threshold filtering |
| **coding-standards** | Step 2 | Small embedding module, pure functions |
| **flow-observability** | Step 2 | Log search queries with result count and top score |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No web UI elements |

- Test cosine similarity function with known vectors
- Test search endpoint returns ranked results
- Test threshold filtering excludes low-score matches
- Test embedding generation produces correct dimension
- Test fallback to keyword matching when no API key
- Journey: search for "dashboard" returns relevant skills ranked by score

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/db/schema.ts` | MODIFY: add skill_embeddings table |
| `src/platform/db/migrations/0012_add_skill_embeddings.sql` | NEW: CREATE TABLE |
| `src/app/api/skills/search/route.ts` | NEW: semantic search endpoint |
| `src/platform/lib/embeddings.ts` | NEW: embedding generation + cosine similarity |
| `src/platform/db/seed.ts` | MODIFY: generate embeddings during seed |
| `skills/flow/SKILL.md` | MODIFY: bootstrap uses search API for recommendations |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Search endpoint returns ranked skill matches for a query
- Results include scores above threshold
- Empty query returns empty results

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | `embeddings.ts` — pure functions, typed |
| Accessibility | No | No UI |
| Security | Yes | Search input sanitization, rate limiting |
| Observability | Yes | Search queries logged with latency |

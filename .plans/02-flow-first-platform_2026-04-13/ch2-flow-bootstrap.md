# Chapter 2: Flow Bootstrap

**Status:** Done
**Tier:** New Capability
**Depends on:** Chapter 0
**User can:** Run `flow-bootstrap` in a new or existing directory. Flow asks what they're building, presents skills to choose from, downloads selected skills, creates `.flow/project.json` and `CLAUDE.md`.

## Goal

Rewrite the core Flow skill with the bootstrap command. This is the primary user entry point — conversational project setup that detects environment, presents skills, and scaffolds the project. Manual skill selection only (RAG in Ch 3). After this chapter, users can bootstrap any project with Flow.

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

No web UI in this chapter — changes are API endpoints and CLI-side skill commands only.

---

## Widget Decomposition

No widgets in this chapter.

---

## ASCII Mockup

CLI interaction flow (in Claude Code):

```
User: /flow-bootstrap

Flow: What are you building? Describe your project in a sentence or two.

User: A credit application dashboard with approval workflows

Flow: Got it. Here are the available skills grouped by category:

  Coding (12 skills)
  [ ] coding-standards    Code quality patterns
  [x] clean-architecture  Domain-driven design
  [x] flow-tdd            Test-driven development
  [ ] ...

  Design (8 skills)
  [x] design-system       Component library patterns
  [ ] ...

  Selected: 3 skills

Flow: Downloading 3 skills...
  [=] clean-architecture  v2  OK
  [=] flow-tdd            v1  OK
  [=] design-system       v3  OK

Flow: Project bootstrapped!
  .flow/project.json  created
  CLAUDE.md           created (3 skills included)
  .gitignore          updated (added .flow/credentials.json)
```

---

## State Spec

N/A — no client state. Project state lives in `.flow/project.json` on the user's machine:

```typescript
interface FlowProject {
  id: string;          // UUID
  name: string;        // from user description
  description: string; // user's project description
  mode: 'claude-code' | 'claude-chat';
  skills: Array<{
    slug: string;
    version: number;
    checksum: string;
    forked: boolean;   // true if user has modified the skill locally
  }>;
  createdAt: string;   // ISO date
  updatedAt: string;   // ISO date
}
```

---

## Data Flow

```
User runs flow-bootstrap:
  1. Check .flow/project.json exists -> if yes, ask "update existing project?"
  2. Check platform: Claude Code (has tool use) vs Claude Chat (text only)
  3. Conversation: "What are you building?"
  4. Based on response, detect project type (web app, API, content, presentation, etc.)
  5. Fetch skill catalog: GET {AI_CENTRE_URL}/api/skills/catalog
     -> Returns: [{ slug, name, description, category, tags }]
  6. Present skills grouped by category
  7. User selects skills
  8. Download each skill: GET {AI_CENTRE_URL}/api/skills/{slug}/content
     -> Returns: { content: string, version: number, checksum: string }
  9. Create .flow/ directory structure:
     .flow/
       project.json    -- { id, name, description, mode, skills, createdAt }
       credentials.json -- (from Ch 0, gitignored)
       plans/          -- empty, for future plans
  10. Write skills to .claude/skills/{slug}/SKILL.md (standard Claude Code skills directory)
  11. Generate CLAUDE.md from selected skills
  12. Add .flow/credentials.json to .gitignore
```

**API endpoints needed:**

- `GET /api/skills/catalog` — returns all published skills with metadata (no content)
- `GET /api/skills/:slug/content` — returns skill content + version + checksum (requires auth)

---

## Edge Cases

- No internet during bootstrap — clear error, no partial state
- Existing .flow/project.json — ask to update, preserve credentials
- Claude Chat (no tool use) — give text recommendations instead of downloading
- Empty skill catalog — warn user, allow proceeding with no skills
- Skill download fails mid-way — rollback all downloaded skills, clean state
- Skill slug contains path traversal characters — reject with error

---

## Focus Management

N/A — no web UI.

---

## Must Use

| Pattern | File to read |
|---|---|
| Skill metadata | `src/platform/lib/skills.ts` |
| Skill parsing | `src/platform/lib/parse-skill.ts` |
| Auth middleware | `src/platform/lib/auth-edge.ts` |

---

## Wrong Paths

1. **Don't bundle all skills into the download** — download only selected ones.
2. **Don't hardcode skill categories** — read from the catalog API.
3. **Don't make bootstrap destructive** — detect existing project and offer update path.
4. **Don't skip .gitignore** — credentials.json must never be committed.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test catalog API, content download, project.json generation |
| **coding-standards** | Step 2 | Clean skill rewrite |
| **flow-observability** | Step 2 | Log bootstrap events: start, skills selected, complete |

---

## Test Hints

| Element | data-testid |
|---|---|
| N/A | No web UI elements |

- Test GET /api/skills/catalog returns skill list with metadata
- Test GET /api/skills/:slug/content returns content + checksum
- Test content endpoint requires auth
- Test catalog filters by published status
- Test slug validation rejects path traversal
- Journey: authenticated user can download skill catalog and individual skills

---

## Critical Files

| File | Change |
|---|---|
| `src/app/api/skills/catalog/route.ts` | NEW: skill catalog endpoint |
| `src/app/api/skills/[slug]/content/route.ts` | NEW: skill content download |
| `skills/flow/SKILL.md` | MODIFY: add flow-bootstrap command |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Skill catalog endpoint returns published skills
- Skill content endpoint returns content with version and checksum
- Content endpoint requires authentication

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | API routes, skill content serving |
| Accessibility | No | No web UI changes |
| Security | Yes | Auth required for content download, no path traversal in slug |
| Observability | Yes | Download events logged |

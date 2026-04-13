# Chapter 1: Workspace Admin Quotas

**Status:** Done
**Tier:** New Capability
**Depends on:** Chapter 0
**User can:** Open the admin dashboard "Workspaces" tab, see per-user quota usage (skills published, databases, storage), and adjust limits.

## Goal

Create the workspace quota system and admin UI. After this chapter, admins can see all users' resource usage and adjust their limits. This is the foundation for all subsequent quota enforcement (skill publishing, Turso DBs, etc.).

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

- **LG (1024+):** Full table with all columns visible
- **MD (768-1023):** Table with horizontal scroll
- **SM (640-767):** Card layout — one card per user, stacked quota bars
- **XS (0-639):** Same as SM with tighter spacing

---

## Widget Decomposition

- `WorkspaceListWidget` (LG) — Admin table of all users with quotas. Columns: user, skills (used/limit), databases (used/limit), storage (used/limit), actions.
- `QuotaBarWidget` (XS) — Horizontal bar showing used/limit with colour coding (green <50%, amber <80%, red >=80%).
- `QuotaEditDialog` — Modal to adjust a user's limits.

---

## ASCII Mockup

```
+-- Admin Dashboard --------------------------------------------------------+
|  [Users] [Showcases] [Workspaces] [Audit]                                |
|                                                                           |
|  User Workspaces                                                          |
|  +----------------------------------------------------------------------+ |
|  | User          | Skills    | DBs     | Storage       |                | |
|  +----------------------------------------------------------------------+ |
|  | alice@ezy...  | ====.. 3/10 | =. 1/2  | ===.. 24/100M | [Edit]     | |
|  | bob@ezy...    | =.... 1/10  | .. 0/2  | =.... 5/100M  | [Edit]     | |
|  | carol@ezy...  | ====  8/10  | == 2/2  | ====  89/100M | [Edit]     | |
|  +----------------------------------------------------------------------+ |
|                                                                           |
|  Edit Quotas (modal):                                                     |
|  +-------------------------------+                                        |
|  | carol@ezycollect.com.au       |                                        |
|  |                               |                                        |
|  | Skill limit:   [10]           |                                        |
|  | Schema limit:  [ 2]           |                                        |
|  | Storage (MB):  [100]          |                                        |
|  |                               |                                        |
|  | [Cancel]  [Save Changes]      |                                        |
|  +-------------------------------+                                        |
+---------------------------------------------------------------------------+
```

---

## State Spec

```typescript
// WorkspaceListWidget state
interface WorkspaceListState {
  workspaces: WorkspaceQuota[];
  loading: boolean;
  error: string | null;
  editingUserId: string | null;  // null = dialog closed
}

interface WorkspaceQuota {
  userId: string;
  email: string;
  name: string | null;
  quotas: {
    skillLimit: number;
    skillsUsed: number;
    schemaLimit: number;
    schemasUsed: number;
    storageLimitBytes: number;
    storageUsedBytes: number;
  };
}
```

---

## Data Flow

```
Admin opens /admin -> Workspaces tab
  -> GET /api/workspace/all (admin only)
  -> Returns: [{ userId, email, name, quotas: { skillLimit, skillsUsed, schemaLimit, schemasUsed, storageLimitBytes, storageUsedBytes } }]
  -> Renders table with usage bars and editable limits

Admin adjusts a limit:
  -> POST /api/workspace/{userId}/quotas { skillLimit?, schemaLimit?, storageLimitBytes? }
  -> Updates user_quotas row
  -> Returns updated quotas
  -> UI refreshes

User calls GET /api/workspace (authenticated via OAuth):
  -> Returns their own quotas and usage
```

**DB:** New `user_quotas` table: user_id (FK to users, unique), skill_limit (default 10), schema_limit (default 2), storage_limit_bytes (default 100MB), created_at, updated_at. Usage is computed from existing tables (count skills by user, count user_databases, sum blob sizes).

---

## Edge Cases

- User has no quotas row — create with defaults on first API call
- Admin sets limit below current usage — allow it (soft limit), show warning
- Division by zero in quota bar — handle 0 limit gracefully
- User not found — 404
- No users in the system — empty state with guidance message

---

## Focus Management

- Tab key cycles through table rows and action buttons
- Edit dialog traps focus until closed
- Escape closes the edit dialog
- After saving, focus returns to the edit button for that row

---

## Must Use

| Pattern | File to read |
|---|---|
| Admin layout | `src/app/admin/` existing pages |
| Permission guards | `src/platform/lib/guards.ts` |
| Result pattern | `src/platform/lib/result.ts` |

---

## Wrong Paths

1. **Don't enforce hard limits in this chapter** — just display. Enforcement comes when publish/provision chapters are built.
2. **Don't compute usage in the client** — server computes and returns usage alongside limits.
3. **Don't add quota columns directly to the users table** — separate table keeps concerns clean.
4. **Don't build a custom table component** — use semantic HTML table with styling.

---

## Applied Skills

| Skill | Read before | How it applies |
|---|---|---|
| **flow-tdd** | Step 1 | Test quota API responses, admin permission guard |
| **coding-standards** | Step 2 | Widget structure, typed props |
| **flow-observability** | Step 2 | Log quota changes with before/after values |

---

## Test Hints

| Element | data-testid |
|---|---|
| Workspace table | `workspace-list` |
| Quota bar | `quota-bar-{type}` |
| Edit button | `edit-quotas-{userId}` |
| Edit dialog | `quota-edit-dialog` |
| Save button | `quota-save` |

- Test GET /api/workspace returns user's own quotas
- Test GET /api/workspace/all requires admin role
- Test POST quota update persists and returns updated values
- Test default quotas created for new users
- Journey: admin can view and edit user quotas

---

## Critical Files

| File | Change |
|---|---|
| `src/platform/db/schema.ts` | MODIFY: add user_quotas table |
| `src/platform/db/migrations/0011_add_user_quotas.sql` | NEW: CREATE TABLE |
| `src/app/api/workspace/route.ts` | NEW: GET own workspace |
| `src/app/api/workspace/all/route.ts` | NEW: GET all workspaces (admin) |
| `src/app/api/workspace/[userId]/quotas/route.ts` | NEW: POST update quotas |
| `src/features/workspace/WorkspaceListWidget.tsx` | NEW: admin workspace table |
| `src/features/workspace/QuotaBarWidget.tsx` | NEW: usage bar component |
| `src/features/workspace/QuotaEditDialog.tsx` | NEW: edit modal |
| `src/app/admin/workspaces/page.tsx` | NEW: admin workspaces page |

---

## Journey Test Increment

**Spec file:** `src/tests/e2e/journey-flow-platform.spec.ts`

This chapter adds:
- Admin can fetch all workspace quotas
- Admin can update a user's skill limit
- User can fetch their own quotas

---

## Audit Scope

| Audit | Applies | Focus |
|---|---|---|
| Code quality | Yes | Widget structure, API routes |
| Accessibility | Yes | Table semantics, quota bar has aria-label with usage text |
| Security | Yes | Admin-only guards on all and update endpoints |
| Observability | Yes | Quota changes logged with before/after values |

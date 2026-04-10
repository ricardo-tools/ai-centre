---
name: clean-architecture
description: >
  Defines the project's structural architecture: platform vs features, domain objects,
  use cases, repositories, mappers, and cross-cutting concerns. Apply this skill when
  creating new features, adding server actions, defining domain objects, writing data
  access logic, or deciding where code should live in the folder structure.
---

# Clean Architecture

The project is structured around use cases, not technical layers. Code is organised by what the app does (features), supported by shared infrastructure (platform). Every feature is a vertical slice — independently buildable, independently deletable.

---

## When to Use

Apply this skill when:
- Creating a new feature or use case
- Adding or modifying a server action
- Creating or modifying domain objects (entities, value objects)
- Writing data access logic (queries, mutations, repository functions)
- Adding mappers between external data and domain objects
- Deciding where a new file should live in the folder structure
- Adding cross-cutting behaviour (auth checks, audit logging, validation)

Do NOT use this skill for:
- UI component structure, styling, or grid layout — see **frontend-architecture**
- Shell layout, navigation, or responsive breakpoints — see **app-layout**
- Colour tokens, typography, or theming — see **brand-design-system**

---

## Core Rules

For implementation patterns (retry, caching, error translation), see **backend-patterns**.

### 1. Features are vertical slices, platform is horizontal

**Features** contain everything needed for one use case: action, use case logic, validation, widgets, data hooks. **Platform** contains shared infrastructure used across features: components, shell, auth, database, domain objects.

Why: A feature should be deletable without breaking anything else. If deleting a feature folder causes imports to fail elsewhere, something is in the wrong place.

### 2. Features never import from other features

A feature imports from platform. Never from another feature. If two features need the same thing, extract it to platform.

Why: Feature independence. If feature A imports from feature B, deleting or refactoring B breaks A. Features communicate indirectly — through shared domain objects in platform, or through Next.js mechanisms like `revalidatePath`.

### 3. Server Actions are controllers — thin adapters only

A Server Action validates input, resolves the use case, executes it, and returns the result. It contains no business logic.

```ts
// ✅ CORRECT — thin controller, pattern-matches on Result
'use server';
export async function publishSkill(input: unknown) {
  const session = await getSession();
  if (!session) return { success: false, error: 'Unauthorized' };

  const { skillId } = PublishSkillSchema.parse(input);
  const result = await publishSkillUseCase(skillId, session.userId);

  if (!result.ok) {
    console.error(result.error.stack);  // log stack trace for debugging
    return { success: false, error: result.error.message };
  }

  revalidatePath('/skills');
  return { success: true, version: result.value.version };
}

// ❌ WRONG — business logic in the action
'use server';
export async function publishSkill(skillId: string) {
  const skill = await db.query.skills.findFirst({ where: eq(skills.id, skillId) });
  if (skill.currentDraftVersionId === null) throw new Error('No draft');
  await db.update(skillVersions).set({ status: 'published', publishedAt: new Date() });
  await db.update(skills).set({ currentPublishedVersionId: skill.currentDraftVersionId });
  // 20 more lines of orchestration...
}
```

### 4. Domain objects are rich, not anemic

Domain entities enforce their own invariants through intention-revealing methods. State changes happen through methods, not direct property assignment. If a domain object exists, it is valid.

Domain methods return `Result` for expected failures — they don't throw. This keeps errors in the type signature and composable. Error values are `Error` subclasses so they carry stack traces for debugging.

```ts
// ✅ CORRECT — rich domain object, returns Result
class Skill {
  publish(publishedById: string): Result<SkillVersion, NoDraftError> {
    if (!this.currentDraft) return Err(new NoDraftError(this.id));
    return Ok(this.currentDraft.markPublished(publishedById));
  }
}

// ❌ WRONG — anemic, logic lives elsewhere
skill.status = 'published'; // anyone can set this to anything
skill.publishedAt = new Date(); // no validation
```

### 5. Mappers live at boundaries, protect the domain

External data shapes (DB rows, API responses) never leak into domain objects or UI. A mapper sits at the boundary and converts between shapes. When an external shape changes, only the mapper changes.

```ts
// ✅ Mapper converts DB row → domain object
export function toSkill(row: SkillRow): Skill {
  return new Skill(row.id, row.slug, row.title, /* ... */);
}

// ❌ Passing raw DB rows into widgets
const skill = await db.query.skills.findFirst({ ... });
return <SkillCard skill={skill} />;  // widget now coupled to DB schema
```

### 6. Use cases own the orchestration

A use case coordinates the steps needed to fulfil a business operation: validate inputs, load domain objects, call domain methods, persist changes, trigger side effects (audit log, cache invalidation, external calls).

Use cases return `Result` for expected failures. Error values are `Error` subclasses carrying stack traces. No try/catch for control flow.

```ts
// features/publish-skill/use-case.ts
export async function publishSkillUseCase(
  skillId: string, userId: string,
): Promise<Result<SkillVersion, NotFoundError | NoDraftError>> {
  const skill = await skillRepo.findById(skillId);
  if (!skill) return Err(new NotFoundError('Skill', skillId));

  const published = skill.publish(userId);
  if (!published.ok) return published;  // propagate domain error

  await skillRepo.saveVersion(published.value);
  await auditRepo.log('skill', skillId, 'published', userId);
  await generateShowcaseHtml(skill);

  return published;
}
```

### 7. Data hooks are presenters

Widget data hooks (`use*.ts`) transform domain objects into view models — the exact shape the component needs to render. The component receives a flat object and renders it. Zero business logic in the component.

**Two data flow models coexist in Next.js:** Server Components fetch data via use cases on the server and pass domain objects as props. Client Components (interactive widgets) fetch via data hooks when they need client-side reactivity (search, filters, real-time updates). Both are valid — they serve different rendering models. The hook is still a presenter in both cases: it transforms domain data into a view model.

```ts
// ✅ Hook returns a view model
function useSkillDetail(slug: string) {
  const skill = useFetchSkill(slug);
  return {
    title: skill.title,
    versionLabel: `v${skill.currentVersion}`,
    isPublished: skill.status === 'published',
    publishedDate: formatDate(skill.publishedAt),
    canEdit: skill.authorId === currentUserId,
  };
}

// ❌ Component derives display logic from raw domain data
function SkillDetail({ skill }: { skill: Skill }) {
  const label = `v${skill.currentVersion}`;  // presentation logic in component
}
```

---

## Project Structure

```
src/
  app/                          ← Next.js routing (thin wiring only)
    layout.tsx                  ← imports shell from platform
    page.tsx                    ← imports from features
    api/                        ← API routes (external-facing only)

  platform/                     ← shared, stable, horizontal
    components/                 ← stateless UI primitives (Button, Card, Modal)
    shell/                      ← TopNav, Sidebar, AppShell layout
    styles/                     ← globals.css, theme tokens
    auth/                       ← session, middleware helpers, OTP, email
    db/                         ← schema, drizzle client, migrations, seed
    domain/                     ← shared domain entities (Skill, User, Archetype)
    lib/                        ← utilities (blob helpers, zip utils)
    hooks/                      ← shared React hooks (useBreakpoint, useTheme)
    types/                      ← shared types (Responsive<T>, RenderableWidget)

  features/                     ← vertical slices, one per use case
    skill-library/
      widgets/                  ← UI specific to this feature
      use-skill-library.ts      ← data hook (presenter)
    publish-skill/
      action.ts                 ← server action (controller)
      use-case.ts               ← business orchestration
      validation.ts             ← input rules specific to publishing
    generate-project/
      widgets/
      action.ts
      use-case.ts

middleware.ts                   ← root (Next.js requirement)
```

### Where does it go?

| Question | Answer |
|---|---|
| Used by multiple features? | `platform/` |
| Used by one feature only? | Inside that feature's folder |
| A domain entity (Skill, User)? | `platform/domain/` |
| A value object only used in one feature? | Inside that feature |
| A shared React hook (useBreakpoint)? | `platform/hooks/` |
| A widget only used on one page? | `features/<name>/widgets/` |
| A server action? | `features/<name>/action.ts` |
| A use case? | `features/<name>/use-case.ts` |
| A mapper for DB → domain? | Adjacent to the repository that uses it |
| An API route for external access? | `app/api/` |

---

## Domain Objects

### Entities vs Value Objects

**Entities** have identity (UUID) and a lifecycle. Two entities with the same data but different IDs are different objects.

**Value Objects** have no identity. Two value objects with the same data are equal. They validate at construction — if they exist, they're valid.

```ts
// Entity — has identity, has lifecycle
class Skill {
  constructor(
    readonly id: string,
    readonly slug: string,
    readonly title: string,
    private _currentDraft: SkillVersion | null,
    private _currentPublished: SkillVersion | null,
  ) {}

  publish(publishedById: string): SkillVersion { /* ... */ }
  get isPublished(): boolean { return this._currentPublished !== null; }
}

// Value Object — no identity, self-validating
class EmailAddress {
  readonly value: string;
  constructor(raw: string) {
    const domain = raw.split('@')[1]?.toLowerCase();
    if (!ALLOWED_DOMAINS.includes(domain)) throw new InvalidDomainError(raw);
    this.value = raw.toLowerCase();
  }
}
```

### Shared vs feature-specific

If a domain object appears in more than one feature, it belongs in `platform/domain/`. If it only matters to one feature, it stays in that feature folder. When in doubt, start in the feature — extract to platform when a second feature needs it.

---

## Mappers

One mapper per boundary. The mapper file lives adjacent to the infrastructure code that needs it.

Three conversion directions:

| Method | Direction | Use |
|---|---|---|
| `toDomain(row)` | Persistence → Domain | Loading from DB |
| `toDTO(entity)` | Domain → Transport | Returning from an action or API |
| `toPersistence(entity)` | Domain → Persistence | Saving to DB |

Not every mapper needs all three. Start with what you need.

```ts
// features/publish-skill/skill.mapper.ts
import { Skill } from '@/platform/domain/Skill';

interface SkillRow {
  id: string;
  slug: string;
  title: string;
  // ... DB shape
}

export function toSkill(row: SkillRow): Skill {
  return new Skill(row.id, row.slug, row.title, /* ... */);
}

export function toSkillPersistence(skill: Skill) {
  return { id: skill.id, slug: skill.slug, title: skill.title, /* ... */ };
}
```

---

## Cross-Cutting Concerns

| Concern | Where it lives | Why |
|---|---|---|
| **Input validation** | Server Action (controller layer) | Reject bad input before it reaches business logic |
| **Business rule validation** | Domain object or use case | Domain enforces its own invariants |
| **Authorisation** | Use case | "Can this user do this?" is a business rule |
| **Audit logging** | Use case | Compliance requirement — part of the business flow |
| **Error handling** | Use case returns typed results; action translates to response | Domain throws domain errors; controller catches and formats |
| **Cache invalidation** | Server Action (after use case completes) | `revalidatePath` is a Next.js transport concern |

For now, cross-cutting concerns live directly in use cases. If duplication becomes painful across many use cases, introduce a pipeline pattern (middleware chain wrapping use case execution).

---

## Feature-to-Feature Communication

Features never import from each other. When one feature's action affects another feature's data:

- **`revalidatePath`** — the publish-skill action calls `revalidatePath('/skills')` to refresh the skill library. No import needed.
- **Shared domain objects** — both features import `Skill` from `platform/domain/`, not from each other.
- **Domain events** (future, if needed) — a simple event bus in platform. Not yet.

---

## Banned Patterns

- ❌ Business logic in Server Actions → extract to `use-case.ts`, keep action as thin controller
- ❌ Feature importing from another feature → extract shared code to `platform/`
- ❌ Raw DB rows or API responses passed to widgets → use a mapper to convert to domain objects
- ❌ Anemic domain objects (classes with only data, no methods) → add intention-revealing methods that enforce invariants
- ❌ Direct property mutation on domain objects (`skill.status = 'published'`) → use methods (`skill.publish()`)
- ❌ Validation scattered across multiple layers → input validation in controller, business rules in domain/use case
- ❌ `any` type anywhere → use proper typing or `unknown` with type guards
- ❌ Use case that does too much (UI + data + side effects) → use case orchestrates, delegates to domain and infrastructure

---

## Quality Gate

Before delivering, verify:

- [ ] New feature lives in `features/<name>/` with its own action, use case, and widgets
- [ ] Server Action contains no business logic — only input validation, use case call, and response
- [ ] Domain objects enforce invariants via methods, not exposed mutable state
- [ ] No raw DB rows or API responses leak past the mapper boundary
- [ ] Features do not import from other features — only from `platform/`
- [ ] Cross-cutting concerns (auth, audit) are handled in the use case, not scattered
- [ ] Shared domain objects live in `platform/domain/`, feature-specific types stay in the feature
- [ ] Use case is testable in isolation — no direct framework dependencies
- [ ] No `any` types introduced

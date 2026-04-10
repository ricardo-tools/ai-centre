---
name: coding-standards
description: >
  How to write code that is small, composable, safe, and readable by both humans
  and AI agents. Covers function design, naming, functional patterns, type safety,
  immutability, error handling, and AI-optimized coding. Apply when writing any
  TypeScript or JavaScript code — components, business logic, utilities, or tests.
  Stack-agnostic principles with TypeScript-specific guidance.
---

# Coding Standards

Code is read by humans and AI agents far more than it is written. Every function should be small, do one thing, take a value and return a value. Business logic should be pure. Side effects should be at the edges. State should be modelled so that illegal states are impossible. Names should be so clear that the code reads like a description of the domain.

---

## When to Use

Apply this skill when:
- Writing any TypeScript or JavaScript code
- Reviewing code for quality, readability, or safety
- Refactoring existing code
- Designing function signatures or data types
- Deciding between abstraction and duplication
- Writing code that AI agents will read or modify

Do NOT use this skill for:
- Project structure or where files go — see **clean-architecture**
- UI component or widget patterns — see **frontend-architecture**
- Server-side patterns (actions, repositories, caching) — see **backend-patterns**
- API-specific patterns (Claude, external services) — see **ai-claude**

---

## Core Rules

### 1. Small functions through composition, not extraction

Functions should be small because each one does one transformation — not because they were extracted from a larger function. A composable function takes a value, transforms it, and returns a new value. It exists as an independent building block, not a fragment of its parent.

The litmus test: *"Can I use this function in a different context without modification?"* If yes, it's a composable building block. If no, it's a coupled extraction — reconsider.

```ts
// ✅ Composition style — each function is independent, value-in value-out
const validateEmail    = (email: string): Result<string, 'invalid_format' | 'blocked_domain'> => { ... };
const normalizeEmail   = (email: string): string => email.trim().toLowerCase();
const checkUniqueness  = async (email: string): Promise<Result<string, 'already_exists'>> => { ... };

// Compose into a flow
async function processEmail(raw: string): Promise<Result<string, EmailError>> {
  const normalized = normalizeEmail(raw);
  const valid = validateEmail(normalized);
  if (!valid.ok) return valid;
  return checkUniqueness(valid.value);
}

// ❌ Extraction style — helpers coupled to parent's context
function processEmail(raw: string) {
  doStep1(raw);   // what does this do? must read the body
  doStep2();      // relies on state from step1
  return doStep3(); // unclear inputs/outputs
}
```

**Target: 5–25 lines per composable function.** Orchestration functions (use cases, handlers) can be longer (20–40 lines) if the flow is linear and each step is clearly named.

### 2. Functional core, imperative shell

Business logic should be pure functions — same inputs always produce same outputs, no side effects. Side effects (database, APIs, file system, state mutations) live in a thin orchestration layer at the edges.

```ts
// ✅ Pure core — testable without mocks, no async needed
function calculateDiscount(
  subtotal: number,
  tier: 'standard' | 'premium' | 'enterprise',
  coupon: string | null,
): number {
  const tierRate = tier === 'enterprise' ? 0.15 : tier === 'premium' ? 0.10 : 0;
  const couponRate = coupon === 'SAVE20' ? 0.20 : 0;
  return subtotal * Math.max(tierRate, couponRate);
}

// ✅ Imperative shell — thin, calls pure core
async function handleCheckout(orderId: string) {
  const order = await orderRepo.findById(orderId);        // side effect: read
  const discount = calculateDiscount(                      // pure
    order.subtotal, order.customerTier, order.couponCode,
  );
  await orderRepo.updateDiscount(orderId, discount);       // side effect: write
}
```

Why: Pure functions have 40–60% fewer defects per line than functions with side effects. They're also dramatically easier for AI agents to reason about — only local context is needed.

### 3. Names are the highest-leverage investment

Naming is not cosmetic — it directly affects comprehension speed, bug rates, and AI accuracy. Full-word identifiers reduce comprehension time by ~19% (Hofmeister et al., 2017). Inconsistent naming is a measurable source of defects (Feitelson et al., 2020).

**Rules:**
- **8–25 characters.** Full words for domain concepts (`skillVersion` not `sv`). Single letters only for loop-local variables with 3-line scope.
- **Consistent verbs.** `get` = synchronous lookup. `fetch` = async network call. `compute` = derived value. `build` = construct from parts. `parse` = convert from raw input. Pick one verb per concept and use it everywhere.
- **Boolean prefix.** `isPublished`, `hasActiveSubscription`, `canEditSkill`. The `is/has/can/should` prefix eliminates type and semantic ambiguity.
- **Domain language.** Use the same terms as the business. `publishSkillVersion` not `updateStatus`. When code uses domain terminology, both humans and AI agents connect requirements to implementation directly.
- **No abbreviations** except universally understood ones (`id`, `url`, `html`, `db`, `config`).

### 4. Make illegal states unrepresentable

Use the type system so that invalid states cannot be constructed. This eliminates entire categories of runtime errors.

```ts
// ❌ Permissive — which fields exist in which states?
type Request = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: User[];
  error?: string;
};

// ✅ Each state carries exactly its own data
type RequestState<T> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading' }
  | { readonly status: 'success'; readonly data: T }
  | { readonly status: 'error'; readonly error: string };
```

Use discriminated unions for any type that has multiple states. Use exhaustive `switch` with a `never` default to catch unhandled variants at compile time.

```ts
function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}

function renderState(state: RequestState<User[]>) {
  switch (state.status) {
    case 'idle':    return <EmptyState />;
    case 'loading': return <Skeleton />;
    case 'success': return <UserList users={state.data} />;
    case 'error':   return <ErrorBanner message={state.error} />;
    default:        return assertNever(state);
  }
}
```

### 5. Use Result for expected failures, throw for bugs

Expected failures (validation, not found, permission denied) return a `Result`. Unexpected failures (programmer errors, invariant violations) throw. Never use try/catch for control flow.

Error values carry stack traces — use `Error` subclasses as the error side of `Result`, not plain strings. This gives you functional composition AND full debugging information.

```ts
// Domain errors — extend Error to capture stack traces automatically
class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
class NotFoundError extends DomainError {
  constructor(entity: string, id: string) { super(`${entity} not found: ${id}`); }
}

// Result type — error side is always an Error (carries stack trace)
type Result<T, E extends Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

const Ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const Err = <E extends Error>(error: E): Result<never, E> => ({ ok: false, error });

// ✅ Total function — every input produces a value, errors have stack traces
function publishSkill(id: string, userId: string): Result<SkillVersion, NotFoundError | NoDraftError> {
  const skill = await skillRepo.findById(id);
  if (!skill) return Err(new NotFoundError('Skill', id));  // stack captured here
  if (!skill.currentDraft) return Err(new NoDraftError(id));
  return Ok(skill.publish(userId));
}

// Caller handles both cases — error has full stack for debugging
const result = publishSkill(id, userId);
if (!result.ok) {
  console.error(result.error.stack);  // full stack trace
  return { success: false, error: result.error.message };
}
// result.value is narrowed to SkillVersion
```

**The key:** `new Error()` captures the stack at construction, whether you throw it or return it. You get functional composition (no try/catch) and full diagnostics (stack traces).

### 6. Immutability by default

`readonly` on interface properties. `as const` for literal constants. `ReadonlyArray<T>` for function parameters. Mutation only as a local implementation detail inside a function that returns an immutable result.

```ts
// ✅ Interface properties are readonly
interface Skill {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly status: 'draft' | 'published' | 'archived';
}

// ✅ Local mutation is fine when the result is immutable
function buildIndex(items: readonly Item[]): ReadonlyMap<string, Item> {
  const map = new Map<string, Item>();
  for (const item of items) map.set(item.id, item);
  return map;
}

// ✅ Constants with as const
const ALLOWED_DOMAINS = ['ezycollect.com.au', 'ezycollect.io', 'sidetrade.com'] as const;
type AllowedDomain = typeof ALLOWED_DOMAINS[number];
```

### 7. Guard clauses first, then linear happy path

Validate and reject at the top. The main logic flows linearly at the lowest indentation level. No else-after-return. One level of nesting is fine; three levels means extract or rethink.

```ts
// ✅ Guard clauses — happy path is linear
function publishSkill(skill: Skill, userId: string): Result<SkillVersion, PublishError> {
  if (!skill.currentDraft) return Err('no_draft');
  if (skill.authorId !== userId) return Err('not_author');
  if (skill.currentDraft.content.length < 100) return Err('content_too_short');

  // Happy path — clear, linear, at lowest indentation
  const version = createPublishedVersion(skill.currentDraft, userId);
  return Ok(version);
}

// ❌ Nested conditionals
function publishSkill(skill: Skill, userId: string) {
  if (skill.currentDraft) {
    if (skill.authorId === userId) {
      if (skill.currentDraft.content.length >= 100) {
        // finally, the actual logic, buried three levels deep
      }
    }
  }
}
```

---

## Declarative Style

Prefer expressions over statements. Prefer data descriptions over step-by-step instructions. Prefer `map`/`filter`/`reduce` over imperative loops with accumulators.

```ts
// ✅ Declarative — describe structure, filter what doesn't apply
const NAV_ITEMS: Array<NavItem & { requiredRole?: Role }> = [
  { label: 'Home', path: '/' },
  { label: 'Skills', path: '/skills' },
  { label: 'Admin', path: '/admin', requiredRole: 'admin' },
];

const visibleNav = (role: Role) =>
  NAV_ITEMS.filter(item => !item.requiredRole || item.requiredRole === role);

// ❌ Imperative — step-by-step mutation
function getNav(role: Role) {
  const items: NavItem[] = [];
  items.push({ label: 'Home', path: '/' });
  items.push({ label: 'Skills', path: '/skills' });
  if (role === 'admin') items.push({ label: 'Admin', path: '/admin' });
  return items;
}
```

**Readability threshold:** Use chains for 2–4 step pipelines where each step is simple. Beyond 4–5 steps, use named intermediates. When you need multiple outputs from a single pass or early termination, a `for` loop is clearer.

```ts
// ✅ Chain — clear, each step is obvious
const activeEmails = users
  .filter(user => user.isActive)
  .map(user => user.email.toLowerCase());

// ✅ Named intermediates — when the chain gets long
const activeUsers = users.filter(u => u.isActive);
const scored = activeUsers.map(u => ({ ...u, score: computeScore(u) }));
const topTen = scored
  .sort((a, b) => b.score - a.score)
  .slice(0, 10);
```

---

## Parameters and Function Signatures

**Maximum 3–4 parameters.** Beyond that, use an options object. Named properties eliminate argument-order errors for both humans and AI.

```ts
// ✅ Options object — self-documenting, order-independent
function createSkill(options: {
  title: string;
  slug: string;
  description: string;
  authorId: string;
  isOfficial?: boolean;
}): Skill { ... }

// ❌ Positional — which string is which?
function createSkill(
  title: string, slug: string, description: string, authorId: string, isOfficial: boolean,
): Skill { ... }
```

**Explicit types at boundaries.** Return type annotations on all exported functions. Parameter types always explicit. Internal implementation can rely on inference.

---

## Comments: Why and Why Not

Code expresses *what* and *how*. Comments express *why* and *why not*. Never comment *what* the code does — if the code needs that, rename things.

**Comments that add value:**
- **Why** — `// Exponential backoff to avoid overwhelming the API during outages`
- **Why not** — `// Don't use Promise.all here — these must be sequential for audit ordering`
- **Invariant** — `// This array is always sorted by createdAt descending at this point`
- **Warning** — `// Do not reorder — blob upload must complete before the DB write`

**Comments that are noise:** Restating the code. Changelog entries. Commented-out code. Section dividers.

The "why not" comment is especially critical for AI agents — it prevents an LLM from "optimising" code that has non-obvious constraints.

---

## Abstraction: The Rule of Three

Do not abstract until you have **three concrete instances** of similar code. Two similar blocks may diverge in future requirements. Abstracting them prematurely creates coupling that makes both harder to change.

> "Duplication is far cheaper than the wrong abstraction." — Sandi Metz

**When duplication is better than abstraction:**
- Across bounded contexts (two widgets in different domains with similar-looking code)
- When coupling would cross architectural layers
- When the "abstraction" is just indirection — the reader must jump to another file for trivial logic

**When to abstract:**
- Three or more concrete consumers
- The abstraction makes all consumers simpler, not just shorter
- The abstraction has a clear, specific name (not `handleData`, `processItems`, `commonLogic`)

For AI agents specifically: moderate duplication is safer than deep abstraction hierarchies. When an LLM modifies duplicated code, the worst case is it misses one instance. When it modifies a shared abstraction incorrectly, it breaks every consumer.

---

## AI-Optimised Patterns

Code is now maintained by both humans and AI agents. These patterns help both.

**Locality of reasoning.** Keep related logic close. When all information needed to understand a function is within ~100 lines of it, AI agents produce significantly more accurate modifications. Don't extract single-use helpers into separate files.

**Predictable structures.** When every widget, every use case, every domain object follows the same structural template, AI agents pattern-match rather than reason from first principles. Consistency is the most powerful AI-assistability tool.

**Explicit types at boundaries.** Return type annotations and parameter types give AI agents structural understanding they would otherwise infer incorrectly.

**No magic.** Named constants for numbers and strings. `const MAX_OTP_ATTEMPTS = 3`, not `if (attempts > 3)`. Enums or const objects for string literals. AI agents will use inconsistent magic strings across files.

**No action at a distance.** A function in file A should not set a value that affects behaviour in file C with no visible connection. AI agents cannot reliably track implicit state propagation.

**No implicit ordering.** If operations must happen in a specific sequence, make it visible in the code structure. AI agents will reorder operations if the dependency isn't obvious.

---

## TypeScript Specifics

- **`interface` for object shapes** (props, contracts, domain entities). **`type` for unions, intersections, computed types.**
- **`unknown` at external boundaries** (API responses, user input, JSON.parse). Forces explicit narrowing. Never `any`.
- **`readonly` on all interface properties** unless mutation is explicitly required.
- **`as const` for literal constants** — provides exact literal types and makes arrays into tuples.
- **Discriminated unions for state modelling.** Classes for domain objects with behaviour (methods). Both are valid — unions for data, classes for data + behaviour.
- **`strict: true` always.** Non-negotiable. `strictNullChecks` alone catches a category of bugs that no amount of testing covers.

---

## Banned Patterns

- ❌ `any` type → use `unknown` at boundaries, proper types everywhere else
- ❌ Try/catch for control flow → use `Result<T, E>` for expected failures, throw only for bugs
- ❌ Functions over 40 lines with high nesting → decompose into composable transformations
- ❌ More than 3–4 positional parameters → use options object with named properties
- ❌ Magic numbers and strings → named constants or const objects
- ❌ Direct property mutation on shared objects → `readonly` properties, return new values
- ❌ Nested conditionals (3+ levels) → guard clauses and early returns
- ❌ Abstractions with fewer than 3 consumers → wait for the third instance
- ❌ Vague names (`data`, `info`, `handle`, `process`, `item`) → use domain-specific names
- ❌ Commented-out code → delete it, git has history
- ❌ Cargo-cult FP (monads, HKTs, type classes, point-free) → use practical FP patterns that all TypeScript developers can read
- ❌ Imperative loops when `map`/`filter`/`reduce` is clearer → prefer declarative for 2–4 step pipelines
- ❌ `map`/`filter` chains over 5 steps → use named intermediates or a loop

---

## Quality Gate

Before delivering, verify:

- [ ] Every function does one transformation — value in, value out
- [ ] Composable functions are 5–25 lines. Orchestration functions are 20–40 lines max with linear flow.
- [ ] Business logic is pure — no side effects, no async. Side effects are at the edges.
- [ ] Names use full words, domain language, and consistent verbs (8–25 chars)
- [ ] Booleans prefixed with `is/has/can/should`
- [ ] States modelled as discriminated unions — no optional fields that are "sometimes present"
- [ ] Expected failures use `Result<T, E>`, not thrown exceptions
- [ ] Interface properties are `readonly`. Constants use `as const`.
- [ ] Guard clauses at the top, happy path linear at lowest indentation
- [ ] No more than 3–4 positional parameters — options object beyond that
- [ ] No magic numbers or strings — named constants
- [ ] Comments explain "why" or "why not", never "what"
- [ ] No `any` types. `unknown` at external boundaries.
- [ ] No nested conditionals beyond 2 levels
- [ ] No abstraction without 3+ concrete consumers
- [ ] `strict: true` in tsconfig — no exceptions

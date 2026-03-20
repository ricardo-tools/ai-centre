---
name: testing-strategy
description: >
  What to test, at which level, and why. Maps the testing trophy to clean
  architecture — domain objects, use cases, Server Actions, widgets, and user
  flows each have a specific testing approach. Opinionated stack: Vitest for
  unit/component, React Testing Library for components, Playwright for E2E,
  MSW for API mocking, Fishery + Faker for test data. Apply when deciding how
  to test new code, setting up testing for a project, or reviewing test coverage.
---

# Testing Strategy

Test behaviours, not implementations. Test at the level that gives you confidence without warping the design. The testing trophy — static analysis at the base, integration tests as the largest layer, E2E for critical paths — is the model. Every type of code in our architecture has a specific testing approach.

---

## When to Use

Apply this skill when:
- Deciding how to test a new feature, use case, or component
- Setting up testing infrastructure for a project
- Reviewing whether test coverage matches the risk profile
- Choosing between unit, component, and E2E tests for a specific piece of code
- Adding mocks, fixtures, or test data factories

Do NOT use this skill for:
- Quality thinking and philosophy — see **quality-assurance**
- E2E test writing patterns (page objects, selectors, CI sharding) — see **playwright-e2e**
- Testing AI-generated outputs — see **eval-driven-development**
- Verification loop mechanics (build, lint, type check) — see **verification-loop**

---

## Core Rules

### 1. The stack is opinionated

| Layer | Tool | Why |
|---|---|---|
| **Static analysis** | TypeScript strict + ESLint | Always on. Catches type errors, import issues, code quality. Zero runtime cost. |
| **Unit / Integration** | Vitest | Jest-compatible API, native TypeScript, 5–10x faster than Jest, Vite-powered watch mode. |
| **Component** | Vitest + React Testing Library | RTL tests what the user sees, not implementation details. Vitest provides the runner. |
| **E2E** | Playwright | Fastest, cheapest in CI, native parallelism, best Next.js support. Not Cypress. |
| **API mocking** | MSW v2 | Intercepts at the network level. Same mocks work across unit, component, E2E, and local dev. |
| **Test data** | Fishery + @faker-js/faker | Typed factories with realistic data. `.build()` for unit tests, `.buildList(n)` for collections. |
| **Snapshot testing** | Do not use | Community consensus: false confidence, rubber-stamped updates, breaks on irrelevant changes. |

### 2. Test behaviours, not implementations

The "unit" in unit testing is a unit of behaviour, not a unit of code. Test what the system does (given this input, expect this output), not how it does it internally (this function was called with these arguments).

Tests that check implementation details break when you refactor — the opposite of their purpose. Tests that check behaviour survive refactoring and provide real confidence.

```ts
// ✅ Behaviour test — survives refactoring
test('publishing a skill creates a published version', async () => {
  const skill = skillFactory.build({ status: 'draft' });
  const result = await publishSkillUseCase(skill.id, userId);
  expect(result.ok).toBe(true);
  expect(result.value.status).toBe('published');
});

// ❌ Implementation test — breaks when you refactor internals
test('publishSkillUseCase calls skillRepo.updateVersion', async () => {
  await publishSkillUseCase(skill.id, userId);
  expect(skillRepo.updateVersion).toHaveBeenCalledWith(skill.id, { status: 'published' });
});
```

### 3. The testing trophy distribution

```
     /     E2E      \     ← ~40% of effort — critical user flows
    /   Component    \    ← ~20% — widget interactions, form behaviour
   /      Unit        \   ← ~30% — domain logic, use cases, mappers
   |    Static        |   ← always on — TypeScript strict, ESLint
```

The trend: E2E effort is increasing because Playwright has made E2E tests nearly as cheap to write and run as integration tests, while Next.js Server Components make integration-level mocking increasingly complex.

### 4. Mock external boundaries, not internal collaborators

Mock things that cross a trust boundary: external APIs (MSW), databases (test database or repository interface), file storage, email services. Don't mock internal functions, domain objects, or utility code — let them run for real.

The more mocks in a test, the less confidence it provides. If you're mocking more than you're testing, the test is testing the wrong thing.

### 5. Every test needs a reason to exist

Before writing a test, answer: *what would go wrong if this test didn't exist?* If the answer is "nothing, TypeScript already catches it" or "the E2E test covers this path" — don't write the unit test.

Tests have maintenance cost. Every test that breaks during refactoring slows the team down. Write tests that earn their keep.

---

## What to Test Where

### Architecture mapping

| Code type | Test level | Tool | What to assert |
|---|---|---|---|
| **Domain objects** (entities, value objects) | Unit | Vitest | Invariant enforcement, method behaviour, state transitions |
| **Pure business logic** (pricing, validation, scoring) | Unit | Vitest | Input → output correctness, edge cases, boundary conditions |
| **Mappers** (DB row → domain object) | Unit | Vitest | Correct field mapping, handles null/missing fields |
| **Use cases** | Unit / Integration | Vitest | Orchestration correctness, error cases, side effects called |
| **Server Actions** | Unit | Vitest | Input validation (Zod), delegates to use case, error translation |
| **Client Components** | Component | Vitest + RTL | Renders correct content, responds to interactions, state changes |
| **Widgets** (with data hooks) | Component | Vitest + RTL + MSW | Loading/error/empty states, data display, user interactions |
| **Full user flows** | E2E | Playwright | Page-to-page navigation, form submission, auth, real rendering |
| **Async Server Components** | E2E | Playwright | Cannot unit test (React limitation) — test via real browser |
| **Middleware** | Unit + E2E | Vitest (logic) + Playwright (redirects) | Auth checks, redirect behaviour |
| **API routes** | Unit | Vitest | Import handler, pass mock Request, assert Response |

### Domain objects

```ts
import { describe, test, expect } from 'vitest';

describe('Skill', () => {
  test('publishing creates an immutable published version', () => {
    const skill = new Skill({ id: '1', currentDraft: draft, currentPublished: null });
    const version = skill.publish('user-1');

    expect(version.status).toBe('published');
    expect(version.publishedById).toBe('user-1');
    expect(skill.currentPublished).toBe(version);
  });

  test('publishing without a draft throws', () => {
    const skill = new Skill({ id: '1', currentDraft: null, currentPublished: null });
    expect(() => skill.publish('user-1')).toThrow(NoDraftError);
  });
});
```

### Use cases

Test the orchestration. Mock the repository interface if the use case depends on data access. Let domain objects run for real.

```ts
import { describe, test, expect, vi } from 'vitest';

describe('publishSkillUseCase', () => {
  test('publishes draft and writes audit log', async () => {
    const skillRepo = {
      findById: vi.fn().mockResolvedValue(skillWithDraft),
      saveVersion: vi.fn(),
    };
    const auditRepo = { log: vi.fn() };

    const result = await publishSkillUseCase('skill-1', 'user-1', { skillRepo, auditRepo });

    expect(result.ok).toBe(true);
    expect(skillRepo.saveVersion).toHaveBeenCalledOnce();
    expect(auditRepo.log).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'published', entityId: 'skill-1' })
    );
  });

  test('returns error when skill not found', async () => {
    const skillRepo = { findById: vi.fn().mockResolvedValue(null) };
    const result = await publishSkillUseCase('nonexistent', 'user-1', { skillRepo });
    expect(result.ok).toBe(false);
    expect(result.error).toBe('skill_not_found');
  });
});
```

### Server Actions

Test input validation and error translation. The use case is already tested separately.

```ts
import { describe, test, expect, vi } from 'vitest';

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/headers', () => ({ cookies: () => ({ get: () => ({ value: 'mock-token' }) }) }));

describe('publishSkill action', () => {
  test('rejects invalid input', async () => {
    const result = await publishSkillAction({ skillId: 'not-a-uuid' });
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input');
  });
});
```

### Client Components

Use RTL to test what the user sees and does. Don't test internal state.

```tsx
import { render, screen, fireEvent } from '@testing-library/react';

test('search input filters the skill list', async () => {
  render(<SkillBrowser initialSkills={testSkills} />);

  const input = screen.getByRole('searchbox');
  await fireEvent.change(input, { target: { value: 'architecture' } });

  expect(screen.getByText('Clean Architecture')).toBeInTheDocument();
  expect(screen.queryByText('Print Design')).not.toBeInTheDocument();
});

test('shows empty state when no results match', async () => {
  render(<SkillBrowser initialSkills={testSkills} />);

  await fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzzz' } });

  expect(screen.getByText(/no skills found/i)).toBeInTheDocument();
});
```

### Widgets with data hooks

Mock the external API with MSW. Let the hook, component, and rendering run for real.

```tsx
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/skills', () =>
    HttpResponse.json({ skills: [skillFactory.build(), skillFactory.build()] })
  ),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test('renders loading then skill list', async () => {
  render(<SkillListWidget size="lg" />);

  expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  expect(await screen.findByText(testSkills[0].title)).toBeInTheDocument();
});

test('renders error state on API failure', async () => {
  server.use(http.get('/api/skills', () => HttpResponse.error()));
  render(<SkillListWidget size="lg" />);

  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
});
```

---

## Test Data

### Factories with Fishery

```ts
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

export const skillFactory = Factory.define<Skill>(() => ({
  id: faker.string.uuid(),
  slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
  title: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  authorId: faker.string.uuid(),
  isOfficial: false,
  status: 'draft',
}));

export const userFactory = Factory.define<User>(() => ({
  id: faker.string.uuid(),
  email: faker.internet.email({ provider: 'ezycollect.com.au' }),
  name: faker.person.fullName(),
  role: 'member',
}));

// Usage in tests
const skill = skillFactory.build({ title: 'Clean Architecture' });
const officialSkills = skillFactory.buildList(5, { isOfficial: true });
const admin = userFactory.build({ role: 'admin' });
```

### MSW handlers

```ts
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/skills', () =>
    HttpResponse.json({ skills: skillFactory.buildList(3) })
  ),
  http.post('/api/skills/:id/publish', async ({ params }) =>
    HttpResponse.json({ success: true, version: '1.0.0' })
  ),
];
```

Reuse the same handlers across Vitest (unit/component), Playwright (E2E), and local dev. One source of truth for mock behaviour.

---

## When NOT to Test

- **Trivial code** — a function that returns a constant, a simple getter, a one-line mapping
- **Framework behaviour** — don't test that Next.js routing works, that React re-renders on state change, or that Drizzle generates SQL
- **Implementation details** — internal state, private methods, specific function call sequences
- **Things TypeScript already catches** — type mismatches, missing required fields, null safety
- **Duplicate coverage** — if the E2E test exercises the path and the code is simple, a unit test adds maintenance cost without confidence

---

## CI Configuration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  static:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint

  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx vitest run --coverage

  e2e:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test --shard=${{ matrix.shard }}/4
```

**Static + unit run in parallel** (independent). **E2E runs after build** (depends on it). **E2E is sharded across 4 runners** for speed.

---

## Banned Patterns

- ❌ Jest in new projects → use Vitest (same API, 5–10x faster, native TypeScript)
- ❌ Cypress for E2E → use Playwright (faster, cheaper CI, native parallelism, better browser coverage)
- ❌ Snapshot testing → false confidence, rubber-stamped updates. Test behaviour instead.
- ❌ Mocking internal collaborators (domain objects, utilities) → let them run for real. Mock only external boundaries.
- ❌ Testing implementation details (function call counts, internal state) → test inputs and outputs
- ❌ One-to-one test-to-file mapping (every class gets a test file) → test behaviours that matter, not files
- ❌ Tests without a clear reason to exist → if TypeScript or E2E already covers it, don't add a unit test
- ❌ Test data as inline literals → use Fishery factories for consistent, realistic test data
- ❌ Different mock strategies per test level → use MSW consistently across unit, component, and E2E
- ❌ Skipping E2E for async Server Components → they cannot be unit tested; E2E is the only option

---

## Quality Gate

Before delivering, verify:

- [ ] Domain objects and pure business logic have unit tests for invariants and edge cases
- [ ] Use cases have tests for the happy path, error cases, and side effects
- [ ] Client Components have RTL tests for rendering and interaction behaviour
- [ ] Widgets test loading, error, and empty states (with MSW for data)
- [ ] Critical user flows have Playwright E2E tests
- [ ] Server Actions test input validation and error translation
- [ ] Test data uses Fishery factories, not inline literals
- [ ] External APIs mocked with MSW, not hand-rolled fetch mocks
- [ ] No tests check implementation details (mock call counts, internal state)
- [ ] No snapshot tests
- [ ] CI runs static + unit in parallel, E2E sharded after build
- [ ] All tests pass in CI before merge

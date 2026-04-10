---
name: flow-tdd
description: >
  Opinion companion for flow. The single testing skill — covers what to
  test, at which level, how to write scenarios (Gherkin for integration + E2E),
  data isolation, test data factories, mocking strategy, and the hardening gate.
  Tests are the spec: written before implementation, committed failing.
---

# Flow: TDD

The single testing skill for the project. Tests ARE the specification — written before implementation, committed failing.

Opinion companion to **flow** (core). Hooks in at:
- **PLANNING:** scan existing tests, write ALL new scenarios upfront
- **IMPLEMENTATION:** run targeted tests after eval, fix until passing
- **POST-DELIVERY:** full suite hardening — 0 failures across all tests

---

## When to Use

Every task that changes behaviour. The only exception is trivially small tasks where the user says "skip tests."

---

## Core Rules

### 1. Scan existing tests first

Before proposing ANY new tests, scan for existing tests related to the change. Report:

| Test | Action | Reason |
|---|---|---|
| `PER-CR1: Persona creation` | **Keep** | Unaffected |
| `AUTH-S2: Session verify` | **Update** | Payload shape changed |
| — | **New** | CON-UP1: Content upload creates chunks |

### 2. Test behaviours, not implementations

Test what the system does (given input → expect output), not how it does it (function X was called with args Y). Tests that check implementation break when you refactor. Tests that check behaviour survive.

```typescript
// ✅ Behaviour — survives refactoring
const result = await createPersona({ name: 'AR Manager', buyingRole: 'champion' }, actorId);
expect(result.ok).toBe(true);

// ❌ Implementation — breaks on refactor
expect(personaRepo.insert).toHaveBeenCalledWith(expect.objectContaining({ name: 'AR Manager' }));
```

### 3. Gherkin-style scenarios for integration and E2E tests

Use the **full Gherkin vocabulary**:

| Block | Purpose | Can repeat? |
|---|---|---|
| `Given` | Preconditions — set up state | Once per scenario (use `And` for additional) |
| `When` | Action — what the user/system does | Yes |
| `Then` | Assertion — what should be true | Yes |
| `And` | Continuation of previous block | Yes |
| `But` | Negative assertion after `Then` | Yes |
| `Background` | Shared `Given` across scenarios | Once per describe |
| `Scenario Outline` + `Examples` | Parameterised scenario | — |
| `Rule` | Business rule grouping scenarios | — |

**Unit tests** for pure functions use standard `describe`/`test` — Gherkin is overhead for simple input→output.

### 4. Gherkin blocks ARE the test structure

The narrative is readable directly from the test code:

```typescript
describe('Rule: Only marketing and admin can create personas', () => {
  describe('Scenario: Marketing user creates a persona', () => {
    it('Given a user with marketing role', async () => { /* ... */ });
    it('When they submit a valid persona', async () => { /* ... */ });
    it('Then the persona is created', async () => { /* ... */ });
    it('And the audit log records the creation', async () => { /* ... */ });
  });

  describe('Scenario Outline: Role-based access', () => {
    const examples = [
      { role: 'admin', level: 100, canCreate: true },
      { role: 'sales', level: 40, canCreate: false },
    ];
    for (const { role, level, canCreate } of examples) {
      describe(`Example: ${role}`, () => {
        it(`Given a user with ${role} role`, async () => { /* ... */ });
        it(`Then creation ${canCreate ? 'succeeds' : 'is denied'}`, async () => { /* ... */ });
      });
    }
  });
});
```

### 5. Tests written FAILING — never skipped

- **NOT** commented out, **NOT** `it.skip`, **NOT** `test.todo`
- Written to **fail**, committed failing
- Implementation makes them pass
- A passing test before implementation is suspicious

### 6. Data isolation at ALL test levels

Every test runs independently. No shared mutable state. No execution order dependency.

**3-tier data lifecycle** (applies to both integration and E2E):

| Tier | Scope | Lifecycle | Example |
|------|-------|-----------|---------|
| **Base data** | Suite-wide | Committed to DB, cleaned + recreated on startup | Users, roles, dimension lookup tables |
| **File-level data** | All tests in a file | Created in `beforeAll`, rolled back in `afterAll` | A content record shared by all tests in the file |
| **Test-level data** | Single test | Created during test, rolled back in `afterEach` | Test-specific mutations that disappear automatically |

**Unit:** Factory-generated data per test (Fishery + Faker). No module-level mutation. No DB.

**Integration:** Transaction-based isolation. A dedicated connection holds a transaction open for the file; savepoints isolate each test. Zero manual cleanup. See `.claude/skills/vitest-integration-reference/SKILL.md` for copy-paste templates.

**E2E:** Per-worker Postgres database. Timestamp-based rollback (same 3-tier model but via HTTP API since browser tests can't hold transactions). See `.claude/skills/playwright-e2e/SKILL.md` for architecture, `.claude/skills/playwright-e2e-reference/SKILL.md` for templates.

### 7. What to test where

| Code type | Level | Tool | What to assert |
|---|---|---|---|
| **Domain objects** | Unit | Vitest | Invariants, method behaviour, state transitions |
| **Pure logic** (validation, scoring) | Unit | Vitest | Input → output, edge cases, boundaries |
| **Mappers** (DB row → domain) | Unit | Vitest | Field mapping, null handling |
| **Repositories** | Integration | Vitest + DB | CRUD correctness, soft delete, audit columns |
| **Server Actions** | Integration | Vitest + DB | Permission checks, validation, orchestration |
| **Client Components** | Component | Vitest + RTL | Renders, interactions, state changes |
| **Widgets** (with data hooks) | Component | Vitest + RTL + MSW | Loading/error/empty states |
| **Full user flows** | E2E | Playwright | Page navigation, form submission, auth |
| **Async Server Components** | E2E | Playwright | Cannot unit test — real browser only |
| **Middleware** | Unit + E2E | Vitest + Playwright | Logic + redirect behaviour |

### 8. Mock external boundaries, not internals

Mock what crosses a trust boundary: external APIs (MSW), databases (test DB or repository interface), email, file storage. Don't mock internal functions, domain objects, or utilities — let them run for real.

The more mocks, the less confidence. If you're mocking more than testing, you're testing the wrong thing.

### 9. Every test needs a reason to exist

Ask: *what would go wrong without this test?* If TypeScript catches it or an E2E test covers the path — don't write the unit test. Tests have maintenance cost.

### 10. Test data: Fishery factories, not inline literals

```typescript
import { Factory } from 'fishery';
import { faker } from '@faker-js/faker';

export const personaFactory = Factory.define<PersonaCreate>(() => ({
  name: faker.person.jobTitle(),
  buyingRole: faker.helpers.arrayElement(['champion', 'decision_maker', 'influencer']),
  description: faker.lorem.sentence(),
}));

// Usage
const persona = personaFactory.build({ name: 'AR Manager' });
const personas = personaFactory.buildList(5);
```

### 11. Hardening as final quality gate

After all scenarios pass individually, run the **FULL test suite** — not just this chapter's tests. Fix regressions. Iterate until 0 failures. Verify: `npm run build` clean, `tsc --noEmit` clean.

---

## Testing Stack

| Layer | Tool |
|---|---|
| Static analysis | TypeScript strict + ESLint |
| Unit / Integration | Vitest |
| Component | Vitest + React Testing Library |
| E2E | Playwright |
| API mocking | MSW v2 |
| Test data | Fishery + @faker-js/faker |
| Snapshot testing | **Do not use** |

---

## When NOT to Test

- **Trivial code** — a function returning a constant, a simple getter
- **Framework behaviour** — don't test that Next.js routing works
- **Implementation details** — internal state, private methods, call sequences
- **Things TypeScript catches** — type mismatches, missing fields
- **Duplicate coverage** — if E2E covers the path and code is simple, skip the unit test

---

## Banned Patterns

- Writing implementation before tests → tests first, always
- Proposing new tests without scanning existing ones → scan first
- `it.skip`, `test.todo`, or commented-out tests → write them failing
- Tests without Gherkin structure in integration/E2E → use `describe`/`it` labels
- Shared mutable state between tests → each test owns its data
- Tests that depend on execution order → every test passes in isolation
- `afterEach` cleanup as sole strategy → transaction rollback (integration) or timestamp rollback (E2E)
- Manual INSERT/DELETE for test data setup/teardown → use the isolation utility
- Inline test data literals → use Fishery factories
- Mocking internal collaborators → mock only external boundaries
- Snapshot testing → false confidence, rubber-stamped updates
- Running full suite mid-development → per-scenario during dev, suite at the end

---

## Quality Gate

- [ ] Existing test scan completed — keep/update/delete table presented
- [ ] Gherkin scenarios in `describe`/`it` labels (integration + E2E)
- [ ] Full vocabulary used where appropriate (And, But, Background, Scenario Outline, Rule)
- [ ] Tests committed failing before implementation
- [ ] No `it.skip`, `test.todo`, or commented-out tests
- [ ] Data isolation: no test depends on another's state
- [ ] Integration: transaction rollback per test
- [ ] E2E: per-worker database with 3-tier lifecycle
- [ ] Factory-based test data (Fishery + Faker)
- [ ] Full suite passes with 0 failures (hardening complete)

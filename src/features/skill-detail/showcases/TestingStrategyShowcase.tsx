'use client';
import { CodeBlock } from '@/platform/components/CodeBlock';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function TestingStrategyShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div
        style={{
          padding: 16,
          borderRadius: 8,
          background: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          marginBottom: 48,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>Companion Skills: </span>
        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          playwright-e2e (E2E patterns) &bull; quality-assurance (quality philosophy) &bull; verification-loop (build/lint/type checks)
        </span>
      </div>

      {/* ---- Testing Trophy ---- */}
      <Section title="The Testing Trophy">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          The testing trophy replaces the traditional pyramid. Integration tests form the largest layer because they
          provide the highest confidence per test. E2E effort is increasing as Playwright makes browser tests nearly
          as cheap as integration tests.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '24px 0' }}>
          {/* E2E tier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 500 }}>
            <div
              style={{
                width: 120,
                height: 56,
                background: 'var(--color-primary)',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>E2E</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>~40% effort</span>
          </div>
          {/* Component tier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 500 }}>
            <div
              style={{
                width: 200,
                height: 56,
                background: 'var(--color-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Component</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>~20% effort</span>
          </div>
          {/* Unit tier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 500 }}>
            <div
              style={{
                width: 300,
                height: 56,
                background: 'var(--color-info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Unit</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>~30% effort</span>
          </div>
          {/* Static tier */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', maxWidth: 500 }}>
            <div
              style={{
                width: 380,
                height: 48,
                background: 'var(--color-text-muted)',
                opacity: 0.6,
                borderRadius: '0 0 8px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Static Analysis</span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>Always on</span>
          </div>
        </div>
      </Section>

      {/* ---- Opinionated Stack ---- */}
      <Section title="The Opinionated Stack">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['Layer', 'Tool', 'Why'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--color-text-heading)', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { layer: 'Static Analysis', tool: 'TypeScript strict + ESLint', why: 'Always on. Catches type errors and code quality. Zero runtime cost.' },
                { layer: 'Unit / Integration', tool: 'Vitest', why: 'Jest-compatible API, native TS, 5-10x faster, Vite-powered watch.' },
                { layer: 'Component', tool: 'Vitest + React Testing Library', why: 'RTL tests what the user sees, not implementation details.' },
                { layer: 'E2E', tool: 'Playwright', why: 'Fastest CI, native parallelism, best Next.js support. Not Cypress.' },
                { layer: 'API Mocking', tool: 'MSW v2', why: 'Network-level intercept. Same mocks across unit, component, E2E.' },
                { layer: 'Test Data', tool: 'Fishery + @faker-js/faker', why: 'Typed factories with realistic data. .build() for unit, .buildList(n) for collections.' },
                { layer: 'Snapshot Testing', tool: 'Do not use', why: 'False confidence, rubber-stamped updates, breaks on irrelevant changes.' },
              ].map((row) => (
                <tr key={row.layer} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600, color: 'var(--color-text-heading)', whiteSpace: 'nowrap' }}>{row.layer}</td>
                  <td style={{ padding: '10px 16px', fontFamily: 'monospace', fontSize: 12, color: 'var(--color-primary)' }}>{row.tool}</td>
                  <td style={{ padding: '10px 16px', color: 'var(--color-text-muted)' }}>{row.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- Architecture Mapping ---- */}
      <Section title="What to Test Where">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Every type of code in the architecture has a specific testing approach. The table below maps code types to test levels, tools, and what to assert.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['Code Type', 'Test Level', 'Tool', 'What to Assert'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-heading)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'Domain Objects', level: 'Unit', tool: 'Vitest', assert: 'Invariants, state transitions, method behaviour' },
                { code: 'Pure Business Logic', level: 'Unit', tool: 'Vitest', assert: 'Input/output, edge cases, boundaries' },
                { code: 'Mappers', level: 'Unit', tool: 'Vitest', assert: 'Field mapping, null/missing fields' },
                { code: 'Use Cases', level: 'Unit / Integration', tool: 'Vitest', assert: 'Orchestration, errors, side effects' },
                { code: 'Server Actions', level: 'Unit', tool: 'Vitest', assert: 'Input validation (Zod), error translation' },
                { code: 'Client Components', level: 'Component', tool: 'Vitest + RTL', assert: 'Renders content, responds to interactions' },
                { code: 'Widgets (data hooks)', level: 'Component', tool: 'Vitest + RTL + MSW', assert: 'Loading/error/empty states, data display' },
                { code: 'Full User Flows', level: 'E2E', tool: 'Playwright', assert: 'Navigation, form submission, auth, rendering' },
                { code: 'Async Server Components', level: 'E2E', tool: 'Playwright', assert: 'Cannot unit test — real browser only' },
              ].map((row) => (
                <tr key={row.code} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: 'var(--color-text-heading)', whiteSpace: 'nowrap' }}>{row.code}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--color-text-body)' }}>{row.level}</td>
                  <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: 11, color: 'var(--color-primary)' }}>{row.tool}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>{row.assert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- Behaviour vs Implementation ---- */}
      <Section title="Behaviour Tests vs Implementation Tests">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          The &ldquo;unit&rdquo; in unit testing is a unit of behaviour, not a unit of code. Test what the system does,
          not how it does it internally.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* DO column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>&#10003;</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-success)' }}>Behaviour Test</span>
            </div>
            <CodeBlock language="ts" title="Behaviour test">{`test('publishing a skill creates a
published version', async () => {
  const skill = skillFactory.build({
    status: 'draft',
  });
  const result = await publishSkillUseCase(
    skill.id, userId,
  );

  expect(result.ok).toBe(true);
  expect(result.value.status)
    .toBe('published');
});`}</CodeBlock>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8, lineHeight: 1.5 }}>
              Tests the outcome. Survives refactoring. Provides real confidence.
            </p>
          </div>

          {/* DON'T column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>&times;</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-error)' }}>Implementation Test</span>
            </div>
            <CodeBlock language="ts" title="Implementation test">{`test('publishSkillUseCase calls
skillRepo.updateVersion', async () => {
  await publishSkillUseCase(
    skill.id, userId,
  );

  expect(skillRepo.updateVersion)
    .toHaveBeenCalledWith(
      skill.id,
      { status: 'published' },
    );
});`}</CodeBlock>
            <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 8, lineHeight: 1.5 }}>
              Tests internals. Breaks when you refactor. False confidence.
            </p>
          </div>
        </div>
      </Section>

      {/* ---- Mocking Boundaries ---- */}
      <Section title="Mocking Boundaries">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          Mock things that cross a trust boundary. Let internal collaborators run for real. The more mocks in a test,
          the less confidence it provides.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '16px 0' }}>
          {/* Internal zone */}
          <div
            style={{
              width: '100%',
              maxWidth: 560,
              border: '2px solid var(--color-success)',
              borderRadius: 12,
              padding: 24,
              position: 'relative',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: 20,
                background: 'var(--color-surface)',
                padding: '0 8px',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--color-success)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Let These Run for Real
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {['Domain Objects', 'Utility Functions', 'Mappers', 'Pure Business Logic', 'Value Objects'].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    background: 'var(--color-success)',
                    opacity: 0.15,
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', position: 'relative' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Boundary line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 560, marginBottom: 24 }}>
            <div style={{ flex: 1, borderTop: '2px dashed var(--color-warning)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>Trust Boundary</span>
            <div style={{ flex: 1, borderTop: '2px dashed var(--color-warning)' }} />
          </div>

          {/* External zone */}
          <div
            style={{
              width: '100%',
              maxWidth: 560,
              border: '2px solid var(--color-error)',
              borderRadius: 12,
              padding: 24,
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -10,
                left: 20,
                background: 'var(--color-surface)',
                padding: '0 8px',
                fontSize: 11,
                fontWeight: 700,
                color: 'var(--color-error)',
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Mock These (MSW / Test DB)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {['External APIs', 'Database', 'File Storage', 'Email Services', 'Third-Party SDKs'].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    background: 'var(--color-error)',
                    opacity: 0.15,
                    position: 'relative',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)', position: 'relative' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Test Data Factories ---- */}
      <Section title="Test Data Factories">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Use Fishery + Faker for consistent, realistic test data. Never use inline literals.
        </p>
        <CodeBlock language="ts" title="Test data factory">{`import { Factory } from 'fishery';
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

// Usage in tests
const skill = skillFactory.build({ title: 'Clean Architecture' });
const officialSkills = skillFactory.buildList(5, { isOfficial: true });`}</CodeBlock>
      </Section>

      {/* ---- MSW Handlers ---- */}
      <Section title="MSW — One Source of Truth">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          The same MSW handlers work across Vitest (unit/component), Playwright (E2E), and local dev.
          Network-level interception means no hand-rolled fetch mocks.
        </p>
        <CodeBlock language="ts" title="MSW handlers">{`import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/skills', () =>
    HttpResponse.json({
      skills: skillFactory.buildList(3),
    })
  ),
  http.post('/api/skills/:id/publish', () =>
    HttpResponse.json({
      success: true,
      version: '1.0.0',
    })
  ),
);

beforeAll(() => server.listen());
afterAll(() => server.close());`}</CodeBlock>
      </Section>

      {/* ---- When NOT to Test ---- */}
      <Section title="When NOT to Test">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { title: 'Trivial Code', desc: 'A function that returns a constant, a simple getter, a one-line mapping.' },
            { title: 'Framework Behaviour', desc: 'Don\'t test that Next.js routing works or that React re-renders on state change.' },
            { title: 'Implementation Details', desc: 'Internal state, private methods, specific function call sequences.' },
            { title: 'TypeScript Catches It', desc: 'Type mismatches, missing required fields, null safety — already covered by strict mode.' },
            { title: 'Duplicate Coverage', desc: 'If the E2E test exercises the path and the code is simple, skip the unit test.' },
            { title: 'Over-testing Threshold', desc: 'Going from 95% to 100% coverage often provides negative value.' },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                padding: 16,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-alt)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-error)', opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-error)' }}>&times;</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)' }}>{item.title}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- CI Pipeline ---- */}
      <Section title="CI Configuration">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Static + unit run in parallel (independent). E2E runs after build. E2E is sharded across 4 runners for speed.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { stage: 'Static', tools: 'TypeScript + ESLint', parallel: true, cmd: 'npm run typecheck && npm run lint' },
            { stage: 'Unit', tools: 'Vitest + Coverage', parallel: true, cmd: 'npx vitest run --coverage' },
            { stage: 'E2E', tools: 'Playwright (4 shards)', parallel: false, cmd: 'playwright test --shard=N/4' },
          ].map((s) => (
            <div
              key={s.stage}
              style={{
                padding: 20,
                borderRadius: 8,
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 4 }}>{s.stage}</div>
              <div style={{ fontSize: 12, color: 'var(--color-primary)', fontFamily: 'monospace', marginBottom: 8 }}>{s.tools}</div>
              <div
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 4,
                  display: 'inline-block',
                  background: s.parallel ? 'var(--color-success)' : 'var(--color-warning)',
                  opacity: 0.2,
                  color: 'var(--color-text-heading)',
                  fontWeight: 600,
                }}
              >
                {s.parallel ? 'Runs in parallel' : 'After build'}
              </div>
              <div style={{ marginTop: 12 }}>
                <CodeBlock language="bash">{s.cmd}</CodeBlock>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Banned Patterns ---- */}
      <Section title="Banned Patterns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Jest in new projects — use Vitest (same API, 5-10x faster)',
            'Cypress for E2E — use Playwright (faster, cheaper CI)',
            'Snapshot testing — false confidence, rubber-stamped updates',
            'Mocking internal collaborators — let domain objects run for real',
            'Testing implementation details — test inputs and outputs',
            'One-to-one test-to-file mapping — test behaviours that matter',
            'Tests without a reason to exist — if TypeScript or E2E covers it, skip',
            'Inline test data literals — use Fishery factories',
            'Different mock strategies per level — use MSW consistently',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0' }}>
              <span style={{ color: 'var(--color-error)', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>&times;</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

'use client';
import { CodeBlock } from '@/platform/components/CodeBlock';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

export function PlaywrightE2eShowcase() {
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
          testing-strategy (what to test where) &bull; quality-assurance (quality philosophy) &bull; verification-loop (build/lint/type checks)
        </span>
      </div>

      {/* ---- Test Structure Anatomy ---- */}
      <Section title="Test Structure Anatomy">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          A Playwright E2E test reads like a user story executed by a robot. Each test is independent, starts from a
          clean state, and tests user outcomes rather than page internals.
        </p>
        <div style={{ position: 'relative' }}>
          <CodeBlock language="ts" title="Arrange-Act-Assert pattern">{`test.describe('Skill Library', () => {
  test('search filters skills by title', async ({ page }) => {
    // 1. ARRANGE — navigate to the page
    const skills = new SkillsPage(page);
    await skills.goto();

    // 2. ACT — perform the user action
    await skills.search('architecture');

    // 3. ASSERT — verify the user outcome
    await expect(skills.skillCards).toHaveCount(2);
    await expect(page.getByText('Clean Architecture'))
      .toBeVisible();
  });
});`}</CodeBlock>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
            {[
              { label: 'ARRANGE', color: 'var(--color-info)', desc: 'Set up page state — navigate, authenticate, seed data' },
              { label: 'ACT', color: 'var(--color-warning)', desc: 'Perform user actions — click, type, navigate' },
              { label: 'ASSERT', color: 'var(--color-success)', desc: 'Verify outcomes — visible text, URL, element count' },
            ].map((step) => (
              <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    color: step.color,
                    width: 70,
                    flexShrink: 0,
                  }}
                >
                  {step.label}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{step.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---- Locator Strategy ---- */}
      <Section title="Locator Strategy — Priority Table">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Role-based locators are the default. They test what the user sees and enforce accessibility. Test IDs are a last resort.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                {['Priority', 'Locator', 'Example', 'When to Use'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 14px', color: 'var(--color-text-heading)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { pri: '1', locator: 'getByRole', example: "getByRole('button', { name: 'Publish' })", when: 'Buttons, links, headings, inputs with labels' },
                { pri: '2', locator: 'getByLabel', example: "getByLabel('Search skills')", when: 'Form inputs with associated labels' },
                { pri: '3', locator: 'getByText', example: "getByText('Published — v1.0.0')", when: 'Static content verification' },
                { pri: '4', locator: 'getByPlaceholder', example: "getByPlaceholder('Describe your idea')", when: 'Inputs without visible labels' },
                { pri: '5', locator: 'getByTestId', example: "getByTestId('canvas-editor')", when: 'Last resort — canvas, complex custom widgets' },
              ].map((row) => (
                <tr key={row.pri} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: row.pri === '5' ? 'var(--color-error)' : 'var(--color-success)',
                        opacity: row.pri === '5' ? 0.2 : 0.15 + Number(row.pri) * 0.05,
                        lineHeight: '24px',
                        textAlign: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'var(--color-text-heading)',
                      }}
                    >
                      {row.pri}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: 'var(--color-primary)', fontWeight: 600 }}>{row.locator}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 11, color: 'var(--color-text-muted)' }}>{row.example}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)', fontSize: 12 }}>{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---- Page Object Pattern ---- */}
      <Section title="Page Object Pattern">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          When multiple tests interact with the same page, extract a page object. Selector changes become a single-point fix.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Page Object</div>
            <CodeBlock language="ts" title="Page object">{`export class SkillsPage {
  readonly searchInput: Locator;
  readonly skillCards: Locator;

  constructor(private page: Page) {
    this.searchInput =
      page.getByLabel('Search skills');
    this.skillCards =
      page.getByRole('article');
  }

  async goto() {
    await this.page.goto('/skills');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(300);
  }

  async clickSkill(title: string) {
    await this.page.getByRole('link',
      { name: title }).click();
  }
}`}</CodeBlock>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>Test Using Page Object</div>
            <CodeBlock language="ts" title="Test using page object">{`test('search filters skills', async ({
  page,
}) => {
  const skills = new SkillsPage(page);
  await skills.goto();

  await skills.search('architecture');

  await expect(skills.skillCards)
    .toHaveCount(2);
  await expect(
    page.getByText('Clean Architecture')
  ).toBeVisible();
});

test('click navigates to detail', async ({
  page,
}) => {
  const skills = new SkillsPage(page);
  await skills.goto();
  await skills.clickSkill('Clean Arch');

  await expect(page)
    .toHaveURL(/\\/skills\\/clean/);
});`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Auth Fixture ---- */}
      <Section title="Authentication Fixture">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Don&apos;t log in through the UI in every test. Use a fixture that sets auth cookies directly. One dedicated
          test file exercises the actual login flow.
        </p>
        <CodeBlock language="ts" title="Auth fixture">{`// tests/fixtures/auth.ts
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set auth cookie directly — bypass login UI
    await context.addCookies([{
      name: 'auth-token',
      value: process.env.TEST_AUTH_TOKEN!,
      domain: 'localhost',
      path: '/',
    }]);

    await use(page);
    await context.close();
  },
});

// Usage in tests
test('admin can view audit log', async ({
  authenticatedPage: page,
}) => {
  await page.goto('/admin');
  await expect(
    page.getByRole('heading', { name: 'Audit Log' })
  ).toBeVisible();
});`}</CodeBlock>
      </Section>

      {/* ---- Assertions ---- */}
      <Section title="Web-First Assertions">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Playwright assertions auto-wait for conditions to be true. No manual waits needed. Never use <code style={{ fontFamily: 'monospace', background: 'var(--color-bg-alt)', padding: '2px 6px', borderRadius: 3 }}>waitForTimeout</code>.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>&#10003;</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success)' }}>Auto-waiting</span>
            </div>
            <CodeBlock language="ts" title="Auto-waiting assertions">{`await expect(
  page.getByRole('heading')
).toContainText('Published');

await expect(page)
  .toHaveURL(/\\/skills\\//);

await expect(locator)
  .toBeVisible();
await expect(locator)
  .toHaveCount(5);`}</CodeBlock>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>&times;</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-error)' }}>Manual waits (fragile)</span>
            </div>
            <CodeBlock language="ts" title="Fragile manual waits">{`// ❌ Fragile, slow, arbitrary
await page.waitForTimeout(2000);
expect(
  await page.textContent('h1')
).toContain('Published');

// ❌ Race condition
const text = await page.$eval(
  '.status', el => el.textContent
);
expect(text).toBe('Published');`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- CI Sharding Pipeline ---- */}
      <Section title="CI Pipeline — Build then Shard">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          E2E tests run against a production build, sharded across 4 runners for speed. Reports upload as artifacts on failure.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '16px 0', overflowX: 'auto' }}>
          {/* Build step */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
            <div
              style={{
                width: 100,
                padding: '16px 12px',
                borderRadius: 8,
                background: 'var(--color-info)',
                opacity: 0.15,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>npm run build</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>Production build</span>
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 20, color: 'var(--color-text-muted)', padding: '0 8px' }}>&rarr;</div>

          {/* Shard split */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 280 }}>
            {[1, 2, 3, 4].map((shard) => (
              <div key={shard} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: 6,
                    background: 'var(--color-primary)',
                    opacity: 0.1 + shard * 0.05,
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'monospace', color: 'var(--color-text-heading)' }}>
                    --shard={shard}/4
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div style={{ fontSize: 20, color: 'var(--color-text-muted)', padding: '0 8px' }}>&rarr;</div>

          {/* Merge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
            <div
              style={{
                width: 100,
                padding: '16px 12px',
                borderRadius: 8,
                background: 'var(--color-success)',
                opacity: 0.15,
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Merge reports</span>
            </div>
            <span style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4 }}>HTML artifacts</span>
          </div>
        </div>
      </Section>

      {/* ---- Visual Regression ---- */}
      <Section title="Visual Regression Testing">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Built-in <code style={{ fontFamily: 'monospace', background: 'var(--color-bg-alt)', padding: '2px 6px', borderRadius: 3 }}>toHaveScreenshot()</code> catches
          visual regressions that functional tests miss — spacing, colour shifts, layout breaks.
        </p>
        <CodeBlock language="ts" title="Visual regression tests">{`test('skill detail page matches baseline', async ({ page }) => {
  await page.goto('/skills/clean-architecture');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('skill-detail.png', {
    maxDiffPixelRatio: 0.01,  // allow 1% (anti-aliasing)
  });
});

// Mobile viewport
test('dashboard renders on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  await expect(page).toHaveScreenshot('dashboard-mobile.png');
});`}</CodeBlock>
        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { step: '1', label: 'First run creates baselines' },
            { step: '2', label: 'Subsequent runs compare diffs' },
            { step: '3', label: 'Exceeds threshold = test fails' },
            { step: '4', label: '--update-snapshots to accept' },
          ].map((s) => (
            <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  opacity: 0.2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                  flexShrink: 0,
                }}
              >
                {s.step}
              </div>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Flaky Test Management ---- */}
      <Section title="Flaky Test Management">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>Prevention</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Auto-waiting assertions', 'Role-based selectors', 'Isolated test state', 'No arbitrary delays'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-success)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-warning)', marginBottom: 8 }}>Detection</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['retries: 1 in CI', 'HTML reporter marks flaky', 'trace: on-first-retry', 'Pass on retry = flaky'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-warning)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: 20, borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-error)', marginBottom: 8 }}>Resolution</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Fix or delete in 1 week', 'Add proper waits', 'Isolate shared state', 'Disable CSS animations'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-error)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ---- Project Structure ---- */}
      <Section title="Project Structure">
        <CodeBlock language="text" title="Project structure">{`tests/
  e2e/
    auth.spec.ts               # login, logout, session flows
    skills.spec.ts             # skill browsing, detail, download
    project-generation.spec.ts # the generation flow
    admin.spec.ts              # admin-only features
  pages/
    SkillsPage.ts              # page object for /skills
    LoginPage.ts               # page object for /login
    GeneratePage.ts            # page object for /generate
  fixtures/
    auth.ts                    # authenticated context fixture
  playwright.config.ts`}</CodeBlock>
      </Section>

      {/* ---- Banned Patterns ---- */}
      <Section title="Banned Patterns">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'page.waitForTimeout(ms) — use auto-waiting assertions instead',
            'CSS selectors or XPath — use role-based locators',
            'data-testid as primary strategy — role-based first',
            'Login through UI in every test — use auth fixtures',
            'Tests depending on other tests\' state — each test is independent',
            'Ignoring flaky tests ("just retry") — fix in one week or delete',
            'Cypress — Playwright is faster, cheaper, better coverage',
            'Testing API responses in E2E — test user-visible outcomes',
            'Running E2E against dev server in CI — build first',
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

'use client';

/* ---- helpers ---- */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 20 }}>{title}</h2>
    {children}
  </section>
);

const CodeBlock = ({ children }: { children: string }) => (
  <pre
    style={{
      fontSize: 12,
      fontFamily: 'monospace',
      lineHeight: 1.8,
      padding: 16,
      borderRadius: 6,
      background: 'var(--color-bg-alt)',
      border: '1px solid var(--color-border)',
      overflow: 'auto',
    }}
  >
    {children}
  </pre>
);

/* ---- data ---- */

const connectionFlowSteps = [
  { step: 'App starts', detail: 'Next.js loads the db module on first import', icon: '1' },
  { step: 'neon() client', detail: '@neondatabase/serverless creates HTTP-based SQL executor', icon: '2' },
  { step: 'drizzle() wraps', detail: 'drizzle-orm/neon-http provides typed query builder over neon()', icon: '3' },
  { step: 'Query executes', detail: 'HTTP request to Neon — no persistent connection, no pool needed', icon: '4' },
  { step: 'Result typed', detail: 'Drizzle returns fully typed results matching schema definitions', icon: '5' },
];

const migrationWorkflow = [
  { step: 'Edit schema.ts', desc: 'Modify table definitions, add columns, create relations', color: 'var(--color-primary)' },
  { step: 'db:generate', desc: 'drizzle-kit generates SQL migration file from schema diff', color: 'var(--color-warning)' },
  { step: 'Review SQL', desc: 'Check generated migration in src/server/db/migrations/', color: 'var(--color-text-muted)' },
  { step: 'db:migrate', desc: 'Apply migration to Neon database', color: 'var(--color-primary)' },
  { step: 'Verify', desc: 'Use db:studio to inspect results in Drizzle Studio', color: 'var(--color-primary-muted)' },
];

const queryPatterns = [
  {
    name: 'Select with filter',
    code: `const officialSkills = await db
  .select()
  .from(skills)
  .where(eq(skills.isOfficial, true))
  .orderBy(desc(skills.createdAt));`,
  },
  {
    name: 'Select with relations',
    code: `const skill = await db.query.skills.findFirst({
  where: eq(skills.slug, "my-skill"),
  with: {
    author: true,
    versions: { limit: 1 },
  },
});`,
  },
  {
    name: 'Insert with returning',
    code: `const [newSkill] = await db
  .insert(skills)
  .values({
    slug: "new-skill",
    title: "New Skill",
    authorId: userId,
  })
  .returning();`,
  },
  {
    name: 'Transaction',
    code: `await db.transaction(async (tx) => {
  const [version] = await tx
    .insert(skillVersions)
    .values({ skillId, version: "1.0" })
    .returning();
  await tx.update(skills)
    .set({ currentVersionId: version.id })
    .where(eq(skills.id, skillId));
});`,
  },
];

const environments = [
  { env: 'Development', db: 'Neon free tier', notes: 'One project, 0.5 GB, autosuspend after 5 min' },
  { env: 'Local dev', db: 'Docker Postgres', notes: 'docker run -p 5432:5432 postgres:16' },
  { env: 'Staging', db: 'Neon branch', notes: 'Branch from production for isolated testing' },
  { env: 'Production', db: 'Neon Pro', notes: 'Autoscaling, no suspend, larger storage' },
];

export function DbNeonDrizzleShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> Read <strong>database-design</strong> first for schema design principles.
          This skill implements those concepts with Neon + Drizzle ORM. For caching, see <strong>db-redis</strong>.
          For file storage, see <strong>storage-vercel-blob</strong>.
        </p>
      </div>

      {/* ---- Connection Flow ---- */}
      <Section title="Connection Flow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Neon uses HTTP-based queries via @neondatabase/serverless. No persistent connections, no pool management — ideal for serverless.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {connectionFlowSteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '14px 20px',
                borderRadius: 8,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>{s.step}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <CodeBlock>{`import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });`}</CodeBlock>
        </div>
      </Section>

      {/* ---- Schema Definition Pattern ---- */}
      <Section title="Schema Definition Pattern">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Every table is a pgTable call with typed columns. Relations are defined separately for the query builder.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Table Definition</h4>
            <CodeBlock>{`export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: uuid("author_id").notNull()
    .references(() => users.id),
  isOfficial: boolean("is_official")
    .default(false).notNull(),
  createdAt: timestamp("created_at")
    .defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow().notNull(),
});`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-warning)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Relations</h4>
            <CodeBlock>{`export const skillsRelations = relations(
  skills,
  ({ one, many }) => ({
    author: one(users, {
      fields: [skills.authorId],
      references: [users.id],
    }),
    versions: many(skillVersions),
  })
);

// Enables:
// db.query.skills.findFirst({
//   with: { author: true, versions: true }
// });`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Migration Workflow ---- */}
      <Section title="Migration Workflow">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Schema changes flow through drizzle-kit. Generate a migration SQL file, review it, then apply.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {migrationWorkflow.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr',
                gap: 12,
                padding: '14px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeftWidth: 6,
                borderLeftColor: s.color,
                marginLeft: i * 16,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>{s.step}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{s.desc}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <CodeBlock>{`# package.json scripts
"db:generate": "drizzle-kit generate"
"db:migrate":  "drizzle-kit migrate"
"db:push":     "drizzle-kit push"     # dev only
"db:studio":   "drizzle-kit studio"
"db:seed":     "tsx src/server/db/seed.ts"`}</CodeBlock>
        </div>
      </Section>

      {/* ---- Query Builder Examples ---- */}
      <Section title="Query Builder Examples">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {queryPatterns.map((q) => (
            <div key={q.name}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{q.name}</h4>
              <CodeBlock>{q.code}</CodeBlock>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Environment Matrix ---- */}
      <Section title="Environment Setup">
        <div
          style={{
            borderRadius: 8,
            overflow: 'hidden',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '120px 180px 1fr',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Environment</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Database</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Notes</span>
          </div>
          {environments.map((item, i) => (
            <div
              key={item.env}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 180px 1fr',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>{item.env}</span>
              <span style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 500 }}>{item.db}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{item.notes}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Neon + Drizzle Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Connection & Schema',
              checks: [
                'Connection via @neondatabase/serverless + drizzle-orm/neon-http',
                'All tables defined in schema.ts with proper types and defaults',
                'Relations defined for all foreign key relationships',
                'drizzle.config.ts configured with schema path',
              ],
            },
            {
              category: 'Workflow & Data',
              checks: [
                'At least one migration generated and applied',
                'Seed script populates essential data',
                'Queries use query builder, not raw SQL for CRUD',
                'Transactions used for multi-step mutations',
              ],
            },
          ].map((group) => (
            <div key={group.category}>
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.category}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {group.checks.map((check) => (
                  <div
                    key={check}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 12px',
                      borderRadius: 6,
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: 4, border: '2px solid var(--color-primary)', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{check}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

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

const storageDecisionMatrix = [
  { need: 'Relational data, joins, transactions', use: 'SQL (Postgres, MySQL)', why: 'ACID, mature tooling, flexible queries', color: 'var(--color-primary)' },
  { need: 'Flexible schema, document-oriented', use: 'Document DB (Mongo, Firestore)', why: 'Schema evolution, nested data, fast reads', color: 'var(--color-secondary)' },
  { need: 'Key-value lookups, caching', use: 'Redis, Memcached', why: 'Sub-millisecond reads, TTL, atomic ops', color: 'var(--color-warning)' },
  { need: 'Full-text search', use: 'Elasticsearch, Meilisearch', why: 'Inverted index, relevance scoring', color: 'var(--color-text-muted)' },
  { need: 'Time-series data', use: 'TimescaleDB, InfluxDB', why: 'Optimized for append-heavy, time-windowed queries', color: 'var(--color-text-muted)' },
  { need: 'File metadata + blob', use: 'SQL + object storage', why: 'SQL for metadata, S3/Blob for binary content', color: 'var(--color-text-muted)' },
];

const normalizationLevels = [
  { level: '1NF', name: 'First Normal Form', rule: 'Eliminate repeating groups, atomic values only', example: 'tags TEXT[] instead of tag1, tag2, tag3 columns', status: 'Required' },
  { level: '2NF', name: 'Second Normal Form', rule: 'Remove partial dependencies on composite keys', example: 'Separate skill_tags junction table from skills', status: 'Required' },
  { level: '3NF', name: 'Third Normal Form', rule: 'Remove transitive dependencies', example: 'Category name lives in categories, not duplicated in skills', status: 'Recommended' },
  { level: 'BCNF', name: 'Boyce-Codd NF', rule: 'Every determinant is a candidate key', example: 'Resolve overlapping candidate keys in junction tables', status: 'As needed' },
  { level: 'Denorm', name: 'Denormalized View', rule: 'Materialize joins for read performance', example: 'Materialized view: skill + author + download count', status: 'Read-only' },
];

const indexingStrategies = [
  { type: 'B-tree (default)', useCase: 'Equality and range queries', columns: 'WHERE, JOIN ON, ORDER BY', note: 'Default index type in Postgres' },
  { type: 'Composite', useCase: 'Multi-column filters + sort', columns: 'Equality first, then range, then sort', note: 'Column order matters' },
  { type: 'Partial', useCase: 'Filtered subsets', columns: 'WHERE deletedAt IS NULL', note: 'Smaller index, faster scans' },
  { type: 'Covering', useCase: 'Avoid table lookups', columns: 'All columns the query reads', note: 'Index-only scans' },
  { type: 'GIN', useCase: 'Full-text search, JSONB', columns: 'tsvector, jsonb columns', note: 'Inverted index for containment' },
  { type: 'Unique', useCase: 'Enforce uniqueness', columns: 'email, slug, external IDs', note: 'Constraint + index in one' },
];

const migrationSteps = [
  { step: 'EXPAND', desc: 'Add new column (nullable or with default)', detail: 'No breaking change — old code still works', color: 'var(--color-primary)' },
  { step: 'MIGRATE', desc: 'Backfill data, deploy code that writes to both', detail: 'Data moves from old structure to new', color: 'var(--color-warning)' },
  { step: 'CONTRACT', desc: 'Remove old column after all code reads from new', detail: 'Separate deploy — never combine with expand', color: 'var(--color-primary-muted)' },
];

export function DatabaseDesignShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This is the conceptual foundation. For implementation, see{' '}
          <strong>db-neon-drizzle</strong> (Postgres + Drizzle ORM), <strong>db-supabase</strong> (Supabase platform),{' '}
          <strong>db-redis</strong> (caching layer), and <strong>file-storage</strong> (blob storage).
        </p>
      </div>

      {/* ---- SQL vs NoSQL vs Cache Decision Matrix ---- */}
      <Section title="Storage Decision Matrix">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Choose storage by access pattern, not by trend. Most applications need SQL as the primary store.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {storageDecisionMatrix.map((item) => (
            <div
              key={item.need}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeft: `5px solid ${item.color}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>{item.need}</div>
              <div style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, marginBottom: 6 }}>{item.use}</div>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{item.why}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Normalization Levels ---- */}
      <Section title="Normalization Levels">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Normalize for writes, denormalize for reads. The canonical data model is normalized. Read-heavy views can be denormalized.
        </p>
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
              gridTemplateColumns: '70px 180px 1fr 1fr 90px',
              background: 'var(--color-bg-alt)',
              borderBottom: '2px solid var(--color-border)',
              padding: '10px 16px',
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Level</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Name</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Rule</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)' }}>Example</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-heading)', textAlign: 'center' }}>Status</span>
          </div>
          {normalizationLevels.map((item, i) => (
            <div
              key={item.level}
              style={{
                display: 'grid',
                gridTemplateColumns: '70px 180px 1fr 1fr 90px',
                padding: '10px 16px',
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                borderBottom: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{item.level}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-heading)' }}>{item.name}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{item.rule}</span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{item.example}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 4,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  background: item.status === 'Required' ? 'var(--color-primary)' : item.status === 'Recommended' ? 'var(--color-warning)' : 'var(--color-text-muted)',
                  color: '#FFFFFF',
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Indexing Strategies ---- */}
      <Section title="Indexing Strategies">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Index for your queries, not your schema. Every slow query is a missing index. Every unused index is write overhead.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {indexingStrategies.map((idx) => (
            <div
              key={idx.type}
              style={{
                padding: 16,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 8 }}>{idx.type}</div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Use Case</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{idx.useCase}</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Columns</div>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{idx.columns}</span>
              </div>
              <code
                style={{
                  fontSize: 11,
                  padding: '4px 8px',
                  borderRadius: 4,
                  background: 'var(--color-bg-alt)',
                  color: 'var(--color-text-muted)',
                  display: 'block',
                }}
              >
                {idx.note}
              </code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Migration Workflow ---- */}
      <Section title="Zero-Downtime Migration (Expand-Migrate-Contract)">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Migrations are forward-only in production. Every destructive change is separated from the deploy that stops using it.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
          {migrationSteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 1fr',
                gap: 12,
                padding: '14px 20px',
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderLeftWidth: 6,
                borderLeftColor: s.color,
                marginLeft: i * 24,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>{s.step}</span>
              <span style={{ fontSize: 13, color: 'var(--color-text-body)' }}>{s.desc}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{s.detail}</span>
            </div>
          ))}
        </div>
        <CodeBlock>{`-- Step 1: EXPAND — add new column (nullable, no breaking change)
ALTER TABLE skills ADD COLUMN category_id uuid REFERENCES categories(id);

-- Step 2: MIGRATE — backfill data
UPDATE skills SET category_id = (
  SELECT id FROM categories WHERE name = skills.legacy_category
);

-- Step 3: CONTRACT — after all code reads from new column
ALTER TABLE skills DROP COLUMN legacy_category;`}</CodeBlock>
      </Section>

      {/* ---- Schema as Code ---- */}
      <Section title="Schema Design Patterns">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Every Table Needs</h4>
            <CodeBlock>{`const skills = pgTable('skills', {
  id:        uuid('id').primaryKey().defaultRandom(),
  // ... domain columns ...
  createdAt: timestamp('created_at')
               .defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
               .defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // soft delete
  createdBy: uuid('created_by')
               .references(() => users.id),
  updatedBy: uuid('updated_by')
               .references(() => users.id),
});`}</CodeBlock>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-warning)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audit Log (Append-Only)</h4>
            <CodeBlock>{`const auditLog = pgTable('audit_log', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').notNull(),
  action:    text('action').notNull(),
  entity:    text('entity').notNull(),
  entityId:  uuid('entity_id').notNull(),
  metadata:  jsonb('metadata'),
  createdAt: timestamp('created_at')
               .defaultNow().notNull(),
  // No updatedAt, no deletedAt
  // Append-only: never update or delete
});`}</CodeBlock>
          </div>
        </div>
      </Section>

      {/* ---- Quality Gate ---- */}
      <Section title="Database Design Quality Gate">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {[
            {
              category: 'Storage & Schema',
              checks: [
                'Primary store chosen based on access patterns',
                'All schema changes are versioned migrations',
                'Destructive migrations separated from code deploy',
                'Seed data creates a consistent dataset in <10s',
              ],
            },
            {
              category: 'Integrity & Performance',
              checks: [
                'Queries scanning large tables have indexes',
                'Soft-deleted records filtered from default queries',
                'Audit log captures who, what, when for mutations',
                'Connection pooling configured for deployment env',
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

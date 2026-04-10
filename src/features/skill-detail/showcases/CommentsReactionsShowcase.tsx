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
const threadedComments = [
  { id: 'c1', depth: 0, author: 'Alice Chen', body: 'This skill covers clean architecture really well. The layered approach makes testing straightforward.', time: '2h ago', deleted: false },
  { id: 'c2', depth: 1, author: 'Bob Smith', body: '@[Alice Chen](user-1) Agreed! The domain object pattern especially.', time: '1h ago', deleted: false },
  { id: 'c3', depth: 2, author: 'Carol Davis', body: 'The ACL mapper pattern is what made it click for me.', time: '45m ago', deleted: false },
  { id: 'c4', depth: 3, author: '[removed]', body: '', time: '30m ago', deleted: true },
  { id: 'c5', depth: 3, author: 'Eve Torres', body: 'Even with the deleted comment above, this thread still makes sense — that is the point of soft delete.', time: '15m ago', deleted: false },
];

const emojiPalette = [
  { emoji: '\uD83D\uDC4D', code: 'thumbs_up', count: 12, userReacted: true },
  { emoji: '\uD83D\uDC4E', code: 'thumbs_down', count: 2, userReacted: false },
  { emoji: '\u2764\uFE0F', code: 'heart', count: 8, userReacted: true },
  { emoji: '\uD83C\uDF89', code: 'celebrate', count: 5, userReacted: false },
  { emoji: '\uD83D\uDE15', code: 'confused', count: 1, userReacted: false },
  { emoji: '\uD83D\uDE80', code: 'rocket', count: 15, userReacted: true },
];

const mentionParsingSteps = [
  { step: 'Input', detail: 'User types @Al... and selects from autocomplete', output: '@[Alice Chen](user-uuid-1)' },
  { step: 'Regex parse', detail: 'Match /@\\[([^\\]]+)\\]\\(([a-f0-9-]+)\\)/g', output: '{ userId, offset, length }' },
  { step: 'Server validate', detail: 'Check user ID exists and is active in DB', output: 'Reject invalid, keep valid mentions' },
  { step: 'Store', detail: 'Save body text + structured MentionData[] array', output: 'mentions: [{ userId, offset, length }]' },
  { step: 'Render', detail: 'Replace mention syntax with styled <span> elements', output: '@Alice Chen (styled, clickable)' },
  { step: 'Notify', detail: 'Trigger notification for each valid mentioned user', output: '"Alice Chen mentioned you"' },
];

const schemaColumns = {
  comments: [
    { col: 'id', type: 'uuid PK', note: 'defaultRandom()' },
    { col: 'entity_type', type: 'text', note: "'skill' | 'showcase' | ..." },
    { col: 'entity_id', type: 'uuid', note: 'FK to any entity' },
    { col: 'parent_id', type: 'uuid?', note: 'null = top-level' },
    { col: 'author_id', type: 'uuid FK', note: 'references users.id' },
    { col: 'body', type: 'text', note: '1-2000 characters' },
    { col: 'mentions', type: 'jsonb', note: 'MentionData[]' },
    { col: 'deleted_at', type: 'timestamp?', note: 'Soft delete' },
  ],
  reactions: [
    { col: 'id', type: 'uuid PK', note: 'defaultRandom()' },
    { col: 'entity_type', type: 'text', note: 'Polymorphic' },
    { col: 'entity_id', type: 'uuid', note: 'FK to any entity' },
    { col: 'user_id', type: 'uuid FK', note: 'references users.id' },
    { col: 'emoji', type: 'text', note: 'thumbs_up | heart | ...' },
    { col: 'created_at', type: 'timestamp', note: 'defaultNow()' },
  ],
};

export function CommentsReactionsShowcase() {
  return (
    <div>
      {/* ---- Companion Skills ---- */}
      <div style={{ padding: 16, borderRadius: 8, background: 'var(--color-primary-muted)', border: '1px solid var(--color-border)', marginBottom: 32 }}>
        <p style={{ fontSize: 13, color: 'var(--color-text-body)', margin: 0 }}>
          <strong>Companion skills:</strong> This is the implementation skill for <strong>social-features</strong>.
          For activity feeds and notifications triggered by comments, see <strong>activity-notifications</strong>.
          For user lifecycle and GDPR erasure, see <strong>user-management</strong>.
        </p>
      </div>

      {/* ---- Threaded Comment Tree ---- */}
      <Section title="Threaded Comment Tree">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Any comment can be replied to at any depth. Visual indentation for the first 4 levels, then &quot;Continue thread&quot; for deeper nesting.
          Soft-deleted comments show a placeholder to preserve thread context.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {threadedComments.map((c) => (
            <div
              key={c.id}
              style={{
                marginLeft: Math.min(c.depth, 4) * 24,
                borderLeft: c.depth > 0 ? '2px solid var(--color-border)' : 'none',
                paddingLeft: c.depth > 0 ? 16 : 0,
              }}
            >
              {c.deleted ? (
                <div style={{ padding: 12, color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: 13, background: 'var(--color-bg-alt)', borderRadius: 8, border: '1px dashed var(--color-border)' }}>
                  [This comment was removed]
                </div>
              ) : (
                <div
                  style={{
                    padding: 16,
                    borderRadius: 8,
                    background: c.depth > 0 ? 'var(--color-bg-alt)' : 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-heading)' }}>{c.author}</span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
                    {c.body.includes('@[') ? (
                      <>
                        {c.body.split('@[')[0]}
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>@{c.body.match(/@\[([^\]]+)\]/)?.[1]}</span>
                        {c.body.split(/\(user-[^)]+\)/)[1]}
                      </>
                    ) : c.body}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Reaction Emoji Palette ---- */}
      <Section title="Reaction Emoji Palette">
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          Constrained set of 5-6 emoji. One reaction per type per user per entity (toggle on/off).
          Highlighted background shows the current user has reacted.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: 20, borderRadius: 8, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          {emojiPalette.map((r) => (
            <div
              key={r.code}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 20,
                fontSize: 14,
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                background: r.userReacted ? 'var(--color-primary-muted)' : 'var(--color-bg-alt)',
                color: r.userReacted ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: r.userReacted ? 600 : 400,
              }}
            >
              <span>{r.emoji}</span>
              <span style={{ fontSize: 13 }}>{r.count}</span>
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 12px',
              borderRadius: 20,
              fontSize: 14,
              border: '1px dashed var(--color-border)',
              color: 'var(--color-text-muted)',
              background: 'transparent',
            }}
          >
            +
          </div>
        </div>
      </Section>

      {/* ---- Mention Parsing Flow ---- */}
      <Section title="@Mention Parsing Flow">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {mentionParsingSteps.map((s, i) => (
            <div
              key={s.step}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr 1fr',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 6,
                background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>{s.step}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{s.detail}</span>
              <code style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace', background: 'var(--color-bg-alt)', padding: '4px 8px', borderRadius: 4 }}>{s.output}</code>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Schema Diagram ---- */}
      <Section title="Schema Diagram">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {Object.entries(schemaColumns).map(([table, columns]) => (
            <div key={table}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 12, fontFamily: 'monospace', textTransform: 'uppercase' }}>{table}</div>
              <div style={{ borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 100px 1fr',
                    background: 'var(--color-bg-alt)',
                    borderBottom: '2px solid var(--color-border)',
                    padding: '8px 12px',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)' }}>Column</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)' }}>Type</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-heading)' }}>Note</span>
                </div>
                {columns.map((col, i) => (
                  <div
                    key={col.col}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 100px 1fr',
                      padding: '6px 12px',
                      background: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg-alt)',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-heading)', fontFamily: 'monospace' }}>{col.col}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{col.type}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-body)' }}>{col.note}</span>
                  </div>
                ))}
              </div>
              {table === 'reactions' && (
                <div style={{ marginTop: 8, padding: 10, borderRadius: 6, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--color-warning)', fontWeight: 600 }}>UNIQUE INDEX:</span>
                  <code style={{ fontSize: 10, color: 'var(--color-text-muted)', marginLeft: 8 }}>(entity_type, entity_id, user_id, emoji)</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Edit / Delete Rules ---- */}
      <Section title="Edit & Delete Rules">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            {
              action: 'Edit Comment',
              who: 'Owner only',
              when: 'Within 15 minutes of posting',
              how: 'Re-parse mentions, update body + updatedAt',
              color: 'var(--color-primary)',
            },
            {
              action: 'Delete Comment',
              who: 'Owner or Admin',
              when: 'Any time',
              how: 'Soft delete (set deletedAt), show placeholder',
              color: 'var(--color-warning)',
            },
            {
              action: 'Toggle Reaction',
              who: 'Any authenticated user',
              when: 'Any time',
              how: 'Hard delete on remove, insert on add',
              color: 'var(--color-secondary)',
            },
          ].map((a) => (
            <div
              key={a.action}
              style={{
                padding: 20,
                borderRadius: 8,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderTop: `4px solid ${a.color}`,
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: 12 }}>{a.action}</div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Who: </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{a.who}</span>
              </div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>When: </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{a.when}</span>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>How: </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-body)' }}>{a.how}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ---- Server Action Pattern ---- */}
      <Section title="Server Action Pattern">
        <CodeBlock>{`export async function addComment(
  entityType: string,
  entityId: string,
  body: string,
  parentId?: string,
): Promise<Result<Comment, Error>> {
  // 1. Auth guard
  const session = await requireAuth();

  // 2. Validate body (1-2000 chars)
  if (!body.trim() || body.length > 2000)
    return Err(new ValidationError('1-2000 characters'));

  // 3. Validate parent exists (if reply)
  if (parentId) {
    const parent = await db.query.comments.findFirst({
      where: eq(comments.id, parentId),
    });
    if (!parent) return Err(new NotFoundError('Comment'));
  }

  // 4. Parse and validate mentions
  const mentions = await parseMentions(body);

  // 5. Insert comment
  const [comment] = await db.insert(comments)
    .values({ entityType, entityId, parentId,
              authorId: session.userId, body, mentions })
    .returning();

  // 6. Fire-and-forget notifications
  await notifyCommentCreated(comment, mentions);

  return Ok(comment);
}`}</CodeBlock>
      </Section>
    </div>
  );
}

---
name: comments-reactions
description: >
  Implementation patterns for polymorphic comments (threaded), emoji reactions,
  and @mentions in enterprise applications. Covers database schemas, server
  actions, mention parsing, and UI components. Apply when building any
  comment/feedback system. Implementation skill for social-features.
---

# Comments & Reactions

Implementation patterns for polymorphic comments, constrained emoji reactions, and @mentions. For principles and feature selection, see **social-features**. For activity feeds and notifications triggered by these features, see **activity-notifications**.

---

## When to Use

Apply this skill when:
- Adding comments to any entity (skills, showcases, projects, archetypes)
- Implementing emoji reactions on content
- Building @mention functionality in comment bodies
- Creating comment moderation tools for admins
- Implementing edit/delete flows for user-generated content

Do NOT use this skill for:
- Deciding whether to add social features — see **social-features**
- Activity feeds and notification delivery — see **activity-notifications**
- User profile or lifecycle management — see **user-management**

---

## Core Rules

### 1. Polymorphic comments schema

One table for all entity types. The `entity_type + entity_id` pair identifies what the comment is attached to. `parent_id` enables two-level threading (null = top-level, non-null = reply). `mentions` stores parsed mention data as structured JSON.

```ts
// ✅ Polymorphic comments — one table for all entities
export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(),     // 'skill' | 'showcase' | 'project'
  entityId: uuid('entity_id').notNull(),
  parentId: uuid('parent_id'),                    // null = top-level, uuid = reply
  authorId: uuid('author_id').notNull().references(() => users.id),
  body: text('body').notNull(),
  mentions: jsonb('mentions').$type<MentionData[]>().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),             // soft delete
}, (table) => ({
  entityIdx: index('comments_entity_idx').on(table.entityType, table.entityId),
  parentIdx: index('comments_parent_idx').on(table.parentId),
  authorIdx: index('comments_author_idx').on(table.authorId),
}));

type MentionData = { userId: string; offset: number; length: number };
```

Why polymorphic: adding comments to a new entity type requires zero schema changes — just pass a new `entity_type` string. Per-entity tables (skill_comments, project_comments) create N tables for N types and duplicate every query.

### 2. Polymorphic reactions schema

One reaction per emoji type per user per entity. The unique constraint prevents double-reacting. Hard delete on toggle-off (no soft delete for reactions — they carry no thread context).

```ts
// ✅ Reactions — unique per user + entity + emoji type
export const reactions = pgTable('reactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: text('entity_type').notNull(),
  entityId: uuid('entity_id').notNull(),
  userId: uuid('user_id').notNull().references(() => users.id),
  emoji: text('emoji').notNull(),                 // 'thumbs_up' | 'heart' | etc.
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueReaction: uniqueIndex('reactions_unique_idx')
    .on(table.entityType, table.entityId, table.userId, table.emoji),
  entityIdx: index('reactions_entity_idx').on(table.entityType, table.entityId),
}));

const VALID_EMOJI = ['thumbs_up', 'thumbs_down', 'heart', 'celebrate', 'confused', 'rocket'] as const;
type ReactionEmoji = typeof VALID_EMOJI[number];
```

### 3. Server action for adding comments

Auth guard first. Validate body length. Parse mentions. Enforce two-level threading (reject if parent is itself a reply). Create the comment. Trigger notifications for mentioned users and entity owner.

```ts
// ✅ Comment creation — validates, parses mentions, enforces threading depth
export async function addComment(
  entityType: string,
  entityId: string,
  body: string,
  parentId?: string,
): Promise<Result<Comment, ValidationError | AuthError | NotFoundError>> {
  const session = await requireAuth();
  if (!session) return Err(new AuthError('Not authenticated'));

  // Validate body
  if (!body.trim() || body.length > 2000)
    return Err(new ValidationError('Comment must be 1-2000 characters'));

  // Validate parent exists (unlimited threading depth — any comment can be replied to)
  if (parentId) {
    const parent = await db.query.comments.findFirst({
      where: eq(comments.id, parentId),
    });
    if (!parent) return Err(new NotFoundError('Comment', parentId));
  }

  // Parse and validate mentions
  const parsedMentions = await parseMentions(body);

  const [comment] = await db.insert(comments).values({
    entityType, entityId, parentId: parentId ?? null,
    authorId: session.userId, body,
    mentions: parsedMentions,
  }).returning();

  // Trigger notifications (fire-and-forget)
  await notifyCommentCreated(comment, parsedMentions);

  return Ok(comment);
}
```

### 4. Mention parsing

Mentions follow the format `@[Display Name](user-id)`. Parse with regex, validate each user ID exists and is active, store structured data. Render mentions as styled spans in the UI.

```ts
// ✅ Parse mentions from body text
const MENTION_REGEX = /@\[([^\]]+)\]\(([a-f0-9-]+)\)/g;

async function parseMentions(body: string): Promise<MentionData[]> {
  const mentions: MentionData[] = [];
  let match: RegExpExecArray | null;

  while ((match = MENTION_REGEX.exec(body)) !== null) {
    const userId = match[2];
    // Validate user exists and is active
    const user = await db.query.users.findFirst({
      where: and(eq(users.id, userId), isNull(users.deletedAt)),
    });
    if (user) {
      mentions.push({
        userId,
        offset: match.index,
        length: match[0].length,
      });
    }
  }
  return mentions;
}

// ✅ Render mentions as styled spans
function renderBodyWithMentions(body: string, mentions: MentionData[]): React.ReactNode {
  if (!mentions.length) return body;
  // Replace @[Name](id) with styled spans, working backwards to preserve offsets
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  for (const m of mentions.sort((a, b) => a.offset - b.offset)) {
    parts.push(body.slice(lastIndex, m.offset));
    const mentionText = body.slice(m.offset, m.offset + m.length);
    const name = mentionText.match(/@\[([^\]]+)\]/)?.[1] ?? '';
    parts.push(
      <span key={m.offset} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
        @{name}
      </span>
    );
    lastIndex = m.offset + m.length;
  }
  parts.push(body.slice(lastIndex));
  return <>{parts}</>;
}
```

### 5. Comment thread UI pattern

Fetch top-level comments, then nest replies underneath. Indent replies with left padding. Show soft-deleted comments as placeholders. Reply toggle opens an inline compose box.

```tsx
// ✅ Thread rendering — top-level + indented replies
function CommentThread({ comments }: { comments: CommentWithReplies[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentItem comment={comment} />
          {comment.replies.length > 0 && (
            <div style={{ marginLeft: 32, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ✅ Soft-deleted comment placeholder
function CommentItem({ comment, isReply }: { comment: Comment; isReply?: boolean }) {
  if (comment.deletedAt) {
    return (
      <div style={{ padding: 12, color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: 13 }}>
        [This comment was removed]
      </div>
    );
  }
  return (
    <div style={{
      padding: 16, borderRadius: 8,
      background: isReply ? 'var(--color-surface-alt)' : 'var(--color-surface)',
      border: '1px solid var(--color-border)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-heading)' }}>
          {comment.authorName}
        </span>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          {formatRelativeTime(comment.createdAt)}
        </span>
      </div>
      <div style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6 }}>
        {renderBodyWithMentions(comment.body, comment.mentions)}
      </div>
    </div>
  );
}
```

### 6. Reaction UI pattern

Display aggregated counts per emoji. Highlight emoji the current user has reacted with. Toggle on click — add or remove the reaction.

```tsx
// ✅ Reaction bar — aggregated counts with toggle
function ReactionBar({ entityType, entityId, reactions, currentUserId }: ReactionBarProps) {
  const grouped = groupReactions(reactions); // { thumbs_up: { count: 5, userReacted: true }, ... }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {VALID_EMOJI.map((emoji) => {
        const data = grouped[emoji];
        if (!data?.count && !showAll) return null;
        return (
          <button
            key={emoji}
            onClick={() => toggleReaction(entityType, entityId, emoji)}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '4px 8px', borderRadius: 16, fontSize: 13, cursor: 'pointer',
              border: '1px solid var(--color-border)',
              background: data?.userReacted ? 'var(--color-primary-muted)' : 'var(--color-surface)',
              color: data?.userReacted ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}
          >
            <span>{EMOJI_DISPLAY[emoji]}</span>
            {data?.count ? <span>{data.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
```

### 7. Fetching threaded comments

Two-query approach: fetch top-level comments for the entity, then fetch all replies for those comment IDs. Assemble in application code. This avoids recursive CTEs and keeps the query plan simple.

```ts
// ✅ Two-query fetch — top-level + replies, assembled in app code
async function getThreadedComments(
  entityType: string,
  entityId: string,
): Promise<CommentWithReplies[]> {
  // Query 1: top-level comments (parentId is null)
  const topLevel = await db.query.comments.findMany({
    where: and(
      eq(comments.entityType, entityType),
      eq(comments.entityId, entityId),
      isNull(comments.parentId),
    ),
    orderBy: [asc(comments.createdAt)],
    with: { author: { columns: { id: true, displayName: true, avatarUrl: true } } },
  });

  if (!topLevel.length) return [];

  // Query 2: all replies to these top-level comments
  const topLevelIds = topLevel.map((c) => c.id);
  const replies = await db.query.comments.findMany({
    where: and(
      inArray(comments.parentId, topLevelIds),
    ),
    orderBy: [asc(comments.createdAt)],
    with: { author: { columns: { id: true, displayName: true, avatarUrl: true } } },
  });

  // Assemble
  const replyMap = new Map<string, typeof replies>();
  for (const reply of replies) {
    const existing = replyMap.get(reply.parentId!) ?? [];
    existing.push(reply);
    replyMap.set(reply.parentId!, existing);
  }

  return topLevel.map((c) => ({ ...c, replies: replyMap.get(c.id) ?? [] }));
}
```

### 8. Editing and deleting

Owner can edit their own comment within 15 minutes of posting. Owner and admin can soft delete. All mutations create audit log entries.

```ts
// ✅ Edit — owner only, within 15 minutes
export async function editComment(
  commentId: string,
  newBody: string,
): Promise<Result<Comment, ValidationError | AuthError | NotFoundError>> {
  const session = await requireAuth();
  const comment = await db.query.comments.findFirst({ where: eq(comments.id, commentId) });
  if (!comment) return Err(new NotFoundError('Comment', commentId));
  if (comment.authorId !== session.userId)
    return Err(new AuthError('Can only edit your own comments'));

  const ageMinutes = (Date.now() - comment.createdAt.getTime()) / 60_000;
  if (ageMinutes > 15)
    return Err(new ValidationError('Comments can only be edited within 15 minutes'));

  if (!newBody.trim() || newBody.length > 2000)
    return Err(new ValidationError('Comment must be 1-2000 characters'));

  const newMentions = await parseMentions(newBody);
  const [updated] = await db.update(comments)
    .set({ body: newBody, mentions: newMentions, updatedAt: new Date() })
    .where(eq(comments.id, commentId))
    .returning();

  await logAudit('comment', commentId, 'updated', session.userId, {
    previousBody: comment.body,
  });

  return Ok(updated);
}

// ✅ Delete — owner or admin, soft delete
export async function deleteComment(
  commentId: string,
): Promise<Result<void, AuthError | NotFoundError>> {
  const session = await requireAuth();
  const comment = await db.query.comments.findFirst({ where: eq(comments.id, commentId) });
  if (!comment) return Err(new NotFoundError('Comment', commentId));

  const isOwner = comment.authorId === session.userId;
  const isAdmin = session.role === 'admin';
  if (!isOwner && !isAdmin)
    return Err(new AuthError('Only the author or an admin can delete comments'));

  await db.update(comments)
    .set({ deletedAt: new Date() })
    .where(eq(comments.id, commentId));

  await logAudit('comment', commentId, 'deleted', session.userId, {
    deletedBy: isAdmin ? 'admin' : 'owner',
  });

  return Ok(undefined);
}
```

### 9. Toggle reaction server action

Check if the user already reacted with this emoji. If yes, remove it (hard delete). If no, add it. Validate emoji is in the allowed set.

```ts
// ✅ Toggle — add or remove a reaction
export async function toggleReaction(
  entityType: string,
  entityId: string,
  emoji: string,
): Promise<Result<{ added: boolean }, ValidationError | AuthError>> {
  const session = await requireAuth();

  if (!VALID_EMOJI.includes(emoji as ReactionEmoji))
    return Err(new ValidationError(`Invalid emoji: ${emoji}`));

  const existing = await db.query.reactions.findFirst({
    where: and(
      eq(reactions.entityType, entityType),
      eq(reactions.entityId, entityId),
      eq(reactions.userId, session.userId),
      eq(reactions.emoji, emoji),
    ),
  });

  if (existing) {
    await db.delete(reactions).where(eq(reactions.id, existing.id));
    return Ok({ added: false });
  }

  await db.insert(reactions).values({
    entityType, entityId, userId: session.userId, emoji,
  });

  return Ok({ added: true });
}
```

---

## Banned Patterns

- ❌ Separate comment/reaction tables per entity type → use polymorphic `entity_type + entity_id`
- ❌ Allowing replies to replies (3+ nesting levels) → reject if `parent.parentId !== null`
- ❌ Accepting arbitrary emoji strings → validate against `VALID_EMOJI` array
- ❌ Trusting client-provided mention user IDs → validate each user exists and is active
- ❌ Recursive CTEs for threaded comments → use two-query approach (top-level + replies)
- ❌ Hard deleting comments → soft delete with `deletedAt`, show placeholder
- ❌ Allowing edits after 15 minutes → enforce time window server-side
- ❌ Comment creation without auth guard → always `requireAuth()` first
- ❌ Storing mentions as plain text only → store structured `MentionData[]` alongside body
- ❌ Multiple reactions of same emoji type per user per entity → enforce unique constraint

---

## Quality Gate

Before delivering, verify:

- [ ] Comments table uses polymorphic `entity_type + entity_id` with composite index
- [ ] Reactions table has unique constraint on `(entity_type, entity_id, user_id, emoji)`
- [ ] Two-level threading is enforced — server rejects replies to replies
- [ ] Mentions are parsed with regex and validated server-side before storage
- [ ] Comment body length is validated (1-2000 characters)
- [ ] Edit is restricted to owner within 15-minute window
- [ ] Delete is soft (sets `deletedAt`) for comments, hard for reactions
- [ ] All mutations require authentication and create audit log entries
- [ ] UI renders soft-deleted comments as "[This comment was removed]" placeholder
- [ ] Reaction toggle correctly adds or removes based on existing state
- [ ] Emoji set is constrained to the predefined 5-6 shortcodes
- [ ] Comment fetch uses two-query approach, not recursive CTE

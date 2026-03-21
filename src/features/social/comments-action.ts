'use server';

import { eq, and, asc, isNull } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { comments, users } from '@/platform/db/schema';
import { type Result, Ok, Err, ValidationError, NotFoundError, AuthError } from '@/platform/lib/result';

function getDb() {
  if (!process.env.DATABASE_URL) return null;
  const s = neon(process.env.DATABASE_URL);
  return drizzle(s);
}

export interface CommentData {
  id: string;
  entityType: string;
  entityId: string;
  parentId: string | null;
  authorId: string;
  authorName: string;
  authorEmail: string;
  body: string;
  mentions: { userId: string; offset: number; length: number }[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  replies: CommentData[];
}

/** Parse @mentions from body using the format @[Name](userId) */
function parseMentions(body: string): { userId: string; offset: number; length: number }[] {
  const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;
  const mentions: { userId: string; offset: number; length: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(body)) !== null) {
    mentions.push({
      userId: match[2],
      offset: match.index,
      length: match[0].length,
    });
  }
  return mentions;
}

// buildCommentTree moved to comment-utils.ts (non-server-action file)

export async function addComment(
  entityType: string,
  entityId: string,
  body: string,
  userId: string,
  parentId?: string | null,
): Promise<Result<CommentData, ValidationError | NotFoundError | AuthError>> {
  const trimmed = body.trim();
  if (trimmed.length < 1 || trimmed.length > 2000) {
    return Err(new ValidationError('INVALID_BODY', 'Comment body must be between 1 and 2000 characters'));
  }

  const db = getDb();
  if (!db) {
    return Err(new ValidationError('NO_DB', 'Database not available'));
  }

  // Verify parent exists if provided
  if (parentId) {
    const parentRows = await db.select({ id: comments.id }).from(comments).where(eq(comments.id, parentId));
    if (parentRows.length === 0) {
      return Err(new NotFoundError('Comment', parentId));
    }
  }

  // Parse mentions
  const mentions = parseMentions(trimmed);

  // Validate mentioned user IDs exist
  if (mentions.length > 0) {
    for (const mention of mentions) {
      const userRows = await db.select({ id: users.id }).from(users).where(eq(users.id, mention.userId));
      if (userRows.length === 0) {
        console.warn(`[comments] Mentioned user ${mention.userId} not found, skipping mention validation`);
      }
    }
  }

  // Insert comment
  const now = new Date();
  const rows = await db
    .insert(comments)
    .values({
      entityType,
      entityId,
      parentId: parentId ?? null,
      authorId: userId,
      body: trimmed,
      mentions,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  const inserted = rows[0];
  if (!inserted) {
    return Err(new ValidationError('INSERT_FAILED', 'Failed to insert comment'));
  }

  // Fetch author info
  const authorRows = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, userId));
  const author = authorRows[0] ?? { name: 'Unknown', email: '' };

  console.log(`[comments] New comment by ${author.name} on ${entityType}:${entityId}${parentId ? ` (reply to ${parentId})` : ''}`);

  const commentData: CommentData = {
    id: inserted.id,
    entityType: inserted.entityType,
    entityId: inserted.entityId,
    parentId: inserted.parentId,
    authorId: inserted.authorId,
    authorName: author.name,
    authorEmail: author.email,
    body: inserted.body,
    mentions: (inserted.mentions ?? []) as { userId: string; offset: number; length: number }[],
    createdAt: inserted.createdAt.toISOString(),
    updatedAt: inserted.updatedAt.toISOString(),
    deletedAt: null,
    replies: [],
  };

  return Ok(commentData);
}

export async function getComments(
  entityType: string,
  entityId: string,
): Promise<Result<CommentData[], Error>> {
  const db = getDb();
  if (!db) {
    return Ok([]);
  }

  try {
    const rows = await db
      .select({
        id: comments.id,
        entityType: comments.entityType,
        entityId: comments.entityId,
        parentId: comments.parentId,
        authorId: comments.authorId,
        body: comments.body,
        mentions: comments.mentions,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        deletedAt: comments.deletedAt,
        authorName: users.name,
        authorEmail: users.email,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(
        and(
          eq(comments.entityType, entityType),
          eq(comments.entityId, entityId),
        ),
      )
      .orderBy(asc(comments.createdAt));

    const result: CommentData[] = rows.map((r) => ({
      id: r.id,
      entityType: r.entityType,
      entityId: r.entityId,
      parentId: r.parentId,
      authorId: r.authorId,
      authorName: r.authorName ?? 'Unknown',
      authorEmail: r.authorEmail ?? '',
      body: r.body,
      mentions: (r.mentions ?? []) as { userId: string; offset: number; length: number }[],
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      deletedAt: r.deletedAt?.toISOString() ?? null,
      replies: [],
    }));

    return Ok(result);
  } catch (err) {
    console.error('[comments] getComments failed:', err);
    return Ok([]);
  }
}

export async function editComment(
  commentId: string,
  body: string,
  userId: string,
): Promise<Result<CommentData, ValidationError | NotFoundError | AuthError>> {
  const trimmed = body.trim();
  if (trimmed.length < 1 || trimmed.length > 2000) {
    return Err(new ValidationError('INVALID_BODY', 'Comment body must be between 1 and 2000 characters'));
  }

  const db = getDb();
  if (!db) {
    return Err(new ValidationError('NO_DB', 'Database not available'));
  }

  // Fetch the comment
  const existing = await db
    .select({
      id: comments.id,
      authorId: comments.authorId,
      createdAt: comments.createdAt,
      entityType: comments.entityType,
      entityId: comments.entityId,
      parentId: comments.parentId,
      deletedAt: comments.deletedAt,
    })
    .from(comments)
    .where(eq(comments.id, commentId));

  if (existing.length === 0) {
    return Err(new NotFoundError('Comment', commentId));
  }

  const comment = existing[0];

  // Verify ownership
  if (comment.authorId !== userId) {
    return Err(new AuthError('NOT_OWNER', 'You can only edit your own comments'));
  }

  // Verify 15-minute edit window
  const fifteenMinutes = 15 * 60 * 1000;
  const elapsed = Date.now() - comment.createdAt.getTime();
  if (elapsed > fifteenMinutes) {
    return Err(new ValidationError('EDIT_WINDOW_EXPIRED', 'Comments can only be edited within 15 minutes of posting'));
  }

  // Parse new mentions
  const mentions = parseMentions(trimmed);
  const now = new Date();

  const updated = await db
    .update(comments)
    .set({ body: trimmed, mentions, updatedAt: now })
    .where(eq(comments.id, commentId))
    .returning();

  const row = updated[0];
  if (!row) {
    return Err(new ValidationError('UPDATE_FAILED', 'Failed to update comment'));
  }

  // Fetch author info
  const authorRows = await db.select({ name: users.name, email: users.email }).from(users).where(eq(users.id, userId));
  const author = authorRows[0] ?? { name: 'Unknown', email: '' };

  return Ok({
    id: row.id,
    entityType: row.entityType,
    entityId: row.entityId,
    parentId: row.parentId,
    authorId: row.authorId,
    authorName: author.name,
    authorEmail: author.email,
    body: row.body,
    mentions: (row.mentions ?? []) as { userId: string; offset: number; length: number }[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    deletedAt: row.deletedAt?.toISOString() ?? null,
    replies: [],
  });
}

export async function deleteComment(
  commentId: string,
  userId: string,
  isAdmin: boolean = false,
): Promise<Result<{ success: boolean }, NotFoundError | AuthError>> {
  const db = getDb();
  if (!db) {
    return Err(new AuthError('NO_DB', 'Database not available'));
  }

  // Fetch the comment
  const existing = await db
    .select({ id: comments.id, authorId: comments.authorId })
    .from(comments)
    .where(eq(comments.id, commentId));

  if (existing.length === 0) {
    return Err(new NotFoundError('Comment', commentId));
  }

  const comment = existing[0];

  // Verify ownership or admin
  if (comment.authorId !== userId && !isAdmin) {
    return Err(new AuthError('NOT_AUTHORIZED', 'Only the comment author or an admin can delete this comment'));
  }

  // Soft delete
  await db
    .update(comments)
    .set({ deletedAt: new Date() })
    .where(eq(comments.id, commentId));

  return Ok({ success: true });
}

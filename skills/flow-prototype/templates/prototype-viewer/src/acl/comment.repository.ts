import { getDb } from '../db/client';
import { Comment } from '../domain/Comment';
import { toComment, fromComment } from './comment.mapper';

export async function getComments(projectSlug: string, prototypeSlug: string): Promise<Comment[]> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT id, project_slug, prototype_slug, text, author, created_at FROM comments WHERE project_slug = ? AND prototype_slug = ? ORDER BY created_at ASC',
    args: [projectSlug, prototypeSlug],
  });
  return result.rows.map((row) =>
    toComment({
      id: row.id as string,
      text: row.text as string,
      author: row.author as string,
      created_at: row.created_at as string,
    }),
  );
}

export async function addComment(
  projectSlug: string,
  prototypeSlug: string,
  comment: Comment,
): Promise<Comment> {
  const db = getDb();
  const raw = fromComment(comment);
  await db.execute({
    sql: 'INSERT INTO comments (id, project_slug, prototype_slug, text, author, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    args: [raw.id, projectSlug, prototypeSlug, raw.text, raw.author, raw.created_at],
  });
  return comment;
}

export async function deleteComment(id: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute({
    sql: 'DELETE FROM comments WHERE id = ?',
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function getCommentCount(projectSlug: string, prototypeSlug: string): Promise<number> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT COUNT(*) as cnt FROM comments WHERE project_slug = ? AND prototype_slug = ?',
    args: [projectSlug, prototypeSlug],
  });
  return Number(result.rows[0].cnt);
}

import { Comment } from '../domain/Comment';

/** Shape of a row coming back from the SQLite comments table (snake_case columns). */
export interface RawComment {
  id: string;
  text: string;
  author: string;
  created_at: string;
}

export function toComment(raw: RawComment): Comment {
  return new Comment(
    raw.id,
    raw.text,
    raw.author,
    new Date(raw.created_at),
  );
}

export function fromComment(comment: Comment): RawComment {
  return {
    id: comment.id,
    text: comment.text,
    author: comment.author,
    created_at: comment.createdAt.toISOString(),
  };
}

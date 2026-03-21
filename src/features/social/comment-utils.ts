import type { CommentData } from './comments-action';

/** Build a nested comment tree from a flat array */
export function buildCommentTree(flatComments: CommentData[]): CommentData[] {
  const map = new Map<string, CommentData>();
  const roots: CommentData[] = [];

  for (const comment of flatComments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of flatComments) {
    const node = map.get(comment.id)!;
    if (comment.parentId === null) {
      roots.push(node);
    } else {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.replies.push(node);
      } else {
        roots.push(node);
      }
    }
  }

  return roots;
}

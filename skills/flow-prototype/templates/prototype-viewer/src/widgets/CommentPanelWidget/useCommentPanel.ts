'use client';

import { useState, useEffect, useCallback } from 'react';
import { Comment } from '../../domain/Comment';
import { toComment, RawComment } from '../../acl/comment.mapper';

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export interface UseCommentPanelProps {
  projectSlug: string;
  prototypeSlug: string;
  open: boolean;
}

export interface UseCommentPanelReturn {
  comments: Comment[];
  loading: boolean;
  fetchComments: () => Promise<void>;
  addComment: (text: string, author: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
}

// ------------------------------------------------------------
// Hook
// ------------------------------------------------------------

export function useCommentPanel({
  projectSlug,
  prototypeSlug,
  open,
}: UseCommentPanelProps): UseCommentPanelReturn {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const commentKey = `${projectSlug}/${prototypeSlug}`;

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?key=${encodeURIComponent(commentKey)}`);
      const data: RawComment[] = await res.json();
      setComments(data.map(toComment));
    } catch (err) {
      console.error('[useCommentPanel] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [commentKey]);

  // Fetch comments when panel opens
  useEffect(() => {
    if (open) {
      void fetchComments();
    }
  }, [open, fetchComments]);

  const addComment = useCallback(
    async (text: string, author: string) => {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: commentKey, text: text.trim(), author: author.trim() }),
      });
      await fetchComments();
    },
    [commentKey, fetchComments],
  );

  const deleteComment = useCallback(
    async (id: string) => {
      await fetch('/api/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: commentKey, id }),
      });
      await fetchComments();
    },
    [commentKey, fetchComments],
  );

  return { comments, loading, fetchComments, addComment, deleteComment };
}

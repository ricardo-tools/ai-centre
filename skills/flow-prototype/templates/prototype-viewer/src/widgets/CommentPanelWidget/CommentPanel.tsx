'use client';

import { useCommentPanel } from './useCommentPanel';
import CommentPanelLG from './CommentPanelLG';

// ------------------------------------------------------------
// Props — same interface as the old component for drop-in replacement
// ------------------------------------------------------------

export interface CommentPanelProps {
  projectSlug: string;
  prototypeSlug: string;
  open: boolean;
  onClose: () => void;
}

// ------------------------------------------------------------
// Widget entry point — wires hook to presentation
// ------------------------------------------------------------

export default function CommentPanel({
  projectSlug,
  prototypeSlug,
  open,
  onClose,
}: CommentPanelProps) {
  const { comments, loading, addComment, deleteComment } = useCommentPanel({
    projectSlug,
    prototypeSlug,
    open,
  });

  return (
    <CommentPanelLG
      open={open}
      onClose={onClose}
      comments={comments}
      loading={loading}
      onAddComment={addComment}
      onDeleteComment={deleteComment}
    />
  );
}

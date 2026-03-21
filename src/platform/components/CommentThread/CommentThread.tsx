'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatCircle, PencilSimple, Trash, ArrowBendDownRight } from '@phosphor-icons/react';
import {
  addComment,
  getComments,
  editComment,
  deleteComment,
  type CommentData,
} from '@/features/social/comments-action';
import { buildCommentTree } from '@/features/social/comment-utils';

interface CommentThreadProps {
  entityType: string;
  entityId: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

/** Format a relative timestamp like "2 hours ago", "just now", etc. */
function relativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

/** Max nesting depth before collapsing (desktop) */
const MAX_DEPTH_LG = 4;
/** Max nesting depth on mobile */
const MAX_DEPTH_SM = 2;

function CommentComposer({
  placeholder,
  onSubmit,
  onCancel,
  autoFocus,
}: {
  placeholder: string;
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
  autoFocus?: boolean;
}) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = useCallback(async () => {
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(body.trim());
      setBody('');
    } finally {
      setSubmitting(false);
    }
  }, [body, submitting, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        maxLength={2000}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 6,
          border: '1px solid var(--color-border)',
          background: 'var(--color-bg)',
          color: 'var(--color-text-body)',
          fontSize: 14,
          fontFamily: 'inherit',
          lineHeight: 1.6,
          resize: 'vertical',
          minHeight: 72,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={handleSubmit}
          disabled={!body.trim() || submitting}
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            background: body.trim() ? 'var(--color-primary)' : 'var(--color-border)',
            color: body.trim() ? '#FFFFFF' : 'var(--color-text-muted)',
            fontSize: 13,
            fontWeight: 600,
            cursor: body.trim() && !submitting ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Posting...' : 'Post'}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
        )}
        <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
          {body.length}/2000
        </span>
      </div>
    </div>
  );
}

function CommentNode({
  comment,
  depth,
  maxDepth,
  currentUserId,
  isAdmin,
  onReply,
  onEdit,
  onDelete,
  replyingTo,
  editingId,
  onSubmitReply,
  onSubmitEdit,
  onCancelReply,
  onCancelEdit,
}: {
  comment: CommentData;
  depth: number;
  maxDepth: number;
  currentUserId?: string;
  isAdmin?: boolean;
  onReply: (commentId: string) => void;
  onEdit: (commentId: string) => void;
  onDelete: (commentId: string) => void;
  replyingTo: string | null;
  editingId: string | null;
  onSubmitReply: (parentId: string, body: string) => Promise<void>;
  onSubmitEdit: (commentId: string, body: string) => Promise<void>;
  onCancelReply: () => void;
  onCancelEdit: () => void;
}) {
  const isDeleted = comment.deletedAt !== null;
  const isOwner = currentUserId === comment.authorId;
  const canEdit = isOwner && !isDeleted;
  const canDelete = (isOwner || isAdmin) && !isDeleted;
  const isEditing = editingId === comment.id;
  const isReplying = replyingTo === comment.id;

  // Check if within 15-min edit window
  const editWindowMs = 15 * 60 * 1000;
  const elapsed = Date.now() - new Date(comment.createdAt).getTime();
  const canStillEdit = canEdit && elapsed < editWindowMs;

  const wasEdited = comment.updatedAt !== comment.createdAt && !isDeleted;

  // Determine indent
  const indent = depth > 0 ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 16 : 24) : 0;

  return (
    <div>
      <div
        style={{
          paddingLeft: indent,
          borderLeft: depth > 0 ? '2px solid var(--color-border)' : 'none',
        }}
      >
        <div style={{ padding: '12px 0' }}>
          {isDeleted ? (
            <p
              style={{
                fontSize: 13,
                color: 'var(--color-text-muted)',
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              [This comment was removed]
            </p>
          ) : (
            <>
              {/* Author line */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                  }}
                >
                  {comment.authorName}
                </span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {relativeTime(comment.createdAt)}
                </span>
                {wasEdited && (
                  <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    (edited)
                  </span>
                )}
              </div>

              {/* Body or edit form */}
              {isEditing ? (
                <CommentComposer
                  placeholder="Edit your comment..."
                  onSubmit={(body) => onSubmitEdit(comment.id, body)}
                  onCancel={onCancelEdit}
                  autoFocus
                />
              ) : (
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--color-text-body)',
                    lineHeight: 1.6,
                    margin: '0 0 8px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {comment.body}
                </p>
              )}

              {/* Action buttons */}
              {!isEditing && (
                <div style={{ display: 'flex', gap: 12 }}>
                  {currentUserId && (
                    <button
                      onClick={() => onReply(comment.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: 'var(--color-text-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontFamily: 'inherit',
                      }}
                    >
                      <ChatCircle size={13} /> Reply
                    </button>
                  )}
                  {canStillEdit && (
                    <button
                      onClick={() => onEdit(comment.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: 'var(--color-text-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontFamily: 'inherit',
                      }}
                    >
                      <PencilSimple size={13} /> Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDelete(comment.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 12,
                        color: 'var(--color-text-muted)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        fontFamily: 'inherit',
                      }}
                    >
                      <Trash size={13} /> Delete
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          {/* Inline reply composer */}
          {isReplying && (
            <div style={{ marginTop: 12 }}>
              <CommentComposer
                placeholder={`Reply to ${comment.authorName}...`}
                onSubmit={(body) => onSubmitReply(comment.id, body)}
                onCancel={onCancelReply}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Replies */}
        {depth < maxDepth ? (
          comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              maxDepth={maxDepth}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              replyingTo={replyingTo}
              editingId={editingId}
              onSubmitReply={onSubmitReply}
              onSubmitEdit={onSubmitEdit}
              onCancelReply={onCancelReply}
              onCancelEdit={onCancelEdit}
            />
          ))
        ) : comment.replies.length > 0 ? (
          <div style={{ paddingLeft: indent, paddingTop: 8, paddingBottom: 8 }}>
            <button
              onClick={() => {
                // For now, expand inline — a future enhancement could navigate
                // We'll use reply to show them that deeper threads exist
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: 'var(--color-primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'inherit',
              }}
            >
              <ArrowBendDownRight size={13} />
              Continue thread ({comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'})
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function CommentThread({
  entityType,
  entityId,
  currentUserId,
  isAdmin = false,
}: CommentThreadProps) {
  const [flatComments, setFlatComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Determine max depth based on viewport
  const [maxDepth, setMaxDepth] = useState(MAX_DEPTH_LG);
  useEffect(() => {
    const updateMaxDepth = () => {
      setMaxDepth(window.innerWidth < 640 ? MAX_DEPTH_SM : MAX_DEPTH_LG);
    };
    updateMaxDepth();
    window.addEventListener('resize', updateMaxDepth);
    return () => window.removeEventListener('resize', updateMaxDepth);
  }, []);

  // Fetch comments on mount
  useEffect(() => {
    setLoading(true);
    getComments(entityType, entityId).then((result) => {
      if (result.ok) {
        setFlatComments(result.value);
      }
      setLoading(false);
    });
  }, [entityType, entityId]);

  const tree = buildCommentTree(flatComments);

  const handleAddTopLevel = useCallback(
    async (body: string) => {
      if (!currentUserId) return;
      const result = await addComment(entityType, entityId, body, currentUserId);
      if (result.ok) {
        // Optimistic: add to flat list
        setFlatComments((prev) => [...prev, result.value]);
      }
    },
    [entityType, entityId, currentUserId],
  );

  const handleReply = useCallback(
    async (parentId: string, body: string) => {
      if (!currentUserId) return;
      const result = await addComment(entityType, entityId, body, currentUserId, parentId);
      if (result.ok) {
        setFlatComments((prev) => [...prev, result.value]);
        setReplyingTo(null);
      }
    },
    [entityType, entityId, currentUserId],
  );

  const handleEdit = useCallback(
    async (commentId: string, body: string) => {
      if (!currentUserId) return;
      const result = await editComment(commentId, body, currentUserId);
      if (result.ok) {
        setFlatComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, body: result.value.body, updatedAt: result.value.updatedAt } : c)),
        );
        setEditingId(null);
      }
    },
    [currentUserId],
  );

  const handleDelete = useCallback(
    async (commentId: string) => {
      if (!currentUserId) return;
      const result = await deleteComment(commentId, currentUserId, isAdmin);
      if (result.ok) {
        setFlatComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, deletedAt: new Date().toISOString() } : c)),
        );
      }
    },
    [currentUserId, isAdmin],
  );

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
        Loading comments...
      </div>
    );
  }

  return (
    <div>
      {/* Top-level composer */}
      {currentUserId ? (
        <div style={{ marginBottom: 24 }}>
          <CommentComposer placeholder="Add a comment..." onSubmit={handleAddTopLevel} />
        </div>
      ) : (
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
          Sign in to join the discussion.
        </p>
      )}

      {/* Comment tree */}
      {tree.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', padding: '16px 0' }}>
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {tree.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              depth={0}
              maxDepth={maxDepth}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onReply={setReplyingTo}
              onEdit={setEditingId}
              onDelete={handleDelete}
              replyingTo={replyingTo}
              editingId={editingId}
              onSubmitReply={handleReply}
              onSubmitEdit={handleEdit}
              onCancelReply={() => setReplyingTo(null)}
              onCancelEdit={() => setEditingId(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

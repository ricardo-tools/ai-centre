'use client';

import { useState, useEffect } from 'react';
import { X, PaperPlaneTilt } from '@phosphor-icons/react';
import type { Comment } from '../../domain/Comment';
import { enAU } from '../../i18n/en-AU';

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface CommentPanelLGProps {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  loading: boolean;
  onAddComment: (text: string, author: string) => Promise<void>;
  onDeleteComment: (id: string) => Promise<void>;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function CommentPanelLG({
  open,
  onClose,
  comments,
  loading,
  onAddComment,
  onDeleteComment,
}: CommentPanelLGProps) {
  // Local form state (allowed — this is form-input state, not business state)
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Restore saved author from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('prototype-comment-author');
    if (stored) setAuthor(stored);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;
    setSubmitting(true);
    localStorage.setItem('prototype-comment-author', author);
    await onAddComment(text, author);
    setText('');
    setSubmitting(false);
  }

  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.15)',
            zIndex: 'var(--z-drawer)' as unknown as number,
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 360,
          maxWidth: '100vw',
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: open ? 'var(--shadow-lg)' : 'none',
          zIndex: 'var(--z-drawer)' as unknown as number,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 250ms var(--ease-out)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-3)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>
            {enAU.comments.title}
          </h3>
          <button
            onClick={onClose}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={16} weight="regular" />
          </button>
        </div>

        {/* Comments list */}
        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {comments.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'var(--space-5)' }}>
              {enAU.comments.empty}
            </p>
          )}
          {comments.map((c) => (
            <div
              key={c.id}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                  {c.author}
                </span>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {c.formattedCreatedAt}
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {c.text}
              </p>
              <button
                onClick={() => onDeleteComment(c.id)}
                style={{
                  marginTop: 'var(--space-1)',
                  fontSize: 11,
                  color: 'var(--color-text-muted)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {enAU.comments.delete}
              </button>
            </div>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: 'var(--space-3)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          <input
            type="text"
            placeholder={enAU.comments.namePlaceholder}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-bg)',
              color: 'var(--color-text-body)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <textarea
              placeholder={enAU.comments.textPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
              style={{
                flex: 1,
                padding: 'var(--space-1) var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text-body)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                outline: 'none',
                resize: 'none',
              }}
            />
            <button
              type="submit"
              disabled={submitting || !text.trim() || !author.trim()}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--color-primary)',
                color: 'var(--color-surface)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting || !text.trim() || !author.trim() ? 0.5 : 1,
                flexShrink: 0,
                alignSelf: 'flex-end',
              }}
            >
              <PaperPlaneTilt size={16} weight="fill" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

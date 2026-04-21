'use client';

import { useState, useEffect, useCallback } from 'react';
import { PushPin, ArrowLeft, CheckCircle, Trash } from '@phosphor-icons/react';
import { Pin } from '../domain/Pin';
import { usePinThread } from '../hooks/usePinThread';
import { enAU } from '../i18n/en-AU';

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface PinThreadPanelProps {
  pin: Pin | null;
  onClose: () => void;
  onResolve: (pinId: string, resolvedBy: string) => void;
  onDelete: (pinId: string) => void;
  currentUser: string;
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function formatShortTimestamp(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function PinThreadPanel({
  pin,
  onClose,
  onResolve,
  onDelete,
  currentUser,
}: PinThreadPanelProps) {
  const open = pin !== null;
  const { replies, loading, addReply } = usePinThread(pin?.id ?? null);
  const [replyText, setReplyText] = useState('');
  const [posting, setPosting] = useState(false);

  // Clear reply text when pin changes
  useEffect(() => {
    setReplyText('');
  }, [pin?.id]);

  // ESC key closes panel
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handlePost = useCallback(async () => {
    const trimmed = replyText.trim();
    if (!trimmed || !pin) return;
    setPosting(true);
    await addReply(trimmed, currentUser);
    setReplyText('');
    setPosting(false);
  }, [replyText, pin, addReply, currentUser]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handlePost();
      }
    },
    [handlePost],
  );

  const t = enAU.review;

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes voSlideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes voFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.2)',
            zIndex: 'var(--z-drawer)' as unknown as number,
            animation: 'voFadeIn 200ms var(--ease-out) both',
          }}
        />
      )}

      {/* Panel */}
      {open && pin && (
        <div
          role="dialog"
          aria-label={t.threadTitle}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: 380,
            maxWidth: '100vw',
            background: 'var(--color-surface)',
            borderLeft: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 'var(--z-drawer)' as unknown as number,
            display: 'flex',
            flexDirection: 'column',
            animation: 'voSlideInRight 200ms var(--ease-out) both',
          }}
        >
          {/* Header — sticky */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3)',
              borderBottom: '1px solid var(--color-border)',
              flexShrink: 0,
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={20} weight="regular" />
            </button>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--color-text-heading)',
                fontFamily: 'var(--font-body)',
                margin: 0,
              }}
            >
              {t.threadTitle}
            </h3>
          </div>

          {/* Scrollable body */}
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Pin detail */}
            <div
              style={{
                padding: 'var(--space-3)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <PushPin
                  size={20}
                  weight="fill"
                  style={{
                    color: pin.status === 'resolved'
                      ? 'var(--color-success)'
                      : 'var(--color-primary)',
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--color-text-heading)',
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {pin.text}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-1)',
                  paddingLeft: 28,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {pin.author} &middot; {formatTimestamp(pin.createdAt)}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {t.positionLabel(Math.round(pin.xPercent), Math.round(pin.yPercent))}
                </span>
              </div>
            </div>

            {/* Replies section */}
            <div style={{ padding: 'var(--space-3)' }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {t.repliesLabel(replies.length)}
              </span>

              {loading && (
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--color-text-muted)',
                    marginTop: 'var(--space-3)',
                  }}
                >
                  {t.loading}
                </p>
              )}

              {!loading && replies.length === 0 && (
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--color-text-muted)',
                    marginTop: 'var(--space-3)',
                    fontStyle: 'italic',
                  }}
                >
                  {t.noReplies}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                  marginTop: 'var(--space-3)',
                }}
              >
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 'var(--space-2)',
                    }}
                  >
                    {/* Author initials */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: 'var(--color-bg-alt)',
                        color: 'var(--color-text-body)',
                        fontSize: 10,
                        fontWeight: 600,
                        fontFamily: 'var(--font-body)',
                        flexShrink: 0,
                        lineHeight: 1,
                        userSelect: 'none',
                      }}
                    >
                      {getInitials(reply.author)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 'var(--space-2)',
                          marginBottom: 'var(--space-1)',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--color-text-heading)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {reply.author}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: 'var(--color-text-muted)',
                            fontFamily: 'var(--font-body)',
                          }}
                        >
                          {formatShortTimestamp(reply.createdAt)}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: 'var(--color-text-body)',
                          lineHeight: 1.5,
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {reply.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reply form */}
          <div
            style={{
              padding: 'var(--space-3)',
              borderTop: '1px solid var(--color-border)',
              flexShrink: 0,
            }}
          >
            <textarea
              placeholder={t.replyPlaceholder}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg)',
                color: 'var(--color-text-body)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                lineHeight: 1.5,
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handlePost}
              disabled={posting || !replyText.trim()}
              style={{
                marginTop: 'var(--space-2)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--color-primary)',
                color: '#FFFFFF',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                cursor: posting || !replyText.trim() ? 'not-allowed' : 'pointer',
                opacity: posting || !replyText.trim() ? 0.5 : 1,
                transition: 'opacity 150ms var(--ease-out)',
              }}
            >
              {t.replyPost}
            </button>
          </div>

          {/* Footer actions */}
          <div
            style={{
              padding: 'var(--space-3)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              flexShrink: 0,
            }}
          >
            {pin.status === 'open' ? (
              <button
                onClick={() => onResolve(pin.id, currentUser)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'var(--color-success-muted)',
                  color: 'var(--color-success)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: 32,
                }}
              >
                <CheckCircle size={16} weight="regular" />
                {t.resolvePin}
              </button>
            ) : (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--color-success-muted)',
                  color: 'var(--color-success)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                <CheckCircle size={16} weight="fill" />
                {t.resolvedBy(
                  pin.resolvedBy ?? '',
                  pin.resolvedAt ? formatShortTimestamp(pin.resolvedAt) : '',
                )}
              </span>
            )}

            <div style={{ flex: 1 }} />

            <button
              onClick={() => onDelete(pin.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: 'var(--space-1) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'transparent',
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                minHeight: 32,
              }}
            >
              <Trash size={16} weight="regular" />
              {t.deletePin}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

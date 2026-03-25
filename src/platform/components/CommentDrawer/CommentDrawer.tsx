'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { CommentThread } from '@/platform/components/CommentThread';

interface CommentDrawerProps {
  entityType: string;
  entityId: string;
  entityTitle: string;
  currentUserId?: string;
  isAdmin?: boolean;
  onClose: () => void;
}

export function CommentDrawer({ entityType, entityId, entityTitle, currentUserId, isAdmin, onClose }: CommentDrawerProps) {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 499,
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 440,
          maxWidth: '100vw',
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
          zIndex: 500,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 200ms ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            flexShrink: 0,
          }}
        >
          <div>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)' }}>
              Comments
            </span>
            <span data-testid="comment-drawer-entity" style={{ fontSize: 13, color: 'var(--color-text-muted)', marginLeft: 8 }}>
              {entityTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close comments"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 4,
              color: 'var(--color-text-muted)',
              minHeight: 32,
              minWidth: 32,
            }}
          >
            <X size={18} weight="regular" />
          </button>
        </div>

        {/* Scrollable comment thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          <CommentThread
            entityType={entityType}
            entityId={entityId}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
          />
        </div>
      </div>
    </>,
    document.body,
  );
}

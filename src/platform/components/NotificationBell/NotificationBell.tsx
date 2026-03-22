'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell, CheckCircle, X } from '@phosphor-icons/react';
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
  type NotificationData,
} from '@/features/social/notifications-action';

interface NotificationBellProps {
  userId: string;
}

/** Format a relative timestamp */
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

const POLL_INTERVAL = 60_000; // 60 seconds

export function NotificationBell({ userId }: NotificationBellProps) {
  const [items, setItems] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Track mount for createPortal (needs document.body)
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchNotifications = useCallback(async () => {
    const result = await getNotifications(userId, 20);
    if (result.ok) {
      setItems(result.value.items);
      setUnreadCount(result.value.unreadCount);
    }
  }, [userId]);

  // Fetch on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Poll every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleMarkRead = useCallback(async (id: string) => {
    await markNotificationRead(id);
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
    );
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    await markAllRead(userId);
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    setUnreadCount(0);
  }, [userId]);

  const drawer = open && mounted
    ? createPortal(
        <>
          {/* Backdrop overlay */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.2)',
              zIndex: 499, /* --z-drawer - 1 (backdrop behind drawer) */
            }}
          />
          {/* Drawer panel */}
          <div
            ref={drawerRef}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: 380,
              maxWidth: '100vw',
              background: 'var(--color-surface)',
              borderLeft: '1px solid var(--color-border)',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
              zIndex: 500, /* --z-drawer */
              display: 'flex',
              flexDirection: 'column',
              transform: 'translateX(0)',
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
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                Notifications
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: 'var(--color-primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontFamily: 'inherit',
                    }}
                  >
                    <CheckCircle size={13} /> Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close notifications"
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
            </div>

            {/* Scrollable notification list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {items.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    minHeight: 200,
                  }}
                >
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', margin: 0 }}>
                    No notifications yet.
                  </p>
                </div>
              ) : (
                items.map((n) => {
                  const isUnread = n.readAt === null;
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (isUnread) handleMarkRead(n.id);
                      }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%',
                        padding: '12px 20px',
                        background: isUnread ? 'var(--color-primary-muted)' : 'transparent',
                        border: 'none',
                        borderBlockEnd: '1px solid var(--color-border)',
                        cursor: isUnread ? 'pointer' : 'default',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                          {n.actorName}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {relativeTime(n.createdAt)}
                        </span>
                        {isUnread && (
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background: 'var(--color-primary)',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--color-text-body)', lineHeight: 1.4 }}>
                        {n.title}
                      </span>
                      {n.body && (
                        <span
                          style={{
                            fontSize: 12,
                            color: 'var(--color-text-muted)',
                            lineHeight: 1.4,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical' as const,
                            overflow: 'hidden',
                          }}
                        >
                          {n.body}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <>
      {/* Bell button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 4,
          borderRadius: 4,
          color: open ? 'var(--color-primary)' : 'var(--color-topnav-text-muted)',
          position: 'relative',
          minHeight: 44,
          minWidth: 44,
        }}
      >
        <Bell size={20} weight={open ? 'fill' : 'regular'} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: 'var(--color-danger)',
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {drawer}
    </>
  );
}

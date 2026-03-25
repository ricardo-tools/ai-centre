'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowSquareOut, ChatCircle } from '@phosphor-icons/react';
import { ChatWidget } from '../ChatWidget';
import Link from 'next/link';

export function ChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating trigger button */}
      <button
        data-testid="chat-trigger"
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          zIndex: 'var(--z-dropdown, 100)',
          transition: 'transform 150ms',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <ChatCircle size={28} weight="fill" />
      </button>

      {/* Drawer */}
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.2)',
              zIndex: 499,
            }}
          />
          {/* Panel */}
          <div
            data-testid="chat-drawer"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: 480,
              maxWidth: '100vw',
              background: 'var(--color-surface)',
              borderLeft: '1px solid var(--color-border)',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
              zIndex: 500,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid var(--color-border)',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                AI Assistant
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  href={`/chat${conversationId ? `?id=${conversationId}` : ''}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 4,
                    color: 'var(--color-text-muted)', background: 'none', border: 'none',
                    textDecoration: 'none',
                  }}
                  title="Open in full page"
                >
                  <ArrowSquareOut size={18} />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 4,
                    color: 'var(--color-text-muted)', background: 'none', border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat widget fills the rest — flex: 1 + overflow: hidden to prevent input from being pushed below viewport */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ChatWidget
                conversationId={conversationId}
                onConversationCreated={setConversationId}
              />
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}

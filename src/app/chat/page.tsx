'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, ChatCircle, Trash } from '@phosphor-icons/react';
import { ChatWidget } from '@/features/chat/widgets/ChatWidget';
import { useSession } from '@/platform/lib/SessionContext';

interface ConversationSummary {
  id: string;
  title: string | null;
  updatedAt: string;
}

export default function ChatPage() {
  const session = useSession();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Load conversations
  useEffect(() => {
    if (!session?.userId) return;
    // Load via server action
    import('@/features/chat/action').then(({ getConversations }) => {
      getConversations(session.userId).then((result) => {
        if (result.ok) {
          setConversations(result.value.map((c) => ({
            id: c.id,
            title: c.title,
            updatedAt: c.updatedAt,
          })));
        }
      });
    });
  }, [session?.userId]);

  const handleNewConversation = () => {
    setActiveId(null);
  };

  const handleConversationCreated = useCallback((id: string) => {
    setActiveId(id);
    // Refresh list
    if (session?.userId) {
      import('@/features/chat/action').then(({ getConversations }) => {
        getConversations(session.userId).then((result) => {
          if (result.ok) {
            setConversations(result.value.map((c) => ({
              id: c.id,
              title: c.title,
              updatedAt: c.updatedAt,
            })));
          }
        });
      });
    }
  }, [session?.userId]);

  const handleDelete = async (id: string) => {
    const { deleteConversation } = await import('@/features/chat/action');
    if (!session?.userId) return;
    const result = await deleteConversation(id, session.userId);
    if (result.ok) {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', background: 'var(--color-bg)' }}>
      {/* Sidebar — conversation list */}
      <div
        style={{
          width: 280,
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-surface)',
        }}
      >
        <div style={{ padding: 16 }}>
          <button
            data-testid="chat-new-conversation"
            onClick={handleNewConversation}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: activeId === null ? 'var(--color-primary-muted)' : 'var(--color-surface)',
              color: activeId === null ? 'var(--color-primary)' : 'var(--color-text-body)',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Plus size={16} /> New conversation
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: activeId === conv.id ? 'var(--color-primary-muted)' : 'transparent',
                marginBottom: 2,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <ChatCircle size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <span style={{
                  fontSize: 13, color: 'var(--color-text-body)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {conv.title ?? 'New conversation'}
                </span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(conv.id); }}
                style={{
                  display: 'flex', alignItems: 'center', background: 'none',
                  border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)',
                  padding: 4, borderRadius: 4, flexShrink: 0,
                }}
              >
                <Trash size={14} />
              </button>
            </div>
          ))}

          {conversations.length === 0 && (
            <p style={{ padding: '24px 12px', fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>
              No conversations yet
            </p>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatWidget
          conversationId={activeId}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </div>
  );
}

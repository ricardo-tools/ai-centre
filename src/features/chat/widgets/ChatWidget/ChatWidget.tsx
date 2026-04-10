'use client';

import { useState, useRef, useEffect } from 'react';
import { PaperPlaneRight, CircleNotch, Robot, User, Copy, Check, DownloadSimple } from '@phosphor-icons/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { codeToHtml } from 'shiki';
import { useChatWidget } from './useChatWidget';
import { parseChips } from './parseChips';
import type { ChatMessage } from '../../domain/ChatMessage';

/** Syntax-highlighted code block using Shiki (async, progressive enhancement). */
function ChatCodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [html, setHtml] = useState<string | null>(null);
  const code = String(children).replace(/\n$/, '');
  const lang = className?.replace('language-', '') || 'text';

  useEffect(() => {
    if (lang === 'text') return;
    let cancelled = false;
    codeToHtml(code, {
      lang,
      themes: { light: 'github-light-default', dark: 'github-dark-default' },
      defaultColor: false,
    }).then((result) => { if (!cancelled) setHtml(result); }).catch(() => {});
    return () => { cancelled = true; };
  }, [code, lang]);

  return (
    <div style={{ borderRadius: 6, border: '1px solid var(--color-border)', overflow: 'hidden', margin: '8px 0' }}>
      {lang !== 'text' && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 10px', background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 6px', borderRadius: 3, background: 'var(--color-primary-muted)', color: 'var(--color-primary)' }}>
            {lang.toUpperCase()}
          </span>
        </div>
      )}
      {html ? (
        <div className="shiki-wrapper" dangerouslySetInnerHTML={{ __html: html }} style={{ fontSize: 13, lineHeight: 1.7, overflow: 'auto' }} />
      ) : (
        <pre style={{ fontSize: 13, fontFamily: "'SF Mono', 'Fira Code', Menlo, monospace", lineHeight: 1.7, padding: 12, background: 'var(--color-bg-alt)', overflow: 'auto', margin: 0, color: 'var(--color-text-body)' }}>
          {code}
        </pre>
      )}
    </div>
  );
}

/** Custom markdown components for chat messages. */
const chatMarkdownComponents = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code({ className, children, ...props }: any) {
    const isBlock = className || (typeof children === 'string' && children.includes('\n'));
    if (isBlock) return <ChatCodeBlock className={className}>{children}</ChatCodeBlock>;
    return <code style={{ fontSize: '0.9em', padding: '1px 4px', borderRadius: 3, background: 'var(--color-bg-alt)' }} {...props}>{children}</code>;
  },
  a({ href, children }: { href?: string; children?: React.ReactNode }) {
    if (href?.startsWith('/')) {
      return <Link href={href} style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{children}</Link>;
    }
    return <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{children}</a>;
  },
};

interface ChatWidgetProps {
  conversationId?: string | null;
  onConversationCreated?: (id: string) => void;
}

export function ChatWidget({ conversationId, onConversationCreated }: ChatWidgetProps) {
  const chat = useChatWidget({ conversationId });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevConvIdRef = useRef<string | null>(conversationId ?? null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages, chat.streamingContent]);

  // Notify parent ONLY when a NEW conversation is created (not when switching existing ones).
  // A new conversation = conversationId was null (new chat) and streaming assigned one.
  useEffect(() => {
    if (chat.conversationId && onConversationCreated) {
      // Only notify if the conversation was created during this session (not loaded from prop)
      if (prevConvIdRef.current === null && chat.conversationId !== conversationId) {
        onConversationCreated(chat.conversationId);
      }
    }
    prevConvIdRef.current = conversationId ?? null;
  }, [chat.conversationId, conversationId, onConversationCreated]);

  const handleSend = () => {
    if (!input.trim() || chat.isStreaming) return;
    chat.sendMessage(input);
    setInput('');
    textareaRef.current?.focus();
  };

  const handleChipClick = (chip: string) => {
    if (chat.isStreaming) return;
    chat.sendMessage(chip);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {/* Loading overlay when switching conversations */}
        {chat.isLoading && (
          <div data-testid="chat-loading" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '64px 24px', gap: 16,
          }}>
            <div className="chat-loading-pulse" style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--color-primary-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Robot size={24} style={{ color: 'var(--color-primary)' }} />
            </div>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 500 }}>Loading conversation...</span>
          </div>
        )}
        {/* Empty state removed — the greeting message from useChatWidget handles new conversations */}

        {(() => {
          const filtered = chat.messages.filter((msg) => {
            if (msg.role === 'tool') return false;
            if (msg.role === 'assistant' && !msg.content?.trim()) return false;
            if (msg.role === 'assistant' && msg.hasToolCalls) return false;
            return true;
          });
          // Find the last assistant message to attach download data + chips
          const lastAssistantIdx = filtered.reduce((acc, msg, i) => msg.role === 'assistant' ? i : acc, -1);
          return filtered.map((msg, i) => {
            const isLastAssistant = i === lastAssistantIdx;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                downloadData={isLastAssistant ? chat.downloadData : undefined}
                onChipClick={isLastAssistant && !chat.isStreaming ? handleChipClick : undefined}
              />
            );
          });
        })()}

        {/* Streaming / thinking indicator */}
        {chat.isStreaming && (() => {
          // Strip any incomplete HTML comment from the end of streaming content.
          // This prevents raw <!-- fact: ... or <!-- chips: ... from flashing to the user
          // while the closing --> hasn't arrived yet.
          const raw = chat.streamingContent;
          const lastOpenComment = raw.lastIndexOf('<!--');
          const hasUnclosedComment = lastOpenComment !== -1 && raw.indexOf('-->', lastOpenComment) === -1;
          const safeContent = hasUnclosedComment ? raw.slice(0, lastOpenComment) : raw;

          const streamParsed = safeContent ? parseChips(safeContent) : null;
          const hasFact = streamParsed?.fact != null;
          const isWaitingForFact = hasUnclosedComment && !hasFact;
          const displayContent = streamParsed?.content ?? '';

          return (
          <>
          {/* Completed fact card */}
          {hasFact && (
            <div
              data-testid="chat-fun-fact"
              style={{
                padding: '16px 20px',
                marginBottom: 8,
                borderRadius: 12,
                background: 'linear-gradient(135deg, var(--color-primary-muted), var(--color-surface-raised, var(--color-surface)))',
                border: '1px solid var(--color-border)',
                fontSize: 14,
                color: 'var(--color-text-body)',
                lineHeight: 1.6,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Robot size={16} weight="fill" style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Today in history
                </span>
              </div>
              {streamParsed!.fact}
            </div>
          )}

          <div data-testid="chat-thinking" style={{ display: 'flex', gap: 12, padding: '12px 0' }}>
            <div className={chat.isReasoning || (!chat.streamingContent && !chat.activeToolCall) ? 'chat-thinking-icon' : undefined} style={{ flexShrink: 0, marginTop: 2 }}>
              <Robot size={20} style={{ color: 'var(--color-primary)' }} />
            </div>
            <div style={{ fontSize: 14, color: 'var(--color-text-body)', lineHeight: 1.6, flex: 1 }}>
              {/* Active reasoning block */}
              {chat.reasoningContent && (
                <ThinkingBlock content={chat.reasoningContent} isActive={chat.isReasoning} />
              )}

              {/* Tool execution feedback */}
              {chat.activeToolCall && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: 13, color: 'var(--color-primary)', fontWeight: 500 }}>
                  <CircleNotch size={14} className="spin" />
                  {chat.activeToolCall === 'search_skills' && 'Searching skills...'}
                  {chat.activeToolCall === 'get_skill_detail' && 'Reading skill content...'}
                  {chat.activeToolCall === 'compose_toolkit' && 'Composing toolkit...'}
                  {chat.activeToolCall === 'generate_project' && 'Generating project...'}
                  {chat.activeToolCall === 'navigate' && 'Finding page...'}
                </div>
              )}

              {/* Streaming response — markdown rendered progressively, raw markers hidden */}
              {displayContent ? (
                <div className="chat-markdown">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={chatMarkdownComponents}>
                    {displayContent}
                  </ReactMarkdown>
                </div>
              ) : isWaitingForFact ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Thinking of something interesting...</span>
                  <span style={{ display: 'flex', gap: 3 }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                    <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                  </span>
                </div>
              ) : !chat.activeToolCall && !chat.reasoningContent ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span data-testid="chat-thinking-label" style={{ fontSize: 13, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    Thinking...
                  </span>
                  <span style={{ display: 'flex', gap: 3 }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" style={{ animationDelay: '0.2s' }} />
                    <span className="typing-dot" style={{ animationDelay: '0.4s' }} />
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          </>
          );
        })()}

        {/* Error */}
        {chat.error && (
          <div style={{
            padding: '12px 16px', borderRadius: 8, margin: '12px 0',
            background: 'var(--color-error-muted, #fee)', border: '1px solid var(--color-error, #c00)',
            color: 'var(--color-error, #c00)', fontSize: 13,
          }}>
            {chat.error}
            <button
              onClick={chat.clearError}
              style={{ marginLeft: 8, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid var(--color-border)', padding: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <textarea
            ref={textareaRef}
            data-testid="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about skills, toolkits, or projects..."
            rows={1}
            style={{
              flex: 1, padding: '10px 14px', borderRadius: 8, fontSize: 14,
              border: '1px solid var(--color-border)', background: 'var(--color-surface)',
              color: 'var(--color-text-body)', fontFamily: 'inherit', resize: 'none',
              lineHeight: 1.5,
            }}
          />
          <button
            data-testid="chat-send"
            onClick={handleSend}
            disabled={!input.trim() || chat.isStreaming}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: 8,
              background: input.trim() && !chat.isStreaming ? 'var(--color-primary)' : 'var(--color-surface-raised)',
              color: input.trim() && !chat.isStreaming ? '#fff' : 'var(--color-text-muted)',
              border: 'none', cursor: input.trim() && !chat.isStreaming ? 'pointer' : 'default',
            }}
          >
            {chat.isStreaming ? <CircleNotch size={18} className="spin" /> : <PaperPlaneRight size={18} />}
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', margin: '8px 0 0', textAlign: 'center' }}>
          Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message, downloadData, chips, onChipClick }: {
  message: ChatMessage;
  downloadData?: { base64: string; filename: string } | null;
  chips?: string[];
  onChipClick?: (chip: string) => void;
}) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const parsed = !isUser ? parseChips(message.content) : null;
  const displayContent = parsed ? parsed.content : message.content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!downloadData) return;
    const bytes = atob(downloadData.base64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadData.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Show chips only when this is the last assistant message (chips prop is passed)
  const displayChips = chips && chips.length > 0 ? chips : (parsed?.chips ?? []);
  const showChips = !isUser && displayChips.length > 0 && !!onChipClick;

  return (
    <>
    {/* Fun fact card — only when this message has a fact */}
    {parsed?.fact && (
      <div
        data-testid="chat-fun-fact"
        style={{
          padding: '16px 20px',
          marginBottom: 8,
          borderRadius: 12,
          background: 'linear-gradient(135deg, var(--color-primary-muted), var(--color-surface-raised, var(--color-surface)))',
          border: '1px solid var(--color-border)',
          fontSize: 14,
          color: 'var(--color-text-body)',
          lineHeight: 1.6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Robot size={16} weight="fill" style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Today in history
          </span>
        </div>
        {parsed.fact}
      </div>
    )}
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 0',
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {isUser ? (
        <User size={20} style={{ color: 'var(--color-text-muted)', flexShrink: 0, marginTop: 2 }} />
      ) : (
        <Robot size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
      )}
      <div style={{ maxWidth: '80%' }}>
        {/* Per-message thinking block — above the response */}
        {!isUser && (message as unknown as { thinking: string | null }).thinking && (
          <ThinkingBlock content={(message as unknown as { thinking: string }).thinking} isActive={false} />
        )}
        <div
          data-testid={isUser ? 'chat-message-user' : 'chat-message-assistant'}
          className={isUser ? undefined : 'chat-markdown'}
          style={{
            fontSize: 14,
            color: 'var(--color-text-body)',
            lineHeight: 1.6,
            ...(isUser ? {
              background: 'var(--color-primary-muted)',
              padding: '10px 14px',
              borderRadius: '12px 12px 4px 12px',
            } : {}),
          }}
        >
          {isUser ? displayContent : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={chatMarkdownComponents}>{displayContent}</ReactMarkdown>
          )}
        </div>
        {/* Chip suggestions — only on last assistant message */}
        {showChips && (
          <div
            data-testid="chat-chips"
            style={{
              display: 'flex', flexWrap: 'wrap', gap: 8,
              marginTop: 10,
            }}
          >
            {displayChips.map((chip) => (
              <ChipButton key={chip} label={chip} onClick={() => onChipClick(chip)} />
            ))}
          </div>
        )}
        {/* Action bar — assistant messages only */}
        {!isUser && (
          <div
            data-testid="chat-action-bar"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              marginTop: 6, paddingTop: 6,
              borderTop: '1px solid var(--color-border)',
            }}
          >
            <ActionButton
              testId="chat-copy-button"
              onClick={handleCopy}
              icon={copied ? <Check size={13} /> : <Copy size={13} />}
              label={copied ? 'Copied!' : 'Copy'}
              active={copied}
            />
            {downloadData && (
              <ActionButton
                testId="chat-download-button"
                onClick={handleDownload}
                icon={<DownloadSimple size={13} />}
                label="Download"
              />
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

function ActionButton({ testId, onClick, icon, label, active }: {
  testId: string; onClick: () => void; icon: React.ReactNode; label: string; active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      data-testid={testId}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 8px', borderRadius: 4, fontSize: 12, fontFamily: 'inherit',
        background: hovered ? 'var(--color-bg-alt, rgba(0,0,0,0.04))' : 'none',
        border: 'none', cursor: 'pointer',
        color: active ? 'var(--color-success, #16a34a)' : 'var(--color-text-muted)',
        transition: 'background 150ms, color 150ms',
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ChipButton({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      data-testid="chat-chip"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 14px',
        borderRadius: 16,
        border: `1px solid ${hovered ? 'var(--color-primary)' : 'var(--color-border)'}`,
        background: hovered ? 'var(--color-primary-muted)' : 'var(--color-surface)',
        color: 'var(--color-text-body)',
        fontSize: 13,
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'background 150ms, border-color 150ms',
      }}
    >
      {label}
    </button>
  );
}

function ThinkingBlock({ content, isActive }: { content: string; isActive: boolean }) {
  // Active (streaming): expanded to show live reasoning. Inactive (persisted): collapsed.
  const [expanded, setExpanded] = useState(isActive);

  // Auto-collapse when reasoning finishes (response starts streaming)
  useEffect(() => {
    if (!isActive && content) {
      setExpanded(false);
    }
  }, [isActive, content]);

  return (
    <div
      data-testid="chat-reasoning-block"
      style={{
        marginBottom: 12,
        borderRadius: 6,
        borderLeft: '3px solid var(--color-primary)',
        border: '1px solid var(--color-border)',
        borderLeftWidth: 3,
        borderLeftColor: 'var(--color-primary)',
        background: 'var(--color-primary-muted, rgba(59, 130, 246, 0.06))',
        overflow: 'hidden',
      }}
    >
      <button
        data-testid="chat-reasoning-toggle"
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          fontFamily: 'inherit',
        }}
      >
        {isActive ? (
          <>
            <CircleNotch size={12} className="spin" />
            Thinking...
          </>
        ) : (
          <>
            <span style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 150ms', display: 'inline-flex' }}>▶</span>
            Thought process
          </>
        )}
      </button>
      {(expanded || isActive) && (
        <div
          data-testid="chat-reasoning-content"
          style={{
            padding: '0 12px 10px',
            fontSize: 12,
            lineHeight: 1.6,
            color: 'var(--color-text-muted)',
            fontStyle: 'italic',
            maxHeight: 200,
            overflowY: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

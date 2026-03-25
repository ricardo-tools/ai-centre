import { describe, it, expect } from 'vitest';
import { Conversation } from '@/features/chat/domain/Conversation';
import { ChatMessage } from '@/features/chat/domain/ChatMessage';

describe('Conversation', () => {
  it('creates with all properties', () => {
    const conv = new Conversation('id-1', 'user-1', 'My chat', '2026-01-01', '2026-01-01');
    expect(conv.id).toBe('id-1');
    expect(conv.userId).toBe('user-1');
    expect(conv.title).toBe('My chat');
  });

  it('displayTitle returns title when set', () => {
    const conv = new Conversation('id-1', 'user-1', 'Dashboard project', '2026-01-01', '2026-01-01');
    expect(conv.displayTitle).toBe('Dashboard project');
  });

  it('displayTitle returns fallback when title is null', () => {
    const conv = new Conversation('id-1', 'user-1', null, '2026-01-01', '2026-01-01');
    expect(conv.displayTitle).toBe('New conversation');
  });
});

describe('ChatMessage', () => {
  it('creates a user message', () => {
    const msg = new ChatMessage('msg-1', 'conv-1', 'user', 'Hello', null, null, null, null, '2026-01-01');
    expect(msg.isUser).toBe(true);
    expect(msg.isAssistant).toBe(false);
    expect(msg.isTool).toBe(false);
    expect(msg.hasToolCalls).toBe(false);
  });

  it('creates an assistant message with tool calls', () => {
    const msg = new ChatMessage(
      'msg-2', 'conv-1', 'assistant', '', null,
      [{ id: 'call-1', name: 'search_skills', arguments: '{"query":"dashboard"}' }],
      null, null, '2026-01-01',
    );
    expect(msg.isAssistant).toBe(true);
    expect(msg.hasToolCalls).toBe(true);
    expect(msg.toolCalls![0].name).toBe('search_skills');
  });

  it('creates a tool result message', () => {
    const msg = new ChatMessage(
      'msg-3', 'conv-1', 'tool', 'Search results...', null,
      null,
      [{ toolCallId: 'call-1', content: '[{"slug":"frontend-architecture"}]' }],
      null, '2026-01-01',
    );
    expect(msg.isTool).toBe(true);
    expect(msg.toolResults![0].toolCallId).toBe('call-1');
  });

  it('tracks token usage', () => {
    const msg = new ChatMessage(
      'msg-4', 'conv-1', 'assistant', 'Here are some skills...', null,
      null, null,
      { promptTokens: 500, completionTokens: 200, totalTokens: 700 },
      '2026-01-01',
    );
    expect(msg.tokenUsage!.totalTokens).toBe(700);
  });
});

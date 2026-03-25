'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage, ChatMessageData, TokenUsage } from '../../domain/ChatMessage';
import { getMessages as fetchMessages } from '../../action';

interface StreamEvent {
  type: 'token' | 'reasoning' | 'tool_call' | 'tool_result' | 'meta' | 'error' | 'download';
  content?: string;
  name?: string;
  id?: string;
  base64?: string;
  filename?: string;
  result?: string;
  conversationId?: string;
  message?: string;
}

interface UseChatWidgetOptions {
  conversationId?: string | null;
  baseUrl?: string;
}

interface ChatWidgetState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  reasoningContent: string;
  isReasoning: boolean;
  activeToolCall: string | null;
  conversationId: string | null;
  error: string | null;
  downloadData: { base64: string; filename: string } | null;
}

export function useChatWidget(opts?: UseChatWidgetOptions) {
  const [state, setState] = useState<ChatWidgetState>({
    messages: [],
    isLoading: false,
    isStreaming: false,
    streamingContent: '',
    reasoningContent: '',
    isReasoning: false,
    activeToolCall: null,
    conversationId: opts?.conversationId ?? null,
    error: null,
    downloadData: null,
  });
  const abortRef = useRef<AbortController | null>(null);
  const loadedConvRef = useRef<string | null>(null);
  const loadVersionRef = useRef(0);

  // Load messages when conversationId changes
  useEffect(() => {
    const convId = opts?.conversationId;
    if (!convId || convId === loadedConvRef.current) return;
    loadedConvRef.current = convId;

    // Increment version — stale responses from prior loads will be discarded
    const version = ++loadVersionRef.current;

    setState((s) => ({ ...s, conversationId: convId, messages: [], isLoading: true, isStreaming: false, error: null }));

    fetchMessages(convId).then((result) => {
      // Discard if a newer load started while this one was in flight
      if (loadVersionRef.current !== version) return;

      if (result.ok && result.value.length > 0) {
        const msgs = result.value.map((m: ChatMessageData) => ({
          ...m,
          isUser: m.role === 'user',
          isAssistant: m.role === 'assistant',
          isTool: m.role === 'tool',
          hasToolCalls: (m.toolCalls?.length ?? 0) > 0,
        })) as unknown as ChatMessage[];
        setState((s) => ({ ...s, messages: msgs, isLoading: false }));
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    });
  }, [opts?.conversationId]);

  // Reset when conversationId becomes null (new conversation)
  useEffect(() => {
    if (opts?.conversationId === null || opts?.conversationId === undefined) {
      loadedConvRef.current = null;
      setState((s) => ({ ...s, conversationId: null, messages: [], error: null }));
    }
  }, [opts?.conversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isStreaming) return;

    const userMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: state.conversationId ?? '',
      role: 'user',
      content: content.trim(),
      thinking: null,
      toolCalls: null,
      toolResults: null,
      tokenUsage: null,
      createdAt: new Date().toISOString(),
      isUser: true,
      isAssistant: false,
      isTool: false,
      hasToolCalls: false,
    } as unknown as ChatMessage;

    setState((s) => ({
      ...s,
      messages: [...s.messages, userMessage],
      isStreaming: true,
      streamingContent: '',
      reasoningContent: '',
      isReasoning: false,
      activeToolCall: null,
      error: null,
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    // Throttle UI updates — render at most once every 50ms for controlled speed
    let lastRenderTime = 0;
    let pendingRender: ReturnType<typeof setTimeout> | null = null;

    try {
      const baseUrl = opts?.baseUrl ?? '';
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: state.conversationId,
          message: content.trim(),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error ?? `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let reasoningContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        while (true) {
          const lineEnd = buffer.indexOf('\n');
          if (lineEnd === -1) break;

          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);

          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;

          try {
            const event: StreamEvent = JSON.parse(data);

            switch (event.type) {
              case 'reasoning':
                reasoningContent += event.content ?? '';
                setState((s) => ({ ...s, reasoningContent, isReasoning: true }));
                break;
              case 'token':
                fullContent += event.content ?? '';
                // Throttle: update UI at most every 50ms
                const now = Date.now();
                if (now - lastRenderTime >= 50) {
                  lastRenderTime = now;
                  setState((s) => ({ ...s, streamingContent: fullContent, isReasoning: false }));
                } else if (!pendingRender) {
                  pendingRender = setTimeout(() => {
                    pendingRender = null;
                    lastRenderTime = Date.now();
                    setState((s) => ({ ...s, streamingContent: fullContent, isReasoning: false }));
                  }, 50);
                }
                break;
              case 'tool_call':
                // Move any accumulated content into thinking (it's narration like "I'll search...")
                if (fullContent.trim()) {
                  reasoningContent += (reasoningContent ? '\n' : '') + fullContent.trim();
                  fullContent = '';
                }
                setState((s) => ({
                  ...s,
                  activeToolCall: event.name ?? null,
                  reasoningContent,
                  streamingContent: '',
                  isReasoning: false,
                }));
                break;
              case 'tool_result':
                setState((s) => ({ ...s, activeToolCall: null }));
                break;
              case 'meta':
                if (event.conversationId) {
                  setState((s) => ({ ...s, conversationId: event.conversationId! }));
                }
                break;
              case 'download':
                if (event.base64 && event.filename) {
                  setState((s) => ({ ...s, downloadData: { base64: event.base64!, filename: event.filename! } }));
                }
                break;
              case 'error':
                setState((s) => ({ ...s, error: event.message ?? 'Unknown error' }));
                break;
            }
          } catch {
            // Skip unparseable
          }
        }
      }

      // Flush any pending render
      if (pendingRender) { clearTimeout(pendingRender); pendingRender = null; }
      setState((s) => ({ ...s, streamingContent: fullContent, isReasoning: false }));

      // Add the complete assistant message
      if (fullContent) {
        const assistantMessage: ChatMessage = {
          id: `temp-${Date.now()}-assistant`,
          conversationId: state.conversationId ?? '',
          role: 'assistant',
          content: fullContent,
          thinking: reasoningContent || null,
          toolCalls: null,
          toolResults: null,
          tokenUsage: null,
          createdAt: new Date().toISOString(),
          isUser: false,
          isAssistant: true,
          isTool: false,
          hasToolCalls: false,
        } as unknown as ChatMessage;

        setState((s) => ({
          ...s,
          messages: [...s.messages, assistantMessage],
          streamingContent: '',
          isStreaming: false,
        }));
      }
    } catch (err) {
      if (pendingRender) { clearTimeout(pendingRender); pendingRender = null; }
      if ((err as Error).name !== 'AbortError') {
        setState((s) => ({
          ...s,
          error: (err as Error).message,
          isStreaming: false,
          streamingContent: '',
        }));
      }
    }
  }, [state.conversationId, state.isStreaming, opts?.baseUrl]);

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setState((s) => ({ ...s, isStreaming: false, streamingContent: '' }));
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const setConversationId = useCallback((id: string | null) => {
    setState((s) => ({ ...s, conversationId: id, messages: [] }));
  }, []);

  const setMessages = useCallback((messages: ChatMessage[]) => {
    setState((s) => ({ ...s, messages }));
  }, []);

  return {
    ...state,
    sendMessage,
    stopStreaming,
    clearError,
    setConversationId,
    setMessages,
  };
}

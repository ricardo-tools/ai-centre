/**
 * ChatMessage domain object.
 * Represents a single message in a conversation (user, assistant, or tool).
 */

export type MessageRole = 'user' | 'assistant' | 'tool';

export interface ToolCall {
  id: string;
  name: string;
  arguments: string;
}

export interface ToolResult {
  toolCallId: string;
  content: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/** Plain serializable object — safe to pass from server to client */
export interface ChatMessageData {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  thinking: string | null;
  toolCalls: ToolCall[] | null;
  toolResults: ToolResult[] | null;
  tokenUsage: TokenUsage | null;
  createdAt: string;
}

export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly conversationId: string,
    public readonly role: MessageRole,
    public readonly content: string,
    public readonly thinking: string | null,
    public readonly toolCalls: ToolCall[] | null,
    public readonly toolResults: ToolResult[] | null,
    public readonly tokenUsage: TokenUsage | null,
    public readonly createdAt: string,
  ) {}

  get isUser(): boolean { return this.role === 'user'; }
  get isAssistant(): boolean { return this.role === 'assistant'; }
  get isTool(): boolean { return this.role === 'tool'; }
  get hasToolCalls(): boolean { return (this.toolCalls?.length ?? 0) > 0; }

  toPlain(): ChatMessageData {
    return {
      id: this.id, conversationId: this.conversationId, role: this.role,
      content: this.content, thinking: this.thinking, toolCalls: this.toolCalls,
      toolResults: this.toolResults, tokenUsage: this.tokenUsage, createdAt: this.createdAt,
    };
  }
}

/**
 * Conversation domain object.
 * Represents a chat conversation between a user and the AI assistant.
 */

/** Plain serializable object — safe to pass from server to client */
export interface ConversationData {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export class Conversation {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string | null,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  get displayTitle(): string {
    return this.title ?? 'New conversation';
  }

  /** Convert to plain object for server→client transfer */
  toPlain(): ConversationData {
    return { id: this.id, userId: this.userId, title: this.title, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}

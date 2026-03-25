'use server';

import { eq, and, desc } from 'drizzle-orm';
import { chatConversations, chatMessages } from '@/platform/db/schema';
import { getDb, hasDatabase } from '@/platform/db/client';
import { type Result, Ok, Err } from '@/platform/lib/result';
import { type ConversationData } from './domain/Conversation';
import { type ChatMessageData, type MessageRole, type ToolCall, type ToolResult, type TokenUsage } from './domain/ChatMessage';

function getDb_() {
  if (!hasDatabase()) return null;
  return getDb();
}

function rowToConversation(r: { id: string; userId: string; title: string | null; createdAt: Date; updatedAt: Date }): ConversationData {
  return { id: r.id, userId: r.userId, title: r.title, createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() };
}

function rowToMessage(r: { id: string; conversationId: string; role: string; content: string; thinking: string | null; toolCalls: unknown; toolResults: unknown; tokenUsage: unknown; createdAt: Date }): ChatMessageData {
  return {
    id: r.id, conversationId: r.conversationId, role: r.role as MessageRole, content: r.content,
    thinking: r.thinking ?? null,
    toolCalls: r.toolCalls as ToolCall[] | null, toolResults: r.toolResults as ToolResult[] | null,
    tokenUsage: r.tokenUsage as TokenUsage | null, createdAt: r.createdAt.toISOString(),
  };
}

// ── Conversations ───────────────────────────────────────────────────

export async function createConversation(
  userId: string,
  title?: string,
): Promise<Result<ConversationData, Error>> {
  const db = getDb_();
  if (!db) return Err(new Error('Database not configured'));

  try {
    const [row] = await db
      .insert(chatConversations)
      .values({ userId, title: title ?? null })
      .returning();
    return Ok(rowToConversation(row));
  } catch (err) {
    console.error('[chat] createConversation failed:', err);
    return Err(new Error('Failed to create conversation'));
  }
}

export async function getConversations(
  userId: string,
): Promise<Result<ConversationData[], Error>> {
  const db = getDb_();
  if (!db) return Ok([]);

  try {
    const rows = await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.userId, userId))
      .orderBy(desc(chatConversations.updatedAt));
    return Ok(rows.map(rowToConversation));
  } catch (err) {
    console.error('[chat] getConversations failed:', err);
    return Ok([]);
  }
}

export async function deleteConversation(
  conversationId: string,
  userId: string,
): Promise<Result<void, Error>> {
  const db = getDb_();
  if (!db) return Err(new Error('Database not configured'));

  try {
    const [row] = await db
      .select({ id: chatConversations.id })
      .from(chatConversations)
      .where(and(eq(chatConversations.id, conversationId), eq(chatConversations.userId, userId)))
      .limit(1);

    if (!row) return Err(new Error('Conversation not found'));

    await db.delete(chatConversations).where(eq(chatConversations.id, conversationId));
    return Ok(undefined);
  } catch (err) {
    console.error('[chat] deleteConversation failed:', err);
    return Err(new Error('Failed to delete conversation'));
  }
}

export async function updateConversationTitle(
  conversationId: string,
  title: string,
): Promise<Result<void, Error>> {
  const db = getDb_();
  if (!db) return Err(new Error('Database not configured'));

  try {
    await db
      .update(chatConversations)
      .set({ title, updatedAt: new Date() })
      .where(eq(chatConversations.id, conversationId));
    return Ok(undefined);
  } catch (err) {
    console.error('[chat] updateConversationTitle failed:', err);
    return Err(new Error('Failed to update title'));
  }
}

// ── Messages ────────────────────────────────────────────────────────

export async function addMessage(
  conversationId: string,
  role: MessageRole,
  content: string,
  opts?: {
    toolCalls?: ToolCall[];
    toolResults?: ToolResult[];
    tokenUsage?: TokenUsage;
    thinking?: string;
  },
): Promise<Result<ChatMessageData, Error>> {
  const db = getDb_();
  if (!db) return Err(new Error('Database not configured'));

  try {
    const [row] = await db
      .insert(chatMessages)
      .values({
        conversationId,
        role,
        content,
        thinking: opts?.thinking ?? null,
        toolCalls: opts?.toolCalls ?? null,
        toolResults: opts?.toolResults ?? null,
        tokenUsage: opts?.tokenUsage ?? null,
      })
      .returning();

    await db
      .update(chatConversations)
      .set({ updatedAt: new Date() })
      .where(eq(chatConversations.id, conversationId));

    return Ok(rowToMessage(row));
  } catch (err) {
    console.error('[chat] addMessage failed:', err);
    return Err(new Error('Failed to add message'));
  }
}

export async function getMessages(
  conversationId: string,
): Promise<Result<ChatMessageData[], Error>> {
  const db = getDb_();
  if (!db) return Ok([]);

  try {
    const rows = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(chatMessages.createdAt);
    return Ok(rows.map(rowToMessage));
  } catch (err) {
    console.error('[chat] getMessages failed:', err);
    return Ok([]);
  }
}

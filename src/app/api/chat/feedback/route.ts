/**
 * POST /api/chat/feedback
 *
 * Records user feedback (thumbs up/down) on a chat message.
 * When a downvote includes a correction, generates an embedding for RAG retrieval.
 *
 * Body: { messageId: string, conversationId: string, rating: 'up' | 'down', correction?: string }
 */

import { type NextRequest, NextResponse } from 'next/server';
import { eq, and, desc, lt } from 'drizzle-orm';
import { getSession } from '@/platform/lib/auth';
import { getDb, hasDatabase } from '@/platform/db/client';
import { chatFeedback, chatMessages } from '@/platform/db/schema';

const OPENROUTER_EMBEDDINGS_URL = 'https://openrouter.ai/api/v1/embeddings';
const EMBEDDING_MODEL = 'openai/text-embedding-3-small';

async function generateEmbedding(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(OPENROUTER_EMBEDDINGS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: text,
      }),
    });

    if (!response.ok) {
      console.warn('[feedback] Embedding API error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.data?.[0]?.embedding ?? null;
  } catch (err) {
    console.warn('[feedback] Embedding generation failed:', err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!hasDatabase()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  let body: { messageId: string; conversationId: string; rating: string; correction?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { messageId, conversationId, rating, correction } = body;

  // Validate required fields
  if (!messageId || typeof messageId !== 'string') {
    return NextResponse.json({ error: 'messageId is required' }, { status: 400 });
  }
  if (!conversationId || typeof conversationId !== 'string') {
    return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
  }
  if (rating !== 'up' && rating !== 'down') {
    return NextResponse.json({ error: 'rating must be "up" or "down"' }, { status: 400 });
  }

  const db = getDb();

  try {
    // Get the rated message (assistant response)
    const [assistantMsg] = await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.id, messageId),
          eq(chatMessages.conversationId, conversationId),
        ),
      )
      .limit(1);

    if (!assistantMsg) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Get the preceding user message (query context)
    const [userMsg] = await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.conversationId, conversationId),
          eq(chatMessages.role, 'user'),
          lt(chatMessages.createdAt, assistantMsg.createdAt),
        ),
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(1);

    const queryContext = userMsg?.content ?? '';
    const responseContext = assistantMsg.content;

    // Generate embedding for downvotes with corrections (for RAG)
    let embeddingText: string | null = null;
    if (rating === 'down' && correction) {
      const embedding = await generateEmbedding(`${queryContext}\n${correction}`);
      if (embedding) {
        embeddingText = JSON.stringify(embedding);
      }
    }

    // Insert feedback
    await db.insert(chatFeedback).values({
      messageId,
      conversationId,
      userId: session.userId,
      rating,
      correction: correction ?? null,
      queryContext,
      responseContext,
      embedding: embeddingText,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[feedback] Failed to save feedback:', err);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}

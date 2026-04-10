/**
 * Feedback RAG — retrieves relevant past corrections for grounding.
 *
 * When a user provides a correction on a downvoted message, we store an embedding.
 * On future queries, we find similar past corrections via cosine similarity
 * and inject them into the system prompt so the model avoids the same mistakes.
 *
 * Uses pgvector's <=> cosine distance operator via raw SQL.
 */

import { getDb, hasDatabase } from '@/platform/db/client';
import { sql } from 'drizzle-orm';

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

    if (!response.ok) return null;

    const data = await response.json();
    return data.data?.[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

interface CorrectionRow extends Record<string, unknown> {
  query_context: string;
  correction: string;
  similarity: number;
}

/**
 * Retrieve relevant past corrections for a user query using vector similarity.
 *
 * Returns a formatted string to inject into the system prompt, or empty string
 * if no relevant corrections are found or if the feature is unavailable.
 */
export async function getRelevantCorrections(query: string): Promise<string> {
  if (!hasDatabase()) return '';

  try {
    const embedding = await generateEmbedding(query);
    if (!embedding) return '';

    const db = getDb();
    const embeddingStr = `[${embedding.join(',')}]`;

    // Use raw SQL for pgvector cosine similarity.
    // The embedding column stores serialized JSON arrays; we cast to vector type.
    // If pgvector is not enabled, this query will fail gracefully.
    const rows = await db.execute<CorrectionRow>(
      sql`SELECT
            query_context,
            correction,
            1 - (embedding::vector <=> ${embeddingStr}::vector) as similarity
          FROM chat_feedback
          WHERE rating = 'down'
            AND correction IS NOT NULL
            AND embedding IS NOT NULL
          ORDER BY embedding::vector <=> ${embeddingStr}::vector
          LIMIT 3`
    );

    // Drizzle execute returns rows — handle both array and object shapes
    const resultRows = Array.isArray(rows) ? rows : (rows as { rows?: CorrectionRow[] }).rows ?? [];
    if (resultRows.length === 0) return '';

    // Only include corrections with reasonable similarity (> 0.3)
    const relevant = resultRows.filter((r: CorrectionRow) => r.similarity > 0.3);
    if (relevant.length === 0) return '';

    const formatted = relevant
      .map(
        (r: CorrectionRow, i: number) =>
          `${i + 1}. When asked about: "${r.query_context.substring(0, 100)}"\n   Correction: ${r.correction}`,
      )
      .join('\n');

    return `\n## Past corrections (apply these to avoid repeated mistakes)\n${formatted}`;
  } catch (err) {
    // pgvector may not be enabled — fail silently
    console.debug('[feedback-rag] Correction retrieval failed (pgvector may not be enabled):', err);
    return '';
  }
}

/**
 * Embedding generation + in-memory similarity search.
 *
 * Pure functions with structured logging. Uses OpenRouter via the OpenAI SDK
 * (see skills/ai-openrouter/SKILL.md §7) for embedding generation. Falls back
 * to keyword matching when OPENROUTER_API_KEY is missing.
 *
 * Design:
 *   - 60 skills -> in-memory cosine similarity (microseconds)
 *   - Embed metadata only (name + description + when-to-use + when-not-to-use + purpose)
 *   - Precompute at seed time, cache in DB as JSON-serialised float[]
 *   - Query-time: load all rows into memory, embed query, rank by cosine
 */

import OpenAI from 'openai';

// ── Constants ───────────────────────────────────────────────────────

export const EMBEDDING_MODEL = 'openai/text-embedding-3-small';
export const EMBEDDING_DIMENSIONS = 1536; // text-embedding-3-small default
export const DEFAULT_TOP_N = 8;
export const DEFAULT_THRESHOLD = 0.2;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// ── Types ───────────────────────────────────────────────────────────

export interface SkillMetadataForEmbedding {
  name: string;
  description: string;
  whenToUse?: string;
  whenNotToUse?: string;
  purpose?: string;
}

export interface RankOptions {
  /** Return at most this many results */
  topN?: number;
  /** Exclude scores strictly below this threshold */
  threshold?: number;
}

export interface RankedCandidate<T> {
  candidate: T;
  score: number;
}

// ── Feature flag ────────────────────────────────────────────────────

/** True when an OpenRouter key is present — enables embedding generation */
export function isEmbeddingEnabled(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}

// ── Text preparation ────────────────────────────────────────────────

/** Concatenate skill metadata fields into the text we embed. */
export function buildEmbeddingText(meta: SkillMetadataForEmbedding): string {
  const parts: string[] = [];
  if (meta.name) parts.push(meta.name);
  if (meta.description) parts.push(meta.description);
  if (meta.whenToUse) parts.push(`When to use: ${meta.whenToUse}`);
  if (meta.whenNotToUse) parts.push(`When not to use: ${meta.whenNotToUse}`);
  if (meta.purpose) parts.push(`Purpose: ${meta.purpose}`);
  return parts.join('\n');
}

// ── OpenAI client ───────────────────────────────────────────────────

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set — cannot create embedding client');
  }
  cachedClient = new OpenAI({ apiKey, baseURL: OPENROUTER_BASE_URL });
  return cachedClient;
}

// ── Embedding generation ────────────────────────────────────────────

/**
 * Embed a single text via OpenRouter. Returns an empty array on failure
 * (callers should treat empty as "no embedding available" and skip).
 */
export async function embedText(text: string): Promise<number[]> {
  const trimmed = text.trim();
  if (!trimmed) {
    console.debug('[embeddings] embedText: empty input — skipping');
    return [];
  }
  if (!isEmbeddingEnabled()) {
    console.debug('[embeddings] embedText: OPENROUTER_API_KEY missing — skipping');
    return [];
  }

  const started = Date.now();
  console.debug('[embeddings] embedText start', { chars: trimmed.length });
  try {
    const client = getClient();
    const res = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: trimmed,
    });
    const vector = res.data[0]?.embedding ?? [];
    console.info('[embeddings] embedText complete', {
      chars: trimmed.length,
      dim: vector.length,
      latencyMs: Date.now() - started,
    });
    return vector;
  } catch (err) {
    console.error('[embeddings] embedText error', {
      chars: trimmed.length,
      latencyMs: Date.now() - started,
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

// ── Serialisation ───────────────────────────────────────────────────

/** Serialise a float[] to a compact JSON string for DB storage. */
export function serializeVector(v: number[]): string {
  return JSON.stringify(v);
}

/** Deserialise a JSON-serialised vector. Returns [] on any error. */
export function deserializeVector(s: string): number[] {
  try {
    const parsed = JSON.parse(s) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((n): n is number => typeof n === 'number');
  } catch {
    return [];
  }
}

// ── Similarity math (pure) ──────────────────────────────────────────

/**
 * Cosine similarity between two equal-length vectors.
 * Returns 0 for zero vectors or mismatched lengths.
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// ── Keyword fallback ────────────────────────────────────────────────

function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

/**
 * Simple keyword overlap score in [0, 1].
 * Score = (matching query tokens) / (total unique query tokens).
 */
export function keywordMatch(query: string, text: string): number {
  const queryTokens = new Set(tokenise(query));
  if (queryTokens.size === 0) return 0;
  const textTokens = new Set(tokenise(text));

  let matches = 0;
  for (const q of queryTokens) {
    if (textTokens.has(q)) matches++;
  }
  return matches / queryTokens.size;
}

/**
 * Rank a list of candidates by keyword overlap, filter by threshold, trim to topN.
 * Used when OPENROUTER_API_KEY is missing.
 */
export function rankByKeywordMatch<T extends { text: string }>(
  query: string,
  candidates: T[],
  options: RankOptions = {},
): Array<T & { score: number }> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const threshold = options.threshold ?? 0;
  const topN = options.topN ?? candidates.length;

  return candidates
    .map((c) => ({ ...c, score: keywordMatch(trimmed, c.text) }))
    .filter((c) => c.score > 0 && c.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

// ── Embedding rank ──────────────────────────────────────────────────

/**
 * Rank candidates by cosine similarity against a query vector. Threshold and
 * topN applied in order: threshold filter -> descending sort -> topN slice.
 */
export function rankByCosineSimilarity<T extends { vector: number[] }>(
  queryVector: number[],
  candidates: T[],
  options: RankOptions = {},
): Array<T & { score: number }> {
  if (queryVector.length === 0) return [];
  const threshold = options.threshold ?? 0;
  const topN = options.topN ?? candidates.length;

  return candidates
    .map((c) => ({ ...c, score: cosineSimilarity(queryVector, c.vector) }))
    .filter((c) => c.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

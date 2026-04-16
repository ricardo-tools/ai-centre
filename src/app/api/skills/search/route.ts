import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAllSkills } from '@/platform/lib/skills';
import { getDb, hasDatabase } from '@/platform/db';
import { skillEmbeddings, skills as skillsTable } from '@/platform/db/schema';
import { eq } from 'drizzle-orm';
import {
  buildEmbeddingText,
  cosineSimilarity,
  deserializeVector,
  embedText,
  isEmbeddingEnabled,
  keywordMatch,
  DEFAULT_TOP_N,
  DEFAULT_THRESHOLD,
} from '@/platform/lib/embeddings';

/**
 * POST /api/skills/search
 *
 * Semantic skill matching for flow-bootstrap.
 *   Body: { query: string, topN?: number, threshold?: number }
 *   Returns: { mode: 'embedding' | 'keyword', results: [{ slug, name, description, score }] }
 *
 * When OPENROUTER_API_KEY is missing, falls back to keyword matching on the
 * same metadata text used for embeddings.
 *
 * Public endpoint — called by the Flow CLI before the user is authenticated.
 * Input is sanitised (max length, string type) to prevent abuse.
 */

const MAX_QUERY_LENGTH = 2000;
const MAX_TOP_N = 20;

interface SearchResult {
  slug: string;
  name: string;
  description: string;
  score: number;
}

export async function POST(request: NextRequest) {
  const started = Date.now();

  // ── Parse & validate ────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.warn('[skills-search] invalid json body');
    return NextResponse.json({ error: 'invalid_body', message: 'Body must be valid JSON' }, { status: 400 });
  }

  const { query, topN, threshold } = parseBody(body);
  if (query === null) {
    console.warn('[skills-search] invalid query');
    return NextResponse.json({ error: 'invalid_query', message: `query must be a string of 1..${MAX_QUERY_LENGTH} chars` }, { status: 400 });
  }

  const trimmed = query.trim();
  if (!trimmed) {
    console.info('[skills-search] empty query — returning empty results');
    return NextResponse.json({ mode: 'empty', results: [] });
  }

  console.info('[skills-search] start', {
    chars: trimmed.length,
    topN,
    threshold,
    mode: isEmbeddingEnabled() && hasDatabase() ? 'embedding' : 'keyword',
  });

  // ── Build candidate list ────────────────────────────────────────
  const allSkills = getAllSkills().filter((s) => s.tags.type !== 'reference');

  // ── Embedding path ──────────────────────────────────────────────
  if (isEmbeddingEnabled() && hasDatabase()) {
    try {
      const results = await embeddingSearch(trimmed, allSkills, topN, threshold);
      if (results.length > 0) {
        const topScore = results[0].score;
        console.info('[skills-search] complete (embedding)', {
          chars: trimmed.length,
          resultCount: results.length,
          topScore,
          latencyMs: Date.now() - started,
        });
        return NextResponse.json({ mode: 'embedding', results });
      }
      console.info('[skills-search] embedding returned no results — falling back to keyword');
    } catch (err) {
      console.error('[skills-search] embedding path failed — falling back to keyword', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  // ── Keyword fallback ────────────────────────────────────────────
  const results = keywordSearch(trimmed, allSkills, topN, threshold);
  const topScore = results[0]?.score ?? 0;
  console.info('[skills-search] complete (keyword)', {
    chars: trimmed.length,
    resultCount: results.length,
    topScore,
    latencyMs: Date.now() - started,
  });
  return NextResponse.json({ mode: 'keyword', results });
}

// ── Helpers ────────────────────────────────────────────────────────

function parseBody(body: unknown): { query: string | null; topN: number; threshold: number } {
  if (!body || typeof body !== 'object') {
    return { query: null, topN: DEFAULT_TOP_N, threshold: DEFAULT_THRESHOLD };
  }
  const b = body as Record<string, unknown>;
  const rawQuery = b.query;
  if (typeof rawQuery !== 'string') return { query: null, topN: DEFAULT_TOP_N, threshold: DEFAULT_THRESHOLD };
  if (rawQuery.length > MAX_QUERY_LENGTH) return { query: null, topN: DEFAULT_TOP_N, threshold: DEFAULT_THRESHOLD };

  const rawTopN = b.topN;
  const topN = typeof rawTopN === 'number' && rawTopN > 0
    ? Math.min(Math.floor(rawTopN), MAX_TOP_N)
    : DEFAULT_TOP_N;

  const rawThreshold = b.threshold;
  const threshold = typeof rawThreshold === 'number' && rawThreshold >= 0 && rawThreshold <= 1
    ? rawThreshold
    : DEFAULT_THRESHOLD;

  return { query: rawQuery, topN, threshold };
}

async function embeddingSearch(
  query: string,
  allSkills: ReturnType<typeof getAllSkills>,
  topN: number,
  threshold: number,
): Promise<SearchResult[]> {
  const db = getDb();

  // Join embeddings with skills to get slug alongside the vector
  const rows = await db
    .select({
      slug: skillsTable.slug,
      embedding: skillEmbeddings.embedding,
    })
    .from(skillEmbeddings)
    .innerJoin(skillsTable, eq(skillsTable.id, skillEmbeddings.skillId));

  if (rows.length === 0) return [];

  const bySlug = new Map(allSkills.map((s) => [s.slug, s]));
  const queryVector = await embedText(query);
  if (queryVector.length === 0) return [];

  const scored: SearchResult[] = [];
  for (const row of rows) {
    const meta = bySlug.get(row.slug);
    if (!meta) continue;
    const vector = deserializeVector(row.embedding);
    if (vector.length === 0) continue;
    const score = cosineSimilarity(queryVector, vector);
    if (score < threshold) continue;
    scored.push({
      slug: meta.slug,
      name: meta.title,
      description: meta.description,
      score,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}

function keywordSearch(
  query: string,
  allSkills: ReturnType<typeof getAllSkills>,
  topN: number,
  threshold: number,
): SearchResult[] {
  const scored: SearchResult[] = [];
  for (const skill of allSkills) {
    const text = buildEmbeddingText({
      name: skill.title,
      description: skill.description,
    });
    const score = keywordMatch(query, text);
    if (score <= 0 || score < threshold) continue;
    scored.push({
      slug: skill.slug,
      name: skill.title,
      description: skill.description,
      score,
    });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN);
}

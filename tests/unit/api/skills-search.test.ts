import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Tests for the /api/skills/search route logic.
 * The route has two branches:
 *   1. embedding-enabled (OPENROUTER_API_KEY set) — semantic search
 *   2. fallback (no key) — keyword match on skill metadata
 *
 * We mock the embeddings module so we test the route's glue code, not the math
 * (the math is covered in embeddings.test.ts).
 */

vi.mock('@/platform/lib/embeddings', async (importActual) => {
  const actual = await importActual<typeof import('@/platform/lib/embeddings')>();
  return {
    ...actual,
    embedText: vi.fn(),
    isEmbeddingEnabled: vi.fn(),
  };
});

vi.mock('@/platform/db', () => ({
  getDb: vi.fn(),
  hasDatabase: vi.fn(() => false),
}));

const embeddings = await import('@/platform/lib/embeddings');

async function callSearch(body: unknown) {
  const { POST } = await import('@/app/api/skills/search/route');
  const request = new Request('http://localhost/api/skills/search', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const res = await POST(request as unknown as import('next/server').NextRequest);
  return { status: res.status, json: await res.json() as unknown };
}

describe('POST /api/skills/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(embeddings.isEmbeddingEnabled).mockReturnValue(false);
  });

  it('returns empty array for empty query', async () => {
    const { status, json } = await callSearch({ query: '' });
    expect(status).toBe(200);
    expect(json).toMatchObject({ results: [], mode: expect.any(String) });
    expect((json as { results: unknown[] }).results).toEqual([]);
  });

  it('returns 400 for missing query field', async () => {
    const { status, json } = await callSearch({});
    expect(status).toBe(400);
    expect(json).toMatchObject({ error: expect.any(String) });
  });

  it('returns 400 for non-string query', async () => {
    const { status } = await callSearch({ query: 123 });
    expect(status).toBe(400);
  });

  it('returns 400 when query exceeds max length', async () => {
    const { status } = await callSearch({ query: 'x'.repeat(2001) });
    expect(status).toBe(400);
  });

  it('falls back to keyword match when OPENROUTER_API_KEY is not set', async () => {
    vi.mocked(embeddings.isEmbeddingEnabled).mockReturnValue(false);
    const { status, json } = await callSearch({ query: 'authentication email' });
    expect(status).toBe(200);
    const parsed = json as { results: Array<{ slug: string; score: number }>; mode: string };
    expect(parsed.mode).toBe('keyword');
    expect(parsed.results.length).toBeGreaterThan(0);
    // Results must be sorted descending by score
    for (let i = 1; i < parsed.results.length; i++) {
      expect(parsed.results[i - 1].score).toBeGreaterThanOrEqual(parsed.results[i].score);
    }
  });

  it('keyword mode returns skill slug, name, description, score', async () => {
    vi.mocked(embeddings.isEmbeddingEnabled).mockReturnValue(false);
    const { json } = await callSearch({ query: 'authentication' });
    const first = (json as { results: Array<{ slug: string; name: string; description: string; score: number }> }).results[0];
    expect(first).toMatchObject({
      slug: expect.any(String),
      name: expect.any(String),
      description: expect.any(String),
      score: expect.any(Number),
    });
  });

  it('respects topN parameter', async () => {
    vi.mocked(embeddings.isEmbeddingEnabled).mockReturnValue(false);
    const { json } = await callSearch({ query: 'design test code', topN: 3 });
    const parsed = json as { results: unknown[] };
    expect(parsed.results.length).toBeLessThanOrEqual(3);
  });
});

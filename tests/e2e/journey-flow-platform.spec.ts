import { test, expect } from './base-test';

/**
 * Journey: Flow-First Platform
 *
 * Each chapter in Plan 02 extends this single journey spec with its own
 * assertions. Chapter 3 adds: POST /api/skills/search returns ranked matches.
 */

test.describe('Journey — Flow-First Platform', () => {
  test('Ch 3 — skill search returns ranked results for "dashboard"', async ({ request, baseURL }) => {
    const res = await request.post(`${baseURL}/api/skills/search`, {
      data: { query: 'credit application dashboard' },
    });

    expect(res.status()).toBe(200);
    const body = await res.json() as {
      mode: string;
      results: Array<{ slug: string; name: string; description: string; score: number }>;
    };

    expect(body.mode).toMatch(/^(embedding|keyword)$/);
    expect(Array.isArray(body.results)).toBe(true);
    expect(body.results.length).toBeGreaterThan(0);

    // Sorted descending by score
    for (let i = 1; i < body.results.length; i++) {
      expect(body.results[i - 1].score).toBeGreaterThanOrEqual(body.results[i].score);
    }

    // Each result has the expected shape
    for (const r of body.results) {
      expect(r.slug).toBeTruthy();
      expect(r.name).toBeTruthy();
      expect(typeof r.score).toBe('number');
    }
  });

  test('Ch 3 — empty query returns empty results', async ({ request, baseURL }) => {
    const res = await request.post(`${baseURL}/api/skills/search`, {
      data: { query: '' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json() as { results: unknown[] };
    expect(body.results).toEqual([]);
  });

  test('Ch 3 — oversize query returns 400', async ({ request, baseURL }) => {
    const res = await request.post(`${baseURL}/api/skills/search`, {
      data: { query: 'x'.repeat(3000) },
    });
    expect(res.status()).toBe(400);
  });
});

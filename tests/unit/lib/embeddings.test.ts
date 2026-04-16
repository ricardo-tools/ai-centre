import { describe, it, expect } from 'vitest';
import {
  cosineSimilarity,
  keywordMatch,
  buildEmbeddingText,
  serializeVector,
  deserializeVector,
  rankByKeywordMatch,
} from '@/platform/lib/embeddings';

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    const a = [1, 0, 0];
    const b = [1, 0, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(1, 10);
  });

  it('returns 0 for orthogonal vectors', () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 10);
  });

  it('returns -1 for opposite vectors', () => {
    const a = [1, 0];
    const b = [-1, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1, 10);
  });

  it('is symmetric', () => {
    const a = [0.2, 0.7, 0.3];
    const b = [0.8, 0.1, 0.5];
    expect(cosineSimilarity(a, b)).toBeCloseTo(cosineSimilarity(b, a), 10);
  });

  it('handles normalized high-dimensional vectors', () => {
    const dim = 128;
    const a = Array.from({ length: dim }, (_, i) => Math.sin(i));
    const b = Array.from({ length: dim }, (_, i) => Math.sin(i));
    expect(cosineSimilarity(a, b)).toBeCloseTo(1, 10);
  });

  it('returns 0 when either vector is zero', () => {
    const a = [0, 0, 0];
    const b = [1, 2, 3];
    expect(cosineSimilarity(a, b)).toBe(0);
    expect(cosineSimilarity(b, a)).toBe(0);
  });

  it('returns 0 for mismatched lengths', () => {
    const a = [1, 2, 3];
    const b = [1, 2];
    expect(cosineSimilarity(a, b)).toBe(0);
  });
});

describe('keywordMatch', () => {
  it('returns higher score for more matching tokens', () => {
    const query = 'dashboard ui';
    const multi = keywordMatch(query, 'a dashboard with a custom ui for analytics');
    const single = keywordMatch(query, 'a ui for user management');
    expect(multi).toBeGreaterThan(single);
  });

  it('returns 0 when query has no tokens', () => {
    expect(keywordMatch('', 'anything')).toBe(0);
    expect(keywordMatch('   ', 'anything')).toBe(0);
  });

  it('is case-insensitive', () => {
    expect(keywordMatch('DASHBOARD', 'my dashboard')).toBeGreaterThan(0);
  });

  it('returns 0 when no tokens match', () => {
    expect(keywordMatch('foo bar', 'completely unrelated phrase')).toBe(0);
  });

  it('normalises score between 0 and 1', () => {
    const score = keywordMatch('x y z', 'x y z extra words here');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});

describe('buildEmbeddingText', () => {
  it('concatenates skill metadata fields', () => {
    const text = buildEmbeddingText({
      name: 'Clean Architecture',
      description: 'Domain-driven design',
      whenToUse: 'Apply when building backends',
      whenNotToUse: 'Not for trivial scripts',
      purpose: 'Separates concerns',
    });
    expect(text).toContain('Clean Architecture');
    expect(text).toContain('Domain-driven design');
    expect(text).toContain('Apply when building backends');
    expect(text).toContain('Not for trivial scripts');
    expect(text).toContain('Separates concerns');
  });

  it('handles missing optional fields gracefully', () => {
    const text = buildEmbeddingText({
      name: 'Skill',
      description: 'Description.',
    });
    expect(text).toContain('Skill');
    expect(text).toContain('Description.');
    expect(text.length).toBeGreaterThan(0);
  });

  it('returns empty string when no metadata', () => {
    const text = buildEmbeddingText({ name: '', description: '' });
    expect(text.trim()).toBe('');
  });
});

describe('serializeVector / deserializeVector', () => {
  it('round-trips a vector losslessly', () => {
    const v = [0.1, -0.5, 1.23456789, 0];
    const restored = deserializeVector(serializeVector(v));
    expect(restored.length).toBe(v.length);
    for (let i = 0; i < v.length; i++) {
      expect(restored[i]).toBeCloseTo(v[i], 10);
    }
  });

  it('returns empty array for invalid JSON', () => {
    expect(deserializeVector('not-json')).toEqual([]);
  });

  it('returns empty array for non-array JSON', () => {
    expect(deserializeVector('{"foo":1}')).toEqual([]);
  });
});

describe('rankByKeywordMatch', () => {
  it('ranks candidates by keyword score descending', () => {
    const candidates = [
      { slug: 'a', text: 'completely unrelated content here' },
      { slug: 'b', text: 'dashboard only here' },
      { slug: 'c', text: 'dashboard analytics charts data' },
    ];
    const results = rankByKeywordMatch('dashboard analytics charts', candidates);
    expect(results[0].slug).toBe('c');
    expect(results[1].slug).toBe('b');
    expect(results[0].score).toBeGreaterThan(results[1].score);
  });

  it('excludes candidates below threshold', () => {
    const candidates = [
      { slug: 'a', text: 'no overlap here' },
      { slug: 'b', text: 'dashboard for analytics' },
    ];
    const results = rankByKeywordMatch('dashboard', candidates, { threshold: 0.1 });
    expect(results.every((r) => r.score >= 0.1)).toBe(true);
    expect(results.find((r) => r.slug === 'a')).toBeUndefined();
  });

  it('returns empty for empty query', () => {
    const results = rankByKeywordMatch('', [{ slug: 'a', text: 'anything' }]);
    expect(results).toEqual([]);
  });

  it('respects topN limit', () => {
    const candidates = Array.from({ length: 10 }, (_, i) => ({
      slug: `s${i}`,
      text: 'dashboard with charts and analytics',
    }));
    const results = rankByKeywordMatch('dashboard', candidates, { topN: 3 });
    expect(results.length).toBe(3);
  });
});

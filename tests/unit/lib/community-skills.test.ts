/**
 * Tests for community skill publishing use case logic.
 *
 * Tests the pure business logic functions used by the publish API.
 * No DB or HTTP — just validation, parsing, and version computation.
 */

import { describe, it, expect } from 'vitest';
import {
  validatePublishInput,
  parseFrontmatter,
  computeNextVersion,
  computeContentChecksum,
  MAX_CONTENT_SIZE,
  SLUG_REGEX,
} from '@/platform/lib/community-skills';

describe('validatePublishInput', () => {
  const validInput = {
    slug: 'my-skill',
    name: 'My Skill',
    description: 'A description of my skill',
    content: '---\nname: My Skill\ndescription: A description\n---\n\n# My Skill\n\nContent.',
    commitMessage: 'Initial publish',
  };

  it('accepts valid input', () => {
    const result = validatePublishInput(validInput);
    expect(result.ok).toBe(true);
  });

  it('rejects empty content', () => {
    const result = validatePublishInput({ ...validInput, content: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('empty_content');
  });

  it('rejects content over size limit', () => {
    const result = validatePublishInput({ ...validInput, content: 'x'.repeat(MAX_CONTENT_SIZE + 1) });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('content_too_large');
  });

  it('rejects invalid slug format', () => {
    const result = validatePublishInput({ ...validInput, slug: 'My Skill' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('invalid_slug');
  });

  it('rejects missing name', () => {
    const result = validatePublishInput({ ...validInput, name: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('missing_name');
  });

  it('rejects missing description', () => {
    const result = validatePublishInput({ ...validInput, description: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('missing_description');
  });

  it('rejects missing commit message', () => {
    const result = validatePublishInput({ ...validInput, commitMessage: '' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('missing_commit_message');
  });

  it('rejects slug with path traversal characters', () => {
    const result = validatePublishInput({ ...validInput, slug: '../etc/passwd' });
    expect(result.ok).toBe(false);
  });

  it('rejects slug over 100 characters', () => {
    const result = validatePublishInput({ ...validInput, slug: 'a'.repeat(101) });
    expect(result.ok).toBe(false);
  });
});

describe('parseFrontmatter', () => {
  it('parses valid frontmatter', () => {
    const content = '---\nname: My Skill\ndescription: A test\ncategory: engineering\n---\n\n# My Skill';
    const result = parseFrontmatter(content);
    expect(result).toEqual({
      name: 'My Skill',
      description: 'A test',
      category: 'engineering',
    });
  });

  it('returns null for content without frontmatter', () => {
    const content = '# My Skill\n\nNo frontmatter here.';
    const result = parseFrontmatter(content);
    expect(result).toBeNull();
  });

  it('handles missing optional fields', () => {
    const content = '---\nname: My Skill\n---\n\n# My Skill';
    const result = parseFrontmatter(content);
    expect(result).not.toBeNull();
    expect(result!.name).toBe('My Skill');
    expect(result!.description).toBeUndefined();
  });
});

describe('computeNextVersion', () => {
  it('returns 1 for a new skill with no versions', () => {
    expect(computeNextVersion([])).toBe(1);
  });

  it('returns max + 1 for existing versions', () => {
    expect(computeNextVersion([1, 2, 3])).toBe(4);
  });

  it('handles non-sequential versions', () => {
    expect(computeNextVersion([1, 5, 3])).toBe(6);
  });
});

describe('computeContentChecksum', () => {
  it('returns a 64-char hex string', () => {
    const checksum = computeContentChecksum('test content');
    expect(checksum).toMatch(/^[0-9a-f]{64}$/);
  });

  it('is deterministic', () => {
    const a = computeContentChecksum('same');
    const b = computeContentChecksum('same');
    expect(a).toBe(b);
  });

  it('produces different checksums for different content', () => {
    const a = computeContentChecksum('content-a');
    const b = computeContentChecksum('content-b');
    expect(a).not.toBe(b);
  });
});

describe('SLUG_REGEX', () => {
  it('matches valid slugs', () => {
    expect(SLUG_REGEX.test('my-skill')).toBe(true);
    expect(SLUG_REGEX.test('a')).toBe(true);
    expect(SLUG_REGEX.test('test-123')).toBe(true);
  });

  it('rejects invalid slugs', () => {
    expect(SLUG_REGEX.test('')).toBe(false);
    expect(SLUG_REGEX.test('My Skill')).toBe(false);
    expect(SLUG_REGEX.test('-starts-with-dash')).toBe(false);
    expect(SLUG_REGEX.test('a'.repeat(101))).toBe(false);
  });
});

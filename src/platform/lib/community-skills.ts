/**
 * Community skill publishing — pure business logic.
 *
 * Handles validation, frontmatter parsing, version computation,
 * and checksum calculation. No DB or HTTP — those live in the API route.
 */

import { createHash } from 'crypto';
import { type Result, Ok, Err, ValidationError } from '@/platform/lib/result';

// ── Constants ────────────────────────────────────────────────────────

/** Maximum skill content size in bytes (100KB) */
export const MAX_CONTENT_SIZE = 100 * 1024;

/** Slug format: lowercase alphanumeric, hyphens allowed (not leading), 1-100 chars */
export const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{0,99}$/;

/** Maximum commit message length */
export const MAX_COMMIT_MESSAGE_LENGTH = 500;

/** Maximum name length */
export const MAX_NAME_LENGTH = 200;

/** Maximum description length */
export const MAX_DESCRIPTION_LENGTH = 1000;

// ── Input types ──────────────────────────────────────────────────────

export interface PublishInput {
  slug: string;
  name: string;
  description: string;
  content: string;
  commitMessage: string;
  category?: string;
}

export interface ValidatedPublishInput {
  slug: string;
  name: string;
  description: string;
  content: string;
  commitMessage: string;
  category: string | null;
}

// ── Frontmatter ──────────────────────────────────────────────────────

export interface SkillFrontmatter {
  name: string;
  description?: string;
  category?: string;
}

/**
 * Parse YAML-like frontmatter from skill content.
 * Returns null if no frontmatter block is found.
 */
export function parseFrontmatter(content: string): SkillFrontmatter | null {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const block = match[1];
  const fields: Record<string, string> = {};

  for (const line of block.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    if (key && value) fields[key] = value;
  }

  if (!fields.name) return null;

  return {
    name: fields.name,
    description: fields.description,
    category: fields.category,
  };
}

// ── Validation ───────────────────────────────────────────────────────

/**
 * Validate publish input. Returns the validated input or a ValidationError.
 */
export function validatePublishInput(input: PublishInput): Result<ValidatedPublishInput, ValidationError> {
  // Slug
  if (!input.slug || !SLUG_REGEX.test(input.slug)) {
    return Err(new ValidationError('invalid_slug', `Slug must match ${SLUG_REGEX} (1-100 lowercase alphanumeric chars and hyphens)`));
  }

  // Name
  if (!input.name || input.name.trim().length === 0) {
    return Err(new ValidationError('missing_name', 'Skill name is required'));
  }
  if (input.name.length > MAX_NAME_LENGTH) {
    return Err(new ValidationError('name_too_long', `Name must be under ${MAX_NAME_LENGTH} characters`));
  }

  // Description
  if (!input.description || input.description.trim().length === 0) {
    return Err(new ValidationError('missing_description', 'Skill description is required'));
  }
  if (input.description.length > MAX_DESCRIPTION_LENGTH) {
    return Err(new ValidationError('description_too_long', `Description must be under ${MAX_DESCRIPTION_LENGTH} characters`));
  }

  // Content
  if (!input.content || input.content.trim().length === 0) {
    return Err(new ValidationError('empty_content', 'Skill content cannot be empty'));
  }
  if (input.content.length > MAX_CONTENT_SIZE) {
    return Err(new ValidationError('content_too_large', `Content exceeds ${MAX_CONTENT_SIZE} byte limit (${input.content.length} bytes)`));
  }

  // Commit message
  if (!input.commitMessage || input.commitMessage.trim().length === 0) {
    return Err(new ValidationError('missing_commit_message', 'Commit message is required'));
  }
  if (input.commitMessage.length > MAX_COMMIT_MESSAGE_LENGTH) {
    return Err(new ValidationError('commit_message_too_long', `Commit message must be under ${MAX_COMMIT_MESSAGE_LENGTH} characters`));
  }

  return Ok({
    slug: input.slug,
    name: input.name.trim(),
    description: input.description.trim(),
    content: input.content,
    commitMessage: input.commitMessage.trim(),
    category: input.category?.trim() || null,
  });
}

// ── Version computation ──────────────────────────────────────────────

/**
 * Compute the next version number given existing version numbers.
 * First version is 1, subsequent versions are max + 1.
 */
export function computeNextVersion(existingVersions: number[]): number {
  if (existingVersions.length === 0) return 1;
  return Math.max(...existingVersions) + 1;
}

// ── Checksum ─────────────────────────────────────────────────────────

/**
 * Compute SHA-256 checksum of content.
 */
export function computeContentChecksum(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

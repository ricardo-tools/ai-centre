/**
 * Unified Result type for operations that can fail.
 * Use cases, server actions, and domain methods return Result instead of throwing.
 * Throw only for bugs (programmer errors), never for expected failures.
 */

export type Result<T, E extends Error = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E extends Error>(error: E): Result<never, E> {
  return { ok: false, error };
}

/** Type guard — narrows to success branch */
export function isOk<T, E extends Error>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}

/** Type guard — narrows to failure branch */
export function isErr<T, E extends Error>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}

// ── Domain Error subclasses ──────────────────────────────────────────

export class ValidationError extends Error {
  readonly code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = 'ValidationError';
    this.code = code;
  }
}

export class NotFoundError extends Error {
  readonly entity: string;
  constructor(entity: string, id?: string) {
    super(id ? `${entity} not found: ${id}` : `${entity} not found`);
    this.name = 'NotFoundError';
    this.entity = entity;
  }
}

export class AuthError extends Error {
  readonly code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.name = 'AuthError';
    this.code = code;
  }
}

export class ForbiddenError extends Error {
  readonly code: string;
  constructor(permission: string) {
    super(`Forbidden: missing permission ${permission}`);
    this.name = 'ForbiddenError';
    this.code = permission;
  }
}

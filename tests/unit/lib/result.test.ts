import { describe, it, expect } from 'vitest';
import { Ok, Err, isOk, isErr, ValidationError, NotFoundError, AuthError } from '@/platform/lib/result';

describe('Result', () => {
  describe('Ok', () => {
    it('creates a success result', () => {
      const result = Ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('narrows with isOk', () => {
      const result = Ok('hello');
      expect(isOk(result)).toBe(true);
      expect(isErr(result)).toBe(false);
    });
  });

  describe('Err', () => {
    it('creates a failure result', () => {
      const result = Err(new Error('boom'));
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.message).toBe('boom');
      }
    });

    it('narrows with isErr', () => {
      const result = Err(new Error('fail'));
      expect(isErr(result)).toBe(true);
      expect(isOk(result)).toBe(false);
    });
  });

  describe('ValidationError', () => {
    it('stores a code and message', () => {
      const err = new ValidationError('invalidDomain', 'Email domain not allowed');
      expect(err.code).toBe('invalidDomain');
      expect(err.message).toBe('Email domain not allowed');
      expect(err.name).toBe('ValidationError');
      expect(err).toBeInstanceOf(Error);
    });

    it('defaults message to code', () => {
      const err = new ValidationError('required');
      expect(err.message).toBe('required');
    });
  });

  describe('NotFoundError', () => {
    it('formats message with entity and id', () => {
      const err = new NotFoundError('Skill', 'frontend-architecture');
      expect(err.entity).toBe('Skill');
      expect(err.message).toBe('Skill not found: frontend-architecture');
    });

    it('formats message without id', () => {
      const err = new NotFoundError('User');
      expect(err.message).toBe('User not found');
    });
  });

  describe('AuthError', () => {
    it('stores code and message', () => {
      const err = new AuthError('expired', 'Token expired');
      expect(err.code).toBe('expired');
      expect(err.message).toBe('Token expired');
      expect(err.name).toBe('AuthError');
    });
  });
});

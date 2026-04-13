import { describe, it, expect } from 'vitest';
import {
  computeCodeChallenge,
  verifyPkceChallenge,
  hashToken,
  generateToken,
  generateAuthCode,
} from '@/platform/lib/oauth';

describe('OAuth PKCE', () => {
  describe('computeCodeChallenge', () => {
    it('returns a base64url-encoded SHA-256 hash', () => {
      // RFC 7636 Appendix B test vector
      const verifier = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk';
      const challenge = computeCodeChallenge(verifier);
      expect(challenge).toBe('E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM');
    });

    it('produces different challenges for different verifiers', () => {
      const a = computeCodeChallenge('verifier-a');
      const b = computeCodeChallenge('verifier-b');
      expect(a).not.toBe(b);
    });

    it('is deterministic', () => {
      const verifier = 'consistent-verifier';
      expect(computeCodeChallenge(verifier)).toBe(computeCodeChallenge(verifier));
    });
  });

  describe('verifyPkceChallenge', () => {
    it('returns true for matching verifier and challenge', () => {
      const verifier = 'my-test-verifier-string-that-is-long-enough';
      const challenge = computeCodeChallenge(verifier);
      expect(verifyPkceChallenge(verifier, challenge)).toBe(true);
    });

    it('returns false for wrong verifier', () => {
      const challenge = computeCodeChallenge('correct-verifier');
      expect(verifyPkceChallenge('wrong-verifier-string', challenge)).toBe(false);
    });

    it('returns false for tampered challenge', () => {
      const verifier = 'my-test-verifier-string-that-is-long-enough';
      expect(verifyPkceChallenge(verifier, 'tampered-challenge-value-here')).toBe(false);
    });
  });
});

describe('Token utilities', () => {
  describe('hashToken', () => {
    it('returns a hex-encoded SHA-256 hash', () => {
      const hash = hashToken('test-token');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('is deterministic', () => {
      expect(hashToken('same')).toBe(hashToken('same'));
    });

    it('produces different hashes for different tokens', () => {
      expect(hashToken('token-a')).not.toBe(hashToken('token-b'));
    });
  });

  describe('generateToken', () => {
    it('returns a base64url string', () => {
      const token = generateToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(token.length).toBeGreaterThanOrEqual(32);
    });

    it('generates unique tokens', () => {
      const tokens = new Set(Array.from({ length: 10 }, () => generateToken()));
      expect(tokens.size).toBe(10);
    });
  });

  describe('generateAuthCode', () => {
    it('returns a base64url string', () => {
      const code = generateAuthCode();
      expect(code).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(code.length).toBeGreaterThanOrEqual(32);
    });

    it('generates unique codes', () => {
      const codes = new Set(Array.from({ length: 10 }, () => generateAuthCode()));
      expect(codes.size).toBe(10);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { generateOtp, hashOtp, isAllowedDomain, ALLOWED_DOMAINS } from '@/platform/lib/otp';

describe('OTP utilities', () => {
  describe('generateOtp', () => {
    it('generates a 6-digit string', () => {
      const code = generateOtp();
      expect(code).toMatch(/^\d{6}$/);
    });

    it('generates different codes on successive calls', () => {
      const codes = new Set(Array.from({ length: 20 }, () => generateOtp()));
      // With 6-digit codes, 20 calls should produce at least 15 unique
      expect(codes.size).toBeGreaterThan(15);
    });
  });

  describe('hashOtp', () => {
    it('produces a 64-char hex string', async () => {
      const hash = await hashOtp('123456');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('produces the same hash for the same input', async () => {
      const a = await hashOtp('654321');
      const b = await hashOtp('654321');
      expect(a).toBe(b);
    });

    it('produces different hashes for different inputs', async () => {
      const a = await hashOtp('111111');
      const b = await hashOtp('222222');
      expect(a).not.toBe(b);
    });
  });

  describe('isAllowedDomain', () => {
    it('allows configured domains', () => {
      for (const domain of ALLOWED_DOMAINS) {
        expect(isAllowedDomain(`user@${domain}`)).toBe(true);
      }
    });

    it('rejects unknown domains', () => {
      expect(isAllowedDomain('user@gmail.com')).toBe(false);
      expect(isAllowedDomain('user@example.com')).toBe(false);
    });

    it('rejects invalid emails', () => {
      expect(isAllowedDomain('not-an-email')).toBe(false);
      expect(isAllowedDomain('')).toBe(false);
    });
  });
});

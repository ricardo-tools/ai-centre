import { randomInt } from 'crypto';

export const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_ATTEMPTS = 3;

export const ALLOWED_DOMAINS = [
  'ezycollect.com.au',
  'ezycollect.io',
  'sidetrade.com',
];

export function generateOtp(): string {
  return String(randomInt(100_000, 999_999));
}

export async function hashOtp(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function isAllowedDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

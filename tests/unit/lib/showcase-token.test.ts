// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { jwtVerify } from 'jose';

const TEST_SECRET = 'test-showcase-secret-at-least-32-chars-long';

describe('signShowcaseUrl', () => {
  beforeEach(() => {
    vi.stubEnv('SHOWCASE_JWT_SECRET', TEST_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  async function getModule() {
    // Dynamic import to pick up env changes
    return import('@/platform/lib/showcase-token');
  }

  it('returns a URL with a token query param', async () => {
    const { signShowcaseUrl } = await getModule();
    const result = await signShowcaseUrl('https://example.vercel.app');
    const url = new URL(result);
    expect(url.searchParams.has('token')).toBe(true);
    expect(url.searchParams.get('token')).toBeTruthy();
  });

  it('produces a valid JWT verifiable with the same secret', async () => {
    const { signShowcaseUrl } = await getModule();
    const result = await signShowcaseUrl('https://example.vercel.app');
    const url = new URL(result);
    const token = url.searchParams.get('token')!;

    const secret = new TextEncoder().encode(TEST_SECRET);
    const { payload } = await jwtVerify(token, secret);
    expect(payload).toBeDefined();
  });

  it('token payload contains { url: deployUrl }', async () => {
    const { signShowcaseUrl } = await getModule();
    const deployUrl = 'https://my-showcase.vercel.app';
    const result = await signShowcaseUrl(deployUrl);
    const url = new URL(result);
    const token = url.searchParams.get('token')!;

    const secret = new TextEncoder().encode(TEST_SECRET);
    const { payload } = await jwtVerify(token, secret);
    expect(payload.url).toBe(deployUrl);
  });

  it('token expires after 5 minutes', async () => {
    const { signShowcaseUrl } = await getModule();
    const result = await signShowcaseUrl('https://example.vercel.app');
    const url = new URL(result);
    const token = url.searchParams.get('token')!;

    const secret = new TextEncoder().encode(TEST_SECRET);
    const { payload } = await jwtVerify(token, secret);

    expect(payload.exp).toBeDefined();
    expect(payload.iat).toBeDefined();
    // exp - iat should be 300 seconds (5 minutes)
    const diff = payload.exp! - payload.iat!;
    expect(diff).toBe(300);
  });

  it('throws if SHOWCASE_JWT_SECRET is not set', async () => {
    vi.stubEnv('SHOWCASE_JWT_SECRET', '');
    const { signShowcaseUrl } = await getModule();
    await expect(signShowcaseUrl('https://example.vercel.app')).rejects.toThrow(
      'SHOWCASE_JWT_SECRET'
    );
  });

  it('handles deploy URLs that already have query params', async () => {
    const { signShowcaseUrl } = await getModule();
    const result = await signShowcaseUrl('https://example.vercel.app?foo=bar');
    const url = new URL(result);
    expect(url.searchParams.get('foo')).toBe('bar');
    expect(url.searchParams.has('token')).toBe(true);
  });

  it('URL is correctly formed with no double ?', async () => {
    const { signShowcaseUrl } = await getModule();
    const result = await signShowcaseUrl('https://example.vercel.app?existing=1');
    // Should not contain ??
    expect(result).not.toContain('??');
    // Should be parseable
    const url = new URL(result);
    expect(url.searchParams.get('existing')).toBe('1');
    expect(url.searchParams.get('token')).toBeTruthy();
  });
});

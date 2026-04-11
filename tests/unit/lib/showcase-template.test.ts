import { describe, it, expect, beforeAll } from 'vitest';
import { getTemplateFiles } from '@/platform/lib/showcase-template';

describe('showcase-template', () => {
  describe('getTemplateFiles', () => {
    it('returns middleware.ts and vercel.json keys', () => {
      const files = getTemplateFiles(false);
      expect(Object.keys(files)).toContain('middleware.ts');
      expect(Object.keys(files)).toContain('vercel.json');
    });

    it('returns exactly 2 template files', () => {
      const files = getTemplateFiles(false);
      expect(Object.keys(files)).toHaveLength(2);
    });

    it('places middleware at src/middleware.ts when hasSrcDir is true', () => {
      const files = getTemplateFiles(true);
      expect(Object.keys(files)).toContain('src/middleware.ts');
      expect(Object.keys(files)).not.toContain('middleware.ts');
    });

    it('places middleware at root when hasSrcDir is false', () => {
      const files = getTemplateFiles(false);
      expect(Object.keys(files)).toContain('middleware.ts');
      expect(Object.keys(files)).not.toContain('src/middleware.ts');
    });
  });

  describe('middleware.ts template', () => {
    let middleware: string;

    beforeAll(() => {
      middleware = getTemplateFiles(false)['middleware.ts'];
    });

    it('imports jwtVerify from jose', () => {
      expect(middleware).toContain("from 'jose'");
      expect(middleware).toContain('jwtVerify');
    });

    it('reads JWT_SECRET from process.env', () => {
      expect(middleware).toContain('process.env.JWT_SECRET');
    });

    it('reads ALLOWED_ORIGINS from process.env', () => {
      expect(middleware).toContain('process.env.ALLOWED_ORIGINS');
    });

    it('reads token from query param', () => {
      expect(middleware).toContain('token');
      expect(middleware).toMatch(/searchParams|url\.searchParams/);
    });

    it('returns 403 for blocked requests', () => {
      expect(middleware).toContain('403');
    });

    it('includes a human-readable blocked message', () => {
      expect(middleware).toContain('This preview is only available within AI Centre');
    });

    it('sets Content-Security-Policy frame-ancestors header', () => {
      expect(middleware).toContain('Content-Security-Policy');
      expect(middleware).toContain('frame-ancestors');
    });

    it('uses NextResponse.next() for valid tokens', () => {
      expect(middleware).toContain('NextResponse.next()');
    });

    it('has matcher config that skips static assets', () => {
      expect(middleware).toContain('_next/static');
      expect(middleware).toContain('_next/image');
      expect(middleware).toContain('favicon');
    });

    it('logs blocked requests with console.warn', () => {
      expect(middleware).toContain('console.warn');
      expect(middleware).toContain('[showcase-middleware]');
    });

    it('fails closed when JWT_SECRET is not set', () => {
      // The middleware should block all requests if JWT_SECRET is missing
      expect(middleware).toMatch(/JWT_SECRET/);
      // Should check for missing secret and block
      expect(middleware).toMatch(/!.*JWT_SECRET|JWT_SECRET.*!|no.*secret|secret.*not/i);
    });

    it('checks token expiry via jose jwtVerify', () => {
      // jose jwtVerify automatically checks expiry, but the template should use it
      expect(middleware).toContain('jwtVerify');
    });

    it('uses TextEncoder to encode the secret', () => {
      expect(middleware).toContain('TextEncoder');
    });

    it('exports a config with matcher', () => {
      expect(middleware).toContain('export const config');
      expect(middleware).toContain('matcher');
    });
  });

  describe('vercel.json template', () => {
    it('is valid JSON with framework set to nextjs', () => {
      const vercelJson = getTemplateFiles(false)['vercel.json'];
      const parsed = JSON.parse(vercelJson);
      expect(parsed.framework).toBe('nextjs');
    });
  });
});

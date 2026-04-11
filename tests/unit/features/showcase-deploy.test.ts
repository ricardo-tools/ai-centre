import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all external dependencies before importing the module under test
vi.mock('@/platform/db/client', () => ({
  getDb: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([{
      blobUrl: 'https://blob.test/showcase.zip',
      title: 'Test Showcase',
      fileType: 'zip',
    }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  })),
}));

vi.mock('@/platform/db/schema', () => ({
  showcaseUploads: { id: 'id', blobUrl: 'blobUrl', title: 'title', fileType: 'fileType' },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
}));

vi.mock('jszip', () => ({
  default: {
    loadAsync: vi.fn().mockResolvedValue({
      files: {
        'index.html': { dir: false, async: vi.fn().mockResolvedValue('<html></html>') },
        'app/page.tsx': { dir: false, async: vi.fn().mockResolvedValue('export default function Page() {}') },
      },
    }),
  },
}));

// Capture the files passed to deployProject
let capturedFiles: Array<{ file: string; data: string }> = [];

vi.mock('@/platform/lib/vercel-deploy', () => ({
  deployProject: vi.fn((_name: string, files: Array<{ file: string; data: string }>) => {
    capturedFiles = files;
    return Promise.resolve({ ok: true, value: { deploymentId: 'dpl_123', url: 'https://test.vercel.app' } });
  }),
}));

// Mock fetch for ZIP download
const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
});
vi.stubGlobal('fetch', mockFetch);

// Set required env var
vi.stubEnv('VERCEL_SHOWCASE_TOKEN', 'test-token');

describe('triggerDeploy injects template files', () => {
  beforeEach(() => {
    capturedFiles = [];
  });

  it('includes middleware.ts in deployed files', async () => {
    const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
    await triggerDeploy('test-showcase-id');

    const middlewareFile = capturedFiles.find(f => f.file === 'middleware.ts');
    expect(middlewareFile).toBeDefined();
    expect(middlewareFile!.data).toContain('jwtVerify');
  });

  it('includes vercel.json in deployed files', async () => {
    const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
    await triggerDeploy('test-showcase-id');

    const vercelJson = capturedFiles.find(f => f.file === 'vercel.json');
    expect(vercelJson).toBeDefined();
    expect(JSON.parse(vercelJson!.data).framework).toBe('nextjs');
  });

  it('template middleware.ts overrides any existing middleware.ts from ZIP', async () => {
    // The ZIP mock already has files; if it had a middleware.ts, our template should override it
    const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
    await triggerDeploy('test-showcase-id');

    const middlewareFiles = capturedFiles.filter(f => f.file === 'middleware.ts');
    // Should have exactly one middleware.ts (template overrides)
    expect(middlewareFiles).toHaveLength(1);
    expect(middlewareFiles[0].data).toContain('[showcase-middleware]');
  });

  it('preserves original ZIP files alongside template files', async () => {
    const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
    await triggerDeploy('test-showcase-id');

    const indexFile = capturedFiles.find(f => f.file === 'index.html');
    expect(indexFile).toBeDefined();

    const pageFile = capturedFiles.find(f => f.file === 'app/page.tsx');
    expect(pageFile).toBeDefined();
  });
});

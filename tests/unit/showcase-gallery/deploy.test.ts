import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────

// Mock fetch globally for ZIP fetching
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Mock deployProject
const mockDeployProject = vi.fn();
vi.mock('@/platform/lib/vercel-deploy', () => ({
  deployProject: (...args: unknown[]) => mockDeployProject(...args),
}));

// Mock DB client
const mockUpdate = vi.fn().mockReturnThis();
const mockSet = vi.fn().mockReturnThis();
const mockWhere = vi.fn().mockResolvedValue([]);
const mockSelect = vi.fn().mockReturnValue({
  from: vi.fn().mockReturnValue({
    where: vi.fn().mockReturnValue({
      limit: vi.fn().mockResolvedValue([{
        blobUrl: 'https://blob.vercel-storage.com/showcases/test.zip',
        title: 'My Showcase',
        fileType: 'zip',
      }]),
    }),
  }),
});

vi.mock('@/platform/db/client', () => ({
  getDb: () => ({
    update: (...args: unknown[]) => {
      mockUpdate(...args);
      return { set: (...sArgs: unknown[]) => { mockSet(...sArgs); return { where: mockWhere }; } };
    },
    select: (...args: unknown[]) => {
      mockSelect(...args);
      return {
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{
              blobUrl: 'https://blob.vercel-storage.com/showcases/test.zip',
              title: 'My Showcase',
              fileType: 'zip',
            }]),
          }),
        }),
      };
    },
  }),
  hasDatabase: () => true,
}));

vi.mock('@/platform/db/schema', () => ({
  showcaseUploads: {
    id: { name: 'id' },
    blobUrl: { name: 'blob_url' },
    title: { name: 'title' },
    fileType: { name: 'file_type' },
    deployStatus: { name: 'deploy_status' },
    deployUrl: { name: 'deploy_url' },
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: (col: unknown, val: unknown) => ({ col, val }),
}));

// ── Helpers ────────────────────────────────────────────────────────

/** Creates a minimal ZIP buffer using JSZip for test fixtures */
async function createTestZip(files: Record<string, string>): Promise<ArrayBuffer> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }
  return zip.generateAsync({ type: 'arraybuffer' });
}

// ── Tests ──────────────────────────────────────────────────────────

describe('showcase-gallery/deploy — triggerDeploy', () => {
  beforeEach(() => {
    vi.stubEnv('VERCEL_SHOWCASE_TOKEN', 'test-token');
    mockFetch.mockReset();
    mockDeployProject.mockReset();
    mockUpdate.mockClear();
    mockSet.mockClear();
    mockWhere.mockClear().mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Given a showcase ZIP uploaded to blob storage', () => {
    describe('When triggerDeploy is called with a valid showcaseId', () => {
      it('Then it should fetch the ZIP, extract files, and call deployProject', async () => {
        const zipBuffer = await createTestZip({
          'index.html': '<h1>Hello</h1>',
          'style.css': 'body { color: red; }',
        });

        // Mock fetch for ZIP download
        mockFetch.mockResolvedValueOnce({
          ok: true,
          arrayBuffer: async () => zipBuffer,
        });

        // Mock deployProject to succeed
        mockDeployProject.mockResolvedValueOnce({
          ok: true,
          value: { deploymentId: 'dpl_test123', url: 'my-showcase.vercel.app' },
        });

        const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
        await triggerDeploy('showcase-id-123');

        // Should have called deployProject with extracted files
        expect(mockDeployProject).toHaveBeenCalledOnce();
        const [projectName, files, target] = mockDeployProject.mock.calls[0];
        expect(projectName).toContain('showcase');
        // 2 ZIP files + 2 injected template files (middleware.ts, vercel.json)
        expect(files).toHaveLength(4);
        expect(files.find((f: { file: string }) => f.file === 'index.html')).toBeDefined();
        expect(files.find((f: { file: string }) => f.file === 'style.css')).toBeDefined();
        expect(files.find((f: { file: string }) => f.file === 'middleware.ts')).toBeDefined();
        expect(files.find((f: { file: string }) => f.file === 'vercel.json')).toBeDefined();
        expect(target).toBe('production'); // All showcases deploy to production
      });

      it('Then it should update DB status to "building" before deploy', async () => {
        const zipBuffer = await createTestZip({ 'index.html': '<h1>Hi</h1>' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          arrayBuffer: async () => zipBuffer,
        });

        mockDeployProject.mockResolvedValueOnce({
          ok: true,
          value: { deploymentId: 'dpl_test', url: 'test.vercel.app' },
        });

        const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
        await triggerDeploy('showcase-id-456');

        // First DB update should set status to 'building'
        expect(mockSet).toHaveBeenCalled();
        const firstSetCall = mockSet.mock.calls[0][0];
        expect(firstSetCall).toEqual(expect.objectContaining({ deployStatus: 'building' }));
      });

      it('Then it should update DB with deploy URL, deploymentId, and status "building" on success', async () => {
        const zipBuffer = await createTestZip({ 'index.html': '<h1>Hi</h1>' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          arrayBuffer: async () => zipBuffer,
        });

        mockDeployProject.mockResolvedValueOnce({
          ok: true,
          value: { deploymentId: 'dpl_success', url: 'success.vercel.app' },
        });

        const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
        await triggerDeploy('showcase-id-789');

        // Second DB update should set building + deploymentId + URL (polling detects READY later)
        const lastSetCall = mockSet.mock.calls[mockSet.mock.calls.length - 1][0];
        expect(lastSetCall).toEqual(expect.objectContaining({
          deployStatus: 'building',
          deployUrl: 'https://success.vercel.app',
          deploymentId: 'dpl_success',
        }));
      });
    });

    describe('When deployProject returns an error', () => {
      it('Then it should update DB status to "failed"', async () => {
        const zipBuffer = await createTestZip({ 'index.html': '<h1>Hi</h1>' });

        mockFetch.mockResolvedValueOnce({
          ok: true,
          arrayBuffer: async () => zipBuffer,
        });

        mockDeployProject.mockResolvedValueOnce({
          ok: false,
          error: new Error('Vercel API error 500: internal'),
        });

        const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
        await triggerDeploy('showcase-fail-id');

        const lastSetCall = mockSet.mock.calls[mockSet.mock.calls.length - 1][0];
        expect(lastSetCall).toEqual(expect.objectContaining({
          deployStatus: 'failed',
        }));
      });
    });

    describe('When the ZIP fetch fails', () => {
      it('Then it should update DB status to "failed" and not call deployProject', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
        });

        const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
        await triggerDeploy('showcase-fetch-fail');

        expect(mockDeployProject).not.toHaveBeenCalled();
        const lastSetCall = mockSet.mock.calls[mockSet.mock.calls.length - 1][0];
        expect(lastSetCall).toEqual(expect.objectContaining({
          deployStatus: 'failed',
        }));
      });
    });
  });

  describe('Security — ZIP path traversal', () => {
    it('should strip leading slashes from file paths', async () => {
      const zipBuffer = await createTestZip({ '/etc/passwd': 'evil' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => zipBuffer,
      });

      mockDeployProject.mockResolvedValueOnce({
        ok: true,
        value: { deploymentId: 'dpl_sec', url: 'sec.vercel.app' },
      });

      const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
      await triggerDeploy('showcase-sec-id');

      const [, files] = mockDeployProject.mock.calls[0];
      for (const f of files) {
        expect(f.file).not.toMatch(/^\//);
      }
    });

    it('should reject paths containing ".."', async () => {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      zip.file('safe/index.html', '<h1>safe</h1>');
      zip.file('../../../etc/passwd', 'evil');
      const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        arrayBuffer: async () => zipBuffer,
      });

      mockDeployProject.mockResolvedValueOnce({
        ok: true,
        value: { deploymentId: 'dpl_sec2', url: 'sec2.vercel.app' },
      });

      const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
      await triggerDeploy('showcase-sec2-id');

      const [, files] = mockDeployProject.mock.calls[0];
      for (const f of files) {
        expect(f.file).not.toContain('..');
      }
    });
  });

  describe('Given VERCEL_SHOWCASE_TOKEN is not set', () => {
    it('Then triggerDeploy should skip deployment and log a warning', async () => {
      vi.stubEnv('VERCEL_SHOWCASE_TOKEN', '');

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { triggerDeploy } = await import('@/features/showcase-gallery/deploy');
      await triggerDeploy('showcase-no-token');

      expect(mockDeployProject).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[showcase-deploy]'),
      );
      // Verify the single-string message mentions the token env var
      const warnMessage = consoleSpy.mock.calls[0][0] as string;
      expect(warnMessage).toContain('VERCEL_SHOWCASE_TOKEN');

      consoleSpy.mockRestore();
    });
  });
});

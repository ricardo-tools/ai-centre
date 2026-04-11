import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────

const mockDeleteDeployment = vi.fn();
const mockBlobDel = vi.fn().mockResolvedValue(undefined);

vi.mock('@/platform/lib/vercel-deploy', () => ({
  deleteDeployment: (...args: unknown[]) => mockDeleteDeployment(...args),
}));

vi.mock('@/platform/lib/guards', () => ({
  requireAuth: () => Promise.resolve({ ok: true, value: { userId: 'user-1', roleSlug: 'user' } }),
  requirePermission: () => Promise.resolve({ ok: true, value: undefined }),
  requireOwnerOrAdmin: () => ({ ok: true, value: undefined }),
}));

vi.mock('@vercel/blob', () => ({
  del: (...args: unknown[]) => mockBlobDel(...args),
}));

// DB mock infrastructure
let mockSelectResult: Record<string, unknown>[] = [];
const mockDeleteWhere = vi.fn().mockResolvedValue(undefined);

vi.mock('@/platform/db/client', () => ({
  getDb: () => ({
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockImplementation(() => Promise.resolve(mockSelectResult)),
        }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      where: (...args: unknown[]) => {
        mockDeleteWhere(...args);
        return Promise.resolve();
      },
    }),
  }),
  hasDatabase: () => true,
}));

vi.mock('@/platform/db/schema', () => ({
  showcaseUploads: {
    id: 'id',
    userId: 'userId',
    blobUrl: 'blobUrl',
    thumbnailUrl: 'thumbnailUrl',
    deploymentId: 'deploymentId',
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: (col: unknown, val: unknown) => ({ col, val }),
}));

// ── Tests ──────────────────────────────────────────────────────────

describe('deleteShowcase — deployment and thumbnail cleanup', () => {
  beforeEach(() => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-blob-token');
    mockDeleteDeployment.mockReset().mockResolvedValue({ ok: true, value: undefined });
    mockBlobDel.mockReset().mockResolvedValue(undefined);
    mockDeleteWhere.mockClear();
    mockSelectResult = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('When showcase has a deploymentId', () => {
    it('should fire-and-forget deleteDeployment', async () => {
      mockSelectResult = [{
        userId: 'user-1',
        blobUrl: 'https://blob.test/showcase.zip',
        thumbnailUrl: null,
        deploymentId: 'dpl_abc123',
      }];

      const { deleteShowcase } = await import('@/features/showcase-gallery/action');
      const result = await deleteShowcase('showcase-1');

      expect(result.ok).toBe(true);

      // Give fire-and-forget a tick to resolve
      await vi.waitFor(() => {
        expect(mockDeleteDeployment).toHaveBeenCalledWith('dpl_abc123');
      });

      // DB deletion should still happen
      expect(mockDeleteWhere).toHaveBeenCalled();
    });
  });

  describe('When showcase has NO deploymentId', () => {
    it('should NOT call deleteDeployment', async () => {
      mockSelectResult = [{
        userId: 'user-1',
        blobUrl: 'https://blob.test/showcase.html',
        thumbnailUrl: null,
        deploymentId: null,
      }];

      const { deleteShowcase } = await import('@/features/showcase-gallery/action');
      const result = await deleteShowcase('showcase-1');

      expect(result.ok).toBe(true);
      expect(mockDeleteDeployment).not.toHaveBeenCalled();
      expect(mockDeleteWhere).toHaveBeenCalled();
    });
  });

  describe('When Vercel deployment delete fails', () => {
    it('should still delete blob and DB row', async () => {
      mockDeleteDeployment.mockReset().mockResolvedValue({ ok: false, error: new Error('Vercel API error') });

      mockSelectResult = [{
        userId: 'user-1',
        blobUrl: 'https://blob.test/showcase.zip',
        thumbnailUrl: null,
        deploymentId: 'dpl_fail456',
      }];

      const { deleteShowcase } = await import('@/features/showcase-gallery/action');
      const result = await deleteShowcase('showcase-1');

      expect(result.ok).toBe(true);

      // Blob and DB deletion should proceed regardless
      expect(mockBlobDel).toHaveBeenCalledWith('https://blob.test/showcase.zip');
      expect(mockDeleteWhere).toHaveBeenCalled();
    });
  });

  describe('When showcase has a thumbnailUrl', () => {
    it('should delete the thumbnail blob', async () => {
      mockSelectResult = [{
        userId: 'user-1',
        blobUrl: 'https://blob.test/showcase.zip',
        thumbnailUrl: 'https://blob.test/thumbs/thumb.png',
        deploymentId: null,
      }];

      const { deleteShowcase } = await import('@/features/showcase-gallery/action');
      const result = await deleteShowcase('showcase-1');

      expect(result.ok).toBe(true);

      // Both main blob and thumbnail should be deleted
      expect(mockBlobDel).toHaveBeenCalledWith('https://blob.test/showcase.zip');
      expect(mockBlobDel).toHaveBeenCalledWith('https://blob.test/thumbs/thumb.png');
    });
  });

  describe('When showcase has no thumbnailUrl', () => {
    it('should only delete the main blob', async () => {
      mockSelectResult = [{
        userId: 'user-1',
        blobUrl: 'https://blob.test/showcase.zip',
        thumbnailUrl: null,
        deploymentId: null,
      }];

      const { deleteShowcase } = await import('@/features/showcase-gallery/action');
      const result = await deleteShowcase('showcase-1');

      expect(result.ok).toBe(true);

      expect(mockBlobDel).toHaveBeenCalledTimes(1);
      expect(mockBlobDel).toHaveBeenCalledWith('https://blob.test/showcase.zip');
    });
  });
});

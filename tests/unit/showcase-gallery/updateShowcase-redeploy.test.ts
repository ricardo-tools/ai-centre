import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────

// Track calls
const mockDeleteDeployment = vi.fn().mockResolvedValue(undefined);
const mockTriggerDeploy = vi.fn().mockResolvedValue(undefined);

// Mock deploy module (fire-and-forget import)
vi.mock('@/features/showcase-gallery/deploy', () => ({
  triggerDeploy: (...args: unknown[]) => mockTriggerDeploy(...args),
}));

vi.mock('@/platform/lib/vercel-deploy', () => ({
  deleteDeployment: (...args: unknown[]) => mockDeleteDeployment(...args),
}));

// Mock auth — use plain functions (not vi.fn()) so vi.restoreAllMocks() doesn't clear them
vi.mock('@/platform/lib/guards', () => ({
  requireAuth: () => Promise.resolve({ ok: true, value: { userId: 'user-1', roleSlug: 'user' } }),
  requirePermission: () => Promise.resolve({ ok: true, value: undefined }),
  requireOwnerOrAdmin: () => ({ ok: true, value: undefined }),
}));

// Mock Vercel Blob — use plain function so vi.restoreAllMocks() doesn't clear it
vi.mock('@vercel/blob', () => ({
  put: () => Promise.resolve({ url: 'https://blob.test/new-showcase.zip' }),
}));

// DB mock infrastructure
let mockSelectResult: Record<string, unknown>[] = [];
const mockSetCalls: Record<string, unknown>[] = [];
const mockDbUpdate = vi.fn();
const mockDbSet = vi.fn();
const mockDbWhere = vi.fn();

vi.mock('@/platform/db/client', () => ({
  getDb: () => ({
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockImplementation(() => Promise.resolve(mockSelectResult)),
        }),
      }),
    }),
    update: (...args: unknown[]) => {
      mockDbUpdate(...args);
      return {
        set: (data: Record<string, unknown>) => {
          mockSetCalls.push(data);
          mockDbSet(data);
          return {
            where: (...wArgs: unknown[]) => {
              mockDbWhere(...wArgs);
              return Promise.resolve();
            },
          };
        },
      };
    },
  }),
  hasDatabase: () => true,
}));

vi.mock('@/platform/db/schema', () => ({
  showcaseUploads: {
    id: 'id',
    userId: 'userId',
    fileType: 'fileType',
    deployStatus: 'deployStatus',
    deployUrl: 'deployUrl',
    deploymentId: 'deploymentId',
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: (col: unknown, val: unknown) => ({ col, val }),
}));

// ── Helpers ────────────────────────────────────────────────────────

function createFormData(overrides: Record<string, string | File> = {}): FormData {
  const fd = new FormData();
  fd.set('title', overrides.title as string ?? 'Test Title');
  fd.set('description', overrides.description as string ?? 'Test desc');
  fd.set('skillIds', overrides.skillIds as string ?? '[]');
  if (overrides.file) {
    fd.set('file', overrides.file);
  }
  return fd;
}

function createZipFile(name = 'showcase.zip', size = 1024): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type: 'application/zip' });
}

function createHtmlFile(name = 'showcase.html', size = 512): File {
  const content = '<html><body>Hello</body></html>';
  return new File([content], name, { type: 'text/html' });
}

// ── Tests ──────────────────────────────────────────────────────────

describe('updateShowcase — re-deploy on update', () => {
  beforeEach(() => {
    vi.stubEnv('VERCEL_SHOWCASE_TOKEN', 'test-token');
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-blob-token');
    mockDeleteDeployment.mockReset().mockResolvedValue(undefined);
    mockTriggerDeploy.mockReset().mockResolvedValue(undefined);
    mockDbUpdate.mockClear();
    mockDbSet.mockClear();
    mockDbWhere.mockClear();
    mockSetCalls.length = 0;
    mockSelectResult = [];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('When updating with a new ZIP file and old showcase had a deployment', () => {
    it('should delete the old deployment', async () => {
      mockSelectResult = [{ userId: 'user-1', fileType: 'zip', deploymentId: 'dpl_old123', deployStatus: 'ready' }];

      const fd = createFormData({ file: createZipFile() });
      const { updateShowcase } = await import('@/features/showcase-gallery/action');
      const result = await updateShowcase('showcase-1', fd);

      expect(result.ok).toBe(true);
      // deleteDeployment should have been called with the old deploymentId
      // Give fire-and-forget a tick to resolve
      await vi.waitFor(() => {
        expect(mockDeleteDeployment).toHaveBeenCalledWith('dpl_old123');
      });
    });

    it('should trigger a new deployment', async () => {
      mockSelectResult = [{ userId: 'user-1', fileType: 'zip', deploymentId: 'dpl_old123', deployStatus: 'ready' }];

      const fd = createFormData({ file: createZipFile() });
      const { updateShowcase } = await import('@/features/showcase-gallery/action');
      const result = await updateShowcase('showcase-1', fd);

      expect(result.ok).toBe(true);
      await vi.waitFor(() => {
        expect(mockTriggerDeploy).toHaveBeenCalledWith('showcase-1');
      });
    });

    it('should reset deploy_status to pending and clear deployUrl/deploymentId', async () => {
      mockSelectResult = [{ userId: 'user-1', fileType: 'zip', deploymentId: 'dpl_old123', deployStatus: 'ready' }];

      const fd = createFormData({ file: createZipFile() });
      const { updateShowcase } = await import('@/features/showcase-gallery/action');
      await updateShowcase('showcase-1', fd);

      // The DB set call should include deploy reset fields
      expect(mockSetCalls.length).toBeGreaterThanOrEqual(1);
      const setData = mockSetCalls[0];
      expect(setData).toEqual(expect.objectContaining({
        deployStatus: 'pending',
        deployUrl: null,
        deploymentId: null,
      }));
    });
  });

  describe('When updating with a new ZIP file but old showcase had no deployment', () => {
    it('should set deploy_status to pending and trigger deploy without deleting', async () => {
      mockSelectResult = [{ userId: 'user-1', fileType: 'zip', deploymentId: null, deployStatus: 'none' }];

      const fd = createFormData({ file: createZipFile() });
      const { updateShowcase } = await import('@/features/showcase-gallery/action');
      await updateShowcase('showcase-1', fd);

      expect(mockDeleteDeployment).not.toHaveBeenCalled();

      const setData = mockSetCalls[0];
      expect(setData).toEqual(expect.objectContaining({
        deployStatus: 'pending',
        deployUrl: null,
        deploymentId: null,
      }));

      await vi.waitFor(() => {
        expect(mockTriggerDeploy).toHaveBeenCalledWith('showcase-1');
      });
    });
  });

  describe('When updating without a file change (metadata only)', () => {
    it('should NOT trigger deploy or delete deployment', async () => {
      mockSelectResult = [{ userId: 'user-1', fileType: 'zip', deploymentId: 'dpl_existing', deployStatus: 'ready' }];

      const fd = createFormData(); // no file
      const { updateShowcase } = await import('@/features/showcase-gallery/action');
      const result = await updateShowcase('showcase-1', fd);

      expect(result.ok).toBe(true);
      expect(mockDeleteDeployment).not.toHaveBeenCalled();
      expect(mockTriggerDeploy).not.toHaveBeenCalled();

      // Deploy fields should NOT be in the set call
      const setData = mockSetCalls[0];
      expect(setData).not.toHaveProperty('deployStatus');
      expect(setData).not.toHaveProperty('deployUrl');
      expect(setData).not.toHaveProperty('deploymentId');
    });
  });

  describe('When updating from ZIP to HTML and old showcase had a deployment', () => {
    it('should delete old deployment and set deploy_status to none', async () => {
      mockSelectResult = [{ userId: 'user-1', fileType: 'zip', deploymentId: 'dpl_old_zip', deployStatus: 'ready' }];

      const fd = createFormData({ file: createHtmlFile() });
      const { updateShowcase } = await import('@/features/showcase-gallery/action');
      const result = await updateShowcase('showcase-1', fd);

      expect(result.ok).toBe(true);

      await vi.waitFor(() => {
        expect(mockDeleteDeployment).toHaveBeenCalledWith('dpl_old_zip');
      });

      // Should NOT trigger a new deploy (HTML doesn't get deployed)
      expect(mockTriggerDeploy).not.toHaveBeenCalled();

      // Deploy status should be 'none'
      const setData = mockSetCalls[0];
      expect(setData).toEqual(expect.objectContaining({
        deployStatus: 'none',
        deployUrl: null,
        deploymentId: null,
      }));
    });
  });
});

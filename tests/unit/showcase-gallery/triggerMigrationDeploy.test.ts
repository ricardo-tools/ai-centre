import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────

const mockUpdate = vi.fn().mockReturnThis();
const mockSet = vi.fn().mockReturnThis();
const mockWhere = vi.fn().mockResolvedValue([]);

// Configurable row returned by SELECT
let mockSelectRow: Record<string, unknown> | null = null;

vi.mock('@/platform/db/client', () => ({
  getDb: () => ({
    update: (...args: unknown[]) => {
      mockUpdate(...args);
      return { set: (...sArgs: unknown[]) => { mockSet(...sArgs); return { where: mockWhere }; } };
    },
    select: () => ({
      from: () => ({
        where: () => ({
          limit: vi.fn().mockImplementation(() =>
            Promise.resolve(mockSelectRow ? [mockSelectRow] : []),
          ),
        }),
      }),
    }),
  }),
  hasDatabase: () => true,
}));

vi.mock('@/platform/db/schema', () => ({
  showcaseUploads: {
    id: { name: 'id' },
    fileType: { name: 'file_type' },
    deployStatus: { name: 'deploy_status' },
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: (col: unknown, val: unknown) => ({ col, val }),
}));

const mockTriggerDeploy = vi.fn().mockResolvedValue(undefined);
vi.mock('@/features/showcase-gallery/deploy', () => ({
  triggerDeploy: (...args: unknown[]) => mockTriggerDeploy(...args),
}));

// Mock next/server after() to execute callbacks immediately
vi.mock('next/server', () => ({
  after: (fn: () => Promise<void>) => { fn(); },
}));

// ── Tests ──────────────────────────────────────────────────────────

describe('showcase-gallery/action — triggerMigrationDeploy', () => {
  beforeEach(() => {
    vi.stubEnv('VERCEL_SHOWCASE_TOKEN', 'test-token');
    mockUpdate.mockClear();
    mockSet.mockClear();
    mockWhere.mockClear().mockResolvedValue([]);
    mockTriggerDeploy.mockClear().mockResolvedValue(undefined);
    mockSelectRow = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Given a pre-migration ZIP showcase with deployStatus "none"', () => {
    beforeEach(() => {
      mockSelectRow = {
        fileType: 'zip',
        deployStatus: 'none',
      };
    });

    it('Then it should set deployStatus to "pending" and call triggerDeploy', async () => {
      const { triggerMigrationDeploy } = await import('@/features/showcase-gallery/action');
      const result = await triggerMigrationDeploy('showcase-migrate-1');

      expect(result.ok).toBe(true);

      // Should update DB to 'pending'
      expect(mockSet).toHaveBeenCalledWith(
        expect.objectContaining({ deployStatus: 'pending' }),
      );

      // Fire-and-forget uses dynamic import — wait for microtasks to flush
      await vi.waitFor(() => {
        expect(mockTriggerDeploy).toHaveBeenCalledWith('showcase-migrate-1');
      });
    });
  });

  describe('Given a ZIP showcase with deployStatus "ready"', () => {
    beforeEach(() => {
      mockSelectRow = {
        fileType: 'zip',
        deployStatus: 'ready',
      };
    });

    it('Then it should be a no-op and return Ok', async () => {
      const { triggerMigrationDeploy } = await import('@/features/showcase-gallery/action');
      const result = await triggerMigrationDeploy('showcase-already-ready');

      expect(result.ok).toBe(true);
      expect(mockSet).not.toHaveBeenCalled();
      expect(mockTriggerDeploy).not.toHaveBeenCalled();
    });
  });

  describe('Given a ZIP showcase with deployStatus "pending"', () => {
    beforeEach(() => {
      mockSelectRow = {
        fileType: 'zip',
        deployStatus: 'pending',
      };
    });

    it('Then it should be a no-op and return Ok', async () => {
      const { triggerMigrationDeploy } = await import('@/features/showcase-gallery/action');
      const result = await triggerMigrationDeploy('showcase-already-pending');

      expect(result.ok).toBe(true);
      expect(mockSet).not.toHaveBeenCalled();
      expect(mockTriggerDeploy).not.toHaveBeenCalled();
    });
  });

  describe('Given a ZIP showcase with deployStatus "building"', () => {
    beforeEach(() => {
      mockSelectRow = {
        fileType: 'zip',
        deployStatus: 'building',
      };
    });

    it('Then it should be a no-op and return Ok', async () => {
      const { triggerMigrationDeploy } = await import('@/features/showcase-gallery/action');
      const result = await triggerMigrationDeploy('showcase-building');

      expect(result.ok).toBe(true);
      expect(mockSet).not.toHaveBeenCalled();
      expect(mockTriggerDeploy).not.toHaveBeenCalled();
    });
  });

  describe('Given an HTML showcase with deployStatus "none"', () => {
    beforeEach(() => {
      mockSelectRow = {
        fileType: 'html',
        deployStatus: 'none',
      };
    });

    it('Then it should be a no-op and return Ok', async () => {
      const { triggerMigrationDeploy } = await import('@/features/showcase-gallery/action');
      const result = await triggerMigrationDeploy('showcase-html');

      expect(result.ok).toBe(true);
      expect(mockSet).not.toHaveBeenCalled();
      expect(mockTriggerDeploy).not.toHaveBeenCalled();
    });
  });

  describe('Given a showcase that does not exist', () => {
    beforeEach(() => {
      mockSelectRow = null;
    });

    it('Then it should return a NotFoundError', async () => {
      const { triggerMigrationDeploy } = await import('@/features/showcase-gallery/action');
      const result = await triggerMigrationDeploy('nonexistent-id');

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.name).toBe('NotFoundError');
      }
    });
  });
});

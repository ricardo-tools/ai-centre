import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Test: checkDeployStatus server action ──

// Mock DB and schema
const mockDbSelect = vi.fn();
const mockDbUpdate = vi.fn();
const mockDbFrom = vi.fn();
const mockDbWhere = vi.fn();
const mockDbLimit = vi.fn();
const mockDbSet = vi.fn();

vi.mock('@/platform/db/client', () => ({
  getDb: () => ({
    select: mockDbSelect,
    from: mockDbFrom,
    where: mockDbWhere,
    limit: mockDbLimit,
    update: mockDbUpdate,
    set: mockDbSet,
  }),
  hasDatabase: () => true,
}));

vi.mock('@/platform/db/schema', () => ({
  showcaseUploads: {
    id: 'id',
    deployStatus: 'deploy_status',
    deployUrl: 'deploy_url',
    deploymentId: 'deployment_id',
  },
  users: {
    id: 'id',
    name: 'name',
  },
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((_col: unknown, val: unknown) => ({ _eq: val })),
  desc: vi.fn(),
}));

// Mock auth guard to pass
vi.mock('@/platform/lib/guards', () => ({
  requireAuth: vi.fn().mockResolvedValue({ ok: true, value: { userId: 'user-1', roleSlug: 'member' } }),
  requirePermission: vi.fn().mockResolvedValue({ ok: true, value: { userId: 'user-1' } }),
  requireOwnerOrAdmin: vi.fn().mockReturnValue({ ok: true, value: undefined }),
}));

// Mock getDeploymentStatus from vercel-deploy
const mockGetDeploymentStatus = vi.fn();
vi.mock('@/platform/lib/vercel-deploy', () => ({
  getDeploymentStatus: (...args: unknown[]) => mockGetDeploymentStatus(...args),
}));

describe('checkDeployStatus server action', () => {
  beforeEach(() => {
    vi.resetModules();

    // Default: chain returns a building row with deploymentId
    mockDbSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{
            deployStatus: 'building',
            deployUrl: 'https://test.vercel.app',
            deploymentId: 'dpl_abc123',
          }]),
        }),
      }),
    });

    mockDbUpdate.mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns current DB status when status is building and Vercel says building', async () => {
    mockGetDeploymentStatus.mockResolvedValue({
      ok: true,
      value: { status: 'building', url: null },
    });

    const { checkDeployStatus } = await import('@/features/showcase-gallery/action');
    const result = await checkDeployStatus('showcase-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.deployStatus).toBe('building');
    }
  });

  it('updates DB and returns ready when Vercel says READY', async () => {
    mockGetDeploymentStatus.mockResolvedValue({
      ok: true,
      value: { status: 'ready', url: 'test.vercel.app' },
    });

    const { checkDeployStatus } = await import('@/features/showcase-gallery/action');
    const result = await checkDeployStatus('showcase-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.deployStatus).toBe('ready');
      expect(result.value.deployUrl).toContain('vercel.app');
    }
  });

  it('returns ready directly when DB already says ready', async () => {
    mockDbSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{
            deployStatus: 'ready',
            deployUrl: 'https://ready.vercel.app',
            deploymentId: 'dpl_abc123',
          }]),
        }),
      }),
    });

    const { checkDeployStatus } = await import('@/features/showcase-gallery/action');
    const result = await checkDeployStatus('showcase-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.deployStatus).toBe('ready');
      expect(result.value.deployUrl).toBe('https://ready.vercel.app');
    }
    // Should NOT call Vercel API when already ready
    expect(mockGetDeploymentStatus).not.toHaveBeenCalled();
  });

  it('returns failed when DB says failed', async () => {
    mockDbSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([{
            deployStatus: 'failed',
            deployUrl: null,
            deploymentId: 'dpl_abc123',
          }]),
        }),
      }),
    });

    const { checkDeployStatus } = await import('@/features/showcase-gallery/action');
    const result = await checkDeployStatus('showcase-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.deployStatus).toBe('failed');
    }
    expect(mockGetDeploymentStatus).not.toHaveBeenCalled();
  });

  it('returns error when showcase not found', async () => {
    mockDbSelect.mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    });

    const { checkDeployStatus } = await import('@/features/showcase-gallery/action');
    const result = await checkDeployStatus('nonexistent');

    expect(result.ok).toBe(false);
  });

  it('falls back to DB status when Vercel API fails', async () => {
    mockGetDeploymentStatus.mockResolvedValue({
      ok: false,
      error: new Error('API error'),
    });

    const { checkDeployStatus } = await import('@/features/showcase-gallery/action');
    const result = await checkDeployStatus('showcase-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      // Falls back to DB status
      expect(result.value.deployStatus).toBe('building');
    }
  });

  it('updates DB to failed when Vercel returns failed status', async () => {
    mockGetDeploymentStatus.mockResolvedValue({
      ok: true,
      value: { status: 'failed', url: null },
    });

    const { checkDeployStatus } = await import('@/features/showcase-gallery/action');
    const result = await checkDeployStatus('showcase-1');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.deployStatus).toBe('failed');
    }
  });
});

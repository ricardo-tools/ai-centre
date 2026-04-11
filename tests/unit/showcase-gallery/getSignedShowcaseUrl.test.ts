import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────

// Mock hasDatabase to return false (use manifest-based path)
vi.mock('@/platform/db/client', () => ({
  getDb: vi.fn(),
  hasDatabase: () => false,
}));

// Mock signShowcaseUrl
const mockSignShowcaseUrl = vi.fn();
vi.mock('@/platform/lib/showcase-token', () => ({
  signShowcaseUrl: (...args: unknown[]) => mockSignShowcaseUrl(...args),
}));

// Mock fs/promises for manifest reading
const mockReadFile = vi.fn();
vi.mock('fs/promises', () => ({
  readFile: (...args: unknown[]) => mockReadFile(...args),
  mkdir: vi.fn(),
  writeFile: vi.fn(),
}));

// ── Helpers ────────────────────────────────────────────────────────

function makeShowcase(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sc-1',
    userId: 'u-1',
    userName: 'Test User',
    title: 'My Showcase',
    description: null,
    skillIds: [],
    fileType: 'zip',
    blobUrl: 'https://blob.vercel-storage.com/showcases/test.zip',
    thumbnailUrl: null,
    fileName: 'project.zip',
    fileSizeBytes: 1024,
    deployStatus: 'ready',
    deployUrl: 'https://my-showcase.vercel.app',
    createdAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

function mockManifest(entries: Record<string, unknown>[]) {
  mockReadFile.mockResolvedValue(JSON.stringify(entries));
}

// ── Tests ──────────────────────────────────────────────────────────

describe('getSignedShowcaseUrl', () => {
  beforeEach(() => {
    mockReadFile.mockReset();
    mockSignShowcaseUrl.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Given a ZIP showcase with deployStatus "ready"', () => {
    it('Then it should return a signed URL', async () => {
      const showcase = makeShowcase();
      mockManifest([showcase]);
      mockSignShowcaseUrl.mockResolvedValueOnce('https://my-showcase.vercel.app?token=eyJ...');

      const { getSignedShowcaseUrl } = await import('@/features/showcase-gallery/action');
      const result = await getSignedShowcaseUrl('sc-1');

      expect(result).toBe('https://my-showcase.vercel.app?token=eyJ...');
      expect(mockSignShowcaseUrl).toHaveBeenCalledWith('https://my-showcase.vercel.app');
    });
  });

  describe('Given an HTML showcase', () => {
    it('Then it should return null', async () => {
      const showcase = makeShowcase({ id: 'sc-html', fileType: 'html', deployStatus: 'none', deployUrl: null });
      mockManifest([showcase]);

      const { getSignedShowcaseUrl } = await import('@/features/showcase-gallery/action');
      const result = await getSignedShowcaseUrl('sc-html');

      expect(result).toBeNull();
      expect(mockSignShowcaseUrl).not.toHaveBeenCalled();
    });
  });

  describe('Given a ZIP showcase with deployStatus "pending"', () => {
    it('Then it should return null', async () => {
      const showcase = makeShowcase({ id: 'sc-pending', deployStatus: 'pending', deployUrl: null });
      mockManifest([showcase]);

      const { getSignedShowcaseUrl } = await import('@/features/showcase-gallery/action');
      const result = await getSignedShowcaseUrl('sc-pending');

      expect(result).toBeNull();
      expect(mockSignShowcaseUrl).not.toHaveBeenCalled();
    });
  });

  describe('Given a ZIP showcase with deployStatus "failed"', () => {
    it('Then it should return null', async () => {
      const showcase = makeShowcase({ id: 'sc-failed', deployStatus: 'failed', deployUrl: null });
      mockManifest([showcase]);

      const { getSignedShowcaseUrl } = await import('@/features/showcase-gallery/action');
      const result = await getSignedShowcaseUrl('sc-failed');

      expect(result).toBeNull();
      expect(mockSignShowcaseUrl).not.toHaveBeenCalled();
    });
  });

  describe('Given a showcase that does not exist', () => {
    it('Then it should return null', async () => {
      mockManifest([]); // empty manifest — no showcases

      const { getSignedShowcaseUrl } = await import('@/features/showcase-gallery/action');
      const result = await getSignedShowcaseUrl('nonexistent');

      expect(result).toBeNull();
      expect(mockSignShowcaseUrl).not.toHaveBeenCalled();
    });
  });
});

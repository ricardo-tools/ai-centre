import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';

// ── Mocks ──────────────────────────────────────────────────────────

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [k: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));


// Mock SessionContext
vi.mock('@/platform/lib/SessionContext', () => ({
  useSession: () => ({ userId: 'u-1', roleSlug: 'user' }),
}));

// Mock social features
vi.mock('@/features/social/reactions-action', () => ({
  toggleReaction: vi.fn().mockResolvedValue({ ok: true, value: { added: true } }),
  getReactionCounts: vi.fn().mockResolvedValue({ counts: {}, userReactions: [] }),
}));

vi.mock('@/features/social/action', () => ({
  trackShowcaseView: vi.fn().mockResolvedValue(undefined),
  getShowcaseViewCount: vi.fn().mockResolvedValue(0),
}));

vi.mock('@/features/social/bookmarks-action', () => ({
  toggleBookmark: vi.fn().mockResolvedValue({ ok: true, value: { bookmarked: false } }),
  isBookmarked: vi.fn().mockResolvedValue(false),
}));

const mockRetryDeploy = vi.fn().mockResolvedValue({ ok: true, value: undefined });
vi.mock('@/features/showcase-gallery/action', () => ({
  deleteShowcase: vi.fn(),
  updateShowcase: vi.fn(),
  getSignedShowcaseUrl: vi.fn().mockResolvedValue(null),
  retryDeploy: (...args: unknown[]) => mockRetryDeploy(...args),
}));

const mockResetStatus = vi.fn();
vi.mock('@/features/showcase-gallery/hooks/useDeployPolling', () => ({
  useDeployPolling: (_id: string, status: string, url: string | null) => ({
    deployStatus: status,
    deployUrl: url,
    resetStatus: (...args: unknown[]) => mockResetStatus(...args),
  }),
}));

// Mock ReactionBar and friends to keep tests focused
vi.mock('@/platform/components/ReactionBar', () => ({
  ReactionBar: () => <div data-testid="reaction-bar" />,
}));

vi.mock('@/platform/components/BookmarkButton', () => ({
  BookmarkButton: () => <button data-testid="bookmark-button" />,
}));

vi.mock('@/platform/components/CommentThread', () => ({
  CommentThread: () => <div data-testid="comment-thread" />,
}));

// ── Helpers ────────────────────────────────────────────────────────

function makeShowcase(overrides: Record<string, unknown> = {}) {
  return {
    id: 'sc-1',
    userId: 'u-1',
    userName: 'Test User',
    title: 'My Showcase',
    description: 'A showcase description',
    skillIds: [],
    fileType: 'zip' as const,
    blobUrl: 'https://blob.vercel-storage.com/showcases/test.zip',
    thumbnailUrl: null,
    fileName: 'project.zip',
    fileSizeBytes: 1024,
    deployStatus: 'ready',
    deployUrl: 'https://my-showcase.vercel.app',
    deploymentId: 'dpl_test123',
    createdAt: '2025-01-01T00:00:00.000Z',
    ...overrides,
  };
}

// ── Tests ──────────────────────────────────────────────────────────

describe('ShowcaseViewerWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Given a ZIP showcase with signedDeployUrl', () => {
    it('Then it should render an iframe with the signed URL', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(
        <ShowcaseViewerWidget
          showcase={makeShowcase()}
          signedDeployUrl="https://my-showcase.vercel.app?token=eyJ..."
        />,
      );

      const iframe = screen.getByTestId('showcase-preview-iframe');
      expect(iframe).toBeInTheDocument();
      expect(iframe).toHaveAttribute('src', 'https://my-showcase.vercel.app?token=eyJ...');
      expect(iframe).toHaveAttribute('title', 'My Showcase');
    });
  });

  describe('Given a ZIP showcase WITHOUT signedDeployUrl', () => {
    it('Then it should render the "No preview available" fallback', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(
        <ShowcaseViewerWidget showcase={makeShowcase()} />,
      );

      // No deployed iframe should exist
      expect(screen.queryByTestId('showcase-preview-iframe')).not.toBeInTheDocument();

      // Should show fallback message with download link
      expect(screen.getByText('No preview available')).toBeInTheDocument();
      expect(screen.getByText('Download ZIP')).toBeInTheDocument();
    });
  });

  describe('Given an HTML showcase', () => {
    it('Then it should render an iframe with sandbox and blobProxy URL (unchanged)', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(
        <ShowcaseViewerWidget
          showcase={makeShowcase({ fileType: 'html', deployStatus: 'none', deployUrl: null })}
        />,
      );

      // Should NOT have the deployed ZIP iframe
      expect(screen.queryByTestId('showcase-preview-iframe')).not.toBeInTheDocument();

      // Should have a sandboxed HTML iframe
      const iframes = document.querySelectorAll('iframe');
      const htmlIframe = Array.from(iframes).find((iframe) =>
        iframe.getAttribute('sandbox')?.includes('allow-scripts'),
      );
      expect(htmlIframe).toBeDefined();
      expect(htmlIframe?.getAttribute('src')).toContain('/api/blob?url=');
    });
  });

  describe('Fullscreen with signedDeployUrl', () => {
    it('Then fullscreen button should be enabled for deployed ZIP', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(
        <ShowcaseViewerWidget
          showcase={makeShowcase()}
          signedDeployUrl="https://my-showcase.vercel.app?token=eyJ..."
        />,
      );

      const fullscreenBtn = screen.getByText('Fullscreen').closest('button');
      expect(fullscreenBtn).not.toBeDisabled();
    });
  });

  describe('Given a ZIP showcase with deployStatus failed', () => {
    const failedShowcase = () => makeShowcase({ deployStatus: 'failed', deployUrl: null, deploymentId: 'dpl_old' });

    it('Then it should show the failed state container', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(<ShowcaseViewerWidget showcase={failedShowcase()} />);

      expect(screen.getByTestId('deploy-failed')).toBeInTheDocument();
    });

    it('Then it should show an error message', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(<ShowcaseViewerWidget showcase={failedShowcase()} />);

      const msg = screen.getByTestId('deploy-error-message');
      expect(msg).toBeInTheDocument();
      expect(msg.textContent).toContain('Something went wrong');
    });

    it('Then it should show a Retry Deploy button', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(<ShowcaseViewerWidget showcase={failedShowcase()} />);

      const retryBtn = screen.getByTestId('deploy-retry-btn');
      expect(retryBtn).toBeInTheDocument();
      expect(retryBtn.textContent).toContain('Retry Deploy');
    });

    it('Then it should show a Download ZIP fallback link', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(<ShowcaseViewerWidget showcase={failedShowcase()} />);

      const downloadLink = screen.getByTestId('deploy-download-fallback');
      expect(downloadLink).toBeInTheDocument();
      expect(downloadLink).toHaveAttribute('href', expect.stringContaining('blob'));
      expect(downloadLink).toHaveAttribute('download', 'project.zip');
    });

    it('Then clicking Retry Deploy calls retryDeploy action and resets status on success', async () => {
      const { fireEvent } = await import('@testing-library/react');
      mockRetryDeploy.mockResolvedValue({ ok: true, value: undefined });

      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(<ShowcaseViewerWidget showcase={failedShowcase()} />);

      const retryBtn = screen.getByTestId('deploy-retry-btn');
      await act(async () => {
        fireEvent.click(retryBtn);
      });

      expect(mockRetryDeploy).toHaveBeenCalledWith('sc-1');
      expect(mockResetStatus).toHaveBeenCalledWith('pending');
    });

    it('Then it should NOT render the deploy iframe or spinner', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(<ShowcaseViewerWidget showcase={failedShowcase()} />);

      expect(screen.queryByTestId('showcase-preview-iframe')).not.toBeInTheDocument();
      expect(screen.queryByTestId('deploy-spinner')).not.toBeInTheDocument();
    });
  });

  describe('Given a ZIP showcase with deployStatus pending', () => {
    it('Then it should show the deploying spinner', async () => {
      const { ShowcaseViewerWidget } = await import(
        '@/features/showcase-gallery/widgets/ShowcaseViewerWidget/ShowcaseViewerWidget'
      );

      render(
        <ShowcaseViewerWidget
          showcase={makeShowcase({ deployStatus: 'pending', deployUrl: null })}
        />,
      );

      expect(screen.getByTestId('deploy-status-message')).toBeInTheDocument();
      expect(screen.getByTestId('deploy-spinner')).toBeInTheDocument();
    });
  });
});

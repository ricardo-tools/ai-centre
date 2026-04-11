import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We mock fetch globally to simulate Vercel API responses
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

// Set the env var before importing the module
vi.stubEnv('VERCEL_SHOWCASE_TOKEN', 'test-token-abc123');

describe('vercel-deploy module', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Given a valid project to deploy', () => {
    describe('When deployProject is called with project name, files, and target', () => {
      it('Then it should return Ok with deploymentId and url on success', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 'dpl_abc123',
            url: 'my-project-abc123.vercel.app',
          }),
        });

        const { deployProject } = await import('@/platform/lib/vercel-deploy');
        const result = await deployProject('my-project', [
          { file: 'index.html', data: '<h1>Hello</h1>' },
        ], 'production');

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.deploymentId).toBe('dpl_abc123');
          expect(result.value.url).toBe('my-project-abc123.vercel.app');
        }

        // Verify the fetch was called with correct params
        expect(mockFetch).toHaveBeenCalledOnce();
        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1');
        expect(options.method).toBe('POST');
        expect(options.headers['Authorization']).toBe('Bearer test-token-abc123');
        const body = JSON.parse(options.body);
        expect(body.name).toBe('ai-centre-showcases');
        expect(body.target).toBe('production');
        expect(body.files).toEqual([{ file: 'index.html', data: '<h1>Hello</h1>' }]);
      });
    });

    describe('When the Vercel API returns an error', () => {
      it('Then deployProject should return Err with descriptive message', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 403,
          statusText: 'Forbidden',
          json: async () => ({ error: { message: 'Invalid token' } }),
        });

        const { deployProject } = await import('@/platform/lib/vercel-deploy');
        const result = await deployProject('my-project', [
          { file: 'index.html', data: '<h1>Hello</h1>' },
        ], 'production');

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error.message).toContain('403');
        }
      });
    });

    describe('When the fetch itself throws (network error)', () => {
      it('Then deployProject should return Err', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const { deployProject } = await import('@/platform/lib/vercel-deploy');
        const result = await deployProject('my-project', [
          { file: 'index.html', data: '<h1>Hello</h1>' },
        ], 'production');

        expect(result.ok).toBe(false);
        if (!result.ok) {
          expect(result.error.message).toContain('Network error');
        }
      });
    });
  });

  describe('Given a deployment to delete', () => {
    describe('When deleteDeployment is called with a valid deployment ID', () => {
      it('Then it should return Ok on success', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

        const { deleteDeployment } = await import('@/platform/lib/vercel-deploy');
        const result = await deleteDeployment('dpl_abc123');

        expect(result.ok).toBe(true);

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toBe('https://api.vercel.com/v13/deployments/dpl_abc123');
        expect(options.method).toBe('DELETE');
      });
    });

    describe('When the delete API returns an error', () => {
      it('Then it should return Err', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          statusText: 'Not Found',
          json: async () => ({ error: { message: 'Deployment not found' } }),
        });

        const { deleteDeployment } = await import('@/platform/lib/vercel-deploy');
        const result = await deleteDeployment('dpl_nonexistent');

        expect(result.ok).toBe(false);
      });
    });
  });

  describe('Given a deployment to check status', () => {
    describe('When getDeploymentStatus is called', () => {
      it('Then QUEUED state should map to "building"', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ readyState: 'QUEUED', url: null }),
        });

        const { getDeploymentStatus } = await import('@/platform/lib/vercel-deploy');
        const result = await getDeploymentStatus('dpl_abc123');

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.status).toBe('building');
          expect(result.value.url).toBeNull();
        }
      });

      it('Then BUILDING state should map to "building"', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ readyState: 'BUILDING', url: null }),
        });

        const { getDeploymentStatus } = await import('@/platform/lib/vercel-deploy');
        const result = await getDeploymentStatus('dpl_abc123');

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.status).toBe('building');
        }
      });

      it('Then READY state should map to "ready" with url', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ readyState: 'READY', url: 'my-project-abc123.vercel.app' }),
        });

        const { getDeploymentStatus } = await import('@/platform/lib/vercel-deploy');
        const result = await getDeploymentStatus('dpl_abc123');

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.status).toBe('ready');
          expect(result.value.url).toBe('my-project-abc123.vercel.app');
        }
      });

      it('Then ERROR state should map to "failed"', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ readyState: 'ERROR', url: null }),
        });

        const { getDeploymentStatus } = await import('@/platform/lib/vercel-deploy');
        const result = await getDeploymentStatus('dpl_abc123');

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.status).toBe('failed');
        }
      });

      it('Then CANCELED state should map to "failed"', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ readyState: 'CANCELED', url: null }),
        });

        const { getDeploymentStatus } = await import('@/platform/lib/vercel-deploy');
        const result = await getDeploymentStatus('dpl_abc123');

        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value.status).toBe('failed');
        }
      });
    });

    describe('When the status API returns an error', () => {
      it('Then it should return Err', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ error: { message: 'Server error' } }),
        });

        const { getDeploymentStatus } = await import('@/platform/lib/vercel-deploy');
        const result = await getDeploymentStatus('dpl_abc123');

        expect(result.ok).toBe(false);
      });
    });
  });

  describe('Security', () => {
    it('should not include the token value in log-safe output', async () => {
      // The token should be used in headers but never logged
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'dpl_x', url: 'x.vercel.app' }),
      });

      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      const { deployProject } = await import('@/platform/lib/vercel-deploy');
      await deployProject('test', [{ file: 'index.html', data: '' }], 'production');

      // Check that no console.info call contains the raw token
      for (const call of consoleSpy.mock.calls) {
        const serialized = JSON.stringify(call);
        expect(serialized).not.toContain('test-token-abc123');
      }

      consoleSpy.mockRestore();
    });
  });
});

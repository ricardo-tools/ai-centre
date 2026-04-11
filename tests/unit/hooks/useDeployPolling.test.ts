import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock the server action
const mockCheckDeployStatus = vi.fn();
vi.mock('@/features/showcase-gallery/action', () => ({
  checkDeployStatus: (...args: unknown[]) => mockCheckDeployStatus(...args),
}));

describe('useDeployPolling hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockCheckDeployStatus.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns initial status and url when status is already ready', async () => {
    const { useDeployPolling } = await import('@/features/showcase-gallery/hooks/useDeployPolling');

    const { result } = renderHook(() =>
      useDeployPolling('showcase-1', 'ready', 'https://deployed.vercel.app'),
    );

    expect(result.current.deployStatus).toBe('ready');
    expect(result.current.deployUrl).toBe('https://deployed.vercel.app');
    // Should not start polling
    expect(mockCheckDeployStatus).not.toHaveBeenCalled();
  });

  it('polls immediately on mount when status is building', async () => {
    mockCheckDeployStatus.mockResolvedValue({
      ok: true,
      value: { deployStatus: 'building', deployUrl: null },
    });

    const { useDeployPolling } = await import('@/features/showcase-gallery/hooks/useDeployPolling');

    renderHook(() =>
      useDeployPolling('showcase-1', 'building', null),
    );

    // Flush the immediate poll
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(mockCheckDeployStatus).toHaveBeenCalledWith('showcase-1');
  });

  it('polls immediately on mount when status is pending', async () => {
    mockCheckDeployStatus.mockResolvedValue({
      ok: true,
      value: { deployStatus: 'pending', deployUrl: null },
    });

    const { useDeployPolling } = await import('@/features/showcase-gallery/hooks/useDeployPolling');

    renderHook(() =>
      useDeployPolling('showcase-1', 'pending', null),
    );

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(mockCheckDeployStatus).toHaveBeenCalledWith('showcase-1');
  });

  it('stops polling when status transitions to ready', async () => {
    let callCount = 0;
    mockCheckDeployStatus.mockImplementation(async () => {
      callCount++;
      if (callCount >= 3) {
        return { ok: true, value: { deployStatus: 'ready', deployUrl: 'https://ready.vercel.app' } };
      }
      return { ok: true, value: { deployStatus: 'building', deployUrl: null } };
    });

    const { useDeployPolling } = await import('@/features/showcase-gallery/hooks/useDeployPolling');

    const { result } = renderHook(() =>
      useDeployPolling('showcase-1', 'building', null),
    );

    // First poll (immediate) + interval setup
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    // Advance past one interval poll
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    // Third poll transitions to ready
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(result.current.deployStatus).toBe('ready');
    expect(result.current.deployUrl).toBe('https://ready.vercel.app');

    // No more polls should happen
    const callsAfterReady = mockCheckDeployStatus.mock.calls.length;
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });
    expect(mockCheckDeployStatus.mock.calls.length).toBe(callsAfterReady);
  });

  it('does not poll for none or failed status', async () => {
    const { useDeployPolling } = await import('@/features/showcase-gallery/hooks/useDeployPolling');

    renderHook(() =>
      useDeployPolling('showcase-1', 'none', null),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(10000);
    });

    expect(mockCheckDeployStatus).not.toHaveBeenCalled();
  });

  it('resetStatus sets status and clears url, restarting polling', async () => {
    mockCheckDeployStatus.mockResolvedValue({
      ok: true,
      value: { deployStatus: 'pending', deployUrl: null },
    });

    const { useDeployPolling } = await import('@/features/showcase-gallery/hooks/useDeployPolling');

    const { result } = renderHook(() =>
      useDeployPolling('showcase-1', 'failed', null),
    );

    // Initially failed — no polling
    expect(result.current.deployStatus).toBe('failed');
    expect(mockCheckDeployStatus).not.toHaveBeenCalled();

    // Call resetStatus to restart polling
    await act(async () => {
      result.current.resetStatus('pending');
    });

    expect(result.current.deployStatus).toBe('pending');
    expect(result.current.deployUrl).toBeNull();

    // Now polling should start
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    expect(mockCheckDeployStatus).toHaveBeenCalledWith('showcase-1');
  });

  it('continues polling silently when server action returns error', async () => {
    let callCount = 0;
    mockCheckDeployStatus.mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        return { ok: false, error: new Error('Network error') };
      }
      return { ok: true, value: { deployStatus: 'building', deployUrl: null } };
    });

    const { useDeployPolling } = await import('@/features/showcase-gallery/hooks/useDeployPolling');

    const { result } = renderHook(() =>
      useDeployPolling('showcase-1', 'building', null),
    );

    // First poll fails
    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    // Status should remain building (unchanged)
    expect(result.current.deployStatus).toBe('building');

    // Second poll succeeds
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(result.current.deployStatus).toBe('building');
    expect(callCount).toBeGreaterThanOrEqual(2);
  });
});

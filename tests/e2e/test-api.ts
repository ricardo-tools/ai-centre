/**
 * Shared helpers for E2E tests — thin wrappers around /api/test-setup.
 *
 * Each worker gets its own server on a different port.
 * createTestApi(port) returns helpers bound to that port.
 */

async function post(baseUrl: string, body: Record<string, unknown>): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${baseUrl}/api/test-setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`test-setup ${body.action} failed (${res.status}): ${text}`);
    }
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}

export function createTestApi(port: number) {
  const baseUrl = `http://localhost:${port}`;

  return {
    mark: () => post(baseUrl, { action: 'mark' }) as Promise<{ ok: boolean; mark: string }>,
    rollbackToMark: (mark: string) => post(baseUrl, { action: 'rollback-to-mark', mark }),
    cleanTransactional: () => post(baseUrl, { action: 'clean-transactional' }),
    cleanTables: (tables: string[]) => post(baseUrl, { action: 'clean', tables }),
    seedData: (data: Record<string, Record<string, unknown>[]>) => post(baseUrl, { action: 'seed', data }),
    verifySeed: () => post(baseUrl, { action: 'verify-seed' }) as Promise<{
      ok: boolean;
      counts: { roles: number; users: number; skills: number };
    }>,
  };
}

/** Convenience: testApi bound to default port (used by global-setup) */
export const testApi = createTestApi(3100);

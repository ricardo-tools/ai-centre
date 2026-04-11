export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { installLogCapture } = await import('@/platform/lib/server-logs');
    installLogCapture();

    // Seeds run at runtime (idempotent, safe for concurrent cold starts).
    // Migrations run at build time — see scripts/migrate.ts.
    try {
      const { runSeedsFromInstrumentation } = await import('@/platform/lib/migrate');
      await runSeedsFromInstrumentation();
    } catch (err) {
      console.error('[instrumentation] Seed failed:', err);
    }
  }
}

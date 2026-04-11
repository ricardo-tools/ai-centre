export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 0. Install dev log capture (only when SKIP_AUTH=true)
    const { installLogCapture } = await import('@/platform/lib/server-logs');
    installLogCapture();

    // 1a. Run one-shot pre-migration resets (e.g. schema drops for clean rebuild)
    try {
      const { runPreMigrationResets } = await import('@/platform/lib/migrate');
      await runPreMigrationResets();
    } catch (err) {
      console.error('[instrumentation] Pre-migration reset failed:', err);
      // Continue — migrations may still work if reset wasn't needed
    }

    // 1b. Run pending database migrations (blocking — tables must exist before anything else)
    try {
      const { runMigrations } = await import('@/platform/lib/migrate');
      await runMigrations();
    } catch (err) {
      console.error('[instrumentation] Migration failed — seed will be skipped:', err);
      return;
    }

    // 2. Run pending data seeds (roles, permissions, skills — versioned and tracked)
    try {
      const { runSeedsFromInstrumentation } = await import('@/platform/lib/migrate');
      await runSeedsFromInstrumentation();
    } catch (err) {
      console.error('[instrumentation] Seed failed:', err);
    }

    // 2. Sentry (future)
    if (process.env.SENTRY_DSN) {
      // const Sentry = await import('@sentry/nextjs');
      // Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
    }
  }
}

'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  console.error('[error-boundary]', error.message, error.digest);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: 16, padding: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)' }}>Something went wrong</h2>
      <p style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'center', maxWidth: 400 }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      {error.digest && (
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
          Error ID: {error.digest}
        </p>
      )}
      <button
        onClick={reset}
        style={{ padding: '8px 24px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text-body)', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}
      >
        Try again
      </button>
    </div>
  );
}

'use client';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center', padding: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>{error.message || 'A critical error occurred.'}</p>
          {error.digest && <p style={{ fontSize: 12, color: '#999', fontFamily: 'monospace' }}>Error ID: {error.digest}</p>}
          <button onClick={reset} style={{ padding: '8px 24px', borderRadius: 6, border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: 14 }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * OAuth consent page — shown to already-logged-in users during the
 * CLI OAuth flow. Asks them to confirm granting access before
 * redirecting to /api/auth/callback to issue an authorization code.
 */
export default function OAuthConsentPage() {
  const router = useRouter();
  const [isDenying, setIsDenying] = useState(false);

  function handleAllow() {
    // Redirect to callback — session + oauth-params cookie are already set
    window.location.href = '/api/auth/callback';
  }

  function handleDeny() {
    setIsDenying(true);
    // Clear the oauth-params cookie by hitting a simple deny path,
    // or just redirect home. The CLI will timeout waiting.
    router.push('/');
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '24px',
        background: 'var(--color-bg-primary)',
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: '100%',
          background: 'var(--color-bg-secondary)',
          borderRadius: 16,
          padding: '40px 32px',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            fontSize: 24,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            margin: '0 0 8px',
          }}
        >
          Authorize CLI Access
        </h1>

        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-secondary)',
            margin: '0 0 32px',
            lineHeight: 1.5,
          }}
        >
          A CLI tool is requesting access to your AI Centre account.
          This will allow it to download skills and manage your workspace.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleAllow}
            style={{
              padding: '12px 24px',
              fontSize: 15,
              fontWeight: 600,
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              background: 'var(--color-accent)',
              color: 'var(--color-text-on-accent)',
              transition: 'opacity 0.15s',
            }}
          >
            Allow Access
          </button>

          <button
            onClick={handleDeny}
            disabled={isDenying}
            style={{
              padding: '12px 24px',
              fontSize: 15,
              fontWeight: 500,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              cursor: isDenying ? 'not-allowed' : 'pointer',
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              opacity: isDenying ? 0.5 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}

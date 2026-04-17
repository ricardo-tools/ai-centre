import { redirect } from 'next/navigation';
import { verifyShareLink } from '@/platform/lib/sharing';
import { Lock } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

interface SharedPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function SharedPage({ searchParams }: SharedPageProps) {
  const { token } = await searchParams;

  if (token) {
    const result = await verifyShareLink(token);

    if (result) {
      // Valid share link — redirect to the resource with share context
      const path = result.resourceType === 'showcase'
        ? `/gallery/${result.resourceId}?share=${encodeURIComponent(token)}`
        : `/skills/${result.resourceId}?share=${encodeURIComponent(token)}`;

      redirect(path);
    }
  }

  // Invalid, expired, or missing token — show error page
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 32,
        background: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient orbs */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%', width: '50vw', height: '50vw',
        borderRadius: '50%', background: 'var(--color-primary-muted)', opacity: 0.4,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%', width: '40vw', height: '40vw',
        borderRadius: '50%', background: 'var(--color-secondary-muted, rgba(59, 130, 246, 0.08))', opacity: 0.3,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--color-surface)',
          borderRadius: 16,
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: 40,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--color-bg-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Lock size={28} weight="bold" style={{ color: 'var(--color-text-muted)' }} />
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--color-text-heading)',
            margin: '0 0 8px',
          }}
        >
          Link expired or revoked
        </h1>

        <p
          style={{
            fontSize: 14,
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            margin: '0 0 28px',
          }}
        >
          This share link is no longer valid. It may have expired or been revoked by the owner.
          Ask the person who shared it with you for a new link.
        </p>

        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 28px',
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Sign in
        </Link>
      </div>

      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 24, opacity: 0.6, position: 'relative', zIndex: 1 }}>
        ezyCollect by Sidetrade
      </p>
    </div>
  );
}

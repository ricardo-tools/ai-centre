'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, FileHtml, FileZip, Calendar, Package } from '@phosphor-icons/react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { getProfile, type UserProfileData } from '@/features/social/profile-action';
import { useSession } from '@/platform/lib/SessionContext';

/* ── Helpers ─────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function Avatar({ name, avatarUrl, size = 64 }: { name: string; avatarUrl: string | null; size?: number }) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  }

  const initial = name.charAt(0).toUpperCase() || '?';
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--color-primary)',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: PhosphorIcon }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Icon size={24} weight="regular" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function ShowcaseCard({ showcase }: { showcase: { id: string; title: string; fileType: string; createdAt: string } }) {
  const FileIcon = showcase.fileType === 'html' ? FileHtml : FileZip;
  const typeLabel = showcase.fileType === 'html' ? 'HTML' : 'ZIP';

  return (
    <Link
      href={`/gallery/${showcase.id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        textDecoration: 'none',
        gap: 8,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '2px 8px',
            borderRadius: 4,
            background: 'var(--color-primary-muted)',
            color: 'var(--color-primary)',
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <FileIcon size={12} weight="bold" />
          {typeLabel}
        </div>
      </div>
      <h4
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
          margin: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {showcase.title}
      </h4>
      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
        {formatDate(showcase.createdAt)}
      </span>
    </Link>
  );
}

/* ── Main ────────────────────────────────────────────────── */

interface ProfileContentProps {
  userId: string;
}

export function ProfileContent({ userId }: ProfileContentProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  const isOwnProfile = session?.userId === userId;

  useEffect(() => {
    getProfile(userId)
      .then((result) => {
        if (result.ok) {
          setProfile(result.value);
        } else {
          setError(result.error.message);
        }
      })
      .catch(() => {
        setError('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
        Loading profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 8 }}>
          Profile not found
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: 0 }}>
          {error ?? 'This user does not exist.'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 32,
          padding: 24,
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
        }}
      >
        <Avatar name={profile.name} avatarUrl={profile.avatarUrl} size={72} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--color-text-heading)',
              margin: '0 0 4px',
            }}
          >
            {profile.name}
            {isOwnProfile && (
              <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: 8 }}>
                (you)
              </span>
            )}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
            {profile.email}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
            <Calendar size={14} weight="regular" />
            <span>Member since {formatDate(profile.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard label="Skills authored" value={profile.skillsAuthoredCount} icon={Package} />
        <StatCard label="Showcases uploaded" value={profile.showcaseCount} icon={FileHtml} />
      </div>

      {/* ── Showcases ── */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            marginBottom: 16,
          }}
        >
          Showcases uploaded
        </h2>
        {profile.showcases.length === 0 ? (
          <div
            style={{
              padding: 32,
              borderRadius: 8,
              border: '1px dashed var(--color-border)',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: 13,
            }}
          >
            No showcases yet.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
              gap: 16,
            }}
          >
            {profile.showcases.map((s) => (
              <ShowcaseCard key={s.id} showcase={s} />
            ))}
          </div>
        )}
      </section>

      {/* ── Skills authored ── */}
      <section>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
            marginBottom: 16,
          }}
        >
          Skills authored
        </h2>
        {profile.skillsAuthored.length === 0 ? (
          <div
            style={{
              padding: 32,
              borderRadius: 8,
              border: '1px dashed var(--color-border)',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: 13,
            }}
          >
            No skills authored yet.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
              gap: 16,
            }}
          >
            {profile.skillsAuthored.map((s) => (
              <Link
                key={s.slug}
                href={`/skills/${s.slug}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 16,
                  borderRadius: 8,
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  textDecoration: 'none',
                  gap: 4,
                }}
              >
                <h4
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-text-heading)',
                    margin: 0,
                  }}
                >
                  {s.title}
                </h4>
                <p
                  style={{
                    fontSize: 12,
                    color: 'var(--color-text-muted)',
                    margin: 0,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {s.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

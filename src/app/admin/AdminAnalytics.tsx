'use client';

import { useState, useEffect } from 'react';
import { ChartBar, Eye, DownloadSimple, Users, Images, CalendarBlank } from '@phosphor-icons/react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { getCommunityAnalytics, type CommunityAnalytics } from '@/features/social/analytics-action';

/* ── Helpers ─────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SectionCard({ title, icon: Icon, children }: { title: string; icon: PhosphorIcon; children: React.ReactNode }) {
  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg-alt)',
        }}
      >
        <Icon size={16} weight="regular" style={{ color: 'var(--color-primary)' }} />
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', margin: 0 }}>
          {title}
        </h3>
      </div>
      <div style={{ padding: 16 }}>{children}</div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: number; icon: PhosphorIcon }) {
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Icon size={20} weight="regular" style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-heading)', lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 24,
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: 13,
      }}
    >
      {text}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */

export function AdminAnalytics() {
  const [data, setData] = useState<CommunityAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCommunityAnalytics()
      .then((result) => {
        if (result.ok) {
          setData(result.value);
        } else {
          setError(result.error.message);
        }
      })
      .catch(() => {
        setError('Failed to load analytics');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 14 }}>
        Loading analytics...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ padding: 24, color: 'var(--color-danger)', fontSize: 14 }}>
        {error ?? 'Failed to load analytics'}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* ── Overview metrics ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px, 100%), 1fr))',
          gap: 16,
        }}
      >
        <MetricCard label="Total users" value={data.totalUsers} icon={Users} />
        <MetricCard label="Total showcases" value={data.totalShowcases} icon={Images} />
        <MetricCard label="Showcases this month" value={data.showcasesThisMonth} icon={CalendarBlank} />
      </div>

      {/* ── Two-column layout for lists ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(360px, 100%), 1fr))',
          gap: 24,
        }}
      >
        {/* Top downloaded skills */}
        <SectionCard title="Top Downloaded Skills" icon={DownloadSimple}>
          {data.topSkills.length === 0 ? (
            <EmptyRow text="No download data yet." />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Skill
                  </th>
                  <th style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Downloads
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topSkills.map((skill, i) => (
                  <tr key={skill.slug}>
                    <td
                      style={{
                        fontSize: 13,
                        color: 'var(--color-text-body)',
                        padding: '6px 0',
                        borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      {skill.slug}
                    </td>
                    <td
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--color-text-heading)',
                        textAlign: 'right',
                        padding: '6px 0',
                        borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      {skill.downloads}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>

        {/* Top viewed showcases */}
        <SectionCard title="Most Viewed Showcases" icon={Eye}>
          {data.topShowcases.length === 0 ? (
            <EmptyRow text="No view data yet." />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Showcase
                  </th>
                  <th style={{ textAlign: 'right', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Views
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topShowcases.map((showcase, i) => (
                  <tr key={showcase.id}>
                    <td
                      style={{
                        fontSize: 13,
                        color: 'var(--color-text-body)',
                        padding: '6px 0',
                        borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                        maxWidth: 200,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {showcase.title}
                    </td>
                    <td
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'var(--color-text-heading)',
                        textAlign: 'right',
                        padding: '6px 0',
                        borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                      }}
                    >
                      {showcase.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </SectionCard>
      </div>

      {/* ── Recent activity ── */}
      <SectionCard title="Recent Activity" icon={ChartBar}>
        {data.recentActivity.length === 0 ? (
          <EmptyRow text="No activity recorded yet." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {data.recentActivity.map((activity, i) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderTop: i > 0 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 6px',
                      borderRadius: 3,
                      background: 'var(--color-primary-muted)',
                      color: 'var(--color-primary)',
                      flexShrink: 0,
                    }}
                  >
                    {activity.action}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-body)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activity.actorName}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', flexShrink: 0 }}>
                    on {activity.entityType}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: 8 }}>
                  {formatDate(activity.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

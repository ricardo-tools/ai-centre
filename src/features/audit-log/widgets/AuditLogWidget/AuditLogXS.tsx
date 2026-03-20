'use client';

import type { RawAuditEntry } from '@/features/audit-log/action';

interface AuditLogXSProps {
  entries: RawAuditEntry[];
}

const ACTION_COLORS: Record<string, { bg: string; fg: string }> = {
  created: { bg: 'var(--color-success-muted, rgba(34,197,94,0.12))', fg: 'var(--color-success, #22c55e)' },
  updated: { bg: 'var(--color-surface-raised)', fg: 'var(--color-text-muted)' },
  published: { bg: 'var(--color-primary-muted)', fg: 'var(--color-primary)' },
  archived: { bg: 'var(--color-warning-muted, rgba(234,179,8,0.12))', fg: 'var(--color-warning, #eab308)' },
  deleted: { bg: 'var(--color-danger-muted, rgba(239,68,68,0.12))', fg: 'var(--color-danger, #ef4444)' },
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes <= 1 ? 'Just now' : `${diffMinutes}m ago`;
  }
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
}

export function AuditLogXS({ entries }: AuditLogXSProps) {
  if (entries.length === 0) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        No audit entries.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {entries.map((entry) => {
        const actionColor = ACTION_COLORS[entry.action] ?? ACTION_COLORS.updated;
        return (
          <div
            key={entry.id}
            style={{
              padding: '8px 0',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            {/* Top line: action badge + timestamp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  background: actionColor.bg,
                  color: actionColor.fg,
                }}
              >
                {entry.action}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                {formatTimestamp(entry.createdAt)}
              </span>
            </div>
            {/* Bottom line: entity type */}
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              {entry.entityType}
            </div>
          </div>
        );
      })}
    </div>
  );
}

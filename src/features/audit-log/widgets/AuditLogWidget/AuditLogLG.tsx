'use client';

import { useState } from 'react';
import type { RawAuditEntry } from '@/features/audit-log/action';

interface AuditLogLGProps {
  entries: RawAuditEntry[];
}

const headerStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-muted)',
  padding: '8px 16px',
  textAlign: 'left',
  borderBottom: '2px solid var(--color-border)',
};

const cellStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid var(--color-border)',
  fontSize: 13,
  color: 'var(--color-text-body)',
  verticalAlign: 'top',
};

const ACTION_COLORS: Record<string, { bg: string; fg: string }> = {
  created: { bg: 'var(--color-success-muted)', fg: 'var(--color-success)' },
  updated: { bg: 'var(--color-bg-alt)', fg: 'var(--color-text-muted)' },
  published: { bg: 'var(--color-primary-muted)', fg: 'var(--color-primary)' },
  archived: { bg: 'var(--color-warning-muted)', fg: 'var(--color-warning)' },
  deleted: { bg: 'var(--color-danger-muted)', fg: 'var(--color-danger)' },
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
  if (diffHours < 24) {
    return `${Math.floor(diffHours)}h ago`;
  }
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function AuditLogLG({ entries }: AuditLogLGProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: 'var(--color-surface)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <thead>
        <tr>
          <th style={headerStyle}>Timestamp</th>
          <th style={headerStyle}>Entity Type</th>
          <th style={headerStyle}>Action</th>
          <th style={headerStyle}>Entity ID</th>
          <th style={headerStyle}>User</th>
          <th style={headerStyle}>Metadata</th>
        </tr>
      </thead>
      <tbody>
        {entries.length === 0 && (
          <tr>
            <td colSpan={6} style={{ ...cellStyle, textAlign: 'center', color: 'var(--color-text-muted)' }}>
              No audit entries found.
            </td>
          </tr>
        )}
        {entries.map((entry) => {
          const actionColor = ACTION_COLORS[entry.action] ?? ACTION_COLORS.updated;
          const isExpanded = expandedId === entry.id;
          const hasMetadata = entry.metadata && Object.keys(entry.metadata).length > 0;

          return (
            <tr key={entry.id}>
              <td style={{ ...cellStyle, whiteSpace: 'nowrap', fontSize: 12 }}>
                {formatTimestamp(entry.createdAt)}
              </td>
              <td style={cellStyle}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    background: 'var(--color-surface-raised)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {entry.entityType}
                </span>
              </td>
              <td style={cellStyle}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    background: actionColor.bg,
                    color: actionColor.fg,
                  }}
                >
                  {entry.action}
                </span>
              </td>
              <td style={{ ...cellStyle, fontSize: 12, fontFamily: 'monospace' }}>
                {entry.entityId.slice(0, 8)}...
              </td>
              <td style={cellStyle}>{entry.userName}</td>
              <td style={cellStyle}>
                {hasMetadata ? (
                  <div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                      style={{
                        fontSize: 12,
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                      }}
                    >
                      {isExpanded ? 'Hide' : 'Show'}
                    </button>
                    {isExpanded && (
                      <pre
                        style={{
                          marginTop: 8,
                          padding: 8,
                          borderRadius: 4,
                          background: 'var(--color-surface-raised)',
                          fontSize: 11,
                          color: 'var(--color-text-body)',
                          overflow: 'auto',
                          maxWidth: 300,
                        }}
                      >
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>—</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

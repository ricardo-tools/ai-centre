'use client';

import { getPermissionsByCategory } from '@/platform/lib/permissions';

const permsByCategory = getPermissionsByCategory();

const headerStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'var(--color-text-muted)',
  padding: '8px 12px',
  textAlign: 'left',
  borderBottom: '2px solid var(--color-border)',
};

const cellStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '1px solid var(--color-border)',
  fontSize: 13,
  color: 'var(--color-text-body)',
  verticalAlign: 'top',
};

export function AdminPermissions() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 4 }}>
          Permissions Reference
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          All available permissions defined in code. Assign them to roles in the Roles tab.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {Object.entries(permsByCategory).map(([category, perms]) => (
          <div
            key={category}
            style={{
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-bg-alt)',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                {category}
              </h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...headerStyle, width: '25%' }}>Key</th>
                  <th style={{ ...headerStyle, width: '25%' }}>Label</th>
                  <th style={headerStyle}>Description</th>
                </tr>
              </thead>
              <tbody>
                {perms.map((perm) => (
                  <tr key={perm.key}>
                    <td style={cellStyle}>
                      <code
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 12,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: 'var(--color-bg-alt)',
                          color: 'var(--color-text-body)',
                        }}
                      >
                        {perm.key}
                      </code>
                    </td>
                    <td style={{ ...cellStyle, fontWeight: 500 }}>{perm.label}</td>
                    <td style={{ ...cellStyle, color: 'var(--color-text-muted)' }}>{perm.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import type { UserListSizeProps } from './UserListWidget';

export function UserListXS({ users, currentUserId }: UserListSizeProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {users.map((user) => {
        const isSelf = user.id === currentUserId;
        return (
          <div
            key={user.id}
            style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              opacity: isSelf ? 0.55 : 1,
            }}
          >
            {/* Top row: Name + Role badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-text-heading)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                {user.name}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 6px',
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 600,
                  background: user.isAdmin() ? 'var(--color-primary-muted)' : 'var(--color-surface-raised)',
                  color: user.isAdmin() ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  flexShrink: 0,
                }}
              >
                {user.roleName}
              </span>
              {/* Status indicator dot */}
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: user.isActive ? 'var(--color-success)' : 'var(--color-text-muted)',
                  flexShrink: 0,
                }}
                title={user.isActive ? 'Active' : 'Inactive'}
              />
            </div>
            {/* Email */}
            <div
              style={{
                fontSize: 12,
                color: 'var(--color-text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user.email}
            </div>
          </div>
        );
      })}
    </div>
  );
}

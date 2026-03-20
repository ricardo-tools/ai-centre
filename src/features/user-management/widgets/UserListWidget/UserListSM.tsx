'use client';

import { CaretDown } from '@phosphor-icons/react';
import type { UserListSizeProps } from './UserListWidget';

export function UserListSM({ users, currentUserId, roles, isSubmitting, successIds, onRoleChange, onToggleActive }: UserListSizeProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {users.map((user) => {
        const isSelf = user.id === currentUserId;
        const submitting = isSubmitting[user.id] ?? false;
        const showDone = successIds[user.id] ?? false;
        return (
          <div
            key={user.id}
            style={{
              padding: 16,
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              opacity: isSelf ? 0.55 : 1,
            }}
          >
            {/* Name heading */}
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: 'var(--color-text-heading)',
                marginBottom: 4,
              }}
            >
              {user.name}
            </div>

            {/* Email */}
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>
              {user.email}
            </div>

            {/* Role badge + Status badge row */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  background: user.isAdmin() ? 'var(--color-primary-muted)' : 'var(--color-surface-raised)',
                  color: user.isAdmin() ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}
              >
                {user.roleName}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  background: user.isActive
                    ? 'var(--color-success-muted)'
                    : 'var(--color-surface-raised)',
                  color: user.isActive
                    ? 'var(--color-success)'
                    : 'var(--color-text-muted)',
                }}
              >
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
              {showDone && (
                <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 500 }}>Done</span>
              )}
            </div>

            {/* Actions row */}
            {!isSelf && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) onRoleChange(user.id, e.target.value);
                    }}
                    disabled={submitting}
                    style={{
                      width: '100%',
                      fontSize: 13,
                      padding: '10px 12px',
                      paddingRight: 32,
                      minHeight: 44,
                      borderRadius: 6,
                      border: '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-body)',
                      fontFamily: 'inherit',
                      opacity: submitting ? 0.5 : 1,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="" disabled>Change role</option>
                    {roles
                      .filter((r) => r.name !== user.roleName)
                      .map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                  </select>
                  <CaretDown
                    size={14}
                    weight="bold"
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: 'var(--color-text-muted)',
                    }}
                  />
                </div>
                <button
                  onClick={() => onToggleActive(user.id)}
                  disabled={submitting}
                  style={{
                    fontSize: 13,
                    padding: '10px 16px',
                    minHeight: 44,
                    borderRadius: 6,
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    color: user.isActive ? 'var(--color-danger)' : 'var(--color-success)',
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.5 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {submitting ? '...' : user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

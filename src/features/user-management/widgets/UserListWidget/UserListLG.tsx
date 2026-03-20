'use client';

import { useState } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import type { UserListSizeProps } from './UserListWidget';
import { ConfirmDialog } from '@/platform/components/ConfirmDialog';

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
  fontSize: 14,
  color: 'var(--color-text-body)',
  verticalAlign: 'middle',
};

interface PendingAction {
  type: 'role-change' | 'deactivate' | 'reactivate';
  userId: string;
  userName: string;
  roleId?: string;
  roleName?: string;
}

export function UserListLG({ users, currentUserId, roles, isSubmitting, successIds, onRoleChange, onToggleActive }: UserListSizeProps) {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const handleConfirm = () => {
    if (!pendingAction) return;
    if (pendingAction.type === 'role-change' && pendingAction.roleId) {
      onRoleChange(pendingAction.userId, pendingAction.roleId);
    } else {
      onToggleActive(pendingAction.userId);
    }
    setPendingAction(null);
  };

  const getConfirmDialogProps = () => {
    if (!pendingAction) return { title: '', message: '', confirmLabel: '', variant: 'default' as const };
    if (pendingAction.type === 'role-change') {
      return {
        title: 'Change Role',
        message: `Change ${pendingAction.userName}'s role to "${pendingAction.roleName}"?`,
        confirmLabel: 'Change Role',
        variant: 'default' as const,
      };
    }
    if (pendingAction.type === 'deactivate') {
      return {
        title: 'Deactivate User',
        message: `Are you sure you want to deactivate ${pendingAction.userName}? They will lose access to the platform.`,
        confirmLabel: 'Deactivate',
        variant: 'danger' as const,
      };
    }
    return {
      title: 'Reactivate User',
      message: `Reactivate ${pendingAction.userName}? They will regain access to the platform.`,
      confirmLabel: 'Reactivate',
      variant: 'default' as const,
    };
  };

  const dialogProps = getConfirmDialogProps();

  return (
    <>
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
            <th style={{ ...headerStyle, width: '20%' }}>Name</th>
            <th style={{ ...headerStyle, width: '25%' }}>Email</th>
            <th style={{ ...headerStyle, width: '15%' }}>Role</th>
            <th style={{ ...headerStyle, width: '10%' }}>Status</th>
            <th style={{ ...headerStyle, width: '30%', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            const submitting = isSubmitting[user.id] ?? false;
            const showDone = successIds[user.id] ?? false;

            return (
              <tr
                key={user.id}
                style={{
                  opacity: isSelf ? 0.55 : 1,
                  pointerEvents: isSelf ? 'none' : undefined,
                }}
              >
                <td style={{ ...cellStyle, fontWeight: 500, color: 'var(--color-text-heading)', width: '20%' }}>
                  {user.name}
                </td>
                <td style={{ ...cellStyle, width: '25%' }}>{user.email}</td>
                <td style={{ ...cellStyle, width: '15%' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background: user.isAdmin()
                        ? 'var(--color-primary-muted)'
                        : 'var(--color-bg-alt)',
                      color: user.isAdmin()
                        ? 'var(--color-primary)'
                        : 'var(--color-text-muted)',
                    }}
                  >
                    {user.roleName}
                  </span>
                </td>
                <td style={{ ...cellStyle, width: '10%' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                      background: user.isActive
                        ? 'var(--color-success-muted)'
                        : 'var(--color-bg-alt)',
                      color: user.isActive
                        ? 'var(--color-success)'
                        : 'var(--color-text-muted)',
                    }}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ ...cellStyle, textAlign: 'right', width: '30%' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                    {showDone && (
                      <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 500 }}>
                        Done
                      </span>
                    )}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <select
                        value=""
                        onChange={(e) => {
                          const selectedRole = roles.find((r) => r.id === e.target.value);
                          if (selectedRole) {
                            setPendingAction({
                              type: 'role-change',
                              userId: user.id,
                              userName: user.name,
                              roleId: selectedRole.id,
                              roleName: selectedRole.name,
                            });
                          }
                        }}
                        disabled={isSelf || submitting}
                        style={{
                          fontSize: 13,
                          padding: '6px 10px',
                          paddingRight: 32,
                          borderRadius: 4,
                          border: '1px solid var(--color-border)',
                          background: 'var(--color-surface)',
                          color: 'var(--color-text-body)',
                          cursor: isSelf || submitting ? 'not-allowed' : 'pointer',
                          opacity: isSelf || submitting ? 0.5 : 1,
                          fontFamily: 'inherit',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                        }}
                      >
                        <option value="" disabled>
                          {user.roleName}
                        </option>
                        {roles
                          .filter((r) => r.name !== user.roleName)
                          .map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name}
                            </option>
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
                      onClick={() => {
                        setPendingAction({
                          type: user.isActive ? 'deactivate' : 'reactivate',
                          userId: user.id,
                          userName: user.name,
                        });
                      }}
                      disabled={isSelf || submitting}
                      style={{
                        fontSize: 13,
                        padding: '6px 12px',
                        borderRadius: 4,
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        color: user.isActive ? 'var(--color-danger)' : 'var(--color-success)',
                        cursor: isSelf || submitting ? 'not-allowed' : 'pointer',
                        opacity: isSelf || submitting ? 0.5 : 1,
                        fontWeight: 500,
                        fontFamily: 'inherit',
                        minWidth: 90,
                      }}
                    >
                      {submitting ? 'Loading...' : user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ConfirmDialog
        open={pendingAction !== null}
        title={dialogProps.title}
        message={dialogProps.message}
        confirmLabel={dialogProps.confirmLabel}
        variant={dialogProps.variant}
        loading={pendingAction ? (isSubmitting[pendingAction.userId] ?? false) : false}
        onConfirm={handleConfirm}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
}

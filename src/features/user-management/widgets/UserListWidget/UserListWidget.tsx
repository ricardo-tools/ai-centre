'use client';

import type { RenderableWidget, SizeVariant } from '@/platform/screen-renderer/types';
import { useSession } from '@/platform/lib/SessionContext';
import { useUserList } from './useUserList';
import { UserListXS } from './UserListXS';
import { UserListSM } from './UserListSM';
import { UserListMD } from './UserListMD';
import { UserListLG } from './UserListLG';

import type { UserProfile } from '@/platform/domain/UserProfile';
import type { RawRole } from '@/features/role-management/useRoles';

export type UserListSizeProps = {
  users: UserProfile[];
  currentUserId: string;
  roles: RawRole[];
  isSubmitting: Record<string, boolean>;
  successIds: Record<string, boolean>;
  onRoleChange: (userId: string, newRoleId: string) => void;
  onToggleActive: (userId: string) => void;
};

const SIZE_MAP: Record<SizeVariant, React.ComponentType<UserListSizeProps>> = {
  xs: UserListXS,
  sm: UserListSM,
  md: UserListMD,
  lg: UserListLG,
};

export const widgetName = 'UserListWidget';

export function UserListWidget({ size }: RenderableWidget) {
  const session = useSession();
  const {
    filteredUsers,
    roles,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isSubmitting,
    successIds,
    handleRoleChange,
    handleToggleActive,
  } = useUserList();

  if (loading) {
    return (
      <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: 'var(--color-danger)', fontSize: 13 }}>
        {error}
      </div>
    );
  }

  const SizeComponent = SIZE_MAP[size] ?? SIZE_MAP.lg;

  return (
    <div>
      {/* Search input */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email..."
          style={{
            width: '100%',
            maxWidth: 360,
            fontSize: 14,
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            color: 'var(--color-text-body)',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div style={{ padding: 16, color: 'var(--color-text-muted)', fontSize: 13 }}>
          {searchQuery ? 'No users match your search.' : 'No users found.'}
        </div>
      ) : (
        <SizeComponent
          users={filteredUsers}
          currentUserId={session?.userId ?? ''}
          roles={roles}
          isSubmitting={isSubmitting}
          successIds={successIds}
          onRoleChange={handleRoleChange}
          onToggleActive={handleToggleActive}
        />
      )}
    </div>
  );
}

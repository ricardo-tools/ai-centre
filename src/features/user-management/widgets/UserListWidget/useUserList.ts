'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchAllUsers, updateUserRole, deactivateUser, reactivateUser } from '@/features/user-management/action';
import { toUserProfiles } from '@/platform/acl/user-profile.mapper';
import type { UserProfile } from '@/platform/domain/UserProfile';
import type { RawRole } from '@/features/role-management/useRoles';

interface UseUserListResult {
  users: UserProfile[];
  filteredUsers: UserProfile[];
  roles: RawRole[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSubmitting: Record<string, boolean>;
  successIds: Record<string, boolean>;
  handleRoleChange: (userId: string, newRoleId: string) => Promise<void>;
  handleToggleActive: (userId: string) => Promise<void>;
}

export function useUserList(): UseUserListResult {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<RawRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({});
  const [successIds, setSuccessIds] = useState<Record<string, boolean>>({});

  const showSuccess = useCallback((userId: string) => {
    setSuccessIds((prev) => ({ ...prev, [userId]: true }));
    setTimeout(() => {
      setSuccessIds((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    }, 2000);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAllUsers();
    if (result.ok) {
      setUsers(toUserProfiles(result.value));
    } else {
      setError(result.error.message);
    }
    setLoading(false);
  }, []);

  const loadRoles = useCallback(async () => {
    try {
      const { fetchAllRoles } = await import('@/features/role-management/action');
      const result = await fetchAllRoles();
      if (result.ok) {
        setRoles(result.value as RawRole[]);
      }
    } catch {
      // Role actions may not exist yet - gracefully ignore
    }
  }, []);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, [loadUsers, loadRoles]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [users, searchQuery]);

  const handleRoleChange = useCallback(
    async (userId: string, newRoleId: string) => {
      setIsSubmitting((prev) => ({ ...prev, [userId]: true }));
      const result = await updateUserRole(userId, newRoleId);
      if (result.ok) {
        await loadUsers();
        showSuccess(userId);
      } else {
        setError(result.error.message);
      }
      setIsSubmitting((prev) => ({ ...prev, [userId]: false }));
    },
    [loadUsers, showSuccess],
  );

  const handleToggleActive = useCallback(
    async (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      setIsSubmitting((prev) => ({ ...prev, [userId]: true }));
      const result = user.isActive
        ? await deactivateUser(userId)
        : await reactivateUser(userId);

      if (result.ok) {
        await loadUsers();
        showSuccess(userId);
      } else {
        setError(result.error.message);
      }
      setIsSubmitting((prev) => ({ ...prev, [userId]: false }));
    },
    [users, loadUsers, showSuccess],
  );

  return {
    users,
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
  };
}

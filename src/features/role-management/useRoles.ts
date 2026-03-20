'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RawRole } from '@/features/role-management/action';

export type { RawRole };

interface UseRolesResult {
  roles: RawRole[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  handleCreate: (data: { name: string; description: string; permissions: string[] }) => Promise<boolean>;
  handleUpdate: (roleId: string, data: { name: string; description: string; permissions: string[] }) => Promise<boolean>;
  handleDelete: (roleId: string) => Promise<boolean>;
  isSubmitting: boolean;
}

export function useRoles(): UseRolesResult {
  const [roles, setRoles] = useState<RawRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { fetchAllRoles } = await import('@/features/role-management/action');
      const result = await fetchAllRoles();
      if (result.ok) {
        setRoles(result.value as RawRole[]);
      } else {
        setError(result.error.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load roles');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleCreate = useCallback(
    async (data: { name: string; description: string; permissions: string[] }): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const { createRole } = await import('@/features/role-management/action');
        const result = await createRole(data.name, data.description, data.permissions);
        if (result.ok) {
          await reload();
          setIsSubmitting(false);
          return true;
        } else {
          setError(result.error.message);
          setIsSubmitting(false);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create role');
        setIsSubmitting(false);
        return false;
      }
    },
    [reload],
  );

  const handleUpdate = useCallback(
    async (roleId: string, data: { name: string; description: string; permissions: string[] }): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const { updateRole } = await import('@/features/role-management/action');
        const result = await updateRole(roleId, data.name, data.description, data.permissions);
        if (result.ok) {
          await reload();
          setIsSubmitting(false);
          return true;
        } else {
          setError(result.error.message);
          setIsSubmitting(false);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update role');
        setIsSubmitting(false);
        return false;
      }
    },
    [reload],
  );

  const handleDelete = useCallback(
    async (roleId: string): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const { deleteRole } = await import('@/features/role-management/action');
        const result = await deleteRole(roleId);
        if (result.ok) {
          await reload();
          setIsSubmitting(false);
          return true;
        } else {
          setError(result.error.message);
          setIsSubmitting(false);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete role');
        setIsSubmitting(false);
        return false;
      }
    },
    [reload],
  );

  return { roles, loading, error, reload, handleCreate, handleUpdate, handleDelete, isSubmitting };
}

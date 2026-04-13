'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchAllWorkspaces, updateQuotas } from '@/features/workspace/action';
import type { WorkspaceQuota } from '@/features/workspace/action';

interface UseWorkspaceListResult {
  workspaces: WorkspaceQuota[];
  loading: boolean;
  error: string | null;
  editingUserId: string | null;
  saving: boolean;
  openEdit: (userId: string) => void;
  closeEdit: () => void;
  handleSave: (values: { skillLimit: number; schemaLimit: number; storageLimitBytes: number }) => Promise<void>;
}

export function useWorkspaceList(): UseWorkspaceListResult {
  const [workspaces, setWorkspaces] = useState<WorkspaceQuota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAllWorkspaces();
    if (result.ok) {
      setWorkspaces(result.value);
    } else {
      setError(result.error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const openEdit = useCallback((userId: string) => {
    setEditingUserId(userId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingUserId(null);
  }, []);

  const handleSave = useCallback(
    async (values: { skillLimit: number; schemaLimit: number; storageLimitBytes: number }) => {
      if (!editingUserId) return;
      setSaving(true);
      setError(null);

      const result = await updateQuotas({ userId: editingUserId, ...values });
      if (result.ok) {
        await loadWorkspaces();
        setEditingUserId(null);
      } else {
        setError(result.error.message);
      }
      setSaving(false);
    },
    [editingUserId, loadWorkspaces],
  );

  return {
    workspaces,
    loading,
    error,
    editingUserId,
    saving,
    openEdit,
    closeEdit,
    handleSave,
  };
}

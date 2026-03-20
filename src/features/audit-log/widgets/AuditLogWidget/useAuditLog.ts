'use client';

import { useState, useEffect } from 'react';
import { fetchAuditLog, type RawAuditEntry } from '@/features/audit-log/action';

interface UseAuditLogResult {
  entries: RawAuditEntry[];
  loading: boolean;
  error: string | null;
}

export function useAuditLog(): UseAuditLogResult {
  const [entries, setEntries] = useState<RawAuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAuditLog().then((result) => {
      if (result.ok) {
        setEntries(result.value);
      } else {
        setError(result.error.message);
      }
      setLoading(false);
    });
  }, []);

  return { entries, loading, error };
}

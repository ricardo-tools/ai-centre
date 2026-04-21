'use client';

import { useState, useEffect, useCallback } from 'react';
import { PinReply } from '../domain/PinReply';
import { toPinReply, RawPinReply } from '../acl/pin.mapper';

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export interface UsePinThreadReturn {
  replies: PinReply[];
  loading: boolean;
  addReply: (text: string, author: string) => Promise<void>;
  refreshReplies: () => Promise<void>;
}

// ------------------------------------------------------------
// Hook
// ------------------------------------------------------------

export function usePinThread(pinId: string | null): UsePinThreadReturn {
  const [replies, setReplies] = useState<PinReply[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReplies = useCallback(async () => {
    if (!pinId) {
      setReplies([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/pins/${encodeURIComponent(pinId)}/replies`);
      if (!res.ok) {
        setReplies([]);
        return;
      }
      const data: RawPinReply[] = await res.json();
      setReplies(data.map(toPinReply));
    } catch {
      setReplies([]);
    } finally {
      setLoading(false);
    }
  }, [pinId]);

  useEffect(() => {
    fetchReplies();
  }, [fetchReplies]);

  const addReply = useCallback(
    async (text: string, author: string) => {
      if (!pinId) return;

      await fetch(`/api/pins/${encodeURIComponent(pinId)}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author }),
      });

      await fetchReplies();
    },
    [pinId, fetchReplies],
  );

  return {
    replies,
    loading,
    addReply,
    refreshReplies: fetchReplies,
  };
}

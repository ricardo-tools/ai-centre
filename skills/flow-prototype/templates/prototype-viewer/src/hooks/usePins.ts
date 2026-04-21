'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Pin } from '../domain/Pin';

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

interface RawPin {
  id: string;
  project_slug: string;
  prototype_slug: string;
  x_percent: number;
  y_percent: number;
  text: string;
  author: string;
  status: 'open' | 'resolved';
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
  reply_count: number;
}

export interface UsePinsReturn {
  pins: Pin[];
  loading: boolean;
  openCount: number;
  createPin: (xPercent: number, yPercent: number, text: string, author: string) => Promise<void>;
  resolvePin: (id: string, resolvedBy: string) => Promise<void>;
  deletePin: (id: string) => Promise<void>;
  refreshPins: () => Promise<void>;
}

// ------------------------------------------------------------
// ACL mapper
// ------------------------------------------------------------

function mapRawToPin(raw: RawPin): Pin {
  return new Pin(
    raw.id,
    raw.project_slug,
    raw.prototype_slug,
    raw.x_percent,
    raw.y_percent,
    raw.text,
    raw.author,
    raw.status,
    raw.resolved_by,
    raw.resolved_at ? new Date(raw.resolved_at) : null,
    new Date(raw.created_at),
    raw.reply_count,
  );
}

// ------------------------------------------------------------
// Hook
// ------------------------------------------------------------

export function usePins(projectSlug: string, prototypeSlug: string): UsePinsReturn {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshPins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/pins?project=${encodeURIComponent(projectSlug)}&prototype=${encodeURIComponent(prototypeSlug)}`,
      );
      if (!res.ok) throw new Error(`Failed to fetch pins: ${res.status}`);
      const data = (await res.json()) as RawPin[];
      setPins(data.map(mapRawToPin));
    } catch (err) {
      console.error('[usePins] fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [projectSlug, prototypeSlug]);

  useEffect(() => {
    void refreshPins();
  }, [refreshPins]);

  const createPin = useCallback(
    async (xPercent: number, yPercent: number, text: string, author: string) => {
      const res = await fetch('/api/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectSlug,
          prototypeSlug,
          xPercent,
          yPercent,
          text,
          author,
        }),
      });
      if (!res.ok) throw new Error(`Failed to create pin: ${res.status}`);
      await refreshPins();
    },
    [projectSlug, prototypeSlug, refreshPins],
  );

  const resolvePin = useCallback(
    async (id: string, resolvedBy: string) => {
      const res = await fetch(`/api/pins/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve', resolvedBy }),
      });
      if (!res.ok) throw new Error(`Failed to resolve pin: ${res.status}`);
      await refreshPins();
    },
    [refreshPins],
  );

  const deletePin = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/pins/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error(`Failed to delete pin: ${res.status}`);
      await refreshPins();
    },
    [refreshPins],
  );

  const openCount = useMemo(
    () => pins.filter((p) => p.status === 'open').length,
    [pins],
  );

  return { pins, loading, openCount, createPin, resolvePin, deletePin, refreshPins };
}

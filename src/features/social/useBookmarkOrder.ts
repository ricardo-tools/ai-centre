'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Reads all bookmarked entity IDs for a given entity type from localStorage
 * (same key as useSocialSignals) and re-reads whenever a bookmark changes.
 *
 * Use this at the list level to sort bookmarked items to the top.
 */
export function useBookmarkOrder(entityType: string): Set<string> {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const readBookmarks = useCallback(() => {
    try {
      const all = JSON.parse(localStorage.getItem('ai-centre-social') ?? '{}');
      const ids = new Set<string>();
      for (const [key, val] of Object.entries(all)) {
        if (key.startsWith(`${entityType}:`) && (val as Record<string, unknown>)?.bookmarked) {
          ids.add(key.replace(`${entityType}:`, ''));
        }
      }
      setBookmarkedIds(ids);
    } catch {
      /* ignore */
    }
  }, [entityType]);

  useEffect(() => {
    readBookmarks();
    const handler = () => readBookmarks();
    window.addEventListener('bookmark-changed', handler);
    return () => window.removeEventListener('bookmark-changed', handler);
  }, [readBookmarks]);

  return bookmarkedIds;
}

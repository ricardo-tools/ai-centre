'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toggleReaction, getReactionCounts } from './reactions-action';
import { toggleBookmark, isBookmarked as checkBookmarked } from './bookmarks-action';

interface UseSocialSignalsOptions {
  entityType: string;
  entityId: string;
  userId?: string | null;
  initialData?: { upvoteCount: number; isUpvoted: boolean; isBookmarked: boolean };
}

interface SocialSignals {
  upvoteCount: number;
  isUpvoted: boolean;
  isBookmarked: boolean;
  toggleUpvote: () => void;
  toggleBookmark: () => void;
}

// localStorage fallback for dev without DB
const STORAGE_KEY = 'ai-centre-social';

function getLocalState(): Record<string, { liked: boolean; bookmarked: boolean; likeCount: number }> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch { return {}; }
}

function setLocalState(entityKey: string, state: { liked: boolean; bookmarked: boolean; likeCount: number }) {
  if (typeof window === 'undefined') return;
  try {
    const all = getLocalState();
    all[entityKey] = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch { /* ignore */ }
}

export function useSocialSignals({ entityType, entityId, userId, initialData }: UseSocialSignalsOptions): SocialSignals {
  const entityKey = `${entityType}:${entityId}`;
  const local = typeof window !== 'undefined' ? getLocalState()[entityKey] : undefined;

  const [upvoteCount, setUpvoteCount] = useState(initialData?.upvoteCount ?? local?.likeCount ?? 0);
  const [isUpvoted, setIsUpvoted] = useState(initialData?.isUpvoted ?? local?.liked ?? false);
  const [bookmarked, setBookmarked] = useState(initialData?.isBookmarked ?? local?.bookmarked ?? false);
  const fetchedRef = useRef(!!initialData); // skip fetch if initial data provided
  const togglingLikeRef = useRef(false);
  const togglingBookmarkRef = useRef(false);
  const hasDbRef = useRef(true); // assume DB exists until proven otherwise

  // Fetch initial state from server (overrides localStorage if DB is available)
  // Skipped when initialData is provided (bulk fetch already happened at list level)
  useEffect(() => {
    if (!entityId || fetchedRef.current) return;
    fetchedRef.current = true;

    getReactionCounts(entityType, entityId, userId ?? undefined).then(({ counts, userReactions }) => {
      const serverUpvoteCount = counts['thumbsup'] ?? 0;
      const serverIsUpvoted = userReactions.includes('thumbsup');
      // Only update from server if we actually got data (DB is configured)
      if (Object.keys(counts).length > 0 || userReactions.length > 0) {
        setUpvoteCount(serverUpvoteCount);
        setIsUpvoted(serverIsUpvoted);
      }
    }).catch(() => {
      hasDbRef.current = false;
    });

    if (userId) {
      checkBookmarked(userId, entityType, entityId).then(val => {
        setBookmarked(val);
      }).catch(() => {
        hasDbRef.current = false;
      });
    }
  }, [entityType, entityId, userId]);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    setLocalState(entityKey, { liked: isUpvoted, bookmarked, likeCount: upvoteCount });
  }, [entityKey, isUpvoted, bookmarked, upvoteCount]);

  // Optimistic toggle upvote
  const handleToggleUpvote = useCallback(() => {
    if (!userId || togglingLikeRef.current) return;
    togglingLikeRef.current = true;

    const wasUpvoted = isUpvoted;
    setIsUpvoted(!wasUpvoted);
    setUpvoteCount(c => wasUpvoted ? c - 1 : c + 1);

    toggleReaction(entityType, entityId, 'thumbsup', userId).then(result => {
      if (result && !result.ok && result.error?.message !== 'Database not configured') {
        setIsUpvoted(wasUpvoted);
        setUpvoteCount(c => wasUpvoted ? c + 1 : c - 1);
      }
    }).catch(() => {}).finally(() => {
      togglingLikeRef.current = false;
    });
  }, [entityType, entityId, userId, isUpvoted]);

  // Optimistic toggle bookmark
  const handleToggleBookmark = useCallback(() => {
    if (!userId || togglingBookmarkRef.current) return;
    togglingBookmarkRef.current = true;

    const wasBookmarked = bookmarked;
    const newBookmarked = !wasBookmarked;
    setBookmarked(newBookmarked);

    // Update localStorage immediately (before event, so useBookmarkOrder reads fresh data)
    setLocalState(entityKey, { liked: isUpvoted, bookmarked: newBookmarked, likeCount: upvoteCount });

    // Notify parent lists so bookmark-based sort order can update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bookmark-changed'));
    }

    toggleBookmark(entityType, entityId, userId).then(result => {
      if (result && !result.ok && result.error?.message !== 'Database not configured') {
        setBookmarked(wasBookmarked);
      }
    }).catch(() => {}).finally(() => {
      togglingBookmarkRef.current = false;
    });
  }, [entityType, entityId, entityKey, userId, bookmarked, isUpvoted, upvoteCount]);

  return {
    upvoteCount,
    isUpvoted,
    isBookmarked: bookmarked,
    toggleUpvote: handleToggleUpvote,
    toggleBookmark: handleToggleBookmark,
  };
}

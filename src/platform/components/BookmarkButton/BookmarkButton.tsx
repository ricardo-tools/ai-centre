'use client';

import { useState, useCallback } from 'react';
import { BookmarkSimple } from '@phosphor-icons/react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => Promise<{ bookmarked: boolean } | null>;
  size?: number;
}

export function BookmarkButton({
  isBookmarked: initialState,
  onToggle,
  size = 18,
}: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialState);

  const handleClick = useCallback(async () => {
    const result = await onToggle();
    if (result) setBookmarked(result.bookmarked);
  }, [onToggle]);

  return (
    <button
      onClick={handleClick}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: bookmarked ? 'var(--color-primary)' : 'var(--color-text-muted)',
        transition: 'color 150ms',
      }}
    >
      <BookmarkSimple size={size} weight={bookmarked ? 'fill' : 'regular'} />
    </button>
  );
}

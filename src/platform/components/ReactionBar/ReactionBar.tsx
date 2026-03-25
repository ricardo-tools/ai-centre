'use client';

import { useState, useCallback, useEffect } from 'react';

const EMOJIS = [
  { key: 'thumbsup', display: '\u{1F44D}' },
  { key: 'heart', display: '\u2764\uFE0F' },
  { key: 'rocket', display: '\u{1F680}' },
  { key: 'eyes', display: '\u{1F440}' },
  { key: 'tada', display: '\u{1F389}' },
];

interface ReactionBarProps {
  entityType: string;
  entityId: string;
  initialCounts: Record<string, number>;
  initialUserReactions: string[];
  onToggle: (emoji: string) => Promise<{ added: boolean } | null>;
}

export function ReactionBar({
  initialCounts,
  initialUserReactions,
  onToggle,
}: ReactionBarProps) {
  const [counts, setCounts] = useState(initialCounts);
  const [userReactions, setUserReactions] = useState(new Set(initialUserReactions));

  // Sync when async-loaded props arrive (useState only reads initial value on mount)
  useEffect(() => { setCounts(initialCounts); }, [initialCounts]);
  useEffect(() => { setUserReactions(new Set(initialUserReactions)); }, [initialUserReactions]);

  const handleToggle = useCallback(
    async (emoji: string) => {
      const result = await onToggle(emoji);
      if (!result) return;

      setCounts((prev) => ({
        ...prev,
        [emoji]: (prev[emoji] ?? 0) + (result.added ? 1 : -1),
      }));

      setUserReactions((prev) => {
        const next = new Set(prev);
        if (result.added) next.add(emoji);
        else next.delete(emoji);
        return next;
      });
    },
    [onToggle],
  );

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      {EMOJIS.map(({ key, display }) => {
        const count = counts[key] ?? 0;
        const isActive = userReactions.has(key);
        return (
          <button
            key={key}
            onClick={() => handleToggle(key)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              borderRadius: 16,
              border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border)'}`,
              background: isActive ? 'var(--color-primary-muted)' : 'var(--color-surface)',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
              color: 'var(--color-text-body)',
              transition: 'border-color 150ms, background 150ms',
            }}
          >
            <span style={{ fontSize: 14 }}>{display}</span>
            {count > 0 && (
              <span style={{ fontSize: 12, fontWeight: 500 }}>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

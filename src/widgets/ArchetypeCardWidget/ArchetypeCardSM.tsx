'use client';

import type { Archetype } from '@/domain/Archetype';

interface ArchetypeCardSMProps {
  archetype: Archetype;
  skillsLabel?: string;
}

export function ArchetypeCardSM({ archetype, skillsLabel = 'skills' }: ArchetypeCardSMProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 16px',
      }}
    >
      <span style={{ fontSize: 20 }}>{archetype.icon}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
        }}
      >
        {archetype.title}
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 4,
          background: 'var(--color-primary-muted)',
          color: 'var(--color-primary)',
        }}
      >
        {archetype.skillCount} {skillsLabel}
      </span>
    </div>
  );
}

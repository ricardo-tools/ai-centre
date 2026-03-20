'use client';

import type { Archetype } from '@/platform/domain/Archetype';

interface ArchetypeCardXSProps {
  archetype: Archetype;
}

export function ArchetypeCardXS({ archetype }: ArchetypeCardXSProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 13,
        padding: '6px 12px',
        color: 'var(--color-text-heading)',
      }}
    >
      <span>{archetype.icon}</span>
      <span style={{ fontWeight: 500 }}>{archetype.title}</span>
    </span>
  );
}

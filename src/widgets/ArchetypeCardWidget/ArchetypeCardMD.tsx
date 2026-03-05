'use client';

import type { Archetype } from '@/domain/Archetype';

interface ArchetypeCardMDProps {
  archetype: Archetype;
}

export function ArchetypeCardMD({ archetype }: ArchetypeCardMDProps) {
  return (
    <div
      style={{
        padding: 20,
        border: '1px solid var(--color-border)',
        borderRadius: 8,
        background: 'var(--color-surface)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>{archetype.icon}</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--color-text-heading)',
          }}
        >
          {archetype.title}
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          color: 'var(--color-text-muted)',
          margin: '0 0 12px',
          lineHeight: 1.5,
        }}
      >
        {archetype.description}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {archetype.skills.map((skillSlug) => (
          <span
            key={skillSlug}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 4,
              background: 'var(--color-primary-muted)',
              color: 'var(--color-primary)',
            }}
          >
            {skillSlug}
          </span>
        ))}
      </div>
    </div>
  );
}

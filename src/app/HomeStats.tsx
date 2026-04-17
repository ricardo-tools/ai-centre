import { getAllSkills } from '@/platform/lib/skills';

export function HomeStats() {
  const skillCount = getAllSkills().length;

  const stats = [
    { value: skillCount, label: 'skills' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        padding: '16px 0',
        flexWrap: 'wrap',
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--color-primary)',
            }}
          >
            {stat.value}
          </span>
          <span
            style={{
              fontSize: 12,
              color: 'var(--color-text-muted)',
            }}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

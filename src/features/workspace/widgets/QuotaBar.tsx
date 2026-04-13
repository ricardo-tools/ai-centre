'use client';

interface QuotaBarProps {
  used: number;
  limit: number;
  label: string;
  formatValue?: (n: number) => string;
}

export function QuotaBar({ used, limit, label, formatValue }: QuotaBarProps) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const color = pct >= 80 ? 'var(--color-danger)' : pct >= 50 ? 'var(--color-warning)' : 'var(--color-success)';
  const fmt = formatValue ?? String;

  return (
    <div
      data-testid={`quota-bar-${label.toLowerCase()}`}
      style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}
    >
      <div
        style={{
          flex: 1,
          height: 6,
          borderRadius: 3,
          background: 'var(--color-bg-alt)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 3,
            background: color,
            transition: 'width 0.3s ease',
          }}
          role="progressbar"
          aria-valuenow={used}
          aria-valuemin={0}
          aria-valuemax={limit}
          aria-label={`${label}: ${fmt(used)} of ${fmt(limit)} used`}
        />
      </div>
      <span style={{ fontSize: 12, color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
        {fmt(used)}/{fmt(limit)}
      </span>
    </div>
  );
}

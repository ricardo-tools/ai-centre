interface StatProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

export function Stat({ icon, label, value }: StatProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: 'var(--color-text-muted)' }}>{icon}</span>
      <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
        {label}: <strong style={{ color: 'var(--color-text-heading)', fontWeight: 600 }}>{value}</strong>
      </span>
    </div>
  );
}

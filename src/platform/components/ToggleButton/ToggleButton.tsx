interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

export function ToggleButton({ active, onClick, icon, label }: ToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '6px 12px',
        fontSize: 13,
        fontWeight: active ? 600 : 400,
        fontFamily: 'inherit',
        border: 'none',
        cursor: 'pointer',
        background: active ? 'var(--color-surface-active)' : 'var(--color-surface)',
        color: active ? 'var(--color-text-heading)' : 'var(--color-text-muted)',
        transition: 'background 150ms, color 150ms',
      }}
    >
      {icon} {label}
    </button>
  );
}

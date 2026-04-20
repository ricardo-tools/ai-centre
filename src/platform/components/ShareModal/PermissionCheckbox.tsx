'use client';

interface PermissionCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function PermissionCheckbox({ label, checked, onChange, disabled }: PermissionCheckboxProps) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12,
        color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-body)',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        style={{ accentColor: 'var(--color-primary)' }}
      />
      {label}
    </label>
  );
}

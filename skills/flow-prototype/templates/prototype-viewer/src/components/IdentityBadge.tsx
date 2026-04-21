// Layer 4: Component — stateless, props-only, no useState/useEffect

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface IdentityBadgeProps {
  initials: string;
  name: string;   // shown as tooltip via title attribute
  size?: number;  // default 28
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function IdentityBadge({ initials, name, size = 28 }: IdentityBadgeProps) {
  const fontSize = Math.round(size * 0.4);

  return (
    <div
      title={name}
      aria-label={name}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--color-bg-alt)',
        color: 'var(--color-text-body)',
        fontFamily: 'var(--font-body)',
        fontSize,
        fontWeight: 600,
        lineHeight: 1,
        userSelect: 'none',
        flexShrink: 0,
        border: '1px solid var(--color-border)',
      }}
    >
      {initials}
    </div>
  );
}

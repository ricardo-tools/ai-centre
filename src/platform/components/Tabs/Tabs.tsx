'use client';

interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <div
      className="tabs-scroll"
      style={{
        display: 'flex',
        gap: 0,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        whiteSpace: 'nowrap',
      }}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;
        return (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            style={{
              padding: '12px 16px',
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive
                ? '2px solid var(--color-primary)'
                : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
              fontFamily: 'inherit',
              minHeight: 44,
              flexShrink: 0,
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

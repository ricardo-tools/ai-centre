interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-heading)', marginBottom: subtitle ? 8 : 0 }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

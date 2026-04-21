import { enAU } from '../i18n/en-AU';

const agentColors: Record<string, { bg: string; text: string }> = {
  strict: { bg: 'var(--color-info)', text: 'var(--color-surface)' },
  adaptive: { bg: 'var(--color-warning)', text: 'var(--color-text-heading)' },
  creative: { bg: 'var(--color-success)', text: 'var(--color-surface)' },
};

interface TagBadgeProps {
  label: string;
  variant?: 'agent' | 'tag';
}

export default function TagBadge({ label, variant = 'tag' }: TagBadgeProps) {
  const isAgent = variant === 'agent' && agentColors[label];
  const colors = isAgent
    ? agentColors[label]
    : { bg: 'var(--color-border-light)', text: 'var(--color-text-muted)' };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.02em',
        textTransform: 'capitalize',
        backgroundColor: colors.bg,
        color: colors.text,
        lineHeight: '18px',
      }}
    >
      {label}
    </span>
  );
}

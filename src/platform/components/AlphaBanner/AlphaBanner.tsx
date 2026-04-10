interface AlphaBannerProps {
  message?: string;
}

export function AlphaBanner({ message = 'This feature is in early development — not ready for use yet.' }: AlphaBannerProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRadius: 8,
        border: '1px solid var(--color-warning)',
        background: 'var(--color-warning-muted)',
        color: 'var(--color-text-heading)',
        fontSize: 13,
        lineHeight: 1.4,
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 256 256" fill="currentColor" style={{ color: 'var(--color-warning)', flexShrink: 0 }}>
        <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z" />
      </svg>
      <span>
        <span
          style={{
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontSize: 11,
            color: 'var(--color-warning)',
            marginRight: 8,
          }}
        >
          Alpha
        </span>
        {message}
      </span>
    </div>
  );
}

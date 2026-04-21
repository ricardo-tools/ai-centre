'use client';

export default function TurboFalconPrototype() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-heading)', lineHeight: 1.2, marginBottom: 'var(--space-1)' }}>
          Workflow Configuration
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          Define automation rules across customer segments and collection stages.
        </p>
      </div>

      {/* Matrix */}
      <div
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '180px repeat(5, 1fr)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg-alt)',
          }}
        >
          <div style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Segment
          </div>
          {['Day 1', 'Day 7', 'Day 14', 'Day 30', 'Day 60'].map((stage) => (
            <div
              key={stage}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                borderLeft: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              {stage}
            </div>
          ))}
        </div>

        {/* Data rows */}
        {['Enterprise', 'Mid-Market', 'SMB', 'Startup'].map((segment, i) => (
          <div
            key={segment}
            style={{
              display: 'grid',
              gridTemplateColumns: '180px repeat(5, 1fr)',
              borderBottom: i < 3 ? '1px solid var(--color-border)' : 'none',
            }}
          >
            <div
              style={{
                padding: 'var(--space-3)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-text-heading)',
                background: 'var(--color-bg-alt)',
              }}
            >
              {segment}
            </div>
            {[0, 1, 2, 3, 4].map((col) => {
              const hasAction = (i + col) % 3 !== 0;
              return (
                <div
                  key={col}
                  style={{
                    padding: 'var(--space-2)',
                    borderLeft: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 48,
                  }}
                >
                  {hasAction ? (
                    <span
                      style={{
                        padding: 'var(--space-1) var(--space-2)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 12,
                        fontWeight: 500,
                        background: col < 2 ? 'var(--color-success-muted)' : col < 4 ? 'var(--color-warning-muted)' : 'var(--color-danger-muted)',
                        color: col < 2 ? 'var(--color-success)' : col < 4 ? 'var(--color-warning)' : 'var(--color-danger)',
                      }}
                    >
                      {col < 2 ? 'Email' : col < 4 ? 'SMS + Email' : 'Escalate'}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>—</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
        Strict agent · V1 placeholder — matrix cells will be interactive in the next iteration.
      </p>
    </div>
  );
}

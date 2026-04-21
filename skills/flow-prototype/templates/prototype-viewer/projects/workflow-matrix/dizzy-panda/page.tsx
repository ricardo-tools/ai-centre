'use client';

export default function DizzyPandaPrototype() {
  const stages = ['Reminder', 'Nudge', 'Warning', 'Escalation', 'Final'];
  const segments = ['Enterprise', 'Mid-Market', 'SMB'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-heading)', lineHeight: 1.2, marginBottom: 'var(--space-1)' }}>
          Workflow Builder
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          Drag-and-drop workflow stages with a timeline view.
        </p>
      </div>

      {/* Timeline-style layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {segments.map((segment) => (
          <div key={segment}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: 'var(--space-2)' }}>
              {segment}
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
              {stages.map((stage, j) => (
                <div
                  key={stage}
                  style={{
                    minWidth: 160,
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-2)',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: j === 0 ? 'var(--color-success)' : j < 3 ? 'var(--color-warning)' : 'var(--color-danger)',
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                    {stage}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    Day {(j + 1) * 7}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: 'var(--space-1) var(--space-2)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-primary-muted)',
                      color: 'var(--color-primary)',
                      fontWeight: 500,
                      alignSelf: 'flex-start',
                    }}
                  >
                    {j < 2 ? 'Email' : j < 4 ? 'SMS' : 'Call'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
        Creative agent · V1 placeholder — timeline stages will be draggable in the next iteration.
      </p>
    </div>
  );
}

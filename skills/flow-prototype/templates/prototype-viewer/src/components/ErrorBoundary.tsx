'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Error is captured in state via getDerivedStateFromError
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-6)',
            gap: 'var(--space-3)',
            background: 'var(--color-danger-muted)',
            border: '1px solid var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: 'var(--color-danger)',
              margin: 0,
              fontFamily: 'var(--font-body)',
            }}
          >
            Something went wrong
          </p>
          {this.state.error && (
            <p
              style={{
                fontSize: 12,
                color: 'var(--color-text-muted)',
                margin: 0,
                fontFamily: 'var(--font-mono)',
                maxWidth: 480,
                wordBreak: 'break-word',
              }}
            >
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleRetry}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-danger)',
              background: 'var(--color-surface)',
              color: 'var(--color-danger)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 150ms var(--ease-in-out)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--color-danger-muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--color-surface)';
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

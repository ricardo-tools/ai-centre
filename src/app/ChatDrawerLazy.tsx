'use client';

import { lazy, Suspense, Component, type ReactNode } from 'react';

const ChatDrawer = lazy(() => import('@/features/chat/widgets/ChatDrawer/ChatDrawer').then((m) => ({ default: m.ChatDrawer })));

/** Error boundary — if the chat feature fails, don't crash the whole app. */
class ChatErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error('[ChatDrawer] Error boundary caught:', error.message);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function ChatDrawerLazy() {
  return (
    <ChatErrorBoundary>
      <Suspense fallback={null}>
        <ChatDrawer />
      </Suspense>
    </ChatErrorBoundary>
  );
}

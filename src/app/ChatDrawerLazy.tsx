'use client';

import { lazy, Suspense } from 'react';

const ChatDrawer = lazy(() => import('@/features/chat/widgets/ChatDrawer/ChatDrawer').then((m) => ({ default: m.ChatDrawer })));

export function ChatDrawerLazy() {
  return (
    <Suspense fallback={null}>
      <ChatDrawer />
    </Suspense>
  );
}

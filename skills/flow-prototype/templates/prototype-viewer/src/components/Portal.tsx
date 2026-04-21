'use client';

import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

/**
 * Renders children at document.body via React portal so popovers escape
 * any parent overflow:hidden clipping. Synchronous — no mount-delay —
 * because Next client components hydrate after document exists.
 */
export default function Portal({ children }: PortalProps) {
  if (typeof document === 'undefined') return null;
  return createPortal(children, document.body);
}

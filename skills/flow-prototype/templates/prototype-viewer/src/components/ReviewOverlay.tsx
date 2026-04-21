'use client';

import { useCallback, useRef, useState } from 'react';
import type { Pin } from '../domain/Pin';
import PinMarker from './PinMarker';
import PinCreationForm from './PinCreationForm';
import { enAU } from '../i18n/en-AU';

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface ReviewOverlayProps {
  active: boolean;
  pins: Pin[];
  onPinClick: (pinId: string) => void;
  onPlacePin: (xPercent: number, yPercent: number, text: string) => void;
  showResolved: boolean;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function ReviewOverlay({
  active,
  pins,
  onPinClick,
  onPlacePin,
  showResolved,
}: ReviewOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);

  // ---- Click handler: convert click coords to % ----
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!active) return;
      const container = containerRef.current;
      if (!container) return;

      // Ignore clicks on pin markers (they stopPropagation, but belt-and-suspenders)
      if ((e.target as HTMLElement).closest('[data-pin-marker]')) return;

      // If a form is already open, ignore overlay clicks (form handles its own outside-click)
      if (pendingPin) return;

      const rect = container.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      setPendingPin({ x: xPercent, y: yPercent });
    },
    [active, pendingPin],
  );

  const handleFormSubmit = useCallback(
    (text: string) => {
      if (!pendingPin) return;
      onPlacePin(pendingPin.x, pendingPin.y, text);
      setPendingPin(null);
    },
    [pendingPin, onPlacePin],
  );

  const handleFormCancel = useCallback(() => {
    setPendingPin(null);
  }, []);

  // ---- Filter pins ----
  const visiblePins = showResolved
    ? pins
    : pins.filter((p) => p.status === 'open');

  return (
    <>
      {/* Inject keyframes locally */}
      <style>{`
        @keyframes voFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div
        ref={containerRef}
        onClick={handleClick}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 'var(--z-drawer)' as unknown as number,
          // Switch to default when the creation form is open (no double-click confusion)
          cursor: active ? (pendingPin ? 'default' : 'crosshair') : 'default',
          // Transparent — only intercepts clicks when active
          pointerEvents: active ? 'auto' : 'none',
          animation: active ? 'voFadeIn 200ms var(--ease-out) both' : undefined,
        }}
      >
        {/* Hint banner when active with no pins */}
        {active && visiblePins.length === 0 && (
          <div
            style={{
              position: 'absolute',
              top: 'var(--space-3)',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: 'var(--space-1) var(--space-3)',
              background: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--shadow-sm)',
              fontSize: 12,
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              animation: 'voFadeIn 200ms var(--ease-out) both',
            }}
          >
            {enAU.review.clickToPin}
          </div>
        )}

        {/* Pin markers */}
        {visiblePins.map((pin) => (
          <div
            key={pin.id}
            data-pin-marker
            style={{
              position: 'absolute',
              left: `${pin.xPercent}%`,
              top: `${pin.yPercent}%`,
              // Offset so the dot center aligns with the placed point
              transform: 'translate(-50%, -50%)',
              // Always interactive, even when overlay is inactive
              pointerEvents: 'auto',
            }}
          >
            <PinMarker
              pin={pin}
              onClick={() => onPinClick(pin.id)}
              isResolved={pin.status === 'resolved'}
            />
          </div>
        ))}

        {/* Pin creation form — appears at the click location */}
        {pendingPin && (
          <PinCreationForm
            xPercent={pendingPin.x}
            yPercent={pendingPin.y}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </>
  );
}

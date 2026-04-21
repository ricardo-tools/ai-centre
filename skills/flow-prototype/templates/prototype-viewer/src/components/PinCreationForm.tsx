'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PushPin } from '@phosphor-icons/react';
import { enAU } from '../i18n/en-AU';

// ------------------------------------------------------------
// Props
// ------------------------------------------------------------

export interface PinCreationFormProps {
  /** Position in % of parent container where the pin will be placed */
  xPercent: number;
  yPercent: number;
  /** Called when user submits the form */
  onSubmit: (text: string) => void;
  /** Called when user cancels or clicks outside */
  onCancel: () => void;
}

// ------------------------------------------------------------
// Smart positioning
// ------------------------------------------------------------

/** How wide the form is (px) */
const FORM_WIDTH = 280;
/** Estimated max height (px) — used for bottom-edge check */
const FORM_HEIGHT = 170;
/** Gap between click point and the form edge (px) */
const OFFSET = 12;

interface FormPosition {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  /** Which side the arrow caret should appear on */
  caretSide: 'top' | 'bottom';
}

function computePosition(
  xPercent: number,
  yPercent: number,
  containerW: number,
  containerH: number,
): FormPosition {
  const clickX = (xPercent / 100) * containerW;
  const clickY = (yPercent / 100) * containerH;

  const nearRight = clickX + OFFSET + FORM_WIDTH > containerW;
  const nearBottom = clickY + OFFSET + FORM_HEIGHT > containerH;

  const pos: FormPosition = { caretSide: nearBottom ? 'bottom' : 'top' };

  // Horizontal
  if (nearRight) {
    pos.right = `${containerW - clickX + OFFSET}px`;
  } else {
    pos.left = `${clickX + OFFSET}px`;
  }

  // Vertical
  if (nearBottom) {
    pos.bottom = `${containerH - clickY + OFFSET}px`;
  } else {
    pos.top = `${clickY + OFFSET}px`;
  }

  return pos;
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------

export default function PinCreationForm({
  xPercent,
  yPercent,
  onSubmit,
  onCancel,
}: PinCreationFormProps) {
  const [text, setText] = useState('');
  const [position, setPosition] = useState<FormPosition>({ caretSide: 'top' });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Compute position relative to parent on mount
  useEffect(() => {
    const parent = formRef.current?.parentElement;
    if (!parent) return;
    const { width, height } = parent.getBoundingClientRect();
    setPosition(computePosition(xPercent, yPercent, width, height));
  }, [xPercent, yPercent]);

  // Autofocus textarea
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // ESC to cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  // Click-outside to cancel
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        onCancel();
      }
    };
    // Use capture so we see clicks before stopPropagation
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () =>
      document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [onCancel]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;
      onSubmit(trimmed);
    },
    [text, onSubmit],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Cmd/Ctrl+Enter submits
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        const trimmed = text.trim();
        if (trimmed) onSubmit(trimmed);
      }
    },
    [text, onSubmit],
  );

  const isValid = text.trim().length > 0;

  // ---- Caret arrow styles ----
  const caretStyle: React.CSSProperties =
    position.caretSide === 'top'
      ? {
          // Arrow pointing up (▼ visually means the form is below the click)
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: `6px solid var(--color-border)`,
          top: -7,
          left: 16,
        }
      : {
          // Arrow pointing down (form is above the click)
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid var(--color-border)`,
          bottom: -7,
          left: 16,
        };

  const caretInnerStyle: React.CSSProperties =
    position.caretSide === 'top'
      ? {
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderBottom: `5px solid var(--color-surface)`,
          top: -5,
          left: -5,
        }
      : {
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `5px solid var(--color-surface)`,
          bottom: -5,
          left: -5,
        };

  return (
    <>
      <style>{`
        @keyframes voScaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div
        ref={formRef}
        // Stop clicks inside the form from bubbling to the overlay
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          left: position.left,
          right: position.right,
          top: position.top,
          bottom: position.bottom,
          width: FORM_WIDTH,
          zIndex: `calc(var(--z-drawer) + 10)` as unknown as number,
          animation: 'voScaleIn 150ms var(--ease-out) both',
          transformOrigin: 'top left',
        }}
      >
        {/* Caret arrow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            ...caretStyle,
          }}
        >
          {/* Inner caret (fills with surface color to hide border beneath) */}
          <div
            style={{
              position: 'absolute',
              width: 0,
              height: 0,
              ...caretInnerStyle,
            }}
          />
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}
          >
            <PushPin
              size={16}
              weight="fill"
              style={{ color: 'var(--color-primary)', flexShrink: 0 }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--color-text-heading)',
              }}
            >
              {enAU.review.addFeedback}
            </span>
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={enAU.review.pinPlaceholder}
            rows={3}
            style={{
              width: '100%',
              resize: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 400,
              lineHeight: 1.5,
              color: 'var(--color-text-body)',
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-2)',
              outline: 'none',
              transition: 'border-color 120ms ease',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
          />

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-2)',
            }}
          >
            <button
              type="button"
              onClick={onCancel}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                background: 'transparent',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '5px var(--space-3)',
                cursor: 'pointer',
                transition: 'border-color 120ms ease, color 120ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-text-muted)';
                e.currentTarget.style.color = 'var(--color-text-body)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              {enAU.review.pinCancel}
            </button>

            <button
              type="submit"
              disabled={!isValid}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: '#FFFFFF',
                background: isValid
                  ? 'var(--color-primary)'
                  : 'var(--color-border)',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '5px var(--space-3)',
                cursor: isValid ? 'pointer' : 'not-allowed',
                transition: 'background 120ms ease',
              }}
              onMouseEnter={(e) => {
                if (isValid)
                  e.currentTarget.style.background =
                    'var(--color-primary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isValid
                  ? 'var(--color-primary)'
                  : 'var(--color-border)';
              }}
            >
              {enAU.review.pinPost}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
